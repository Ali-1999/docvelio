/* Docvelio navigation and tool discovery. Category preference is optional. */
(()=>{'use strict';
const toggle=document.querySelector('.mobile-toggle');
const navigation=document.querySelector('.links');
if(toggle&&navigation)toggle.addEventListener('click',()=>{
 const expanded=toggle.getAttribute('aria-expanded')==='true';
 toggle.setAttribute('aria-expanded',String(!expanded));
 navigation.classList.toggle('open',!expanded);
});
const search=document.querySelector('#tool-search');
const filters=[...document.querySelectorAll('.filter')];
const cards=[...document.querySelectorAll('.tool-card')];
const choiceKey='docvelio_privacy_choice_v1',filterKey='docvelio_tool_category_v1';
function allowed(){
 try{
  const data=JSON.parse(localStorage.getItem(choiceKey)||'null');
  return data?.version===1 && data.choice==='accepted' &&
   Number.isFinite(data.time) && Date.now()-data.time>=0 &&
   Date.now()-data.time<180*24*60*60*1000;
 }catch(_){return false;}
}
let category='all';
if(filters.length && allowed()){
 try{
  const saved=localStorage.getItem(filterKey);
  if(saved && filters.some(button=>button.dataset.filter===saved))category=saved;
 }catch(_){}
}
function apply(){
 const query=(search?.value||'').trim().toLocaleLowerCase();
 let visible=0;
 for(const card of cards){
  const matchesCategory=category==='all'||card.dataset.category===category;
  const matchesText=((card.dataset.title||'')+' '+(card.textContent||''))
   .toLocaleLowerCase().includes(query);
  card.hidden=!(matchesCategory&&matchesText);
  if(!card.hidden)visible++;
 }
 const empty=document.querySelector('#empty-tools');
 if(empty)empty.hidden=visible!==0;
 filters.forEach(button=>{
  const active=button.dataset.filter===category;
  button.classList.toggle('active',active);
  button.setAttribute('aria-pressed',String(active));
 });
}
filters.forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.filter||'all';
 if(allowed()){
  try{localStorage.setItem(filterKey,category);}catch(_){}
 }
 apply();
}));
search?.addEventListener('input',apply);
window.addEventListener('docvelio:privacy-choice',event=>{
 if(event.detail?.choice==='declined')category='all';
 if(event.detail?.choice==='accepted' && filters.length){
  try{localStorage.setItem(filterKey,category);}catch(_){}
 }
 apply();
});
if(filters.length||cards.length)apply();
})();
