import test from 'node:test'
import assert from 'node:assert/strict'
import { httpTestConfig, httpTestRequest, assertHttpTestRuntime } from './http-test-config.mjs'

const c = httpTestConfig()
await assertHttpTestRuntime(c)
test('ajuda SSR: metadados próprios, semântica e destinos existentes sem IDs efêmeros', async () => {
  const r = await httpTestRequest(c, '/super-admin/ajuda')
  assert.equal(r.status, 200)
  assert.match(r.body, /<title>Ajuda do superadmin/)
  assert.match(r.body, /name="robots" content="noindex, nofollow"/)
  assert.equal((r.body.match(/<main[ >]/g) || []).length, 1)
  // App Router pode enviar o conteúdo em chunks fora do main inicial.
  // Conta o FAQ, sem incluir o details da conta presente no header.
  assert.equal((r.body.match(/<details class="group py-1">/g) || []).length, 13)
  assert.match(r.body, /Dados fictícios em memória/)
  assert.match(r.body, /Nenhum dado será transferido ao proprietário/)
  assert.doesNotMatch(r.body, /href="[^"]*manual-/)
  for (const href of ['/super-admin', '/super-admin/barbearias', '/onboarding/barbearia?origem=superadmin']) {
    assert(r.body.includes(`href="${href}"`))
    assert.equal((await httpTestRequest(c, href)).status, 200)
  }
  assert.doesNotMatch(r.body, /href="\/super-admin\/planos/)
})
