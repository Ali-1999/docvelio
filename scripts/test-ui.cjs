'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const html=[];
(function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())walk(file);
  else if(entry.name.endsWith('.html'))html.push(file);
 }
})(root);
assert.equal(html.length,441,'Expected 440 pages plus custom 404');
const css=fs.readFileSync(path.join(root,'assets','design-system.css'),'utf8');
const script=fs.readFileSync(path.join(root,'assets','design-system.js'),'utf8');
assert(css.length>12000&&css.length<30000,'Expected single lightweight design file');
assert(script.length>1000&&script.length<10000,'Expected lightweight JS enhancements');
for(const feature of [
 '--dv-accent','--dv-shadow','.dv-site-header','.tool-card','.toolbox',
 '.editor-layout','.word-shell','.dv-blog-card','.dv-sharing--compact',
 '.dv-editorial','.footer',':focus-visible','prefers-reduced-motion',
 'html[dir="rtl"]','max-width:380px','max-width:640px','max-width:860px'
])assert(css.includes(feature),'Missing design coverage: '+feature);
for(const feature of [
 "event.key==='Escape'","aria-expanded","aria-current","pointerdown","tool-search"
])assert(script.includes(feature),'Missing accessibility behavior: '+feature);
const types={home:0,tool:0,blog:0,guide:0,policy:0,notfound:0};
for(const file of html){
 const rel=path.relative(root,file).replaceAll('\\','/');
 const source=fs.readFileSync(file,'utf8');
 assert.equal((source.match(/href="\/assets\/design-system\.css"/g)||[]).length,1,
  'Missing or repeated design stylesheet: '+rel);
 assert.equal((source.match(/src="\/assets\/design-system\.js"/g)||[]).length,1,
  'Missing or repeated interaction script: '+rel);
 assert(source.indexOf('href="/assets/design-system.css"')<source.indexOf('</head>'),
  'Design style must load at end of head: '+rel);
 assert(source.indexOf('src="/assets/design-system.js"')<source.indexOf('</body>'),
  'UI script must defer and load before closing body: '+rel);
 if(rel==='404.html'){types.notfound++;continue;}
 assert(source.includes('data-dv-unified="1"'),'No unified header: '+rel);
 assert(source.includes('id="dv-primary-nav"'),'Missing shared mobile nav: '+rel);
 assert(source.includes('id="language-select"'),'Missing language selection: '+rel);
 assert(source.includes('<main'),'Missing semantic main content: '+rel);
 if(/(?:^|\/)tools\//.test(rel)){
  types.tool++;
  assert(source.includes('/assets/social-sharing.js'),'Share icons missing from tool page '+rel);
 }else if(/(?:^|\/)blog\//.test(rel))types.blog++;
 else if(rel.endsWith('index.html')&&/(?:^|\/)guides\//.test(rel))types.guide++;
 else if(rel==='index.html'||/^((es|fr|de|pt|ar|hi|id|tr|zh)\/)index\.html$/.test(rel))types.home++;
 else types.policy++;
}
assert.equal(types.tool,180,'All 180 localized tool pages should be styled');
assert.equal(types.blog,110,'All 110 blog pages should be styled');
assert.equal(types.home,10,'All 10 homepages should be styled');
assert.equal(types.notfound,1,'Custom 404 styling missing');
console.log('PASS: responsive design and accessible navigation present across 441 pages',types);
