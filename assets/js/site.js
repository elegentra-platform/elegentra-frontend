(function(){
  const drawer=document.getElementById('drawer');
  const open=document.getElementById('menu-open');
  const close=document.getElementById('menu-close');
  const header=document.querySelector('.site-header');
  function setHeader(){ if(header) header.classList.toggle('scrolled', window.scrollY > 8); }
  setHeader();
  window.addEventListener('scroll', setHeader, {passive:true});
  if(drawer&&open&&close){
    function openMenu(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
    function closeMenu(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');document.body.style.overflow=''}
    open.addEventListener('click',openMenu);
    close.addEventListener('click',closeMenu);
    drawer.addEventListener('click',e=>{if(e.target===drawer)closeMenu()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  }
  const revealItems=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}});
    },{threshold:.16});
    revealItems.forEach(item=>observer.observe(item));
  }else{revealItems.forEach(item=>item.classList.add('visible'))}
  const counters=[...document.querySelectorAll('[data-count]')];
  const animateCounter=(node)=>{
    const target=Number(node.dataset.count||0);
    const suffix=node.dataset.suffix||'';
    const duration=900;
    const start=performance.now();
    function tick(now){
      const progress=Math.min((now-start)/duration,1);
      const value=Math.round(target*(1-Math.pow(1-progress,3)));
      node.textContent=value+suffix;
      if(progress<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  if('IntersectionObserver' in window){
    const counterObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);counterObserver.unobserve(entry.target)}});
    },{threshold:.5});
    counters.forEach(counter=>counterObserver.observe(counter));
  }else{counters.forEach(animateCounter)}
})();



// reveal fallback safety
window.setTimeout(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible')), 250);


(function(){
  const stack=document.getElementById('stack-preview');
  const lightbox=document.getElementById('preview-lightbox');
  if(!stack||!lightbox)return;
  const image=lightbox.querySelector('.lightbox-stage img');
  const close=lightbox.querySelector('.lightbox-close');
  const prev=lightbox.querySelector('.lightbox-prev');
  const next=lightbox.querySelector('.lightbox-next');
  const items=[...stack.querySelectorAll('.stack-card img')].map(img=>({src:img.getAttribute('src'),alt:img.getAttribute('alt')||'Elegentra preview'}));
  let index=0;
  let startX=0;
  function show(nextIndex){
    index=(nextIndex+items.length)%items.length;
    image.src=items[index].src;
    image.alt=items[index].alt;
  }
  function openGallery(startIndex=0){
    show(startIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    close.focus({preventScroll:true});
  }
  function closeGallery(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  stack.addEventListener('click',event=>{
    const card=event.target.closest('.stack-card');
    const cards=[...stack.querySelectorAll('.stack-card')];
    openGallery(Math.max(0,cards.indexOf(card)));
  });
  stack.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openGallery(0);}});
  close.addEventListener('click',closeGallery);
  prev.addEventListener('click',()=>show(index-1));
  next.addEventListener('click',()=>show(index+1));
  lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeGallery();});
  document.addEventListener('keydown',event=>{
    if(!lightbox.classList.contains('open'))return;
    if(event.key==='Escape')closeGallery();
    if(event.key==='ArrowLeft')show(index-1);
    if(event.key==='ArrowRight')show(index+1);
  });
  lightbox.addEventListener('touchstart',event=>{startX=event.changedTouches[0].clientX;},{passive:true});
  lightbox.addEventListener('touchend',event=>{
    const delta=event.changedTouches[0].clientX-startX;
    if(Math.abs(delta)<42)return;
    if(delta<0)show(index+1); else show(index-1);
  },{passive:true});
})();

