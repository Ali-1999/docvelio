/* Accessible disclosure navigation for Docvelio; inspired by WAI-ARIA and Radix patterns. */
(()=>{'use strict';
const init=()=>{
 const header=document.querySelector('.dv-global-header');
 if(!header)return;
 const nav=header.querySelector('#dv-primary-nav'),toggle=header.querySelector('.dv-global-toggle');
 if(!nav||!toggle)return;
 const menus=[...nav.querySelectorAll('details.dv-mega')];
 const close=(except=null)=>menus.forEach(m=>{if(m!==except)m.open=false});
 menus.forEach((m,i)=>{
  m.setAttribute('name','dv-global-menu');
  const summary=m.querySelector('summary'),panel=m.querySelector('.dv-mega-panel');
  if(!summary||!panel)return;
  const id='dv-menu-panel-'+i;panel.id=id;
  summary.setAttribute('aria-controls',id);
  summary.setAttribute('aria-expanded',String(m.open));
  m.addEventListener('toggle',()=>{if(m.open)close(m);summary.setAttribute('aria-expanded',String(m.open))});
  summary.addEventListener('click',()=>{if(!m.open)close(m)});
  summary.addEventListener('keydown',e=>{
   if(e.key==='Escape'){m.open=false;summary.focus();e.preventDefault()}
   if(e.key==='ArrowDown'){if(!m.open)m.open=true;const first=panel.querySelector('a');if(first){first.focus();e.preventDefault()}}
  });
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){m.open=false;summary.focus();e.preventDefault()}});
 });
 const setMobile=(open)=>{nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));if(!open)close()};
 toggle.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();setMobile(!nav.classList.contains('open'))},true);
 document.addEventListener('pointerdown',e=>{if(!header.contains(e.target)){close();setMobile(false)}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const active=menus.find(m=>m.open);if(active){active.open=false;active.querySelector('summary')?.focus()}else if(nav.classList.contains('open')){setMobile(false);toggle.focus()}}});
 nav.addEventListener('click',e=>{if(e.target.closest('.dv-mega-panel a'))setMobile(false)});
 window.addEventListener('resize',()=>{if(window.innerWidth>980)setMobile(false)});
 // Position dropdown within viewport instead of overflowing on narrow desktops.
 const position=(m)=>{const panel=m.querySelector('.dv-mega-panel');if(!panel||window.innerWidth<=980){if(panel)panel.style.removeProperty('right');return}
 panel.style.removeProperty('right');
 const rect=panel.getBoundingClientRect();if(rect.right>window.innerWidth-16){panel.style.right='0';panel.style.left='auto'}else{panel.style.left='0';panel.style.right='auto'}};
 menus.forEach(m=>m.addEventListener('toggle',()=>{if(m.open)position(m)}));
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();