/* Compare canonical URL sets, not irrelevant XML tag whitespace. */
'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.join(__dirname,'..','public');
const original=cp.execFileSync('git',['show','HEAD:public/sitemap.xml'],{encoding:'utf8'});
const built=fs.readFileSync(path.join(base,'sitemap.xml'),'utf8');
const locations=xml=>[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]).sort();
const a=locations(original),b=locations(built);
assert.equal(a.length,580,'Committed source sitemap must contain 580 canonical URLs');
assert.deepEqual(b,a,'Generated canonical URL list differs from committed sitemap');
const listed=fs.readFileSync(path.join(base,'sitemap.txt'),'utf8').trim().split(/\r?\n/).sort();
const committedText=cp.execFileSync('git',['show','HEAD:public/sitemap.txt'],{encoding:'utf8'}).trim().split(/\r?\n/).sort();
assert.deepEqual(listed,committedText,'Generated text sitemap changes URL set');
console.log('PASS: source and generated XML/TXT sitemaps share the same 580 canonical URLs (whitespace ignored).');
