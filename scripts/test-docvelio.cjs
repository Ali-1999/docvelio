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
for(const essential of ['dv-sharing--compact','dv-share-buttons','dv-share-icon','dv-share-copy','aria-live','intro.after(panel)','toolPath']){
 assert(shareCode.includes(essential),'Missing compact share behavior '+essential);
}
assert(shareCode.includes('icons.check'),'Copy confirmation must be visual');
assert(shareStyles.includes('@media(max-width:520px)'),'Mobile share styling missing');
assert(!shareStyles.includes('.dv-share-tile'),'Oversized sharing tiles should be removed');
const originalTools=['merge-pdf','split-pdf','rotate-pdf','images-to-pdf','watermark-pdf','remove-pages','view-pdf','edit-pdf','word-editor'];
for(const locale of languages){
 for(const tool of [...originalTools,...tools]){
  const prefix=locale?locale+'/':'';
  const html=fs.readFileSync(path.join(root,prefix,'tools',tool,'index.html'),'utf8');
  assert(html.includes('/assets/social-sharing.js'),'No share icons in '+locale+'/'+tool);
  assert(html.includes('/assets/social-sharing.css'),'No sharing CSS in '+locale+'/'+tool);
 }
}
console.log('PASS: compact social icons available on 180 tool pages across 10 languages.');


/* Enforce one consistent server-rendered header and meaningful content on all routes. */
const htmlPages=[];
function listPages(folder){
 for(const f of fs.readdirSync(folder,{withFileTypes:true})){
  const absolute=path.join(folder,f.name);
  if(f.isDirectory())listPages(absolute);
  else if(f.name.endsWith('.html'))htmlPages.push(absolute);
 }
}
listPages(root);
assert(htmlPages.length===321,'Expected 320 index pages plus the custom 404 page, got '+htmlPages.length);
const headerTemplates=new Map(),titles=new Set(),pageTitles=new Map();
let tips=0,headCount=0;
for(const file of htmlPages){
 const rel=path.relative(root,file).replaceAll('\\','/');
 if(!rel.endsWith('/index.html')&&rel!=='index.html')continue;
 const parts=rel.split('/');
 const locale=['es','fr','de','pt','ar','hi','id','tr','zh'].includes(parts[0])?parts.shift():'en';
 const route=parts.slice(0,-1).join('/');
 const html=fs.readFileSync(file,'utf8');
 assert(html.includes('<main'),'No main content: '+rel);
 const nav=(html.match(/<header\b[^>]*>[\s\S]*?<\/header>/gi)||[]);
 assert(nav.length===1,'Expected exactly one header: '+rel);
 assert(nav[0].includes('data-dv-unified="1"'),'Missing shared header: '+rel);
 assert(nav[0].includes('aria-controls="dv-primary-nav"'),'Mobile navigation not accessible: '+rel);
 assert(nav[0].includes('id="language-select"'),'Language switcher missing: '+rel);
 assert(nav[0].includes('data-page="'+route+'"'),'Language switcher wrong route: '+rel);
 const norm=nav[0].replace(/data-page="[^"]*"/,'data-page=""');
 if(!headerTemplates.has(locale))headerTemplates.set(locale,norm);
 assert.equal(norm,headerTemplates.get(locale),'Header differs in language '+locale+': '+rel);
 assert(html.includes('href="/assets/shared-header.css"'),'Shared CSS missing: '+rel);
 assert(html.includes('data-dv-editorial="1"'),'Missing relevant page content: '+rel);
 const heading=(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)||[]);
 assert(heading.length===1,'Missing or duplicated page heading: '+rel);
 const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
 assert(title&&title.length>10,'Title is missing or thin: '+rel);
 assert(/<meta\b[^>]*name="description"|<meta\b[^>]*content="[^"]+" name="description"/i.test(html),'Missing SEO description: '+rel);
 assert(/<link\b[^>]*rel="canonical"|<link\b[^>]*href="https:\/\/docvelio\.com\/[^"]*" rel="canonical"/i.test(html),'Missing self canonical: '+rel);
 assert(html.includes('hreflang="x-default"'),'Missing multilingual alternate: '+rel);
 const url='https://docvelio.com/'+rel.replace(/index\.html$/,'');
 assert(html.includes(url),'Absolute page URL missing: '+rel);
 if(route.startsWith('tools/')){
  assert(html.includes('class="dv-related-links"'),'Tool links missing: '+rel);
  tips++;
 }
 headCount++;
}
assert.equal(headerTemplates.size,10,'All ten language headers are not present');
assert.equal(tips,180,'Expected tool-specific guidance on all 180 tool pages');
assert.equal(headCount,320);
console.log('PASS: identical header per locale, 320 meaningful pages, 180 tool guidance sections and metadata');


/* Layout regression: the tool guide must be contained and follow the workspace,
 * not be rendered flush-left below the entire page (reported on Edit PDF).
 */
for(const locale of languages){
 const prefix=locale?locale+'/':'';
 for(const slug of [...originalTools,...tools]){
  const file=path.join(root,prefix+'tools/'+slug+'/index.html');
  const html=fs.readFileSync(file,'utf8');
  const article='<section class="dv-editorial-zone"';
  const articleAt=html.indexOf(article),mainAt=html.indexOf('<main');
  assert(articleAt>mainAt,'Guidance missing or outside main: '+prefix+slug);
  assert(html.indexOf('</main>')>articleAt,'Guidance inserted after main: '+prefix+slug);
  assert(html.includes('<div class="container dv-editorial-container">'),'Guidance has no responsive page container: '+prefix+slug);
  const pattern=/<\/?section\b[^>]*>/gi;
  pattern.lastIndex=mainAt;
  let depth=0,firstEnd=-1,started=false,match;
  while((match=pattern.exec(html))){
   if(match[0].startsWith('</')){
    depth--;
    if(started&&depth===0){firstEnd=pattern.lastIndex;break;}
   }else{depth++;started=true;}
  }
  assert.equal(articleAt,firstEnd,'Guidance must follow the tool workspace: '+prefix+slug);
  assert(html.includes('class="dv-related-links"'),'Related tools missing: '+prefix+slug);
 }
}
for(const locale of languages){
 const prefix=locale?locale+'/':'';
 for(const slug of ['','about/','privacy/','guides/']){
  const p=path.join(root,prefix+slug+'index.html');
  const html=fs.readFileSync(p,'utf8');
  assert(html.includes('<div class="container dv-editorial-container">'),'Non-tool editorial layout is not contained: '+prefix+slug);
 }
}
const editPage=fs.readFileSync(path.join(root,'tools/edit-pdf/index.html'),'utf8');
assert(editPage.indexOf('class="dv-editorial-zone"')<editPage.indexOf('class="container seo-help"'),
 'Edit PDF guidance should precede its additional help article');
console.log('PASS: 180 in-flow tool guidance cards and 40 other aligned page sections.');


/* October 2026 SEOptimer remediation regression checks. */
const homepage=fs.readFileSync(path.join(root,'index.html'),'utf8');
const pageTitle=homepage.match(/<title>(.*?)<\/title>/i)?.[1]||'';
assert.equal(pageTitle,'Free PDF Editing Tools and Online Word Editor | Docvelio');
const metaTag=(homepage.match(/<meta\b[^>]*name="description"[^>]*>/i)||[])[0]||'';
const homeDesc=metaTag.match(/content="([^"]+)"/)?.[1]||'';
assert(homeDesc.length>=120&&homeDesc.length<=160,'Homepage description length is not meaningful: '+homeDesc.length);
assert(homepage.includes('<h1>Free PDF tools.'),'Homepage H1 does not describe tool offering');
assert(homepage.includes('class="section dv-home-seo"'),'Missing people-first homepage guidance');
assert(homepage.includes('/assets/seo-content.css'),'Missing homepage SEO styling');
const pagesForAlt=[];
function collectHtml(folder){
 for(const item of fs.readdirSync(folder,{withFileTypes:true})){
  const full=path.join(folder,item.name);
  if(item.isDirectory())collectHtml(full);
  else if(item.name==='index.html')pagesForAlt.push(full);
 }
}
collectHtml(root);
for(const file of pagesForAlt){
 const content=fs.readFileSync(file,'utf8');
 const tags=content.match(/<img\b[^>]*>/gi)||[];
 for(const tag of tags)assert(/\balt="[^"]*"/i.test(tag),'Image is missing alt: '+file);
}
assert(fs.existsSync(path.join(root,'llms.txt')),'Missing optional llms.txt');
assert(fs.existsSync(path.join(root,'sitemap.txt')),'Missing TXT sitemap fallback');
const generatedSitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert((generatedSitemap.match(/<url>/g)||[]).length===320,'Missing sitemap routes');
assert(!/X-Robots-Tag:\s*noindex/i.test(fs.readFileSync(path.join(root,'_headers'),'utf8')),'X-Robots-Tag blocks indexing');
console.log('PASS: SEOptimer remediation, title, description, image alt attributes and sitemap count.');
