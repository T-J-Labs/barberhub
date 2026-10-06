// Instalação nativa pelo protocolo do navegador, em perfil de QA isolado.
// Não é o evento sintético usado nos testes de interação.
const fs=require('node:fs'), path=require('node:path'), os=require('node:os');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=`http://localhost:${process.argv[2] || 3110}`;
(async()=>{
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'barberhub-install-qa-'));
  const headless=process.env.PWA_HEADLESS !== 'false';
  const context=await chromium.launchPersistentContext(profile,{headless,channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge',args:headless?[]:['--start-minimized']});
  const browser=context.browser(), cdp=await browser.newBrowserCDPSession(), report={base,browser:browser.version(),method:'PWA.install/launch em perfil temporário Edge',headless};
  let installed=false;
  try{
    const page=await context.newPage();await page.goto(base+'/barbearias');await page.evaluate(()=>navigator.serviceWorker.ready);
    const pageCdp=await context.newCDPSession(page);report.installability=await pageCdp.send('Page.getInstallabilityErrors');
    await cdp.send('PWA.install',{manifestId:base+'/',installUrlOrBundleUrl:base+'/barbearias'});installed=true;report.installed=true;
    // A instalação por CDP no Edge usa inicialmente apresentação em aba.
    // Definir a preferência do navegador é parte do QA da janela standalone.
    await cdp.send('PWA.changeAppUserSettings',{manifestId:base+'/',displayMode:'standalone'});report.browserDisplayMode='standalone (preferência definida pelo QA)';
    const target=await cdp.send('PWA.launch',{manifestId:base+'/'});report.launch=target;
    const original=await pageCdp.send('Target.getTargetInfo');
    const targets=await cdp.send('Target.getTargets');
    const appTarget=targets.targetInfos.find(t=>t.type==='page'&&t.url===base+'/barbearias'&&t.targetId!==original.targetInfo.targetId);
    report.targets=targets.targetInfos.map(t=>({targetId:t.targetId,type:t.type,url:t.url}));
    // Janelas de app do Edge podem não aparecer em context.pages(). Inspecionar
    // diretamente o Target retornado pelo lançamento, sem emular display-mode.
    const {sessionId}=await cdp.send('Target.attachToTarget',{targetId:appTarget?.targetId || target.targetId,flatten:false});
    const evaluation=new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Tempo excedido ao inspecionar a janela nativa')),15000);
      function received(event){if(event.sessionId!==sessionId)return;const message=JSON.parse(event.message);if(message.id!==1)return;clearTimeout(timer);cdp.off('Target.receivedMessageFromTarget',received);resolve(message);}
      cdp.on('Target.receivedMessageFromTarget',received);
    });
    await cdp.send('Target.sendMessageToTarget',{sessionId,message:JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:`(async()=>{if(document.readyState!=='complete')await new Promise(r=>window.addEventListener('load',r,{once:true}));await new Promise(r=>setTimeout(r,500));return {url:location.href,standalone:matchMedia('(display-mode: standalone)').matches,installPanels:document.querySelectorAll('[aria-labelledby=pwa-install-title]').length,cookie:document.cookie,localStorage:localStorage.length};})()`,awaitPromise:true,returnByValue:true}})});
    const evaluated=await evaluation;report.nativeEvaluation=evaluated;report.nativeWindow=evaluated.result?.result?.value;
    await cdp.send('Target.detachFromTarget',{sessionId});
    assert.ok(report.nativeWindow,'janela standalone disponível para inspeção');
    assert.equal(report.nativeWindow.url,base+'/barbearias');assert.equal(report.nativeWindow.standalone,true);assert.equal(report.nativeWindow.installPanels,0);
    assert.equal(report.nativeWindow.cookie,'');assert.equal(report.nativeWindow.localStorage,0);report.noSession=true;report.startUrl=report.nativeWindow.url;
    console.log('PASS instalação nativa, abertura standalone no catálogo e nenhuma sessão');
  }catch(error){report.limitation=error.message;console.log('LIMITAÇÃO instalação nativa:',error.message);}
  finally{
    if(installed){try{await cdp.send('PWA.uninstall',{manifestId:base+'/'});report.uninstalled=true;}catch(error){report.cleanupError=error.message;}}
    fs.mkdirSync(path.join(__dirname,'pwa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'pwa/install-results.json'),JSON.stringify(report,null,2));await context.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
