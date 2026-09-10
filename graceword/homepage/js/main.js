let currentLang = localStorage.getItem('gw-lang') || 'en';

function resolveAsset(key) {
  const cfg = window.APP_CONFIG && window.APP_CONFIG.assets;
  return cfg && cfg[key] || '';
}

function resolveLink(key) {
  const cfg = window.APP_CONFIG && window.APP_CONFIG.links;
  return cfg && cfg[key] || '#';
}

function loadImage(el) {
  const src = el.getAttribute('data-src');
  if (src && !el.hasAttribute('src')) {
    el.setAttribute('src', src);
  }
}

function applyConfig() {
  document.querySelectorAll('[data-asset-key]').forEach(el => {
    const key = el.getAttribute('data-asset-key');
    const url = resolveAsset(key);
    if (!url) return;
    if (el.tagName === 'IMG') {
      // Carousel images: defer via data-src; others: load immediately
      if (el.classList.contains('banner-img') || el.closest('.quiz-card')) {
        el.setAttribute('data-src', url);
      } else {
        el.setAttribute('src', url);
      }
    } else if (el.tagName === 'SOURCE') {
      el.setAttribute('srcset', url);
    } else if (el.style) {
      el.style.backgroundImage = `url('${url}')`;
    }
  });
  document.querySelectorAll('[data-link-key]').forEach(el => {
    const key = el.getAttribute('data-link-key');
    const url = resolveLink(key);
    if (url && el.tagName === 'A') {
      el.setAttribute('href', url);
    }
  });
}

function t(key) {
  return i18n[currentLang][key] || key;
}

function applyTranslation() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerHTML = t(key);
  });
  // Recalculate open FAQ answer heights after content changes
  document.querySelectorAll('.faq-question.open').forEach(btn => {
    const answer = btn.nextElementSibling;
    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
  });
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('gw-lang', lang);
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  const label = document.querySelector('.lang-current');
  if (label) {
    label.textContent = lang === 'zh-CN' ? '简体' : lang === 'zh-TW' ? '繁体' : 'EN';
    label.dataset.lang = lang;
  }
  applyTranslation();
  updateBanners(lang);
}

function updateBanners(lang) {
  const banners = window.APP_CONFIG && window.APP_CONFIG.assets && window.APP_CONFIG.assets.banners;
  if (!banners || !banners[lang]) return;
  const list = banners[lang];
  document.querySelectorAll('.banner-img').forEach((img, i) => {
    if (list[i]) {
      img.setAttribute('data-src', list[i]);
      img.setAttribute('src', list[i]); // update src immediately for lang switch
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  setLang(currentLang);

  // Language dropdown
  const trigger = document.querySelector('.lang-select-trigger');
  const dropdown = document.querySelector('.lang-dropdown');
  if (trigger && dropdown) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
  }
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.lang);
      if (dropdown) dropdown.classList.remove('open');
    });
  });

  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.getElementById('headerNav');
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', () => {
      headerNav.classList.toggle('open');
    });
    document.querySelectorAll('#headerNav a, #headerNav .lang-option').forEach(el => {
      el.addEventListener('click', () => headerNav.classList.remove('open'));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Banner carousel
  const bannerTrack = document.querySelector('.banner-track');
  const prevBtn = document.querySelector('.banner-prev');
  const nextBtn = document.querySelector('.banner-next');
  if (bannerTrack && prevBtn && nextBtn) {
    let bannerIndex = 0;
    const totalBanners = document.querySelectorAll('.banner-slide').length;
    function loadBannerSlides() {
      document.querySelectorAll('.banner-slide').forEach((slide, i) => {
        const img = slide.querySelector('.banner-img');
        if (img && Math.abs(i - bannerIndex) <= 1) loadImage(img);
      });
    }
    const updateBannerNav = () => {
      bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;
      loadBannerSlides();
    };
    prevBtn.addEventListener('click', () => {
      bannerIndex = (bannerIndex - 1 + totalBanners) % totalBanners;
      updateBannerNav();
    });
    nextBtn.addEventListener('click', () => {
      bannerIndex = (bannerIndex + 1) % totalBanners;
      updateBannerNav();
    });
  }

  // Quiz carousel - infinite loop with lazy loading
  const quizTrack = document.querySelector('.quiz-track');
  const quizPrev = document.querySelector('.quiz-prev');
  const quizNext = document.querySelector('.quiz-next');
  if (quizTrack && quizPrev && quizNext) {
    let quizIndex = 0;
    const totalCards = document.querySelectorAll('.quiz-card').length;
    const gap = 20;
    const getStep = () => (window.innerWidth > 768 ? 220 : 160) + gap;
    const getVisible = () => window.innerWidth > 768 ? 4 : 2;
    const maxIndex = () => Math.max(0, totalCards - getVisible());
    function loadVisibleQuizCards() {
      const v = getVisible();
      document.querySelectorAll('.quiz-card').forEach((card, i) => {
        const img = card.querySelector('img');
        if (img && i >= quizIndex - 1 && i <= quizIndex + v) loadImage(img);
      });
    }
    const updateQuizNav = () => {
      quizTrack.style.transform = `translateX(${quizIndex * getStep() * -1}px)`;
      loadVisibleQuizCards();
    };
    quizPrev.addEventListener('click', () => {
      quizIndex = quizIndex === 0 ? maxIndex() : quizIndex - 1;
      updateQuizNav();
    });
    quizNext.addEventListener('click', () => {
      quizIndex = quizIndex >= maxIndex() ? 0 : quizIndex + 1;
      updateQuizNav();
    });
    window.addEventListener('resize', () => {
      const m = maxIndex();
      if (quizIndex > m) quizIndex = 0;
      updateQuizNav();
    });
    updateQuizNav();
  }

  // Testimonial card selection
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.testimonial-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    const answer = btn.nextElementSibling;
    if (btn.classList.contains('open')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
    btn.addEventListener('click', () => {
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);
      document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('open'));
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.classList.add('open');
      }
    });
  });

  // Touch swipe for carousels
  function addTouchSwipe(el, onSwipeLeft, onSwipeRight) {
    let startX = 0;
    el.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].screenX - startX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? onSwipeRight() : onSwipeLeft();
      }
    }, { passive: true });
  }
  const bannerContainer = document.querySelector('.carousel-container');
  if (bannerContainer && prevBtn && nextBtn) {
    addTouchSwipe(bannerContainer, () => nextBtn.click(), () => prevBtn.click());
  }
  const quizContainer = document.querySelector('.quiz-carousel');
  if (quizContainer && quizPrev && quizNext) {
    addTouchSwipe(quizContainer, () => quizNext.click(), () => quizPrev.click());
  }

  // Quiz take button
  document.querySelector('.quiz-take-btn')?.addEventListener('click', () => {
    const url = resolveLink('quiz');
    if (url) window.open(url, '_blank');
  });

  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Active nav link on scroll
  const navLinks = document.querySelectorAll('#headerNav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' });
  sections.forEach(s => navObserver.observe(s));
});
