/* Builds five genuinely working, SEO-ready Europe tools AFTER legacy page audits.
 * English language pages; globally linked from existing locale menus (no fake translations).
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..','public'),host='https://docvelio.com';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const header=home.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0];
const footer=home.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0];
if(!header||!footer)throw Error('Expected final global header and footer before Europe tools build');
const numeric=(name,label,val,min,max,step='any',wide=false)=>({name,label,val,type:'number',min,max,step,wide});
const text=(name,label,val='',wide=false,max=140)=>({name,label,val,type:'text',max,wide});
const select=(name,label,options,wide=false)=>({name,label,type:'select',options,wide});
const standard=[select('size','Paper size',[['A4','A4 · 210 × 297 mm'],['A3','A3 · 297 × 420 mm'],['A5','A5 · 148 × 210 mm'],['A2','A2 · 420 × 594 mm'],['Letter','US Letter · 215.9 × 279.4 mm']]),select('orientation','Orientation',[['portrait','Portrait'],['landscape','Landscape']])];
const tools=[
{slug:'calculators/euro-pallet-stacking-calculator',kind:'pallet',title:'Euro Pallet Stacking Calculator | Boxes per Pallet',h1:'Euro Pallet Stacking Calculator',desc:'Calculate cartons per Euro pallet, full and partial layers, stack height and payload. Preview a 1200 × 800 mm EPAL 1 layer layout online.',intro:'Estimate how many cartons fit on a standard 1,200 × 800 mm European pallet. Enter carton dimensions, weight and a total height limit to get a practical planning layout.',fields:[numeric('length','Carton length (mm)',400,1,1200),numeric('width','Carton width (mm)',300,1,1200),numeric('height','Carton height (mm)',200,1,2000),numeric('kg','Weight per carton (kg)',12,.001,1500),numeric('maxHeight','Maximum overall pallet height (mm)',1500,145,5000),numeric('loadLimit','Maximum carton payload (kg)',1500,1,1500)],button:'Calculate pallet layout',
guide:[['How the Euro pallet calculation works','An EPAL 1 Euro pallet measures 1,200 × 800 × 144 mm. The tool tests both uniform carton orientations and selects the one with more cartons per layer. Height includes the pallet itself. It also limits cartons by the entered load capacity.'],['What this result does not guarantee','A rectangular, uniform-orientation calculation cannot prove that a shipment is safe to stack or that mixed rotations could not fit more cartons. Check packaging strength, overhang, centre of gravity, pallet condition and shipment requirements before loading.'],['What is the EPAL safe working load?','EPAL lists a nominal safe working load of 1,500 kg for an EPAL 1 Euro pallet. Your actual operational limit may be lower, and the entered carton weight must represent the full packed carton.']],
source:'https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet'},
{slug:'image-tools/a4-a3-dpi-pixel-calculator',kind:'dpi',title:'A4 & A3 DPI to Pixels Calculator | Print Size',h1:'A4/A3 DPI & Pixel Calculator',desc:'Convert A4 and A3 paper sizes to pixels at 72, 150, 300 or custom DPI. Get width, height, millimetres and inches for print artwork.',intro:'Work out the exact pixel dimensions you need for A4, A3 and other print sizes, with portrait or landscape orientation and any supported DPI.',fields:[...standard,numeric('dpi','Resolution (DPI)',300,36,2400)],button:'Calculate pixels',
guide:[['How to calculate paper size in pixels','Multiply each millimetre dimension by your desired DPI, then divide by 25.4. The result is rounded to the nearest whole pixel. For A4 portrait at 300 DPI, the result is 2480 × 3508 pixels.'],['What is the difference between DPI and PPI?','DPI refers to printer dot density, while PPI refers to raster image pixels per inch. This calculator estimates the pixel dimensions of an image prepared for a selected print density.'],['Does this tool resize my uploaded photo?','No. It computes target dimensions. For actual image resizing, use Docvelio’s Image Studio or resize tool.']],
source:'https://support.hp.com/us-en/document/bpq04022'},
{slug:'calculators/sepa-qr-code-generator',kind:'sepa',title:'SEPA Payment QR Code Generator | EPC GiroCode',h1:'SEPA Payment QR Code Generator',desc:'Create EPC SEPA Credit Transfer QR codes for invoice payments. Validate IBAN and BIC, specify EUR amount and download QR PNG locally.',intro:'Generate a European Payments Council payment QR code with beneficiary details, IBAN and optional amount or payment reference. Download the graphic for an invoice.',fields:[text('name','Beneficiary name','',true,70),text('iban','IBAN (required)','',true,34),text('bic','BIC / SWIFT (optional)','',false,11),numeric('amount','Amount in EUR (optional)','',.01,999999999.99),text('rf','Structured RF reference (optional)','',true,25),text('note','Unstructured payment note (instead of RF)','',true,140)],button:'Generate SEPA QR code',
guide:[['What format does the SEPA QR code use?','It follows the European Payments Council EPC069-12 QR guidelines for SEPA Credit Transfer data capture, commonly used on invoices. The QR contains payment instructions, not proof of payment.'],['What payment information is required?','Provide beneficiary name and a correctly formatted IBAN. BIC, EUR amount, and one form of payment reference may also be included. The tool checks IBAN check digits but cannot confirm ownership or bank account status.'],['Can any banking application scan it?','No. Bank support varies. Show the payment details in readable text beside the QR and verify them before issuing an invoice. EPC warns this format is not designed for retail point-of-interaction QR-only payment use cases.'],['Data privacy','Payment details are processed locally in your browser by a bundled, MIT-licensed open-source QR encoder. No QR generation API is called.']],
source:'https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/quick-response-code-guidelines-enable-data-capture-initiation'},
{slug:'image-tools/bleed-print-margin-calculator',kind:'bleed',title:'Print Bleed & Safe Margin Calculator | A4 A3',h1:'Bleed & Print Margin Calculator',desc:'Calculate print bleed, trim and safe margin dimensions for A4, A3 or custom orientation. Download a labelled SVG print guide with pixel sizes.',intro:'Enter your paper size, bleed and safe margin to calculate the full document size and a practical visual guide for print layouts.',fields:[...standard,numeric('bleed','Bleed per side (mm)',3,0,25),numeric('safe','Safe margin inside trim (mm)',5,0,60),numeric('dpi','Artwork DPI',300,36,2400)],button:'Calculate print dimensions',
guide:[['What is bleed in print design?','Bleed extends artwork beyond the trim edge, so minor cutting variation does not leave white slivers. A 3 mm bleed on each edge adds 6 mm to both width and height.'],['What is a safe margin?','The safe area is inset from the final trim edge to keep text and critical details away from cutting. Your printer determines the required bleed and safe margin.'],['A4 example with 3 mm bleed','A4 is 210 × 297 mm. With 3 mm bleed on each side, create a 216 × 303 mm document. A 5 mm safe margin leaves a 200 × 287 mm content zone.']],
source:'https://support.hp.com/us-en/document/bpq04022'},
{slug:'calculators/rf-creditor-reference-generator',kind:'rf',title:'RF Creditor Reference Generator & Validator | ISO 11649',h1:'RF Creditor Reference Generator',desc:'Generate and check ISO 11649 RF creditor references with MOD-97 check digits. Copy electronic or spaced payment references for EU invoices.',intro:'Create an ISO 11649 structured creditor reference for invoices, or validate the check digits of an existing RF reference. Runs completely in your browser.',fields:[text('base','Invoice/customer reference (1–21 letters or digits)','2348231',true,21),text('check','Optional: validate existing RF reference','',true,29)],button:'Generate or verify RF reference',
guide:[['What is an RF creditor reference?','ISO 11649 defines a structured reference beginning with RF, two check digits and up to 21 alphanumeric reference characters. The total length is at most 25 characters.'],['How are the RF check digits calculated?','Move RF00 to the end of the base reference, convert letters to numbers (A=10 through Z=35), calculate modulo 97 and subtract the remainder from 98. The verification calculation must give a remainder of 1.'],['Worked example','The base reference 2348231 generates RF712348231, displayed as RF71 2348 231. Check digits detect many mistyped values; they do not verify that an invoice exists.']],
source:'https://www.iso.org/standard/50649.html'}
];
function field(x){
 if(x.type==='select')return '<div class="dv-eu-field'+(x.wide?' wide':'')+'"><label for="dv-f-'+x.name+'">'+esc(x.label)+'</label><select id="dv-f-'+x.name+'" name="'+x.name+'">'+x.options.map(([v,l])=>'<option value="'+esc(v)+'">'+esc(l)+'</option>').join('')+'</select></div>';
 return '<div class="dv-eu-field'+(x.wide?' wide':'')+'"><label for="dv-f-'+x.name+'">'+esc(x.label)+'</label><input id="dv-f-'+x.name+'" type="'+x.type+'" name="'+x.name+'" value="'+esc(x.val)+'" '+(x.type==='number'?'min="'+x.min+'" max="'+x.max+'" step="'+(x.step||'any')+'" inputmode="decimal"':'maxlength="'+x.max+'"')+'></div>';
}
const links=tools.map(t=>({slug:t.slug,title:t.h1}));
for(const t of tools){
 const url=host+'/'+t.slug+'/',output=path.join(root,t.slug,'index.html');
 const related=links.filter(a=>a.slug!==t.slug).slice(0,4);
 const structured={'@context':'https://schema.org','@graph':[
  {'@type':'WebApplication',name:t.h1,url,description:t.desc,applicationCategory:'UtilitiesApplication',operatingSystem:'Web',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:host+'/'},{'@type':'ListItem',position:2,name:t.h1,item:url}]}
 ]};
 const content='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'+
 '<title>'+esc(t.title)+' | Docvelio</title><meta name="description" content="'+esc(t.desc)+'"><meta name="robots" content="index,follow"><link rel="canonical" href="'+url+'">'+
 '<meta property="og:type" content="website"><meta property="og:title" content="'+esc(t.h1)+'"><meta property="og:description" content="'+esc(t.desc)+'"><meta property="og:url" content="'+url+'"><meta property="og:image" content="'+host+'/assets/docvelio-social-card.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="'+host+'/assets/docvelio-social-card.png">'+
 '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">'+
 '<link rel="stylesheet" href="/assets/style.css"><link rel="stylesheet" href="/assets/global-navigation.css"><link rel="stylesheet" href="/assets/site-polish.css"><link rel="stylesheet" href="/assets/europe-tools.css">'+
 '<script type="application/ld+json">'+JSON.stringify(structured)+'</script><script defer src="/assets/site.js"></script><script defer src="/assets/global-navigation.js"></script>'+
 '<script defer src="/assets/europe-tools-core.js"></script>'+(t.kind==='sepa'?'<script defer src="/assets/vendor/qrcode-generator.js"></script>':'')+'<script defer src="/assets/europe-tools-ui.js"></script></head><body>'+
 '<a class="skip" href="#content">Skip to calculator</a>'+header+
 '<main id="content" class="dv-eu-main"><div class="dv-eu-wrap"><p class="dv-eu-breadcrumb"><a href="/">Home</a> / '+esc(t.h1)+'</p>'+
 '<div class="dv-eu-intro"><span class="dv-eu-label">Docvelio · Free online utility</span><h1>'+esc(t.h1)+'</h1><p>'+esc(t.intro)+'</p><div class="dv-eu-meta"><span>Free to use</span><span>No spreadsheet or document uploads</span><span>Mobile friendly</span></div></div>'+
 '<section id="dv-eu-tool" data-tool="'+t.kind+'" class="dv-eu-layout" aria-label="'+esc(t.h1)+'"><div class="dv-eu-panel"><h2>Enter your details</h2><form id="dv-eu-form"><div class="dv-eu-fields">'+t.fields.map(field).join('')+'</div><button class="dv-eu-primary" type="submit">'+esc(t.button)+'</button></form><p class="dv-eu-status" id="dv-eu-status" aria-live="polite">Your inputs stay in your browser.</p></div>'+
 '<div class="dv-eu-panel dv-eu-results"><h2>Results</h2><div id="dv-eu-output" class="dv-eu-output" hidden></div></div></section>'+
 '<section class="dv-eu-guide" aria-label="Calculator guide"><h2>How to use this tool</h2><p>'+esc(t.intro)+'</p>'+t.guide.map(([h,p])=>'<h3>'+esc(h)+'</h3><p>'+esc(p)+'</p>').join('')+
 '<p><strong>Reference:</strong> <a href="'+esc(t.source)+'" rel="noopener noreferrer" target="_blank">Official specifications and background</a>. Results should be independently checked when used for payments, production or logistics.</p></section>'+
 '<section class="dv-eu-related" aria-label="More Docvelio calculators"><h2>Related free tools</h2><div class="dv-eu-related-grid">'+related.map(r=>'<a href="/'+r.slug+'/">'+esc(r.title)+' <span aria-hidden="true">↗</span></a>').join('')+
 '<a href="/excel-formula-generator/">Excel Formula Generator <span aria-hidden="true">↗</span></a></div></section></div></main>'+footer+'</body></html>';
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,content,'utf8');
}
const mapFile=path.join(root,'sitemap.xml');let sitemap=fs.readFileSync(mapFile,'utf8');
const textFile=path.join(root,'sitemap.txt');let urls=fs.readFileSync(textFile,'utf8').trim().split(/\r?\n/).filter(Boolean);
for(const t of tools){
 const url=host+'/'+t.slug+'/';
 if(!sitemap.includes('<loc>'+url+'</loc>'))sitemap=sitemap.replace('</urlset>','  <url><loc>'+url+'</loc></url>\n</urlset>');
 if(!urls.includes(url))urls.push(url);
}
fs.writeFileSync(mapFile,sitemap,'utf8');fs.writeFileSync(textFile,urls.sort().join('\n')+'\n','utf8');
console.log('EUROPE TOOLS: 5 functional tool pages generated, with schema, canonical URLs, related links and sitemap entries.');
