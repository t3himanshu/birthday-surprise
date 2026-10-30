/* =========================================================
   Birthday Surprise — Interactions
   Vanilla JS, no frameworks.
   ========================================================= */

/* ---------- Content (edit these to personalise) ---------- */
const LETTER = `My dearest,

Happy birthday to the most wonderful soul I know. Some people walk into our lives and quietly change everything — you are one of those rare, beautiful people.

Thank you for every smile you've shared, every laugh that filled the room, and every moment you made ordinary days feel magical. Your kindness is a light that reaches farther than you'll ever know.

Today I hope you feel just how loved you are. May this new year of your life bring you adventures that thrill you, peace that comforts you, and dreams that finally come true.

Never stop being you — because you are, truly, a gift to this world.

With all my love, always ❤️`;

const VALUES = [
  { icon: '❤️', name: 'Happiness',     glow: '#ff4d8d', text: 'May joy find you in the smallest moments and stay with you through every season.' },
  { icon: '💕', name: 'Love',          glow: '#ff8cc6', text: 'May you be surrounded by people who cherish you exactly as you are.' },
  { icon: '🌟', name: 'Success',       glow: '#ffd56b', text: 'May every goal you chase become a story you are proud to tell.' },
  { icon: '🌸', name: 'Good Health',   glow: '#ffb3d9', text: 'May your body be strong, your mind calm, and your heart full of energy.' },
  { icon: '🕊️', name: 'Peace',         glow: '#b9d7ff', text: 'May your heart always find a quiet, safe place to rest.' },
  { icon: '😊', name: 'Endless Smiles', glow: '#c48bff', text: 'May your smile never fade — the world is brighter because of it.' },
];

const SCREENS = ['screen-welcome', 'screen-wishes', 'screen-message', 'screen-values'];

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* =========================================================
   Background: stars + floating hearts / balloons / sparkles
   ========================================================= */
function createStars(count = 90) {
  const box = $('#stars');
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.style.left = rand(0, 100) + '%';
    s.style.top = rand(0, 100) + '%';
    s.style.animationDelay = rand(0, 3) + 's';
    s.style.transform = `scale(${rand(.5, 1.6)})`;
    box.appendChild(s);
  }
}

const BALLOON_COLORS = ['#ff6fb5', '#a55cff', '#ffd56b', '#6fc3ff', '#ff8a8a'];
function spawnFloater() {
  const box = $('#floaters');
  const el = document.createElement('div');
  el.className = 'floater';
  if (Math.random() < 0.3) {
    // CSS balloon
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.background = pick(BALLOON_COLORS);
    el.appendChild(b);
  } else {
    el.textContent = pick(['💖', '💕', '✨', '⭐', '💗', '🌸', '💜']);
    el.style.fontSize = rand(14, 32) + 'px';
  }
  el.style.left = rand(0, 95) + 'vw';
  el.style.animationDuration = rand(9, 16) + 's';
  box.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/* =========================================================
   Confetti (canvas)
   ========================================================= */
const canvas = $('#confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function burstConfetti(amount = 150, originX = canvas.width / 2, originY = canvas.height / 3) {
  const colors = ['#ff6fb5', '#a55cff', '#ffd56b', '#7ee8fa', '#ffffff'];
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: originX, y: originY,
      vx: rand(-8, 8), vy: rand(-12, -2),
      size: rand(5, 10), color: pick(colors),
      rot: rand(0, 360), vr: rand(-10, 10), life: 0,
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.vy += 0.25; p.vx *= 0.99;
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  });
  particles = particles.filter((p) => p.y < canvas.height + 20 && p.life < 400);
  if (particles.length) requestAnimationFrame(drawConfetti);
  else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

/* Small emoji burst wherever the user clicks */
function sparkleAt(x, y) {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = pick(['✨', '💖', '⭐', '💕']);
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    const angle = (Math.PI * 2 * i) / 8;
    s.style.setProperty('--dx', Math.cos(angle) * rand(40, 80) + 'px');
    s.style.setProperty('--dy', Math.sin(angle) * rand(40, 80) + 'px');
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

/* =========================================================
   Music — "Happy Birthday" synthesised with Web Audio API
   (starts only after the user interacts)
   ========================================================= */
const Music = {
  ctx: null, gain: null, playing: false, timer: null,
  // [note, beats]
  melody: [
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
    ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
    ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
  ],
  freq(note) {
    const map = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
    const semis = map[note[0]] + (parseInt(note.slice(-1), 10) - 4) * 12;
    return 440 * Math.pow(2, semis / 12);
  },
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.18;
    this.gain.connect(this.ctx.destination);
  },
  // Play one soft music-box style note
  note(freq, start, dur) {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(1, start + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, start + dur * 1.4);
    osc.connect(env).connect(this.gain);
    osc.start(start);
    osc.stop(start + dur * 1.5);
  },
  loop() {
    const beat = 0.45;
    let t = this.ctx.currentTime + 0.1;
    this.melody.forEach(([n, b]) => { this.note(this.freq(n), t, b * beat); t += b * beat; });
    const total = (t - this.ctx.currentTime + 1.2) * 1000; // short pause between loops
    this.timer = setTimeout(() => this.playing && this.loop(), total);
  },
  start() {
    this.init();
    this.ctx.resume();
    if (this.playing) return;
    this.playing = true;
    this.gain.gain.setTargetAtTime(0.18, this.ctx.currentTime, 0.1);
    this.loop();
    updateMusicBtn();
  },
  stop() {
    if (!this.playing) return;
    this.playing = false;
    clearTimeout(this.timer);
    this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    updateMusicBtn();
  },
};

function updateMusicBtn() {
  const btn = $('#musicBtn');
  btn.textContent = Music.playing ? '🎵' : '🔇';
  btn.classList.toggle('playing', Music.playing);
}

/* =========================================================
   Screen navigation
   ========================================================= */
let current = 'screen-welcome';
let busy = false;

function buildProgress() {
  $('#progress').innerHTML = SCREENS.map(() => '<span></span>').join('');
}
function updateProgress() {
  const idx = SCREENS.indexOf(current);
  [...$('#progress').children].forEach((d, i) => d.classList.toggle('on', i <= idx));
}

function goTo(id) {
  if (busy || id === current) return;
  busy = true;
  const from = document.getElementById(current);
  const to = document.getElementById(id);

  from.classList.add('leaving');
  setTimeout(() => {
    from.classList.remove('active', 'leaving');
    to.classList.add('active');
    window.scrollTo({ top: 0 });
    current = id;
    updateProgress();
    onEnter(id);
    busy = false;
  }, 650);
}

/* Per-screen setup when it becomes visible */
function onEnter(id) {
  switch (id) {
    case 'screen-wishes':   revealWords('#wishText'); burstConfetti(120); break;
    case 'screen-message':  startTyping(); break;
    case 'screen-values':   buildValues(); burstConfetti(150); break;
  }
}

/* ---------- Screen 2: animated words ---------- */
let wishOriginal = null;
function revealWords(sel) {
  const el = $(sel);
  if (wishOriginal === null) wishOriginal = el.textContent.trim().replace(/\s+/g, ' ');
  el.innerHTML = wishOriginal
    .split(' ')
    .map((w, i) => `<span style="animation-delay:${i * 0.08}s">${w}</span>`)
    .join(' ');
}

/* ---------- Screen 3: typing letter ---------- */
let typingTimer = null;
function startTyping() {
  const el = $('#typed');
  const nextBtn = $('#afterLetter');
  const skipBtn = $('#skipTyping');
  el.textContent = '';
  el.classList.remove('done');
  nextBtn.classList.add('hidden');
  skipBtn.classList.remove('hidden');

  let i = 0;
  clearTimeout(typingTimer);
  const type = () => {
    el.textContent = LETTER.slice(0, ++i);
    if (i < LETTER.length) {
      const ch = LETTER[i - 1];
      // pause a little longer on punctuation for a natural rhythm
      typingTimer = setTimeout(type, /[.,!—\n]/.test(ch) ? 220 : 32);
    } else finishTyping();
  };
  type();
}
function finishTyping() {
  clearTimeout(typingTimer);
  $('#typed').textContent = LETTER;
  $('#typed').classList.add('done');
  $('#skipTyping').classList.add('hidden');
  const btn = $('#afterLetter');
  btn.classList.remove('hidden');
  btn.classList.add('pop-in');
}

/* ---------- Screen 4: glowing value cards ---------- */
function buildValues() {
  const grid = $('#valuesGrid');
  grid.innerHTML = '';
  VALUES.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'value-card glass';
    card.style.animationDelay = `${i * 0.12}s, ${i * 0.4}s`;
    card.style.setProperty('--glow', v.glow);
    card.innerHTML = `<span class="icon">${v.icon}</span><h3>${v.name}</h3><p>${v.text}</p>`;
    card.addEventListener('click', (e) => {
      card.classList.toggle('open');
      if (card.classList.contains('open')) burstConfetti(30, e.clientX, e.clientY);
    });
    grid.appendChild(card);
  });
}

/* =========================================================
   Init & event wiring
   ========================================================= */
function init() {
  createStars();
  buildProgress();
  updateProgress();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Gentle continuous stream of floaters
  for (let i = 0; i < 8; i++) setTimeout(spawnFloater, i * 400);
  setInterval(spawnFloater, 900);

  // All "next" buttons
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (current === 'screen-welcome') Music.start(); // first interaction unlocks audio
      goTo(btn.dataset.next);
    });
  });

  $('#skipTyping').addEventListener('click', finishTyping);

  $('#restart').addEventListener('click', () => {
    burstConfetti(200);
    goTo('screen-welcome');
  });

  $('#musicBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    Music.playing ? Music.stop() : Music.start();
  });

  // Sparkles on every click/tap
  document.addEventListener('pointerdown', (e) => sparkleAt(e.clientX, e.clientY));
}

document.addEventListener('DOMContentLoaded', init);
