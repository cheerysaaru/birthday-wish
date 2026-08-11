/* ============================================================
   Happy Birthday Ammu — scripts
   ============================================================ */

/* ---------- Starfield / universe generation ---------- */
const starsContainer = document.getElementById('stars');
const starCount = 170;
for(let i=0;i<starCount;i++){
  const s = document.createElement('div');
  s.className = 'star';
  const big = Math.random() < 0.14;
  if(big) s.classList.add('big');
  const size = (big ? 2.5 : 1) + Math.random()*1.6;
  s.style.width = size+'px';
  s.style.height = size+'px';
  s.style.left = Math.random()*100 + '%';
  s.style.top = Math.random()*100 + '%';
  s.style.animationDelay = (Math.random()*4) + 's';
  s.style.animationDuration = (2.5 + Math.random()*4) + 's';
  starsContainer.appendChild(s);
}

/* ---------- Shooting stars ---------- */
function spawnShootingStar(){
  const el = document.createElement('div');
  el.className = 'shooting-star';
  el.style.top = (Math.random()*40) + '%';
  el.style.left = (60 + Math.random()*60) + '%';
  el.style.opacity = '0';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1700);
}
setInterval(()=>{
  spawnShootingStar();
  if(Math.random() < 0.5) spawnShootingStar();
}, 2200);

/* ---------- Reveal memories on scroll ---------- */
const memories = document.querySelectorAll('.memory');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); } });
},{threshold:0.25});
memories.forEach(m=>io.observe(m));

/* ---------- EDIT: Quiz questions ----------
   Replace question / options / correct index / and the "fun" reveal line.
------------------------------------------------ */
const quizData = [
  { q:"Naan eppa unakku first ah “I love you” sonnan? 🥹❤️",
    options:["Neenga dengue vanthu hospital la iruntha neram","Naama call pesum pothu","Java la vachu","Street Burger la vachu"],
    correct:0, fun:"Correct! 🥹❤️ Andha neram enakku ipavum nyabagam irukku." },
  { q:"Nee enna how many times slap pannirukka? 😂🤣",
    options:["1 time","2 times","3 times","Count eh marandhuten 😂"],
    correct:3, fun:"Ha! Count eh marandhuten dhaan sariyaana answer 😂🤣" },
  { q:"Ennatha enna pudikkum? 🥹❤️",
    options:["En sirippu","En vekkam","Nee enna care panrathu","Ellame ❤️"],
    correct:3, fun:"Ellame thaan correct ❤️ Aana un sirippu special 🥹" },
  { q:"Naan unna evvalavu love pannuren? 🥹❤️",
    options:["Romba konjam 😂","Konjam","Romba romba","Alave illa ❤️🥹"],
    correct:3, fun:"Alave illa — ithu correct ❤️ Naan unna alavukku meedhu love panren 🥹" },
  { q:"You are my ______ ❤️",
    options:["Ammu","Ammu","Ammu","En life ❤️"],
    correct:2, fun:"En life ❤️ Nee thaan en life ma 🥹" }
];

let qIndex = 0, score = 0;
const quizQ = document.getElementById('quizQ');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizProgress = document.getElementById('quizProgress');
const quizCard = document.getElementById('quizCard');
const quizResult = document.getElementById('quizResult');

function renderQuestion(){
  const item = quizData[qIndex];
  quizProgress.textContent = `Question ${qIndex+1} of ${quizData.length}`;
  quizQ.textContent = item.q;
  quizFeedback.textContent = '';
  quizOptions.innerHTML = '';
  item.options.forEach((opt,i)=>{
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', ()=>handleAnswer(i,btn));
    quizOptions.appendChild(btn);
  });
}
function handleAnswer(i,btn){
  const item = quizData[qIndex];
  if(i===item.correct){
    const allBtns = quizOptions.querySelectorAll('.quiz-opt');
    allBtns.forEach(b=>b.style.pointerEvents='none');
    btn.classList.add('correct');
    score++;
    quizFeedback.classList.remove('err');
    quizFeedback.textContent = item.fun;
    setTimeout(()=>{
      qIndex++;
      if(qIndex < quizData.length){ renderQuestion(); } else { showResult(); }
    }, 1500);
  } else {
    btn.disabled = true;
    btn.classList.add('wrong');
    quizFeedback.classList.add('err');
    quizFeedback.textContent = 'Silly Ammu! 😂 Athu thappu da… correct answer-a select pannu! 🥹';
  }
}
let quizDone = false;
function showResult(){
  quizCard.style.display='none';
  quizProgress.style.display='none';
  quizResult.style.display='block';
  quizResult.textContent = `${score}/${quizData.length} — of course! Ithu naama pathi dhaane, apdi thaan irukkanum 😂❤️ I love you Ammu!`;
  quizDone = true;
  document.body.classList.remove('quiz-gated');
}

/* ---------- Scroll gate: finish the quiz before scrolling past ---------- */
if('scrollRestoration' in history){ history.scrollRestoration = 'manual'; }
window.scrollTo(0,0);

const quizSection = document.getElementById('quiz');
let gateArmed = false, bounceLock = false;

const gateIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      gateArmed = true;
      document.body.classList.add('quiz-gated');
    }
  });
},{threshold:0});
gateIO.observe(quizSection);

/* little toast that appears when she tries to sneak past */
const gateToast = document.createElement('div');
gateToast.className = 'gate-toast';
gateToast.textContent = 'Silly Ammu! 😂 Answer the quiz first, then keep going! 🥹';
document.body.appendChild(gateToast);
let toastTimer;
function showGateToast(){
  gateToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>gateToast.classList.remove('show'), 2400);
}

window.addEventListener('scroll', ()=>{
  if(quizDone || !gateArmed) return;
  const r = quizSection.getBoundingClientRect();
  if(r.top <= 0 && r.bottom < 80){            /* tried to scroll past the quiz */
    if(!bounceLock){
      bounceLock = true;
      window.scrollTo({ top: quizSection.offsetTop - 30, behavior:'smooth' });
      showGateToast();
      setTimeout(()=>bounceLock = false, 700);
    }
  }
});

/* ---------- Scroll reveal animations ---------- */
const revealEls = document.querySelectorAll(
  '.section-eyebrow, .section-title, .section-lede, .story-card, .letter, .quiz-progress, .quiz-card, .quiz-result, .scratch-wrap, .scratch-hint, .scratch-reveal-msg, .sorry-card, .cake, .blow-btn, .final-msg, .footer-note'
);
const revObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      revObserver.unobserve(e.target);
    }
  });
},{threshold:0.18});
revealEls.forEach((el,i)=>{
  el.classList.add('reveal');
  if(el.classList.contains('sorry-card')) el.style.transitionDelay = (i%6)*0.12 + 's';
  revObserver.observe(el);
});

/* kick off the quiz — renders the first question */
renderQuestion();

/* ---------- Scratch card ----------
   EDIT: put your real photo in ../assets/photo.jpg and set
   PHOTO_URL below to "assets/photo.jpg". Until then the
   placeholder illustration is used.
------------------------------------- */
const PHOTO_URL = "";

const placeholderSVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5b3a63"/>
      <stop offset="100%" stop-color="#2c2350"/>
    </linearGradient>
  </defs>
  <rect width="320" height="400" fill="url(#g)"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="20" fill="#f2c14e">Our Photo</text>
  <text x="50%" y="54%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f6efe4" opacity="0.6">add PHOTO_URL in js/main.js</text>
  <text x="50%" y="66%" text-anchor="middle" font-size="46">🤍</text>
</svg>
`)}`;

const scratchPhoto = document.getElementById('scratchPhoto');
scratchPhoto.src = PHOTO_URL || placeholderSVG;

const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const scratchWrap = document.querySelector('.scratch-wrap');
const scratchMsg = document.getElementById('scratchMsg');
let scratchDone = false;

function setupScratch(){
  const rect = scratchWrap.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  grad.addColorStop(0, '#8fb39b');
  grad.addColorStop(1, '#5b3a63');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#f6efe4';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('scratch me', canvas.width/2, canvas.height/2);
}
setupScratch();
window.addEventListener('resize', ()=>{ if(!scratchDone) setupScratch(); });

let isDown = false;
function getPos(e){
  const rect = canvas.getBoundingClientRect();
  const point = e.touches ? e.touches[0] : e;
  return { x: point.clientX - rect.left, y: point.clientY - rect.top };
}
function scratchAt(x,y){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x,y,26,0,Math.PI*2);
  ctx.fill();
}
function checkCleared(){
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let cleared = 0, total = data.length/4;
  for(let i=3;i<data.length;i+=4){ if(data[i]===0) cleared++; }
  if(cleared/total > 0.55 && !scratchDone){
    scratchDone = true;
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    scratchMsg.classList.add('show');
  }
}
function start(e){ isDown = true; const p=getPos(e); scratchAt(p.x,p.y); }
function move(e){ if(!isDown) return; e.preventDefault(); const p=getPos(e); scratchAt(p.x,p.y); checkCleared(); }
function end(){ isDown = false; }

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', move);
window.addEventListener('mouseup', end);
canvas.addEventListener('touchstart', start, {passive:true});
canvas.addEventListener('touchmove', move, {passive:false});
canvas.addEventListener('touchend', end);

/* ---------- Candle blow + confetti ---------- */
const blowBtn = document.getElementById('blowBtn');
const cake = document.getElementById('cake');
const finalMsg = document.getElementById('finalMsg');

blowBtn.addEventListener('click', ()=>{
  cake.textContent = '🎂';
  blowBtn.disabled = true;
  blowBtn.textContent = 'Wish made 🤍';
  finalMsg.classList.add('show');
  launchConfetti();
});
function launchConfetti(){
  const colors = ['#f2c14e','#f2a0a8','#f0776a','#8fb39b','#f6efe4'];
  for(let i=0;i<70;i++){
    const el = document.createElement('div');
    el.className = 'confetti';
    const size = 5 + Math.random()*6;
    el.style.width = size+'px';
    el.style.height = (size*0.4)+'px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.left = Math.random()*100+'vw';
    const duration = 2.5 + Math.random()*2;
    const rotation = Math.random()*360;
    el.style.transform = `rotate(${rotation}deg)`;
    document.body.appendChild(el);
    el.animate([
      { transform:`translateY(0) rotate(${rotation}deg)`, opacity:1 },
      { transform:`translateY(${window.innerHeight+40}px) rotate(${rotation+360}deg)`, opacity:0.9 }
    ], { duration: duration*1000, easing:'cubic-bezier(.25,.46,.45,.94)' });
    setTimeout(()=>el.remove(), duration*1000+100);
  }
}