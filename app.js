// ===== WARNING SCREEN =====
function warnNo() {
  const msg = document.getElementById('warnNoMsg');
  msg.classList.add('visible');
  // wiggle the No button
  setTimeout(() => msg.classList.remove('visible'), 4000);
}

function warnYes() {
  const ws = document.getElementById('warningScreen');
  ws.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  ws.style.opacity = '0';
  ws.style.transform = 'scale(0.9)';
  setTimeout(() => {
    ws.classList.add('hidden');
    const lc = document.getElementById('lockContent');
    lc.classList.remove('hidden');
    lc.style.opacity = '0';
    lc.style.transform = 'translateY(20px)';
    lc.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lc.style.opacity = '1';
        lc.style.transform = 'translateY(0)';
      });
    });
  }, 500);
}

const overlay = document.getElementById("music-overlay");
const audio = document.getElementById("bg-music");

let started = false;

function startMusic() {
  if (!started) {
    audio.volume = 0.4;
    audio.play();
    started = true;

    // fade out overlay
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 600);
  }
}

// Spacebar trigger
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    startMusic();
  }
});

// Optional: click also works
overlay.addEventListener("click", startMusic);

// ===== LOCK SCREEN LOGIC =====
const questions = [
  { q: "Are you Tanvi Kalra?", hint: "", answer: "yes" },
  { q: "What is 5 + 5?", hint: "", answer: "10" },
  { q: "The place I always wanted to go and will go with you", hint: "hint: it's a temple 🛕", answer: "akshay patra" },
  { q: "The last movie we watched together?", hint: "", answer: "bhabiji ghar par hain" },
  { q: "Who is your bestie? 🥺", hint: "", answer: "pawan" }
];

// function to check answer
function checkAnswer(userAnswer, currentIndex) {
  const correctAnswer = questions[currentIndex].answer;

  if (userAnswer.trim().toLowerCase() === correctAnswer) {
    return true;
  } else {
    return false;
  }
}

let currentQ = 0;

function initLock() {
  const dots = document.getElementById('progressDots');
  dots.innerHTML = '';
  questions.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.id = 'dot' + i;
    dots.appendChild(d);
  });
  showQuestion(0);
  startLockPetals();
}

function showQuestion(idx) {
  document.getElementById('qNumber').textContent = `Question ${idx+1} of ${questions.length}`;
  document.getElementById('qText').textContent = questions[idx].q;
  document.getElementById('qHint').textContent = questions[idx].hint;
  document.getElementById('lockInput').value = '';
  document.getElementById('wrongMsg').textContent = '';
  document.getElementById('lockInput').focus();
}

function checkAnswer() {
  const input = document.getElementById('lockInput').value.trim().toLowerCase();
  const correct = questions[currentQ].answer.toLowerCase();
  if (input === correct) {
    document.getElementById('dot' + currentQ).className = 'dot done';
    currentQ++;
    if (currentQ >= questions.length) {
      unlockSite();
    } else {
      document.getElementById('dot' + currentQ).className = 'dot active';
      showQuestion(currentQ);
    }
  } else {
    const msg = document.getElementById('wrongMsg');
    msg.textContent = "Areee pookie 😤 only my bestie knows this 💖";
    msg.style.animation = 'none';
    requestAnimationFrame(() => { msg.style.animation = 'shake 0.4s ease'; });
    document.getElementById('lockInput').value = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('lockScreen').style.display !== 'none') checkAnswer();
});

function unlockSite() {
  const overlay = document.getElementById('unlockOverlay');
  overlay.style.display = 'block';
  const canvas = document.getElementById('burstCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const particles = [];
  for (let i = 0; i < 180; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18 - 5,
      life: 1,
      decay: Math.random() * 0.015 + 0.008,
      size: Math.random() * 20 + 8,
      emoji: ['🌹','💖','🌸','✨','💕','💗','🌺'][Math.floor(Math.random()*7)]
    });
  }
  function animateBurst() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      if (p.life > 0) {
        alive = true;
        ctx.globalAlpha = p.life;
        ctx.font = p.size + 'px serif';
        ctx.fillText(p.emoji, p.x, p.y);
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= p.decay;
      }
    });
    if (alive) requestAnimationFrame(animateBurst);
    else {
      overlay.style.display = 'none';
      document.getElementById('lockScreen').style.display = 'none';
      document.getElementById('mainSite').style.display = 'block';
      startMainSite();
    }
  }
  animateBurst();
}

// Lock screen petal animation
function startLockPetals() {
  const canvas = document.getElementById('lockPetalCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const petals = [];
  const emojis = ['🌹','🌸','💖','🌺','💗','✨'];
  for (let i = 0; i < 25; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      speed: Math.random() * 1.5 + 0.5,
      drift: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 18 + 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      opacity: Math.random() * 0.5 + 0.2,
      rot: Math.random() * Math.PI * 2
    });
  }
  function animLock() {
    if (document.getElementById('lockScreen').style.display === 'none') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = p.size + 'px serif';
      ctx.fillText(p.emoji, -p.size/2, p.size/2);
      ctx.restore();
      p.y += p.speed;
      p.x += p.drift;
      p.rot += 0.01;
      if (p.y > canvas.height + 30) {
        p.y = -30;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(animLock);
  }
  animLock();
}

// ===== MAIN SITE =====
function startMainSite() {
  startPetals();
  spawnFloatingHearts();
  initReveal();
}

// Falling petals
function startPetals() {
  const canvas = document.getElementById('petalCanvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const emojis = ['🌹','🌸','🌺','💗','💖','✨','🥀'];
  const petals = Array.from({length: 35}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 1.2 + 0.3,
    drift: (Math.random() - 0.5) * 0.6,
    size: Math.random() * 16 + 8,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    opacity: Math.random() * 0.6 + 0.2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02
  }));
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = p.size + 'px serif';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
      p.y += p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height + 30) { p.y = -30; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(anim);
  }
  anim();
}

// Floating hearts in hero
function spawnFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['❤️','💖','💗','💕','🌹','💓'];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement('span');
    h.className = 'fheart';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDuration = (Math.random() * 8 + 6) + 's';
    h.style.animationDelay = (Math.random() * 8) + 's';
    h.style.fontSize = (Math.random() * 12 + 10) + 'px';
    container.appendChild(h);
  }
}

// Scroll reveal
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

// Music toggle
let musicPlaying = false;
function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  if (musicPlaying) {
    audio.pause();
    btn.textContent = '🎵';
    musicPlaying = false;
  } else {
    audio.play().catch(() => {});
    btn.textContent = '🔇';
    musicPlaying = true;
  }
}

// Surprise button
function triggerSurprise() {
  // Hide button, show reveal card
  const btn = document.getElementById('surpriseBtn');
  btn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  btn.style.opacity = '0';
  btn.style.transform = 'scale(0.8)';
  setTimeout(() => { btn.style.display = 'none'; }, 400);

  // Show reveal card with a slight delay for drama
  setTimeout(() => {
    const reveal = document.getElementById('surpriseReveal');
    reveal.style.display = 'block';
  }, 500);

  // Hearts burst explosion
  const canvas = document.getElementById('heartBurstCanvas');
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.55;
  const particles = [];
  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 14 + 3;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 7,
      life: 1,
      decay: Math.random() * 0.01 + 0.005,
      size: Math.random() * 24 + 8,
      emoji: ['❤️','💖','🌹','💗','✨','💕','🌸','🌺','💓'][Math.floor(Math.random()*9)]
    });
  }
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      if (p.life > 0) {
        alive = true;
        ctx.globalAlpha = p.life;
        ctx.font = p.size + 'px serif';
        ctx.fillText(p.emoji, p.x, p.y);
        p.x += p.vx; p.y += p.vy; p.vy += 0.38; p.life -= p.decay;
      }
    });
    if (alive) requestAnimationFrame(anim);
    else { canvas.style.display = 'none'; }
  }
  anim();
}

// Init lock
initLock();