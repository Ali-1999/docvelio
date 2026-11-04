/* Load GA4 only after explicit version-2 privacy consent; no third-party request before acceptance. */
(()=>{'use strict';
const ID='G-1RNSZ473TY',KEY='docvelio_privacy_choice_v2',MAX_AGE=180*24*60*60*1000;
let started=false;
function allowed(){
 try{const choice=JSON.parse(localStorage.getItem(KEY)||'null');
 return choice?.version===2&&choice.choice==='accepted'&&Number.isFinite(choice.time)&&choice.time<=Date.now()+120000&&Date.now()-choice.time<=MAX_AGE;
 }catch(_){return false;}
}
function activate(){
 if(started||!allowed())return;started=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 window.gtag('js',new Date());
 window.gtag('config',ID);
 const script=document.createElement('script');
 script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ID);
 document.head.append(script);
}
function withdraw(){
 if(typeof window.gtag==='function')window.gtag('consent','update',{analytics_storage:'denied'});
 for(const key of document.cookie.split(';').map(x=>x.trim().split('=')[0])){
  if(/^_ga(?:_|$)/.test(key))document.cookie=key+'=; Max-Age=0; Path=/; SameSite=Lax';
 }
}
window.addEventListener('docvelio:privacy-choice',e=>{
 if(e.detail?.choice==='accepted')activate();
 else if(e.detail?.choice==='declined')withdraw();
});
activate();
})();
