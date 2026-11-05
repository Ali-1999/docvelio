/* Check localised guide summaries after full production generation. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const routes=['edit-pdf-safely','organize-pages','privacy','scanned-documents','word-formatting'];
const locales=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
function meta(html,keyType,key){
 const tags=html.match(/<meta\b[^>]*>/gi)||[];
 const found=tags.filter(tag=>new RegExp('\\b'+keyType+'=["\\x27]'+key+'["\\x27]','i').test(tag));
 assert.equal(found.length,1,'Expected one '+key+' meta tag');
 const m=found[0].match(/\bcontent=["']([^"']*)["']/i);
 assert(m,'Expected description value');
 return m[1];
}
let checked=0;
for(const lang of locales){
 const entries=new Set();
 for(const route of routes){
  const f=path.join(root,lang==='en'?'':lang,'guides',route,'index.html');
  assert(fs.existsSync(f),'Missing translated guide: '+f);
  const html=fs.readFileSync(f,'utf8');
  const description=meta(html,'name','description');
  assert(description.length>35&&description.length<240,'Unreasonably short/long summary: '+lang+'/'+route);
  assert(!entries.has(description),'Duplicate description in locale '+lang+': '+route);
  entries.add(description);
  assert.equal(meta(html,'property','og:description'),description,'OG description not aligned: '+f);
  assert.equal(meta(html,'name','twitter:description'),description,'Twitter description not aligned: '+f);
  checked++;
 }
}
assert.equal(checked,50);
console.log('GUIDE METADATA: 50 topic-specific, unique, locally consistent descriptions checked.');
