// Ein einziger Buchungslink für die ganze Seite.
// Buchungstool ist noch offen: sobald es feststeht, nur diese Zeile ändern.
const BOOKING_URL = "#termin";

document.querySelectorAll("[data-book]").forEach((a) => { a.href = BOOKING_URL; });
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Menü mobil
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Schließen" : "Menü";
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

// Einblenden beim Scrollen
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
document.querySelectorAll(".reveal, .mark, .chapter, .lines li, .path, [data-count]").forEach((el) => io.observe(el));

// Zahlen zählen hoch
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    counter.unobserve(e.target);
    const el = e.target, end = Number(el.dataset.count);
    if (calm) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => counter.observe(el));

// Statement: Wörter leuchten beim Scrollen nacheinander auf
document.querySelectorAll(".words").forEach((block) => {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) { frag.append(part); return; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.append(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(block);
});
const words = [...document.querySelectorAll(".words")];

// Header-Linie, Wörter, Parallax beim Scrollen
const header = document.querySelector(".site-header");
const heroImg = document.querySelector(".hero-photo img");
let ticking = false;
const onScroll = () => {
  ticking = false;
  const y = window.scrollY, vh = window.innerHeight;
  header && header.classList.toggle("scrolled", y > 8);
  words.forEach((block) => {
    const r = block.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const ws = block.querySelectorAll(".w"), lit = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle("on", calm || i < lit));
  });
  if (heroImg && !calm) heroImg.style.transform = `scale(1.08) translateY(${Math.min(y, vh) * 0.06}px)`;
};
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Stimmen: wechseln automatisch, Punkte zum Umschalten
document.querySelectorAll("[data-voices]").forEach((wrap) => {
  const items = [...wrap.querySelectorAll(".voices > figure")];
  const dots = wrap.querySelector(".voice-dots");
  if (items.length < 2 || !dots) return;
  let i = 0, timer;
  const show = (n) => {
    i = n;
    items.forEach((f, k) => f.classList.toggle("active", k === i));
    [...dots.children].forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
  };
  items.forEach((_, k) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", `Stimme ${k + 1}`);
    b.addEventListener("click", () => { show(k); clearInterval(timer); });
    dots.append(b);
  });
  show(0);
  if (!calm) timer = setInterval(() => show((i + 1) % items.length), 7000);
});
