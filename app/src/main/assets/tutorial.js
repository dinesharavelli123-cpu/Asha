(()=>{
  if(window.__ashaTutorialLoaded)return;window.__ashaTutorialLoaded=true;
  const KEY='ashaTutorialDoneV1';
  const q=s=>document.querySelector(s);
  const steps=[
    {icon:'🪷',eyebrow:'WELCOME TO ASHA',title:'Your wellbeing companion',text:'ASHA helps you check in, notice meaningful changes, understand your patterns and reach support when you choose.',chips:['Private by design','Offline-ready','You stay in control']},
    {icon:'📝',eyebrow:'QUICK CHECK-IN',title:'60 seconds can update your pattern',text:'Answer a few simple questions about mood, sleep and connection, then type or speak how you feel. ASHA combines the signals instead of judging one answer alone.',chips:['Adaptive questions','Voice or text','Local history']},
    {icon:'✨',eyebrow:'AI INSIGHTS',title:'Know why, not just a score',text:'Your insight screen explains which factors changed and your trajectory shows movement over time. The current prototype uses an explainable on-device demo model.',chips:['Explainable factors','30-day trajectory','Change detection']},
    {icon:'🏆',eyebrow:'REWARDS',title:'Small healthy actions earn progress',text:'Complete check-ins and supportive tasks to earn ASHA points, streaks and Bronze, Silver and Gold badges. Rewards are based on engagement — never on having a “perfect” wellbeing score.',chips:['Points','Daily missions','Bronze → Silver → Gold']},
    {icon:'🕶️',eyebrow:'PRIVACY + OFFLINE',title:'Use ASHA your way',text:'Your profile and check-ins stay on this device in the current prototype. Anonymous Mode can hide your identity, while Offline Access keeps core features available without internet.',chips:['Local profile','Anonymous Mode','Offline Access']},
    {icon:'🤝',eyebrow:'SUPPORT',title:'Human support stays one tap away',text:'The Care area demonstrates counsellor follow-up, while the SOS button opens support choices. ASHA assists with early warning but does not replace trained human support.',chips:['Care console','Trusted contact','SOS options']},
    {icon:'🚀',eyebrow:'YOU ARE READY',title:'Explore ASHA',text:'Start with a Quick Check-in, open AI Insights, earn your first mission points and visit Profile anytime to replay this tutorial.',chips:['Check in','Understand','Build consistency']}
  ];
  let i=0;

  const style=document.createElement('style');
  style.textContent=`
  .asha-tutorial{position:fixed;z-index:10000;inset:0;background:radial-gradient(circle at 18% 10%,#745bf055,transparent 30%),radial-gradient(circle at 84% 82%,#4fd8c344,transparent 31%),linear-gradient(155deg,#080d25,#12163a 55%,#2d2363);display:grid;place-items:center;padding:18px;color:#fff;overflow:hidden}.asha-tut-stars{position:absolute;inset:0;opacity:.22;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:28px 28px;animation:tutDrift 20s linear infinite}@keyframes tutDrift{to{transform:translateY(28px)}}.asha-tut-card{position:relative;width:min(100%,440px);min-height:560px;border:1px solid #ffffff24;background:#101531e8;backdrop-filter:blur(25px);border-radius:32px;padding:22px;box-shadow:0 35px 100px #0009;display:flex;flex-direction:column;overflow:hidden}.asha-tut-card:before{content:"";position:absolute;width:210px;height:210px;border-radius:50%;right:-100px;top:-110px;background:#8c71ff35;filter:blur(4px)}.asha-tut-top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1}.asha-tut-brand{font-weight:950;letter-spacing:.12em;font-size:12px}.asha-tut-skip{border:0;background:#ffffff0d;color:#d8daf0;border-radius:999px;padding:8px 12px;font-weight:800;font-size:10px}.asha-tut-visual{height:205px;display:grid;place-items:center;position:relative}.asha-tut-orb{width:128px;height:128px;border-radius:40px;background:linear-gradient(145deg,#7457f5,#4fd8c3);display:grid;place-items:center;font-size:57px;box-shadow:0 24px 70px #6554df66;animation:tutFloat 3.3s ease-in-out infinite;position:relative;z-index:2}.asha-tut-orb:before,.asha-tut-orb:after{content:"";position:absolute;inset:-20px;border:1px solid #ffffff2f;border-radius:52px;animation:tutPulse 2.8s ease-out infinite}.asha-tut-orb:after{inset:-38px;animation-delay:1.1s}@keyframes tutFloat{50%{transform:translateY(-8px) rotate(2deg)}}@keyframes tutPulse{0%{transform:scale(.78);opacity:.7}100%{transform:scale(1.18);opacity:0}}.asha-tut-copy{position:relative;z-index:2;animation:tutIn .35s cubic-bezier(.2,.8,.2,1)}@keyframes tutIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}.asha-tut-eye{font-size:9px;font-weight:900;letter-spacing:.17em;color:#aaa4ff}.asha-tut-copy h2{font-size:28px;line-height:1.08;margin:7px 0 9px}.asha-tut-copy p{font-size:11.5px;line-height:1.65;color:#c2c6dc;margin:0}.asha-tut-chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:15px}.asha-tut-chip{padding:7px 9px;border-radius:999px;background:#ffffff0b;border:1px solid #ffffff15;font-size:9px;color:#d8dbee;font-weight:800}.asha-tut-bottom{margin-top:auto;position:relative;z-index:2}.asha-tut-dots{display:flex;gap:6px;justify-content:center;margin:18px 0}.asha-tut-dot{width:7px;height:7px;border-radius:999px;background:#ffffff2e;transition:.3s}.asha-tut-dot.on{width:24px;background:linear-gradient(90deg,#7559f5,#54d7c2)}.asha-tut-actions{display:grid;grid-template-columns:86px 1fr;gap:9px}.asha-tut-btn{border:0;border-radius:16px;padding:14px;font-weight:900;font-size:12px}.asha-tut-back{background:#ffffff0c;color:#d8dbee;border:1px solid #ffffff17}.asha-tut-next{background:linear-gradient(135deg,#7559f5,#4fd8c3);color:#fff;box-shadow:0 13px 30px #5e54df48}.asha-tut-progress{position:absolute;left:0;top:0;height:4px;width:0;background:linear-gradient(90deg,#7458f5,#4fd8c3,#ed70ac);transition:width .4s cubic-bezier(.2,.8,.2,1)}
  .tutorial-replay{cursor:pointer}
  `;document.head.appendChild(style);

  function done(){try{localStorage.setItem(KEY,'1')}catch(e){} const o=q('#ashaTutorial');if(!o)return;o.style.transition='opacity .28s ease,transform .28s ease';o.style.opacity='0';o.style.transform='scale(1.02)';setTimeout(()=>o.remove(),280)}
  function render(){
    const s=steps[i],o=q('#ashaTutorial');if(!o)return;
    q('#ashaTutIcon').textContent=s.icon;q('#ashaTutEye').textContent=s.eyebrow;q('#ashaTutTitle').textContent=s.title;q('#ashaTutText').textContent=s.text;
    q('#ashaTutChips').innerHTML=s.chips.map(x=>`<span class="asha-tut-chip">${x}</span>`).join('');
    q('#ashaTutDots').innerHTML=steps.map((_,n)=>`<span class="asha-tut-dot ${n===i?'on':''}"></span>`).join('');
    q('#ashaTutBack').style.visibility=i===0?'hidden':'visible';q('#ashaTutNext').textContent=i===steps.length-1?'Start exploring ✨':'Next →';
    q('#ashaTutProgress').style.width=((i+1)/steps.length*100)+'%';
    const c=q('#ashaTutCopy');c.style.animation='none';requestAnimationFrame(()=>{c.style.animation='tutIn .35s cubic-bezier(.2,.8,.2,1)'});
  }
  function show(force=false){
    if(q('#ashaTutorial'))return;
    if(!force){try{if(localStorage.getItem(KEY)==='1')return}catch(e){}}
    const o=document.createElement('div');o.className='asha-tutorial';o.id='ashaTutorial';o.innerHTML=`<div class="asha-tut-stars"></div><div class="asha-tut-card"><div class="asha-tut-progress" id="ashaTutProgress"></div><div class="asha-tut-top"><div class="asha-tut-brand">ASHA • QUICK TOUR</div><button class="asha-tut-skip" id="ashaTutSkip">Skip tutorial</button></div><div class="asha-tut-visual"><div class="asha-tut-orb" id="ashaTutIcon">🪷</div></div><div class="asha-tut-copy" id="ashaTutCopy"><span class="asha-tut-eye" id="ashaTutEye"></span><h2 id="ashaTutTitle"></h2><p id="ashaTutText"></p><div class="asha-tut-chips" id="ashaTutChips"></div></div><div class="asha-tut-bottom"><div class="asha-tut-dots" id="ashaTutDots"></div><div class="asha-tut-actions"><button class="asha-tut-btn asha-tut-back" id="ashaTutBack">← Back</button><button class="asha-tut-btn asha-tut-next" id="ashaTutNext">Next →</button></div></div></div>`;document.body.appendChild(o);
    q('#ashaTutSkip').onclick=done;q('#ashaTutBack').onclick=()=>{if(i>0){i--;render()}};q('#ashaTutNext').onclick=()=>{if(i<steps.length-1){i++;render()}else done()};
    let sx=0;o.addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX},{passive:true});o.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>55){if(dx<0&&i<steps.length-1){i++;render()}else if(dx>0&&i>0){i--;render()}}},{passive:true});
    i=0;render();
  }
  window.ashaReplayTutorial=()=>show(true);

  function addReplay(){
    const settings=q('#profile .settings-card');if(!settings||q('#ashaTutorialReplay'))return;
    const row=document.createElement('button');row.id='ashaTutorialReplay';row.className='setting-row tutorial-replay';row.onclick=()=>show(true);row.innerHTML='<span class="setting-icon blue">🎓</span><span><b>App Tutorial</b><small>Replay the ASHA feature tour</small></span><strong>›</strong>';settings.appendChild(row);
  }
  window.addEventListener('asha-signup-complete',()=>setTimeout(()=>show(false),500));
  window.addEventListener('asha-profile-updated',()=>setTimeout(addReplay,250));
  setTimeout(()=>{addReplay();let onboarded=false;try{onboarded=localStorage.getItem('ashaOnboardedV1')==='1'}catch(e){}if(onboarded)show(false)},500);
})();