'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..','public');
const consent=fs.readFileSync(path.join(root,'assets/cookie-consent.js'),'utf8');
const tools=fs.readFileSync(path.join(root,'assets/site.js'),'utf8');
const choices=['accepted','declined'];
for(const x of ['cookie-consent.css','cookie-consent.js'])assert(fs.existsSync(path.join(root,'assets',x)));
for(const phrase of ['docvelio_privacy_choice_v1','docvelio_tool_category_v1','180*24*60*60*1000','Cookie Policy']){
 assert(consent.includes(phrase),'Missing privacy disclosure '+phrase);
}
assert(!/adsbygoogle|gtag\s*\(|fbq\s*\(/i.test(consent),'A simple preference banner must not load ad tags');
assert(!/document\.cookie\s*=/.test(consent),'Choice is in localStorage, no unsolicited cookies');

const pages=[];
(function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,item.name);
 if(item.isDirectory())walk(file);
 else if(item.name.endsWith('.html'))pages.push(file);
}})(root);
assert.equal(pages.length,521);
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/\/assets\/cookie-consent\.css/g)||[]).length,1,'Consent CSS missing or duplicated '+file);
 assert.equal((html.match(/\/assets\/cookie-consent\.js/g)||[]).length,1,'Consent JS missing or duplicated '+file);
}
const langs=['en','es','fr','de','pt','ar','hi','id','tr','zh'];
for(const lang of langs){
 const prefix=lang==='en'?'':lang+'/';
 for(const slug of ['cookies','privacy']){
  const page=fs.readFileSync(path.join(root,prefix,slug,'index.html'),'utf8');
  assert(page.includes('data-dv-policy-update="1"'),'Missing updated '+lang+'/'+slug+' policy disclosure');
 }
}
const storage=new Map(),domEvents=new Map(),windowEvents=new Map();
const body=[];
class FakeElement{
 constructor(tag='div'){this.tagName=tag;this.className='';this.children=[];this.style={};this.hidden=false;this.attrs={};this.listeners=new Map();
 this.classList={add:x=>{this.className+=(this.className?' ':'')+x},remove:x=>{this.className=this.className.split(' ').filter(y=>y!==x).join(' ')},toggle:(x,value)=>{
 let a=this.className.split(' ').filter(Boolean);if(value&&!a.includes(x))a.push(x);
 if(!value)a=a.filter(y=>y!==x);this.className=a.join(' ');
 }};}
 append(...elements){this.children.push(...elements);}
 setAttribute(k,v){this.attrs[k]=String(v)}
 getAttribute(k){return this.attrs[k]||null}
 addEventListener(type,fn){this.listeners.set(type,fn)}
 click(){this.listeners.get('click')?.({target:this})}
 focus(){}
}
const footer=new FakeElement('footer');
const fakeBody=new FakeElement('body');fakeBody.append=(x)=>body.push(x);
const cats=['all','pdf'];
const buttons=cats.map(v=>{const el=new FakeElement('button');el.dataset={filter:v};el.textContent=v;return el;});
const cards=['pdf','word'].map(v=>{const el=new FakeElement('a');el.dataset={category:v,title:v};el.textContent=v;return el;});
const search=new FakeElement('input');search.value='';
const elements={'#tool-search':search,'#empty-tools':new FakeElement('p'),'.footer .foot-bottom':footer};
const document={
 documentElement:{lang:'en'},body:fakeBody,
 querySelector:s=>elements[s]||null,
 querySelectorAll:s=>s==='.filter'?buttons:s==='.tool-card'?cards:[],
 createElement:tag=>new FakeElement(tag)
};
const localStorage={getItem:key=>storage.has(key)?storage.get(key):null,
 setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)};
const window={addEventListener:(name,fn)=>windowEvents.set(name,fn),
 dispatchEvent:event=>windowEvents.get(event.type)?.(event)};
const context={document,window,localStorage,Date,JSON,Number,setTimeout:fn=>fn(),CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}},console};
vm.createContext(context);
vm.runInContext(tools,context);
vm.runInContext(consent,context);
assert.equal(body.length,1,'Expected one consent banner');
const panel=body[0];
assert.equal(panel.hidden,false,'First-time visitors must see the banner');
const traverse=(root,out=[])=>{out.push(root);for(const child of root.children||[])traverse(child,out);return out;};
const all=traverse(panel);
const accept=all.find(el=>el.textContent==='Accept');
const reject=all.find(el=>el.textContent==='Decline');
assert(accept&&reject,'Missing equally available Accept/Decline controls');
assert.equal(storage.has('docvelio_tool_category_v1'),false,'No optional storage before consent');
buttons[1].click();
assert.equal(storage.has('docvelio_tool_category_v1'),false,'Category was stored before consent');
accept.click();
assert.equal(JSON.parse(storage.get('docvelio_privacy_choice_v1')).choice,'accepted');
assert.equal(storage.get('docvelio_tool_category_v1'),'pdf','Accept must enable optional preference storage');
assert.equal(panel.hidden,true,'Consent banner should close after choice');
assert(footer.children.length===1,'Footer should offer one settings button');
footer.children[0].click();
assert.equal(panel.hidden,false,'Settings should reopen');
reject.click();
assert.equal(JSON.parse(storage.get('docvelio_privacy_choice_v1')).choice,'declined');
assert.equal(storage.has('docvelio_tool_category_v1'),false,'Declining must remove optional preference');
assert.equal(cards[0].hidden,false,'Decline resets category filter to all');
assert.equal(cards[1].hidden,false,'Decline restores all tool categories');
assert.equal(panel.hidden,true,'Decline should close banner');
console.log('PASS: localized cookie choices on 521 pages, policy notices, accept/reject actions, revocation and optional category storage');
