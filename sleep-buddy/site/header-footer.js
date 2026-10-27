'use strict';

/**
 * SleepBuddy — shared site header & footer（多语言真链接切换）。
 * 语言切换为真实 URL（/ /zh-cn/ /zh-tw/）+ hreflang，不再用 JS 单页切换。
 */

const CDN = 'https://cdn.sleep-buddy.com/home/images';
const LOGO_URL = CDN + '/logo.webp';
const ICON = {
  facebook: CDN + '/icon-facebook.webp',
};

const LINK = {
  appStore: 'https://apps.apple.com/app/id6773677490',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.sleepbuddy.android',
  facebook: 'https://www.facebook.com/profile.php?id=61592198367740',
  email: 'mailto:support@sleep-buddy.com',
};

const LANGS = [
  { code: 'en', label: 'EN', hreflang: 'en' },
  { code: 'zh-CN', label: '简体', hreflang: 'zh-CN' },
  { code: 'zh-TW', label: '繁體', hreflang: 'zh-TW' },
];

const APP_NAME = { en: 'SleepBuddy', 'zh-CN': '睡了么', 'zh-TW': '睡了麼' };

function pageDir(lang) {
  return lang === 'zh-CN' ? 'zh-cn/' : lang === 'zh-TW' ? 'zh-tw/' : '';
}
function blogDir(lang) {
  return pageDir(lang);
}

const NAV = {
  en: [['Features', 'FEATURES'], ['Articles', 'BLOG']],
  'zh-CN': [['功能', 'FEATURES'], ['文章', 'BLOG']],
  'zh-TW': [['功能', 'FEATURES'], ['文章', 'BLOG']],
};

const T = {
  en: {
    home: 'Home', features: 'Features', articles: 'Articles', events: 'Events',
    event1: 'Honor Your Body as God’s Temple', event2: 'Self-control Isn’t a Solo Battle',
    explore: 'Explore', support: 'Support', download: 'Download',
    privacy: 'Privacy Policy', terms: 'Terms of Use', appStore: 'App Store', googlePlay: 'Google Play',
    popularTitle: 'Popular Guides', faqTitle: 'Popular Questions',
    tagline: 'Fall asleep early, together.', contact: 'Get in touch',
  },
  'zh-CN': {
    home: '首页', features: '功能', articles: '文章', events: '活动',
    event1: '身体是圣灵的殿', event2: '节制，不是一个人硬撑',
    explore: '探索', support: '支持', download: '下载',
    privacy: '隐私政策', terms: '使用条款', appStore: 'App Store', googlePlay: 'Google Play',
    popularTitle: '热门指南', faqTitle: '常见问题',
    tagline: '一起早睡，守住健康睡眠。', contact: '联系我们',
  },
  'zh-TW': {
    home: '首頁', features: '功能', articles: '文章', events: '活動',
    event1: '身體是聖靈的殿', event2: '節制，不是一個人硬撐',
    explore: '探索', support: '支援', download: '下載',
    privacy: '隱私政策', terms: '使用條款', appStore: 'App Store', googlePlay: 'Google Play',
    popularTitle: '熱門指南', faqTitle: '常見問題',
    tagline: '一起早睡，守住健康睡眠。', contact: '聯絡我們',
  },
};

function navItems(lang) {
  const dir = pageDir(lang);
  return NAV[lang].map(([label, href]) => {
    if (href === 'FEATURES') return [label, '/features/' + dir];
    if (href === 'BLOG') return [label, '/blog/' + blogDir(lang)];
    return [label, href];
  });
}

// Footer hub-and-spoke internal links（与博客 slug 对应，语言感知）
const GUIDES = [
  { slug: 'how-to-set-bedtime-lock-screen-iphone', en: 'How to Set a Bedtime Lock Screen', 'zh-CN': '如何设置睡前锁屏', 'zh-TW': '如何設定睡前鎖屏' },
  { slug: 'does-locking-phone-before-bed-improve-sleep', en: 'Does Locking Your Phone Improve Sleep?', 'zh-CN': '睡前锁机真能改善睡眠吗', 'zh-TW': '睡前鎖機能改善睡眠嗎' },
  { slug: 'science-of-social-accountability-sleep', en: 'The Science of Social Accountability', 'zh-CN': '社交问责的科学', 'zh-TW': '社交問責的科學' },
  { slug: '30-day-no-phone-before-bed-challenge', en: '30-Day No-Phone Challenge', 'zh-CN': '30 天睡前不碰手机挑战', 'zh-TW': '30 天睡前不碰手機挑戰' },
  { slug: 'best-apps-stop-scrolling-before-bed-2026', en: 'Best Apps to Stop Scrolling Before Bed', 'zh-CN': '戒刷手机 App 盘点', 'zh-TW': '戒滑手機 App 盤點' },
  { slug: 'sleep-accountability-partners-how-to', en: 'Find a Sleep Accountability Partner', 'zh-CN': '如何找睡眠问责伙伴', 'zh-TW': '如何找睡眠問責夥伴' },
];

const QUESTIONS = [
  { slug: 'how-to-set-bedtime-lock-screen-iphone', en: 'Will the lock screen block my alarm?', 'zh-CN': '睡前锁屏会挡闹钟吗', 'zh-TW': '睡前鎖屏會擋鬧鐘嗎' },
  { slug: 'does-locking-phone-before-bed-improve-sleep', en: 'Does screen light really affect sleep?', 'zh-CN': '睡前刷手机影响睡眠吗', 'zh-TW': '睡前滑手機影響睡眠嗎' },
  { slug: 'science-of-social-accountability-sleep', en: 'Does social accountability work?', 'zh-CN': '社交问责真的有效吗', 'zh-TW': '社交問責真的有效嗎' },
  { slug: '30-day-no-phone-before-bed-challenge', en: 'How long to build an early-sleep habit?', 'zh-CN': '多久养成早睡习惯', 'zh-TW': '多久養成早睡習慣' },
  { slug: 'sleep-accountability-partners-how-to', en: 'How do I find a sleep buddy?', 'zh-CN': '如何找到睡眠伙伴', 'zh-TW': '如何找到睡眠夥伴' },
  { faq: 7, en: 'Is SleepBuddy free?', 'zh-CN': '睡了么收费吗', 'zh-TW': '睡了麼收費嗎' },
];

function activeAttr(href, active) {
  if (active === 'features' && /\/features/.test(href)) return ' class="active"';
  if (active === 'blog' && /\/blog\//.test(href)) return ' class="active"';
  return '';
}

/**
 * @param {object} o
 * @param {string} o.lang     en / zh-CN / zh-TW
 * @param {string} o.active   '' | 'features' | 'blog'
 * @param {function} o.langHref  (code) => url of current page in that language
 */
function header({ lang, active = '', langHref }) {
  const nav = navItems(lang)
    .map(([label, href]) => `<a href="${href}"${activeAttr(href, active)}>${label}</a>`)
    .join('\n      ');
  const opts = LANGS.map((l) => {
    const act = l.code === lang ? ' active' : '';
    return `<a class="lang-option${act}" href="${langHref(l.code)}" hreflang="${l.hreflang}">${l.label}</a>`;
  });
  const cur = LANGS.find((l) => l.code === lang) || { label: lang };
  const dir = pageDir(lang);
  return `<header class="header">
  <div class="header-inner">
    <a href="/${dir}" class="header-logo" aria-label="SleepBuddy"><img src="${LOGO_URL}" alt="SleepBuddy"><span>${APP_NAME[lang]}</span></a>
    <button class="menu-toggle" id="menuToggle" aria-label="Menu">&#9776;</button>
    <nav class="header-nav" id="headerNav">
      <a href="/${dir}">${T[lang].home}</a>
      ${nav}
      <div class="lang-switch-mobile">
        <div class="lang-dropdown-mobile">${opts.join('')}</div>
      </div>
    </nav>
    <div class="lang-switch" id="langSwitch">
      <button class="lang-select-trigger" type="button" aria-haspopup="true" aria-expanded="false">
        <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="lang-current">${cur.label}</span>
        <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="lang-dropdown">
        ${opts.join('\n        ')}
      </div>
    </div>
    <a class="header-download" href="${LINK.appStore}" target="_blank" rel="noopener">${T[lang].download}</a>
  </div>
</header>`;
}

function footer({ lang }) {
  const t = T[lang];
  const dir = pageDir(lang);
  const bdir = blogDir(lang);
  return `<footer class="site-footer" id="contact">
  <div class="site-footer-inner">
    <div class="site-footer-col site-footer-brand">
      <a href="/${dir}" class="site-footer-logo"><img src="${LOGO_URL}" alt="SleepBuddy"><span>${APP_NAME[lang]}</span></a>
      <p class="site-footer-tagline">${t.tagline}</p>
      <div class="site-footer-social">
        <a href="${LINK.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><img src="${ICON.facebook}" alt="Facebook" loading="lazy"></a>
      </div>
      <span class="site-footer-email">support@sleep-buddy.com</span>
    </div>
    <div class="site-footer-col">
      <h4>${t.explore}</h4>
      <a href="/features/${dir}">${t.features}</a>
      <a href="/blog/${bdir}">${t.articles}</a>
    </div>
    <div class="site-footer-col">
      <h4>${t.popularTitle}</h4>
      ${GUIDES.map((g) => `<a href="/blog/${g.slug}/${bdir}">${g[lang]}</a>`).join('\n      ')}
    </div>
    <div class="site-footer-col">
      <h4>${t.faqTitle}</h4>
      ${QUESTIONS.map((q) => q.slug ? `<a href="/blog/${q.slug}/${bdir}">${q[lang]}</a>` : `<a href="/${dir}#faq-${q.faq}">${q[lang]}</a>`).join('\n      ')}
    </div>
    <div class="site-footer-col">
      <h4>${t.events}</h4>
      <a href="/activity/sleep-holy-temple">${t.event1}</a>
      <a href="/activity/sleep-daily-encourage">${t.event2}</a>
    </div>
    <div class="site-footer-col">
      <h4>${t.support}</h4>
      <a href="/privacy">${t.privacy}</a>
      <a href="/terms">${t.terms}</a>
      <a href="${LINK.appStore}" target="_blank" rel="noopener">${t.appStore}</a>
    </div>
  </div>
  <div class="site-footer-bottom">
    <span>© 2026 ${APP_NAME[lang]}</span>
  </div>
</footer>`;
}

/* Shared header/footer CSS（沿用 sleepbuddy 深紫主题）。 */
const HEADER_CSS = `
:root { --header-height: 60px; --sb-purple: #7C3AED; --sb-bg: #0d0b1a; --sb-bg-start: #1a0a2e; --sb-white: #ffffff; --sb-muted: rgba(255,255,255,0.7); }
.header {
  position: sticky; top: 0; left: 0; right: 0; z-index: 1000;
  background: #111014; border-bottom: 1px solid rgba(255,255,255,0.06);
  height: var(--header-height); display: flex; align-items: center; padding: 0 4vw;
}
.header-inner { max-width: 1360px; margin: 0 auto; width: 100%; display: flex; align-items: center; gap: 32px; position: relative; }
.header-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.header-logo img { height: 32px; width: auto; }
.header-logo span { font-size: 22px; font-weight: 700; color: var(--sb-white); }
.header-nav { display: flex; align-items: center; gap: 28px; }
.header-nav a { color: var(--sb-muted); text-decoration: none; font-size: 16px; transition: color 0.2s; }
.header-nav a:hover, .header-nav a.active { color: var(--sb-white); }
.lang-switch { position: relative; margin-left: auto; }
.lang-select-trigger { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 4px 8px; font-size: 15px; color: var(--sb-white); background: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; font-family: inherit; }
.lang-select-trigger:hover { background: rgba(255,255,255,0.1); }
.lang-current { font-size: 15px; }
.lang-switch .globe-icon { width: 16px; height: 16px; }
.lang-switch .chevron { color: var(--sb-muted); }
.lang-dropdown { position: absolute; top: 100%; right: 0; display: none; background: #1a1430; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; min-width: 110px; box-shadow: 0 6px 20px rgba(0,0,0,0.5); z-index: 100; padding: 6px 0; margin-top: 6px; }
.lang-dropdown.open { display: block; }
.lang-dropdown .lang-option { display: block; width: 100%; padding: 8px 16px; text-align: left; font-size: 15px; color: var(--sb-white); white-space: nowrap; text-decoration: none; }
.lang-dropdown .lang-option:hover { background: rgba(255,255,255,0.08); }
.lang-dropdown .lang-option.active { color: var(--sb-purple); font-weight: 700; }
.header-download { display: inline-flex; align-items: center; padding: 8px 20px; border-radius: 20px; background: var(--sb-purple); color: #fff; text-decoration: none; font-size: 15px; font-weight: 700; transition: opacity 0.2s; }
.header-download:hover { opacity: 0.9; }
.lang-switch-mobile { display: none; }
.menu-toggle { display: none; background: none; border: none; color: var(--sb-white); font-size: 24px; cursor: pointer; }
@media (max-width: 900px) {
  .header-nav a, .header-download { display: none; }
  .menu-toggle { display: block; }
  .header-nav { display: none; position: absolute; top: var(--header-height); left: 0; right: 0; background: #111014; flex-direction: column; padding: 20px 4vw; gap: 16px; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .header-nav.open { display: flex; }
  .header-nav.open a { display: block; color: var(--sb-white); }
  .lang-switch-mobile { display: block; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); }
  .lang-switch-mobile .lang-dropdown-mobile { display: flex; gap: 8px; flex-wrap: wrap; }
  .lang-switch-mobile .lang-option { background: none; border: 1px solid rgba(255,255,255,0.2); color: var(--sb-white); padding: 4px 12px; border-radius: 16px; font-size: 15px; text-decoration: none; }
  .lang-switch-mobile .lang-option.active { border-color: var(--sb-purple); color: var(--sb-purple); }
}
.site-footer { background: #0c0b0f; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 0; }
.site-footer-inner { max-width: 1360px; margin: 0 auto; padding: 48px 4vw 28px; display: grid; grid-template-columns: 1fr; gap: 28px; }
.site-footer-col { display: flex; flex-direction: column; gap: 10px; }
.site-footer-col h4 { font-size: 15px; color: var(--sb-white); margin-bottom: 2px; }
.site-footer-col a { color: var(--sb-muted); text-decoration: none; font-size: 14px; }
.site-footer-col a:hover { color: var(--sb-purple); }
.site-footer-email { color: rgba(255,255,255,0.85); font-size: 13px; word-break: break-all; }
.site-footer-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.site-footer-logo img { height: 28px; width: auto; }
.site-footer-logo span { font-size: 20px; color: var(--sb-white); font-weight: 700; }
.site-footer-tagline { color: rgba(255,255,255,0.55); font-size: 13px; }
.site-footer-social { display: flex; gap: 12px; margin-top: 4px; }
.site-footer-social img { width: 28px; height: 28px; object-fit: contain; }
.site-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); }
.site-footer-bottom span { display: block; max-width: 1360px; margin: 0 auto; padding: 14px 4vw; font-size: 13px; color: rgba(255,255,255,0.5); }
@media (min-width: 768px) {
  .site-footer-inner { grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; padding: 56px 4vw 32px; gap: 32px; }
}
`;

const HEADER_JS = `
document.getElementById('menuToggle')?.addEventListener('click', function () {
  document.getElementById('headerNav').classList.toggle('open');
});
(function () {
  var langSwitch = document.getElementById('langSwitch');
  if (!langSwitch) return;
  var trigger = langSwitch.querySelector('.lang-select-trigger');
  var dropdown = langSwitch.querySelector('.lang-dropdown');
  if (trigger && dropdown) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', dropdown.classList.contains('open') ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }
})();
`;

module.exports = { header, footer, HEADER_CSS, HEADER_JS, LANGS, LINK, ICON };
