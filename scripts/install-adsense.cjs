/* Insert the owner-supplied AdSense site verification script in all built HTML pages.
 * Runs after all page generators; inserts only once and preserves unrelated scripts.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const publisher='pub-1566581424297065';
const client='ca-'+publisher;
const snippet='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+client+'" crossorigin="anonymous"></script>';
let checked=0,changed=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(entry.name!=='index.html')continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</head>'))throw Error('Missing head: '+file);
  const existing=html.match(/<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>/gi)||[];
  if(existing.length>1)throw Error('Duplicate AdSense scripts: '+file);
  if(existing.length===1){
   if(!existing[0].includes(client))throw Error('Different AdSense publisher in '+file);
  }else{
   html=html.replace('</head>',snippet+'</head>');
   fs.writeFileSync(file,html);changed++;
  }
  const metaTag='<meta name="google-adsense-account" content="'+client+'">';
  const metaMatches=html.match(/<meta\b[^>]*\bname=["']google-adsense-account["'][^>]*>/gi)||[];
  if(metaMatches.length>1)throw Error('Duplicate AdSense account meta tags: '+file);
  if(metaMatches.length===1){
   if(!metaMatches[0].includes(client))throw Error('Wrong AdSense account meta tag: '+file);
  }else{
   html=html.replace('</head>',metaTag+'</head>');
   fs.writeFileSync(file,html);
  }
  // Ahrefs Analytics supplied by the site owner. Avoid a second installation.
  const ahrefsKey='X1yDGYuFwX82LOKZR9z/Yg';
  const ahrefsUrl='https://analytics.ahrefs.com/analytics.js';
  const ahrefsTag='<script async src="'+ahrefsUrl+'" data-key="'+ahrefsKey+'"></script>';
  const ahrefsInstances=(html.match(/analytics\.ahrefs\.com\/analytics\.js/g)||[]).length;
  if(ahrefsInstances>1)throw Error('Duplicate Ahrefs Analytics integration: '+file);
  if(ahrefsInstances===1){
   if(!html.includes(ahrefsKey))throw Error('Unexpected Ahrefs Analytics key: '+file);
  }else{
   html=html.replace('</head>',ahrefsTag+'</head>');
   fs.writeFileSync(file,html);
  }
  checked++;
 }
}
walk(root);
fs.writeFileSync(path.join(root,'ads.txt'),'google.com, '+publisher+', DIRECT, f08c47fec0942fa0\n');
console.log('AdSense verification script: checked '+checked+' pages, inserted '+changed+' times. ads.txt configured.');
