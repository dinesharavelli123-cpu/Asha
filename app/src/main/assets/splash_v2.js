/* SAHAAY screens 1–4. Authentication and dashboard state are intentionally untouched. */
(()=>{
  const SPLASH_MS=3500;
  const COMPLETE_KEY='saahay_intro_complete_v1';
  let page=0,startX=0,locked=false;

  const root=()=>document.getElementById('saahaySplash');
  const pages=()=>[...document.querySelectorAll('[data-intro-page]')];

  function addAtmosphere(host){
    const stars=host.querySelector('.intro-stars');
    const petals=host.querySelector('.intro-petals');
    for(let i=0;i<15;i++){
      const star=document.createElement('i');
      star.style.left=(5+Math.random()*90)+'%';
      star.style.top=(5+Math.random()*54)+'%';
      star.style.setProperty('--d',(1.4+Math.random()*2.4)+'s');
      star.style.setProperty('--delay',(-Math.random()*3)+'s');
      stars.appendChild(star);
    }
    for(let i=0;i<8;i++){
      const petal=document.createElement('i');
      petal.style.setProperty('--x',(2+Math.random()*96)+'%');
      petal.style.setProperty('--w',(10+Math.random()*12)+'px');
      petal.style.setProperty('--d',(8+Math.random()*6)+'s');
      petal.style.setProperty('--delay',(-Math.random()*12)+'s');
      petal.style.setProperty('--drift',(-55+Math.random()*110)+'px');
      petals.appendChild(petal);
    }
  }

  function paint(next){
    if(next<1||next>3||locked)return;
    locked=true;
    const all=pages();
    all.forEach((node,index)=>{
      node.classList.toggle('is-active',index===next);
      node.classList.toggle('is-behind',index<next);
    });
    page=next;
    root().classList.add('is-onboarding');
    document.querySelectorAll('.intro-dots i').forEach((dot,index)=>dot.classList.toggle('is-current',index===page-1));
    const button=document.getElementById('introNext');
    button.querySelector('span').textContent=page===3?'Get Started':'Next';
    button.querySelector('i').textContent=page===3?'✓':'→';
    setTimeout(()=>locked=false,720);
  }

  function finish(){
    const host=root();
    if(!host||host.classList.contains('intro-finished'))return;
    localStorage.setItem(COMPLETE_KEY,'1');
    host.classList.add('intro-finished');
    window.dispatchEvent(new CustomEvent('saahaySplashLeaving'));
    setTimeout(()=>{
      host.remove();
      window.dispatchEvent(new CustomEvent('saahaySplashFinished'));
    },760);
  }

  function advance(){
    if(page<3)paint(page+1);else finish();
  }

  function ripple(event){
    const host=root();
    if(!host)return;
    const mark=document.createElement('i');
    mark.className='intro-touch-ripple';
    mark.style.left=event.clientX+'px';
    mark.style.top=event.clientY+'px';
    host.appendChild(mark);
    setTimeout(()=>mark.remove(),760);
  }

  function init(){
    const host=root();
    if(!host)return;
    addAtmosphere(host);
    host.addEventListener('pointerdown',event=>{startX=event.clientX;ripple(event)},{passive:true});
    host.addEventListener('pointerup',event=>{
      const travel=event.clientX-startX;
      if(page>0&&travel<-54)advance();
      if(page>1&&travel>54)paint(page-1);
    },{passive:true});
    document.getElementById('introNext').addEventListener('click',advance);

    const alreadySeen=localStorage.getItem(COMPLETE_KEY)==='1';
    setTimeout(()=>alreadySeen?finish():paint(1),SPLASH_MS);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();