/* Eight functional image-task landing pages, based on Docvelio Image Studio.
 * Runs AFTER add-image-studio.cjs. Does not duplicate or modify image processing.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public');
const topics=require('./image-seo-topics.cjs');
const locales=require('./image-seo-locales.cjs');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const host='https://docvelio.com';
const prefix=l=>l==='en'?'/':'/'+l+'/';
const url=(l,slug)=>host+prefix(l)+'image-tools/'+slug+'/';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const xmlEsc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const enLabels=['How to use this tool','What to know before editing','Steps to follow','Other image tools','Open editor','All image tools','Home','Image tools','Choose an image from your device.','Apply the change and inspect the preview.','Download a new copy and keep the original.'];
const ids=['resize','crop','rotate','pixelate','mono'],actions={resize:'im-step-resize',crop:'im-step-crop',rotate:'im-step-rotate',flip:'im-step-rotate',convert:'im-step-export',target:'im-step-export',pixelate:'im-step-pixelate',mono:'im-step-mono'};
function taskText(lang,idx){
 const t=topics[idx];
 if(lang==='en')return {title:t.title,description:t.description,lead:t.lead,detail:t.details,steps:t.steps,faq:t.faq,labels:enLabels};
 const translated=locales[lang];if(!translated||translated.topics.length!==topics.length)throw Error('Missing localization '+lang);
 const [title,description,how,limit]=translated.topics[idx];
 return {title,description,lead:description,detail:[how,limit],steps:[translated.labels[8],translated.labels[9],translated.labels[10]],faq:null,labels:translated.labels};
}
function cardGrid(lang,exclude){
 const l=lang==='en'?enLabels:locales[lang].labels;
 return '<nav class="im-task-grid" aria-label="'+esc(l[3])+'">'+
 topics.filter(t=>t.slug!==exclude).map((t)=>{const i=topics.indexOf(t),copy=taskText(lang,i);
  return '<a href="'+prefix(lang)+'image-tools/'+t.slug+'/"><strong>'+esc(copy.title)+'</strong><span>'+esc(copy.description)+'</span></a>';}).join('')+
 '<a href="'+prefix(lang)+'image-editor/"><strong>'+esc(l[5])+'</strong><span>Docvelio Image Studio</span></a></nav>';
}
function taskArticle(lang,idx){
 const t=topics[idx],c=taskText(lang,idx),l=c.labels;
 const steps='<ol>'+c.steps.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ol>';
 const detail=c.detail.map(v=>'<p>'+esc(v)+'</p>').join('');
 const faq=c.faq?'<section class="im-task-faq"><h2>Frequently asked questions</h2>'+c.faq.map(([q,a])=>'<h3>'+esc(q)+'</h3><p>'+esc(a)+'</p>').join('')+'</section>':'';
 return '<section class="im-task-article"><div class="container im-task-container">'+
 '<h2>'+esc(l[0])+'</h2><p>'+esc(c.lead)+'</p>'+steps+
 '<h2>'+esc(l[1])+'</h2>'+detail+faq+
 '<h2>'+esc(l[3])+'</h2>'+cardGrid(lang,t.slug)+
 '<p class="im-task-trust">'+esc(lang==='en'?'Images are processed in the browser. Keep your original file and inspect the exported copy.':'Docvelio · '+l[10])+'</p>'+
 '</div></section>';
}
function topicPage(base,lang,idx){
 const t=topics[idx],c=taskText(lang,idx),l=c.labels,u=url(lang,t.slug),hero='<section class="im-hero im-task-hero"><div class="container"><nav class="im-breadcrumb" aria-label="Breadcrumb"><a href="'+prefix(lang)+'">'+esc(l[6])+'</a><span aria-hidden="true">/</span><a href="'+prefix(lang)+'image-editor/">'+esc(l[7])+'</a><span aria-hidden="true">/</span><span>'+esc(c.title)+'</span></nav>'+
 '<h1>'+esc(c.title)+'</h1><p>'+esc(c.lead)+'</p><a class="im-task-cta" href="#'+actions[t.active]+'">'+esc(l[4])+' ↓</a></div></section>';
 let s=base;
 s=s.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(c.title)+' | Docvelio</title>');
 s=s.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+esc(c.description)+'">');
 const hreflang=langs.map(code=>'<link rel="alternate" hreflang="'+code+'" href="'+url(code,t.slug)+'">').join('')+'<link rel="alternate" hreflang="x-default" href="'+url('en',t.slug)+'">';
 s=s.replace(/<link rel="canonical" href="[^"]*">(?:<link rel="alternate"[^>]*>)+/,'<link rel="canonical" href="'+u+'">'+hreflang);
 const seoMeta='<meta property="og:type" content="website"><meta property="og:url" content="'+u+'"><meta property="og:title" content="'+esc(c.title)+'"><meta property="og:description" content="'+esc(c.description)+'"><meta name="twitter:card" content="summary">';
 s=s.replace('<link rel="icon"',seoMeta+'<link rel="icon"');
 const graph={'@context':'https://schema.org','@graph':[
 {'@type':'WebApplication',name:c.title,url:u,description:c.description,inLanguage:lang,applicationCategory:'MultimediaApplication',operatingSystem:'Web browser',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@type':'Organization',name:'Docvelio',url:host+'/'}},
 {'@type':'BreadcrumbList',itemListElement:[{ '@type':'ListItem',position:1,name:l[6],item:host+prefix(lang)},{'@type':'ListItem',position:2,name:l[7],item:host+prefix(lang)+'image-editor/'},{'@type':'ListItem',position:3,name:c.title,item:u}]}
 ]};
 s=s.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'<script type="application/ld+json">'+JSON.stringify(graph).replace(/</g,'\\u003c')+'</script>');
 s=s.replace(/(<select id="language-select"[^>]*data-page=")[^"]*"/,'$1image-tools/'+t.slug+'"');
 s=s.replace(/<section class="im-hero">[\s\S]*?<\/section>/,hero);
 let step=0;s=s.replace(/<fieldset>/g,()=>'<fieldset id="im-step-'+ids[step++]+'"'+(ids[step-1]===(t.active==='flip'?'rotate':t.active)?' data-current="true"':'')+'>');
 if(step!==5)throw Error('Unexpected number of fieldsets');
 s=s.replace('<div class="im-controls"><h2>'+esc((require('./add-image-studio.cjs').translations)[lang][28])+'</h2>','<div class="im-controls" id="im-step-export"'+(['convert','target'].includes(t.active)?' data-current="true"':'')+'><h2>'+esc((require('./add-image-studio.cjs').translations)[lang][28])+'</h2>');
 s=s.replace('<section class="im-studio" data-image-studio','<section class="im-studio" data-image-studio data-image-task="'+t.slug+'"');
 s=s.replace(/<section class="im-guide">[\s\S]*?<\/section>/,taskArticle(lang,idx));
 if(!s.includes('data-image-task="'+t.slug+'"')||!s.includes('im-task-article')||!s.includes('href="'+u+'"'))throw Error('Bad image SEO page '+u);
 return s;
}
function main(){
 if(topics.length!==8)throw Error('Expected eight image tasks');
 const source={};
 for(const lang of langs){source[lang]=fs.readFileSync(path.join(root,lang==='en'?'':lang,'image-editor','index.html'),'utf8');}
 let count=0;
 for(const lang of langs)for(let i=0;i<topics.length;i++){
  const f=path.join(root,lang==='en'?'':lang,'image-tools',topics[i].slug,'index.html');
  fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,topicPage(source[lang],lang,i));count++;
 }
 for(const lang of langs)for(const route of ['image-editor/index.html','index.html','guides/index.html']){
  const f=path.join(root,lang==='en'?'':lang,route),s=fs.readFileSync(f,'utf8');
  if(s.includes('data-image-seo-links="1"'))throw Error('SEO build unexpectedly rerun '+f);
  const title=(lang==='en'?'Image editing tools':locales[lang].labels[7]);
  const n='<section class="im-task-discovery" data-image-seo-links="1"><div class="container"><h2>'+esc(title)+'</h2>'+cardGrid(lang)+'</div></section>';
  fs.writeFileSync(f,s.replace('</main>',n+'</main>'));
 }
 // Avoid two near-duplicate compressor landing pages. Link the existing image
 // compressor to the specific goal-oriented target-KB task page.
 for(const lang of langs){
  const f=path.join(root,lang==='en'?'':lang,'tools','compress-image','index.html');
  const s=fs.readFileSync(f,'utf8'),c=taskText(lang,5);
  const p='<aside class="im-task-crosslink"><a href="'+prefix(lang)+'image-tools/reduce-image-size-kb/">'+esc(c.title)+'</a> · '+esc(c.description)+'</aside>';
  fs.writeFileSync(f,s.replace('</main>',p+'</main>'));
 }
 const map=path.join(root,'sitemap.xml');
 let xml=fs.readFileSync(map,'utf8');
 if((xml.match(/<loc>/g)||[]).length!==440)throw Error('Expected base 440 URLs before adding image SEO pages');
 let extra='';
 for(const lang of langs)for(const t of topics){
  extra+='  <url>\n    <loc>'+xmlEsc(url(lang,t.slug))+'</loc>\n';
  for(const other of langs)extra+='    <xhtml:link rel="alternate" hreflang="'+other+'" href="'+xmlEsc(url(other,t.slug))+'"/>\n';
  extra+='    <xhtml:link rel="alternate" hreflang="x-default" href="'+xmlEsc(url('en',t.slug))+'"/>\n  </url>\n';
 }
 xml=xml.replace('</urlset>',extra+'</urlset>');
 fs.writeFileSync(map,xml);
 const all=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 if(count!==80||all.length!==520||new Set(all).size!==520)throw Error('Image SEO page/sitemap mismatch');
 fs.writeFileSync(path.join(root,'sitemap.txt'),[...all].sort().join('\n')+'\n');
 console.log('IMAGE SEO: 80 localized task pages, 8 distinct functional search intents, 520 sitemap URLs.');
}
if(require.main===module)main();
module.exports={main,taskText,topicPage};
