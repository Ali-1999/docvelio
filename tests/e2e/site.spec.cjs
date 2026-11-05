'use strict';
const {test,expect}=require('@playwright/test');
test('@smoke homepage loads with visible navigation, meaningful content and footer trust links',async({page},testInfo)=>{
 const res=await page.goto('/');expect(res.status()).toBe(200);
 await expect(page.locator('main h1').first()).toBeVisible();
 await expect(page.locator('footer').first()).toBeVisible();
 for(const name of ['about','contact','privacy','terms','cookies']){
  await expect(page.locator('footer a[href*="/'+name+'/"]').first()).toHaveAttribute('href',new RegExp(name+'/'));
 }
 const title=await page.title();expect(title).toMatch(/Docvelio/i);
 const overflow=await page.evaluate(()=>({document:document.documentElement.scrollWidth,window:innerWidth}));
 expect(overflow.document,'Avoid page-level horizontal overflow on '+testInfo.project.name).toBeLessThanOrEqual(overflow.window+6);
});
test('@smoke policy and trust pages are publicly accessible and have actual support details',async({page,request})=>{
 for(const route of ['/about/','/contact/','/privacy/','/terms/','/cookies/']){
  const response=await request.get(route);expect(response.status(),route).toBe(200);
  const html=await response.text();
  expect(html).toMatch(/<h1\b/i);
  expect(html).not.toMatch(/\{\{(?:CONTACT_EMAIL|OPERATOR_NAME|JURISDICTION)\}\}/);
 }
 await page.goto('/contact/');
 await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
});
test('@smoke English and translated homepages contain semantic content',async({page,request})=>{
 for(const route of ['/','/es/','/fr/','/de/','/ar/','/zh/']){
  const r=await request.get(route);expect(r.status(),route).toBe(200);
  const html=await r.text();
  expect(html).toMatch(/<main\b/i);
  expect(html).toMatch(/<h1\b/i);
  expect(html).toMatch(/<footer\b/i);
 }
 await page.goto('/ar/');
 await expect(page.locator('main h1').first()).toBeVisible();
});
test('@smoke analytics defaults are denied and privacy choices never grant advertising automatically',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.dv-cookie-banner')).toBeVisible();
 const defaults=await page.evaluate(()=>{
  const ev=(window.dataLayer||[]).find(x=>x[0]==='consent'&&x[1]==='default');
  return ev&&ev[2];
 });
 expect(defaults).toBeTruthy();
 for(const key of ['ad_storage','ad_user_data','ad_personalization','analytics_storage'])
  expect(defaults[key],key).toBe('denied');
 await page.locator('.dv-cookie-accept').click();
 await expect(page.locator('.dv-cookie-banner')).toBeHidden();
 const after=await page.evaluate(()=>({
  chosen:JSON.parse(localStorage.getItem('docvelio_privacy_choice_v2')),
  updates:(window.dataLayer||[]).filter(x=>x[0]==='consent'&&x[1]==='update').map(x=>x[2])
 }));
 expect(after.chosen.choice).toBe('accepted');
 expect(after.updates.some(x=>x.analytics_storage==='granted')).toBeTruthy();
 expect(after.updates.some(x=>Object.entries(x).some(([k,v])=>k.startsWith('ad_')&&v==='granted'))).toBeFalsy();
 await page.reload();
 await expect(page.locator('.dv-cookie-banner')).toBeHidden();
 await page.locator('.dv-cookie-settings').click();
 await expect(page.locator('.dv-cookie-banner')).toBeVisible();
 await page.locator('.dv-cookie-reject').click();
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('docvelio_privacy_choice_v2')).choice)).toBe('declined');
 const latest=await page.evaluate(()=>{
  const events=(window.dataLayer||[]).filter(x=>x[0]==='consent');
  return events[events.length-1]?.[2]?.analytics_storage;
 });
 expect(latest).toBe('denied');
});
