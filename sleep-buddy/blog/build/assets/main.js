(function () {
  'use strict';

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
