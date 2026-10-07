const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const sharp = require(require.resolve('sharp', { paths: [path.join(__dirname, '../frontend')] }));
const root = path.join(__dirname, '..');
const design = path.join(root, 'docs/design/landing-product-first');
const output = path.join(root, 'frontend/public/landing');
const manifestPath = path.join(design, 'capture-manifest-production.json');
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const sizes = {};
  for (const record of manifest.captures) {
    const name = path.basename(record.file, '.png');
    const files = [];
    for (const dpr of [1, 2]) {
      const source = path.join(dpr === 1 ? path.join(design, 'captures-v2') : path.join(__dirname, 'qa-runs/landing-retina'), `${name}.png`);
      const metadata = await sharp(source).metadata();
      assert.equal(metadata.width, record.clip.width * dpr, name);
      assert.equal(metadata.height, record.clip.height * dpr, name);
      const file = `${name}${dpr === 2 ? '@2x' : ''}.webp`;
      await sharp(source).webp({ lossless: true, effort: 6 }).toFile(path.join(output, file));
      files.push({ file: `/landing/${file}`, dpr, width: metadata.width, height: metadata.height, bytes: fs.statSync(path.join(output, file)).size });
    }
    record.assets = files;
    sizes[name] = { width: record.clip.width, height: record.clip.height };
  }
  manifest.encoding = 'WebP lossless, original DPR 1 and freshly captured DPR 2; no resizing or upscaling';
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(root, 'frontend/src/features/public-home/demo-captures.json'), JSON.stringify(sizes, null, 2));
  console.log('PASS: 20 capturas, 40 WebP sem perdas', manifest.captures.reduce((sum, r) => sum + r.assets.reduce((n, a) => n + a.bytes, 0), 0), 'bytes');
})().catch(error => { console.error(error); process.exitCode = 1; });
