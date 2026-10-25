/* Guard Google-crawl readiness for locally generated Docvelio pages. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..','public');
const notFound=fs.readFileSync(path.join(root,'404.html'),'utf8');
assert(/<meta\s+name="robots"\s+content="noindex,follow"/i.test(notFound),'Custom 404 must be noindex');
assert(!/<link[^>]+rel="canonical"/i.test(notFound),'Custom 404 must not canonicalize to homepage');
assert(!/<link[^>]+hreflang=/i.test(notFound),'Custom 404 must not declare localized homepage alternates');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,580);
assert.equal(new Set(urls).size,580);
assert(urls.every(u=>!u.includes('/404')),'404 must never appear in sitemap');
for(const relative of ['', 'tools/edit-pdf/', 'blog/', 'image-editor/', 'image-tools/resize-image/', 'cbm-calculator/','shipping-tools/container-capacity-calculator/','ar/','es/cbm-calculator/']){
 const file=path.join(root,relative,'index.html');
 assert(fs.existsSync(file),'Important indexable page missing: '+relative);
 const html=fs.readFileSync(file,'utf8');
 const canonical='https://docvelio.com/'+relative;
 assert(html.includes('href="'+canonical+'"'),'Canonical URL absent: '+relative);
 assert(!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html),'Page noindexed: '+relative);
 assert(/<h1\b/i.test(html)&&/<main\b/i.test(html),'Page has no crawlable primary HTML: '+relative);
 assert((html.match(/hreflang="/g)||[]).length>=11,'Missing localized language links: '+relative);
 assert(urls.includes(canonical),'Critical page missing from XML sitemap: '+relative);
}
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
assert(robots.includes('Sitemap: https://docvelio.com/sitemap.xml'));
assert(robots.includes('Sitemap: https://docvelio.com/sitemap.txt'));
assert(!/^Disallow:\s*\/\s*$/m.test(robots));
assert(fs.existsSync(path.join(__dirname,'check-live-indexing.cjs')));
console.log('PASS: critical pages crawlable in built HTML, 404 excluded, 580 canonical sitemap URLs.');
