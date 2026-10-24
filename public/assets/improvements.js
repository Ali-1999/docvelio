/* Progressive enhancements: no data sent to Docvelio servers. */
(()=>{'use strict';
const locale=document.documentElement.lang||'en';
const phrases={
 en:['Find in document','Replace with','Find next','Replace','Replace all','Download page PNG','No matches','replacements'],
 es:['Buscar en documento','Sustituir por','Buscar siguiente','Sustituir','Sustituir todo','Descargar página PNG','Sin resultados','reemplazos'],
 fr:['Rechercher','Remplacer par','Suivant','Remplacer','Tout remplacer','Télécharger la page PNG','Aucun résultat','remplacements'],
 de:['Im Dokument suchen','Ersetzen durch','Weitersuchen','Ersetzen','Alle ersetzen','Seite als PNG','Keine Treffer','Ersetzungen'],
 pt:['Localizar no documento','Substituir por','Próximo','Substituir','Substituir tudo','Baixar página PNG','Sem resultados','substituições'],
 ar:['بحث في المستند','استبدال بـ','التالي','استبدال','استبدال الكل','تنزيل الصفحة PNG','لا نتائج','استبدالات'],
 hi:['दस्तावेज़ में खोजें','इससे बदलें','अगला खोजें','बदलें','सभी बदलें','पेज PNG डाउनलोड','कोई परिणाम नहीं','बदलाव'],
 id:['Cari di dokumen','Ganti dengan','Berikutnya','Ganti','Ganti semua','Unduh halaman PNG','Tidak ada hasil','penggantian'],
 tr:['Belgede ara','Şununla değiştir','Sonrakini bul','Değiştir','Tümünü değiştir','Sayfayı PNG indir','Sonuç yok','değişiklik'],
 zh:['查找文档','替换为','查找下一个','替换','全部替换','下载本页 PNG','无匹配项','处替换']
};
const words=phrases[locale]||phrases.en;
const editor=document.getElementById('word-content'),ribbon=document.querySelector('.ribbon');
if(editor&&ribbon){
 const panel=document.createElement('div');panel.className='docv-search';panel.setAttribute('role','search');
 const find=document.createElement('input');find.type='search';find.id='docv-find';find.placeholder=words[0];find.setAttribute('aria-label',words[0]);find.autocomplete='off';
 const replace=document.createElement('input');replace.type='text';replace.id='docv-replace';replace.placeholder=words[1];replace.setAttribute('aria-label',words[1]);
 const next=document.createElement('button');next.type='button';next.textContent=words[2];
 const one=document.createElement('button');one.type='button';one.textContent=words[3];
 const all=document.createElement('button');all.type='button';all.textContent=words[4];
 const result=document.createElement('span');result.setAttribute('aria-live','polite');result.className='docv-find-count';
 for(const el of [find,replace,next,one,all,result])panel.appendChild(el);ribbon.appendChild(panel);
 let active=null;
 function matches(){
  const q=find.value;if(!q)return[];
  const matches=[],walker=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){const data=node.textContent.toLocaleLowerCase(),needle=q.toLocaleLowerCase();let at=0,pos;
   while((pos=data.indexOf(needle,at))!==-1){matches.push({node,at:pos});at=pos+q.length;}
  }return matches;
 }
 function highlight(match){if(!match)return;editor.focus();const range=document.createRange();range.setStart(match.node,match.at);range.setEnd(match.node,match.at+find.value.length);
 const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);match.node.parentElement?.scrollIntoView({block:'nearest'});active=match;}
 function show(){const m=matches();result.textContent=m.length?String(m.length):find.value?words[6]:'';return m;}
 next.addEventListener('click',()=>{const m=show();if(!m.length)return;const index=active?m.findIndex(x=>x.node===active.node&&x.at===active.at):-1;highlight(m[(index+1)%m.length]);});
 find.addEventListener('input',()=>{active=null;show();});
 function replaceOne(){let m=show();if(!m.length)return;if(!active||!m.some(x=>x.node===active.node&&x.at===active.at))active=m[0];
 const n=active.node,at=active.at;n.textContent=n.textContent.slice(0,at)+replace.value+n.textContent.slice(at+find.value.length);active=null;editor.dispatchEvent(new Event('input',{bubbles:true}));show();}
 one.addEventListener('click',replaceOne);
 all.addEventListener('click',()=>{const q=find.value;if(!q)return;const m=show(),nodes=[...new Set(m.map(x=>x.node))];let changes=0;
 for(const n of nodes){const old=n.textContent;let value='',start=0,at;const low=old.toLocaleLowerCase(),needle=q.toLocaleLowerCase();while((at=low.indexOf(needle,start))!==-1){value+=old.slice(start,at)+replace.value;start=at+q.length;changes++;}n.textContent=value+old.slice(start);}
 active=null;if(changes){editor.dispatchEvent(new Event('input',{bubbles:true}));result.textContent=changes+' '+words[7];}});
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='f'){e.preventDefault();find.focus();find.select();}});
}
const pdf=document.querySelector('[data-pdf-app]'),bar=document.querySelector('.pdf-preview-bar');
if(pdf&&bar){
 const button=document.createElement('button');button.type='button';button.className='action-btn docv-png';button.textContent=words[5];button.setAttribute('aria-label',words[5]);bar.appendChild(button);
 button.addEventListener('click',()=>{const page=document.getElementById('page-canvas'),overlay=document.getElementById('annotation-canvas'),position=document.getElementById('page-position'),file=document.getElementById('pdf-file')?.files?.[0];
 if(!page?.width||!page?.height||!file){return;}
 const combined=document.createElement('canvas');combined.width=page.width;combined.height=page.height;const ctx=combined.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,combined.width,combined.height);ctx.drawImage(page,0,0);if(overlay?.width)ctx.drawImage(overlay,0,0);
 combined.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=file.name.replace(/\.pdf$/i,'')+'-page-'+(position?.textContent.match(/\d+/)?.[0]||'1')+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);},'image/png');
 });
}
const menu=document.querySelector('.mobile-toggle'),links=document.querySelector('.links');
if(menu&&links){links.addEventListener('click',event=>{if(event.target.closest('a')){links.classList.remove('open');menu.setAttribute('aria-expanded','false');}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&links.classList.contains('open')){links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});
}
})();