/* Audit real generated HTML after the FINAL production build.
   Reports are diagnostics; they do not fabricate search volumes or rankings.
   Node 22; zero dependencies. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..','public'),reportDir=path.resolve(__dirname,'..','seo-reports');
fs.mkdirSync(reportDir,{recursive:true});
const HOST='https://docvelio.com';
const strip=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|lt|gt|quot|#\d+|#x[\da-f]+);/gi,' ').replace(/\s+/g,' ').trim();
const attr=(tag,key)=>tag?.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*["\\x27]([^"\\x27]*)["\\x27]','i'))?.[1]||'';
const allTags=(s,tag)=>[...s.matchAll(new RegExp('<'+tag+'\\b[^>]*>','gi'))].map(x=>x[0]);
const findMeta=(head,name)=>allTags(head,'meta').find(t=>attr(t,'name').toLowerCase()===name);
const findLink=(head,rel)=>allTags(head,'link').filter(t=>attr(t,'rel').split(/\s+/).includes(rel));
const walk=(d,a=[])=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p,a);else if(e.name==='index.html')a.push(p);}return a;};
const files=walk(root),info=[],links=new Map(),serious=[],warnings=[];
function routeOf(file){return path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'');}
const listedXml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...listedXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const xmlSet=new Set(urls);
if(urls.length!==581||xmlSet.size!==581)serious.push('Final production sitemap should have 581 unique URLs (including the wheel): got '+urls.length);
for(const file of files){
 const route=routeOf(file),url=HOST+'/'+route,html=fs.readFileSync(file,'utf8');
 const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||'';
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
 const title=strip(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
 const meta=attr(findMeta(head,'description'),'content');
 const canonical=findLink(head,'canonical').map(t=>attr(t,'href'));
 const language=attr(html.match(/<html\b[^>]*>/i)?.[0],'lang')||'';
 const locale=route.split('/')[0];
 const lang=['es','fr','de','pt','ar','hi','id','tr','zh'].includes(locale)?locale:'en';
 const heads=allTags(main,'h1');
 const text=strip(main).replace(/\s+/g,' ').trim();
 const words=lang==='zh'?[...text].length: text.split(/\s+/).filter(Boolean).length;
 const imgs=allTags(main,'img'),imgAltMissing=imgs.filter(t=>!/\balt\s*=/.test(t)).length;
 const noindex=allTags(head,'meta').some(t=>['robots','googlebot'].includes(attr(t,'name').toLowerCase())&&/\bnoindex\b/i.test(attr(t,'content')));
 const heading=strip(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||'');
 if(!title)serious.push(route+' missing title');
 if(!meta)serious.push(route+' missing meta description');
 if(!main)serious.push(route+' missing main content');
 if(heads.length!==1)serious.push(route+' has '+heads.length+' H1 headings');
 if(canonical.length!==1||canonical[0]!==url)serious.push(route+' invalid self-canonical '+JSON.stringify(canonical));
 if(noindex)serious.push(route+' marked noindex but intended for sitemap');
 if(!xmlSet.has(url))warnings.push(route+' not listed in sitemap');
 if(imgAltMissing)warnings.push(route+' has '+imgAltMissing+' image(s) missing alt');
 if(words<(lang==='zh'?55:90))warnings.push(route+' low readable-content length ('+words+') — review quality and intent');
 const anchors=[...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi)].map(x=>x[1]);
 for(const href of anchors){
  try{const dest=new URL(href,url);if(dest.origin!==HOST)continue;
   const clean=dest.pathname.replace(/\/index\.html$/,'/').replace(/\/?$/,'/');
   if(!clean.endsWith('/'))continue;
   links.set(clean,(links.get(clean)||0)+1);
  }catch(_){}
 }
 info.push({url,route,lang,title,meta,heading,words,altMissing:imgAltMissing,
  h1:heads.length,canonicalOk:canonical.length===1&&canonical[0]===url,noindex,
  hasSchema:/<script[^>]*type=["']application\/ld\+json["']/.test(head),inlinks:0});
}
const byLang=new Map();
for(const p of info){
 p.inlinks=links.get(new URL(p.url).pathname)||0;
 if(!byLang.has(p.lang))byLang.set(p.lang,{titles:new Map(),descriptions:new Map()});
 const group=byLang.get(p.lang);
 for(const [key,value] of [['titles',p.title],['descriptions',p.meta]]){
  if(!value)continue;const store=group[key];
  if(store.has(value)&&!p.route.includes('wheel-of-names'))warnings.push('Duplicate '+key.slice(0,-1)+' within '+p.lang+': '+store.get(value)+' and '+p.route);
  else store.set(value,p.route);
 }
 if(p.inlinks===0)warnings.push(p.route+' has zero detected internal links');
 if(p.title.length>75&&p.lang==='en')warnings.push(p.route+' very long title ('+p.title.length+' characters)');
}
const csvQuote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
const fields=['url','route','lang','title','meta','heading','words','inlinks','h1','canonicalOk','noindex','altMissing','hasSchema'];
fs.writeFileSync(path.join(reportDir,'page-inventory.csv'),[fields.join(','),...info.map(x=>fields.map(k=>csvQuote(x[k])).join(','))].join('\n')+'\n');
const score=info.map(x=>({url:x.url,lang:x.lang,score:(x.canonicalOk?25:0)+(x.h1===1?20:0)+(!x.noindex?15:0)+(x.words>150?15:0)+(x.inlinks>0?15:0)+(x.altMissing===0?10:0)}));
fs.writeFileSync(path.join(reportDir,'priority-review.csv'),['url,lang,heuristic_score_100',...score.sort((a,b)=>a.score-b.score).map(x=>[csvQuote(x.url),x.lang,x.score].join(','))].join('\n')+'\n');
const categories={PDF:0,image:0,cargo:0,blog:0,other:0};
for(const p of info){const s=p.route;categories[s.includes('tools/')&&!s.includes('shipping-tools/')&&!s.includes('image-tools/')?'PDF':s.includes('image-editor')||s.includes('image-tools/')?'image':s.includes('cbm-calculator')||s.includes('shipping-tools/')?'cargo':s.includes('blog/')?'blog':'other']++;}
const report=[
 '# Docvelio SEO inventory — generated, not a Google indexing report','',
 'Checked '+info.length+' HTML pages. XML sitemap URLs: '+urls.length+'. '+new Date().toISOString().slice(0,10)+'.',
 'No search volume, CTR, ranking or backlink values are estimated. The priority score is an internal code-health heuristic, **not a Google metric**.','',
 '## Pages by type','',
 ...Object.entries(categories).map(([k,v])=>'- '+k+': '+v),
 '',
 '## Blocking source-code issues ('+serious.length+')','',
 ...(serious.length?serious.slice(0,80).map(x=>'- '+x):['None in the generated HTML for these checks.']),
 '',
 '## Review suggestions ('+warnings.length+')','',
 ...(warnings.length?warnings.slice(0,200).map(x=>'- '+x):['No review flags under these heuristics.']),
 '',
 '## Follow-up','',
 'Review warnings with a human rather than padding content to an arbitrary word count.',
 'Use Google Search Console Performance and Pages reports to decide which pages actually need revised copy, internal links or consolidation.',
 'Do not create duplicate translated pages just to increase the number of URLs.',
 'Fix the Cloudflare challenge on the XML sitemap through Cloudflare Security Events; repository code cannot bypass a Cloudflare edge challenge.',
 'Separate CSV files are available as workflow artifacts.'
].join('\n');
fs.writeFileSync(path.join(reportDir,'AUDIT.md'),report+'\n');
console.log('SEO AUDIT: '+info.length+' HTML pages; '+serious.length+' serious issues; '+warnings.length+' review suggestions. Reports written to seo-reports/');
if(serious.length){console.error(serious.slice(0,18).join('\n'));process.exitCode=1;}
