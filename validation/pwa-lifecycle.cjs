const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const ts = require('../frontend/node_modules/typescript');
const { chromium } = require('./qa-browser.cjs');
const exportsWorker = {};
new Function('exports', ts.transpileModule(fs.readFileSync(path.join(__dirname,'../frontend/src/features/pwa/worker.ts'),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exportsWorker);
const base = `http://localhost:${process.argv[2] || 3110}`;
let version = 'v1', origin;
const results = [];
const outputDir = require('./qa-output.cjs').outputDirectory('pwa-lifecycle');
const server = http.createServer(async (request,response) => {
  if(request.url === '/pwa-worker.js') {
    response.writeHead(200, {'Content-Type':'application/javascript','Cache-Control':'no-store','Service-Worker-Allowed':'/'});
    response.end(exportsWorker.pwaWorkerSource(origin).replace('PREFIX + ' + JSON.stringify(exportsWorker.pwaCacheVersion),'PREFIX + ' + JSON.stringify(version))); return;
  }
  if(request.url === '/other-worker.js') {
    response.writeHead(200, {'Content-Type':'application/javascript','Service-Worker-Allowed':'/'}); response.end('self.addEventListener("fetch", () => {});'); return;
  }
  if(request.url === '/fixture') {
    response.writeHead(200,{'Content-Type':'text/html'}); response.end('<!doctype html><html lang="pt-BR"><title>QA PWA</title><form><label>Rascunho <input name="draft"></label></form></html>'); return;
  }
  try {
    const upstream = await fetch(base + request.url, {headers:{host:new URL(origin).host}});
    response.writeHead(upstream.status, {'Content-Type':upstream.headers.get('content-type') || 'text/plain'});
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch { response.writeHead(502); response.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve)); origin = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge'});
  async function check(name,action){await action(); results.push({name,passed:true}); console.log('PASS',name);}
  try {
    const context = await browser.newContext(); const page = await context.newPage(); await page.goto(origin+'/fixture');
    await page.evaluate(async () => {await navigator.serviceWorker.register('/pwa-worker.js',{scope:'/'});await navigator.serviceWorker.ready;});
    await check('primeira ativação não reivindica a página aberta', async()=>assert.equal(await page.evaluate(()=>navigator.serviceWorker.controller),null));
    await page.reload(); await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
    await page.getByRole('textbox',{name:'Rascunho'}).fill('Não recarregar esta edição');
    await page.evaluate(async()=>{await caches.open('barberhub-pwa-v0');await caches.open('outro-worker-cache');});
    version='v2'; await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration('/')).update();});
    await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration('/');if(r.waiting?.state==='installed')return;await new Promise(resolve=>{function inspect(){if(r.waiting?.state==='installed')resolve();}r.addEventListener('updatefound',()=>{r.installing?.addEventListener('statechange',inspect);});r.installing?.addEventListener('statechange',inspect);inspect();});});
    await check('atualização fica waiting, preserva rascunho, controlador e cache ativo', async()=>{
      assert.equal(await page.getByRole('textbox').inputValue(),'Não recarregar esta edição');
      const state = await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration('/');return {active:r.active?.state,waiting:r.waiting?.state,controller:navigator.serviceWorker.controller?.state};});
      assert.deepEqual(state,{active:'activated',waiting:'installed',controller:'activated'});
      assert.ok((await page.evaluate(()=>caches.keys())).includes('barberhub-pwa-v1'));
    });
    await page.close(); const reopened=await context.newPage(); await reopened.goto(origin+'/fixture');
    await reopened.waitForFunction(async()=>{const r=await navigator.serviceWorker.getRegistration('/');return r?.active?.state==='activated'&&!r.waiting;});
    await check('fechar a página permite ativação e limpa só o prefixo próprio', async()=>{
      assert.deepEqual((await reopened.evaluate(()=>caches.keys())).sort(), ['barberhub-pwa-v2','outro-worker-cache']);
    });
    await context.close();
    const conflictContext=await browser.newContext();const conflictPage=await conflictContext.newPage();
    await conflictPage.goto(origin+'/fixture');
    await conflictPage.evaluate(async()=>{await navigator.serviceWorker.register('/other-worker.js',{scope:'/'});await navigator.serviceWorker.ready;});
    await conflictPage.goto(origin+'/barbearias');await conflictPage.waitForLoadState('networkidle');
    await check('runtime real não substitui outro worker do escopo raiz',async()=>{
      const r=await conflictPage.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration('/');return {active:r.active.scriptURL,waiting:r.waiting?.scriptURL,installing:r.installing?.scriptURL,caches:await caches.keys()};});
      assert.ok(r.active.endsWith('/other-worker.js'));assert.equal(r.waiting,undefined);assert.equal(r.installing,undefined);assert.deepEqual(r.caches,[]);
    });
    await conflictContext.close();
  } finally {
    fs.mkdirSync(outputDir,{recursive:true});fs.writeFileSync(path.join(outputDir,'lifecycle-results.json'),JSON.stringify({browser:browser.version(),fixture:'HTTP isolado em localhost, fonte real do worker, formulário sintético e proxy da aplicação de produção',results},null,2));
    await browser.close();await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
