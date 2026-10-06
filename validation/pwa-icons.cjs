// Deriva o lettering do HeaderBrand usando a fonte realmente carregada pelo app.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${process.argv[2] || 3110}/barbearias`);
  await page.evaluate(() => document.fonts.ready);
  const destination = path.join(__dirname, '../frontend/public/pwa');
  fs.mkdirSync(destination, { recursive: true });
  for (const [name, size, maskable] of [['icon-192.png', 192, false], ['icon-512.png', 512, false], ['maskable-512.png', 512, true], ['apple-180.png', 180, false]]) {
    const data = await page.evaluate(({ size, maskable }) => {
      const family = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-sans') || getComputedStyle(document.querySelector('header a')).fontFamily;
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#07111C'; ctx.fillRect(0, 0, size, size);
      // Quebra de linha do mesmo nome, sem novo símbolo. Dentro do círculo seguro.
      ctx.font = `700 ${size * (maskable ? .135 : .16)}px ${family}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF'; ctx.fillText('BARBER', size / 2, size * .40);
      ctx.fillStyle = '#0EA5E9'; ctx.fillText('HUB', size / 2, size * .59);
      return canvas.toDataURL('image/png').split(',')[1];
    }, { size, maskable });
    fs.writeFileSync(path.join(destination, name), Buffer.from(data, 'base64'));
  }
  await page.setViewportSize({ width: 650, height: 220 });
  await page.setContent(`<body style="margin:24px;background:#172535;color:white;font:14px Arial">
    <p>Marca em 32, 48 e 64px; máscara circular em 64px; Apple em 64px</p>
    <div style="display:flex;gap:24px;align-items:center">
      ${[32,48,64].map(size => `<img width="${size}" height="${size}" src="http://localhost:${process.argv[2] || 3110}/pwa/icon-192.png">`).join('')}
      <img width="64" height="64" style="border-radius:50%" src="http://localhost:${process.argv[2] || 3110}/pwa/maskable-512.png">
      <img width="64" height="64" src="http://localhost:${process.argv[2] || 3110}/pwa/apple-180.png">
    </div>`);
  await page.waitForLoadState('networkidle');
  fs.mkdirSync(path.join(__dirname, 'pwa'), { recursive: true });
  await page.screenshot({ path: path.join(__dirname, 'pwa/icons-preview.png') });
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
