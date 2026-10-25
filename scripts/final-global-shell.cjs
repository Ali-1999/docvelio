'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..','public');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const labels={
 en:['PDF Tools','Image Tools','Calculators','Fun Tools','Resources','All PDF Tools','Edit PDF','Merge PDF','Compress PDF','Word Editor','Image Studio','Resize Image','Crop Image','Convert Image','CBM Calculator','Volumetric Weight','Spin the Wheel','Guides','Blog','About','Contact','Language','Menu'],
 es:['Herramientas PDF','Imágenes','Calculadoras','Diversión','Recursos'],fr:['Outils PDF','Images','Calculateurs','Loisirs','Ressources'],de:['PDF-Tools','Bilder','Rechner','Zufall','Ressourcen'],pt:['Ferramentas PDF','Imagens','Calculadoras','Diversão','Recursos'],ar:['أدوات PDF','أدوات الصور','الحاسبات','أدوات ممتعة','الموارد'],hi:['PDF टूल','इमेज टूल','कैलकुलेटर','मज़ेदार टूल','संसाधन'],id:['Alat PDF','Alat Gambar','Kalkulator','Alat Acak','Sumber'],tr:['PDF Araçları','Görseller','Hesaplayıcılar','Eğlence','Kaynaklar'],zh:['PDF 工具','图片工具','计算器','趣味工具','资源']
};
const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const options=[['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['ar','العربية'],['hi','हिन्दी'],['id','Bahasa Indonesia'],['tr','Türkçe'],['zh','简体中文']];
const a=(href,name)=>'<a href="'+href+'">'+esc(name)+'</a>';
function menu(title,items){return '<details class="dv-mega"><summary>'+esc(title)+'<span aria-hidden="true" class="dv-chevron">⌄</span></summary><div class="dv-mega-panel">'+items.map(x=>a(...x)).join('')+'</div></details>';}
function header(lang,route){
 const l=[...labels.en];(labels[lang]||[]).forEach((v,i)=>l[i]=v);
 const base=lang==='en'?'/':'/'+lang+'/';
 const local=r=>base+r;
 const groups=[
 menu(l[0],[[local(''),'All Tools'],[local('tools/edit-pdf/'),l[6]],[local('tools/merge-pdf/'),l[7]],[local('tools/compress-pdf/'),l[8]],[local('tools/word-editor/'),l[9]]]),
 menu(l[1],[[local('image-editor/'),l[10]],[local('image-tools/resize-image/'),l[11]],[local('image-tools/crop-image/'),l[12]],[local('image-tools/convert-image/'),l[13]]]),
 menu(l[2],[[local('cbm-calculator/'),l[14]],[local('shipping-tools/volumetric-weight-calculator/'),l[15]],[local('shipping-tools/container-capacity-calculator/'),'Container Capacity']]),
 menu(l[3],[['/wheel-of-names/',l[16]]]),
 menu(l[4],[[local('guides/'),l[17]],[local('blog/'),l[18]],[local('about/'),l[19]],[local('contact/'),l[20]]])
 ].join('');
 return '<header class="header dv-site-header dv-global-header" data-dv-unified="1"><nav class="container dv-global-nav" aria-label="Main navigation">'+
 '<a class="brand dv-global-brand" href="'+base+'" aria-label="Docvelio"><span class="brandmark"><img src="/assets/docvelio-logo-icon.svg" width="34" height="34" alt=""></span><span>Docvelio<span class="branddot">.</span></span></a>'+
 '<div class="links dv-global-links" id="dv-primary-nav">'+groups+'</div>'+
 '<div class="nav-actions dv-global-actions"><label class="dv-language-label" for="language-select"><span aria-hidden="true">🌐</span><span class="sr-only">'+esc(l[21])+'</span><select id="language-select" aria-label="'+esc(l[21])+'" data-page="'+esc(route)+'">'+options.map(([v,n])=>'<option value="'+v+'"'+(v===lang?' selected':'')+'>'+n+'</option>').join('')+'</select></label>'+
 '<button class="mobile-toggle dv-global-toggle" type="button" aria-label="'+esc(l[22])+'" aria-expanded="false" aria-controls="dv-primary-nav">☰</button></div></nav></header>';
}
const footers={};
for(const lang of langs){
 const source=path.join(root,lang==='en'?'index.html':path.join(lang,'index.html'));
 const html=fs.readFileSync(source,'utf8');
 const match=html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0];
 if(!match)throw Error('Localized footer missing: '+lang);
 footers[lang]=match;
}
let count=0;
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,ent.name);if(ent.isDirectory()){walk(file);continue;}
 if(ent.name!=='index.html'&&ent.name!=='404.html')continue;
 let h=fs.readFileSync(file,'utf8'),rel=path.relative(root,file).replaceAll('\\','/');
 const parts=rel.split('/');const lang=langs.includes(parts[0])&&parts[0]!=='en'?parts.shift():'en';
 const route=parts.slice(0,-1).join('/');
 if(!/<header\b[^>]*>[\s\S]*?<\/header>/i.test(h))throw Error('Header missing: '+rel);
 h=h.replace(/<header\b[^>]*>[\s\S]*?<\/header>/i,header(lang,route));
 if(/<footer\b[^>]*>[\s\S]*?<\/footer>/i.test(h))h=h.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i,footers[lang]);
 else throw Error('Footer missing: '+rel);
 if(!h.includes('/assets/global-navigation.css'))h=h.replace('</head>','<link rel="stylesheet" href="/assets/global-navigation.css"></head>');
 if(!h.includes('/assets/global-navigation.js'))h=h.replace('</body>','<script defer src="/assets/global-navigation.js"></script></body>');
 fs.writeFileSync(file,h);count++;
}}
walk(root);
if(count<490)throw Error('Unexpected page count: '+count);
console.log('FINAL GLOBAL SHELL: '+count+' pages receive categorised header and identical footer.');
