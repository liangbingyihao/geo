# Geo（GraceWord / Sleep-Buddy）SEO/GEO — 待办清单

> 目录结构见 README.md；博客构建/部署路径现位于 `graceword/blog/` 下。

## 🔴 P0（决定 GEO 成败，先做）
- [ ] Cloudflare 关闭「AI Content Signals / Managed robots.txt」对 AI 爬虫的屏蔽
      （当前 GPTBot / ClaudeBot / CCBot / Google-Extended 等被 Disallow，AI 无法抓取引用）
- [ ] 部署上线（GraceWord 博客）：
  - [ ] rsync graceword/blog/dist/blog/ -> /var/www/html/graceword/blog/
  - [ ] 上传 graceword/blog/deploy/robots.txt -> /var/www/html/graceword/robots.txt
  - [ ] 上传 graceword/blog/build/assets/{style.css,main.js} -> CDN /blog/
  - [ ] nginx -t && reload

## 🟡 P1（上线前建议完成）
- [ ] Cloudflare：www -> 非www 301 + 开启 Always Use HTTPS
- [ ] 主页「Blog」导航链接同步到线上（graceword/homepage/index.html）
- [ ] 确认 bibleti 链接 host（正文 12 处 grace-word.com/bibleti；实际测验在 test.grace-word.com/bibleti）
- [ ] Sleep-Buddy 博客：解压 sleep-buddy/blog/sleepbuddy-blog.zip，接入同一构建体系（build.js 多站点化）

## 🟢 P2
- [ ] A01->B01 锚文本：gratitude journal -> AI-powered gratitude journal

## 🟢 P3（可选 / 之后）
- [ ] 目录锚点（TOC，长文页内跳转）
- [ ] 低入链文章补链（已无孤儿，可选）
- [ ] og:image 换 1200×630 横幅（现用 logo.webp）

## 发布后如何修改（GraceWord 博客）
改源（graceword/blog/20260702/*.md 或 graceword/blog/build/articles.json）→ 重建 → rsync 重新部署：
- 生产：node graceword/blog/build/build.js
- 测试：SITE_URL=https://test.grace-word.com NOINDEX=1 OUT_DIR=dist-test node graceword/blog/build/build.js
- 只改内容、不改 slug（改 slug 需 Cloudflare 301）；CSS/JS 带 ?v=<hash>，改动自动换新版本，无需清缓存。
