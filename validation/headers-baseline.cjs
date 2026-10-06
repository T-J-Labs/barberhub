const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const port = process.argv[2] || 3000;
const dir = path.join(__dirname, 'headers', 'before');
fs.mkdirSync(dir, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
  const page = await browser.newPage();
  const observations = { browser: browser.version(), port, states: [] };
  try {
    for (const [name, host, route] of [
      ['landing', 'localhost', '/'], ['catalog', 'localhost', '/barbearias'],
      ['public-profile', 'demo-esquina.localhost', '/'], ['booking', 'demo-esquina.localhost', '/agendar'],
      ['login', 'localhost', '/login'], ['signup', 'localhost', '/cadastro'],
      ['client', 'localhost', '/cliente/agendamentos'], ['barber', 'localhost', '/barbeiro'],
      ['admin', 'localhost', '/admin'], ['superadmin', 'localhost', '/super-admin'],
    ]) {
      await page.goto(`http://${host}:${port}${route}`);
      await page.getByRole('banner').waitFor();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        const metrics = await page.getByRole('banner').evaluate(el => {
          const box = el.getBoundingClientRect();
          return { height: box.height, horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
            controls: [...el.querySelectorAll('a,button')].filter(x => x.checkVisibility()).map(x => {
              const r = x.getBoundingClientRect();
              return { label: x.getAttribute('aria-label') || x.textContent, width: r.width, height: r.height, x: r.x, right: r.right };
            }) };
        });
        observations.states.push({ name, width, ...metrics });
        await page.screenshot({ path: path.join(dir, `${name}-${width}.png`) });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      const trigger = page.getByRole('button', { name: 'Abrir menu', exact: true });
      if (await trigger.isVisible().catch(() => false)) {
        await trigger.click();
        await page.getByRole('button', { name: 'Fechar menu', exact: true }).waitFor();
        await page.screenshot({ path: path.join(dir, `${name}-menu.png`) });
        await page.keyboard.press('Escape');
        observations.states.push({ name, interaction: 'open/Escape', expandedAfterEscape: await trigger.getAttribute('aria-expanded'), overflowAfterEscape: await page.evaluate(() => document.body.style.overflow) });
      }
    }
    await page.goto(`http://localhost:${port}/login`);
    await page.getByText('Ver prévia do header de cliente', { exact: true }).click();
    await page.getByRole('button', { name: 'Visualizar header de cliente', exact: true }).click();
    await page.locator('header summary').click();
    await page.screenshot({ path: path.join(dir, 'client-preview-menu.png') });
    observations.states.push({ name: 'client-preview', menu: 'details', modal: await page.locator('header dialog[open]').count() });
    await page.keyboard.press('Escape');
    await page.locator('header summary').click();
    await page.getByRole('button', { name: 'Sair da demonstração', exact: true }).click();
    await page.getByRole('button', { name: 'Visualizar header de cliente', exact: true }).waitFor();
    observations.states.push({ name: 'client-preview', interaction: 'start/exit/restart available' });
  } finally {
    fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify(observations, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify(observations.states.filter(x => x.width === 320 || x.interaction || x.menu), null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });


