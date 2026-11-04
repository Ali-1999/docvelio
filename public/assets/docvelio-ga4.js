/* GA4: Google Consent Mode v2, default-denied; site privacy choice controls analytics cookies. */
(()=>{'use strict';
const ID='G-1RNSZ473TY',KEY='docvelio_privacy_choice_v2',MAX_AGE=180*24*60*60*1000;
function accepted(){
 try{const c=JSON.parse(localStorage.getItem(KEY)||'null');
 return c?.version===2&&c.choice==='accepted'&&Number.isFinite(c.time)&&c.time<=Date.now()+120000&&Date.now()-c.time<=MAX_AGE;
 }catch(_){return false;}
}
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
window.gtag('consent','default',{
 analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'
});
if(accepted())window.gtag('consent','update',{analytics_storage:'granted'});
window.gtag('js',new Date());
window.gtag('config',ID);
window.addEventListener('docvelio:privacy-choice',e=>{
 if(e.detail?.choice==='accepted')window.gtag('consent','update',{analytics_storage:'granted'});
 else if(e.detail?.choice==='declined'){
  window.gtag('consent','update',{analytics_storage:'denied'});
  for(const key of document.cookie.split(';').map(x=>x.trim().split('=')[0])){
   if(/^_ga(?:_|$)/.test(key))document.cookie=key+'=; Max-Age=0; Path=/; SameSite=Lax';
  }
  if(typeof window.location?.reload==='function')window.location.reload();
 }
});
})();
