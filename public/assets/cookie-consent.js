/* Docvelio privacy choices v1.
 * One OPTIONAL category: remembering homepage tool filter (localStorage).
 * No analytics/advertising tags are deployed or enabled here.
 * This is not an IAB TCF or Google-certified advertising CMP.
 */
(()=>{'use strict';
const KEY='docvelio_privacy_choice_v1';
const FILTER='docvelio_tool_category_v1';
const VERSION=1,MAX_AGE=180*24*60*60*1000;
const locale=(document.documentElement.lang||'en').split('-')[0];
const languages={
en:['Your privacy choices','Docvelio uses local browser storage to remember your choice. If you accept, we can also remember your selected tool category on this device. Advertising and optional analytics trackers are not currently active.','Accept','Decline','Details','Hide details','Cookie Policy','Privacy settings','Necessary storage','Remembers your decision so you do not see this message every visit. Always on.','Optional preferences','Only if you accept, remembers your last tool category on this device.','Not in use','Advertising and optional analytics tracking are currently off. A future change will require a fresh choice.','Your privacy settings'],
es:['Tus opciones de privacidad','Docvelio guarda tu elección en el navegador. Si aceptas, también recordaremos la categoría de herramientas elegida. La publicidad y la analítica opcional no están activas.','Aceptar','Rechazar','Detalles','Ocultar detalles','Política de cookies','Configuración de privacidad','Almacenamiento necesario','Recuerda tu decisión para no mostrar este aviso en cada visita. Siempre activo.','Preferencias opcionales','Solo si aceptas, recuerda la última categoría de herramientas.','No se utiliza','La publicidad y la analítica opcional están desactivadas. Los cambios futuros pedirán una nueva elección.','Tus opciones de privacidad'],
fr:['Vos choix de confidentialité','Docvelio mémorise votre choix dans le navigateur. Avec votre accord, il peut aussi retenir la catégorie d’outils choisie. La publicité et les outils d’analyse facultatifs sont actuellement désactivés.','Accepter','Refuser','Détails','Masquer les détails','Politique de cookies','Paramètres de confidentialité','Stockage nécessaire','Mémorise votre décision pour éviter de répéter le message. Toujours actif.','Préférences facultatives','Uniquement si vous acceptez, mémorise la dernière catégorie d’outils.','Non utilisé','La publicité et les analyses facultatives sont désactivées. Un changement futur exigera un nouveau choix.','Vos choix de confidentialité'],
de:['Ihre Datenschutzauswahl','Docvelio speichert Ihre Entscheidung im Browser. Mit Zustimmung merken wir uns auch die gewählte Tool-Kategorie. Werbung und optionale Analysedienste sind derzeit nicht aktiv.','Akzeptieren','Ablehnen','Details','Details schließen','Cookie-Richtlinie','Datenschutzeinstellungen','Notwendige Speicherung','Merkt sich Ihre Entscheidung, damit die Meldung nicht ständig erscheint. Immer aktiv.','Optionale Einstellungen','Nur mit Zustimmung wird die letzte Tool-Kategorie gespeichert.','Nicht verwendet','Werbung und optionale Analysen sind ausgeschaltet. Bei späteren Änderungen fragen wir erneut.','Ihre Datenschutzauswahl'],
pt:['Suas opções de privacidade','O Docvelio guarda sua escolha no navegador. Se aceitar, também poderemos lembrar a categoria de ferramentas selecionada. Publicidade e análises opcionais estão desativadas.','Aceitar','Recusar','Detalhes','Ocultar detalhes','Política de cookies','Configurações de privacidade','Armazenamento necessário','Lembra sua decisão para evitar repetir a mensagem. Sempre ativo.','Preferências opcionais','Somente com sua permissão, lembra a última categoria de ferramentas.','Não utilizado','Publicidade e análise opcional estão desativadas. Mudanças futuras exigirão nova escolha.','Suas opções de privacidade'],
ar:['خيارات الخصوصية','يحفظ Docvelio قرارك في المتصفح. إذا وافقت يمكن حفظ فئة الأدوات التي اخترتها على جهازك. لا نستخدم حالياً ملفات تعريف ارتباط للإعلانات أو التحليلات الاختيارية.','موافقة','رفض','التفاصيل','إخفاء التفاصيل','سياسة ملفات الارتباط','إعدادات الخصوصية','تخزين ضروري','يحفظ قرارك حتى لا تظهر الرسالة في كل زيارة. مفعّل دائماً.','تفضيلات اختيارية','إذا وافقت فقط، تُحفظ آخر فئة أدوات اخترتها على هذا الجهاز.','غير مستخدم','الإعلانات والتحليلات الاختيارية معطلة حالياً. ستتطلب أي تغييرات لاحقة موافقة جديدة.','خيارات الخصوصية'],
hi:['आपके गोपनीयता विकल्प','Docvelio आपके फ़ैसले को ब्राउज़र में सहेजता है। स्वीकार करने पर आपकी चुनी हुई टूल श्रेणी भी याद रखी जा सकती है। विज्ञापन और वैकल्पिक एनालिटिक्स अभी चालू नहीं हैं।','स्वीकार करें','अस्वीकार करें','विवरण','विवरण छिपाएँ','कुकी नीति','गोपनीयता सेटिंग्स','आवश्यक स्टोरेज','आपका निर्णय याद रखता है ताकि बार-बार सूचना न दिखे। हमेशा चालू।','वैकल्पिक पसंद','स्वीकार करने पर ही पिछली टूल श्रेणी याद रखी जाती है।','अभी उपयोग में नहीं','विज्ञापन और वैकल्पिक एनालिटिक्स बंद हैं। बदलाव पर दोबारा विकल्प माँगा जाएगा।','आपके गोपनीयता विकल्प'],
id:['Pilihan privasi Anda','Docvelio menyimpan keputusan Anda di browser. Jika setuju, kami juga dapat mengingat kategori alat yang dipilih. Iklan dan analitik opsional saat ini tidak aktif.','Terima','Tolak','Detail','Sembunyikan detail','Kebijakan cookie','Pengaturan privasi','Penyimpanan penting','Mengingat keputusan agar pesan tidak selalu muncul. Selalu aktif.','Preferensi opsional','Hanya jika setuju, kategori alat terakhir akan diingat.','Tidak digunakan','Iklan dan analitik opsional saat ini mati. Perubahan berikutnya memerlukan pilihan baru.','Pilihan privasi Anda'],
tr:['Gizlilik tercihleriniz','Docvelio seçiminizi tarayıcıda saklar. Onay verirseniz seçtiğiniz araç kategorisini de hatırlayabiliriz. Reklam ve isteğe bağlı analiz izleyicileri şu anda etkin değildir.','Kabul et','Reddet','Ayrıntılar','Ayrıntıları gizle','Çerez Politikası','Gizlilik ayarları','Zorunlu depolama','Kararınızı hatırlayarak mesajı her ziyarette göstermemeyi sağlar. Her zaman açık.','İsteğe bağlı tercihler','Yalnızca onay verirseniz son araç kategoriniz saklanır.','Kullanımda değil','Reklam ve isteğe bağlı analiz kapalıdır. Gelecek değişikliklerde yeniden seçim istenir.','Gizlilik tercihleriniz'],
zh:['您的隐私选择','Docvelio 在浏览器中保存您的决定。如果您同意，我们还会记住您选择的工具分类。目前未启用广告或可选分析追踪。','接受','拒绝','详情','收起详情','Cookie 政策','隐私设置','必要存储','记住您的决定，避免每次访问都显示提示。始终启用。','可选偏好','仅在您同意后保存上次选择的工具分类。','未启用','广告与可选分析目前关闭。以后如有变更，将重新征求您的选择。','您的隐私选择']
};
const t=languages[locale]||languages.en;
function read(){
 try{
  const data=JSON.parse(localStorage.getItem(KEY)||'null');
  if(data?.version!==VERSION || !['accepted','declined'].includes(data.choice)||
     !Number.isFinite(data.time)||Date.now()-data.time>MAX_AGE||
     data.time>Date.now()+120000)return null;
  return data.choice;
 }catch(_){return null;}
}
function write(choice){
 try{localStorage.setItem(KEY,JSON.stringify({version:VERSION,choice,time:Date.now()}));}catch(_){}
 try{
  if(choice==='declined')localStorage.removeItem(FILTER);
 }catch(_){}
 window.dispatchEvent(new CustomEvent('docvelio:privacy-choice',{detail:{choice}}));
}
function make(tag,className,text){
 const n=document.createElement(tag);
 if(className)n.className=className;
 if(text!==undefined)n.textContent=text;
 return n;
}
const region=make('section','dv-cookie-banner');
region.setAttribute('role','region');
region.setAttribute('aria-labelledby','dv-cookie-heading');
region.hidden=true;
const inner=make('div','dv-cookie-container');
const header=make('div','dv-cookie-header');
const icon=make('span','dv-cookie-icon');icon.setAttribute('aria-hidden','true');icon.textContent='◈';
header.append(icon);
const copy=make('div','dv-cookie-copy');
const title=make('h2','dv-cookie-title',t[0]);title.id='dv-cookie-heading';
copy.append(title,make('p','dv-cookie-description',t[1]));
header.append(copy);
inner.append(header);
const details=make('div','dv-cookie-details');details.id='dv-cookie-details';details.hidden=true;
for(const [heading,body] of [[t[8],t[9]],[t[10],t[11]],[t[12],t[13]]]){
 const block=make('div','dv-cookie-detail');
 block.append(make('strong','',heading),make('span','',body));details.append(block);
}
const controls=make('div','dv-cookie-actions');
function button(label,cls,handler){
 const b=make('button','dv-cookie-button '+cls,label);b.type='button';b.addEventListener('click',handler);
 controls.append(b);return b;
}
function hide(){region.hidden=true;details.hidden=true;more.setAttribute('aria-expanded','false');more.textContent=t[4];}
button(t[3],'dv-cookie-reject',()=>{write('declined');hide();});
button(t[2],'dv-cookie-accept',()=>{write('accepted');hide();});
const more=button(t[4],'dv-cookie-more',()=>{
 const show=details.hidden;
 details.hidden=!show;more.setAttribute('aria-expanded',String(show));
 more.textContent=show?t[5]:t[4];
});
more.setAttribute('aria-controls','dv-cookie-details');
more.setAttribute('aria-expanded','false');
const policy=make('a','dv-cookie-policy',t[6]);policy.href=(locale==='en'?'/':'/'+locale+'/')+'cookies/';
controls.append(policy);
inner.append(controls,details);
region.append(inner);
document.body.append(region);
const footer=document.querySelector('.footer .foot-bottom')||document.querySelector('.footer')||document.querySelector('footer');
const settings=make('button','dv-cookie-settings',t[7]);
settings.type='button';settings.setAttribute('aria-label',t[14]);
settings.addEventListener('click',()=>{region.hidden=false;details.hidden=false;
 more.textContent=t[5];more.setAttribute('aria-expanded','true');title.focus?.();});
if(footer)footer.append(settings);
else{const holder=make('div','dv-cookie-settings-holder');holder.append(settings);document.body.append(holder);}
if(!read())region.hidden=false;
})();
