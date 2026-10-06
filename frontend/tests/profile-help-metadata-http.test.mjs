import assert from "node:assert/strict"
import test from "node:test"

const origin = `http://127.0.0.1:${process.env.TEST_PORT ?? 3000}`
const host = `${process.env.TEST_PUBLIC_HOST ?? "localhost"}:${process.env.TEST_PORT ?? 3000}`

for (const role of ["cliente", "barbeiro"]) {
  for (const [page, label] of [["perfil", "Perfil"], ["ajuda", "Ajuda"]]) {
    test(`${role}/${page}: título específico e noindex`, async () => {
      const response = await fetch(`${origin}/${role}/${page}`, {
        headers: { host, "user-agent": "Googlebot" },
        signal: AbortSignal.timeout(30000),
      })
      assert.equal(response.status, 200)
      const html = await response.text()
      const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map(match => match[1])
      assert.deepEqual(titles, [`${label} do ${role} — demonstração | BarberHub`])
      const robots = html.match(/<meta name="robots" content="([^"]+)"/)
      assert.ok(robots, "A página deve declarar sua política de indexação")
      assert.equal(robots[1], "noindex, nofollow")
    })
  }
}
