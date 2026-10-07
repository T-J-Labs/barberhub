const dialog=document.querySelector('dialog'),trigger=document.querySelector('.menu-toggle');
function close(){dialog.close();trigger.setAttribute('aria-expanded','false');document.body.style.overflow='';trigger.focus()}
trigger.addEventListener('click',()=>{dialog.showModal();trigger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';dialog.querySelector('button').focus()});
dialog.querySelector('.menu-close').addEventListener('click',close);
dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const c=[...dialog.querySelectorAll('a[href],button')],first=c[0],last=c.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
dialog.addEventListener('click',e=>{if(e.target===dialog&&e.clientX>dialog.getBoundingClientRect().right)close()});
dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
matchMedia('(min-width:1024px)').addEventListener('change',e=>{if(e.matches&&dialog.open)close()});
const tabs=[...document.querySelectorAll('[role=tab]')];
function activate(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active})}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>activate(t));t.addEventListener('keydown',e=>{let n;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%tabs.length;if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();activate(tabs[n]);tabs[n].focus()}})});
const shotButtons=[...document.querySelectorAll('[data-shot]')];shotButtons.forEach(b=>b.addEventListener('click',()=>{document.querySelector('.booking-shots').dataset.active=b.dataset.shot;shotButtons.forEach(t=>t.setAttribute('aria-pressed',String(t===b)))}));
