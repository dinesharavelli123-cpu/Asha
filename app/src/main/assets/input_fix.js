(()=>{
if(window.__saahayInputFix)return;window.__saahayInputFix=true;
const guard=document.createElement('script');guard.src='startup_guard.js';guard.dataset.saGuard='1';document.head.appendChild(guard);
const css=document.createElement('style');css.textContent=`
input,textarea,select,[contenteditable="true"]{pointer-events:auto!important;touch-action:manipulation!important;-webkit-user-select:text!important;user-select:text!important;caret-color:#9b7cff!important;position:relative;z-index:2}
input:focus,textarea:focus,select:focus,[contenteditable="true"]:focus{outline:none!important;box-shadow:0 0 0 3px rgba(137,99,255,.22),0 12px 30px rgba(80,44,170,.14)!important;border-color:#9b7cff!important}
.sa-onboard,.screen,.sheet,.card{touch-action:pan-y}.sa-field{position:relative;z-index:3}.sa-field input,.sa-field select{min-height:48px;font-size:16px!important;-webkit-text-fill-color:#fff!important;background:rgba(255,255,255,.09)!important}.sa-field input::placeholder{color:#aeb1c8!important;-webkit-text-fill-color:#aeb1c8!important}textarea{font-size:16px!important}
`;
document.head.appendChild(css);

function enable(el){
 if(!el||el.dataset.saInputReady)return;el.dataset.saInputReady='1';
 el.removeAttribute('readonly');el.removeAttribute('disabled');
 el.style.pointerEvents='auto';
 el.addEventListener('pointerdown',e=>{e.stopPropagation()},{passive:true});
 el.addEventListener('touchstart',e=>{e.stopPropagation()},{passive:true});
 el.addEventListener('focus',()=>{setTimeout(()=>{try{el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}},220)});
}
const scan=root=>(root||document).querySelectorAll?.('input,textarea,select,[contenteditable="true"]').forEach(enable);
scan(document);
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('input,textarea,select,[contenteditable="true"]'))enable(n);scan(n)}}))).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('focusin',e=>{if(e.target.matches?.('input,textarea,select,[contenteditable="true"]'))enable(e.target)},true);
})();