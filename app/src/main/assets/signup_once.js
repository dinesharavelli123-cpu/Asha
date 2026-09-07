(()=>{
  if(window.__ashaSignupLoaded)return;window.__ashaSignupLoaded=true;
  const FLAG='ashaOnboardedV1';
  const PROFILE='ashaSignupProfile';
  const readPrefs=()=>{try{return JSON.parse(localStorage.getItem('ashaPrefs')||'{}')}catch(e){return {}}};
  const savePrefs=p=>{try{localStorage.setItem('ashaPrefs',JSON.stringify(p))}catch(e){}};
  const readProfile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE)||'null')}catch(e){return null}};
  const saveProfile=p=>{try{localStorage.setItem(PROFILE,JSON.stringify(p))}catch(e){}};

  const applyExisting=()=>{
    const p=readProfile();if(!p)return;
    if(!p.id){p.id='A-'+String(Math.floor(1000+Math.random()*9000));saveProfile(p)}
    const prefs=readPrefs();
    prefs.profileName=p.name||prefs.profileName||'ASHA User';
    if(typeof prefs.anonymous!=='boolean')prefs.anonymous=!!p.anonymous;
    savePrefs(prefs);
    try{window.ashaApplyLocalProfile?.()}catch(e){}
  };
  window.ashaApplySignupProfile=applyExisting;
  if(localStorage.getItem(FLAG)==='1'){applyExisting();return;}

  const style=document.createElement('style');
  style.textContent=`
  .asha-signup{position:fixed;z-index:9999;inset:0;background:radial-gradient(circle at 18% 12%,#6d5df455,transparent 28%),radial-gradient(circle at 82% 82%,#48d7bd38,transparent 30%),linear-gradient(160deg,#090f29,#151842 58%,#35286e);display:grid;place-items:center;padding:18px;color:#fff;overflow:auto}.asha-signup-card{width:min(100%,430px);border:1px solid #ffffff24;background:#111634e8;backdrop-filter:blur(24px);border-radius:30px;padding:22px;box-shadow:0 30px 90px #0008;animation:ashaSignIn .55s cubic-bezier(.2,.8,.2,1)}@keyframes ashaSignIn{from{opacity:0;transform:translateY(28px) scale(.96)}to{opacity:1;transform:none}}.asha-signup-logo{width:62px;height:62px;border-radius:22px;background:linear-gradient(145deg,#7357f4,#4fd8c3);display:grid;place-items:center;font-size:27px;font-weight:950;box-shadow:0 15px 34px #7357f44a;animation:ashaSignFloat 3.5s ease-in-out infinite}@keyframes ashaSignFloat{50%{transform:translateY(-5px) rotate(2deg)}}.asha-signup-card h1{font-size:27px;margin:14px 0 5px}.asha-signup-card>p{font-size:11px;line-height:1.55;color:#c6c9dc;margin:0 0 17px}.asha-field{margin:11px 0}.asha-field label{display:block;font-size:10px;font-weight:850;letter-spacing:.05em;color:#cfd2e7;margin:0 0 6px}.asha-field input,.asha-field select{width:100%;border:1px solid #ffffff1f;background:#ffffff0d;color:#fff;border-radius:15px;padding:13px 14px;outline:none;font:inherit}.asha-field select option{color:#111}.asha-field input:focus,.asha-field select:focus{border-color:#8c78ff;box-shadow:0 0 0 4px #7357f422}.asha-anon{display:flex;gap:11px;align-items:center;margin:14px 0;padding:12px;border-radius:17px;background:#ffffff0a;border:1px solid #ffffff16}.asha-anon input{width:19px;height:19px;accent-color:#7357f4}.asha-anon b{display:block;font-size:12px}.asha-anon small{display:block;color:#b7bbcf;font-size:9px;margin-top:3px;line-height:1.4}.asha-local-note{font-size:9.5px;line-height:1.5;color:#b9bed2;background:#ffffff08;border:1px solid #ffffff12;border-radius:15px;padding:11px;margin:12px 0}.asha-sign-btn{width:100%;border:0;border-radius:16px;padding:14px;background:linear-gradient(135deg,#7357f4,#4fd8c3);color:#fff;font-weight:900;font-size:13px;box-shadow:0 13px 30px #5d53df46}.asha-sign-btn:active{transform:scale(.985)}.asha-sign-error{min-height:15px;font-size:10px;color:#ff9ca6;margin-top:7px}
  `;
  document.head.appendChild(style);

  const wrap=document.createElement('div'); wrap.className='asha-signup'; wrap.id='ashaSignupOnce';
  wrap.innerHTML=`<div class="asha-signup-card"><div class="asha-signup-logo">A</div><h1>Welcome to ASHA</h1><p>Create your local profile once. After this, ASHA remembers you on this device and opens directly without asking again.</p><div class="asha-field"><label>NAME OR NICKNAME</label><input id="ashaSignupName" maxlength="40" placeholder="What should ASHA call you?" autocomplete="name"></div><div class="asha-field"><label>PREFERRED LANGUAGE</label><select id="ashaSignupLang"><option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option><option>Bengali</option><option>Marathi</option></select></div><div class="asha-field"><label>AGE GROUP</label><select id="ashaSignupAge"><option value="under18">Under 18</option><option value="18-24">18–24</option><option value="25-39">25–39</option><option value="40plus">40+</option><option value="prefer-not">Prefer not to say</option></select></div><label class="asha-anon"><input id="ashaSignupAnon" type="checkbox"><span><b>Start in Anonymous Mode</b><small>Your chosen name stays on this device, while the interface can display “Anonymous User”.</small></span></label><div class="asha-local-note">🔒 This prototype stores your profile and app history locally on this device. It is not sent to GitHub or a cloud database.</div><button class="asha-sign-btn" id="ashaSignupContinue">Continue to ASHA ✨</button><div class="asha-sign-error" id="ashaSignupError"></div></div>`;
  document.body.appendChild(wrap);

  const finish=()=>{
    const name=document.querySelector('#ashaSignupName').value.trim();
    const anonymous=document.querySelector('#ashaSignupAnon').checked;
    if(!name && !anonymous){document.querySelector('#ashaSignupError').textContent='Please enter a name/nickname, or choose Anonymous Mode.';return;}
    const profile={
      id:'A-'+String(Math.floor(1000+Math.random()*9000)),
      name:name||'ASHA User',
      language:document.querySelector('#ashaSignupLang').value,
      ageGroup:document.querySelector('#ashaSignupAge').value,
      anonymous,
      createdAt:Date.now()
    };
    saveProfile(profile);
    try{localStorage.setItem(FLAG,'1')}catch(e){}
    const prefs=readPrefs();prefs.profileName=profile.name;prefs.anonymous=anonymous;savePrefs(prefs);
    wrap.style.transition='opacity .28s ease,transform .28s ease';wrap.style.opacity='0';wrap.style.transform='scale(1.02)';
    setTimeout(()=>{
      wrap.remove();
      try{window.dispatchEvent(new Event('asha-signup-complete'));window.dispatchEvent(new Event('asha-profile-updated'))}catch(e){}
    },280);
  };
  document.querySelector('#ashaSignupContinue').onclick=finish;
  document.querySelector('#ashaSignupName').addEventListener('keydown',e=>{if(e.key==='Enter')finish()});
})();
