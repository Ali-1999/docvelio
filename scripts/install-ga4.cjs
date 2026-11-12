/* Install Google Consent Mode v2 and the consent-gated optional analytics loader. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const tag='<script src="/assets/docvelio-ga4.js"></script><script src="/assets/optional-analytics.js"></script><script async src="https://www.googletagmanager.com/gtag/js?id=G-1RNSZ473TY"></script>';
const policyNotes={
 en:'Google Analytics 4 uses Consent Mode v2. Analytics storage is denied by default; before a choice, the Google tag may send limited cookieless signals. Accepting enables analytics cookies and loads Ahrefs Analytics. Declining keeps analytics cookies off and does not load Ahrefs Analytics. This choice is not advertising consent. The AdSense ownership meta tag and ads.txt seller record are verification records; the AdSense ad-delivery script is disabled until an appropriate Google-certified consent management platform is configured where required.',
 es:'Google Analytics 4 utiliza Consent Mode v2. El almacenamiento analítico se deniega de forma predeterminada; antes de elegir, la etiqueta de Google puede enviar señales limitadas sin cookies. Aceptar activa las cookies analíticas y carga Ahrefs Analytics. Rechazar mantiene desactivadas las cookies analíticas y no carga Ahrefs Analytics. Esta elección no constituye consentimiento publicitario. La etiqueta de propiedad de AdSense y el registro ads.txt son datos de verificación; el script de anuncios permanece desactivado hasta configurar una plataforma de consentimiento certificada por Google cuando sea necesaria.',
 fr:'Google Analytics 4 utilise Consent Mode v2. Le stockage analytique est refusé par défaut ; avant tout choix, la balise Google peut envoyer des signaux limités sans cookies. Accepter active les cookies analytiques et charge Ahrefs Analytics. Refuser maintient les cookies analytiques désactivés et ne charge pas Ahrefs Analytics. Ce choix ne vaut pas consentement publicitaire. La balise de propriété AdSense et l’entrée ads.txt servent à la vérification ; le script publicitaire reste désactivé jusqu’à la configuration d’une CMP certifiée par Google lorsqu’elle est requise.',
 de:'Google Analytics 4 verwendet Consent Mode v2. Analysespeicherung ist standardmäßig abgelehnt; vor einer Auswahl kann das Google-Tag begrenzte cookielose Signale senden. Zustimmung aktiviert Analyse-Cookies und lädt Ahrefs Analytics. Ablehnung hält Analyse-Cookies deaktiviert und lädt Ahrefs Analytics nicht. Diese Auswahl ist keine Werbeeinwilligung. Das AdSense-Inhaberschafts-Meta-Tag und der ads.txt-Eintrag dienen der Verifizierung; das AdSense-Auslieferungsskript bleibt deaktiviert, bis eine erforderliche, von Google zertifizierte Einwilligungsplattform eingerichtet ist.',
 pt:'O Google Analytics 4 utiliza Consent Mode v2. O armazenamento analítico é recusado por predefinição; antes de uma escolha, a etiqueta Google pode enviar sinais limitados sem cookies. Aceitar ativa os cookies analíticos e carrega o Ahrefs Analytics. Recusar mantém os cookies analíticos desativados e não carrega o Ahrefs Analytics. Esta escolha não representa consentimento para publicidade. A meta tag de propriedade AdSense e o registo ads.txt servem para verificação; o script de anúncios permanece desativado até ser configurada uma plataforma de consentimento certificada pela Google quando necessária.',
 ar:'يستخدم Google Analytics 4 وضع Consent Mode v2. يكون تخزين التحليلات مرفوضاً افتراضياً؛ وقد ترسل علامة Google إشارات محدودة دون ملفات تعريف ارتباط قبل الاختيار. يؤدي القبول إلى تفعيل ملفات تعريف ارتباط التحليلات وتحميل Ahrefs Analytics. يؤدي الرفض إلى إبقاء ملفات تعريف ارتباط التحليلات معطلة وعدم تحميل Ahrefs Analytics. هذا الاختيار لا يمثل موافقة على الإعلانات. تُستخدم علامة ملكية AdSense وسجل ads.txt للتحقق فقط؛ ويظل نص عرض إعلانات AdSense معطلاً إلى حين إعداد منصة موافقة معتمدة من Google حيثما يلزم.',
 hi:'Google Analytics 4, Consent Mode v2 का उपयोग करता है। एनालिटिक्स स्टोरेज डिफ़ॉल्ट रूप से अस्वीकृत रहता है; विकल्प चुनने से पहले Google टैग सीमित कुकी-रहित संकेत भेज सकता है। स्वीकार करने पर एनालिटिक्स कुकीज़ चालू होती हैं और Ahrefs Analytics लोड होता है। अस्वीकार करने पर एनालिटिक्स कुकीज़ बंद रहती हैं और Ahrefs Analytics लोड नहीं होता। यह विकल्प विज्ञापन की सहमति नहीं है। AdSense स्वामित्व मेटा टैग और ads.txt रिकॉर्ड केवल सत्यापन के लिए हैं; आवश्यक Google-प्रमाणित सहमति प्लेटफ़ॉर्म स्थापित होने तक AdSense विज्ञापन स्क्रिप्ट बंद रहती है।',
 id:'Google Analytics 4 menggunakan Consent Mode v2. Penyimpanan analitik ditolak secara default; sebelum pilihan dibuat, tag Google dapat mengirim sinyal terbatas tanpa cookie. Menerima akan mengaktifkan cookie analitik dan memuat Ahrefs Analytics. Menolak membuat cookie analitik tetap nonaktif dan tidak memuat Ahrefs Analytics. Pilihan ini bukan persetujuan iklan. Meta tag kepemilikan AdSense dan catatan ads.txt hanya untuk verifikasi; skrip penayangan iklan dinonaktifkan sampai platform persetujuan bersertifikat Google yang diperlukan dikonfigurasi.',
 tr:'Google Analytics 4, Consent Mode v2 kullanır. Analiz depolaması varsayılan olarak reddedilir; seçim yapılmadan önce Google etiketi sınırlı çerezsiz sinyaller gönderebilir. Kabul etmek analiz çerezlerini etkinleştirir ve Ahrefs Analytics’i yükler. Reddetmek analiz çerezlerini kapalı tutar ve Ahrefs Analytics’i yüklemez. Bu seçim reklam izni değildir. AdSense sahiplik meta etiketi ve ads.txt kaydı yalnızca doğrulama içindir; gerekli Google sertifikalı izin platformu yapılandırılana kadar AdSense reklam sunum betiği devre dışıdır.',
 zh:'Google Analytics 4 使用 Consent Mode v2。分析存储默认设置为拒绝；在访客作出选择前，Google 标签仍可能发送有限的无 Cookie 信号。接受后会启用分析 Cookie 并加载 Ahrefs Analytics。拒绝后分析 Cookie 保持关闭，且不会加载 Ahrefs Analytics。此选择不代表同意接收广告。AdSense 所有权元标签和 ads.txt 卖方记录仅用于网站验证；在需要的地区配置 Google 认证的同意管理平台之前，AdSense 广告投放脚本保持禁用。'
};
let count=0,changed=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</body>')||!html.includes('</head>'))continue;
  const relative=path.relative(root,file).replaceAll('\\\\','/');
  if(relative==='ali-hamza/index.html'){
   html=html.replace(/<script\\b[^>]*src=[\"']\\/assets\\/(?:docvelio-ga4|optional-analytics)\\.js[\"'][^>]*><\\/script>/gi,'');
   html=html.replace(/<script\\b[^>]*src=[\"']https:\\/\\/www\\.googletagmanager\\.com\\/gtag\\/js\\?id=G-1RNSZ473TY[\"'][^>]*><\\/script>/gi,'');
   if(html!==fs.readFileSync(file,'utf8')){fs.writeFileSync(file,html,'utf8');changed++;}
   count++;continue;
  }
  if(!html.includes('href=\"/assets/cookie-consent.css\"'))html=html.replace('</head>','<link rel=\"stylesheet\" href=\"/assets/cookie-consent.css\"></head>');
  if(!html.includes('src=\"/assets/cookie-consent.js\"'))html=html.replace('</body>','<script defer src=\"/assets/cookie-consent.js\"></script></body>');
  const initCount=(html.match(/src=["']\/assets\/docvelio-ga4\.js["']/g)||[]).length;
  const optCount=(html.match(/src=["']\/assets\/optional-analytics\.js["']/g)||[]).length;
  const gaCount=(html.match(/www\.googletagmanager\.com\/gtag\/js\?id=G-1RNSZ473TY/g)||[]).length;
  if(initCount>1||optCount>1||gaCount>1)throw Error('Duplicate analytics scripts: '+file);
  if(!initCount){
   const charset=html.match(/<meta\b[^>]*\bcharset\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)[^>]*>/i)?.[0];
   html=charset?html.replace(charset,charset+tag):html.replace(/<head\b[^>]*>/i,m=>m+tag);
   changed++;
  }else{
   if(!optCount)html=html.replace(/(<script\b[^>]*src=["']\/assets\/docvelio-ga4\.js["'][^>]*><\/script>)/i,'$1<script src="/assets/optional-analytics.js"></script>');
   if(!gaCount)html=html.replace('</head>','<script async src="https://www.googletagmanager.com/gtag/js?id=G-1RNSZ473TY"></script></head>');
  }
  const relative=path.relative(root,file).replaceAll('\\','/');
  if(/(?:^|\/)(?:privacy|cookies)\/index\.html$/.test(relative)){
   const parts=relative.split('/'),first=parts[0],lang=policyNotes[first]?first:'en',note=policyNotes[lang];
   const block='<section id="dv-ga4-policy" class="container" aria-label="Analytics and advertising status"><h2>Analytics and advertising status</h2><p>'+note+'</p></section>';
   if(/<section\b[^>]*id=["']dv-ga4-policy["'][\s\S]*?<\/section>/i.test(html))html=html.replace(/<section\b[^>]*id=["']dv-ga4-policy["'][\s\S]*?<\/section>/i,block);
   else if(html.includes('</main>'))html=html.replace('</main>',block+'</main>');
  }
  if(html!==fs.readFileSync(file,'utf8')){fs.writeFileSync(file,html,'utf8');changed++;}
  count++;
 }
}
walk(root);
if(count<580)throw Error('Too few generated pages for GA4 install: '+count);
console.log('Analytics consent: GA4 Consent Mode and optional analytics loader checked on '+count+' pages; '+changed+' updated.');
