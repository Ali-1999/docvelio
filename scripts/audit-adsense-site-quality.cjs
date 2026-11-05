/* Docvelio post-build, site-wide content and technical inventory.
 * No network, third-party library, fabricated E-E-A-T or ranking claims.
 * This is a generated-source audit; real browser, WAF and Google checks are separate.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../public'),base='https://docvelio.com';
const langs=new Set(['es','fr','de','pt','ar','hi','id','tr','zh']);
const issues=[],records=[],paths=new Set(),outbound=new Map(),incoming=new Map();
const titles=new Map(),descriptions=new Map(),bodies=new Map();
const counts={critical:0,high:0,medium:0,low:0,review:0},LIMIT=1600;
function flag(severity,relative,issue,details=''){
 counts[severity]++;
 if(issues.length<LIMIT)issues.push({severity,page:relative,issue,details});
}
function walk(dir,arr=[]){
 for(const d of fs.readdirSync(dir,{withFileTypes:true})){
  const f=path.join(dir,d.name);
  if(d.isDirectory())walk(f,arr);
  else if(d.isFile()&&d.name==='index.html')arr.push(f);
 }
 return arr;
}
function tags(html,name){return html.match(new RegExp('<'+name+'\\b[^>]*>','gi'))||[];}
function attr(tag,key){return tag.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(["\\x27])([\\s\\S]*?)\\1','i'))?.[2]||'';}
function plain(html){
 return html.replace(/<!--[\s\S]*?-->/g,' ')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
  .replace(/<(?:svg|canvas|template)\b[^>]*>[\s\S]*?<\/(?:svg|canvas|template)>/gi,' ')
  .replace(/<[^>]+>/g,' ').replace(/&(?:[a-z0-9]+|#\d+|#x[0-9a-f]+);/gi,' ')
  .replace(/\s+/g,' ').trim();
}
function localPath(href,relative){
 if(!href||href.startsWith('#')||/^(mailto|tel|data|blob):/i.test(href))return null;
 if(/^\s*javascript:/i.test(href))return {bad:'JavaScript pseudo-link'};
 let url;
 try{url=new URL(href,base+'/'+relative.replace(/index\.html$/,''))}catch{return {bad:'Malformed URL'};}
 if(url.origin!==base)return null;
 return {path:decodeURI(url.pathname)};
}
function existsRoute(urlpath){
 let p=urlpath.split('?')[0];
 if(!p||p==='/')return fs.existsSync(path.join(root,'index.html'));
 if(p.startsWith('/api/'))return true;
 const rel=p.replace(/^\//,'');
 // Exact files such as assets, robots, favicons and metadata.
 if(/\.[a-z0-9]{1,9}$/i.test(rel))return fs.existsSync(path.join(root,rel));
 return fs.existsSync(path.join(root,rel,'index.html'));
}
const files=walk(root).sort();
if(files.length<580)flag('critical','site','Incomplete generated site','Found only '+files.length+' index pages');
for(const file of files)paths.add('/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,''));
for(const file of files){
 const relative=path.relative(root,file).replaceAll('\\','/');
 const route='/'+relative.replace(/index\.html$/,'');
 const locale=langs.has(relative.split('/')[0])?relative.split('/')[0]:'en';
 const src=fs.readFileSync(file,'utf8');
 const head=src.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||'';
 const main=src.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
 const footer=src.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1]||'';
 const text=plain(main),words=text?text.split(/\s+/).length:0;
 const title=plain(src.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
 const desc=tags(head,'meta').filter(t=>attr(t,'name').toLowerCase()==='description');
 const canon=tags(head,'link').filter(t=>attr(t,'rel').split(/\s+/).includes('canonical'));
 const headingCount=(main.match(/<h1\b/gi)||[]).length;
 const foundLang=src.match(/<html\b[^>]*\blang=["']([^"']+)/i)?.[1]||'';
 const expected=base+route,canonical=canon.length?attr(canon[0],'href'):'';
 const isUtility=/(?:\/tools\/|\/image-tools\/|\/shipping-tools\/|\/calculators\/)/.test(route);
 const isBlog=route.includes('/blog/')&&!route.endsWith('/blog/');
 const type=isBlog?'article':isUtility?'tool':route.includes('/guides/')?'guide':'other';
 const imgs=tags(main,'img'),links=tags(src,'a');
 if(!title)flag('high',relative,'Missing HTML title');
 if(desc.length!==1||!attr(desc[0],'content'))flag('high',relative,'Missing or duplicate meta description');
 if(canon.length!==1||canonical!==expected)flag('high',relative,'Incorrect canonical',canonical+' expected '+expected);
 if(headingCount!==1)flag('medium',relative,'Expected one main H1','found '+headingCount);
 if(!main)flag('high',relative,'Missing main landmark');
 if(!footer)flag('medium',relative,'Missing footer landmark');
 if(foundLang.split('-')[0]!==locale)flag('medium',relative,'HTML lang mismatch',foundLang+' expected '+locale);
 if(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head))flag('critical',relative,'Unexpected noindex');
 if(/\{\{(?:CONTACT_EMAIL|OPERATOR_NAME|JURISDICTION)\}\}/.test(src))flag('high',relative,'Unresolved operator placeholder');
 if(main&&words<60&&locale==='en')flag('review',relative,'Very short English main content','Only '+words+' whitespace-delimited words; assess real value, not padding');
 if(locale==='zh'&&text.length<100)flag('review',relative,'Very short Chinese main content','Only '+text.length+' characters');
 if(isUtility&&!/<(?:button|input|select|textarea|canvas)\b/i.test(main))flag('review',relative,'Tool page has no obvious interactive input','Verify that the actual tool works in a browser');
 for(const img of imgs){
  if(!/\balt\s*=/i.test(img))flag('medium',relative,'Image missing alt attribute',attr(img,'src'));
  if(!attr(img,'width')||!attr(img,'height'))flag('low',relative,'Image lacks reserved width/height',attr(img,'src'));
 }
 const prefix=locale==='en'?'/':'/'+locale+'/';
 for(const routeName of ['about','contact','privacy','terms','cookies']){
  const dest=prefix+routeName+'/';
  if(!footer.includes(dest))flag('review',relative,'Trust link not visible in footer',dest);
 }
 let localLinks=0,broken=0,external=0;
 for(const link of links){
  const href=attr(link,'href'),x=localPath(href,relative);
  if(x?.bad){flag('medium',relative,'Unsafe or invalid link',href);continue;}
  if(!x){if(/^https?:\/\//i.test(href))external++;continue;}
  localLinks++;
  if(!existsRoute(x.path)){broken++;flag('high',relative,'Unresolved same-site link',href);}
  else if(paths.has(x.path))incoming.set(x.path,(incoming.get(x.path)||0)+1);
 }
 outbound.set(route,localLinks);
 const duplicateKey=locale+'|'+title.toLowerCase().trim();
 if(title){if(titles.has(duplicateKey))flag('review',relative,'Duplicate title in locale',titles.get(duplicateKey));else titles.set(duplicateKey,relative);}
 const metaDesc=desc.length?attr(desc[0],'content'):'';
 const descKey=locale+'|'+metaDesc.trim().toLowerCase();
 if(metaDesc.length>25){if(descriptions.has(descKey))flag('review',relative,'Duplicate description in locale',descriptions.get(descKey));else descriptions.set(descKey,relative);}
 if(words>60){
  const normalized=text.toLowerCase().replace(/\b\d+\b/g,'0');
  const hash=crypto.createHash('sha256').update(normalized).digest('hex');
  const key=locale+'|'+hash;
  if(bodies.has(key))flag('review',relative,'Identical readable main content',bodies.get(key));
  else bodies.set(key,relative);
 }
 records.push({url:expected,locale,type,title,descriptionLength:metaDesc.length,mainWords:words,mainCharacters:text.length,
  h1Count:headingCount,imageCount:imgs.length,internalLinks:localLinks,externalLinks:external,brokenLinks:broken,canonical});
}
for(const rec of records)rec.detectedIncomingLinks=incoming.get(new URL(rec.url).pathname)||0;
const orphanCandidates=records.filter(r=>r.detectedIncomingLinks===0&&!/^https:\/\/docvelio\.com\/(?:[a-z]{2}\/)?$/.test(r.url));
for(const rec of orphanCandidates)flag('review',new URL(rec.url).pathname,'No direct internal link detected','Could be JS navigation or sitemap-only; review');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const listed=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const sitemapSet=new Set(listed),pageSet=new Set(records.map(r=>r.url));
if(listed.length!==sitemapSet.size)flag('high','sitemap.xml','Duplicate canonical sitemap URLs',listed.length+' entries, '+sitemapSet.size+' unique');
for(const u of pageSet)if(!sitemapSet.has(u))flag('high','sitemap.xml','Generated page absent from XML sitemap',u);
for(const u of sitemapSet)if(!pageSet.has(u))flag('high','sitemap.xml','XML URL lacks generated HTML page',u);
const perLocale={};
for(const r of records){perLocale[r.locale]??={pages:0,tools:0,articles:0};perLocale[r.locale].pages++;if(r.type==='tool')perLocale[r.locale].tools++;if(r.type==='article')perLocale[r.locale].articles++;}
const out={asOf:new Date().toISOString(),scope:'Final generated public/index.html files and local links. Not a live HTTP or editorial review.',
  officialScore:false,counts,pageCount:records.length,sitemapUrls:listed.length,locales:perLocale,
  orphanCandidateCount:orphanCandidates.length,issues,issuesTruncated:issues.length>=LIMIT,records,
  manualChecks:['AdSense dashboard-specific rejection reason','Cloudflare WAF/Google crawler challenge on live sitemap.xml',
    'Browser tool workflows on desktop and mobile','Originality, factual accuracy, copyright and human editorial review',
    'Google-certified TCF CMP for personalised ads in relevant regions','Core Web Vitals from current real and laboratory measurements',
    'Actual canonical HTTP status, redirect and cache headers, performance, accessible input behaviour']};
const outDir=path.resolve(__dirname,'../reports');fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'adsense-site-quality.json'),JSON.stringify(out,null,2)+'\n');
const headings=['# Docvelio post-build AdSense and site-quality inventory','',
  'Generated-source audit only. Google does not provide or endorse a 0–100 approval score.','',
  '- Generated pages: **'+records.length+'**',
  '- XML sitemap locations: **'+listed.length+'**',
  '- Findings: '+Object.entries(counts).map(([k,v])=>k+' **'+v+'**').join(', '),
  '- Zero-internal-link review candidates: **'+orphanCandidates.length+'**','','## Locale and page types','','| Locale | Pages | Tools | Blog articles |','|---|---:|---:|---:|',
  ...Object.entries(perLocale).sort().map(([k,v])=>'| '+k+' | '+v.pages+' | '+v.tools+' | '+v.articles+' |'),
  '','## Findings sample (remaining available in JSON)','','| Severity | Page | Finding | Detail |','|---|---|---|---|',
  ...issues.slice(0,140).map(e=>'| '+[e.severity,e.page,e.issue,e.details].map(x=>String(x).replace(/\|/g,'/').replace(/\n/g,' ').slice(0,190)).join(' | ')+' |'),
  '','## Not covered by this static audit','',...out.manualChecks.map(x=>'- '+x),'',
  'This report does not claim policy compliance or Google approval. Content length and duplicated text are editorial review indicators, never automatic rejection rules.',''];
fs.writeFileSync(path.join(outDir,'adsense-site-quality.md'),headings.join('\n'));
console.log('DOCVELIO SITE QUALITY: '+records.length+' generated pages; '+listed.length+' XML URLs; '+JSON.stringify(counts));
console.log('Reports: reports/adsense-site-quality.json and reports/adsense-site-quality.md');
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,headings.slice(0,17).join('\n')+'\n');
if(process.env.ADSENSE_AUDIT_STRICT==='1'&&(counts.critical||counts.high))process.exitCode=1;
