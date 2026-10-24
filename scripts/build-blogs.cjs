/* Build ten original English PDF blogs and their localized companion pages. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const posts=require('./blog-data-en.cjs');
const localized={...require('./blog-data-locales-a.cjs'),...require('./blog-data-locales-b.cjs')};
const LANGS=['en','es','fr','de','pt','ar','hi','id','tr','zh'],baseUrl='https://docvelio.com';
const words={
 en:['Blog','PDF guides and practical tutorials','Find the right PDF tool and understand what your documents will look like afterward.','Read guide','Choose a task','Explore every topic','Related PDF tools','More articles','Steps you can follow','Important limitations','Frequently asked questions','Start with this tool','More PDF and Word guides','Home','All tools','From Docvelio','Keep your original file and review each download','Key things to remember','Check before sharing'],
 es:['Blog','Guías y tutoriales de PDF','Encuentra herramientas adecuadas y entiende sus límites antes de compartir archivos.','Leer guía','Elegir una tarea','Ver todos los temas','Herramientas PDF relacionadas','Más artículos','Pasos recomendados','Limitaciones importantes','Preguntas frecuentes','Abrir la herramienta','Más guías de PDF y Word','Inicio','Todas las herramientas','De Docvelio','Conserva el original y revisa cada descarga','Puntos importantes','Revisar antes de compartir'],
 fr:['Blog','Guides et conseils PDF','Trouvez les bons outils et vérifiez le résultat avant de partager un document.','Lire le guide','Choisir une tâche','Tous les sujets','Outils PDF associés','Autres articles','Étapes pratiques','Limites importantes','Questions fréquentes','Ouvrir cet outil','Autres guides PDF et Word','Accueil','Tous les outils','Par Docvelio','Gardez l’original et vérifiez chaque copie','À retenir','Vérifier avant de partager'],
 de:['Blog','PDF-Ratgeber und praktische Anleitungen','Finden Sie geeignete PDF-Tools und prüfen Sie die Ergebnisse vor dem Teilen.','Anleitung lesen','Aufgabe auswählen','Alle Themen','Passende PDF-Tools','Weitere Artikel','Empfohlene Schritte','Wichtige Grenzen','Häufige Fragen','Tool öffnen','Weitere PDF- und Word-Ratgeber','Startseite','Alle Tools','Von Docvelio','Original behalten und jeden Download prüfen','Wichtig zu wissen','Vor dem Teilen prüfen'],
 pt:['Blog','Guias e tutoriais de PDF','Escolha uma ferramenta adequada e confira o resultado antes de compartilhar arquivos.','Ler guia','Escolher tarefa','Todos os assuntos','Ferramentas de PDF relacionadas','Mais artigos','Etapas recomendadas','Limitações importantes','Perguntas frequentes','Abrir ferramenta','Mais guias de PDF e Word','Início','Todas as ferramentas','Da Docvelio','Guarde o arquivo original e confira o download','Pontos essenciais','Verifique antes de compartilhar'],
 ar:['المدونة','أدلة PDF ودروس عملية','اختر أداة المستندات المناسبة وتعرّف على حدودها قبل مشاركة الملفات.','اقرأ الدليل','اختر المهمة','جميع المواضيع','أدوات PDF مرتبطة','مقالات أخرى','خطوات عملية','قيود مهمة','أسئلة متكررة','افتح الأداة','أدلة أخرى لملفات PDF وWord','الرئيسية','جميع الأدوات','من Docvelio','احتفظ بالملف الأصلي وافحص كل نسخة','ما يجب تذكره','تحقق قبل المشاركة'],
 hi:['ब्लॉग','PDF गाइड और उपयोगी लेख','सही PDF टूल चुनें और फ़ाइल साझा करने से पहले उसके परिणाम समझें।','गाइड पढ़ें','काम चुनें','सभी विषय','संबंधित PDF टूल','अन्य लेख','सुझाए गए कदम','महत्वपूर्ण सीमाएँ','सामान्य सवाल','टूल खोलें','अधिक PDF और Word गाइड','होम','सभी टूल','Docvelio से','मूल फ़ाइल रखें और डाउनलोड जाँचें','ज़रूरी बातें','शेयर करने से पहले जाँचें'],
 id:['Blog','Panduan dan tutorial PDF','Temukan alat yang sesuai dan periksa hasil dokumen sebelum membagikannya.','Baca panduan','Pilih tugas','Semua topik','Alat PDF terkait','Artikel lain','Langkah praktis','Batasan penting','Pertanyaan umum','Buka alat','Panduan PDF dan Word lain','Beranda','Semua alat','Dari Docvelio','Simpan file asli dan periksa unduhan','Hal penting','Periksa sebelum berbagi'],
 tr:['Blog','PDF rehberleri ve pratik anlatımlar','Uygun PDF aracını seçin ve paylaşmadan önce çıktının ne içerdiğini kontrol edin.','Rehberi oku','Görev seç','Tüm konular','İlgili PDF araçları','Diğer yazılar','Önerilen adımlar','Önemli sınırlamalar','Sık sorulanlar','Aracı aç','Diğer PDF ve Word rehberleri','Ana sayfa','Tüm araçlar','Docvelio’dan','Orijinali saklayıp her indirmeyi kontrol edin','Önemli noktalar','Paylaşmadan önce kontrol edin'],
 zh:['博客','PDF 教程与实用指南','选择合适的 PDF 工具，并在分享文档前检查结果。','阅读指南','选择任务','全部主题','相关 PDF 工具','更多文章','操作步骤','重要限制','常见问题','打开工具','更多 PDF 和 Word 指南','首页','全部工具','来自 Docvelio','保留原文件并检查每次下载','重要提示','分享前检查']
};
if(posts.length!==10||Object.keys(localized).length!==9)throw Error('Expected ten articles and nine locales');
for(const [lang,d] of Object.entries(localized))if(d.posts.length!==10||d.ui.length!==12)throw Error('Incomplete translation '+lang);
const html=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const prefix=l=>l==='en'?'/':'/'+l+'/';
const link=(l,slug)=>prefix(l)+'blog/'+slug+'/';
const routeUrl=(l,slug)=>slug==='blog'?prefix(l)+'blog/':link(l,slug);
function hreflang(slug){
 return LANGS.map(l=>'<link rel="alternate" hreflang="'+l+'" href="'+baseUrl+routeUrl(l,slug)+'">').join('')+
 '<link rel="alternate" hreflang="x-default" href="'+baseUrl+routeUrl('en',slug)+'">';
}
function richJson(o){return JSON.stringify(o).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');}
function head(lang,slug,title,desc,isIndex=false){
 const u=baseUrl+routeUrl(lang,slug),bread=[{'@type':'ListItem',position:1,name:'Docvelio',item:baseUrl+prefix(lang)},{'@type':'ListItem',position:2,name:words[lang][0],item:baseUrl+prefix(lang)+'blog/'}];
 if(!isIndex)bread.push({'@type':'ListItem',position:3,name:title,item:u});
 const graph=[{'@type':'BreadcrumbList',itemListElement:bread}];
 if(isIndex)graph.push({'@type':'CollectionPage',name:title,url:u,inLanguage:lang,description:desc});
 else graph.push({'@type':'BlogPosting',headline:title,description:desc,mainEntityOfPage:u,inLanguage:lang,isPartOf:{'@type':'Blog',name:'Docvelio Blog',url:baseUrl+prefix(lang)+'blog/'},publisher:{'@type':'Organization',name:'Docvelio',url:baseUrl+'/'}});
 const short=desc.length>165?desc.slice(0,162).replace(/\s+\S*$/,'')+'…':desc;
 return '<!doctype html><html lang="'+lang+'"'+(lang==='ar'?' dir="rtl"':'')+'><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="theme-color" content="#2463eb"><title>'+html(title)+' | Docvelio</title>'+
 '<meta name="description" content="'+html(short)+'"><link rel="canonical" href="'+u+'">'+hreflang(slug)+
 '<meta property="og:type" content="article"><meta property="og:title" content="'+html(title)+'">'+
 '<meta property="og:description" content="'+html(short)+'"><meta property="og:url" content="'+u+'">'+
 '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">'+
 '<link rel="stylesheet" href="/assets/style.css"><link rel="stylesheet" href="/assets/locales.css">'+
 '<link rel="stylesheet" href="/assets/blog.css"><script defer src="/assets/i18n.js"></script>'+
 '<script defer src="/assets/site.js"></script><script type="application/ld+json">'+richJson({'@context':'https://schema.org','@graph':graph})+'</script>'+
 '</head><body><a class="skip" href="#content">Skip to content</a>'+
 '<header class="header"><nav class="container nav" aria-label="Docvelio"><a class="brand" href="'+prefix(lang)+'">Docvelio</a></nav></header>';
}
function footer(lang){
 const root=prefix(lang),w=words[lang];return '<footer class="footer"><div class="container footgrid"><div><a class="foot-brand" href="'+root+'">Docvelio</a><p class="mini">'+html(w[15])+' · Ali Hamza · Riyadh, Saudi Arabia<br><a href="mailto:alihamzasbr@gmail.com">alihamzasbr@gmail.com</a></p></div><div><a href="'+root+'privacy/">'+html(lang==='en'?'Privacy':lang==='ar'?'الخصوصية':lang==='zh'?'隐私政策':'Privacy')+'</a> <a href="'+root+'contact/">Contact</a></div></div></footer></body></html>';
}
function related(lang,item,currentIndex){
 const w=words[lang],idxs=[(currentIndex+1)%10,(currentIndex+4)%10];
 const relatedPosts=idxs.map(idx=>'<a class="dv-blog-related-card" href="'+link(lang,posts[idx].slug)+'"><span class="dv-blog-card-category">PDF GUIDE</span><strong>'+html(lang==='en'?posts[idx].title:localized[lang].posts[idx][0])+'</strong><span aria-hidden="true">↗</span></a>').join('');
 const tools=[item.tool,...item.related];
 const toolLinks=tools.map(slug=>'<a class="dv-blog-tool-link" href="'+prefix(lang)+'tools/'+slug+'/">'+html(slug.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' <span aria-hidden="true">↗</span></a>').join('');
 return '<section class="dv-blog-related"><h2>'+html(w[6])+'</h2><div class="dv-blog-tool-links">'+toolLinks+'</div><h2>'+html(w[7])+'</h2><div class="dv-blog-related-grid">'+relatedPosts+'</div></section>';
}
function bodyEnglish(item,idx){
 const w=words.en;const paras=item.sections.map(([heading,p])=>'<section class="dv-blog-section"><h2>'+html(heading)+'</h2><p>'+html(p)+'</p></section>').join('');
 const steps='<section class="dv-blog-steps"><h2>'+w[8]+'</h2><ol>'+item.steps.map(s=>'<li>'+html(s)+'</li>').join('')+'</ol></section>';
 const faq='<section class="dv-blog-faq"><h2>'+w[10]+'</h2>'+item.faq.map(([q,a])=>'<h3>'+html(q)+'</h3><p>'+html(a)+'</p>').join('')+'</section>';
 return paras+steps+faq;
}
function bodyLocalized(lang,item,idx){
 const w=words[lang],tr=localized[lang].posts[idx],uses=tr[2],limits=tr[3];
 // A translated, task-specific workflow and source-supported limits, with no claims
 // of OCR, certified signatures or text-preserving raster compression.
 const pointers=[
  [w[10],tr[1]],
  [w[8],uses],
  [w[9],limits]
 ];
 const tasks='<section class="dv-blog-steps"><h2>'+html(w[8])+'</h2><ol>'+
  '<li>'+html(tr[1])+'</li>'+
  '<li>'+html(uses)+'</li>'+
  '<li>'+html(limits)+'</li></ol></section>';
 return '<section class="dv-blog-section"><h2>'+html(w[14])+'</h2><p>'+html(uses)+'</p></section>'+
 tasks+'<section class="dv-blog-section"><h2>'+html(w[9])+'</h2><p>'+html(limits)+'</p><p>'+html(w[16])+'. '+html(w[18])+'.</p></section>'+
 '<section class="dv-blog-faq"><h2>'+html(w[10])+'</h2><h3>'+html(w[11])+'?</h3><p>'+html(tr[1])+' '+html(limits)+'</p></section>';
}
function blogPage(lang,item,idx){
 const tr=lang==='en'?null:localized[lang].posts[idx],title=tr?tr[0]:item.title,desc=tr?tr[1]:item.summary,w=words[lang];
 const breadcrumb='<nav class="dv-blog-crumb" aria-label="Breadcrumb"><a href="'+prefix(lang)+'">'+html(w[13])+'</a><span>/</span><a href="'+prefix(lang)+'blog/">'+html(w[0])+'</a><span>/</span><span>'+html(title)+'</span></nav>';
 const toolUrl=prefix(lang)+'tools/'+item.tool+'/';
 const main='<main id="content"><section class="dv-blog-hero"><div class="container dv-blog-container">'+breadcrumb+
 '<div class="dv-blog-kicker">'+html(w[0])+' · PDF</div><h1>'+html(title)+'</h1><p class="dv-blog-description">'+html(desc)+'</p>'+
 '<p class="dv-blog-byline">'+html(w[15])+' · <a href="'+prefix(lang)+'about/">Docvelio</a> · <a href="'+prefix(lang)+'contact/">alihamzasbr@gmail.com</a></p>'+
 '<a class="dv-blog-cta" href="'+toolUrl+'">'+html(w[11])+' <span aria-hidden="true">↗</span></a></div></section>'+
 '<section class="dv-blog-body"><div class="container dv-blog-container"><article class="dv-blog-article">'+
 (lang==='en'?bodyEnglish(item,idx):bodyLocalized(lang,item,idx))+
 '<p class="dv-blog-final-note"><strong>'+html(w[18])+'</strong>: '+html(w[16])+'.</p>'+
 related(lang,item,idx)+'</article></div></section></main>';
 return head(lang,item.slug,title,desc)+main+footer(lang);
}
function blogIndex(lang){
 const w=words[lang],title=w[1],desc=w[2],items=posts.map((a,i)=>{
  const tr=lang==='en'?null:localized[lang].posts[i];
  return '<article class="dv-blog-card"><span class="dv-blog-card-category">PDF · '+html(a.keyword)+'</span><h2><a href="'+link(lang,a.slug)+'">'+html(tr?tr[0]:a.title)+'</a></h2>'+
  '<p>'+html(tr?tr[1]:a.summary)+'</p><a class="dv-blog-read" href="'+link(lang,a.slug)+'">'+html(w[3])+' ↗</a></article>';
 }).join('');
 const main='<main id="content"><section class="dv-blog-index-hero"><div class="container"><p class="dv-blog-kicker">DOCVELIO · '+html(w[0])+'</p><h1>'+html(title)+'</h1><p class="dv-blog-description">'+html(desc)+'</p><a href="'+prefix(lang)+'#tools">'+html(w[14])+' ↗</a></div></section>'+
 '<section class="dv-blog-list"><div class="container"><div class="dv-blog-grid">'+items+'</div></div></section></main>';
 return head(lang,'blog',title,desc,true)+main+footer(lang);
}
function discovery(lang){
 const w=words[lang],selected=[0,1,3,4,6,8],cols=selected.map(i=>{
  const title=lang==='en'?posts[i].title:localized[lang].posts[i][0];
  return '<a class="dv-blog-discovery-item" href="'+link(lang,posts[i].slug)+'"><span>PDF</span><strong>'+html(title)+'</strong><span aria-hidden="true">↗</span></a>';
 }).join('');
 return '<section class="dv-blog-discovery"><div class="container"><div class="dv-blog-discovery-top"><div><span class="dv-blog-kicker">DOCVELIO · '+html(w[0])+'</span><h2>'+html(w[1])+'</h2><p>'+html(w[2])+'</p></div><a href="'+prefix(lang)+'blog/">'+html(w[5])+' ↗</a></div><div class="dv-blog-discovery-grid">'+cols+'</div></div></section>';
}
let generated=0;
for(const lang of LANGS){
 for(let i=0;i<posts.length;i++){
  const target=path.join(root,lang==='en'?'':lang,'blog',posts[i].slug,'index.html');
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,blogPage(lang,posts[i],i));generated++;
 }
 const listing=path.join(root,lang==='en'?'':lang,'blog','index.html');fs.mkdirSync(path.dirname(listing),{recursive:true});
 fs.writeFileSync(listing,blogIndex(lang));generated++;
 for(const page of ['index.html','guides/index.html']){
  const target=path.join(root,lang==='en'?'':lang,page);
  let existing=fs.readFileSync(target,'utf8');
  existing=existing.replace(/<!-- DV_BLOG_DISCOVERY_START -->[\s\S]*?<!-- DV_BLOG_DISCOVERY_END -->/g,'');
  if(!existing.includes('</main>'))throw Error('Cannot insert blogs before end of main: '+target);
  existing=existing.replace('</main>','<!-- DV_BLOG_DISCOVERY_START -->'+discovery(lang)+'<!-- DV_BLOG_DISCOVERY_END --></main>');
  if(!existing.includes('/assets/blog.css'))existing=existing.replace('</head>','<link rel="stylesheet" href="/assets/blog.css"></head>');
  fs.writeFileSync(target,existing);
 }
}
if(generated!==110)throw Error('Incorrect generated blog page count: '+generated);
console.log('BLOG BUILD: '+generated+' localized pages (10 topics + listing per language), linked from each homepage and guide index.');
