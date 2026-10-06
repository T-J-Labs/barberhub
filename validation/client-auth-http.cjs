// Smoke SSR em dev e produção; Host de teste sem alterar DNS ou publicar o site.
const http = require('node:http');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const qa = require('./qa-http.cjs');
const { port, base: host, origin, authority: requestHost } = qa.config;
const productionHost = qa.config.environment === 'production' ? host : undefined;
const tenantOrigin = origin.replace('://', '://demo-esquina.');
const results = [];
function request(path, requestHostname = requestHost, extraHeaders = {}) { return qa.request(path, { host: requestHostname, ...extraHeaders }); }
function links(body) { return [...body.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1].replaceAll('&amp;', '&')); }
async function check(label, path, action, requestHostname, extraHeaders) {
  const response = await request(path, requestHostname, extraHeaders);
  action(response);
  results.push({ label, pass: true });
  console.log('PASS', label);
}
function form(response) {
  assert.equal(response.status, 200);
  assert.doesNotMatch(response.body, /<form\b/);
  assert.doesNotMatch(response.body, /<input\b[^>]*name="(?:email|password)"/);
  assert.match(response.body, /<button\b[^>]*disabled=""[^>]*aria-describedby="google-unavailable-note"/, 'Google fica desabilitado sem integração');
  assert.match(response.body, /Acesso com Google ainda indisponível/);
  const header = response.body.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)[1];
  assert.equal(links(header)[0], `${origin}/`, 'Logo de autenticação leva à landing');
  assert.match(header, />Criar conta<\/a>/);
  assert.doesNotMatch(header, /Criar conta de cliente/);
}
function authLinks(response, shop, destination) {
  const urls = links(response.body).map((href) => new URL(href, origin)).filter((url) => ['/login', '/cadastro'].includes(url.pathname));
  assert(urls.length >= 2);
  for (const url of urls) {
    assert.equal(url.origin, origin);
    assert.equal(url.searchParams.get('barbearia'), shop);
    assert.equal(url.searchParams.get('returnTo'), destination);
  }
}
(async () => {
  await qa.probe();
  for (const mode of ['login', 'cadastro']) {
    await check(`${mode}: acesso direto na plataforma`, `/${mode}`, (response) => { form(response); authLinks(response, null, null); });
    for (const destination of [undefined, '/barbearias/demo-esquina', `${origin}/barbearias/demo-esquina`]) {
      await check(`${mode}: retorno padrão/caminho legado leva ao subdomínio (${destination ?? 'ausente'})`, `/${mode}?barbearia=demo-esquina${destination === undefined ? '' : `&returnTo=${encodeURIComponent(destination)}`}`, (response) => {
        form(response); authLinks(response, 'demo-esquina', `${tenantOrigin}/`);
        assert(links(response.body).includes(`${tenantOrigin}/`));
        assert(!links(response.body).includes(`${origin}/barbearias/demo-esquina`));
      });
    }
    await check(`${mode}: contexto e retorno por subdomínio`, `/${mode}?barbearia=demo-esquina&returnTo=${encodeURIComponent(`${tenantOrigin}/`)}`, (response) => {
      form(response); authLinks(response, 'demo-esquina', `${tenantOrigin}/`);
      assert(links(response.body).includes(`${tenantOrigin}/`));
    });
    await check(`${mode}: host tenant redireciona para plataforma`, `/${mode}`, (response) => {
      assert.equal(response.status, 307);
      const url = new URL(response.headers.location);
      assert.equal(url.origin, origin);
      assert.equal(url.pathname, `/${mode}`);
      assert.equal(url.searchParams.get('barbearia'), 'demo-esquina');
      assert.equal(url.searchParams.get('returnTo'), `${tenantOrigin}/`);
    }, productionHost ? `demo-esquina.${host}` : `demo-esquina.${host}:${port}`);
    for (const returnTo of ['https://externo.test/', '//externo.test', 'javascript:alert(1)', `${tenantOrigin}/?redirect=evil`, '/barbearias/demo-navalha']) {
      await check(`${mode}: descarta ${returnTo}`, `/${mode}?barbearia=demo-esquina&returnTo=${encodeURIComponent(returnTo)}`, (response) => {
        form(response); authLinks(response, 'demo-esquina', `${tenantOrigin}/`);
        assert.match(response.body, /Destino de retorno descartado/);
      });
    }
    await check(`${mode}: retorno repetido descartado`, `/${mode}?barbearia=demo-esquina&returnTo=${encodeURIComponent(`${tenantOrigin}/`)}&returnTo=https%3A%2F%2Fexterno.test`, (response) => { form(response); authLinks(response, 'demo-esquina', `${tenantOrigin}/`); });
    await check(`${mode}: barbearia repetida descartada`, `/${mode}?barbearia=demo-esquina&barbearia=demo-navalha`, (response) => { form(response); authLinks(response, null, null); assert.match(response.body, /Barbearia de origem não reconhecida/); });
    await check(`${mode}: barbearia desconhecida descartada`, `/${mode}?barbearia=nao-existe&returnTo=https%3A%2F%2Fexterno.test`, (response) => { form(response); authLinks(response, null, null); assert.match(response.body, /Barbearia de origem não reconhecida/); });
    await check(`${mode}: host arbitrário não apresenta formulário`, `/${mode}`, (response) => { assert.equal(response.status, 200); assert.doesNotMatch(response.body, /<form\b/); assert.match(response.body, /Acesso indisponível neste domínio/); }, 'externo.test');
    await check(`${mode}: X-Forwarded-Host não autoriza origem`, `/${mode}`, (response) => { assert.doesNotMatch(response.body, /<form\b/); }, 'externo.test', { 'x-forwarded-host': requestHost });
  }
  await check('caminho legado redireciona ao subdomínio', '/barbearias/demo-esquina', (response) => { assert.equal(response.status, 307); assert.equal(response.headers.location, `${tenantOrigin}/`); });
  await check('caminho explícito no subdomínio também usa sua raiz', '/barbearias/demo-esquina', (response) => { assert.equal(response.status, 307); assert.equal(response.headers.location, `${tenantOrigin}/`); }, productionHost ? `demo-esquina.${host}` : `demo-esquina.${host}:${port}`);
  await check('perfil no subdomínio usa links absolutos da plataforma', '/', (response) => { assert.equal(response.status, 200); authLinks(response, 'demo-esquina', `${tenantOrigin}/`); }, productionHost ? `demo-esquina.${host}` : `demo-esquina.${host}:${port}`);
  await check('CTAs institucionais pré-selecionam Barbearia', '/', (response) => {
    assert.equal(response.status, 200);
    assert.doesNotMatch(response.body, /href="\/register"/);
    assert.match(response.body, /Cadastrar minha barbearia/);
    assert(links(response.body).includes(`${origin}/cadastro?perfil=barbearia`));
    assert.match(response.body, /O cadastro de barbearias ainda não está disponível/);
  });
  await check('register legado preserva intenção institucional', '/register', (response) => { assert.equal(response.status, 307); assert.equal(response.headers.location, `${origin}/cadastro?perfil=barbearia`); });
  for (const profile of ['cliente', 'barbeiro', 'barbearia']) {
    await check(`cadastro: escolha ${profile} preserva origem e retorno`, `/cadastro?perfil=${profile}&barbearia=demo-esquina&returnTo=${encodeURIComponent(`${tenantOrigin}/`)}`, (response) => {
      form(response);
      authLinks(response, 'demo-esquina', `${tenantOrigin}/`);
      const selected = [...response.body.matchAll(/<a\b[^>]*aria-current="true"[^>]*href="([^"]+)"/g)].map((match) => new URL(match[1].replaceAll('&amp;', '&'), origin));
      assert.equal(selected.length, 1);
      assert.equal(selected[0].searchParams.get('perfil') ?? 'cliente', profile);
      const login = links(response.body).map((href) => new URL(href, origin)).find((url) => url.pathname === '/login');
      assert.equal(login.searchParams.get('perfil') ?? 'cliente', profile);
    });
    await check(`login: ${profile} volta ao mesmo perfil de cadastro`, `/login?perfil=${profile}&barbearia=demo-esquina`, (response) => {
      form(response);
      const signup = links(response.body).map((href) => new URL(href, origin)).find((url) => url.pathname === '/cadastro');
      assert.equal(signup.searchParams.get('perfil') ?? 'cliente', profile);
      assert.equal(signup.searchParams.get('barbearia'), 'demo-esquina');
    });
  }
  for (const query of ['perfil=admin', 'perfil=super-admin', 'perfil=barbeiro&perfil=barbearia']) {
    await check(`perfil desconhecido/repetido descartado: ${query}`, `/cadastro?${query}`, (response) => {
      form(response);
      const selected = [...response.body.matchAll(/<a\b[^>]*aria-current="true"[^>]*href="([^"]+)"/g)];
      assert.equal(selected.length, 1);
      assert.equal(new URL(selected[0][1].replaceAll('&amp;', '&'), origin).searchParams.get('perfil'), null);
    });
  }
  await check('catálogo aponta diretamente aos subdomínios', '/barbearias', (response) => {
    assert.equal(response.status, 200);
    assert(response.body.includes('Encontre sua próxima barbearia'), 'Título do catálogo');
    const profiles = [...response.body.matchAll(/<a\b[^>]*aria-label="Conhecer [^"]+"[^>]*>/g)].map((match) => new URL(match[0].match(/href="([^"]+)"/)[1]));
    assert.equal(profiles.length, 6);
    assert(profiles.some((url) => url.href === `${tenantOrigin}/`));
    for (const url of profiles) {
      assert.equal(url.pathname, '/');
      assert(url.hostname.endsWith(`.${host}`));
      assert.equal(url.protocol, new URL(origin).protocol);
      assert.equal(url.port, new URL(origin).port);
    }
    assert.doesNotMatch(response.body, /href="\/barbearias\/demo-/);
  });
  await check('admin permanece disponível como demonstração existente', '/admin', (response) => { assert.equal(response.status, 200); });
  fs.writeFileSync(`${qa.outputDir}/client-auth-http-${productionHost ? 'production' : 'development'}-results.json`, JSON.stringify(results, null, 2));
  console.log(`${results.length} verificações HTTP aprovadas.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });


