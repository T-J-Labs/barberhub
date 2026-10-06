import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { httpTestConfig, assertHttpTestRuntime } from './http-test-config.mjs'

const require = createRequire(new URL('../../validation/qa-browser.cjs', import.meta.url))
const { chromium } = require('./qa-browser.cjs')
const axePath = require.resolve('./tools/node_modules/axe-core/axe.min.js')
const c = httpTestConfig(process.env, [])
await assertHttpTestRuntime(c)
const dir = process.env.QA_SUITE_OUTPUT
assert(dir, 'Execute pelo agregador para preservar evidências')
const browser = await chromium.launch({ headless: true, channel: c.channel })
const results = [], audits = [], errors = []
const origin = shop => c.origin.replace('://', `://${shop ? shop + '.' : ''}`)
const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce' })
if (c.environment === 'production') {
  // HTTPS é uma origem lógica interceptada. Transporte e Host são documentados.
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.hostname !== c.base && !url.hostname.endsWith(`.${c.base}`)) return route.abort()
    const response = await route.fetch({ url: c.connectionOrigin + url.pathname + url.search,
      headers: { ...route.request().headers(), host: url.host }, maxRedirects: 0 })
    await route.fulfill({ response })
  })
}
const page = await context.newPage()
page.setDefaultTimeout(15000)
page.on('pageerror', error => errors.push(error.message))
await context.tracing.start({ screenshots: true, snapshots: true })
async function check(name, action) {
  try { await action(); results.push({ name, passed: true }); console.log('PASS', name) }
  catch (error) {
    results.push({ name, passed: false, error: error.stack }); process.exitCode = 1
    await page.screenshot({ path: path.join(dir, `failure-${results.length}.png`), fullPage: true }).catch(() => {})
    console.error('FAIL', name, error.message)
  }
  fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify({ browser: browser.version(), config: c, results, audits, errors }, null, 2))
}
async function goto(route, shop) {
  await page.goto(origin(shop) + route)
  await page.waitForLoadState('networkidle')
  await page.getByRole('main').waitFor()
}
async function audit(label) {
  await page.addScriptTag({ path: axePath })
  const report = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })
    return { violations: result.violations, incomplete: result.incomplete }
  })
  const exceptions = [], failures = []
  for (const violation of report.violations) {
    for (const node of violation.nodes) {
      // Exceção explícita limitada aos botões públicos sky-500/branco aprovados.
      const approved = violation.id === 'color-contrast' && await page.locator(node.target.join(' ')).evaluate(el => el.classList.contains('bg-sky-500') && el.classList.contains('text-white'))
      if (approved) exceptions.push({ id: violation.id, node })
      else failures.push({ id: violation.id, impact: violation.impact, node })
    }
  }
  audits.push({ label, url: page.url(), exceptions, failures, incomplete: report.incomplete })
  fs.writeFileSync(path.join(dir, 'axe.json'), JSON.stringify(audits, null, 2))
  assert.equal(failures.length, 0, JSON.stringify(failures.map(x => ({ id: x.id, target: x.node.target }))))
}
async function geometry(label) {
  assert.equal(await page.getByRole('main').count(), 1)
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await page.screenshot({ path: path.join(dir, `${label}.png`), fullPage: true })
}
const button = name => page.getByRole('button', { name, exact: true })
async function chooseToReview() {
  for (let i = 0; i < 4; i++) {
    await chooseRadio()
    await button('Continuar').click()
  }
  await page.getByRole('heading', { name: 'Confira sua visita de exemplo' }).waitFor()
}
async function chooseRadio(index = 0) {
  const radio = page.getByRole('radio').nth(index)
  await radio.focus(); await page.keyboard.press('Space')
  assert.equal(await radio.isChecked(), true)
}
async function focused(locator) {
  await page.waitForFunction(el => el === document.activeElement, await locator.elementHandle())
}
async function startBooking(scenario = 'normal') {
  await goto('/agendar', 'demo-esquina')
  await button('Experimentar demonstração').click()
  await page.getByText('Explorar estados da demonstração', { exact: true }).click()
  await page.getByLabel('Cenário local', { exact: true }).selectOption(scenario)
}
try {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await check(`descoberta ${width}px: busca, vazio, cidade e identidade`, async () => {
      await goto('/barbearias')
      await page.getByRole('searchbox', { name: 'Nome, cidade ou bairro' }).fill('sem exemplo xyz')
      await button('Buscar barbearias').click()
      await page.getByRole('link', { name: 'Limpar filtros' }).first().waitFor()
      assert.match(await page.locator('main').innerText(), /Nenhuma barbearia/)
      await page.getByRole('link', { name: 'Limpar filtros' }).first().click()
      await page.getByRole('searchbox', { name: 'Nome, cidade ou bairro' }).fill('Esquina')
      await page.getByRole('combobox', { name: 'Cidade', exact: true }).selectOption({ label: 'Rio de Janeiro' })
      await button('Buscar barbearias').click()
      await page.getByRole('link', { name: /Conhecer barbearia.*Esquina/ }).click()
      await page.getByRole('heading', { level: 1, name: 'Barbearia da Esquina' }).waitFor()
      assert.equal(new URL(page.url()).hostname, `demo-esquina.${c.base}`)
      await geometry(`profile-${width}`)
    })
    await check(`wizard ${width}px: teclado, invalidação, conflito, clique repetido e recuperação`, async () => {
      await startBooking('conflict')
      await button('Continuar').click()
      assert.equal(await page.getByRole('radio').first().evaluate(el => el === document.activeElement), true)
      await page.keyboard.press('Space')
      await button('Continuar').click()
      for (let i = 0; i < 3; i++) { await chooseRadio(); await button('Continuar').click() }
      await button('Alterar serviço').click()
      await chooseRadio(1)
      await button('Continuar').click()
      assert.equal(await page.locator('input:checked').count(), 0)
      for (let i = 0; i < 3; i++) { await chooseRadio(); await button('Continuar').click() }
      await button('Concluir demonstração').evaluate(el => { el.click(); el.click() })
      await page.getByRole('alert').filter({ hasText: 'Conflito demonstrativo' }).waitFor()
      assert.equal(await page.locator('input:checked').count(), 0)
      assert.equal(await page.locator('h1').evaluate(el => el === document.activeElement), true)
      await geometry(`conflict-${width}`)
      if (width === 390) await audit('wizard conflito')
      await chooseRadio(); await button('Continuar').click()
      await button('Concluir demonstração').evaluate(el => { el.click(); el.click() })
      await page.getByRole('heading', { name: 'Você explorou o agendamento' }).waitFor()
      assert.match(await page.locator('main').getByRole('status').first().innerText(), /nenhum horário foi reservado/)
      await geometry(`result-${width}`)
      await button('Explorar novamente').click()
      assert.equal(await page.locator('input:checked').count(), 0)
    })
    await check(`cliente ${width}px: duas barbearias, diálogo/Tab/Escape, cancelamento, restauração e recarga`, async () => {
      await goto('/cliente/agendamentos')
      assert.match(await page.locator('main').innerText(), /Navalha/)
      assert.match(await page.locator('main').innerText(), /Barbearia da Esquina/)
      const details = page.getByRole('button', { name: /Ver detalhes/ }).first()
      await details.focus(); await page.keyboard.press('Enter')
      const dialog = page.locator('dialog[open]')
      await dialog.waitFor()
      for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true) }
      const href = await dialog.getByRole('link', { name: 'Ver prévia de reagendamento' }).getAttribute('href')
      assert.match(href, /demo-esquina.*\/agendar$/)
      if (width === 390) await audit('cliente detalhes')
      await geometry(`client-dialog-${width}`)
      await page.keyboard.press('Escape')
      await focused(details)
      await details.click(); await button('Simular cancelamento').click(); await button('Aplicar à amostra').click()
      await page.getByRole('status').filter({ hasText: 'Cancelamento demonstrativo' }).waitFor()
      await focused(page.getByRole('searchbox', { name: 'Buscar nos exemplos' }))
      await button('Restaurar exemplos').click()
      await page.reload()
      await page.locator('main').getByRole('status').filter({ hasText: '2 próximos' }).waitFor()
    })
    await check(`barbeiro ${width}px: conclusão, falta, bloqueio e restauração`, async () => {
      await goto('/barbeiro/agenda')
      for (const action of ['Simular conclusão', 'Simular falta']) {
        await page.getByRole('button', { name: /Ver detalhes/ }).first().click()
        await button(action).click()
        await page.keyboard.press('Escape')
        await button('Restaurar exemplos').click()
      }
      const block = page.getByRole('button', { name: /Simular bloqueio das/ }).first()
      const label = await block.getAttribute('aria-label')
      await block.click()
      await page.getByRole('button', { name: label.replace('bloqueio', 'desbloqueio'), exact: true }).click()
      await button('Restaurar exemplos').click()
      await geometry(`barber-${width}`)
    })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['/barbearias', '/login', '/cadastro', '/cliente/agendamentos', '/cliente/perfil', '/cliente/ajuda', '/barbeiro', '/barbeiro/agenda', '/barbeiro/historico', '/barbeiro/perfil', '/barbeiro/ajuda', '/super-admin', '/super-admin/barbearias', '/admin', '/admin/agenda', '/admin/clientes', '/admin/servicos', '/admin/barbeiros', '/admin/configuracoes']) {
    await check(`axe/landmarks ${route}`, async () => { await goto(route); await geometry(route.replaceAll('/', '_')); await audit(route) })
  }
  await check('wizard: falha final preserva escolhas e reinício durante processamento', async () => {
    await startBooking('final-error'); await chooseToReview()
    await button('Concluir demonstração').click()
    await page.getByRole('alert').filter({ hasText: 'Erro demonstrativo na conclusão' }).waitFor()
    await button('Alterar horário').click()
    assert.equal(await page.locator('input:checked').count(), 1)
    await button('Continuar').click(); await button('Concluir demonstração').click()
    await page.getByLabel('Cenário local', { exact: true }).selectOption('normal')
    await page.waitForTimeout(500)
    assert.equal(await page.getByRole('heading', { name: 'Você explorou o agendamento' }).count(), 0)
    assert.equal(await page.locator('input:checked').count(), 0)
  })
  await check('Navalha: identidade e wizard completo', async () => {
    await goto('/agendar', 'demo-navalha'); await button('Experimentar demonstração').click(); await chooseToReview()
    await button('Concluir demonstração').click(); await page.getByRole('heading', { name: 'Você explorou o agendamento' }).waitFor()
    assert.match(await page.locator('main').innerText(), /Navalha/)
  })
  await check('wizard: cenários vazio, carregamento, erro de horários e recuperação', async () => {
    for (const scenario of ['no-services', 'no-professionals', 'loading', 'no-slots', 'error']) {
      await startBooking(scenario)
      if (scenario === 'no-services') assert.match(await page.locator('main').innerText(), /Nenhum serviço de exemplo/)
      else if (scenario === 'loading') assert.equal(await button('Continuar').isDisabled(), true)
      else {
        const count = scenario === 'no-professionals' ? 1 : 3
        for (let i = 0; i < count; i++) { await chooseRadio(); await button('Continuar').click() }
        if (scenario === 'error') {
          await button('Tentar exemplo novamente').click(); assert.ok(await page.getByRole('radio').count())
        } else assert.match(await page.locator('main').innerText(), scenario === 'no-professionals' ? /Nenhum profissional/ : /Nenhum horário/)
      }
    }
  })
  await check('movimento reduzido: botão público sem ampliação', async () => {
    await goto('/barbearias')
    const action = button('Buscar barbearias'); await action.hover()
    assert(['none', '1'].includes(await action.evaluate(el => getComputedStyle(el).scale)))
  })
  assert.equal(errors.length, 0, errors.join('\n'))
} finally {
  await context.tracing.stop({ path: path.join(dir, 'trace.zip') })
  fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify({ browser: browser.version(), config: c, results, audits, errors }, null, 2))
  await context.close(); await browser.close()
}
