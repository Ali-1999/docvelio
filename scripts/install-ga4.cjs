/* Add a single first-party, consent-gated GA4 loader to all generated Docvelio pages.
 * Run as the final build step so generated and hand-written pages are covered.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const tag='<script defer src="/assets/docvelio-ga4.js"></script>';
const policyNotes={
 en:'Google Analytics 4 (measurement ID G-1RNSZ473TY) is optional. It loads only after you accept analytics in the privacy banner. Google may receive website usage information and set analytics cookies. You can withdraw your choice using Privacy settings in the footer.',
 es:'Google Analytics 4 es opcional y solo se carga después de aceptar. Google puede recibir datos de uso y colocar cookies analíticas. Puede retirar su consentimiento en Configuración de privacidad.',
 fr:'Google Analytics 4 est facultatif et se charge uniquement après votre accord. Google peut recevoir des données d’utilisation et déposer des cookies. Vous pouvez retirer votre consentement dans les paramètres de confidentialité.',
 de:'Google Analytics 4 ist optional und wird erst nach Zustimmung geladen. Google kann Nutzungsdaten erhalten und Analyse-Cookies setzen. Die Zustimmung kann über die Datenschutzeinstellungen widerrufen werden.',
 pt:'O Google Analytics 4 é opcional e só carrega após o seu consentimento. A Google pode receber dados de utilização e definir cookies. Pode retirar o consentimento nas definições de privacidade.',
 ar:'Google Analytics 4 اختياري ولا يُحمّل إلا بعد موافقتك. قد تتلقى Google بيانات الاستخدام وتضع ملفات تعريف ارتباط للتحليلات. يمكنك سحب الموافقة من إعدادات الخصوصية.',
 hi:'Google Analytics 4 वैकल्पिक है और केवल सहमति के बाद लोड होता है। Google को उपयोग डेटा मिल सकता है और विश्लेषण कुकीज़ सेट हो सकती हैं। गोपनीयता सेटिंग से सहमति वापस लें।',
 id:'Google Analytics 4 bersifat opsional dan hanya dimuat setelah persetujuan. Google dapat menerima data penggunaan dan memasang cookie analitik. Cabut persetujuan melalui Pengaturan privasi.',
 tr:'Google Analytics 4 isteğe bağlıdır ve yalnızca onaydan sonra yüklenir. Google kullanım verileri alabilir ve analiz çerezleri ayarlayabilir. Gizlilik ayarlarından onayınızı geri çekebilirsiniz.',
 zh:'Google Analytics 4 是可选功能，仅在您同意后加载。Google 可能接收使用数据并设置分析 Cookie。您可以在隐私设置中撤回同意。'
};

let count=0,changed=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</body>'))throw Error('Missing body close tag: '+file);
  const present=(html.match(/\bsrc=["']\/assets\/docvelio-ga4\.js["']/g)||[]).length;
  if(present>1)throw Error('Duplicate GA4 initializer: '+file);
  if(!present){
   html=html.replace(/<\/body>/i,tag+'</body>');
   fs.writeFileSync(file,html,'utf8');changed++;
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
