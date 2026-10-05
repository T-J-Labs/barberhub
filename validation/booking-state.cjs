// Invariantes da jornada local e navegação segura; sem rede ou sessão simulada.
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
    assert(specifier.startsWith('@/') || specifier.startsWith('./'));
    const target = specifier.startsWith('@/')
      ? path.resolve(__dirname, '../frontend/src', specifier.slice(2))
      : path.resolve(path.dirname(file), specifier);
    return load(`${target}.ts`);
  });
  return exports;
}
const root = path.resolve(__dirname, '../frontend/src/features');
const fixtures = load(`${root}/booking/demo-data.ts`);
const state = load(`${root}/booking/selection.ts`);
const routing = load(`${root}/booking/routing.ts`);
const auth = load(`${root}/auth/routing.ts`);
const data = fixtures.getBookingDemoData('demo-esquina');
const complete = { service: 'corte', professional: 'rafael', date: '2026-10-12', slot: '09:00' };
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS', name); }
check('serviço limpa profissional, data e horário', () => assert.deepEqual(state.changeSelection(complete, 'service', 'barba'), { service: 'barba', professional: '', date: '', slot: '' }));
check('profissional limpa data e horário', () => assert.deepEqual(state.changeSelection(complete, 'professional', 'diego'), { service: 'corte', professional: 'diego', date: '', slot: '' }));
check('data limpa horário', () => assert.deepEqual(state.changeSelection(complete, 'date', '2026-10-13'), { ...complete, date: '2026-10-13', slot: '' }));
check('horário preserva antecedentes', () => assert.deepEqual(state.changeSelection(complete, 'slot', '10:30'), { ...complete, slot: '10:30' }));
check('mesma seleção não apaga dependências', () => assert.equal(state.changeSelection(complete, 'service', 'corte'), complete));
check('sequência incompleta é barrada em cada etapa', () => {
  let selected = state.emptySelection;
  for (const [index, field] of ['service', 'professional', 'date', 'slot'].entries()) {
    assert.equal(state.firstInvalidStep(data, selected, 'normal'), index);
    selected = state.changeSelection(selected, field, complete[field]);
  }
  assert.equal(state.firstInvalidStep(data, selected, 'normal'), null);
});
check('serviço desconhecido é inválido', () => assert.equal(state.firstInvalidStep(data, { ...complete, service: 'privado' }, 'normal'), 0));
check('profissional desconhecido é inválido', () => assert.equal(state.firstInvalidStep(data, { ...complete, professional: 'privado' }, 'normal'), 1));
check('vínculo profissional/serviço é validado no exemplo', () => assert.equal(state.firstInvalidStep({ ...data, professionals: [{ ...data.professionals[0], serviceKeys: ['barba'] }] }, complete, 'normal'), 1));
check('data fora da fixture é inválida', () => assert.equal(state.firstInvalidStep(data, { ...complete, date: '2030-01-01' }, 'normal'), 2));
check('horário fora da fixture é inválido', () => assert.equal(state.firstInvalidStep(data, { ...complete, slot: '03:00' }, 'normal'), 3));
for (const [scenario, step] of [['no-services', 0], ['no-professionals', 1], ['no-slots', 3], ['error', 3]]) {
  check(`cenário ${scenario} invalida revisão`, () => assert.equal(state.firstInvalidStep(data, complete, scenario), step));
}
check('data sem horários não permite conclusão', () => assert.equal(state.firstInvalidStep(data, { ...complete, date: '2026-10-14' }, 'normal'), 3));
check('horários dependem de profissional e data', () => assert(!fixtures.demoSlots(data, { ...complete, professional: 'diego' }, 'normal').includes('09:00')));
check('Navalha tem dados próprios sem aceitar escolhas da Esquina', () => {
  const other = fixtures.getBookingDemoData('demo-navalha');
  assert.equal(other.services.length, 3);
  assert.equal(state.firstInvalidStep(other, complete, 'normal'), 0);
});
for (const shop of ['demo-esquina', 'demo-navalha']) {
  check(`${shop}: todos os serviços têm profissional, data e horário para concluir`, () => {
    const ownData = fixtures.getBookingDemoData(shop);
    for (const service of ownData.services) {
      const people = fixtures.demoProfessionals(ownData, service.key, 'normal');
      assert(people.length > 0);
      for (const person of people) {
        const selected = { service: service.key, professional: person.key, date: ownData.dates[0].key, slot: '' };
        const slots = fixtures.demoSlots(ownData, selected, 'normal');
        assert(slots.length >= 2);
        assert.equal(state.firstInvalidStep(ownData, { ...selected, slot: slots[0] }, 'normal'), null);
      }
    }
  });
}
for (const shop of ['demo-vila', 'demo-oficina', 'demo-raizes', 'demo-bairro', 'nao-existe']) {
  check(`${shop}: mantém fixture vazia`, () => assert.equal(fixtures.getBookingDemoData(shop).services.length, 0));
}
const conflict = state.demonstrateConflict(complete);
check('conflito preserva antecedentes e limpa só horário', () => assert.deepEqual(conflict.selection, { ...complete, slot: '' }));
check('conflito não muda seleção original ou fixture', () => {
  assert.equal(complete.slot, '09:00');
  assert.equal(conflict.unavailableExample.slot, '09:00');
  assert(fixtures.demoSlots(data, complete, 'normal').includes('09:00'));
});
check('horário em conflito some só da lista local correspondente', () => {
  const slots = fixtures.demoSlots(data, conflict.selection, 'conflict', conflict.unavailableExample);
  assert(!slots.includes('09:00'));
  assert(slots.includes('10:30'));
  assert(fixtures.demoSlots(data, { ...complete, date: '2026-10-13' }, 'conflict', conflict.unavailableExample).includes('09:30'));
  assert(fixtures.demoSlots(data, { ...complete, service: 'barba' }, 'conflict', conflict.unavailableExample).includes('09:00'));
});
check('revisão barra reutilização do horário em conflito', () => assert.equal(state.firstInvalidStep(data, complete, 'conflict', conflict.unavailableExample), 3));
check('outra escolha após conflito permite concluir', () => assert.equal(state.firstInvalidStep(data, { ...conflict.selection, slot: '10:30' }, 'conflict', conflict.unavailableExample), null));
const platform = auth.resolvePlatformNavigation('demo-esquina.localhost:3101', undefined, true);
check('rota canônica preserva subdomínio e porta', () => assert.equal(routing.publicBookingHref(platform, 'demo-esquina'), 'http://demo-esquina.localhost:3101/agendar'));
check('chave desconhecida não gera rota', () => assert.equal(routing.publicBookingHref(platform, 'nao-existe'), null));
check('chave malformada não gera rota', () => assert.equal(routing.publicBookingHref(platform, '../admin'), null));
check('host externo não gera rota de agendamento', () => assert.equal(routing.publicBookingHref(auth.resolvePlatformNavigation('externo.test', 'barberhub.test', false), 'demo-esquina'), null));
check('produção sem domínio não gera rota', () => assert.equal(routing.publicBookingHref(auth.resolvePlatformNavigation('localhost', undefined, false), 'demo-esquina'), null));
for (const pathname of ['/agendar', '/barbearias/demo-esquina/agendar', '/agendamento', '/barbearias/demo-esquina/agendamento']) {
  check(`header preserva contexto em ${pathname}`, () => {
    const context = auth.publicClientContext(pathname, platform);
    for (const mode of ['login', 'cadastro']) {
      const url = new URL(auth.clientAuthHref(platform.origin, mode, context));
      assert.equal(url.searchParams.get('barbearia'), 'demo-esquina');
      assert.equal(url.searchParams.get('returnTo'), 'http://demo-esquina.localhost:3101/');
    }
  });
}
console.log(`${checks} verificações aprovadas.`);
