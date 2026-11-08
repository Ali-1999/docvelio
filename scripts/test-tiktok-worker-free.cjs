'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const source=fs.readFileSync(path.join(__dirname,'..','src','tiktok-worker-free.js'),'utf8');
 const mod=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const good='https://www.tiktok.com/@example/video/123456789';
 const media='https://v16.tiktokcdn.com/example/video.mp4';
 assert(mod.validTikTokLink(good));
 for(const url of ['https://example.com/@x/video/1','http://www.tiktok.com/@x/video/1','https://tiktok.com.evil.org/@x/video/1','https://127.0.0.1/','https://tiktok.com:4444/v']){
  assert(!mod.validTikTokLink(url),'Untrusted TikTok link accepted: '+url);
 }
 const html='<script type="application/json" id="__UNIVERSAL_DATA_FOR_REHYDRATION__">'+JSON.stringify({__DEFAULT_SCOPE__:{'webapp.video-detail':{itemInfo:{itemStruct:{video:{playAddr:media}}}}}})+'</script>';
 assert.equal(mod.extractPublicMedia(html),media,'Public embedded media not parsed');
 assert.equal(mod.extractPublicMedia('<html><body>not public</body></html>'),null);
 const oldFetch=global.fetch;const oldAbort=global.AbortSignal;
 try{
  const calls=[];
  global.fetch=async url=>{
   calls.push(String(url));
   if(String(url)===good)return new Response(html,{status:200,headers:{'Content-Type':'text/html'}});
   if(String(url)===media)return new Response('video-data',{status:200,headers:{'Content-Type':'video/mp4','Content-Length':'10'}});
   throw Error('Unknown upstream');
  };
  const result=await mod.workerFreeTikTok(good);
  assert.equal(result.status,200,'Mock public MP4 should stream');
  assert.equal(result.headers.get('Content-Type'),'video/mp4');
  assert.deepEqual(calls,[good,media]);
  assert.equal(await result.text(),'video-data');
  global.fetch=async()=>new Response('<html>restricted</html>',{status:200,headers:{'Content-Type':'text/html'}});
  const unavailable=await mod.workerFreeTikTok(good);
  assert.equal(unavailable.status,422,'Unavailable source should fail clearly');
  global.fetch=async()=>new Response(html.replace(media,'http://127.0.0.1/secret'),{status:200,headers:{'Content-Type':'text/html'}});
  const blocked=await mod.workerFreeTikTok(good);
  assert.equal(blocked.status,422,'Internal URL must never be requested');
 }finally{global.fetch=oldFetch;}
 console.log('PASS: Cloudflare Free TikTok parser, trusted host restrictions, mock MP4 streaming, and unavailable fallback');
})().catch(e=>{console.error(e);process.exitCode=1;});
