(function () {
  'use strict';

  // Header menu toggle + language dropdown are handled by the shared HEADER_JS
  // (prepended at build time by build.js), matching the site/podcast header.

  // Sync the homepage language (single-page, localStorage-based) with the
  // blog's current language before navigating to the site root.
  function blogLangToGw(htmlLang) {
    if (htmlLang === 'zh-Hans') return 'zh-CN';
    if (htmlLang === 'zh-Hant') return 'zh-TW';
    return 'en';
  }
  var gwLang = blogLangToGw(document.documentElement.lang);
  document.querySelectorAll('a[href="/"]').forEach(function (a) {
    a.addEventListener('click', function () {
      localStorage.setItem('gw-lang', gwLang);
    });
  });

  // Category filter on blog listing
  var catButtons = document.querySelectorAll('.cat-btn[data-cat]');
  if (catButtons.length) {
    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var cat = btn.getAttribute('data-cat');
        catButtons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        document.querySelectorAll('.article-card[data-cat]').forEach(function (card) {
          if (cat === 'all' || card.getAttribute('data-cat') === cat) card.style.display = '';
          else card.style.display = 'none';
        });
      });
    });
  }

  // Blog search filter
  var searchInput = document.getElementById('blogSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.article-card[data-cat]').forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = text.indexOf(q) === -1 ? 'none' : '';
      });
    });
  }

  // Sticky bottom CTA (article pages only)
  var sticky = document.getElementById('stickyBar');
  if (sticky) {
    var ctaSection = document.querySelector('.site-footer');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        sticky.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    if (ctaSection) observer.observe(ctaSection);
    else sticky.classList.add('visible');
  }
})();