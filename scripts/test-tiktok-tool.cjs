'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../public'),slug='tools/tiktok-video-downloader';
const url='https://docvelio.com/'+slug+'/';
const file=path.join(root,slug,'index.html');
assert(fs.existsSync(file),'TikTok page was not generated');
const html=fs.readFileSync(file,'utf8');
assert(html.includes('<html lang="en"'),'Page language missing');
assert.equal((html.match(/<h1\b/gi)||[]).length,1,'TikTok page must have exactly one H1');
assert(html.includes('<link rel="canonical" href="'+url+'">'),'TikTok canonical incorrect');
assert(html.includes('name="description"')&&html.includes('name="robots"'),'SEO meta missing');
assert(html.includes('hreflang="en"')&&html.includes('hreflang="x-default"'),'English-only hreflang missing');
assert(html.includes('application/ld+json')&&html.includes('FAQPage'),'FAQ structured data missing');
for(const phrase of ['Save your original MP4','TikTok video link','educational use','Frequently asked questions','No. If the file already includes an embedded watermark']){
 assert(html.includes(phrase),'Missing useful educational section: '+phrase);
}
assert(html.includes('id="tk-file"')&&html.includes('id="tk-save"')&&html.includes('id="tk-open"'),'Main controls absent');
assert(html.includes('URL.createObjectURL')&&html.includes('URL.revokeObjectURL'),'Local-only saver missing cleanup');
assert(html.includes("'vm.tiktok.com'")&&html.includes("'vt.tiktok.com'")&&html.includes("u.protocol!=='https:'"),'TikTok URL allowlist missing');
const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(x=>x.includes("const $=id=>"));
assert.equal(inline.length,1,'Expected exactly one local tool handler');new vm.Script(inline[0]);
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
assert(locs.length>=584,'Sitemap unexpectedly has fewer than 584 URLs');
assert.equal(new Set(locs).size,locs.length,'Duplicate XML sitemap URLs');
assert(locs.includes(url),'New URL missing from XML sitemap');
const txt=fs.readFileSync(path.join(root,'sitemap.txt'),'utf8').trim().split(/\r?\n/);
assert.equal(txt.length,locs.length,'XML/TXT sitemap counts differ');assert.deepEqual(new Set(txt),new Set(locs),'XML/TXT sitemaps differ');assert(txt.includes(url));
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('href="/'+slug+'/'),'Homepage missing new tool');
for(const p of ['tools/qr-code-generator/index.html','tools/barcode-generator/index.html'])assert(fs.readFileSync(path.join(root,p),'utf8').includes('href="/'+slug+'/'),'Internal link missing: '+p);
assert.equal((html.match(/www\.googletagmanager\.com\/gtag\/js\?id=G-1RNSZ473TY/g)||[]).length,1,'GA4 tag missing');
assert.equal((html.match(/\/assets\/cookie-consent\.js/g)||[]).length,1,'Privacy banner duplicated or missing');

// The shared site chrome must be identical across new pages, not a custom navbar.
const main=fs.readFileSync(path.join(root,'index.html'),'utf8');
const headerRe=/<header\b[^>]*>[\s\S]*?<\/header>/i,footerRe=/<footer\b[^>]*>[\s\S]*?<\/footer>/i;
const expectedHeader=main.match(headerRe)?.[0],expectedFooter=main.match(footerRe)?.[0];
assert(expectedHeader&&expectedFooter&&expectedHeader.includes('data-dv-unified="1"'));
for(const tool of ['tools/tiktok-video-downloader','tools/qr-code-generator','tools/barcode-generator']){
 const content=fs.readFileSync(path.join(root,tool,'index.html'),'utf8');
 assert.equal(content.match(headerRe)?.[0],expectedHeader,'Different global header: '+tool);
 assert.equal(content.match(footerRe)?.[0],expectedFooter,'Different global footer: '+tool);
 for(const asset of ['/assets/global-navigation.css','/assets/site-polish.css','/assets/global-navigation.js'])
  assert(content.includes(asset),'Missing shared navigation asset '+asset+': '+tool);
}

console.log('PASS: TikTok educational page, original MP4 workflow, SEO, verified sitemap URLs, GA4, and internal links.');
