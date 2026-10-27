(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var ans = item.querySelector('.faq-answer');
      var open = btn.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (o) {
        o.querySelector('.faq-question').classList.remove('open');
        o.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!open) {
        btn.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
  document.querySelectorAll('.faq-answer').forEach(function (a) {
    var q = a.closest('.faq-item').querySelector('.faq-question');
    if (q.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
  });

  if (location.hash && /^#faq-\d+$/.test(location.hash)) {
    var faqItem = document.getElementById(location.hash.slice(1));
    if (faqItem) {
      var fq = faqItem.querySelector('.faq-question');
      var fa = faqItem.querySelector('.faq-answer');
      if (fq && fa) {
        fq.classList.add('open');
        fa.style.maxHeight = fa.scrollHeight + 'px';
      }
    }
  }

  /* ===== Feature carousel + divider width ===== */
  function setDividerWidths() {
    ['dividerTop', 'dividerBottom'].forEach(function (id) {
      var bar = document.getElementById(id) && document.getElementById(id).closest('.features-title-bar');
      if (!bar) return;
      var title = bar.querySelector('h2');
      var divider = document.getElementById(id);
      if (title && divider) divider.style.width = (title.offsetWidth * 1.2) + 'px';
    });
  }
  setDividerWidths();
  window.addEventListener('resize', setDividerWidths);

  var slides = document.querySelectorAll('.carousel-slide');
  var dots = document.querySelectorAll('.carousel-dot');
  var summaryItems = document.querySelectorAll('.features-summary-item');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var current = 0;
  var autoPlayTimer;

  function goToSlide(index) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    if (summaryItems[current]) summaryItems[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    if (summaryItems[current]) summaryItems[current].classList.add('active');
  }
  function nextSlide() { goToSlide((current + 1) % slides.length); }
  function prevSlide() { goToSlide((current - 1 + slides.length) % slides.length); }
  function startAutoPlay() { stopAutoPlay(); if (slides.length > 1) autoPlayTimer = setInterval(nextSlide, 4000); }
  function stopAutoPlay() { clearInterval(autoPlayTimer); }

  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoPlay(); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () { goToSlide(parseInt(dot.dataset.dot)); startAutoPlay(); });
  });

  var carouselWrap = document.getElementById('carouselWrap');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', stopAutoPlay);
    carouselWrap.addEventListener('mouseleave', startAutoPlay);
    var touchStartX = 0;
    carouselWrap.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; });
    carouselWrap.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { if (diff > 0) nextSlide(); else prevSlide(); startAutoPlay(); }
    });
  }
  startAutoPlay();
})();
