// Shared data logic for index.html and present.html.
// Picks the prospect from ?p=<key> or from the path (/kennon/<key>/...), then fills
// [data-bind], [data-if], [data-list] and [data-href] elements.
(function () {
  var cfg = window.OFFER_CONFIG || { prospects: { default: {} }, coach: {}, links: {} };
  var params = new URLSearchParams(location.search);
  var segs = location.pathname.split("/").filter(Boolean);
  var at = segs.indexOf("kennon");
  var seg = at >= 0 ? segs[at + 1] : null;
  if (seg && /\.html$/.test(seg)) seg = null;
  var key = (params.get("p") || seg || "default").toLowerCase();
  var p = Object.assign({}, cfg.prospects.default || {}, cfg.prospects[key] || {});

  var fmt = function (d) { return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); };
  var sent = p.sentOn ? new Date(p.sentOn + "T12:00:00") : new Date();
  var until = new Date(sent); until.setDate(until.getDate() + (cfg.validDays || 30));
  var coach = cfg.coach || {};
  var coachLine = coach.firm ? coach.name + ", " + coach.firm : coach.name;
  var initials = (p.fullName || "").split(/\s+/).map(function (w) { return w.charAt(0); }).join("").toUpperCase();
  var ref = "QC-" + sent.getFullYear() + String(sent.getMonth() + 1).padStart(2, "0") + (initials ? "-" + initials : "");
  var role = [p.title, p.company].filter(Boolean).join(", ");

  var values = {
    coachLine: coachLine,
    coachName: coach.name,
    firm: coach.firm,
    sentOn: fmt(sent),
    validUntil: fmt(until),
    ref: ref,
    principal: p.fullName || "Leadership Team",
    principalRole: role,
    preparedFor: [p.fullName, role].filter(Boolean).join(" · "),
    initiative: p.initiative,
    heroLede: p.attendedRoundtable && cfg.roundtable
      ? (p.firstName ? p.firstName + ", thank" : "Thank") + " you for joining the " + cfg.roundtable.title + ". This briefing lays out a low-risk way to apply what we discussed to your own leadership team."
      : "A structured path to a leadership team that makes better-aligned decisions and executes with less unnecessary CEO intervention.",
    diagCredit: "Credited in full toward Phase 1 if you continue by " + fmt(until) + ".",
    sessionCredit: "Credited in full toward the CEO Diagnostic if you continue by " + fmt(until) + ".",
    nextHeadline: p.firstName ? p.firstName + ", here is how we start." : "Here is how we start.",
    footerLine: "© " + sent.getFullYear() + " " + (coach.firm || coach.name) + (coach.email ? " · " + coach.email : "")
  };

  function fill(root) {
    root = root || document;
    root.querySelectorAll("[data-bind]").forEach(function (el) {
      var v = values[el.dataset.bind];
      if (v) el.textContent = v;
    });
    root.querySelectorAll("[data-if]").forEach(function (el) {
      var v = p[el.dataset.if];
      if (!v || (Array.isArray(v) && !v.length)) el.classList.add("hidden");
    });
    root.querySelectorAll("[data-list]").forEach(function (el) {
      var tpl = el.dataset.item;
      (p[el.dataset.list] || []).forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        if (tpl) li.setAttribute(tpl, "");
        el.appendChild(li);
      });
    });
    root.querySelectorAll("[data-href]").forEach(function (el) {
      var href = (cfg.links || {})[el.dataset.href];
      if (href) el.href = href;
    });
    if (p.fullName) document.title = document.title + " · " + p.fullName;
  }

  window.OFFER = { cfg: cfg, p: p, key: key, params: params, values: values, fill: fill };
})();
