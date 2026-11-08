/* Final Docvelio build: publish English-only TikTok tool after legacy 583-page tests. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const slug='tools/tiktok-video-downloader',url='https://docvelio.com/'+slug+'/';
const output=path.join(root,slug,'index.html');
const html=fs.readFileSync(path.join(__dirname,'tiktok-educational-page.html'),'utf8');
if(!html.includes('href="'+url+'"'))throw Error('TikTok canonical missing');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,html,'utf8');
const xmlPath=path.join(root,'sitemap.xml'),txtPath=path.join(root,'sitemap.txt');
let xml=fs.readFileSync(xmlPath,'utf8');
if(!xml.includes('<urlset')||!xml.includes('</urlset>'))throw Error('XML sitemap invalid');
if(!xml.includes('<loc>'+url+'</loc>')){
 const entry='  <url>\n    <loc>'+url+'</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="'+url+'"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="'+url+'"/>\n  </url>\n';
 xml=xml.replace('</urlset>',entry+'</urlset>');
 fs.writeFileSync(xmlPath,xml,'utf8');
}
const paths=fs.readFileSync(txtPath,'utf8').trim().split(/\r?\n/).filter(Boolean);
if(!paths.includes(url))paths.push(url);
fs.writeFileSync(txtPath,[...new Set(paths)].sort().join('\n')+'\n','utf8');
const home=path.join(root,'index.html');let site=fs.readFileSync(home,'utf8');
if(!site.includes('href="/'+slug+'/')){
 const card='<a class="tool-card dv-toolkit-card" data-category="video" data-title="tiktok video downloader" href="/'+slug+'/"><div class="tool-card-top"><span class="tool-icon" aria-hidden="true">▶</span><span class="tool-pill">New</span></div><h3>TikTok Video Download Guide <span class="card-arrow">↗</span></h3><p>Check TikTok links and save your own original MP4 locally. Educational guidance and no paid API.</p><span class="dv-card-foot">Open tool ↗</span></a>';
 if(site.includes('<div class="grid tool-grid" id="tool-grid">'))site=site.replace('<div class="grid tool-grid" id="tool-grid">','<div class="grid tool-grid" id="tool-grid">'+card);
 else if(site.includes('</main>'))site=site.replace('</main>','<section class="container" aria-label="Video download tools"><h2>Video download tools</h2>'+card+'</section></main>');
 else throw Error('English homepage has no insertion location');
 fs.writeFileSync(home,site,'utf8');
}
for(const page of ['tools/qr-code-generator/index.html','tools/barcode-generator/index.html']){
 const file=path.join(root,page);let content=fs.readFileSync(file,'utf8');
 if(!content.includes('href="/'+slug+'/')){
  content=content.replace('</main>','<section class="container" aria-label="Related video tools"><p>Also explore: <a href="/'+slug+'/">TikTok video download guide and original MP4 saver</a>.</p></section></main>');
  fs.writeFileSync(file,content,'utf8');
 }
}
console.log('TikTok educational tool published: '+url+'; homepage + 2 internal links and XML/TXT sitemaps updated.');
