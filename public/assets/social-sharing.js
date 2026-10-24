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
const footer=document.querySelector('.footer .container')||document.querySelector('footer');
if(!footer||document.querySelector('.dv-sharing'))return;
const url=document.querySelector('link[rel="canonical"]')?.href||location.href;
const title=document.title||'Docvelio';
const u=encodeURIComponent(url),tt=encodeURIComponent(title);
const links=[
 ['WhatsApp','https://wa.me/?text='+tt+'%20'+u],
 ['Facebook','https://www.facebook.com/sharer/sharer.php?u='+u],
 ['LinkedIn','https://www.linkedin.com/sharing/share-offsite/?url='+u],
 ['X','https://twitter.com/intent/tweet?text='+tt+'&url='+u],
 ['Telegram','https://t.me/share/url?url='+u+'&text='+tt]
];
const section=document.createElement('section');section.className='dv-sharing';section.setAttribute('aria-label',s[0]);
const heading=document.createElement('h2');heading.textContent=s[0];section.append(heading);
const actions=document.createElement('div');actions.className='dv-share-buttons';section.append(actions);
function button(label,callback){
 const b=document.createElement('button');b.type='button';b.textContent=label;b.className='dv-share-button';b.addEventListener('click',callback);actions.append(b);return b;
}
if(typeof navigator.share==='function')button(s[3],async()=>{try{await navigator.share({title,text:s[4],url});}catch(error){if(error.name!=='AbortError')console.warn('Share unavailable',error);}});
const copy=button(s[1],async()=>{
 try{
 if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);}
 else{const input=document.createElement('textarea');input.value=url;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const copied=document.execCommand('copy');input.remove();if(!copied)throw Error('Clipboard unavailable');}
 copy.textContent=s[2];setTimeout(()=>{copy.textContent=s[1];},1800);
 }catch(_){window.prompt(s[1],url);}
});
for(const [label,href] of links){const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.className='dv-share-button';a.textContent=label;actions.append(a);}
const bottom=footer.querySelector('.foot-bottom');if(bottom)bottom.before(section);else footer.append(section);
})();