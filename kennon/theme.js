// Dark (briefing) or light (neutral) theme. Loaded in <head> so the page never flashes.
// Order: ?theme=light|dark, then the viewer's last choice, then dark.
(function () {
  var KEY = "kennon-theme";
  var root = document.documentElement;
  var q = new URLSearchParams(location.search).get("theme");
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  root.setAttribute("data-theme", q === "light" || q === "dark" ? q : saved || "dark");

  window.toggleTheme = function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  };
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("[data-theme-toggle]")) window.toggleTheme();
  });
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === "t" || e.key === "T") window.toggleTheme();
  });
})();
