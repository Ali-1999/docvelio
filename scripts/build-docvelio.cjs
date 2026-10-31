/* Docvelio production build: only verified operator details are embedded. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const base=path.join(__dirname,'..','public');
require('./generate-social-card.cjs');
const operator='Ali Hamza',email='alihamzasbr@gmail.com',location='Riyadh, Saudi Arabia';
const ownerCopy={
 en:'Operated by Ali Hamza · Riyadh, Saudi Arabia',
 es:'Responsable: Ali Hamza · Riad, Arabia Saudita',
 fr:'Responsable : Ali Hamza · Riyad, Arabie saoudite',
 de:'Betreiber: Ali Hamza · Riad, Saudi-Arabien',
 pt:'Responsável: Ali Hamza · Riade, Arábia Saudita',
 ar:'المسؤول عن الموقع: علي حمزة · الرياض، المملكة العربية السعودية',
 hi:'साइट संचालक: अली हमज़ा · रियाद, सऊदी अरब',
 id:'Pengelola: Ali Hamza · Riyadh, Arab Saudi',
 tr:'Site işletmecisi: Ali Hamza · Riyad, Suudi Arabistan',
 zh:'网站运营者：Ali Hamza · 沙特阿拉伯利雅得'
};
const locales=new Set(Object.keys(ownerCopy));
let updated=0,count=0;
function walk(dir){
 for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,item.name);
  if(item.isDirectory()){walk(full);continue;}
  if(!item.name.endsWith('.html'))continue;
  count++;
  const rel=path.relative(base,full).replaceAll('\\','/');
  const parts=rel.split('/');
  const lang=locales.has(parts[0])&&parts[0]!=='en'?parts[0]:'en';
  let doc=fs.readFileSync(full,'utf8'),before=doc;
  doc=doc.replaceAll('{{OPERATOR_NAME}}',operator).replaceAll('{{CONTACT_EMAIL}}',email).replaceAll('{{JURISDICTION}}',location);
  doc=doc.replace("This page's email address must be configured and tested by the site operator before publication.","Email is our public support channel. Please do not send confidential documents.");
  if(/(?:^|\/)(?:about|contact)\/index\.html$/.test(rel)&&!doc.includes('class="dv-operator-info"')){
   const line='<p class="dv-operator-info">'+ownerCopy[lang]+' · <a href="mailto:'+email+'">'+email+'</a></p>';
   doc=doc.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/i,'$1'+line);
  }
  if(/^(?:index\.html|(?:es|fr|de|pt|ar|hi|id|tr|zh)\/index\.html)$/.test(rel)&&!doc.includes('id="dv-owner-schema"')){
   const profile=JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'Docvelio',url:'https://docvelio.com/',publisher:{'@type':'Person',name:operator,email:email,homeLocation:{'@type':'Place',name:location}}});
   doc=doc.replace('</head>','<script id="dv-owner-schema" type="application/ld+json">'+profile+'</script></head>');
  }
  if(!doc.includes('/assets/upgrade.css'))doc=doc.replace('</head>','<link rel="stylesheet" href="/assets/upgrade.css"></head>');
  if(!doc.includes('/assets/improvements.js'))doc=doc.replace('</body>','<script defer src="/assets/improvements.js"></script></body>');
  // Site-wide Docvelio branding and sharing, including every generated language route.
  if(!doc.includes('/assets/social-sharing.css'))doc=doc.replace('</head>','<link rel="stylesheet" href="/assets/social-sharing.css"></head>');
  if(!doc.includes('/assets/social-sharing.js'))doc=doc.replace('</body>','<script defer src="/assets/social-sharing.js"></script></body>');
  // Normalize all legacy SVG preview tags and provide a raster image.
  doc=doc.replace(/<meta\b[^>]*\b(?:property|name)=["'](?:og:image(?::type|:alt|:width|:height)?|twitter:image)["'][^>]*>/gi,'');
  doc=doc.replace('</head>','<meta property="og:image" content="https://docvelio.com/assets/docvelio-social-card.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Docvelio browser-based PDF, Word and image tools"><meta name="twitter:image" content="https://docvelio.com/assets/docvelio-social-card.png"></head>');
  doc=doc.replace(/content="summary" name="twitter:card"/g,'content="summary_large_image" name="twitter:card"').replace(/name="twitter:card" content="summary"/g,'name="twitter:card" content="summary_large_image"');
  if(before!==doc){fs.writeFileSync(full,doc);updated++;}
 }
}
walk(base);
fs.writeFileSync(path.join(base,'robots.txt'),'User-agent: *\nAllow: /\n\nSitemap: https://docvelio.com/sitemap.txt\nSitemap: https://docvelio.com/sitemap.xml\n');
fs.writeFileSync(path.join(base,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n\n/sitemap.xml\n  Content-Type: application/xml; charset=utf-8\n\n/sitemap.txt\n  Content-Type: text/plain; charset=utf-8\n\n/robots.txt\n  Content-Type: text/plain; charset=utf-8\n');
fs.writeFileSync(path.join(base,'ads.txt'),'# Docvelio has not received an AdSense publisher ID. Add Google’s real authorised-seller line after account setup.\n');
if(count<230)throw new Error('Expected multilingual document pages not found: '+count);
for(const locale of locales){if(locale!=='en'&&!fs.existsSync(path.join(base,locale,'index.html')))throw new Error('Missing language: '+locale);}
for(const rel of ['about/index.html','contact/index.html','privacy/index.html','es/about/index.html','ar/contact/index.html']){
 const data=fs.readFileSync(path.join(base,rel),'utf8');
 if(/\{\{(?:CONTACT_EMAIL|OPERATOR_NAME|JURISDICTION)\}\}/.test(data))throw new Error('Unfilled placeholder: '+rel);
}
console.log('Docvelio build: '+count+' pages checked, '+updated+' updated. Operator: '+operator+'; location: '+location);
console.log('AdSense advertising remains inactive until a valid publisher ID and required certified consent platform are configured.');