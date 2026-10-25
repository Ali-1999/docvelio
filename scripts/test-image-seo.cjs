/* Image-specific search landing pages and functional editor entry points. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..','public');
const topics=require('./image-seo-topics.cjs');
const localized=require('./image-seo-locales.cjs');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
assert.equal(topics.length,8);
assert.equal(new Set(topics.map(t=>t.slug)).size,8);
const titles=new Set(),descriptions=new Set();
for(const lang of langs){
 const prefix=lang==='en'?'':lang+'/';
 for(const t of topics){
  const uri='https://docvelio.com/'+prefix+'image-tools/'+t.slug+'/';
  const filename=path.join(root,prefix,'image-tools',t.slug,'index.html');
  assert(fs.existsSync(filename),'Missing page '+uri);
  const s=fs.readFileSync(filename,'utf8');
  const title=s.match(/<title>([^<]+)<\/title>/)?.[1];
  const meta=s.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const minimumTitle=lang==='zh'?5:lang==='ar'||lang==='hi'?8:14;
  const minimumDescription=lang==='zh'?15:lang==='en'?100:38;
  assert(title&&meta&&Array.from(title).length>=minimumTitle&&Array.from(meta).length>=minimumDescription,'Thin SEO metadata: '+uri);
  assert(s.includes('<h1>'),'Missing main heading: '+uri);
  assert(s.includes('rel="canonical" href="'+uri+'"'),'Incorrect self canonical: '+uri);
  assert(s.includes('data-page="image-tools/'+t.slug+'"'),'Language menu wrong page: '+uri);
  assert(s.includes('data-image-task="'+t.slug+'"'),'Task missing from editor '+uri);
  assert(s.includes('class="im-task-article"'),'Missing task-specific guidance '+uri);
  assert(s.includes('class="im-task-grid"'),'Missing internal image-tool navigation '+uri);
  assert(s.includes('/assets/image-studio.js'),'Missing working editor '+uri);
  assert(s.includes('href="#im-step-'),'Missing task-specific actionable CTA '+uri);
  assert(s.includes('"@type":"WebApplication"'),'Missing WebApplication metadata '+uri);
  assert(s.includes('"@type":"BreadcrumbList"'),'Missing breadcrumb metadata '+uri);
  assert((s.match(/<link rel="alternate" hreflang="/g)||[]).length===11,'Missing hreflang alternates '+uri);
  assert((s.match(/<h1>/g)||[]).length===1,'Duplicate H1 '+uri);
  assert((s.match(/<header\b/g)||[]).length===1,'Multiple site headers '+uri);
  if(lang==='en'){
   assert(!titles.has(title)&&!descriptions.has(meta),'Duplicate English title/description '+uri);
   titles.add(title);descriptions.add(meta);
   const article=s.match(/<section class="im-task-article">([\s\S]*?)<\/section>/)?.[1]||'';
   assert(article.split(/\s+/).length>=150,'Unique article text too thin '+uri);
   assert(s.includes('Frequently asked questions'),'Missing relevant FAQ '+uri);
  }
 }
 for(const r of ['index.html','guides/index.html','image-editor/index.html']){
  const s=fs.readFileSync(path.join(root,prefix,r),'utf8');
  assert(s.includes('data-image-seo-links="1"'),'No cross-links from '+prefix+r);
  for(const t of topics)assert(s.includes('href="/'+prefix+'image-tools/'+t.slug+'/"'),'Missing link to '+t.slug+' on '+prefix+r);
 }
 const compressor=fs.readFileSync(path.join(root,prefix,'tools/compress-image/index.html'),'utf8');
 assert(compressor.includes('image-tools/reduce-image-size-kb/'),'No link from image compression tool '+lang);
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,580);
assert.equal(titles.size,8);
assert.equal(Object.keys(localized).length,9);
console.log('PASS: 80 image SEO pages with unique intent, localized metadata, working controls, links and 580 URLs');
