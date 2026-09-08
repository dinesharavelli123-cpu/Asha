(()=>{
if(window.__saahayStartupGuard)return;window.__saahayStartupGuard=true;
function ensureVisible(){
  try{
    const onboarding=document.getElementById('saahayOnboarding');
    if(onboarding && getComputedStyle(onboarding).display!=='none') return;
    const splash=document.getElementById('splash');
    if(splash && splash.classList.contains('on') && !splash.classList.contains('sa-exit')) return;
    const active=document.querySelector('.screen.on');
    const overlay=document.querySelector('.mg2-overlay.on,.mgp-overlay.on,.sa-game-modal.on,.sa-exercise.on,.modal.on');
    if(active || overlay) return;
    const home=document.getElementById('home');
    if(!home) return;
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
    home.classList.add('on');
    const nav=document.getElementById('bottom'); if(nav) nav.classList.remove('hidden');
    const sos=document.getElementById('sos'); if(sos) sos.classList.remove('hidden');
    window.scrollTo(0,0);
  }catch(e){}
}
setTimeout(ensureVisible,1600);
setTimeout(ensureVisible,3200);
setTimeout(ensureVisible,5200);
window.addEventListener('load',()=>setTimeout(ensureVisible,900));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(ensureVisible,250)});
window.addEventListener('pageshow',()=>setTimeout(ensureVisible,250));
window.saahayEnsureVisible=ensureVisible;
})();