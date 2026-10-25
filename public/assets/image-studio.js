/* Docvelio Image Studio: local browser image processing, no upload endpoints. */
(()=>{'use strict';
const root=document.querySelector('[data-image-studio]');if(!root)return;
const C=window.DocvelioImageCore;
const $=id=>root.querySelector('#'+id);
const canvas=$('im-canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true}),file=$('im-file'),info=$('im-info'),status=$('im-status'),download=$('im-download');
let original=null,history=[],name='image',selection=null,dragStart=null,busy=false;
const say=(message,error=false)=>{status.textContent=message;status.dataset.error=String(error);};
const data=()=>({width:canvas.width,height:canvas.height});
function make(w,h){C.dims(w,h);const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function snapshot(){const c=make(canvas.width,canvas.height);c.getContext('2d').drawImage(canvas,0,0);return c;}
function paint(source){canvas.width=source.width;canvas.height=source.height;ctx.drawImage(source,0,0);selection=null;$('im-region').hidden=true;info.textContent=canvas.width+' × '+canvas.height+' px';download.disabled=false;$('im-undo').disabled=history.length===0;$('im-reset').disabled=false;$('im-width').value=canvas.width;$('im-height').value=canvas.height;root.classList.add('has-image');}
function commit(next){history.push(snapshot());if(history.length>4)history.shift();paint(next);say('Image updated. Download when ready.');}
function run(fn){if(busy)return;if(!original){say('Choose an image first.',true);return;}try{fn();}catch(e){say(e.message||'Unable to process image.',true);}}
function decode(f){
 if(!f)return;
 if(f.size>40*1024*1024){say('Maximum input is 40 MB.',true);return;}
 busy=true;say('Opening image…');
 const url=URL.createObjectURL(f);
 const img=new Image();
 img.onload=()=>{try{C.dims(img.naturalWidth,img.naturalHeight);original=make(img.naturalWidth,img.naturalHeight);original.getContext('2d').drawImage(img,0,0);history=[];paint(original);name=f.name.replace(/\.[^.]+$/,'').replace(/[^\w-]/g,'-').slice(0,60)||'image';say('Image loaded.');}
 catch(e){say(e.message,true);}finally{URL.revokeObjectURL(url);busy=false;}};
 img.onerror=()=>{URL.revokeObjectURL(url);busy=false;say('Unsupported or damaged image.',true);};
 img.src=url;
}
file.addEventListener('change',()=>decode(file.files?.[0]));
const drop=$('im-drop');drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over')});drop.addEventListener('dragleave',()=>drop.classList.remove('over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');decode(e.dataTransfer.files?.[0]);});
$('im-locked').addEventListener('change',()=>{});
$('im-width').addEventListener('input',()=>{if($('im-locked').checked&&canvas.width&&Number($('im-width').value)>0)$('im-height').value=Math.round(Number($('im-width').value)*canvas.height/canvas.width)});
$('im-height').addEventListener('input',()=>{if($('im-locked').checked&&canvas.height&&Number($('im-height').value)>0)$('im-width').value=Math.round(Number($('im-height').value)*canvas.width/canvas.height)});
function resize(){const w=Math.round(Number($('im-width').value)),h=Math.round(Number($('im-height').value));const target=make(w,h);const g=target.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(canvas,0,0,w,h);commit(target);}
function rotate(deg){const d=C.rotatedSize(canvas.width,canvas.height,deg),target=make(d.width,d.height),g=target.getContext('2d');g.translate(d.width/2,d.height/2);g.rotate(deg*Math.PI/180);g.drawImage(canvas,-canvas.width/2,-canvas.height/2);commit(target);}
function flip(horizontal){const target=make(canvas.width,canvas.height),g=target.getContext('2d');g.translate(horizontal?canvas.width:0,horizontal?0:canvas.height);g.scale(horizontal?-1:1,horizontal?1:-1);g.drawImage(canvas,0,0);commit(target);}
function crop(){const r=selection||C.cropRect(Number($('im-x').value),Number($('im-y').value),Number($('im-x').value)+Number($('im-cw').value),Number($('im-y').value)+Number($('im-ch').value),canvas.width,canvas.height);const target=make(r.width,r.height);target.getContext('2d').drawImage(canvas,r.x,r.y,r.width,r.height,0,0,r.width,r.height);commit(target);}
function pixelate(){const n=Math.round(C.clamp($('im-block').value,2,80));const r=selection||{x:0,y:0,width:canvas.width,height:canvas.height};const target=snapshot(),g=target.getContext('2d');const small=make(Math.max(1,Math.ceil(r.width/n)),Math.max(1,Math.ceil(r.height/n)));const sg=small.getContext('2d');sg.imageSmoothingEnabled=false;sg.drawImage(canvas,r.x,r.y,r.width,r.height,0,0,small.width,small.height);g.imageSmoothingEnabled=false;g.drawImage(small,0,0,small.width,small.height,r.x,r.y,r.width,r.height);commit(target);}
function grayscale(threshold){const target=snapshot(),g=target.getContext('2d',{willReadFrequently:true}),p=g.getImageData(0,0,target.width,target.height);for(let i=0;i<p.data.length;i+=4){let y=Math.round(p.data[i]*.2126+p.data[i+1]*.7152+p.data[i+2]*.0722);if(threshold)y=y>=128?255:0;p.data[i]=p.data[i+1]=p.data[i+2]=y;}g.putImageData(p,0,0);commit(target);}
for(const b of root.querySelectorAll('[data-operation]'))b.addEventListener('click',()=>run(()=>{const op=b.dataset.operation;if(op==='resize')resize();else if(op==='crop')crop();else if(op==='left')rotate(-90);else if(op==='right')rotate(90);else if(op==='flip-h')flip(true);else if(op==='flip-v')flip(false);else if(op==='pixelate')pixelate();else if(op==='grayscale')grayscale(false);else if(op==='threshold')grayscale(true);}));
$('im-undo').addEventListener('click',()=>{if(history.length){paint(history.pop());say('Undid last edit.');}});
$('im-reset').addEventListener('click',()=>{if(original){history=[];paint(original);say('Original image restored.');}});
const stage=$('im-stage'),region=$('im-region');
function point(e){const b=canvas.getBoundingClientRect();return{x:Math.round(C.clamp((e.clientX-b.left)/b.width*canvas.width,0,canvas.width)),y:Math.round(C.clamp((e.clientY-b.top)/b.height*canvas.height,0,canvas.height))};}
canvas.addEventListener('pointerdown',e=>{if(!original||e.button!==0)return;dragStart=point(e);canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!dragStart)return;const end=point(e),r=C.cropRect(dragStart.x,dragStart.y,end.x,end.y,canvas.width,canvas.height);selection=r;region.hidden=false;region.style.left=100*r.x/canvas.width+'%';region.style.top=100*r.y/canvas.height+'%';region.style.width=100*r.width/canvas.width+'%';region.style.height=100*r.height/canvas.height+'%';for(const [id,n] of [['im-x',r.x],['im-y',r.y],['im-cw',r.width],['im-ch',r.height]])$(id).value=n;});
canvas.addEventListener('pointerup',()=>{dragStart=null;});
canvas.addEventListener('pointercancel',()=>{dragStart=null;});
for(const id of ['im-x','im-y','im-cw','im-ch'])$(id).addEventListener('input',()=>{selection=null;region.hidden=true;});
function encode(source,mime,quality){return new Promise((resolve,reject)=>source.toBlob(blob=>blob&&blob.type===mime?resolve(blob):reject(Error('Browser does not support this export format.')),mime,quality));}
async function output(source,mime,quality){const c=make(source.width,source.height),g=c.getContext('2d');if(mime==='image/jpeg'){g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);}g.drawImage(source,0,0);return encode(c,mime,quality);}
async function targetSize(source,mime,bytes){if(mime==='image/png')throw Error('Choose JPG or WebP to target a file size.');let current=source,best=null;for(let scale=0;scale<7;scale++){let min=.06,max=.95;for(let n=0;n<9;n++){const q=(min+max)/2,b=await output(current,mime,q);if(!best||b.size<best.size)best=b;if(b.size<=bytes)return{blob:b,width:current.width,height:current.height,hit:true};if(b.size>bytes)max=q;else min=q;}if(current.width<=128||current.height<=128)break;const w=Math.max(128,Math.round(current.width*.8)),h=Math.max(128,Math.round(current.height*.8));const next=make(w,h);next.getContext('2d').drawImage(current,0,0,w,h);current=next;}return{blob:best,width:current.width,height:current.height,hit:false};}
$('im-target-toggle').addEventListener('change',e=>{$('im-target-field').hidden=!e.target.checked;});
download.addEventListener('click',async()=>{if(!original||busy)return;try{busy=true;download.disabled=true;say('Preparing download…');const type=$('im-format').value,mime=C.mime(type),quality=C.clamp($('im-quality').value,10,100)/100;
let result;if($('im-target-toggle').checked){const kb=Number($('im-target').value);if(!Number.isFinite(kb)||kb<5||kb>20000)throw Error('Enter 5–20,000 KB.');result=await targetSize(canvas,mime,kb*1024);}
else result={blob:await output(canvas,mime,quality),hit:true,width:canvas.width,height:canvas.height};
const url=URL.createObjectURL(result.blob),link=document.createElement('a');link.href=url;link.download=name+'-docvelio.'+(type==='jpeg'?'jpg':type);document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);say(result.hit?'Download ready.':'Best effort: the requested KB size was not reached.');}
catch(e){say(e.message,true);}finally{busy=false;download.disabled=false;}});
})();