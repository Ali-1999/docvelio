'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const txt=fs.readFileSync(path.join(root,'sitemap.txt'),'utf8').trim().split(/\r?\n/);
const list=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
assert.equal(list.length,581,'Production build should include wheel picker as 581st URL');
assert.equal(new Set(list).size,581);
assert.equal(new Set(txt).size,581);
assert(list.includes('https://docvelio.com/wheel-of-names/'));
for(const slug of ['edit-pdf','view-pdf','word-editor','merge-pdf','split-pdf','rotate-pdf','images-to-pdf','watermark-pdf','remove-pages','organize-pdf','pdf-to-jpg','pdf-to-png','pdf-to-text','sign-pdf','fill-pdf','add-image-to-pdf','compress-image','compress-pdf']){
 const html=fs.readFileSync(path.join(root,'tools',slug,'index.html'),'utf8');
 assert.equal((html.match(/data-search-answer="1"/g)||[]).length,1,'Missing answer-first explanation '+slug);
 assert(html.includes('/assets/search-answers.css'));
 assert(html.includes('dv-global-header'),'Missing final unified navigation on '+slug);
 assert(html.includes('site-performance.css'),'Missing performance stylesheet on '+slug);
 assert(html.includes('<h1'),'Missing heading on '+slug);
}
const wheel=fs.readFileSync(path.join(root,'wheel-of-names','index.html'),'utf8');
assert(wheel.includes('rel="canonical" href="https://docvelio.com/wheel-of-names/"'));
assert(wheel.includes('dv-global-header'));
const bad=fs.readFileSync(path.join(root,'404.html'),'utf8');
assert(bad.includes('noindex,follow'));
assert(!/rel="canonical"/.test(bad));
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(home.includes('dv-global-links'));
assert(home.includes('/assets/site-performance.css'));
console.log('PASS: full production build, 581 sitemap URLs, 18 answer-first tools, global navigation and performance.');
