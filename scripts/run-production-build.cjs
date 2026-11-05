/* Run exactly the Cloudflare Wrangler build.command for local/CI QA.
 * Does not install dependencies, access secrets, or deploy any assets.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const conf=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
const commands=conf.build?.command?.split(' && ')||[];
if(commands.length<25||commands.some(x=>!/^node scripts\/[a-z0-9.-]+\.cjs$/i.test(x)))throw Error('Unexpected build command. Refusing to execute.');
for(const c of commands){
 console.log('BUILD>',c);
 const r=cp.spawnSync(process.execPath,[path.resolve(root,c.slice('node '.length))],{cwd:root,stdio:'inherit'});
 if(r.error)throw r.error;
 if(r.status!==0)process.exit(r.status||1);
}
console.log('Docvelio complete production build OK ('+commands.length+' stages).');
