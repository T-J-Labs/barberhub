const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const port = process.argv[2] || 3000;
const dir = path.join(__dirname, 'headers', 'zoom');
fs.mkdirSync(dir, { recursive:true });
(async () => {
  // Preferência do navegador num perfil temporário. Não altera o CSS da página.
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'barberhub-zoom-'));
  fs.mkdirSync(path.join(profile, 'Default'));
  const level = Math.log(2) / Math.log(1.2);
  fs.writeFileSync(path.join(profile, 'Default', 'Preferences'), JSON.stringify({ partition: { default_zoom_level: { x: level } } }));
  const context = await chromium.launchPersistentContext(profile, { headless:true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge', viewport:null, args:['--window-size=1440,1000'] });
  const page = await context.newPage();
  const results = [];
  try {
    for (const [name, host, route] of [
      ['landing','localhost','/'], ['catalog','localhost','/barbearias'],
      ['public-profile','demo-esquina.localhost','/'], ['booking','demo-esquina.localhost','/agendar'],
      ['login','localhost','/login'], ['signup','localhost','/cadastro'],
      ['client','localhost','/cliente/agendamentos'], ['barber','localhost','/barbeiro'],
      ['admin','localhost','/admin'], ['superadmin','localhost','/super-admin'],
    ]) {
      await page.goto(`http://${host}:${port}${route}`);
      const metrics = await page.evaluate(() => ({ innerWidth, outerWidth, devicePixelRatio, visualScale:visualViewport.scale, horizontalOverflow:document.documentElement.scrollWidth > innerWidth }));
      assert.equal(metrics.devicePixelRatio, 2); assert.ok(metrics.innerWidth < metrics.outerWidth / 2 + 2);
      assert.equal(metrics.horizontalOverflow, false);
      const banner = page.getByRole('banner');
      const controls = await banner.evaluate(el => [...el.querySelectorAll('a,button')].filter(x => x.checkVisibility()).map(x => {
        const r = x.getBoundingClientRect(); return { x:r.x, right:r.right, width:r.width, height:r.height };
      }));
      for (const c of controls) assert.ok(c.x >= 0 && c.right <= metrics.innerWidth && c.width >=44 && c.height>=44);
      await banner.getByRole('button', { name:'Abrir menu',exact:true }).click();
      const drawer = page.locator('dialog[open]'); await drawer.waitFor();
      const last = drawer.locator('a,button').last(); await last.scrollIntoViewIfNeeded();
      assert.equal(await drawer.evaluate(el => el.scrollWidth <= el.clientWidth), true);
      await page.screenshot({ path:path.join(dir, `${name}-200.png`) });
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('dialog[open]') && document.body.style.overflow !== 'hidden');
      assert.equal(await banner.getByRole('button', { name:'Abrir menu',exact:true }).evaluate(el => el === document.activeElement), true);
      results.push({ name, passed:true, metrics }); console.log('PASS zoom nativo 200%',name);
    }
  } finally {
    fs.writeFileSync(path.join(dir,'results.json'), JSON.stringify({ browser:context.browser().version(), profile, results }, null, 2));
    await context.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
