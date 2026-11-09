/* Local regression checks for the Excel generator. Run after production build. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../public');
const html=fs.readFileSync(path.join(root,'excel-formula-generator/index.html'),'utf8');
const examples=fs.readFileSync(path.join(root,'assets/excel-formula-generator.js'),'utf8');
assert.ok(!examples.includes('window.formulajs'),'Excel sample arithmetic must be first-party');

const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.match(html,/<h1>Excel Formula Generator<\/h1>/);
assert.match(html,/href="https:\/\/docvelio\.com\/excel-formula-generator\/"/);
assert.ok(!html.includes('cdn.jsdelivr.net/npm/@formulajs'),'Remove Formula.js external script');
assert.match(html,/id="ef-request"/);
assert.match(html,/src="\/assets\/excel-formula-generator\.js"/);
assert.ok(sitemap.includes('<loc>https://docvelio.com/excel-formula-generator/</loc>'));
assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('Open the Excel Formula Generator'));
assert.ok(fs.readFileSync(path.join(root,'privacy/index.html'),'utf8').includes('data-excel-ai-disclosure="1"'));

// Navigation link must survive global shell generation for all language homepages.
for(const locale of ['en','es','fr','de','pt','ar','hi','id','tr','zh']){
 const homeFile=path.join(root,locale==='en'?'index.html':locale+'/index.html');
 const homeHtml=fs.readFileSync(homeFile,'utf8');
 assert.ok(homeHtml.includes('href="/excel-formula-generator/"'),
  'Excel Formula Generator missing from '+locale+' navigation');
}
assert.ok(html.includes('href="/excel-formula-generator/"'),
 'New Excel page should also expose its link through the shared navigation');
async function main(){
 // The real Worker is an ES module with a first-party import. Test its actual
 // module export instead of parsing ESM source through CommonJS new Function().
 const {pathToFileURL}=require('node:url');
 const file=path.join(__dirname,'../src/excel-formula-worker.js');
 const {default:handle}=await import(pathToFileURL(file).href);
 assert.equal(typeof handle.fetch,'function','Worker must export its fetch handler');
 const mockRequest=new Request('https://docvelio.com/api/excel-formula',{method:'POST',headers:{Origin:'https://docvelio.com','Content-Type':'application/json'},body:JSON.stringify({request:'اجمع الخلايا من A1 إلى A5'})});
 const success=await handle.fetch(mockRequest,{AI:{run:async()=>({response:JSON.stringify({formula:'=SUM(A1:A5)',explanation:'Sum selected cells',assumptions:''})})}});
 assert.equal(success.status,200);
 const data=await success.json();assert.equal(data.formula,'=SUM(A1:A5)');
 const bad=new Request('https://docvelio.com/api/excel-formula',{method:'POST',headers:{Origin:'https://docvelio.com','Content-Type':'application/json'},body:JSON.stringify({request:'Create a dangerous external web request formula'})});
 const denied=await handle.fetch(bad,{AI:{run:async()=>({response:JSON.stringify({formula:'=WEBSERVICE("https://evil.test")',explanation:'',assumptions:''})})}});
 assert.equal(denied.status,422);
 console.log('Excel generator tests passed: page, sitemap, privacy, multilingual API response, formula safety.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
