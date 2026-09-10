(function () {
  'use strict';

  // Hamburger menu toggle
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('mobile-open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  // Header shadow on scroll
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // Language dropdown toggle
  var langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    var trigger = langSwitch.querySelector('.lang-select-trigger');
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = langSwitch.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!langSwitch.contains(e.target)) {
        langSwitch.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

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
    var ctaSection = document.getElementById('cta');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        sticky.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    if (ctaSection) observer.observe(ctaSection);
    else sticky.classList.add('visible');
  }
})();