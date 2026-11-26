document.addEventListener('click',function(e){
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
