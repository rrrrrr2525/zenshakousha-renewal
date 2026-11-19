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

    function closeNav() {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !nav.classList.contains('open');
      nav.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });

    nav.querySelectorAll('.nav-item > a.top-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (a.parentElement.querySelector('.dropdown')) {
          e.preventDefault();
          var isOpen = a.parentElement.classList.toggle('open');
          nav.querySelectorAll('.nav-item').forEach(function (item) {
            if (item !== a.parentElement) item.classList.remove('open');
          });
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
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

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    // 安全策：IO非対応・JS遅延・テスト環境などでも最終的には必ず表示する
    var fallback = setTimeout(function () {
      items.forEach(function (el) { el.classList.add('in'); });
    }, 1800);
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      clearTimeout(fallback);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
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
    initReveal();
  });
})();
