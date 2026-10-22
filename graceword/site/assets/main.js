(function () {
  'use strict';

  // Keep the blog/podcast language in sync with the language link clicked here.
  var map = { en: 'en', 'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW' };
  function langFromPath() {
    var seg = location.pathname.split('/').filter(Boolean)[0];
    return map[seg] || 'en';
  }
  document.querySelectorAll('.lang-option').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('gw-lang', langFromPath()); } catch (e) {}
    });
  });

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Banner carousel
  var bannerTrack = document.querySelector('.banner-track');
  var prevBtn = document.querySelector('.banner-prev');
  var nextBtn = document.querySelector('.banner-next');
  if (bannerTrack && prevBtn && nextBtn) {
    var bannerIndex = 0;
    var totalBanners = document.querySelectorAll('.banner-slide').length;
    function updateBannerNav() {
      bannerTrack.style.transform = 'translateX(-' + bannerIndex * 100 + '%)';
    }
    prevBtn.addEventListener('click', function () {
      bannerIndex = (bannerIndex - 1 + totalBanners) % totalBanners;
      updateBannerNav();
    });
    nextBtn.addEventListener('click', function () {
      bannerIndex = (bannerIndex + 1) % totalBanners;
      updateBannerNav();
    });
  }

  // Quiz carousel
  var quizTrack = document.querySelector('.quiz-track');
  var quizPrev = document.querySelector('.quiz-prev');
  var quizNext = document.querySelector('.quiz-next');
  if (quizTrack && quizPrev && quizNext) {
    var quizIndex = 0;
    var totalCards = document.querySelectorAll('.quiz-card').length;
    var gap = 20;
    function getStep() { return (window.innerWidth > 768 ? 337 : 172) + gap; }
    function getVisible() { return window.innerWidth > 768 ? 4 : 2; }
    function maxIndex() { return Math.max(0, totalCards - getVisible()); }
    function updateQuizNav() {
      quizTrack.style.transform = 'translateX(' + quizIndex * getStep() * -1 + 'px)';
    }
    quizPrev.addEventListener('click', function () {
      quizIndex = quizIndex === 0 ? maxIndex() : quizIndex - 1;
      updateQuizNav();
    });
    quizNext.addEventListener('click', function () {
      quizIndex = quizIndex >= maxIndex() ? 0 : quizIndex + 1;
      updateQuizNav();
    });
    window.addEventListener('resize', function () {
      var m = maxIndex();
      if (quizIndex > m) quizIndex = 0;
      updateQuizNav();
    });
    updateQuizNav();
  }

  // Touch swipe for carousels
  function addTouchSwipe(el, onLeft, onRight) {
    var startX = 0;
    el.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].screenX; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].screenX - startX;
      if (Math.abs(diff) > 50) { diff > 0 ? onRight() : onLeft(); }
    }, { passive: true });
  }
  var bannerContainer = document.querySelector('.carousel-container');
  if (bannerContainer && prevBtn && nextBtn) addTouchSwipe(bannerContainer, function () { nextBtn.click(); }, function () { prevBtn.click(); });
  var quizContainer = document.querySelector('.quiz-carousel');
  if (quizContainer && quizPrev && quizNext) addTouchSwipe(quizContainer, function () { quizNext.click(); }, function () { quizPrev.click(); });

  // Testimonial card selection
  document.querySelectorAll('.testimonial-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.testimonial-card').forEach(function (c) { c.classList.remove('active'); });
      card.classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    var answer = btn.nextElementSibling;
    if (btn.classList.contains('open')) answer.style.maxHeight = answer.scrollHeight + 'px';
    btn.addEventListener('click', function () {
      var isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      document.querySelectorAll('.faq-answer').forEach(function (a) { a.style.maxHeight = null; });
      document.querySelectorAll('.faq-question').forEach(function (q) { q.classList.remove('open'); });
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.classList.add('open');
      }
    });
  });

  // Scroll reveal
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
})();

/* Pricing: highlight the visitor's region card */
(function () {
  var dataEl = document.getElementById('pricingData');
  if (!dataEl) return;
  var cards = document.querySelectorAll('.price-card[data-region]');
  if (!cards.length) return;
  var cc = 'US';
  try {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Hong_Kong') cc = 'HK';
    else if (tz === 'Asia/Taipei') cc = 'TW';
    else if (tz.indexOf('America/') === 0 || tz.indexOf('US/') === 0) cc = 'US';
  } catch (e) {}
  cards.forEach(function (c) {
    c.classList.toggle('active', c.getAttribute('data-region') === cc);
  });
})();

/* Promo: send email to receive invite code via /web/subscribe (promote: true) */
(function () {
  var form = document.getElementById('promoForm');
  if (!form) return;
  var input = form.querySelector('input[type=email]');
  var btn = form.querySelector('button[type=submit]');
  var msg = form.parentNode.querySelector('.newsletter-msg');
  var cfg = document.getElementById('promoData');
  var endpoint = '/web/subscribe';
  try { if (cfg) endpoint = JSON.parse(cfg.textContent).endpoint || endpoint; } catch (e) {}
  var langMap = { 'en': 'en', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW' };
  var lang = langMap[document.documentElement.lang] || 'en';
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function show(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = 'newsletter-msg promo-msg' + (ok ? ' ok' : ' err');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (input.value || '').trim();
    if (!re.test(email)) {
      show(form.getAttribute('data-invalid'), false);
      input.focus();
      return;
    }
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (err) { tz = ''; }
    btn.disabled = true;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, tz: tz, lang: lang, promote: true })
    }).then(function (res) {
      if (res.ok) {
        show(form.getAttribute('data-ok'), true);
        input.value = '';
      } else {
        res.json().catch(function () { return null; }).then(function (j) {
          var m = j && typeof j.msg === 'string' && j.msg.trim() ? j.msg : '';
          show(m || form.getAttribute('data-err'), false);
        });
      }
    }).catch(function () {
      show(form.getAttribute('data-err'), false);
    }).finally(function () {
      btn.disabled = false;
    });
  });
})();
