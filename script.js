
/* ====== ORIGINAL SCRIPTS (unchanged) ====== */
const bubbleC = document.getElementById('bubbles-container');
for(let i=0;i<18;i++){
  const b=document.createElement('div');
  b.className='bubble';
  const s=12+Math.random()*40;
  b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:-60px;animation-duration:${7+Math.random()*12}s;animation-delay:-${Math.random()*12}s;`;
  bubbleC.appendChild(b);
}

const confC=document.getElementById('confetti-container');
const colors=['#f4b942','#e8892b','#5b8dd9','#ff6b9d','#6bcb77','#ffcd38','#f48fb1','#7eb8c9'];
for(let i=0;i<35;i++){
  const c=document.createElement('div');
  c.className='conf';
  c.style.cssText=`left:${Math.random()*100}%;background:${colors[i%colors.length]};animation-duration:${4+Math.random()*7}s;animation-delay:-${Math.random()*9}s;width:${8+Math.random()*8}px;height:${12+Math.random()*10}px;transform:rotate(${Math.random()*360}deg);`;
  confC.appendChild(c);
}

const sbChar = document.getElementById('spongebob');
setInterval(()=>{
  sbChar.style.transition='transform 0.3s ease';
  sbChar.style.transform='translateY(-10px)';
  setTimeout(()=>{ sbChar.style.transform='translateY(0)'; },300);
},2500);

const patChar = document.getElementById('patrick');
setInterval(()=>{
  patChar.style.transition='transform 0.5s ease';
  patChar.style.transform='rotate(8deg)';
  setTimeout(()=>{ patChar.style.transform='rotate(-8deg)'; setTimeout(()=>{ patChar.style.transform='rotate(0)'; },500); },500);
},3000);

const garyChar = document.getElementById('gary');
let garyDir=1;
setInterval(()=>{
  garyDir*=-1;
  garyChar.style.transition='transform 2s ease';
  garyChar.style.transform=`translateX(${garyDir*15}px)`;
},2000);

const sandyChar = document.getElementById('sandy');
setInterval(()=>{
  sandyChar.style.transition='transform 0.4s ease';
  sandyChar.style.transform='rotate(-10deg)';
  setTimeout(()=>{ sandyChar.style.transform='rotate(10deg)'; setTimeout(()=>{ sandyChar.style.transform='rotate(0)'; },400); },400);
},3500);

/* ====== MODIFICATION 2: WISH SEQUENCE ====== */
const wishes = [
  {
    name: 'SpongeBob',
    charId: 'spongebob',
    text: "ISABEL!! Happy Birthday!! 🎉🧽 Okay okay okay — I just have to say one thing. You keeping everything together at home while things were tough? That's the kind of thing that doesn't get enough credit. Like being a fry cook — nobody sees all the work but the food is always there! You're the reason everything runs. And THAT is something to be SO proud of. Now enough serious stuff — IT'S YOUR BIRTHDAY!! You deserve to do absolutely nothing today and just be happy. I'm so glad you exist, Isabel. 💛"
  },
  {
    name: 'Patrick',
    charId: 'patrick',
    text: "Isabel!! Happy Birthday!! 🌟 You know what I've noticed? You just… handle things. Like quietly, without making a big deal, you just take care of everything. I could never do that. I once forgot to take care of myself for a week. 😅 But YOU? You step up. That's really cool, Isabel. Really really cool. I hope today somebody takes care of YOU for once. You deserve a day where you just… receive. No giving. Just cake and happiness. I love you!! 💖"
  },
  {
    name: 'Sandy',
    charId: 'sandy',
    text: "Well hey there Isabel, Happy Birthday!! 🤠🌟 Listen — I've built an entire air dome underwater and invented like forty things, so I know hard work when I see it. And girl, the way you hold things together at home? That takes discipline, patience, and a whole lot of love. Most people don't even notice that kind of effort. But it matters. A LOT. You should walk into this new year of your life feeling genuinely proud of yourself. Because I sure am proud of you. Now go enjoy your birthday!! 🎉"
  },
  {
    name: 'Squidward',
    charId: 'squidward',
    text: "Isabel. Happy Birthday. 🎺 I'll be honest — I don't give compliments often. Or ever, really. But I'll make an exception. The fact that you quietly kept everything running at home, without drama, without falling apart — that's more maturity than most people twice your age ever show. It's not glamorous work. Nobody writes songs about it. But it says everything about who you are. Anyway. I hope your birthday is… acceptable. You've earned at least that much. 🎶"
  },
  {
    name: 'Gary',
    charId: 'gary',
    text: "Meow. 🐌💙 Meow meow meoooow. Meow. (Translation: Happy Birthday Isabel. You're one of those people who just quietly does what needs to be done — no fuss, no complaints. Just love in action. That's rare. And honestly? That's everything. I hope today is fully yours. Warm and easy and full of good things. You really, really deserve it. Meow. 🌊)"
  }
];

let currentWish = 0;

/* ====== CARD TRANSITION SOUND ====== */
function playCardTransition(index) {
  // Use the ocean context if alive, else birthday audio context
  let ctx;
  try {
    ctx = oceanCtx && oceanCtx.state !== 'closed' ? oceanCtx : getCtx();
    if (ctx.state === 'suspended') ctx.resume();
  } catch(e) { return; }

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.28, now);
  masterGain.connect(ctx.destination);

  /* -- Soft underwater "whoosh" sweep -- */
  const noiseLen = ctx.sampleRate * 0.6;
  const nBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
  const nData = nBuf.getChannelData(0);
  for (let i = 0; i < noiseLen; i++) nData[i] = Math.random() * 2 - 1;
  const nSrc = ctx.createBufferSource();
  nSrc.buffer = nBuf;

  const sweep = ctx.createBiquadFilter();
  sweep.type = 'bandpass';
  // Pitch slides up for "next", different tone each card
  const baseFreq = 300 + index * 120;
  sweep.frequency.setValueAtTime(baseFreq, now);
  sweep.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.35);
  sweep.Q.value = 3.5;

  const sweepGain = ctx.createGain();
  sweepGain.gain.setValueAtTime(0, now);
  sweepGain.gain.linearRampToValueAtTime(0.55, now + 0.04);
  sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  nSrc.connect(sweep);
  sweep.connect(sweepGain);
  sweepGain.connect(masterGain);
  nSrc.start(now);
  nSrc.stop(now + 0.6);

  /* -- Small bubble cluster (3 quick pops) -- */
  [0.05, 0.14, 0.25].forEach((delay, i) => {
    const freq = 500 + Math.random() * 600;
    const bOsc = ctx.createOscillator();
    const bGain = ctx.createGain();
    bOsc.connect(bGain);
    bGain.connect(masterGain);
    bOsc.type = 'sine';
    bOsc.frequency.setValueAtTime(freq, now + delay);
    bOsc.frequency.exponentialRampToValueAtTime(freq * 0.38, now + delay + 0.13);
    bGain.gain.setValueAtTime(0, now + delay);
    bGain.gain.linearRampToValueAtTime(0.12, now + delay + 0.01);
    bGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.18);
    bOsc.start(now + delay);
    bOsc.stop(now + delay + 0.22);
  });

  /* -- Warm tone chime (each card gets its own note) -- */
  const chimeNotes = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5 D5 E5 F5 G5
  const chimeFreq = chimeNotes[index % chimeNotes.length];
  const chOsc = ctx.createOscillator();
  const chGain = ctx.createGain();
  chOsc.connect(chGain);
  chGain.connect(masterGain);
  chOsc.type = 'sine';
  chOsc.frequency.setValueAtTime(chimeFreq, now + 0.08);
  chGain.gain.setValueAtTime(0, now + 0.08);
  chGain.gain.linearRampToValueAtTime(0.18, now + 0.12);
  chGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  chOsc.start(now + 0.08);
  chOsc.stop(now + 0.75);

  // Add soft 2nd harmonic for warmth
  const chOsc2 = ctx.createOscillator();
  const chGain2 = ctx.createGain();
  chOsc2.connect(chGain2);
  chGain2.connect(masterGain);
  chOsc2.type = 'triangle';
  chOsc2.frequency.setValueAtTime(chimeFreq * 2, now + 0.08);
  chGain2.gain.setValueAtTime(0, now + 0.08);
  chGain2.gain.linearRampToValueAtTime(0.07, now + 0.12);
  chGain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  chOsc2.start(now + 0.08);
  chOsc2.stop(now + 0.55);
}

function showWish(index) {
  playCardTransition(index);
  currentWish = index;
  const w = wishes[index];
  // Clone avatar SVG from scene character
  const srcSvg = document.querySelector('#'+w.charId+' svg');
  document.getElementById('wish-avatar').innerHTML = srcSvg ? srcSvg.outerHTML : '';
  document.getElementById('wish-char-name').textContent = w.name;
  document.getElementById('wish-text').textContent = w.text;
  // Dots
  const dotsEl = document.getElementById('wish-dots');
  dotsEl.innerHTML = '';
  wishes.forEach((_,i)=>{
    const d=document.createElement('div');
    d.className='wish-dot'+(i===index?' active':'');
    dotsEl.appendChild(d);
  });
  // Button label
  const btn = document.getElementById('wish-next-btn');
  btn.textContent = index < wishes.length-1 ? 'Next ›' : '📜 Open Birthday Letter!';
  // Show overlay
  document.getElementById('wish-overlay').classList.add('active');
}

function nextWish() {
  currentWish++;
  if(currentWish < wishes.length) {
    showWish(currentWish);
  } else {
    document.getElementById('wish-overlay').classList.remove('active');
    setTimeout(()=>{ openLetter(); }, 400);
  }
}

/* ====== MODIFICATION 3: SMOOTH LETTER OPEN/CLOSE ====== */
function closeLetter(){
  const overlay = document.getElementById('letter-overlay');
  overlay.classList.remove('visible');
  setTimeout(()=>{
    document.getElementById('open-btn').style.display='block';
  }, 500);
  stopMusic();
  // Resume ocean ambience when letter is closed
  startOceanAmbience();
}

function openLetter(){
  const overlay = document.getElementById('letter-overlay');
  overlay.style.display='flex';
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      overlay.classList.add('visible');
    });
  });
  document.getElementById('open-btn').style.display='none';
  // Stop ocean sound, start birthday music
  stopOceanAmbience();
  startMusic();
}

/* ====== MODIFICATION 4: HAPPY BIRTHDAY SONG (Web Audio API) ====== */
let audioCtx = null;
let musicPlaying = false;
let loopTimer = null;

function getCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}

function playNote(freq, start, dur, ctx, dest){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(dest);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.18, start+0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, start+dur*0.9);
  osc.start(start); osc.stop(start+dur+0.05);
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2); gain2.connect(dest);
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq*2, start);
  gain2.gain.setValueAtTime(0, start);
  gain2.gain.linearRampToValueAtTime(0.06, start+0.03);
  gain2.gain.exponentialRampToValueAtTime(0.001, start+dur*0.75);
  osc2.start(start); osc2.stop(start+dur+0.05);
}

function scheduleSong(offsetSec){
  const ctx = getCtx();
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1, ctx.currentTime);
  masterGain.connect(ctx.destination);

  const bpm = 84;
  const b = 60/bpm;
  const C4=261.63,D4=293.66,E4=329.63,F4=349.23,G4=392,A4=440,B4=493.88,
        C5=523.25,D5=587.33,E5=659.25,F5=698.46;
  const melody = [
    [G4,.75],[G4,.25],[A4,1],[G4,1],[C5,1],[B4,2],
    [G4,.75],[G4,.25],[A4,1],[G4,1],[D5,1],[C5,2],
    [G4,.75],[G4,.25],[G5=784,1],[E5,1],[C5,1],[B4,1],[A4,2],
    [F5,.75],[F5,.25],[E5,1],[C5,1],[D5,1],[C5,2]
  ];

  let t = ctx.currentTime + offsetSec;
  melody.forEach(([freq,beats])=>{
    playNote(freq, t, beats*b*0.86, ctx, masterGain);
    t += beats*b;
  });
  return (t - ctx.currentTime);
}

function startMusic(){
  if(musicPlaying) return;
  musicPlaying = true;
  document.getElementById('music-bar').classList.add('show');
  const ctx = getCtx();
  if(ctx.state==='suspended') ctx.resume();
  const dur = scheduleSong(0.1);
  const loop = ()=>{
    if(!musicPlaying) return;
    scheduleSong(0.05);
    loopTimer = setTimeout(loop, (dur-0.2)*1000);
  };
  loopTimer = setTimeout(loop, (dur-0.2)*1000);
}

function stopMusic(){
  musicPlaying = false;
  if(loopTimer) clearTimeout(loopTimer);
  document.getElementById('music-bar').classList.remove('show');
  if(audioCtx) audioCtx.suspend();
}

function toggleMusic(){
  if(musicPlaying){ stopMusic(); }
  else {
    if(audioCtx) audioCtx.resume();
    startMusic();
  }
}

/* ====== OCEAN AMBIENCE — plays before letter is opened ====== */
let oceanCtx = null;
let oceanNodes = [];
let oceanPlaying = false;
let oceanStarted = false;

function startOceanAmbience() {
  if (oceanPlaying) return;
  // Lazy-create a separate AudioContext for ocean sounds
  if (!oceanCtx) oceanCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (oceanCtx.state === 'suspended') oceanCtx.resume();

  oceanPlaying = true;
  oceanNodes = [];

  const ctx = oceanCtx;
  const masterGain = ctx.createGain();
  // Very soft volume — noticeable but never distracting
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.022, ctx.currentTime + 3); // gentle fade-in
  masterGain.connect(ctx.destination);
  oceanNodes.push(masterGain);

  /* ---- 1. Deep ocean rumble — low-pass filtered brown noise ---- */
  const bufSize = ctx.sampleRate * 4;
  const noiseBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufSize; i++) {
    const white = Math.random() * 2 - 1;
    // Brown noise: integrate white noise
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(180, ctx.currentTime);
  lowpass.Q.value = 0.8;

  noiseSource.connect(lowpass);
  lowpass.connect(masterGain);
  noiseSource.start();
  oceanNodes.push(noiseSource);

  /* ---- 2. Gentle water whoosh — band-pass noise layer ---- */
  const whooshBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const whooshData = whooshBuffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) whooshData[i] = Math.random() * 2 - 1;

  const whooshSource = ctx.createBufferSource();
  whooshSource.buffer = whooshBuffer;
  whooshSource.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(600, ctx.currentTime);
  bandpass.Q.value = 0.4;

  // Slow LFO to gently swell the whoosh — like waves breathing
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.07, ctx.currentTime); // very slow wave ~14s cycle
  lfoGain.gain.setValueAtTime(0.018, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();
  oceanNodes.push(lfo);

  const whooshGain = ctx.createGain();
  whooshGain.gain.setValueAtTime(0.35, ctx.currentTime);
  whooshSource.connect(bandpass);
  bandpass.connect(whooshGain);
  whooshGain.connect(masterGain);
  whooshSource.start();
  oceanNodes.push(whooshSource);

  /* ---- 3. Occasional soft bubble pops ---- */
  function scheduleBubblePop() {
    if (!oceanPlaying) return;
    const delay = 1.8 + Math.random() * 4.5;
    setTimeout(() => {
      if (!oceanPlaying || !oceanCtx) return;
      const c = oceanCtx;
      const freq = 400 + Math.random() * 900;
      const popOsc = c.createOscillator();
      const popGain = c.createGain();
      popOsc.connect(popGain);
      popGain.connect(masterGain);
      popOsc.type = 'sine';
      // Bubble: quick pitch drop
      popOsc.frequency.setValueAtTime(freq, c.currentTime);
      popOsc.frequency.exponentialRampToValueAtTime(freq * 0.4, c.currentTime + 0.12);
      popGain.gain.setValueAtTime(0, c.currentTime);
      popGain.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.01);
      popGain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18);
      popOsc.start(c.currentTime);
      popOsc.stop(c.currentTime + 0.22);
      scheduleBubblePop();
    }, delay * 1000);
  }
  scheduleBubblePop();

  /* ---- 4. Very faint distant whale-like tone — SpongeBob vibe ---- */
  function scheduleWhaleHum() {
    if (!oceanPlaying) return;
    const delay = 8 + Math.random() * 14;
    setTimeout(() => {
      if (!oceanPlaying || !oceanCtx) return;
      const c = oceanCtx;
      const wOsc = c.createOscillator();
      const wGain = c.createGain();
      const wFilter = c.createBiquadFilter();
      wFilter.type = 'lowpass';
      wFilter.frequency.value = 320;
      wOsc.connect(wFilter);
      wFilter.connect(wGain);
      wGain.connect(masterGain);
      wOsc.type = 'sine';
      // Gentle descending hum
      const baseFreq = 120 + Math.random() * 60;
      wOsc.frequency.setValueAtTime(baseFreq, c.currentTime);
      wOsc.frequency.linearRampToValueAtTime(baseFreq * 0.65, c.currentTime + 2.5);
      wGain.gain.setValueAtTime(0, c.currentTime);
      wGain.gain.linearRampToValueAtTime(0.04, c.currentTime + 0.6);
      wGain.gain.linearRampToValueAtTime(0.04, c.currentTime + 1.8);
      wGain.gain.linearRampToValueAtTime(0, c.currentTime + 2.8);
      wOsc.start(c.currentTime);
      wOsc.stop(c.currentTime + 3);
      scheduleWhaleHum();
    }, delay * 1000);
  }
  scheduleWhaleHum();
}

function stopOceanAmbience() {
  if (!oceanPlaying) return;
  oceanPlaying = false;
  if (!oceanCtx) return;
  // Fade out gracefully then suspend
  const ctx = oceanCtx;
  // Stop all tracked sources immediately via suspend after short fade
  setTimeout(() => {
    if (ctx.state !== 'closed') ctx.suspend();
  }, 800);
}

/* ---- Start ocean on first user interaction (autoplay policy) ---- */
function tryStartOcean() {
  if (oceanStarted) return;
  oceanStarted = true;
  startOceanAmbience();
}
document.addEventListener('click', tryStartOcean, { once: true });
document.addEventListener('touchstart', tryStartOcean, { once: true });
