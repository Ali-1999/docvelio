/* Client-side tool interface. No uploads; calculations run locally in the browser.
 * The QR renderer is the vendored MIT qrcode-generator library.
 */
(function(){
 'use strict';
 const node=document.getElementById('dv-eu-tool');
 if(!node||!window.DVEurope)return;
 const core=window.DVEurope,kind=node.dataset.tool;
 const form=node.querySelector('form'),output=node.querySelector('#dv-eu-output');
 const note=node.querySelector('#dv-eu-status');
 const number=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2});
 const $=name=>form.elements.namedItem(name);
 const v=name=>$(name)?.value??'';
 let lastText='';
 const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const dimension=a=>a.map(x=>number.format(x)).join(' × ');
 const stat=(label,value)=>'<div class="dv-eu-stat"><span>'+escape(label)+'</span><strong>'+escape(value)+'</strong></div>';
 const copyButton='<button class="dv-eu-action" type="button" data-eu-copy>Copy result</button>';
 const dlButton=label=>'<button class="dv-eu-action" type="button" data-eu-download>'+escape(label)+'</button>';
 function svgBase(title,width,height,body){
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="'+escape(title)+'"><rect width="'+width+'" height="'+height+'" fill="#f3f7ff"/>'+body+'</svg>';
 }
 function downloadBlob(data,mime,filename){
  const blob=data instanceof Blob?data:new Blob([data],{type:mime}),url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
 }
 function csv(name,rows){
  const content=rows.map(row=>row.map(cell=>'"'+String(cell).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
  downloadBlob('\uFEFF'+content,'text/csv;charset=utf-8',name);
 }
 async function copy(){
  try{await navigator.clipboard.writeText(lastText);note.textContent='Copied to clipboard.'}
  catch{note.textContent='Copy unavailable. Select the result text manually.';}
 }
 function set(html,text,downloader){
  lastText=text;output.hidden=false;output.innerHTML=html;
  const b=output.querySelector('[data-eu-copy]');if(b)b.addEventListener('click',copy);
  const dl=output.querySelector('[data-eu-download]');if(dl&&downloader)dl.addEventListener('click',downloader);
  note.textContent='Calculated locally. Review assumptions before use.';
 }
 function showPallet(){
  const r=core.pallet({length:v('length'),width:v('width'),height:v('height'),kg:v('kg'),maxHeight:v('maxHeight'),loadLimit:v('loadLimit')});
  const rectangles=r.positions.map((p,i)=>'<rect x="'+(20+p.x*.35)+'" y="'+(20+p.y*.35)+'" width="'+(p.w*.35-2)+'" height="'+(p.h*.35-2)+'" rx="3" fill="'+(i%2?'#badbd8':'#a6c5f8')+'" stroke="#49719e" stroke-width="1"/>').join('');
  const image=svgBase('One uniform carton layer',460,320,'<rect x="20" y="20" width="420" height="280" rx="9" fill="#f4e2c3" stroke="#b89360" stroke-width="3"/>'+rectangles);
  const text='Cartons per full layer: '+r.perLayer+'\nLayers used: '+r.layers+'\nCartons per pallet: '+r.boxes+'\nLoaded carton weight: '+r.weight+' kg\nTotal height: '+r.totalHeight+' mm\n'+r.warning;
  set('<div class="dv-eu-stats">'+stat('Cartons per full layer',r.perLayer)+stat('Maximum cartons',r.boxes)+stat('Layers used',r.layers)+stat('Stack height',r.totalHeight+' mm')+stat('Carton payload',r.weight+' kg')+stat('Orientation',r.rotated?'Rotated 90°':'As entered')+'</div><div class="dv-eu-diagram">'+image+'</div><p class="dv-eu-note">'+escape(r.warning)+'</p><div class="dv-eu-actions">'+copyButton+dlButton('Download layer SVG')+'</div>',text,()=>downloadBlob(image,'image/svg+xml','euro-pallet-layer.svg'));
 }
 function showPaper(){
  const r=core.paper({size:v('size'),orientation:v('orientation'),dpi:v('dpi')});
  const text=v('size')+' '+v('orientation')+' at '+r.dpi+' DPI\n'+dimension(r.mm)+' mm\n'+dimension(r.pixels)+' px\n'+dimension(r.inches)+' inches\n'+r.megapixels+' MP';
  set('<div class="dv-eu-stats">'+stat('Width',r.pixels[0]+' px')+stat('Height',r.pixels[1]+' px')+stat('Paper size',dimension(r.mm)+' mm')+stat('Approx. resolution',r.megapixels+' MP')+'</div><p class="dv-eu-note">Pixels are rounded to the nearest whole pixel using 25.4 mm per inch. This calculates output dimensions; it does not change an image file.</p><div class="dv-eu-actions">'+copyButton+dlButton('Download CSV')+'</div>',text,()=>csv('paper-pixels.csv',[['Paper','Orientation','DPI','Width mm','Height mm','Width px','Height px'],[v('size'),v('orientation'),r.dpi,...r.mm,...r.pixels]]));
 }
 function showBleed(){
  const r=core.bleed({size:v('size'),orientation:v('orientation'),bleed:v('bleed'),safe:v('safe'),dpi:v('dpi')});
  const w=r.canvas[0],h=r.canvas[1],scale=Math.min(280/w,360/h);
  const xo=20,yo=20,a=r.bleed*scale,b=r.safe*scale;
  const graphic=svgBase('Trim, bleed and safe area',w*scale+40,h*scale+40,
    '<rect x="'+xo+'" y="'+yo+'" width="'+(w*scale)+'" height="'+(h*scale)+'" fill="#f8d1c1" stroke="#dd8f71" stroke-width="2"/>'+
    '<rect x="'+(xo+a)+'" y="'+(yo+a)+'" width="'+(r.trim[0]*scale)+'" height="'+(r.trim[1]*scale)+'" fill="#fff" stroke="#366bd3" stroke-width="2" stroke-dasharray="6 3"/>'+
    '<rect x="'+(xo+a+b)+'" y="'+(yo+a+b)+'" width="'+(r.inside[0]*scale)+'" height="'+(r.inside[1]*scale)+'" fill="#eef8f5" stroke="#138f80" stroke-width="2"/>');
  const text='Trim '+dimension(r.trim)+' mm\nBleed document '+dimension(r.canvas)+' mm\nSafe area '+dimension(r.inside)+' mm\nFull canvas at '+r.dpi+' DPI: '+dimension(r.pixels)+' px';
  set('<div class="dv-eu-stats">'+stat('Trim size',dimension(r.trim)+' mm')+stat('Including bleed',dimension(r.canvas)+' mm')+stat('Safe content zone',dimension(r.inside)+' mm')+stat('Canvas in pixels',dimension(r.pixels)+' px')+'</div><div class="dv-eu-diagram dv-eu-print-preview">'+graphic+'</div><p class="dv-eu-note">Orange: bleed; blue dashed line: trim; green: safe zone. Bleed is added on all four sides. Confirm your printer’s specifications.</p><div class="dv-eu-actions">'+copyButton+dlButton('Download guide SVG')+'</div>',text,()=>downloadBlob(graphic,'image/svg+xml','print-bleed-guide.svg'));
 }
 function showRF(){
  const base=v('base'),check=v('check').trim();
  let r,text;
  if(check){
   const verified=core.verifyRF(check);
   text='Reference '+check.toUpperCase()+'\nCheck digits: '+(verified?'VALID':'INVALID');
   set('<div class="dv-eu-validation '+(verified?'valid':'invalid')+'">'+(verified?'✓ Reference passes MOD-97 validation':'✕ Invalid RF reference or check digits')+'</div><p class="dv-eu-note">Validation checks the reference format and digits only. It cannot verify an invoice or bank account.</p><div class="dv-eu-actions">'+copyButton+'</div>',text);
   return;
  }
  r=core.rf(base);text=r.electronic+' ('+r.formatted+')';
  set('<div class="dv-eu-reference">'+escape(r.formatted)+'</div><div class="dv-eu-stats">'+stat('Electronic format',r.electronic)+stat('Check digits',r.check)+stat('MOD-97 verification',r.valid?'Valid':'Invalid')+'</div><p class="dv-eu-note">ISO 11649 check digits help detect entry mistakes. They do not confirm that a payment reference exists in a creditor’s records.</p><div class="dv-eu-actions">'+copyButton+dlButton('Download TXT')+'</div>',text,()=>downloadBlob(r.electronic+'\n','text/plain;charset=utf-8','rf-creditor-reference.txt'));
 }
 function showSepa(){
  const d=core.sepa({name:v('name'),iban:v('iban'),bic:v('bic'),amount:v('amount'),rf:v('rf'),note:v('note')});
  if(typeof window.qrcode!=='function')throw new Error('QR encoding library has not loaded. Refresh and try again.');
  // The local, MIT-licensed library supports UTF-8 data encoding for EPC payloads.
  if(window.qrcode.stringToBytesFuncs?.['UTF-8'])window.qrcode.stringToBytes=window.qrcode.stringToBytesFuncs['UTF-8'];
  const qr=window.qrcode(0,'M');
  qr.addData(d.payload,'Byte');qr.make();
  const size=qr.getModuleCount(),margin=4;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=560;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas is not available in this browser.');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,560,560);
  const unit=560/(size+2*margin);ctx.fillStyle='#152d51';
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(qr.isDark(y,x))ctx.fillRect(Math.floor((x+margin)*unit),Math.floor((y+margin)*unit),Math.ceil(unit+.2),Math.ceil(unit+.2));
  canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Generated EPC SEPA payment QR code');
  const text='Beneficiary: '+d.name+'\nIBAN: '+d.formattedIBAN+'\n'+(d.amount?'Amount: EUR '+d.amount+'\n':'')+(d.reference?'Reference: '+d.reference+'\n':'')+(d.note?'Message: '+d.note+'\n':'')+'\nEPC payload:\n'+d.payload;
  set('<div class="dv-eu-stats">'+stat('Beneficiary',d.name)+stat('IBAN',d.formattedIBAN)+stat('Amount',d.amount?'€'+d.amount:'Not specified')+stat('Payload length',d.bytes+' / 331 bytes')+'</div><div id="dv-eu-qr" class="dv-eu-qr"></div><p class="dv-eu-note">'+escape(d.warning)+'</p><div class="dv-eu-actions">'+copyButton+dlButton('Download QR PNG')+'</div>',text,()=>canvas.toBlob(b=>b?downloadBlob(b,'image/png','sepa-payment-qr.png'):note.textContent='Could not export QR PNG.','image/png'));
  output.querySelector('#dv-eu-qr').appendChild(canvas);
 }
 form.addEventListener('submit',event=>{
  event.preventDefault();try{
   if(kind==='pallet')showPallet();
   else if(kind==='dpi')showPaper();
   else if(kind==='bleed')showBleed();
   else if(kind==='rf')showRF();
   else if(kind==='sepa')showSepa();
  }catch(error){output.hidden=true;note.textContent=error?.message||'Please check your inputs.';}
 });
 form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
})();
