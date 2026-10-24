/* Standardized server-rendered site header for every Docvelio HTML route.
 * Run after the localized-tool generator and operator detail build.
 * No runtime dependency: crawlers and visitors receive the same navigation HTML.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const languages=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const blogLabels={en:'Blog',es:'Blog',fr:'Blog',de:'Blog',pt:'Blog',ar:'المدونة',hi:'ब्लॉग',id:'Blog',tr:'Blog',zh:'博客'};
const languageNames={en:'English',es:'Español',fr:'Français',de:'Deutsch',pt:'Português',ar:'العربية',hi:'हिन्दी',id:'Bahasa Indonesia',tr:'Türkçe',zh:'简体中文'};
const nav={
 en:['Main navigation','All tools','Edit PDF','Word editor','Guides','Start editing','Language','Toggle navigation'],
 es:['Navegación principal','Todas las herramientas','Editar PDF','Editor de Word','Guías','Empezar a editar','Idioma','Abrir menú'],
 fr:['Navigation principale','Tous les outils','Modifier PDF','Éditeur Word','Guides','Commencer à modifier','Langue','Ouvrir le menu'],
 de:['Hauptnavigation','Alle Tools','PDF bearbeiten','Word-Editor','Anleitungen','Jetzt bearbeiten','Sprache','Menü öffnen'],
 pt:['Navegação principal','Todas as ferramentas','Editar PDF','Editor Word','Guias','Começar a editar','Idioma','Abrir menu'],
 ar:['التنقل الرئيسي','جميع الأدوات','تعديل PDF','محرر وورد','الأدلة','ابدأ التحرير','اللغة','فتح القائمة'],
 hi:['मुख्य नेविगेशन','सभी टूल','PDF संपादित करें','Word संपादक','मार्गदर्शिकाएँ','संपादन शुरू करें','भाषा','मेन्यू खोलें'],
 id:['Navigasi utama','Semua alat','Edit PDF','Editor Word','Panduan','Mulai mengedit','Bahasa','Buka menu'],
 tr:['Ana gezinme','Tüm araçlar','PDF düzenle','Word düzenleyici','Kılavuzlar','Düzenlemeye başla','Dil','Menüyü aç'],
 zh:['主导航','全部工具','编辑 PDF','Word 编辑器','使用指南','开始编辑','语言','打开导航菜单']
};
const escapeHtml=str=>String(str).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
function header(locale,route){
 const t=nav[locale],base=locale==='en'?'/':'/'+locale+'/';
 const options=languages.map(code=>'<option value="'+code+'"'+(code===locale?' selected':'')+'>'+escapeHtml(languageNames[code])+'</option>').join('');
 return '<header class="header dv-site-header" data-dv-unified="1"><nav class="container nav dv-site-nav" aria-label="'+escapeHtml(t[0])+'">'+
 '<a class="brand" href="'+base+'" aria-label="Docvelio"><span class="brandmark"><img src="/assets/docvelio-logo-icon.svg" alt="" width="32" height="32"></span><span>Docvelio<span class="branddot">.</span></span></a>'+
 '<div class="links" id="dv-primary-nav">'+
 '<a href="'+base+'#tools">'+escapeHtml(t[1])+'</a>'+
 '<a href="'+base+'tools/edit-pdf/">'+escapeHtml(t[2])+'</a>'+
 '<a class="word-link" href="'+base+'tools/word-editor/">'+escapeHtml(t[3])+'</a>'+
 '<a href="'+base+'guides/">'+escapeHtml(t[4])+'</a>'+
 '<a href="'+base+'blog/">'+escapeHtml(blogLabels[locale])+'</a></div>'+
 '<div class="nav-actions">'+
 '<label class="dv-language-label" for="language-select"><span aria-hidden="true">🌐</span><span class="sr-only">'+escapeHtml(t[6])+'</span>'+
 '<select id="language-select" aria-label="'+escapeHtml(t[6])+'" data-page="'+escapeHtml(route)+'">'+options+'</select></label>'+
 '<a class="nav-start" href="'+base+'tools/word-editor/">'+escapeHtml(t[5])+' <span aria-hidden="true">↗</span></a>'+
 '<button class="mobile-toggle" type="button" aria-label="'+escapeHtml(t[7])+'" aria-expanded="false" aria-controls="dv-primary-nav">☰</button>'+
 '</div></nav></header>';
}
let pages=0;
function walk(dir){
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,ent.name);
  if(ent.isDirectory()){walk(file);continue;}
  if(!ent.name.endsWith('.html'))continue;
  let html=fs.readFileSync(file,'utf8');
  const rel=path.relative(root,file).replaceAll('\\','/');
  const parts=rel.split('/'),locale=languages.includes(parts[0])&&parts[0]!=='en'?parts.shift():'en';
  const route=parts.slice(0,-1).join('/');
  if(!/(\<header\b[^>]*>[\s\S]*?<\/header>)/i.test(html))throw Error('Missing header: '+rel);
  html=html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/i,header(locale,route));
  if(!html.includes('/assets/shared-header.css'))html=html.replace('</head>','<link rel="stylesheet" href="/assets/shared-header.css"></head>');
  fs.writeFileSync(file,html);
  pages++;
 }
}
walk(root);
if(pages<320)throw Error('Expected 320 localized pages after generation, received '+pages);
console.log('Unified navigation for '+pages+' HTML pages across '+languages.length+' languages');
