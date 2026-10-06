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
const { demoAppointments: items, demoReferenceDate: reference } = load(`${root}/client-appointments/demo-data.ts`);
const { partitionAppointments: split, cancelDemoAppointment: cancel, appointmentDate, appointmentTime } = load(`${root}/client-appointments/presentation.ts`);
const { publicBookingHref } = load(`${root}/booking/routing.ts`);
let count = 0;
function check(name, fn) { fn(); console.log('PASS', name); count++; }
check('próximas cronológicas e histórico decrescente', () => {
  const { upcoming, history } = split(items, reference);
  assert.deepEqual(upcoming.map(x => x.key), ['exemplo-01', 'exemplo-02']);
  assert.deepEqual(history.map(x => x.key), ['exemplo-03', 'exemplo-04']);
});
check('busca sem acentos mantém barbearia e recorte', () => {
  const result = split(items, reference, ' NAVALHA ');
  assert.equal(result.upcoming.length, 1); assert.equal(result.history.length, 1);
  assert.equal(split(items, reference, 'classico').history.length, 1);
  assert.equal(split(items, reference, 'rafael').upcoming.length, 1);
});
check('lista vazia e busca sem resultados', () => {
  assert.deepEqual(split([], reference), { upcoming: [], history: [] });
  assert.deepEqual(split(items, reference, 'inexistente'), { upcoming: [], history: [] });
});
check('cancelamento local move só o exemplo escolhido e preserva fixture', () => {
  const result = cancel(items, 'exemplo-01');
  assert.equal(items[0].status, 'scheduled'); assert.equal(result[0].status, 'cancelled');
  assert.equal(result[1], items[1]);
  assert.equal(split(result, reference).upcoming.length, 1);
  assert.equal(split(result, reference).history.length, 3);
  assert.deepEqual(cancel(result, 'exemplo-01'), result);
});
check('chave desconhecida e histórico não sofrem alteração', () => {
  assert.deepEqual(cancel(items, 'outro-cliente'), items);
  assert.deepEqual(cancel(items, 'exemplo-03'), items);
});
check('data de referência fixa não depende do relógio local', () => {
  assert.equal(split(items, '2027-01-01T00:00:00-03:00').upcoming.length, 0);
  assert.equal(appointmentTime(items[0].startsAt), '10:30');
  assert.match(appointmentDate(items[0].startsAt), /12 de outubro de 2026/);
});
check('todas as reservas identificam a barbearia; opcionais ausentes preservados', () => {
  assert.equal(new Set(items.map(x => x.barbershop.subdomain)).size, 2);
  items.forEach(x => { assert(x.barbershop.name); assert(x.barbershop.subdomain); });
  assert.equal(items[2].professional, undefined); assert.equal(items[2].price, undefined);
});
check('reagendamento usa wizard da mesma barbearia e host validado', () => {
  const platform = { origin: 'http://localhost:3000', isTrustedHost: true, isPlatform: true, hostSubdomain: null };
  items.forEach(x => assert.equal(publicBookingHref(platform, x.barbershop.subdomain), `http://${x.barbershop.subdomain}.localhost:3000/agendar`));
  assert.equal(publicBookingHref({ ...platform, isTrustedHost: false }, 'demo-esquina'), null);
  assert.equal(publicBookingHref(platform, 'inexistente'), null);
});
console.log(`${count} grupos de verificações passaram. Sem validação de autorização real.`);
