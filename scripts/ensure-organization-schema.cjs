/* Add truthful, site-wide Organization identity only where it is absent.
 * Do not mislabel free utilities as retail Products or manufacture FAQs.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
let count=0,inserted=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(e.name==='index.html')apply(file);}}
function apply(file){
 let html=fs.readFileSync(file,'utf8');
 if(!html.includes('</head>'))throw Error('Missing head: '+file);
 const structured=[...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
 let hasOrg=false;
 for(const match of structured){
  try {
   const d=JSON.parse(match[1]);const nodes=Array.isArray(d['@graph'])?d['@graph']:[d];
   if(nodes.some(n=>n&&['Organization','Corporation'].includes(n['@type'])))hasOrg=true;
  }catch(e){throw Error('Invalid existing JSON-LD: '+file);}
 }
 if(!hasOrg){
  const schema={'@context':'https://schema.org','@type':'Organization','@id':'https://docvelio.com/#organization',name:'Docvelio',url:'https://docvelio.com/',sameAs:['https://www.tiktok.com/@docvelio']};
  html=html.replace('</head>','<script type="application/ld+json">'+JSON.stringify(schema)+'</script></head>');
  fs.writeFileSync(file,html);inserted++;
 }
 count++;
}
walk(root);
console.log('Organization structured data checked on '+count+' pages; added on '+inserted+' pages.');
