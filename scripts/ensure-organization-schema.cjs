/* Keep one complete, truthful Docvelio Organization entity on every generated page. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const languages=['English','Spanish','French','German','Portuguese','Arabic','Hindi','Indonesian','Turkish','Chinese'];
const expected={
 '@context':'https://schema.org',
 '@type':'Organization',
 '@id':'https://docvelio.com/#organization',
 name:'Docvelio',
 url:'https://docvelio.com/',
 description:'Docvelio provides browser-based PDF, Word, image and practical calculation tools.',
 logo:{'@type':'ImageObject',url:'https://docvelio.com/assets/docvelio-logo-icon.svg'},
 email:'alihamzasbr@gmail.com',
 sameAs:['https://www.tiktok.com/@docvelio'],
 contactPoint:{'@type':'ContactPoint',contactType:'customer support',email:'alihamzasbr@gmail.com',availableLanguage:languages}
};
let checked=0,inserted=0,updated=0;
const safeJson=value=>JSON.stringify(value).replace(/</g,'\\u003c');
function isOrganization(node){
 const types=Array.isArray(node&&node['@type'])?node['@type']:[node&&node['@type']];
 return types.some(type=>type==='Organization'||type==='Corporation');
}
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())walk(file);
  else if(entry.name==='index.html')apply(file);
 }
}
function apply(file){
 let html=fs.readFileSync(file,'utf8');
 if(!html.includes('</head>'))throw Error('Missing head: '+file);
 const scripts=[...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
 let found=false,changed=false;
 for(const match of scripts){
  let data;
  try{data=JSON.parse(match[1]);}
  catch(error){throw Error('Invalid existing JSON-LD in '+file+': '+error.message);}
  const nodes=Array.isArray(data['@graph'])?data['@graph']:[data];
  for(const node of nodes){
   if(!isOrganization(node))continue;
   found=true;
   for(const [key,value] of Object.entries(expected)){
    if(['@context','@type','@id'].includes(key))continue;
    if(key==='sameAs'){
     const current=Array.isArray(node.sameAs)?node.sameAs:node.sameAs?[node.sameAs]:[];
     const merged=[...new Set([...current,...value])];
     if(JSON.stringify(current)!==JSON.stringify(merged)){node.sameAs=merged;changed=true;}
    }else if(!node[key]){
     node[key]=value;changed=true;
    }
   }
  }
  if(found&&changed){
   const replacement='<script type="application/ld+json">'+safeJson(data)+'</script>';
   html=html.replace(match[0],replacement);
   break;
  }
 }
 if(!found){
  html=html.replace('</head>','<script type="application/ld+json">'+safeJson(expected)+'</script></head>');
  inserted++;changed=true;
 }
 if(changed){fs.writeFileSync(file,html,'utf8');updated++;}
 checked++;
}
walk(root);
console.log('Organization schema: '+checked+' pages checked, '+inserted+' added, '+updated+' updated.');
