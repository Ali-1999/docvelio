'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {makePdf,tinyPng}=require('./fixtures.cjs');
async function PDFPageCount(page,buffer){
 const payload=buffer.toString('base64');
 return page.evaluate(async base64=>{
  const raw=atob(base64);
  const bytes=Uint8Array.from(raw,ch=>ch.charCodeAt(0));
  const doc=await window.PDFLib.PDFDocument.load(bytes);
  return doc.getPageCount();
 },payload);
}
async function dismiss(page){
 const banner=page.locator('.dv-cookie-banner');
 if(await banner.isVisible())await page.locator('.dv-cookie-reject').click();
}
test('@smoke Split PDF creates a downloadable two-page PDF from a three-page input',async({page})=>{
 await page.goto('/tools/split-pdf/');
 await dismiss(page);
 await expect(page.locator('#process')).toBeVisible();
 await expect.poll(async()=>page.evaluate(()=>typeof window.PDFLib)).toBe('object');
 const source=makePdf(3);
 expect(await PDFPageCount(page,source)).toBe(3);
 // Analytics/CSP endpoints can legitimately POST metadata. Check for PDF bytes,
 // not an unrelated HTTP method, before alleging a customer-file upload.
 const documentUploads=[];
 page.on('request',r=>{
  if(!/^(?:POST|PUT|PATCH)$/i.test(r.method()))return;
  const body=r.postDataBuffer();
  if(body&&(body.includes(Buffer.from('%PDF-'))||body.includes(Buffer.from('safe-qa.pdf'))))
   documentUploads.push(r.url());
 });
 await page.locator('#documents').setInputFiles({name:'safe-qa.pdf',mimeType:'application/pdf',buffer:source});
 await page.locator('#ranges').fill('1,3');
 await page.locator('#process').click();
 const downloadLink=page.locator('#file-result.ready a[download]');
 await expect(downloadLink).toBeVisible();
 const [download]=await Promise.all([page.waitForEvent('download'),downloadLink.click()]);
 const result=await fs.readFile(await download.path());
 expect(result.subarray(0,5).toString()).toBe('%PDF-');
 expect(await PDFPageCount(page,result)).toBe(2);
 expect(documentUploads,'Selected PDF bytes must not be uploaded').toEqual([]);
});
test('@smoke Merge PDF combines two single-page files into one downloadable PDF',async({page})=>{
 await page.goto('/tools/merge-pdf/');
 await dismiss(page);
 await expect.poll(async()=>page.evaluate(()=>typeof window.PDFLib)).toBe('object');
 await page.locator('#documents').setInputFiles([
  {name:'one.pdf',mimeType:'application/pdf',buffer:makePdf(1)},
  {name:'two.pdf',mimeType:'application/pdf',buffer:makePdf(1)}
 ]);
 await page.locator('#process').click();
 const ready=page.locator('#file-result.ready a[download]');await expect(ready).toBeVisible({timeout:25000});
 const [download]=await Promise.all([page.waitForEvent('download'),ready.click()]);
 const result=await fs.readFile(await download.path());
 expect(result.subarray(0,5).toString()).toBe('%PDF-');
 expect(await PDFPageCount(page,result)).toBe(2);
});
test('@smoke QR code generator produces a nonempty valid SVG download',async({page})=>{
 await page.goto('/tools/qr-code-generator/');
 await dismiss(page);
 await page.locator('#kind').selectOption('url');
 await page.locator('#url').fill('https://docvelio.com/tools/split-pdf/');
 await page.locator('#generate').click();
 await expect(page.locator('#preview svg')).toBeVisible();
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#svg').click()]);
 const contents=await fs.readFile(await download.path(),'utf8');
 expect(contents).toMatch(/<svg\b/);
 expect(contents.length).toBeGreaterThan(150);
});
test('@smoke barcode generator creates an SVG with visible bars',async({page})=>{
 await page.goto('/tools/barcode-generator/');
 await dismiss(page);
 await page.locator('#format').selectOption('code39');
 await page.locator('#value').fill('DOCVELIO-123');
 await page.locator('#make').click();
 await expect(page.locator('#preview svg')).toBeVisible();
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download').click()]);
 const contents=await fs.readFile(await download.path(),'utf8');
 expect(contents).toMatch(/<svg\b/);
 expect(contents.length).toBeGreaterThan(200);
});
test('@smoke image resize changes pixel dimensions and downloads a PNG',async({page})=>{
 await page.goto('/image-tools/resize-image/');
 await dismiss(page);
 await expect(page.locator('#im-file')).toBeAttached();
 await page.locator('#im-file').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:tinyPng});
 await expect(page.locator('#im-info')).toContainText('1 × 1');
 await page.locator('#im-locked').uncheck();
 await page.locator('#im-width').fill('4');
 await page.locator('#im-height').fill('4');
 await page.locator('[data-operation="resize"]').click();
 await expect.poll(()=>page.locator('#im-canvas').evaluate(el=>[el.width,el.height])).toEqual([4,4]);
 await page.locator('#im-format').selectOption('png');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#im-download').click()]);
 const result=await fs.readFile(await download.path());
 expect(result.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
 expect(result.readUInt32BE(16)).toBe(4);
 expect(result.readUInt32BE(20)).toBe(4);
});
