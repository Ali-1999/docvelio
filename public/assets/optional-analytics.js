/* Load Ahrefs Analytics only after the visitor accepts optional analytics.
 * The GA4 tag uses Consent Mode v2 separately; this file never grants consent.
 */
(()=>{'use strict';
const KEY='docvelio_privacy_choice_v2',ID='dv-ahrefs-analytics';
const SOURCE='https://analytics.ahrefs.com/analytics.js',DATA_KEY='X1yDGYuFwX82LOKZR9z/Yg';
function accepted(){
 try{
  const choice=JSON.parse(localStorage.getItem(KEY)||'null');
  return choice?.version===2&&choice.choice==='accepted'&&Number.isFinite(choice.time)&&
   choice.time<=Date.now()+120000&&Date.now()-choice.time<180*24*60*60*1000;
 }catch(_){return false;}
}
function load(){
 if(!accepted()||document.getElementById(ID))return;
 const script=document.createElement('script');
 script.id=ID;script.async=true;script.src=SOURCE;script.dataset.key=DATA_KEY;
 (document.head||document.documentElement).appendChild(script);
}
if(accepted())load();
window.addEventListener('docvelio:privacy-choice',event=>{
 if(event.detail?.choice==='accepted')load();
});
})();