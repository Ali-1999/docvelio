'use strict';
const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./tests/e2e',
 testMatch:'**/*.spec.cjs',
 fullyParallel:false,
 forbidOnly:!!process.env.CI,
 retries:process.env.CI?1:0,
 workers:process.env.CI?1:2,
 timeout:45000,
 expect:{timeout:10000},
 globalTimeout:15*60*1000,
 reporter:[['list'],['html',{outputFolder:'playwright-report',open:'never'}],['json',{outputFile:'test-results/results.json'}]],
 outputDir:'test-results/screenshots-traces',
 use:{baseURL:process.env.PLAYWRIGHT_TEST_BASE_URL||'http://127.0.0.1:4173',
  actionTimeout:12000,navigationTimeout:20000,trace:'retain-on-failure',screenshot:'only-on-failure',video:'retain-on-failure'},
 projects:[
  {name:'chromium-desktop',use:{...devices['Desktop Chrome'],viewport:{width:1365,height:768}}},
  {name:'chromium-mobile',use:{...devices['Pixel 7']}},
  {name:'webkit-desktop',use:{...devices['Desktop Safari']}}
 ],
 webServer:process.env.PLAYWRIGHT_TEST_BASE_URL?undefined:{
  command:'node scripts/serve-static-qa.cjs',
  url:'http://127.0.0.1:4173/robots.txt',
  reuseExistingServer:!process.env.CI,
  timeout:30000
 }
});
