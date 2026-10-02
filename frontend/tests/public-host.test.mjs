import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import ts from "typescript"

// Use the project's TypeScript compiler; no additional test runtime is required.
const source = await readFile(new URL("../src/features/public-barbershop/routing.ts", import.meta.url), "utf8")
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
const { publicHostContext, publicBarbershopOrigin, publicBarbershopHref } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`)

test("trusted hosts normalize case, DNS trailing dot and default ports", () => {
  for (const host of ["demo-esquina.localhost:3000", "DEMO-ESQUINA.LOCALHOST:3000", "demo-esquina.localhost.:3000"]) {
    assert.deepEqual(publicHostContext(host, "localhost", "http:"), {
      origin: "http://localhost:3000", canonicalHost: "demo-esquina.localhost:3000", subdomain: "demo-esquina",
    })
  }
  assert.equal(publicBarbershopOrigin("demo-esquina.localhost:80", "localhost", "http:"), "http://localhost")
  assert.equal(publicBarbershopOrigin("demo-esquina.barberhub.test:443", "barberhub.test", "https:"), "https://barberhub.test")
})

test("external and malformed hosts never supply a public origin", () => {
  for (const host of [null, "external.test", "localhost.evil.test", "evillocalhost", "a.b.localhost", "-a.localhost", "a-.localhost", "localhost..", "localhost:70000", "user@localhost", "localhost/path", "localhost?x=1", "localhost#x", "localhost:3000,evil.test", "127.0.0.1:3000", "[::1]:3000"]) {
    assert.equal(publicHostContext(host, "localhost", "http:"), undefined, String(host))
  }
  assert.equal(publicHostContext("demo-esquina.localhost", undefined, "https:"), undefined)
})

test("links retain nonstandard ports and use the configured production domain", () => {
  assert.equal(publicBarbershopHref("demo-vila", publicBarbershopOrigin("demo-esquina.localhost:3101", "localhost", "http:")), "http://demo-vila.localhost:3101/")
  assert.equal(publicBarbershopHref("demo-vila", publicBarbershopOrigin("demo-esquina.barberhub.test", "barberhub.test", "https:")), "https://demo-vila.barberhub.test/")
  assert.throws(() => publicBarbershopHref("demo-vila"))
  for (const value of ["../x", "x/y", "x.evil", "", "-x", "x-", "x".repeat(64)]) assert.throws(() => publicBarbershopHref(value, "http://localhost:3000"))
})
