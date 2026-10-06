const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('../frontend/node_modules/typescript');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('exports', 'require', code)(exports, (specifier) => load(path.resolve(path.dirname(file), `${specifier}.ts`)));
  return exports;
}
const root = path.resolve(__dirname, '../frontend/src/features/barber-demo');
const { demoSlots } = load(`${root}/demo-data.ts`);
const { applyDemoAction: apply, nextDemoAppointment: next, demoHistory: history, activeDemoSlots: active, formatDemoDate } = load(`${root}/state.ts`);
let count = 0;
function check(name, run) { run(); console.log('PASS', name); count++; }
check('próximo atendimento usa referência fixa e ordem cronológica', () => {
  assert.equal(next(demoSlots).key, 'demo-10');
  assert.equal(next([...demoSlots].reverse()).key, 'demo-10');
  assert.equal(next([]), undefined);
});
check('conclusão atualiza próximo e apenas o atendimento selecionado', () => {
  const result = apply(demoSlots, { type: 'completed', key: 'demo-10' });
  assert.equal(result[2].status, 'completed');
  assert.equal(next(result).key, 'demo-1115');
  assert.equal(result[4], demoSlots[4]);
  assert.equal(demoSlots[2].status, 'scheduled');
});
check('falta e conclusão esgotam próximos sem modificar fixture', () => {
  const result = apply(apply(demoSlots, { type: 'no-show', key: 'demo-10' }), { type: 'completed', key: 'demo-1115' });
  assert.equal(result[2].status, 'no-show');
  assert.equal(next(result), undefined);
  assert.equal(next(demoSlots).key, 'demo-10');
});
check('status terminal não pode ser sobrescrito nem repetido', () => {
  const result = apply(demoSlots, { type: 'completed', key: 'demo-10' });
  assert.deepEqual(apply(result, { type: 'no-show', key: 'demo-10' }), result);
  assert.deepEqual(apply(result, { type: 'completed', key: 'demo-10' }), result);
});
check('bloquear e desbloquear altera somente o intervalo livre', () => {
  const blocked = apply(demoSlots, { type: 'block', key: 'demo-1045' });
  assert.equal(blocked[3].kind, 'blocked');
  assert.equal(blocked[2], demoSlots[2]);
  assert.equal(demoSlots[3].kind, 'free');
  assert.deepEqual(apply(blocked, { type: 'block', key: 'demo-1045' }), blocked);
  assert.deepEqual(apply(blocked, { type: 'unblock', key: 'demo-1045' }), demoSlots);
  assert.equal(apply(demoSlots, { type: 'unblock', key: 'demo-1145' })[5].kind, 'free');
});
check('ações incompatíveis e chaves desconhecidas não alteram dados', () => {
  for (const action of [{ type: 'block', key: 'demo-10' }, { type: 'unblock', key: 'demo-10' }, { type: 'completed', key: 'demo-1045' }, { type: 'no-show', key: 'demo-1145' }, { type: 'unblock', key: 'demo-1045' }, { type: 'completed', key: 'outra-agenda' }]) assert.deepEqual(apply(demoSlots, action), demoSlots);
});
check('histórico recorta finalizados, ordena recentes e deriva resumo', () => {
  const result = history(demoSlots);
  assert.deepEqual(result.items.map(x => x.key), ['demo-0930', 'demo-09']);
  assert.equal(result.completed, 1); assert.equal(result.noShow, 1);
  assert.deepEqual(active(demoSlots).map(x => x.key), ['demo-10', 'demo-1045', 'demo-1115', 'demo-1145']);
  assert.deepEqual(history([...demoSlots].reverse()), result);
});
check('conclusão e falta movem itens para histórico e atualizam resumo sem duplicação', () => {
  const concluded = apply(demoSlots, { type: 'completed', key: 'demo-10' });
  assert.equal(history(concluded).completed, 2);
  assert.equal(history(concluded).items[0].key, 'demo-10');
  assert(!active(concluded).some(x => x.key === 'demo-10'));
  const result = apply(concluded, { type: 'no-show', key: 'demo-1115' });
  assert.deepEqual(history(result).items.slice(0, 2).map(x => x.key), ['demo-1115', 'demo-10']);
  assert.equal(history(result).noShow, 2);
  assert.equal(active(result).filter(x => x.kind === 'appointment').length, 0);
  assert.equal(new Set([...active(result), ...history(result).items].map(x => x.key)).size, demoSlots.length);
  assert.equal(history(demoSlots).items.length, 2);
});
check('bloqueios não entram no histórico e recortes vazios permanecem coerentes', () => {
  assert.deepEqual(history(apply(demoSlots, { type: 'block', key: 'demo-1045' })), history(demoSlots));
  assert.deepEqual(history([]), { items: [], completed: 0, noShow: 0 });
  assert.deepEqual(active([]), []);
  assert.equal(history(demoSlots.filter(x => x.kind === 'appointment' && x.status === 'scheduled')).items.length, 0);
});
check('histórico ordena dia, mês e ano antes do horário', () => {
  const appointment = demoSlots[0];
  const items = [
    { ...appointment, key: 'ano-anterior', date: '2025-12-31', start: '23:00' },
    { ...appointment, key: 'mes-anterior', date: '2026-09-30', start: '18:00' },
    { ...appointment, key: 'dia-anterior', date: '2026-10-04', start: '20:00' },
    { ...appointment, key: 'dia-atual-cedo', date: '2026-10-05', start: '08:00' },
    { ...appointment, key: 'dia-atual-tarde', date: '2026-10-05', start: '09:00' },
  ];
  assert.deepEqual(history(items).items.map(x => x.key), ['dia-atual-tarde', 'dia-atual-cedo', 'dia-anterior', 'mes-anterior', 'ano-anterior']);
});
check('datas completas não dependem do relógio ou fuso local', () => {
  assert.equal(formatDemoDate('2026-09-30'), '30 de setembro de 2026');
  assert.equal(formatDemoDate('2026-10-04'), '4 de outubro de 2026');
  assert.equal(formatDemoDate('2025-12-31'), '31 de dezembro de 2025');
  const result = apply(demoSlots, { type: 'completed', key: 'demo-10' });
  assert.equal(history(result).items[0].date, '2026-10-05');
});
check('agenda do dia e próximo atendimento respeitam a data de referência', () => {
  const scheduled = demoSlots[2];
  const previous = { ...scheduled, key: 'passado', date: '2026-10-04', start: '18:00' };
  const future = { ...scheduled, key: 'futuro', date: '2026-10-06', start: '08:00' };
  assert.equal(next([previous, future, scheduled]).key, scheduled.key);
  assert.equal(next([previous, future]).key, future.key);
  assert.deepEqual(active([previous, future, scheduled]), [scheduled]);
});
console.log(`${count} grupos passaram; transições locais, sem autorização real.`);
