/* Generate the English Excel Formula Generator page after legacy fixed-count audits.
 * AI handles multilingual prompts; do not create misleading language variants.
 * New route is added to the canonical sitemap and linked from existing pages.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../public');
const host='https://docvelio.com',url=host+'/excel-formula-generator/';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>{const dest=path.join(root,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,s);};
const home=read('index.html');
const header=home.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0];
const footer=home.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0];
if(!header||!footer)throw Error('Missing shared Docvelio navigation or footer');
const desc='Describe a spreadsheet task in your own language and generate an Excel formula with a clear explanation. Copy formulas, browse examples and check simple functions for free.';
const title='Excel Formula Generator – Describe Your Task in Any Language | Docvelio';
const structured={
 '@context':'https://schema.org','@graph':[
  {'@type':'BreadcrumbList',itemListElement:[
   {'@type':'ListItem',position:1,name:'Home',item:host+'/'},
   {'@type':'ListItem',position:2,name:'Excel Formula Generator',item:url}
  ]},
  {'@type':'WebApplication',name:'Excel Formula Generator',url,description:desc,inLanguage:'en',applicationCategory:'BusinessApplication',operatingSystem:'Web',
   offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},
   featureList:['Multilingual natural-language Excel formula generation','Copyable Excel formulas','Free formula examples','Basic Formula.js numeric examples']}
 ]};
const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Docvelio">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${host}/assets/docvelio-social-card.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${host}/assets/docvelio-social-card.png">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="stylesheet" href="/assets/style.css">
<link rel="stylesheet" href="/assets/global-navigation.css">
<link rel="stylesheet" href="/assets/site-polish.css">
<link rel="stylesheet" href="/assets/excel-formula-generator.css">
<script type="application/ld+json">${JSON.stringify(structured)}</script>
<script defer src="/assets/site.js"></script><script defer src="/assets/global-navigation.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/@formulajs/formulajs@4.6.1/lib/browser/formula.min.js"></script>
<script defer src="/assets/excel-formula-generator.js"></script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
${header}
<main id="content">
<div class="ef-wrap">
 <div class="ef-hero">
 <p class="ef-eyebrow">Free Excel tools · Powered by Cloudflare AI</p>
 <h1>Excel Formula Generator</h1>
 <p>Describe what you want in English, Arabic, Urdu, Hindi, Spanish, Chinese or another language. Get a copyable Excel formula with an explanation. No spreadsheet upload required.</p>
 <div class="ef-pills"><span class="ef-pill">AI formula assistant</span><span class="ef-pill">Copy in one click</span><span class="ef-pill">Free examples</span></div>
 </div>
 <div class="ef-grid">
  <section class="ef-card" aria-labelledby="ef-form-title">
   <h2 id="ef-form-title">Describe your formula</h2>
   <form id="ef-form">
    <label for="ef-request">What should Excel calculate?</label>
    <textarea id="ef-request" required minlength="8" maxlength="1200" placeholder="Example: In column D, calculate 15% tax on the price in C2, but leave the cell blank if C2 is empty."></textarea>
    <p class="ef-hint">Use any language, but provide specific cell references, column letters, conditions and ranges when possible. Do not enter confidential workbook data.</p>
    <div class="ef-actions">
     <div><label for="ef-separator">Formula argument separator</label><select id="ef-separator"><option value="comma">Comma (,)</option><option value="semicolon">Semicolon (;)</option></select></div>
     <button class="ef-primary" id="ef-submit" type="submit">Generate formula</button>
    </div>
   </form>
   <p id="ef-status" class="ef-status" role="status" aria-live="polite">Ready. Enter your spreadsheet instruction above.</p>
   <section class="ef-result" id="ef-result" aria-label="Generated formula" hidden>
    <h3>Your Excel formula</h3>
    <pre id="ef-formula"></pre>
    <div class="ef-copybar"><span>Review before pasting</span><button id="ef-copy" type="button" class="ef-secondary" disabled>Copy formula</button></div>
    <p id="ef-explanation"></p>
    <p id="ef-assumptions"></p>
   </section>
  </section>
  <section class="ef-card" aria-labelledby="ef-ex-title">
    <h2 id="ef-ex-title">Try a verified formula example</h2>
    <p class="ef-hint">Click an example to see a working formula immediately, even if AI is unavailable.</p>
    <div id="ef-examples" class="ef-examples"></div>
    <h2 style="margin-top:27px">Test simple maths with Formula.js</h2>
    <label for="ef-sample">Numbers for a sample calculation</label>
    <div class="ef-sample-row"><input id="ef-sample" value="10, 20, 30" aria-label="Numbers to calculate"><button class="ef-secondary" type="button" id="ef-preview">Calculate</button></div>
    <p id="ef-sample-output" class="ef-hint" role="status" aria-live="polite">Runs locally using the open-source Formula.js library.</p>
  </section>
 </div>
 <div class="ef-features">
  <section class="ef-feature"><h3>🌍 Multilingual instructions</h3><p>Describe a calculation in your own language. The AI interprets the request; accuracy depends on clarity and model support.</p></section>
  <section class="ef-feature"><h3>📋 Ready to copy</h3><p>Copy an Excel formula, select your regional argument separator, and adapt placeholder ranges to your data.</p></section>
  <section class="ef-feature"><h3>🔒 No spreadsheet upload</h3><p>The entered instruction is sent to Cloudflare Workers AI for generation. Keep sensitive workbook values private.</p></section>
 </div>
 <article class="ef-info">
 <h2>How to generate an Excel formula</h2>
 <p>Type the calculation you need, for example: “If B2 is over 500, calculate 10% discount; otherwise zero.” Include the exact cells where your data lives. Click <strong>Generate formula</strong>, review the returned explanation, and copy the formula into Excel. If it references a placeholder range, replace it with the correct cells before use.</p>
 <h2>Which formulas are supported?</h2>
 <p>Typical requests include SUM, AVERAGE, COUNTIF, SUMIFS, IF, IFERROR, date calculations, text operations and lookup formulas. Excel versions differ. XLOOKUP and dynamic-array functions may not work in older installations, and non-English Excel installations may display localized function names.</p>
 <h2>Does this accept every language and every formula?</h2>
 <p>You may enter instructions in any language, but the AI does not guarantee accurate interpretation of every language or ambiguous task. It may request more specific details. Generated formulas are checked for basic structure, not evaluated against your actual workbook. Double-check financial and business results before relying on them.</p>
 <h2>Is it free?</h2>
 <p>Docvelio provides free basic formula examples and limited AI generation subject to availability and daily usage capacity. No payment or API key is required from visitors. Source acknowledgements: <a href="https://github.com/formulajs/formulajs" target="_blank" rel="noopener noreferrer">Formula.js (MIT)</a> is used for the example calculator; formula generation uses Cloudflare Workers AI. Read the <a href="/privacy/">privacy policy</a> before submitting spreadsheet instructions.</p>
 </article>
</div>
</main>
${footer}
</body></html>`;
write('excel-formula-generator/index.html',html);
const discovery='<section class="section" data-dv-excel-formula="1" aria-label="Excel formula generator"><div class="container"><h2>Free Excel Formula Generator</h2><p>Describe an Excel calculation in your own language, get a copyable formula and try verified examples. <a href="/excel-formula-generator/">Open the Excel Formula Generator</a>.</p></div></section>';
for(const rel of ['index.html','guides/index.html']){
 let page=read(rel);
 if(!page.includes('data-dv-excel-formula="1"')){
  if(!page.includes('</main>'))throw Error('Missing main on '+rel);
  page=page.replace('</main>',discovery+'</main>');write(rel,page);
 }
}
const file=path.join(root,'sitemap.xml');
let xml=fs.readFileSync(file,'utf8');
if(!xml.includes('<loc>'+url+'</loc>')){
 if(!xml.includes('</urlset>'))throw Error('Sitemap XML incomplete');
 xml=xml.replace('</urlset>','  <url><loc>'+url+'</loc></url>\n</urlset>');
 fs.writeFileSync(file,xml);
}
const txt=path.join(root,'sitemap.txt');
let entries=fs.readFileSync(txt,'utf8').trim().split(/\r?\n/).filter(Boolean);
if(!entries.includes(url)){entries.push(url);entries.sort();fs.writeFileSync(txt,entries.join('\n')+'\n');}
console.log('EXCEL FORMULA GENERATOR: /excel-formula-generator/ built and linked; sitemap updated to '+entries.length+' URLs.');
