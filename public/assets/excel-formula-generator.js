'use strict';
(function(){
 const $=id=>document.getElementById(id);
 const form=$('ef-form'),prompt=$('ef-request'),status=$('ef-status'),result=$('ef-result'),
 formula=$('ef-formula'),explanation=$('ef-explanation'),assumptions=$('ef-assumptions'),
 copy=$('ef-copy'),sep=$('ef-separator'),sample=$('ef-sample'),sampleOutput=$('ef-sample-output');
 let raw='';
 const examples=[
  {text:'Sum values from B2 to B100',formula:'=SUM(B2:B100)',note:'Totals numeric values in the selected range.'},
  {text:'Average values in column C from row 2 to 30',formula:'=AVERAGE(C2:C30)',note:'Returns the arithmetic average of the range.'},
  {text:'Count rows where column A says Paid',formula:'=COUNTIF(A2:A100,"Paid")',note:'Counts matching cells in the range.'},
  {text:'If B2 is greater than 100, show High, otherwise Low',formula:'=IF(B2>100,"High","Low")',note:'Returns one of two text results based on a condition.'},
  {text:'Look up A2 in D2:D100 and return E2:E100',formula:'=XLOOKUP(A2,D2:D100,E2:E100,"Not found")',note:'Looks up a value in another range. Requires an Excel version with XLOOKUP.'},
  {text:'Join A2 and B2 with a space',formula:'=A2&" "&B2',note:'Combines two cells into a single text string.'},
  {text:'Calculate percentage change from A2 to B2',formula:'=IFERROR((B2-A2)/A2,0)',note:'Format the result cell as a percentage.'}
 ];
 function format(f){if(sep.value!=='semicolon')return f;let quoted=false,out='';for(let i=0;i<f.length;i++){const c=f[i];if(c==='"'){if(quoted&&f[i+1]==='"'){out+='""';i++;continue;}quoted=!quoted;}out+=(c===','&&!quoted)?';':c;}return out;}
 function show(f,info,note){raw=f;formula.textContent=format(f);explanation.textContent=info||'';assumptions.textContent=note||'';result.hidden=false;copy.disabled=false;status.textContent='Formula ready. Check cell references in your workbook before using it.';}
 sep.addEventListener('change',()=>{if(raw)formula.textContent=format(raw);});
 form.addEventListener('submit',async e=>{
  e.preventDefault();const value=prompt.value.trim();
  if(value.length<8){status.textContent='Please explain what you need and include relevant cells or column ranges.';return;}
  const button=$('ef-submit');button.disabled=true;status.textContent='Generating formula…';
  try{
   const r=await fetch('/api/excel-formula',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({request:value})});
   const data=await r.json();
   if(!r.ok)throw new Error(data.error||'The formula service is unavailable.');
   if(!data.formula||data.formula[0]!=='=')throw new Error('No valid formula returned.');
   show(data.formula,data.explanation,data.assumptions);
  }catch(err){status.textContent=String(err.message||err)+' You can still use the verified examples below.';}
  finally{button.disabled=false;}
 });
 copy.addEventListener('click',async()=>{
  if(!raw)return;const value=format(raw);
  try{await navigator.clipboard.writeText(value);status.textContent='Formula copied to clipboard.';}
  catch{const input=document.createElement('textarea');input.value=value;document.body.appendChild(input);input.select();const ok=document.execCommand('copy');input.remove();status.textContent=ok?'Formula copied.':'Select and copy the displayed formula manually.';}
 });
 for(const example of examples){
  const button=document.createElement('button');button.type='button';button.className='ef-example';
  button.textContent=example.text;
  button.addEventListener('click',()=>{prompt.value=example.text;show(example.formula,example.note,'Example ranges are placeholders. Replace them with your own spreadsheet references.');});
  $('ef-examples').appendChild(button);
 }
 $('ef-preview').addEventListener('click',()=>{
  const nums=sample.value.split(/[,;\s]+/).map(x=>x.trim()).filter(Boolean).map(Number);
  if(nums.length<2||nums.length>100||nums.some(n=>!Number.isFinite(n))){sampleOutput.textContent='Enter 2 to 100 numbers separated by commas or spaces.';return;}
  const total=nums.reduce((sum,n)=>sum+n,0),average=total/nums.length;
  sampleOutput.textContent='Docvelio calculation: SUM = '+total+' | AVERAGE = '+average;
 });
})();
