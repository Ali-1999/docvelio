/* Verify generated sitemap preserves every committed entry and adds only
 * the two new self-hosted tools. Complete sitemap validation runs separately. */
'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const source=cp.execFileSync('git',['show','HEAD:public/sitemap.xml'],{encoding:'utf8',maxBuffer:5*1024*1024});
const build=fs.readFileSync('public/sitemap.xml','utf8');
const normalize=s=>s.replace(/\s+\/>/g,'/>').replace(/\r\n/g,'\n').replace(/>\s+</g,'><').trim();
function entries(xml){
 const out=new Map();
 for(const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)){
  const body=match[1],url=body.match(/<loc>([^<]+)<\/loc>/)?.[1];
  assert.ok(url,'Sitemap entry without loc');
  assert.ok(!out.has(url),'Duplicate sitemap URL: '+url);
  const links=[...body.matchAll(/<xhtml:link\b[^>]*\/>/g)].map(m=>m[0]);
  const sortedLinks=links.map(normalize).sort();
  const withoutLinks=normalize(body.replace(/<xhtml:link\b[^>]*\/>/g,''));
  out.set(url,JSON.stringify({body:withoutLinks,links:sortedLinks}));
 }
 return out;
}
const previous=entries(source),generated=entries(build);
for(const [url,entry] of previous){
 assert.ok(generated.has(url),'Generated sitemap removed URL: '+url);
 assert.equal(generated.get(url),entry,'Sitemap metadata or hreflang changed: '+url);
}
const expectedNew=new Set([
 'https://docvelio.com/tools/qr-code-generator/',
 'https://docvelio.com/tools/barcode-generator/'
]);
const newUrls=[...generated.keys()].filter(url=>!previous.has(url));
assert.deepEqual(new Set(newUrls),expectedNew,'Unexpected added/missing sitemap URLs');
for(const url of expectedNew){
 const item=JSON.parse(generated.get(url));\n const links=item.links.join(' ');
 assert.ok(links.includes('hreflang="en"')&&links.includes('hreflang="x-default"'),'New tool missing English hreflang: '+url);
 assert.ok(!links.includes('hreflang="es"'),'Do not advertise nonexistent translations: '+url);
}
function textEntries(value){const lines=value.trim().split(/\r?\n/).filter(Boolean);assert.equal(new Set(lines).size,lines.length,'Duplicate text sitemap URL');return new Set(lines);}
const oldText=cp.execFileSync('git',['show','HEAD:public/sitemap.txt'],{encoding:'utf8',maxBuffer:2*1024*1024});
const previousText=textEntries(oldText),newText=textEntries(fs.readFileSync('public/sitemap.txt','utf8'));
assert.deepEqual(previousText,new Set(previous.keys()),'Committed XML and text sitemaps disagree');
assert.deepEqual(newText,new Set(generated.keys()),'Generated XML and text sitemaps disagree');
console.log('PASS: generated sitemap retains '+previous.size+' existing URLs and adds exactly '+newUrls.length+' expected tool URLs.');
