// Smoke das páginas públicas de agendamento, sem DNS ou reserva real.
const http = require('node:http');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const qa = require('./qa-http.cjs');
const { port, base, origin, authority: host } = qa.config;
const production = qa.config.environment === 'production';
const shopOrigin = origin.replace('://', '://demo-esquina.');
const shopHost = production ? 'demo-esquina.' + base : 'demo-esquina.' + base + ':' + port;
const results = [];
function request(path, hostname = host, extra = {}) { return qa.request(path, { host: hostname, ...extra }); }
function links(body) { return [...body.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1].replaceAll('&amp;', '&')); }
async function check(name, path, hostname, verify, extra) {
  verify(await request(path, hostname, extra));
  results.push({ name, pass: true });
  console.log('PASS', name);
}
function demo(response) {
  assert.equal(response.status, 200);
  assert.match(response.body, /AGENDAMENTO DEMONSTRATIVO/);
  assert.match(response.body, /Experimentar demonstração/);
  assert.match(response.body, /Não representam disponibilidade real/);
  assert.match(response.body, /noindex/);
  assert.doesNotMatch(response.body, /Reserva confirmada|Agendamento confirmado/);
}
function authContext(response, shop, tenantOrigin) {
  const authLinks = links(response.body).map((href) => new URL(href, origin)).filter((url) => ['/login', '/cadastro'].includes(url.pathname));
  assert(authLinks.length >= 2);
  authLinks.forEach((url) => {
    assert.equal(url.origin, origin);
    assert.equal(url.searchParams.get('barbearia'), shop);
    assert.equal(url.searchParams.get('returnTo'), `${tenantOrigin}/`);
  });
}
(async () => {
  await qa.probe();
  await check('perfil: Agendar horário abre a introdução demonstrativa', '/', shopHost, (r) => {
    assert.equal(r.status, 200);
    assert.match(r.body, /Agendar horário/);
    assert(links(r.body).includes(`${shopOrigin}/agendar`));
    const bookingAction = [...r.body.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].find((m) => m[2].includes('Agendar horário'));
    assert.equal(bookingAction?.[1], `${shopOrigin}/agendar`);
    authContext(r, 'demo-esquina', shopOrigin);
  });
  await check('agendamento no subdomínio: contexto da conta preservado', '/agendar', shopHost, (r) => { demo(r); authContext(r, 'demo-esquina', shopOrigin); assert(links(r.body).includes(`${shopOrigin}/`)); });
  await check('query de tenant_id e retorno externo não mudam barbearia', '/agendar?tenant_id=outro&barbearia=demo-navalha&returnTo=https://externo.test/', shopHost, (r) => { demo(r); authContext(r, 'demo-esquina', shopOrigin); assert.match(r.body, /Barbearia da Esquina/); });
  for (const path of ['/barbearias/demo-esquina/agendar', '/barbearias/demo-esquina/agendar?tenant_id=outro']) {
    await check(`caminho explícito redireciona: ${path}`, path, host, (r) => { assert.equal(r.status, 307); assert.equal(r.headers.location, `${shopOrigin}/agendar${path.includes('?') ? path.slice(path.indexOf('?')) : ''}`); });
  }
  await check('caminho explícito em outro subdomínio usa a chave do caminho', '/barbearias/demo-esquina/agendar', production ? `demo-navalha.${base}` : `demo-navalha.${base}:${port}`, (r) => { assert.equal(r.status, 307); assert.equal(r.headers.location, `${shopOrigin}/agendar`); });
  for (const path of ['/agendar', '/agendar?tenant_id=demo-esquina', '/agendar?barbearia=demo-esquina']) {
    await check(`plataforma sem contexto não aceita query: ${path}`, path, host, (r) => { assert.equal(r.status, 200); assert.match(r.body, /Escolha uma barbearia para começar/); assert.doesNotMatch(r.body, /Explorar sem autenticação/); });
  }
  for (const [path, hostname] of [
    ['/agendar', production ? `nao-existe.${base}` : `nao-existe.${base}:${port}`],
    ['/barbearias/nao-existe/agendar', host],
    ['/barbearias/chave_invalida/agendar', host],
    ['/barbearias/demo-esquina/agendar', 'externo.test'],
    ['/agendar', 'externo.test'],
  ]) {
    await check(`contexto desconhecido/inválido seguro: ${hostname}${path}`, path, hostname, (r) => { assert.match(r.body, /Escolha uma barbearia para começar/); assert.doesNotMatch(r.body, /Explorar sem autenticação/); assert(!r.headers.location); });
  }
  await check('X-Forwarded-Host não escolhe barbearia', '/agendar', host, (r) => { assert.match(r.body, /Escolha uma barbearia para começar/); }, { 'x-forwarded-host': shopHost });
  await check('outro estabelecimento mantém sua identidade', '/agendar', production ? `demo-navalha.${base}` : `demo-navalha.${base}:${port}`, (r) => { demo(r); assert.match(r.body, /Navalha/); authContext(r, 'demo-navalha', origin.replace('://', '://demo-navalha.')); });
  await check('perfil da Navalha apresenta seus próprios exemplos', '/', production ? `demo-navalha.${base}` : `demo-navalha.${base}:${port}`, (r) => {
    assert.match(r.body, /Corte clássico/);
    assert.match(r.body, /Barba na navalha/);
    assert.match(r.body, /Bruno/);
    assert.match(r.body, /Lucas/);
    assert(links(r.body).includes(`${origin.replace('://', '://demo-navalha.')}/agendar`));
  });
  for (const path of ['/agendamento', '/agendamento?tenant_id=outro', '/barbearias/demo-esquina/agendamento']) {
    await check(`alias antigo usa rota canônica: ${path}`, path, shopHost, (r) => { assert.equal(r.status, 307); assert.equal(r.headers.location, `${shopOrigin}/agendar${path.includes('?') ? path.slice(path.indexOf('?')) : ''}`); });
  }
  await check('alias antigo explícito na plataforma usa a barbearia do caminho', '/barbearias/demo-esquina/agendamento', host, (r) => { assert.equal(r.status, 307); assert.equal(r.headers.location, `${shopOrigin}/agendar`); });
  await check('alias antigo na plataforma não usa barbearia de query', '/agendamento?barbearia=demo-esquina', host, (r) => { assert.equal(r.status, 307); assert.equal(new URL(r.headers.location, origin).pathname, '/agendar'); assert.equal(new URL(r.headers.location, origin).origin, origin); });
  fs.writeFileSync(require('node:path').join(qa.outputDir, `booking-http-${production ? 'production' : 'development'}-results.json`), JSON.stringify(results, null, 2));
  console.log(`${results.length} verificações HTTP aprovadas.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
