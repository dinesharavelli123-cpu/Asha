/* SAHAAY STEP 1 — splash-only JavaScript.
   This file does not touch Firebase, onboarding, login, dashboard, journal or games. */
(()=>{
  const SPLASH_VISIBLE_MS=3400;
  const SPLASH_REMOVE_MS=4050;

  function makeVisualParticles(root){
    const particleLayer=root.querySelector('.splash-particle-layer');
    const petalLayer=root.querySelector('.splash-petal-layer');
    const starLayer=root.querySelector('.splash-star-layer');

    if(particleLayer){
      for(let i=0;i<14;i++){
        const p=document.createElement('i');
        p.className='splash-particle';
        p.style.setProperty('--x',(6+Math.random()*88).toFixed(1)+'%');
        p.style.setProperty('--y',(8+Math.random()*82).toFixed(1)+'%');
        p.style.setProperty('--s',(3+Math.random()*5).toFixed(1)+'px');
        p.style.setProperty('--d',(3.8+Math.random()*3.8).toFixed(2)+'s');
        p.style.setProperty('--delay',(-Math.random()*4).toFixed(2)+'s');
        particleLayer.appendChild(p);
      }
    }

    if(petalLayer){
      for(let i=0;i<7;i++){
        const petal=document.createElement('i');
        petal.className='splash-petal';
        petal.style.setProperty('--x',(4+Math.random()*92).toFixed(1)+'%');
        petal.style.setProperty('--w',(10+Math.random()*11).toFixed(1)+'px');
        petal.style.setProperty('--d',(7.5+Math.random()*5).toFixed(2)+'s');
        petal.style.setProperty('--delay',(-Math.random()*9).toFixed(2)+'s');
        petal.style.setProperty('--drift',(-35+Math.random()*70).toFixed(1)+'px');
        petalLayer.appendChild(petal);
      }
    }

    if(starLayer){
      for(let i=0;i<10;i++){
        const star=document.createElement('i');
        star.className='splash-star';
        star.style.setProperty('--x',(7+Math.random()*86).toFixed(1)+'%');
        star.style.setProperty('--y',(6+Math.random()*74).toFixed(1)+'%');
        star.style.setProperty('--s',(4+Math.random()*5).toFixed(1)+'px');
        star.style.setProperty('--d',(1.2+Math.random()*1.9).toFixed(2)+'s');
        star.style.setProperty('--delay',(-Math.random()*2).toFixed(2)+'s');
        starLayer.appendChild(star);
      }
    }
  }

  function bindTouchRipple(root){
    root.addEventListener('pointerdown',event=>{
      const r=document.createElement('span');
      r.className='splash-touch-ripple';
      const rect=root.getBoundingClientRect();
      r.style.left=(event.clientX-rect.left)+'px';
      r.style.top=(event.clientY-rect.top)+'px';
      root.appendChild(r);
      setTimeout(()=>r.remove(),760);
    },{passive:true});
  }

  function finishSplash(root){
    if(!root||root.classList.contains('splash-leaving'))return;
    root.classList.add('splash-leaving');
    window.dispatchEvent(new CustomEvent('saahaySplashLeaving'));
  }

  function initSplash(){
    const root=document.getElementById('saahaySplash');
    if(!root)return;

    makeVisualParticles(root);
    bindTouchRipple(root);

    setTimeout(()=>finishSplash(root),SPLASH_VISIBLE_MS);
    setTimeout(()=>{
      if(root&&root.parentNode)root.remove();
      window.dispatchEvent(new CustomEvent('saahaySplashFinished'));
    },SPLASH_REMOVE_MS);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initSplash,{once:true});
  else initSplash();
})();
