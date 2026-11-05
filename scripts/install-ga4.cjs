/* Add consent-mode GA4 to all generated Docvelio pages.
 * Run as the final build step so generated and hand-written pages are covered.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const tag='<script src="/assets/docvelio-ga4.js"></script><script async src="https://www.googletagmanager.com/gtag/js?id=G-1RNSZ473TY"></script>';
const policyNotes={
 "en": "Docvelio uses Google Analytics 4 (G-1RNSZ473TY) with Google Consent Mode v2. Analytics cookies are denied until you accept. Google’s tag may send limited cookieless signals even before consent. Accepting enables analytics cookies; you can withdraw consent using Privacy settings.",
 "es": "Docvelio usa Google Analytics 4 con Consent Mode v2. Las cookies analíticas están desactivadas hasta que acepte. La etiqueta puede enviar señales limitadas sin cookies antes de aceptar. Puede retirar el consentimiento.",
 "fr": "Docvelio utilise Google Analytics 4 avec Consent Mode v2. Les cookies analytiques sont refusés avant votre accord. La balise peut envoyer des signaux limités sans cookies avant cet accord. Vous pouvez retirer votre consentement.",
 "de": "Docvelio verwendet Google Analytics 4 mit Consent Mode v2. Analyse-Cookies sind bis zur Zustimmung deaktiviert. Der Tag kann zuvor begrenzte Signale ohne Cookies senden. Sie können die Zustimmung widerrufen.",
 "pt": "O Docvelio usa Google Analytics 4 com Consent Mode v2. Os cookies analíticos são negados até aceitar. A etiqueta pode enviar sinais limitados sem cookies antes da autorização. Pode retirar o consentimento.",
 "ar": "يستخدم Docvelio خدمة Google Analytics 4 مع Consent Mode v2. تُرفض ملفات تعريف ارتباط التحليلات حتى توافق. قد ترسل علامة Google إشارات محدودة بدون ملفات تعريف ارتباط قبل الموافقة. يمكنك سحب الموافقة.",
 "hi": "Docvelio Google Analytics 4 और Consent Mode v2 इस्तेमाल करता है। आपकी सहमति तक एनालिटिक्स कुकीज़ बंद रहती हैं। टैग सहमति से पहले सीमित कुकी-रहित सिग्नल भेज सकता है। आप सहमति वापस ले सकते हैं।",
 "id": "Docvelio memakai Google Analytics 4 dengan Consent Mode v2. Cookie analitik ditolak sampai Anda setuju. Tag dapat mengirim sinyal terbatas tanpa cookie sebelum persetujuan. Anda dapat menarik persetujuan.",
 "tr": "Docvelio Google Analytics 4 ve Consent Mode v2 kullanır. Onay verilene kadar analiz çerezleri reddedilir. Etiket önceden sınırlı, çerezsiz sinyaller gönderebilir. Onayınızı geri çekebilirsiniz.",
 "zh": "Docvelio 使用 Google Analytics 4 和 Consent Mode v2。您同意前不会启用分析 Cookie，但 Google 标签可能发送有限的不含 Cookie 的信号。您可以撤回同意。"
};

let count=0,changed=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</body>')||!html.includes('</head>'))continue; // Exclude verification files.
  const present=(html.match(/\bsrc=["']\/assets\/docvelio-ga4\.js["']/g)||[]).length;
  const google=(html.match(/www\.googletagmanager\.com\/gtag\/js\?id=G-1RNSZ473TY/g)||[]).length;
  if(google>1||google!==present)throw Error('Duplicate or unmatched GA4 scripts: '+file);
  if(present>1)throw Error('Duplicate GA4 initializer: '+file);
  // Apply default-denied consent before loading any Google ad or analytics tag.
  // The initializer is synchronous; Google network scripts remain asynchronous.
  const earlyInsert=(page)=>{
    const charset=page.match(/<meta\b[^>]*\bcharset\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)[^>]*>/i)?.[0];
    return charset?page.replace(charset,charset+tag):page.replace(/<head\b[^>]*>/i,m=>m+tag);
  };
  if(!present){
   html=earlyInsert(html);
   fs.writeFileSync(file,html,'utf8');changed++;
  }else{
   const initializer=html.match(/<script\b[^>]*\bsrc=["']\/assets\/docvelio-ga4\.js["'][^>]*><\/script>/i)?.[0];
   const gtagScript=html.match(/<script\b[^>]*\bsrc=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-1RNSZ473TY["'][^>]*><\/script>/i)?.[0];
   if(!initializer||!gtagScript)throw Error('Expected GA4 scripts: '+file);
   const adAt=html.indexOf('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
   if(adAt!==-1&&html.indexOf(initializer)>adAt){
    html=earlyInsert(html.replace(initializer,'').replace(gtagScript,''));
    fs.writeFileSync(file,html,'utf8');changed++;
   }
  }
  const relative=path.relative(root,file).replaceAll('\\','/');
  if(relative.endsWith('/privacy/index.html')||relative==='privacy/index.html'||relative.endsWith('/cookies/index.html')||relative==='cookies/index.html'){
   const lang=relative.split('/')[0],note=policyNotes[lang]||policyNotes.en;
   if(!html.includes('id="dv-ga4-policy"')){
    html=html.replace('</main>','<section id="dv-ga4-policy" class="container" aria-label="Google Analytics 4"><h2>Google Analytics 4</h2><p>'+note+'</p></section></main>');
    fs.writeFileSync(file,html,'utf8');changed++;
   }
  }
  count++;
 }
}
walk(root);
if(count<580)throw Error('Too few generated pages for GA4 install: '+count);
console.log('GA4: consent-gated initializer present across '+count+' pages; updated '+changed+'.');
