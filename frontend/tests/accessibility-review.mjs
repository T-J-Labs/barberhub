import assert from 'node:assert/strict'

// Evidência DOM para revisão dos inconclusivos, sem convertê-los em aprovação axe.
export async function incompleteEvidence(page, incomplete) {
  const evidence = []
  for (const rule of incomplete) for (const node of rule.nodes) {
    const target = node.target.join(' ')
    const inspection = await page.locator(target).evaluate(el => {
      const style = getComputedStyle(el), rect = el.getBoundingClientRect()
      const references = [...el.attributes].filter(a => ['aria-controls', 'aria-labelledby', 'aria-describedby'].includes(a.name))
        .flatMap(a => a.value.split(/\s+/).map(id => {
          const referenced = document.getElementById(id)
          return { attribute: a.name, id, exists: !!referenced, visible: referenced?.checkVisibility() ?? false, role: referenced?.getAttribute('role'), tag: referenced?.tagName }
        }))
      const x = Math.max(0, Math.min(innerWidth - 1, rect.x + rect.width / 2))
      const y = Math.max(0, Math.min(innerHeight - 1, rect.y + rect.height / 2))
      const top = document.elementFromPoint(x, y)
      const backgrounds = []
      for (let parent = el; parent; parent = parent.parentElement) {
        const background = getComputedStyle(parent).backgroundColor
        if (background !== 'rgba(0, 0, 0, 0)') backgrounds.push({ tag: parent.tagName, background })
      }
      return { html: el.outerHTML, references, foreground: style.color, background: style.backgroundColor, backgrounds,
        fontSize: style.fontSize, fontWeight: style.fontWeight, visible: el.checkVisibility(),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        topAtCenter: top?.outerHTML.slice(0, 500), centerUnobscured: top === el || el.contains(top) }
    })
    evidence.push({ rule: rule.id, target, inspection, disposition: 'Requer revisão DOM/visual; não é aprovação automática nem teste de leitor de tela' })
  }
  return evidence
}

export async function keyboardSweep(page) {
  // Cada rota começa no documento, sem herdar o cursor sequencial da rota
  // anterior no Firefox. O percurso continua inteiramente por Tab nativo.
  await page.evaluate(() => {
    const before = document.body.getAttribute('tabindex')
    document.body.setAttribute('tabindex', '-1')
    document.body.focus({ preventScroll: true })
    if (before === null) document.body.removeAttribute('tabindex')
    else document.body.setAttribute('tabindex', before)
  })
  // As ferramentas Next são externas ao produto e prendem Tab no shadow DOM
  // do Firefox. Excluí-las temporariamente mantém o percurso da aplicação real.
  const developmentTools = await page.evaluateHandle(() => [...document.querySelectorAll('nextjs-portal')].map(el => {
    const inert = el.inert; el.inert = true; return { el, inert }
  }))
  // A hidratação pode inserir nós durante o percurso. A posição em
  // querySelectorAll('*') não é uma identidade estável do controle.
  const focusIndices = await page.evaluateHandle(() => new Map())
  try {
  const controls = [], seen = new Set()
  let completed = false
  const firefox = page.context().browser()?.browserType().name() === 'firefox'
  let previousIndex, repeated = 0
  for (let i = 0; i < 160; i++) {
    await page.keyboard.press('Tab')
    const current = await page.evaluate(registry => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      // O foco do shadow DOM das ferramentas Next não pertence ao produto.
      if (el.tagName === 'NEXTJS-PORTAL') return { developmentTool: true }
      const style = getComputedStyle(el), r = el.getBoundingClientRect()
      // Inputs sr-only usam a indicação do label; os demais podem usar ring.
      const indicator = r.width <= 1 && r.height <= 1 ? el.closest('label') : el
      const indicatorStyle = indicator ? getComputedStyle(indicator) : style
      const indicatorRect = indicator?.getBoundingClientRect() ?? r
      if (!registry.has(el)) registry.set(el, registry.size)
      return { index: registry.get(el), documentIndex: [...document.querySelectorAll('*')].indexOf(el), tag: el.tagName,
        label: el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 100) || el.getAttribute('name'),
        visible: el.checkVisibility(), focusVisible: el.matches(':focus-visible'),
        outline: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor,
        indicator: { tag: indicator?.tagName, outline: indicatorStyle.outlineStyle,
          outlineWidth: indicatorStyle.outlineWidth, boxShadow: indicatorStyle.boxShadow,
          width: indicatorRect.width, height: indicatorRect.height },
        rect: { x: r.x, y: r.y, width: r.width, height: r.height } }
    }, focusIndices)
    if (current?.developmentTool) continue
    if (!current) { if (controls.length) { completed = true; break } continue }
    repeated = current.index === previousIndex ? repeated + 1 : 0
    previousIndex = current.index
    if (seen.has(current.index)) {
      if (current.index === controls[0].index) { completed = true; break }
      // Firefox headless retém activeElement ao Tab sair do documento. Só
      // aceitar esse limite se todos os controles visíveis foram visitados e
      // Shift+Tab conseguir retornar a outro controle (não encerrar num trap).
      if (firefox && repeated >= 3) {
        const allVisited = await page.evaluate(({ indices, registry }) => [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]')]
          .filter(el => el.tabIndex >= 0 && !el.matches(':disabled') && !el.closest('[inert]') && el.checkVisibility({ visibilityProperty: true }))
          .every(el => registry.has(el) && indices.includes(registry.get(el))), { indices: [...seen], registry: focusIndices })
        if (allVisited) {
          let returned = false
          for (let segment = 0; segment < 8 && !returned; segment++) {
            await page.keyboard.press('Shift+Tab')
            returned = await page.evaluate(({ index, registry }) => document.activeElement !== document.body &&
              registry.has(document.activeElement) && registry.get(document.activeElement) !== index,
              { index: current.index, registry: focusIndices })
          }
          assert(returned, 'Firefox: Shift+Tab não sai do controle terminal')
          console.log('PASS keyboard: limite do documento Firefox, todos os controles visitados e retorno por Shift+Tab')
          completed = true; break
        }
      }
      // Segmentos nativos de campos date/time compartilham o mesmo elemento.
      continue
    }
    seen.add(current.index); controls.push(current)
    assert(current.visible, `Foco em controle oculto: ${current.label}`)
    assert(current.focusVisible && current.indicator.width > 1 && current.indicator.height > 1 &&
      ((current.indicator.outline !== 'none' && parseFloat(current.indicator.outlineWidth) > 0) || current.indicator.boxShadow !== 'none'),
      `Foco sem indicação de teclado: ${JSON.stringify(current)}`)
  }
  assert(controls.length > 0, 'Nenhum controle alcançado por Tab')
  assert(completed, 'Percurso Tab excedeu limite; verificar ciclo')
  return controls
  } finally {
    await page.evaluate(tools => tools.forEach(({ el, inert }) => { el.inert = inert }), developmentTools)
    await developmentTools.dispose()
    await focusIndices.dispose()
  }
}
