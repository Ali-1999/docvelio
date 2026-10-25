/* CBM shipping calculation and SEO regression tests. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const C=require(path.join(root,'assets/cargo-core.js'));
const topics=require('./cargo-content-en.cjs'),locales=require('./cargo-locales.cjs');
const near=(a,b)=>assert(Math.abs(a-b)<1e-7,'Expected '+b+' got '+a);
near(C.unitVolume(100,100,100,'cm'),1);
near(C.unitVolume(12,12,12,'in'),.028316846592);
near(C.unitVolume(2,2,3,'ft')*C.CBM_TO_CFT,12);
const a=C.compute([{name:'Cartons',length:60,width:40,height:40,unit:'cm',weight:25,weightUnit:'kg',quantity:200}]);
near(a.cbm,19.2);near(a.actualKg,5000);near(a.dimensionalKg,3840);near(a.chargeableKg,5000);
near(a.containers[0].nominalPct,19.2/33.2*100);
assert.equal(a.containers[0].volumeOnlyEstimate,1);
const b=C.compute([{name:'A',length:50,width:40,height:30,unit:'cm',quantity:100,weight:0},
{name:'B',length:60,width:40,height:40,unit:'cm',quantity:50,weight:0}],{divisor:6000});
near(b.cbm,10.8);near(b.dimensionalKg,1800);assert.equal(b.quantity,150);
assert.equal(b.containers.length,3);
const heavy=C.compute([{length:100,width:100,height:100,unit:'cm',quantity:1,weight:200,weightUnit:'kg'}]);
near(heavy.chargeableKg,200);
for(const row of [{length:-1,width:30,height:20,quantity:1},{length:10,width:0,height:20,quantity:1},
{length:10,width:20,height:30,quantity:1.5},{length:10,width:20,height:30,quantity:Infinity},{length:10,width:20,height:30,quantity:0}])
assert.throws(()=>C.compute([row]),RangeError);
assert.throws(()=>C.compute([]),RangeError);
assert.throws(()=>C.compute([{length:10,width:10,height:10}],{divisor:0}),RangeError);
assert.throws(()=>C.compute([{length:10,width:10,height:10}],{utilisation:101}),RangeError);
assert.equal(topics.length,6);assert.equal(new Set(topics.map(t=>t.slug)).size,6);
assert.equal(Object.keys(locales).length,9);
const script=fs.readFileSync(path.join(root,'assets/cargo-calculator.js'),'utf8');
for(const x of ['cargo-lines','cargo-add','data-remove','cargo-containers','cargo-export','docvelio-cbm-shipment.csv'])
assert(script.includes(x),'Missing interactive function '+x);
assert(!/fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/.test(script),'Unwanted network call');
assert(script.includes('if(/^[\\s]*[=+\\-@]/'),'Unsafe CSV formula handling');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'],titles=new Set();
for(const lang of langs){
 const pre=lang==='en'?'':lang+'/';
 const home=fs.readFileSync(path.join(root,pre+'index.html'),'utf8');
 const guide=fs.readFileSync(path.join(root,pre+'guides/index.html'),'utf8');
 assert(home.includes('data-cargo-discovery="1"')&&guide.includes('data-cargo-discovery="1"'),'Missing discovery '+lang);
 if(lang!=='en'){assert.equal(locales[lang].topics.length,6);assert.equal(locales[lang].ui.length,28);}
 for(const topic of topics){
  const route=topic.root?'cbm-calculator/':'shipping-tools/'+topic.slug+'/';
  const href='https://docvelio.com/'+pre+route,html=fs.readFileSync(path.join(root,pre+route,'index.html'),'utf8');
  for(const marker of ['<h1>','data-cargo-calculator','id="cargo-row-template"','id="cargo-cbm"','id="cargo-containers"','/assets/cargo-core.js','/assets/cargo-calculator.js','data-dv-unified="1"','hreflang="x-default"','"@type":"WebApplication"','"@type":"BreadcrumbList"'])
   assert(html.includes(marker),'Missing '+marker+' at '+href);
  assert(html.includes('rel="canonical" href="'+href+'"'),'Bad canonical '+href);
  assert(html.includes('data-page="'+route.slice(0,-1)+'"'),'Wrong locale selector '+href);
  assert((html.match(/<link rel="alternate" hreflang="/g)||[]).length===11,'Incomplete hreflang '+href);
  assert((html.match(/<header\b/g)||[]).length===1,'Duplicate header '+href);
  assert((html.match(/<h1>/g)||[]).length===1,'Duplicate H1 '+href);
  if(lang==='en'){const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert(!titles.has(title));titles.add(title);assert(html.includes('Frequently asked questions'));}
  assert(home.includes('href="/'+pre+route+'"'),'No homepage link '+href);
 }
}
assert.equal(titles.size,6);
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.equal((xml.match(/<loc>/g)||[]).length,580);
console.log('PASS: CBM numeric maths, security, 60 localized pages, canonical metadata and 580 URLs.');
