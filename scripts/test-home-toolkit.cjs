/* Validate responsive multilingual homepage toolkit after all generators. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../public');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const catSet=['all','pdf','word','image','calculators','more'];
const css=fs.readFileSync(path.join(root,'assets/home-toolkit-v2.css'),'utf8');
assert.ok(css.includes('@media(max-width:520px)'),'Mobile breakpoint missing');
assert.ok(css.includes('prefers-reduced-motion'),'Reduced-motion treatment missing');
let total=0;
for(const lang of langs){
 const file=path.join(root,lang==='en'?'':lang,'index.html');
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/data-dv-home-tools="v2"/g)||[]).length,1,lang+' needs exactly one toolkit');
 assert.equal((html.match(/id="tool-search"/g)||[]).length,1,lang+' needs one search input');
 assert.equal((html.match(/id="tool-grid"/g)||[]).length,1,lang+' needs one tools grid');
 assert.equal((html.match(/id="empty-tools"/g)||[]).length,1,lang+' needs one empty-results indicator');
 assert.ok(html.includes('href="/assets/home-toolkit-v2.css"')||/href="\/_immutable\/home-[a-f0-9]{16}\.css"/.test(html),lang+' missing styles');
 for(const cat of catSet)assert.ok(html.includes('data-filter="'+cat+'"'),lang+' missing '+cat+' filter');
 for(const link of ['/excel-formula-generator/','/wheel-of-names/']){
  assert.ok(html.includes('href="'+link+'"'),lang+' missing '+link+' link');
 }
 const section=html.match(/<section class="section dv-home-toolkit"[\s\S]*?<\/section>/)?.[0];
 assert.ok(section,lang+' toolkit section not found');
 const cards=[...section.matchAll(/<a\b[^>]*\bclass="[^"]*\btool-card\b[^"]*"[^>]*>/gi)];
 assert.ok(cards.length>=24,lang+' unexpected tool card count '+cards.length);
 const hrefs=new Set();
 for(const match of cards){
  const href=match[0].match(/\bhref="([^"]+)"/)?.[1];
  assert.ok(href&&href.startsWith('/')&&!href.includes('..'),lang+' invalid card link');
  assert.ok(!hrefs.has(href),lang+' duplicate tool '+href);
  hrefs.add(href);
  assert.ok(fs.existsSync(path.join(root,href.slice(1),'index.html')),lang+' broken tool '+href);
 }
 assert.ok(section.includes('id="dv-toolkit-spotlight"'),lang+' missing featured tools');
 total+=cards.length;
}
console.log('HOME TOOLKIT TEST: '+langs.length+' homepages, '+total+' tool-card links, required categories and local assets validated.');
