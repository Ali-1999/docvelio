/* Minimal progressive accessibility enhancements for Docvelio.
   Works with existing site.js navigation, filters and language links. */
(()=>{'use strict';
 const header=document.querySelector('.dv-site-header');
 const toggle=header?.querySelector('.mobile-toggle');
 const nav=header?.querySelector('.links');
 const closeMenu=(restore=false)=>{
  if(!nav||!toggle||toggle.getAttribute('aria-expanded')!=='true')return;
  nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');
  if(restore)toggle.focus({preventScroll:true});
 };
 if(header&&toggle&&nav){
  // Existing site.js owns the open/toggle click handler; only close here.
  document.addEventListener('pointerdown',event=>{
   if(!header.contains(event.target))closeMenu(false);
  });
  document.addEventListener('keydown',event=>{
   if(event.key==='Escape')closeMenu(true);
  });
  nav.addEventListener('click',event=>{
   if(event.target.closest('a'))closeMenu(false);
  });
  const setBreakpoint=()=>{if(window.matchMedia('(min-width:861px)').matches)closeMenu(false);};
  window.addEventListener('resize',setBreakpoint,{passive:true});
  // Announce the active location without breaking native link behaviour.
  const pathname=location.pathname.replace(/\/+$/,'/')||'/';
  let best=null;
  for(const a of nav.querySelectorAll('a[href]')){
   const target=new URL(a.href,location.href);
   const route=target.pathname.replace(/\/+$/,'/')||'/';
   if(target.host!==location.host)continue;
   if(route===pathname && !target.hash)best=a;
   else if(!best && route.includes('/blog/')&&pathname.includes('/blog/'))best=a;
   else if(!best && route.includes('/guides/')&&pathname.includes('/guides/'))best=a;
  }
  if(best)best.setAttribute('aria-current','page');
 }
 const search=document.querySelector('#tool-search');
 if(search){
  if(!search.getAttribute('aria-label'))search.setAttribute('aria-label','Search document tools');
  if(!search.getAttribute('autocomplete'))search.setAttribute('autocomplete','off');
  const empty=document.querySelector('#empty-tools');
  if(empty){empty.setAttribute('role','status');empty.setAttribute('aria-live','polite');}
 }
 // Keep copy and social share components exposed to assistive technology.
 for(const panel of document.querySelectorAll('.dv-sharing')){
  panel.setAttribute('role',panel.getAttribute('role')||'group');
 }
 // Scrollbars remain navigable on touch screens and keyboard.
 for(const rail of document.querySelectorAll('.filter-tabs')){
  if(!rail.hasAttribute('tabindex'))rail.setAttribute('tabindex','0');
  if(!rail.hasAttribute('aria-label'))rail.setAttribute('aria-label','Tool categories');
 }
})();
