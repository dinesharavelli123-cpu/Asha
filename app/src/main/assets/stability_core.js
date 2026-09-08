(()=>{
if(window.__saahayStabilityCore)return;window.__saahayStabilityCore=true;

const nativeSetInterval=window.setInterval.bind(window);
const nativeClearInterval=window.clearInterval.bind(window);
const nativeSetTimeout=window.setTimeout.bind(window);
const nativeClearTimeout=window.clearTimeout.bind(window);
const gameIntervals=new Set();
const gameTimeouts=new Set();

const gameOpen=()=>!!document.querySelector('#saCgModal.on,#saGameModal.on,#saGameStage.on,.sa-game-modal.on,.sa-game-stage.on');

window.setInterval=function(fn,delay,...args){
  const id=nativeSetInterval(fn,delay,...args);
  if(gameOpen())gameIntervals.add(id);
  return id;
};
window.clearInterval=function(id){gameIntervals.delete(id);return nativeClearInterval(id)};
window.setTimeout=function(fn,delay,...args){
  let id;
  const wrapped=(...cbArgs)=>{gameTimeouts.delete(id);return fn(...cbArgs)};
  id=nativeSetTimeout(wrapped,delay,...args);
  if(gameOpen() && Number(delay)>=250)gameTimeouts.add(id);
  return id;
};
window.clearTimeout=function(id){gameTimeouts.delete(id);return nativeClearTimeout(id)};

function cleanupGameRuntime(){
  gameIntervals.forEach(id=>nativeClearInterval(id));gameIntervals.clear();
  gameTimeouts.forEach(id=>nativeClearTimeout(id));gameTimeouts.clear();
  document.body.classList.remove('sa-game-active');
}
window.saahayCleanupGames=cleanupGameRuntime;

const css=document.createElement('style');css.textContent=`
body.sa-game-active .app:before,body.sa-game-active .app:after,body.sa-game-active .bg-orbs *,body.sa-game-active .hero:before,body.sa-game-active .hero:after,body.sa-game-active .sa-ai-fab,body.sa-game-active #sos{animation-play-state:paused!important}
body.sa-game-active .sa-ai-fab,body.sa-game-active #sos,body.sa-game-active .bottom{visibility:hidden!important;pointer-events:none!important}
body.sa-game-active .screen{contain:layout paint style}
#saCgModal,#saGameModal,#saGameStage{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
`;
document.head.appendChild(css);

function normalizeGames(){
  const legacy=document.getElementById('mindgames');
  if(legacy)legacy.remove();
  document.querySelectorAll('[onclick]').forEach(el=>{
    const v=el.getAttribute('onclick')||'';
    if(v.includes("go('mindgames')")||v.includes('go("mindgames")'))el.setAttribute('onclick',"go('games')");
  });
}

const originalGo=window.go;
if(typeof originalGo==='function'){
  window.go=function(id,btn){
    if(id==='mindgames')id='games';
    if(!['games'].includes(id))cleanupGameRuntime();
    return originalGo(id,btn);
  };
}

document.addEventListener('click',e=>{
  const t=e.target.closest('#cgBack,#cgRestart,#cgNext,#saGameBack,.sa-game-close');
  if(t)cleanupGameRuntime();
  nativeSetTimeout(()=>{document.body.classList.toggle('sa-game-active',gameOpen())},0);
},true);

const obs=new MutationObserver(()=>{
  normalizeGames();
  document.body.classList.toggle('sa-game-active',gameOpen());
});
obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
nativeSetTimeout(normalizeGames,400);

window.addEventListener('pagehide',cleanupGameRuntime);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cleanupGameRuntime()});
})();