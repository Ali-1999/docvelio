/* Docvelio QR encoder, original implementation for EPC SEPA payment payloads.
 * QR Model 2, byte mode, error-correction level M, versions 1–13.
 * No packages, copied repositories, network calls or runtime dependencies.
 * QR block sizes and error-correction parameters follow ISO/IEC 18004.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.DVQRCode=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 // [data codewords, ECC codewords per block, block count] at correction level M.
 const formats=[null,[16,10,1],[28,16,1],[44,26,1],[64,18,2],
  [86,24,2],[108,16,4],[124,18,4],[154,22,4],[182,22,5],
  [216,26,5],[254,30,5],[290,22,8],[334,22,9]];
 const bit=(n,i)=>(n>>>i)&1;
 function gfMultiply(a,b){
  let z=0;
  for(let i=7;i>=0;i--){
   z=(z<<1)^((z&128)?0x11d:0);
   z^=((b>>>i)&1)?a:0;
  }
  return z&255;
 }
 function parity(data,n){
  let poly=[1];
  for(let i=0,p=1;i<n;i++){
   const next=new Array(poly.length+1).fill(0);
   for(let j=0;j<poly.length;j++){
    next[j]^=poly[j];
    next[j+1]^=gfMultiply(poly[j],p);
   }
   poly=next;p=gfMultiply(p,2);
  }
  const rem=new Array(n).fill(0);
  for(const d of data){
   const lead=d^rem.shift();rem.push(0);
   for(let i=0;i<n;i++)rem[i]^=gfMultiply(poly[i+1],lead);
  }
  return rem;
 }
 function codewords(bytes,version){
  const [capacity,ecc,blocks]=formats[version];
  const bits=[];
  function add(n,length){for(let i=length-1;i>=0;i--)bits.push(bit(n,i));}
  add(4,4);add(bytes.length,version<=9?8:16);
  for(const b of bytes)add(b,8);
  if(bits.length>capacity*8)throw Error('QR content exceeds the available capacity.');
  for(let i=0;i<4&&bits.length<capacity*8;i++)bits.push(0);
  while(bits.length%8!==0)bits.push(0);
  const data=[];
  for(let i=0;i<bits.length;i+=8){
   let b=0;
   for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];
   data.push(b);
  }
  for(let i=0;data.length<capacity;i++)data.push(i%2===0?0xec:0x11);
  const short=Math.floor(capacity/blocks),long=capacity%blocks;
  const groups=[];let offset=0;
  for(let i=0;i<blocks;i++){
   const n=short+(i>=blocks-long?1:0);
   const chunk=data.slice(offset,offset+n);
   groups.push({data:chunk,ecc:parity(chunk,ecc)});
   offset+=n;
  }
  const result=[];
  for(let i=0;i<short+1;i++)for(const group of groups)if(i<group.data.length)result.push(group.data[i]);
  for(let i=0;i<ecc;i++)for(const group of groups)result.push(group.ecc[i]);
  if(result.length!==capacity+ecc*blocks)throw Error('QR block interleaving failed.');
  return result;
 }
 function encode(text){
  if(typeof text!=='string'||text.length===0)throw Error('QR content cannot be empty.');
  if(typeof TextEncoder==='undefined')throw Error('UTF-8 encoding is unavailable in this browser.');
  const bytes=new TextEncoder().encode(text);
  let version=0;
  for(let v=1;v<formats.length;v++){
   const countBits=v<=9?8:16;
   if(4+countBits+bytes.length*8<=formats[v][0]*8){version=v;break;}
  }
  if(!version)throw Error('QR payload is too large for the supported EPC QR versions.');
  const size=version*4+17;
  const modules=Array.from({length:size},()=>new Array(size).fill(false));
  const reserved=Array.from({length:size},()=>new Array(size).fill(false));
  function put(x,y,dark){
   if(x<0||y<0||x>=size||y>=size)return;
   modules[y][x]=!!dark;
   reserved[y][x]=true;
  }
  // Timing patterns first, then separators/finder patterns.
  for(let i=0;i<size;i++){
   put(6,i,i%2===0);
   put(i,6,i%2===0);
  }
  function finder(cx,cy){
   for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
    const radius=Math.max(Math.abs(dx),Math.abs(dy));
    put(cx+dx,cy+dy,radius===3||radius<=1);
   }
  }
  finder(3,3);finder(size-4,3);finder(3,size-4);
  // Alignment locations are defined by QR version.
  if(version>=2){
   const count=Math.floor(version/7)+2;
   const step=version===32?26:Math.ceil((size-13)/(count-1)/2)*2;
   const coords=[6];
   for(let i=count-2;i>=0;i--)coords.push(size-7-i*step);
   for(let row=0;row<count;row++)for(let col=0;col<count;col++){
    if((row===0&&col===0)||(row===0&&col===count-1)||(row===count-1&&col===0))continue;
    const cx=coords[col],cy=coords[row];
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
     const r=Math.max(Math.abs(dx),Math.abs(dy));
     put(cx+dx,cy+dy,r===2||r===0);
    }
   }
  }
  function format(mask){
   const data=mask; // ECL M is encoded as binary 00.
   let value=data<<10;
   for(let i=14;i>=10;i--)if(bit(value,i))value^=0x537<<(i-10);
   value=((data<<10)|value)^0x5412;
   for(let i=0;i<=5;i++)put(8,i,bit(value,i));
   put(8,7,bit(value,6));put(8,8,bit(value,7));put(7,8,bit(value,8));
   for(let i=9;i<15;i++)put(14-i,8,bit(value,i));
   for(let i=0;i<8;i++)put(size-1-i,8,bit(value,i));
   for(let i=8;i<15;i++)put(8,size-15+i,bit(value,i));
   put(8,size-8,true);
  }
  format(0); // Reserve format locations before placing data.
  if(version>=7){
   let remainder=version<<12;
   for(let i=17;i>=12;i--)if(bit(remainder,i))remainder^=0x1f25<<(i-12);
   const value=(version<<12)|remainder;
   for(let i=0;i<18;i++){
    const a=size-11+i%3,b=Math.floor(i/3);
    put(a,b,bit(value,i));
    put(b,a,bit(value,i));
   }
  }
  const cw=codewords(bytes,version);
  const dataBits=cw.flatMap(byte=>Array.from({length:8},(_,i)=>bit(byte,7-i)));
  let index=0,upward=true;
  for(let right=size-1;right>=1;right-=2){
   if(right===6)right=5;
   for(let t=0;t<size;t++){
    const y=upward?size-1-t:t;
    for(let d=0;d<2;d++){
     const x=right-d;
     if(!reserved[y][x])modules[y][x]=dataBits[index++]===1;
    }
   }
   upward=!upward;
  }
  if(index<dataBits.length)throw Error('QR module capacity was insufficient.');
  function masked(x,y,mask){
   if(mask===0)return (x+y)%2===0;
   if(mask===1)return y%2===0;
   if(mask===2)return x%3===0;
   if(mask===3)return (x+y)%3===0;
   if(mask===4)return (Math.floor(y/2)+Math.floor(x/3))%2===0;
   const product=x*y;
   if(mask===5)return product%2+product%3===0;
   if(mask===6)return (product%2+product%3)%2===0;
   return ((x+y)%2+product%3)%2===0;
  }
  // Only data modules are masked. Function patterns remain unchanged.
  function candidate(mask){
   const m=modules.map((line,y)=>line.map((dark,x)=>reserved[y][x]?dark:(dark!==masked(x,y,mask))));
   const old=modules.map(line=>line.slice());
   for(let y=0;y<size;y++)for(let x=0;x<size;x++)modules[y][x]=m[y][x];
   format(mask);
   const copy=modules.map(line=>line.slice());
   for(let y=0;y<size;y++)for(let x=0;x<size;x++)modules[y][x]=old[y][x];
   return copy;
  }
  function penalty(m){
   let score=0,black=0;
   function line(seq){
    let run=1;
    for(let i=0;i<seq.length;i++){
     if(i>0&&seq[i]===seq[i-1])run++;
     else{if(run>=5)score+=3+run-5;run=1;}
    }
    if(run>=5)score+=3+run-5;
    const a='10111010000',b='00001011101',str=seq.map(x=>x?'1':'0').join('');
    for(let i=0;i<=seq.length-11;i++)if(str.slice(i,i+11)===a||str.slice(i,i+11)===b)score+=40;
   }
   for(let y=0;y<size;y++){line(m[y]);for(const c of m[y])if(c)black++;}
   for(let x=0;x<size;x++)line(m.map(row=>row[x]));
   for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++)if(m[y][x]===m[y][x+1]&&m[y][x]===m[y+1][x]&&m[y][x]===m[y+1][x+1])score+=3;
   score+=Math.floor(Math.abs(black*20-size*size*10)/(size*size))*10;
   return score;
  }
  let best=null,min=Infinity,mask=0;
  for(let i=0;i<8;i++){const result=candidate(i),p=penalty(result);if(p<min){best=result;min=p;mask=i;}}
  return {size,modules:best,version,mask,level:'M',byteLength:bytes.length};
 }
 return {encode};
});
