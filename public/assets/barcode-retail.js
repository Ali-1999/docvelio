/* Original dependency-free linear barcode encoder, runs entirely in the browser. */
(function(global){'use strict';
const L=['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const G=['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const R=['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const parity=['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
const ITF=['00110','10001','01001','11000','00101','10100','01100','00011','10010','01010'];
function checkDigit(body){let n=0;for(let i=body.length-1,w=3;i>=0;i--,w=w===3?1:3)n+=Number(body[i])*w;return String((10-n%10)%10);}
function retail(value,format){
 const digits=value.trim(),len=format==='ean13'?13:12;
 if(!new RegExp('^\\d{'+(len-1)+','+len+'}$').test(digits))throw Error('Enter '+(len-1)+' or '+len+' digits.');
 const data=digits.length===len-1?digits+checkDigit(digits):digits;
 if(checkDigit(data.slice(0,-1))!==data.at(-1))throw Error('Invalid check digit.');
 const ean=format==='upca'?'0'+data:data,mode=parity[Number(ean[0])];
 let bits='101';for(let i=1;i<=6;i++)bits+=(mode[i-1]==='L'?L:G)[Number(ean[i])];
 bits+='01010';for(let i=7;i<13;i++)bits+=R[Number(ean[i])];bits+='101';
 return {bits,text:data};
}
function itf(value){
 const data=value.trim();if(!/^\d{2,80}$/.test(data)||data.length%2)throw Error('ITF needs an even number of digits (2–80).');
 let bits='1010';for(let i=0;i<data.length;i+=2){const b=ITF[Number(data[i])],s=ITF[Number(data[i+1])];for(let j=0;j<5;j++)bits+='1'.repeat(b[j]==='1'?3:1)+'0'.repeat(s[j]==='1'?3:1);}
 return {bits:bits+'11101',text:data};
}
global.DocvelioLinear={encode:(format,value)=>format==='itf'?itf(value):retail(value,format),checkDigit};
})(window);
