document.addEventListener('click',function(e){
  var tb=e.target.closest('.tab');if(tb){document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===tb)});document.querySelectorAll('.pane').forEach(function(p){p.hidden=p.id!=='pane-'+tb.dataset.tab});}
  var b=e.target.closest('.copy');
  if(b){var text=document.getElementById(b.dataset.code).innerText;
    var orig=b.innerHTML;var done=function(){b.textContent=document.documentElement.lang==='en'?'Copied ✓':'اتنسخ ✓';b.classList.add('ok');setTimeout(function(){b.innerHTML=orig;b.classList.remove('ok')},1500)};
    var fb=function(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(_){}t.remove()};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,fb);else fb();}
  if(e.target.closest('#theme')){var d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(_){}
    }
});



(function(){var r=[].slice.call(document.querySelectorAll('.rv'));r.forEach(function(e,i){e.style.setProperty('--d',(i%4)*0.08+'s')});
if(!('IntersectionObserver' in window)){r.forEach(function(e){e.classList.add('in')});}else{var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});r.forEach(function(e){io.observe(e)});}
var h=document.querySelector('header');window.addEventListener('scroll',function(){h.classList.toggle('sc',scrollY>10)},{passive:true});
var f=document.getElementById('cform');if(f){f.addEventListener('submit',function(e){e.preventDefault();var n=f.name.value.trim(),m=f.message.value.trim();if(!n||!m){(n?f.message:f.name).focus();return}
var s=document.getElementById('sent');s.textContent=m;s.hidden=false;['ok','err'].forEach(function(i){document.getElementById(i).hidden=true});var b=f.querySelector('.send');b.disabled=true;
fetch('https://formsubmit.co/ajax/mobileappatoz@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:n,email:f.email.value,message:m,_subject:'رسالة جديدة من موقع Mobile App A to Z',_honey:f._honey.value})}).then(function(r){return r.json()}).then(function(j){if(j.success==='true'||j.success===true){document.getElementById('ok').hidden=false;f.message.value=''}else throw 0}).catch(function(){document.getElementById('err').hidden=false}).then(function(){b.disabled=false});});}
})();

/* progress + auth (Firebase when configured, otherwise this device only) */
(function(){
var KEY='progress_v1',done={},user=null,fs=null,cfg=window.FIREBASE_CONFIG;
try{(JSON.parse(localStorage.getItem(KEY)||'[]')).forEach(function(n){done[n]=1})}catch(_){}
function list(){return Object.keys(done).map(Number).sort(function(a,b){return a-b})}
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(list()))}catch(_){}}
function render(){
 document.querySelectorAll('.card[data-n]').forEach(function(c){c.classList.toggle('done',!!done[c.dataset.n])});
 document.querySelectorAll('.sl a').forEach(function(a){var m=a.getAttribute('href').match(/lesson-(\d+)/);if(m)a.classList.toggle('done',!!done[m[1]])});
 document.querySelectorAll('.donebtn').forEach(function(b){b.classList.toggle('on',!!done[b.dataset.n])});
 document.querySelectorAll('[data-ls]').forEach(function(el){var ids=el.dataset.ls.split(','),n=ids.filter(function(i){return done[i]}).length;
  var t=el.querySelector('.tpt,.mp')||el;if(el.classList.contains('mypr'))el.querySelector('.mp').textContent=n+'/'+ids.length;
  var tp=el.querySelector('.tpt');if(tp){tp.textContent=n+'/'+ids.length;el.querySelector('.tbar i').style.width=Math.round(100*n/ids.length)+'%'}});
}
function persist(){saveLocal();if(fs&&user){fs.set(fs.doc(fs.db,'users',user.uid),{done:list(),updated:Date.now()},{merge:true}).catch(function(){})}}
document.addEventListener('click',function(e){var b=e.target.closest('.donebtn');if(!b)return;var n=b.dataset.n;if(done[n])delete done[n];else done[n]=1;
 b.classList.add('pop');setTimeout(function(){b.classList.remove('pop')},500);persist();render();
 if(!user&&!window.__hint){window.__hint=1;if(cfg){setTimeout(function(){openM()},500)}}});
render();
/* modal */
var M=document.getElementById('amodal'),ab=document.getElementById('auth'),msg=document.getElementById('amsg');
function openM(){if(!M)return;M.hidden=false;if(!cfg){document.getElementById('aform').hidden=true;document.getElementById('alocal').hidden=false}}
function closeM(){if(M)M.hidden=true}
if(M){M.addEventListener('click',function(e){if(e.target===M||e.target.closest('.mx'))closeM()});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});}
function setMsg(t,err){msg.textContent=t;msg.className='amsg'+(err?' e':'')}
function ui(){if(!ab)return;ab.classList.toggle('in',!!user);var o=ab.querySelector('.au-out');o.innerHTML=user?((user.photoURL?'<img src="'+user.photoURL+'" alt="">':'')+'<span>خروج</span>'):''}
if(ab)ab.addEventListener('click',function(){if(user){window.__signOut&&window.__signOut()}else openM()});
ui();
if(!cfg)return;
/* Firebase */
var V='10.14.1',B='https://www.gstatic.com/firebasejs/'+V+'/';
Promise.all([import(B+'firebase-app.js'),import(B+'firebase-auth.js'),import(B+'firebase-firestore.js')]).then(function(m){
 var app=m[0].getApps().length?m[0].getApp():m[0].initializeApp(cfg),A=m[1],F=m[2],auth=A.getAuth(app),db=F.getFirestore(app);
 fs={db:db,doc:F.doc,set:F.setDoc};
 var errs={'auth/invalid-credential':'الإيميل أو كلمة السر غلط','auth/user-not-found':'مفيش حساب بالإيميل ده','auth/wrong-password':'كلمة السر غلط','auth/email-already-in-use':'الإيميل ده مسجّل قبل كده، جرّب دخول','auth/weak-password':'كلمة السر ضعيفة (6 حروف على الأقل)','auth/invalid-email':'الإيميل مش مظبوط','auth/popup-closed-by-user':'','auth/too-many-requests':'محاولات كتير، جرّب بعد شوية'};
 function fail(e){setMsg(errs[e.code]!==undefined?errs[e.code]:'حصلت مشكلة، جرّب تاني',true)}
 document.getElementById('gsign').onclick=function(){A.signInWithPopup(auth,new A.GoogleAuthProvider()).then(closeM).catch(fail)};
 document.getElementById('alogin').onclick=function(){A.signInWithEmailAndPassword(auth,document.getElementById('aem').value.trim(),document.getElementById('apw').value).then(closeM).catch(fail)};
 document.getElementById('areg').onclick=function(){A.createUserWithEmailAndPassword(auth,document.getElementById('aem').value.trim(),document.getElementById('apw').value).then(closeM).catch(fail)};
 document.getElementById('areset').onclick=function(){var em=document.getElementById('aem').value.trim();if(!em){setMsg('اكتب الإيميل الأول',true);return}A.sendPasswordResetEmail(auth,em).then(function(){setMsg('بعتنالك لينك تغيير كلمة السر')}).catch(fail)};
 window.__signOut=function(){A.signOut(auth)};
 A.onAuthStateChanged(auth,function(u){user=u;ui();if(!u)return;
  var ref=F.doc(db,'users',u.uid);F.getDoc(ref).then(function(s){var r=(s.exists()&&s.data().done)||[];r.forEach(function(n){done[n]=1});saveLocal();render();return F.setDoc(ref,{done:list(),updated:Date.now()},{merge:true})}).catch(function(){});});
}).catch(function(){});
})();

/* v5: language, menu, search, continue, certificate, run, subscribe */
(function(){
var root=document.documentElement;
function setLang(l){root.lang=l;root.dir=l==='en'?'ltr':'rtl';try{localStorage.setItem('lang',l)}catch(_){}
 document.querySelectorAll('.i').forEach(function(e){e.textContent=e.dataset[l]});
 document.querySelectorAll('[data-pha]').forEach(function(e){e.placeholder=e.dataset[l==='en'?'phe':'pha']});
 var b=document.getElementById('lang');if(b)b.textContent=l==='en'?'ع':'EN';}
var lg=document.getElementById('lang');if(lg)lg.addEventListener('click',function(){setLang(root.lang==='en'?'ar':'en')});
if(root.lang==='en')setLang('en');
var mb=document.getElementById('menu'),nv=document.getElementById('nav');if(mb)mb.addEventListener('click',function(){nv.classList.toggle('open')});
document.addEventListener('click',function(e){if(nv&&e.target.closest('#nav a'))nv.classList.remove('open')});
/* last lesson + continue */
var lm=document.querySelector('main[data-lesson]');if(lm){try{localStorage.setItem('last_lesson',lm.dataset.lesson)}catch(_){}}
var ct=document.getElementById('cont');if(ct){var n=null;try{n=localStorage.getItem('last_lesson')}catch(_){}
 if(n&&window.SEARCH){var l=window.SEARCH.filter(function(x){return String(x.n)===n})[0];if(l){ct.href=l.u;document.getElementById('contt').textContent=(root.lang==='en'?'Lesson ':'الدرس ')+l.n+': '+l.t;ct.hidden=false}}}
/* search */
var sm=document.getElementById('smodal'),sq=document.getElementById('sq'),sr=document.getElementById('sres');
function openS(){if(!sm)return;sm.hidden=false;sq.value='';sr.innerHTML='';setTimeout(function(){sq.focus()},50)}
['sbtn','sbtn2'].forEach(function(i){var e=document.getElementById(i);if(e)e.addEventListener('click',openS)});
if(sm){sm.addEventListener('click',function(e){if(e.target===sm||e.target.closest('.mx'))sm.hidden=true});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')sm.hidden=true;if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();openS()}});
 sq.addEventListener('input',function(){var q=sq.value.trim().toLowerCase();sr.innerHTML='';if(q.length<2||!window.SEARCH)return;var c=0;
  window.SEARCH.forEach(function(l){var hay=(l.t+'\n'+l.x),i=hay.toLowerCase().indexOf(q);if(i<0)return;c++;var s=Math.max(0,i-30),sn=hay.slice(s,i+80).replace(/\s+/g,' ');
   var a=document.createElement('a');a.href=l.u;var b=document.createElement('b');b.textContent=(root.lang==='en'?'Lesson ':'الدرس ')+l.n+': '+l.t;var p=document.createElement('span');p.textContent='…'+sn+'…';p.dir='auto';a.appendChild(b);a.appendChild(p);sr.appendChild(a)});
  if(!c){var d=document.createElement('p');d.className='amsg';d.textContent=root.lang==='en'?'No results':'مفيش نتايج';sr.appendChild(d)}});}
/* progress extras: badges + certificate unlock */
function doneSet(){var d={};try{JSON.parse(localStorage.getItem('progress_v1')||'[]').forEach(function(n){d[n]=1})}catch(_){}return d}
function extras(){var d=doneSet();
 document.querySelectorAll('.tcard[data-ls],.step[data-ls]').forEach(function(c){var ids=c.dataset.ls?c.dataset.ls.split(','):[];c.classList.toggle('complete',ids.length>0&&ids.every(function(i){return d[i]}))});
 document.querySelectorAll('.trackbar').forEach(function(t){var ids=t.dataset.ls.split(','),ok=ids.every(function(i){return d[i]});t.querySelector('.certbtn').hidden=!ok;t.querySelector('.certlock').hidden=ok});}
document.addEventListener('click',function(e){if(e.target.closest('.donebtn'))setTimeout(extras,50)});
setTimeout(extras,100);window.addEventListener('storage',extras);
/* certificate page */
var cw=document.getElementById('cert');if(cw){var p=new URLSearchParams(location.search).get('t')||'dart';var NAMES={dart:'Dart',oop:'OOP','flutter-basics':'Flutter Basics','flutter-advanced':'Flutter Advanced'};
 var LS={dart:[1,2,3,4,5]};var d=doneSet(),ids=LS[p]||[];var ok=ids.length>0&&ids.every(function(i){return d[i]});
 if(!ok){document.getElementById('clocked').hidden=false}else{document.getElementById('cform2').hidden=false;cw.hidden=false;
  var nm=document.getElementById('cname');try{nm.value=localStorage.getItem('cert_name')||''}catch(_){}
  function upd(){document.getElementById('cn').textContent=nm.value.trim()||'—';try{localStorage.setItem('cert_name',nm.value)}catch(_){}}nm.addEventListener('input',upd);upd();
  document.getElementById('ct').textContent=(NAMES[p]||p)+' Track';document.getElementById('cd').textContent=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  document.getElementById('cprint').addEventListener('click',function(){window.print()});}}
/* DartPad */
var rm=document.getElementById('rmodal'),dp=document.getElementById('dp'),pending=null;
document.addEventListener('click',function(e){var r=e.target.closest('.runb');if(!r)return;var c=document.getElementById(r.dataset.code).innerText;try{navigator.clipboard.writeText(c)}catch(x){}var o=r.innerHTML;r.innerHTML=(document.documentElement.lang==='en'?'Copied! Paste in DartPad':'اتنسخ! الصقه في DartPad');setTimeout(function(){r.innerHTML=o},3500);window.open('https://dartpad.dev/?channel=stable','_blank','noopener');});

if(rm)rm.addEventListener('click',function(e){if(e.target===rm||e.target.closest('.mx')){rm.hidden=true;dp.src='about:blank';pending=null}});
/* subscribe */
var sf=document.getElementById('sform');if(sf){sf.addEventListener('submit',function(e){e.preventDefault();var m=document.getElementById('smsg'),em=sf.email.value.trim();if(!/^\S+@\S+\.\S+$/.test(em)){m.textContent=root.lang==='en'?'Enter a valid email':'اكتب إيميل صحيح';m.className='amsg e';return}
 var b=sf.querySelector('.send');b.disabled=true;
 fetch('https://formsubmit.co/ajax/mobileappatoz@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email:em,_subject:'اشتراك جديد في دروس Mobile App A to Z',_honey:sf._honey.value})}).then(function(r){return r.json()}).then(function(j){if(j.success==='true'||j.success===true){m.textContent=root.lang==='en'?'Subscribed. Thank you!':'تم الاشتراك. شكراً ليك!';m.className='amsg';sf.email.value=''}else throw 0}).catch(function(){m.textContent=root.lang==='en'?'Something went wrong, try again':'حصلت مشكلة، جرّب تاني';m.className='amsg e'}).then(function(){b.disabled=false})});}
})();

/* comments (Firestore, no login, real name required) */
(function(){var box=document.getElementById('comments');if(!box)return;
var lesson=parseInt(box.dataset.lesson,10),f=document.getElementById('cmform'),msg=document.getElementById('cmmsg'),list=document.getElementById('cmlist'),cfg=window.FIREBASE_CONFIG,OWNER='mobileappatoz@gmail.com';
var en=document.documentElement.lang==='en';
function say(t,err){msg.textContent=t;msg.className='cm-msg'+(err?' e':'')}
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
if(!cfg){say(en?'Comments will open soon.':'التعليقات هتتفتح قريبًا.');f.querySelectorAll('input,textarea,button').forEach(function(x){x.disabled=true});return}
var V='10.14.1',B='https://www.gstatic.com/firebasejs/'+V+'/';
Promise.all([import(B+'firebase-app.js'),import(B+'firebase-firestore.js'),import(B+'firebase-auth.js')]).then(function(m){
 var app=m[0].getApps().length?m[0].getApp():m[0].initializeApp(cfg),F=m[1],A=m[2],db=F.getFirestore(app),auth=A.getAuth(app),isOwner=false;
 function when(ts){try{return ts.toDate().toLocaleDateString(en?'en-GB':'ar-EG',{day:'numeric',month:'short',year:'numeric'})}catch(e){return ''}}
 function draw(docs){list.innerHTML=docs.length?'':'<p class="cm-empty">'+(en?'No comments yet. Be the first.':'مفيش تعليقات لسه. كن أول واحد.')+'</p>';
  docs.forEach(function(d){var x=d.data(),el=document.createElement('div');el.className='cm';
   el.innerHTML='<div class="cm-h"><b>'+esc(x.name)+'</b><small>'+when(x.created)+'</small>'+(isOwner?'<button type="button" class="cm-del" data-id="'+d.id+'">'+(en?'Delete':'مسح')+'</button>':'')+'</div><p>'+esc(x.text)+'</p>';list.appendChild(el)})}
 var last=[];
 F.onSnapshot(F.query(F.collection(db,'comments'),F.where('lesson','==',lesson)),function(sn){last=sn.docs.slice().sort(function(a,b){var x=a.data().created,y=b.data().created;return (y?y.seconds:9e9)-(x?x.seconds:9e9)}).slice(0,100);draw(last)},function(){say(en?'Could not load comments.':'مقدرناش نحمّل التعليقات.',true)});
 A.onAuthStateChanged(auth,function(u){isOwner=!!(u&&u.emailVerified&&u.email===OWNER);draw(last)});
 list.addEventListener('click',function(e){var b=e.target.closest('.cm-del');if(!b||!isOwner)return;if(confirm(en?'Delete this comment?':'تمسح التعليق؟'))F.deleteDoc(F.doc(db,'comments',b.dataset.id)).catch(function(){})});
 f.addEventListener('submit',function(e){e.preventDefault();
  if(f.website.value)return;
  var nm=f.nm.value.replace(/\s+/g,' ').trim(),tx=f.tx.value.trim();
  if(!/^[\p{L}][\p{L} .'\-]{1,39}$/u.test(nm)||/https?:|www\./i.test(nm)){say(en?'Please enter your real name (letters only, 2 to 40 characters).':'اكتب اسمك الحقيقي (حروف بس، من 2 لـ 40 حرف).',true);f.nm.focus();return}
  if(tx.length<2){say(en?'Write your comment first.':'اكتب تعليقك الأول.',true);f.tx.focus();return}
  if((tx.match(/https?:\/\//gi)||[]).length>1){say(en?'Too many links.':'روابط كتير.',true);return}
  var now=Date.now(),lastT=+(localStorage.getItem('cm_t')||0);if(now-lastT<30000){say(en?'Please wait a few seconds between comments.':'استنى كام ثانية بين كل تعليق.',true);return}
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;
  F.addDoc(F.collection(db,'comments'),{lesson:lesson,name:nm,text:tx,created:F.serverTimestamp()}).then(function(){localStorage.setItem('cm_t',String(Date.now()));f.tx.value='';say(en?'Posted. Thank you!':'اتنشر. شكرًا!')}).catch(function(){say(en?'Could not post. Try again.':'مقدرناش ننشر، جرّب تاني.',true)}).then(function(){btn.disabled=false});
 });
}).catch(function(){say(en?'Comments are unavailable now.':'التعليقات مش متاحة دلوقتي.',true)});
})();
