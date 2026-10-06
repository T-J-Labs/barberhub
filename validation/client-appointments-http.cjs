const http = require('node:http');
const assert = require('node:assert/strict');
const qa = require('./qa-http.cjs');
const { port, base } = qa.config;
const productionHost = qa.config.environment === 'production' ? base : undefined;
function request(host, path = '/cliente/agendamentos', extra = {}) { return qa.request(path, { host, ...extra }); }
(async () => {
  await qa.probe();
  const host = qa.config.authority;
  const origin = productionHost ? `https://${productionHost}` : `http://${host}`;
  const normal = await request(host);
  assert.equal(normal.status, 200);
  for (const label of ['Meus agendamentos', 'Próximas reservas', 'Histórico', 'Barbearia da Esquina', 'Navalha &amp; Pente', 'Demonstração local', 'sem conta autenticada', 'Profissional não informado']) assert(normal.body.includes(label), label);
  assert.match(normal.body, /noindex/);
  if (productionHost) assert.doesNotMatch(normal.body, /Cenários de demonstração \(desenvolvimento\)/);
  const manipulated = await request(host, '/cliente/agendamentos?client_id=outro&tenant_id=outro&cenario=error');
  assert.equal(manipulated.status, 200); assert.match(manipulated.body, /Próximas reservas/);
  for (const shop of ['demo-esquina', 'demo-navalha']) {
    const tenant = await request(`${shop}.${host}`);
    assert.equal(tenant.status, 307); assert.equal(tenant.headers.location, `${origin}/cliente/agendamentos`);
  }
  const unknown = await request('externo.test', undefined, { 'x-forwarded-host': host });
  assert.equal(unknown.status, 200); assert.match(unknown.body, /Demonstração indisponível neste domínio/);
  assert.doesNotMatch(unknown.body, /Barbearia da Esquina/);
  console.log('PASS SSR, avisos, barbearias, opcionais, query ignorada, 2 redirecionamentos e host externo/forwarded. Não testa autorização real.');
})().catch(error => { console.error(error); process.exitCode = 1; });
