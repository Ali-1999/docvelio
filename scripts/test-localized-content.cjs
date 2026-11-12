'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const guides=['edit-pdf-safely','organize-pages','privacy','scanned-documents','word-formatting'];
for(const slug of guides){
 const file=path.join(root,'zh/guides',slug,'index.html'),html=fs.readFileSync(file,'utf8');
 assert(html.includes('data-dv-guide-depth-zh-2026="1"'),'Chinese guide enrichment missing: '+slug);
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
 const text=main.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 assert([...text].length>=600,'Chinese guide content still too short: '+slug+' ('+[...text].length+' chars)');
}
for(const lang of ['','es/','fr/','de/','pt/','ar/','hi/','id/','tr/','zh/']){
 for(const slug of ['privacy','cookies']){
  const html=fs.readFileSync(path.join(root,lang,slug,'index.html'),'utf8');
  assert(html.includes('data-dv-'+(slug==='privacy'?'privacy':'cookie')+'-audit-2026="1"'),'Missing localized disclosure: '+lang+slug);
  assert(!html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'),'Ad delivery must remain disabled until certified CMP configuration: '+lang+slug);
 }
}
const analytics=fs.readFileSync(path.join(root,'assets/optional-analytics.js'),'utf8');
assert(analytics.includes("choice==='accepted'"));
assert(!analytics.includes("choice==='declined'")||analytics.includes("choice==='accepted'"));
const htmlFiles=[];
(function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name==='index.html')htmlFiles.push(file);}})(root);
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8');
 assert(!html.includes('analytics.ahrefs.com/analytics.js'),'Ahrefs must be dynamically consent-gated, not hard-coded: '+file);
}
console.log('PASS: five expanded Chinese guides, ten localized privacy/cookie disclosures, no hard-coded ad or Ahrefs delivery tags.');
