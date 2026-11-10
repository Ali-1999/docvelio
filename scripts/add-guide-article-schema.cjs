/* Add Article schema to real guide pages; omit publication dates not present in the source. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public'),base='https://docvelio.com';
const safeJson=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const plain=value=>String(value||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const attr=(tag,key)=>tag?.match(new RegExp('(?:^|\\s)'+key+'=["\\x27]([^"\\x27]*)["\\x27]','i'))?.[1]||'';
function walk(dir,files=[]){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())walk(file,files);
  else if(entry.name==='index.html')files.push(file);
 }
 return files;
}
let checked=0;
for(const file of walk(root)){
 const relative=path.relative(root,file).replaceAll('\\\\','/');
 const parts=relative.split('/');
 const guideIndex=parts.indexOf('guides');
 if(guideIndex<0||!parts[guideIndex+1]||parts[guideIndex+1]==='index.html')continue;
 let html=fs.readFileSync(file,'utf8');
 const title=plain(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]).replace(/\s*\|\s*Docvelio$/,'');
 const descTag=(html.match(/<meta\b[^>]*>/gi)||[]).find(tag=>attr(tag,'name')==='description');
 const description=attr(descTag,'content');
 const canonicalTag=(html.match(/<link\b[^>]*>/gi)||[]).find(tag=>attr(tag,'rel')==='canonical');
 const url=attr(canonicalTag,'href');
 const lang=html.match(/<html\b[^>]*\blang=["']([^"']+)/i)?.[1]||'en';
 if(!title||!description||!url)throw Error('Guide lacks title, description or canonical: '+relative);
 const existingSchemas=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match=>{try{return JSON.parse(match[1]);}catch(error){throw Error('Invalid existing guide JSON-LD in '+relative);}});
 const existingNodes=existingSchemas.flatMap(data=>Array.isArray(data['@graph'])?data['@graph']:[data]);
 const hasBreadcrumb=existingNodes.some(node=>(Array.isArray(node['@type'])?node['@type']:[node['@type']]).includes('BreadcrumbList'));
 const prefix=lang==='en'?'/':'/'+lang+'/';
 const graph=[];
 if(!hasBreadcrumb)graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:base+prefix},{'@type':'ListItem',position:2,name:'Guides',item:base+prefix+'guides/'},{'@type':'ListItem',position:3,name:title,item:url}]});
 graph.push({'@type':'Article','@id':url+'#article',headline:title,description,mainEntityOfPage:{'@type':'WebPage','@id':url},inLanguage:lang,articleSection:'Guides',image:base+'/assets/docvelio-social-card.png',author:{'@type':'Organization','@id':base+'/#organization',name:'Docvelio'},publisher:{'@type':'Organization','@id':base+'/#organization',name:'Docvelio'}});
 const schema={'@context':'https://schema.org','@graph':graph};
 const script='<script id="dv-guide-article-schema" type="application/ld+json">'+safeJson(schema)+'</script>';
 const rx=/<script id="dv-guide-article-schema" type="application\/ld\+json">[\s\S]*?<\/script>/i;
 if(rx.test(html))html=html.replace(rx,script);
 else html=html.replace('</head>',script+'</head>');
 fs.writeFileSync(file,html,'utf8');checked++;
}
if(!checked)throw Error('No guide article pages found; refusing an empty schema build.');
console.log('Guide Article schema: '+checked+' pages checked, dates omitted because source publication dates are not recorded.');
