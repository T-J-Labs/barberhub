import test from 'node:test'
import assert from 'node:assert/strict'
import { httpTestConfig, httpTestRequest, assertHttpTestRuntime } from './http-test-config.mjs'
const c = httpTestConfig()
await assertHttpTestRuntime(c)
test('introdução direta, origens válidas e nenhuma origem implícita em parâmetros inválidos', async () => {
  for (const query of ['', '?origem=cadastro', '?origem=superadmin', '?origem=externa', '?origem=cadastro&origem=superadmin']) {
    const r = await httpTestRequest(c, '/onboarding/barbearia' + query)
    assert.equal(r.status, 200); assert.match(r.body, /Prepare uma barbearia de exemplo/); assert.match(r.body, /noindex/)
    assert.match(r.body, /descartados ao sair ou recarregar/)
    if (query === '?origem=superadmin') assert.match(r.body, /Marina Exemplo/)
    if (['', '?origem=externa', '?origem=cadastro&origem=superadmin'].includes(query)) assert.doesNotMatch(r.body, /Origem escolhida:/)
  }
})
test('cadastro Barbearia tem ação separada; outros perfis/login continuam iguais', async () => {
  assert.match((await httpTestRequest(c, '/cadastro?perfil=barbearia')).body, /href="\/onboarding\/barbearia\?origem=cadastro"/)
  for (const route of ['/cadastro?perfil=cliente', '/cadastro?perfil=barbeiro', '/login?perfil=barbearia']) assert.doesNotMatch((await httpTestRequest(c, route)).body, /Experimentar configuração/)
})
test('domínio principal: redirecionamento seguro e Host externo sem wizard', async () => {
  const r = await httpTestRequest(c, '/onboarding/barbearia?origem=superadmin&returnTo=https://externo.test', { host: `demo-esquina.${c.authority}` })
  assert.equal(r.status, 307); assert.equal(r.headers.location, `${c.origin}/onboarding/barbearia?origem=superadmin`)
  for (const host of ['externo.test', `a.b.${c.authority}`]) {
    const invalid = await httpTestRequest(c, '/onboarding/barbearia', { host, 'x-forwarded-host': c.authority })
    assert.match(invalid.body, /Demonstração indisponível neste domínio/); assert.doesNotMatch(invalid.body, /Prepare uma barbearia de exemplo/)
  }
})
test('três destinos existentes exibem aviso na chegada sem mudar seus CRUDs', async () => {
  for (const route of ['/admin/configuracoes', '/admin/servicos', '/admin/barbeiros']) {
    const r = await httpTestRequest(c, route + '?origem=onboarding-demo'); assert.equal(r.status, 200)
    assert.match(r.body, /dados independentes do onboarding/)
    assert.doesNotMatch((await httpTestRequest(c, route)).body, /configuração do ensaio foi descartada/)
  }
})
