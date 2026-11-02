/* Responsive, localized homepage tool discovery.
 * Preserves existing tool links, card search/filter selectors and SEO sections.
 * Run after all tool builders, including the Excel Formula Generator.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../public');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const copy={
 en:{k:'A BETTER WAY TO GET THINGS DONE',h:'Find the right tool. Finish the task.',s:'PDFs, images, Word files and calculations. Pick your task and get straight to work.',search:'Search tools, formats or tasks…',featured:'Start with these favourites',browse:'Browse every tool',tabs:['All tools','PDF','Word','Images','Calculators','More'],open:'Open tool',count:'tools available',empty:'No tools found. Try another keyword or category.',bottom:'Choose a tool based on the result you need. Keep your original file and review the output.',guide:'Explore helpful guides',spot:['Annotate PDF pages with text notes, drawings and highlights.','Resize, crop and convert images in your browser.','Describe a spreadsheet calculation and copy an Excel formula.'],extras:['Image Studio','Resize Image','Convert Image','Reduce Image Size','CBM Calculator','Volumetric Weight','Excel Formula Generator','Spin the Wheel'],detail:['Edit and export pictures in your browser.','Set new image dimensions with aspect-ratio options.','Convert between supported image formats.','Try a smaller JPG or WebP file size.','Calculate shipment volume from carton dimensions.','Estimate dimensional shipping weight.','Get a formula from a written spreadsheet instruction.','Make a random choice using a spinning wheel.']},
 es:{k:'HERRAMIENTAS PARA CADA TAREA',h:'Encuentra la herramienta ideal.',s:'PDF, imágenes, Word y cálculos. Elige una tarea y empieza.',search:'Buscar herramientas o tareas…',featured:'Empieza con estas opciones',browse:'Explorar herramientas',tabs:['Todas','PDF','Word','Imágenes','Calculadoras','Más'],open:'Abrir herramienta',count:'herramientas disponibles',empty:'No hay resultados. Prueba otra búsqueda.',bottom:'Elige la herramienta adecuada, guarda el archivo original y revisa el resultado.',guide:'Ver guías',spot:['Añade notas, dibujos y resaltados a tus PDF.','Cambia el tamaño, recorta y convierte imágenes.','Describe un cálculo y copia una fórmula de Excel.'],extras:['Editor de imágenes','Cambiar tamaño','Convertir imagen','Reducir tamaño de imagen','Calculadora CBM','Peso volumétrico','Generador de fórmulas Excel','Ruleta de nombres'],detail:['Edita y exporta imágenes.','Ajusta las dimensiones.','Convierte formatos compatibles.','Reduce el tamaño de JPG o WebP.','Calcula el volumen de una carga.','Estima el peso dimensional.','Crea fórmulas a partir de texto.','Elige una opción al azar.']},
 fr:{k:'DES OUTILS POUR VOS TÂCHES',h:'Le bon outil pour chaque tâche.',s:'PDF, images, Word et calculs. Choisissez ce qu’il vous faut.',search:'Rechercher un outil ou une tâche…',featured:'Pour commencer',browse:'Tous les outils',tabs:['Tous','PDF','Word','Images','Calculateurs','Plus'],open:'Ouvrir l’outil',count:'outils disponibles',empty:'Aucun outil trouvé. Essayez une autre recherche.',bottom:'Gardez votre fichier d’origine et vérifiez le résultat.',guide:'Voir les guides',spot:['Ajoutez des notes et des surlignages aux PDF.','Redimensionnez, rognez et convertissez vos images.','Décrivez un calcul pour obtenir une formule Excel.'],extras:['Studio image','Redimensionner','Convertir une image','Réduire la taille','Calculateur CBM','Poids volumétrique','Générateur de formule Excel','Roue aléatoire'],detail:['Modifiez et exportez vos images.','Modifiez les dimensions.','Convertissez les formats pris en charge.','Réduisez la taille JPG ou WebP.','Calculez le volume du fret.','Estimez le poids dimensionnel.','Créez une formule depuis une consigne.','Choisissez au hasard.']},
 de:{k:'WERKZEUGE FÜR IHREN ALLTAG',h:'Das richtige Tool für jede Aufgabe.',s:'PDF, Bilder, Word und Berechnungen. Wählen Sie Ihre Aufgabe.',search:'Tools oder Aufgaben suchen…',featured:'Besonders praktisch',browse:'Alle Tools entdecken',tabs:['Alle','PDF','Word','Bilder','Rechner','Mehr'],open:'Tool öffnen',count:'Tools verfügbar',empty:'Keine Tools gefunden. Versuchen Sie einen anderen Suchbegriff.',bottom:'Bewahren Sie die Originaldatei auf und prüfen Sie das Ergebnis.',guide:'Ratgeber ansehen',spot:['PDFs mit Notizen, Zeichnungen und Markierungen ergänzen.','Bilder skalieren, zuschneiden und konvertieren.','Excel-Berechnungen beschreiben und Formeln kopieren.'],extras:['Bildstudio','Bildgröße ändern','Bild konvertieren','Dateigröße reduzieren','CBM-Rechner','Volumengewicht','Excel-Formelgenerator','Glücksrad'],detail:['Bilder im Browser bearbeiten.','Bildabmessungen anpassen.','Unterstützte Formate wechseln.','JPG oder WebP verkleinern.','Frachtvolumen berechnen.','Volumengewicht schätzen.','Formeln aus Text erstellen.','Zufällig auswählen.']},
 pt:{k:'FERRAMENTAS PARA O SEU DIA',h:'A ferramenta certa para cada tarefa.',s:'PDF, imagens, Word e cálculos. Encontre o que precisa.',search:'Pesquisar ferramentas ou tarefas…',featured:'Para começar',browse:'Explorar ferramentas',tabs:['Todas','PDF','Word','Imagens','Calculadoras','Mais'],open:'Abrir ferramenta',count:'ferramentas disponíveis',empty:'Nenhuma ferramenta encontrada. Tente outra pesquisa.',bottom:'Guarde o arquivo original e confira o resultado.',guide:'Ver guias',spot:['Adicione notas, desenhos e destaques em PDF.','Redimensione, recorte e converta imagens.','Descreva um cálculo e copie uma fórmula do Excel.'],extras:['Editor de imagens','Redimensionar imagem','Converter imagem','Reduzir tamanho','Calculadora CBM','Peso volumétrico','Gerador de fórmulas Excel','Roleta de nomes'],detail:['Edite e exporte imagens.','Ajuste as dimensões.','Converta formatos compatíveis.','Reduza arquivos JPG ou WebP.','Calcule o volume da carga.','Estime o peso dimensional.','Crie fórmulas a partir de texto.','Escolha uma opção aleatória.']},
 ar:{k:'أدوات لجميع مهامك',h:'اختر الأداة المناسبة وأنجز عملك.',s:'ملفات PDF والصور وWord والحاسبات في مكان واحد.',search:'ابحث عن أداة أو مهمة…',featured:'ابدأ بالأدوات المميزة',browse:'تصفح جميع الأدوات',tabs:['الكل','PDF','Word','الصور','الحاسبات','المزيد'],open:'فتح الأداة',count:'أداة متاحة',empty:'لا توجد نتائج. جرّب كلمة أخرى.',bottom:'احتفظ بالملف الأصلي وراجع النتيجة قبل مشاركتها.',guide:'استعرض الأدلة',spot:['أضف الملاحظات والرسومات والتظليل إلى PDF.','غيّر حجم الصور واقصصها وحوّل صيغها.','صِف عملية حسابية واحصل على صيغة Excel.'],extras:['محرر الصور','تغيير حجم الصور','تحويل الصور','تقليل حجم الصور','حاسبة CBM','الوزن الحجمي','منشئ صيغ Excel','عجلة الأسماء'],detail:['حرّر الصور وصدّرها.','اضبط أبعاد الصور.','حوّل بين الصيغ المدعومة.','قلل حجم JPG أو WebP.','احسب حجم الشحنة.','قدّر الوزن الحجمي.','أنشئ صيغة من وصف نصي.','اختر عشوائياً.']},
 hi:{k:'हर काम के लिए सही टूल',h:'सही टूल चुनें, काम पूरा करें।',s:'PDF, इमेज, Word और कैलकुलेटर एक ही जगह।',search:'टूल या काम खोजें…',featured:'लोकप्रिय टूल से शुरुआत करें',browse:'सभी टूल देखें',tabs:['सभी','PDF','Word','इमेज','कैलकुलेटर','अन्य'],open:'टूल खोलें',count:'टूल उपलब्ध',empty:'कोई टूल नहीं मिला। दूसरा शब्द आज़माएँ।',bottom:'मूल फ़ाइल सुरक्षित रखें और नतीजा जाँचें।',guide:'गाइड देखें',spot:['PDF में नोट्स और हाइलाइट जोड़ें।','इमेज का आकार बदलें, क्रॉप और कन्वर्ट करें।','अपना हिसाब लिखें और Excel फ़ॉर्मूला पाएँ।'],extras:['इमेज स्टूडियो','इमेज रीसाइज़','इमेज कन्वर्ट','इमेज साइज़ कम करें','CBM कैलकुलेटर','वॉल्यूमेट्रिक वज़न','Excel फ़ॉर्मूला जनरेटर','स्पिन व्हील'],detail:['इमेज संपादित करें।','आकार बदलें।','समर्थित फ़ॉर्मैट बदलें।','JPG या WebP छोटा करें।','शिपमेंट का वॉल्यूम निकालें।','वज़न का अनुमान लगाएँ।','विवरण से फ़ॉर्मूला बनाएँ।','यादृच्छिक चयन करें।']},
 id:{k:'ALAT UNTUK SETIAP TUGAS',h:'Temukan alat yang tepat.',s:'PDF, gambar, Word, dan kalkulator dalam satu tempat.',search:'Cari alat atau tugas…',featured:'Mulai dari alat pilihan',browse:'Jelajahi semua alat',tabs:['Semua','PDF','Word','Gambar','Kalkulator','Lainnya'],open:'Buka alat',count:'alat tersedia',empty:'Tidak ada alat yang cocok. Coba kata lain.',bottom:'Simpan file asli dan periksa hasilnya.',guide:'Lihat panduan',spot:['Tambahkan catatan dan sorotan pada PDF.','Ubah ukuran, potong, dan konversi gambar.','Jelaskan perhitungan untuk memperoleh rumus Excel.'],extras:['Studio Gambar','Ubah Ukuran Gambar','Konversi Gambar','Perkecil Ukuran','Kalkulator CBM','Berat Volumetrik','Generator Rumus Excel','Roda Nama'],detail:['Edit dan ekspor gambar.','Atur ukuran gambar.','Konversi format yang didukung.','Perkecil JPG atau WebP.','Hitung volume kiriman.','Perkirakan berat dimensi.','Buat rumus dari instruksi.','Pilih secara acak.']},
 tr:{k:'HER GÖREV İÇİN ARAÇLAR',h:'Doğru aracı bulun, işi bitirin.',s:'PDF, görsel, Word ve hesaplayıcı araçları bir arada.',search:'Araç veya görev ara…',featured:'Öne çıkan araçlar',browse:'Tüm araçlara göz at',tabs:['Tümü','PDF','Word','Görseller','Hesaplayıcılar','Diğer'],open:'Aracı aç',count:'araç mevcut',empty:'Eşleşen araç bulunamadı. Başka bir arama deneyin.',bottom:'Orijinal dosyayı saklayın ve sonucu kontrol edin.',guide:'Rehberlere bak',spot:['PDF sayfalarına not, çizim ve vurgu ekleyin.','Görselleri yeniden boyutlandırın ve dönüştürün.','Hesabı tarif edin, Excel formülünü kopyalayın.'],extras:['Görsel Stüdyosu','Görsel Boyutlandır','Görsel Dönüştür','Dosya Boyutu Küçült','CBM Hesaplayıcı','Hacimsel Ağırlık','Excel Formül Oluşturucu','İsim Çarkı'],detail:['Görsel düzenleyin.','Boyutları ayarlayın.','Desteklenen biçimleri dönüştürün.','JPG veya WebP küçültün.','Kargo hacmini hesaplayın.','Hacimsel ağırlığı tahmin edin.','Metinden formül oluşturun.','Rastgele seçim yapın.']},
 zh:{k:'为每项任务找到工具',h:'找到合适工具，快速完成任务。',s:'PDF、图片、Word 和计算工具，都在这里。',search:'搜索工具或任务…',featured:'从精选工具开始',browse:'浏览全部工具',tabs:['全部','PDF','Word','图片','计算器','更多'],open:'打开工具',count:'个工具可用',empty:'没有找到匹配的工具，请更换关键词。',bottom:'保留原始文件，并在分享前检查结果。',guide:'查看指南',spot:['为 PDF 页面添加文字批注、绘图和高亮。','调整图片大小、裁剪并转换格式。','描述计算需求并复制 Excel 公式。'],extras:['图片工作室','调整图片大小','图片格式转换','压缩图片大小','CBM 计算器','体积重量计算器','Excel 公式生成器','随机转盘'],detail:['编辑并导出图片。','设置新的图片尺寸。','转换受支持的格式。','缩小 JPG 或 WebP 文件。','计算货物体积。','估算体积重量。','根据文字描述生成公式。','随机选择选项。']}
};
const extras=[
 ['image-editor','image','▧',0],
 ['image-tools/resize-image','image','⇲',1],
 ['image-tools/convert-image','image','⇄',2],
 ['image-tools/reduce-image-size-kb','image','↓',3],
 ['cbm-calculator','calculators','㎥',4],
 ['shipping-tools/volumetric-weight-calculator','calculators','◫',5],
 ['excel-formula-generator','calculators','ƒ',6],
 ['wheel-of-names','more','◉',7]
];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const noTags=s=>String(s).replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
const cats=['all','pdf','word','image','calculators','more'];
function hrefFor(lang,route){
 const localized='/'+(lang==='en'?'':lang+'/')+route+'/';
 if(fs.existsSync(path.join(root,localized.slice(1),'index.html')))return localized;
 const english='/'+route+'/';
 if(fs.existsSync(path.join(root,english.slice(1),'index.html')))return english;
 throw Error('Tool route does not exist: '+route+' for '+lang);
}
function attr(markup,name){return markup.match(new RegExp('(?:^|\\s)'+name+'="([^"]*)"','i'))?.[1]||'';}
function newCard(lang,t){
 const d=copy[lang],route=t[0],category=t[1],glyph=t[2],idx=t[3];
 const url=hrefFor(lang,route),name=d.extras[idx],desc=d.detail[idx];
 return '<a class="tool-card dv-toolkit-card" data-category="'+category+'" data-title="'+esc(name+' '+route.split('/').pop().replaceAll('-',' '))+'" href="'+url+'">'+
  '<div class="tool-card-top"><span class="tool-icon dv-icon-'+category+'" aria-hidden="true">'+esc(glyph)+'</span><span class="dv-card-type">'+esc(d.tabs[cats.indexOf(category)])+'</span></div>'+
  '<h3>'+esc(name)+' <span class="card-arrow" aria-hidden="true">↗</span></h3>'+
  '<p>'+esc(desc)+'</p><span class="dv-card-foot">'+esc(d.open)+' ↗</span></a>';
}
function existingCards(section,lang){
 const gridStart=section.indexOf('id="tool-grid"');
 if(gridStart<0)throw Error('Original tool grid missing for '+lang);
 const end=section.indexOf('id="empty-tools"',gridStart);
 if(end<0)throw Error('Original empty results marker missing for '+lang);
 const raw=section.slice(gridStart,end);
 const cards=raw.match(/<a\b[^>]*class="[^"]*\btool-card\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi)||[];
 if(cards.length<17)throw Error('Expected at least 17 existing tool cards for '+lang+', found '+cards.length);
 return cards.map(card=>{
  const head=card.slice(0,card.indexOf('>')+1),url=attr(head,'href');
  if(!url)throw Error('Missing href on tool card '+lang);
  const cat=attr(head,'data-category')||'pdf';
  return {url,cat,markup:card.replace(/class="tool-card"/,'class="tool-card dv-toolkit-card"').replace(/<\/a>$/,'<span class="dv-card-foot">'+esc(copy[lang].open)+' ↗</span></a>')};
 });
}
function spotlight(lang,route,kind,label,desc,glyph){
 const d=copy[lang],href=hrefFor(lang,route);
 const title=label;
 const theme=kind==='pdf'?'blue':kind==='image'?'mint':'violet';
 return '<a class="dv-spotlight-card dv-spotlight-'+theme+'" href="'+href+'">'+
 '<div class="dv-spotlight-top"><span class="dv-spotlight-category">'+esc(d.tabs[cats.indexOf(kind)])+'</span><span class="dv-spotlight-glyph" aria-hidden="true">'+esc(glyph)+'</span></div>'+
 '<div><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p><span class="dv-spotlight-action">'+esc(d.open)+' <span aria-hidden="true">↗</span></span></div></a>';
}
let updated=0,already=0,allCards=0;
for(const lang of langs){
 const file=path.join(root,lang==='en'?'':lang,'index.html');
 let html=fs.readFileSync(file,'utf8');
 const start=html.indexOf('<section class="section tools-section" id="tools">');
 const previous=html.indexOf('<section class="section dv-home-toolkit" id="tools"');
 if(start<0&&previous>=0){already++;console.log('Home toolkit already redesigned: '+lang);continue;}
 if(start<0)throw Error('Tool section anchor not found for '+lang);
 const end=html.indexOf('</section>',start);
 if(end<0)throw Error('Tool section close not found for '+lang);
 const old=html.slice(start,end+10),base=existingCards(old,lang);
 const seen=new Set(base.map(c=>c.url));
 const extrasCards=[];
 for(const t of extras){const url=hrefFor(lang,t[0]);if(seen.has(url))continue;seen.add(url);extrasCards.push({url,cat:t[1],markup:newCard(lang,t)});}
 const all=base.concat(extrasCards);
 const counts={all:all.length,pdf:0,word:0,image:0,calculators:0,more:0};
 for(const c of all){if(!(c.cat in counts))throw Error('Unknown category '+c.cat);counts[c.cat]++;}
 const d=copy[lang];
 const spotlightCards=[
  spotlight(lang,'tools/edit-pdf','pdf',lang==='en'?'Edit PDF':noTags((base.find(x=>x.url===hrefFor(lang,'tools/edit-pdf'))?.markup||'').match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1]||'Edit PDF').replace('↗','').trim(),d.spot[0],'✎'),
  spotlight(lang,'image-editor','image',d.extras[0],d.spot[1],'▧'),
  spotlight(lang,'excel-formula-generator','calculators',d.extras[6],d.spot[2],'ƒ')
 ].join('');
 const tabs=cats.map((cat,i)=>'<button class="filter'+(cat==='all'?' active':'')+'" type="button" data-filter="'+cat+'" aria-pressed="'+(cat==='all'?'true':'false')+'">'+esc(d.tabs[i])+' <span>'+counts[cat]+'</span></button>').join('');
 const searchIcon='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.7" cy="10.7" r="6.4"/><path d="m16 16 4.5 4.5"/></svg>';
 const section='<section class="section dv-home-toolkit" id="tools" data-dv-home-tools="v2" aria-labelledby="dv-tools-heading"><div class="container dv-toolkit-shell">'+
 '<div class="dv-toolkit-header"><div><span class="dv-toolkit-kicker">'+esc(d.k)+'</span><h2 id="dv-tools-heading">'+esc(d.h)+'</h2><p class="dv-toolkit-summary">'+esc(d.s)+'</p></div>'+
 '<label class="dv-toolkit-search" for="tool-search">'+searchIcon+'<input id="tool-search" type="search" autocomplete="off" placeholder="'+esc(d.search)+'" aria-label="'+esc(d.search)+'"></label></div>'+
 '<div class="dv-toolkit-featured-label" id="dv-toolkit-featured-label">'+esc(d.featured)+'</div>'+
 '<div class="dv-toolkit-spotlight" id="dv-toolkit-spotlight">'+spotlightCards+'</div>'+
 '<div class="dv-toolkit-featured-label">'+esc(d.browse)+'</div>'+
 '<div class="dv-toolkit-controls"><div class="filter-tabs" role="group" aria-label="'+esc(d.browse)+'">'+tabs+'</div>'+
 '<span class="dv-toolkit-count" id="dv-toolkit-visible-count" data-count-label="'+esc(d.count)+'" role="status" aria-live="polite">'+counts.all+' '+esc(d.count)+'</span></div>'+
 '<div class="grid tool-grid" id="tool-grid">'+all.map(c=>c.markup).join('\n')+'</div>'+
 '<p class="dv-toolkit-empty empty-tools" hidden id="empty-tools">'+esc(d.empty)+'</p>'+
 '<div class="dv-toolkit-bottom"><p>'+esc(d.bottom)+'</p><a href="'+(lang==='en'?'/':'/'+lang+'/')+'guides/">'+esc(d.guide)+' ↗</a></div>'+
 '</div></section>';
 html=html.slice(0,start)+section+html.slice(end+10);
 if(!html.includes('href="/assets/home-toolkit-v2.css"'))html=html.replace('</head>','<link rel="stylesheet" href="/assets/home-toolkit-v2.css"></head>');
 fs.writeFileSync(file,html);updated++;allCards+=all.length;
 console.log('HOME TOOLKIT: '+lang+' '+all.length+' tools');
}
if(updated+already!==10)throw Error('Expected 10 localized homepages, found '+(updated+already));
console.log('HOME TOOLKIT: redesigned '+updated+' localized homepages with '+allCards+' total card instances.');
