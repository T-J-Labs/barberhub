const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('./tools/node_modules/playwright');
const sharp = require(require.resolve('sharp', { paths: [path.join(__dirname, '../frontend')] }));
const mode = process.argv[2] || 'before';
const productionPort = process.argv[3] || '3130';
const dir = path.join(__dirname, 'qa-runs/landing', mode);
fs.mkdirSync(dir, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { mode, browser: browser.version(), regression: [], performance: [] };
  try {
    const page = await browser.newPage();
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [name, route] of [['catalog','/barbearias'],['login','/login'],['signup','/cadastro?perfil=barbearia'],['client','/cliente/agendamentos'],['barber','/barbeiro'],['admin','/admin/agenda'],['superadmin','/super-admin']]) {
        await page.goto(`http://localhost:${productionPort}${route}`, { waitUntil: 'networkidle' });
        await page.getByRole('heading', { level: 1 }).waitFor();
        await page.evaluate(() => document.fonts.ready);
        const file = `${name}-${width}.png`;
        await page.screenshot({ path: path.join(dir, file), fullPage: true, animations: 'disabled', style: 'nextjs-portal{visibility:hidden}' });
        if (mode === 'after') {
          const before = await sharp(path.join(dir, '../before', file)).raw().toBuffer({ resolveWithObject: true });
          const after = await sharp(path.join(dir, file)).raw().toBuffer({ resolveWithObject: true });
          assert.deepEqual(after.info, before.info, `${file}: dimensões alteradas`);
          assert.ok(before.data.equals(after.data), `${file}: pixels alterados`);
        }
        report.regression.push({ name, width, unchanged: mode === 'after' });
      }
    }
    await page.close();
    for (const width of [390, 1440]) for (let run = 1; run <= 3; run++) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const sample = await context.newPage();
      const cdp = await context.newCDPSession(sample);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: 1.5 * 1024 * 1024, uploadThroughput: 750 * 1024 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await sample.addInitScript(() => {
        window.landingVitals = { lcp: 0, cls: 0 };
        new PerformanceObserver(list => { for (const entry of list.getEntries()) window.landingVitals.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.landingVitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      await sample.goto(`http://localhost:${productionPort}/`, { waitUntil: 'networkidle' });
      const metrics = await sample.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const nav = performance.getEntriesByType('navigation')[0];
        return { ...window.landingVitals, ttfb: nav.responseStart, bytes: nav.transferSize + resources.reduce((sum, r) => sum + r.transferSize, 0), jsBytes: resources.filter(r => /\.js(?:\?|$)/.test(r.name)).reduce((sum, r) => sum + r.transferSize, 0), imageBytes: resources.filter(r => r.initiatorType === 'img').reduce((sum, r) => sum + r.transferSize, 0), imageRequests: resources.filter(r => r.initiatorType === 'img').map(r => r.name) };
      });
      report.performance.push({ width, run, ...metrics });
      console.log('performance', width, run, metrics);
      await context.close();
    }
  } finally {
    fs.writeFileSync(path.join(dir, 'comparison.json'), JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
