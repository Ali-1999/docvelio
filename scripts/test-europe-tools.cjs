/* Regression suite for five European utility tools.
 * Unit tests run in Node; page and menu checks run after the full build.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const lib=require('../public/assets/europe-tools-core.js');
const qr=require('../public/assets/docvelio-qr.js');
const root=path.resolve(__dirname,'..','public');
const routes=[
 'calculators/euro-pallet-stacking-calculator',
 'image-tools/a4-a3-dpi-pixel-calculator',
 'calculators/sepa-qr-code-generator',
 'image-tools/bleed-print-margin-calculator',
 'calculators/rf-creditor-reference-generator'
];
const count=lib.pallet({length:400,width:300,height:200,kg:12,maxHeight:1500});
assert.equal(count.perLayer,8);
assert.equal(count.layers,6);
assert.equal(count.boxes,48);
assert.equal(count.totalHeight,1344);
assert.ok(count.weight<=1500);
const constrained=lib.pallet({length:400,width:300,height:200,kg:100,maxHeight:1500});
assert.equal(constrained.boxes,15);
assert.equal(constrained.partial,7);
assert.throws(()=>lib.pallet({length:1201,width:300,height:200,kg:10,maxHeight:1500}),/Carton length/);
assert.deepEqual(lib.paper({size:'A4',orientation:'portrait',dpi:300}).pixels,[2480,3508]);
assert.deepEqual(lib.paper({size:'A3',orientation:'landscape',dpi:300}).mm,[420,297]);
const bleed=lib.bleed({size:'A4',orientation:'portrait',bleed:3,safe:5,dpi:300});
assert.deepEqual(bleed.canvas,[216,303]);assert.deepEqual(bleed.inside,[200,287]);
assert.equal(lib.rf('2348231').electronic,'RF712348231');
assert.equal(lib.rf('539007547034').electronic,'RF18539007547034');
assert.equal(lib.verifyRF('RF71 2348 231'),true);
assert.equal(lib.verifyRF('RF712348232'),false);
assert.throws(()=>lib.rf('A'.repeat(22)),/1–21/);
assert.equal(lib.iban('DE89 3704 0044 0532 0130 00'),true);
assert.equal(lib.iban('DE89 3704 0044 0532 0130 01'),false);
const sepa=lib.sepa({name:'Example Organisation',iban:'DE89370400440532013000',amount:'25.50',bic:'',rf:'RF712348231',note:''});
assert.ok(sepa.payload.startsWith('BCD\n002\n1\nSCT\n\nExample Organisation\n'));
assert.ok(sepa.payload.includes('EUR25.50\n\nRF712348231'));
assert.ok(sepa.bytes<=331);
assert.throws(()=>lib.sepa({name:'Example',iban:'DE89370400440532013001'}),/Invalid IBAN/);
assert.throws(()=>lib.sepa({name:'Example',iban:'DE89370400440532013000',rf:'RF712348231',note:'invoice'}),/either a structured RF/);
assert.equal(typeof qr.encode,'function','Docvelio QR generator missing');
const graphic=qr.encode(sepa.payload);
assert.ok(graphic.size>20,'QR matrix should be generated');
assert.equal(graphic.modules.length,graphic.size);
assert.ok(graphic.modules.every(row=>row.length===graphic.size));
assert.ok(graphic.version>=1&&graphic.version<=13);
for(const sample of ['HELLO WORLD','BCD\n002\n1\nSCT\n\nMüller\nDE89370400440532013000\nEUR20.00', 'BCD\n002\n1\nSCT\n'+'A'.repeat(310)]){
 const result=qr.encode(sample);
 assert.equal(result.level,'M');
 assert.ok(result.modules.some(row=>row.some(Boolean)));
}
assert.throws(()=>qr.encode('X'.repeat(390)),/payload is too large/);
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const shellPages=['index.html',...['es','fr','de','pt','ar','hi','id','tr','zh'].map(x=>x+'/index.html')];
for(const r of routes){
 const filename=path.join(root,r,'index.html');
 assert.ok(fs.existsSync(filename),'Missing generated tool page '+r);
 const html=fs.readFileSync(filename,'utf8');
 const url='https://docvelio.com/'+r+'/';
 assert.ok(html.includes('rel="canonical" href="'+url+'"'),'Missing canonical '+r);
 assert.ok(html.includes('<h1>'),'Missing H1 '+r);
 assert.ok(html.includes('id="dv-eu-form"'),'Missing calculator form '+r);
 assert.ok(html.includes('/assets/europe-tools-ui.js'),'Missing working JS '+r);
 assert.ok(html.includes('application/ld+json'),'Missing WebApplication schema '+r);
 assert.ok(html.includes('href="https://www.tiktok.com/@docvelio"'),'Missing shared footer '+r);
 assert.ok(sitemap.includes('<loc>'+url+'</loc>'),'Missing sitemap URL '+r);
 if(r.includes('sepa-qr'))assert.ok(html.includes('/assets/docvelio-qr.js'),'Missing first-party QR encoder');
 for(const p of shellPages){
  const page=fs.readFileSync(path.join(root,p),'utf8');
  assert.ok(page.includes('href="/'+r+'/"'),'Missing menu or homepage link '+r+' in '+p);
 }
}
assert.ok(fs.readFileSync(path.join(root,'assets/europe-tools.css'),'utf8').includes('@media(max-width:520px)'));
console.log('EUROPE TOOL TEST: five calculators, EPAL weights/layers, A4/A3 pixels, bleed, ISO RF, IBAN, EPC QR, ten menus and SEO sitemap passed.');
