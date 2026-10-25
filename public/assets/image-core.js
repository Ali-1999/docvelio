/* Docvelio Image Studio — original dependency-free numerical helpers. */
(function(root,factory){
 const value=factory();
 if(typeof module==='object'&&module.exports)module.exports=value;
 else root.DocvelioImageCore=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
 function dims(width,height,maxPixels=24000000,maxEdge=8192){
  width=Math.round(Number(width));height=Math.round(Number(height));
  if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1||width>maxEdge||height>maxEdge||width*height>maxPixels)throw new RangeError('Image exceeds safety limit (8192 px edge / 24 MP).');
  return {width,height};
 }
 function proportional(currentWidth,currentHeight,width,height,locked=true){
  const w=Math.round(Number(width)),h=Math.round(Number(height));
  if(locked){
   if(w>0)return dims(w,Math.max(1,Math.round(w*currentHeight/currentWidth)));
   if(h>0)return dims(Math.max(1,Math.round(h*currentWidth/currentHeight)),h);
  }return dims(w,h);
 }
 function cropRect(ax,ay,bx,by,width,height){
  const x=clamp(Math.floor(Math.min(ax,bx)),0,width-1),y=clamp(Math.floor(Math.min(ay,by)),0,height-1);
  return {x,y,width:clamp(Math.ceil(Math.max(ax,bx))-x,1,width-x),height:clamp(Math.ceil(Math.max(ay,by))-y,1,height-y)};
 }
 function rotatedSize(w,h,deg){
  const a=Number(deg)*Math.PI/180;
  return dims(Math.ceil(Math.abs(w*Math.cos(a))+Math.abs(h*Math.sin(a))-1e-9),Math.ceil(Math.abs(h*Math.cos(a))+Math.abs(w*Math.sin(a))-1e-9));
 }
 const types={jpeg:'image/jpeg',jpg:'image/jpeg',png:'image/png',webp:'image/webp'};
 function mime(fmt){if(!types[fmt])throw new TypeError('Unsupported output type');return types[fmt];}
 const kb=n=>+(Number(n)/1024).toFixed(1);
 return {clamp,dims,proportional,cropRect,rotatedSize,mime,kb};
});