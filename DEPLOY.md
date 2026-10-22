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
