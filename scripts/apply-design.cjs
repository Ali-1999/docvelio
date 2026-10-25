/* Apply one final design layer to every generated and checked-in HTML page.
   Run after all page generators and before SEO sitemap validation.
   This preserves all existing tool scripts, semantic markup and URL structure. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const css='<link rel="stylesheet" href="/assets/design-system.css">';
const js='<script defer src="/assets/design-system.js"></script>';
const privacyCss='<link rel="stylesheet" href="/assets/cookie-consent.css">';
const privacyJs='<script defer src="/assets/cookie-consent.js"></script>';
const policyNotices={
 en:['Current privacy choices','Docvelio stores the privacy decision in localStorage (docvelio_privacy_choice_v1) for up to 180 days. Accepting also permits a small preference record (docvelio_tool_category_v1) to remember the homepage tool category; declining removes it. Advertising and optional analytics tags are currently inactive. If advertising is introduced, fresh consent and, where required, a Google-certified consent platform will be used. You can change this decision through Privacy settings in the footer.'],
 es:['Opciones actuales de privacidad','Docvelio guarda tu decisión hasta 180 días en localStorage. Si aceptas, también se recordará la categoría de herramientas; si rechazas, se borra. La publicidad y el análisis opcional no están activos. Para publicidad futura se pedirá una nueva elección y, cuando corresponda, una plataforma de consentimiento certificada. Cambia tu elección desde el pie de página.'],
 fr:['Choix de confidentialité actuels','Docvelio mémorise votre décision dans localStorage pendant 180 jours au maximum. Si vous acceptez, la catégorie d’outils peut être conservée; refuser efface cette préférence. Publicités et analyses facultatives sont inactives. Toute publicité future exigera un nouveau choix et, si nécessaire, une plateforme certifiée. Modifiez votre décision depuis le pied de page.'],
 de:['Aktuelle Datenschutzwahl','Docvelio speichert Ihre Entscheidung bis zu 180 Tage in localStorage. Mit Zustimmung wird auch die Tool-Kategorie gemerkt; bei Ablehnung wird sie gelöscht. Werbung und optionale Analysen sind zurzeit inaktiv. Bei künftiger Werbung wird die Einwilligung neu eingeholt, ggf. mit einer zertifizierten Plattform. Änderungen sind im Seitenfuß möglich.'],
 pt:['Escolhas atuais de privacidade','O Docvelio guarda sua decisão por até 180 dias no localStorage. A aceitação permite lembrar a categoria de ferramentas; a recusa remove essa preferência. Publicidade e análises opcionais não estão ativas. Qualquer publicidade futura exigirá uma nova escolha e, quando aplicável, uma plataforma certificada. Altere sua decisão no rodapé.'],
 ar:['خيارات الخصوصية الحالية','يحفظ Docvelio قرارك في localStorage لمدة تصل إلى 180 يوماً. تسمح الموافقة بحفظ فئة الأدوات المختارة، بينما يزيل الرفض هذا التفضيل. لا توجد حالياً إعلانات أو تحليلات اختيارية نشطة. ستتطلب الإعلانات المستقبلية موافقة جديدة ومنصة معتمدة عند اللزوم. يمكنك تغيير القرار من تذييل الصفحة.'],
 hi:['मौजूदा गोपनीयता विकल्प','Docvelio आपका निर्णय localStorage में अधिकतम 180 दिनों तक रखता है। स्वीकार करने पर टूल श्रेणी याद रखी जाती है; अस्वीकार करने पर यह हटती है। विज्ञापन और वैकल्पिक एनालिटिक्स अभी बंद हैं। भविष्य में विज्ञापन होने पर नई अनुमति तथा आवश्यक प्रमाणित प्लेटफ़ॉर्म का उपयोग होगा। फ़ुटर से निर्णय बदलें।'],
 id:['Pilihan privasi saat ini','Docvelio menyimpan keputusan hingga 180 hari di localStorage. Persetujuan mengizinkan penyimpanan kategori alat; penolakan menghapus preferensi itu. Iklan dan analitik opsional saat ini nonaktif. Iklan mendatang akan memerlukan pilihan baru dan platform bersertifikasi bila diwajibkan. Ubah keputusan melalui bagian bawah halaman.'],
 tr:['Mevcut gizlilik tercihleri','Docvelio kararınızı localStorage içinde en fazla 180 gün saklar. Onay verilirse araç kategoriniz hatırlanır; reddedilirse silinir. Reklam ve isteğe bağlı analizler şu anda kapalıdır. Gelecekteki reklamlar yeni izin ve gerekirse sertifikalı bir platform gerektirir. Kararı sayfa altından değiştirebilirsiniz.'],
 zh:['当前隐私选项','Docvelio 在 localStorage 中保存您的决定，最长 180 天。同意后可以记住工具分类；拒绝时会删除该偏好。目前未启用广告或可选分析追踪。未来启用广告将重新征求同意，并在适用时使用经过认证的同意管理平台。您可通过页脚的隐私设置修改决定。']
};
const escapeNotice=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let count=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  // Search engine ownership tokens are static verification assets, not HTML pages.
  if(/^(?:naver[a-z0-9_-]+|yandex_[a-z0-9_-]+|google[a-z0-9_-]+|baidu_verify_[a-z0-9_-]+)\.html$/i.test(entry.name))continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</head>')||!html.includes('</body>'))throw Error('Incomplete HTML page: '+file);
  if(!html.includes('href="/assets/design-system.css"'))html=html.replace('</head>',css+'</head>');
  if(!html.includes('src="/assets/design-system.js"'))html=html.replace('</body>',js+'</body>');
  if(!html.includes('href="/assets/cookie-consent.css"'))html=html.replace('</head>',privacyCss+'</head>');
  if(!html.includes('src="/assets/cookie-consent.js"'))html=html.replace('</body>',privacyJs+'</body>');
  const rel=path.relative(root,file).replaceAll('\\','/');
  const parts=rel.split('/');
  const locale=Object.hasOwn(policyNotices,parts[0])&&parts[0]!=='en'?parts.shift():'en';
  if(['cookies/index.html','privacy/index.html'].includes(parts.join('/'))&&!html.includes('data-dv-policy-update="1"')){
    const [heading,body]=policyNotices[locale];
    const note='<section class="dv-policy-update" data-dv-policy-update="1"><div class="container prose"><h2>'+escapeNotice(heading)+'</h2><p>'+escapeNotice(body)+'</p></div></section>';
    html=html.replace('</main>',note+'</main>');
  }
  fs.writeFileSync(file,html);
  count++;
 }
}
walk(root);
if(count!==431)throw Error('Expected 430 pages and one 404 page, found '+count);
console.log('DESIGN BUILD: one responsive styling and accessibility layer applied to '+count+' pages.');
