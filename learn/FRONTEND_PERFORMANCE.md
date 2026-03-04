# 前台效能優化技術總整理

> 適用專案：Smart Market 前台（Nuxt 4 + Vue 3 + Tailwind CSS）

---

## 一、渲染策略（Hybrid Rendering）

使用 Nuxt `routeRules` 針對不同頁面選擇最適合的渲染方式。

```typescript
// nuxt.config.ts
routeRules: {
  // SSG：FAQ 幾乎不變，build 時預渲染，放 CDN 最省資源
  '/faq':           { prerender: true },

  // ISR：優惠券由後台 CRUD 管理，最多延遲 60 秒自動更新
  '/coupons':       { swr: 60 },

  // CSR：需要登入的個人化頁面，SEO 無意義
  '/cart':          { ssr: false },
  '/checkout':      { ssr: false },
  '/buy_order/**':  { ssr: false },
  '/sell_order/**': { ssr: false },
  '/profile':       { ssr: false },
  '/favorite':      { ssr: false },
  '/upload':        { ssr: false },
  '/invoice/**':    { ssr: false },

  // 未列出的頁面（/ /products /seller 等）預設 SSR：SEO + 即時資料
}
```

| 策略 | 適合場景 | 資料即時性 |
|------|----------|----------|
| SSG | 內容不變（FAQ） | 凍結在 build 當下 |
| ISR | 偶爾更新（優惠券） | 最多延遲 N 秒 |
| SSR | 電商、商品、賣家頁 | 每次請求即時 |
| CSR | 登入後個人化頁面 | 即時（client 打 API）|

---

## 二、Code Splitting（程式碼分割）

將不常更新的大套件獨立打包，利用瀏覽器快取長期有效。

```typescript
// nuxt.config.ts → vite.build.rollupOptions
manualChunks: {
  'vue-vendor':    ['vue', 'vue-router', 'pinia'],   // 框架核心
  'socket-client': ['socket.io-client'],              // WebSocket 客戶端
  'dayjs':         ['dayjs'],                         // 日期處理
}
```

**效果：** 改了業務程式碼後，vue-vendor（~300KB）、socket-client（~200KB）的 hash 不變，瀏覽器繼續吃快取，只重新下載真正有改變的 chunk。

> Nuxt 路由也會自動 Route-based splitting，進哪頁才載入該頁的 JS。

---

## 三、Lazy Loading（延遲載入）

依資源類型分兩種，核心概念相同：**用到再載，不用不載**。

### 1. 元件 Lazy Loading

Nuxt 提供 `<Lazy>` 前綴語法，元件進入視口才下載該元件的 JS：

```html
<!-- 不用 import，Nuxt 自動識別 Lazy 前綴 -->
<LazyProductCard v-for="p in products" :key="p.id" :product="p" />
<LazyFooter />
```

也可以用 Vue 原生的 `defineAsyncComponent`，適合更細緻控制（加 loading/error slot）：

```typescript
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
```

### 2. 路由 Lazy Loading（Route-based Splitting）

Nuxt 自動處理，`pages/` 下每個頁面編譯成獨立 chunk，進入該路由才下載對應的 JS，無需手動設定。

> 這也是「二、Code Splitting」中 `manualChunks` 的互補：manualChunks 控制第三方套件的分包；路由 Lazy Loading 控制業務頁面的分包。

---

## 四、Tree Shaking（搖樹優化）

Vite 打包工具使用 ES Modules（`import/export`），自動剔除沒用到的程式碼（Dead Code）。

- 全程使用 `import` 而非 `require`（CommonJS 無法 Tree Shaking）
- 按需引入套件，不整包 import

---

## 五、Bundle Analyzer（打包分析）

```typescript
// nuxt.config.ts → vite.plugins
visualizer({ filename: '.output/stats.html', gzipSize: true })
```

build 後開啟 `.output/stats.html` 可視覺化查看每個套件佔用的體積，同時用來驗證二、四點是否正確執行：

**驗證 Code Splitting（manualChunks）：**
```
看報告中是否出現獨立的 chunk：
  vue-vendor.[hash].js    ✅ 有獨立出來
  socket-client.[hash].js ✅ 有獨立出來
  dayjs.[hash].js         ✅ 有獨立出來

如果這些套件還混在 main chunk 裡 → manualChunks 沒生效
```

**驗證 Tree Shaking：**
```
看某個套件的體積是否合理：
  lodash（全包）→ 報告顯示 500KB  ❌ 代表沒有 Tree Shaking
  lodash-es（按需）→ 報告顯示 10KB ✅ 代表有 Tree Shaking

如果看到某個很少用到的套件體積異常大 → 改用 ES Module 版本或按需 import
```

---

## 六、圖片優化（@nuxt/image）

使用 `<NuxtImg>` 替代原生 `<img>`：

```html
<NuxtImg :src="product.imageUrl" :alt="product.name"
  class="w-full h-full object-cover" />
```

| 功能 | 說明 |
|------|------|
| **自動轉 WebP** | 比 JPEG 小 25~35%，比 PNG 小更多 |
| **Lazy Loading** | 預設 `loading="lazy"`，視口外的圖片不載入 |
| **響應式圖片** | 自動產生不同尺寸，手機載入小圖 |

---

## 七、Vue / Nuxt 程式碼層面優化

| 技術 | 應用位置 | 說明 |
|------|----------|------|
| `shallowRef` | `stores/chat.ts`、部分頁面 | Socket.io 等大物件避免 Vue 深度代理，節省記憶體 |
| `v-for :key` | 所有列表 | 讓 Vue diff 演算法精準更新，避免整列重渲染 |
| `useLazyFetch` | SSR 頁面 | 非阻塞式資料抓取，不影響首屏速度 |
| `onUnmounted` 清理 | ChatWidget、HeaderUserMenu 等 | 清除 EventSource、interval，避免記憶體洩漏 |
| **防抖 `useDebounce`** | 搜尋框 | 避免每打一個字就發 API 請求，預設延遲 300ms |
| **API 集中管理** | `composables/api/`（共 11 個） | 統一透過 `useApi()` 發出，自動注入 JWT，不重複寫 header |

---

## 八、Virtual List + 無限滾動（搭配使用）

`pages/products/index.vue` 將兩者結合，解決「資料量大」和「資料持續增加」兩個問題：

```
無限滾動             → 解決「一次不拿太多資料」（分批向後端請求）
Virtual List         → 解決「已拿到的資料不全塞進 DOM」（只渲染可視區域）
```

**如果只用無限滾動、不用 Virtual List：**
```
第 1 頁：20 筆 → DOM 有 20 個節點
第 5 頁：滾到這裡已累積 100 個節點
第 20 頁：400 個節點全部存在 DOM → 開始卡頓
```

**兩者搭配後：**
```
無論滾到第幾頁，DOM 中永遠只有約 30 個節點（可視列 + OVERSCAN 緩衝）
paddingTop / paddingBottom 撐起完整高度，scrollbar 行為正常
```

**實作細節：**

Virtual List 本來就需要追蹤 `scrollY`，因此無限滾動直接複用同一個 scroll 事件，不需要額外的 Observer：

```typescript
const { y: scrollY } = useWindowScroll()

// Virtual List：用 scrollY 算出要渲染哪幾列
const virtualState = computed(() => {
  const startIdx = Math.floor((scrollY.value - containerOffsetTop.value) / rowHeight)
  // 只回傳可視範圍內的 rows
})

// 無限滾動：同一個 scroll 事件，距底部 300px 就載入下一頁
const handleWindowScroll = () => {
  if (document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 300) {
    loadMore()
  }
}
window.addEventListener('scroll', handleWindowScroll, { passive: true })
```

> `seller/[id].vue` 沒有 Virtual List，不需要追蹤 scrollY，改用 `useIntersectionObserver` 偵測哨兵元素，更簡潔。

---

## SEO 優化

### Sitemap（@nuxtjs/sitemap）

非 Nuxt 內建，需安裝官方模組：

```typescript
// nuxt.config.ts
modules: ['@nuxtjs/sitemap'],
sitemap: {
  sitemaps: true,
  sources: ['/api/__sitemap__/urls'],  // 後端提供動態 URL 清單
}
```

產生位置：`https://yourdomain.com/sitemap.xml`（非實體檔案，每次請求時即時產生）

讓 Google 爬蟲直接拿到所有商品、賣家頁面的 URL 清單，不必靠連結一頁頁找。

---

## 維運優化（DevOps / 部署層）

> 以下兩項改的是 `nginx/nginx.conf`，屬於伺服器層配置，非前端程式碼。
> 小型專案由前端工程師兼任，大型公司由 DevOps / SRE 負責。

### Gzip 壓縮

```nginx
gzip              on;
gzip_vary         on;
gzip_proxied      any;
gzip_comp_level   6;
gzip_types        text/plain text/css text/javascript application/javascript
                  application/json application/x-javascript text/xml
                  application/xml image/svg+xml;
```

**效果：** JS/CSS 傳輸體積減少約 60~70%。
驗證：F12 → Network → Response Headers 出現 `Content-Encoding: gzip`

### HTTP/2

```nginx
listen 443 ssl http2;
```

**效果：** 啟用多路復用（Multiplexing），同一個 TCP 連線可並行傳送多個檔案，不再排隊等待。
驗證：F12 → Network → Protocol 欄位顯示 `h2`
