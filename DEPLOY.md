# GraceWord 官网部署（site / blog / podcast / bibleti）

统一部署说明。构建命令在各自模块目录执行，部署命令在仓库根目录 `/mnt/d/opencode/geo` 下执行。

## 环境

| 项 | 值 |
|----|----|
| 测试服务器 | `root@8.217.172.116` |
| 测试站点根目录 | `/root/common/nginx/html/graceword/`（容器内映射为 `/var/www/html/graceword`） |
| 测试预览 | `https://test.grace-word.com/` |
| 生产服务器 | `root@47.238.114.230` |
| 生产站点根目录 | `/opt/common/nginx/html/graceword/` |
| 生产域名 | `grace-word.com`（Cloudflare 之后；源站 nginx 见 `graceword/deploy/graceword.conf`） |
| 本地预览根 | `/mnt/d/tools/nginx-1.30.0/html/` |

## ⚠️ 安全规则（重要）

- **站点根目录部署禁止 `--delete`**：根目录包含仓库外的静态页
  `privacy.html` / `terms.html` / `daily.html` / `daily_verse.json` / `doc.html`，
  用 `--delete` 会把它们全部删掉（曾因此误删过一次）。
- **只有 `blog/`、`podcast/` 子目录**可以用 `--delete`（内容完全由构建产物生成）。

## 1. 主页族（`/`、`/zh-cn/`、`/zh-tw/`、`/features/`、`/about/`、`/pricing/`，活动期含 `/promo/`）

```bash
cd graceword/site && node build.js
cd /mnt/d/opencode/geo
# 部署（不加 --delete！）
rsync -a graceword/site/dist/ root@8.217.172.116:/root/common/nginx/html/graceword/
```

产物：`graceword/site/dist/`（`index.html`、`about/`、`features/`、`pricing/`、`promo/`、`zh-cn/`、`zh-tw/`、`style.css`、`main.js`、`sitemap.xml`）。
共享 header/footer 与订阅逻辑在 `graceword/site/header-footer.js`，改动后需重建主页族 + 博客 + 播客三处产物。

## 2. BibleTI 测验页

```bash
scp graceword/homepage/bibleti.html root@8.217.172.116:/root/common/nginx/html/graceword/bibleti.html
```

## 3. 博客 `/blog/`

```bash
cd graceword/blog/build && node build.js        # 生产
# 测试（noindex + 测试域名）：SITE_URL=https://test.grace-word.com NOINDEX=1 OUT_DIR=dist-test node build.js
cd /mnt/d/opencode/geo
rsync -a --delete graceword/blog/dist/blog/ root@8.217.172.116:/root/common/nginx/html/graceword/blog/
```

产物：`graceword/blog/dist/blog/`（25 篇文章 × en/zh-cn/zh-tw + 列表页 + sitemap.xml + style.css + main.js）。

## 4. 播客 `/podcast/`

```bash
cd graceword/podcast/build && node build.js
cd /mnt/d/opencode/geo
rsync -a --delete graceword/podcast/dist/podcast/ root@8.217.172.116:/root/common/nginx/html/graceword/podcast/
```

产物：`graceword/podcast/dist/podcast/`（系列页 + 单集页 × zh-TW/zh-CN + sitemap.xml + style.css）。
播客数据源：`graceword/podcast/podcast.json`。

## 5. 生产部署（正式环境）

与测试环境用**同一份构建产物**（site/blog 默认 `SITE_URL=https://grace-word.com` 即生产域名），只是 rsync 目标不同。安全规则一致：**根目录不加 `--delete`**，blog/podcast 子目录 `--delete`。

构建命令同「1–4」节，然后在仓库根目录 `/mnt/d/opencode/geo` 执行拷贝：

```bash
# 主页族（不加 --delete！）
rsync -a graceword/site/dist/ root@47.238.114.230:/opt/common/nginx/html/graceword/

# BibleTI
scp graceword/homepage/bibleti.html root@47.238.114.230:/opt/common/nginx/html/graceword/bibleti.html

# 博客
rsync -a --delete graceword/blog/dist/blog/ root@47.238.114.230:/opt/common/nginx/html/graceword/blog/

# 播客
rsync -a --delete graceword/podcast/dist/podcast/ root@47.238.114.230:/opt/common/nginx/html/graceword/podcast/
```

> 一次构建、双环境：构建一次后，分别把同一份 dist rsync 到测试（8.217.172.116）与生产（47.238.114.230）即可。

## 6. 部署后验证

测试环境：

```bash
for u in / /zh-cn/ /zh-tw/ /features/ /about/ /pricing/ /blog/ /podcast/ /bibleti /privacy /terms /daily /daily_verse.json; do
  printf '%-18s ' "$u"
  curl -s -o /dev/null -w 'HTTP %{http_code}\n' --max-time 20 "https://test.grace-word.com$u"
done
```

生产环境（把域名换成 `grace-word.com`）：

```bash
for u in / /zh-cn/ /zh-tw/ /features/ /about/ /pricing/ /blog/ /podcast/ /bibleti /privacy /terms /daily /daily_verse.json; do
  printf '%-18s ' "$u"
  curl -s -o /dev/null -w 'HTTP %{http_code}\n' --max-time 20 "https://grace-word.com$u"
done
```

## 7. 需手动上传 CDN 的资源

- 播客音频 / 封面 → `cdn.grace-word.com/podcast/sojdai/`
- `/about` 视频封面 → `cdn.grace-word.com/assets/video/about-me-poster.jpg`
- 其余 `home/*` 素材 → `cdn.grace-word.com/home/`

## 8. 监测 / GEO 曝光观测（GSC · GA4 · AI 爬虫）

> 观测 GEO 改善带来的「搜索曝光」与「AI 引用曝光」，三件套：Google Search Console + GA4 + AI 爬虫日志。

### 8.1 Google Search Console（搜索曝光，最权威）

1. 验证站点（**DNS TXT 验证**，一次性覆盖全域名）：
   - GSC → 新增资源 → 选「网域」`grace-word.com` → 得到 `google-site-verification=...`
   - 到域名 DNS（Cloudflare 后台）加一条 `TXT` 记录：名称 `@`、内容 = 那串 google-site-verification，TTL Auto
   - 回 GSC 点「验证」
2. 提交 Sitemap（三条都交）：
   - `https://grace-word.com/sitemap.xml`
   - `https://grace-word.com/blog/sitemap.xml`
   - `https://grace-word.com/podcast/sitemap.xml`
3. 观测：`效果(Performance)` → 展示次数/点击/平均排名，按「页面(URL)」拆分看 en/zh-cn/zh-tw 与博客；`网页索引` 看收录数。

### 8.2 GA4（流量 + AI 平台 referral）

- 全站已埋同一 GA4：**`G-7CEHJHLWK1`**（主页族 site 构建、博客、podcast、bibleti 均已注入）。
- AI 平台带来的访问：GA4 → `报告 → 流量获取(Traffic acquisition)` → 按来源筛 `chatgpt.com` / `perplexity.ai` / `claude.ai` / `copilot.microsoft.com`。

### 8.3 AI 爬虫来访（GEO 核心信号）

```bash
# 在源站容器/主机上过滤 nginx access 日志中的 AI 爬虫 UA
grep -hE "GPTBot|ChatGPT-User|OAI-SearchBot|Google-Extended|anthropic-ai|ClaudeBot|Claude-SearchBot|CCBot|PerplexityBot|cohere-ai" \
  /var/log/nginx/access.log* 2>/dev/null | awk '{print $1}' | sort | uniq -c | sort -rn
```
- 或 Cloudflare 后台 `Analytics/Logs` 按 Bot UA 过滤。
- 前提：`graceword/deploy/robots.txt` 为三级化（放行 AI 爬虫）——若发现 AI 爬虫为 0，先确认 Cloudflare 未开启「Managed robots.txt」覆盖源站 robots。

---

# SleepBuddy 官网部署（site / blog）

> 完整方案见 `SLEEPBUDDY-GEO-PLAN.md`。构建体系复用了 GraceWord 的多站点引擎（`shared/build/blog-builder.js`），因此构建命令与 GraceWord 对称。

## 环境（与 GraceWord 同一批服务器）

| 项 | 值 |
|----|----|
| 测试服务器 | `root@8.217.172.116`（与 graceword 同机） |
| 生产服务器 | `root@47.238.114.230`（与 graceword 同机） |
| 测试域名 | `test.sleep-buddy.com`（Cloudflare 之后，源站 80） |
| 生产域名 | `sleep-buddy.com` / `www.sleep-buddy.com`（Cloudflare 之后） |
| 站点根目录 | 宿主机 `/root/common/nginx/html/sleepbuddy`（容器内 `/var/www/html/sleepbuddy`）—— 已确认并部署 |
| nginx 配置 | 生产 `sleep-buddy/deploy/sleepbuddy.conf`；测试 `sleep-buddy/deploy/sleepbuddy_test.conf`（服务端应用由维护者负责） |

> 语言 URL 约定：英文在根 `/`，中文在 `/zh-cn/` `/zh-tw/`（无 `/en/`，与 graceword 一致）。

## ⚠️ 安全规则

- **站点根目录禁止 `--delete`**：根目录含仓库外的 `doc.html` / `privacy.html` / `terms.html` / `invite_*.html` / `upload.html`。
- **只有 `blog/` 子目录**可用 `--delete`（内容完全由构建产物生成）。

## 1. 主页族（`/`、`/zh-cn/`、`/zh-tw/`、`/features/`）

```bash
cd sleep-buddy/site && node build.js
cd /mnt/d/opencode/geo
# 部署（不加 --delete！）
rsync -a sleep-buddy/site/dist/ root@8.217.172.116:/root/common/nginx/html/sleepbuddy/
```

产物：`sleep-buddy/site/dist/`（`index.html`、`zh-cn/`、`zh-tw/`、`features/`、`style.css`、`main.js`、`sitemap.xml`、`llms.txt`）。

## 2. 博客 `/blog/`

```bash
cd sleep-buddy/blog/build && node build.js
cd /mnt/d/opencode/geo
rsync -a --delete sleep-buddy/blog/dist/blog/ root@8.217.172.116:/root/common/nginx/html/sleepbuddy/blog/
```

产物：`sleep-buddy/blog/dist/blog/`（8 篇 × en/zh-cn/zh-tw + 列表页 + sitemap.xml + style.css + main.js）。

## 3. activity 页 + robots.txt

```bash
# activity 活动页（sitemap/footer 引用，需随主页同步，避免 404）
ssh root@8.217.172.116 'mkdir -p /root/common/nginx/html/sleepbuddy/activity'
scp sleep-buddy/homepage/activity/sleep-holy-temple.html sleep-buddy/homepage/activity/sleep-daily-encourage.html \
    root@8.217.172.116:/root/common/nginx/html/sleepbuddy/activity/

# robots.txt（生产三级化版；测试侧由 sleepbuddy_test.conf 的 Disallow location 覆盖）
scp sleep-buddy/homepage/robots.txt root@8.217.172.116:/root/common/nginx/html/sleepbuddy/robots.txt
```

## 4. 生产部署

与测试同份构建产物（默认 `SITE_URL=https://sleep-buddy.com`），rsync 目标换生产机 `root@47.238.114.230`，路径同为 `/root/common/nginx/html/sleepbuddy`，一次构建双环境。生产 origin 用 `sleep-buddy/deploy/sleepbuddy.conf`。

## 5. nginx 配置（服务端应用由维护者负责）

- 测试：`sleep-buddy/deploy/sleepbuddy_test.conf`（`test.sleep-buddy.com` + `X-Robots-Tag noindex` + robots Disallow）
- 生产：`sleep-buddy/deploy/sleepbuddy.conf`（`sleep-buddy.com` + robots 三级化 + `/blog/` alias）
- 注：`test.sleep-buddy.com/robots.txt` 实测由 Cloudflare 托管 robots（Content-Signal）先行覆盖源站；若需源站 robots 生效，请在 Cloudflare 后台关闭该域的 Managed robots.txt。

## 6. CDN 资源上传

- `og-cover.jpg`（1200×630，生成脚本 `/tmp/opencode/gen_og.py`，产物 `/tmp/opencode/sb-og-cover.jpg`）→ `cdn.sleep-buddy.com/home/og-cover.jpg`（阿里云 OSS，上传由维护者负责；上传前 og:image 会 404）
- 功能切图 / banner / logo 已在 `cdn.sleep-buddy.com/home/images/` 就绪

## 7. 部署后验证

```bash
for u in / /zh-cn/ /zh-tw/ /features/ /features/zh-cn/ /features/zh-tw/ /blog/ /blog/zh-cn/ /blog/zh-tw/ \
         /blog/30-day-no-phone-before-bed-challenge/ /blog/30-day-no-phone-before-bed-challenge/zh-cn/ \
         /blog/how-to-set-bedtime-lock-screen-iphone/ /activity/sleep-holy-temple /activity/sleep-daily-encourage \
         /sitemap.xml /blog/sitemap.xml /llms.txt /robots.txt /style.css /main.js; do
  printf '%-52s ' "$u"
  curl -s -o /dev/null -w 'HTTP %{http_code}\n' --max-time 20 "https://test.sleep-buddy.com$u"
done
```
