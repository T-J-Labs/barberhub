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
const root = path.resolve(__dirname, '../frontend/src/features');
const { demoClientBarbershops: shops } = load(`${root}/client-barbershops/demo-data.ts`);
const { clientBarbershopActions: actions } = load(`${root}/client-barbershops/presentation.ts`);
const { appointmentBarbershopFilter: filter, appointmentFiltersHref: href } = load(`${root}/client-appointments/filters.ts`);
const { partitionAppointments: split, cancelDemoAppointment: cancel } = load(`${root}/client-appointments/presentation.ts`);
const { demoAppointments: appointments, demoReferenceDate: reference } = load(`${root}/client-appointments/demo-data.ts`);
const { resolvePlatformNavigation: platform } = load(`${root}/auth/routing.ts`);
let count = 0;
function check(name, action) { action(); count++; console.log('PASS', name); }
check('duas barbearias da mesma identidade fictícia, dados públicos existentes', () => {
  assert.deepEqual(shops.map(x => x.id), ['demo-esquina', 'demo-navalha']);
  assert.equal(new Set(shops.map(x => x.demoClientKey)).size, 1);
  shops.forEach(x => { assert(x.initials); assert(x.city); assert(x.neighborhood); assert.equal(x.available, true); });
});
check('links canônicos de perfil, introdução e filtro em desenvolvimento/produção', () => {
  for (const [host, base, dev, origin] of [['localhost:3211', undefined, true, 'http://localhost:3211'], ['barberhub.test', 'barberhub.test', false, 'https://barberhub.test']]) {
    const p = platform(host, base, dev);
    shops.forEach(shop => assert.deepEqual(actions(shop, p), {
      profile: origin.replace('://', `://${shop.id}.`) + '/', booking: origin.replace('://', `://${shop.id}.`) + '/agendar', appointments: `/cliente/agendamentos?barbearia=${shop.id}`,
    }));
  }
});
check('indisponibilidade mantém vínculo e consulta; host externo não gera ações públicas', () => {
  const unavailable = { ...shops[1], available: false };
  assert.deepEqual(actions(unavailable, platform('localhost:3000', undefined, true)), { profile: null, booking: null, appointments: '/cliente/agendamentos?barbearia=demo-navalha' });
  for (const host of ['externo.test', 'unknown.localhost:3000', 'a.b.localhost:3000', 'localhost:0']) assert.equal(actions(shops[0], platform(host, undefined, true)).profile, null);
  assert.equal(shops[1].available, true);
});
check('filtro reconhece todas as fixtures públicas e rejeita vazio, desconhecido e repetições', () => {
  assert.equal(filter([]).kind, 'all');
  for (const id of ['demo-esquina', 'demo-navalha', 'demo-vila']) assert.equal(filter([id]).shop.id, id);
  for (const values of [[''], ['outro'], ['https://externo.test'], ['demo-esquina', 'demo-esquina'], ['demo-esquina', 'demo-navalha']]) {
    assert.equal(filter(values).kind, 'invalid'); assert.deepEqual(split(appointments, reference, '', values), { upcoming: [], history: [] });
  }
});
check('filtro combina com busca normalizada e recortes', () => {
  assert.equal(split(appointments, reference, '', ['demo-esquina']).upcoming.length, 1);
  assert.equal(split(appointments, reference, 'classico', ['demo-navalha']).history.length, 1);
  assert.equal(split(appointments, reference, 'Rafael', ['demo-navalha']).upcoming.length, 0);
  assert.equal(split(appointments, reference, 'Bruno', ['demo-navalha']).upcoming.length, 1);
});
check('busca e limpeza preservam filtro ou texto, sem normalizar repetição silenciosamente', () => {
  assert.equal(href('barbearia=demo-navalha&q=Bruno', { q: '' }), '/cliente/agendamentos?barbearia=demo-navalha');
  assert.equal(href('barbearia=demo-navalha&q=Bruno', { removeBarbershop: true }), '/cliente/agendamentos?q=Bruno');
  assert.equal(href('barbearia=demo-esquina&barbearia=demo-navalha', { q: 'corte' }), '/cliente/agendamentos?barbearia=demo-esquina&barbearia=demo-navalha&q=corte');
});
check('cancelamento da amostra não remove vínculo nem altera fixtures', () => {
  const snapshot = JSON.stringify(shops);
  const result = cancel(appointments, 'exemplo-01');
  assert.equal(result[0].status, 'cancelled'); assert.equal(appointments[0].status, 'scheduled');
  assert.equal(JSON.stringify(shops), snapshot); assert.equal(shops.length, 2);
});
console.log(`${count} grupos passaram; sem autorização ou vínculo real.`);
