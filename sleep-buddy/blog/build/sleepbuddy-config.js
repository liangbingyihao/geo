'use strict';

/**
 * SleepBuddy 博客构建配置 —— 供 shared/build/blog-builder.js 使用。
 */
const path = require('path');
const OpenCC = require('opencc-js');

const s2t = OpenCC.Converter({ from: 'cn', to: 'tw' });

const FONTS = 'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,700;7..72,900&display=swap';

module.exports = {
  name: 'SleepBuddy',
  domain: 'https://sleep-buddy.com',
  cdn: 'https://cdn.sleep-buddy.com',
  logoUrl: 'https://cdn.sleep-buddy.com/home/images/logo.webp',
  ogImage: 'https://cdn.sleep-buddy.com/home/og-cover.jpg',
  downloadUrl: 'https://apps.apple.com/app/id6773677490',
  gaId: 'G-9Q51E91RER',
  fonts: FONTS,
  headerFooter: require('../../site/header-footer.js'),
  deps: { marked: require('marked'), OpenCC },
  toTw: (s) => s2t(s),
  rootDir: path.resolve(__dirname, '..'),
  srcDir: path.join(path.resolve(__dirname, '..'), 'posts'),
  articlesJson: path.join(__dirname, 'articles.json'),
  assetDir: path.join(__dirname, 'assets'),
  ui: {
    en: {
      appName: 'SleepBuddy',
      home: 'Home',
      blog: 'Articles',
      heroTitle: 'Articles',
      heroSubtitle: 'Fall asleep early with friends — sleep science, bedtime lock how-tos, and social accountability guides.',
      searchPlaceholder: 'Search articles...',
      catAll: 'All',
      readMore: 'Read More →',
      published: 'Published',
      related: 'Related Articles',
      stickyTagline: 'Fall asleep early, together.',
      stickyBtn: 'Download SleepBuddy Free →',
    },
    'zh-CN': {
      appName: '睡了么',
      home: '首页',
      blog: '文章',
      heroTitle: '文章',
      heroSubtitle: '和朋友一起早睡——睡眠科学、睡前锁屏教程与社交问责指南。',
      searchPlaceholder: '搜索文章...',
      catAll: '全部',
      readMore: '阅读全文 →',
      published: '发布于',
      related: '相关文章',
      stickyTagline: '一起早睡，守住健康睡眠。',
      stickyBtn: '免费下载睡了么 →',
    },
  },
  list: {
    en: {
      title: 'SleepBuddy Articles — Sleep Science, Bedtime Lock & Accountability Guides',
      desc: 'Explore articles on sleep science, bedtime lock screen how-tos, app comparisons, and social accountability guides to help you fall asleep early with friends.',
    },
    'zh-CN': {
      title: '睡了么 文章 — 睡眠科学、睡前锁屏与问责指南',
      desc: '探索关于睡眠科学、睡前锁屏教程、App 对比与社交问责指南的文章，帮助你和朋友一起早睡。',
    },
    'zh-TW': {
      title: '睡了麼 文章 — 睡眠科學、睡前鎖屏與問責指南',
      desc: '探索關於睡眠科學、睡前鎖屏教程、App 對比與社交問責指南的文章，幫助你和朋友一起早睡。',
    },
  },
};
