# 架構設計

> 適用版本：`0.1.0`（測試站）
> 相關文件：[README](../README.md)、[操作與維護](USAGE.md)、[部署](DEPLOY.md)、[進度與規劃](ROADMAP.md)

## 1. 目標與約束

本專案是「看名畫、猜聖經事件、判斷年代與地點」的每日遊戲，核心約束如下：

- **純靜態**：`next build` 產生 `out/`，執行期不需要 Node.js、資料庫或 API。
- **免登入**：進度、連闖與故事完成度只存在瀏覽器 `localStorage`。
- **中英雙語**：中文在根路徑，英文在 `/en/`；兩語共用同一每日題組。
- **SEO 完整**：canonical、hreflang、雙語 sitemap、OG/Twitter、首頁 JSON-LD。
- **不依賴外部地圖瓦片**：地圖底圖隨靜態包提供，避免第三方 tile 服務。
- **可部署子路徑**：目前測試站位於 `https://test.grace-word.com/bibleart/`。
- **內容防劇透**：故事庫只允許今日故事與已完成故事；未完成故事鎖定。

靜態架構的取捨是：**沒有可信的伺服器端分數、帳號同步或即時多人房間**。這些能力若要做，必須另外接後端。

## 2. 系統全貌

```text
┌────────────────────────────── 建置期（Node.js） ──────────────────────────────┐
│ data/questions.ts + data/i18n/* + data/verses.json + data/places.ts          │
│                         │                                                    │
│                         ▼                                                    │
│              getQuestions(locale) / getStories(locale)                        │
│                         │                                                    │
│                         ▼                                                    │
│   Next.js App Router 靜態輸出（out/）＋ sitemap / 404 / geo / images           │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     │ rsync
                                     ▼
                    Nginx / Cloudflare / CDN（純靜態檔案）

┌────────────────────────────── 執行期（瀏覽器） ──────────────────────────────┐
│ 靜態 HTML / JS / CSS                                                         │
│        │                                                                     │
│        ├─ Game（Client Component）── 答題、年代、地圖、結算                    │
│        ├─ localStorage ──────────── 連闖、最佳分、故事進度、最近 7 天           │
│        ├─ challenge token ───────── 題目 ID ＋ 可選分數（Base64URL）           │
│        └─ GA4 ───────────────────── 頁面與遊戲事件（帶 locale）                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 關鍵特性

| 特性 | 做法 |
| --- | --- |
| 靜態輸出 | `output: "export"`、`trailingSlash: true` |
| 子路徑 | `NEXT_PUBLIC_BASE_PATH=/bibleart`，由 Next.js `basePath` 處理 |
| 伺服器／客戶端邊界 | 頁面與資料組裝用 Server Components；遊戲、地圖、儲存、GA 用 Client Components |
| 資料傳遞 | Server Component 直接把序列化後的題目、故事、文案、地圖標註傳給 Client Component |
| 每日題組 | 以 UTC 日期作種子，瀏覽器與建置期算出同一組題目 |
| 進度 | `localStorage`，key 為 `biblegame.stats.v1` |
| 分享 | 挑戰 token 放在 `?challenge=`，不經伺服器 |
| 地圖 | Leaflet + 本地 Natural Earth GeoJSON，動態載入且停用 SSR |

## 3. 路由與渲染

### 路由表

| 路徑 | 頁面 | 渲染方式 | 索引 |
| --- | --- | --- | --- |
| `/` | 中文首頁 | Server + `DailyStatus` client | 可索引 |
| `/play/` | 中文每日挑戰 | Server 外殼 + `Game` client | 可索引 |
| `/stories/` | 中文故事庫 | Server 外殼 + `StoryLibrary` client | 可索引 |
| `/progress/` | 中文我的紀錄 | Server 外殼 + `ProgressDashboard` client | `noindex` |
| `/places/` | 中文地名對照 | Server | `noindex` |
| `/credits/` | 中文素材版權 | Server | 可索引 |
| `/en/...` | 英文對應頁 | 同上 | 同上 |
| `/sitemap.xml` | 雙語 sitemap | 靜態 route | — |
| `404` | 自訂找不到頁面 | `global-not-found.tsx` | — |

### 雙根布局

```text
app/
  (zh)/layout.tsx      <html lang="zh-Hant">
  (zh)/page.tsx         /
  (zh)/play/page.tsx    /play/
  (zh)/stories/page.tsx /stories/
  (zh)/progress/page.tsx/progress/
  (zh)/places/page.tsx  /places/
  (zh)/credits/page.tsx /credits/

  (en)/layout.tsx      <html lang="en">
  (en)/en/page.tsx      /en/
  (en)/en/play/page.tsx /en/play/
  ...
```

- 語言由**網址**決定，不做瀏覽器語言自動跳轉，避免 SEO 與分享連結不明確。
- `LocaleSwitcher` 依目前路徑切到另一語言；切換會整頁刷新，這是多根布局的預期行為。
- Server Component 只負責取資料與組 HTML；任何需要 `window`、`localStorage` 或 Leaflet 的邏輯都放在 client 元件。

## 4. 雙語與內容模型

### 資料分層

| 層 | 檔案 | 說明 |
| --- | --- | --- |
| 題目事實 | `data/questions.ts` | 30 題的 ID、答案、選項、年份、座標、經文出處、圖片授權 |
| 英文題目覆寫 | `data/i18n/en/questions.ts` | 英文答案、選項、提示、摘要、地名、畫作標題 |
| UI 文案 | `data/i18n/zh-Hant.ts`、`en.ts` | 兩份完整 `UiText` 字典 |
| 故事 | `data/stories.ts`＋`data/i18n/stories.ts` | 6 個故事、每故事 5 題、年代／主題／順序／錨點 |
| 藝術知識 | `data/i18n/art-notes.ts` | 每題中英各一則 |
| 經文 | `data/verse-refs.ts` → `data/verses.json` | CUV／WEB 經文，腳本產生後提交 |
| 地點 | `data/places.ts` | 聖經地名、區域、現代地名、地理小知識 |
| 標籤 | `data/i18n/story-taxonomy.ts`、`badges.ts` | 年代／主題／徽章文案 |

`data/i18n/index.ts` 的 `getQuestions(locale)` 會把「題目事實 + 英文覆寫 + 經文 + 地點 + 藝術知識 + 故事歸屬」合併成 `GameQuestion`。這樣畫面層不需要知道資料來自哪個檔。

### 新增內容的檢查點

1. 題目事實與英文覆寫都要有，且 `answer` 必須在 `options` 內。
2. 經文出處更新後執行 `node scripts/fetch-verses.mjs`。
3. 藝術知識與地點資料要中英各一。
4. 故事若要新增或改順序，`data/stories.ts` 每故事必須 5 題，並更新 `data/i18n/stories.ts`。
5. 執行 `npm test`；題庫、故事、雙語、座標、圖片與經文會一起檢查。

## 5. 每日題組

`lib/daily.ts` 是每日內容的唯一來源：

```text
UTC 日期（YYYY-MM-DD）
        │
        ├─ hashString（FNV-1a）→ mulberry32 → seededShuffle
        │
        ├─ 週一～週六：本週故事順序洗牌 → 當天故事 → 該故事 5 題
        └─ 週日：全部題目洗牌 → 取 5 題混合
```

- 日期固定用 **UTC**：北京時間 08:00、美東 19:00–20:00 換題。
- 中英文只依「日期 + 題目 ID」抽題，因此兩語一定看到同一組題目。
- 故事順序以「本週星期一」為種子洗牌；一週內每個故事最多出現一次。
- 週日沒有故事，改用混合題。
- 抽題是純函式，測試可固定日期驗證確定性。

## 6. 遊戲流程與狀態機

`components/Game.tsx` 是主要的 client 狀態機。

```text
answer ──答對──▶ locate ──送出（年份已選＋地圖已點）──▶ result
  │                                                        │
  └─答錯：加入 wrong、縮小圖片、顯示提示                     └─下一題／summary
```

### 模式

| 模式 | 進入方式 | 每日連闖 | 故事進度 | 分享 |
| --- | --- | --- | --- | --- |
| 每日故事 | `/play/`（週一～六） | 記錄 | 記錄 | 戰績＋挑戰好友 |
| 每日混合 | `/play/`（週日） | 記錄 | 不記錄 | 戰績＋挑戰好友 |
| 練習 | `/stories/` 已完成故事或 `?story=` | 不記錄 | 更新最佳分 | 不顯示每日分享 |
| 挑戰 | `?challenge=<token>` | 不記錄 | 不記錄 | 比較朋友成績＋分享自己的成績 |
| 鎖定 | 未完成故事 | — | — | 顯示解鎖提示 |

### 單題流程

1. **辨識**：四選一；第一次答錯顯示經文，之後顯示提示；每次答錯使圖片縮小一級，分數乘上遞減係數。
2. **定位**：年份必須實際操作（`yearTouched`），地圖必須點擊；兩者都完成才能送出。
3. **結算**：顯示年代分、地理分、距離、完整地名、關鍵經文、藝術知識、地理知識。
4. **故事結算**：顯示旅程地圖、五幕回顧、戰績方塊；每日模式可再發起挑戰。

## 7. 計分

`lib/scoring.ts`：

- **辨識係數**：`max(0.4, 1 - 0.2 × 答錯次數)`。
- **年代分**：誤差在容忍區間 20% 內滿分；之後線性遞減，到容忍上限為 0。
- **地理分**：Haversine 距離；0 km 為 5,000 分，1,500 km 以上為 0 分。
- **單題**：年代分 + 地理分，兩者都先乘辨識係數；滿分 10,000。
- **每日**：5 題滿分 50,000。
- **等級**：45,000／35,000／25,000／12,000 分成五級，文案在 `scoreTier`。

挑戰 token 的分數上限為 100,000，足夠容納目前 5 題×10,000，也保留未來題數調整空間。

## 8. 儲存與進度

`lib/storage.ts` 使用單一 key：

```text
biblegame.stats.v1
```

```ts
interface Stats {
  streak: number;
  bestScore: number;
  lastPlayed: string | null;
  plays: Record<string, number>;          // UTC 日期 → 當日最高分
  stories: Record<
    string,
    {
      completed: boolean;
      bestScore: number;
      maxScore: number;
      lastPlayed: string;
      plays: number;
    }
  >;
}
```

規則：

- 每日分數只在**非練習、非挑戰**時記錄；同日重玩保留最高分。
- 連闖以「昨天是否有遊玩」計算；同日重玩不增加。
- 故事進度在每日故事與練習時都會更新；完成後解鎖練習。
- 挑戰與練習都不影響每日連闖，也不解鎖故事。
- 所有資料只在該瀏覽器；換裝置、無痕模式或清除網站資料都會重置。
- 舊資料以預設值合併，沒有獨立 migration 流程；若未來改 schema，應升 key 版本。

## 9. 挑戰好友

### 建立

- **從我的紀錄**：從已完成故事的所有題目中隨機抽 5 題，`encodeChallenge(ids)` 產生**無分數**連結，直接導向挑戰頁。
- **從每日結算**：把當天 5 題與自己的總分寫入 token，產生**帶分數**連結。

### Token 格式

```json
{
  "v": 1,
  "ids": ["cana", "storm", "feed5000", "walk_water", "last_supper"],
  "s": 42000
}
```

- 以 Base64URL 編碼，放在 `?challenge=`。
- `ids` 去重、限制 10 題，ID 只允許 `[a-z0-9_]`。
- `s` 可省略；有值時限制 0–100,000 並四捨五入。
- **沒有簽章**：任何人都能修改 token 內的分數。這是靜態架構的已知限制，不能用於正式競賽或獎勵。

### 流程

```text
發起者（我的紀錄／每日結算）
  → token（可含分數）
  → 朋友開 /play/?challenge=...
  → 挑戰模式（練習，不影響每日）
  → 結算：朋友的成績 vs 你的成績、差距、勝負
  → 朋友可再分享自己的成績
```

- 舊 token 沒有 `s` 仍可玩，只是不顯示比較，改為提示分享自己的成績。
- 挑戰題目可能包含收件者尚未完成的故事，畫面會提示；這是刻意允許的，用於朋友互相出題。
- 挑戰連結不包含答案；答案本來就在前端題庫中，靜態站無法防止有心人查看。

## 10. 地圖

- `MapGuess` 以 `next/dynamic`、`ssr: false` 載入 `MapGuessInner`，避免 Leaflet 在伺服器端執行。
- 底圖為 `public/geo/land.json`、`lakes.json`、`rivers.json`，由 Natural Earth 1:50m 產生。
- 不請求 OpenStreetMap 或任何外部 tile。
- 海域／區域標籤由 `lib/map-labels.ts` 提供；猜測階段只顯示區域提示。
- 若本題地名與標籤同名，猜測時會隱藏該標籤，避免劇透；提交後才顯示正確位置。
- 故事結算的 `StoryRecap` 使用同一套地圖元件畫出五幕路線。
- 地圖資料載入失敗時顯示錯誤訊息，不影響其他題目流程。

## 11. SEO、分析與隱私

- `lib/seo.ts` 的 `buildMetadata` 產生 canonical、hreflang（`zh-Hant`／`en`／`x-default`）、OG、Twitter、icons。
- 首頁 `HomePage` 有 `WebSite` JSON-LD。
- `app/sitemap.ts` 只收錄 `/`、`/play/`、`/stories/`、`/credits/` 與英文版；`/progress/`、`/places/` 不進 sitemap。
- `/progress/`、`/places/` 設 `robots: noindex`；測試站另由 Nginx 加 `X-Robots-Tag: noindex`。
- GA4 由 `components/Analytics.tsx` 載入，事件帶 `locale`；未設定 `NEXT_PUBLIC_GA_ID` 時不啟用。
- 目前沒有 cookie consent 或帳號資料；遊戲進度不離開瀏覽器。

## 12. 建置與部署

```text
.env.production
  NEXT_PUBLIC_BASE_PATH=/bibleart
  NEXT_PUBLIC_SITE_URL=https://test.grace-word.com
  NEXT_PUBLIC_IMAGE_BASE_URL=https://cdn.grace-word.com/game/images
  NEXT_PUBLIC_GA_ID=G-7CEHJHLWK1
        │
        ▼
npm run build → out/
        │
        ├─ npm run check:export（雙語、SEO、sitemap、404、geo）
        └─ rsync → /opt/common/nginx/html/graceword/bibleart/
```

- 圖片走 CDN；`out/images/` 是本地回退，`SafeImage` 在 CDN 失敗時改用本地檔。
- `_next/static` 由 Nginx 提供，透過長快取與 Cloudflare 邊緣快取加速；不改 `assetPrefix`。
- HTML/RSC 短快取；更新後若看到舊版，Purge Cloudflare `/bibleart/`。
- 詳細主機、Nginx、快取與驗收指令見 [DEPLOY.md](DEPLOY.md)。

## 13. 測試策略

目前以 Vitest 單元測試與建置後檢查為主：

| 類型 | 檔案／指令 | 涵蓋 |
| --- | --- | --- |
| 計分 | `test/scoring.test.ts` | Haversine、年代、地理、辨識係數 |
| 每日 | `test/daily.test.ts` | UTC、種子、確定性、故事／混合 |
| 題庫 | `test/questions.test.ts` | 欄位、選項、提示、座標、圖片、經文 |
| 故事 | `test/stories.test.ts` | 故事完整性、年代／主題／錨點、每日選擇 |
| 存取 | `test/story-access.test.ts` | 今日、已完成、鎖定 |
| 進度 | `test/storage.test.ts`、`test/badges.test.ts` | 最佳分、完成度、徽章、最近 7 天 |
| 挑戰 | `test/challenge.test.ts` | 編碼、解碼、去重、非法 token、分數 |
| 雙語 | `test/i18n.test.ts` | 英文題目、路徑、SEO metadata |
| 地圖 | `test/map-labels.test.ts`、`test/geo.test.ts` | 標註、縮放、防劇透、GeoJSON |
| 建置 | `npm run check:export` | 雙語頁面、canonical/hreflang、sitemap、404、geo |

目前共 **200 項測試**通過。尚缺瀏覽器端 E2E（Playwright/Cypress）與視覺回歸測試。

## 14. 關鍵設計決策

| 決策 | 選擇 | 理由 | 代價 |
| --- | --- | --- | --- |
| 後端 | 無，純靜態 | 低成本、易部署、無維運 | 無帳號、無可信分數、無多人房間 |
| 進度 | `localStorage` | 免登入、隱私簡單 | 換裝置不同步、可被清除 |
| 每日題組 | UTC + 種子洗牌 | 中英同步、可重現、免 API | 換題時間對部分地區不直覺 |
| 雙語 | 自製字典＋雙根布局 | 不引入 i18n 框架、SEO 清楚 | 每頁需維護兩份文案 |
| 地圖 | 內嵌 GeoJSON＋Leaflet | 不依賴外部 tile、國內穩定 | 檔案較大、需自維護標註 |
| 挑戰 | 無簽章 token | 不需後端即可分享 | 分數可偽造 |
| 圖片 | CDN＋本地回退 | 效能與穩定兼顧 | 新圖需手動上傳 CDN |
| 資源 | `_next/static` 留 Nginx | 避免每次建置同步 CDN | 依賴 Cloudflare 快取 |

## 15. 已知限制與技術債

- 挑戰分數可被修改；不可作為正式排名或獎勵依據。
- 題目與答案都在前端 bundle，無法防止刻意查看原始碼。
- 進度綁定單一瀏覽器，沒有跨裝置同步。
- 目前內容只有新約 6 個故事／30 題；舊約、教會歷史、季節活動尚未開始。
- 尚無 E2E 測試；地圖互動與分享流程主要靠人工驗收。
- 新增圖片後需手動上傳 CDN 並確認 200；CDN 快取需手動刷新。
- 自訂 404 需在 Nginx 設定 `error_page` 才會在伺服器層生效；目前依賴靜態 `404.html` 與 Next.js 行為。
- 部署文件與實際主機路徑曾不一致，已在本版同步為 `/opt/common/nginx/html/graceword/bibleart/`；若主機搬遷，以 `DEPLOY.md` 為準重新確認。
