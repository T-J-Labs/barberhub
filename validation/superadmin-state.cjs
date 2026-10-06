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
  assert.deepEqual(summarizeShops([]), { total: 0, drafts: 0, active: 0, suspended: 0 });
});
check('suspender e reativar atualizam resumo sem mutar fonte pública ou outros exemplos', () => {
  const source = JSON.stringify(shops);
  const suspended = setDemoStatus(shops, 'demo-esquina', 'suspended');
  assert.deepEqual(summarizeShops(suspended), { total: 6, drafts: 0, active: 5, suspended: 1 });
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
const { validateRegistration, makeManualDraft, registrationLimits, demoReservedSubdomains } = load(root + '/registration.ts');
const input = { name: '  Barbearia São João  ', city: '  Rio de Janeiro  ', neighborhood: '  Méier  ', subdomain: '  NOVA-DEMO  ', manualReason: '  Exercício demonstrativo  ' };
check('cadastro válido normaliza subdomínio e trim sem alterar acentos', () => {
  const result = validateRegistration(input, shops);
  assert.equal(result.valid, true); assert.equal(result.value.name, 'Barbearia São João');
  assert.equal(result.value.subdomain, 'nova-demo'); assert.equal(result.value.manualReason, 'Exercício demonstrativo');
});
check('campos vazios/espaços e todos os limites são rejeitados sem mutar entrada', () => {
  for (const key of Object.keys(registrationLimits)) {
    for (const value of ['', '  ', 'a'.repeat(registrationLimits[key] + 1)]) {
      const draft = { ...input, [key]: value }; const result = validateRegistration(draft, shops);
      assert.equal(result.valid, false); assert.ok(result.errors[key]); assert.equal(draft[key], value);
    }
  }
});
check('subdomínios com protocolo/porta/caminho/pontos/acentos/hífens nas pontas rejeitados', () => {
  for (const subdomain of ['https://foo', 'foo:3000', 'foo/path', 'foo.bar', '-foo', 'foo-', 'fóó', 'foo bar', 'foo_bar', '../admin']) {
    assert.ok(validateRegistration({ ...input, subdomain }, shops).errors.subdomain);
  }
  for (const subdomain of ['a', 'a'.repeat(63), 'foo--bar', '123']) assert.equal(validateRegistration({ ...input, subdomain }, shops).valid, true);
});
check('nomes reservados derivados da navegação e caminhos existentes rejeitados', () => {
  for (const subdomain of demoReservedSubdomains) assert.ok(validateRegistration({ ...input, subdomain }, shops).errors.subdomain);
  assert.ok(demoReservedSubdomains.has('admin')); assert.ok(demoReservedSubdomains.has('api'));
});
check('subdomínios duplicados em fixtures e novos rascunhos são rejeitados', () => {
  assert.ok(validateRegistration({ ...input, subdomain: '  DEMO-ESQUINA ' }, shops).errors.subdomain);
  const value = validateRegistration(input, shops).value;
  const draft = makeManualDraft(value, 'manual-fixed'); const next = [...shops, draft];
  assert.ok(validateRegistration(input, next).errors.subdomain); assert.equal(draft.id, 'manual-fixed');
  assert.equal(draft.demoStatus, 'draft'); assert.equal(filterShops(next, 'São João')[0].id, 'manual-fixed');
  assert.deepEqual(summarizeShops(next), { total: 7, drafts: 1, active: 6, suspended: 0 });
  for (const status of ['active', 'suspended']) assert.equal(setDemoStatus(next, draft.id, status)[6], draft);
  assert.equal(shops.length, 6);
});
console.log(`${count} grupos aprovados.`);
