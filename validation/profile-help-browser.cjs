const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('./qa-browser.cjs');
const base = `http://localhost:${process.argv[2] || 3000}`;
const results = [];
const artifactDir = process.env.PROFILE_QA_OUTPUT || require('./qa-output.cjs').outputDirectory('profile-help-browser');
fs.mkdirSync(artifactDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  async function check(name, action) { await action(); results.push({ name, passed: true }); console.log('PASS', name); }
  const field = () => page.getByRole('textbox', { name: 'Nome de exibição', exact: true });
  const applied = () => page.getByRole('complementary', { name: 'Nome aplicado à demonstração' });
  async function apply(name) { await field().fill(name); await page.getByRole('button', { name: 'Aplicar à demonstração', exact: true }).click(); }
  async function link(href) {
    await page.evaluate(destination => {
      const a = document.createElement('a'); a.href = destination; a.textContent = 'QA sair'; a.id = 'qa-exit'; document.body.append(a);
    }, href);
    await page.locator('#qa-exit').click();
    await page.waitForURL(href);
  }
  try {
    for (const role of ['cliente', 'barbeiro']) {
      const initial = role === 'cliente' ? 'Cliente de demonstração' : 'Rafael Lima (fictício)';
      await page.goto(`${base}/${role}/perfil`);
      await check(`${role}: visitante direto e somente um campo editável`, async () => {
        await field().waitFor(); assert.equal(await page.locator('main input').count(), 1);
        if (role === 'cliente') assert.equal(await page.getByRole('link', { name: 'Entrar', exact: true }).count(), 1);
        assert.ok((await page.locator('main').innerText()).includes('Google não são alterados'));
        assert.equal(await context.cookies().then(x => x.length), 0);
      });
      await check(`${role}: rascunho separado, trim e acentos`, async () => {
        await field().fill('  João  da Conceição  ');
        assert.ok((await applied().textContent()).includes(initial));
        await page.getByRole('button', { name: 'Aplicar à demonstração', exact: true }).click();
        assert.equal(await field().inputValue(), 'João  da Conceição');
        assert.ok((await applied().textContent()).includes('João  da Conceição'));
        assert.ok((await page.locator('main [role=status]').innerText()).includes('Nada foi salvo'));
      });
      await check(`${role}: vazio e espaços preservam rascunho e aplicado`, async () => {
        for (const value of ['', '   ']) {
          await apply(value); assert.equal(await field().inputValue(), value);
          assert.equal(await field().getAttribute('aria-invalid'), 'true');
          assert.ok((await field().getAttribute('aria-describedby')).includes('name-error'));
          assert.equal(await field().evaluate(el => el === document.activeElement), true);
          assert.ok((await applied().textContent()).includes('João  da Conceição'));
        }
      });
      await check(`${role}: cancelar e restaurar`, async () => {
        await page.getByRole('button', { name: 'Cancelar edição', exact: true }).click();
        assert.equal(await field().inputValue(), 'João  da Conceição');
        await page.getByRole('button', { name: 'Restaurar exemplo', exact: true }).click();
        assert.equal(await field().inputValue(), initial);
      });
      await apply('Érica Souza');
      await check(`${role}: navegação interna mantém aplicado e descarta rascunho`, async () => {
        await field().fill('Rascunho não aplicado');
        await page.getByRole('link', { name: `Consultar ajuda do ${role}` }).click();
        await page.getByRole('link', { name: /Editar nome demonstrativo/ }).click();
        assert.equal(await field().inputValue(), 'Érica Souza');
      });
      await check(`${role}: recarga restaura exemplo`, async () => {
        await page.reload(); assert.equal(await field().inputValue(), initial);
      });
      await apply('Nome temporário');
      await check(`${role}: sair e retornar reinicia, papéis independentes`, async () => {
        const other = role === 'cliente' ? 'barbeiro' : 'cliente';
        await link(`${base}/${other}/perfil`);
        assert.equal(await field().inputValue(), other === 'cliente' ? 'Cliente de demonstração' : 'Rafael Lima (fictício)');
        await page.getByRole('link', { name: `Consultar ajuda do ${other}` }).waitFor();
        await link(`${base}/${role}/perfil`);
        assert.equal(await field().inputValue(), initial);
      });
      await page.setViewportSize({ width: 390, height: 900 });
      await page.screenshot({ path: path.join(artifactDir, `profile-${role}-normal-390.png`), fullPage: true });
      await apply('Á'.repeat(300));
      for (const width of [320, 390, 768, 1440]) {
        await check(`${role}: perfil ${width}px sem corte horizontal`, async () => {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.equal((await applied().locator('p').nth(1).innerText()).length, 300);
          await page.screenshot({ path: path.join(artifactDir, `profile-${role}-${width}.png`), fullPage: true });
        });
      }
      await page.goto(`${base}/${role}/ajuda`);
      for (const width of [320, 390, 768, 1440]) {
        await check(`${role}: ajuda ${width}px e perguntas por teclado`, async () => {
          await page.setViewportSize({ width, height: 900 });
          const summaries = page.locator('main summary');
          for (let i = 0; i < await summaries.count(); i++) {
            await summaries.nth(i).focus(); await page.keyboard.press('Enter');
            assert.equal(await summaries.nth(i).evaluate(el => el.parentElement.open), true);
            await page.keyboard.press('Enter');
            await summaries.nth(i).click();
            assert.equal(await summaries.nth(i).evaluate(el => el.parentElement.open), true);
            await summaries.nth(i).click();
          }
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          await page.screenshot({ path: path.join(artifactDir, `help-${role}-${width}.png`), fullPage: true });
        });
      }
      await check(`${role}: todos os atalhos com mouse e teclado, sem destinos cruzados`, async () => {
        const links = await page.locator('main a').evaluateAll(els => els.map(el => ({ text: el.innerText, href: el.href })));
        for (const { text, href } of links) {
          assert.ok(!href.includes(role === 'cliente' ? '/barbeiro/' : '/cliente/'));
          for (const method of ['mouse', 'keyboard']) {
            await page.goto(`${base}/${role}/ajuda`);
            const target = page.getByRole('link', { name: text, exact: false });
            if (method === 'mouse') await target.click(); else { await target.focus(); await page.keyboard.press('Enter'); }
            await page.waitForURL(href);
            assert.equal(await page.getByText('404', { exact: true }).count(), 0);
          }
        }
      });
    }
    await check('cliente: prévia ativa coerente sem iniciar sessão pelo perfil', async () => {
      await page.goto(`${base}/login`);
      await page.getByText('Ver prévia do header de cliente', { exact: true }).click();
      await page.getByRole('button', { name: 'Visualizar header de cliente' }).click();
      // Next Link supplied by the feature, using the same root presentation provider.
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      await page.locator('dialog[open]').getByRole('link', { name: 'Perfil', exact: true }).click();
      await apply('Cláudia da Silva');
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      assert.equal(await page.locator('dialog[open]').getByText('Cláudia da Silva', { exact: true }).count(), 1);
      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      await page.getByRole('link', { name: 'Ajuda', exact: true }).click();
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      assert.equal(await page.locator('dialog[open]').getByText('Cláudia da Silva', { exact: true }).count(), 1);
      await page.keyboard.press('Escape');
      await page.getByRole('link', { name: /Editar nome demonstrativo/ }).click();
      await apply('Á'.repeat(300));
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
        assert.equal(await page.locator('dialog[open]').getByText('Á'.repeat(300), { exact: true }).count(), 1);
        await page.keyboard.press('Escape');
      }
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      await page.getByRole('button', { name: 'Sair da demonstração', exact: true }).click();
      await page.getByRole('link', { name: 'Entrar', exact: true }).waitFor();
      assert.equal(await field().inputValue(), 'Cliente de demonstração');
    });
    await check('barbeiro: controle Perfil e apresentação da agenda coerentes', async () => {
      await page.goto(`${base}/barbeiro`);
      await page.getByRole('link', { name: 'Perfil', exact: true }).click();
      await apply('Márcio da Silva');
      await page.getByRole('link', { name: 'Consultar ajuda do barbeiro' }).click();
      await page.getByRole('link', { name: /Consultar e experimentar a agenda/ }).click();
      await page.waitForURL(`${base}/barbeiro/agenda`);
      await page.getByRole('heading', { name: 'Minha agenda', exact: true }).waitFor();
      assert.ok((await page.locator('main header').innerText()).includes('Márcio da Silva'));
    });
    await check('barbeiro: Perfil e Ajuda no menu com mouse e teclado', async () => {
      for (const destination of ['Perfil', 'Ajuda']) {
        for (const keyboard of [false, true]) {
          await page.goto(`${base}/barbeiro`);
          await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
          const item = page.locator('#account-navigation').getByRole('link', { name: destination, exact: true });
          if (keyboard) { await item.focus(); await page.keyboard.press('Enter'); } else await item.click();
          await page.waitForURL(`${base}/barbeiro/${destination === 'Perfil' ? 'perfil' : 'ajuda'}`);
          assert.equal(await page.locator('#account-navigation').isVisible(), false);
        }
      }
    });
    await check('cliente: contexto validado, subdomínio e acesso preservam retorno', async () => {
      const url = `${base}/cliente/ajuda?barbearia=demo-esquina`;
      for (const keyboard of [false, true]) {
        await page.goto(url);
        const target = page.getByRole('link', { name: /Perfil público da barbearia/ });
        if (keyboard) { await target.focus(); await page.keyboard.press('Enter'); } else await target.click();
        await page.waitForURL(`http://demo-esquina.localhost:${process.argv[2] || 3000}/`);
        await page.goto(url);
        const booking = page.getByRole('link', { name: /Experimentar o agendamento/ });
        if (keyboard) { await booking.focus(); await page.keyboard.press('Enter'); } else await booking.click();
        await page.waitForURL(`http://demo-esquina.localhost:${process.argv[2] || 3000}/agendar`);
        for (const mode of ['acesso', 'cadastro']) {
          await page.goto(url);
          const accessLink = page.getByRole('link', { name: new RegExp(`Consultar tela de ${mode}`) });
          const destination = await accessLink.getAttribute('href');
          if (keyboard) { await accessLink.focus(); await page.keyboard.press('Enter'); } else await accessLink.click();
          await page.waitForURL(destination);
          assert.equal(new URL(page.url()).searchParams.get('barbearia'), 'demo-esquina');
          assert.equal(new URL(page.url()).searchParams.get('returnTo'), `http://demo-esquina.localhost:${process.argv[2] || 3000}/`);
          assert.equal(await page.locator('button').filter({ hasText: 'Google' }).first().isDisabled(), true);
        }
      }
      await page.goto(url);
      const access = new URL(await page.getByRole('link', { name: /Consultar tela de acesso/ }).getAttribute('href'));
      assert.equal(access.searchParams.get('returnTo'), `http://demo-esquina.localhost:${process.argv[2] || 3000}/`);
    });
    await check('admin: defaults e destinos existentes preservados', async () => {
      for (const route of ['/admin/configuracoes', '/admin/ajuda']) {
        await page.goto(base + route);
        assert.equal(await page.locator('main h1').count(), 1);
        const eyebrow = page.locator('main header > p').first();
        assert.equal(await eyebrow.evaluate(el => getComputedStyle(el).color), 'rgb(101, 213, 255)');
      }
    });
    await check('HTTP: Host inválido e contexto repetido/ausente não geram destinos arbitrários', async () => {
      for (const role of ['cliente', 'barbeiro']) {
        const invalid = await context.request.get(`${base}/${role}/ajuda?barbearia=demo-esquina`, { headers: { Host: 'externo.test', 'X-Forwarded-Host': 'demo-esquina.localhost:3000' } });
        const html = await invalid.text();
        assert.ok(html.includes('Acesso à conta indisponível neste endereço'));
        assert.ok(!html.includes('href="http://demo-esquina.localhost:3000/agendar"'));
        const repeated = await context.request.get(`${base}/${role}/ajuda?barbearia=demo-esquina&barbearia=demo-navalha`);
        assert.ok(!(await repeated.text()).includes('href="http://demo-esquina.localhost:3000/agendar"'));
      }
    });
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => localStorage.length), 0);
    assert.equal((await context.cookies()).length, 0);
  } finally {
    fs.writeFileSync(path.join(artifactDir, 'profile-help-browser-results.json'), JSON.stringify({ results, errors, screenReader: 'Não executado; inspeção DOM e visual separada.' }, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
