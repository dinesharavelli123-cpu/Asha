(()=>{
'use strict';
if(window.__saahayQuoteLocationV5)return;window.__saahayQuoteLocationV5=true;
const $=id=>document.getElementById(id);
const q=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const quotes=[
  'You do not have to solve everything today. One steady step is enough.',
  'Progress can be quiet. Showing up still counts.',
  'A difficult moment is not the whole story of your day.',
  'Your pace is allowed to be different from everyone else’s.',
  'Rest can be part of moving forward.',
  'Notice what helped even a little, and build from there.',
  'You can ask for support and still be strong.'
];
const style=document.createElement('style');style.textContent=`
.sa-quote-card{position:relative;overflow:hidden;margin:14px 0 16px;padding:18px 19px;border-radius:24px;background:linear-gradient(135deg,#21164f,#6143ce 58%,#4ecabc);color:#fff;box-shadow:0 16px 36px #4f3ca42c}.sa-quote-card:after{content:'✦';position:absolute;right:17px;top:14px;font-size:24px;opacity:.45}.sa-quote-card small{display:block;font-size:9px;font-weight:900;letter-spacing:.14em;opacity:.72}.sa-quote-card blockquote{margin:9px 30px 5px 0;font-size:15px;font-weight:800;line-height:1.45}.sa-quote-card button{margin-top:9px;border:1px solid #ffffff2e;background:#ffffff14;color:#fff;border-radius:13px;padding:9px 12px;font-weight:800}.sa-location-card{margin-top:14px;padding:17px;border-radius:22px;background:linear-gradient(145deg,#17133a,#3f2b87);color:#fff;border:1px solid #ffffff18}.sa-location-card h3{margin:0 0 6px;font-size:17px}.sa-location-card p{margin:0 0 12px;color:#dcd5f3;font-size:11px;line-height:1.5}.sa-location-card button{width:100%;border:0;border-radius:16px;padding:14px;background:linear-gradient(135deg,#59dbcf,#7b6cff 55%,#f07fc4);color:#fff;font-weight:900;font-size:12px}.sa-location-status{margin-top:9px;font-size:10px;color:#d8d1ef;line-height:1.4}
`;
document.head.appendChild(style);

function quoteIndex(){const d=new Date();return (d.getFullYear()*372+d.getMonth()*31+d.getDate())%quotes.length}
function mountQuote(){const scroll=q('.dash-scroll');if(!scroll||$('saDailyQuote'))return;const card=document.createElement('div');card.id='saDailyQuote';card.className='sa-quote-card';let idx=quoteIndex();const draw=()=>{card.innerHTML=`<small>DAILY ENCOURAGEMENT</small><blockquote>${esc(quotes[idx])}</blockquote><button type="button" id="saNextQuote">Another thought</button>`;card.querySelector('#saNextQuote').onclick=()=>{idx=(idx+1)%quotes.length;draw()}};draw();const streak=$('saStreakCard');if(streak)streak.insertAdjacentElement('afterend',card);else{const hero=q('.hero-card',scroll);hero?.insertAdjacentElement('afterend',card)}}

function mountLocation(){if(($('moduleTitle')?.textContent||'')!=='My Shield')return;const c=$('moduleContent');if(!c||$('saLocationCard'))return;const card=document.createElement('div');card.id='saLocationCard';card.className='sa-location-card';card.innerHTML=`<h3>📍 Share my current location</h3><p>SAHAAY asks for location only when you tap the button. Your location is not continuously tracked.</p><button type="button" id="saShareLocationNow">SHARE CURRENT LOCATION</button><div class="sa-location-status" id="saLocationStatus">Useful when you want to quickly send your location to a trusted person.</div>`;c.appendChild(card);$('saShareLocationNow').onclick=()=>{const st=$('saLocationStatus');st.textContent='Requesting your current location…';if(window.SAHAAYDevice&&typeof SAHAAYDevice.requestAndShareLocation==='function'){SAHAAYDevice.requestAndShareLocation();return}if(!navigator.geolocation){st.textContent='Location is unavailable on this device.';return}navigator.geolocation.getCurrentPosition(pos=>{const text=`My current location: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;if(navigator.share){navigator.share({title:'My current location',text}).then(()=>st.textContent='Location shared.').catch(()=>st.textContent='Sharing was cancelled.')}else{navigator.clipboard?.writeText(text);st.textContent='Location link copied.'}},()=>st.textContent='Location permission was not granted.',{enableHighAccuracy:false,timeout:10000})}}
window.saahayLocationShared=()=>{const st=$('saLocationStatus');if(st)st.textContent='Location ready to share ✓'};
window.saahayLocationError=msg=>{const st=$('saLocationStatus');if(st)st.textContent=msg||'Location could not be shared.'};

function refresh(){mountQuote();mountLocation()}
new MutationObserver(refresh).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,250));else setTimeout(refresh,250);
})();