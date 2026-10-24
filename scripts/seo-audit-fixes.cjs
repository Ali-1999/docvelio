/* Validate site metadata and regenerate multilingual sitemap after the build. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public'),host='https://docvelio.com';
const languages=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const title='Free PDF Editing Tools and Online Word Editor | Docvelio';
const description='Edit PDF pages, merge, split, sign and convert documents online with Docvelio. Use free PDF tools and a Word editor in your browser, with no account needed.';
const intro='<section class="section dv-home-seo" aria-label="Choosing the right PDF and Word tool"><div class="container dv-home-seo-inner">'+
'<h2>Choose the right PDF tool for your document</h2>'+
'<p>To assemble a report, <a href="/tools/merge-pdf/">merge PDF files</a> in reading order. To remove duplicate or unwanted sheets, use <a href="/tools/remove-pages/">Remove Pages</a>. If the pages are out of order, <a href="/tools/organize-pdf/">Organize PDF</a> creates a copy in the sequence you specify, without changing your original.</p>'+
'<h3>Review PDF documents carefully</h3>'+
'<p>Use the <a href="/tools/edit-pdf/">PDF editor</a> to add text notes, drawings and highlights to a proposal or application. These are visual annotations, not direct modifications of the existing paragraph text. Covering text with a white shape is <strong>not secure redaction</strong>. Use appropriate redaction software before sharing confidential documents.</p>'+
'<h3>Convert pages or continue in Word</h3>'+
'<p><a href="/tools/pdf-to-png/">PDF to PNG</a> and <a href="/tools/pdf-to-jpg/">PDF to JPG</a> export images of each page for presentations or quick visual references. This makes text into pixels rather than selectable characters. For editable paragraphs, the <a href="/tools/word-editor/">Word editor</a> opens or creates DOCX documents. Complex layout, fonts and embedded elements may change in an exported file; inspect the results.</p>'+
'<h3>Keep your original files and check the results</h3>'+
'<p>Docvelio processes files locally in the browser for these operations rather than sending document contents to a Docvelio upload server. Third-party content delivery networks may still receive normal connection metadata. Download a separate copy, retain the original and double-check before sending. Read our <a href="/guides/edit-pdf-safely/">PDF editing safety guide</a> and <a href="/guides/privacy/">document privacy checklist</a> for more information.</p></div></section>';
function setMeta(html,kind,key,value){
 const tags=html.match(/<meta\b[^>]*>/gi)||[];
 const match=tags.find(tag=>tag.includes(kind+'="'+key+'"'));
 if(!match)throw Error('Missing '+kind+' '+key);
 const update=match.replace(/\bcontent="[^"]*"/i,'content="'+value+'"');
 if(match===update)throw Error('Missing metadata content: '+key);
 return html.replace(match,update);
}
const files=[];
function walk(dir){
 for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  const name=path.join(dir,item.name);
  if(item.isDirectory())walk(name);
  else if(item.name==='index.html')files.push(name);
 }
}
walk(root);files.sort();
if(files.length!==320)throw Error('Expected 320 index pages; got '+files.length);
for(const file of files){
 const rel=path.relative(root,file).replaceAll('\\','/');
 let html=fs.readFileSync(file,'utf8');
 if(rel==='index.html'){
  html=html.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+title+'</title>');
  html=setMeta(html,'name','description',description);
  html=setMeta(html,'property','og:description',description);
  html=setMeta(html,'property','og:title',title);
  html=html.replace(/Every document\.<br\s*\/?><em>Beautifully simple\.<\/em>/i,'Free PDF tools.<br/><em>Word editing made simple.</em>');
  if(!html.includes('class="section dv-home-seo"'))html=html.replace('<section class="section guide-band">',intro+'<section class="section guide-band">');
  if(!html.includes('/assets/seo-content.css'))html=html.replace('</head>','<link rel="stylesheet" href="/assets/seo-content.css"></head>');
 }
 html=html.replace(/<img\b[^>]*>/gi,tag=>{
  if(/\balt\s*=/i.test(tag))return tag;
  const text=/logo|brand|favicon/i.test(tag)?'Docvelio document logo':/preview|screenshot|editor/i.test(tag)?'Document editor preview':'';
  return tag.replace(/\/?>$/,end=>' alt="'+text+'"'+end);
 });
 fs.writeFileSync(file,html);
}
const groups=new Map(),urls=new Set();
for(const file of files){
 const rel=path.relative(root,file).replaceAll('\\','/'),segments=rel.split('/');
 const lang=languages.includes(segments[0])&&segments[0]!=='en'?segments.shift():'en';
 const route=segments.slice(0,-1).join('/');
 if(!groups.has(route))groups.set(route,new Map());
 groups.get(route).set(lang,host+'/'+rel.replace(/index\.html$/,''));
}
const escapeXml=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
let xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
for(const [route,variants] of [...groups].sort((a,b)=>a[0].localeCompare(b[0]))){
 if(variants.size!==10)throw Error('Missing locale in '+route);
 for(const lang of languages){
  const url=variants.get(lang);
  if(!url||urls.has(url))throw Error('Missing or duplicated sitemap URL '+url);
  urls.add(url);
  xml+='  <url><loc>'+escapeXml(url)+'</loc>';
  for(const locale of languages)xml+='<xhtml:link rel="alternate" hreflang="'+locale+'" href="'+escapeXml(variants.get(locale))+'"/>';
  xml+='<xhtml:link rel="alternate" hreflang="x-default" href="'+escapeXml(variants.get('en'))+'"/></url>\n';
 }
}
xml+='</urlset>\n';
if(urls.size!==320)throw Error('Unexpected sitemap URL count '+urls.size);
fs.writeFileSync(path.join(root,'sitemap.xml'),xml);
fs.writeFileSync(path.join(root,'sitemap.txt'),[...urls].sort().join('\n')+'\n');
fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\n\nSitemap: https://docvelio.com/sitemap.xml\n');
const headers=fs.readFileSync(path.join(root,'_headers'),'utf8');
if(/X-Robots-Tag:\s*noindex/i.test(headers))throw Error('Page indexing is blocked');
fs.writeFileSync(path.join(root,'assets','seo-content.css'),'.dv-home-seo{background:#f7faff;border-block:1px solid #e6edf8}.dv-home-seo-inner{max-width:1000px}.dv-home-seo h2{font-size:clamp(1.5rem,2.6vw,2rem);line-height:1.2;color:#103158;margin:0 0 16px}.dv-home-seo h3{font-size:1.15rem;margin:21px 0 7px;color:#15395f}.dv-home-seo p{color:#45607f;line-height:1.8;margin:0 0 13px;max-width:86ch}.dv-home-seo a{color:#155cc3;text-underline-offset:3px}.dv-home-seo a:focus-visible{outline:3px solid #f3b442;outline-offset:3px}\n');
console.log('SEO CHECK: '+files.length+' pages, '+groups.size+' routes, '+urls.size+' sitemap URLs, homepage metadata and content updated.');
