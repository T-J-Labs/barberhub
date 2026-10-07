const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('../../../validation/tools/node_modules/playwright');
const dir=process.env.LANDING_CAPTURE_DIR || path.join(__dirname,'captures-v2');fs.mkdirSync(dir,{recursive:true});
const dpr=Number(process.env.LANDING_CAPTURE_DPR || 1);
const records=[];
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const page=await browser.newPage({deviceScaleFactor:dpr});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function rect(locator){return locator.evaluate(el=>{const b=el.getBoundingClientRect();return{x:b.x+scrollX,y:b.y+scrollY,width:b.width,height:b.height}})}
 function union(a,b,padding=0){const x=Math.min(a.x,b.x)-padding,y=Math.min(a.y,b.y)-padding;return{x,y,width:Math.max(a.x+a.width,b.x+b.width)-x+padding,height:Math.max(a.y+a.height,b.y+b.height)-y+padding}}
 async function shot(name,url,width,state,region){
  await page.setViewportSize({width,height:1100});await page.goto(url);await page.getByRole('heading',{level:1}).waitFor();await page.evaluate(()=>document.fonts.ready);
  const clip=await region();await page.evaluate(()=>window.scrollTo(0,0));
  for(const k of Object.keys(clip))clip[k]=Math.round(clip[k]);
  await page.screenshot({path:path.join(dir,`${name}.png`),clip,fullPage:true,style:'nextjs-portal{visibility:hidden}'});
  records.push({file:`${name}.png`,url:page.url(),viewport:{width,height:1100},dpr,state,clip});console.log(name,JSON.stringify(clip));
 }
 const base='http://localhost:3000',shop='http://demo-esquina.localhost:3000';
 for(const width of [720,390,320])await shot(`agenda-${width}`,`${base}/admin/agenda`,width,width===720?'Filtro Serviço: Corte + barba; dois atendimentos existentes completos; data inicial 24/06/2025; demais filtros iniciais.':'Filtro Serviço: Barba completa; um atendimento existente completo; data inicial 24/06/2025; recorte da linha do tempo sem filtros; demais filtros iniciais.',async()=>{
  await page.getByLabel('Filtrar por serviço').selectOption({label:width===720?'Corte + barba':'Barba completa'});
  const filters=await rect(page.getByLabel('Filtrar por serviço').locator('../../..'));
  const last=await rect(page.locator('article').last());
  const top=width===720?filters.y:(await rect(page.getByRole('heading',{name:'Linha do tempo'}).locator('../..'))).y;
  return {x:16,y:top,width:width-32,height:last.y+last.height+13-top};
 });
 await shot('agenda-full',`${base}/admin/agenda`,1440,'Todos os filtros iniciais; agenda administrativa completa do exemplo, cinco atendimentos.',async()=>{
  const filters=await rect(page.getByLabel('Filtrar por serviço').locator('../../..'));
  const list=await rect(page.getByRole('button',{name:'Mais opções para Pedro Henrique'}).locator('../../..'));
  return union(filters,list);
 });
 for(const width of [1060,390,320])await shot(`profile-${width}`,`${shop}/`,width,'Componente completo de apresentação do perfil público da fixture Esquina; visitante, sem edições.',async()=>rect(page.getByRole('heading',{level:1}).locator('../../..')));
 for(const width of [390,358]){
  await shot(`booking-service-${width}`,`${shop}/agendar`,width,'Demonstração iniciada; etapa Serviço; Corte de cabelo marcado; etapa completa sem concluir reserva.',async()=>{
   await page.getByRole('button',{name:'Experimentar demonstração',exact:true}).click();await page.getByRole('heading',{name:'Qual cuidado você procura?'}).waitFor();await page.getByRole('radio').first().locator('..').click();
   const section=page.getByRole('heading',{name:'Qual cuidado você procura?'}).locator('..');return rect(section);
  });
  await shot(`booking-professional-${width}`,`${shop}/agendar`,width,'Demonstração iniciada; Corte de cabelo selecionado; etapa Profissional; sem profissional marcado e sem avançar.',async()=>{
   await page.getByRole('button',{name:'Experimentar demonstração',exact:true}).click();await page.getByRole('radio').first().locator('..').click();await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('heading',{name:'Quem cuida do seu estilo?'}).waitFor();return rect(page.getByRole('heading',{name:'Quem cuida do seu estilo?'}).locator('..'));
  });
 }
 for(const width of [1024,390,320])for(const [name,route,heading] of [['services','servicos','Catálogo'],['team','barbeiros','Profissionais']])await shot(`${name}-${width}`,`${base}/admin/${route}`,width,'Lista completa das fixtures iniciais; sem edições ou filtros.',async()=>{
  const h=page.getByRole('heading',{name:heading,exact:true});
  const top=await rect(h.locator('../..'));
  const last=await rect(page.locator('main ul li').last());
  return {x:16,y:top.y,width:width-32,height:last.y+last.height-top.y};
 });
 for(const width of [1024,390,320])await shot(`settings-${width}`,`${base}/admin/configuracoes`,width,'Seção Funcionamento completa, sete dias e orientação final; valores iniciais, sem edições.',async()=>rect(page.locator('#horarios')));
 fs.writeFileSync(process.env.LANDING_CAPTURE_MANIFEST || path.join(__dirname,'capture-manifest-v2.json'),JSON.stringify({capturedAt:new Date().toISOString(),browser:browser.version(),environment:'Windows / Edge headless / frontend de desenvolvimento existente :3000',toolingOnly:'Somente nextjs-portal oculto nas capturas.',productStylesChanged:false,errors,captures:records},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
