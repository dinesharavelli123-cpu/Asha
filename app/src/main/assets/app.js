(()=>{const a=document.createElement('script');a.src='input_fix.js';document.head.appendChild(a);const o=document.createElement('script');o.src='onboarding_fx.js';document.head.appendChild(o);const s=document.createElement('script');s.src='startup_fx.js';document.head.appendChild(s)})();
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={mood:2,sleep:1,social:1,text:'',score:68};let step=1;
function go(id,btn){$$('.screen').forEach(s=>s.classList.remove('on'));$('#'+id).classList.add('on');const nav=$('#bottom'),sos=$('#sos');const show=id!=='splash'&&id!=='check'&&id!=='result';nav.classList.toggle('hidden',!show);sos.classList.toggle('hidden',id==='splash');if(btn){$$('.nav').forEach(n=>n.classList.remove('sel'));btn.classList.add('sel')} window.scrollTo(0,0)}
function startCheck(btn){step=1;updateStep();go('check');if(btn){$$('.nav').forEach(n=>n.classList.remove('sel'));btn.classList.add('sel')}}
function updateStep(){ $$('.step').forEach(x=>x.classList.toggle('on',+x.dataset.s===step)); $('#stepN').textContent=step; $('#prog').style.width=(step*25)+'%'; }
function next(){ if(step<4){step++;updateStep()} }
$$('.mood').forEach(b=>b.onclick=()=>{$$('.mood').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');state.mood=+b.dataset.v});
$$('.choice').forEach(b=>b.onclick=()=>{const k=b.dataset.key;$$(`.choice[data-key="${k}"]`).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');state[k]=+b.dataset.v});
function voice(){
  if(window.AndroidBridge?.startVoiceRecognition){AndroidBridge.startVoiceRecognition();toast('Listening…')} else if('webkitSpeechRecognition' in window){const r=new webkitSpeechRecognition();r.lang='en-IN';r.interimResults=false;r.onresult=e=>{setNativeVoiceText(e.results[0][0].transcript)};r.onerror=()=>toast('Voice unavailable — type instead');r.start();toast('Listening…')} else toast('Voice unavailable — type instead');
}
window.setNativeVoiceText=t=>{$('#feel').value=t;toast('Voice added ✓')};
function analyse(){
  state.text=$('#feel').value.trim();
  const neg=['tired','overwhelmed','worried','anxious','alone','stressed','sad','exhausted','bad','pressure','isolated','heavy'];
  const pos=['okay','fine','good','better','calm','hopeful','happy','supported','rested'];
  const low=(state.text.toLowerCase().match(new RegExp(neg.join('|'),'g'))||[]).length;
  const high=(state.text.toLowerCase().match(new RegExp(pos.join('|'),'g'))||[]).length;
  const textRisk=Math.max(0,Math.min(4,low-high));
  const risk=state.mood*7+state.sleep*8+state.social*8+textRisk*6;
  const score=Math.max(18,Math.min(92,86-risk));state.score=score;
  localStorage.setItem('ashaLast',JSON.stringify({...state,ts:Date.now(),textRisk}));
  renderResult(score,textRisk);go('result');
}
function renderResult(score,textRisk){
  $('#resRing').style.setProperty('--v',score);animateNum($('#resScore'),score,850);
  let title='Stable with a few signals to watch',txt='Your check-in does not show a strong sustained change right now.';
  if(score<45){title='Stronger change detected';txt='Several signals shifted together. ASHA would prioritise a supportive human follow-up in this prototype.'}
  else if(score<65){title='Moderate change detected';txt='A few signals moved together. ASHA would continue monitoring and suggest a check-in soon.'}
  else if(score>=78){title='Looking steady';txt='Your current signals look fairly stable compared with your local baseline.'}
  $('#resTitle').textContent=title;$('#resText').textContent=txt;
  const vals={Mood:state.mood*22,Sleep:state.sleep*38,Social:state.social*38,Text:textRisk*22};
  requestAnimationFrame(()=>setTimeout(()=>{setBar('Mood',vals.Mood);setBar('Sleep',vals.Sleep);setBar('Social',vals.Social);setBar('Text',vals.Text)},140));
  const parts=[];if(state.mood>=3)parts.push('your mood was lower than usual');if(state.sleep>=2)parts.push('sleep was noticeably disrupted');if(state.social>=2)parts.push('you reported feeling more isolated');if(textRisk>=2)parts.push('your wording carried more stress-related language');
  $('#explain').textContent=parts.length?`Why ASHA changed the signal: ${parts.join(', ')}. The local model combines these factors instead of relying on one answer.`:'Why ASHA kept the signal steady: no single factor showed a large enough shift to dominate the result.';
  $('#homeScore').textContent=score;$('#homeRing').style.setProperty('--v',score);$('#sig').textContent=score<45?'High':score<65?'Moderate':'Low';
  $('#insightSummary').textContent=title+'. '+txt;
  $('#summary').textContent=score<65?'Your latest check-in shows a change worth watching. ASHA can explain the contributing signals.':'Your latest check-in looks relatively steady. Keep checking in so ASHA can build your local pattern.';
  $('#stressMetric').textContent=score<45?'High':score<65?'Elevated':'Moderate';$('#sleepTrend').textContent=state.sleep>=2?'Disrupted':'Steady';$('#socialMetric').textContent=state.social>=2?'Withdrawn':'Stable';
}
function setBar(name,v){const id=name==='Text'?'fText':'f'+name;$('#'+id).style.width=Math.min(100,v)+'%';$('#'+id+'Txt').textContent=Math.min(100,v)+'%'}
function animateNum(el,to,dur){const start=performance.now();const from=0;function f(t){const p=Math.min(1,(t-start)/dur);const e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function openSOS(){try{window.AndroidBridge?.hapticSOS?.()}catch(e){}$('#sosModal').classList.add('on')}
function closeSOS(){$('#sosModal').classList.remove('on')}
function dial(){if(window.AndroidBridge?.openEmergencyDialer){AndroidBridge.openEmergencyDialer()}else{location.href='tel:112'}closeSOS()}
function share(){if(window.AndroidBridge?.shareSupportMessage){AndroidBridge.shareSupportMessage()}else if(navigator.share){navigator.share({text:'I would like someone I trust to check in with me. — ASHA'})}else toast('Sharing is available in the Android app');closeSOS()}
let tt;function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>x.classList.remove('on'),2200)}
const h=new Date().getHours();$('#greet').textContent=h<12?'Good morning':h<17?'Good afternoon':'Good evening';
try{const last=JSON.parse(localStorage.getItem('ashaLast')||'null');if(last){Object.assign(state,last);renderResult(last.score,last.textRisk||0)}}catch(e){}

(()=>{
  const load=src=>new Promise(resolve=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=resolve;document.body.appendChild(s)});
  const finishLayers=async()=>{await load('profile_sync.js');try{window.ashaApplyLocalProfile?.()}catch(e){}await load('real_data.js');await load('sleep_calm.js');await load('motion_fx.js');await load('mental_tests.js')};
  const loadCore=async()=>{await load('features_v4.js');await load('gamification_v2.js');await finishLayers()};
  let onboarded=false;try{onboarded=localStorage.getItem('ashaOnboardedV1')==='1'}catch(e){}
  load('tutorial.js').then(()=>{
    if(onboarded){load('features_v4.js').then(()=>load('gamification_v2.js')).then(()=>load('signup_once.js')).then(()=>finishLayers());}
    else{load('signup_once.js');window.addEventListener('asha-signup-complete',()=>{loadCore()},{once:true});}
  });
})();
