/* Ensure newly added self-hosted tools remain discoverable after all homepage and global-shell generators. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const items=[{url:'/tools/qr-code-generator/',title:'QR Code Generator',glyph:'▦',text:'Make QR codes for websites, Wi-Fi, messages and contacts. Save PNG or SVG.'},{url:'/tools/barcode-generator/',title:'Barcode Generator',glyph:'▥',text:'Create Code 39 barcodes, download SVG and print labels.'}];
for(const item of items)if(!fs.existsSync(path.join(root,item.url.slice(1),'index.html')))throw Error('Missing tool page '+item.url);
let changed=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,entry.name);
  if(entry.isDirectory()){if(['assets','vendor'].includes(entry.name))continue;walk(full);continue;}
  if(!entry.name.endsWith('.html'))continue;
  let html=fs.readFileSync(full,'utf8'),before=html;
  // Links in global navigation are shared across every locale; tools themselves currently have English pages only.
  if(html.includes('class="dv-global-header"')&&!html.includes('href="/tools/qr-code-generator/"')){
   const extra='<details class="dv-mega"><summary>QR &amp; Barcodes<span aria-hidden="true" class="dv-chevron">⌄</span></summary><div class="dv-mega-panel">'+items.map(x=>'<a href="'+x.url+'">'+x.title+'</a>').join('')+'</div></details>';
   html=html.replace('<div class="links dv-global-links" id="dv-primary-nav">','<div class="links dv-global-links" id="dv-primary-nav">'+extra);
  }
  // New category and tool cards on the English homepage, without destroying generated cards.
  if(full===path.join(root,'index.html')&&html.includes('id="tool-grid"')){
   const cards=items.filter(item=>!html.includes('data-title="'+item.title.toLowerCase()+'"')).map(item=>'<a class="tool-card dv-toolkit-card" data-category="barcode" data-title="'+item.title.toLowerCase()+'" href="'+item.url+'"><div class="tool-card-top"><span class="tool-icon dv-icon-more" aria-hidden="true">'+item.glyph+'</span><span class="tool-pill">New</span></div><h3>'+item.title+' <span class="card-arrow">↗</span></h3><p>'+item.text+'</p><span class="dv-card-foot">Open tool ↗</span></a>').join('\n');
   html=html.replace('<div class="grid tool-grid" id="tool-grid">','<div class="grid tool-grid" id="tool-grid">'+cards);
   if(!html.includes('data-filter="barcode"'))html=html.replace(/(<div class="filter-tabs"[^>]*>)/,'$1<button class="filter" type="button" data-filter="barcode" aria-pressed="false">QR &amp; Barcodes <span>2</span></button>');
  }
  if(html!==before){fs.writeFileSync(full,html);changed++;}
 }
}
walk(root);
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const item of items){if(!home.includes('href="'+item.url+'"'))throw Error('Homepage link missing: '+item.url);}
console.log('Self-hosted barcode/QR site integration complete. Updated '+changed+' pages.');
