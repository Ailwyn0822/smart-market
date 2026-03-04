# Smart Market — Frontend Client 技術文件

> 二手商品交易平台前台，以「手工藝文具」為視覺主題，提供買賣雙向完整交易體驗。
> 本文件根據每一個源碼檔案逐一整理，適用於技術面試展示。

---

## 目錄

1. [技術棧總覽](#技術棧總覽)
2. [專案結構](#專案結構)
3. [核心配置](#核心配置)
4. [架構設計原則](#架構設計原則)
5. [Layouts 佈局系統](#layouts-佈局系統)
6. [頁面功能詳解](#頁面功能詳解)
7. [組件詳解](#組件詳解)
8. [Pinia 狀態管理](#pinia-狀態管理)
9. [Composables 組合函式](#composables-組合函式)
10. [工具函式](#工具函式)
11. [國際化（i18n）](#國際化i18n)
12. [樣式系統](#樣式系統)
13. [測試策略](#測試策略)
14. [建置與部署](#建置與部署)
15. [關鍵技術決策](#關鍵技術決策)

---

## 技術棧總覽

| 類別 | 技術 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Nuxt | 4.3.0 | SSR/SSG、File-based Routing、自動導入 |
| UI 框架 | Vue | 3.5.27 | Composition API、`<script setup>` |
| 語言 | TypeScript | 5+ | 全端型別安全 |
| 樣式 | Tailwind CSS | 4.x | Utility-first、客製化 Design Token |
| 狀態管理 | Pinia | 3.0.4 | Setup Store 風格，Cookie 持久化 |
| 國際化 | @nuxtjs/i18n | 10.2.1 | zh-TW / en / vi 三語言 |
| 即時通訊 | Socket.io-client | 4.8.3 | 買賣雙方即時聊天 |
| 圖片處理 | @nuxt/image | 2.0.0 | WebP 轉換、懶加載、CDN 支援 |
| 圖標 | @nuxt/icon + Iconify | 2.2.1 | Material Symbols、line-md |
| 工具集 | @vueuse/core | 14.2.1 | IntersectionObserver、useTemplateRef |
| 日期 | Day.js | 1.11.19 | 日期格式化 |
| SEO | @nuxtjs/sitemap | 7+ | Sitemap 自動生成 |
| 測試 | Vitest + @nuxt/test-utils | 4.0.18 / 4.0.0 | 單元測試 |
| DOM 模擬 | happy-dom / jsdom | 20.x / 27.x | 測試環境 |

---

## 專案結構

```
frontend-client/
├── app/
│   ├── assets/css/
│   │   └── main.css                   # 全域樣式（手工藝主題）
│   ├── components/                    # 可複用 UI 組件（13 個）
│   │   ├── AppToast.vue               # 全域 Toast 通知系統
│   │   ├── ChatWidget.vue             # 即時聊天視窗（Socket.io）
│   │   ├── Footer.vue                 # 頁腳
│   │   ├── GoogleLoginBtn.vue         # Google OAuth 登入按鈕
│   │   ├── HeaderLogo.vue             # 品牌 Logo
│   │   ├── HeaderUserMenu.vue         # 通知鈴鐺 + 使用者下拉選單
│   │   ├── LanguageSwitcher.vue       # 三語言切換
│   │   ├── LineLoginBtn.vue           # LINE OAuth 登入按鈕
│   │   ├── LoginDecorations.vue       # 登入頁背景裝飾
│   │   ├── NotebookSidebar.vue        # 商品篩選側邊欄
│   │   ├── ProductCard.vue            # 商品卡片（含顏色輪替）
│   │   ├── ProductCardSkeleton.vue    # 商品卡片骨架屏
│   │   └── StickyNoteField.vue        # 便利貼風格表單欄位
│   ├── composables/                   # 組合函式（3 個）
│   │   ├── useDebounce.ts             # 防抖（MaybeRefOrGetter 泛用輸入）
│   │   ├── useHomeData.ts             # 首頁靜態資料（i18n computed）
│   │   └── useToast.ts                # 全域 Toast 佇列
│   ├── layouts/                       # 佈局（3 個）
│   │   ├── default.vue                # 標準佈局（Header + Footer + Chat）
│   │   ├── auth.vue                   # 認證佈局（精簡 Header）
│   │   └── empty.vue                  # 空白佈局（發票列印用）
│   ├── pages/                         # 22 個路由頁面
│   │   ├── index.vue                  # 首頁
│   │   ├── login.vue                  # 登入
│   │   ├── register.vue               # 註冊
│   │   ├── profile.vue                # 個人資料設定
│   │   ├── favorite.vue               # 我的收藏
│   │   ├── upload.vue                 # 商品上架（AI 自動填入）
│   │   ├── cart.vue                   # 購物車（多賣家分組）
│   │   ├── checkout.vue               # 結帳（COD / 綠界金流）
│   │   ├── coupons.vue                # 優惠券列表
│   │   ├── faq.vue                    # 常見問題
│   │   ├── order_completed.vue        # 下單成功
│   │   ├── products/
│   │   │   ├── index.vue              # 商品列表（虛擬滾動）
│   │   │   └── [id].vue              # 商品詳情（Q&A、評價、收藏）
│   │   ├── buy_order/
│   │   │   ├── index.vue              # 我的購買訂單
│   │   │   └── [id].vue              # 購買訂單詳情（取消、評價）
│   │   ├── sell_order/
│   │   │   ├── index.vue              # 我的銷售訂單
│   │   │   └── [id].vue              # 銷售訂單詳情（出貨、取消審核）
│   │   ├── seller/
│   │   │   ├── [id].vue              # 賣家商店（無限滾動商品 + 評價）
│   │   │   └── dashboard.vue          # 賣家儀表板
│   │   └── invoice/
│   │       └── [id].vue              # 列印發票（empty layout）
│   ├── stores/                        # Pinia Store（3 個）
│   │   ├── auth.ts                    # 認證：token、user、login/logout
│   │   ├── cart.ts                    # 購物車：多賣家、折扣、Cookie 持久化
│   │   └── chat.ts                    # 聊天：Socket.io、聯絡人、未讀計數
│   ├── types/
│   │   └── index.ts                   # 前端 UI 型別（ProductItem 等）
│   ├── utils/
│   │   └── validation.ts              # 商品表單驗證函式
│   └── app.vue                        # 根組件（NuxtLayout + NuxtPage）
├── i18n/
│   └── language/
│       ├── zh_TW.json                 # 繁體中文（預設）
│       ├── en.json                    # 英文
│       └── vi.json                    # 越南文
├── GoogleSheetToJson.js               # 從 Google Sheets 同步翻譯腳本
├── nuxt.config.ts                     # Nuxt 主配置
├── tailwind.config.js                 # Tailwind 客製化 Design Token
├── tsconfig.json                      # TypeScript 配置
├── vitest.config.ts                   # Vitest 測試配置
└── vitest-nuxt-stubs.ts               # 單元測試用 Nuxt composable stub
```

---

## 核心配置

### nuxt.config.ts

```typescript
// 模組
modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon',
          '@pinia/nuxt', '@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxt/test-utils/module']

// 運行時配置（環境變數）
runtimeConfig: {
  public: { apiBase: 'http://localhost:8080' }   // NUXT_PUBLIC_API_BASE 覆寫
}

// i18n：no_prefix 策略，瀏覽器語言偵測存 cookie
i18n: {
  strategy: 'no_prefix',
  defaultLocale: 'zh-TW',
  detectBrowserLanguage: { useCookie: true, cookieKey: 'smart_market_lang' }
}

// Vite 打包分包：將大型依賴獨立 chunk
manualChunks: {
  'vue-vendor':    ['vue', 'vue-router', 'pinia'],
  'socket-client': ['socket.io-client'],
  'dayjs':         ['dayjs']
}
```

### 共用型別套件（Monorepo Shared）

前端透過 TypeScript paths 別名與後端共享 enum / interface：

```typescript
// tsconfig（Nuxt 注入）
"@smart-market/shared": ["../../shared/src/index.ts"]
```

如此 `OrderStatus`、`UserRole`、`ApiProduct` 等型別前後端保持一致，消除型別漂移風險。

---

## 架構設計原則

### 1. Nuxt 4 自動導入

- `pages/` → 自動生成路由（File-based Routing）
- `components/` → 自動全域註冊
- `composables/` → 自動導入
- `stores/` → 自動導入（搭配 `@pinia/nuxt`）

無需手動 import，大幅減少樣板程式碼。

### 2. Composition API + `<script setup lang="ts">`

全專案採用此風格，reactivity model 以「最小 state + computed 派生」為原則：

```typescript
// ✅ 正確：state 最小化，computed 派生
const items = ref<CartItem[]>([])
const total = computed(() => subtotal.value - discountAmount.value)

// ❌ 避免：在 template 呼叫函式（每次 render 都重算）
// {{ calculateTotal(items) }}
```

### 3. API 通訊統一模式

```typescript
const config = useRuntimeConfig()
const authStore = useAuthStore()

const data = await $fetch(`${config.public.apiBase}/endpoint`, {
  headers: { Authorization: `Bearer ${authStore.token}` }
})
```

### 4. SSR 安全的持久化

`useCookie()` 為 Nuxt 提供的 SSR-safe API，Token 和購物車資料直接存入 cookie，避免 `localStorage` 在 SSR 時無法存取的問題。

### 5. ClientOnly 包裝

`ChatWidget` 用 `<ClientOnly>` 包裝，避免 Socket.io 在 SSR 初始化時的 hydration 不一致問題。

---

## Layouts 佈局系統

### default.vue（標準佈局）

```
Header
  ├── HeaderLogo
  ├── LanguageSwitcher
  ├── 購物車按鈕（c_totalItems badge）
  └── HeaderUserMenu（通知 + 使用者選單）
<slot />（頁面內容）
Footer
<ClientOnly>
  └── ChatWidget
</ClientOnly>
AppToast（全域）
```

### auth.vue（認證佈局）

精簡 Header，只有 Logo + LanguageSwitcher + 登入/註冊跳轉連結。用於 `/login`、`/register`。

### empty.vue（空白佈局）

純空白，僅 `<slot />`。用於 `/invoice/:id` 列印頁面，避免 Header/Footer 出現在列印結果中。

---

## 頁面功能詳解

### 首頁（`pages/index.vue`）

**功能：**
- 英雄區段：主標語、CTA 按鈕（上架 / 瀏覽商品）
- 商品分類：從 `GET /categories` 取得，6 種分類輪播入口
- 精選商品：`GET /products/latest`，4 張 ProductCard
- 說明插圖：認證、環保、安全、滿意度 4 個 Illustration

**關鍵實作：**
```typescript
// OAuth 回調：登入後後端 redirect 帶 token query
onMounted(() => {
  const token = route.query.token as string
  const user  = route.query.user  as string
  if (token && user) {
    authStore.login(token, JSON.parse(decodeURIComponent(user)))
    router.replace('/')
  }
})
```

`useLazyFetch` 非阻塞式載入商品，不影響首屏 TTI。

---

### 登入（`pages/login.vue`）

- Layout：`auth`
- 支援：帳密登入（`POST /auth/login`）、Google OAuth、LINE OAuth
- 登入成功：`authStore.login(token, user)` → `router.push('/')`
- OAuth 按鈕跳轉後端 `/auth/google`、`/auth/line`，回調 redirect 回首頁帶 query token

---

### 註冊（`pages/register.vue`）

- Layout：`auth`
- 欄位：username、email、password、confirmPassword（本地驗證密碼一致性）
- `POST /auth/register` → 後端回傳 `access_token + user` → 自動登入並導向首頁

---

### 個人資料（`pages/profile.vue`）

- `GET /users/profile` 載入現有資料
- 大頭貼上傳：點擊觸發 file input → `POST /users/avatar`（multipart/form-data）
- 儲存名稱：`PATCH /users/profile`
- 儲存成功後同步更新 `authStore.user`

---

### 商品列表（`pages/products/index.vue`）

**虛擬滾動實作：**

頁面最關鍵的效能優化。商品以 grid row 為單位進行虛擬化，DOM 只渲染可視區域：

```typescript
// 根據螢幕寬度決定每列欄數
const COLS = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
const ROW_HEIGHT = 420   // px

// 只渲染 visibleRows（可視範圍 ± overscan）
const virtualState = computed(() => {
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN)
  const endIdx   = Math.min(rows.length, Math.ceil((scrollTop + viewHeight) / ROW_HEIGHT) + OVERSCAN)
  return {
    paddingTop:    startIdx * ROW_HEIGHT,
    paddingBottom: (rows.length - endIdx) * ROW_HEIGHT,
    visibleRows:   rows.slice(startIdx, endIdx),
    startIdx,
  }
})
```

**其他功能：**
- 搜尋（防抖 300ms）+ 分類過濾 + 價格範圍 + 排序
- Intersection Observer 哨兵偵測觸底 → 自動載入下一頁
- `NotebookSidebar` 側邊欄篩選器

---

### 商品詳情（`pages/products/[id].vue`）

**展示：**
- Polaroid 風格商品圖片（輕微旋轉 -2°）
- 彩色圓形價格徽章（旋轉 +12°）
- 賣家資訊卡（頭像、評分、「聊聊」按鈕）
- SEO：JSON-LD Product schema + OG 標籤

**互動功能：**

| 功能 | API | 說明 |
|------|-----|------|
| 加入購物車 | `cartStore.addToCart()` | 本地 Pinia |
| 收藏 / 取消收藏 | `POST/DELETE /favorites/:id/favorite` | 登入後可用 |
| 商品評價 | `GET /reviews/product/:id?page=&limit=6` | 無限滾動，載入更多 |
| Q&A 提問 | `POST /product-questions` | 需登入，賣家不可自問 |
| Q&A 回答 | `POST /product-questions/:id/answer` | 僅賣家可回 |
| Q&A 刪除 | `DELETE /product-questions/:id` | 提問者或賣家可刪 |

**賣家自問限制：**
```html
<!-- 是賣家本人 → 顯示提示，隱藏輸入框 -->
<div v-if="authStore.isAuthenticated && sellerInfo?.id !== authStore.user?.id">
  <!-- 提問輸入框 -->
</div>
<div v-else-if="authStore.isAuthenticated && sellerInfo?.id === authStore.user?.id">
  {{ $t('products.qa_seller_restriction') }}
</div>
```

---

### 購物車（`pages/cart.vue`）

**多賣家分組結帳：**

購物車支援來自不同賣家的商品，但每次只能選一家結帳：

```typescript
// 以 userId 分組
const sellerGroups = computed(() => {
  const groups: Record<string, CartItem[]> = {}
  for (const item of cartStore.items) {
    const id = item.product.userId ?? 'unknown'
    if (!groups[id]) groups[id] = []
    groups[id].push(item)
  }
  return groups
})
```

**折扣碼流程：**
1. 使用者輸入 code → `POST /discount-codes/validate`
2. 後端回傳 `{ discountAmount }` → 存入 `cartStore.discountAmount`
3. `total = subtotal + shipping - discountAmount`（最低 0）

**折扣碼 Modal：** 列出所有可用折扣碼，點擊複製並帶入輸入框。

---

### 結帳（`pages/checkout.vue`）

**付款方式：**

| 方式 | 流程 |
|------|------|
| 線上付款（綠界 ECPay） | `POST /ecpay/checkout` → 回傳 HTML form → 自動 submit → 重導向綠界 |
| 貨到付款（COD） | `POST /orders` → 建立訂單 → 導向 `/order_completed?orderNumber=` |

**表單欄位：** 收件人姓名、email、配送地址、付款方式選擇

---

### 購買訂單詳情（`pages/buy_order/[id].vue`）

**配送狀態進度條：**
```
processing → shipped → out_for_delivery → delivered
   25%          50%           75%             100%
cancel_requested (黃色 25%)   cancelled (灰色 100%)
```

**動作按鈕（依狀態顯示）：**
- `out_for_delivery`：「確認收貨」→ `PATCH /orders/:id/status { status: 'delivered' }`
- `processing`：「申請取消」→ `POST /orders/:id/cancel-request`
- `cancel_requested`：黃色「等待賣家確認」標籤
- `delivered` 且未評價：「評價」→ 開啟評價 Modal

**評價 Modal（per-product + 賣家整體評分）：**
```typescript
// 每件商品獨立評分
productReviews.value = order.value.items.map(item => ({
  productId: item.productId, productName: item.productName,
  productImageUrl: item.productImageUrl, rating: 5, comment: ''
}))

// 額外賣家整體評分（productId: undefined）
sellerReview.value = { rating: 5, comment: '' }

// 批次送出
await $fetch(`${config.public.apiBase}/reviews/bulk`, {
  method: 'POST',
  body: { orderId: order.value.id, items: [...productReviews, sellerReview] }
})
```

---

### 銷售訂單詳情（`pages/sell_order/[id].vue`）

賣家視角，額外功能：

- `processing` → 「確認出貨」→ `PATCH /orders/:id/status { status: 'out_for_delivery' }`
- `cancel_requested` → 「同意取消 / 拒絕取消」→ `POST /orders/:id/cancel-respond { approve: boolean }`

---

### 商品上架（`pages/upload.vue`）

**Polaroid 上傳體驗：**
1. 拖放圖片到 Polaroid 框 / 點擊選擇
2. 圖片上傳 → `POST /products/analyze`（Gemini AI 分析）
3. AI 自動填入：商品名稱、分類、描述、建議售價
4. 使用者微調後送出 → `POST /products`

**表單驗證：**
```typescript
const { isValid, errors } = validateProductForm(form)
```

**StickyNoteField 組件：** 每個欄位以不同顏色的便利貼呈現（blue / pink / yellow / green），各自有不同旋轉角度，強化手工藝視覺主題。

---

### 賣家商店（`pages/seller/[id].vue`）

- `GET /users/:id/store` → 賣家資訊 + 首批商品（hasMore 分頁）
- 商品無限滾動：Intersection Observer 哨兵 + `GET /users/:id/products?page=&limit=12`
- 評價 Modal：Intersection Observer + `GET /reviews/seller/:id?page=&limit=6`
- 關注狀態：以 `localStorage.setItem('follow_seller_:id', 'true')` 本地保存
- 聊聊按鈕：`chatStore.openChat(seller)`，防止和自己聊天

---

### 賣家儀表板（`pages/seller/dashboard.vue`）

`GET /orders/seller/dashboard` 回傳：
- 本月營收金額
- 本月訂單數量
- 熱銷商品 Top 5（含銷售數量）
- 低庫存商品（stock < 10）警示

---

### 發票頁（`pages/invoice/[id].vue`）

- Layout：`empty`（無 Header/Footer，適合列印）
- `GET /orders/:id` 取得訂單資料
- 版型：公司資訊、訂單編號、商品明細、金額總計
- 「列印發票」按鈕：`window.print()`，採用大型按鈕設計並在列印時隱藏（`print:hidden`）

---

### 優惠券頁（`pages/coupons.vue`）

- `GET /discount-codes` 取得所有可用折扣碼
- 票券設計：左側色帶、右側鋸齒邊、折扣金額醒目顯示
- 複製按鈕：`navigator.clipboard.writeText(code)` + Toast 提示
- 全 i18n 支援（zh-TW / en / vi）

---

### 常見問題（`pages/faq.vue`）

書本翻頁風格佈局，五個章節（購物、賣家、付款、物流、安全），每章以 Accordion 展開問答內容。

---

### 收藏（`pages/favorite.vue`）

- `GET /favorites` 取得收藏列表
- 移除收藏：`DELETE /favorites/:id/favorite`
- 加入購物車：`cartStore.addToCart()`
- ProductCard 展示，支援空白狀態

---

## 組件詳解

### ProductCard（`components/ProductCard.vue`）

Props 型別 `ProductItem` 包含 UI 專用欄位（非 API 原始格式）：

```typescript
interface ProductItem {
  id?: number | string
  title: string          // 商品名稱
  price: string          // 格式化價格字串（如 "$100"）
  condition: string      // 分類/狀況標籤
  description: string
  image: string
  borderColorClass: string   // 邊框顏色（輪替）
  priceColor: string         // 價格文字顏色
  btnHoverBg: string         // hover 背景色
  btnHoverText: string       // hover 文字色
}
```

上層負責以 `CARD_STYLES[]` 依 `id % 4` 輪替顏色：

```typescript
const CARD_STYLES = [
  { border: 'border-accent-red',    price: 'text-accent-red',    ... },
  { border: 'border-accent-blue',   price: 'text-accent-blue',   ... },
  { border: 'border-primary',       price: 'text-primary',       ... },
  { border: 'border-content',       price: 'text-content',       ... },
]
```

---

### ChatWidget（`components/ChatWidget.vue`）

固定在右下角（z-[100]），Socket.io 即時通訊核心 UI：

```
縮小按鈕（未讀 badge）
  ↓ 點擊
展開視窗（350px）
  ├── 聯絡人列表 + 搜尋（GET /users/search?q=，防抖 400ms）
  └── 對話視窗
        ├── 訊息氣泡（發送靠右、接收靠左）
        └── 輸入框 + 送出（Enter 送出）
```

**Socket 事件：**
```typescript
socket.on('newMessage', (msg) => {
  // 更新 messages、聯絡人最後訊息、未讀計數
  // 若視窗關閉則顯示 Toast 提示
})
```

---

### HeaderUserMenu（`components/HeaderUserMenu.vue`）

通知系統採雙軌設計：
1. **REST API** `GET /notifications`：頁面載入時取得歷史通知
2. **SSE** `GET /notifications/stream?userId=xxx`：保持連線接收即時推播

```typescript
// SSE 連線
const sse = new EventSource(`${apiBase}/notifications/stream?userId=${userId}`)
sse.onmessage = (event) => {
  const notification = JSON.parse(event.data)
  unreadCount.value++
  notifications.value.unshift(notification)
}
```

通知點擊後依 `type` 導航（`order_update` → `/buy_order/:id`、`new_review` 等）。

---

### NotebookSidebar（`components/NotebookSidebar.vue`）

筆記本風格側邊欄（左側紅線 + 圓形裝訂孔裝飾）：

- 分類按鈕：`GET /categories`，顏色輪替，點擊更新 `route.query.category`
- 價格滑塊：雙端拖拉，防抖 400ms 後更新 `route.query.minPrice/maxPrice`
- 狀況多選：全新 / 近全新 / 二手良好

---

### StickyNoteField（`components/StickyNoteField.vue`）

商品上架頁專用組件，Props：

| Prop | 型別 | 說明 |
|------|------|------|
| `color` | `'blue' \| 'pink' \| 'yellow' \| 'green'` | 便利貼顏色 |
| `label` | `string` | 欄位標籤 |
| `icon` | `string` | Iconify 圖標名稱 |
| `position` | `string` | Tailwind position class |
| `rotation` | `string` | 旋轉角度 class |
| `decoration` | `string` | 裝飾表情符號 |

---

### AppToast（`components/AppToast.vue`）

消費 `useToast()` 的 `toasts` 陣列，以 `TransitionGroup` 呈現進出動畫（cubic-bezier 彈簧效果）：

- success（綠）、error（粉紅）、warning（黃）、info（藍）
- 預設 3.5 秒後自動消失

---

## Pinia 狀態管理

### Auth Store（`stores/auth.ts`）

```typescript
const useAuthStore = defineStore('auth', () => {
  // useCookie → SSR-safe 持久化
  const token = useCookie<string | null>('auth_token', { default: () => null })
  const user  = useCookie<User | null>('auth_user',   { default: () => null })

  const isAuthenticated = computed(() => !!token.value)

  function login(newToken: string, userData: User) {
    token.value = newToken
    user.value  = userData
  }

  function logout() {
    token.value = null
    user.value  = null
    navigateTo('/')
  }

  return { token, user, isAuthenticated, login, logout }
})
```

---

### Cart Store（`stores/cart.ts`）

**Cookie 雙向同步：**
```typescript
const cartCookie = useCookie<CartItem[]>('smart_market_cart', { default: () => [] })
const items = ref<CartItem[]>(cartCookie.value || [])

watch(items, (newItems) => {
  cartCookie.value = newItems
}, { deep: true })
```

**多賣家選擇邏輯：**
```typescript
const selectedSellerId = ref<string | null>(null)

// 當選中賣家商品全部移除時，自動清除選擇
watch(items, (newItems) => {
  if (selectedSellerId.value) {
    const hasItems = newItems.some(i => i.product.userId === selectedSellerId.value)
    if (!hasItems) selectedSellerId.value = null
  }
}, { deep: true })

// computed 自動切換：有選賣家 → 該賣家小計；否則 → 全部小計
const subtotal = computed(() =>
  selectedSellerId.value ? selectedSubtotal.value : c_subtotal.value
)
```

**updateQuantity 語意：** quantity ≤ 0 視為移除（呼叫 `removeFromCart`）

---

### Chat Store（`stores/chat.ts`）

```typescript
// Socket 用 shallowRef：避免 Vue 對 Socket 物件深度代理導致 Proxy 衝突
const socket = shallowRef<Socket | null>(null)

function connect() {
  socket.value = io(`${apiBase}/chat`, {
    auth: { token: authStore.token }
  })

  socket.value.on('newMessage', (msg: ChatMessage) => {
    // 更新 messages Record
    const key = msg.senderId === userId ? msg.receiverId : msg.senderId
    if (!messages.value[key]) messages.value[key] = []
    messages.value[key].push(msg)

    // 若非當前對話 → 增加未讀計數
    if (activeContactId.value !== key) {
      const contact = contacts.value.find(c => c.id === key)
      if (contact) contact.unreadCount = (contact.unreadCount ?? 0) + 1
    }
  })
}
```

`messages` 以 `Record<contactId, ChatMessage[]>` 儲存，切換聯絡人不需重新 fetch，已有歷史直接顯示。

---

## Composables 組合函式

### useToast（`composables/useToast.ts`）

```typescript
export function useToast() {
  // useState：跨組件共享，SSR-safe
  const toasts = useState<Toast[]>('app_toasts', () => [])

  function addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).slice(2)
    toasts.value.push({ ...toast, id })
    setTimeout(() => removeToast(id), toast.duration ?? 3500)
  }

  const success = (msg: string) => addToast({ type: 'success', message: msg })
  const error   = (msg: string) => addToast({ type: 'error',   message: msg })
  const info    = (msg: string) => addToast({ type: 'info',    message: msg })
  const warning = (msg: string) => addToast({ type: 'warning', message: msg })

  return { toasts, addToast, removeToast, success, error, info, warning }
}
```

---

### useDebounce（`composables/useDebounce.ts`）

支援 `MaybeRefOrGetter<T>`，可傳入 plain value、ref、computed、getter 函式：

```typescript
export function useDebounce<T>(source: MaybeRefOrGetter<T>, delay = 300) {
  const sourceRef = toRef(source)   // 統一標準化
  const debouncedValue = ref<T>(sourceRef.value)
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(sourceRef, (val) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { debouncedValue.value = val as T }, delay)
  })

  // scope 銷毀時自動清理 timer
  if (getCurrentScope()) {
    onScopeDispose(() => { if (timer) clearTimeout(timer) })
  }

  return debouncedValue
}
```

用法彈性高：
```typescript
const debouncedSearch = useDebounce(searchQuery, 400)          // ref
const debouncedRoute  = useDebounce(() => route.query.q, 300)  // getter
```

---

### useHomeData（`composables/useHomeData.ts`）

封裝首頁靜態資料，以 `computed` 響應語言切換：

```typescript
export const useHomeData = () => {
  const { t } = useI18n()

  const categories = computed<CategoryItem[]>(() => [
    { name: t('home.categories.toys'),    icon: 'toys',         bgColor: 'bg-accent-red'    },
    { name: t('home.categories.clothes'), icon: 'checkroom',    bgColor: 'bg-accent-blue'   },
    { name: t('home.categories.books'),   icon: 'menu-book',    bgColor: 'bg-primary'        },
    { name: t('home.categories.art'),     icon: 'palette',      bgColor: 'bg-accent-purple' },
    // ...
  ])

  return { categories, illustrate }
}
```

---

## 工具函式

### validateProductForm（`utils/validation.ts`）

```typescript
export function validateProductForm(formData: {
  name: string; description: string
  categoryId: number | string; price: string | number; imageUrl: string
}) {
  const errors: string[] = []
  if (!formData.name?.trim())                          errors.push('name')
  if (!formData.description?.trim())                   errors.push('description')
  if (!formData.categoryId || Number(formData.categoryId) <= 0) errors.push('categoryId')
  if (!formData.price || Number(formData.price) <= 0)  errors.push('price')
  if (!formData.imageUrl?.trim())                      errors.push('imageUrl')
  return { isValid: errors.length === 0, errors }
}
```

---

## 國際化（i18n）

### 翻譯架構

三個語言檔案各約 530+ 行，以樹狀 namespace 組織：

```
zh_TW / en / vi
├── nav.*                    # 導覽
├── home.*                   # 首頁（categories, illustrate）
├── login.* / register.*     # 認證
├── products.*               # 商品（含 Q&A、評價）
├── cart.*                   # 購物車
├── checkout.*               # 結帳
├── buy_order.*              # 購買訂單（status, status_badge）
│   └── status.*             # cancel_requested, cancelled, processing...
├── sell_order.*             # 銷售訂單
├── seller.*                 # 賣家頁
├── coupons.*                # 優惠券
├── profile.*                # 個人資料
├── favorite.*               # 收藏
├── invoice.*                # 發票
├── faq.*                    # FAQ
├── toast.*                  # 全域提示訊息
├── menu.*                   # 使用者選單
└── chat.*                   # 聊天室
```

### 翻譯自動化流程

```bash
# GoogleSheetToJson.js 從 Google Sheets 拉取 → 輸出 JSON
npm run lang

# 開發模式自動先執行翻譯更新
npm run dev   # = npm run lang && nuxt dev
```

---

## 樣式系統

### Tailwind 客製化 Design Token

```javascript
// tailwind.config.js
colors: {
  'primary':        '#f4c025',   // 黃金色（主色調）
  'accent-red':     '#ff6b6b',   // 珊瑚紅
  'accent-blue':    '#4ecdc4',   // 青色
  'accent-purple':  '#a78bfa',   // 薰衣草紫
  'content':        '#1c180d',   // 深棕文字
  'background-light': '#f8f8f5', // 紙張底色
  'line':           '#06C755',   // LINE 綠
}

boxShadow: {
  'stitch':    '4px 4px 0px rgba(0,0,0,1)',    // 縫線感（實心位移）
  'stitch-sm': '2px 2px 0px rgba(0,0,0,1)',
  'polaroid':  '4px 6px 15px -3px rgba(0,0,0,0.15)',
  'paper':     '2px 4px 12px -2px rgba(0,0,0,0.1)',
  'sticker':   '0px 4px 0px 0px rgba(180,140,0,1)',
}

fontFamily: {
  sans:        ['"Spline Sans"', '"Noto Sans TC"', 'sans-serif'],
  marker:      ['"Permanent Marker"', 'cursive'],    // 手寫標記筆風格
  'mono-card': ['"Courier Prime"', 'monospace'],     // 收據/票據字體
}
```

### 主題語言

全站採用「文具手工藝」視覺語言：

| 元素 | 設計 |
|------|------|
| 背景 | 網格點點紙張紋理（`radial-gradient`） |
| 卡片陰影 | 實心偏移（stitch），非模糊 |
| 商品圖片 | Polaroid 相框旋轉 -2° |
| 價格徽章 | 圓形旋轉 +12°，蠟筆邊框 |
| 導覽 hover | 輕微縮放 + 旋轉（`scale(1.05) rotate(-2deg)`） |
| 裝飾元素 | 和紙膠帶（`.washi-tape`）、裝訂孔 |
| 頁面背景 | 便利貼、筆記本橫線、資料夾 Tab 標籤 |

---

## 測試策略

### 設置

```typescript
// vitest.config.ts
export default defineVitestConfig({
  test: { environment: 'nuxt', globals: true }
})
```

### Nuxt Stub 方案

Nuxt composables（`useState`、`useCookie`）在純 Vitest 環境中無法使用，透過 stub 模擬：

```typescript
// vitest-nuxt-stubs.ts
export function useCookie<T>(key: string, options?: { default?: () => T }) {
  return ref<T>(options?.default?.() ?? (null as unknown as T))
}
export function useState<T>(key: string, init?: () => T) {
  return ref<T>(init ? init() : (undefined as unknown as T))
}
```

以 `unplugin-auto-import` 別名 `#nuxt-stubs` 自動注入，測試檔無需手動 import。

### 測試覆蓋

| 測試檔 | 測試數 | 覆蓋項目 |
|--------|--------|----------|
| `cart.test.ts` | 12 | 加入、移除、更新數量（quantity=0 移除）、小計、折扣、total ≥ 0 |
| `useToast.test.ts` | 7 | 各型別 toast、自動移除、removeToast |
| `useDebounce.test.ts` | 6 | 防抖延遲、immediate value、scope 清理 |
| `validation.spec.ts` | 4 | 全填通過、缺名稱、負數價格、多欄位同時回報 |

**當前通過率：29 / 29（100%）**

---

## 建置與部署

### 腳本

```bash
npm run lang         # 從 Google Sheets 更新翻譯
npm run dev          # 開發（自動先跑 lang）
npm run build        # SSR 建置（Node.js 伺服器模式）
npm run generate     # SSG 建置（靜態檔案輸出）
npm run test:unit    # 執行單元測試
```

### CI/CD 流程

```
GitHub Push
  → paths-filter：偵測 frontend-client/ 有無變動
    → 有變動 → npm run build → docker build
      → push image → ghcr.io/.../smart-market-client:latest
        → SSH VM → docker pull → docker compose up -d
```

Docker layer cache 存於 GHCR（`cache` tag），第二次起 build 大幅加速。

### 環境變數

| 變數名 | 說明 | 預設值 |
|--------|------|--------|
| `NUXT_PUBLIC_API_BASE` | 後端 API 基址 | `http://localhost:8080` |

---

## 關鍵技術決策

| 決策 | 選擇 | 理由 |
|------|------|------|
| 框架版本 | Nuxt 4 | `app/` 目錄結構、改良的自動導入、更好的 TypeScript 整合 |
| 狀態持久化 | `useCookie()` | Nuxt 原生 SSR-safe，重整後不遺失，不需額外 plugin |
| Socket 實例 | `shallowRef` | Vue 不應深度代理 Socket 物件，否則觸發 Proxy 錯誤 |
| 虛擬滾動 | 自製（非 vueuse） | 精確控制 row-based 計算，與 Intersection Observer 無縫結合 |
| 多語言策略 | `no_prefix` + Google Sheets | URL 簡潔；翻譯由非工程師在 Sheets 維護，降低協作門檻 |
| 圖片最佳化 | `@nuxt/image` | 自動 WebP、懶加載、CDN 支援，一行配置搞定 |
| 測試環境 | `nuxt` environment | 使用 happy-dom，比 jsdom 輕量；Nuxt stub 解決 composable 依賴問題 |
| 打包分包 | Vite `manualChunks` | socket.io-client（188KB）、dayjs 單獨分包，減少主 bundle 體積 |
| Cart 持久化 | `useCookie` + `watch` | 購物車在 SSR 時亦可讀取，避免水合後突然消失的閃爍問題 |
