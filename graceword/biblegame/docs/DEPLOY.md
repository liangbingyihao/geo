# 測試環境部署（test.grace-word.com/bibleart）

本專案為純靜態輸出（`out/`），部署方式：**本機建置 → rsync 上傳 → 既有 Nginx 直接服務子路徑**。
不新增容器、不新增連接埠。系統設計見 [ARCHITECTURE.md](ARCHITECTURE.md)，目前進度見 [ROADMAP.md](ROADMAP.md)。

## 0. 部署資訊

| 項目 | 值 |
| --- | --- |
| 公開網址 | `https://test.grace-word.com/bibleart/` |
| 子路徑 | `/bibleart/` |
| 測試站靜態根目錄（宿主机） | `/opt/common/nginx/html/graceword/` |
| 容器內根目錄 | `/var/www/html/graceword` |
| 目標目錄 | `/opt/common/nginx/html/graceword/bibleart/` |
| Nginx 容器 | `common-nginx-1` |
| 宿主掛載 | `/opt/common/nginx/html` → 容器 `/var/www/html` |
| Nginx 設定（測試） | `geo/graceword/deploy/graceword_test.conf` |

> 以上為目前測試站實際路徑。若主機搬遷，先重新確認 `docker inspect` 的掛載與 `root` 設定，再更新本表。
>
> ```bash
> ```

## 1. 前置檢查（伺服器）

```bash
ssh root@$TEST_HOST

# Nginx 是否為容器
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'

# 找出設定檔與靜態目錄掛載
docker inspect <nginx容器名> --format '{{range .Mounts}}{{.Source}} => {{.Destination}}{{println}}{{end}}'

# 檢查目標目錄
ls -la /opt/common/nginx/html/graceword/

# 確認目前版本（已部署時預期 200；首次部署前才是 404）
curl -I https://test.grace-word.com/bibleart/
```

若 `/opt/common/nginx/html/graceword/` 不存在，請先確認 `graceword_test.conf` 的 `root` 對應的實際掛載路徑。

## 2. 本機建置（WSL）

```bash
cd /mnt/d/opencode/biblegame
rm -rf .next out
npm run build
```

`.env.production` 會自動套用：

```env
NEXT_PUBLIC_BASE_PATH=/bibleart
NEXT_PUBLIC_IMAGE_BASE_URL=https://cdn.grace-word.com/game/images
NEXT_PUBLIC_GA_ID=G-7CEHJHLWK1
```

建置完成後確認：

```bash
ls out/index.html out/play/index.html out/credits/index.html out/404.html
grep -o '/bibleart/_next/static/[^"]*' out/index.html | head -1
```

## 3. 上傳

```bash
rsync -avz --delete out/ root@$TEST_HOST:/opt/common/nginx/html/graceword/bibleart/
```

> `--delete` 只影響 `bibleart/` 子目錄，不會動到 `/blog/`、`/podcast/`、`/bibleti.html`。

若使用非 root 帳號：

```bash
rsync -avz --delete out/ <user>@$TEST_HOST:/tmp/bibleart-out/
ssh <user>@$TEST_HOST "sudo rsync -a --delete /tmp/bibleart-out/ /opt/common/nginx/html/graceword/bibleart/"
```

## 4. 靜態資源託管策略（方案 A）

本專案採用 **方案 A**：圖片走 CDN，`_next/static` 留在 Nginx 並由 Cloudflare 邊緣快取。
**不改 `assetPrefix`，也不把 JS/CSS 上傳到 CDN。**

| 資源 | 實際位置 | 快取策略 |
| --- | --- | --- |
| 題目圖片 `out/images/*` | `cdn.grace-word.com/game/images`（OSS） | CDN `max-age=14400`，`cf-cache-status: HIT` |
| `out/_next/static/*`（JS/CSS/圖標） | 測試站 Nginx | `public, max-age=31536000, immutable` |
| `out/_next/static/media/*`（Leaflet 圖標） | 測試站 Nginx | 與 `_next/static` 相同 |
| `out/geo/*.json`（Natural Earth 地圖資料） | 測試站 Nginx | 短快取；與靜態包一起更新 |
| `out/*.html`、`out/*/index.txt`（RSC） | 測試站 Nginx | 短快取；更新後 Purge |

說明：

- **不需要上傳 WebP**：`lib/image-loader.js` 會附加 `x-oss-process=.../format,webp`，由 OSS 即時生成。
- **不需要把 `_next/static` 上傳 CDN**：方案 A 只透過快取頭讓 Cloudflare 快取。
- `next.config.mjs` 不設定 `assetPrefix`。
- 若日後要改為「徹底 CDN」，再評估 `assetPrefix` 方案（需同步上傳 `_next/static`）。

## 5. Nginx 設定（方案 A，建議加）

現有測試站的 `location /` 已能服務目錄與 `index.html`，因此**不改 Nginx 也能運作**。
加上以下區塊可明確處理路徑並為 `_next/static` 設定長快取。

在 `graceword_test.conf` 的 `server { ... }` 內加入：

```nginx
location /bibleart/ {
    root /var/www/html/graceword;
    index index.html;
    try_files $uri $uri/ =404;
}

location /bibleart/_next/static/ {
    root /var/www/html/graceword;
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
}
```

套用：

```bash
# 找到容器內的設定檔位置
docker exec <nginx容器名> sh -c 'grep -rn "test.grace-word.com" /etc/nginx/conf.d /etc/nginx/nginx.conf'

# 編輯（若設定檔由宿主机掛載，改宿主机檔案）
docker exec -it <nginx容器名> sh
# vi /etc/nginx/conf.d/graceword_test.conf

# 檢查並重載
docker exec <nginx容器名> nginx -t
docker exec <nginx容器名> nginx -s reload
```

生產環境（`grace-word.com`）日後部署時，把 `root` 改為 `/var/www/html/graceword`，並將同一區塊加入 `graceword.conf`；上傳目標改為 `root@host:/opt/common/nginx/html/graceword/bibleart/`。

## 6. Cloudflare 快取（視情況）

先看回應頭的 `cf-cache-status`：

- `HIT`：Cloudflare 已在邊緣快取，無需額外設定。
- `DYNAMIC` / `MISS`：在 Cloudflare 新增 Cache Rule。

建議規則：

| 項目 | 值 |
| --- | --- |
| 名稱 | `bibleart-static-cache` |
| 匹配 | `http.host eq "test.grace-word.com" and starts_with(http.request.uri.path, "/bibleart/_next/static/")` |
| Cache eligibility | Eligible for cache |
| Edge TTL | 1 year |
| Browser TTL | 1 year |

> 若使用舊版 Page Rules：URL 匹配 `test.grace-word.com/bibleart/_next/static/*`，
> 設定 Cache Level = Cache Everything，Edge Cache TTL = 1 year。

## 7. 驗收

```bash
# 中文頁面
curl -I https://test.grace-word.com/bibleart/
curl -I https://test.grace-word.com/bibleart/play/
curl -I https://test.grace-word.com/bibleart/credits/

# 故事庫
curl -I https://test.grace-word.com/bibleart/stories/
curl -I https://test.grace-word.com/bibleart/en/stories/

# 我的紀錄
curl -I https://test.grace-word.com/bibleart/progress/
curl -I https://test.grace-word.com/bibleart/en/progress/

# 地名對照
curl -I https://test.grace-word.com/bibleart/places/
curl -I https://test.grace-word.com/bibleart/en/places/

# 英文頁面
curl -I https://test.grace-word.com/bibleart/en/
curl -I https://test.grace-word.com/bibleart/en/play/
curl -I https://test.grace-word.com/bibleart/en/credits/

# sitemap 與分享圖
curl -I https://test.grace-word.com/bibleart/sitemap.xml
curl -I https://test.grace-word.com/bibleart/og.jpg

# 語言與 SEO 標籤
curl -s https://test.grace-word.com/bibleart/ | grep -oE '<html lang="[^"]*"|rel="canonical"[^>]*|hrefLang="[^"]*"' | head
curl -s https://test.grace-word.com/bibleart/en/ | grep -oE '<html lang="[^"]*"|rel="canonical"[^>]*|hrefLang="[^"]*"' | head

# 資源前綴
curl -s https://test.grace-word.com/bibleart/ | grep -o '/bibleart/_next/static/[^"]*' | head

# 地圖資料（隨靜態包提供，不依賴外部瓦片）
curl -I https://test.grace-word.com/bibleart/geo/land.json
curl -I https://test.grace-word.com/bibleart/geo/lakes.json
curl -I https://test.grace-word.com/bibleart/geo/rivers.json

# _next 資源快取（連續兩次，第二次期望 HIT）
asset=$(curl -s https://test.grace-word.com/bibleart/ | grep -o '/bibleart/_next/static/[^"]*\.js' | head -1)
echo "$asset"
curl -sI "https://test.grace-word.com$asset" | grep -iE 'HTTP/|cache-control|cf-cache-status'
curl -sI "https://test.grace-word.com$asset" | grep -iE 'cf-cache-status'

# GA4
curl -s https://test.grace-word.com/bibleart/ | grep -c 'G-7CEHJHLWK1'

# CDN 圖片（縮放 + WebP + 快取）
curl -sI "https://cdn.grace-word.com/game/images/last_supper.jpg?x-oss-process=image/resize,w_640/quality,q_75/format,webp" \
  | grep -iE 'HTTP/|content-type|cf-cache-status'

# 目前已上傳的新圖（預期 200；更換或新增圖片時也要檢查）
for f in visitation flight_egypt calling_matthew peter_commission peter_prison; do
  echo -n "$f -> "
  curl -s -o /dev/null -m 15 -w "%{http_code}\n" "https://cdn.grace-word.com/game/images/$f.jpg"
done
```

瀏覽器打開 `https://test.grace-word.com/bibleart/`，確認：

- 首頁圖片正常載入（Network 中應為 `cdn.grace-word.com` 且 `content-type: image/webp`）
- 首頁「今日故事」與 `/bibleart/play/` 顯示同一故事
- `/bibleart/stories/` 可切換年代與主題；今日故事可玩，已完成可重玩，未完成鎖定
- `/bibleart/progress/` 顯示連闖、最佳分、故事進度、最近 7 天與徽章；頁面為 noindex
- 「我的紀錄」可發起挑戰；先玩一次，結算後可分享帶分數連結
- 朋友打開挑戰連結後玩同一組題目，結算會顯示雙方成績與差距；不影響每日連闖
- 未完成故事的 `?story=` 不可進入
- 練習模式不增加每日連闖、不顯示每日分享
- `/bibleart/play/` 可以遊玩、地圖可點擊
- 猜錯第一次出現經文提示；辨認成功後只出現所在區域提示，提交後才顯示完整地名
- 結算頁顯示關鍵經文、藝術小知識與地理小知識
- `/bibleart/places/` 可查看 30 個地點的聖經名、區域與當今地點
- 完成故事後出現旅程地圖與五幕回顧
- `/bibleart/credits/` 授權列表正常
- 重新整理 `/bibleart/play/` 不 404

## 8. 更新部署

```bash
cd /mnt/d/opencode/biblegame
rm -rf .next out
npm run build
npm run check:export
rsync -avz --delete out/ root@$TEST_HOST:/opt/common/nginx/html/graceword/bibleart/
```

## 9. 回滾

上傳前先備份：

```bash
ssh root@$TEST_HOST "cp -a /opt/common/nginx/html/graceword/bibleart \
  /opt/common/nginx/html/graceword/bibleart.bak.$(date +%Y%m%d%H%M%S)"
```

需要回滾時，把備份目錄改名回 `bibleart`（或把上一版 `out/` 重新 rsync）。

## 10. 注意事項

- **子路徑必須與 `NEXT_PUBLIC_BASE_PATH` 一致**，否則 `_next` 資源會 404。
- 方案 A **不改 `assetPrefix`**；`_next/static` 仍由 Nginx 提供，靠快取頭 + Cloudflare 加速。
- 若日後改用 `assetPrefix`，每次建置後都必須同步上傳新的 `_next/static`，否則舊 HTML 可能引用不存在的 chunk。
- 不需要上傳 WebP：CDN 依 `x-oss-process` 即時生成。
- Cloudflare 快取：HTML 可能被快取，更新後若仍看到舊版，對 `/bibleart/` 執行 Purge Cache。
- 測試站已有 `X-Robots-Tag: noindex, nofollow`，子路徑同樣生效。
- 圖片走 CDN，不佔用靜態站流量；`out/images/` 是本地回退，`SafeImage` 會在 CDN 圖片 404 時自動改用本地副本。
- 新增的 5 張圖（`visitation`、`flight_egypt`、`calling_matthew`、`peter_commission`、`peter_prison`）需要上傳到 `cdn.grace-word.com/game/images/`；未上傳時本地回退仍可運作，但會失去 CDN 加速。
- 地圖使用隨包提供的 `out/geo/*.json`，**不請求任何外部瓦片**；若地圖空白，先確認 `/bibleart/geo/land.json` 是否 200。
- 瀏覽器 Network 中不應出現 `tile.openstreetmap.org` 或第三方地圖網域。
- 中英文共用同一每日題組，固定以 **UTC** 換題（北京 08:00 / 美東 19:00–20:00）。
- canonical、hreflang、sitemap 依賴 `NEXT_PUBLIC_SITE_URL`。測試站用 `.env.production` 的 `https://test.grace-word.com`；生產建置必須覆蓋為正式域名後重新建置。
- 子路徑的 `robots.txt` 不被搜尋引擎採用；請在主域 robots.txt 加入 `Sitemap: https://<domain>/bibleart/sitemap.xml`。
- 語言切換會整頁刷新，這是多根布局的預期行為。
- 部署後可執行 `npm run check:export` 檢查雙語輸出、canonical/hreflang、sitemap 與 404。
- 故事庫的完成/鎖定狀態存在 localStorage；靜態站無法阻止改 localStorage 或看前端資料，只是 UI 層的限制。
