(()=>{
if(window.__saahayMotionFx)return;window.__saahayMotionFx=true;
const style=document.createElement('style');style.textContent=`
:root{--sa-spring:cubic-bezier(.16,1,.3,1)}
.app:before{content:"";position:fixed;inset:-25%;pointer-events:none;z-index:0;background:conic-gradient(from 180deg at 50% 50%,#7657ef10,#45d4bd10,#ef6dad0d,#7657ef10);filter:blur(70px);animation:saAurora 18s linear infinite}
@keyframes saAurora{to{transform:rotate(360deg) scale(1.08)}}
.screen.on{animation:saPageIn .58s var(--sa-spring)!important}
@keyframes saPageIn{from{opacity:0;transform:translate3d(0,24px,0) scale(.975);filter:blur(7px)}to{opacity:1;transform:none;filter:none}}
.screen.on>.head,.screen.on>.top{animation:saTopIn .55s .05s var(--sa-spring) both}
@keyframes saTopIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
.screen.on .section{animation:saFadeUp .5s .12s var(--sa-spring) both}
.screen.on .card{animation:saCardIn .62s var(--sa-spring) both}
.screen.on .card:nth-of-type(2){animation-delay:.07s}.screen.on .card:nth-of-type(3){animation-delay:.14s}.screen.on .card:nth-of-type(4){animation-delay:.21s}
@keyframes saCardIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
.card{will-change:transform;transition:transform .28s var(--sa-spring),box-shadow .28s ease,border-color .28s ease!important}
.card:active{transform:scale(.975)!important}.quick:active,.setting-row:active{transform:scale(.97)}
.hero{isolation:isolate}.hero:before{animation:heroOrb 5.5s ease-in-out infinite!important}.hero:after{animation:heroOrb 7s ease-in-out infinite reverse!important}
.hero h2{animation:saFadeUp .65s .08s var(--sa-spring) both}.hero p{animation:saFadeUp .65s .16s var(--sa-spring) both}.hero .btn{animation:saFadeUp .65s .24s var(--sa-spring) both}
@keyframes saFadeUp{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:none}}
.ring{animation:saRing .9s var(--sa-spring)!important;box-shadow:0 0 0 1px #ffffff18 inset,0 18px 40px #0003,0 0 35px #54d8bc22!important}
@keyframes saRing{from{opacity:0;transform:scale(.65) rotate(-80deg)}to{opacity:1;transform:none}}
.ring:after{content:"";position:absolute;inset:-7px;border-radius:50%;border:1px solid #6ee3cf3d;animation:saRingPulse 2.7s ease-out infinite}
@keyframes saRingPulse{0%{transform:scale(.88);opacity:.8}75%,100%{transform:scale(1.18);opacity:0}}
.btn{transition:transform .2s var(--sa-spring),filter .2s ease,box-shadow .2s ease!important}.btn:active{transform:scale(.955)!important}.primary{animation:saButtonGlow 3s ease-in-out infinite}
@keyframes saButtonGlow{50%{box-shadow:0 16px 34px #6b54e855,0 0 0 5px #7357f40b}}
.bottom{animation:saNavUp .55s var(--sa-spring) both}@keyframes saNavUp{from{transform:translate(-50%,22px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
.nav.sel{animation:saNavPop .35s var(--sa-spring)}@keyframes saNavPop{50%{transform:translateY(-5px) scale(1.14)}}
.modal{transition:opacity .25s ease!important}.modal.on .sheet{animation:saSheetUp .45s var(--sa-spring)}@keyframes saSheetUp{from{opacity:0;transform:translateY(42px) scale(.96)}to{opacity:1;transform:none}}
.toast.on{animation:saToast .35s var(--sa-spring)}@keyframes saToast{from{opacity:0;transform:translate(-50%,14px) scale(.95)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
.sa-onboard{animation:saOnboardFade .5s ease both}.sa-card{animation:saOnboardCard .65s var(--sa-spring) both}@keyframes saOnboardFade{from{opacity:0}to{opacity:1}}@keyframes saOnboardCard{from{opacity:0;transform:translateY(25px) scale(.96)}to{opacity:1;transform:none}}
.sa-step.on{animation:saStepSlide .42s var(--sa-spring)!important}@keyframes saStepSlide{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:none}}
.sa-opt,.choice,.mood,.setting-row{transition:transform .22s var(--sa-spring),background .22s ease,border-color .22s ease!important}
.sa-opt.sel,.choice.sel,.mood.sel{animation:saSelect .32s var(--sa-spring)}@keyframes saSelect{50%{transform:scale(1.025)}}
@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}}
`;
document.head.appendChild(style);

const ripple=e=>{const b=e.currentTarget;if(!b||b.querySelector('.sa-ripple'))return;const r=document.createElement('i');r.className='sa-ripple';const rect=b.getBoundingClientRect();const size=Math.max(rect.width,rect.height)*1.4;r.style.cssText=`position:absolute;pointer-events:none;width:${size}px;height:${size}px;border-radius:50%;background:#fff4;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;transform:scale(0);animation:saRipple .55s ease-out forwards`;b.style.position=b.style.position||'relative';b.style.overflow='hidden';b.appendChild(r);setTimeout(()=>r.remove(),600)};
const rs=document.createElement('style');rs.textContent='@keyframes saRipple{to{transform:scale(1);opacity:0}}';document.head.appendChild(rs);
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button,.quick,.setting-row');if(b)ripple({currentTarget:b,clientX:e.clientX,clientY:e.clientY})},{passive:true});
})();