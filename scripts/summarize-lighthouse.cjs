'use strict';
const fs=require('node:fs');
const files=['reports/home-mobile.json','reports/merge-pdf-mobile.json'];
const rows=[];
for(const file of files){
 if(!fs.existsSync(file))throw Error('Missing Lighthouse report: '+file);
 const report=JSON.parse(fs.readFileSync(file,'utf8'));
 const score=name=>Math.round((report.categories?.[name]?.score??0)*100);
 const metric=name=>report.audits?.[name]?.numericValue??null;
 rows.push({
  page:file.includes('home-')?'Homepage':'Merge PDF',
  performance:score('performance'),
  accessibility:score('accessibility'),
  bestPractices:score('best-practices'),
  seo:score('seo'),
  fcp:metric('first-contentful-paint'),
  lcp:metric('largest-contentful-paint'),
  tbt:metric('total-blocking-time'),
  cls:metric('cumulative-layout-shift'),
  speed:metric('speed-index')
 });
}
const fmt=value=>value===null?'n/a':value>=1000?(value/1000).toFixed(2)+' s':Math.round(value)+' ms';
const lines=[
 '# Docvelio production Lighthouse audit',
 '',
 'Mobile Lighthouse results measured against the live production website. Scores are Lighthouse estimates, not Google rankings.',
 '',
 '| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Speed Index |',
 '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
 ...rows.map(row=>'| '+row.page+' | '+row.performance+' | '+row.accessibility+' | '+row.bestPractices+' | '+row.seo+' | '+fmt(row.fcp)+' | '+fmt(row.lcp)+' | '+fmt(row.tbt)+' | '+(row.cls===null?'n/a':row.cls.toFixed(3))+' | '+fmt(row.speed)+' |'),
 '',
 '## Interpretation',
 '- Use LCP, INP/TBT and CLS to identify the actual bottleneck; do not optimise a composite score alone.',
 '- Cloudflare challenges, consent choices and advertising variation can change results between runs.',
 '- Review the full reports before removing scripts, ads or privacy controls.'
];
const output=lines.join('\n')+'\n';
fs.writeFileSync('reports/lighthouse-summary.md',output);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,output);
for(const row of rows)console.log(row.page+': Performance '+row.performance+'/100; LCP '+fmt(row.lcp)+'; TBT '+fmt(row.tbt)+'; CLS '+(row.cls===null?'n/a':row.cls.toFixed(3)));
