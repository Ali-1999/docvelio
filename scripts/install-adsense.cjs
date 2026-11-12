/* Keep AdSense ownership verification without loading ad-delivery code.
 * Ads remain disabled until the operator configures and verifies a Google-certified
 * consent management platform for regions where Google requires one.
 * Ahrefs Analytics is loaded separately only after an explicit analytics choice.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const publisher='pub-1566581424297065',client='ca-'+publisher;
let checked=0,removedAds=0,removedAhrefs=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(entry.name!=='index.html')continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</head>'))throw Error('Missing head: '+file);
  const beforeAds=html;
  html=html.replace(/<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
  if(html!==beforeAds)removedAds++;
  const beforeAhrefs=html;
  html=html.replace(/<script\b[^>]*src=["']https:\/\/analytics\.ahrefs\.com\/analytics\.js["'][^>]*>\s*<\/script>/gi,'');
  if(html!==beforeAhrefs)removedAhrefs++;
  const tags=html.match(/<meta\b[^>]*\bname=["']google-adsense-account["'][^>]*>/gi)||[];
  if(tags.length>1)throw Error('Duplicate AdSense ownership meta tags: '+file);
  if(tags.length===1){
   if(!tags[0].includes(client))throw Error('Unexpected AdSense publisher in '+file);
  }else{
   html=html.replace('</head>','<meta name="google-adsense-account" content="'+client+'"></head>');
  }
  if(html!==fs.readFileSync(file,'utf8'))fs.writeFileSync(file,html,'utf8');
  checked++;
 }
}
walk(root);
fs.writeFileSync(path.join(root,'ads.txt'),'google.com, '+publisher+', DIRECT, f08c47fec0942fa0\n');
if(checked<580)throw Error('Too few HTML pages for AdSense ownership check: '+checked);
console.log('AdSense ownership: '+checked+' pages checked; '+removedAds+' ad-delivery scripts and '+removedAhrefs+' unconditional Ahrefs tags removed. ads.txt retained. Ads stay disabled pending certified CMP.');
