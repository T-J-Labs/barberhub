// Validação de segurança da navegação, sem browser, rede ou contrato fictício.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('../frontend/node_modules/typescript');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('exports', 'require', code)(exports, (specifier) => {
    assert(specifier.startsWith('@/'), `Importação inesperada: ${specifier}`);
    return load(path.resolve(__dirname, '../frontend/src', `${specifier.slice(2)}.ts`));
  });
  return exports;
}
const routing = load(path.resolve(__dirname, '../frontend/src/features/auth/routing.ts'));
let checks = 0;
function check(label, action) { action(); checks++; console.log('PASS', label); }
const origin = 'https://barberhub.test'; // Host reservado exclusivamente para teste.
const shop = 'demo-esquina';
const fallback = 'https://demo-esquina.barberhub.test/';
for (const destination of [fallback]) {
  check(`retorno permitido: ${destination}`, () => assert.equal(routing.validateAuthContext(origin, shop, destination).returnTo, destination));
}
for (const destination of [
  'https://externo.test/', '//externo.test', 'javascript:alert(1)', 'data:text/html,oi',
  '/barbearias/demo-esquina', `${origin}/barbearias/demo-esquina`,
  '/admin', '/login', '/barbearias/demo-navalha', '/barbearias/demo-esquina/../demo-navalha',
  '/barbearias/%64emo-esquina', '/barbearias/demo-esquina?returnTo=https://externo.test',
  '/barbearias/demo-esquina#agenda', '\\externo.test', '%2f%2fexterno.test',
  'https://barberhub.test.externo.test/barbearias/demo-esquina',
  'https://barberhub.test@externo.test/barbearias/demo-esquina',
  'https://usuario@demo-esquina.barberhub.test/', 'https://demo-esquina.barberhub.test:444/',
  'http://demo-esquina.barberhub.test/', 'https://demo-navalha.barberhub.test/',
  'https://demo-esquina.barberhub.test/?q=1', 'https://demo-esquina.barberhub.test/#agenda',
  'https://demo-esquina.barberhub.test/..', ' https://demo-esquina.barberhub.test/',
  ['https://demo-esquina.barberhub.test/', 'https://externo.test/'], undefined,
]) {
  check(`retorno descartado: ${JSON.stringify(destination)}`, () => assert.equal(routing.validateAuthContext(origin, shop, destination).returnTo, fallback));
}
check('sem barbearia não há retorno arbitrário', () => assert.deepEqual(routing.validateAuthContext(origin, null, 'https://externo.test/'), { barbershop: null, returnTo: '/barbearias' }));
check('chave inválida descartada', () => assert.equal(routing.validateAuthContext(origin, '../admin', fallback).barbershop, null));
check('produção sem configuração indisponível', () => assert.equal(routing.resolvePlatformNavigation('host-arbitrario.test', undefined, false).origin, null));
check('origem de produção usa configuração existente', () => assert.equal(routing.resolvePlatformNavigation('externo.test', 'barberhub.test', false).origin, origin));
check('host arbitrário não é plataforma', () => assert.equal(routing.resolvePlatformNavigation('externo.test', 'barberhub.test', false).isTrustedHost, false));
check('porta arbitrária em produção descartada', () => assert.equal(routing.resolvePlatformNavigation('barberhub.test:444', 'barberhub.test', false).isTrustedHost, false));
check('plataforma de produção válida', () => assert.equal(routing.resolvePlatformNavigation('barberhub.test:443', 'barberhub.test', false).isPlatform, true));
check('subdomínio de produção válido', () => assert.equal(routing.resolvePlatformNavigation('demo-esquina.barberhub.test', 'barberhub.test', false).hostSubdomain, shop));
check('subdomínio aninhado descartado', () => assert.equal(routing.resolvePlatformNavigation('evil.demo-esquina.barberhub.test', 'barberhub.test', false).isTrustedHost, false));
check('configuração malformada descartada', () => assert.equal(routing.resolvePlatformNavigation('localhost', 'https://externo.test', true).origin, null));
const local = routing.resolvePlatformNavigation('demo-esquina.localhost:3101', undefined, true);
check('desenvolvimento mantém porta e domínio principal', () => assert.equal(local.origin, 'http://localhost:3101'));
check('IP local não autoriza plataforma', () => assert.equal(routing.resolvePlatformNavigation('127.0.0.1:3101', undefined, true).isPlatform, false));
check('porta inválida descartada', () => assert.equal(routing.resolvePlatformNavigation('localhost:99999', undefined, true).origin, null));
const context = routing.publicClientContext('/', local);
check('origem por subdomínio preserva perfil público', () => assert.equal(context.returnTo, 'http://demo-esquina.localhost:3101/'));
for (const mode of ['login', 'cadastro']) {
  check(`${mode} aponta à plataforma e mantém contexto`, () => {
    const url = new URL(routing.clientAuthHref(local.origin, mode, context));
    assert.equal(url.origin, 'http://localhost:3101');
    assert.equal(url.searchParams.get('barbearia'), shop);
    assert.equal(url.searchParams.get('returnTo'), context.returnTo);
  });
}
check('sem domínio não gera link relativo de autenticação', () => assert.equal(routing.clientAuthHref(null, 'login', context), null));
check('retorno final revalidado', () => assert.equal(routing.platformReturnHref(origin, { barbershop: shop, returnTo: 'https://externo.test/' }), fallback));
check('sem origem configurada não inventa subdomínio', () => assert.equal(routing.validateAuthContext(null, shop, undefined).returnTo, '/barbearias/demo-esquina'));
check('contexto no perfil da plataforma também retorna ao subdomínio', () => assert.equal(routing.publicClientContext('/barbearias/demo-esquina', routing.resolvePlatformNavigation('barberhub.test', 'barberhub.test', false)).returnTo, fallback));
for (const profile of ['cliente', 'barbeiro', 'barbearia']) {
  check(`perfil permitido: ${profile}`, () => assert.equal(routing.isAccountType(profile), true));
  for (const mode of ['login', 'cadastro']) {
    check(`${profile} preservado em ${mode} sem modificar retorno`, () => {
      const url = new URL(routing.clientAuthHref(local.origin, mode, context, profile));
      assert.equal(url.searchParams.get('perfil') ?? 'cliente', profile);
      assert.equal(url.searchParams.get('barbearia'), shop);
      assert.equal(url.searchParams.get('returnTo'), context.returnTo);
    });
  }
}
for (const value of ['admin', 'super-admin', ['barbeiro', 'barbearia'], '', undefined]) {
  check(`perfil inválido: ${JSON.stringify(value)}`, () => assert.equal(routing.isAccountType(value), false));
}
console.log(`${checks} verificações aprovadas.`);
