/* Best-effort TikTok public-video retrieval in a standard Cloudflare Worker.
 * TikTok can change/deny public pages. This does not remove any embedded watermark.
 */
const domains=['tiktok.com','tiktokcdn.com','tiktokv.com','byteoversea.com','bytecdn.com','ibytedtos.com','muscdn.com'];
const trusted=h=>domains.some(d=>h===d||h.endsWith('.'+d));
export function validTikTokLink(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&!u.hash&&['tiktok.com','www.tiktok.com','m.tiktok.com','vm.tiktok.com','vt.tiktok.com'].includes(u.hostname.toLowerCase())&&u.pathname.length>1&&value.length<=2048;}
 catch{return false;}
}
function validMedia(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&trusted(u.hostname.toLowerCase());}
 catch{return false;}
}
function findVideo(node,depth=0){
 if(depth>12||!node||typeof node!=='object')return null;
 const video=node.video||node.videoData||node;
 for(const k of ['playAddr','downloadAddr','playUrl','downloadUrl']){
  let v=video?.[k];
  if(typeof v==='string'&&validMedia(v))return v;
  if(v&&typeof v==='object'){
   const src=v.UrlList?.[0]||v.url_list?.[0]||v.url||v.src;
   if(typeof src==='string'&&validMedia(src))return src;
  }
 }
 const values=Array.isArray(node)?node:Object.values(node);
 if(depth>5&&values.length>250)return null;
 for(const child of values){const result=findVideo(child,depth+1);if(result)return result;}
 return null;
}
export function extractPublicMedia(html){
 for(const id of ['__UNIVERSAL_DATA_FOR_REHYDRATION__','SIGI_STATE','__NEXT_DATA__']){
  const pattern=new RegExp('<script\\b(?=[^>]*\\bid=["\\x27]'+id+'["\\x27])[^>]*>([\\s\\S]*?)<\\/script>','i');
  const match=html.match(pattern);
  if(!match)continue;
  try{const media=findVideo(JSON.parse(match[1]));if(media)return media;}catch{}
 }
 return null;
}
const error=(msg,code)=>Response.json({error:msg},{status:code,headers:{'Cache-Control':'no-store'}});
export async function workerFreeTikTok(url){
 if(!validTikTokLink(url))return error('Enter a valid public HTTPS TikTok video URL.',400);
 try{
  const page=await fetch(url,{redirect:'manual',headers:{'Accept':'text/html,application/xhtml+xml','User-Agent':'Mozilla/5.0 (compatible; DocvelioPublicVideo/1.0)'},signal:AbortSignal.timeout(12000)});
  if(!page.ok)return error('TikTok did not expose this public page to Cloudflare.',422);
  if(!(page.headers.get('Content-Type')||'').includes('text/html'))return error('TikTok returned an unexpected response.',422);
  if(Number(page.headers.get('Content-Length')||0)>1500000)return error('The video page exceeded the processing limit.',413);
  const html=await page.text();
  if(html.length>1500000)return error('The video page exceeded the processing limit.',413);
  let target=extractPublicMedia(html);
  if(!target)return error('TikTok did not expose a downloadable MP4 source. Use TikTok Save Video or your original export.',422);
  for(let hop=0;hop<4;hop++){
   if(!validMedia(target))return error('TikTok media redirected to an untrusted host.',422);
   const media=await fetch(target,{redirect:'manual',headers:{'Accept':'video/mp4,video/*'},signal:AbortSignal.timeout(25000)});
   if(media.status>=300&&media.status<400){
    const next=media.headers.get('Location');
    if(!next)return error('Media redirect was incomplete.',422);
    target=new URL(next,target).href;
    continue;
   }
   if(!media.ok)return error('Public media could not be retrieved.',422);
   const mime=(media.headers.get('Content-Type')||'').toLowerCase();
   if(!mime.startsWith('video/mp4')&&!mime.startsWith('application/octet-stream'))return error('Media source was not MP4.',422);
   const bytes=Number(media.headers.get('Content-Length')||0);
   if(bytes>80*1024*1024)return error('Video exceeds 80 MB.',413);
   return new Response(media.body,{headers:{'Content-Type':'video/mp4','Content-Disposition':'attachment; filename="docvelio-tiktok.mp4"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Docvelio-Engine':'cloudflare-best-effort'}});
  }
  return error('Too many media redirects.',422);
 }catch{return error('TikTok denied the server request or extraction timed out.',503);}
}
