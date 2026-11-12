/* Final, idempotent content and privacy improvements after all page generators. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const locales=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const guideCopy={
'edit-pdf-safely':[
'保留未修改的原始 PDF。开始前先复制文件，并用清楚的文件名区分原件和工作副本。完成后逐页打开下载文件，检查文字、图片、页码和批注的位置。',
'PDF 批注通常是在页面上增加文字、线条或高亮覆盖层，并不等于直接改写 PDF 内部的原始段落。若要大幅修改文字、表格或版面，优先寻找原始 DOCX 文件，再导出新的 PDF。',
'白色或黑色矩形只能遮住屏幕上的文字，不能保证删除底层文字或图像数据。需要隐藏身份证号码、地址或财务资料时，应使用能够永久移除内容的专业安全脱敏工具，并检查复制、搜索和文本提取结果。',
'在分享前检查电子签名、表单字段、链接和附件。手绘签名图像不等于带有证书验证的数字签名。若文件用于正式流程，请确认接收方要求的签署方式。',
'相关工具：<a href="/tools/edit-pdf/">编辑 PDF</a>、<a href="/tools/sign-pdf/">PDF 签名</a>、<a href="/tools/view-pdf/">查看 PDF</a>。保留原件，并在发送前再次检查导出文件。'
],
'organize-pages':[
'先确定最终阅读顺序，再选择合并、拆分、旋转、删除或重新排列页面。对于报告，可先放封面和目录，再放正文，最后放附件。不要只依赖文件名判断页面顺序。',
'合并多个 PDF 时，逐个确认文件顺序，并在输出文件中检查第一页、最后一页以及文件之间的衔接。目录中的页码、交叉引用和书签可能不会自动更新。',
'拆分文件时，使用 PDF 阅读器显示的页码范围，并注意它们可能与页面上印刷的页码不同。只导出真正需要分享的章节，同时确认没有把个人资料或内部附件包含进去。',
'删除或移动页面后，原来的页码引用、表单字段、批注和数字签名可能失效或改变。下载后检查页面总数、方向、链接和签名状态；重要文件应保留未经修改的副本。',
'相关工具：<a href="/tools/merge-pdf/">合并 PDF</a>、<a href="/tools/split-pdf/">拆分 PDF</a>、<a href="/tools/remove-pages/">删除页面</a>、<a href="/tools/rotate-pdf/">旋转 PDF</a>。'
],
'privacy':[
'判断 PDF 工具的隐私保护时，应区分文件内容处理和网站访问数据。Docvelio 当前文档工具在浏览器中处理所选文件；这不代表浏览器、网络服务或第三方脚本不会接收常规连接信息。',
'Cloudflare 托管和安全服务可能处理 IP 地址、请求时间、浏览器信息及安全事件数据。部分工具会从 jsDelivr 等内容分发网络加载程序库；这些服务在提供文件时会接收常规网络请求信息。',
'选择敏感文件前，检查页面加载的第三方脚本、隐私政策和浏览器开发者工具中的网络请求。避免在公共电脑上处理机密文件，并留意浏览器扩展、下载目录、备份和设备共享设置。',
'PDF 上的白色遮盖、批注或水印不是安全脱敏，也不能阻止复制。需要永久删除个人资料时，应使用专业脱敏工具，并在分享前测试搜索、复制和文本提取。',
'分析与广告状态：Google Analytics 4 使用 Consent Mode，分析存储默认拒绝；同意前 Google 标签仍可能发送有限的无 Cookie 信号。接受后才启用分析 Cookie，并加载 Ahrefs Analytics。拒绝不会加载 Ahrefs Analytics。此选择不代表广告同意；在配置合适的 Google 认证 CMP 前，不加载 AdSense 广告投放脚本。'
],
'scanned-documents':[
'扫描版 PDF 通常把每一页保存为图片，而不是可搜索的文字。打开文件后尝试用鼠标选择一个词：如果无法选择，文件可能只有页面图像，普通文本提取工具无法直接读取其中的文字。',
'OCR（光学字符识别）会分析页面图像并尝试识别字符。识别结果取决于扫描分辨率、页面倾斜、字体、语言、污渍和表格结构。数字、姓名和小字号内容尤其需要人工核对。',
'把扫描页面转换为 JPG 或 PNG，只会生成页面图片，不会自动创建可搜索的文字层。若需要搜索、复制或辅助技术读取内容，应使用支持 OCR 的专门软件，并检查识别后的文字。',
'保留原始扫描文件。处理后逐页比较方向、边缘、表格、印章和手写内容。不要把自动识别结果直接当作法律、医疗或财务记录的准确副本。',
'相关工具：<a href="/tools/view-pdf/">查看 PDF</a>、<a href="/tools/pdf-to-text/">提取 PDF 文本</a>、<a href="/tools/pdf-to-jpg/">PDF 转 JPG</a>。'
],
'word-formatting':[
'编辑 DOCX 前先保存原始文件。记录页面大小、页边距、字体、标题层级、页眉页脚和页码设置。复杂文件可能包含分节符、文本框、脚注、目录、图表和嵌入对象。',
'导入或修改文档后，检查标题层级、段落间距、列表编号和表格宽度。表格可能跨页，长单元格可能改变行高；图片锚点和环绕方式也可能在不同编辑器中发生变化。',
'导出 DOCX 后，使用兼容的文字处理软件重新打开文件。重点检查分页、字体替换、特殊字符、页眉页脚、目录、脚注和表格边框。不要只依赖浏览器预览判断最终版式。',
'如果需要精确排版或正式出版，尽量在原始 Word 文件中修改，并在目标软件中完成最终校对。保留一份未修改的原件，以便发现格式变化时恢复。',
'相关工具：<a href="/tools/word-editor/">Word 编辑器</a>、<a href="/tools/edit-pdf/">编辑 PDF</a>。'
]};
const policy={
en:['Analytics and advertising status','Google Analytics 4 uses Consent Mode. Analytics storage is denied by default; before a choice, the Google tag may send limited cookieless signals. Accepting enables analytics cookies and loads Ahrefs Analytics. Declining keeps analytics cookies off and does not load Ahrefs Analytics. This choice is not advertising consent. The AdSense ownership meta tag and ads.txt seller record are verification records; the AdSense ad-delivery script is disabled until an appropriate Google-certified consent management platform is configured for regions where it is required.'],
es:['Estado de analítica y publicidad','Google Analytics 4 utiliza Consent Mode. El almacenamiento analítico se deniega de forma predeterminada; antes de elegir, la etiqueta de Google puede enviar señales limitadas sin cookies. Aceptar activa las cookies analíticas y carga Ahrefs Analytics. Rechazar mantiene desactivadas las cookies analíticas y no carga Ahrefs Analytics. Esta elección no constituye consentimiento publicitario. La etiqueta de propiedad de AdSense y el registro ads.txt son datos de verificación; el script de anuncios de AdSense permanece desactivado hasta configurar una plataforma de consentimiento certificada por Google cuando sea necesaria.'],
fr:['État des mesures d’audience et de la publicité','Google Analytics 4 utilise Consent Mode. Le stockage analytique est refusé par défaut ; avant tout choix, la balise Google peut envoyer des signaux limités sans cookies. Accepter active les cookies analytiques et charge Ahrefs Analytics. Refuser maintient les cookies analytiques désactivés et ne charge pas Ahrefs Analytics. Ce choix ne vaut pas consentement publicitaire. La balise de propriété AdSense et l’entrée ads.txt servent à la vérification ; le script de diffusion publicitaire AdSense reste désactivé jusqu’à la configuration d’une CMP certifiée par Google lorsqu’elle est requise.'],
de:['Status von Analyse und Werbung','Google Analytics 4 verwendet Consent Mode. Analysespeicherung ist standardmäßig abgelehnt; vor einer Auswahl kann das Google-Tag begrenzte cookielose Signale senden. Zustimmung aktiviert Analyse-Cookies und lädt Ahrefs Analytics. Ablehnung hält Analyse-Cookies deaktiviert und lädt Ahrefs Analytics nicht. Diese Auswahl ist keine Werbeeinwilligung. Das AdSense-Inhaberschafts-Meta-Tag und der ads.txt-Eintrag dienen der Verifizierung; das AdSense-Auslieferungsskript bleibt deaktiviert, bis eine erforderliche, von Google zertifizierte Einwilligungsplattform eingerichtet ist.'],
pt:['Estado de análise e publicidade','O Google Analytics 4 utiliza Consent Mode. O armazenamento analítico é recusado por predefinição; antes de uma escolha, a etiqueta Google pode enviar sinais limitados sem cookies. Aceitar ativa os cookies analíticos e carrega o Ahrefs Analytics. Recusar mantém os cookies analíticos desativados e não carrega o Ahrefs Analytics. Esta escolha não representa consentimento para publicidade. A meta tag de propriedade AdSense e o registo ads.txt servem para verificação; o script de anúncios AdSense permanece desativado até ser configurada uma plataforma de consentimento certificada pela Google quando necessária.'],
ar:['حالة التحليلات والإعلانات','يستخدم Google Analytics 4 وضع الموافقة. يكون تخزين التحليلات مرفوضاً افتراضياً؛ وقد ترسل علامة Google إشارات محدودة دون ملفات تعريف ارتباط قبل الاختيار. يؤدي القبول إلى تفعيل ملفات تعريف ارتباط التحليلات وتحميل Ahrefs Analytics. يؤدي الرفض إلى إبقاء ملفات تعريف ارتباط التحليلات معطلة وعدم تحميل Ahrefs Analytics. هذا الاختيار لا يمثل موافقة على الإعلانات. تُستخدم علامة ملكية AdSense وسجل ads.txt للتحقق فقط؛ ويظل نص عرض إعلانات AdSense معطلاً إلى حين إعداد منصة موافقة معتمدة من Google حيثما يلزم.'],
hi:['एनालिटिक्स और विज्ञापन की स्थिति','Google Analytics 4, Consent Mode का उपयोग करता है। एनालिटिक्स स्टोरेज डिफ़ॉल्ट रूप से अस्वीकृत रहता है; विकल्प चुनने से पहले Google टैग सीमित कुकी-रहित संकेत भेज सकता है। स्वीकार करने पर एनालिटिक्स कुकीज़ चालू होती हैं और Ahrefs Analytics लोड होता है। अस्वीकार करने पर एनालिटिक्स कुकीज़ बंद रहती हैं और Ahrefs Analytics लोड नहीं होता। यह विकल्प विज्ञापन की सहमति नहीं है। AdSense स्वामित्व मेटा टैग और ads.txt रिकॉर्ड केवल सत्यापन के लिए हैं; जहाँ आवश्यक हो वहाँ Google-प्रमाणित सहमति प्लेटफ़ॉर्म स्थापित होने तक AdSense विज्ञापन स्क्रिप्ट बंद रहती है।'],
id:['Status analitik dan iklan','Google Analytics 4 menggunakan Consent Mode. Penyimpanan analitik ditolak secara default; sebelum pilihan dibuat, tag Google dapat mengirim sinyal terbatas tanpa cookie. Menerima akan mengaktifkan cookie analitik dan memuat Ahrefs Analytics. Menolak membuat cookie analitik tetap nonaktif dan tidak memuat Ahrefs Analytics. Pilihan ini bukan persetujuan iklan. Meta tag kepemilikan AdSense dan catatan penjual ads.txt hanya untuk verifikasi; skrip penayangan iklan AdSense dinonaktifkan sampai platform persetujuan bersertifikat Google yang diperlukan dikonfigurasi.'],
tr:['Analiz ve reklam durumu','Google Analytics 4, Consent Mode kullanır. Analiz depolaması varsayılan olarak reddedilir; seçim yapılmadan önce Google etiketi sınırlı çerezsiz sinyaller gönderebilir. Kabul etmek analiz çerezlerini etkinleştirir ve Ahrefs Analytics’i yükler. Reddetmek analiz çerezlerini kapalı tutar ve Ahrefs Analytics’i yüklemez. Bu seçim reklam izni değildir. AdSense sahiplik meta etiketi ve ads.txt kaydı yalnızca doğrulama içindir; gerekli Google sertifikalı izin platformu yapılandırılana kadar AdSense reklam sunum betiği devre dışıdır.'],
zh:['分析与广告状态','Google Analytics 4 使用 Consent Mode。分析存储默认设置为拒绝；在访客作出选择前，Google 标签仍可能发送有限的无 Cookie 信号。接受后会启用分析 Cookie 并加载 Ahrefs Analytics。拒绝后分析 Cookie 保持关闭，且不会加载 Ahrefs Analytics。此选择不代表同意接收广告。AdSense 所有权元标签和 ads.txt 卖方记录仅用于网站验证；在需要的地区配置 Google 认证的同意管理平台之前，AdSense 广告投放脚本保持禁用。']
};
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
function section(id,title,body,lang){
 return '<section id="'+id+'" data-'+id+'="1" class="container dv-audit-content"><h2>'+escape(title)+'</h2>'+body.map((p,i)=>'<p>'+p+'</p>').join('')+'</section>';
}
function upsertMain(file,id,html){
 let doc=fs.readFileSync(file,'utf8');
 const re=new RegExp('<section\\b[^>]*data-'+id+'="1"[\\s\\S]*?<\\/section>','i');
 if(re.test(doc))doc=doc.replace(re,html);
 else if(doc.includes('</main>'))doc=doc.replace('</main>',html+'</main>');
 else throw Error('Missing main landmark: '+file);
 fs.writeFileSync(file,doc);
}
let guideCount=0,policyCount=0;
for(const [slug,paragraphs] of Object.entries(guideCopy)){
 const file=path.join(root,'zh','guides',slug,'index.html');
 if(!fs.existsSync(file))throw Error('Missing Chinese guide: '+slug);
 const heading=({ 'edit-pdf-safely':'安全编辑 PDF：保留原件并检查结果','organize-pages':'整理 PDF 页面：合并、拆分、删除与排序','privacy':'如何评估在线 PDF 工具的隐私保护','scanned-documents':'扫描版 PDF、图片文字与 OCR 的区别','word-formatting':'在线编辑 DOCX 时如何检查 Word 排版'})[slug];
 const body=paragraphs.map(p=>'<p>'+p+'</p>').join('');
 upsertMain(file,'dv-guide-depth-zh-2026','<section data-dv-guide-depth-zh-2026="1" class="container dv-audit-content"><h2>'+heading+'</h2>'+body+'</section>');
 guideCount++;
}
for(const lang of locales){
 const prefix=lang==='en'?'':lang+'/';
 for(const [slug,id] of [['privacy','dv-privacy-audit-2026'],['cookies','dv-cookie-audit-2026']]){
  const file=path.join(root,prefix,slug,'index.html');
  if(!fs.existsSync(file))throw Error('Missing policy page: '+prefix+slug);
  const [heading,copy]=policy[lang];
  const text=slug==='cookies'?copy+' Cookie choices on this website manage optional analytics preferences only; they do not record advertising consent. You can change your browser cookie and site-data settings at any time.':copy;
  upsertMain(file,id,'<section id="'+id+'" data-'+id+'="1" class="container dv-audit-content"><h2>'+escape(heading)+'</h2><p>'+escape(text)+'</p></section>');
  policyCount++;
 }
}
console.log('SEO audit improvements: '+guideCount+' Chinese guides expanded; '+policyCount+' localized privacy/cookie pages updated.');
