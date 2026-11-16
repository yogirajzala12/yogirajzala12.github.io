const screens = {
  envelope: document.getElementById("screen-envelope"),
  question: document.getElementById("screen-question"),
  yes: document.getElementById("screen-yes"),
};

function show(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

/* ---------- floating hearts ---------- */
const heartBox = document.getElementById("hearts");
const heartEmojis = ["💖", "💕", "💗", "💘", "❤️", "🌸"];

function spawnHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  h.style.animationDuration = 5 + Math.random() * 5 + "s";
  heartBox.appendChild(h);
  setTimeout(() => h.remove(), 10000);
}
let heartTimer = setInterval(spawnHeart, 600);

function heartBurst(count = 40) {
  for (let i = 0; i < count; i++) setTimeout(spawnHeart, i * 40);
}

/* ---------- step 1: envelope ---------- */
document.getElementById("envelope").addEventListener("click", () => show("question"));

/* ---------- step 2: the question ---------- */
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const sub = document.getElementById("question-sub");
const emoji = document.getElementById("question-emoji");

const noLines = [
  ["Are you sure? 🤨", "😳"],
  ["Like... REALLY sure?", "😟"],
  ["Think about the snacks I buy you 🍫", "🥲"],
  ["I'm telling your mom.", "😤"],
  ["Wrong button, cutie.", "🙃"],
  ["The No button is broken, sorry 🤷", "😌"],
  ["My heart can't take this 💔", "😭"],
  ["Ok now you're just playing with me", "😒"],
  ["Just press Yes already 🙄", "🥺"],
];
let noCount = 0;
let yesScale = 1;

function dodge() {
  noCount++;
  const [line, face] = noLines[Math.min(noCount - 1, noLines.length - 1)];
  sub.textContent = line;
  emoji.textContent = face;

  // Yes button grows, No button shrinks
  yesScale = Math.min(yesScale + 0.25, 3.5);
  yesBtn.style.transform = `scale(${yesScale})`;

  // No button runs away to a random spot
  const rect = noBtn.getBoundingClientRect();
  noBtn.classList.add("runaway");
  const pad = 16;
  const maxX = window.innerWidth - rect.width - pad;
  const maxY = window.innerHeight - rect.height - pad;
  noBtn.style.left = Math.max(pad, Math.random() * maxX) + "px";
  noBtn.style.top = Math.max(pad, Math.random() * maxY) + "px";
  noBtn.style.transform = `scale(${Math.max(1 - noCount * 0.08, 0.5)})`;

  if (noCount >= noLines.length) noBtn.textContent = "Yes 💖";
}

// Desktop: runs away on hover. Phone: runs away on touch.
noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
noBtn.addEventListener("click", (e) => {
  // If she somehow catches it, or it has turned into a Yes
  if (noCount >= noLines.length) return sayYes();
  e.preventDefault();
  dodge();
});

function sayYes() {
  noBtn.style.display = "none";
  show("yes");
  heartBurst(60);
  clearInterval(heartTimer);
  heartTimer = setInterval(spawnHeart, 250);
}
yesBtn.addEventListener("click", sayYes);

/* ---------- step 3: replay ---------- */
document.getElementById("replay").addEventListener("click", () => {
  noCount = 0;
  yesScale = 1;
  yesBtn.style.transform = "";
  noBtn.className = "btn no";
  noBtn.removeAttribute("style");
  noBtn.textContent = "No";
  sub.textContent = "Choose wisely. There is only one correct answer.";
  emoji.textContent = "🥺";
  clearInterval(heartTimer);
  heartTimer = setInterval(spawnHeart, 600);
  show("question");
});
