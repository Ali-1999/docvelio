/* Validate site metadata and regenerate multilingual sitemap after the build. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public'),host='https://docvelio.com';
const languages=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const title='Free PDF Tools, Word Editor &amp; Image Tools | Docvelio';
const description='Edit, merge, split, sign and convert PDF files online. Use Docvelio for free Word editing, image tools and shipping calculators in your browser.';
const intro = [
'<section class="section dv-home-seo" aria-labelledby="dv-home-seo-heading"><div class="container dv-home-seo-inner">',
'<h2 id="dv-home-seo-heading">What is Docvelio?</h2>',
'<p>Docvelio is a browser-based toolkit for PDF and Word editing, image tasks and practical calculators. Choose a tool for the result you need, follow its input guidance and inspect the exported file before sharing or printing.</p>',
'<h3>Choose a tool by task</h3>',
'<div class="dv-home-table-wrap" role="region" aria-label="Docvelio tools by task" tabindex="0"><table class="dv-home-task-table"><caption>Common tasks and the Docvelio tools that can help</caption><thead><tr><th scope="col">Your task</th><th scope="col">Tool</th><th scope="col">What it produces</th></tr></thead><tbody>',
'<tr><th scope="row">Combine PDF files</th><td><a href="/tools/merge-pdf/">Merge PDF</a></td><td>One PDF in the selected order</td></tr>',
'<tr><th scope="row">Edit a Word document</th><td><a href="/tools/word-editor/">Word Editor</a></td><td>A downloadable DOCX copy</td></tr>',
'<tr><th scope="row">Resize a photograph</th><td><a href="/image-tools/resize-image/">Resize Image</a></td><td>An image at the dimensions you choose</td></tr>',
'<tr><th scope="row">Prepare A4 or A3 artwork</th><td><a href="/image-tools/a4-a3-dpi-pixel-calculator/">A4/A3 DPI Calculator</a></td><td>Pixel dimensions for the selected print resolution</td></tr>',
'<tr><th scope="row">Create an invoice payment QR</th><td><a href="/calculators/sepa-qr-code-generator/">SEPA Payment QR</a></td><td>EPC payment data encoded in a QR code</td></tr>',
'<tr><th scope="row">Build an Excel calculation</th><td><a href="/excel-formula-generator/">Excel Formula Generator</a></td><td>A copyable formula with an explanation</td></tr>',
'</tbody></table></div>',
'<h3>Before sharing or printing</h3>',
'<ul><li>Keep an untouched copy of the original file.</li><li>Check page order, text, image dimensions and the downloaded result.</li><li>PDF annotations are not secure redaction; calculator outputs are estimates, not safety or loading guarantees.</li></ul>',
'<h3>Review PDF documents carefully</h3>',
'<p>Use the <a href="/tools/edit-pdf/">PDF editor</a> to add text notes, drawings and highlights to a proposal or application. These are visual annotations, not direct modifications of the existing paragraph text. Covering text with a white shape is <strong>not secure redaction</strong>. Use appropriate redaction software before sharing confidential documents.</p>',
'<h3>Convert pages or continue in Word</h3>',
'<p><a href="/tools/pdf-to-png/">PDF to PNG</a> and <a href="/tools/pdf-to-jpg/">PDF to JPG</a> export images of each page for presentations or quick visual references. This makes text into pixels rather than selectable characters. For editable paragraphs, the <a href="/tools/word-editor/">Word editor</a> opens or creates DOCX documents. Complex layout, fonts and embedded elements may change in an exported file; inspect the results.</p>',
'<h3>Keep your original files and check the results</h3>',
'<p>Docvelio processes files locally in the browser for these operations rather than sending document contents to a Docvelio upload server. Third-party content delivery networks may still receive normal connection metadata. Download a separate copy, retain the original and double-check before sending. Read our <a href="/guides/edit-pdf-safely/">PDF editing safety guide</a> and <a href="/guides/privacy/">document privacy checklist</a> for more information.</p>',
'</div></section>'
].join('');
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
if(files.length<430)throw Error('Expected at least 430 localized pages including blogs; got '+files.length);
for(const file of files){
 const rel=path.relative(root,file).replaceAll('\\','/');
 let html=fs.readFileSync(file,'utf8');
 if(rel==='index.html'){
  html=html.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+title+'</title>');
  html=setMeta(html,'name','description',description);
  html=setMeta(html,'property','og:description',description);
  html=setMeta(html,'property','og:title',title);
  html=html.replace(/Every document\.<br\s*\/?><em>Beautifully simple\.<\/em>/i,'Free PDF, Word &amp; image tools.<br/><em>Simple tools for everyday tasks.</em>');
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
/* Google Search Central: include only self-canonical, indexable HTML URLs.
 * Omit lastmod without trustworthy per-URL modification history, and do not
 * invent priority or changefreq (Google ignores both).
 */
const groups=new Map(),urls=new Set();
const canonicalFor=(html,relative)=>{
 const tags=html.match(/<link\b[^>]*>/gi)||[];
 const canonical=tags.filter(tag=>/\brel\s*=\s*["']canonical["']/i.test(tag));
 if(canonical.length!==1)throw Error('Expected exactly one canonical link: '+relative);
 const href=canonical[0].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
 if(!href)throw Error('Canonical has no URL: '+relative);
 if(/<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*\bcontent\s*=\s*["'][^"']*noindex/i.test(html)||
    /<meta\b[^>]*\bcontent\s*=\s*["'][^"']*noindex[^"']*["'][^>]*\bname\s*=\s*["']robots["']/i.test(html))
    throw Error('Noindex page cannot be listed in sitemap: '+relative);
 return href.replace(/&amp;/g,'&');
};
for(const file of files){
 const rel=path.relative(root,file).replaceAll('\\','/'),segments=rel.split('/');
 const lang=languages.includes(segments[0])&&segments[0]!=='en'?segments.shift():'en';
 const route=segments.slice(0,-1).join('/');
 const url=host+'/'+rel.replace(/index\.html$/,'');
 const html=fs.readFileSync(file,'utf8');
 if(canonicalFor(html,rel)!==url)throw Error('Sitemap URL not self-canonical: '+rel+' -> '+canonicalFor(html,rel));
 if(!groups.has(route))groups.set(route,new Map());
 if(groups.get(route).has(lang))throw Error('Duplicate route/locale: '+route+' '+lang);
 groups.get(route).set(lang,url);
}
const escapeXml=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
let xml='<?xml version="1.0" encoding="UTF-8"?>\n'+
 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
for(const [route,variants] of [...groups].sort((a,b)=>a[0].localeCompare(b[0]))){
 if(variants.size!==languages.length && !(variants.size===1&&variants.has('en')))throw Error('Incomplete hreflang set: '+route);
 for(const lang of variants.keys()){
  const url=variants.get(lang);
  if(!url||urls.has(url))throw Error('Missing or duplicated URL '+url);
  urls.add(url);
  xml+='  <url>\n    <loc>'+escapeXml(url)+'</loc>\n';
  for(const language of variants.keys()){
   xml+='    <xhtml:link rel="alternate" hreflang="'+language+'" href="'+escapeXml(variants.get(language))+'"/>\n';
  }
  xml+='    <xhtml:link rel="alternate" hreflang="x-default" href="'+escapeXml(variants.get('en'))+'"/>\n';
  xml+='  </url>\n';
 }
}
xml+='</urlset>\n';
if(urls.size!==files.length||urls.size>50000)throw Error('Sitemap exceeds allowed URLs or is missing pages');
if(Buffer.byteLength(xml,'utf8')>50*1024*1024)throw Error('Sitemap exceeds Google 50 MiB uncompressed size limit');
fs.writeFileSync(path.join(root,'sitemap.xml'),xml,{encoding:'utf8'});
fs.writeFileSync(path.join(root,'sitemap.txt'),[...urls].sort().join('\n')+'\n',{encoding:'utf8'});
fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\n\nSitemap: https://docvelio.com/sitemap.txt\nSitemap: https://docvelio.com/sitemap.xml\n');
const headers=fs.readFileSync(path.join(root,'_headers'),'utf8');
if(/X-Robots-Tag:\s*noindex/i.test(headers))throw Error('Page indexing is blocked');
fs.writeFileSync(path.join(root,'assets','seo-content.css'),[
'.dv-home-seo{background:#f7faff;border-block:1px solid #e6edf8}',
'.dv-home-seo-inner{max-width:1000px}',
'.dv-home-seo h2{font-size:clamp(1.5rem,2.6vw,2rem);line-height:1.2;color:#103158;margin:0 0 16px}',
'.dv-home-seo h3{font-size:1.15rem;margin:25px 0 9px;color:#15395f}',
'.dv-home-seo p{color:#45607f;line-height:1.8;margin:0 0 13px;max-width:86ch}',
'.dv-home-seo a{color:#155cc3;text-underline-offset:3px}',
'.dv-home-seo a:focus-visible{outline:3px solid #f3b442;outline-offset:3px}',
'.dv-home-table-wrap{max-width:100%;overflow-x:auto;border:1px solid #dce6f4;border-radius:14px;background:#fff}',
'.dv-home-task-table{width:100%;min-width:650px;border-collapse:collapse;text-align:left}',
'.dv-home-task-table caption{text-align:left;padding:13px 16px;color:#526987;font-size:.9rem}',
'.dv-home-task-table th,.dv-home-task-table td{padding:12px 16px;border-top:1px solid #e8eef7;vertical-align:top;line-height:1.55;color:#405a78}',
'.dv-home-task-table thead th{background:#edf4ff;color:#183c68;font-weight:750}',
'.dv-home-task-table tbody th{font-weight:700;color:#203e64}',
'.dv-home-seo ul{padding-left:1.3rem;color:#45607f;line-height:1.8}',
'@media(max-width:640px){.dv-home-task-table{min-width:600px}.dv-home-table-wrap{border-radius:10px}}'
].join('\n')+'\n');
console.log('SEO CHECK: '+files.length+' pages, '+groups.size+' routes, '+urls.size+' sitemap URLs, homepage metadata and content updated.');
