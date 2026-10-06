import test from 'node:test'
import assert from 'node:assert/strict'
import { httpTestConfig, assertHttpTestRuntime } from './http-test-config.mjs'
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

test('endereço, saída portátil, navegador e preparação em memória', () => {
  const c = httpTestConfig({ TEST_ADDRESS: 'http://127.0.0.1:3210', TEST_OUTPUT: '../validation/qa-runs', TEST_BROWSER: 'firefox' }, [])
  assert.equal(c.connectionOrigin, 'http://127.0.0.1:3210')
  assert.equal(c.browser, 'firefox')
  assert.match(c.fixtures, /novo contexto/)
  for (const env of [{ TEST_ADDRESS: 'file:///tmp' }, { TEST_ADDRESS: 'http://user:pass@localhost' }, { TEST_BROWSER: 'safari' }]) assert.throws(() => httpTestConfig(env, []))
})
test('agregador recusa ambiente incompatível, retorna falha e preserva execuções distintas', () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'barberhub-qa-guard-'))
  const runner = fileURLToPath(new URL('./qa-runner.mjs', import.meta.url))
  for (let i = 0; i < 2; i++) {
    const result = spawnSync(process.execPath, [runner, 'production'], { env: { ...process.env, TEST_ENV: 'development', TEST_OUTPUT: output }, encoding: 'utf8' })
    assert.equal(result.status, 1)
  }
  const runs = fs.readdirSync(output)
  assert.equal(runs.length, 2)
  for (const run of runs) {
    const report = JSON.parse(fs.readFileSync(path.join(output, run, 'run.json')))
    assert.equal(report.passed, false)
    assert.match(report.error, /TEST_ENV=production/)
    assert.equal(report.serverPid, undefined)
  }
})
test('servidor com worker de produção não pode aprovar desenvolvimento', async () => {
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'application/javascript' }); res.end('addEventListener') })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    await assert.rejects(assertHttpTestRuntime(httpTestConfig({ TEST_PORT: String(server.address().port) }, [])), /incompatível/)
  } finally { await new Promise(resolve => server.close(resolve)) }
})
test('suíte HTTP obrigatória falhando mantém exit 1 e diagnóstico, sem encerrar servidor preparado',
  { skip: process.env.QA_RUNNER_GUARD_TEST_CHILD === '1' }, async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(req.url === '/pwa-worker.js' ? 404 : 200, { 'Content-Type': 'text/html' })
      res.end(`<a href="http://${req.headers.host}/">Fixture sintética do executor; não é aplicação</a>`)
    })
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    const output = fs.mkdtempSync(path.join(os.tmpdir(), 'barberhub-qa-failure-'))
    try {
      const status = await new Promise((resolve, reject) => {
        const env = { ...process.env, QA_RUNNER_GUARD_TEST_CHILD: '1', TEST_ENV: 'development', TEST_PROTOCOL: 'http:', TEST_PORT: String(server.address().port),
          TEST_ADDRESS: `http://127.0.0.1:${server.address().port}`, TEST_PUBLIC_HOST: 'localhost', TEST_OUTPUT: output, TEST_SERVER: 'prepared' }
        // Processo externo de QA: não herdar o contexto interno do node:test.
        delete env.NODE_TEST_CONTEXT
        const child = spawn(process.execPath, [fileURLToPath(new URL('./qa-runner.mjs', import.meta.url)), 'local'], {
          env,
          stdio: 'ignore', windowsHide: true,
        })
        child.on('error', reject); child.on('close', resolve)
      })
      assert.equal(status, 1)
      const dir = path.join(output, fs.readdirSync(output)[0])
      const report = JSON.parse(fs.readFileSync(path.join(dir, 'run.json')))
      assert.equal(report.passed, false)
      assert(report.results.some(result => result.name === 'http-shared' && result.exit !== 0))
      assert(report.results.some(result => result.name === 'client-appointments-http'))
      assert(fs.readFileSync(path.join(dir, 'http-shared/output.txt'), 'utf8').includes('fail'))
      assert.equal(server.listening, true)
      assert.equal(report.serverStopped, undefined)
    } finally { await new Promise(resolve => server.close(resolve)) }
  })
