/* Docvelio CBM and freight volume tool. Entirely browser-side; no network calls. */
(()=>{'use strict';
 const root=document.querySelector('[data-cargo-calculator]');if(!root)return;
 const C=window.DocvelioCargo;
 const tbody=root.querySelector('#cargo-lines'),tpl=root.querySelector('#cargo-row-template');
 const $=id=>root.querySelector('#'+id);
 let rows=0,last=null;
 const nf=(n,max=3)=>Number.isFinite(n)?new Intl.NumberFormat(undefined,{maximumFractionDigits:max}).format(n):'—';
 const say=(str,error=false)=>{const box=$('cargo-notice');box.textContent=str;box.dataset.error=String(error);};
 function field(row,name){return row.querySelector('[data-field="'+name+'"]');}
 function setText(id,value){$(id).textContent=value;}
 function add(values={}){
   if(rows>=100){say('Maximum 100 cargo rows.',true);return;}
   const el=tpl.content.firstElementChild.cloneNode(true);
   for(const [k,v] of Object.entries(values)){const control=field(el,k);if(control)control.value=String(v);}
   el.querySelector('[data-remove]').addEventListener('click',()=>{if(tbody.children.length<=1){say('Keep at least one cargo row.',true);return;}el.remove();rows--;recalculate();});
   el.querySelectorAll('input,select').forEach(inp=>inp.addEventListener('input',recalculate));
   tbody.append(el);rows++;recalculate();
 }
 function readRows(){return [...tbody.querySelectorAll('[data-cargo-row]')].map(el=>({
   name:field(el,'name').value.trim()||'Cartons',
   length:field(el,'length').value,width:field(el,'width').value,height:field(el,'height').value,
   unit:field(el,'unit').value,weight:field(el,'weight').value,weightUnit:field(el,'weightUnit').value,
   quantity:field(el,'quantity').value
 }));}
 function recalculate(){
   try{
     const out=C.compute(readRows(),{divisor:$('cargo-divisor').value,utilisation:$('cargo-utilisation').value});
     last=out;$('cargo-results').hidden=false;$('cargo-export').disabled=false;
     setText('cargo-cbm',nf(out.cbm,5)+' m³');
     setText('cargo-cft',nf(out.cft,3)+' ft³');
     setText('cargo-kg',nf(out.actualKg,2)+' kg');
     setText('cargo-lb',nf(out.actualLb,2)+' lb');
     setText('cargo-dim',nf(out.dimensionalKg,2)+' kg');
     setText('cargo-chargeable',nf(out.chargeableKg,2)+' kg');
     setText('cargo-quantity',nf(out.quantity,0));
     setText('cargo-formula','Dimensional weight = '+nf(out.cbm*1e6,1)+' cm³ ÷ '+nf(out.divisor,0)+' = '+nf(out.dimensionalKg,2)+' kg.');
     const cards=$('cargo-containers');cards.replaceChildren();
     for(const c of out.containers){
       const card=document.createElement('article');card.className='cargo-container';
       const title=document.createElement('h3');title.textContent=c.name;
       const volume=document.createElement('p');volume.textContent='Nominal internal capacity: '+nf(c.volume,1)+' m³';
       const label=document.createElement('p');label.textContent='Cargo volume / nominal: '+nf(c.nominalPct,1)+'%';
       const bar=document.createElement('progress');bar.max=100;bar.value=Math.min(100,c.nominalPct);
       bar.setAttribute('aria-label',c.name+' nominal volume filled');
       const plan=document.createElement('p');plan.textContent='Volume-only estimate at '+nf(out.utilisation*100,0)+'% utilisation: '+nf(c.volumeOnlyEstimate,0)+' container(s)';
       const dim=document.createElement('small');dim.textContent='Approx. interior '+c.dimensions.map(n=>nf(n,2)).join(' × ')+' m';
       card.append(title,volume,label,bar,plan,dim);cards.append(card);
     }
     say('Estimates updated. Actual loading and carrier billing require confirmation.');
   }catch(e){
     last=null;$('cargo-results').hidden=true;$('cargo-export').disabled=true;
     say(e.message||'Please check your measurements.',true);
   }
 }
 $('cargo-add').addEventListener('click',()=>add({name:'Additional cargo',length:50,width:40,height:40,quantity:1,weight:0}));
 $('cargo-clear').addEventListener('click',()=>{tbody.replaceChildren();rows=0;add({name:'Cartons',length:60,width:40,height:40,unit:'cm',weight:25,weightUnit:'kg',quantity:200});});
 $('cargo-divisor').addEventListener('input',recalculate);
 $('cargo-utilisation').addEventListener('change',recalculate);
 $('cargo-export').addEventListener('click',()=>{
   if(!last)return;
   const safe=s=>{let v=String(s??'');if(/^[\s]*[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';};
   const cols=['Product','Length','Width','Height','Dimension unit','Weight each','Weight unit','Quantity','Total CBM','Total kg'];
   const raw=readRows();
   const lines=[cols.map(safe).join(',')];
   last.products.forEach((p,i)=>{const r=raw[i];
    lines.push([r.name,r.length,r.width,r.height,r.unit,r.weight,r.weightUnit,r.quantity,p.cbm,p.totalKg].map(safe).join(','));
   });
   lines.push([safe('TOTAL CBM'),safe(last.cbm)].join(','));
   lines.push([safe('TOTAL CFT'),safe(last.cft)].join(','));
   lines.push([safe('ACTUAL KG'),safe(last.actualKg)].join(','));
   lines.push([safe('DIMENSIONAL KG'),safe(last.dimensionalKg)].join(','));
   const blob=new Blob(['\ufeff'+lines.join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'});
   const link=document.createElement('a'),url=URL.createObjectURL(blob);
   link.href=url;link.download='docvelio-cbm-shipment.csv';document.body.append(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 add({name:'Example cartons',length:60,width:40,height:40,unit:'cm',weight:25,weightUnit:'kg',quantity:200});
})();
