// Interações exclusivas do artefato de revisão, sem código importado pela aplicação.
const dialog=document.querySelector('dialog');
const trigger=document.querySelector('.menu-toggle');
const close=()=>{dialog.close();trigger.setAttribute('aria-expanded','false');document.body.style.overflow='';trigger.focus()};
trigger.addEventListener('click',()=>{dialog.showModal();trigger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';dialog.querySelector('button').focus()});
dialog.querySelector('.menu-close').addEventListener('click',close);
dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const controls=[...dialog.querySelectorAll('a[href],button')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX>r.right||e.clientY>r.bottom)close()}});
dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
window.addEventListener('resize',()=>{if(innerWidth>900&&dialog.open)close()});
const tabs=[...document.querySelectorAll('[role=tab]')];
function activate(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active})}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();activate(tabs[n]);tabs[n].focus()}})});
