'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const languages=['','es','fr','de','pt','ar','hi','id','tr','zh'];
const tools=['organize-pdf','pdf-to-jpg','pdf-to-png','pdf-to-text','sign-pdf','fill-pdf','add-image-to-pdf','compress-image','compress-pdf'];
const root=path.join(__dirname,'..','public');
let count=0;
for(const lang of languages)for(const tool of tools){
 const prefix=lang?lang+'/':'',route=prefix+'tools/'+tool+'/';
 const file=path.join(root,route,'index.html');
 assert(fs.existsSync(file),'Missing route '+route);
 const text=fs.readFileSync(file,'utf8'),canonical='https://docvelio.com/'+route;
 assert(text.includes('rel="canonical" href="'+canonical+'"'),'Missing canonical '+route);
 assert(text.includes('src="/assets/extra-tools.js"'),'Missing functionality '+route);
 assert(text.includes('hreflang="x-default"'),'Missing language alternatives '+route);
 assert(text.includes('data-tool="'+tool+'"'),'Missing function route '+route);
 count++;
}
assert(count===90,'Expected 90 localized tool routes');
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
assert(robots.includes('Sitemap: https://docvelio.com/sitemap.xml'),'Missing sitemap');
assert(!robots.includes('Disallow: /'),'robots.txt still blocked');
const headers=fs.readFileSync(path.join(root,'_headers'),'utf8');
assert(!headers.includes('noindex'),'Header still blocks indexing');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const tool of tools)assert(sitemap.includes('<loc>https://docvelio.com/tools/'+tool+'/</loc>'),'Missing sitemap tool '+tool);
for(const locale of languages){
 const home=fs.readFileSync(path.join(root,locale?locale+'/':'','index.html'),'utf8');
 assert(home.includes('DOCVELIO_EXTRA_TOOLS_START'),'Home has no added tools: '+locale);
}
for(const locale of ['','es','ar']){
 const contact=fs.readFileSync(path.join(root,locale?locale+'/':'','contact','index.html'),'utf8');
 assert(contact.includes('alihamzasbr@gmail.com'),'Missing public operator email: '+locale);
}
for(const required of ['docvelio-logo-icon.svg','docvelio-logo.svg','docvelio-social-card.svg','social-sharing.js','social-sharing.css']){
 assert(fs.existsSync(path.join(root,'assets',required)), 'Missing branding asset '+required);
}
for(const locale of languages){
 const prefix=locale?locale+'/':'';
 for(const route of ['index.html','tools/organize-pdf/index.html','tools/edit-pdf/index.html']){
  const html=fs.readFileSync(path.join(root,prefix,route),'utf8');
  assert(html.includes('/assets/social-sharing.js'),'Missing share script: '+prefix+route);
  assert(html.includes('/assets/social-sharing.css'),'Missing share styling: '+prefix+route);
  assert(html.includes('property="og:image"'),'Missing OG image: '+prefix+route);
  assert(html.includes('name="twitter:image"'),'Missing social image: '+prefix+route);
 }
}
console.log('PASS: 90 localized routes, SEO, owner details and build output.');

const shareCode=fs.readFileSync(path.join(root,'assets','social-sharing.js'),'utf8');
const shareStyles=fs.readFileSync(path.join(root,'assets','social-sharing.css'),'utf8');
for(const platform of ['whatsapp','facebook','linkedin','x','telegram']){
 assert(shareCode.includes("id:'"+platform+"'"),'Missing share platform '+platform);
 assert(shareStyles.includes('.dv-share-'+platform),'Missing platform style '+platform);
}
for(const essential of ['dv-share-grid','dv-share-platform-icon','dv-share-url-input','dv-share-copy','aria-live']){
 assert(shareCode.includes(essential),'Missing share control '+essential);
}
assert(shareCode.includes('icons.check'),'Copy confirmation must be visual');
assert(shareStyles.includes('@media(max-width:540px)'),'Mobile share layout missing');
console.log('PASS: branded icon share layout, copy interaction and 5 platform links.');
