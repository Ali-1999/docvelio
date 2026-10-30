/* Verify live HTTP and DNS externally; Google indexing still needs Search Console. */
'use strict';
const {resolve4,resolve6}=require('node:dns').promises;
const fs=require('node:fs');
const root='https://docvelio.com',host='docvelio.com';
const expectedUrls=581; // 580 localized pages + /wheel-of-names/ after final build.
const pages=['/','/tools/edit-pdf/','/image-editor/','/image-tools/resize-image/','/cbm-calculator/','/shipping-tools/volumetric-weight-calculator/','/blog/','/wheel-of-names/','/ar/','/es/image-tools/resize-image/'];
const results=[],failures=[];
function problem(s){failures.push(s);console.error('FAIL: '+s);}
async function request(url){
 const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(18000),
  headers:{'user-agent':'DocvelioIndexingMonitor/1.0','accept':'text/html,application/xml,text/plain;q=0.8,*/*;q=0.1'}});
 return {status:response.status,final:response.url,contentType:response.headers.get('content-type')||'',
  robots:response.headers.get('x-robots-tag')||'',server:response.headers.get('server')||'',ray:response.headers.get('cf-ray')||'',mitigation:response.headers.get('cf-mitigated')||'',body:await response.text()};
}
async function probe(path,kind){
 const url=root+path;
 try{
  const r=await request(url);
  results.push([kind,path,r.status,r.final+'; '+r.contentType]);
  if(r.status>=400){results.push(['HTTP diagnostics',path,r.status,'server='+r.server+'; cf-ray='+r.ray+'; cf-mitigated='+r.mitigation+'; first-text='+r.body.replace(/<[^>]*>/g,' ').replace(/\\s+/g,' ').slice(0,260)]);}
  if(r.status!==200)problem(path+' HTTP '+r.status+' (wanted 200)');
  if(r.final!==url)problem(path+' unexpectedly redirects to '+r.final);
  if(r.robots.toLowerCase().includes('noindex'))problem(path+' has X-Robots-Tag noindex');
  if(kind==='HTML'){
   if(!r.contentType.includes('text/html'))problem(path+' is not served as HTML');
   if(!r.body.includes('<h1')||!r.body.includes('<main'))problem(path+' lacks server-rendered content');
   const found=[...r.body.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)]
      .map(x=>x[0].match(/href=["']([^"']+)["']/)?.[1]);
   if(found.length!==1||found[0]!==url)problem(path+' canonical is '+JSON.stringify(found));
   if(/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(r.body))problem(path+' is marked noindex');
  }
  if(kind==='ROBOTS'){
   if(!/sitemap:\s*https:\/\/docvelio\.com\/sitemap\.xml/i.test(r.body))problem('robots.txt missing XML sitemap URL');
   if(!/sitemap:\s*https:\/\/docvelio\.com\/sitemap\.txt/i.test(r.body))problem('robots.txt missing accessible text sitemap fallback');
   if(/Disallow:\s*\/\s*(?:\r?\n|$)/i.test(r.body))problem('robots.txt blocks entire site');
  }
  if(kind==='TEXT_SITEMAP'){
   const list=r.body.split(/\r?\n/).filter(Boolean);
   if(list.length!==expectedUrls)problem('Live TXT sitemap has '+list.length+' URLs; '+expectedUrls+' expected');
   if(!list.includes(root+'/cbm-calculator/'))problem('CBM missing from TXT sitemap');
  }
  if(kind==='SITEMAP'){
   const count=(r.body.match(/<loc>/g)||[]).length;
   if(count!==expectedUrls)problem('Live sitemap has '+count+' URLs instead of current '+expectedUrls);
   if(!/(application|text)\/xml/.test(r.contentType))problem('Incorrect XML MIME type');
   if(!r.body.includes('<loc>'+root+'/cbm-calculator/</loc>'))problem('CBM URL missing from live sitemap');
  }
 }catch(e){
  const reason=e.cause?.code||e.message;
  results.push([kind,path,'unreachable',reason]);problem(path+' failed external request: '+reason);
 }
}
async function run(){
 let addresses=[];
 for(const [type,fn] of [['A',resolve4],['AAAA',resolve6]]){
  try{const res=await fn(host);addresses=addresses.concat(res);results.push(['DNS '+type,host,'OK',res.join(', ')]);}
  catch(e){results.push(['DNS '+type,host,'unavailable',e.code||e.message]);}
 }
 if(!addresses.length)problem('DNS: no public A/AAAA found. Check Cloudflare domain DNS configuration.');
 await probe('/robots.txt','ROBOTS');await probe('/sitemap.xml','SITEMAP');await probe('/sitemap.txt','TEXT_SITEMAP');
 for(const path of pages)await probe(path,'HTML');
 try{const r=await request(root+'/__docvelio_seo_missing_404_probe__/');
  results.push(['404','/missing/',r.status,r.final]);
  if(r.status!==404&&r.status!==410)problem('Nonexistent page HTTP '+r.status+' is a soft-404 risk.');
 }catch(e){problem('404 probe failed: '+(e.cause?.code||e.message));}
 let markdown='## Docvelio Live Indexability\n\n| Type | URL | Status | Details |\n|---|---|---|---|\n';
 for(const [type,url,status,detail] of results)markdown+='| '+type+' | '+url+' | '+status+' | '+String(detail).replaceAll('|',';').slice(0,160)+' |\n';
 markdown+='\nResult: '+(failures.length?'FAIL ('+failures.length+' issues)':'PASS (technical reachability, not Google indexing)')+'\n';
 if(failures.length)markdown+='\n'+failures.map(x=>'- '+x).join('\n')+'\n';
 console.log(markdown);
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdown);
 if(failures.length)process.exitCode=1;
}
run().catch(e=>{console.error(e);process.exitCode=1;});
