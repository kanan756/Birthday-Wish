/**
 * Aesthetic Birthday Celebration Logic
 * Features:
 * 1. Interactive 3D Gift Open Animation
 * 2. Continuously Running Floating Balloons with Click Pop Effects
 * 3. Interactive Candle Extinguish (Tap, Button, or Real Microphone Breath Detection!)
 * 4. Lo-Fi / Soft Synthesizer Birthday Melody
 * 5. Multi-Color Canvas Confetti & Sparkler Fireworks
 * 6. Responsive & Mobile-friendly Design
 */

// User Configuration
const state = {
  friendName: "Bestie",
  customNote: "Happy Birthday! Thank you for being the one person I can always talk to, vent with, share stupid memes with, and celebrate life alongside. Here's to leveling up another year!",
  soundEnabled: true,
  candlesExtinguished: false,
  micListening: false,
  giftOpened: false
};

// Pastel Aesthetics Color Palette for Balloons
const balloonColors = [
  { bg: "linear-gradient(135deg, #f472b6, #db2777)", icon: "💖" },
  { bg: "linear-gradient(135deg, #c084fc, #9333ea)", icon: "✨" },
  { bg: "linear-gradient(135deg, #38bdf8, #0284c7)", icon: "🌸" },
  { bg: "linear-gradient(135deg, #fb923c, #ea580c)", icon: "⭐" },
  { bg: "linear-gradient(135deg, #fde047, #ca8a04)", icon: "🎂" },
  { bg: "linear-gradient(135deg, #4ade80, #16a34a)", icon: "🍀" }
];

/* -------------------------------------------------------------
 *  1. CONTINUOUS RUNNING BALLOONS SYSTEM
 * ------------------------------------------------------------- */
const skyBg = document.getElementById("skyBg");

function spawnSingleBalloon() {
  const balloon = document.createElement("div");
  balloon.className = "balloon-item";

  // Pick random palette
  const choice = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.background = choice.bg;
  balloon.innerHTML = `<span>${choice.icon}</span>`;

  // Random horizontal position across screen
  const x = Math.random() * 92 + 4; // 4% to 96%
  balloon.style.left = `${x}vw`;

  // Random animation speed (running speed: 7s to 13s)
  const duration = Math.random() * 6 + 7;
  balloon.style.animationDuration = `${duration}s`;

  // Random slight scale
  const scale = (Math.random() * 0.4 + 0.8).toFixed(2);
  balloon.style.transform = `scale(${scale})`;

  // Click to pop balloon with micro confetti burst
  balloon.addEventListener("click", (e) => {
    e.stopPropagation();
    popBalloon(balloon, e.clientX, e.clientY);
  });

  skyBg.appendChild(balloon);

  // Auto clean up after animation ends
  setTimeout(() => {
    if (balloon.parentNode) {
      balloon.remove();
    }
  }, duration * 1000);
}

function popBalloon(balloonElement, clientX, clientY) {
  playTone(800, 'triangle', 0.1, 0.15);
  
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 25,
      spread: 50,
      startVelocity: 25,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight
      }
    });
  }

  balloonElement.remove();
}

// Continuous balloon runner interval
let balloonInterval = null;
function startBalloonStream() {
  if (balloonInterval) clearInterval(balloonInterval);
  // Spawn initial burst of balloons
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnSingleBalloon, i * 400);
  }
  // Keep spawning every 1.6s
  balloonInterval = setInterval(spawnSingleBalloon, 1600);
}

/* -------------------------------------------------------------
 *  2. WEB AUDIO API SYNTHESIZER (Aesthetic Chime Melody)
 * ------------------------------------------------------------- */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(freq, type = 'sine', duration = 0.25, gainVal = 0.08) {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.error(err);
  }
}

// Soft Lo-Fi Birthday Chime notes
const bdayChimes = [
  { f: 261.63, d: 0.35 }, // C4
  { f: 261.63, d: 0.25 }, // C4
  { f: 293.66, d: 0.55 }, // D4
  { f: 261.63, d: 0.55 }, // C4
  { f: 349.23, d: 0.55 }, // F4
  { f: 329.63, d: 0.90 }, // E4
  { f: 261.63, d: 0.35 }, // C4
  { f: 261.63, d: 0.25 }, // C4
  { f: 293.66, d: 0.55 }, // D4
  { f: 261.63, d: 0.55 }, // C4
  { f: 392.00, d: 0.55 }, // G4
  { f: 349.23, d: 1.00 }, // F4
];

function playAestheticMelody() {
  if (!state.soundEnabled) return;
  initAudio();
  let delay = 0;
  bdayChimes.forEach(note => {
    setTimeout(() => {
      playTone(note.f, 'sine', note.d * 1.2, 0.12);
    }, delay * 1000);
    delay += note.d + 0.06;
  });
}

// Audio toggle button
const audioToggleBtn = document.getElementById("audioToggleBtn");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");

audioToggleBtn.addEventListener("click", () => {
  state.soundEnabled = !state.soundEnabled;
  if (state.soundEnabled) {
    musicIcon.textContent = "🎵";
    musicText.textContent = "Sound On";
    playTone(523.25, 'sine', 0.25, 0.1);
  } else {
    musicIcon.textContent = "🔇";
    musicText.textContent = "Muted";
  }
});

/* -------------------------------------------------------------
 *  3. STEP 1 -> STEP 2: OPEN GIFT BOX TRANSITION
 * ------------------------------------------------------------- */
const giftBox = document.getElementById("giftBox");
const sceneGift = document.getElementById("scene-gift");
const sceneCelebration = document.getElementById("scene-celebration");

function openGift() {
  if (state.giftOpened) return;
  state.giftOpened = true;

  // Visual lid fly off
  giftBox.classList.add("opened");
  playTone(587.33, 'triangle', 0.35, 0.15);

  // Blast celebratory confetti burst
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }

  // Transition to celebration scene
  setTimeout(() => {
    sceneGift.style.opacity = "0";
    sceneGift.style.transform = "scale(0.9)";
    
    setTimeout(() => {
      sceneGift.classList.add("hidden");
      sceneCelebration.classList.remove("hidden");
      
      // Trigger melody & balloon rush
      playAestheticMelody();
      triggerConfettiShow();
    }, 400);
  }, 600);
}

giftBox.addEventListener("click", openGift);

/* -------------------------------------------------------------
 *  4. CANDLE BLOWING INTERACTION (Tap, Button, or Mic!)
 * ------------------------------------------------------------- */
const interactiveCake = document.getElementById("interactiveCake");
const blowCandleBtn = document.getElementById("blowCandleBtn");
const micBlowToggle = document.getElementById("micBlowToggle");
const micLabel = document.getElementById("micLabel");
const candleWishStatus = document.getElementById("candleWishStatus");
const flames = [
  document.getElementById("flame1"),
  document.getElementById("flame2"),
  document.getElementById("flame3")
];

function extinguishCandles() {
  if (state.candlesExtinguished) {
    // Re-light if already blown
    state.candlesExtinguished = false;
    flames.forEach(f => f.classList.remove("blown-out"));
    candleWishStatus.innerHTML = "🕯️ <em>Make a wish in your heart, then blow or tap the candles!</em>";
    playTone(659.25, 'sine', 0.2);
    return;
  }

  state.candlesExtinguished = true;
  flames.forEach(f => f.classList.add("blown-out"));
  
  // Soft wind puff tone
  playTone(190, 'sine', 0.5, 0.18);

  candleWishStatus.innerHTML = "✨ <strong>Wish granted! May all your dreams come true.</strong> ✨";
  candleWishStatus.style.color = "#fde047";

  // Massive celebration fireworks
  triggerConfettiShow();
}

interactiveCake.addEventListener("click", extinguishCandles);
blowCandleBtn.addEventListener("click", extinguishCandles);

/* Microphone Breath / Blow Detection */
let audioStream = null;
let micContext = null;
let analyser = null;
let micInterval = null;

async function toggleMicBlow() {
  if (state.micListening) {
    // Stop listening
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    clearInterval(micInterval);
    state.micListening = false;
    micBlowToggle.classList.remove("active");
    micLabel.textContent = "Use Real Microphone Breath";
    return;
  }

  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = micContext.createAnalyser();
    const source = micContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    state.micListening = true;
    micBlowToggle.classList.add("active");
    micLabel.textContent = "🎙️ Listening... Blow now!";

    micInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      let average = sum / bufferLength;

      // When user blows into mic, average spikes significantly
      if (average > 65 && !state.candlesExtinguished) {
        extinguishCandles();
        micLabel.textContent = "💨 Breath Detected!";
      }
    }, 100);

  } catch (err) {
    alert("Microphone permission was not granted or is unsupported. You can still tap the cake or click the button to blow out the candles!");
  }
}

micBlowToggle.addEventListener("click", toggleMicBlow);

/* -------------------------------------------------------------
 *  5. SPARKLES & CONFETTI EFFECTS
 * ------------------------------------------------------------- */
function triggerConfettiShow() {
  if (typeof confetti !== 'function') return;

  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#f472b6', '#c084fc', '#38bdf8', '#fde047']
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#f472b6', '#c084fc', '#38bdf8', '#fde047']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Action Bar Buttons
document.getElementById("releaseBalloonsBtn").addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    setTimeout(spawnSingleBalloon, i * 150);
  }
  playTone(700, 'triangle', 0.2);
});

document.getElementById("sparklerBtn").addEventListener("click", () => {
  triggerConfettiShow();
  playTone(880, 'sine', 0.3);
});

// Secret Letter Accordion
const loveLetterBtn = document.getElementById("loveLetterBtn");
const secretLetter = document.getElementById("secretLetter");

loveLetterBtn.addEventListener("click", () => {
  secretLetter.classList.toggle("hidden");
  playTone(440, 'triangle', 0.2);
  if (!secretLetter.classList.contains("hidden")) {
    secretLetter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

/* -------------------------------------------------------------
 *  6. NAME & NOTE PERSONALIZATION MODAL
 * ------------------------------------------------------------- */
const editNameBtn = document.getElementById("editNameBtn");
const nameModal = document.getElementById("nameModal");
const closeModal = document.getElementById("closeModal");
const savePersonalize = document.getElementById("savePersonalize");
const nameInput = document.getElementById("nameInput");
const noteInput = document.getElementById("noteInput");

const currentNameLabel = document.getElementById("currentNameLabel");
const targetFriendName = document.getElementById("targetFriendName");
const customLetterBody = document.getElementById("customLetterBody");

function updateFriendDisplay(name, note) {
  state.friendName = name || "Bestie";
  currentNameLabel.textContent = state.friendName;
  targetFriendName.textContent = state.friendName.toUpperCase();
  
  if (note && note.trim().length > 0) {
    state.customNote = note.trim();
    customLetterBody.textContent = `"${state.customNote}"`;
  }
}

editNameBtn.addEventListener("click", () => {
  nameInput.value = state.friendName;
  noteInput.value = state.customNote;
  nameModal.classList.remove("hidden");
  nameInput.focus();
});

closeModal.addEventListener("click", () => {
  nameModal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === nameModal) {
    nameModal.classList.add("hidden");
  }
});

savePersonalize.addEventListener("click", () => {
  updateFriendDisplay(nameInput.value.trim(), noteInput.value.trim());
  nameModal.classList.add("hidden");
  playTone(523.25, 'triangle', 0.25);
  triggerConfettiShow();
});

/* -------------------------------------------------------------
 *  INITIALIZE APP
 * ------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  startBalloonStream();
});
