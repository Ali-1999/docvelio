'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../public'),source=fs.readFileSync(path.join(root,'assets/docvelio-ga4.js'),'utf8');
const scripts=[],listeners={},storage=new Map();
const head={append(node){scripts.push(node)}};
const ctx={window:{dataLayer:[],addEventListener(k,fn){listeners[k]=fn}},document:{head,createElement(){return {}}},localStorage:{getItem:k=>storage.get(k)||null},Date,Number,JSON,encodeURIComponent};
vm.createContext(ctx);vm.runInContext(source,ctx);
assert.equal(scripts.length,0,'GA4 must not load before consent');
storage.set('docvelio_privacy_choice_v2',JSON.stringify({version:2,choice:'accepted',time:Date.now()}));
listeners['docvelio:privacy-choice']({detail:{choice:'accepted'}});
assert.equal(scripts.length,1,'GA4 must load exactly once after consent');
assert(scripts[0].src.includes('G-1RNSZ473TY'),'Wrong GA4 ID');
listeners['docvelio:privacy-choice']({detail:{choice:'accepted'}});
assert.equal(scripts.length,1,'GA4 must not load twice');
let count=0;function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html')){const html=fs.readFileSync(p,'utf8');if(!html.includes('</body>'))continue;assert.equal((html.match(/src=["']\/assets\/docvelio-ga4\.js["']/g)||[]).length,1,'GA4 loader must appear exactly once '+p);count++;}}}
walk(root);assert(count>=583);
for(const locale of ['','es/','fr/','de/','pt/','ar/','hi/','id/','tr/','zh/']){
 for(const policy of ['cookies','privacy'])assert(fs.readFileSync(path.join(root,locale,policy,'index.html'),'utf8').includes('id="dv-ga4-policy"'),'Missing analytics notice '+locale+policy);
}
console.log('PASS: optional GA4 consent, one site-wide loader on '+count+' pages and policy notices.');
