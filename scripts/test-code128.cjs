'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../public/assets/barcode-code128.js'),'utf8'),ctx);
const {encode}=ctx.window.DocvelioCode128;
const a=encode('123456');assert.equal(a.text,'123456');assert.ok(a.bits.startsWith('11010011100'));assert.ok(a.bits.endsWith('1100011101011'));
const b=encode('ABC-123');assert.ok(b.bits.startsWith('11010010000'));assert.ok(b.bits.endsWith('1100011101011'));
assert.throws(()=>encode(''),/1–80/);assert.throws(()=>encode('\t'),/ASCII/);
console.log('PASS: self-hosted Code 128 subsets B/C and input validation.');
