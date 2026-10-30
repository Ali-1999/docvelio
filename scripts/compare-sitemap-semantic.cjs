/* Compare the committed sitemap to the generated sitemap, ignoring only
 * cosmetically different XML self-closing tag whitespace.
 * Both representations are separately schema/URL-validated by verify-sitemap.py.
 */
'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const source=cp.execFileSync('git',['show','HEAD:public/sitemap.xml'],{encoding:'utf8',maxBuffer:5*1024*1024});
const build=fs.readFileSync('public/sitemap.xml','utf8');
const normalize=s=>s.replace(/\s+\/>/g,'/>').replace(/\r\n/g,'\n').trim();
assert.equal(normalize(source),normalize(build),'Generated sitemap differs from committed sitemap beyond insignificant XML tag whitespace.');
const text=cp.execFileSync('git',['show','HEAD:public/sitemap.txt'],{encoding:'utf8',maxBuffer:2*1024*1024});
assert.equal(text.trim(),fs.readFileSync('public/sitemap.txt','utf8').trim(),'Generated text sitemap changed');
console.log('PASS: committed and generated sitemap URLs and reciprocal language links match (ignoring XML formatting).');
