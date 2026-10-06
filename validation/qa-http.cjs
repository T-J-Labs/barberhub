const { httpTestConfig, httpTestRequest, assertHttpTestRuntime } = require('../frontend/tests/http-test-config.mjs');
// Compatibilidade dos comandos históricos; o agregador usa a mesma configuração.
const args = process.argv.slice(2);
if (args.length > 2) throw new Error('Use porta e Host ou TEST_*');
const env = { ...process.env };
if (args[0]) {
  if (env.TEST_PORT && env.TEST_PORT !== args[0]) throw new Error('Porta posicional contradiz TEST_PORT');
  env.TEST_PORT = args[0];
}
if (args[1]) {
  if (env.TEST_ENV && env.TEST_ENV !== 'production') throw new Error('Host posicional de produção contradiz TEST_ENV');
  if (env.TEST_PUBLIC_HOST && env.TEST_PUBLIC_HOST !== args[1]) throw new Error('Host posicional contradiz TEST_PUBLIC_HOST');
  env.TEST_PUBLIC_HOST = args[1];
  env.TEST_ENV = 'production';
}
const config = httpTestConfig(env, []);
const outputDir = require('./qa-output.cjs').outputDirectory(require('node:path').basename(process.argv[1], '.cjs'));
module.exports = { config, outputDir, request: (url, headers) => httpTestRequest(config, url, headers), probe: () => assertHttpTestRuntime(config) };
