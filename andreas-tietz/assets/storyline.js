// Scroll-Storyline: ein Auto fährt über die drei Stationen Übernehmen, Hochfahren, Übergeben.
// Varianten über data-variant: a (fährt mit), b (drei Etappen), c (vom Entwurf zur Serie), d (zieht die Spur).
(() => {
  const CAR = `
<svg viewBox="0 0 310 100" aria-hidden="true">
  <path class="car-fill" d="M18 76 C11 70 10 58 15 52 C24 45 42 41 60 39 C80 35 98 21 120 15 C132 12 146 12 156 14 C170 17 182 25 192 33 C206 33 224 31 240 34 C256 37 270 43 280 50 C289 56 292 64 290 72 L287 76 L254 76 A24 24 0 0 0 204 76 L104 76 A24 24 0 0 0 54 76 Z"/>
  <path class="car-line" pathLength="1" d="M18 76 C11 70 10 58 15 52 C24 45 42 41 60 39 C80 35 98 21 120 15 C132 12 146 12 156 14 C170 17 182 25 192 33 C206 33 224 31 240 34 C256 37 270 43 280 50 C289 56 292 64 290 72 L287 76 L254 76 A24 24 0 0 0 204 76 L104 76 A24 24 0 0 0 54 76 Z"/>
  <path class="car-line car-glass" pathLength="1" d="M100 31 C108 24 120 19 132 17 C144 16 154 17 162 19 C172 22 180 27 186 32 L104 33 C99 33 97 32 100 31 Z"/>
  <path class="car-line" pathLength="1" d="M150 17 L148 33"/>
  <path class="car-accent" d="M22 60 C80 56 200 54 284 58"/>
  <g class="wheel"><circle cx="79" cy="78" r="18"/><circle cx="79" cy="78" r="11"/><path d="M79.0 74.5 L79.0 69.0 M82.3 76.9 L87.6 75.2 M81.1 80.8 L84.3 85.3 M76.9 80.8 L73.7 85.3 M75.7 76.9 L70.4 75.2"/><circle class="hub" cx="79" cy="78" r="2.5"/></g>
  <g class="wheel"><circle cx="229" cy="78" r="18"/><circle cx="229" cy="78" r="11"/><path d="M229.0 74.5 L229.0 69.0 M232.3 76.9 L237.6 75.2 M231.1 80.8 L234.3 85.3 M226.9 80.8 L223.7 85.3 M225.7 76.9 L220.4 75.2"/><circle class="hub" cx="229" cy="78" r="2.5"/></g>
</svg>
<span class="speed" aria-hidden="true"><i></i><i></i><i></i></span>`;

  const STATIONS = [0.12, 0.5, 0.88];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".storyline").forEach((sec) => {
    const variant = sec.dataset.variant || "a";
    const track = sec.querySelector(".sl-track");
    const car = sec.querySelector(".sl-car");
    const trail = sec.querySelector(".sl-trail");
    const steps = [...sec.querySelectorAll(".sl-step")];
    const dots = [...sec.querySelectorAll(".sl-dot")];
    car.innerHTML = CAR;
    const wheels = [...car.querySelectorAll(".wheel")];
    const smooth = { a: 0.18, b: 0.055, c: 0.14, d: 0.18 }[variant] || 0.18;

    let x = 0, target = 0, step = -1, running = false, last = 0;

    const progress = () => {
      const r = sec.getBoundingClientRect();
      const span = r.height - innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
    };
    const stepOf = (p) => (p < 0.28 ? 0 : p < 0.56 ? 1 : p < 0.82 ? 2 : 3);

    const setStep = (n) => {
      if (n === step) return;
      step = n;
      sec.dataset.step = n;
      steps.forEach((s, i) => s.classList.toggle("on", i === n));
      sec.classList.toggle("final", n === 3);
      dots.forEach((d, i) => d.classList.toggle("on", i <= Math.min(n, 2)));
    };

    const targetFor = (p, n) => {
      if (n === 3) return 1.2; // fährt aus dem Bild
      if (variant === "b") return STATIONS[n];
      // stetig von Station 1 bis Station 3
      const t = Math.min(1, p / 0.82);
      return STATIONS[0] + (STATIONS[2] - STATIONS[0]) * t;
    };

    const render = () => {
      const w = track.clientWidth, cw = car.offsetWidth;
      const px = x * w - cw / 2;
      const dx = Math.abs(px - last); last = px;
      car.style.transform = `translate3d(${px}px,0,0)`;
      const r = cw * 18 / 310;
      const deg = (px / (2 * Math.PI * r)) * 360;
      wheels.forEach((g) => (g.style.transform = `rotate(${deg}deg)`));
      car.style.setProperty("--speed", Math.min(1, dx / 6).toFixed(2));
      if (trail) trail.style.transform = `scaleX(${Math.max(0, Math.min(1, x))})`;
      if (variant === "c") {
        // Station 1: Strich entsteht, Station 2: fertige Linie, Station 3: Serie
        const p = progress();
        sec.style.setProperty("--draw", Math.min(1, p / 0.28).toFixed(3));
      }
    };

    const tick = () => {
      const p = progress(), n = stepOf(p);
      setStep(n);
      target = targetFor(p, n);
      x += (target - x) * smooth;
      if (Math.abs(target - x) < 0.0005) x = target;
      render();
      if (running) requestAnimationFrame(tick);
    };

    if (reduce) {
      setStep(3); x = STATIONS[2]; sec.style.setProperty("--draw", 1); render();
      return;
    }
    x = STATIONS[0] - 0.25;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
      else if (!e.isIntersecting) running = false;
    }).observe(sec);
    addEventListener("resize", render);
  });
})();
