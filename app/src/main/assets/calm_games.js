(()=>{
if(window.__saahayLegacyCalmDisabled)return;window.__saahayLegacyCalmDisabled=true;
if(!document.querySelector('script[data-sa-stability]')){
  const s=document.createElement('script');
  s.src='stability_core.js';
  s.dataset.saStability='1';
  document.body.appendChild(s);
}
})();