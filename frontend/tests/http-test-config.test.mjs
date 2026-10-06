import assert from "node:assert/strict"
import test from "node:test"
import http from "node:http"
import { httpTestConfig, httpTestRequest } from "./http-test-config.mjs"

test("desenvolvimento preserva a porta nos hosts e links públicos", () => {
  const config = httpTestConfig({ TEST_PORT: "3000" }, [])
  assert.equal(config.origin, "http://localhost:3000")
  assert.equal(config.authority, "localhost:3000")
})

test("produção separa a conexão local da origem pública HTTPS", () => {
  const config = httpTestConfig({ TEST_ENV: "production", TEST_PORT: "3110", TEST_PUBLIC_HOST: "barberhub.test" }, [])
  assert.equal(config.connectionOrigin, "http://127.0.0.1:3110")
  assert.equal(config.origin, "https://barberhub.test")
  assert.equal(config.authority, "barberhub.test")
  assert.equal(config.normalizationPort, 443)
})

test("configuração ambígua ou inválida falha explicitamente", () => {
  for (const env of [{ TEST_ENV: "preview" }, { TEST_PORT: "NaN" }, { TEST_PORT: "0" },
    { TEST_PUBLIC_HOST: "localhost:3110" }, { TEST_ENV: "production", TEST_PROTOCOL: "http:" }]) {
    assert.throws(() => httpTestConfig(env, []))
  }
  assert.throws(() => httpTestConfig({}, ["3110"]), /TEST_PORT/)
})

test("transporte envia o Host simulado sem seguir redirects", async () => {
  const server = http.createServer((req, res) => {
    res.writeHead(307, { location: "https://barberhub.test/destino" })
    res.end(req.headers.host)
  })
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve))
  try {
    const config = httpTestConfig({ TEST_ENV: "production", TEST_PORT: String(server.address().port), TEST_PUBLIC_HOST: "barberhub.test" }, [])
    const response = await httpTestRequest(config, "/")
    assert.equal(response.status, 307)
    assert.equal(response.body, "barberhub.test")
    assert.equal(response.headers.location, "https://barberhub.test/destino")
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
})
