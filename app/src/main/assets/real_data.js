(()=>{
  if(window.__ashaRealData)return;window.__ashaRealData=true;
  const HISTORY='ashaHistoryV1';
  const readHistory=()=>{try{return JSON.parse(localStorage.getItem(HISTORY)||'[]')}catch(e){return []}};
  const saveHistory=h=>{try{localStorage.setItem(HISTORY,JSON.stringify(h.slice(-30)))}catch(e){}};
  const sleepMetric=document.querySelector('#sleepMetric');
  const sleepTrend=document.querySelector('#sleepTrend');
  const sleepCard=sleepMetric?.closest('.card.metric');
  if(sleepCard){sleepCard.style.cursor='pointer';sleepCard.setAttribute('role','button');sleepCard.setAttribute('aria-label','Connect or refresh sleep data');sleepCard.onclick=()=>window.requestSleepAccess?.()}

  function setSleep(status,hours,message){
    if(!sleepMetric||!sleepTrend)return;
    sleepCard?.classList.remove('health-ok');
    if(status==='ok'){
      sleepMetric.textContent=Number(hours).toFixed(1)+' h';
      sleepTrend.textContent='Health Connect • latest';
      sleepTrend.className='good';
      sleepCard?.classList.add('health-ok');
    }else if(status==='permission_required'){
      sleepMetric.textContent='—';sleepTrend.textContent='Tap to connect';sleepTrend.className='up';
    }else if(status==='no_data'){
      sleepMetric.textContent='No data';sleepTrend.textContent='No sleep record found';sleepTrend.className='up';
    }else if(status==='unsupported'){
      sleepMetric.textContent='Unavailable';sleepTrend.textContent='Health Connect unavailable';sleepTrend.className='up';
    }else{
      sleepMetric.textContent='—';sleepTrend.textContent=message||'Health data error';sleepTrend.className='up';
    }
    if(message)sleepCard?.setAttribute('title',message);
  }
  window.setNativeSleepData=(status,hours,message)=>{setSleep(status,hours,message);if(message&&status!=='ok')toast(message)};
  window.requestSleepAccess=()=>{
    if(window.AndroidBridge?.requestSleepAccess){toast('Opening Health Connect…');AndroidBridge.requestSleepAccess()}
    else{setSleep('unsupported',0,'Health Connect is available only in the Android app.');toast('Health Connect is available in the Android app')}
  };

  function clearSeedDataIfNeeded(){
    let last=null;try{last=JSON.parse(localStorage.getItem('ashaLast')||'null')}catch(e){}
    if(!last){
      const score=document.querySelector('#homeScore');if(score)score.textContent='—';
      const summary=document.querySelector('#summary');if(summary)summary.textContent='No check-in yet. Start your first check-in to build your personal trend.';
      const stress=document.querySelector('#stressMetric');if(stress)stress.textContent='Not checked';
      const social=document.querySelector('#socialMetric');if(social)social.textContent='Not checked';
      const sig=document.querySelector('#sig');if(sig)sig.textContent='Waiting';
      setSleep(window.AndroidBridge?'permission_required':'unsupported',0,window.AndroidBridge?'Tap the sleep card to connect Health Connect.':'Health data is available in the Android app.');
    }
  }

  function renderTrajectory(){
    const h=readHistory();const svg=document.querySelector('#home .trend svg');if(!svg)return;
    const line=svg.querySelector('.line'),fill=svg.querySelector('path[fill="url(#fill)"]'),dot=svg.querySelector('.sparkdot');
    let empty=svg.parentElement.querySelector('.real-empty');
    if(h.length===0){if(line)line.style.opacity='0';if(fill)fill.style.opacity='0';if(dot)dot.style.opacity='0';if(!empty){empty=document.createElement('div');empty.className='real-empty';empty.style.cssText='position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:24px;color:#8f93a6;font-size:11px;line-height:1.5';empty.textContent='Your trajectory will appear after your first check-ins.';svg.parentElement.style.position='relative';svg.parentElement.appendChild(empty)}return}
    empty?.remove();if(line)line.style.opacity='1';if(fill)fill.style.opacity='1';if(dot)dot.style.opacity='1';
    const pts=h.slice(-10).map((r,i,a)=>{const x=a.length===1?170:8+i*(324/(a.length-1));const y=115-Math.max(0,Math.min(100,r.score))*0.92;return [x,y]});
    if(pts.length===1)pts.unshift([pts[0][0]-25,pts[0][1]]);
    const d='M '+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L ');
    if(line)line.setAttribute('d',d);
    if(fill){fill.setAttribute('d',d+' L '+pts[pts.length-1][0].toFixed(1)+' 124 L '+pts[0][0].toFixed(1)+' 124 Z')}
    const last=pts[pts.length-1];if(dot){dot.setAttribute('cx',last[0]);dot.setAttribute('cy',last[1])}
  }

  const originalAnalyse=window.analyse;
  if(typeof originalAnalyse==='function')window.analyse=function(){
    const before=Date.now();originalAnalyse.apply(this,arguments);
    try{
      const last=JSON.parse(localStorage.getItem('ashaLast')||'null');
      if(last){const h=readHistory();const prev=h[h.length-1];if(!prev||Math.abs((prev.ts||0)-before)>1500){h.push({ts:last.ts||Date.now(),score:last.score,mood:last.mood,sleep:last.sleep,social:last.social});saveHistory(h)}window.dispatchEvent(new CustomEvent('asha-checkin-saved',{detail:last}));renderTrajectory()}
    }catch(e){}
  };

  clearSeedDataIfNeeded();renderTrajectory();
  if(window.AndroidBridge?.refreshSleepData){setTimeout(()=>{try{AndroidBridge.refreshSleepData()}catch(e){}},500)}
})();