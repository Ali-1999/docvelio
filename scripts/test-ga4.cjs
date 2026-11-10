'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../public'),source=fs.readFileSync(path.join(root,'assets/docvelio-ga4.js'),'utf8');
const events={},storage=new Map(),layer=[];
const ctx={
 window:{dataLayer:layer,addEventListener(k,fn){events[k]=fn}},
 document:{cookie:'',head:{}},
 localStorage:{getItem:k=>storage.get(k)||null},
 Date,Number,JSON
};
vm.createContext(ctx);vm.runInContext(source,ctx);
assert.equal(layer[0][0],'consent','Consent default must be first');
assert.equal(layer[0][1],'default');
assert.equal(layer[0][2].analytics_storage,'denied','Analytics cookies must be disabled by default');
for(const key of ['ad_storage','ad_user_data','ad_personalization'])assert.equal(layer[0][2][key],'denied');
assert(layer.some(x=>x[0]==='config'&&x[1]==='G-1RNSZ473TY'),'Correct GA4 config missing');
events['docvelio:privacy-choice']({detail:{choice:'accepted'}});
assert(layer.some(x=>x[0]==='consent'&&x[1]==='update'&&x[2].analytics_storage==='granted'));
events['docvelio:privacy-choice']({detail:{choice:'declined'}});
assert.equal(layer.at(-1)[2].analytics_storage,'denied','Withdrawal must deny analytics');
let count=0;function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html')){
 const html=fs.readFileSync(p,'utf8');if(!html.includes('</body>'))continue;
 assert.equal((html.match(/src=["']\/assets\/docvelio-ga4\.js["']/g)||[]).length,1,'Consent initializer missing or duplicated: '+p);
 assert.equal((html.match(/www\.googletagmanager\.com\/gtag\/js\?id=G-1RNSZ473TY/g)||[]).length,1,'Google tag missing or duplicated: '+p);
 assert(html.indexOf('src="/assets/docvelio-ga4.js"')<html.indexOf('www.googletagmanager.com/gtag/js?id=G-1RNSZ473TY'),'Consent defaults must precede Google tag');
 const adTag=html.indexOf('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
 if(adTag!==-1)assert(html.indexOf('src="/assets/docvelio-ga4.js"')<adTag,'Consent defaults must precede AdSense script: '+p);
 count++;}}}
walk(root);assert(count>=584);
for(const locale of ['','es/','fr/','de/','pt/','ar/','hi/','id/','tr/','zh/']){
 for(const policy of ['cookies','privacy'])assert(fs.readFileSync(path.join(root,locale,policy,'index.html'),'utf8').includes('id="dv-ga4-policy"'),'Missing GA4 policy '+locale+policy);
}
console.log('PASS: GA4 tag discoverable on '+count+' pages, default-denied consent, updates and disclosures.');
