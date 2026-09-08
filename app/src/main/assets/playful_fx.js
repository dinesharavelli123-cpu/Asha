(()=>{
if(window.__saahayPlayfulFx)return;window.__saahayPlayfulFx=true;
const style=document.createElement('style');style.textContent=`
:root{--sa-fast:cubic-bezier(.2,1.35,.35,1);--sa-snap:cubic-bezier(.34,1.56,.64,1)}
.screen.on{animation:saKidPage .28s var(--sa-fast)!important}
@keyframes saKidPage{0%{opacity:0;transform:translateX(20px) scale(.96)}70%{transform:translateX(-2px) scale(1.012)}100%{opacity:1;transform:none}}
.screen.on .card{animation:saKidCard .34s var(--sa-snap) both!important}
.screen.on .card:nth-of-type(2){animation-delay:.035s!important}.screen.on .card:nth-of-type(3){animation-delay:.07s!important}.screen.on .card:nth-of-type(4){animation-delay:.105s!important}
@keyframes saKidCard{0%{opacity:0;transform:translateY(16px) scale(.9) rotate(-1deg)}75%{transform:translateY(-2px) scale(1.025) rotate(.35deg)}100%{opacity:1;transform:none}}
.card,.quick,.test-card,.setting-row{transition:transform .14s var(--sa-snap),box-shadow .14s ease!important}
.card:active,.quick:active,.test-card:active,.setting-row:active{transform:scale(.94) rotate(-.6deg)!important}
.btn,.sa-btn,.choice,.sa-opt,.mood{transition:transform .12s var(--sa-snap),filter .12s ease!important}
.btn:active,.sa-btn:active,.choice:active,.sa-opt:active,.mood:active{transform:scale(.91)!important}
.primary{animation:saKidPulse 1.8s ease-in-out infinite!important}
@keyframes saKidPulse{50%{transform:translateY(-1px) scale(1.015);filter:brightness(1.08)}}
.quick .qicon,.test-icon,.setting-icon,.metric i{display:grid;place-items:center;animation:saIconBob 1.75s ease-in-out infinite;transform-origin:50% 70%}
.quick:nth-child(2n) .qicon,.test-card:nth-child(2n) .test-icon{animation-delay:-.55s}
@keyframes saIconBob{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-4px) rotate(-5deg)}65%{transform:translateY(1px) rotate(4deg)}}
.nav.sel{animation:saKidNav .24s var(--sa-snap)!important}
@keyframes saKidNav{0%{transform:scale(.78)}65%{transform:translateY(-7px) scale(1.22)}100%{transform:translateY(-2px) scale(1)}}
.ring{animation:saKidRing .48s var(--sa-snap)!important}
@keyframes saKidRing{0%{transform:scale(.45) rotate(-100deg);opacity:0}72%{transform:scale(1.08) rotate(5deg)}100%{transform:none;opacity:1}}
.sa-step.on,.test-q.on{animation:saKidStep .25s var(--sa-fast)!important}
@keyframes saKidStep{0%{opacity:0;transform:translateX(34px) scale(.96)}75%{transform:translateX(-3px) scale(1.01)}100%{opacity:1;transform:none}}
.progress span,.sa-progress span,.test-progress span{transition:width .22s var(--sa-fast)!important}
.modal.on .sheet{animation:saKidSheet .3s var(--sa-snap)!important}
@keyframes saKidSheet{0%{opacity:0;transform:translateY(55px) scale(.86)}78%{transform:translateY(-5px) scale(1.02)}100%{opacity:1;transform:none}}
.toast.on{animation:saKidToast .22s var(--sa-snap)!important}
@keyframes saKidToast{0%{opacity:0;transform:translate(-50%,18px) scale(.75)}75%{transform:translate(-50%,-2px) scale(1.05)}100%{opacity:1;transform:translate(-50%,0) scale(1)}}
.sa-card{animation:saKidOnboard .38s var(--sa-snap) both!important}
@keyframes saKidOnboard{0%{opacity:0;transform:scale(.86) translateY(24px)}75%{transform:scale(1.02) translateY(-3px)}100%{opacity:1;transform:none}}
.sa-logo{animation:saKidLogo 1.6s ease-in-out infinite!important}
@keyframes saKidLogo{0%,100%{transform:rotate(-3deg) scale(1)}50%{transform:translateY(-5px) rotate(5deg) scale(1.06)}}
.sa-pop-star{position:fixed;z-index:40000;pointer-events:none;font-size:15px;animation:saStarPop .5s ease-out forwards}
@keyframes saStarPop{0%{opacity:0;transform:scale(.2) rotate(0)}35%{opacity:1;transform:scale(1.25) rotate(35deg)}100%{opacity:0;transform:translateY(-32px) scale(.45) rotate(90deg)}}
.sa-squish{animation:saSquish .2s var(--sa-snap)!important}
@keyframes saSquish{45%{transform:scale(.9,.82)}75%{transform:scale(1.06,1.1)}100%{transform:none}}
@media(prefers-reduced-motion:reduce){.quick .qicon,.test-icon,.setting-icon,.metric i{animation:none!important}}
`;
document.head.appendChild(style);
const stars=['✦','✧','•','✶'];
document.addEventListener('pointerdown',e=>{const hit=e.target.closest('button,.quick,.test-card,.setting-row,.card');if(!hit)return;hit.classList.remove('sa-squish');void hit.offsetWidth;hit.classList.add('sa-squish');for(let i=0;i<2;i++){const s=document.createElement('i');s.className='sa-pop-star';s.textContent=stars[(Math.random()*stars.length)|0];s.style.left=(e.clientX+(Math.random()*24-12))+'px';s.style.top=(e.clientY+(Math.random()*18-9))+'px';s.style.animationDelay=(i*.035)+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),560)}},{passive:true});
})();