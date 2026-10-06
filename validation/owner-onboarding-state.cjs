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
const root = path.resolve(__dirname, '../frontend/src/features/owner-onboarding');
const { createExample } = load(root + '/fixtures.ts');
const { validateOnboarding, limits, validInterval } = load(root + '/validation.ts');
const { calculateChecklist, presentationState } = load(root + '/checklist.ts');
const { transition, initialWizard } = load(root + '/transitions.ts');
const { readDemoOrigin, onboardingHref } = load(root + '/routing.ts');
let count = 0;
function check(name, fn) { fn(); count++; console.log('PASS', name); }
const sample = createExample('cadastro');
const bad = (change, field) => assert(validateOnboarding({ ...sample, ...change }).some(issue => issue.field === field), JSON.stringify(change));
check('dois exemplos completos, independentes e copiados por fluxo', () => {
  for (const origin of ['cadastro', 'superadmin']) {
    assert.equal(calculateChecklist(createExample(origin)).count, 5);
    assert.equal(presentationState(createExample(origin), 'pending'), 'pending');
  }
  const one = createExample('cadastro'); one.opening.seg.start = '18:00';
  assert.equal(createExample('cadastro').opening.seg.start, '09:00');
  assert.notEqual(sample.name, createExample('superadmin').name);
});
check('vazio, espaços e limites explícitos de todos os textos', () => {
  for (const [field, max] of Object.entries(limits)) {
    for (const value of ['', '   ', 'a'.repeat(max + 1)]) bad({ [field]: value }, field);
    assert(!validateOnboarding({ ...sample, [field]: 'a'.repeat(max) }).some(issue => issue.field === field));
    bad({ [field]: ' '.repeat(max) + 'x' }, field);
  }
});
check('subdomínio: normalização, sintaxe e conflitos locais sem tocar roteamento', () => {
  assert(!validateOnboarding({ ...sample, subdomain: '  EXEMPLO-OUTRO  ' }).some(x => x.field === 'subdomain'));
  for (const subdomain of ['demo-esquina', 'DEMO-NAVALHA', 'admin', 'onboarding', 'api', 'cliente', 'https://a', 'a.b', '-a', 'a-', 'ação', 'a/path', 'a:80', 'a b']) bad({ subdomain }, 'subdomain');
});
check('serviço ativo, duração inteira e preço finito com duas casas', () => {
  bad({ serviceActive: false }, 'serviceActive');
  for (const duration of ['', ' ', '0', '-1', '1.5', '481', 'Infinity', '1e2']) bad({ duration }, 'duration');
  for (const price of ['', ' ', '-1', '10000', '40.001', 'NaN', 'Infinity', '1e2']) bad({ price }, 'price');
  for (const price of ['0', '0,00', '9999.99', '45,50']) assert(!validateOnboarding({ ...sample, price }).some(x => x.field === 'price'));
});
check('associação fica pendente após trocar serviço, sem descartar demais dados', () => {
  const edited = { ...sample, serviceName: 'Barba de exemplo' };
  assert.equal(calculateChecklist(edited).items[3].complete, false);
  bad({ associatedService: '' }, 'associatedService');
  assert.equal(calculateChecklist({ ...edited, associatedService: edited.serviceName }).complete, true);
});
check('horários: sintaxe, ordem, funcionamento, duração e ao menos um intervalo', () => {
  for (const [start, end] of [['18:00','09:00'], ['10:00','10:00'], ['25:00','26:00'], ['9:00','18:00'], ['','']]) assert.equal(validInterval({ enabled: true, start, end }), false);
  for (const change of [{ start: '08:59' }, { end: '18:01' }, { end: '10:29' }, { start: '11:00', end: '10:00' }]) bad({ availability: { ...sample.availability, seg: { ...sample.availability.seg, ...change } } }, 'availability-seg');
  bad({ opening: { ...sample.opening, seg: { ...sample.opening.seg, enabled: false } } }, 'availability-seg');
  bad({ availability: { ...sample.availability, seg: { ...sample.availability.seg, enabled: false } } }, 'availability');
  const fit = { ...sample, availability: { ...sample.availability, seg: { enabled: true, start: '09:00', end: '09:30' } } };
  assert.equal(calculateChecklist(fit).complete, true);
  assert.equal(calculateChecklist({ ...fit, duration: '31' }).items[4].complete, false);
  bad({ opening: { ...sample.opening, ter: { enabled: true, start: '18:00', end: '09:00' } } }, 'opening-ter');
});
check('checklist e três estados derivam dos dados, liberação não supera pendências', () => {
  assert.equal(presentationState({ ...sample, name: ' ' }, 'purchase'), 'incomplete');
  assert.equal(presentationState(sample, 'pending'), 'pending');
  for (const scenario of ['purchase', 'explicit']) assert.equal(presentationState(sample, scenario), 'preview');
  assert.equal(calculateChecklist({ ...sample, name: '' }).count, 4);
  assert.equal(JSON.stringify(sample), JSON.stringify(createExample('cadastro')));
});
check('origem é intenção visual validada; repetidos/desconhecidos usam introdução', () => {
  for (const value of [undefined, ['cadastro'], ['superadmin','cadastro'], 'external', 'https://evil.test']) assert.equal(readDemoOrigin(value), null);
  assert.equal(onboardingHref('superadmin'), '/onboarding/barbearia?origem=superadmin');
});
check('avanço/retorno preservam dados; conclusão exige revisão completa e cenário', () => {
  for (const origin of ['cadastro', 'superadmin']) {
    let state = transition(initialWizard, { type: 'choose', origin }); state = transition(state, { type: 'start' });
    const data = { ...state.data, name: 'Meu exemplo editado' };
    state = transition(state, { type: 'edit', data });
    for (let i = 0; i < 5; i++) state = transition(state, { type: 'next' });
    assert.equal(state.step, 5); assert.equal(transition(state, { type: 'finish' }).phase, 'steps');
    state = transition(state, { type: 'go', step: 0 }); assert.equal(state.data.name, data.name);
    state = transition(state, { type: 'edit', data: { ...data, name: ' ' } });
    assert.equal(transition(state, { type: 'next' }).step, 0);
    state = transition(state, { type: 'go', step: 5 }); state = transition(state, { type: 'release', scenario: 'explicit' });
    assert.equal(transition(state, { type: 'finish' }).phase, 'steps');
    state = transition(state, { type: 'edit', data }); state = transition(state, { type: 'finish' });
    assert.equal(state.phase, 'result');
    state = transition(state, { type: 'restart' }); assert.equal(state.data, null); assert.equal(state.release, 'pending');
    state = transition(state, { type: 'start' }); assert.equal(state.data.name, createExample(origin).name);
  }
});
console.log(`${count} grupos aprovados.`);
