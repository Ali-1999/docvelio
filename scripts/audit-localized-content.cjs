/* Report language-by-language content coverage without treating word count as ranking. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public'),out=path.resolve(__dirname,'../reports');
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
const strip=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:amp|nbsp|lt|gt|quot|#\d+|#x[\da-f]+);/gi,' ').replace(/\s+/g,' ').trim();
const rows=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,ent.name);if(ent.isDirectory())walk(file);else if(ent.name==='index.html'){const rel=path.relative(root,file).replaceAll('\\','/'),parts=rel.split('/'),lang=langs.includes(parts[0])&&parts[0]!=='en'?parts[0]:'en',html=fs.readFileSync(file,'utf8'),main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'',text=strip(main);if(main){const kind=rel.includes('/blog/')&&!rel.endsWith('blog/index.html')?'blog':rel.includes('/guides/')&&!rel.endsWith('guides/index.html')?'guide':/(^|\/)(tools|image-tools|calculators|shipping-tools)\//.test(rel)?'tool':'other';rows.push({path:rel,lang,kind,characters:[...text].length,words:text.split(/\s+/).filter(Boolean).length});}}}}
walk(root);
const stats={};for(const lang of langs){const subset=rows.filter(r=>r.lang===lang&&r.kind==='tool').map(r=>r.characters).sort((a,b)=>a-b);stats[lang]={toolPages:subset.length,medianCharacters:subset.length?subset[Math.floor((subset.length-1)/2)]:0};}
const thin=rows.filter(r=>(r.lang==='zh'&&r.kind==='guide'&&r.characters<700)||(r.lang!=='zh'&&r.lang!=='en'&&r.kind==='guide'&&r.characters<350)).sort((a,b)=>a.characters-b.characters);
fs.mkdirSync(out,{recursive:true});
const report={scope:'Generated HTML content length diagnostics; not a quality score or ranking factor.',pageCount:rows.length,toolMedianByLanguage:stats,guidePagesNeedingEditorialReview:thin};
fs.writeFileSync(path.join(out,'localized-content-quality.json'),JSON.stringify(report,null,2)+'\n');
const lines=['# Docvelio localized content coverage','', 'This report measures visible main-content length only. It does not assess translation accuracy, usefulness, search demand or ranking.','', '| Language | Tool pages | Median characters |','|---|---:|---:|',...langs.map(l=>'| '+l+' | '+stats[l].toolPages+' | '+stats[l].medianCharacters+' |'),'','## Guide pages for editorial review','',...(thin.length?thin.map(r=>'- '+r.path+' ('+r.characters+' characters)'):['- No pages below the configured review thresholds.']),'','## Important','', 'Do not add filler to meet a character threshold. Review intent, terminology, instructions, limitations and examples with a fluent editor.'];
fs.writeFileSync(path.join(out,'localized-content-quality.md'),lines.join('\n')+'\n');
console.log('LOCALIZED CONTENT AUDIT: '+rows.length+' pages; '+thin.length+' guide pages flagged for editorial review.');
