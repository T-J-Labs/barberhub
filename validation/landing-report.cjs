const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const output = path.join(root, 'docs/design/landing-product-first/implementation-review');
fs.mkdirSync(output, { recursive: true });
const runs = path.join(__dirname, 'qa-runs/landing');
const before = JSON.parse(fs.readFileSync(path.join(runs, 'before/comparison.json')));
const after = JSON.parse(fs.readFileSync(path.join(runs, 'after/comparison.json')));
const production = JSON.parse(fs.readFileSync(path.join(runs, 'browser-3132/results.json')));
const development = JSON.parse(fs.readFileSync(path.join(runs, 'browser-3000/results.json')));
assert.equal(development.passed, true, 'QA de desenvolvimento incompleto');
assert.equal(production.passed, true, 'QA de produção incompleto');
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const performance = [390, 1440].map(width => {
  const summary = report => {
    const samples = report.performance.filter(r => r.width === width);
    return Object.fromEntries(['lcp','cls','bytes','jsBytes','imageBytes'].map(key => [key, median(samples.map(r => r[key]))]));
  };
  return { width, before: summary(before), after: summary(after) };
});
fs.writeFileSync(path.join(output, 'qa-results.json'), JSON.stringify({ capturedAt: new Date().toISOString(), browser: production.browser, performanceConditions: 'Three fresh contexts at each width; DPR 1; CPU 4x; latency 40ms; download 1.5MiB/s; viewport height 900; local production builds; no Lighthouse or field metrics', performance, regression: after.regression, development: { widths: development.widths.map(r => r.width), errors: development.errors, accessibility: development.accessibility.map(r => ({ width:r.width, violations:r.violations.length })), retina: development.retina, navigation: development.navigation }, production: { widths: production.widths.map(r => r.width), errors: production.errors, accessibility: production.accessibility.map(r => ({ width:r.width, violations:r.violations.length })), retina: production.retina }, beforeSamples: before.performance, afterSamples: after.performance }, null, 2));
for (const file of ['hero-390.png','hero-1440.png','complete-390.png','complete-1440.png','produto-1440.png','agendamento-cliente-1440.png','servicos-1440.png','preco-390.png','menu-390.png']) fs.copyFileSync(path.join(runs, 'browser-3132', file), path.join(output, file));
console.log(JSON.stringify(performance, null, 2));
