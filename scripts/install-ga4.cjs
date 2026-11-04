/* Add a single first-party, consent-gated GA4 loader to all generated Docvelio pages.
 * Run as the final build step so generated and hand-written pages are covered.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const tag='<script defer src="/assets/docvelio-ga4.js"></script>';
let count=0,changed=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</body>'))throw Error('Missing body close tag: '+file);
  const present=(html.match(/\bsrc=["']\/assets\/docvelio-ga4\.js["']/g)||[]).length;
  if(present>1)throw Error('Duplicate GA4 initializer: '+file);
  if(!present){
   html=html.replace(/<\/body>/i,tag+'</body>');
   fs.writeFileSync(file,html,'utf8');changed++;
  }
  count++;
 }
}
walk(root);
if(count<580)throw Error('Too few generated pages for GA4 install: '+count);
console.log('GA4: consent-gated initializer present across '+count+' pages; updated '+changed+'.');
