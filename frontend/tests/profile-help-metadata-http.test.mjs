import assert from "node:assert/strict"
import test, { before } from "node:test"
import { assertHttpTestRuntime, httpTestConfig, httpTestRequest } from "./http-test-config.mjs"

const config = httpTestConfig()
before(() => assertHttpTestRuntime(config))

for (const role of ["cliente", "barbeiro"]) {
  for (const [page, label] of [["perfil", "Perfil"], ["ajuda", "Ajuda"]]) {
    test(`${role}/${page}: título específico e noindex`, async () => {
      const response = await httpTestRequest(config, `/${role}/${page}`, { "user-agent": "Googlebot" })
      assert.equal(response.status, 200)
      const html = response.body
      const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map(match => match[1])
      assert.deepEqual(titles, [`${label} do ${role} — demonstração | BarberHub`])
      const robots = html.match(/<meta name="robots" content="([^"]+)"/)
      assert.ok(robots, "A página deve declarar sua política de indexação")
      assert.equal(robots[1], "noindex, nofollow")
    })
  }
}
