(()=>{
  if(window.__ashaProfileSyncLoaded)return;window.__ashaProfileSyncLoaded=true;
  const PROFILE='ashaSignupProfile', PREFS='ashaPrefs';
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||fallback}catch(e){return fallback}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const langCodes={English:'EN',Hindi:'HI',Telugu:'TE',Tamil:'TA',Bengali:'BN',Marathi:'MR'};
  const ageLabels={under18:'Under 18','18-24':'18–24','25-39':'25–39',40plus:'40+','prefer-not':'Prefer not to say'};

  function profile(){
    const p=read(PROFILE,null); if(!p)return null;
    if(!p.id){p.id='A-'+String(Math.floor(1000+Math.random()*9000));write(PROFILE,p)}
    return p;
  }
  function setText(el,text){if(el)el.textContent=text}
  function apply(){
    const p=profile(); if(!p)return;
    const prefs=read(PREFS,{});
    prefs.profileName=p.name||prefs.profileName||'ASHA User';
    if(typeof prefs.anonymous!=='boolean')prefs.anonymous=!!p.anonymous;
    write(PREFS,prefs);
    const anon=!!prefs.anonymous;
    const realName=p.name||'ASHA User';
    const shownName=anon?'Anonymous User':realName;
    const initial=anon?'🕶️':(realName.trim().charAt(0)||'A').toUpperCase();

    setText(q('#profileName'),shownName);
    setText(q('#profileAvatar'),initial);
    setText(q('#homeAvatar'),anon?'◉':initial);
    setText(q('#profileSub'),anon?'No identity attached • local mode':'ASHA ID • '+p.id);
    const eyebrow=q('#profile .profile-main .eyebrow'); setText(eyebrow,'LOCAL PROFILE');
    const langBadge=q('#profile .profile-badges span:first-child');setText(langBadge,'🌐 '+(p.language||'English'));

    const langIcon=qa('#profile .setting-icon').find(x=>x.textContent.includes('🌐'));
    const langRow=langIcon?.closest('.setting-row');
    if(langRow){setText(langRow.querySelector('small'),(p.language||'English')+' • saved locally');setText(langRow.querySelector('strong'),langCodes[p.language]||'EN')}

    if(langRow && !q('#profileAgeRow')){
      const age=document.createElement('div');age.id='profileAgeRow';age.className='setting-row static';
      age.innerHTML='<span class="setting-icon purple">👤</span><span><b>Age group</b><small></small></span><strong>✓</strong>';
      langRow.insertAdjacentElement('afterend',age);
    }
    const ageRow=q('#profileAgeRow');if(ageRow)setText(ageRow.querySelector('small'),ageLabels[p.ageGroup]||'Prefer not to say');

    const badge=q('#profilePrivacyBadge');setText(badge,anon?'🕶️ Anonymous mode':'🔒 Identified mode');
    setText(q('#profileAnonStatus'),anon?'On • identity hidden':'Off • profile visible');

    const now=new Date().getHours();const hello=now<12?'Good morning':now<17?'Good afternoon':'Good evening';
    setText(q('#greet'),anon?hello:hello+', '+realName.split(/\s+/)[0]);

    const section=qa('#profile .section').find(x=>x.querySelector('h3')?.textContent.trim()==='Support circle');
    if(section)setText(section.querySelector('small'),'optional connections');
    const people=qa('#profile .support-person');
    if(people[0]){
      setText(people[0].querySelector('.support-avatar'),'C');
      setText(people[0].querySelector('b'),'Counsellor not connected');
      setText(people[0].querySelector('small'),'Optional • connect only with consent');
      const dot=people[0].querySelector('.online-dot');if(dot)dot.style.display='none';
    }
    if(people[1]){
      setText(people[1].querySelector('.support-avatar'),'T');
      setText(people[1].querySelector('b'),'Trusted contact');
      setText(people[1].querySelector('small'),anon?'Not linked while anonymous':'Not added yet • you choose who to contact');
    }

    const note=q('#profile .privacy-note');
    if(note)note.innerHTML='🔐 <b>Your local profile.</b> Name, language, preferences, check-ins and rewards stay on this device in the current prototype.';
  }

  window.ashaApplyLocalProfile=apply;

  const oldGo=window.go;
  if(typeof oldGo==='function')window.go=function(id,btn){const r=oldGo(id,btn);setTimeout(apply,0);return r};

  const oldToggle=window.toggleAnonymous;
  if(typeof oldToggle==='function')window.toggleAnonymous=function(on){
    const r=oldToggle(on);
    const p=profile();const prefs=read(PREFS,{});if(p){prefs.profileName=p.name||'ASHA User';prefs.anonymous=!!on;write(PREFS,prefs)}
    setTimeout(apply,0);return r;
  };

  window.addEventListener('asha-profile-updated',()=>setTimeout(apply,0));
  setTimeout(apply,0);
})();
