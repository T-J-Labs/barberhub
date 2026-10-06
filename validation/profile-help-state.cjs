const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('../frontend/node_modules/typescript');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('exports', 'require', code)(exports, (specifier) => load(`${specifier.startsWith('@/') ? path.resolve(__dirname, '../frontend/src', specifier.slice(2)) : path.resolve(path.dirname(file), specifier)}.ts`));
  return exports;
}

const root = path.resolve(__dirname, '../frontend/src/features');
const { validateDemoName } = load(root+'/demo-profile/name.ts');
const { helpNavigation } = load(root+'/role-help/navigation.ts');
const { resolvePlatformNavigation } = load(root+'/auth/routing.ts');
let count=0;
function check(name,fn){fn();console.log('PASS',name);count++;}
check('nome preserva acentos, espaços internos e remove extremidades',()=>assert.deepEqual(validateDemoName('  João  da Conceição  '),{name:'João  da Conceição',error:null}));
check('vazio e somente espaços são rejeitados',()=>{for(const name of ['', '   ', '\t\n']) assert.equal(validateDemoName(name).name,null)});
check('nome longo não é truncado',()=>assert.equal(validateDemoName('Á'.repeat(500)).name.length,500));
const platform=resolvePlatformNavigation('localhost:3000',undefined,true);
check('contexto conhecido usa helpers de perfil e booking',()=>{const links=helpNavigation(platform,'demo-esquina','cliente');assert.equal(links.profile,'http://demo-esquina.localhost:3000/');assert.equal(links.booking,'http://demo-esquina.localhost:3000/agendar');for(const mode of ['login','signup']){const url=new URL(links[mode]);assert.equal(url.searchParams.get('barbearia'),'demo-esquina');assert.equal(url.searchParams.get('returnTo'),links.profile)}});
check('contexto ausente, repetido, tenant livre e URL arbitrária usam catálogo',()=>{for(const value of [undefined,['demo-esquina','demo-navalha'],'desconhecido','https://externo.test','demo-esquina/../demo-navalha']){const links=helpNavigation(platform,value,'cliente');assert.equal(links.profile,'/barbearias');assert.equal(links.booking,'/barbearias');assert.equal(new URL(links.login).searchParams.get('barbearia'),null)}});
check('Host inválido não produz destinos de acesso ou subdomínio',()=>{for(const host of ['externo.test','127.0.0.1:3000','localhost:99999']){const links=helpNavigation(resolvePlatformNavigation(host,undefined,true),'demo-esquina','cliente');assert.equal(links.profile,'/barbearias');assert.equal(links.booking,'/barbearias');assert.equal(links.login,null);assert.equal(links.signup,null)}});
check('barbeiro mantém intenção de perfil sem conceder papel',()=>{const url=new URL(helpNavigation(platform,undefined,'barbeiro').signup);assert.equal(url.searchParams.get('perfil'),'barbeiro')});
console.log(count+' grupos aprovados. Estado React verificado no teste de navegador.');
