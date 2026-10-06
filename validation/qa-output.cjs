const fs = require('node:fs'), path = require('node:path');
const { spawnSync } = require('node:child_process');
function outputDirectory(suite) {
  if (process.env.QA_SUITE_OUTPUT) return process.env.QA_SUITE_OUTPUT;
  const root = path.resolve(process.env.TEST_OUTPUT || path.join(__dirname, 'qa-runs'));
  fs.mkdirSync(root, { recursive: true });
  const dir = fs.mkdtempSync(path.join(root, `${new Date().toISOString().replaceAll(':', '-')}-${suite}-`));
  const code = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: __dirname, encoding: 'utf8' }).stdout?.trim();
  fs.writeFileSync(path.join(dir, 'execution.json'), JSON.stringify({ started: new Date().toISOString(), code,
    command: process.argv, node: process.version, requestedEnvironment: process.env.TEST_ENV || 'Não explicitado; prefira o agregador',
    browser: process.env.TEST_BROWSER || 'chromium', channel: process.env.PLAYWRIGHT_CHANNEL,
    limitations: ['Execução individual: use o agregador para probe/relatório completo de ambiente e resultados'] }, null, 2));
  console.log('Evidências individuais:', dir);
  return dir;
}
module.exports = { outputDirectory };
