/* Internal linking QA: all 285 editorial entries accounted for and no broken crawlable hrefs. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const plan=require('./internal-links-map.json');
const linker=require('./implement-internal-links.cjs');
const report=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../reports/internal-linking-build.json'),'utf8'));
assert.equal(plan.total,285);assert.equal(plan.links.length,285);
assert.equal(report.planned,285);
assert.equal(report.inserted+report.existing+report.missingSource.length+report.missingTarget.length,285);
const pairs=new Set();
const sources=new Set();
for(const item of plan.links){
 assert.ok(item.source.startsWith('/')&&item.target.startsWith('/'),'External link in approved map');
 assert.notEqual(item.source,item.target,'Self-link not permitted');
 const key=item.source+' => '+item.target;
 assert.ok(!pairs.has(key),'Duplicate approved edge '+key);pairs.add(key);
 sources.add(item.source);
 const sourceFile=linker.routeFile(item.source),targetFile=linker.routeFile(item.target);
 assert.ok(sourceFile&&targetFile,'Unsafe route '+key);
 if(!fs.existsSync(sourceFile)||!fs.existsSync(targetFile))continue;
 const html=fs.readFileSync(sourceFile,'utf8');
 const main=html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0]||'';
 assert.ok(main.includes('href="'+item.target+'"')||main.includes("href='"+item.target+"'"),
  'Internal contextual link missing: '+key);
 assert.ok(!/href=["']\/proposed\//i.test(main),'Unbuilt proposal link: '+item.source);
}
assert.equal(sources.size,report.sourceCount);
for(const item of report.missingTarget){
 assert.ok(!fs.existsSync(linker.routeFile(item.target)),'Missing target actually exists: '+item.target);
}
for(const item of report.missingSource){
 assert.ok(!fs.existsSync(linker.routeFile(item.source)),'Missing source actually exists: '+item.source);
}
// Unit fixture checks that escaped anchors, contextual placement and re-runs are safe.
const sample='<html><head></head><body><main><article class="dv-blog-article"><h1>PDF guidance</h1><p>This article explains how to extract and move pages when preparing a PDF document for sharing.</p><p>Review the source file and save a copy before making any changes to the page order.</p></article></main></body></html>';
const links=[{source:'/tools/split-pdf/',target:'/tools/organize-pdf/',anchor:'reorder PDF pages',kind:'Guide / blog',priority:'P0',placement:'First relevant explanatory paragraph'}];
const dest='<main><h1>Organise PDF pages</h1></main>';
const initial=linker.apply(sample,links,()=>dest);
assert.equal(initial.added.length,1);
assert.ok(initial.html.includes('data-dv-topic-links="1"'));
assert.ok(initial.html.includes('href="/tools/organize-pdf/"'));
const again=linker.apply(initial.html,links,()=>dest);
assert.equal(again.added.length,1);
assert.equal(again.html,initial.html,'Build must be idempotent');
const missing=linker.apply(sample,links,()=>null);
assert.equal(missing.added.length,0);assert.equal(missing.missing.length,1);
console.log('INTERNAL LINK QA: '+plan.links.length+' mapped edges across '+sources.size+' sources; '+report.inserted+' new and '+report.existing+' previously linked. Missing sources: '+report.missingSource.length+', targets: '+report.missingTarget.length);
