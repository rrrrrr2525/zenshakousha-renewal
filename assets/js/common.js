// 共通ヘッダー/フッターの読み込み + ナビ挙動 + テーマ切替
(function () {
  function depthPrefix() {
    // ルートからの深さを見て partials への相対パスを作る（サブディレクトリ対応）
    var path = location.pathname.replace(/\/[^/]*$/, '/');
    var depth = path.split('/').filter(Boolean).length;
    return depth > 0 ? '../'.repeat(depth) : './';
  }

  function highlightActive() {
    var path = location.pathname;
    document.querySelectorAll('nav.main-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href !== '/' && path.indexOf(href) === 0) {
        a.classList.add('active');
      }
    });
  }

  function initNavToggle() {
    var btn = document.getElementById('menu-toggle');
    var nav = document.getElementById('main-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('.nav-item > a.top-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (window.innerWidth <= 860 && a.parentElement.querySelector('.dropdown')) {
          e.preventDefault();
          a.parentElement.classList.toggle('open');
        }
      });
    });
  }

  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var saved = localStorage.getItem('zg-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('zg-theme', next); } catch (e) {}
    });
  }

  function loadPartial(id, file, cb) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(depthPrefix() + 'partials/' + file)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        el.outerHTML = html;
        if (cb) cb();
      })
      .catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadPartial('site-header-slot', 'header.html', function () {
      initNavToggle();
      highlightActive();
      initTheme();
    });
    loadPartial('site-footer-slot', 'footer.html', function () {
      var y = document.getElementById('footer-year');
      if (y) y.textContent = new Date().getFullYear();
    });
  });
})();
