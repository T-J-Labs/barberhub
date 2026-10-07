const assert = require('node:assert/strict');
const { navigate: loadPage, reload } = require('./qa-navigation.cjs');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium, cleanupProfile } = require('./qa-browser.cjs');
const base = `http://localhost:${process.argv[2] || 3110}`;
const dir = require('./qa-output.cjs').outputDirectory('pwa-browser'); fs.mkdirSync(dir, { recursive: true });
const results = [], observations = {};
async function check(name, fn) { await fn(); results.push({ name, passed: true }); console.log('PASS', name); }
(async () => {
  // Perfil temporário normal: contextos incógnitos proíbem instalação nativa.
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'barberhub-pwa-qa-'));
  const context = await chromium.launchPersistentContext(profile, { headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge', viewport: { width:390,height:844 } });
  const browser = context.browser();
  observations.browser = browser.version(); observations.base = base;
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  // A emulação de offline do Chromium 145 não cobriu o fetch do worker após
  // reload. Bloquear também sua rede mantém o worker/cache reais em teste.
  const offlineNetwork = route => {
    (observations.offlineRequests ??= []).push({ url: route.request().url(), method: route.request().method(), worker: !!route.request().serviceWorker() });
    return route.abort('internetdisconnected');
  };
  async function setOffline(value) {
    if (value) { await context.route('**/*', offlineNetwork); await context.setOffline(true); }
    else { await context.setOffline(false); await context.unroute('**/*', offlineNetwork); }
  }
  const cacheContents = () => page.evaluate(async () => {
    const names = await caches.keys(); const contents = {};
    for (const name of names) contents[name] = (await (await caches.open(name)).keys()).map(r => new URL(r.url).pathname).sort();
    return contents;
  });
  try {
    await loadPage(page, `${base}/barbearias`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await check('manifesto, escopo, início no catálogo, ícones e ausência de atalhos', async () => {
      const m = await (await context.request.get(`${base}/manifest.webmanifest`)).json();
      assert.equal(m.id, '/'); assert.equal(m.start_url, '/barbearias'); assert.equal(m.scope, '/');
      assert.equal(m.display, 'standalone'); assert.equal(m.lang, 'pt-BR'); assert.equal(m.shortcuts, undefined);
      const expected = ['192x192','512x512','512x512']; assert.deepEqual(m.icons.map(i => i.sizes), expected);
      assert.equal(m.icons[2].purpose, 'maskable');
      for (const [url,size] of [['icon-192.png',192],['icon-512.png',512],['maskable-512.png',512],['apple-180.png',180]]) {
        assert.equal(await page.evaluate(async ({url}) => { const img = new Image(); img.src = `/pwa/${url}`; await img.decode(); return img.width; }, {url}), size);
      }
      assert.equal(await page.locator('link[rel=apple-touch-icon]').getAttribute('href'), '/pwa/apple-180.png');
      observations.manifest = m;
    });
    await reload(page);
    await page.waitForFunction(() => navigator.serviceWorker.controller?.scriptURL.endsWith('/pwa-worker.js'));
    await check('cache contém somente HTML offline e ícone, sem sessão ou dados locais', async () => {
      assert.deepEqual(await cacheContents(), { 'barberhub-pwa-v2': ['/pwa/icon-192.png','/pwa/offline.html'] });
      assert.equal(await page.evaluate(() => localStorage.length), 0); assert.equal((await context.cookies()).length, 0);
      assert.deepEqual(await page.evaluate(async () => await indexedDB.databases()), []);
    });
    const cdp = await context.newCDPSession(page);
    observations.installability = await cdp.send('Page.getInstallabilityErrors');
    observations.appManifest = await cdp.send('Page.getAppManifest');
    await check('critérios reais de instalação reportados pelo Chromium', () => assert.deepEqual(observations.installability.installabilityErrors, []));
    await check('hosts de tenant, arbitrário e IP sem manifesto válido ou worker', async () => {
      for (const host of [`demo-esquina.localhost:${new URL(base).port}`, `arbitrario.test:${new URL(base).port}`, `127.0.0.1:${new URL(base).port}`]) {
        const options = { headers: { host } };
        assert.deepEqual(await (await context.request.get(`${base}/manifest.webmanifest`, options)).json(), {});
        assert.equal((await context.request.get(`${base}/pwa-worker.js`, options)).status(), 404);
      }
      const tenant = await context.newPage(); await tenant.goto(base.replace('localhost','demo-esquina.localhost'));
      assert.equal(await tenant.evaluate(() => navigator.serviceWorker.controller), null);
      assert.equal(await tenant.getByRole('button', { name: 'Instalar BarberHub' }).count(), 0);
      await tenant.close();
    });
    await check('orientação sem botão inoperante quando não há prompt', async () => {
      if (await page.getByRole('button', { name: 'Instalar BarberHub' }).count() === 0) {
        await page.getByText('Como adicionar à tela inicial', { exact: true }).click();
        assert.ok((await page.locator('details').last().innerText()).includes('menu do navegador'));
      } else observations.nativeInstallPromptOffered = true;
    });
    await check('prompt após clique, dispensa sem persistência (evento controlado de UI)', async () => {
      await page.evaluate(() => {
        window.qaPromptCalls = 0;
        const event = new Event('beforeinstallprompt', { cancelable: true });
        event.prompt = async () => { window.qaPromptCalls++; };
        event.userChoice = Promise.resolve({ outcome: 'dismissed' });
        window.dispatchEvent(event);
      });
      const trigger = page.getByRole('button', { name: 'Instalar BarberHub', exact: true }); await trigger.waitFor();
      assert.equal(await page.evaluate(() => window.qaPromptCalls), 0);
      // focus() após clique preserva modalidade de mouse em alguns Chromium.
      // Exercitar Tab de fato antes de exigir o indicador :focus-visible.
      await trigger.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
      assert.ok(await trigger.evaluate(el => el === document.activeElement && el.matches(':focus-visible') && getComputedStyle(el).outlineStyle !== 'none'));
      await page.keyboard.press('Enter'); await page.getByText(/Instalação dispensada/).waitFor();
      assert.equal(await page.evaluate(() => window.qaPromptCalls), 1);
      assert.equal(await trigger.count(), 0); assert.equal(await page.evaluate(() => localStorage.length), 0);
    });
    await check('modo standalone oculta instalação (emulação da API de apresentação)', async () => {
      const standaloneContext = await browser.newContext();
      await standaloneContext.addInitScript(() => {
        const match = window.matchMedia.bind(window);
        window.matchMedia = query => { const m = match(query); if (query === '(display-mode: standalone)') Object.defineProperty(m, 'matches', { value: true }); return m; };
      });
      const standalonePage = await standaloneContext.newPage(); await standalonePage.goto(`${base}/barbearias`);
      await standalonePage.waitForLoadState('networkidle');
      assert.equal(await standalonePage.locator('[aria-labelledby=pwa-install-title]').count(), 0);
      assert.equal((await standaloneContext.cookies()).length, 0);
      await standaloneContext.close();
    });
    await check('conexão recuperada é um sinal, mantém rascunho e não reenvia ação', async () => {
      await loadPage(page, `${base}/cliente/perfil`);
      const field = page.getByRole('textbox', { name: 'Nome de exibição', exact: true });
      await field.fill('Rascunho em andamento');
      const operations = []; const observe = r => { if (r.method() !== 'GET') operations.push(r.method()); }; page.on('request', observe);
      await setOffline(true); await page.getByRole('status').filter({ hasText: 'Seu navegador está sem conexão' }).waitFor();
      assert.equal(await field.inputValue(), 'Rascunho em andamento');
      await setOffline(false); await page.getByRole('status').filter({ hasText: 'O navegador voltou a ficar online' }).waitFor();
      assert.equal(await field.inputValue(), 'Rascunho em andamento'); assert.deepEqual(operations, []); page.off('request', observe);
      await page.getByRole('button', { name: 'Fechar aviso de conexão' }).click();
    });
    await check('navegação offline preparada e retry refazem somente a página atual', async () => {
      await setOffline(true); await loadPage(page, `${base}/barbearias?q=meier`);
      await page.getByRole('heading', { name: 'Vamos retomar quando houver conexão.' }).waitFor();
      assert.equal(await page.getByRole('status').textContent(), 'Não foi possível conectar ao BarberHub. Agendamentos e alterações precisam de conexão. Nenhuma ação foi enviada.');
      assert.ok(page.url().includes('q=meier'));
      await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
      await page.getByRole('heading', { name: 'Vamos retomar quando houver conexão.' }).waitFor();
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.screenshot({ path: path.join(dir, `offline-${width}.png`), fullPage: true });
      }
      const retry = page.getByRole('button', { name: 'Tentar novamente' });
      await page.addScriptTag({ path: require.resolve('./tools/node_modules/axe-core/axe.min.js') });
      observations.offlineAxe = await page.evaluate(async () => {
        const report = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } });
        return { violations: report.violations, incomplete: report.incomplete };
      });
      assert.deepEqual(observations.offlineAxe.violations, [], 'Fallback offline deve passar sem exceção de contraste');
      observations.offlineButton = await retry.evaluate(el => ({ foreground: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor }));
      await retry.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
      assert.ok(await retry.evaluate(el => el === document.activeElement && el.matches(':focus-visible') && getComputedStyle(el).outlineStyle !== 'none'));
      await setOffline(false); await page.getByRole('button', { name: 'Tentar novamente' }).click();
      await page.getByRole('heading', { name: 'Resultado da busca' }).waitFor();
      assert.ok(page.url().includes('q=meier'));
    });
    await check('primeiro acesso offline sem preparação não recebe fallback', async () => {
      const cold = await browser.newContext({ offline: true }); const coldPage = await cold.newPage();
      await assert.rejects(coldPage.goto(`${base}/barbearias`));
      assert.equal(await coldPage.getByRole('heading', { name: 'Vamos retomar quando houver conexão.' }).count(), 0); await cold.close();
    });
    await check('POST/API e RSC sem rede falham sem fallback, cache ou fila', async () => {
      await setOffline(true);
      const failures = await page.evaluate(async () => {
        const cases = [['/api/v1/qa-pwa', { method:'POST', body: 'qa-synthetic' }], ['/api/v1/qa-pwa', {}], ['/barbearias?_rsc=qa', { headers:{ RSC:'1' } }]];
        return Promise.all(cases.map(async ([url,options]) => { try { const response = await fetch(url,options); return { resolved:true, status:response.status }; } catch { return { resolved:false }; } }));
      });
      assert.ok(failures.every(f => !f.resolved));
      await setOffline(false);
      assert.deepEqual(await cacheContents(), { 'barberhub-pwa-v2': ['/pwa/icon-192.png','/pwa/offline.html'] });
    });
    await check('transição interna offline preserva busca e oferece recuperação', async () => {
      await loadPage(page, `${base}/barbearias`); await setOffline(true);
      await page.getByRole('searchbox').fill('meier');
      await page.getByRole('button', { name: 'Buscar barbearias', exact: true }).click();
      await page.getByRole('heading', { name: 'Vamos retomar quando houver conexão.' }).waitFor();
      assert.ok(page.url().includes('q=meier'));
      await setOffline(false); await page.getByRole('button', { name:'Tentar novamente' }).click();
      await page.getByRole('heading', { name:'Resultado da busca' }).waitFor();
    });
    await check('catálogo, cliente, barbeiro, admin e superadmin nas quatro larguras', async () => {
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({ width, height:900 });
        for (const route of ['/barbearias','/cliente/agendamentos','/cliente/perfil','/cliente/ajuda','/barbeiro','/barbeiro/agenda','/barbeiro/historico','/barbeiro/perfil','/barbeiro/ajuda','/admin','/admin/agenda','/admin/clientes','/admin/servicos','/admin/barbeiros','/admin/configuracoes','/admin/relatorios','/admin/ajuda','/super-admin','/super-admin/barbearias','/super-admin/barbearias/demo-esquina']) {
          const response = await loadPage(page, base + route); assert.equal(response.status(),200,`${route} ${width}`);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} ${width}`);
          assert.equal(await page.locator('h1').count(),1, route); assert.equal(await page.locator('main').count(),1,route);
        }
        await loadPage(page, `${base}/barbearias`); await page.locator('[aria-labelledby=pwa-install-title]').waitFor();
        await page.screenshot({ path:path.join(dir, `install-${width}.png`), fullPage:true });
      }
    });
    await check('drawer da conta: modal nativo, Tab, Escape e retorno ao gatilho', async () => {
      await page.setViewportSize({ width:320,height:844 }); await loadPage(page, `${base}/admin`);
      const trigger = page.getByRole('button',{name:'Abrir menu',exact:true}); await trigger.focus(); await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog',{name:'Menu da conta'}); await dialog.waitFor();
      for(let i=0;i<18;i++){await page.keyboard.press('Tab'); assert.ok(await dialog.evaluate(el => el.contains(document.activeElement) || document.activeElement === document.body));}
      await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'}); assert.ok(await trigger.evaluate(el => el===document.activeElement));
    });
    await check('zoom 200%, movimento reduzido e foco da nova interface', async () => {
      await page.setViewportSize({ width:1440,height:900 });
      await loadPage(page, `${base}/barbearias`); await page.emulateMedia({ reducedMotion:'reduce' });
      await page.evaluate(() => {document.documentElement.style.zoom='2';});
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.evaluate(() => {document.documentElement.style.zoom='1';});
      const control = page.locator('[aria-labelledby=pwa-install-title]').locator('button, summary').first();
      await control.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
      assert.ok(await control.evaluate(el => el === document.activeElement && el.matches(':focus-visible') && getComputedStyle(el).outlineStyle!=='none'));
    });
    observations.finalCaches = await cacheContents(); observations.pageErrors = errors;
    assert.deepEqual(errors, []);
  } catch (error) {
    observations.failure = { message: error.message, url: page.url(), text: await page.locator('body').innerText().catch(() => '') };
    await page.screenshot({ path: path.join(dir, 'failure.png'), fullPage: true }).catch(() => {});
    throw error;
  } finally {
    fs.writeFileSync(path.join(dir,'browser-results.json'), JSON.stringify({ results, observations },null,2));
    await browser.close();
    cleanupProfile(profile);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
