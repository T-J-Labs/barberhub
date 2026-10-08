// Capturas autênticas para proposta de design; não modifica a aplicação.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../../../validation/tools/node_modules/playwright');
const dir = __dirname;
const assets = path.join(dir, 'captures');
fs.mkdirSync(assets, { recursive: true });
const records = [];
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  async function capture(name, route, width, state, region) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto(route);
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (name.startsWith('booking')) {
      await page.getByRole('button', { name: 'Experimentar demonstração', exact: true }).click();
      await page.getByRole('heading', { name: 'Qual cuidado você procura?' }).waitFor();
      await page.getByRole('radio').first().locator('..').click();
      await page.getByRole('heading', { name: 'Qual cuidado você procura?' }).focus();
      await page.keyboard.press('Tab');
    }
    await page.evaluate(() => window.scrollTo(0,0));
    const clip = await region(page);
    console.log(name, clip);
    Object.keys(clip).forEach(key => clip[key] = Math.round(clip[key]));
    // Oculta exclusivamente o indicador de desenvolvimento do Next.js, fora da UI do produto.
    await page.screenshot({ path: path.join(assets, `${name}.png`), clip, fullPage:true, style:'nextjs-portal { visibility:hidden }' });
    records.push({ file: `captures/${name}.png`, url: page.url(), viewport: { width, height: 1100 }, dpr: 1, state, clip });
  }
  const local = 'http://localhost:3000';
  const shop = 'http://demo-esquina.localhost:3000';
  const agendaDesktop = async p => {
    const box = await p.getByLabel('Filtrar por barbeiro').locator('../..').boundingBox();
    return { x:256, y:box.y-16, width:1168, height:660 };
  };
  const agendaMobile = async p => {
    const box = await p.getByRole('heading', { name:'Linha do tempo' }).boundingBox();
    return { x:16, y:box.y-20, width:358, height:700 };
  };
  await capture('agenda-desktop', `${local}/admin/agenda`,1440,'Estado inicial; primeira data de junho de 2025; todos os filtros; nenhum registro novo.',agendaDesktop);
  await capture('agenda-mobile', `${local}/admin/agenda`,390,'Estado inicial; recorte da linha do tempo e atendimentos; todos os filtros.',agendaMobile);
  await capture('profile-desktop', `${shop}/`,1440,'Fixture pública demo-esquina; visitante; perfil e início dos serviços.',async p => {
    const box = await p.locator('main').boundingBox();
    return { x:box.x+24,y:box.y+24,width:box.width-48,height:860 };
  });
  await capture('profile-mobile', `${shop}/`,390,'Fixture demo-esquina; visitante; recorte do nome, localização, apresentação e serviços; logo de iniciais acima do recorte.',async p => {
    const box = await p.getByRole('heading', {level:1}).boundingBox();
    return { x:16,y:box.y-16,width:358,height:840 };
  });
  await capture('booking-desktop', `${shop}/agendar`,1440,'Demonstração iniciada; etapa 1/5 Serviço; primeiro serviço marcado; sem avançar nem concluir.',async p => {
    const box = await p.locator('main').boundingBox();
    return { x:208,y:box.y+24,width:1024,height:940 };
  });
  await capture('booking-mobile', `${shop}/agendar`,390,'Demonstração iniciada; etapa 1/5 Serviço; primeiro serviço marcado; recorte de etapas, escolhas e ações.',async p => {
    const box = await p.getByRole('navigation', {name:'Etapas do agendamento demonstrativo'}).boundingBox();
    return {x:16,y:box.y,width:358,height:780};
  });
  for (const [key,route,title] of [['services','servicos','Serviços'],['team','barbeiros','Barbeiros'],['settings','configuracoes','Configurações']]) {
    for (const width of [1440,390]) await capture(`${key}-${width===1440?'desktop':'mobile'}`,`${local}/admin/${route}`,width,'Estado inicial das fixtures administrativas; sem edições; amostra independente do perfil e do wizard.',async p => {
      const h = await p.getByRole('heading',{level:1}).boundingBox();
      if(key==='settings'){
        const section=await p.locator('#horarios').boundingBox();
        return {x:section.x,y:section.y,width:section.width,height:Math.min(section.height,900)};
      }
      return {x:width===1440?h.x:16,y:h.y-20,width:width===1440?1440-h.x-16:358,height:780};
    });
  }
  fs.writeFileSync(path.join(dir,'capture-manifest.json'),JSON.stringify({ capturedAt:new Date().toISOString(),browser:browser.version(),environment:'Windows / Edge headless / frontend de desenvolvimento local existente :3000', interfaceMutations:false, toolingOnly:'Indicador nextjs-portal ocultado exclusivamente durante a captura; nenhum estilo ou elemento do produto alterado.', errors, captures:records },null,2));
  await browser.close();
  console.log(JSON.stringify({ captures:records.length,errors }));
})().catch(e => { console.error(e);process.exitCode=1; });
