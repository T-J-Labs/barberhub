import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { ruleSuites } from './qa-rule-suites.mjs'

const cwd = fileURLToPath(new URL('..', import.meta.url))
let failed = 0
for (const { name, args } of ruleSuites) {
  console.log(`Regras: ${name}`)
  const result = spawnSync(process.execPath, args, { cwd, stdio: 'inherit', windowsHide: true, timeout: 120000 })
  if (result.error) console.error(result.error)
  if (result.status !== 0) failed++
}
console.log(`${ruleSuites.length} suítes de regras; ${failed} falhas`)
process.exitCode = failed ? 1 : 0
