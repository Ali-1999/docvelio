/* Distinct localized descriptions for Docvelio's practical reference guides.
 * Source descriptions were identical across five unrelated guide topics.
 * Correct the generated pages after final metadata generation, without changing
 * canonical URLs, visible article content, or locale routing.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const routes=['edit-pdf-safely','organize-pages','privacy','scanned-documents','word-formatting'];
const copy={
 en:[
 'Annotate PDFs safely: understand comments, overlays and redaction limits. Keep your original document and check the downloaded copy.',
 'Reorder, remove and extract PDF pages without losing the intended reading order. Check page numbers and preserve the original file.',
 'Learn how to evaluate PDF tool privacy, local file processing, external scripts and network connections before editing sensitive files.',
 'Understand scanned PDFs, OCR and selectable text. Learn when text extraction works and how to check the resulting document.',
 'Edit Word documents while protecting headings, tables, fonts and spacing. Review DOCX formatting after downloading a new copy.'
 ],
 es:[
 'Anota archivos PDF con cuidado: comprende los comentarios, las capas y los límites de la ocultación. Conserva siempre el original.',
 'Reordena, elimina y extrae páginas PDF sin perder la secuencia prevista. Comprueba la numeración y conserva el archivo original.',
 'Comprueba la privacidad de los editores PDF: procesamiento local, scripts externos, conexiones y riesgos para archivos sensibles.',
 'Comprende los PDF escaneados, el OCR y el texto seleccionable. Aprende cuándo funciona la extracción y cómo revisar el resultado.',
 'Edita documentos Word respetando títulos, tablas, fuentes y espacios. Revisa el formato DOCX antes de compartir la copia.'
 ],
 fr:[
 'Annotez vos PDF avec prudence : commentaires, masquage visuel et limites du caviardage. Conservez et vérifiez le document original.',
 'Réorganisez, supprimez et extrayez des pages PDF dans le bon ordre. Vérifiez les numéros de page et gardez le fichier original.',
 'Évaluez la confidentialité des outils PDF : traitement local, scripts externes, connexions réseau et risques pour vos fichiers.',
 'Comprenez les PDF numérisés, l’OCR et le texte sélectionnable. Sachez quand l’extraction fonctionne et comment vérifier le résultat.',
 'Modifiez des documents Word en contrôlant titres, tableaux, polices et espacements. Vérifiez le DOCX exporté avant de le partager.'
 ],
 de:[
 'PDFs sicher kommentieren: Anmerkungen, Überdeckungen und Grenzen der Schwärzung verstehen. Original behalten und Kopie prüfen.',
 'PDF-Seiten sortieren, löschen und extrahieren, ohne die Lesereihenfolge zu verlieren. Seitenzahlen und Ausgabedatei prüfen.',
 'Datenschutz bei PDF-Tools prüfen: lokale Verarbeitung, externe Skripte, Netzwerkzugriffe und Risiken für vertrauliche Dateien.',
 'Gescannten PDFs, OCR und auswählbaren Text verstehen. Erfahren Sie, wann Textextraktion funktioniert und wie Ergebnisse zu prüfen sind.',
 'Word-Dokumente bearbeiten und Überschriften, Tabellen, Schriften und Abstände beachten. Exportierte DOCX-Datei kontrollieren.'
 ],
 pt:[
 'Anote PDFs com segurança: comentários, sobreposições e limites da ocultação visual. Guarde o original e confira a nova cópia.',
 'Reordene, remova e extraia páginas PDF na sequência certa. Confira a numeração e preserve sempre o documento original.',
 'Avalie a privacidade de ferramentas PDF: processamento local, scripts externos, ligações de rede e ficheiros sensíveis.',
 'Entenda PDFs digitalizados, OCR e texto selecionável. Saiba quando a extração funciona e como verificar o resultado.',
 'Edite documentos Word verificando títulos, tabelas, fontes e espaçamento. Confira o formato DOCX antes de partilhar.'
 ],
 ar:[
 'تعرّف على التعليق الآمن على ملفات PDF وحدود التغطية البصرية وإخفاء النص. احتفظ بالأصل وراجع النسخة الناتجة.',
 'رتّب صفحات PDF أو احذفها أو استخرجها دون فقدان التسلسل المطلوب. افحص أرقام الصفحات واحتفظ بالملف الأصلي.',
 'افحص خصوصية أدوات PDF من حيث المعالجة المحلية والبرامج الخارجية واتصالات الشبكة قبل فتح ملفات حساسة.',
 'افهم ملفات PDF الممسوحة ضوئيًا وتقنية OCR والنص القابل للتحديد. تعلّم متى ينجح استخراج النص وكيفية فحصه.',
 'حرّر مستندات Word مع الانتباه للعناوين والجداول والخطوط والتباعد. راجع تنسيق DOCX بعد التنزيل.'
 ],
 hi:[
 'PDF पर सुरक्षित टिप्पणियाँ जोड़ें। छिपाए गए पाठ और वास्तविक रिडैक्शन का अंतर समझें। मूल फ़ाइल रखें और नई प्रति जाँचें।',
 'PDF पृष्ठों का क्रम बदलें, हटाएँ या निकालें। पृष्ठ संख्या और पढ़ने का क्रम जाँचें तथा मूल दस्तावेज़ सुरक्षित रखें।',
 'PDF टूल की गोपनीयता जाँचें: स्थानीय फ़ाइल प्रोसेसिंग, बाहरी स्क्रिप्ट, नेटवर्क अनुरोध और संवेदनशील दस्तावेज़ों के जोखिम।',
 'स्कैन PDF, OCR और चयन योग्य टेक्स्ट का अंतर समझें। जानें टेक्स्ट निकालना कब संभव है और परिणाम कैसे जाँचें।',
 'Word फ़ाइल में शीर्षक, तालिका, फ़ॉन्ट और अंतराल का ध्यान रखें। डाउनलोड की गई DOCX प्रति का फ़ॉर्मेट जाँचें।'
 ],
 id:[
 'Anotasi PDF dengan aman: pahami komentar, lapisan penutup, dan batas penyamaran teks. Simpan berkas asli dan periksa hasilnya.',
 'Atur ulang, hapus, atau ekstrak halaman PDF tanpa mengubah urutan baca. Cek nomor halaman dan simpan dokumen asli.',
 'Periksa privasi alat PDF: pemrosesan lokal, skrip eksternal, koneksi jaringan, serta risiko saat membuka dokumen sensitif.',
 'Pahami PDF hasil pindaian, OCR, dan teks yang bisa dipilih. Ketahui kapan ekstraksi berhasil dan cara memeriksa hasilnya.',
 'Edit dokumen Word dengan memperhatikan judul, tabel, font, dan spasi. Periksa format DOCX sebelum membagikan salinan.'
 ],
 tr:[
 'PDF dosyalarına güvenle not ekleyin; görsel kapatma ile gerçek sansürün farkını öğrenin. Orijinali saklayıp çıktıyı denetleyin.',
 'PDF sayfalarını doğru sırayla yeniden düzenleyin, silin veya ayırın. Sayfa numaralarını kontrol edin ve orijinali koruyun.',
 'PDF araçlarının gizliliğini değerlendirin: yerel işleme, dış betikler, ağ istekleri ve hassas dosyaların riskleri.',
 'Taranmış PDF, OCR ve seçilebilir metin arasındaki farkı anlayın. Metin çıkarmanın sınırlarını ve kontrol yöntemlerini öğrenin.',
 'Word belgelerini düzenlerken başlıkları, tabloları, yazı tiplerini ve boşlukları koruyun. İndirilen DOCX dosyasını inceleyin.'
 ],
 zh:[
 '安全批注 PDF：了解注释、视觉遮盖与真正保密涂黑的区别。保留原文件，并检查下载后的副本。',
 '按阅读顺序重新排列、删除或提取 PDF 页面。核对页码和最终文件，并始终保留原件。',
 '评估 PDF 工具的隐私保护：本地处理、第三方脚本、网络请求，以及敏感文件可能面临的风险。',
 '了解扫描版 PDF、OCR 与可选择文本的区别。掌握文本提取的适用条件及结果检查方法。',
 '修改 Word 文档时注意标题、表格、字体和间距。分享前检查导出的 DOCX 排版。'
 ]
};
function escapeAttr(s){return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function replaceMeta(html,by,key,value){
 const find=new RegExp('<meta\\b(?=[^>]*\\b'+by+'=["\\x27]'+key+'["\\x27])[^>]*>','i');
 const match=html.match(find);
 const tag='<meta '+by+'="'+key+'" content="'+escapeAttr(value)+'">';
 return match?html.replace(match[0],tag):html.replace('</head>',tag+'</head>');
}
let count=0;
for(const [lang,entries] of Object.entries(copy)){
 if(entries.length!==routes.length)throw Error('Expected descriptions for each guide: '+lang);
 if(new Set(entries).size!==entries.length)throw Error('Duplicate descriptions provided for '+lang);
 for(let i=0;i<routes.length;i++){
  const file=path.join(root,lang==='en'?'':lang,'guides',routes[i],'index.html');
  if(!fs.existsSync(file))throw Error('Guide missing: '+file);
  let html=fs.readFileSync(file,'utf8');
  html=replaceMeta(html,'name','description',entries[i]);
  html=replaceMeta(html,'property','og:description',entries[i]);
  html=replaceMeta(html,'name','twitter:description',entries[i]);
  fs.writeFileSync(file,html,'utf8');
  count++;
 }
}
if(count!==50)throw Error('Expected 50 localized descriptions, got '+count);
console.log('GUIDE DESCRIPTIONS: distinct, topic-specific metadata updated for '+count+' guide pages.');
module.exports={copy,routes};
