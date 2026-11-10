/* Generate the optional llms.txt discovery index from verified Docvelio routes. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public'),base='https://docvelio.com';
const links=[
 ['PDF editor','/tools/edit-pdf/','Add visible text, drawings and highlights to PDF pages.'],
 ['Merge PDF','/tools/merge-pdf/','Combine PDF files in a chosen order.'],
 ['Split PDF','/tools/split-pdf/','Extract selected PDF pages into a separate file.'],
 ['Word Editor','/tools/word-editor/','Open and edit supported DOCX documents.'],
 ['Image Studio','/image-editor/','Work with image editing and conversion tools.'],
 ['Resize Image','/image-tools/resize-image/','Resize images to chosen dimensions.'],
 ['Excel Formula Generator','/excel-formula-generator/','Generate copyable Excel formulas from natural-language instructions.'],
 ['CBM Calculator','/cbm-calculator/','Estimate shipment volume from package dimensions.'],
 ['Euro Pallet Stacking Calculator','/calculators/euro-pallet-stacking-calculator/','Estimate carton layers and pallet stack height.'],
 ['A4/A3 DPI Calculator','/image-tools/a4-a3-dpi-pixel-calculator/','Calculate print image pixel dimensions at a selected DPI.'],
 ['SEPA Payment QR Generator','/calculators/sepa-qr-code-generator/','Create EPC SEPA credit-transfer QR payment data.'],
 ['Bleed and Print Margin Calculator','/image-tools/bleed-print-margin-calculator/','Calculate print bleed and safe-margin dimensions.'],
 ['RF Creditor Reference Generator','/calculators/rf-creditor-reference-generator/','Generate and validate an ISO 11649 RF creditor reference.'],
 ['QR Code Generator','/tools/qr-code-generator/','Create a QR code from entered text or a destination URL.'],
 ['Barcode Generator','/tools/barcode-generator/','Create supported barcode formats in the browser.'],
 ['Guides','/guides/','Read practical PDF, privacy, scanning and Word-formatting guides.'],
 ['Blog','/blog/','Read Docvelio tutorials and workflow explanations.'],
 ['About Docvelio','/about/','Learn about the site operator and service.'],
 ['Privacy Policy','/privacy/','Review privacy, processing and third-party service information.'],
 ['Contact','/contact/','Contact Docvelio support.']
];
const lines=[
 '# Docvelio',
 '> Docvelio is a browser-based toolkit for PDF, Word, image and practical calculation tasks.',
 '',
 '## How to interpret tool pages',
 'Each tool page describes its supported inputs, outputs and limitations. Do not assume every operation uses the same processing model: PDF and image operations may run locally in the browser, while Excel formula requests are sent to Cloudflare Workers AI. Do not submit confidential information to AI-powered features.',
 '',
 '## Main tools',
 ...links.map(([name,route,description])=>'- ['+name+']('+base+route+') — '+description),
 '',
 '## Policies and site information',
 '- [Terms of Use]('+base+'/terms/) — service terms and limitations.',
 '- [Privacy Policy]('+base+'/privacy/) — data processing and third-party services.',
 '- [Contact]('+base+'/contact/) — support contact.',
 '',
 '## Crawl discovery',
 '- [XML sitemap]('+base+'/sitemap.xml)',
 '- [Robots.txt]('+base+'/robots.txt)',
 '',
 'This file is a concise site guide for automated readers. It does not replace the canonical pages, robots.txt or sitemap and does not guarantee indexing, rankings or AI citations.'
];
for(const [name,route] of links){
 const clean=route.slice(1).replace(/\/$/,'');
 if(!fs.existsSync(path.join(root,clean,'index.html')))throw Error('llms.txt route missing: '+route+' ('+name+')');
}
fs.writeFileSync(path.join(root,'llms.txt'),lines.join('\n')+'\n','utf8');
console.log('llms.txt generated with '+links.length+' verified canonical links.');
