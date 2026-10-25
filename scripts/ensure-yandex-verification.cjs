'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'public');
const filename = 'yandex_979858cd8ffc24be.html';
const content = '<html>\n    <head>\n        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n    </head>\n    <body>Verification: 979858cd8ffc24be</body>\n</html>\n';
const target = path.join(root, filename);
fs.writeFileSync(target, content, 'utf8');
if (fs.readFileSync(target, 'utf8') !== content) throw new Error('Yandex verification file mismatch');
console.log('Yandex verification asset confirmed:', filename);

const homepage = path.join(root, 'index.html');
const verificationTag = '<meta name="yandex-verification" content="979858cd8ffc24be" />';
let html = fs.readFileSync(homepage, 'utf8');
html = html.replace(/<meta\s+name=["']yandex-verification["'][^>]*>\s*/gi, '');
if (!/<head\b[^>]*>/i.test(html)) throw new Error('Homepage has no head section');
html = html.replace(/<head\b[^>]*>/i, match => match + verificationTag);
fs.writeFileSync(homepage, html, 'utf8');
if (!fs.readFileSync(homepage, 'utf8').includes(verificationTag)) throw new Error('Yandex homepage meta tag missing');
console.log('Yandex verification homepage meta tag confirmed');

// Keep the Naver ownership verification file in the deployed assets root.
const naverName = 'naver6e9a8796eafbba1043cb7ae33c431cdc.html';
const naverBody = 'naver-site-verification: naver6e9a8796eafbba1043cb7ae33c431cdc.html';
const naverPath = path.join(root, naverName);
fs.writeFileSync(naverPath, naverBody, 'utf8');
if (fs.readFileSync(naverPath, 'utf8') !== naverBody) throw new Error('Naver verification file mismatch');
console.log('Naver verification asset confirmed:', naverName);

// Seznam Webmaster ownership verification on the final generated homepage.
const seznamTag = '<meta name="seznam-wmt" content="qwg8YZkrmfV0Nvkuy1Dn8zEK6ADA4EAD" />';
let seznamHtml = fs.readFileSync(homepage, 'utf8');
seznamHtml = seznamHtml.replace(/<meta\s+name=["']seznam-wmt["'][^>]*>\s*/gi, '');
seznamHtml = seznamHtml.replace(/<head\b[^>]*>/i, match => match + seznamTag);
if (!seznamHtml.includes(seznamTag)) throw new Error('Seznam verification tag could not be inserted');
fs.writeFileSync(homepage, seznamHtml, 'utf8');
console.log('Seznam verification homepage meta tag confirmed');
