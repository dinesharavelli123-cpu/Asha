(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prompts=[
['What’s taking up the most space in your mind right now?','Start anywhere — one sentence is enough.'],
['What happened just before you started feeling this way?','Notice the situation, not just the emotion.'],
['Which feeling fits best right now?','Stressed, worried, frustrated, sad, tired, confused, calm, hopeful — or your own word.'],
['How strong does that feeling feel right now?','Choose gently; there is no correct answer.'],
['What thought keeps coming back?','Write the thought exactly as it shows up.'],
['What part of this is actually in your control today?','Even a very small part counts.'],
['What part is outside your control?','You do not have to solve everything at once.'],
['What does your body seem to need right now?','Maybe rest, movement, water, food, quiet, fresh air or slower breathing.'],
['What would make the next 10 minutes a little easier?','Pick something small and realistic.'],
['Is there one task you can make smaller?','Try turning it into the tiniest possible first step.'],
['Who is someone safe you could talk to if you want support?','A trusted adult, family member, teacher, counsellor or friend can count.'],
['What has helped you get through a similar stressful moment before?','Look for something that helped even a little.'],
['What is one kind thing you can say to yourself right now?','Use the same tone you would use with someone you care about.'],
['What can wait until later?','Give yourself permission to postpone something non-urgent.'],
['What do you want to carry forward from this check-in?','A next step, reminder, boundary or helpful thought.']
];
function suggestions(text){
 const t=text.toLowerCase();
 let a=[];
 if(/stress|overwhelm|pressure|exam|study|assignment|work|deadline/.test(t))a=[['◌','60-second reset','Slow down for one minute and let your attention settle.','calm'],['✦','Make it smaller','Choose only the next tiny task, not the whole problem.',null],['54321','Ground yourself','Use the visual grounding activity to reconnect with the present.','grounding'],['♡','Talk to someone','Consider telling a trusted person what is making today difficult.','shield']];
 else if(/sleep|tired|exhaust|night/.test(t))a=[['☾','Wind down','Lower stimulation and use your Sleep Companion.','sleep'],['◌','Quiet minute','Try one comfortable minute of slower breathing.','calm'],['✎','Park tomorrow’s thoughts','Write the first thing you want to handle tomorrow.',null]];
 else if(/angry|frustrat|annoy|fight|argument/.test(t))a=[['◌','Create a pause','Take a short reset before deciding what to say or do.','calm'],['✎','Name the need','Write what you wish had happened differently.',null],['♡','Choose support','Talk with a safe person if you want another perspective.','shield']];
 else if(/lonely|alone|left out|friend/.test(t))a=[['♡','Reach toward connection','Consider messaging or speaking to one safe person.','shield'],['✦','Choose a gentle activity','Do something familiar that helps you feel settled.',null],['✎','Name what you need','Write what support would feel useful right now.',null]];
 else a=[['◌','Take a calm minute','Give yourself a short reset before your next step.','calm'],['✦','Pick one next step','Choose something small enough to do in a few minutes.',null],['54321','Come back to the present','Try the visual grounding activity.','grounding']];
 return a;
}
function mount(){
 const area=$('journalText'); if(!area||area.dataset.coached)return;
 area.dataset.coached='1';
 const hero=area.previousElementSibling;
 if(hero){const p=hero.querySelector('p');if(p)p.textContent='A guided reflection that turns what you write into gentle next steps.'}
 area.placeholder='Write freely here… e.g. “I’m stressed about tomorrow’s presentation.”';
 const wrap=document.createElement('div'); wrap.className='journal-coach';
 wrap.innerHTML=`<div class="journal-start"><p class="coach-kicker">GUIDED CHECK-IN</p><h3>Want help sorting out what’s on your mind?</h3><p>Answer as many as you want. You can skip any question.</p><button id="startJournalGuide" class="secondary-action">START 15 QUESTIONS</button></div><div id="journalGuide" class="hidden"></div><div id="journalSuggestions" class="hidden"></div>`;
 area.parentNode.insertBefore(wrap,area);
 const save=$('saveJournal'); if(save)save.textContent='SAVE REFLECTION';
 $('startJournalGuide').onclick=()=>startGuide();
}
function startGuide(){let i=0,answers=[];const box=$('journalGuide');box.classList.remove('hidden');box.previousElementSibling.classList.add('hidden');
 const draw=()=>{if(i>=prompts.length){finish();return}const [q,h]=prompts[i];box.innerHTML=`<div class="coach-progress"><span style="width:${((i+1)/prompts.length)*100}%"></span></div><div class="coach-count">QUESTION ${i+1} OF ${prompts.length}</div><h3>${q}</h3><p>${h}</p>${i===3?`<div class="feeling-scale">${[1,2,3,4,5].map(n=>`<button data-scale="${n}">${n}</button>`).join('')}</div>`:`<textarea id="coachAnswer" placeholder="Type what comes to mind…"></textarea>`}<div class="coach-actions"><button id="coachSkip">SKIP</button><button id="coachNext">${i===prompts.length-1?'FINISH':'NEXT'}</button></div>`;
 const scale=[...box.querySelectorAll('[data-scale]')];scale.forEach(b=>b.onclick=()=>{scale.forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});
 $('coachSkip').onclick=()=>{answers.push('');i++;draw()};$('coachNext').onclick=()=>{const a=$('coachAnswer');answers.push(a?a.value.trim():(box.querySelector('[data-scale].selected')?.dataset.scale||''));i++;draw()};};
 const finish=()=>{box.innerHTML=`<div class="coach-complete"><span>✦</span><h3>Check-in complete</h3><p>You took a moment to understand what is going on. Here are a few gentle options for what to do next.</p></div>`;const combined=answers.join(' ')+' '+($('journalText')?.value||'');showSuggestions(combined);const area=$('journalText');if(area&&!area.value.trim()){area.value=answers.map((a,j)=>a?`${j+1}. ${prompts[j][0]}\n${a}`:'').filter(Boolean).join('\n\n')}};draw();}
function showSuggestions(text){const el=$('journalSuggestions');if(!el)return;const a=suggestions(text);el.classList.remove('hidden');el.innerHTML=`<div class="suggest-head"><p class="coach-kicker">SAHAAY SUGGESTS</p><h3>Try one of these next</h3><p>Based on the words in this reflection — not a diagnosis.</p></div><div class="suggest-grid">${a.map(x=>`<button ${x[3]?`data-open="${x[3]}"`:''}><span>${x[0]}</span><div><b>${x[1]}</b><small>${x[2]}</small></div><i>›</i></button>`).join('')}</div><div class="more-questions"><b>More questions you could explore</b><button data-fill="What am I most worried might happen — and what evidence do I actually have?">What am I predicting?</button><button data-fill="If my friend felt this way, what would I tell them?">What would I tell a friend?</button><button data-fill="What is one thing I can do today and one thing I can leave for tomorrow?">Today vs tomorrow?</button></div>`;el.querySelectorAll('[data-fill]').forEach(b=>b.onclick=()=>{const area=$('journalText');area.value+=(area.value?'\n\n':'')+b.dataset.fill+'\n';area.focus()});el.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{if(window.SAHAAYOpenModule)window.SAHAAYOpenModule(b.dataset.open)});}
function watch(){const m=$('moduleContent');if(!m)return;new MutationObserver(()=>{if($('journalText'))setTimeout(mount,0)}).observe(m,{childList:true,subtree:true});if($('journalText'))mount()}
window.addEventListener('DOMContentLoaded',watch);
})();