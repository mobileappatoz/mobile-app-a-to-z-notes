document.addEventListener('click',function(e){
  var tb=e.target.closest('.tab');if(tb){document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===tb)});document.querySelectorAll('.pane').forEach(function(p){p.hidden=p.id!=='pane-'+tb.dataset.tab});}
  var b=e.target.closest('.copy');
  if(b){var text=document.getElementById(b.dataset.code).innerText;
    var done=function(){b.textContent='اتنسخ ✓';b.classList.add('ok');setTimeout(function(){b.textContent='نسخ';b.classList.remove('ok')},1500)};
    var fb=function(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(_){}t.remove()};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,fb);else fb();}
  if(e.target.closest('#theme')){var d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(_){}
    var f=document.querySelector('iframe.giscus-frame');if(f)f.contentWindow.postMessage({giscus:{setConfig:{theme:n}}},'https://giscus.app');}
});

(function(){var c=document.getElementById('comments');if(!c)return;
var s=document.createElement('script');s.src='https://giscus.app/client.js';
var at={'data-repo':'mobileappatoz/mobile-app-a-to-z-notes','data-repo-id':'R_kgDOV9TjAQ','data-category':'Announcements','data-category-id':'DIC_kwDOV9TjAc4DMDMn','data-mapping':'specific','data-term':c.dataset.term,'data-strict':'0','data-reactions-enabled':'1','data-emit-metadata':'0','data-input-position':'top','data-theme':document.documentElement.dataset.theme==='light'?'light':'dark','data-lang':'ar','data-loading':'lazy'};
for(var k in at)s.setAttribute(k,at[k]);s.crossOrigin='anonymous';s.async=true;c.appendChild(s);})();

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
 var app=m[0].initializeApp(cfg),A=m[1],F=m[2],auth=A.getAuth(app),db=F.getFirestore(app);
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
