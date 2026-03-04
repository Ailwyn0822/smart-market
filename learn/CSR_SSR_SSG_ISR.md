# CSR vs SSR vs SSG vs ISR — 渲染模式完整比較

---

## 名詞解釋

| 縮寫 | 全名 | 中文 |
|------|------|------|
| CSR | Client-Side Rendering | 客戶端渲染 |
| SSR | Server-Side Rendering | 伺服器端渲染 |
| SSG | Static Site Generation | 靜態網站生成 |
| ISR | Incremental Static Regeneration | 漸進式靜態再生 |
| CDN | Content Delivery Network | 內容傳遞網路 |
| SWR | Stale While Revalidate | 舊的先用，背景更新 |

### CDN 是什麼？

分散在全球各地的伺服器群，讓使用者從最近的節點拿靜態檔案：

```
沒有 CDN：台灣使用者 → 連到美國主機 → 延遲 200ms
有  CDN：台灣使用者 → 連到台灣 CDN 節點 → 延遲 5ms
```

---

## 優缺點比較表

| | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| **首屏速度** | 慢（等 JS） | 快 | 最快（CDN） | 快（快取後） |
| **SEO** | 差 | 好 | 好 | 好 |
| **資料即時性** | 即時 | 即時 | 凍結在 build | 延遲 N 秒 |
| **伺服器負載** | 無（純前端） | 每次請求都跑 | 無（純靜態） | 只跑第一次 |
| **伺服器費用** | 低 | 中高 | 極低／免費 | 中 |
| **動態個人化** | ✅ | ✅ | ❌ | ❌ |
| **新增資料即時反映** | ✅ | ✅ | ❌ 要重 build | ⚠️ 延遲 N 秒 |
| **需要伺服器常駐** | ❌ | ✅ | ❌ | ✅ |
| **適合場景** | 後台、登入後頁面 | 電商、社群 | 部落格、文件 | 新聞、大流量電商 |

---

## 運作流程

### CSR（客戶端渲染）

```
使用者訪問頁面
  → 伺服器給空 HTML（<div id="app"></div>）
  → 瀏覽器下載 JS Bundle
  → JS 執行，打 API 拿資料
  → Vue 渲染畫面
  → 使用者才看到內容（可能 2~5 秒後）
```

**F12 Network 看到：** 一開始空 HTML，之後 API 請求

---

### SSR（伺服器端渲染）

```
使用者訪問頁面
  → 伺服器執行 Vue + 打 API → 產生完整 HTML
  → 瀏覽器收到完整 HTML → 立刻顯示內容
  → 瀏覽器下載 JS → 水合（Hydration）→ 變成可互動的 Vue App
```

**F12 Network 看到：** 第一個 HTML 就是完整內容，不見 API 請求（伺服器打的，瀏覽器看不到）

---

### SSG（靜態網站生成）

```
npm run build 時：
  → Nuxt 把所有已知路由跑一遍（打 API 拿真實資料）
  → 產出 index.html、products/1.html、products/2.html...
  → 靜態檔案部署到 CDN

使用者訪問頁面：
  → CDN 直接給對應的 .html（不跑伺服器）
  → 瀏覽器立刻顯示內容（最快）
  → 下載 JS → 水合
```

**注意：** 資料凍結在 build 當下，不會自動更新

---

### ISR（漸進式靜態再生，swr: 60）

```
第 1 個使用者訪問（無快取）：
  → 伺服器即時跑 SSR → 產生 HTML → 傳給他 → 存進快取（60 秒）

第 2~N 個使用者（60 秒內）：
  → 直接拿快取，不跑伺服器（像 SSG 一樣快）

第 61 秒，有人訪問：
  → 先給舊快取（立刻回傳，使用者不等）
  → 背景重新跑 SSR → 更新快取

第 62 秒後的人：
  → 拿到新快取
```

**SWR = Stale While Revalidate：** 過期了先給舊的，背景悄悄更新

---

## 情境一：100 個使用者依序瀏覽 `/products/1`

### CSR
```
每個使用者都要：
  下載 JS → 執行 → 打 API → 畫面出現

API 打了 100 次（每人各自打）
每個人都要等 JS 下載完才看到內容
```

### SSR
```
每個使用者：
  伺服器跑一次 Vue + 打 API → HTML 傳給他

伺服器跑了 100 次
每人第一眼就看到完整內容
```

### SSG
```
build 時跑一次 → 產出 products/1.html → 放 CDN

100 個使用者全部直接拿 CDN 的靜態檔

伺服器負擔：0
速度：最快
```

### ISR
```
第 1 人：伺服器跑一次 → 傳給他 → 存快取

第 2~100 人（60 秒內）：直接拿快取，不跑伺服器

伺服器只跑了 1 次（第 1 人），其餘全部吃快取
```

---

## 情境二：後台改 ID 1 商品價格、新增 ID 999 商品

### CSR
```
改 ID 1 價格：
  使用者重新整理 → 重新打 API → 立刻看到新價格 ✅

新增 ID 999：
  訪問 /products/999 → 打 API → 立刻看到 ✅
```

### SSR
```
改 ID 1 價格：
  下一個訪問的人 → 伺服器即時打 API → 立刻看到新價格 ✅

新增 ID 999：
  訪問 /products/999 → 伺服器即時打 API → 立刻看到 ✅
```

### SSG
```
改 ID 1 價格：
  所有人還是看到舊價格 ❌
  → 需要重新 npm run build → 重新部署

新增 ID 999：
  /products/999 根本沒有 .html 檔 → 404 ❌
  → 需要重新 build，且把 999 加進預渲染清單
```

### ISR
```
改 ID 1 價格：
  60 秒內：還是看到舊價格 ⚠️
  60 秒後第一個人訪問：先拿舊快取 → 背景更新
  之後的人：看到新價格 ✅

新增 ID 999（從未被訪問過）：
  第 1 個訪問 /products/999 的人（無快取）
    → 伺服器即時跑 SSR → 拿到資料 → 存進快取 60 秒 ✅
  之後 60 秒內的人：拿快取 ✅
  （不是 404，ISR 對未知路由自動 fallback 到 SSR）
```

---

## 什麼時候選哪個？

```
需要登入才能看？個人化內容（訂單、購物車）？
  → CSR

資料隨時變動？中小型專案？
  → SSR

內容靜態、幾乎不變（部落格、FAQ、說明頁）？
  → SSG（最省錢，可放 CDN）

大流量 + 資料偶爾更新（新聞、熱門電商）？
  → ISR
```

---

## Smart Market 的建議配置

```typescript
// nuxt.config.ts
routeRules: {
  // SSR：商品、賣家需要即時資料 + SEO
  '/products/**':   { ssr: true },
  '/seller/**':     { ssr: true },

  // SSG：FAQ 幾乎不變
  '/faq':           { prerender: true },

  // ISR：優惠券由後台 CRUD 管理，可隨時更新，swr: 60 表示最多延遲 60 秒
  '/coupons':       { swr: 60 },

  // CSR：需要登入，不需要 SEO
  '/cart':          { ssr: false },
  '/checkout':      { ssr: false },
  '/buy_order/**':  { ssr: false },
  '/sell_order/**': { ssr: false },
  '/profile':       { ssr: false },
  '/favorite':      { ssr: false },
  '/upload':        { ssr: false },
}
```

---

## 補充：SSG 也能做動態路由

`pages/products/[id].vue` 是動態路由，SSG 可以處理，但要在 build 時告訴 Nuxt 有哪些 id：

```typescript
// nuxt.config.ts
hooks: {
  async 'nitro:config'(nitroConfig) {
    const products = await fetch('/api/products').then(r => r.json())
    nitroConfig.prerender!.routes = products.map(p => `/products/${p.id}`)
  }
}
```

**限制：** build 後新增的商品不會有靜態頁面，需要重新 build。
這就是為什麼動態電商商品適合 SSR 或 ISR，而非 SSG。
