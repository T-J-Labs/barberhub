import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, spawnSync } from 'node:child_process'
import { randomUUID, createHash } from 'node:crypto'
import { httpTestConfig, assertHttpTestRuntime } from './http-test-config.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
const mode = process.argv[2]
if (!['local', 'browser', 'production', 'onboarding'].includes(mode) || process.argv.length !== 3) throw new Error('Use qa-runner.mjs local|browser|production|onboarding; configure TEST_*')
const config = httpTestConfig(process.env, [])
fs.mkdirSync(config.outputRoot, { recursive: true })
const runDir = fs.mkdtempSync(path.join(config.outputRoot,
  `${new Date().toISOString().replaceAll(':', '-')}-${mode}-`))
const git = args => spawnSync('git', args, { cwd: root, encoding: 'utf8' }).stdout?.trim()
function sourceFingerprint() {
  const hash = createHash('sha256')
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) visit(file)
      else { hash.update(path.relative(root, file).replaceAll('\\', '/')); hash.update(fs.readFileSync(file)) }
    }
  }
  visit(path.join(root, 'frontend/src')); visit(path.join(root, 'frontend/tests'))
  return hash.digest('hex')
}
const report = { started: new Date().toISOString(), mode, code: git(['rev-parse', 'HEAD']), changes: git(['status', '--porcelain']),
  sourceFingerprint: sourceFingerprint(),
  node: process.version, platform: process.platform, config, server: process.env.TEST_SERVER,
  limitations: [config.transport, config.fixtures, 'Leitor de tela, Android/iPhone, Safari real, instalação manual e HTTPS publicado não executados'], results: [] }
let server
let generatedEnvBefore, generatedEnvAfter
const writeReport = () => fs.writeFileSync(path.join(runDir, 'run.json'), JSON.stringify(report, null, 2))
writeReport()
async function command(name, args, extra = {}) {
  const dir = path.join(runDir, name)
  fs.mkdirSync(dir)
  const log = fs.createWriteStream(path.join(dir, 'output.txt'))
  const env = { ...process.env, QA_SUITE_OUTPUT: dir, HEADER_QA_OUTPUT: dir, PROFILE_QA_OUTPUT: dir, ...extra }
  const began = new Date().toISOString()
  const result = await new Promise(resolve => {
    const child = spawn(process.execPath, args, { cwd: path.join(root, 'frontend'), env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    const timer = setTimeout(() => {
      if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true })
      else child.kill()
    }, 10 * 60 * 1000)
    for (const stream of [child.stdout, child.stderr]) stream.on('data', data => { log.write(data); process.stdout.write(data) })
    child.on('error', error => { log.write(error.stack); resolve({ exit: 1, error: error.message }) })
    child.on('close', (code, signal) => { clearTimeout(timer); resolve({ exit: code ?? 1, signal }) })
  })
  await new Promise(resolve => log.end(resolve))
  report.results.push({ name, command: [process.execPath, ...args], began, ended: new Date().toISOString(), ...result })
  for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.json'))) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file)))
      const version = data.browser || data.observations?.browser
      if (version) report.browserVersion = version
    } catch { /* A saída original permanece disponível para diagnóstico. */ }
  }
  writeReport()
  if (result.exit !== 0) process.exitCode = 1
}
async function startServer() {
  if (process.env.TEST_SERVER === 'prepared') {
    report.serverNote = 'Servidor externo explicitamente preparado pelo operador; não iniciado nem encerrado por QA'
    await assertHttpTestRuntime(config)
    return
  }
  if (process.env.TEST_SERVER !== 'isolated') throw new Error('Defina TEST_SERVER=prepared (servidor preparado explicitamente) ou isolated (processo próprio de QA)')
  if (config.connectionOrigin !== `http://127.0.0.1:${config.port}`) throw new Error('Servidor isolated exige transporte loopback padrão')
  const { createServer } = await import('node:net')
  const probe = createServer()
  await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(config.port, resolve) })
  await new Promise(resolve => probe.close(resolve))
  const args = [path.join(root, 'frontend/node_modules/next/dist/bin/next'), config.environment === 'production' ? 'start' : 'dev', '--port', String(config.port)]
  const serverLog = fs.openSync(path.join(runDir, 'server.txt'), 'w')
  const env = { ...process.env, BARBERHUB_PUBLIC_HOST: config.base, NEXT_PUBLIC_API_MOCKING: 'disabled' }
  if (config.environment === 'development') {
    const id = randomUUID()
    env.TEST_NEXT_DIST_DIR = `.next/qa-${id}`
    env.TEST_NEXT_TS_CONFIG = `.qa-tsconfig-${id}.json`
    fs.copyFileSync(path.join(root, 'frontend/tsconfig.json'), path.join(root, 'frontend', env.TEST_NEXT_TS_CONFIG))
    const envPath = path.join(root, 'frontend/next-env.d.ts')
    generatedEnvBefore = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : null
  }
  report.serverCommand = args; report.distDir = env.TEST_NEXT_DIST_DIR || '.next'
  server = spawn(process.execPath, args, { cwd: path.join(root, 'frontend'), env, windowsHide: true, stdio: ['ignore', serverLog, serverLog] })
  fs.closeSync(serverLog)
  report.serverPid = server.pid
  writeReport()
  const until = Date.now() + 120000
  while (Date.now() < until) {
    if (server.exitCode !== null) throw new Error('Servidor QA encerrou; consulte server.txt')
    try {
      await assertHttpTestRuntime(config)
      if (generatedEnvBefore !== undefined) generatedEnvAfter = fs.readFileSync(path.join(root, 'frontend/next-env.d.ts'), 'utf8')
      return
    } catch (error) { report.lastProbe = error.message }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  throw new Error(`Servidor QA incompatível: ${report.lastProbe}`)
}
async function stopServer() {
  if (!server || server.exitCode !== null) return
  if (process.platform === 'win32') {
    // Somente a árvore criada por esta execução. Nenhum processo por nome/porta.
    spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { windowsHide: true })
  } else server.kill('SIGTERM')
  report.serverStopped = true
  const envPath = path.join(root, 'frontend/next-env.d.ts')
  if (generatedEnvAfter !== undefined && fs.readFileSync(envPath, 'utf8') === generatedEnvAfter) {
    fs.writeFileSync(envPath, generatedEnvBefore ?? generatedEnvAfter.replaceAll(report.distDir, '.next'))
  }
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => {
  report.interrupted = signal; await stopServer(); report.passed = false; writeReport(); process.exit(1)
})
try {
  if (mode === 'production' && config.environment !== 'production') throw new Error('test:qa:production exige TEST_ENV=production')
  await startServer()
  if (mode === 'onboarding') {
    await command('owner-onboarding-state', ['../validation/owner-onboarding-state.cjs'])
    await command('owner-onboarding-http', ['--test', 'tests/owner-onboarding-http.test.mjs'])
    await command('journeys-accessibility', ['tests/qa-journeys.mjs'], { OWNER_ONBOARDING_QA_ONLY: '1' })
  }
  if (mode !== 'browser' && mode !== 'onboarding') {
    await command('routing', ['--test', 'tests/public-host.test.mjs', 'tests/http-test-config.test.mjs', 'tests/qa-config.test.mjs'])
    for (const suite of ['client-auth-routing', 'booking-state', 'client-appointments-state', 'client-barbershops-state', 'barber-demo-state', 'profile-help-state', 'superadmin-state', 'owner-onboarding-state', 'pwa-policy']) await command(suite, [`../validation/${suite}.cjs`])
    await command('http-shared', ['--test', 'tests/public-routing-http.test.mjs', 'tests/profile-help-metadata-http.test.mjs', 'tests/client-barbershops-http.test.mjs', 'tests/owner-onboarding-http.test.mjs'])
    for (const suite of ['client-auth-http', 'booking-http', 'client-appointments-http']) await command(suite, [`../validation/${suite}.cjs`, String(config.port), ...(config.environment === 'production' ? [config.base] : [])])
  }
  if (mode !== 'local' && mode !== 'onboarding') {
    if (config.environment === 'development') {
      if (config.base !== 'localhost' || config.connectionOrigin !== `http://127.0.0.1:${config.port}`) throw new Error('Suítes legadas de navegador exigem localhost; use produção para Host público simulado')
      for (const suite of ['headers-browser', 'profile-help-browser']) await command(suite, [`../validation/${suite}.cjs`, String(config.port)])
      if (config.browser === 'chromium') await command('headers-zoom', ['../validation/headers-zoom.cjs', String(config.port)])
      else report.limitations.push('Zoom nativo 200% requer Chromium; não executado neste navegador')
    }
    for (const suite of ['superadmin-browser', 'superadmin-registration-browser']) await command(suite, [`../validation/${suite}.cjs`, String(config.port)])
    await command('journeys-accessibility', ['tests/qa-journeys.mjs'])
    if (mode === 'production') {
      if (config.browser !== 'chromium' || config.base !== 'localhost') throw new Error('PWA local/CDP exige Chromium e TEST_PUBLIC_HOST=localhost; configure outra execução para Firefox/WebKit')
      for (const suite of ['pwa-browser', 'pwa-lifecycle']) await command(suite, [`../validation/${suite}.cjs`, String(config.port)])
    }
  }
} catch (error) {
  report.error = error.stack
  console.error(error)
  process.exitCode = 1
} finally {
  await stopServer()
  report.ended = new Date().toISOString(); report.passed = !process.exitCode
  writeReport()
  console.log(`Evidências: ${runDir}; resultado: ${report.passed ? 'PASS' : 'FAIL'}`)
}
