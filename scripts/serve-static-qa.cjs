/* Local static server for Playwright, not used in production.
 * Serves the final public/ tree with Cloudflare-style clean URLs.
 */
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public'),port=Number(process.env.QA_PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.webmanifest':'application/manifest+json','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end('Method not allowed');return;}
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)}catch{res.writeHead(400).end('Bad URL');return;}
 if(pathname.includes('\0')||pathname.includes('\\')||pathname.split('/').includes('..')){res.writeHead(400).end('Bad path');return;}
 let dest=path.resolve(root,'.'+pathname);
 if(!dest.startsWith(root+path.sep)&&dest!==root){res.writeHead(403).end('Forbidden');return;}
 if(fs.existsSync(dest)&&fs.statSync(dest).isDirectory())dest=path.join(dest,'index.html');
 else if(!path.extname(dest)&&fs.existsSync(dest+path.sep+'index.html'))dest=dest+path.sep+'index.html';
 if(!fs.existsSync(dest)||!fs.statSync(dest).isFile()){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');return;}
 res.setHeader('Content-Type',mime[path.extname(dest).toLowerCase()]||'application/octet-stream');
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='HEAD'){res.writeHead(200).end();return;}
 fs.createReadStream(dest).on('error',()=>{if(!res.headersSent)res.writeHead(500);res.end()}).pipe(res);
});
server.listen(port,'127.0.0.1',()=>console.log('Docvelio QA server listening on http://127.0.0.1:'+port));
