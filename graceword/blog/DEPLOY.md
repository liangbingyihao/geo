# GraceWord GEO 博客静态站点 — 部署方案

将 `20260702/` 下的 25 篇文章（中英双语，共 50 页）转换为可部署到 nginx 静态文件服务器的博客站点，并与现有主页 `grace-word.com/` 融合。

## 0. 总体架构

- **`https://grace-word.com/`**：现网主页，背后是 **Cloudflare**（TLS 在 Cloudflare 终结），源站 nginx 只跑 `listen 80`
- **根路径 `/`**：现网主页（`homepage/gw/index.html`，独立部署，不属于本仓库产物）
- **`/blog/`**：本博客（本仓库 `dist/blog/` 产物，部署到源站 `/var/www/html/graceword/blog/`）
- **域名统一**：canonical/hreflang/sitemap 一律 `https://grace-word.com`（非 www）；`www → 非www` 的 301 在 **Cloudflare 边缘**配置（见 §4.4）
- **品牌对齐**：红/米色系 + `Literata`/`Inter` 字体 + CDN logo，与现网主页一致
- **分析追踪**：所有博客页注入现网同一 GA4（`G-7CEHJHLWK1`）

## 1. 产物结构

构建脚本输出到 `dist/`：

```
dist/
├── blog/
│   ├── index.html                   # 博客列表（英文，含分类筛选 + 搜索）
│   ├── zh-cn/index.html             # 博客列表（简体）
│   ├── zh-tw/index.html             # 博客列表（繁体）
│   ├── sitemap.xml                  # 博客 sitemap（78 条 URL，含 hreflang）
│   ├── bible-verses-about-gratitude/
│   │   ├── index.html               # 英文文章
│   │   ├── zh-cn/index.html         # 简体文章
│   │   └── zh-tw/index.html         # 繁体文章
│   └── …（其余 24 个 slug，同样结构）
├── assets/
│   ├── style.css                    # 站点样式（上传到 CDN，此处为兜底副本）
│   └── main.js                      # 菜单/下拉/筛选/搜索/sticky bar（上传到 CDN，兜底副本）
└── robots.txt                       # 参考：站点根 robots 需引用 /blog/sitemap.xml
```

**URL 规则**（目录式，免扩展名）：
- 英文：`https://grace-word.com/blog/{slug}/`
- 简体：`https://grace-word.com/blog/{slug}/zh-cn/`
- 繁体：`https://grace-word.com/blog/{slug}/zh-tw/`
- 博客列表：`/blog/`（英）、`/blog/zh-cn/`（简）、`/blog/zh-tw/`（繁）

**文件名（slug）**：取自英文标题的 kebab-case，25 个见 `build/articles.json`（如 `bible-verses-about-gratitude`、`which-biblical-character-are-you`）。

**语言标注**：hreflang 用 `en` / `zh-CN` / `zh-TW`；`<html lang>` 用 `en` / `zh-Hans` / `zh-Hant`；繁体内容由 OpenCC（`s2tw`）在构建时从简体自动转换。

## 2. 每篇文章内置的 SEO / GEO 能力

- `<title>` + `meta description`（150 字左右，含关键词）
- `canonical` + `hreflang`（en / zh-CN / zh-TW / x-default 三向）+ Open Graph / Twitter Card
- 结构化数据 JSON-LD：
  - `BlogPosting`（全部文章，`inLanguage` 按 en/zh-CN/zh-TW 标注）
  - `FAQPage`（全部，自动从文章「FAQ / 常见问题解答」章节抽取）
  - `BreadcrumbList`（全部，Home → 现网主页，Blog → 博客）
  - `SoftwareApplication`（D 类工具评测文章）
  - `Quiz`（E 类测验文章）
- 内链：
  - **正文内链**：每篇 2~3 处「短语锚点」跨文章链接（如「spiritual forgetfulness」→ B04），数据在 `build/articles.json` 的 `crossLinks`（精确 en + zh 短语），构建时按语言包裹成站内相对链接（`/blog/{slug}/`、`/zh-cn/`、`/zh-tw/`）；若短语未命中，构建会 `console.warn` 提示
  - 正文中的 `grace-word.com/blog/...` 自动改写为站内相对链接（含语言感知）
  - 同分类「相关文章」推荐（每篇 3 篇同门类）
- 软性 CTA（正文后 + 页面底部 sticky bar），App Store / Google Play 用现网真实链接
- 全页注入 GA4（`G-7CEHJHLWK1`）
- 首页同款语言下拉菜单（地球图标 + EN/简体/繁體，三语言链接跳转）

## 3. 本地构建

依赖：Node.js ≥ 18（`marked` + `opencc-js`）。

通过环境变量区分测试/生产产物：

| 变量 | 作用 | 默认值 |
|------|------|--------|
| `SITE_URL` | 绝对 URL 基址（canonical/hreflang/og/schema/sitemap/robots） | `https://grace-word.com` |
| `NOINDEX` | 为 `1` 时注入 `noindex,nofollow` + `robots.txt: Disallow: /` | 未设置 |
| `OUT_DIR` | 产物目录（相对 geo 根） | `dist` |

```bash
cd build
npm install          # 安装依赖

# 生产（默认）
node build.js        # -> ../dist/

# 测试（预览，禁索引）
SITE_URL=https://test.grace-word.com NOINDEX=1 OUT_DIR=dist-test node build.js   # -> ../dist-test/
```

站内链接（logo/下载/隐私等）均为根相对路径（`/`、`/action/download`、`/privacy`），两套产物通用；只有绝对字段随 `SITE_URL` 变化。

## 4. 部署到 nginx + CDN

### 4.1 静态资源上传到 CDN

页面里的 CSS / JS 通过 CDN 加载（带内容哈希版本号），logo / favicon / og:image 也指向 CDN：

| 资源 | 上传路径 | 备注 |
|------|---------|------|
| `build/assets/style.css` | `https://cdn.grace-word.com/blog/style.css` | 页面引用带 `?v=<hash>` |
| `build/assets/main.js` | `https://cdn.grace-word.com/blog/main.js` | 页面引用带 `?v=<hash>` |
| logo（已存在） | `https://cdn.grace-word.com/home/logo.webp` | schema + og:image + favicon |

CDN 缓存头要求：`Cache-Control: public, max-age=31536000, immutable`（版本号由构建自动生成，改文件即换 URL，无需手动 purge）。

> `dist/assets/` 仍保留 `style.css` / `main.js` 兜底副本；页面默认走 CDN，若 CDN 异常可临时把 `build.js` 里的 `CSS_URL` / `JS_URL` 改回 `/assets/` 重建并让源站服务本地副本。

前置检查：
- `curl -I` 以上三个 URL 返回 200，`Content-Type` 分别为 `text/css` / `application/javascript` / `image/webp`
- CDN 域名 TLS 证书有效（无混合内容报错）
- CDN 的 robots.txt 未屏蔽上述路径（避免影响抓取）

### 4.2 上传 HTML 产物到源站 nginx

源站根目录是 `/var/www/html/graceword`（现网主页所在），博客部署到其下 `blog/` 子目录：

```bash
# 1) 上传博客产物（生产用 dist/，测试用 dist-test/）
rsync -avz dist/blog/ user@your-server:/var/www/html/graceword/blog/

# 2) 更新源站 nginx 配置
sudo cp ../deploy/graceword.conf /etc/nginx/sites-available/graceword          # 生产
sudo cp ../deploy/graceword_test.conf /etc/nginx/sites-available/graceword_test # 测试（noindex）
# （按你现有的配置管理方式：覆盖同名站点文件，或手工把 location /blog/ 合并进去）

# 3) 校验并重载
sudo nginx -t
sudo systemctl reload nginx
```

> 源站 `../deploy/graceword.conf` 已按你线上真实配置（root `/var/www/html/graceword`、`/action/`、`apple-app-site-association`、`.html` 302、`server_tokens off`）原样保留，仅新增了 `location /blog/`。

### 4.3 Cloudflare 边缘配置（www→非www 301 + HTTP→HTTPS）

源站 nginx 只管 80 端口；TLS 在 Cloudflare 终结，因此域名统一的两条规则配在 Cloudflare：

1. **www → 非www 301**（`Rules → Redirect Rules → Create Rule`，Dynamic Redirect）：
   - 匹配条件：`Hostname` 等于 `www.grace-word.com`
   - 动作：`Dynamic Redirect`，状态码 `301`，目标表达式
     ```
     concat("https://grace-word.com", http.request.uri)
     ```
2. **HTTP → HTTPS**：在 `SSL/TLS → Edge Certificates` 打开「**Always Use HTTPS**」。
3. 确认 DNS 里 `www.grace-word.com` 是 **「Proxied（橙色云）」**（若为灰色云「DNS only」，www 会绕过 Cloudflare 直连源站，边缘规则拦截不到）。

### 4.4 现网主页需配合的改动

1. **导航加「Blog」**：在 `homepage/gw/index.html` 的 `header-nav` 里加 `<a href="/blog/">Blog</a>`（本仓库已改好，如主页已上线请同步该行）。
2. **robots.txt**：用 `../deploy/robots.txt`（已含 `Sitemap: https://grace-word.com/blog/sitemap.xml`）覆盖源站的 `/var/www/html/graceword/robots.txt`，并关闭 Cloudflare 的 AI 屏蔽托管（见 §4.5）。
3. **下载按钮依赖 `/action/`**：博客 CTA 与 sticky bar 的「下载 App / 下载恩语」按钮指向 `/action/download`，依赖源站 nginx 的 `location /action/ { return 301 https://smart.link/...; }`（已在 `../deploy/graceword.conf` 中保留）。若以后更换归因商，只需改这一条 301，博客端无需改。

> 下载按钮：`/action/download`（智能链，自动分流 iOS/Android）；软性「Visit GraceWord → / 首页」按钮仍指向主页，供零认知的访客先了解产品。

### 4.5 robots.txt 与 AI 爬虫（GEO 关键）

策略：**允许搜索/引用，禁止训练**（`search=yes, ai-train=no, use=reference`）。

1. **上传 `../deploy/robots.txt` 到源站**：
   ```bash
   rsync -avz ../deploy/robots.txt user@server:/var/www/html/graceword/robots.txt
   ```
2. **关闭 Cloudflare 的 AI 屏蔽托管**（否则 Cloudflare 会往 robots.txt 注入 `Disallow: /` 屏蔽 GPTBot/ClaudeBot/CCBot 等，与 GEO 目标相反）：
   - Cloudflare 后台 → 找到 **AI Content Signals / Managed robots.txt / Scrape Shield** 相关开关
   - **关闭「Block AI bots」或「AI 内容扫描」的自动屏蔽**；保留/忽略 `Content-Signal` 声明（`../deploy/robots.txt` 里已自带）
3. 确认最终 `https://grace-word.com/robots.txt` 与 `../deploy/robots.txt` 一致：允许 `GPTBot` 以外的搜索/引用爬虫，`GPTBot/ClaudeBot/Google-Extended/…` 为 `Disallow: /`，`CCBot` 为 `Allow: /`。

> 说明：`Google-Extended` 只影响 Gemini，不影响 Google 搜索与 AI Overviews（走 Googlebot）。`GPTBot` 仅用于训练，不影响 ChatGPT 搜索引用（走 `OAI-SearchBot`）。`CCBot`（Common Crawl）已放行，用于检索/搜索/RAG 数据集发现。

## 5. 部署后验证

```bash
curl -I https://grace-word.com/blog/bible-verses-about-gratitude/      # 期望 200
curl -I https://grace-word.com/blog/bible-verses-about-gratitude/zh-cn/  # 期望 200
curl -I https://grace-word.com/blog/bible-verses-about-gratitude/zh-tw/  # 期望 200
curl -I https://www.grace-word.com/blog/                               # 期望 301 → 非 www
curl -s https://grace-word.com/blog/sitemap.xml | head                 # 检查 sitemap
curl -I "https://cdn.grace-word.com/blog/style.css?v=af192f38"         # 期望 200 + immutable
curl -I https://cdn.grace-word.com/home/logo.webp                      # 期望 200 + image/webp
```

- JSON-LD 校验：Google Rich Results Test（粘贴任一文章 URL）
- hreflang 校验：`curl -s <url> | grep hreflang`（应含 en / zh-CN / zh-TW / x-default）
- 确认 `sitemap.xml` 中 78 条 URL 与 hreflang 交替链接正确
- 繁体抽查：`curl -s <zh-tw url> | grep 聖經`（简体「圣经」→ 繁体「聖經」）
- 确认页面头 CSS/JS 指向 `cdn.grace-word.com/blog/` 且带 `?v=`；JSON-LD / og:image 均为 `cdn.grace-word.com/home/logo.webp`
- 确认 GA4 埋点存在：`curl -s <url> | grep G-7CEHJHLWK1`

## 6. 待补充项（可选）

- 文章发布/修改日期：默认 `2026-06-30` / `2026-07-02`（`build/articles.json` 的 `site.datePublished/dateModified`），可按需逐篇覆盖。
- 旧 slug 别名：`build.js` 的 `slugAliases` 已把 `best-gratitude-journal-apps-christians → best-gratitude-journal-apps-for-christians` 在构建期归一化；如历史上有外部直接引用该旧 URL，可在 Cloudflare 加一条 301 重定向规则。
- `og:image` 目前用 CDN logo（WebP）。社交卡片理想尺寸为 1200×630；如需要更佳预览，可另备一张 1200×630 的 PNG 横幅并替换 `build.js` 中的 `LOGO_URL` 相关字段。

## 7. 分类对照

| 分类代码 | 显示标签（英 / 中） | 颜色 |
|---------|--------------------|------|
| a | Bible Verses / 灵修经文 | 蓝 #1a3a5c |
| b | Gratitude / 感恩指南 | 金 #b8873e |
| c | Bible Study / 查经教程 | 绿 #2e7d4f |
| d | App Reviews / 工具评测 | 灰 #6b7280 |
| e | Quizzes / 测验互动 | 紫 #7c3aed |
