const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../../../validation/tools/node_modules/playwright');
const output=path.join(__dirname,'review');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const page=await browser.newPage();const results=[];const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(pathToFileURL(path.join(__dirname,'proposal.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement.blur());
  // Carrega todos os recortes antes de gerar as pranchas completas.
  await page.locator('img').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));
  await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode())));
  const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight,images:[...document.images].map(i=>({src:i.currentSrc,complete:i.complete,naturalWidth:i.naturalWidth,renderedWidth:i.checkVisibility()?i.width:null}))}));
  if(geometry.overflow)throw Error(`Overflow ${width}`);
  await page.screenshot({path:path.join(output,`complete-${width}.png`),fullPage:true});
  await page.screenshot({path:path.join(output,`hero-${width}.png`)});
  await page.locator('#preco').screenshot({path:path.join(output,`price-${width}.png`)});
  await page.locator('#duvidas').screenshot({path:path.join(output,`faq-${width}.png`)});
  const priceText=await page.locator('#preco').innerText();if(!priceText.includes('Contratação ainda indisponível'))throw Error('Aviso de contratação ausente');
  await page.locator('#duvidas details').nth(3).locator('summary').click();
  if(await page.locator('#duvidas details').nth(3).getAttribute('open')===null)throw Error('FAQ não abriu');
  if(width<901){await page.evaluate(()=>window.scrollTo(0,0));const trigger=page.getByRole('button',{name:'Abrir menu',exact:true});await trigger.focus();await page.keyboard.press('Enter');await page.screenshot({path:path.join(output,`menu-${width}.png`)});for(let i=0;i<10;i++){await page.keyboard.press('Tab');if(!await page.locator('dialog').evaluate(d=>d.contains(document.activeElement)))throw Error('Foco fora do menu')}await page.keyboard.press('Escape');if(await page.locator('dialog').evaluate(d=>d.open))throw Error('Escape');if(!await trigger.evaluate(t=>t===document.activeElement))throw Error('Foco não retornou');}
  for(const name of ['Equipe','Funcionamento']){
    await page.getByRole('tab',{name,exact:true}).click();
    const panel=page.getByRole('tabpanel');await panel.screenshot({path:path.join(output,`operation-${name==='Equipe'?'team':'settings'}-${width}.png`)});
  }
  await page.getByRole('tab',{name:'Serviços',exact:true}).focus();await page.keyboard.press('ArrowRight');if(await page.getByRole('tab',{name:'Equipe',exact:true}).getAttribute('aria-selected')!=='true')throw Error('Teclado tabs');
  for(const id of ['inicio','produto','servicos','como-funciona','preco','duvidas','contato','para-quem','diferenciais']){if(await page.locator(`#${id}`).count()!==1)throw Error(`Âncora ${id}`)}
  results.push({width,...geometry});
 }
 fs.writeFileSync(path.join(output,'review-checks.json'),JSON.stringify({browser:browser.version(),environment:'Artefato HTML estático em file://; não é implementação Next.js',results,errors},null,2));
 console.log(JSON.stringify({widths:results.map(r=>r.width),errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
