/* Build ItemList JSON-LD from links that are actually visible in collection pages. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public'),base='https://docvelio.com';
const plain=value=>String(value||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const attr=(tag,key)=>tag.match(new RegExp('(?:^|\\s)'+key+'=["\\x27]([^"\\x27]*)["\\x27]','i'))?.[1]||'';
function insertList(file,id,name,items){
 if(items.length<2)return false;
 let html=fs.readFileSync(file,'utf8');
 const canonicalTag=(html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)||[])[0]||'';
 const canonical=attr(canonicalTag,'href')||base+'/';
 const schema={'@context':'https://schema.org','@type':'ItemList','@id':canonical+'#'+id,name,itemListOrder:'https://schema.org/ItemListOrderAscending',numberOfItems:items.length,itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,item:{'@type':'WebPage','@id':item.url,name:item.name,url:item.url}}))};
 const script='<script id="'+id+'" type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>';
 const marker='<script id="'+id+'"';
 const start=html.indexOf(marker);
 if(start>=0){
  const end=html.indexOf('</script>',start);
  if(end<0)throw Error('Unclosed ItemList script in '+file);
  html=html.slice(0,start)+script+html.slice(end+9);
 }else html=html.replace('</head>',script+'</head>');
 fs.writeFileSync(file,html,'utf8');
 return true;
}
function itemsFromMain(main,section){
 const items=[];
 for(const match of main.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)){
  const tag=match[0],href=attr(tag,'href');
  if(!href||!href.startsWith('/')||href.startsWith('//'))continue;
  const url=new URL(href,base);
  if(url.origin!==base)continue;
  const parts=url.pathname.split('/').filter(Boolean);
  const index=parts.lastIndexOf(section);
  if(index<0||parts.length!==index+2)continue;
  const name=plain(tag.replace(/<span[^>]*aria-hidden=["']true["'][^>]*>[\s\S]*?<\/span>/gi,''));
  if(!name||items.some(item=>item.url===url.href))continue;
  items.push({url:url.href,name});
 }
 return items;
}
function walk(dir,files=[]){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())walk(file,files);
  else if(entry.name==='index.html')files.push(file);
 }
 return files;
}
const home=path.join(root,'index.html'),homeHtml=fs.readFileSync(home,'utf8');
const cards=[...homeHtml.matchAll(/<a\b[^>]*class=["'][^"']*\btool-card\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi)].map(match=>{
 const tag=match[0],href=attr(tag,'href'),heading=tag.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1];
 return href&&heading?{url:new URL(href,base).href,name:plain(heading)}:null;
}).filter(Boolean);
if(!insertList(home,'dv-home-tool-list','Docvelio online tools',cards))throw Error('Homepage ItemList could not be built from visible tool cards.');
let lists=1;
for(const file of walk(root)){
 const relative=path.relative(root,file).replaceAll('\\\\','/');
 const isGuides=/(^|\/)guides\/index\.html$/.test(relative);
 const isBlog=/(^|\/)blog\/index\.html$/.test(relative);
 if(!isGuides&&!isBlog)continue;
 const html=fs.readFileSync(file,'utf8');
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
 const section=isGuides?'guides':'blog';
 const items=itemsFromMain(main,section);
 if(insertList(file,'dv-'+section+'-item-list',isGuides?'Docvelio practical guides':'Docvelio articles',items))lists++;
}
console.log('Visible collection ItemList schema added to '+lists+' pages.');
