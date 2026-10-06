import assert from "node:assert/strict"
import http from "node:http"

export function httpTestConfig(env = process.env, args = process.argv.slice(2)) {
  assert.equal(args.length, 0, "Use TEST_PORT, TEST_PUBLIC_HOST e TEST_ENV; argumentos posicionais não configuram esta suíte")
  const environment = env.TEST_ENV ?? "development"
  assert(["development", "production"].includes(environment), "TEST_ENV deve ser development ou production")
  const port = Number(env.TEST_PORT ?? 3000)
  assert(Number.isInteger(port) && port > 0 && port <= 65535, "TEST_PORT deve ser uma porta válida")
  const base = env.TEST_PUBLIC_HOST ?? "localhost"
  assert(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/i.test(base), "TEST_PUBLIC_HOST deve conter apenas o hostname, sem protocolo ou porta")
  const protocol = environment === "production" ? "https:" : "http:"
  assert(!env.TEST_PROTOCOL || env.TEST_PROTOCOL === protocol, `TEST_PROTOCOL incompatível com TEST_ENV=${environment}`)
  const authority = environment === "production" ? base : `${base}:${port}`
  return { environment, port, base, protocol, authority, origin: `${protocol}//${authority}`,
    connectionOrigin: `http://127.0.0.1:${port}`, normalizationPort: environment === "production" ? 443 : port }
}

export function httpTestRequest(config, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: "127.0.0.1", port: config.port, path,
      headers: { host: config.authority, ...headers } }, response => {
      let body = ""
      response.setEncoding("utf8")
      response.on("data", chunk => { body += chunk })
      response.on("error", reject)
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body }))
    })
    req.setTimeout(30000, () => req.destroy(new Error("HTTP test request timed out")))
    req.on("error", reject)
  })
}

export async function assertHttpTestRuntime(config) {
  console.log(`HTTP: TEST_ENV=${config.environment}; conexão=${config.connectionOrigin}; Host=${config.authority}; origem pública=${config.origin}`)
  // Nesta entrega, o worker só é servido em produção com mocks desabilitados.
  // O probe impede validar desenvolvimento como se fosse o build de produção.
  const response = await httpTestRequest(config, "/pwa-worker.js")
  const expectedStatus = config.environment === "production" ? 200 : 404
  assert.equal(response.status, expectedStatus,
    `Servidor incompatível com TEST_ENV=${config.environment}: /pwa-worker.js deveria retornar ${expectedStatus}; confira porta, build, BARBERHUB_PUBLIC_HOST e mocks desabilitados`)
  if (config.environment === "production") {
    assert.match(response.headers["content-type"] ?? "", /javascript/)
    assert.match(response.body, /addEventListener/)
  }
}
