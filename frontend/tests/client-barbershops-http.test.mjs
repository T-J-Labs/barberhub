import test from 'node:test'
import assert from 'node:assert/strict'
import { httpTestConfig, httpTestRequest, assertHttpTestRuntime } from './http-test-config.mjs'

const c = httpTestConfig()
await assertHttpTestRuntime(c)
test('vínculos fictícios e destinos canônicos', async () => {
  const response = await httpTestRequest(c, '/cliente/barbearias')
  assert.equal(response.status, 200)
  for (const text of ['Minhas barbearias', 'Dados fictícios', 'primeiro agendamento real confirmado', 'Barbearia da Esquina', 'Navalha &amp; Pente', 'Madureira', 'Méier', 'noindex']) assert(response.body.includes(text), text)
  for (const id of ['demo-esquina', 'demo-navalha']) {
    const origin = c.origin.replace('://', `://${id}.`)
    assert(response.body.includes(`href="${origin}/"`))
    assert(response.body.includes(`href="${origin}/agendar"`))
    assert(response.body.includes(`href="/cliente/agendamentos?barbearia=${id}"`))
  }
  if (c.environment === 'production') assert.doesNotMatch(response.body, /Cenários de demonstração \(desenvolvimento\)/)
})
test('SSR do filtro combinado e valores inválidos sem outra seleção', async () => {
  const response = await httpTestRequest(c, '/cliente/agendamentos?barbearia=demo-navalha&q=classico')
  assert.match(response.body, /Barbearia selecionada/)
  assert.match(response.body, /Corte clássico/)
  for (const query of ['barbearia=desconhecida', 'barbearia=demo-esquina&barbearia=demo-navalha', 'barbearia=demo-esquina&barbearia=demo-esquina']) {
    const invalid = await httpTestRequest(c, `/cliente/agendamentos?${query}`)
    assert.match(invalid.body, /Nenhuma barbearia foi selecionada/)
    assert.doesNotMatch(invalid.body, /Barbearia selecionada:/)
  }
})
test('hosts conhecidos preservam query; externos e desconhecidos não expõem exemplos', async () => {
  for (const route of ['/cliente/barbearias', '/cliente/agendamentos']) {
    for (const id of ['demo-esquina', 'demo-navalha']) {
      const response = await httpTestRequest(c, `${route}?barbearia=demo-navalha&q=Bruno`, { host: `${id}.${c.authority}` })
      assert.equal(response.status, 307)
      assert.equal(response.headers.location, `${c.origin}${route}?barbearia=demo-navalha&q=Bruno`)
      const repeated = await httpTestRequest(c, `${route}?barbearia=demo-esquina&barbearia=demo-navalha&q=M%C3%A9ier`, { host: `${id}.${c.authority}`, 'x-barberhub-client-search': '?barbearia=demo-vila' })
      assert.equal(repeated.status, 307)
      assert.equal(repeated.headers.location, `${c.origin}${route}?barbearia=demo-esquina&barbearia=demo-navalha&q=M%C3%A9ier`)
    }
    for (const host of ['externo.test', `desconhecida.${c.authority}`, `a.b.${c.authority}`]) {
      const response = await httpTestRequest(c, `${route}?barbearia=demo-esquina`, { host, 'x-forwarded-host': c.authority })
      assert.equal(response.status, 200)
      assert.match(response.body, /Demonstração indisponível neste domínio/)
      assert.doesNotMatch(response.body, /Barbearia da Esquina/)
    }
  }
})
