(()=>{
if(window.__saahayStartupFx)return;window.__saahayStartupFx=true;
const splash=document.getElementById('splash');if(!splash)return;
const style=document.createElement('style');style.textContent=`
#splash.sa-cinematic{padding:0!important;display:grid!important;place-items:center!important;overflow:hidden!important;background:linear-gradient(145deg,#070718 0%,#12092b 30%,#27105b 66%,#4d22a3 100%)!important;color:#fff!important}
.sa-start-bg,.sa-start-stars,.sa-start-grid,.sa-start-vignette{position:absolute;inset:0;pointer-events:none}
.sa-start-bg{inset:-25%;background:radial-gradient(circle at 20% 30%,#a66bff88 0 8%,transparent 27%),radial-gradient(circle at 80% 28%,#5d3df099 0 7%,transparent 28%),radial-gradient(circle at 50% 80%,#d653ff55 0 7%,transparent 30%);filter:blur(28px);animation:saStartAurora 8s ease-in-out infinite alternate}
@keyframes saStartAurora{0%{transform:translate(-3%,2%) scale(1)}100%{transform:translate(4%,-4%) scale(1.13) rotate(7deg)}}
.sa-start-stars{background-image:radial-gradient(#fff 1px,transparent 1px),radial-gradient(#cfaaff 1px,transparent 1px);background-size:31px 31px,47px 47px;background-position:0 0,12px 17px;opacity:.22;animation:saStarDrift 16s linear infinite}
@keyframes saStarDrift{to{background-position:0 220px,12px 300px}}
.sa-start-grid{background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(transparent,#000 35%,#000 75%,transparent);transform:perspective(350px) rotateX(65deg) scale(1.7) translateY(38%);opacity:.18;animation:saGridMove 8s linear infinite}
@keyframes saGridMove{to{background-position:0 88px}}
.sa-start-vignette{background:radial-gradient(circle,transparent 35%,#060611aa 100%)}
.sa-particle{position:absolute;width:5px;height:5px;border-radius:50%;background:#fff;box-shadow:0 0 14px #c69cff;opacity:.65;animation:saParticle 4.5s ease-in-out infinite}
@keyframes saParticle{50%{transform:translateY(-20px) scale(1.6);opacity:1}}
.sa-start-main{position:relative;z-index:3;width:100%;padding:28px;text-align:center;display:flex;flex-direction:column;align-items:center}
.sa-logo-stage{width:178px;height:178px;position:relative;display:grid;place-items:center;margin-bottom:22px}
.sa-logo-halo,.sa-logo-halo:before,.sa-logo-halo:after{position:absolute;content:"";border-radius:50%;inset:0;border:1px solid #d7c2ff66;animation:saHalo 3s ease-out infinite}
.sa-logo-halo:before{inset:18px;animation-delay:.65s}.sa-logo-halo:after{inset:38px;animation-delay:1.3s}
@keyframes saHalo{0%{transform:scale(.68);opacity:0}30%{opacity:.85}100%{transform:scale(1.18);opacity:0}}
.sa-logo-core{width:104px;height:104px;border-radius:34px;position:relative;display:grid;place-items:center;background:linear-gradient(145deg,#9f74ff,#6f42ee 52%,#4123a1);box-shadow:0 24px 65px #7e50ff88,inset 0 1px 0 #ffffff70;animation:saLogoFloat 3.2s ease-in-out infinite}
@keyframes saLogoFloat{50%{transform:translateY(-8px) rotate(3deg) scale(1.045)}}
.sa-logo-core:before{content:"";position:absolute;inset:9px;border-radius:26px;border:1px solid #ffffff38;background:linear-gradient(145deg,#ffffff18,transparent)}
.sa-logo-s{font-size:48px;font-weight:950;letter-spacing:-.06em;position:relative;text-shadow:0 7px 24px #2b146dcc}
.sa-orbit{position:absolute;inset:8px;border:1px solid transparent;border-top-color:#f5eaffaa;border-right-color:#bf9bffaa;border-radius:50%;animation:saOrbit 4.8s linear infinite}.sa-orbit.two{inset:27px;animation-duration:3.7s;animation-direction:reverse;border-top-color:#77f1dbbb;border-right-color:transparent}
@keyframes saOrbit{to{transform:rotate(360deg)}}
.sa-start-kicker{font-size:10px;letter-spacing:.23em;font-weight:900;color:#d8c7ff;opacity:0;animation:saTextIn .7s .35s forwards}
.sa-start-brand{font-size:45px;line-height:1;font-weight:950;letter-spacing:.06em;margin-top:10px;opacity:0;transform:translateY(16px);animation:saTextIn .8s .55s cubic-bezier(.16,1,.3,1) forwards;background:linear-gradient(90deg,#fff,#e3d5ff,#fff);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation-name:saTextIn,saBrandShine;animation-duration:.8s,4s;animation-delay:.55s,1.5s;animation-fill-mode:forwards;animation-iteration-count:1,infinite}
@keyframes saBrandShine{to{background-position:200% center}}
.sa-start-sub{max-width:310px;font-size:12px;line-height:1.6;color:#d6d3e8;margin:10px auto 25px;opacity:0;animation:saTextIn .8s .72s forwards}
@keyframes saTextIn{to{opacity:1;transform:none}}
.sa-loadbox{width:min(320px,86vw);opacity:0;animation:saTextIn .7s .9s forwards}
.sa-load-track{height:7px;border-radius:99px;background:#ffffff14;border:1px solid #ffffff17;overflow:hidden;box-shadow:inset 0 2px 6px #0003}
.sa-load-bar{height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#8d5cf6,#d971ff,#6fe9d0);box-shadow:0 0 24px #aa72ff;transition:width .22s ease}
.sa-load-meta{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:9px;color:#bdb8d5;letter-spacing:.04em}.sa-load-status{transition:opacity .18s ease,transform .18s ease}.sa-load-status.swap{opacity:0;transform:translateY(5px)}
.sa-start-pct{font-weight:900;color:#fff}
.sa-start-skip{margin-top:20px;border:1px solid #ffffff22;background:#ffffff0b;color:#d9d4ea;border-radius:999px;padding:9px 14px;font-size:9px;font-weight:800;opacity:0;animation:saTextIn .6s 1.5s forwards}
.sa-start-skip:active{transform:scale(.95)}
#splash.sa-exit{animation:saSplashExit .72s cubic-bezier(.7,0,.2,1) forwards!important}
@keyframes saSplashExit{0%{opacity:1;filter:blur(0);transform:scale(1)}100%{opacity:0;filter:blur(16px);transform:scale(1.07)}}
.sa-start-flash{position:absolute;inset:0;background:#a66dff;opacity:0;pointer-events:none;z-index:10}.sa-exit .sa-start-flash{animation:saFlash .65s ease forwards}@keyframes saFlash{40%{opacity:.22}100%{opacity:0}}
`;
document.head.appendChild(style);
splash.classList.add('sa-cinematic');
splash.innerHTML=`<div class="sa-start-bg"></div><div class="sa-start-stars"></div><div class="sa-start-grid"></div><div class="sa-start-vignette"></div>
${Array.from({length:12},(_,i)=>`<i class="sa-particle" style="left:${8+(i*7.1)%86}%;top:${10+(i*13)%78}%;animation-delay:-${(i*.37).toFixed(2)}s;transform:scale(${.65+(i%4)*.18})"></i>`).join('')}
<div class="sa-start-main"><div class="sa-logo-stage"><div class="sa-logo-halo"></div><div class="sa-orbit"></div><div class="sa-orbit two"></div><div class="sa-logo-core"><span class="sa-logo-s">S</span></div></div><div class="sa-start-kicker">INTELLIGENT WELLBEING COMPANION</div><div class="sa-start-brand">SAHAAY AI</div><div class="sa-start-sub">Predict. Understand. Recover. Grow.</div><div class="sa-loadbox"><div class="sa-load-track"><div class="sa-load-bar" id="saStartBar"></div></div><div class="sa-load-meta"><span class="sa-load-status" id="saStartStatus">Preparing your private space…</span><span class="sa-start-pct" id="saStartPct">0%</span></div></div><button class="sa-start-skip" id="saStartSkip">Tap to continue</button></div><div class="sa-start-flash"></div>`;
const bar=document.getElementById('saStartBar'),pct=document.getElementById('saStartPct'),status=document.getElementById('saStartStatus'),skip=document.getElementById('saStartSkip');
const messages=['Preparing your private space…','Loading your growth journey…','Activating wellbeing intelligence…','Almost ready…'];let p=0,lastMsg=-1,done=false;
function setMsg(i){if(i===lastMsg)return;lastMsg=i;status.classList.add('swap');setTimeout(()=>{status.textContent=messages[i];status.classList.remove('swap')},170)}
const timer=setInterval(()=>{if(done)return;p+=p<45?3:p<78?2:1.5;if(p>100)p=100;bar.style.width=p+'%';pct.textContent=Math.round(p)+'%';setMsg(p<30?0:p<58?1:p<84?2:3);if(p>=100){clearInterval(timer);setTimeout(finish,320)}},70);
function finish(){if(done)return;done=true;splash.classList.add('sa-exit');setTimeout(()=>{try{if(typeof window.go==='function')window.go('home');else{splash.classList.remove('on');const h=document.getElementById('home');if(h)h.classList.add('on')}}catch(e){}},620)}
skip.addEventListener('click',finish);
window.saahayFinishStartup=finish;
})();