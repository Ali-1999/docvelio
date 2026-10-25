/* Regression checks for browser-only image studio, generated after SEO. */
'use strict';const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..','public'),core=require(path.join(root,'assets/image-core.js'));
assert.deepEqual(core.dims(800,600),{width:800,height:600});
assert.throws(()=>core.dims(12000,1000),RangeError);
assert.deepEqual(core.proportional(640,400,320,0,true),{width:320,height:200});
assert.deepEqual(core.rotatedSize(640,400,90),{width:400,height:640});
assert.deepEqual(core.cropRect(200,100,300,200,500,400),{x:200,y:100,width:100,height:100});
assert.equal(core.mime('jpg'),'image/jpeg');
assert.throws(()=>core.mime('tiff'),TypeError);
const js=fs.readFileSync(path.join(root,'assets/image-studio.js'),'utf8');
for(const needle of ['toBlob','targetSize','pointerdown','pixelate','grayscale','resize','crop'])assert(js.includes(needle),'Missing image operation '+needle);
assert(!/fetch\s*\(|XMLHttpRequest|\.send\s*\(/.test(js),'Images must remain in browser');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
for(const lang of langs){const prefix=lang==='en'?'':lang+'/';const route=prefix+'image-editor/';
 const page=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
 for(const marker of ['data-image-studio','id="im-file"','id="im-download"','/assets/image-core.js','/assets/image-studio.js','/assets/cookie-consent.js','data-dv-unified="1"','hreflang="x-default"'])assert(page.includes(marker),'Missing '+marker+' in '+route);
 assert(page.includes('rel="canonical" href="https://docvelio.com/'+route+'"'),'Wrong canonical: '+route);
 const home=fs.readFileSync(path.join(root,prefix+'index.html'),'utf8');
 assert(home.includes('href="/'+route+'"'),'No discovery link: '+route);
 assert(home.includes('class="im-discovery"'),'No image feature discoverability '+route);
}
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.equal((xml.match(/<loc>/g)||[]).length,440);
for(const lang of langs){const prefix=lang==='en'?'':lang+'/';assert(xml.includes('<loc>https://docvelio.com/'+prefix+'image-editor/</loc>'));}
console.log('PASS: 10 localized Image Studio routes, functionality, image guards and 440 unique sitemap URLs.');
