(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const mobile = document.getElementById('mobile-nav');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 32);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    mobile.hidden = isOpen;
  });
  mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobile.hidden = true; toggle?.setAttribute('aria-expanded', 'false'); toggle?.setAttribute('aria-label', 'Open navigation');
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile && !mobile.hidden) { mobile.hidden = true; toggle?.setAttribute('aria-expanded','false'); toggle?.focus(); }
  });
  document.getElementById('year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));

  const reveal = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .09, rootMargin: '0px 0px -30px 0px' });
    reveal.forEach(el => observer.observe(el));
  } else { reveal.forEach(el => el.classList.add('visible')); }


  // Interactive technology ecosystem — based on the candidate's supplied CV and project context.
  const technologies = [
    {name:'HTML5',cat:'frontend',label:'Frontend',symbol:'5',desc:'Used to structure responsive web pages and accessible website interfaces.',used:'Frontend implementation and website page development.',projects:[]},
    {name:'CSS3',cat:'frontend',label:'Frontend',symbol:'3',desc:'Used to build responsive layouts, visual systems and polished website interfaces.',used:'Responsive styling and interface refinement.',projects:[{label:'Degenrex',url:'https://degenrex.com'}]},
    {name:'JavaScript',cat:'frontend',label:'Frontend',symbol:'JS',desc:'Used to add interactive behaviour and client-side functionality to websites.',used:'Frontend development and interactive website features.',projects:[{label:'GitHub profile',url:'https://github.com/Ali-1999'}]},
    {name:'jQuery',cat:'frontend',label:'Frontend',symbol:'jq',desc:'A JavaScript library included in the candidate’s stated frontend toolkit.',used:'Listed in the supplied technical skills; specific project attribution is not currently documented.',projects:[]},
    {name:'Bootstrap',cat:'frontend',label:'Frontend',symbol:'B',desc:'A responsive UI framework included in the candidate’s stated frontend toolkit.',used:'Listed in the supplied technical skills; specific project attribution is not currently documented.',projects:[]},
    {name:'PHP',cat:'backend',label:'Backend',symbol:'PHP',desc:'Server-side development experience, including PHP application work.',used:'Developed and maintained PHP/CodeIgniter applications at Marksols.',projects:[{label:'GitHub profile',url:'https://github.com/Ali-1999'}]},
    {name:'CodeIgniter',cat:'backend',label:'Backend',symbol:'CI',desc:'PHP framework experience for database-driven web applications.',used:'Developed and maintained CodeIgniter applications at Marksols.',projects:[{label:'GitHub profile',url:'https://github.com/Ali-1999'}]},
    {name:'MySQL',cat:'data',label:'Database',symbol:'SQL',desc:'Relational database technology included in the candidate’s development toolkit.',used:'Database technology listed in the supplied technical profile.',projects:[]},
    {name:'MongoDB',cat:'data',label:'Database',symbol:'MDB',desc:'Document database technology included in the candidate’s development toolkit.',used:'Database technology listed in the supplied technical profile.',projects:[]},
    {name:'WordPress',cat:'cms',label:'CMS',symbol:'W',desc:'CMS experience across website content migration, maintenance and site management.',used:'Migrated website content to WordPress and managed WordPress updates and migrations.',projects:[]},
    {name:'WooCommerce',cat:'cms',label:'E-commerce',symbol:'WC',desc:'E-commerce platform experience relevant to product catalogues and online store workflows.',used:'Included in the candidate’s e-commerce and WordPress project experience.',projects:[{label:'Applinovo',url:'https://applinovo.com'}]},
    {name:'Webflow',cat:'cms',label:'CMS',symbol:'WF',desc:'Website platform experience supporting web content and frontend implementation.',used:'Supported Webflow website development and content implementation.',projects:[{label:'GitHub profile',url:'https://github.com/Ali-1999'}]},
    {name:'Git',cat:'infra',label:'Version control',symbol:'GIT',desc:'Version-control tooling used in software development workflows.',used:'Included in the candidate’s development toolset.',projects:[{label:'GitHub profile',url:'https://github.com/Ali-1999'}]},
    {name:'GitHub',cat:'infra',label:'Code hosting',symbol:'GH',desc:'Repository hosting and collaboration platform for source code and project work.',used:'Maintains and works with personal software repositories.',projects:[{label:'Open GitHub',url:'https://github.com/Ali-1999'}]},
    {name:'Cloudflare',cat:'infra',label:'Deployment',symbol:'CF',desc:'Cloud platform used in website deployment and hosting workflows.',used:'Worked with Cloudflare deployment and Worker configuration for web projects.',projects:[{label:'Docvelio',url:'https://docvelio.com'}]},
    {name:'DNS',cat:'infra',label:'Infrastructure',symbol:'DNS',desc:'Domain configuration and website infrastructure administration.',used:'Configured DNS records and supported hosting and website migrations.',projects:[]},
    {name:'cPanel',cat:'infra',label:'Hosting',symbol:'cP',desc:'Web hosting control panel included in the candidate’s hosting and deployment toolkit.',used:'Hosting administration and website deployment workflows.',projects:[]},
    {name:'Hosting & Deployment',cat:'infra',label:'Infrastructure',symbol:'DEP',desc:'Practical website hosting, migration and deployment support.',used:'Configured hosting environments, DNS and deployment workflows.',projects:[{label:'Docvelio',url:'https://docvelio.com'}]},
    {name:'SAP',cat:'business',label:'Business system',symbol:'SAP',desc:'Enterprise system experience in a marketing and CRM support context.',used:'Maintained SAP records for lead tracking and segmentation at Riphah International University.',projects:[]},
    {name:'CRM Platforms',cat:'business',label:'Business system',symbol:'CRM',desc:'Customer relationship management and lead administration workflows.',used:'Supported CRM training, lead tracking, segmentation and email marketing workflows.',projects:[]}
  ];
  const techGrid=document.getElementById('technology-grid');
  const techCount=document.getElementById('tech-count');
  const techDetail={icon:document.getElementById('tech-detail-icon'),category:document.getElementById('tech-detail-category'),title:document.getElementById('tech-detail-title'),description:document.getElementById('tech-detail-description'),projects:document.getElementById('tech-detail-projects')};
  let activeTech='PHP';
  function renderTechDetail(item){
    if(!item)return;
    activeTech=item.name;
    techDetail.icon.textContent=item.symbol;
    techDetail.category.textContent=item.label.toUpperCase()+' / PRACTICAL CONTEXT';
    techDetail.title.textContent=item.name;
    techDetail.description.textContent=item.used+' '+item.desc;
    techDetail.projects.replaceChildren();
    item.projects.forEach(project=>{
      const a=document.createElement('a');a.className='tech-project-link';a.href=project.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=project.label+' ↗';techDetail.projects.appendChild(a);
    });
    techGrid?.querySelectorAll('.tech-card').forEach(card=>{const selected=card.dataset.tech===item.name;card.classList.toggle('is-selected',selected);card.setAttribute('aria-pressed',String(selected));});
    document.querySelectorAll('[data-tech-node]').forEach(node=>node.classList.toggle('is-selected',node.dataset.techNode===item.name));
  }
  function renderTechCards(filter='all'){
    if(!techGrid)return;
    const shown=technologies.filter(t=>filter==='all'||t.cat===filter);
    techCount.textContent=String(shown.length);
    techGrid.replaceChildren();
    shown.forEach(item=>{
      const button=document.createElement('button');button.type='button';button.className='tech-card';button.dataset.tech=item.name;button.setAttribute('aria-pressed','false');
      const symbol=document.createElement('span');symbol.className='tech-card-symbol';symbol.textContent=item.symbol;
      const copy=document.createElement('span');copy.className='tech-card-copy';
      const strong=document.createElement('strong');strong.textContent=item.name;
      const small=document.createElement('small');small.textContent=item.label.toUpperCase();
      copy.append(strong,small);button.append(symbol,copy);
      button.addEventListener('click',()=>renderTechDetail(item));
      techGrid.appendChild(button);
    });
    renderTechDetail(technologies.find(t=>t.name===activeTech)||shown[0]);
  }
  if(techGrid){
    renderTechCards();
    document.querySelectorAll('[data-tech-filter]').forEach(button=>button.addEventListener('click',()=>{
      document.querySelectorAll('[data-tech-filter]').forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
      renderTechCards(button.dataset.techFilter);
    }));
    document.querySelectorAll('[data-tech-node]').forEach(node=>node.addEventListener('click',()=>{
      const item=technologies.find(t=>t.name===node.dataset.techNode);if(item){const filterButton=document.querySelector('[data-tech-filter="all"]');document.querySelectorAll('[data-tech-filter]').forEach(b=>{b.classList.toggle('is-active',b===filterButton);b.setAttribute('aria-pressed',String(b===filterButton));});renderTechCards('all');renderTechDetail(item);document.getElementById('tech-detail')?.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'nearest'});}
    }));
  }

})();
