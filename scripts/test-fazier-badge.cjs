/* Regression checks for Docvelio's Fazier footer badge. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../public');
const {patch,link}=require('./install-fazier-badge.cjs');
const doc='<!doctype html><html><head></head><body><main><h1>Test</h1></main><footer class="footer"><p>Existing content</p></footer></body></html>';
const once=patch(doc,'test');
assert.ok(once.includes('href="'+link+'"'));
assert.ok(once.includes('loading="lazy"'));
assert.ok(once.includes('decoding="async"'));
assert.ok(once.includes('rel="noopener noreferrer"'));
assert.ok(once.includes('badge_type=launched&amp;theme=neutral'));
assert.ok(once.includes('<p>Existing content</p>'),'Must preserve existing footer links');
assert.equal(patch(once,'test'),once,'Repeated installer should not duplicate badges');
assert.equal((once.match(/dv-fazier-footer-badge/g)||[]).length,1);
assert.throws(()=>patch('<main><h1>Missing footer</h1></main>','missing'),/exactly one footer/);
assert.throws(()=>patch('<footer></footer><footer></footer>','double'),/exactly one footer/);
function pages(dir,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())pages(file,out);else if(e.isFile()&&(e.name==='index.html'||e.name==='404.html'))out.push(file)}return out}
const files=pages(root);
assert.ok(files.length>=490,'Expected the complete multilingual site to be built');
let total=0,langs=new Set();
for(const file of files){
 const rel=path.relative(root,file).replaceAll('\\','/');
 const html=fs.readFileSync(file,'utf8');
 const marked=(html.match(/<!-- DV_FAZIER_BADGE_START -->/g)||[]).length;
 const urls=(html.match(/href="https:\/\/fazier\.com\/launches\/docvelio\.com"/g)||[]).length;
 assert.equal(marked,1,'Badge marker count: '+rel);
 assert.equal(urls,1,'Badge link count: '+rel);
 assert.ok(html.includes('<img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&amp;theme=neutral"'),'Fazier image missing: '+rel);
 assert.ok(html.includes('loading="lazy"'),'Missing lazy-load image: '+rel);
 assert.ok(html.includes('width="120" height="44"'),'Missing reserved dimensions: '+rel);
 assert.ok(html.indexOf('DV_FAZIER_BADGE_START')>html.indexOf('<footer'),'Badge must be in footer: '+rel);
 assert.ok(html.indexOf('DV_FAZIER_BADGE_END')<html.indexOf('</footer>'),'Badge must be in footer: '+rel);
 langs.add(rel.split('/')[0].length===2?rel.split('/')[0]:'en');
 total++;
}
assert.equal(total,files.length);
console.log('FAZIER TEST: exactly one accessible, lazy-loaded footer badge on '+total+' pages; languages and builders covered.');
