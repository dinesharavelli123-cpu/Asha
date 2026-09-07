(()=>{
  if(window.__ashaSleepCalm)return;window.__ashaSleepCalm=true;

  const SOUNDS={
    white:{id:'pKAvj-D8naU',title:'Soft White Noise'},
    rain:{id:'hMOpBpryE7o',title:'Peaceful Rain'},
    ocean:{id:'JekUNGo-RVk',title:'Ocean Waves'}
  };

  const style=document.createElement('style');
  style.textContent=`
    #sleep .sleep-hero{overflow:hidden;position:relative;color:#fff;border-radius:30px;padding:22px;background:linear-gradient(145deg,#08112e,#182454 62%,#3b2a77);box-shadow:0 24px 54px #1917472d;margin-bottom:14px}
    #sleep .sleep-hero:before,#sleep .sleep-hero:after{content:"";position:absolute;border-radius:50%;filter:blur(4px);opacity:.5;animation:sleepFloat 7s ease-in-out infinite}
    #sleep .sleep-hero:before{width:150px;height:150px;background:#7757f4;right:-75px;top:-80px}#sleep .sleep-hero:after{width:120px;height:120px;background:#38d7c5;left:-55px;bottom:-70px;animation-delay:-3s}
    @keyframes sleepFloat{50%{transform:translate(12px,12px) scale(1.14)}}
    #sleep .sleep-hero h2{font-size:29px;line-height:1.05;margin:7px 0 8px;max-width:280px}#sleep .sleep-hero p{font-size:12px;line-height:1.6;opacity:.78;margin:0}
    #sleep .sleep-data{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}#sleep .sleep-value{font-size:34px;font-weight:900;line-height:1;margin:7px 0 5px}#sleep .sleep-status{font-size:11px;color:var(--mut);line-height:1.45}
    #sleep .hc-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border-radius:999px;background:#eefaf7;color:#15946d;font-size:9px;font-weight:850;letter-spacing:.04em}
    #sleep .connect-btn{border:0;border-radius:16px;padding:12px 14px;background:#f0edff;color:#6045d8;font-size:11px;font-weight:850}
    #sleep .sound-card{padding:14px}#sleep .sound-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:11px}#sleep .sound-head b{font-size:16px}#sleep .sound-head small{display:block;color:var(--mut);font-size:10px;margin-top:3px}
    #sleep .sound-tabs{display:flex;gap:7px;overflow:auto;padding-bottom:4px;scrollbar-width:none}#sleep .sound-tabs::-webkit-scrollbar{display:none}.sound-chip{flex:0 0 auto;border:1px solid var(--line);background:#fff;padding:10px 12px;border-radius:14px;font-size:11px;font-weight:800;color:var(--ink)}.sound-chip.sel{background:linear-gradient(135deg,#7257ee,#9b68f7);color:#fff;border-color:transparent;box-shadow:0 9px 20px #6c52df2e}
    #sleep .player-wrap{position:relative;overflow:hidden;border-radius:22px;margin-top:11px;background:#080d21;aspect-ratio:16/9;box-shadow:0 16px 34px #1215352a}#sleep iframe{width:100%;height:100%;border:0;display:block}
    #sleep .sleep-source{display:flex;justify-content:space-between;gap:9px;align-items:center;margin-top:10px;font-size:10px;color:var(--mut)}#sleep .sleep-source a{color:#6449df;font-weight:800;text-decoration:none}
    #sleep .timer-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.timer-chip{border:1px solid var(--line);background:#fff;border-radius:13px;padding:9px 12px;font-size:10px;font-weight:800;color:var(--ink)}.timer-chip.sel{background:#111839;color:#fff;border-color:#111839}
    #sleep .night-btn{width:100%;border:0;border-radius:18px;background:#101735;color:#fff;padding:14px;margin-top:10px;font-weight:850}
    #sleep.night{background:linear-gradient(180deg,#050817,#0b1027);color:#f7f8ff}#sleep.night .card{background:#111833e8;border-color:#ffffff10;color:#f7f8ff}#sleep.night .sleep-status,#sleep.night .sound-head small,#sleep.night .sleep-source{color:#aeb5d2}#sleep.night .head .back{background:#111833;color:#fff;border-color:#ffffff12}#sleep.night .head small{color:#aeb5d2}#sleep.night .sound-chip,#sleep.night .timer-chip{background:#141c3d;color:#e9ecff;border-color:#ffffff12}#sleep.night .sound-chip.sel{background:linear-gradient(135deg,#7257ee,#9b68f7)}#sleep.night .timer-chip.sel{background:#fff;color:#0b1026}
    #sleep .safe-note{font-size:10px;line-height:1.55;color:var(--mut);margin:12px 3px 0}
  `;
  document.head.appendChild(style);

  const screen=document.createElement('section');
  screen.id='sleep';screen.className='screen';
  screen.innerHTML=`
    <div class="head"><button class="back" onclick="go('home')">←</button><div><h2>Sleep & Calm</h2><small>real sleep data + relaxing audio</small></div></div>
    <div class="sleep-hero"><small style="font-weight:850;letter-spacing:.12em;color:#bfc5ff">WIND DOWN</small><h2>Give your mind a quieter ending to the day.</h2><p>Connect sleep data when you want, or play a calming sound while you rest.</p></div>

    <div class="card sleep-data">
      <div><span class="hc-badge">◉ HEALTH CONNECT</span><div class="sleep-value" id="sleepDataValue">—</div><div class="sleep-status" id="sleepDataStatus">Not connected</div></div>
      <button class="connect-btn" id="connectSleepBtn" onclick="window.requestSleepAccess?.()">Connect sleep data</button>
    </div>

    <div class="section"><h3>Sleep sounds</h3><small>streamed from YouTube</small></div>
    <div class="card sound-card">
      <div class="sound-head"><div><b id="soundTitle">Soft White Noise</b><small>Choose a sound, then tap play in the YouTube player.</small></div><span style="font-size:20px">🎧</span></div>
      <div class="sound-tabs">
        <button class="sound-chip sel" data-sound="white">☁️ White noise</button>
        <button class="sound-chip" data-sound="rain">🌧️ Rain</button>
        <button class="sound-chip" data-sound="ocean">🌊 Ocean</button>
      </div>
      <div class="player-wrap"><iframe id="sleepPlayer" title="ASHA sleep sound player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <div class="sleep-source"><span>Internet required • audio stays on YouTube</span><a id="soundSource" target="_blank" rel="noopener">Open in YouTube ↗</a></div>
      <div class="section" style="margin-top:16px"><h3>Sleep timer</h3><small id="timerStatus">Off</small></div>
      <div class="timer-row">
        <button class="timer-chip" data-min="15">15 min</button><button class="timer-chip" data-min="30">30 min</button><button class="timer-chip" data-min="60">60 min</button><button class="timer-chip sel" data-min="0">Off</button>
      </div>
      <button class="night-btn" id="nightBtn">🌙 Dim night mode</button>
      <p class="safe-note">Bluetooth earbuds/AirPods use your phone's normal audio route automatically. Keep the volume comfortable and low. YouTube playback may pause if Android or YouTube stops background playback.</p>
    </div>
  `;
  const check=document.querySelector('#check');
  if(check)check.parentNode.insertBefore(screen,check);else document.querySelector('.app')?.appendChild(screen);

  const sleepMetric=document.querySelector('#sleepMetric');
  const sleepCard=sleepMetric?.closest('.card.metric');
  if(sleepCard){sleepCard.style.cursor='pointer';sleepCard.onclick=()=>go('sleep');sleepCard.setAttribute('aria-label','Open Sleep and Calm');}

  let current='white', timer=null, timerEnds=0, countdown=null;
  try{const saved=localStorage.getItem('ashaSleepSound');if(SOUNDS[saved])current=saved}catch(e){}

  function setSound(key){
    if(!SOUNDS[key])return;current=key;const s=SOUNDS[key];
    try{localStorage.setItem('ashaSleepSound',key)}catch(e){}
    document.querySelectorAll('.sound-chip').forEach(b=>b.classList.toggle('sel',b.dataset.sound===key));
    const iframe=document.querySelector('#sleepPlayer');
    if(iframe)iframe.src=`https://www.youtube-nocookie.com/embed/${s.id}?playsinline=1&rel=0&modestbranding=1`;
    const title=document.querySelector('#soundTitle');if(title)title.textContent=s.title;
    const src=document.querySelector('#soundSource');if(src)src.href=`https://www.youtube.com/watch?v=${s.id}`;
  }
  document.querySelectorAll('.sound-chip').forEach(b=>b.addEventListener('click',()=>setSound(b.dataset.sound)));

  function stopTimer(){if(timer)clearTimeout(timer);if(countdown)clearInterval(countdown);timer=null;countdown=null;timerEnds=0;document.querySelector('#timerStatus').textContent='Off';document.querySelectorAll('.timer-chip').forEach(b=>b.classList.toggle('sel',b.dataset.min==='0'));}
  function setTimer(min){
    stopTimer();
    document.querySelectorAll('.timer-chip').forEach(b=>b.classList.toggle('sel',Number(b.dataset.min)===min));
    if(!min)return;
    timerEnds=Date.now()+min*60000;
    const tick=()=>{const left=Math.max(0,Math.ceil((timerEnds-Date.now())/60000));document.querySelector('#timerStatus').textContent=left?`${left} min left`:'Stopping…'};
    tick();countdown=setInterval(tick,30000);
    timer=setTimeout(()=>{const iframe=document.querySelector('#sleepPlayer');if(iframe)iframe.src='about:blank';stopTimer();toast('Sleep timer finished • audio stopped')},min*60000);
  }
  document.querySelectorAll('.timer-chip').forEach(b=>b.addEventListener('click',()=>setTimer(Number(b.dataset.min))));

  const nightBtn=document.querySelector('#nightBtn');
  nightBtn?.addEventListener('click',()=>{const on=screen.classList.toggle('night');nightBtn.textContent=on?'☀️ Leave night mode':'🌙 Dim night mode'});

  function updatePanel(status,hours,message){
    const v=document.querySelector('#sleepDataValue'),st=document.querySelector('#sleepDataStatus'),btn=document.querySelector('#connectSleepBtn');if(!v||!st)return;
    if(status==='ok'){v.textContent=Number(hours).toFixed(1)+' h';st.textContent='Latest sleep session from Health Connect';if(btn)btn.textContent='Refresh sleep data'}
    else if(status==='no_data'){v.textContent='No data';st.textContent='Connected, but no recent sleep record was found';if(btn)btn.textContent='Refresh'}
    else if(status==='unsupported'){v.textContent='Unavailable';st.textContent=message||'Health Connect is not available here';if(btn)btn.textContent='Android app only'}
    else if(status==='error'){v.textContent='—';st.textContent=message||'Could not read sleep data';if(btn)btn.textContent='Try again'}
    else{v.textContent='—';st.textContent='Tap Connect to choose Sleep access in Health Connect';if(btn)btn.textContent='Connect sleep data'}
  }

  const prior=window.setNativeSleepData;
  window.setNativeSleepData=(status,hours,message)=>{try{prior?.(status,hours,message)}catch(e){}updatePanel(status,hours,message)};
  updatePanel(window.AndroidBridge?'permission_required':'unsupported',0,window.AndroidBridge?'':'Health Connect is available in the Android app.');
  setSound(current);
})();
