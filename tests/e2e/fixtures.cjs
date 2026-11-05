'use strict';
/* Tiny, deterministic, independent fixture documents generated in memory.
 * No customer data, third-party source files or committed binary assets.
 */
function makePdf(pageCount=3){
 if(!Number.isSafeInteger(pageCount)||pageCount<1||pageCount>10)throw Error('Bad pageCount');
 const pageRefs=Array.from({length:pageCount},(_,i)=>3+i*2);
 const fontId=3+pageCount*2;
 const objects=[
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids ['+pageRefs.map(n=>n+' 0 R').join(' ')+'] /Count '+pageCount+' >>'
 ];
 for(let i=0;i<pageCount;i++){
  const content='BT /F1 22 Tf 72 710 Td (Docvelio QA page '+(i+1)+') Tj ET\n';
  objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 '+fontId+' 0 R >> >> /Contents '+(pageRefs[i]+1)+' 0 R >>');
  objects.push('<< /Length '+Buffer.byteLength(content,'latin1')+' >>\nstream\n'+content+'endstream');
 }
 objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
 let out='%PDF-1.4\n',offsets=[0];
 for(let i=0;i<objects.length;i++){
  offsets.push(Buffer.byteLength(out,'latin1'));
  out+=(i+1)+' 0 obj\n'+objects[i]+'\nendobj\n';
 }
 const xref=Buffer.byteLength(out,'latin1');
 out+='xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n';
 for(let i=1;i<offsets.length;i++)out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
 out+='trailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';
 return Buffer.from(out,'latin1');
}
const tinyPng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5v4XYAAAAASUVORK5CYII=','base64');
module.exports={makePdf,tinyPng};
