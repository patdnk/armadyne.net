// Theme toggle and stat count-up, shared by every page.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle: override the system preference and remember it.
  var root = document.documentElement;
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : dark.matches;
  }
  function syncThemeColor() {
    var color = isDark() ? '#1b1c1f' : '#f4f5f6';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', color); });
  }
  document.querySelector('.theme-toggle').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeColor();
  });
  if (root.dataset.theme) syncThemeColor();

  // Stats count up once on load.
  if (reduceMotion) return;
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var pad = parseInt(el.dataset.pad || '0', 10);
    var start = performance.now() + 500;
    var duration = 1400;
    function format(v) {
      var t = v.toFixed(decimals);
      while (t.length < pad) t = '0' + t;
      return t;
    }
    el.textContent = format(0);
    function frame(now) {
      var p = Math.min(Math.max((now - start) / duration, 0), 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();
