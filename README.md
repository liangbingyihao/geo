# geo — GraceWord & Sleep-Buddy 官网内容仓库（SEO/GEO）

统一维护团队两个 App（**GraceWord**、**Sleep-Buddy**）的主页、活动页、博客等官网内容，核心目标是完善 SEO / GEO。

## 目录结构

```
geo/
├── graceword/
│   ├── homepage/          # GraceWord 落地页（手写 HTML + CDN 资产）
│   └── blog/              # GraceWord 博客（markdown → build.js 静态生成）
│       ├── build/         # 构建脚本 + articles.json + assets
│       ├── 20260702/      # 源文章（en/zh .md）
│       ├── deploy/        # nginx 配置 + robots.txt
│       └── dist/ dist-test/  # 构建产物（git 忽略）
├── sleep-buddy/
│   ├── homepage/          # Sleep-Buddy 落地页 + 活动页（activity/、invite_*.html）
│   └── blog/              # 未来 Sleep-Buddy 博客（现为 sleepbuddy-blog.zip）
├── shared/
│   ├── multilingual-app/  # 多语言落地页模板
│   ├── fonts/             # 共享字体（GenRyuMin、Source Han Serif）
│   ├── materials/         # 官网素材
│   ├── build/             # 占位：未来多站点通用构建
│   └── seo/               # 占位：共享 robots/sitemap/schema 约定
├── TODO.md                # 待办清单
└── DEPLOY.md              #（在 graceword/blog/ 下）部署文档
```

## 博客构建（graceword/blog）

```bash
cd graceword/blog/build
npm install

# 生产（默认域名 grace-word.com）
node build.js

# 测试（noindex + 测试域名）
SITE_URL=https://test.grace-word.com NOINDEX=1 OUT_DIR=dist-test node build.js
```

- 环境变量：`SITE_URL`（绝对 URL 基址）、`NOINDEX=1`（禁索引）、`OUT_DIR`（产物目录）
- 文章元数据（标题/日期/内链 crossLinks 等）在 `build/articles.json`
- 站内链接均为根相对路径，测试/生产通用

## SEO/GEO 约定

- 三语言：en / zh-CN / zh-TW（hreflang 用 `en`/`zh-CN`/`zh-TW`，`<html lang>` 用 `en`/`zh-Hans`/`zh-Hant`）
- 每篇含 JSON-LD：`BlogPosting` + `FAQPage` + `BreadcrumbList`（D 类加 `SoftwareApplication`，E 类加 `Quiz`）
- 正文内链：`crossLinks` 精确短语 + 语言感知相对链接
- robots.txt 策略：允许搜索/引用，禁止 AI 训练（详见 `graceword/blog/deploy/robots.txt`）

## 相关项目

- App 代码（backend / Android）在仓库外独立维护，不在本仓库内。
