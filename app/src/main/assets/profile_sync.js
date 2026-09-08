(()=>{
  if(window.__ashaProfileSyncLoaded)return;window.__ashaProfileSyncLoaded=true;
  const PROFILE='ashaSignupProfile',PREFS='ashaPrefs';
  const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const langCodes={English:'EN',Hindi:'HI',Telugu:'TE',Tamil:'TA',Kannada:'KN',Malayalam:'ML',Bengali:'BN',Marathi:'MR'};
  const ageFromDob=dob=>{if(!dob)return null;const d=new Date(dob),n=new Date();let a=n.getFullYear()-d.getFullYear();const m=n.getMonth()-d.getMonth();if(m<0||(m===0&&n.getDate()<d.getDate()))a--;return a>=0?a:null};
  function rebrand(root=document.body){document.title='SAHAAY AI — Wellbeing Companion';if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{if(n.parentElement&&!['SCRIPT','STYLE','TEXTAREA'].includes(n.parentElement.tagName)&&/ASHA/g.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/ASHA/g,'SAHAAY AI')});qa('.brand').forEach(x=>x.textContent='SAHAAY AI')}
  window.saahayRebrand=rebrand;
  function profile(){const p=read(PROFILE,null);if(!p)return null;if(!p.id){p.id='S-'+String(Math.floor(1000+Math.random()*9000));write(PROFILE,p)}return p}
  function setText(el,text){if(el)el.textContent=text}
  function ensureToggle(){
    const p=profile(),root=q('#profile');if(!p||!root)return;
    let row=q('#saahayAnonToggleRow');
    if(!row){
      row=document.createElement('div');row.id='saahayAnonToggleRow';row.className='setting-row';row.innerHTML='<span class="setting-icon purple">🕶️</span><span><b>Anonymous Mode</b><small>Hide your identity across SAHAAY without deleting your saved local profile.</small></span><label style="margin-left:auto;position:relative;width:48px;height:28px;display:inline-block"><input id="saahayAnonToggle" type="checkbox" style="opacity:0;width:0;height:0"><span id="saahayAnonTrack" style="position:absolute;inset:0;border-radius:999px;background:#d8dbe8;transition:.2s"></span><span id="saahayAnonKnob" style="position:absolute;width:22px;height:22px;left:3px;top:3px;border-radius:50%;background:#fff;box-shadow:0 2px 8px #0002;transition:.2s"></span></label>';
      const privacy=q('#profile .privacy-note');if(privacy)privacy.insertAdjacentElement('beforebegin',row);else root.appendChild(row);
      const toggle=row.querySelector('#saahayAnonToggle');toggle.onchange=()=>{const cur=profile();if(!cur)return;cur.anonymous=toggle.checked;cur.updatedAt=Date.now();write(PROFILE,cur);const prefs=read(PREFS,{});prefs.anonymous=cur.anonymous;write(PREFS,prefs);apply();try{window.dispatchEvent(new Event('asha-profile-updated'))}catch(e){}};
    }
    const toggle=row.querySelector('#saahayAnonToggle'),track=row.querySelector('#saahayAnonTrack'),knob=row.querySelector('#saahayAnonKnob');toggle.checked=!!p.anonymous;track.style.background=p.anonymous?'#7357f4':'#d8dbe8';knob.style.transform=p.anonymous?'translateX(20px)':'translateX(0)';
  }
  function apply(){
    rebrand();const p=profile();if(!p)return;const anonymous=!!p.anonymous;const prefs=read(PREFS,{});prefs.profileName=anonymous?'Anonymous':(p.name||'SAHAAY User');prefs.language=p.language||'English';prefs.anonymous=anonymous;write(PREFS,prefs);
    const shownName=anonymous?'Anonymous User':(p.name||'SAHAAY User'),initial=anonymous?'A':((shownName.trim().charAt(0)||'S').toUpperCase());
    setText(q('#profileName'),shownName);setText(q('#profileAvatar'),initial);setText(q('#homeAvatar'),initial);setText(q('#profileSub'),(anonymous?'ANONYMOUS MODE • ':'SAHAAY ID • ')+p.id);
    const eyebrow=q('#profile .profile-main .eyebrow');setText(eyebrow,anonymous?'ANONYMOUS LOCAL PROFILE':'LOCAL PROFILE');const langBadge=q('#profile .profile-badges span:first-child');setText(langBadge,'🌐 '+(p.language||'English'));
    const langIcon=qa('#profile .setting-icon').find(x=>x.textContent.includes('🌐'));const langRow=langIcon?.closest('.setting-row');if(langRow){setText(langRow.querySelector('small'),(p.language||'English')+' • saved locally');setText(langRow.querySelector('strong'),langCodes[p.language]||'EN')}
    if(langRow&&!q('#profileAgeRow')){const age=document.createElement('div');age.id='profileAgeRow';age.className='setting-row static';age.innerHTML='<span class="setting-icon purple">👤</span><span><b>Age</b><small></small></span><strong>✓</strong>';langRow.insertAdjacentElement('afterend',age)}
    const ageRow=q('#profileAgeRow');if(ageRow){setText(ageRow.querySelector('b'),anonymous?'Identity':'Age');setText(ageRow.querySelector('small'),anonymous?'Hidden while Anonymous Mode is on':((ageFromDob(p.dob)??'Not provided')+(ageFromDob(p.dob)!==null?' years':'')))}
    if(ageRow&&!q('#profileReasonRow')){const r=document.createElement('div');r.id='profileReasonRow';r.className='setting-row static';r.innerHTML='<span class="setting-icon purple">✨</span><span><b>Primary goal</b><small></small></span><strong>✓</strong>';ageRow.insertAdjacentElement('afterend',r)}
    const reasonRow=q('#profileReasonRow');if(reasonRow)setText(reasonRow.querySelector('small'),p.reason||'Exploring SAHAAY AI');const now=new Date().getHours(),hello=now<12?'Good morning':now<17?'Good afternoon':'Good evening';setText(q('#greet'),anonymous?hello+', Anonymous':hello+', '+shownName.split(/\s+/)[0]);
    const note=q('#profile .privacy-note');if(note)note.innerHTML=anonymous?'🕶️ <b>Anonymous Mode is active.</b> Your name, email and date of birth are hidden throughout the interface. Your saved local profile remains available when you switch Anonymous Mode off.':'🔐 <b>Tell Once privacy.</b> Your profile, preferences and check-in context stay on this device in this prototype.';
    document.documentElement.dataset.saahayAnonymous=anonymous?'1':'0';ensureToggle();
  }
  window.ashaApplyLocalProfile=apply;const oldGo=window.go;if(typeof oldGo==='function')window.go=function(id,btn){const r=oldGo(id,btn);setTimeout(apply,0);return r};window.addEventListener('asha-profile-updated',()=>setTimeout(apply,0));setTimeout(apply,0);
})();