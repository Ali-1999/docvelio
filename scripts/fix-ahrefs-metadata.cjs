/* Normalize social previews to the generated same-site 1200x630 PNG on every page. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../public');let checked=0,updated=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name==='index.html')fix(file);}}
function attr(tag,key){return tag.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(["\\x27])([^"\\x27]*)\\1','i'))?.[2]||'';}
function esc(value){return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function setMeta(html,kind,key,value){
 const tags=html.match(/<meta\b[^>]*>/gi)||[];
 const existing=tags.filter(tag=>attr(tag,kind)===key);
 if(existing.length===1&&attr(existing[0],'content')===value)return html;
 for(const tag of existing)html=html.replace(tag,'');
 const tag='<meta '+kind+'="'+key+'" content="'+esc(value)+'">';
 return html.replace('</head>',tag+'</head>');
}
function fix(file){
 let html=fs.readFileSync(file,'utf8'),before=html;
 const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').trim()||'';
 const meta=html.match(/<meta\b[^>]*>/gi)||[];
 const desc=meta.find(tag=>attr(tag,'name')==='description');
 const description=desc?attr(desc,'content'):'';
 const links=html.match(/<link\b[^>]*>/gi)||[];
 const canonical=links.find(tag=>attr(tag,'rel')==='canonical');
 const url=canonical?attr(canonical,'href'):'';
 if(!title||!description||!url)throw Error('Missing essential metadata: '+file);
 const isArticle=html.includes('"BlogPosting"')||html.includes('"Article"');
 const image='https://docvelio.com/assets/docvelio-social-card.png';
 const values=[
  ['property','og:type',isArticle?'article':'website'],
  ['property','og:title',title],
  ['property','og:description',description],
  ['property','og:url',url],
  ['property','og:site_name','Docvelio'],
  ['property','og:image',image],
  ['property','og:image:type','image/png'],
  ['property','og:image:width','1200'],
  ['property','og:image:height','630'],
  ['property','og:image:alt','Docvelio browser-based PDF, Word and image tools'],
  ['name','twitter:card','summary_large_image'],
  ['name','twitter:title',title],
  ['name','twitter:description',description],
  ['name','twitter:image',image]
 ];
 for(const [kind,key,value] of values)html=setMeta(html,kind,key,value);
 if(html!==before){fs.writeFileSync(file,html,'utf8');updated++;}
 checked++;
}
walk(root);
console.log('Social preview normalization: '+checked+' pages checked, '+updated+' normalized to the same-site 1200x630 PNG.');
