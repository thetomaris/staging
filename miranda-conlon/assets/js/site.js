/* Miranda Conlon · site behavior. No dependencies. */
(function () {
  'use strict';

  var cfg = window.MLC_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* Header shadow once the page scrolls */
  var header = $('[data-header]');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile navigation */
  var toggle = $('.nav-toggle');
  var nav = $('#site-nav');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020) setNav(false); });
  }

  /* Stagger cards that sit in the same grid */
  $$('.grid, .testimonials, .steps, .formats, .mini-grid, .facts, .traits, .stats').forEach(function (parent) {
    var i = 0;
    Array.prototype.forEach.call(parent.children, function (child) {
      if (child.classList.contains('reveal') && !child.style.getPropertyValue('--d')) {
        child.style.setProperty('--d', (i * 0.08).toFixed(2) + 's');
        i += 1;
      }
    });
  });

  /* Reveal on scroll. Everything is visible at rest; only elements that start
     below the fold are hidden first and fade in when they reach the screen. */
  var foldLine = window.innerHeight * 0.92;
  var reveals = $$('.reveal');
  if (hasIO && !reduceMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          revealIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top > foldLine) {
        el.classList.add('is-pending');
        revealIO.observe(el);
      }
    });
  }

  /* Count-up numbers */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    var start = null;
    var duration = 1500;
    var done = false;
    function format(n) { return Math.round(n).toLocaleString('en-US') + suffix; }
    function step(ts) {
      if (done) return;
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = format(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) window.requestAnimationFrame(step); else done = true;
    }
    window.requestAnimationFrame(step);
    /* Animation frames pause in background tabs; make sure the real number always lands */
    window.setTimeout(function () { done = true; el.textContent = format(target); }, duration + 200);
  }
  var counters = $$('[data-count]');
  if (counters.length && hasIO && !reduceMotion) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); countIO.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  /* Manifesto lines below the fold start dimmed and light up at the reading line */
  var lines = $$('.manifesto-lines li, .manifesto__item');
  if (lines.length && hasIO && !reduceMotion) {
    var lineIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.remove('is-dim'); lineIO.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0.4 });
    lines.forEach(function (el) {
      if (el.getBoundingClientRect().top > foldLine) {
        el.classList.add('is-dim');
        lineIO.observe(el);
      }
    });
  }

  /* Safety net: whatever is on screen (or already scrolled past) is always shown,
     even if the observers above are throttled, for example in a background tab. */
  function showInView() {
    var vh = window.innerHeight;
    reveals.forEach(function (el) {
      if (el.classList.contains('is-pending') && el.getBoundingClientRect().top < vh * 0.95) el.classList.remove('is-pending');
    });
    lines.forEach(function (el) {
      if (el.classList.contains('is-dim') && el.getBoundingClientRect().top < vh * 0.75) el.classList.remove('is-dim');
    });
  }
  var safetyTimer = null;
  window.addEventListener('scroll', function () {
    window.clearTimeout(safetyTimer);
    safetyTimer = window.setTimeout(showInView, 120);
  }, { passive: true });
  window.addEventListener('load', function () { window.setTimeout(showInView, 300); });

  /* "What's on your plate?" picker */
  $$('[data-picker]').forEach(function (picker) {
    var options = $$('[data-pick]', picker);
    var panels = $$('.picker__panel', picker);
    function select(opt, focus) {
      var id = opt.getAttribute('aria-controls');
      options.forEach(function (o) { o.setAttribute('aria-pressed', o === opt ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.id === id); });
      if (focus) opt.focus();
    }
    options.forEach(function (opt, i) {
      opt.addEventListener('click', function () {
        select(opt);
        if (window.innerWidth < 900) {
          var panel = document.getElementById(opt.getAttribute('aria-controls'));
          if (panel) panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        }
      });
      opt.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = options[(i + 1) % options.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = options[(i - 1 + options.length) % options.length];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  /* Sticky booking button on phones: visible after the hero, hidden near other CTAs */
  var mobileCta = $('[data-mobile-cta]');
  if (mobileCta && document.body.classList.contains('page-contact')) {
    mobileCta.remove();
    mobileCta = null;
  }
  if (mobileCta && hasIO) {
    var heroEl = $('.hero, .page-hero, .simple-page');
    var pastHero = !heroEl;
    var visibleCtas = new Set();
    var updateCta = function () { mobileCta.classList.toggle('is-visible', pastHero && visibleCtas.size === 0); };
    if (heroEl) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        updateCta();
      }).observe(heroEl);
    }
    var ctaIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) visibleCtas.add(e.target); else visibleCtas.delete(e.target); });
      updateCta();
    });
    $$('.cta-panel, .site-footer').forEach(function (el) { ctaIO.observe(el); });
  }

  /* Live local time on the contact page */
  var clock = $('[data-local-time]');
  if (clock && window.Intl && Intl.DateTimeFormat) {
    try {
      var tz = cfg.timeZone || 'America/New_York';
      var fmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit', timeZone: tz });
      var tick = function () { clock.textContent = fmt.format(new Date()).replace(' at ', ', ') + ' ET'; };
      tick();
      window.setInterval(tick, 30000);
    } catch (e) { /* keep the static fallback text */ }
  }

  /* Booking calendar */
  var booking = $('[data-booking]');
  if (booking && cfg.bookingUrl) {
    var url = cfg.bookingUrl;
    var frame = document.createElement('iframe');
    frame.className = 'booking__frame';
    frame.title = 'Book a free clarity call with Miranda';
    frame.loading = 'lazy';
    frame.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'hide_gdpr_banner=1&embed_type=Inline&embed_domain=' + encodeURIComponent(window.location.hostname || 'localhost');
    booking.innerHTML = '';
    booking.appendChild(frame);
  }

  /* Contact form: it only submits on the live site (Netlify Forms).
     Everywhere else (local preview, staging link) it explains that instead. */
  $$('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var host = window.location.hostname;
      var isLive = /(^|\.)mirandaconlon\.com$/.test(host) || /\.netlify\.app$/.test(host);
      if (isLive) return;
      e.preventDefault();
      var status = $('.form__status', form);
      if (status) {
        status.textContent = 'Preview: the form gets connected once the site is live. Until then, please email miranda@mirandaconlon.com.';
        status.classList.add('is-visible');
      }
    });
  });

  /* Footer year */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
