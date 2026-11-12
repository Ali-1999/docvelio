/* Final built-site AdSense preflight. Checks technical prerequisites, not approval.
 * Run AFTER install-adsense.cjs, install-ga4.cjs and all page generators.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const host='https://docvelio.com';
const publisher='pub-1566581424297065';
const client='ca-'+publisher;
const seller='google.com, '+publisher+', DIRECT, f08c47fec0942fa0';
const locales=['','es/','fr/','de/','pt/','ar/','hi/','id/','tr/','zh/'];
const failures=[],warnings=[],pages=[];
const bad=(problem)=>failures.push(problem);
const caution=(problem)=>warnings.push(problem);
const get=(relative)=>fs.readFileSync(path.join(root,relative),'utf8');
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())walk(file);
  else if(entry.name==='index.html')pages.push(file);
 }
}
const ads=get('ads.txt').trim().split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
if(ads.length!==1||ads[0]!==seller)bad('Root ads.txt does not contain the one verified owner-supplied Google seller line');
const robots=get('robots.txt');
if(!/User-agent:\s*\*/i.test(robots)||!/Allow:\s*\//i.test(robots)||/Disallow:\s*\/\s*(?:\r?\n|$)/i.test(robots))bad('robots.txt must allow crawlers');
if(!robots.includes(host+'/sitemap.xml'))bad('robots.txt missing sitemap location');
const sitemap=get('sitemap.xml');
if(!sitemap.includes('<loc>'+host+'/</loc>'))bad('Homepage absent from sitemap');
walk(root);
if(pages.length<580)bad('Unexpectedly few generated pages: '+pages.length);
let adsenseChecked=0,gaChecked=0,shortEnglish=0;
for(const file of pages){
 const rel=path.relative(root,file).replaceAll('\\','/');
 const html=fs.readFileSync(file,'utf8');
 const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||'';
 const adTags=[...head.matchAll(/<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*><\/script>/gi)];
 const accountTags=[...head.matchAll(/<meta\b[^>]*name=["']google-adsense-account["'][^>]*>/gi)];
 if(adTags.length!==0)bad('AdSense ad-delivery script must remain disabled until a certified CMP is configured: '+rel);
 if(accountTags.length!==1||!accountTags[0][0].includes(client))bad('AdSense ownership meta missing, duplicated or incorrect on '+rel);
 if(/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex/i.test(head))bad('Page has noindex: '+rel);
 const consentAt=head.indexOf('src="/assets/docvelio-ga4.js"');
 const adsenseAt=head.indexOf('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
 const gaAt=head.indexOf('www.googletagmanager.com/gtag/js?id=G-1RNSZ473TY');
 const optionalAt=head.indexOf('src="/assets/optional-analytics.js"');\n if(consentAt<0||optionalAt<0||gaAt<0)bad('GA4 consent initializer, optional analytics loader or Google tag missing: '+rel);
 if(adsenseAt>=0)bad('AdSense delivery tag unexpectedly present before certified CMP: '+rel);
 if(gaAt>=0&&consentAt>gaAt)bad('Consent defaults load after Google Analytics: '+rel);
 if(/{{(?:CONTACT_EMAIL|OPERATOR_NAME|JURISDICTION)}}/.test(html))bad('Unresolved operator template on '+rel);
 if(!/<main\b/i.test(html))caution('No main landmark: '+rel);
 if(!/<footer\b/i.test(html))caution('No footer landmark: '+rel);
 if(!/<title\b/i.test(head))bad('No title: '+rel);
 if(!/<link\b[^>]*rel=["']canonical["']/i.test(head)&&!/<link\b[^>]*href=["'][^"']+["'][^>]*rel=["']canonical["']/i.test(head))caution('Missing canonical: '+rel);
 if(rel.startsWith('tools/')&&rel.endsWith('/index.html')){
  const body=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
  const readable=body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/gi,' ').trim();
  const words=readable.split(/\s+/).length;
  if(words<160){shortEnglish++;caution('Human editorial review recommended for short tool page ('+words+' words): '+rel);}
 }
 adsenseChecked++;gaChecked++;
}
for(const lang of locales){
 for(const page of ['index.html','about/index.html','contact/index.html','privacy/index.html','cookies/index.html','terms/index.html']){
  const rel=lang+page;
  if(!fs.existsSync(path.join(root,rel))){bad('Required trust/navigation page missing: '+rel);continue;}
  const html=get(rel);
  if(/{{(?:CONTACT_EMAIL|OPERATOR_NAME|JURISDICTION)}}/.test(html))bad('Unresolved trust-page operator placeholder: '+rel);
 }
 const contact=get(lang+'contact/index.html');
 if(!/mailto:alihamzasbr@gmail\.com/i.test(contact))caution('Verify working contact method: '+lang+'contact/');
 const privacy=get(lang+'privacy/index.html');
 if(!/Google|جوجل|谷歌/i.test(privacy))caution('Privacy disclosure should be reviewed for advertising and analytics: '+lang+'privacy/');
}
const report={
 scope:'GitHub build files only, not a live crawl or Google account verification',
 publicationApproval:'Not established; Google decides',\n adDelivery:'Disabled pending certified consent management platform configuration',
 checkedAt:new Date().toISOString(),pageCount:pages.length,adsenseChecked,gaChecked,
 publisherId:publisher,sellerRecordMatches:ads.length===1&&ads[0]===seller,
 editorialReviewCandidates:shortEnglish,
 requiredManualActions:[
  'Open AdSense > Sites > docvelio.com > Needs attention and read the exact issue',
  'Check the live /ads.txt, source HTML, HTTP status, robots.txt, and SSL on the Cloudflare deployment',
  'Review original content quality, working tools and broken links with real files on mobile and desktop',
  'Ad delivery is intentionally disabled. Configure and verify a Google-certified IAB TCF CMP for EEA/UK/Swiss traffic where required before re-enabling the AdSense delivery tag',
  'Verify privacy statements, operator identity and supported language coverage',
  'Request AdSense review only after completing dashboard-specific fixes'
 ],
 failures,warnings
};
const reportDir=path.resolve(__dirname,'../reports');
fs.mkdirSync(reportDir,{recursive:true});
fs.writeFileSync(path.join(reportDir,'adsense-readiness.json'),JSON.stringify(report,null,2)+'\n');
console.log('ADSENSE PREFLIGHT: '+pages.length+' pages; '+failures.length+' errors; '+warnings.length+' editorial/structural warnings.');
for(const error of failures.slice(0,30))console.error('ERROR: '+error);
for(const warning of warnings.slice(0,12))console.warn('REVIEW: '+warning);
if(failures.length)process.exitCode=1;
