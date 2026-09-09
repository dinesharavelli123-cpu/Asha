(()=>{
if(window.__saahayPlayfulFx)return;window.__saahayPlayfulFx=true;
const style=document.createElement('style');style.textContent=`
:root{--sa-fast:cubic-bezier(.2,1.35,.35,1);--sa-snap:cubic-bezier(.34,1.56,.64,1)}
.screen.on{animation:saKidPage .25s var(--sa-fast)!important}
@keyframes saKidPage{0%{opacity:0;transform:translateX(18px) scale(.97)}70%{transform:translateX(-2px) scale(1.01)}100%{opacity:1;transform:none}}
.screen.on .card{animation:saKidCard .3s var(--sa-snap) both!important}@keyframes saKidCard{0%{opacity:0;transform:translateY(12px) scale(.92)}75%{transform:translateY(-2px) scale(1.02)}100%{opacity:1;transform:none}}
.card,.quick,.test-card,.setting-row{transition:transform .13s var(--sa-snap),box-shadow .13s ease!important}.card:active,.quick:active,.test-card:active,.setting-row:active{transform:scale(.95)!important}
.btn,.sa-btn,.choice,.sa-opt,.mood{transition:transform .11s var(--sa-snap),filter .11s ease!important}.btn:active,.sa-btn:active,.choice:active,.sa-opt:active,.mood:active{transform:scale(.92)!important}
.primary{animation:saKidPulse 1.7s ease-in-out infinite!important}@keyframes saKidPulse{50%{transform:translateY(-1px) scale(1.012);filter:brightness(1.06)}}
.quick .qicon,.test-icon,.setting-icon,.metric i{display:grid!important;place-items:center!important;animation:saIconBob 1.65s ease-in-out infinite;transform-origin:50% 70%}
.qicon,.quick .qicon{width:54px!important;height:54px!important;min-width:54px!important;border-radius:18px!important;font-size:28px!important}.metric i{font-size:34px!important}.test-icon,.setting-icon{font-size:30px!important;min-width:50px!important;min-height:50px!important}
.quick{min-height:82px!important;padding:13px!important}.quick b{font-size:13px!important}.quick small{font-size:10px!important;line-height:1.3!important}
@keyframes saIconBob{0%,100%{transform:translateY(0)}40%{transform:translateY(-4px) rotate(-4deg)}70%{transform:translateY(1px) rotate(3deg)}}
.bottom{height:70px!important;padding-bottom:max(5px,env(safe-area-inset-bottom))!important}.nav{font-size:27px!important;min-width:58px!important;min-height:58px!important}.nav span{font-size:9px!important;margin-top:2px!important}.nav.sel{animation:saKidNav .22s var(--sa-snap)!important}@keyframes saKidNav{0%{transform:scale(.8)}65%{transform:translateY(-5px) scale(1.18)}100%{transform:none}}
#sos.sos{position:fixed!important;left:14px!important;right:auto!important;bottom:88px!important;width:64px!important;height:64px!important;border-radius:50%!important;z-index:9800!important;font-size:17px!important;font-weight:950!important;box-shadow:0 0 0 7px #ff647522,0 14px 32px #d94d5d55!important}
.sa-ai-fab{right:14px!important;left:auto!important;bottom:92px!important;width:54px!important;height:54px!important;border-radius:18px!important;z-index:9700!important;font-size:24px!important}
#saAiFab{display:none!important}
.head .back,.back{min-width:48px!important;min-height:48px!important;font-size:22px!important;border-radius:16px!important}
.icon{min-width:50px!important;min-height:50px!important;font-size:24px!important}
.mood{min-width:58px!important;min-height:58px!important;font-size:30px!important}.choice{min-height:52px!important;font-size:13px!important}
.sa-game-card,.mg2-card{min-height:145px!important;padding:17px!important}.sa-game-card .ico,.mg2-card .ico{font-size:42px!important}.sa-game-card b,.mg2-card b{font-size:15px!important}.sa-game-card small,.mg2-card small{font-size:10.5px!important}
.sa-game-btn,.mg2-btn,.mg2-next{min-height:48px!important;font-size:13px!important}.sa-tile,.mg2-tile,.sa-focus,.mg2-seq button,.mg2-options button{touch-action:manipulation!important}
.sa-pop-star{position:fixed;z-index:40000;pointer-events:none;font-size:15px;animation:saStarPop .45s ease-out forwards}@keyframes saStarPop{0%{opacity:0;transform:scale(.2)}35%{opacity:1;transform:scale(1.2) rotate(30deg)}100%{opacity:0;transform:translateY(-28px) scale(.45) rotate(75deg)}}
@media(prefers-reduced-motion:reduce){.quick .qicon,.test-icon,.setting-icon,.metric i{animation:none!important}}
`;
document.head.appendChild(style);
const stars=['✦','✧','•','✶'];document.addEventListener('pointerdown',e=>{const hit=e.target.closest('button,.quick,.test-card,.setting-row,.card');if(!hit)return;for(let i=0;i<2;i++){const s=document.createElement('i');s.className='sa-pop-star';s.textContent=stars[(Math.random()*stars.length)|0];s.style.left=(e.clientX+(Math.random()*20-10))+'px';s.style.top=(e.clientY+(Math.random()*16-8))+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),500)}},{passive:true});

// Load the actual playable 16-game engine. This was previously present in assets but not loaded by app startup.
if(!window.__saahayMindGamesV2 && !document.querySelector('script[data-sa-mindgames]')){const g=document.createElement('script');g.src='mind_games_v2.js';g.dataset.saMindgames='1';document.body.appendChild(g)}
// Load the corrected Mind Calm controller after all calm UIs so START/PAUSE/RESUME works reliably on Android.
if(!document.querySelector('script[data-sa-calmfix]')){const c=document.createElement('script');c.src='mind_calm_fix.js';c.dataset.saCalmfix='1';document.body.appendChild(c)}

function ensureGameEntry(){const home=document.getElementById('home');if(!home||document.getElementById('saGamesEntry'))return;const games=document.getElementById('games');if(!games)return;const box=document.createElement('div');box.id='saGamesEntry';box.innerHTML=`<div class="section"><h3>Play & train</h3><small>fully interactive</small></div><div class="quick-row"><div class="card quick" onclick="go('games')"><div class="qicon">🎮</div><div><b>Mind Games</b><small class="mut">16 playable activities</small></div></div><div class="card quick" onclick="go('mindcalm')"><div class="qicon">🫧</div><div><b>Calm Tools</b><small class="mut">quick reset exercises</small></div></div></div>`;home.appendChild(box)}
function cleanDuplicateFab(){const dup=document.getElementById('saAiFab');if(dup)dup.remove()}
let tries=0;const ready=setInterval(()=>{cleanDuplicateFab();ensureGameEntry();tries++;if((document.getElementById('games')&&document.getElementById('saGamesEntry'))||tries>80)clearInterval(ready)},100);
new MutationObserver(()=>{cleanDuplicateFab();ensureGameEntry()}).observe(document.body,{childList:true,subtree:true});
})();