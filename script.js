// ===== إعدادات =====
const PASSWORD = "sasa";

// 23 يناير 2025
// ملحوظة: الشهور بتبدأ من 0 → يناير = 0
const startDate = new Date(2025, 0, 23, 0, 0, 0);

const lock = document.getElementById("lock");
const site = document.getElementById("site");
const pass = document.getElementById("pass");
const unlockBtn = document.getElementById("unlockBtn");
const err = document.getElementById("err");

const song = document.getElementById("song");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const lockAgain = document.getElementById("lockAgain");

// ===== فتح/قفل =====
function showSite() {
  lock.classList.add("hidden");
  site.classList.remove("hidden");
  localStorage.setItem("mem_unlocked", "1");

  song.play().catch(() => {});
}

// ===== سلايدر بولارويد (مختلف عن اللي فوق) =====
const pTrack = document.getElementById("pTrack");
const pPrev = document.getElementById("pPrev");
const pNext = document.getElementById("pNext");

function pScrollByCards(dir = 1){
  if (!pTrack) return;
  const card = pTrack.querySelector(".pCard");
  if (!card) return;
  const gap = 14; // نفس gap في CSS
  const step = card.getBoundingClientRect().width + gap;
  pTrack.scrollBy({ left: dir * step, behavior: "smooth" });
}

pPrev?.addEventListener("click", () => pScrollByCards(-1));
pNext?.addEventListener("click", () => pScrollByCards(1));

// تحريك تلقائي لطيف
let pAuto = setInterval(() => pScrollByCards(1), 5200);

// وقف التحريك التلقائي لو المستخدم لمس/سحب
["pointerdown", "touchstart", "mouseenter"].forEach(ev => {
  pTrack?.addEventListener(ev, () => { clearInterval(pAuto); });
});

function showLock() {
  site.classList.add("hidden");
  lock.classList.remove("hidden");
  localStorage.removeItem("mem_unlocked");
  try { song.pause(); } catch {}
}

function tryUnlock() {
  const v = (pass.value || "").trim();
  if (v === PASSWORD) {
    err.textContent = "";
    showSite();
  } else {
    err.textContent = "الباسورد غلط… جرّبي تاني 🤍";
  }
}

unlockBtn.addEventListener("click", tryUnlock);
pass.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

lockAgain?.addEventListener("click", showLock);

if (localStorage.getItem("mem_unlocked") === "1") {
  showSite();
}

// ===== موسيقى =====
playBtn?.addEventListener("click", async () => {
  try {
    await song.play();
  } catch {}
});

muteBtn?.addEventListener("click", () => {
  song.muted = !song.muted;
  muteBtn.textContent = song.muted ? "🔈 إلغاء الكتم" : "🔇 كتم";
});

// ===== تايمر متحرك =====
const dEl = document.getElementById("days");
const hEl = document.getElementById("hours");
const mEl = document.getElementById("mins");
const sEl = document.getElementById("secs");

function pad(n){
  return n.toString().padStart(2, "0");
}

function updateTimer() {
  const now = new Date();
  let diff = now - startDate;

  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  dEl.textContent = days;
  hEl.textContent = pad(hours);
  mEl.textContent = pad(mins);
  sEl.textContent = pad(secs);
}

updateTimer();
setInterval(updateTimer, 1000);

// ===== سلايدر =====
const slides = document.getElementById("slides");
const dots = Array.from(document.querySelectorAll(".dot"));
let idx = 0;

function go(i){
  idx = i;
  slides.style.transform = `translateX(${idx * 100}%)`;
  dots.forEach((d, di)=> d.classList.toggle("active", di === idx));
}

dots.forEach(d => {
  d.addEventListener("click", () => go(Number(d.dataset.i)));
});

setInterval(() => {
  const next = (idx + 1) % dots.length;
  go(next);
}, 4500);

// ===== ظهور تدريجي مع الاسكرول =====
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

