import assert from 'node:assert/strict'

export async function superadminHelpJourneys({ page, context, goto, button, check, geometry, audit, environment }) {
  const main = () => page.locator('main')
  const help = () => page.getByRole('heading', { level: 1, name: 'Ajuda do superadmin', exact: true })
  const openScenarios = async () => {
    const summary = page.getByText('Cenários locais de QA (desenvolvimento)', { exact: true })
    if (!await summary.evaluate(el => el.parentElement.open)) await summary.click()
    await page.getByLabel('Estado da amostra').waitFor({ state: 'visible' })
  }
  const navigate = async name => {
    // Aguarda a navegação RSC e seus efeitos de fechamento antes de reabrir.
    await page.waitForLoadState('networkidle')
    await button('Abrir menu').click()
    await page.locator('dialog[open]').getByRole('link', { name, exact: true }).click()
    await page.waitForURL(url => url.pathname === (name === 'Ajuda' ? '/super-admin/ajuda' : name === 'Início' ? '/super-admin' : '/super-admin/barbearias'))
    if (name === 'Ajuda') await help().waitFor()
    else if (name === 'Início') await page.getByRole('heading', { name: 'Barbearias da amostra', exact: true }).waitFor()
    else await page.getByRole('heading', { level: 1, name: 'Barbearias', exact: true }).waitFor()
    await page.waitForLoadState('networkidle')
  }
  const requests = []
  const record = request => { if (new URL(request.url()).pathname.startsWith('/api/')) requests.push(request.url()) }
  context.on('request', record)
  try {
    await check('ajuda: 320/390/768/1440px, ordem de leitura, mouse, teclado e foco', async () => {
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 }); await goto('/super-admin/ajuda')
        assert.deepEqual(await main().getByRole('heading').allTextContents(), ['Ajuda do superadmin', 'O que você quer fazer?', 'Dúvidas frequentes'])
        assert.equal(await main().getByRole('link').count(), 5)
        const summaries = main().locator('summary')
        assert.equal(await summaries.count(), 13)
        for (let i = 0; i < 13; i++) {
          const summary = summaries.nth(i)
          await summary.focus(); await page.keyboard.press('Enter')
          assert.equal(await summary.evaluate(el => el.parentElement.open), true)
          await page.keyboard.press('Space')
          assert.equal(await summary.evaluate(el => el.parentElement.open), false)
          await summary.click()
          assert.equal(await summary.evaluate(el => el.parentElement.open), true)
        }
        const links = main().getByRole('link')
        for (let i = 0; i < 5; i++) {
          await links.nth(i).focus()
          assert.equal(await links.nth(i).evaluate(el => el === document.activeElement && getComputedStyle(el).outlineStyle !== 'none' && el.getBoundingClientRect().height >= 44), true)
        }
        await links.last().focus(); await page.keyboard.press('Tab')
        assert.equal(await summaries.first().evaluate(el => el === document.activeElement && getComputedStyle(el).outlineStyle !== 'none'), true)
        await geometry(`superadmin-help-${width}`); await audit(`ajuda superadmin ${width}px expandida`)
      }
    })
    await check('ajuda: menu habilitado, todos os atalhos navegáveis e formulário aberto manualmente', async () => {
      await goto('/super-admin'); await navigate('Ajuda')
      await button('Abrir menu').click()
      assert.equal(await page.locator('dialog[open]').getByRole('link', { name: 'Planos e assinaturas', exact: true }).count(), 0)
      await page.keyboard.press('Escape')
      for (const title of ['Entender a visão geral', 'Buscar e consultar barbearias', 'Experimentar o cadastro manual', 'Experimentar suspensão ou reativação']) {
        const link = main().getByRole('link', { name: new RegExp(`^${title}`) })
        await link.focus(); await page.keyboard.press('Enter')
        await page.getByRole('heading', { name: title === 'Entender a visão geral' ? 'Barbearias da amostra' : 'Estabelecimentos', exact: true }).waitFor()
        if (title === 'Experimentar o cadastro manual') {
          assert.equal(await page.getByRole('form', { name: 'Cadastro manual demonstrativo' }).count(), 0)
          await button('Cadastrar barbearia').click()
          await page.getByRole('form', { name: 'Cadastro manual demonstrativo' }).waitFor()
          await button('Cancelar').click()
        }
        await navigate('Ajuda')
      }
    })
    let draftPath
    async function createDraft() {
      await navigate('Barbearias'); await button('Cadastrar barbearia').click()
      for (const [key, value] of Object.entries({ name: 'Rascunho Ajuda QA', city: 'Rio de Janeiro', neighborhood: 'Méier', subdomain: 'ajuda-qa', manualReason: 'Conferir navegação pela ajuda.' })) await page.locator(`#registration-${key}`).fill(value)
      await button('Criar na demonstração').click()
      await page.waitForURL(url => url.pathname.startsWith('/super-admin/barbearias/manual-'))
      await page.getByRole('heading', { level: 2, name: 'Rascunho Ajuda QA', exact: true }).waitFor()
      await page.waitForFunction(() => document.activeElement?.id === 'shop-title')
      draftPath = new URL(page.url()).pathname
    }
    await check('ajuda: rascunho e suspensão preservados na ida/volta interna', async () => {
      await goto('/super-admin/barbearias/demo-esquina')
      await button('Suspender na amostra').click(); await button('Confirmar suspender na amostra').click()
      await button('Reativar na amostra').waitFor()
      await createDraft(); await navigate('Ajuda'); await navigate('Barbearias')
      await page.getByRole('link', { name: 'Ver detalhes de Rascunho Ajuda QA', exact: true }).click()
      await page.waitForURL(url => url.pathname === draftPath)
      await page.getByRole('heading', { level: 2, name: 'Rascunho Ajuda QA', exact: true }).waitFor()
      assert.match(await main().innerText(), /Conferir navegação pela ajuda/)
      await navigate('Ajuda'); await navigate('Início')
      assert.deepEqual(await main().locator('dd').allTextContents(), ['7', '1', '5', '1'])
      await navigate('Barbearias')
      await page.getByRole('link', { name: 'Ver detalhes de Barbearia da Esquina', exact: true }).click()
      await button('Reativar na amostra').waitFor()
    })
    await check('ajuda: recarga restaura a amostra e rascunho torna-se indisponível', async () => {
      await navigate('Ajuda'); await page.reload(); await help().waitFor(); await navigate('Início')
      assert.deepEqual(await main().locator('dd').allTextContents(), ['6', '0', '6', '0'])
      await goto(draftPath); await page.getByRole('heading', { name: 'Exemplo indisponível', exact: true }).waitFor()
      await navigate('Ajuda'); await help().waitFor()
    })
    if (environment === 'development') await check('ajuda: acessível com lista vazia e erro demonstrativo preservados', async () => {
      for (const scenario of ['empty', 'error']) {
        await navigate('Barbearias')
        await openScenarios()
        await page.getByLabel('Estado da amostra').selectOption(scenario)
        await navigate('Ajuda'); assert.equal(await main().locator('details').count(), 13)
        await navigate('Barbearias')
        assert.equal(await page.getByLabel('Estado da amostra').inputValue(), scenario)
        await openScenarios()
        await page.getByLabel('Estado da amostra').selectOption('ready')
      }
    })
    await check('ajuda: aviso junto ao onboarding, exemplo independente e descarte ao sair', async () => {
      await goto('/super-admin/barbearias/demo-esquina')
      await button('Suspender na amostra').click(); await button('Confirmar suspender na amostra').click(); await button('Reativar na amostra').waitFor()
      await createDraft(); await navigate('Ajuda')
      const link = main().getByRole('link', { name: /^Ver demonstração do onboarding/ })
      assert.match(await link.innerText(), /rascunhos e alterações locais são descartados/)
      assert.match(await link.innerText(), /Nenhum dado será transferido ao proprietário/)
      await link.click()
      await button('Experimentar demonstração do aceite').waitFor()
      assert.doesNotMatch(await main().innerText(), /Rascunho Ajuda QA|ajuda-qa/)
      assert.equal(new URL(page.url()).search, '?origem=superadmin')
      await page.goBack(); await help().waitFor(); await navigate('Início')
      assert.deepEqual(await main().locator('dd').allTextContents(), ['6', '0', '6', '0'])
    })
    await check('ajuda: nenhuma chamada de API ou armazenamento da amostra', async () => {
      assert.deepEqual(requests, [])
      assert.deepEqual(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), cookies: document.cookie })), { local: [], session: [], cookies: '' })
    })
  } finally { context.off('request', record) }
}
