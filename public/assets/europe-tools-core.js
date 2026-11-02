/* Pure calculation core, independent of browser UI.
 * Zero collection or transfer of user inputs.
 * License: Docvelio original implementation, sources linked on each tool page.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.DVEurope=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const fail=m=>{throw new Error(m);};
 function value(x,name,min,max){
  const v=Number(x);if(!Number.isFinite(v)||v<min||v>max)fail(name+' must be between '+min+' and '+max+'.');return v;
 }
 function pallet(x){
  const l=value(x.length,'Carton length',1,1200),w=value(x.width,'Carton width',1,1200),h=value(x.height,'Carton height',1,2000);
  const kg=value(x.kg,'Carton weight',.001,1500),maxH=value(x.maxHeight,'Maximum total stack height',145,5000);
  const limit=value(x.loadLimit??1500,'Load limit',1,1500);
  const orientations=[[l,w],[w,l]];
  const plans=orientations.map(([a,b],index)=>({
   rotated:index===1,cols:Math.floor(1200/a),rows:Math.floor(800/b),a,b
  })).map(p=>({...p,perLayer:p.cols*p.rows}));
  plans.sort((a,b)=>b.perLayer-a.perLayer);
  const plan=plans[0];
  if(!plan.perLayer)fail('Carton footprint exceeds the 1200 × 800 mm pallet. Reduce box dimensions.');
  const byHeight=Math.floor((maxH-144)/h);
  const byWeight=Math.floor(limit/(plan.perLayer*kg));
  // Weight limit may allow only a partially filled last layer.
  const maxBoxesByWeight=Math.floor((limit+1e-8)/kg);
  const fullLayers=Math.min(byHeight,Math.floor(maxBoxesByWeight/plan.perLayer));
  const remaining=Math.min(plan.perLayer,maxBoxesByWeight-fullLayers*plan.perLayer);
  const partial=fullLayers<byHeight?remaining:0;
  const boxes=fullLayers*plan.perLayer+partial;
  const layers=fullLayers+(partial>0?1:0);
  const positions=[];
  for(let row=0;row<plan.rows&&positions.length<plan.perLayer;row++){
   for(let col=0;col<plan.cols&&positions.length<plan.perLayer;col++){
    positions.push({x:col*plan.a,y:row*plan.b,w:plan.a,h:plan.b});
   }
  }
  return {perLayer:plan.perLayer,cols:plan.cols,rows:plan.rows,rotated:plan.rotated,boxes,layers,fullLayers,partial,weight:Math.round(boxes*kg*100)/100,totalHeight:144+layers*h,positions,limit,plan:'Uniform orientation on each layer; not a mixed-orientation optimisation.', warning:'This is a dimensional planning estimate. Check overhang, stability, pallet condition, centre of gravity and carrier limits. EPAL 1 nominal safe working load is 1,500 kg.'};
 }
 const sizes={A5:[148,210],A4:[210,297],A3:[297,420],A2:[420,594],Letter:[215.9,279.4]};
 function paper(x){
  const size=sizes[x.size]||fail('Unknown paper size.');
  const dpi=value(x.dpi,'Resolution',36,2400);
  const mm=x.orientation==='landscape'?[size[1],size[0]]:size.slice();
  const pixels=mm.map(n=>Math.round(n/25.4*dpi));
  return {mm,pixels,dpi,inches:mm.map(n=>Math.round(n/25.4*10000)/10000),megapixels:Math.round(pixels[0]*pixels[1]/1e6*100)/100};
 }
 function bleed(x){
  const base=sizes[x.size]||fail('Unknown paper size.');
  const trim=x.orientation==='landscape'?[base[1],base[0]]:base.slice();
  const b=value(x.bleed,'Bleed',0,25),safe=value(x.safe,'Safe margin',0,60),dpi=value(x.dpi,'DPI',36,2400);
  if(safe*2>=Math.min(...trim))fail('The safe margin must be smaller than half the trim width and height.');
  const canvas=trim.map(v=>v+2*b),inside=trim.map(v=>v-2*safe);
  return {trim,canvas,inside,bleed:b,safe,dpi,pixels:canvas.map(v=>Math.round(v*dpi/25.4)),trimPixels:trim.map(v=>Math.round(v*dpi/25.4)),units:'mm'};
 }
 function normalizeRF(s){return String(s??'').toUpperCase().replace(/\s+/g,'');}
 function numeric(s){
  return [...s].map(c=>c>='A'&&c<='Z'?String(c.charCodeAt(0)-55):c).join('');
 }
 function mod97(str){
  let n=0;for(const char of numeric(str)){if(char<'0'||char>'9')fail('Only Latin letters A–Z and digits 0–9 are permitted.');n=(n*10+Number(char))%97;}return n;
 }
 function rf(base){
  const raw=normalizeRF(base);
  if(!/^[A-Z0-9]{1,21}$/.test(raw))fail('Enter 1–21 letters A–Z or digits (spaces may separate groups).');
  const check=String(98-mod97(raw+'RF00')).padStart(2,'0');
  const electronic='RF'+check+raw;
  return {electronic,formatted:electronic.match(/.{1,4}/g).join(' '),check,valid:mod97(raw+'RF'+check)===1};
 }
 function verifyRF(s){
  const ref=normalizeRF(s);
  return /^RF[0-9]{2}[A-Z0-9]{1,21}$/.test(ref)&&mod97(ref.slice(4)+ref.slice(0,4))===1;
 }
 const lengths={AL:28,AD:24,AT:20,BE:16,BG:22,CH:21,CY:28,CZ:24,DE:22,DK:18,EE:20,ES:24,FI:18,FR:27,GB:22,GI:23,GR:27,HR:21,HU:28,IE:22,IS:26,IT:27,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MT:31,NL:18,NO:15,PL:28,PT:25,RO:24,RS:22,SE:24,SI:19,SK:24,SM:27,TR:26,UA:29,XK:20};
 function iban(input){
  const s=String(input??'').replace(/\s+/g,'').toUpperCase();
  if(!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)||!(s.slice(0,2) in lengths)||s.length!==lengths[s.slice(0,2)])return false;
  return mod97(s.slice(4)+s.slice(0,4))===1;
 }
 function sepa(x){
  const name=String(x.name||'').trim(),account=String(x.iban||'').replace(/\s/g,'').toUpperCase(),bic=String(x.bic||'').trim().toUpperCase();
  const amount=x.amount===''||x.amount==null?'':value(x.amount,'Amount in EUR',.01,999999999.99);
  const note=String(x.note||'').trim(),reference=normalizeRF(x.rf||'');
  if(name.length<1||name.length>70||/[\r\n]/.test(name))fail('Beneficiary name must contain 1–70 characters, with no line breaks.');
  if(!iban(account))fail('Invalid IBAN format, length or check digits.');
  if(bic&&!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic))fail('BIC must contain 8 or 11 valid characters.');
  if(note.length>140||/[\r\n]/.test(note))fail('Unstructured message must be 140 characters or fewer.');
  if(reference&&!verifyRF(reference))fail('RF structured reference must contain valid ISO 11649 check digits.');
  if(reference&&note)fail('Use either a structured RF reference or an unstructured message, not both.');
  const lines=['BCD','002','1','SCT',bic,name,account,amount===''?'':'EUR'+amount.toFixed(2),'',reference,note,''];
  while(lines.length&&lines.at(-1)==='')lines.pop();
  const payload=lines.join('\n');
  const bytes=typeof TextEncoder!=='undefined'?new TextEncoder().encode(payload).length:unescape(encodeURIComponent(payload)).length;
  if(bytes>331)fail('EPC QR data exceeds 331 UTF-8 bytes.');
  return {payload,bytes,formattedIBAN:account.replace(/.{4}/g,'$& ').trim(),amount:amount===''?'':amount.toFixed(2),name,reference,note,warning:'The QR contains payment details, not an actual transfer. Compatibility depends on the payer’s banking app and EPC QR support. Always verify account and amount.'};
 }
 return {pallet,paper,bleed,rf,verifyRF,iban,sepa,mod97,sizes};
});
