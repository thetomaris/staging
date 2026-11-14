/*
  Draft review mode for the conversation with Miranda.
  Shows yellow notes next to everything that still needs her decision,
  a panel with all open questions, and a switch between three design directions.

  Off switch: set reviewMode: false in config.js (or remove this file before launch).
  Clean view without notes: add ?clean or #clean to a URL (stays on while browsing,
  ?review or #review brings the notes back). Other look: add ?direction=b or #direction-b.
*/
(function () {
  'use strict';

  var cfg = window.MLC_CONFIG || {};
  var params = new URLSearchParams(window.location.search);
  var hash = window.location.hash;
  var clean = params.has('clean') || hash === '#clean';
  try {
    if (clean) window.sessionStorage.setItem('mlc-clean', '1');
    else if (params.has('review') || hash === '#review') window.sessionStorage.removeItem('mlc-clean');
    clean = clean || window.sessionStorage.getItem('mlc-clean') === '1';
  } catch (e) { /* storage blocked */ }
  if (cfg.reviewMode === false || clean) return;

  var root = document.documentElement;
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  var QUESTIONS = [
    { id: 1, t: 'Lead name', d: '"Miranda Conlon" leads and "MLC Coaching" sits underneath. Or would you prefer it the other way around?', p: ['index.html'] },
    { id: 2, t: '"Good humans" as the big idea', d: '"Good humans" is your phrase. The headline, the manifesto lines and the wording of what you look for in clients are our draft. Happy with them, and what would you change?', p: ['index.html', 'good-humans.html', 'about.html'] },
    { id: 3, t: 'Audience and order', d: 'Individuals first, organizations second. Is that the right order for you?', p: ['index.html'] },
    { id: 4, t: 'Prices on the site', d: 'Hidden for now: you share prices on the call, together with one recommendation. Would you like them on the site?', p: ['coaching.html'] },
    { id: 5, t: 'Format names', d: 'Power Engagement, coaching package, ongoing partnership, booster session: OK to show these names? And which formats include unlimited messages between sessions?', p: ['index.html', 'coaching.html'] },
    { id: 6, t: 'Testimonials', d: 'Only the three quotes already on your current site are used. Would you like to share more, maybe one from a sponsor?', p: ['index.html', 'organizations.html'] },
    { id: 7, t: 'Photos', d: 'These are the two portraits from your current site. Keep them, or plan a new, more personal shoot?', p: ['index.html', 'about.html'] },
    { id: 8, t: 'Booking link', d: 'Your Calendly link for the free clarity call, and how long the call is.', p: ['contact.html'] },
    { id: 9, t: 'Team size', d: 'Your current site says teams of up to 250; the podcast says 200. Which number is right?', p: ['index.html', 'about.html'] },
    { id: 10, t: 'Founding moment', d: 'A friend asked "Why aren\'t you a coach?" and you started your business that day. OK to tell it in this short form?', p: ['about.html'] },
    { id: 11, t: 'Work and life quote', d: 'You said "I don\'t think you can talk about work without talking about life, and vice versa" on Nov. 13. OK to quote you word for word?', p: ['about.html', 'good-humans.html'] },
    { id: 12, t: 'Sponsors and confidentiality', d: 'What should sponsors hear about the coaching, and how would you word confidentiality?', p: ['organizations.html'] },
    { id: 13, t: 'Form and hosting', d: 'Where should the finished site live, who has access to your domain, and where should form messages go?', p: ['contact.html'] },
    { id: 14, t: 'Logo and start year', d: 'Keep the MLC script mark ("Est. 2024") or use the new wordmark? And did your business start in 2024 or 2025?', p: ['index.html'] }
  ];

  var DIRECTIONS = [
    { id: 'a', name: 'A · Warm and personal', note: 'Plum, raspberry, cream. Grows out of your current colors.', sw: ['#FBF6F0', '#4E2A4F', '#B8354A'] },
    { id: 'b', name: 'B · Refined and high-end', note: 'Ink, bordeaux, porcelain. Quiet confidence with a warm touch.', sw: ['#FBFAF8', '#1C1719', '#7B2335'] }
  ];

  var page = (window.location.pathname.split('/').pop() || 'index.html');
  if (page.indexOf('.html') === -1) page = 'index.html';
  var byId = {};
  QUESTIONS.forEach(function (q) { byId[q.id] = q; });

  /* Styles for review mode */
  var self = document.querySelector('script[src*="assets/js/review.js"]');
  var version = self && self.getAttribute('src').indexOf('?') !== -1 ? '?' + self.getAttribute('src').split('?')[1] : '';
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'assets/css/review.css' + version;
  document.head.appendChild(css);

  /* Notes on or off */
  var notesOn = store.get('mlc-notes') !== '0';
  function setNotes(on) {
    notesOn = on;
    root.classList.toggle('review-on', on);
    store.set('mlc-notes', on ? '1' : '0');
    var sw = document.getElementById('rv-notes');
    if (sw) sw.checked = on;
  }
  setNotes(notesOn);

  /* Tooltips on every flag */
  Array.prototype.forEach.call(document.querySelectorAll('.flag[data-q]'), function (flag) {
    var q = byId[flag.getAttribute('data-q')];
    if (q) flag.title = 'Q' + q.id + ' · ' + q.t + ': ' + q.d;
  });

  /* Current direction */
  function currentDirection() { return root.getAttribute('data-direction') || 'a'; }
  function setDirection(id) {
    if (window.MLC_applyDirection) window.MLC_applyDirection(id);
    store.set('mlc-direction', id);
    Array.prototype.forEach.call(document.querySelectorAll('.rv__dir'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-dir') === id ? 'true' : 'false');
    });
  }

  /* Panel */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var hereCount = QUESTIONS.filter(function (q) { return document.querySelector('.flag[data-q="' + q.id + '"]'); }).length;

  var html = '';
  html += '<button class="rv__pill" type="button" aria-expanded="false" aria-controls="rv-panel">';
  html += '<span class="rv__pill-dot" aria-hidden="true"></span>Draft v1 <small>' + QUESTIONS.length + ' open questions</small></button>';
  html += '<div class="rv__panel" id="rv-panel" role="dialog" aria-label="Review panel">';
  html += '<div class="rv__head"><div><div class="rv__title">Website draft v1</div><div class="rv__sub">For your review · prepared by My Coach Path</div></div>';
  html += '<button class="rv__close" type="button" aria-label="Close review panel">&times;</button></div>';
  html += '<div class="rv__sec"><label class="rv__switch"><span>Show review notes</span><input id="rv-notes" type="checkbox"' + (notesOn ? ' checked' : '') + '></label></div>';
  html += '<div class="rv__sec"><p class="rv__h">Design direction</p><div class="rv__dirs">';
  DIRECTIONS.forEach(function (d) {
    html += '<button class="rv__dir" type="button" data-dir="' + d.id + '" aria-pressed="' + (currentDirection() === d.id ? 'true' : 'false') + '">';
    html += '<span class="rv__sw" aria-hidden="true">' + d.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>';
    html += '<strong>' + esc(d.name) + '</strong><span>' + esc(d.note) + '</span></button>';
  });
  html += '</div></div>';
  html += '<div class="rv__sec"><p class="rv__h">Open questions <span class="rv__count">' + hereCount + ' on this page</span></p><ol class="rv__qs">';
  QUESTIONS.forEach(function (q) {
    var here = !!document.querySelector('.flag[data-q="' + q.id + '"]');
    var target = here ? '#q-' + q.id : q.p[0] + '#q-' + q.id;
    html += '<li><a class="rv__q' + (here ? ' is-here' : '') + '" href="' + target + '" data-q="' + q.id + '">';
    html += '<b>Q' + q.id + '</b><span><strong>' + esc(q.t) + '</strong> ' + esc(q.d);
    html += '<small>' + (here ? 'On this page · click to jump' : 'See ' + esc(q.p[0].replace('.html', '').replace('index', 'home'))) + '</small></span></a></li>';
  });
  html += '</ol></div>';
  html += '<div class="rv__foot"><a href="#clean" data-clean>View without review notes</a><span>Draft · not live</span></div>';
  html += '</div>';

  var panel = document.createElement('div');
  panel.className = 'rv';
  panel.setAttribute('data-open', 'false');
  panel.innerHTML = html;
  document.body.appendChild(panel);

  var pill = panel.querySelector('.rv__pill');
  function setOpen(open) {
    panel.setAttribute('data-open', open ? 'true' : 'false');
    pill.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  pill.addEventListener('click', function () { setOpen(panel.getAttribute('data-open') !== 'true'); });
  panel.querySelector('.rv__close').addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  document.getElementById('rv-notes').addEventListener('change', function (e) { setNotes(e.target.checked); });
  Array.prototype.forEach.call(panel.querySelectorAll('.rv__dir'), function (b) {
    b.addEventListener('click', function () { setDirection(b.getAttribute('data-dir')); });
  });
  panel.querySelector('[data-clean]').addEventListener('click', function (e) {
    e.preventDefault();
    try { window.sessionStorage.setItem('mlc-clean', '1'); } catch (err) { /* storage blocked */ }
    window.location.hash = 'clean';
    window.location.reload();
  });

  /* Jump to a note on this page */
  function jump(id) {
    var flag = document.querySelector('.flag[data-q="' + id + '"]');
    if (!flag) return false;
    if (!notesOn) setNotes(true);
    var revealParent = flag.closest('.reveal');
    if (revealParent) revealParent.classList.remove('is-pending');
    flag.scrollIntoView({ behavior: 'smooth', block: 'center' });
    flag.classList.remove('is-pulsing');
    void flag.offsetWidth;
    flag.classList.add('is-pulsing');
    return true;
  }
  Array.prototype.forEach.call(panel.querySelectorAll('.rv__q.is-here'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      jump(a.getAttribute('data-q'));
      if (window.innerWidth < 760) setOpen(false);
    });
  });
  var m = /^#q-(\d+)$/.exec(window.location.hash);
  if (m) window.setTimeout(function () { jump(m[1]); }, 400);

  /* Open the panel once on the very first visit, so nobody misses it */
  if (!store.get('mlc-rv-seen')) {
    store.set('mlc-rv-seen', '1');
    window.setTimeout(function () { setOpen(true); }, 1400);
  }
})();
