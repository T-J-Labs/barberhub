const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('./qa-browser.cjs');
const port = process.argv[2] || 3000;
const base = `http://localhost:${port}`;
const dir = require('./qa-output.cjs').outputDirectory('superadmin-registration-browser');
fs.mkdirSync(dir, { recursive: true });
const notice = 'Barbearia adicionada à amostra — nenhum estabelecimento real foi criado. Subdomínio, acesso e publicação não foram provisionados.';
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const context = await browser.newContext(); const page = await context.newPage();
  page.setDefaultTimeout(15000); page.setDefaultNavigationTimeout(20000);
  const results = [], errors = [], apiRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  context.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  const main = () => page.locator('main');
  const field = key => page.locator(`#registration-${key}`);
  const submit = () => page.getByRole('button', { name: 'Criar na demonstração', exact: true });
  const form = () => page.getByRole('form', { name: 'Cadastro manual demonstrativo', exact: true });
  const input = { name: '  Barbearia São João QA  ', city: ' Rio de Janeiro ', neighborhood: ' Méier ', subdomain: '  NOVO-QA-MANUAL  ', manualReason: '  Exercício manual sem estabelecimento real.  ' };
  async function check(name, fn) { await fn(); results.push({ name, passed: true }); console.log('PASS', name); }
  async function fill(value = input) { for (const [key, text] of Object.entries(value)) await field(key).fill(text); }
  async function navigate(name) {
    await page.getByRole('navigation', { name: 'Superadmin', exact: true }).getByRole('link', { name, exact: true }).click();
    await page.getByRole('heading', { name: name === 'Início' ? 'Barbearias da amostra' : 'Estabelecimentos', exact: true }).waitFor();
  }
  async function search(value) {
    await page.getByRole('searchbox').fill(value); await page.getByRole('button', { name: 'Buscar', exact: true }).click();
    await main().getByRole('status').filter({ hasText: `Busca: “${value}”` }).waitFor();
  }
  async function noOverflow() { assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); }
  let id;
  try {
    await page.goto(base + '/super-admin/barbearias?q=meier');
    await page.getByRole('heading', { name: 'Estabelecimentos', exact: true }).waitFor();
    await check('cadastro abre por teclado acima da busca e foca o título', async () => {
      const trigger = page.getByRole('button', { name: 'Cadastrar barbearia', exact: true });
      await trigger.focus(); await page.keyboard.press('Enter'); await form().waitFor();
      assert.ok(await page.locator('#registration-title').evaluate(el => el === document.activeElement));
      assert.ok(await form().evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('[role=search]')) & Node.DOCUMENT_POSITION_FOLLOWING)));
      assert.equal(await form().locator('input').count(), 4); assert.equal(await form().locator('textarea').count(), 1);
      assert.deepEqual(await form().locator('input,textarea').evaluateAll(els => els.map(el => el.maxLength)), [120,80,80,63,500]);
    });
    await check('cancelar não cria item, restaura foco e preserva busca', async () => {
      await fill(); await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
      await form().waitFor({ state: 'hidden' });
      assert.ok(await page.getByRole('button', { name: 'Cadastrar barbearia', exact: true }).evaluate(el => el === document.activeElement));
      assert.equal(await page.getByRole('searchbox').inputValue(), 'meier');
      await navigate('Início'); assert.deepEqual(await main().locator('dd').allTextContents(), ['6','0','6','0']);
      await navigate('Barbearias'); await search('meier');
      await page.getByRole('button', { name: 'Cadastrar barbearia', exact: true }).click();
      for (const key of Object.keys(input)) assert.equal(await field(key).inputValue(), '');
    });
    await check('vazios e espaços: erros associados e foco no primeiro campo inválido', async () => {
      await field('name').fill('   '); await submit().click();
      for (const key of Object.keys(input)) {
        assert.equal(await field(key).getAttribute('aria-invalid'), 'true');
        assert.ok((await field(key).getAttribute('aria-describedby')).includes(`registration-${key}-error`));
      }
      assert.ok(await field('name').evaluate(el => el === document.activeElement));
      assert.equal(await field('name').inputValue(), '   ');
      assert.ok((await form().getByRole('alert').innerText()).includes('valores preenchidos foram preservados'));
    });
    await check('subdomínio inválido/reservado/duplicado preserva campos e foca subdomínio', async () => {
      await fill();
      for (const subdomain of ['https://foo', 'foo:3000', 'foo/path', 'Árvore', 'admin', '  DEMO-ESQUINA  ']) {
        await field('subdomain').fill(subdomain); await submit().click();
        assert.equal(await field('subdomain').getAttribute('aria-invalid'), 'true');
        assert.ok(await field('subdomain').evaluate(el => el === document.activeElement));
        assert.equal(await field('name').inputValue(), input.name); assert.equal(await field('manualReason').inputValue(), input.manualReason);
      }
    });
    for (const width of [320,390,768,1440]) {
      await check(`formulário com erros ${width}px: foco visível e sem corte`, async () => {
        await page.setViewportSize({ width, height: 900 }); await noOverflow();
        await field('subdomain').focus(); await page.keyboard.press('Tab');
        assert.ok(await field('manualReason').evaluate(el => el === document.activeElement && getComputedStyle(el).outlineStyle !== 'none'));
        await page.screenshot({ path: path.join(dir, `form-errors-${width}.png`), fullPage: true });
      });
    }
    await check('cadastro válido com cliques repetidos cria somente um ID e abre detalhes', async () => {
      await field('subdomain').fill(input.subdomain);
      // Dois cliques síncronos antes do render exercitam o bloqueio via ref.
      await submit().evaluate(el => { el.click(); el.click(); });
      await page.waitForURL(url => url.pathname.startsWith('/super-admin/barbearias/manual-'));
      await main().getByRole('heading', { name: 'Barbearia São João QA', exact: true }).waitFor();
      id = new URL(page.url()).pathname.split('/').at(-1);
      assert.match(id, /^manual-[0-9a-f-]{36}$/); assert.equal(new URL(page.url()).searchParams.get('q'), 'meier');
      assert.equal(await main().getByRole('status').innerText(), notice);
      assert.ok(await main().getByRole('heading', { name: 'Barbearia São João QA', exact: true }).evaluate(el => el === document.activeElement));
      assert.ok((await main().innerText()).includes('Rascunho na amostra'));
      assert.ok((await main().innerText()).includes(input.manualReason.trim()));
      assert.ok((await main().innerText()).includes('novo-qa-manual'));
      assert.equal(await main().getByRole('button', { name: /Suspender|Reativar/ }).count(), 0);
      assert.equal(await main().locator('input,textarea').count(), 0);
    });
    for (const width of [320,390,768,1440]) {
      await check(`detalhes do rascunho ${width}px sem corte`, async () => { await page.setViewportSize({ width, height: 900 }); await noOverflow(); await page.screenshot({ path: path.join(dir, `draft-${width}.png`), fullPage: true }); });
    }
    await check('retorno preserva busca e rascunho aparece na lista e na busca pelo nome', async () => {
      await page.getByRole('link', { name: 'Voltar à lista com a busca', exact: true }).click();
      await main().getByRole('status').filter({ hasText: '2 de 7' }).waitFor();
      assert.equal(await page.getByRole('searchbox').inputValue(), 'meier');
      await search('São João QA'); assert.equal(await main().getByRole('link', { name: /^Ver detalhes de/ }).count(), 1);
      await main().getByRole('link', { name: 'Ver detalhes de Barbearia São João QA', exact: true }).click();
      await page.waitForURL(url => url.pathname.endsWith(id));
      await page.getByRole('heading', { name: 'Barbearia São João QA', exact: true }).waitFor();
    });
    await check('resumo calcula total e rascunhos da mesma coleção', async () => {
      await navigate('Início'); assert.deepEqual(await main().locator('dd').allTextContents(), ['7','1','6','0']);
      for (const width of [320,390,768,1440]) { await page.setViewportSize({ width, height: 900 }); await noOverflow(); }
    });
    await navigate('Barbearias');
    await check('duplicidade inclui rascunhos após navegação interna', async () => {
      await page.getByRole('button', { name: 'Cadastrar barbearia', exact: true }).click(); await fill();
      await submit().click(); await page.locator('#registration-subdomain-error').waitFor();
      assert.ok((await page.locator('#registration-subdomain-error').innerText()).includes('já existe na amostra'));
      await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
      await navigate('Início'); assert.deepEqual(await main().locator('dd').allTextContents(), ['7','1','6','0']);
    });
    await check('catálogo e host pretendido não recebem o rascunho', async () => {
      const publicPage = await context.newPage();
      try {
        await publicPage.goto(base + '/barbearias'); await publicPage.getByRole('heading', { name: 'Barbearia da Esquina', exact: true }).waitFor();
        assert.equal(await publicPage.getByRole('heading', { name: 'Barbearia São João QA', exact: true }).count(), 0);
        await publicPage.goto(`http://novo-qa-manual.localhost:${port}/`);
        await publicPage.getByRole('heading', { name: 'Barbearia não encontrada', exact: true }).waitFor();
        assert.equal(await publicPage.getByRole('heading', { name: 'Barbearia São João QA', exact: true }).count(), 0);
      } finally { await publicPage.close(); }
    });
    await navigate('Barbearias'); await search('São João QA');
    await page.getByRole('link', { name: 'Ver detalhes de Barbearia São João QA', exact: true }).click();
    await page.waitForURL(url => url.pathname.endsWith(id));
    await page.getByRole('heading', { name: 'Barbearia São João QA', exact: true }).waitFor();
    await check('recarga perde rascunho, preserva retorno da busca e mostra Exemplo indisponível', async () => {
      await page.reload(); await page.getByRole('heading', { name: 'Exemplo indisponível', exact: true }).waitFor();
      assert.equal(await main().getByRole('button', { name: /Suspender|Reativar/ }).count(), 0);
      await page.getByRole('link', { name: 'Voltar à lista com a busca', exact: true }).click();
      await page.getByRole('heading', { name: 'Nenhum resultado para esta busca', exact: true }).waitFor();
      assert.equal(await page.getByRole('searchbox').inputValue(), 'São João QA');
      await navigate('Início'); assert.deepEqual(await main().locator('dd').allTextContents(), ['6','0','6','0']);
    });
    await check('ID desconhecido e retorno válidos', async () => {
      await page.goto(base + '/super-admin/barbearias/unknown?q=meier'); await page.getByRole('heading', { name: 'Exemplo indisponível', exact: true }).waitFor();
      await page.getByRole('link', { name: 'Voltar à lista com a busca', exact: true }).click();
      await main().getByRole('status').filter({ hasText: '1 de 6' }).waitFor();
    });
    await check('saída por navegação interna remove rascunho e não cria armazenamento/API', async () => {
      await page.getByRole('button', { name: 'Cadastrar barbearia', exact: true }).click(); await fill(); await submit().click();
      await page.waitForURL(url => url.pathname.startsWith('/super-admin/barbearias/manual-'));
      await page.getByRole('heading', { name: 'Barbearia São João QA', exact: true }).waitFor();
      const lostUrl = page.url();
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      await page.getByRole('button', { name: 'Sair', exact: true }).focus(); await page.keyboard.press('Enter'); await page.waitForURL(base + '/');
      await page.goto(lostUrl); await page.getByRole('heading', { name: 'Exemplo indisponível', exact: true }).waitFor();
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0); assert.equal((await context.cookies()).length, 0);
      assert.deepEqual(apiRequests, []); assert.deepEqual(errors, []);
    });
    const development = await page.getByText('Cenários locais de QA (desenvolvimento)', { exact: true }).count() > 0;
    fs.writeFileSync(path.join(dir, `results-${development ? 'development' : 'production'}.json`), JSON.stringify({ base, results, errors, apiRequests }, null, 2));
    console.log(`${results.length} verificações aprovadas.`);
  } catch (error) {
    await page.screenshot({ path: path.join(dir, 'failure.png'), fullPage: true }).catch(() => {}); console.error('Failure URL:', page.url()); throw error;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
