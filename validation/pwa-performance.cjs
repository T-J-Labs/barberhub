const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
  const samples = [];
  for (let i = 0; i < 3; i++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.goto(`http://localhost:${process.argv[2] || 3110}/barbearias`);
    await page.waitForLoadState('networkidle');
    samples.push(await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      return { ttfbMs: nav.responseStart, domContentLoadedMs: nav.domContentLoadedEventEnd,
        fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        transferredBytes: resources.reduce((sum, r) => sum + r.transferSize, nav.transferSize),
        jsBytes: resources.filter(r => r.name.includes('.js')).reduce((sum, r) => sum + r.transferSize, 0),
        fonts: resources.filter(r => r.initiatorType === 'css' || r.name.includes('.woff')).map(r => ({ url: new URL(r.name).pathname, bytes: r.transferSize })) };
    }));
    await context.close();
  }
  const report = { browser: browser.version(), conditions: 'Edge headless; 390px; localhost; sem throttling; 3 contextos frios; SW bloqueado para comparação', samples };
  fs.writeFileSync(path.join(__dirname, `pwa-performance-${process.argv[3] || 'before'}.json`), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
