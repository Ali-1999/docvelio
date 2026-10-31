// Post-build SEO and image checks. No external dependencies.
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve('public'),errors=[],warnings=[],pageUrls=new Set(),titles=new Map();
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
function attr(tag,name){const m=tag.match(new RegExp('(?:^|\\s)'+name+'\\s*=\\s*(["\\x27])([\\s\\S]*?)\\1','i'));return m?.[2]??'';}
function tags(html,tag){return html.match(new RegExp('<'+tag+'\\b[^>]*>','gi'))||[];}
function mark(type,msg){(type==='error'?errors:warnings).push(msg);}
const pages=walk(root).filter(p=>path.basename(p)==='index.html');
for(const file of pages){
 const rel=path.relative(root,file).replaceAll('\\','/'),html=fs.readFileSync(file,'utf8');
 const url='https://docvelio.com/'+rel.replace(/index\.html$/,'');pageUrls.add(url);
 const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
 if(!title)mark('error',rel+': title missing');
 else if(titles.has(title))mark('warning',rel+': duplicate title also used by '+titles.get(title));
 else titles.set(title,rel);
 const meta=tags(html,'meta'),links=tags(html,'link');
 const desc=meta.find(t=>attr(t,'name').toLowerCase()==='description');
 if(!desc||!attr(desc,'content'))mark('error',rel+': missing meta description');
 const canon=links.filter(t=>attr(t,'rel').toLowerCase()==='canonical');
 if(canon.length!==1||attr(canon[0],'href')!==url)mark('error',rel+': invalid self-canonical');
 if(!/<h1\b/i.test(html))mark('error',rel+': H1 missing');
 const og=meta.filter(t=>attr(t,'property')==='og:image');
 const twitter=meta.filter(t=>attr(t,'name')==='twitter:image');
 if(og.length!==1||twitter.length!==1)mark('warning',rel+': expected one OG image and one Twitter image');
 for(const tag of [...og,...twitter]){
  const val=attr(tag,'content');
  if(val && !/^https:\/\/docvelio\.com\/assets\/.+\.(png|jpe?g|webp)(?:\?.*)?$/i.test(val))mark('warning',rel+': social preview should be a same-site raster image');
 }
 for(const img of tags(html,'img')){
  if(!/\balt\s*=/i.test(img))mark('error',rel+': image missing alt attribute');
  if(!attr(img,'width')||!attr(img,'height'))mark('warning',rel+': image lacks dimensions');
  if(attr(img,'loading')==='lazy'&&attr(img,'fetchpriority')==='high')mark('warning',rel+': lazy/high-priority conflict');
  const src=attr(img,'src');
  if(src.startsWith('/')&&!src.startsWith('//')&&!fs.existsSync(path.join(root,src.split('?')[0].slice(1))))mark('error',rel+': missing local image '+src);
 }
}
for(const name of ['sitemap.xml','robots.txt'])if(!fs.existsSync(path.join(root,name)))mark('error','missing '+name);
if(fs.existsSync(path.join(root,'sitemap.xml'))){
 const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'),listed=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const unique=new Set(listed);
 if(unique.size!==listed.length)mark('error','duplicate URLs in sitemap');
 for(const url of unique)if(!pageUrls.has(url))mark('error','sitemap URL missing from generated pages: '+url);
 for(const url of pageUrls)if(!unique.has(url))mark('warning','generated page not in sitemap: '+url);
}
const png=path.join(root,'assets','docvelio-social-card.png');
if(!fs.existsSync(png))mark('error','PNG social preview missing');
else{
 const h=fs.readFileSync(png).subarray(0,24);
 if(h.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||h.readUInt32BE(16)!==1200||h.readUInt32BE(20)!==630)
  mark('error','social preview must be a valid 1200x630 PNG');
}
console.log('Docvelio SEO audit:',pages.length,'index pages;',errors.length,'errors;',warnings.length,'warnings');
for(const msg of errors)console.error('ERROR',msg);
for(const msg of warnings.slice(0,80))console.warn('WARN',msg);
if(warnings.length>80)console.warn('Additional warnings:',warnings.length-80);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
 '### Docvelio SEO and image audit\n\nPages: '+pages.length+'; Errors: '+errors.length+'; Warnings: '+warnings.length+'\n\n'+errors.slice(0,30).map(x=>'- '+x).join('\n')+'\n');
if(errors.length)process.exitCode=1;
