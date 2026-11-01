/* Ahrefs audit remediation: fill genuinely missing social preview metadata. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../public');let checked=0,updated=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name==='index.html')fix(f);}}
function attr(tag,key){return tag.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(["\\x27])([^"\\x27]*)\\1','i'))?.[2]||'';}
function esc(s){return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function clean(s){return s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();}
function fix(file){
 let html=fs.readFileSync(file,'utf8'),before=html;
 const title=clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
 const meta=html.match(/<meta\b[^>]*>/gi)||[],links=html.match(/<link\b[^>]*>/gi)||[];
 const desc=meta.find(t=>attr(t,'name')==='description');
 const description=desc?attr(desc,'content'):'';
 const canonical=links.find(t=>attr(t,'rel')==='canonical');
 const url=canonical?attr(canonical,'href'):'';
 if(!title||!description||!url)throw Error('Missing essential metadata: '+file);
 const isArticle=html.includes('"BlogPosting"')||html.includes('"Article"');
 const image='https://docvelio.com/assets/docvelio-social-card.png';
 const values=[
  ['property','og:type',isArticle?'article':'website'],
  ['property','og:title',title],
  ['property','og:description',description],
  ['property','og:url',url],
  ['property','og:image',image],
  ['property','og:image:width','1200'],
  ['property','og:image:height','630'],
  ['name','twitter:card','summary_large_image'],
  ['name','twitter:title',title],
  ['name','twitter:description',description],
  ['name','twitter:image',image]
 ];
 for(const [kind,key,value] of values){
  if(meta.some(t=>attr(t,kind)===key))continue;
  html=html.replace('</head>','<meta '+kind+'="'+key+'" content="'+esc(value)+'"></head>');
 }
 if(html!==before){fs.writeFileSync(file,html);updated++;}
 checked++;
}
walk(root);
console.log('AHREFS social tags: '+checked+' pages checked, '+updated+' pages completed.');
