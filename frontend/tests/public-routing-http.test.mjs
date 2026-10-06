import assert from "node:assert/strict"
import http from "node:http"
import test, { before } from "node:test"
import { assertHttpTestRuntime, httpTestConfig } from "./http-test-config.mjs"

const config = httpTestConfig()
const { port, base, protocol, authority, origin, normalizationPort } = config
before(() => assertHttpTestRuntime(config))
const shops = { "demo-esquina": "Barbearia da Esquina", "demo-navalha": "Navalha &amp; Pente", "demo-vila": "Barbearia Vila Nova", "demo-oficina": "Oficina do Corte", "demo-raizes": "Raízes Barbearia", "demo-bairro": "Barbearia do Bairro" }

function request(host, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: "127.0.0.1", port, path, headers: { ...headers, host } }, res => {
      let body = ""
      res.setEncoding("utf8")
      res.on("data", data => { body += data })
      res.on("end", () => resolve({ status: res.statusCode, location: res.headers.location, body }))
    })
    req.setTimeout(15000, () => req.destroy(new Error("Request timed out")))
    req.on("error", reject)
  })
}

function heading(body) {
  return body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, "").trim()
}

function assertProfileIdentity(body, name) {
  assert.equal(body.match(/<title>([\s\S]*?)<\/title>/)?.[1], `${name} | BarberHub`)
  // A loading/not-found boundary may deliver the final view through the RSC
  // stream instead of HTML. Browser checks verify the hydrated heading too.
  const renderedHeading = heading(body)
  if (renderedHeading !== undefined) assert.equal(renderedHeading, name)
}

function publicHeader(body) {
  const header = body.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1]
  assert.notEqual(header, undefined, "The public header must be rendered")
  return header
}

function assertCompactHeader(body) {
  const header = publicHeader(body)
  assert(!header.includes('aria-label="Navegação principal"'), "Institutional navigation belongs only to the platform landing")
  assert(!header.includes('id="public-navigation"'), "The institutional drawer must not appear on a profile or catalog")
  const accessLinks = [...header.matchAll(/href="([^"]+)"/g)].map(match => new URL(match[1].replaceAll("&amp;", "&"), origin))
  for (const route of ["/login", "/cadastro"]) assert(accessLinks.some(url => url.origin === origin && url.pathname === route), `Acesso ${route} no domínio principal`)
}

test("platform landing and catalog render without redirects", async () => {
  const landing = await request(authority, "/")
  assert.equal(landing.status, 200)
  assert.match(landing.body, /Organize sua barbearia/)
  assert(publicHeader(landing.body).includes('aria-label="Navegação principal"'))
  const catalog = await request(authority, "/barbearias")
  assert.equal(catalog.status, 200)
  assert.equal(catalog.location, undefined)
  assertCompactHeader(catalog.body)
  for (const slug of Object.keys(shops)) assert(catalog.body.includes(`href="${protocol}//${slug}.${authority}/"`))
})

for (const [slug, name] of Object.entries(shops)) test(`profile ${slug} and platform return links`, async () => {
  const profile = await request(`${slug}.${authority}`, "/?tenant=demo-vila")
  assert.equal(profile.status, 200)
  assert.equal(profile.location, undefined, "The canonical profile must render without a redirect loop")
  assertProfileIdentity(profile.body, name)
  assertCompactHeader(profile.body)
  assert(profile.body.includes(`href="${origin}/barbearias"`))
  assert(profile.body.includes(`href="${origin}/#produto"`))
  const alias = await request(authority, `/barbearias/${slug}`)
  assert.equal(alias.status, 307)
  assert.equal(alias.location, `${protocol}//${slug}.${authority}/`)
  assert(!alias.body.includes(name))
})

test("profile paths on platform and tenant hosts redirect to the correct tenant, retaining the query", async () => {
  for (const host of [authority, `demo-esquina.${authority}`]) for (const slug of ["demo-esquina", "demo-vila"]) {
    const result = await request(host, `/barbearias/${slug}?tag=a&tag=b&estado=error`)
    assert.equal(result.status, 307)
    assert.equal(result.location, `${protocol}//${slug}.${authority}/?tag=a&tag=b&estado=error`)
  }
})

test("external hosts and IPs cannot render profiles or offer path-based profile links", async () => {
  for (const host of [`127.0.0.1:${port}`, `external.test:${port}`, `a.b.${authority}`]) {
    const profile = await request(host, "/barbearias/demo-esquina")
    assert.equal(profile.location, undefined, host)
    assertProfileIdentity(profile.body, "Barbearia não encontrada")
    for (const name of Object.values(shops)) assert(!profile.body.includes(name), host)
    const catalog = await request(host, "/barbearias")
    assert(!catalog.body.includes('href="/barbearias/demo-'), host)
  }
})

test("encoded profile paths retain repeated and encoded parameters", async () => {
  const query = "?q=Rio%20de%20Janeiro&tag=a&tag=b&returnTo=%2Fbarbearias%3Fq%3DMeier"
  for (const host of [authority, `demo-vila.${authority}`]) {
    const result = await request(host, `/barbearias/%64emo-esquina${query}`)
    assert.equal(result.status, 307)
    const destination = new URL(result.location)
    assert.equal(destination.origin, `${protocol}//demo-esquina.${authority}`)
    assert.equal(destination.pathname, "/")
    // Next can normalize %20 to +; values, ordering and repetition must survive.
    assert.deepEqual([...destination.searchParams], [...new URL(`${origin}/${query}`).searchParams])
  }
})

test("forwarded headers never change profile identity or generated public origins", async () => {
  const forwarded = {
    "x-forwarded-host": "demo-vila.evil.test:4444",
    "x-forwarded-proto": protocol === "http:" ? "https" : "http",
  }
  const profile = await request(`demo-esquina.${authority}`, "/?tenant=demo-vila", forwarded)
  assertProfileIdentity(profile.body, shops["demo-esquina"])
  assert(profile.body.includes(`href="${origin}/barbearias"`))
  assert(profile.body.includes(`href="${origin}/#produto"`))
  const alias = await request(authority, "/barbearias/demo-esquina?tag=a&tag=b", forwarded)
  assert.equal(alias.status, 307)
  assert.equal(alias.location, `${protocol}//demo-esquina.${authority}/?tag=a&tag=b`)
})

test("catalog redirect preserves repeated and encoded filters", async () => {
  const query = "?q=Esquina&cidade=Rio+de+Janeiro&tag=a&tag=b"
  const result = await request(`demo-esquina.${authority}`, `/barbearias${query}`)
  // App Router can send its redirect in the streamed HTML after the loading shell.
  assert(result.location === `${origin}/barbearias${query}` || result.body.includes(`${origin}/barbearias?q=Esquina&amp;cidade=Rio+de+Janeiro&amp;tag=a&amp;tag=b`))
})

test("case and trailing-dot normalization preserve the tenant", async () => {
  assert((await request(`DEMO-ESQUINA.${authority.toUpperCase()}`, "/")).body.includes("Barbearia da Esquina"))
  const normalized = await request(`demo-esquina.${base}.:${normalizationPort}`, "/?x=1")
  assert.equal(normalized.status, 307)
  assert.equal(normalized.location, `${protocol}//demo-esquina.${authority}/?x=1`)
})

test("external hosts and forwarded headers cannot select a tenant", async () => {
  for (const host of [`127.0.0.1:${port}`, `external.test:${port}`, `demo-esquina.${base}.evil.test:${port}`, `a.b.${authority}`]) {
    const result = await request(host, "/", { "x-forwarded-host": `demo-esquina.${authority}` })
    assert.equal(result.status, 200)
    assert.match(result.body, /Organize sua barbearia/)
  }
  const result = await request(authority, "/", { "x-forwarded-host": `demo-esquina.${authority}` })
  assert.match(result.body, /Organize sua barbearia/)
})

test("unknown tenant and unknown path expose no other shop", async () => {
  const missing = await request(`demo-inexistente.${authority}`, "/")
  assertProfileIdentity(missing.body, "Barbearia não encontrada")
  for (const name of Object.values(shops)) assert(!missing.body.includes(name), name)
  assert.equal((await request(`demo-esquina.${authority}`, "/nao-existe")).status, 404)
})
