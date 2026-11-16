// Scroll-Storyline: ein Elfer zieht die grüne Spur über die Stationen Übernehmen, Hochfahren, Übergeben.
// Fahrt, Räder und Spur laufen als CSS-Animation (native Scroll-Timeline, sonst per Animations-Zeitpunkt).
// Das Skript schaltet nur Texte, Punkte und Speedlines.
(() => {
  const BODY = "M14 84 C8 80 5 73 6 66 C7 60 13 55.5 22 52 C32 45 46 34 68 25 C88 17 116 13.5 146 13.5 C156 13.5 164 15 170 18 L202 43 C216 43.6 228 44 240 44.6 C252 45 260 46 268 48.5 C282 52.5 294 58 299 66 C301 72 300 80 295 86 L265 86 A27 27 0 0 0 211 86 L102 86 A27 27 0 0 0 48 86 L20 86 C17 86 15 85.4 14 84 Z";
  const GLASS = "M168 22 L193 41.4 L104 39.6 C95 39.4 89 38.6 85 37.4 C92 29 104 22.5 120 19.5 C134 17.2 150 17 160 17.8 C164 18.5 166 20 168 22 Z";
  const spokes = [0, 1, 2, 3, 4].map((i) => {
    const a = (i * 2 * Math.PI) / 5, s = Math.sin(a), c = Math.cos(a);
    return `M${(25 + 4.5 * s).toFixed(1)} ${(25 - 4.5 * c).toFixed(1)} L${(25 + 12.5 * s).toFixed(1)} ${(25 - 12.5 * c).toFixed(1)}`;
  }).join(" ");
  const WHEEL = `<svg viewBox="0 0 50 50"><circle class="tire" cx="25" cy="25" r="22.8"/><circle class="rim" cx="25" cy="25" r="14"/><path class="spokes" d="${spokes}"/><circle class="hub" cx="25" cy="25" r="3"/></svg>`;
  const CAR = `
<div class="sl-car">
  <span class="speed"><i></i><i></i><i></i></span>
  <svg class="body" viewBox="0 0 306 100" aria-hidden="true">
    <path class="paint" d="${BODY}"/>
    <path class="glass" d="${GLASS}"/>
    <path class="paint" d="M135 17.3 L139 17.3 L135.5 40.4 L131.5 40.3 Z"/>
    <path class="detail" d="M195 45 C196.5 60 196 73 193 85"/>
    <path class="accent" d="M18 63 C80 57.5 200 56.5 290 63"/>
  </svg>
  <span class="wheel rear">${WHEEL}</span>
  <span class="wheel front">${WHEEL}</span>
</div>`;

  // Ab wann eine Station als erreicht gilt (Fortschritt der Sektion)
  const ARRIVE = [0.078, 0.45, 0.82];
  const native = CSS.supports("animation-timeline: view()");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".storyline").forEach((sec) => {
    const pos = sec.querySelector(".sl-carpos");
    pos.innerHTML = CAR;
    const car = pos.querySelector(".sl-car");
    const animated = [pos, sec.querySelector(".sl-trail"), ...pos.querySelectorAll(".wheel")];
    const steps = [...sec.querySelectorAll(".sl-step")];
    const dots = [...sec.querySelectorAll(".sl-dot")];
    if (native) sec.classList.add("timeline");

    let top = 0, span = 1, step = -1, reached = -1, idle;

    const measure = () => {
      top = sec.getBoundingClientRect().top + scrollY;
      span = Math.max(1, sec.offsetHeight - innerHeight);
      // Raddrehung passend zur Strecke: Umdrehungen pro Spurbreite
      const track = pos.clientWidth, wheel = car.offsetWidth * 0.1503;
      sec.style.setProperty("--k", (track / (Math.PI * wheel)).toFixed(3));
    };

    const update = () => {
      const p = Math.min(1, Math.max(0, (scrollY - top) / span));
      const n = p < 0.28 ? 0 : p < 0.56 ? 1 : p < 0.82 ? 2 : 3;
      if (n !== step) {
        step = n;
        steps.forEach((s, i) => s.classList.toggle("on", i === n));
        sec.classList.toggle("final", n === 3);
      }
      const r = ARRIVE.filter((a) => p >= a).length - 1;
      if (r !== reached) { reached = r; dots.forEach((d, i) => d.classList.toggle("on", i <= r)); }
      // Ohne native Scroll-Timeline: Animationen auf den Zeitpunkt p stellen
      if (!native) animated.forEach((el) => (el.style.animationDelay = `${-p}s`));
    };

    if (reduce) {
      sec.classList.add("final");
      steps.forEach((s) => s.classList.add("on"));
      dots.forEach((d) => d.classList.add("on"));
      return;
    }

    let queued = false;
    addEventListener("scroll", () => {
      sec.classList.add("moving");
      clearTimeout(idle);
      idle = setTimeout(() => sec.classList.remove("moving"), 160);
      if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); }
    }, { passive: true });
    addEventListener("resize", () => { measure(); update(); });
    addEventListener("load", () => { measure(); update(); });
    measure(); update();
  });
})();
