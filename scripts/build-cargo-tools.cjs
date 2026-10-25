/* Docvelio: build functional localized CBM/shipping calculator landing pages.
 * Runs AFTER image-seo-pages.cjs and keeps existing routes unchanged.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','public'),host='https://docvelio.com';
const topics=require('./cargo-content-en.cjs'),translations=require('./cargo-locales.cjs');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const enLabels=['Cargo calculator','Carton dimensions and quantities','Shipment results','Containers','Add cargo row','Reset example','Download CSV','Length','Width','Height','Unit','Weight per carton','Weight unit','Quantity','Product','Remove','Dimensional divisor (cm³/kg)','Assumed fill (%)','Total CBM','Cubic feet','Actual weight','Dimensional weight','Est. chargeable weight','Number of cartons','Calculation','Important note','Related shipping tools','Example values — replace with your own measurements.'];
const prefix=lang=>lang==='en'?'/':'/'+lang+'/';
const rel=t=>t.root?'cbm-calculator/':'shipping-tools/'+t.slug+'/';
const url=(lang,t)=>host+prefix(lang)+rel(t);
const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const escXML=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const json=o=>JSON.stringify(o).replace(/</g,'\\u003c');
function translated(lang,topic,index){
 if(lang==='en')return {title:topic.title,desc:topic.desc,h1:topic.h1,intro:topic.intro,para:topic.para,steps:topic.steps,faq:topic.faq,ui:enLabels};
 const o=translations[lang];
 if(!o||o.topics.length!==topics.length||o.ui.length!==enLabels.length)throw Error('Missing cargo localization '+lang);
 const [title,desc,how,limits]=o.topics[index];
 return {title,desc,h1:title,intro:desc,para:[[title,how],[o.ui[25],limits]],steps:[o.ui[0]+': '+how,o.ui[27],limits],faq:[],ui:o.ui};
}
function hreflang(topic){return langs.map(l=>'<link rel="alternate" hreflang="'+l+'" href="'+url(l,topic)+'">').join('')+
 '<link rel="alternate" hreflang="x-default" href="'+url('en',topic)+'">';}
function nav(html,lang){
 const route=prefix(lang)+'cbm-calculator/';
 const label=lang==='ar'?'حاسبة CBM':lang==='hi'?'CBM कैलकुलेटर':lang==='zh'?'CBM 计算器':lang==='de'?'CBM-Rechner':lang==='fr'?'Calculateur CBM':lang==='es'?'Calculadora CBM':lang==='pt'?'Calculadora CBM':lang==='tr'?'CBM Hesaplayıcı':lang==='id'?'Kalkulator CBM':'CBM Calculator';
 const regex=/(<div class="links" id="dv-primary-nav">)([\s\S]*?)(<\/div>)/;
 if(!regex.test(html))throw Error('Primary navigation missing');
 return html.replace(regex,(whole,a,b,c)=>b.includes('href="'+route+'"')?whole:a+b+'<a href="'+route+'">'+esc(label)+'</a>'+c);
}
function links(lang,excluded){
 return '<nav class="cargo-links" aria-label="Cargo calculations">'+topics.filter(t=>t.slug!==excluded).map((t,i)=>{
  const actualIndex=topics.indexOf(t),tr=translated(lang,t,actualIndex);
  return '<a href="'+prefix(lang)+rel(t)+'">'+esc(tr.title)+' ↗</a>';
 }).join('')+'</nav>';
}
const field=(name,label,type='number',defaultValue='',min='0')=>{
 return '<td><input type="'+type+'" data-field="'+name+'" aria-label="'+esc(label)+'" value="'+esc(defaultValue)+'"'+
 (type==='number'?' min="'+min+'" step="any" inputmode="decimal"':' maxlength="80"')+'></td>';
};
const select=(name,label,opts)=>'<td><select data-field="'+name+'" aria-label="'+esc(label)+'">'+opts.map(([value,text])=>'<option value="'+esc(value)+'">'+esc(text)+'</option>').join('')+'</select></td>';
function form(lang,c){
 const ui=c.ui;
 const row='<tr data-cargo-row>'+field('name',ui[14],'text','Example cartons')+field('length',ui[7],'number','60','0.001')+
  field('width',ui[8],'number','40','0.001')+field('height',ui[9],'number','40','0.001')+
  select('unit',ui[10],[['cm','cm'],['mm','mm'],['m','m'],['in','in'],['ft','ft'],['yd','yd']])+
  field('weight',ui[11],'number','25','0')+select('weightUnit',ui[12],[['kg','kg'],['g','g'],['lb','lb']])+
  field('quantity',ui[13],'number','200','1')+'<td><button type="button" class="cargo-btn danger" data-remove aria-label="'+esc(ui[15])+'">×</button></td></tr>';
 const metricCard=(id,label)=>'<div class="cargo-kpi"><small>'+esc(label)+'</small><strong id="'+id+'">—</strong></div>';
 return '<section class="cargo-layout" data-cargo-calculator data-lang="'+lang+'"><div class="container">'+
 '<div class="cargo-panel"><div class="cargo-heading"><h2>'+esc(ui[1])+'</h2><p>'+esc(ui[27])+'</p></div>'+
 '<div class="cargo-table-wrap"><table class="cargo-table"><thead><tr>'+[ui[14],ui[7],ui[8],ui[9],ui[10],ui[11],ui[12],ui[13],ui[15]].map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead>'+
 '<tbody id="cargo-lines"></tbody></table></div><template id="cargo-row-template">'+row+'</template>'+
 '<div class="cargo-actions"><button type="button" id="cargo-add" class="cargo-btn">'+esc(ui[4])+'</button><button type="button" id="cargo-clear" class="cargo-btn">'+esc(ui[5])+'</button><button type="button" id="cargo-export" class="cargo-btn primary" disabled>'+esc(ui[6])+'</button></div>'+
 '<div class="cargo-options"><label for="cargo-divisor">'+esc(ui[16])+'<input id="cargo-divisor" type="number" inputmode="decimal" step="1" min="1000" max="100000" value="5000"></label>'+
 '<label for="cargo-utilisation">'+esc(ui[17])+'<select id="cargo-utilisation"><option value="70">70%</option><option value="80">80%</option><option value="85" selected>85%</option><option value="90">90%</option><option value="95">95%</option><option value="100">100% (theoretical)</option></select></label></div>'+
 '<div class="cargo-note" role="status" aria-live="polite" id="cargo-notice"></div></div>'+
 '<div id="cargo-results" hidden><div class="cargo-panel"><div class="cargo-heading"><h2>'+esc(ui[2])+'</h2><span>'+esc(ui[24])+': <span id="cargo-formula"></span></span></div>'+
 '<div class="cargo-kpis">'+metricCard('cargo-cbm',ui[18])+metricCard('cargo-cft',ui[19])+metricCard('cargo-kg',ui[20])+metricCard('cargo-lb',ui[20]+' (lb)')+metricCard('cargo-dim',ui[21])+metricCard('cargo-chargeable',ui[22])+metricCard('cargo-quantity',ui[23])+'</div></div>'+
 '<div class="cargo-panel"><h2>'+esc(ui[3])+'</h2><div class="cargo-containers" id="cargo-containers"></div>'+
 '<p class="cargo-note">'+esc(lang==='en'?'Container figures are volume-only planning estimates: they ignore item fit, pallets, load securing, payload limits, door clearance and carrier-specific equipment. Actual chargeable weight also depends on contract rules.':ui[25]+': '+ui[27])+'</p></div></div></div></section>';
}
function content(lang,t,i){
 const c=translated(lang,t,i),ui=c.ui;
 const steps='<ol>'+c.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>';
 const prose=c.para.map(([title,p])=>'<h2>'+esc(title)+'</h2><p>'+esc(p)+'</p>').join('');
 const faqs=c.faq.length?'<h2>Frequently asked questions</h2>'+c.faq.map(([q,a])=>'<h3>'+esc(q)+'</h3><p>'+esc(a)+'</p>').join(''):'';
 const cites=lang==='en'?'<p><strong>Technical reference:</strong> <a href="https://www.dsv.com/en-us/our-solutions/modes-of-transport/sea-freight/shipping-container-dimensions/dry-container" rel="noopener noreferrer">DSV container dimension guide</a> and <a href="https://dct.dhl.com/help" rel="noopener noreferrer">DHL volumetric-weight explanation</a>. Published equipment and pricing factors vary.</p>':'';
 return '<section class="cargo-seo"><div class="container cargo-copy"><h2>'+esc(ui[24])+': '+esc(c.h1)+'</h2>'+
 '<p>'+esc(c.intro)+'</p><h2>'+esc(ui[0])+'</h2>'+steps+prose+faqs+cites+
 '<h2>'+esc(ui[26])+'</h2>'+links(lang,t.slug)+'</div></section>';
}
function render(lang,t,i,header,footer){
 const c=translated(lang,t,i),u=url(lang,t),rootPath=prefix(lang),currentRel=rel(t);
 const crumbs='<nav class="cargo-crumb" aria-label="Breadcrumb"><a href="'+rootPath+'">'+esc(c.ui[0])+'</a><span aria-hidden="true">/</span><a href="'+rootPath+'cbm-calculator/">CBM</a><span aria-hidden="true">/</span><span>'+esc(c.h1)+'</span></nav>';
 const graph={'@context':'https://schema.org','@graph':[
  {'@type':'WebApplication',name:'Docvelio '+c.title,url:u,description:c.desc,applicationCategory:'BusinessApplication',operatingSystem:'Web browser',inLanguage:lang,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@type':'Organization',name:'Docvelio',url:host+'/'}},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Docvelio',item:host+rootPath},{'@type':'ListItem',position:2,name:'CBM Calculator',item:host+rootPath+'cbm-calculator/'},{'@type':'ListItem',position:3,name:c.h1,item:u}]}
 ]};
 const head='<!doctype html><html lang="'+lang+'"'+(lang==='ar'?' dir="rtl"':'')+'><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(c.title)+' | Docvelio</title><meta name="description" content="'+esc(c.desc)+'"><link rel="canonical" href="'+u+'">'+hreflang(t)+
 '<meta name="theme-color" content="#2463eb"><meta property="og:type" content="website"><meta property="og:url" content="'+u+'"><meta property="og:title" content="'+esc(c.title)+'"><meta property="og:description" content="'+esc(c.desc)+'"><meta property="og:image" content="'+host+'/assets/docvelio-social-card.svg">'+
 '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="'+host+'/assets/docvelio-social-card.svg">'+
 '<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/style.css"><link rel="stylesheet" href="/assets/locales.css"><link rel="stylesheet" href="/assets/shared-header.css"><link rel="stylesheet" href="/assets/design-system.css"><link rel="stylesheet" href="/assets/cookie-consent.css"><link rel="stylesheet" href="/assets/social-sharing.css"><link rel="stylesheet" href="/assets/cargo-calculator.css">'+
 '<script type="application/ld+json">'+json(graph)+'</script><script defer src="/assets/site.js"></script><script defer src="/assets/i18n.js"></script><script defer src="/assets/design-system.js"></script><script defer src="/assets/cookie-consent.js"></script><script defer src="/assets/social-sharing.js"></script><script defer src="/assets/cargo-core.js"></script><script defer src="/assets/cargo-calculator.js"></script></head><body><a class="skip" href="#content">Skip to content</a>';
 const hero='<section class="cargo-hero"><div class="container">'+crumbs+'<h1>'+esc(c.h1)+'</h1><p>'+esc(c.intro)+'</p></div></section>';
 const page=nav(header,lang).replace(/data-page="[^"]*"/,'data-page="'+currentRel.slice(0,-1)+'"');
 return head+page+'<main id="content">'+hero+form(lang,c)+content(lang,t,i)+'</main>'+footer+'</body></html>';
}
function discovery(lang){
 const l=lang==='en'?enLabels:translations[lang].ui;
 return '<section class="cargo-discovery" data-cargo-discovery="1"><div class="container"><h2>'+esc(l[0])+'</h2><p>'+esc(l[27])+'</p>'+links(lang)+'</div></section>';
}
function walk(dir,fn){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,ent.name);if(ent.isDirectory())walk(f,fn);else if(ent.name.endsWith('.html'))fn(f);}}
function main(){
 if(topics.length!==6)throw Error('Six cargo topics expected');
 const headers={},footers={};
 for(const lang of langs){
  const s=fs.readFileSync(path.join(root,lang==='en'?'':lang,'index.html'),'utf8');
  headers[lang]=s.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0];
  footers[lang]=s.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0];
  if(!headers[lang]||!footers[lang])throw Error('Missing site shell '+lang);
 }
 let created=0;
 for(const lang of langs)topics.forEach((t,i)=>{
  const f=path.join(root,lang==='en'?'':lang,rel(t),'index.html');
  fs.mkdirSync(path.dirname(f),{recursive:true});
  fs.writeFileSync(f,render(lang,t,i,headers[lang],footers[lang]));created++;
 });
 let adapted=0;
 walk(root,file=>{
  const relative=path.relative(root,file).replaceAll('\\','/');
  if(relative==='404.html')return;
  const seg=relative.split('/'),lang=langs.slice(1).includes(seg[0])?seg.shift():'en',route=seg.join('/');
  let s=fs.readFileSync(file,'utf8');
  if(!s.includes('data-dv-unified="1"'))throw Error('Header missing '+relative);
  s=nav(s,lang);
  if(route==='index.html'||route==='guides/index.html'){
    if(!s.includes('data-cargo-discovery="1"'))s=s.replace('</main>',discovery(lang)+'</main>');
    if(!s.includes('href="/assets/cargo-calculator.css"'))s=s.replace('</head>','<link rel="stylesheet" href="/assets/cargo-calculator.css"></head>');
  }
  fs.writeFileSync(file,s);
  adapted++;
 });
 let xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
 if((xml.match(/<loc>/g)||[]).length!==520)throw Error('Expected 520 base URLs before adding cargo');
 let extra='';
 for(const lang of langs)for(const t of topics){
  extra+='  <url>\n    <loc>'+escXML(url(lang,t))+'</loc>\n';
  for(const other of langs)extra+='    <xhtml:link rel="alternate" hreflang="'+other+'" href="'+escXML(url(other,t))+'"/>\n';
  extra+='    <xhtml:link rel="alternate" hreflang="x-default" href="'+escXML(url('en',t))+'"/>\n  </url>\n';
 }
 xml=xml.replace('</urlset>',extra+'</urlset>');
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 if(created!==60||urls.length!==580||new Set(urls).size!==580)throw Error('Bad cargo URLs in sitemap');
 fs.writeFileSync(path.join(root,'sitemap.xml'),xml);
 fs.writeFileSync(path.join(root,'sitemap.txt'),[...urls].sort().join('\n')+'\n');
 console.log('CARGO BUILD: '+created+' localized freight pages, '+adapted+' site nav updates, 580 canonical sitemap URLs.');
}
if(require.main===module)main();
module.exports={main,render,translated};
