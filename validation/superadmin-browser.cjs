const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = `http://localhost:${process.argv[2] || 3000}`;
const results = [];
const artifactDir = path.join(__dirname, 'superadmin');
fs.mkdirSync(artifactDir, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const context = await browser.newContext(); const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(20000);
  const errors = [], apiRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  const main = () => page.locator('main');
  const status = () => main().locator('[role=status]');
  async function check(name, fn) { await fn(); results.push({ name, passed: true }); console.log('PASS', name); }
  async function navigate(name) {
    await page.getByRole('navigation', { name: 'Superadmin', exact: true }).getByRole('link', { name, exact: true }).click();
    await page.getByRole('heading', { name: name === 'Início' ? 'Barbearias da amostra' : 'Estabelecimentos', exact: true }).waitFor();
  }
  async function search(query) {
    await page.getByRole('searchbox', { name: 'Buscar barbearia' }).fill(query); await page.getByRole('button', { name: 'Buscar', exact: true }).click();
    await page.waitForURL(url => url.searchParams.get('q') === query);
    await main().locator('[role=status]').filter({ hasText: `Busca: “${query}”` }).waitFor();
  }
  async function scenario(value) {
    const summary = page.getByText('Cenários locais de QA (desenvolvimento)', { exact: true });
    if (!await summary.evaluate(el => el.parentElement.open)) await summary.click();
    await page.getByLabel('Estado da amostra').selectOption(value);
  }
  async function noOverflow() { assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); }
  try {
    await page.goto(`${base}/super-admin`);
    await check('visão geral calculada, demonstração explícita e navegação existente', async () => {
      await page.getByRole('heading', { name: 'Visão geral', exact: true }).waitFor();
      assert.deepEqual(await main().locator('dd').allTextContents(), ['6', '6', '0']);
      assert.ok((await main().innerText()).includes('não representam autenticação ou autorização'));
      assert.equal(await main().locator('nav a').count(), 2);
    });
    await navigate('Barbearias');
    await check('lista tem seis exemplos e busca por bairro sem acento', async () => {
      assert.equal(await main().getByRole('link', { name: /^Ver detalhes de/ }).count(), 6);
      await search('meier');
      assert.equal(await main().getByRole('link', { name: /^Ver detalhes de/ }).count(), 1);
      assert.ok((await status().innerText()).includes('1 de 6'));
    });
    await check('detalhes e retorno preservam busca, inclusive voltar do navegador', async () => {
      await main().getByRole('link', { name: 'Ver detalhes de Navalha & Pente', exact: true }).click();
      await page.getByRole('heading', { name: 'Detalhes da barbearia', exact: true }).waitFor();
      assert.ok(page.url().includes('q=meier')); assert.ok((await main().innerText()).includes('Méier'));
      await main().getByRole('link', { name: 'Voltar à lista com a busca', exact: true }).click();
      assert.equal(await page.getByRole('searchbox').inputValue(), 'meier');
      await main().getByRole('link', { name: 'Ver detalhes de Navalha & Pente', exact: true }).click();
      await page.waitForURL(url => url.pathname.endsWith('/demo-navalha'));
      await page.getByRole('heading', { name: 'Detalhes da barbearia', exact: true }).waitFor();
      await page.goBack();
      await page.waitForURL(url => url.pathname === '/super-admin/barbearias');
      assert.equal(await page.getByRole('searchbox').inputValue(), 'meier');
      await main().getByRole('link', { name: 'Ver detalhes de Navalha & Pente', exact: true }).click();
    });
    await check('diálogo por teclado: nome acessível, foco contido, Escape e cancelamento', async () => {
      const trigger = page.getByRole('button', { name: 'Suspender na amostra', exact: true });
      await trigger.focus(); await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Suspender na amostra?' }); await dialog.waitFor();
      assert.ok(await dialog.getAttribute('aria-describedby'));
      // Native modal dialogs may yield a Tab stop to browser chrome (activeElement=body),
      // but background controls must never receive keyboard focus while open.
      for (let i = 0; i < 7; i++) { await page.keyboard.press('Tab'); assert.ok(await dialog.evaluate(el => el.contains(document.activeElement) || document.activeElement === document.body)); }
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' }); assert.ok(await trigger.evaluate(el => el === document.activeElement));
      await trigger.click(); await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
      assert.ok((await main().innerText()).includes('Ativa na amostra'));
    });
    await check('suspensão: feedback associado, sem persistência, lista e resumo coerentes', async () => {
      await page.getByRole('button', { name: 'Suspender na amostra', exact: true }).click();
      await page.getByRole('button', { name: 'Confirmar suspender na amostra', exact: true }).click();
      const trigger = page.getByRole('button', { name: 'Reativar na amostra', exact: true });
      await trigger.waitFor(); assert.ok(await trigger.evaluate(el => el === document.activeElement));
      assert.equal(await trigger.getAttribute('aria-describedby'), 'status-limits');
      assert.ok((await status().innerText()).includes('Nada foi salvo ou aplicado a uma barbearia real'));
      await page.getByRole('link', { name: 'Voltar à lista com a busca', exact: true }).click();
      assert.ok((await main().innerText()).includes('Suspensa na amostra'));
      await navigate('Início'); assert.deepEqual(await main().locator('dd').allTextContents(), ['6', '5', '1']);
    });
    await navigate('Barbearias'); await search('meier');
    await page.getByRole('link', { name: 'Ver detalhes de Navalha & Pente', exact: true }).click();
    await check('reativação e resumo retornam ao estado inicial', async () => {
      await page.getByRole('button', { name: 'Reativar na amostra', exact: true }).click();
      await page.getByRole('button', { name: 'Confirmar reativar na amostra', exact: true }).click();
      assert.ok((await status().innerText()).includes('reativada somente na amostra'));
      await navigate('Início'); assert.deepEqual(await main().locator('dd').allTextContents(), ['6','6','0']);
    });
    await navigate('Barbearias');
    await check('busca por nome e cidade, limpar e ausência de resultados', async () => {
      await search('RAIZES'); assert.equal(await main().getByRole('link', { name: /^Ver detalhes de/ }).count(), 1);
      await search('Nova Iguaçu'); assert.equal(await main().getByRole('link', { name: /^Ver detalhes de/ }).count(), 2);
      await search('zzzz'); await page.getByRole('heading', { name: 'Nenhum resultado para esta busca' }).waitFor();
      await page.getByRole('link', { name: 'Limpar busca', exact: true }).click();
      await main().locator('[role=status]').filter({ hasText: '6 de 6 barbearias da amostra' }).waitFor();
      assert.equal(await page.getByRole('searchbox').inputValue(), '');
    });
    const development = await page.getByText('Cenários locais de QA (desenvolvimento)', { exact: true }).count() > 0;
    if (development) {
      for (const [value, heading] of [['loading', 'Preparando a amostra'], ['empty', 'Nenhuma barbearia na amostra'], ['error', 'Não foi possível exibir a amostra']]) {
        await check(`estado de ${value} e recuperação`, async () => {
          await scenario(value); await page.getByRole('heading', { name: heading, exact: true }).waitFor();
          if (value === 'error') await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click(); else await scenario('ready');
          await page.getByRole('heading', { name: 'Estabelecimentos', exact: true }).waitFor();
        });
      }
    } else await check('produção não oferece seletores de cenários', async () => assert.equal(await main().getByLabel('Estado da amostra').count(), 0));
    await check('keyboard: busca e foco visível', async () => {
      await page.getByRole('searchbox').focus(); await page.keyboard.press('Tab');
      const button = page.getByRole('button', { name: 'Buscar', exact: true });
      assert.ok(await button.evaluate(el => el === document.activeElement && getComputedStyle(el).outlineStyle !== 'none'));
    });
    for (const width of [320, 390, 768, 1440]) {
      await check(`lista ${width}px sem rolagem horizontal`, async () => {
        await page.setViewportSize({ width, height: 900 }); await noOverflow();
        await page.screenshot({ path: path.join(artifactDir, `list-${width}.png`), fullPage: true });
      });
    }
    await page.getByRole('link', { name: 'Ver detalhes de Barbearia da Esquina', exact: true }).click();
    for (const width of [320, 390, 768, 1440]) {
      await check(`detalhes e diálogo ${width}px sem corte`, async () => {
        await page.setViewportSize({ width, height: 900 }); await noOverflow();
        await page.getByRole('button', { name: 'Suspender na amostra', exact: true }).click();
        const dialog = page.getByRole('dialog', { name: 'Suspender na amostra?' }); await dialog.waitFor();
        const box = await dialog.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width);
        await page.screenshot({ path: path.join(artifactDir, `dialog-${width}.png`), fullPage: true });
        await page.keyboard.press('Escape'); await noOverflow();
        await page.screenshot({ path: path.join(artifactDir, `details-${width}.png`), fullPage: true });
      });
    }
    await check('recarregar restaura suspensão local e não cria armazenamento', async () => {
      await page.getByRole('button', { name: 'Suspender na amostra', exact: true }).click();
      await page.getByRole('button', { name: 'Confirmar suspender na amostra', exact: true }).click();
      await page.reload(); await page.getByRole('button', { name: 'Suspender na amostra', exact: true }).waitFor();
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      assert.equal((await context.cookies()).length, 0);
    });
    await check('catálogo independente e saída da área restaura amostra', async () => {
      await page.getByRole('button', { name: 'Suspender na amostra', exact: true }).click();
      await page.getByRole('button', { name: 'Confirmar suspender na amostra', exact: true }).click();
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      await page.getByRole('button', { name: 'Sair', exact: true }).focus(); await page.keyboard.press('Enter');
      await page.waitForURL(base + '/');
      await page.goto(base + '/barbearias'); await main().getByRole('heading', { name: 'Barbearia da Esquina', exact: true }).waitFor();
      await page.goto(base + '/super-admin'); await page.getByRole('heading', { name: 'Barbearias da amostra', exact: true }).waitFor();
      assert.deepEqual(await main().locator('dd').allTextContents(), ['6','6','0']);
    });
    for (const width of [320,390,768,1440]) {
      await check(`visão geral ${width}px sem corte`, async () => { await page.setViewportSize({ width, height: 900 }); await noOverflow(); await page.screenshot({ path: path.join(artifactDir, `overview-${width}.png`), fullPage: true }); });
    }
    await check('identificador desconhecido tem estado indisponível e retorno válido', async () => {
      await page.goto(base + '/super-admin/barbearias/unknown'); await page.getByRole('heading', { name: 'Barbearia não encontrada na amostra', exact: true }).waitFor();
      await page.getByRole('link', { name: 'Voltar à lista', exact: true }).click(); await page.getByRole('heading', { name: 'Barbearias', exact: true }).waitFor();
    });
    await check('sem erros JavaScript ou chamadas de API', async () => { assert.deepEqual(errors, []); assert.deepEqual(apiRequests, []); });
    fs.writeFileSync(path.join(artifactDir, `browser-results-${development ? 'development' : 'production'}.json`), JSON.stringify({ base, results, errors, apiRequests }, null, 2));
    console.log(`${results.length} verificações aprovadas.`);
  } catch (error) {
    await page.screenshot({ path: path.join(artifactDir, 'failure.png'), fullPage: true }).catch(() => {});
    console.error('Failure URL:', page.url());
    throw error;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
