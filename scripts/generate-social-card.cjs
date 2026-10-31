/* Produces a 1200x630 standards-compatible social card without external dependencies. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const W=1200,H=630,raw=Buffer.alloc(H*(1+W*4));
function paint(x,y,r,g,b,a=255){if(x<0||y<0||x>=W||y>=H)return;const k=y*(1+W*4)+1+x*4;raw[k]=r;raw[k+1]=g;raw[k+2]=b;raw[k+3]=a;}
function rect(x,y,w,h,c,radius=0){for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){const dx=Math.max(x+radius-xx,0,xx-(x+w-radius-1)),dy=Math.max(y+radius-yy,0,yy-(y+h-radius-1));if(dx*dx+dy*dy<=radius*radius)paint(xx,yy,...c);}}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=x/W;paint(x,y,Math.round(12+16*t),Math.round(32+39*t),Math.round(72+69*t));}
rect(75,82,118,140,[255,255,255],16);rect(104,111,118,140,[142,210,250],16);
rect(130,148,56,10,[28,83,170],5);rect(130,170,44,10,[28,83,170],5);rect(130,192,50,10,[28,83,170],5);
rect(76,324,615,22,[235,245,255],10);rect(76,377,515,15,[165,208,246],7);rect(76,414,575,15,[165,208,246],7);
rect(76,488,210,54,[63,133,243],20);rect(309,488,226,54,[31,81,151],20);
rect(765,125,351,390,[239,247,255],22);rect(797,164,288,44,[215,230,253],10);
rect(800,245,129,151,[99,156,232],14);rect(950,245,129,151,[178,214,250],14);
rect(801,422,278,18,[103,155,228],7);rect(801,460,210,13,[166,195,231],6);
function chunk(type,data){const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const t=Buffer.from(type);const checksum=Buffer.concat([t,data]);let crc=0xffffffff;for(const b of checksum){crc^=b;for(let n=0;n<8;n++)crc=crc&1?0xedb88320^(crc>>>1):crc>>>1;}const c=Buffer.alloc(4);c.writeUInt32BE((crc^0xffffffff)>>>0);return Buffer.concat([len,t,data,c]);}
const head=Buffer.alloc(13);head.writeUInt32BE(W,0);head.writeUInt32BE(H,4);head[8]=8;head[9]=6;
const png=Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',head),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
const target=path.join(__dirname,'..','public','assets','docvelio-social-card.png');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,png);console.log('Generated social preview:',target,png.length+' bytes');