'use strict';
// Final performance pass, after all HTML generators have completed.
const fs=require('node:fs'), path=require('node:path');
const root=path.resolve(__dirname,'..','public');
const headers=path.join(root,'_headers');
let text=fs.readFileSync(headers,'utf8');
const marker='# DOCVELIO PERFORMANCE ASSET CACHE';
if(!text.includes(marker)){
 text+='\n'+marker+'\n/assets/*\n  Cache-Control: public, max-age=86400, stale-while-revalidate=604800\n';
 fs.writeFileSync(headers,text,'utf8');
}
let pages=0,images=0;
function walk(dir){
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,ent.name);
  if(ent.isDirectory()){walk(file);continue;}
  if(ent.name!=='index.html'&&ent.name!=='404.html')continue;
  let html=fs.readFileSync(file,'utf8');
  // Don't defer the logo or the first visually important image.
  let imageIndex=0;
  html=html.replace(/<img\b[^>]*>/gi,tag=>{
   imageIndex++;
   if(/\b(?:loading|fetchpriority)\s*=/i.test(tag))return tag;
   if(/class=["'][^"']*(?:hero|logo|brand)[^"']*["']/i.test(tag)||/docvelio-logo/i.test(tag)||imageIndex===1)return tag;
   images++;return tag.replace(/\s*\/?\s*>$/,end=>' loading="lazy" decoding="async"'+end);
  });
  if(!html.includes('/assets/site-performance.css'))html=html.replace('</head>','<link rel="stylesheet" href="/assets/site-performance.css"></head>');
  fs.writeFileSync(file,html,'utf8');pages++;
 }
}
walk(root);
if(pages<490)throw Error('Unexpected number of generated pages: '+pages);
const wheel=fs.readFileSync(path.join(root,'wheel-of-names','index.html'),'utf8');
if(!wheel.includes('id="wheel"')||!wheel.includes('/assets/global-navigation.js'))throw Error('Wheel missing functionality or navigation');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!home.includes('dv-global-header')||!home.includes('dv-global-links'))throw Error('Shared header missing');
console.log('PERFORMANCE BUILD: '+pages+' pages, '+images+' below-fold images marked lazy, asset cache applied.');
