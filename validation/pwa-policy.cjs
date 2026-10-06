const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../frontend/node_modules/typescript');
function load(name) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../frontend/src/features/pwa', `${name}.ts`), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('exports', code)(exports);
  return exports;
}
const policy = load('policy');
const worker = load('worker');
const origin = 'https://barberhub.test';
let count = 0;
async function check(name, fn) { await fn(); count++; console.log('PASS', name); }
function harness({ online = true, status = 200, workerOrigin = origin } = {}) {
  const listeners = {}, storage = new Map(), calls = [];
  const caches = {
    keys: async () => [...storage.keys()],
    delete: async name => storage.delete(name),
    open: async name => {
      if (!storage.has(name)) storage.set(name, new Map());
      const cache = storage.get(name);
      return { put: async (url, response) => cache.set(url, response), match: async url => cache.get(url)?.clone() };
    },
  };
  vm.runInNewContext(worker.pwaWorkerSource(origin), {
    self: { location: { origin: workerOrigin }, addEventListener: (type, fn) => { listeners[type] = fn; } },
    caches, URL, Request, Response,
    fetch: async request => {
      calls.push(request);
      if (!online) throw new TypeError('Failed to fetch');
      return new Response(typeof request === 'object' && request.url.endsWith('offline.html') ? 'offline fixture' : 'network', { status });
    },
  });
  const life = async name => { let pending; listeners[name]({ waitUntil: promise => { pending = promise; } }); await pending; };
  const fetchEvent = async (pathname, options = {}) => {
    let response;
    listeners.fetch({ request: { url: new URL(pathname, origin).href, method: 'GET', mode: 'navigate', headers: new Headers(), ...options }, respondWith: promise => { response = promise; } });
    return response === undefined ? undefined : await response;
  };
  return { listeners, caches, storage, calls, life, fetchEvent, offline: () => { online = false; } };
}
(async () => {
  await check('host exato; sem subdomínios, hosts arbitrários, IP ou origem encaminhada', () => {
    assert.ok(policy.isPwaHost('barberhub.test:443', 'barberhub.test'));
    for (const host of ['demo.barberhub.test', 'barberhub.test.evil.test', 'barberhub.test:444', '127.0.0.1', 'barberhub.test@evil.test', 'barberhub.test.', null]) assert.equal(policy.isPwaHost(host, 'barberhub.test'), false);
    assert.equal(policy.isPwaHost('barberhub.test', undefined), false);
  });
  await check('registro exige produção, sem mocks e contexto seguro', () => {
    assert.ok(policy.canRegisterPwa('localhost:3110', 'localhost', true, false, true));
    for (const args of [[false,false,true], [true,true,true], [true,false,false]]) assert.equal(policy.canRegisterPwa('localhost:3110', 'localhost', ...args), false);
  });
  await check('worker copiado para outra origem não instala nem intercepta', () => assert.deepEqual(Object.keys(harness({ workerOrigin: 'https://demo.barberhub.test' }).listeners), []));
  const h = harness();
  await h.life('install');
  await check('preparação persiste somente HTML offline e ícone permitido', () => {
    assert.deepEqual([...h.storage.keys()], ['barberhub-pwa-v1']);
    assert.deepEqual([...h.storage.values()][0].keys().toArray(), worker.pwaOfflineAssets.map(p => origin + p));
    assert.ok(h.calls.every(r => r.cache === 'no-store' && r.credentials === 'omit' && r.redirect === 'error'));
  });
  await check('ativação remove somente versões do próprio prefixo', async () => {
    await h.caches.open('barberhub-pwa-v0'); await h.caches.open('msw-other');
    await h.life('activate');
    assert.deepEqual([...h.storage.keys()], ['barberhub-pwa-v1', 'msw-other']);
  });
  await check('rede online não copia páginas, consultas ou dados', async () => {
    const response = await h.fetchEvent('/cliente/perfil?q=private'); assert.equal(await response.text(), 'network');
    assert.equal([...h.storage.values()][0].size, 2);
  });
  h.offline();
  await check('navegação completa sem conexão recebe somente fallback estático', async () => assert.equal(await (await h.fetchEvent('/admin/agenda')).text(), 'offline fixture'));
  await check('ícone autossuficiente funciona sem rede', async () => assert.equal(await (await h.fetchEvent('/pwa/icon-192.png', { mode: 'no-cors' })).text(), 'network'));
  await check('API, autenticação, POST, RSC, prefetch e externos passam sem interceptação', async () => {
    const cases = [ ['/api/v1/agenda'], ['/login'], ['/cadastro'], ['/register'], ['/auth/callback'], ['/oauth/callback'], ['/_next/static/chunk.js'], ['/cliente/perfil', { method: 'POST' }], ['/barbearias', { mode: 'cors' }], ['/barbearias?_rsc=x'], ['/barbearias', { headers: new Headers({ RSC: '1' }) }], ['/barbearias', { headers: new Headers({ 'next-router-prefetch': '1' }) }], ['/barbearias', { headers: new Headers({ 'next-router-segment-prefetch': '/x' }) }], ['/barbearias', { headers: new Headers({ purpose: 'prefetch' }) }], ['https://demo.barberhub.test/'], ['https://external.test/icon.png'] ];
    for (const args of cases) assert.equal(await h.fetchEvent(...args), undefined, args[0]);
  });
  await check('403 e 500 preservam status e conteúdo, sem HTML offline', async () => {
    for (const status of [403,500]) { const response = await harness({ status }).fetchEvent('/barbearias'); assert.equal(response.status, status); assert.equal(await response.text(), 'network'); }
  });
  await check('preparação falha não grava recursos parciais', async () => { const bad = harness({ online: false }); await assert.rejects(bad.life('install')); assert.equal(bad.storage.size, 0); });
  await check('sem skipWaiting, claim, mensagens, sync, push, IndexedDB ou replay', () => {
    assert.deepEqual(Object.keys(h.listeners), ['install', 'activate', 'fetch']);
    assert.ok(!/self\.skipWaiting\(|clients\.claim\(|indexedDB|localStorage|\.postMessage\(|sync\.register/.test(worker.pwaWorkerSource(origin)));
  });
  console.log(`${count} grupos de política passaram.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
