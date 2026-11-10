/* Add the user-supplied Fazier launch badge to every Docvelio footer.
 * Runs after every page generator (including blogs, Excel and Europe utilities).
 * No third-party JavaScript, no clones, no stylesheet request, no layout shift.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../public');
const link='https://fazier.com/launches/docvelio.com';
const image='https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&amp;theme=neutral';
const start='<!-- DV_FAZIER_BADGE_START -->';
const end='<!-- DV_FAZIER_BADGE_END -->';
const badge=start+
 '<div class="dv-fazier-footer-badge" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px 16px;margin:0 auto;max-width:100%;text-align:center">'+
 '<a href="'+link+'" target="_blank" rel="noopener noreferrer" aria-label="Docvelio launched on Fazier" style="display:inline-flex;align-items:center;justify-content:center;max-width:100%">'+
 '<img src="'+image+'" width="120" height="44" alt="Docvelio launched on Fazier" loading="lazy" decoding="async" style="display:block;width:120px;max-width:100%;height:44px;object-fit:contain" />'+
 '</a></div>'+end;
function patch(html,location){
 // Idempotency for local post-build repeats. Never replace a different badge.
 const marker=new RegExp('<!-- DV_FAZIER_BADGE_START -->[\\s\\S]*?<!-- DV_FAZIER_BADGE_END -->','g');
 const without=html.replace(marker,'');
 if(location==='ali-hamza/index.html')return without;
 const all=without.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)||[];
 if(all.length!==1)throw Error('Expected exactly one footer at '+location+'; found '+all.length);
 if(without.includes('href="'+link+'"'))throw Error('Unmarked Fazier badge found: '+location);
 return without.replace(/<\/footer>/i,badge+'</footer>');
}
function walk(dir,out){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const f=path.join(dir,e.name);
  if(e.isDirectory())walk(f,out);
  else if(e.isFile()&&(e.name==='index.html'||e.name==='404.html'))out.push(f);
 }
 return out;
}
function main(){
 const pages=walk(root,[]);
 if(pages.length<490)throw Error('Unexpectedly few generated pages: '+pages.length);
 let count=0;
 for(const f of pages){
  const html=fs.readFileSync(f,'utf8');
  const next=patch(html,path.relative(root,f));
  if(next!==html)fs.writeFileSync(f,next,'utf8');
  count++;
 }
 console.log('FAZIER FOOTER: badge installed on '+count+' rendered pages, once per footer, all locales.');
 return count;
}
if(require.main===module)main();
module.exports={patch,main,link,image};
