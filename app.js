const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function highlight(code, lang) {
  let h = esc(code);
  if (lang === 'bash') return h;
  const store = [];
  const keep = (cls) => (m) => { store.push('<span class="' + cls + '">' + m + '</span>'); return '\u0000' + (store.length - 1) + '\u0000'; };
  h = h.replace(/\/\/.*$/gm, keep('c'));
  h = h.replace(/'[^'\n]*'/g, keep('s'));
  h = h.replace(/\b(void|var|final|const|int|double|String|bool|if|else|switch|case|break|continue|default|for|while|do|true|false|import)\b/g, '<span class="k">$1</span>');
  h = h.replace(/\b(print|main|parse|readLineSync)\b/g, '<span class="f">$1</span>');
  h = h.replace(/\u0000(\d+)\u0000/g, (_, i) => store[+i]);
  return h;
}

function codeBlock(title, code, lang) {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  return '<div class="snip"><div class="snip-head"><span dir="ltr">' + esc(title) + '</span>' +
    '<button class="copy" data-code="' + id + '">نسخ</button></div>' +
    '<pre dir="ltr" id="' + id + '"><code>' + highlight(code, lang) + '</code></pre></div>';
}

const plain = {};
function lessonHtml(l) {
  const prev = ANSWERS[l.n - 1];
  let h = '<section class="lesson" id="l' + l.n + '"><div class="lesson-head"><span class="badge">الدرس ' + l.n + '</span><h2>' + esc(l.title) + '</h2>';
  if (l.youtube) h += '<a class="yt" href="' + l.youtube + '" target="_blank" rel="noopener">شاهد الفيديو</a>';
  h += '</div>';
  if (prev) {
    h += '<div class="box answer"><h3>إجابة تاسك الدرس ' + (l.n - 1) + '</h3><p>' + esc(prev.task) + '</p>' + codeBlock('Answer: Lesson ' + (l.n - 1), prev.code) + '</div>';
  }
  h += '<h3>ملاحظات</h3><ul class="notes">' + l.notes.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
  if (l.snippets.length) {
    h += '<h3>الأكواد</h3>' + l.snippets.map((s) => codeBlock(s.title, s.code, s.lang)).join('');
  }
  if (l.task) {
    h += '<div class="box task"><h3>تاسك الدرس ' + l.n + '</h3><p>' + esc(l.task.text) + '</p>' +
      (l.task.hint ? '<p class="hint">تلميح: <bdi>' + esc(l.task.hint) + '</bdi></p>' : '') +
      '<p class="hint">الإجابة في فيديو الدرس ' + (l.n + 1) + ' وتحت الدرس ' + (l.n + 1) + ' في الصفحة دي.</p></div>';
  }
  return h + '</section>';
}

const sorted = LESSONS.slice().sort((a, b) => a.n - b.n);
document.getElementById('lessons').innerHTML = sorted.map(lessonHtml).join('');
document.getElementById('nav').innerHTML = '<div class="nav-title">الدروس</div>' +
  sorted.map((l) => '<a href="#l' + l.n + '"><b>' + l.n + '</b><span>' + esc(l.title) + '</span></a>').join('');

document.addEventListener('click', (e) => {
  const b = e.target.closest('.copy');
  if (b) {
    const text = document.getElementById(b.dataset.code).innerText;
    const done = () => { b.textContent = 'اتنسخ ✓'; b.classList.add('ok'); setTimeout(() => { b.textContent = 'نسخ'; b.classList.remove('ok'); }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallback(text, done));
    else fallback(text, done);
  }
  if (e.target.closest('#menuBtn')) document.getElementById('nav').classList.toggle('open');
  if (e.target.closest('#nav a')) document.getElementById('nav').classList.remove('open');
});
function fallback(text, done) {
  const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
  try { document.execCommand('copy'); done(); } catch (_) {} t.remove();
}
