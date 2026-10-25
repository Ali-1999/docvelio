/* Docvelio cargo volume calculations. Original, dependency-free, deterministic.
 * No server calls or freight prices. Container counts are volume-only estimates.
 */
(function(global,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else global.DocvelioCargo=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const dimensionFactors={mm:.001,cm:.01,m:1,in:.0254,ft:.3048,yd:.9144};
 const weightFactors={kg:1,g:.001,lb:.45359237};
 const CBM_TO_CFT=35.31466672148859;
 const KG_TO_LB=2.204622621848776;
 const containers=[
  {id:'20ft',name:'20 ft dry',volume:33.2,dimensions:[5.9,2.35,2.39]},
  {id:'40ft',name:'40 ft dry',volume:67.7,dimensions:[12.03,2.35,2.39]},
  {id:'40hc',name:'40 ft high cube',volume:76.3,dimensions:[12.03,2.35,2.70]}
 ];
 function validNumber(value,label,min=0,max=1e9,zero=false){
  if(value===undefined||value===null||String(value).trim()==='')throw new RangeError(label+' is required.');
  const v=Number(value);
  if(!Number.isFinite(v)||v>max||(zero?v<min:v<=min))throw new RangeError(label+' is out of range.');
  return v;
 }
 function unitVolume(l,w,h,unit){
  const f=dimensionFactors[unit];if(!f)throw new TypeError('Unsupported length unit');
  const a=validNumber(l,'Length',0,1e6)*f,b=validNumber(w,'Width',0,1e6)*f,c=validNumber(h,'Height',0,1e6)*f;
  const volume=a*b*c;
  if(!Number.isFinite(volume)||volume>1e9)throw new RangeError('Carton volume is too large.');
  return volume;
 }
 function normalize(row){
  const quantity=validNumber(row.quantity??1,'Quantity',0,1000000);
  if(!Number.isSafeInteger(quantity))throw new RangeError('Quantity must be a whole number.');
  const unit=row.unit||'cm',weightUnit=row.weightUnit||'kg';
  if(!weightFactors[weightUnit])throw new TypeError('Unsupported weight unit');
  const cbmEach=unitVolume(row.length,row.width,row.height,unit);
  const weightEach=validNumber(row.weight??0,'Weight',0,1e7,true)*weightFactors[weightUnit];
  const cbm=cbmEach*quantity,weightKg=weightEach*quantity;
  if(!Number.isFinite(cbm)||!Number.isFinite(weightKg)||cbm>1e9||weightKg>1e10)throw new RangeError('Shipment is too large.');
  return {name:String(row.name||'Cartons').slice(0,80),length:Number(row.length),width:Number(row.width),
   height:Number(row.height),unit,quantity,weightEachKg:weightEach,cbmEach,cbm,totalKg:weightKg};
 }
 function compute(rows,options={}){
  if(!Array.isArray(rows)||rows.length===0||rows.length>100)throw new RangeError('Enter between 1 and 100 cargo rows.');
  const divisor=validNumber(options.divisor??5000,'Volumetric divisor',0,100000);
  const utilisation=validNumber(options.utilisation??85,'Utilisation',0,100)/100;
  const products=rows.map(normalize);
  const totals=products.reduce((s,p)=>({cbm:s.cbm+p.cbm,kg:s.kg+p.totalKg,quantity:s.quantity+p.quantity}),
    {cbm:0,kg:0,quantity:0});
  if(totals.cbm>1e10||totals.kg>1e11)throw new RangeError('Total cargo exceeds calculator limit');
  const cubicCentimeters=totals.cbm*1e6;
  const dimensionalKg=cubicCentimeters/divisor;
  const chargeableKg=Math.max(totals.kg,dimensionalKg);
  return {products,quantity:totals.quantity,cbm:totals.cbm,cft:totals.cbm*CBM_TO_CFT,
    actualKg:totals.kg,actualLb:totals.kg*KG_TO_LB,
    dimensionalKg,dimensionalLb:dimensionalKg*KG_TO_LB,
    chargeableKg,chargeableLb:chargeableKg*KG_TO_LB,
    divisor,utilisation,
    containers:containers.map(c=>({
      ...c,nominalPct:totals.cbm/c.volume*100,
      planningPct:totals.cbm/(c.volume*utilisation)*100,
      volumeOnlyEstimate:Math.ceil(totals.cbm/(c.volume*utilisation))
    }))
  };
 }
 return Object.freeze({dimensionFactors,weightFactors,CBM_TO_CFT,KG_TO_LB,containers,unitVolume,normalize,compute});
});