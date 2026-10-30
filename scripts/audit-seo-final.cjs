/* Crawl-readiness QA after all generators; no fake ranking metrics. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const host='https://docvelio.com';
const pages=[],errors=[],warnings=[];
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,d.name);if(d.isDirectory())walk(f);else if(d.name==='index.html')pages.push(f);}}
walk(root);
function attr(tag,key){const pattern=new RegExp('(?:^|\\s)'+key+'=["\\x27]([^"\\x27]*)["\\x27]','i');return tag.match(pattern)?.[1]||'';}
let missingMeta=0,missingH1=0,missingCanon=0,brokenLinks=0,missingAlt=0,thinDesc=0;
const urls=new Set(),titles=new Map();
for(const file of pages){
 const rel=path.relative(root,file).replaceAll('\\','/');
 const url=host+'/'+rel.replace(/index\.html$/,'');
 const html=fs.readFileSync(file,'utf8');urls.add(url);
 const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
 if(!title)errors.push('Title missing '+rel);
 else if(titles.has(title)){if(warnings.length<100)warnings.push('Duplicate title '+rel+' and '+titles.get(title));}
 else titles.set(title,rel);
 const meta=html.match(/<meta\b[^>]*>/gi)||[];
 const description=meta.find(x=>attr(x,'name')==='description');
 if(!description||!attr(description,'content')){missingMeta++;errors.push('Description missing '+rel);}
 else if(attr(description,'content').length<55)thinDesc++;
 const canonical=(html.match(/<link\b[^>]*>/gi)||[]).filter(x=>attr(x,'rel')==='canonical');
 if(canonical.length!==1||attr(canonical[0],'href')!==url){missingCanon++;errors.push('Invalid self canonical '+rel);}
 if(!/<h1\b/i.test(html)){missingH1++;errors.push('Missing H1 '+rel);}
 for(const tag of html.match(/<img\b[^>]*>/gi)||[])if(!/\balt\s*=/i.test(tag))missingAlt++;
 for(const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)){
  const href=match[1].split('#')[0].split('?')[0];
  if(!href.startsWith('/')||href.startsWith('//')||!href.endsWith('/'))continue;
  if(!fs.existsSync(path.join(root,href.slice(1),'index.html'))){brokenLinks++;if(warnings.length<100)warnings.push('Broken internal link '+href+' in '+rel);}
 }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urlsXml=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
if(urlsXml.length!==581)errors.push('Expected 581 deployed sitemap URLs, found '+urlsXml.length);
if(new Set(urlsXml).size!==urlsXml.length)errors.push('Duplicate URLs in final sitemap');
if(pages.length!==581)errors.push('Expected 581 generated index pages, found '+pages.length);
for(const url of urlsXml)if(!urls.has(url))errors.push('Sitemap references missing page '+url);
for(const url of urls)if(!urlsXml.includes(url))errors.push('Page not listed in final sitemap '+url);
for(const lang of ['en','es','fr','de','pt','ar','hi','id','tr','zh'])for(const route of ['','about/','guides/']){
 const rel=(lang==='en'?'':lang+'/')+route+'index.html';
 const page=fs.readFileSync(path.join(root,rel),'utf8');
 if(!page.includes('data-dv-seo-2026="1"'))errors.push('Missing localized trust/intent content '+rel);
}
const report=['# Docvelio SEO Technical Audit','',
 'Generated pages: '+pages.length+'; sitemap URLs: '+urlsXml.length,
 'Critical errors: '+errors.length+'; review warnings: '+warnings.length,
 '| Issue | Count |','|---|---:|',
 '| Missing meta descriptions | '+missingMeta+' |',
 '| Short meta descriptions (review, not automatic defect) | '+thinDesc+' |',
 '| Missing H1 | '+missingH1+' |',
 '| Invalid canonical | '+missingCanon+' |',
 '| Images missing alt | '+missingAlt+' |',
 '| Internal links to missing folder pages | '+brokenLinks+' |',
 '','## Critical','',...(errors.length?errors.slice(0,40).map(x=>'- '+x):['- None detected']),
 '','## Examples requiring editorial review','',...warnings.slice(0,25).map(x=>'- '+x),
 '','This checks generated pages, not Google indexing, measured keyword difficulty or Core Web Vitals.'].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
if(errors.length)process.exitCode=1;
