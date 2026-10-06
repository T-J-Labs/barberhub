// Ferramentas de QA separadas das dependências do produto.
const playwright = require(process.env.PLAYWRIGHT_MODULE || './tools/node_modules/playwright');
const engine = process.env.TEST_BROWSER || 'chromium';
const selected = playwright[engine];
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
if (!selected) throw new Error(`Navegador inválido: ${engine}`);
function options(value) {
  const result = { ...value };
  if (engine !== 'chromium') delete result.channel;
  else if (!process.env.PLAYWRIGHT_CHANNEL) delete result.channel;
  return result;
}
function cleanupProfile(profile) {
  const resolved = path.resolve(profile), temp = path.resolve(os.tmpdir());
  if (path.dirname(resolved) !== temp || !/^barberhub-(?:zoom-|pwa-qa-)/.test(path.basename(resolved))) throw new Error('Perfil temporário fora do diretório permitido');
  fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
module.exports = { cleanupProfile, chromium: {
  launch: value => selected.launch(options(value)),
  launchPersistentContext: (profile, value) => selected.launchPersistentContext(profile, options(value)),
} };
