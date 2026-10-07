const assert = require('node:assert/strict');
const { navigate: loadPage, reload, waitForURL } = require('./qa-navigation.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('./qa-browser.cjs');
const port = process.argv[2] || 3000;
const base = `http://localhost:${port}`;
const dir = process.env.HEADER_QA_OUTPUT || require('./qa-output.cjs').outputDirectory('headers-browser');
fs.mkdirSync(dir, { recursive: true });
const results = [], observations = {};
async function check(name, action) { await action(); results.push({ name, passed: true }); console.log('PASS', name); }
const families = [
  ['landing', 'localhost', '/'], ['catalog', 'localhost', '/barbearias'],
  ['public-profile', 'demo-esquina.localhost', '/'], ['booking', 'demo-esquina.localhost', '/agendar'],
  ['login', 'localhost', '/login'], ['signup', 'localhost', '/cadastro'],
  ['client', 'localhost', '/cliente/agendamentos'], ['barber', 'localhost', '/barbeiro'],
  ['admin', 'localhost', '/admin'], ['superadmin', 'localhost', '/super-admin'],
];
(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  observations.browser = browser.version(); observations.port = port;
  const banner = () => page.getByRole('banner');
  const trigger = () => banner().locator('button[aria-controls][aria-expanded]');
  const drawer = () => page.locator('dialog[open]');
  async function closed() {
    await page.waitForFunction(() => !document.querySelector('dialog[open]') && document.body.style.overflow !== 'hidden');
    assert.equal(await trigger().getAttribute('aria-expanded'), 'false');
  }
  async function noOverflow() { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); }
  async function controlGeometry() {
    const controls = await banner().evaluate(el => [...el.querySelectorAll('a,button')].filter(x => x.checkVisibility()).map(x => {
      const r = x.getBoundingClientRect(); return { label: x.getAttribute('aria-label') || x.textContent, x: r.x, y: r.y, right: r.right, bottom: r.bottom, w: r.width, h: r.height };
    }));
    for (const c of controls) { assert.ok(c.w >= 44 && c.h >= 44, JSON.stringify(c)); assert.ok(c.x >= -0.5 && c.right <= (await page.evaluate(() => innerWidth)) + 0.5, JSON.stringify(c)); }
    for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) {
      const a = controls[i], b = controls[j];
      assert.ok(a.right <= b.x + 0.5 || b.right <= a.x + 0.5 || a.bottom <= b.y + 0.5 || b.bottom <= a.y + 0.5, `Overlap: ${a.label}/${b.label}`);
    }
  }
  async function open() { await trigger().click(); await drawer().waitFor(); }
  async function preview() {
    await loadPage(page, `${base}/login`);
    await page.getByText('Ver prévia do header de cliente', { exact: true }).click();
    await page.getByRole('button', { name: 'Visualizar header de cliente', exact: true }).click();
    await page.getByRole('heading', { name: 'Prévia exibida', exact: true }).waitFor();
  }
  try {
    for (const [name, host, route] of families) {
      await loadPage(page, `http://${host}:${port}${route}`);
      await banner().waitFor();
      assert.equal(await banner().count(), 1);
      for (const width of [320, 390, 639, 640, 768, 1023, 1024, 1199, 1200, 1440]) {
        await check(`${name}: ${width}px, controles >=44px, sem sobreposição/corte`, async () => {
          await page.setViewportSize({ width, height: 844 });
          await noOverflow(); await controlGeometry();
          if ([320, 390, 768, 1440].includes(width)) await page.screenshot({ caret: 'initial',  path: path.join(dir, `${name}-${width}.png`) });
        });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await check(`${name}: modal, foco inicial/contido, fundo inerte e Escape`, async () => {
        await trigger().focus(); await page.keyboard.press('Enter'); await drawer().waitFor();
        assert.equal(await trigger().getAttribute('aria-expanded'), 'true');
        assert.equal(await drawer().getByRole('button', { name: 'Fechar menu' }).evaluate(el => el === document.activeElement), true);
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        const background = banner().locator('a').first();
        await background.evaluate(el => el.focus());
        assert.equal(await drawer().evaluate(el => el.contains(document.activeElement)), true);
        for (const key of ['Tab', 'Shift+Tab']) for (let i = 0; i < 15; i++) {
          await page.keyboard.press(key); assert.equal(await drawer().evaluate(el => el.contains(document.activeElement)), true);
        }
        await page.screenshot({ caret: 'initial',  path: path.join(dir, `${name}-menu.png`) });
        await page.keyboard.press('Escape'); await closed();
        assert.equal(await trigger().evaluate(el => el === document.activeElement), true);
      });
      await check(`${name}: fechar por botão e backdrop, restaurar overflow anterior`, async () => {
        await page.evaluate(() => { document.body.style.overflow = 'auto'; });
        await open();
        if (name === 'landing') await page.screenshot({ caret: 'initial',  path:path.join(dir,'landing-menu-mouse.png') });
        await drawer().getByRole('button', { name: 'Fechar menu' }).click(); await closed();
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'auto');
        await open(); await page.mouse.click(385, 400); await closed();
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'auto');
        await page.evaluate(() => { document.body.style.overflow = ''; });
      });
      await check(`${name}: pouca altura, conteúdo rolável e rodapé alcançável`, async () => {
        await page.setViewportSize({ width: 320, height: 240 }); await open();
        const nav = drawer().locator('nav');
        assert.equal(await nav.evaluate(el => getComputedStyle(el).overflowY), 'auto');
        const last = drawer().locator('a,button').last(); await last.scrollIntoViewIfNeeded();
        const box = await last.boundingBox(); assert.ok(box.y >= 0 && box.y + box.height <= 241);
        assert.equal(await drawer().evaluate(el => el.scrollWidth <= el.clientWidth), true);
        await page.screenshot({ caret: 'initial',  path: path.join(dir, `${name}-short.png`) });
        await page.keyboard.press('Escape'); await closed();
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await check(`${name}: resize sem overlay/bloqueio residual`, async () => {
        await open(); await page.setViewportSize({ width: 1440, height: 900 });
        if (['barber', 'superadmin'].includes(name)) {
          assert.equal(await drawer().count(), 1); await page.keyboard.press('Escape'); await closed();
        } else await closed();
        if (name === 'admin') {
          assert.equal(await page.locator('#admin-navigation').isVisible(), true);
          assert.equal(await page.locator('#admin-navigation a[aria-current=page]').evaluate(el => el === document.activeElement), true);
          assert.equal(await banner().evaluate(el => getComputedStyle(el).position), 'static');
        }
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await check(`${name}: logo preservada no header e drawer`, async () => {
        const expectedPath = ['landing','login','signup','barber','admin','superadmin'].includes(name) ? '/' : '/barbearias';
        const brand = banner().locator('a').first(); assert.equal(new URL(await brand.getAttribute('href'), page.url()).pathname, expectedPath);
        await open(); assert.equal(new URL(await drawer().locator('a').first().getAttribute('href'), page.url()).pathname, expectedPath);
        // A logo também navega para a URL atual. Esperar o evento iniciado pelo
        // clique evita que ele cancele o próximo goto no Firefox.
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          drawer().locator('a').first().click(),
        ]);
        await waitForURL(page, url => url.hostname === 'localhost' && url.pathname === expectedPath);
        await page.waitForFunction(() => !document.querySelector('dialog[open]') && document.body.style.overflow !== 'hidden');
      });
    }
    await check('landing: âncoras e estados ativos preservados por clique e scroll', async () => {
      await loadPage(page, base); await page.setViewportSize({ width: 1440, height: 900 });
      for (const [label, id] of [['Produto','produto'],['Serviços','servicos'],['Planos','planos'],['Contato','contato'],['Início','inicio']]) {
        await banner().getByRole('link', { name: label, exact: true }).click();
        await page.waitForFunction(id => document.querySelector(`header nav a[aria-current=location]`)?.getAttribute('href') === `/#${id}`, id);
      }
      await page.setViewportSize({ width: 390, height: 844 }); await open();
      await drawer().getByRole('link', { name: 'Produto', exact: true }).click(); await closed();
      await page.waitForFunction(() => location.hash === '#produto');
      await page.locator('#planos').evaluate(el => el.scrollIntoView());
      await open(); await page.waitForFunction(() => document.querySelector('dialog[open] a[aria-current=location]')?.textContent === 'Planos');
      await page.keyboard.press('Escape');
    });
    await check('acesso: subdomínio → login → perfis/cadastro → retorno canônico', async () => {
      await loadPage(page, `http://demo-esquina.localhost:${port}/agendar`); await open();
      const href = new URL(await drawer().getByRole('link', { name: 'Entrar', exact: true }).getAttribute('href'));
      assert.equal(href.hostname, 'localhost'); assert.equal(href.searchParams.get('barbearia'), 'demo-esquina');
      assert.equal(href.searchParams.get('returnTo'), `http://demo-esquina.localhost:${port}/`);
      await drawer().getByRole('link', { name: 'Entrar', exact: true }).click(); await waitForURL(page, /\/login/);
      assert.equal(await page.getByRole('button', { name: 'Entrar com Google', exact: true }).isDisabled(), true);
      await open(); await drawer().getByRole('link', { name: 'Criar conta', exact: true }).click(); await waitForURL(page, /\/cadastro/);
      for (const role of ['Barbeiro', 'Barbearia', 'Cliente']) {
        await page.getByRole('navigation', { name: 'Escolha seu perfil de cadastro', exact: true }).getByRole('link', { name: new RegExp(`^${role} `) }).click();
        await page.waitForFunction(role => document.querySelector('[aria-label="Escolha seu perfil de cadastro"] a[aria-current]')?.textContent.startsWith(role), role);
        assert.equal(new URL(page.url()).searchParams.get('barbearia'), 'demo-esquina');
        await open(); const login = new URL(await drawer().getByRole('link', { name: 'Entrar', exact: true }).getAttribute('href'));
        assert.equal(login.searchParams.get('perfil'), role === 'Cliente' ? null : role.toLowerCase());
        assert.equal(login.searchParams.get('returnTo'), `http://demo-esquina.localhost:${port}/`);
        await page.keyboard.press('Escape');
      }
      await page.getByRole('link', { name: /^Voltar para/ }).click();
      await waitForURL(page, `http://demo-esquina.localhost:${port}/`);
    });
    await check('cliente: prévia, cinco destinos, nome longo, saída/reinício locais', async () => {
      await preview(); await open();
      assert.deepEqual(await drawer().locator('ul a').allTextContents(), ['Explorar barbearias','Minhas barbearias','Meus agendamentos','Perfil','Ajuda']);
      assert.deepEqual(await drawer().locator('nav > div').nth(1).locator('ul a').allTextContents(), ['Explorar barbearias','Minhas barbearias','Meus agendamentos']);
      assert.deepEqual(await drawer().locator('nav > div').last().locator('ul a').allTextContents(), ['Perfil','Ajuda']);
      await drawer().getByRole('link', { name: 'Perfil', exact: true }).click(); await waitForURL(page, /\/cliente\/perfil/);
      const long = 'Á'.repeat(300); await page.getByRole('textbox', { name: 'Nome de exibição', exact: true }).fill(long);
      await page.getByRole('button', { name: 'Aplicar à demonstração', exact: true }).click();
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({ width, height: 360 }); await open(); await noOverflow();
        assert.equal(await drawer().getByText(long, { exact: true }).count(), 1);
        assert.equal(await drawer().evaluate(el => el.scrollWidth <= el.clientWidth), true);
        await page.screenshot({ caret: 'initial',  path: path.join(dir, `client-preview-${width}.png`) }); await page.keyboard.press('Escape'); await closed();
      }
      await page.setViewportSize({ width:390,height:844 });
      for (const [label, route] of [['Ajuda','/cliente/ajuda'],['Meus agendamentos','/cliente/agendamentos'],['Explorar barbearias','/barbearias'],['Minhas barbearias','/cliente/barbearias'],['Perfil','/cliente/perfil']]) {
        await open(); const link = drawer().getByRole('link', { name: label, exact: true }); await link.focus(); await page.keyboard.press('Enter');
        await waitForURL(page, `${base}${route}`); await closed();
      }
      await open(); await page.goBack(); await waitForURL(page, `${base}/cliente/barbearias`); await closed();
      await open(); await drawer().getByRole('button', { name: 'Sair da demonstração', exact: true }).click();
      await closed(); assert.equal(await trigger().evaluate(el => el === document.activeElement), true);
      await open(); await drawer().getByRole('link', { name: 'Entrar', exact: true }).click(); await waitForURL(page, /\/login/);
      await page.getByText('Ver prévia do header de cliente', { exact: true }).click();
      await page.getByRole('button', { name: 'Visualizar header de cliente', exact: true }).click();
      await page.getByRole('heading', { name: 'Prévia exibida', exact: true }).waitFor();
      assert.equal(await context.cookies().then(x => x.length), 0); assert.equal(await page.evaluate(() => localStorage.length), 0);
      await reload(page); await open(); assert.equal(await drawer().getByRole('link', { name: 'Entrar', exact: true }).count(), 1);
      await page.keyboard.press('Escape');
    });
    for (const role of ['barbeiro','admin','super-admin']) {
      await check(`${role}: todos os destinos existentes, itens indisponíveis e saída`, async () => {
        await loadPage(page, `${base}/${role}`); await open();
        const links = await drawer().locator('ul a').evaluateAll(els => els.map(el => ({ label: el.textContent, href: el.href })));
        if (role === 'super-admin') {
          assert.equal(await drawer().locator('[aria-disabled=true]').count(), 1);
          assert.equal(await drawer().getByText('Planos e assinaturas', { exact: true }).getAttribute('aria-disabled'), 'true');
          assert.equal(await drawer().getByRole('link', { name: 'Ajuda', exact: true }).getAttribute('href'), '/super-admin/ajuda');
        }
        for (const { label, href } of links) {
          await drawer().getByRole('link', { name: label, exact: true }).click(); await waitForURL(page, href);
          await page.waitForFunction(() => !document.querySelector('dialog[open]') && document.body.style.overflow !== 'hidden');
          assert.equal(await page.getByText('This page could not be found.').count(), 0); await open();
        }
        await drawer().getByRole('button', { name: 'Sair', exact: true }).click(); await waitForURL(page, `${base}/`);
        assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      });
    }
    await check('toque: abrir, fechar e backdrop em contexto touch', async () => {
      // Firefox suporta viewport/touch, mas não a opção isMobile do Playwright.
      const touch = await browser.newContext({ hasTouch: true, isMobile: process.env.TEST_BROWSER === 'firefox' ? undefined : true, viewport: { width:390,height:844 } });
      const p = await touch.newPage();
      for (const route of ['/','/barbearias','/login','/barbeiro','/admin','/super-admin']) {
        await loadPage(p, `${base}${route}`); await p.getByRole('button', { name:'Abrir menu',exact:true }).tap();
        await p.getByRole('button', { name:'Fechar menu',exact:true }).tap();
        await p.waitForFunction(() => !document.querySelector('dialog[open]'));
        await p.getByRole('button', { name:'Abrir menu',exact:true }).tap(); await p.touchscreen.tap(385,400);
        await p.waitForFunction(() => !document.querySelector('dialog[open]') && document.body.style.overflow !== 'hidden');
      }
      await touch.close();
    });
    await check('catálogo visitante: acesso centralizado exclusivamente nesse contexto', async () => {
      await page.setViewportSize({ width:390,height:844 });
      for (const [host, route, centered] of [['localhost','/barbearias',true],['localhost','/login',false],['localhost','/cadastro',false],['localhost','/cliente/agendamentos',false],['demo-esquina.localhost','/',false],['demo-esquina.localhost','/agendar',false]]) {
        await loadPage(page, `http://${host}:${port}${route}`); await open();
        const placement = await drawer().locator('nav > div').last().evaluate(el => ({ classes:el.className, box:el.getBoundingClientRect().toJSON() }));
        assert.equal(placement.classes.includes('my-auto'), centered);
        assert.equal(placement.classes.includes('mt-auto'), !centered);
        if (centered) assert.ok(placement.box.y > 200 && placement.box.bottom < 650);
        else assert.ok(placement.box.bottom > 800);
        await page.screenshot({ caret: 'initial',  path:path.join(dir, `access-${host}-${route.replaceAll('/','_') || 'root'}.png`) });
        await page.keyboard.press('Escape'); await closed();
      }
    });
    await check('cliente: mesmos controles/layout do barbeiro, notificações e perfil', async () => {
      await preview();
      await banner().scrollIntoViewIfNeeded();
      const compare = await context.newPage(); await loadPage(compare, `${base}/barbeiro`);
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({ width,height:844 }); await compare.setViewportSize({ width,height:844 });
        await page.evaluate(() => window.scrollTo(0,0)); await compare.evaluate(() => window.scrollTo(0,0));
        await noOverflow(); await controlGeometry();
        const geometry = p => p.getByRole('banner').evaluate(el => [...el.querySelectorAll('a,button')].filter(c => c.checkVisibility()).map(c => {
          const r=c.getBoundingClientRect(); return { label:c.getAttribute('aria-label') || c.textContent, x:r.x,y:r.y-el.getBoundingClientRect().y,w:r.width,h:r.height };
        }));
        assert.deepEqual(await geometry(page), await geometry(compare));
        const bell = banner().getByRole('button', { name:'Notificações',exact:true });
        await bell.focus(); await page.keyboard.press('Enter'); await page.getByRole('dialog', { name:'Notificações',exact:true }).waitFor();
        assert.equal(await bell.getAttribute('aria-expanded'),'true');
        assert.ok((await page.getByRole('dialog', { name:'Notificações',exact:true }).innerText()).includes('Nenhuma notificação nesta demonstração'));
        await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('dialog[open]'));
        assert.equal(await bell.evaluate(el => el===document.activeElement),true);
        assert.equal(await bell.getAttribute('aria-expanded'),'false');
        await page.screenshot({ caret: 'initial',  path:path.join(dir,`client-actions-${width}.png`) });
      }
      await compare.close();
      await banner().getByRole('link', { name:'Perfil',exact:true }).click(); await waitForURL(page, `${base}/cliente/perfil`);
      assert.equal(await page.getByRole('textbox', { name:'Nome de exibição',exact:true }).count(),1);
      await page.setViewportSize({ width:390,height:844 });
      await open(); await drawer().getByRole('link', { name:'Explorar barbearias',exact:true }).click(); await waitForURL(page, `${base}/barbearias`);
      await open(); assert.ok((await drawer().locator('nav > div').last().getAttribute('class')).includes('mt-auto'));
      await drawer().getByRole('button', { name:'Sair da demonstração',exact:true }).click(); await closed();
      assert.equal(await banner().getByRole('button', { name:'Notificações',exact:true }).count(),0);
      assert.equal(await banner().getByRole('link', { name:'Perfil',exact:true }).count(),0);
      await open(); assert.ok((await drawer().locator('nav > div').last().getAttribute('class')).includes('my-auto'));
      await page.keyboard.press('Escape');
    });
    await check('movimento reduzido: ações aprovadas sem ampliação no hover', async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width:1440,height:900 }); await loadPage(page, `${base}/barbearias`);
      const action = banner().getByRole('link', { name:'Criar conta',exact:true }); await action.hover();
      assert.equal(await action.evaluate(el => getComputedStyle(el).transform), 'none');
      await action.focus(); assert.notEqual(await action.evaluate(el => getComputedStyle(el).outlineStyle), 'none');
    });
    assert.deepEqual(errors, []);
  } finally {
    observations.pageErrors = errors;
    fs.writeFileSync(path.join(dir,'results.json'), JSON.stringify({ observations, results }, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
