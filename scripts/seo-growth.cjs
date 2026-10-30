/* Targeted, original on-page SEO and trust improvements.
 * Runs after all HTML generators. Do not add boilerplate to every tool page.
 * Google's indexing decision and rankings cannot be set from markup.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const words={
 en:['Explore tools by task','Need to combine documents? Merge PDFs. Need to change a photograph? Resize an image. Preparing a shipping estimate? Calculate CBM. Select a tool based on the output you need, and retain your original file.','How Docvelio approaches accuracy','Docvelio provides browser-based editing and calculations. The interface explains supported formats and known limits. PDF annotations are not secure redaction, and container calculations are volume-only estimates, not loading guarantees.','Choose the right workflow','Start with a single tool and inspect the result before sharing or printing it. Review file format limits, preserve the original and use the related guides when your document contains sensitive information.','PDF editing tools','Image editing','Shipping calculators','Safe PDF editing guide','About the service','Contact support'],
 es:['Herramientas según tu tarea','¿Quieres combinar documentos? Une archivos PDF. ¿Editar una foto? Cambia el tamaño de la imagen. ¿Calcular un envío? Usa CBM. Conserva siempre el archivo original.','Nuestro enfoque de precisión','Docvelio ofrece edición y cálculos en el navegador. Explicamos formatos y límites. Las anotaciones PDF no son censura segura y los contenedores se estiman solo por volumen.','Elige un proceso adecuado','Empieza con una herramienta y revisa el resultado antes de compartirlo. Conserva el original y consulta las guías al manejar archivos sensibles.','Herramientas PDF','Editar imágenes','Calculadoras de carga','Guía de edición de PDF','Acerca de Docvelio','Contacto'],
 fr:['Choisir un outil selon la tâche','Fusionnez vos PDF pour assembler un dossier, redimensionnez une photo pour modifier son format ou calculez le CBM d’une expédition. Gardez le fichier d’origine.','Notre démarche de fiabilité','Docvelio propose des outils et calculs dans le navigateur. Leurs limites sont expliquées. Les annotations PDF ne constituent pas un caviardage sûr; les conteneurs sont estimés en volume.','Choisir la bonne méthode','Vérifiez le résultat avant partage, gardez l’original et consultez les guides pour les fichiers sensibles.','Outils PDF','Retouche d’images','Calculatrices de fret','Guide de modification PDF','À propos','Contact'],
 de:['Passende Werkzeuge finden','PDF-Dateien zusammenführen, Bilder skalieren oder das Transportvolumen berechnen: Wählen Sie das passende Werkzeug und behalten Sie die Originaldatei.','So prüfen wir unsere Angaben','Docvelio bietet Browser-Werkzeuge mit beschriebenen Grenzen. PDF-Anmerkungen sind keine sichere Schwärzung; Containerzahlen sind reine Volumenschätzungen.','Den richtigen Ablauf wählen','Kontrollieren Sie die Ausgabe, bewahren Sie das Original auf und lesen Sie bei sensiblen Dateien die Anleitungen.','PDF-Werkzeuge','Bilder bearbeiten','Fracht-Rechner','PDF-Bearbeitungshilfe','Über Docvelio','Kontakt'],
 pt:['Encontre a ferramenta certa','Una PDFs para organizar documentos, redimensione uma foto ou calcule CBM para transporte. Escolha pelo resultado desejado e guarde o original.','Como tratamos a precisão','O Docvelio oferece edição e cálculos no navegador, explicando limites. Anotações em PDF não são ocultação segura; estimativas de contêineres usam somente volume.','Escolha o fluxo de trabalho','Confira o resultado antes de compartilhar, guarde o arquivo original e leia os guias para arquivos sensíveis.','Ferramentas PDF','Editar imagens','Calculadoras de carga','Guia de edição PDF','Sobre o Docvelio','Contato'],
 ar:['اختر الأداة المناسبة','ادمج ملفات PDF لترتيب المستندات، أو غيّر حجم صورة، أو احسب حجم الشحنة بالمتر المكعب. احتفظ بالملف الأصلي دائماً.','نهجنا في الدقة','يوضح Docvelio الوظائف والحدود. الملاحظات على PDF ليست تنقيحاً آمناً، وتقديرات الحاويات تعتمد على الحجم فقط وليست ضماناً للتحميل.','اختر سير العمل','افحص الملف الناتج قبل المشاركة واحتفظ بالأصل وراجع إرشادات الملفات الحساسة.','أدوات PDF','تحرير الصور','حاسبات الشحن','دليل تحرير PDF','حول Docvelio','اتصل بنا'],
 hi:['सही टूल चुनें','दस्तावेज़ जोड़ने के लिए PDF मर्ज करें, फ़ोटो का आकार बदलने के लिए इमेज एडिटर उपयोग करें, या शिपमेंट का CBM निकालें। मूल फ़ाइल रखें।','सटीकता और सीमाएँ','Docvelio ब्राउज़र आधारित टूल प्रदान करता है और उनकी सीमाएँ बताता है। PDF एनोटेशन सुरक्षित रेडैक्शन नहीं है, और कंटेनर के आँकड़े केवल आयतन के अनुमान हैं।','सही प्रक्रिया अपनाएँ','शेयर करने से पहले परिणाम जाँचें, मूल प्रति रखें और संवेदनशील दस्तावेज़ों के लिए गाइड पढ़ें।','PDF टूल','इमेज एडिटर','शिपिंग कैलकुलेटर','PDF गाइड','परिचय','संपर्क'],
 id:['Pilih alat sesuai kebutuhan','Gabungkan PDF untuk mengatur berkas, ubah ukuran foto, atau hitung CBM kiriman. Periksa hasil dan simpan berkas asli.','Pendekatan terhadap akurasi','Docvelio menjelaskan kemampuan dan batas alat berbasis browser. Anotasi PDF bukan penghapusan data rahasia yang aman; perkiraan kontainer hanya berdasarkan volume.','Pilih proses yang tepat','Periksa hasil sebelum membagikannya, simpan file asli, dan baca panduan untuk dokumen sensitif.','Alat PDF','Edit gambar','Kalkulator kargo','Panduan PDF','Tentang Docvelio','Kontak'],
 tr:['İşiniz için doğru aracı seçin','Belgeleri birleştirmek için PDF birleştirin, fotoğrafı boyutlandırın veya sevkiyatın CBM değerini hesaplayın. Orijinali saklayın.','Doğruluk yaklaşımımız','Docvelio tarayıcı araçlarının sınırlarını açıklar. PDF notları güvenli karartma değildir; konteyner sonuçları yalnızca hacim tahminidir.','Doğru iş akışını seçin','Paylaşmadan önce çıktıyı kontrol edin, orijinali saklayın ve hassas dosyalarda rehberleri okuyun.','PDF araçları','Görsel düzenleme','Kargo hesaplayıcıları','PDF düzenleme rehberi','Hakkında','İletişim'],
 zh:['按任务选择工具','合并 PDF 文件以整理文档，调整图片大小，或计算货物的 CBM 体积。处理前请保留原文件。','我们如何说明准确性','Docvelio 提供浏览器工具并说明功能限制。PDF 注释并不等于安全涂黑，集装箱计算仅是体积估算，不保证实际装载。','选择合适的流程','分享前检查导出结果，保留原件，涉及敏感信息时请阅读安全指南。','PDF 工具','图片编辑','货运计算器','PDF 编辑指南','关于 Docvelio','联系我们']
};
const htmlEsc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let modified=0,blocks=0,assetLinks=0;
function findPages(dir){
 for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,item.name);
  if(item.isDirectory()){findPages(file);continue;}
  if(item.name!=='index.html')continue;
  let html=fs.readFileSync(file,'utf8');
  const rel=path.relative(root,file).replaceAll('\\','/');
  const parts=rel.split('/'),lang=langs.slice(1).includes(parts[0])?parts.shift():'en';
  const route=parts.slice(0,-1).join('/');
  const t=words[lang],base=lang==='en'?'/':'/'+lang+'/';
  const kind=route===''?'home':route==='about'?'about':route==='guides'?'guide':null;
  if(!kind)continue;
  if(html.includes('data-dv-seo-2026="1"'))throw Error('SEO pass ran twice: '+rel);
  const links=[
   ['tools/merge-pdf/',t[6]],['image-tools/resize-image/',t[7]],
   ['cbm-calculator/',t[8]],['guides/edit-pdf-safely/',t[9]],
   ['about/',t[10]],['contact/',t[11]]
  ].filter(([p])=>!(kind==='about'&&p==='about/'));
  const l=links.map(([url,label])=>'<a href="'+base+url+'">'+htmlEsc(label)+'</a>').join('');
  let title=kind==='home'?t[0]:kind==='about'?t[2]:t[4];
  let body=kind==='home'?t[1]:kind==='about'?t[3]:t[5];
  const panel='<section class="dv-seo-trust" data-dv-seo-2026="1" aria-label="'+htmlEsc(title)+'"><div class="container dv-seo-trust-inner"><h2>'+htmlEsc(title)+'</h2><p>'+htmlEsc(body)+'</p><nav class="dv-seo-trust-links" aria-label="'+htmlEsc(title)+'">'+l+'</nav></div></section>';
  if(!html.includes('</main>'))throw Error('Missing main '+rel);
  html=html.replace('</main>',panel+'</main>');
  if(!html.includes('/assets/seo-growth.css'))html=html.replace('</head>','<link rel="stylesheet" href="/assets/seo-growth.css"></head>');
  // Do not inject fabricated reviews, ratings, publication dates or author credentials.
  fs.writeFileSync(file,html,'utf8');modified++;blocks++;assetLinks++;
 }
}
findPages(root);
if(modified!==30)throw Error('Expected 30 targeted home/about/guides panels, got '+modified);
console.log('SEO GROWTH: '+blocks+' task-specific trust/discovery blocks in ten languages; no fabricated local-business or review data.');
