/* Post-build performance fix for Docvelio homepages.
 * One fingerprinted stylesheet replaces many render-blocking same-origin links.
 * Preserve the exact original cascade order; don't drop CSS based on guesses.
 * Generated assets live outside /assets so Cloudflare cache policy for existing
 * filenames remains safely short while immutable hash-based files stay long-lived.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..','public');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const outDir=path.join(root,'_immutable');
fs.mkdirSync(outDir,{recursive:true});
const rule='/_immutable/*\n  Cache-Control: public, max-age=31536000, immutable\n';
const headersFile=path.join(root,'_headers');
let hdr=fs.readFileSync(headersFile,'utf8');
if(!hdr.includes('/_immutable/*')){
 hdr=hdr.replace(/\s*$/,'')+'\n\n# Only fingerprinted resources have a one-year lifetime.\n'+rule;
 fs.writeFileSync(headersFile,hdr,'utf8');
}
const attr=(tag,key)=>{
 const rx=new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(["\\x27])([^"\\x27]*)\\1','i');
 return tag.match(rx)?.[2]||'';
};
const relativeAssetUrl=(css)=>{
 // Bundle moved from /assets/ to /_immutable/: rewrite relative CSS url paths.
 return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g,(whole,quote,url)=>{
  const clean=url.trim();
  if(/^(?:\/|https?:|data:|blob:|#)/i.test(clean))return whole;
  const location='/assets/'+clean.replace(/^\.\//,'');
  return 'url('+quote+location+quote+')';
 });
};
function optimize(lang){
 const file=path.join(root,lang==='en'?'':lang,'index.html');
 const original=fs.readFileSync(file,'utf8');
 const head=original.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0];
 if(!head)throw Error('Missing head in '+lang+' homepage');
 const tags=[...head.matchAll(/<link\b[^>]*>/gi)]
  .map(x=>x[0]).filter(tag=>{
   const rel=attr(tag,'rel').toLowerCase().split(/\s+/);
   return rel.includes('stylesheet')&&/^\/assets\/[a-z0-9/_-]+\.css(?:\?[^#]*)?$/i.test(attr(tag,'href'));
  });
 if(tags.length<8)throw Error('Unexpected stylesheet count ('+tags.length+') for '+lang);
 if(/<style\b/i.test(head))throw Error('Inline stylesheet requires cascade audit: '+lang);
 const sources=tags.map(tag=>{
  const url=attr(tag,'href').split('?')[0];
  const filename=path.resolve(root,url.slice(1));
  if(!filename.startsWith(path.resolve(root,'assets')+path.sep))throw Error('Unsafe CSS path '+url);
  const css=fs.readFileSync(filename,'utf8');
  if(/@import\b/i.test(css))throw Error('Cannot safely concatenate CSS with @import: '+url);
  return '/* '+url+' */\n'+relativeAssetUrl(css)+'\n';
 });
 const combined=sources.join('\n');
 const hash=crypto.createHash('sha256').update(combined).digest('hex').slice(0,16);
 const name='home-'+hash+'.css';
 const output=path.join(outDir,name);
 if(!fs.existsSync(output))fs.writeFileSync(output,combined,'utf8');
 const dest='/_immutable/'+name;
 const link='<link rel="stylesheet" href="'+dest+'">';
 let first=true;
 let replaced=head;
 for(const tag of tags){
  // Each match is a unique tag in the original head. Avoid removing anything else.
  if(!replaced.includes(tag))throw Error('Stylesheet replacement failed: '+tag);
  replaced=replaced.replace(tag,first?link:'');
  first=false;
 }
 // Keep AdSense, consent, analytics, SEO and script order untouched.
 const html=original.replace(head,replaced);
 if((html.match(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)||[]).length>2)
  throw Error('Homepage still has multiple blocking stylesheets: '+lang);
 fs.writeFileSync(file,html,'utf8');
 console.log('HOMEPAGE CSS '+lang+': '+tags.length+' requests -> 1; '+Buffer.byteLength(combined)+' CSS bytes; '+dest);
 return {name,count:tags.length};
}
let total=0;
const produced=new Set();
for(const lang of langs){const v=optimize(lang);total+=v.count;produced.add(v.name);}
for(const item of fs.readdirSync(outDir)){
 if(/^home-[a-f0-9]{16}\.css$/.test(item)&&!produced.has(item))fs.unlinkSync(path.join(outDir,item));
}
console.log('HOMEPAGE CSS: '+langs.length+' locales, '+total+' old blocking links replaced by '+langs.length+' single-link references.');
