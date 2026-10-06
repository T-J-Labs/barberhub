const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('../frontend/node_modules/typescript');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('exports', 'require', code)(exports, specifier => load(`${specifier.startsWith('@/') ? path.resolve(__dirname, '../frontend/src', specifier.slice(2)) : path.resolve(path.dirname(file), specifier)}.ts`));
  return exports;
}
const root = path.resolve(__dirname, '../frontend/src/features/superadmin-demo');
const { superadminShopsMock: shops } = load(root + '/mock-data.ts');
const { filterShops, summarizeShops, setDemoStatus, readSearch, listHref, detailsHref } = load(root + '/presentation.ts');
let count = 0;
function check(name, fn) { fn(); count++; console.log('PASS', name); }
check('amostra deriva das seis fixtures públicas, sem dados operacionais', () => {
  assert.equal(shops.length, 6); assert.equal(new Set(shops.map(x => x.id)).size, 6);
  for (const shop of shops) assert.deepEqual(Object.keys(shop).sort(), ['id','subdomain','name','city','neighborhood','initials','demoStatus'].sort());
});
check('busca por nome sem acento, caixa e espaços', () => assert.equal(filterShops(shops, '  RAIZES  ')[0].id, 'demo-raizes'));
check('busca por cidade e bairro', () => {
  assert.equal(filterShops(shops, 'nova iguacu').length, 2);
  assert.equal(filterShops(shops, 'meier')[0].id, 'demo-navalha');
});
check('busca sem resultado e amostra vazia', () => {
  assert.deepEqual(filterShops(shops, 'zzzz'), []); assert.deepEqual(filterShops([], ''), []);
  assert.deepEqual(summarizeShops([]), { total: 0, active: 0, suspended: 0 });
});
check('suspender e reativar atualizam resumo sem mutar fonte pública ou outros exemplos', () => {
  const source = JSON.stringify(shops);
  const suspended = setDemoStatus(shops, 'demo-esquina', 'suspended');
  assert.deepEqual(summarizeShops(suspended), { total: 6, active: 5, suspended: 1 });
  assert.equal(JSON.stringify(shops), source); assert.equal(suspended[1], shops[1]);
  assert.deepEqual(setDemoStatus(suspended, 'demo-esquina', 'active'), shops);
  assert.deepEqual(setDemoStatus(shops, 'unknown', 'suspended'), shops);
});
check('navegação codifica busca, preserva retorno e nunca aceita destino arbitrário', () => {
  for (const query of ['Méier', 'a & b? # /', 'https://externo.test']) {
    const details = new URL(detailsHref('demo-navalha', query), 'http://localhost');
    assert.equal(details.pathname, '/super-admin/barbearias/demo-navalha');
    assert.equal(details.searchParams.get('q'), query);
    assert.equal(new URL(listHref(query), details).searchParams.get('q'), query);
  }
  assert.equal(listHref(''), '/super-admin/barbearias');
});
check('query repetida usa busca vazia', () => {
  assert.equal(readSearch(['a','b']), ''); assert.equal(readSearch(undefined), ''); assert.equal(readSearch('Méier'), 'Méier');
  assert.equal(readSearch('  Méier  '), 'Méier'); assert.equal(readSearch('a'.repeat(300)).length, 120);
});
console.log(`${count} grupos aprovados.`);
