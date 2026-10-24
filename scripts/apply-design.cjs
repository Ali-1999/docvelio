/* Apply one final design layer to every generated and checked-in HTML page.
   Run after all page generators and before SEO sitemap validation.
   This preserves all existing tool scripts, semantic markup and URL structure. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const css='<link rel="stylesheet" href="/assets/design-system.css">';
const js='<script defer src="/assets/design-system.js"></script>';
let count=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('</head>')||!html.includes('</body>'))throw Error('Incomplete HTML page: '+file);
  if(!html.includes('href="/assets/design-system.css"'))html=html.replace('</head>',css+'</head>');
  if(!html.includes('src="/assets/design-system.js"'))html=html.replace('</body>',js+'</body>');
  fs.writeFileSync(file,html);
  count++;
 }
}
walk(root);
if(count!==431)throw Error('Expected 430 pages and one 404 page, found '+count);
console.log('DESIGN BUILD: one responsive styling and accessibility layer applied to '+count+' pages.');
