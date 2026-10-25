'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..','public');
const dest=path.join(root,'wheel-of-names');fs.mkdirSync(dest,{recursive:true});
const template=fs.readFileSync(path.resolve(__dirname,'wheel-template.html'),'utf8');
const homepage=path.join(root,'index.html');let home=fs.readFileSync(homepage,'utf8');
const link='<a href="/wheel-of-names/" data-dv-wheel-link="1">Spin the Wheel</a>';
if(!home.includes('data-dv-wheel-link="1"')){
 if(home.includes('id="dv-primary-nav"'))home=home.replace(/(<div[^>]*id="dv-primary-nav"[^>]*>)/i,'$1'+link);
 else if(home.includes('</nav>'))home=home.replace('</nav>',link+'</nav>');
 else throw Error('Homepage missing navigation');
}
const discover='<section class="section" aria-label="Random picker tool"><div class="container"><h2>Free Random Name Picker</h2><p>Spin a custom wheel to choose a name or option. Set weights, remove winners, save locally and share your wheel.</p><p><a href="/wheel-of-names/">Open Docvelio Spin the Wheel</a></p></div></section>';
if(!home.includes('aria-label="Random picker tool"')){
 if(!home.includes('</main>'))throw Error('Homepage missing main tag');
 home=home.replace('</main>',discover+'</main>');
}
fs.writeFileSync(homepage,home,'utf8');
// Use the EXACT generated site-wide header and footer, not a separately maintained copy.
const header=home.match(/<header\\b[^>]*>[\\s\\S]*?<\\/header>/i)?.[0];
const footer=home.match(/<footer\\b[^>]*>[\\s\\S]*?<\\/footer>/i)?.[0];
if(!header||!footer)throw Error('Shared Docvelio header or footer missing');
let wheel=template.replace(/<header\\b[^>]*>[\\s\\S]*?<\\/header>/i,header)
  .replace(/<footer\\b[^>]*>[\\s\\S]*?<\\/footer>/i,footer);
const siteStyles=['/assets/style.css','/assets/locales.css','/assets/shared-header.css','/assets/design-system.css'];
wheel=wheel.replace('</head>',siteStyles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+'</head>');
// Add the same essential menu and language scripts the main site uses.
wheel=wheel.replace('</body>','<script defer src="/assets/site.js"></script><script defer src="/assets/i18n.js"></script><script defer src="/assets/design-system.js"></script></body>');
fs.writeFileSync(path.join(dest,'index.html'),wheel,'utf8');
const xmlPath=path.join(root,'sitemap.xml');
let xml=fs.readFileSync(xmlPath,'utf8');
const target='https://docvelio.com/wheel-of-names/';
if(!xml.includes('<loc>'+target+'</loc>')){
 if(!xml.includes('</urlset>'))throw Error('Sitemap missing urlset close');
 xml=xml.replace('</urlset>','  <url>\n    <loc>'+target+'</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n</urlset>');
 fs.writeFileSync(xmlPath,xml);
}
const txt=path.join(root,'sitemap.txt');let lines=fs.readFileSync(txt,'utf8').trim().split(/\r?\n/);if(!lines.includes(target)){lines.push(target);lines.sort();fs.writeFileSync(txt,lines.join('\n')+'\n')}
if(!fs.existsSync(path.join(root,'assets','wheel-picker.js')))throw Error('Wheel JavaScript missing');
if(!fs.existsSync(path.join(root,'assets','wheel-picker.css')))throw Error('Wheel CSS missing');
console.log('Docvelio wheel picker generated, linked and added to sitemap.');
