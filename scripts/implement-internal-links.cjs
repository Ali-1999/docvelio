/* Apply the 285 approved editorial internal links during the Docvelio build.
 * The source map is scripts/internal-links-map.json. No browser JS or external packages.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const plan=require('./internal-links-map.json');
const START='<!-- DV_CONTEXT_LINKS_BEGIN -->',END='<!-- DV_CONTEXT_LINKS_END -->';
const words={
en:['Related next steps','For this task, you can use','For another useful step, consider','Review the result before sharing it.'],
es:['Pasos relacionados','Para continuar con esta tarea, puede usar','Para otra operación relacionada, pruebe','Revise el resultado antes de compartirlo.'],
fr:['Étapes complémentaires','Pour poursuivre cette tâche, utilisez','Pour une autre étape, essayez','Vérifiez le résultat avant de le partager.'],
de:['Passende nächste Schritte','Für diesen Schritt können Sie Folgendes verwenden:','Für eine weitere Aufgabe nutzen Sie','Prüfen Sie das Ergebnis vor der Weitergabe.'],
pt:['Próximas etapas','Para continuar esta tarefa, utilize','Para outra operação relacionada, experimente','Confira o resultado antes de compartilhar.'],
ar:['خطوات أخرى مفيدة','لمتابعة هذه المهمة، استخدم','ولعملية أخرى مرتبطة بها، جرّب','راجع النتيجة قبل مشاركتها.'],
hi:['अगले उपयोगी चरण','इस काम के लिए इस्तेमाल करें','संबंधित कार्य के लिए आज़माएँ','साझा करने से पहले परिणाम जाँचें।'],
id:['Langkah terkait','Untuk melanjutkan tugas ini, gunakan','Untuk tugas terkait lainnya, coba','Periksa hasilnya sebelum dibagikan.'],
tr:['İlgili sonraki adımlar','Bu göreve devam etmek için kullanın','İlgili başka bir işlem için deneyin','Paylaşmadan önce sonucu kontrol edin.'],
zh:['相关后续操作','要继续完成此任务，可使用','如需其他相关操作，请尝试','分享前请检查输出结果。']
};
const actions={
'merge-pdf':'combine separate PDFs','split-pdf':'extract selected PDF pages','organize-pdf':'reorder PDF pages',
'remove-pages':'remove unwanted PDF pages','rotate-pdf':'correct sideways pages','edit-pdf':'annotate a PDF',
'view-pdf':'review PDF pages','compress-pdf':'create a smaller rasterised PDF (check text quality)',
'pdf-to-jpg':'export PDF pages as JPG','pdf-to-png':'export PDF pages as PNG',
'pdf-to-text':'extract selectable text rather than scanned-image OCR','sign-pdf':'add a visible signature',
'fill-pdf':'fill interactive PDF forms','images-to-pdf':'combine images into a PDF',
'add-image-to-pdf':'insert an image on a page','watermark-pdf':'add a watermark',
'word-editor':'edit a Word document','compress-image':'reduce an image file size',
'resize-image':'change image dimensions','crop-image':'trim an image',
'convert-image':'change image format','reduce-image-size-kb':'lower image file size',
'cbm-calculator':'calculate shipment volume','cubic-meter-calculator':'calculate cubic metres',
'cubic-feet-calculator':'calculate cubic feet','volumetric-weight-calculator':'estimate dimensional weight',
'container-capacity-calculator':'estimate container capacity','multiple-carton-cbm-calculator':'total mixed cartons',
'euro-pallet-stacking-calculator':'plan pallet layers','a4-a3-dpi-pixel-calculator':'convert paper dimensions to pixels',
'bleed-print-margin-calculator':'prepare print bleed and safe margins',
'sepa-qr-code-generator':'generate a SEPA payment QR code',
'rf-creditor-reference-generator':'create an ISO 11649 payment reference',
'excel-formula-generator':'generate an Excel formula','image-editor':'edit images','wheel-of-names':'pick a random option'
};
function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function textOnly(x){return String(x).replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();}
function langOf(x){const m=/^\/(es|fr|de|pt|ar|hi|id|tr|zh)\//.exec(x);return m?m[1]:'en';}
function routeFile(url){
 if(!/^\/(?:[a-z0-9-]+\/)*$/.test(url))return null;
 const target=path.resolve(root,url.slice(1),'index.html');
 return target.startsWith(root+path.sep)?target:null;
}
function getMain(html){const m=/<main\b[^>]*>/i.exec(html),end=html.lastIndexOf('</main>');return m&&end>=m.index?{start:m.index+m[0].length,end}:null;}
function stripPrevious(html){
 const a=html.indexOf(START),b=html.indexOf(END);
 if(a<0&&b<0)return html;
 if(a<0||b<a)throw Error('Broken previous contextual-link markers');
 return html.slice(0,a)+html.slice(b+END.length);
}
function mainHas(main,dest){return main.includes('href="'+dest+'"')||main.includes("href='"+dest+"'");}
function targetAnchor(link,dest){
 const raw=String(link.anchor||'').trim();
 if(raw&&!/^LOCALISE:/i.test(raw))return raw.replace(/[\r\n]/g,' ').slice(0,110);
 const h1=/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(dest);
 return h1?textOnly(h1[1]).slice(0,110):raw.replace(/^LOCALISE:\s*/i,'');
}
function position(main,kind){
 let from=0;
 const patterns=kind==='Guide / blog'?
 [/<article\b[^>]*class=["'][^"']*dv-blog-article[^"']*["'][^>]*>/i,/<div\b[^>]*class=["'][^"']*container prose[^"']*["'][^>]*>/i]:
 [/<section\b[^>]*class=["'][^"']*dv-eu-guide[^"']*["'][^>]*>/i,
  /<section\b[^>]*class=["'][^"']*(?:cargo-seo|im-task-article)[^"']*["'][^>]*>/i,
  /<div\b[^>]*class=["'][^"']*prose[^"']*["'][^>]*>/i,
  /<section\b[^>]*class=["'][^"']*seo-help[^"']*["'][^>]*>/i];
 for(const re of patterns){const m=re.exec(main);if(m){from=m.index+m[0].length;break;}}
 const paragraphs=[...main.slice(from).matchAll(/<p(?:\s[^>]*)?>[\s\S]*?<\/p>/gi)]
 .filter(m=>!/\b(?:bread|breadcrumb|tiny|dv-eu-status)\b/i.test(m[0].slice(0,m[0].indexOf('>')+1))&&textOnly(m[0]).length>50);
 if(!paragraphs.length)return main.length;
 const selected=paragraphs[kind==='Guide / blog'&&paragraphs.length>1?1:0];
 return from+selected.index+selected[0].length;
}
function paragraph(items,lang){
 const w=words[lang]||words.en;
 const sentences=items.map((item,i)=>{
  const a='<a href="'+esc(item.link.target)+'">'+esc(item.anchor)+'</a>';
  if(lang==='en'){
   const slug=item.link.target.split('/').filter(Boolean).pop();
   return 'If you need to '+esc(actions[slug]||'complete a related task')+', use '+a+'.';
  }
  return esc(i===0?w[1]:w[2])+' '+a+'.';
 });
 return START+'<p class="dv-topic-followup" data-dv-topic-links="1"><strong>'+esc(w[0])+':</strong> '+sentences.join(' ')+' '+esc(w[3])+'</p>'+END;
}
function apply(html,links,getPage){
 html=stripPrevious(html);
 const range=getMain(html);
 if(!range)throw Error('Missing main element in source page');
 let main=html.slice(range.start,range.end);
 const added=[],already=[],missing=[];
 for(const link of links){
  const target=getPage(link.target);
  if(!target){missing.push(link);continue;}
  if(mainHas(main,link.target)){already.push(link);continue;}
  const anchor=targetAnchor(link,target);
  if(!anchor){missing.push(link);continue;}
  added.push({link,anchor});
 }
 if(!added.length)return {html,added:[],already,missing};
 const at=position(main,links[0].kind);
 main=main.slice(0,at)+paragraph(added,langOf(links[0].source))+main.slice(at);
 return {html:html.slice(0,range.start)+main+html.slice(range.end),added:added.map(x=>x.link),already,missing};
}
function main(){
 if(plan.version!==1||plan.total!==285||plan.links.length!==285)throw Error('Expected 285 editorial source-target placements.');
 const grouped=new Map();
 for(const l of plan.links){
  if(!routeFile(l.source)||!routeFile(l.target)||l.source===l.target)throw Error('Invalid mapped link '+JSON.stringify(l));
  if(!['P0','P1','P2'].includes(l.priority))throw Error('Invalid link priority');
  if(!grouped.has(l.source))grouped.set(l.source,[]);
  grouped.get(l.source).push(l);
 }
 const cache=new Map();
 function getPage(url){const f=routeFile(url);if(!f||!fs.existsSync(f))return null;
  if(!cache.has(url))cache.set(url,fs.readFileSync(f,'utf8'));
  return cache.get(url);
 }
 const report={planned:285,sourceCount:grouped.size,inserted:0,existing:0,missingSource:[],missingTarget:[],pages:[]};
 for(const [src,links] of grouped){
  const orig=getPage(src);
  if(orig===null){for(const l of links)report.missingSource.push({source:src,target:l.target,priority:l.priority});continue;}
  const result=apply(orig,links,getPage);
  if(result.html!==orig)fs.writeFileSync(routeFile(src),result.html,'utf8');
  report.inserted+=result.added.length;report.existing+=result.already.length;
  for(const l of result.missing)report.missingTarget.push({source:l.source,target:l.target,priority:l.priority});
  report.pages.push({source:src,added:result.added.length,already:result.already.length,missing:result.missing.length});
 }
 if(report.inserted+report.existing+report.missingSource.length+report.missingTarget.length!==285)throw Error('Link accounting mismatch');
 const output=path.resolve(__dirname,'../reports/internal-linking-build.json');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log('INTERNAL LINKS: '+report.inserted+' new contextual; '+report.existing+' existing; '+report.missingSource.length+' missing sources; '+report.missingTarget.length+' missing targets.');
 if(report.missingSource.length||report.missingTarget.length)console.warn('SKIPPED MISSING:',JSON.stringify([...report.missingSource,...report.missingTarget].slice(0,15)));
 return report;
}
if(require.main===module)main();
module.exports={apply,main,langOf,routeFile};
