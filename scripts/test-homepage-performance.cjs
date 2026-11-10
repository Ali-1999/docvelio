/* Post-build mobile Lighthouse protection for Docvelio homepages. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../public');
const languages=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const header=fs.readFileSync(path.join(root,'_headers'),'utf8');
assert.match(header,/\/_immutable\/\*\s+Cache-Control:\s*public, max-age=31536000, immutable/);
let checked=0;
for(const lang of languages){
 const page=path.join(root,lang==='en'?'':lang,'index.html');
 const html=fs.readFileSync(page,'utf8');
 const head=html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0];
 assert.ok(head,'Missing head: '+lang);
 const styles=[...head.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)].map(m=>m[0]);
 assert.equal(styles.length,1,lang+' should use one render-blocking stylesheet, has '+styles.length);
 const href=styles[0].match(/href=["']([^"']+)["']/)?.[1];
 assert.match(href,/^\/_immutable\/home-[a-f0-9]{16}\.css$/);
 const bundle=fs.readFileSync(path.join(root,href.slice(1)),'utf8');
 for(const original of ['/assets/style.css','/assets/homepage-v3.css','/assets/home-toolkit-v2.css','/assets/global-navigation.css']){
  assert.ok(bundle.includes('/* '+original+' */'),lang+' missing CSS '+original);
 }
 assert.ok(!/<link\b[^>]*href=["']\/assets\/[^"']+\.css["'][^>]*>/i.test(head),lang+' redundant stylesheet');
 assert.match(html,/data-dv-home-full="v3"/,lang+' homepage design lost');
 assert.match(html,/data-dv-home-tools="v2"/,lang+' toolkit lost');
 assert.match(html,/<h1\b/i,lang+' page heading lost');
  assert.ok(html.includes('rel="preload" as="image" href="/assets/homepage-workspace.svg"'),lang+' hero illustration is not preloaded');
 assert.ok(html.includes('analytics.ahrefs.com/analytics.js'),lang+' Ahrefs missing');
 assert.ok(html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'),lang+' AdSense missing');
 assert.ok(html.includes('href="https://docvelio.com/')||html.includes('rel="canonical"'),lang+' canonical lost');
 checked++;
}
console.log('HOMEPAGE PERF: '+checked+' locales use a single immutable CSS bundle; SEO, hero, menu, ads and analytics preserved.');
