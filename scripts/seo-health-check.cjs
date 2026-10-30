// Dependency-free HTML/image SEO validation after the standard build pipeline.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('public');
const errors = [], warnings = [];
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
const pages = walk(root).filter(p=>p.endsWith('.html'));
for(const p of pages) {
 const html=fs.readFileSync(p,'utf8'), name=path.relative(root,p);
 const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
 if(!title) errors.push(name+': missing title');
 if(!/<meta\s+[^>]*name=["']description["']/i.test(html) && !/<meta\s+[^>]*content=["'][^"']+["'][^>]*name=["']description["']/i.test(html)) warnings.push(name+': no meta description');
 if(!/<h1\b/i.test(html)) warnings.push(name+': missing H1');
 if(!/rel=["']canonical["']/i.test(html) && !/rel=["']canonical["'][^>]*>/i.test(html)) warnings.push(name+': missing canonical');
 for(const m of html.matchAll(/<img\b[^>]*>/gi)){
   const tag=m[0];
   if(!/\balt\s*=/.test(tag)) errors.push(name+': image missing alt attribute');
   if(!/\bwidth\s*=/.test(tag)||!/\bheight\s*=/.test(tag)) warnings.push(name+': image lacks explicit width/height');
   if(/loading=["']lazy["']/i.test(tag) && /fetchpriority=["']high["']/i.test(tag)) warnings.push(name+': conflicting high-priority and lazy image');
 }
}
for(const f of ['sitemap.xml','robots.txt'])if(!fs.existsSync(path.join(root,f)))errors.push('missing '+f);
console.log('Pages inspected:',pages.length,'Errors:',errors.length,'Warnings:',warnings.length);
for(const msg of errors)console.error('ERROR',msg);
for(const msg of warnings.slice(0,150))console.warn('WARN',msg);
if(warnings.length>150)console.warn('Additional warnings:',warnings.length-150);
if(errors.length)process.exitCode=1;
