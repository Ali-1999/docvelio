/* Full homepage visual and SEO regression checks. Run after the complete build. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../public');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const css=fs.readFileSync(path.join(root,'assets/homepage-v3.css'),'utf8');
const image=fs.readFileSync(path.join(root,'assets/homepage-workspace.svg'),'utf8');
assert.ok(css.includes('@media(max-width:580px)'),'Mobile layout missing');
assert.ok(css.includes('prefers-reduced-motion'),'Reduced-motion styling missing');
assert.ok(image.includes('<svg')&&image.includes('</svg>'),'Homepage graphic invalid');
assert.ok(Buffer.byteLength(image,'utf8')<25000,'Homepage SVG too large');
let pages=0;
for(const lang of langs){
 const file=path.join(root,lang==='en'?'index.html':lang+'/index.html');
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1\b/gi)||[]).length,1,lang+' H1 regression');
 assert.equal((html.match(/<main\b/gi)||[]).length,1,lang+' main regression');
 assert.equal((html.match(/data-dv-home-full="v3"/g)||[]).length,1,lang+' hero duplicate/missing');
 assert.equal((html.match(/class="dv-home-trust"/g)||[]).length,1,lang+' trust duplicate/missing');
 assert.equal((html.match(/class="dv-home-workflows"/g)||[]).length,1,lang+' visual workflows');
 assert.equal((html.match(/class="dv-home-steps"/g)||[]).length,1,lang+' how-it-works');
 assert.equal((html.match(/class="dv-home-final"/g)||[]).length,1,lang+' closing action');
 assert.equal((html.match(/class="dv-home-guides"/g)||[]).length,1,lang+' guide band');
 assert.ok(html.includes('data-dv-home-tools="v2"'),lang+' tool discovery lost');
 assert.ok(html.includes('id="tool-search"')&&html.includes('id="tool-grid"'),lang+' tool filtering lost');
 assert.ok(html.includes('/assets/homepage-v3.css')||/href="\/_immutable\/home-[a-f0-9]{16}\.css"/.test(html),lang+' missing stylesheet');
 assert.ok(html.includes('/assets/homepage-workspace.svg'),lang+' missing illustration');
 assert.ok(html.includes('class="dv-home-privacy-note"'),lang+' missing AI processing disclosure');
 assert.ok(html.includes('href="/excel-formula-generator/"'),lang+' missing formula link');
 assert.ok(html.includes('href="#tools"'),lang+' missing explore link');
 assert.ok(html.includes('<footer'),lang+' missing footer');
 assert.ok(html.includes('rel="canonical"')||/<link[^>]*rel=['"]canonical['"]/i.test(html),lang+' missing canonical');
 assert.ok(!html.includes('9 handy tools'),lang+' stale tool count');
 pages++;
}
console.log('FULL HOMEPAGE TEST: '+pages+' language pages passed layout, graphics, accessibility and SEO preservation checks.');
