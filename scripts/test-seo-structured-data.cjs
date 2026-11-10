'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../public');
function walk(dir,files=[]){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())walk(file,files);
  else if(entry.name==='index.html')files.push(file);
 }
 return files;
}
function schemas(file){
 const html=fs.readFileSync(file,'utf8'),nodes=[];
 for(const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  try{
   const data=JSON.parse(match[1]);
   nodes.push(...(Array.isArray(data['@graph'])?data['@graph']:[data]));
  }catch(error){throw Error('Invalid JSON-LD in '+path.relative(root,file)+': '+error.message);}
 }
 return nodes;
}
function has(nodes,type){
 return nodes.some(node=>(Array.isArray(node['@type'])?node['@type']:[node['@type']]).includes(type));
}
const pages=walk(root),home=path.join(root,'index.html'),homeNodes=schemas(home);
assert.equal(homeNodes.filter(node=>node['@type']==='WebSite').length,1,'Homepage must have exactly one WebSite entity');
assert.ok(has(homeNodes,'Person'),'Homepage operator Person entity missing');
assert.ok(has(homeNodes,'Organization'),'Homepage Organization entity missing');
assert.ok(has(homeNodes,'ItemList'),'Homepage visible tools ItemList missing');
assert.ok(has(homeNodes,'FAQPage'),'Homepage visible FAQ schema missing');
const homeHtml=fs.readFileSync(home,'utf8');
assert.ok(homeHtml.includes('Free PDF tools'),'Homepage body must include its primary PDF-tools phrase');
assert.ok(homeHtml.includes('dv-home-faq'),'Homepage must render the FAQ answers represented in structured data');
assert.ok(homeHtml.includes('property="og:image"'),'Homepage Open Graph image missing');
assert.ok(homeHtml.includes('name="twitter:image"'),'Homepage Twitter image missing');
const faqBlock=homeHtml.match(/<script id="dv-home-faq-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(faqBlock,'Homepage FAQ JSON-LD missing');
const faq=JSON.parse(faqBlock[1]);
assert.equal(faq.mainEntity.length,4,'Homepage should contain four visible FAQ questions');

let guides=0,blogs=0,collections=0;
for(const file of pages){
 const relative=path.relative(root,file).replaceAll('\\','/');
 const nodes=schemas(file);
 if(/(^|\/)guides\/[^/]+\/index\.html$/.test(relative)){
  assert.ok(has(nodes,'Article'),'Guide Article schema missing: '+relative);
  assert.ok(has(nodes,'BreadcrumbList'),'Guide BreadcrumbList missing: '+relative);
  guides++;
 }
 if(/(^|\/)blog\/[^/]+\/index\.html$/.test(relative)){
  assert.ok(has(nodes,'BlogPosting'),'BlogPosting missing: '+relative);
  assert.ok(has(nodes,'FAQPage'),'Visible FAQPage schema missing: '+relative);
  assert.ok(has(nodes,'BreadcrumbList'),'Blog BreadcrumbList missing: '+relative);
  blogs++;
 }
 if(/(^|\/)(guides|blog)\/index\.html$/.test(relative)){
  assert.ok(has(nodes,'ItemList'),'Collection ItemList missing: '+relative);
  collections++;
 }
}
assert.ok(guides>0,'No guide pages checked');
assert.ok(blogs>0,'No blog pages checked');
assert.ok(collections>0,'No collection pages checked');
const llms=path.join(root,'llms.txt');
assert.ok(fs.existsSync(llms),'llms.txt missing');
assert.ok(fs.readFileSync(llms,'utf8').includes('## Main tools'),'llms.txt tool directory missing');
console.log('STRUCTURED DATA PASS: '+pages.length+' pages scanned; '+guides+' guide Articles; '+blogs+' BlogPosting + FAQPage pages; '+collections+' collection ItemLists.');
