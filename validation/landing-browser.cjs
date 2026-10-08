const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('./tools/node_modules/playwright');
const port = process.argv[2] || '3000';
const dir = path.join(__dirname, 'qa-runs/landing', `browser-${port}`);
fs.mkdirSync(dir, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { passed: false, browser: browser.version(), port, errors: [], widths: [], accessibility: [], retina: [] };
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  async function decode() {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('img')].filter(img => img.checkVisibility()).map(img => { img.loading = 'eager'; return img.decode(); }));
    });
  }
  try {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`http://localhost:${port}/`);
      await page.getByRole('heading', { level: 1 }).waitFor();
      await decode();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow ${width}`);
      const images = await page.locator('main img').evaluateAll(imgs => imgs.filter(img => img.checkVisibility()).map(img => ({ src: img.currentSrc, complete: img.complete, scale: img.getBoundingClientRect().width / img.naturalWidth, objectFit: getComputedStyle(img).objectFit, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight })));
      for (const img of images) { assert.ok(img.complete); assert.ok(img.scale >= .78, `escala ${width}: ${JSON.stringify(img)}`); assert.notEqual(img.objectFit, 'cover'); assert.ok(Math.abs(img.width / img.height - img.naturalWidth / img.naturalHeight) < .01); }
      const action = page.locator('#inicio a').first();
      assert.equal(await action.getAttribute('href'), '/onboarding/barbearia');
      const colors = await action.evaluate(el => ({ background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }));
      assert.deepEqual(colors, { background: 'rgb(14, 165, 233)', color: 'rgb(7, 17, 28)' });
      assert.match(await page.locator('#preco').innerText(), /Contratação ainda indisponível/);
      const header = page.getByRole('banner');
      assert.match(await header.getByText('Criar conta', { exact: true }).first().getAttribute('href'), /\/cadastro\?perfil=barbearia$/);
      assert.match(await page.getByRole('link', { name: 'Ver exemplo de barbearia', exact: true }).getAttribute('href'), /demo-esquina\.localhost/);
      for (const id of ['inicio','produto','servicos','como-funciona','preco','duvidas','contato','para-quem','diferenciais','cta-final']) assert.equal(await page.locator(`#${id}`).count(), 1, id);
      await page.screenshot({ path: path.join(dir, `complete-${width}.png`), fullPage: true, animations: 'disabled', style: 'nextjs-portal{visibility:hidden}' });
      await page.screenshot({ path: path.join(dir, `hero-${width}.png`), style: 'nextjs-portal{visibility:hidden}' });
      if (width === 390 || width === 1440) for (const id of ['produto','agendamento-cliente','servicos','preco','duvidas']) await page.locator(`#${id}`).screenshot({ path: path.join(dir, `${id}-${width}.png`), animations: 'disabled' });
      const team = page.getByRole('tab', { name: 'Equipe', exact: true });
      await team.click(); await decode();
      assert.equal(await page.locator('#screen-team').isVisible(), true);
      await team.focus(); await page.keyboard.press('ArrowRight'); await decode();
      assert.equal(await page.locator('#screen-settings').isVisible(), true);
      assert.equal(await page.getByRole('tab', { name: 'Funcionamento', exact: true }).getAttribute('aria-selected'), 'true');
      await page.locator('#servicos').screenshot({ path: path.join(dir, `operation-hours-${width}.png`) });
      await page.keyboard.press('Home');
      assert.equal(await page.locator('#screen-services').isVisible(), true);
      const summary = page.getByText('Quanto custa? Já posso contratar?', { exact: true });
      await summary.focus(); await page.keyboard.press('Space');
      assert.equal(await summary.locator('..').getAttribute('open'), '');
      if (width < 768) {
        await page.getByRole('button', { name: 'Profissional', exact: true }).click(); await decode();
        assert.equal(await page.locator('#booking-professional').isVisible(), true);
        assert.equal(await page.locator('#booking-service').isVisible(), false);
        await page.getByRole('button', { name: 'Serviço', exact: true }).click();
      }
      if (width < 1024) {
        await page.evaluate(() => window.scrollTo(0, 0));
        const trigger = header.getByRole('button', { name: 'Abrir menu', exact: true });
        await trigger.focus(); await page.keyboard.press('Enter');
        const drawer = page.locator('dialog[open]'); await drawer.waitFor();
        assert.equal(await page.getByRole('button', { name: 'Fechar menu' }).evaluate(el => el === document.activeElement), true);
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        for (let i = 0; i < 15; i++) { await page.keyboard.press('Tab'); assert.equal(await drawer.evaluate(el => el.contains(document.activeElement)), true); }
        await page.screenshot({ path: path.join(dir, `menu-${width}.png`), style: 'nextjs-portal{visibility:hidden}' });
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => !document.querySelector('dialog[open]'));
        assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
        await trigger.click(); await drawer.getByRole('link', { name: 'Preço', exact: true }).click();
        await page.waitForFunction(() => !document.querySelector('dialog[open]'));
        assert.equal(await page.evaluate(() => location.hash), '#preco');
      }
      const axe = require.resolve('axe-core/axe.min.js', { paths: [path.join(__dirname, 'tools')] });
      await page.addScriptTag({ path: axe });
      const accessibility = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }));
      report.accessibility.push({ width, violations: accessibility.violations });
      assert.equal(accessibility.violations.length, 0, JSON.stringify(accessibility.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
      report.widths.push({ width, images, colors, passed: true });
      console.log('PASS landing', width);
    }
    const retina = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 390, height: 900 } });
    const retinaPage = await retina.newPage();
    await retinaPage.goto(`http://localhost:${port}/`);
    await retinaPage.locator('#inicio img').waitFor();
    const currentSrc = await retinaPage.locator('#inicio img').evaluate(img => img.currentSrc);
    assert.match(currentSrc, /agenda-390@2x\.webp$/);
    report.retina.push({ width: 390, dpr: 2, currentSrc });
    await retina.close();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion:reduce)').matches), true);
    const animations = await page.locator('main, header').evaluateAll(elements => elements.flatMap(el => el.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running')));
    assert.equal(animations.length, 0);
    await page.goto(`http://localhost:${port}/`);
    const loginHref = await page.getByRole('banner').getByRole('link', { name: 'Entrar', exact: true }).first().getAttribute('href');
    if (loginHref.startsWith('http:')) {
      await page.locator('#inicio').getByRole('link', { name: 'Experimentar configuração', exact: true }).click();
      await page.getByRole('heading', { name: 'Configuração do proprietário', exact: true }).waitFor();
      assert.equal(new URL(page.url()).search, '');
      await page.goBack();
      await page.getByRole('link', { name: 'Ver exemplo de barbearia', exact: true }).click();
      await page.getByRole('heading', { name: 'Barbearia da Esquina', exact: true }).waitFor();
      assert.equal(new URL(page.url()).hostname, 'demo-esquina.localhost');
      assert.equal(await page.locator('#institutional-menu').count(), 0);
      await page.goBack();
      await page.getByRole('banner').getByRole('link', { name: 'Criar conta', exact: true }).first().click();
      await page.getByRole('heading', { name: 'Criar sua conta', exact: true }).waitFor();
      assert.equal(new URL(page.url()).searchParams.get('perfil'), 'barbearia');
      assert.equal(await page.getByRole('button', { name: 'Continuar com Google', exact: true }).isDisabled(), true);
      report.navigation = 'CTA de configuração sem origem; perfil público canônico; cadastro de proprietário com Google indisponível: cliques executados em desenvolvimento';
    } else report.navigation = 'URLs HTTPS de produção verificadas por HTTP com Host simulado; DNS/TLS público não certificado';
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } finally {
    fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
