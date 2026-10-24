/* Docvelio's independent logo and privacy-conscious social share controls. */
(()=>{'use strict';
const lang=(document.documentElement.lang||'en').split('-')[0];
const strings={
en:['Share this page','Copy link','Copied!','Share','Docvelio document tools'],
es:['Compartir esta página','Copiar enlace','¡Copiado!','Compartir','Herramientas de documentos Docvelio'],
fr:['Partager cette page','Copier le lien','Copié !','Partager','Outils de documents Docvelio'],
de:['Diese Seite teilen','Link kopieren','Kopiert!','Teilen','Docvelio Dokument-Tools'],
pt:['Compartilhar esta página','Copiar link','Copiado!','Compartilhar','Ferramentas Docvelio'],
ar:['مشاركة هذه الصفحة','نسخ الرابط','تم النسخ!','مشاركة','أدوات المستندات من Docvelio'],
hi:['यह पेज साझा करें','लिंक कॉपी करें','कॉपी हो गया!','शेयर करें','Docvelio दस्तावेज़ टूल'],
id:['Bagikan halaman ini','Salin tautan','Disalin!','Bagikan','Alat dokumen Docvelio'],
tr:['Bu sayfayı paylaş','Bağlantıyı kopyala','Kopyalandı!','Paylaş','Docvelio belge araçları'],
zh:['分享此页面','复制链接','已复制！','分享','Docvelio 文档工具']
};
const s=strings[lang]||strings.en;
const icon='/assets/docvelio-logo-icon.svg',full='/assets/docvelio-logo.svg';
document.querySelectorAll('.brandmark').forEach(mark=>{
 mark.replaceChildren(Object.assign(document.createElement('img'),{src:icon,alt:'',width:32,height:32,className:'dv-brand-icon'}));
});
const hero=document.querySelector('.hero-copy');
if(hero&&!hero.querySelector('.dv-hero-logo')){
 const mark=document.createElement('img');mark.src=full;mark.alt='Docvelio';mark.width=240;mark.height=67;mark.decoding='async';mark.className='dv-hero-logo';hero.prepend(mark);
}
const footerBrand=document.querySelector('.foot-brand');
if(footerBrand&&!footerBrand.querySelector('img')){
 const mark=document.createElement('img');mark.src=icon;mark.alt='';mark.width=27;mark.height=27;mark.className='dv-footer-brand-icon';footerBrand.prepend(mark);
}
/* Social share: icon-based, accessible and localised. No trackers or SDKs. */
const footer=document.querySelector('.footer .container')||document.querySelector('footer');
if(!footer||document.querySelector('.dv-sharing'))return;
const url=document.querySelector('link[rel="canonical"]')?.href||location.href;
const title=document.title||'Docvelio';
const nativeAvailable=typeof navigator.share==='function';
const xUrl=encodeURIComponent(url), xTitle=encodeURIComponent(title);
const labels={
 en:['Choose where to share','Share this Docvelio page with others','Share on','Link copied','Copy failed — select this link and copy it'],
 es:['Elige dónde compartir','Comparte esta página de Docvelio','Compartir en','Enlace copiado','Selecciona y copia este enlace'],
 fr:['Choisissez où partager','Partagez cette page Docvelio','Partager sur','Lien copié','Sélectionnez et copiez ce lien'],
 de:['Wählen Sie eine Plattform','Teilen Sie diese Docvelio-Seite','Teilen auf','Link kopiert','Markieren und kopieren Sie diesen Link'],
 pt:['Escolha onde compartilhar','Compartilhe esta página Docvelio','Compartilhar no','Link copiado','Selecione e copie este link'],
 ar:['اختر منصة المشاركة','شارك صفحة Docvelio هذه','مشاركة عبر','تم نسخ الرابط','حدد الرابط وانسخه'],
 hi:['कहाँ शेयर करना है चुनें','यह Docvelio पेज शेयर करें','इस पर शेयर करें','लिंक कॉपी हो गया','यह लिंक चुनकर कॉपी करें'],
 id:['Pilih platform berbagi','Bagikan halaman Docvelio ini','Bagikan ke','Tautan tersalin','Pilih dan salin tautan ini'],
 tr:['Paylaşılacak platformu seçin','Bu Docvelio sayfasını paylaşın','Şurada paylaş','Bağlantı kopyalandı','Bağlantıyı seçip kopyalayın'],
 zh:['选择分享平台','分享这个 Docvelio 页面','分享到','链接已复制','请选中并复制此链接']
};
const l=labels[lang]||labels.en;
const svg=(body)=>'<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+body+'</svg>';
const icons={
 share:svg('<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.5 10.8 7-4.5m-7 7 7 4.5"/>'),
 link:svg('<path d="M10 13.8a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2"/><path d="M14 10.2a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7.1 7.1l1.2-1.2"/>'),
 copy:svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
 check:svg('<path d="m5 12 4 4L19 6"/>'),
 whatsapp:'<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.04 2a9.96 9.96 0 0 0-8.6 15.01 9.92 9.92 0 0 0-1.2 8.9L1 23l5.9-1.55A9.99 9.99 0 1 0 12.04 2Zm0 18.2a8.3 8.3 0 0 1-4.25-1.16l-.31-.18-3.49.92.93-3.4-.2-.34a8.3 8.3 0 1 1 7.32 4.16Zm4.55-6.23c-.25-.13-1.5-.74-1.73-.82-.23-.09-.39-.13-.56.13-.17.25-.64.82-.79.99-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.38.11-.51.12-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.17 1.75 2.68 4.24 3.76.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.11-.23-.17-.48-.29Z"/></svg>',
 linkedin:'<svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="M5.1 8.8H2.2V22h2.9V8.8ZM3.65 2A1.72 1.72 0 1 0 3.65 5.45 1.72 1.72 0 0 0 3.65 2ZM21.8 14.4c0-3.45-1.84-5.05-4.3-5.05-1.98 0-2.87 1.09-3.36 1.85V8.8h-2.88V22h2.88v-7.38c0-.39.03-.77.14-1.04.26-.73.89-1.49 1.93-1.49 1.35 0 1.89 1.03 1.89 2.55V22h3.7v-7.6Z"/></svg>',
 x:'<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.97 2H22l-6.61 7.55L23.15 22h-6.08l-4.76-7.54L5.7 22H2.66l7.1-8.11L2.3 2h6.23l4.3 6.81L18.97 2Zm-1.07 18h1.68L7.6 3.89H5.81L17.9 20Z"/></svg>',
 facebook:'<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M13.5 22v-8.2h2.76l.42-3.2H13.5V8.55c0-.93.26-1.56 1.59-1.56h1.7V4.13a23.5 23.5 0 0 0-2.48-.13c-2.45 0-4.13 1.5-4.13 4.26v2.34H7.4v3.2h2.78V22h3.32Z"/></svg>',
 telegram:'<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="m21.6 4.1-3.5 16.4c-.27 1.14-.97 1.42-1.96.88l-5.37-3.95-2.6 2.5c-.29.29-.53.53-1.09.53l.38-5.46 9.96-9c.43-.38-.1-.59-.66-.21l-12.3 7.74-5.29-1.65c-1.15-.36-1.17-1.15.24-1.7l20.7-7.98c.96-.35 1.8.23 1.49 1.9Z" transform="translate(1 0) scale(.94)"/></svg>'
};
const providers=[
 {id:'whatsapp',name:'WhatsApp',href:'https://wa.me/?text='+xTitle+'%20'+xUrl},
 {id:'facebook',name:'Facebook',href:'https://www.facebook.com/sharer/sharer.php?u='+xUrl},
 {id:'linkedin',name:'LinkedIn',href:'https://www.linkedin.com/sharing/share-offsite/?url='+xUrl},
 {id:'x',name:'X',href:'https://twitter.com/intent/tweet?text='+xTitle+'&url='+xUrl},
 {id:'telegram',name:'Telegram',href:'https://t.me/share/url?url='+xUrl+'&text='+xTitle}
];
function element(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function addIcon(parent,id,cls){const holder=element('span',cls);holder.innerHTML=icons[id];parent.append(holder);return holder;}
const panel=element('section','dv-sharing');panel.setAttribute('aria-label',s[0]);
const header=element('div','dv-share-header');
const emblem=element('span','dv-share-emblem');emblem.innerHTML=icons.share;header.append(emblem);
const intro=element('div','dv-share-intro');
intro.append(element('p','dv-share-eyebrow','DOCVELIO'),element('h2','dv-share-title',s[0]),element('p','dv-share-subtitle',l[1]));
header.append(intro);panel.append(header);
const urlRow=element('div','dv-share-url-row');const urlField=element('input','dv-share-url-input');urlField.type='text';urlField.readOnly=true;urlField.value=url;urlField.setAttribute('aria-label','Page URL');urlField.addEventListener('focus',()=>urlField.select());urlRow.append(urlField);
const copyButton=element('button','dv-share-copy');copyButton.type='button';addIcon(copyButton,'copy','dv-share-btn-icon');const copyLabel=element('span','',s[1]);copyButton.append(copyLabel);urlRow.append(copyButton);panel.append(urlRow);
const split=element('div','dv-share-divider');split.append(element('span','',l[0]));panel.append(split);
const grid=element('div','dv-share-grid');
for(const item of providers){
 const a=element('a','dv-share-tile dv-share-'+item.id);a.href=item.href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',l[2]+' '+item.name);
 addIcon(a,item.id,'dv-share-platform-icon');a.append(element('span','dv-share-provider-name',item.name));grid.append(a);
}
panel.append(grid);
if(nativeAvailable){
 const native=element('button','dv-share-native');native.type='button';addIcon(native,'share','dv-share-btn-icon');native.append(element('span','',s[3]));panel.append(native);
 native.addEventListener('click',async()=>{try{await navigator.share({title,text:s[4],url});}catch(e){if(e.name!=='AbortError')console.warn('Native share was not available',e);}});
}
const feedback=element('p','dv-share-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');panel.append(feedback);
const bottom=footer.querySelector('.foot-bottom');if(bottom)bottom.before(panel);else footer.append(panel);
copyButton.addEventListener('click',async()=>{
 let success=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);success=true;}}catch(_){}
 if(!success){urlField.select();try{success=document.execCommand('copy');}catch(_){}
 }
 if(success){copyButton.classList.add('dv-is-copied');copyLabel.textContent=s[2];copyButton.querySelector('.dv-share-btn-icon').innerHTML=icons.check;feedback.textContent=l[3];}
 else{feedback.textContent=l[4];urlField.focus();}
 if(success){setTimeout(()=>{copyButton.classList.remove('dv-is-copied');copyLabel.textContent=s[1];copyButton.querySelector('.dv-share-btn-icon').innerHTML=icons.copy;feedback.textContent='';},2200);}
});
})();