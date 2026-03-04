# Nuxt 3 vs Nuxt 4 — 主要差異詳解

> 本文件整理 Nuxt 3 升級到 Nuxt 4 的核心變動，附帶每個專有名詞的解釋，適合面試與學習使用。

---

## 目錄

1. [目錄結構重整（`app/` 目錄）](#1-目錄結構重整app-目錄)
2. [Dedupe 策略改變](#2-dedupe-策略改變)
3. [Data Fetching：shallowRef 包裝](#3-data-fetchingshallowref-包裝)
4. [scanPageMeta 提前執行](#4-scanpagemeta-提前執行)
5. [共享資料夾 `shared/`](#5-共享資料夾-shared)
6. [其他改動彙整](#6-其他改動彙整)
7. [補充：Nuxt API 語法糖完整說明](#7-補充nuxt-api-語法糖完整說明)
8. [補充：Composable 概念說明](#8-補充composable-概念說明)
9. [補充：Nuxt 全端開發](#9-補充nuxt-全端開發)

---

## 1. 目錄結構重整（`app/` 目錄）

### Nuxt 3 舊結構

```
project/
├── pages/
├── components/
├── composables/
├── layouts/
├── stores/
├── assets/
├── public/
├── server/
├── nuxt.config.ts
└── app.vue
```

所有前端程式碼直接放在**根目錄**。

### Nuxt 4 新結構

```
project/
├── app/                  # ← 新增！所有前端程式碼移進這裡
│   ├── pages/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── stores/
│   ├── assets/
│   └── app.vue
├── shared/               # ← 新增！前後端共用程式碼
├── server/               # 後端 API（不動）
└── nuxt.config.ts
```

### 為什麼要這樣改？

**問題：** Nuxt 3 的根目錄越來越亂，前端程式碼、後端程式碼、設定檔全部混在一起。

**解法：** 把前端程式碼集中到 `app/`，讓專案結構更清晰：
- `app/` → 前端（瀏覽器執行的部分）
- `server/` → 後端（Node.js 伺服器執行的部分）
- `shared/` → 前後端共用的工具、型別

### 專有名詞解釋

**SSR（Server-Side Rendering）：** 伺服器端渲染。頁面在 Node.js 伺服器上產生 HTML，再傳給瀏覽器。好處是 SEO 友善、首屏快。

**Hydration（水合）：** SSR 產生 HTML 後，瀏覽器下載 JavaScript，「激活」靜態 HTML 讓它變成可互動的 Vue 應用程式。這個過程叫 hydration。

**File-based Routing（檔案系統路由）：** 不需要手動設定路由，根據 `pages/` 資料夾結構自動產生路由。例如 `pages/products/[id].vue` 自動對應 `/products/123`。

---

## 2. Dedupe 策略改變

### 名詞解釋：Dedupe（去重複化）

當相同的 API 請求在短時間內被觸發多次，Nuxt 會「去重複」，讓同樣的請求只發送一次。這個行為叫 dedupe（deduplication 的縮寫）。

### Nuxt 3 的行為

```typescript
// 策略：cancel（取消前一次）
// 如果同一個 key 的請求還在等待中，直接取消舊的，發新的
```

**情境：** 使用者從 `/products/1` 快速切換到 `/products/2`，`useFetch` 因 `productId` 變化重新執行。Nuxt 3 會取消第一次還沒完成的請求，發出新的。

```typescript
// productId 改變 → useFetch 重新執行 → Nuxt 3 取消舊的，發新的
const { data } = await useFetch(() => `/api/products/${productId.value}`)
```

### Nuxt 4 的行為

```typescript
// 策略：defer（延遲）
// 如果同一個 key 的請求還在等待中，新的請求不另外發送，等舊的完成
```

**最主要的情境是 SSR → 客戶端水合：** 伺服器已經執行過 `useFetch` 並把結果寫進 HTML，客戶端水合時發現同一個 key 的請求已有結果，直接複用，不重複發送。

```
使用者訪問 /products/1
  → 伺服器：useFetch('/api/products/1') 執行，資料寫進 HTML
  → 客戶端：發現同 key 已有 SSR 資料 → defer（複用），不再打一次 API
```

### 實際影響

| 場景 | Nuxt 3 (cancel) | Nuxt 4 (defer) |
|------|----------------|----------------|
| SSR + 客戶端 hydration | 客戶端重複發請求 | 複用 SSR 結果，不重複 |
| 路由參數快速切換 | 取消舊的，發新的 | 等舊的完成再判斷 |

> **注意：** 搜尋框輸入這類使用者互動，應該用 `$fetch` + 防抖，不是 `useFetch`，所以不在 dedupe 討論範圍內。

### POST 連按兩次的情況

`defer` 只適用於 `useFetch` / `useAsyncData`（有 key 的請求）。
使用者操作（送出表單、加入購物車）都應該用 `$fetch`，**沒有 dedupe**，需要自己處理：

```typescript
// ✅ 正確做法：防止連按
const isSubmitting = ref(false)

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await $fetch('/api/orders', { method: 'POST', body: form })
  } finally {
    isSubmitting.value = false
  }
}
```

---

## 3. Data Fetching：shallowRef 包裝

### 名詞解釋

**`ref`（響應式參考）：** Vue 3 的響應式資料容器。改變值時，畫面會自動更新。

**`reactive`（響應式物件）：** 讓整個物件變成響應式，包含所有巢狀屬性。

**`shallowRef`（淺層響應式）：** 只追蹤「頂層」的值變化，不深入追蹤物件內部每個屬性。

**Deep Reactivity（深度響應式）：** Vue 預設對物件/陣列進行「深度追蹤」，物件裡面的每個屬性改變都會觸發更新。

### Nuxt 3 的行為

`useFetch` / `useAsyncData` 回傳的 `data` 是完整的 `ref`，Vue 會對整個物件進行深度代理（Proxy）。

```typescript
const { data } = await useFetch('/api/products')
// data.value 是 deep reactive，每個屬性都被追蹤
// 如果回傳的是大型陣列（1000筆商品），Vue 要代理每一個屬性 → 效能問題
```

### Nuxt 4 的行為

`data` 改用 `shallowRef` 包裝，只有整個 `data.value` 被替換時才觸發更新：

```typescript
const { data } = await useFetch('/api/products')
// data 現在是 shallowRef
// 整個陣列被替換時更新，不逐一追蹤每個商品的內部屬性 → 效能提升
```

### 實際影響

```typescript
// ✅ 這樣可以（替換整個值）
data.value = newProducts

// ❌ 這樣不會觸發更新（shallowRef 不追蹤內部）
data.value[0].name = 'new name'  // 畫面不更新！

// ✅ 正確做法：
data.value = data.value.map((p, i) =>
  i === 0 ? { ...p, name: 'new name' } : p
)
```

### 為什麼要這樣改？

大型 API 回傳（例如商品列表 1000 筆），深度代理每個物件的每個屬性會消耗大量記憶體與 CPU。改為 shallowRef 後，初始化速度明顯提升。

---

## 4. scanPageMeta 提前執行

### 名詞解釋

**Page Meta（頁面元資料）：** 每個頁面可以透過 `definePageMeta()` 設定路由資訊，例如：

```typescript
// pages/admin/users.vue
definePageMeta({
  layout: 'admin',           // 使用哪個 layout
  middleware: ['auth'],      // 需要哪個 middleware（如：登入才能進）
  title: '使用者管理',        // 頁面標題
})
```

**Middleware（中介層）：** 路由跳轉前執行的程式碼。常見用途：檢查是否登入、檢查是否有權限。

**Build Time（建置時）vs Runtime（執行時）：**
- Build Time：`npm run build` 時，程式碼被編譯打包的階段
- Runtime：伺服器啟動、使用者瀏覽網站時，程式碼實際執行的階段

### Nuxt 3 的問題

`definePageMeta()` 在 Runtime 才被解析，代表 Nuxt 的 router 要等頁面實際載入時才知道某個頁面需要哪個 middleware 或 layout。

這會造成問題：如果你的 middleware 有 async 操作（例如檢查 JWT），頁面可能短暫「閃爍」後才被 middleware 攔截。

### Nuxt 4 的改動

`scanPageMeta` 在 **Build Time** 就執行，掃描所有 `pages/` 裡的 `definePageMeta()`。

```
npm run build
  → 掃描所有 pages/
  → 靜態分析 definePageMeta()
  → 將 middleware / layout / auth 資訊記錄到路由表
  → 伺服器啟動時就已知道每個路由的設定
```

### 好處

1. **路由設定在 Build Time 確定**，不需等到 Runtime
2. **更快的 middleware 執行**，不需動態載入頁面後才知道要跑哪個 middleware
3. **更準確的靜態分析**，IDE 和打包工具可以提前發現設定錯誤

### 注意事項

因為是靜態分析，`definePageMeta()` 裡不能用動態變數：

```typescript
// ❌ Nuxt 4 不支援（靜態分析無法得知動態值）
const myLayout = getLayoutName()
definePageMeta({ layout: myLayout })

// ✅ 正確寫法
definePageMeta({ layout: 'admin' })
```

---

## 5. 共享資料夾 `shared/`

### 為什麼需要 shared？

Nuxt 是一個全端框架，同一個專案裡有前端（`app/`）和後端（`server/`）。某些程式碼兩邊都要用，例如：

- TypeScript 型別定義（型別漂移問題）
- 工具函式（日期格式化、驗證邏輯）
- 常數、Enum 值

### Nuxt 3 的做法

自己處理，沒有標準方案。通常用 monorepo 或手動 import path 解決。

### Nuxt 4 的 `shared/` 資料夾

Nuxt 4 原生支援 `shared/` 資料夾，放在這裡的程式碼自動在前後端都可使用：

```
project/
├── app/            # 前端
├── server/         # 後端
└── shared/         # 前後端共用
    ├── types/      # TypeScript 型別
    │   └── index.ts
    └── utils/      # 工具函式
        └── format.ts
```

```typescript
// shared/types/index.ts
export interface Product {
  id: number
  name: string
  price: number
}

// 在前端使用（app/pages/products/index.vue）
import type { Product } from '~~/shared/types'

// 在後端使用（server/api/products.get.ts）
import type { Product } from '~~/shared/types'
```

### 好處

- **型別一致性**：前後端用同一份 interface，不用擔心前後端型別不同步
- **DRY 原則**（Don't Repeat Yourself）：驗證邏輯等只寫一次
- **Nuxt 原生支援**：不需額外設定 alias 或 monorepo

---

## 6. 其他改動彙整

| 項目 | Nuxt 3 | Nuxt 4 | 說明 |
|------|--------|--------|------|
| 目錄結構 | 根目錄 | `app/` 子目錄 | 前端集中管理 |
| Dedupe 策略 | `cancel` | `defer` | SSR 資料複用，減少重複請求 |
| data 型別 | deep `ref` | `shallowRef` | 大型資料效能提升 |
| scanPageMeta | Runtime | Build Time | 路由資訊提前確定 |
| shared/ 資料夾 | 無原生支援 | 原生支援 | 前後端共用程式碼 |
| TypeScript 支援 | 良好 | 更好 | 更嚴格的型別推斷 |
| Vite 版本 | Vite 4/5 | Vite 6+ | 更快的 HMR |

---

## 7. 補充：Nuxt API 語法糖完整說明

### `useFetch` — 最常用，有快取

```typescript
const { data, pending, error, refresh } = await useFetch('/api/products')
```

- **適合：** 頁面載入時需要的資料
- **特色：** 有唯一 key、自動 dedupe、SSR + 客戶端共用資料
- **注意：** 動態 URL 要用 computed 或函式傳入

```typescript
// ✅ 正確：動態 URL 用函式
const { data } = await useFetch(() => `/api/products/${productId.value}`)

// ❌ 錯誤：直接插值不是響應式的
const { data } = await useFetch(`/api/products/${productId.value}`)
```

---

### `useLazyFetch` — 非阻塞版本

```typescript
const { data, pending } = useLazyFetch('/api/products')
```

- **適合：** 不阻塞頁面渲染的資料（不重要的、可以後載的）
- **特色：** 不等待請求完成就渲染頁面，`pending` 為 true 時顯示 loading
- **注意：** 不加 `await`！

```html
<template>
  <div v-if="pending">載入中...</div>
  <ProductList v-else :products="data" />
</template>
```

---

### `useAsyncData` — 自訂邏輯版本

```typescript
const { data } = await useAsyncData('products-key', async () => {
  const res = await $fetch('/api/products')
  return res.filter(p => p.isActive)  // 可以加工資料
})
```

- **適合：** 需要自訂 fetch 邏輯（資料加工、多個請求合併）
- **特色：** 手動指定 key，可控制快取
- **第一個參數是 key**（`'products-key'`）用來 dedupe 和快取

---

### `$fetch` — 純 HTTP 請求（無快取）

```typescript
await $fetch('/api/orders', {
  method: 'POST',
  body: { productId: 1 },
  headers: { Authorization: `Bearer ${token}` }
})
```

- **適合：** 使用者操作觸發的請求（點擊、提交表單）
- **特色：** 沒有 key、沒有 dedupe、沒有快取，就是發一個 HTTP 請求
- **注意：** 需要自己處理 loading 狀態和錯誤

---

### 使用時機比較

| 語法 | 使用時機 | 有 dedupe？ | 有快取？ |
|------|----------|------------|---------|
| `useFetch` | 頁面初始資料（阻塞） | ✅ | ✅ |
| `useLazyFetch` | 頁面初始資料（非阻塞） | ✅ | ✅ |
| `useAsyncData` | 需要自訂邏輯的初始資料 | ✅ | ✅ |
| `$fetch` | 使用者互動操作（POST/PUT/DELETE） | ❌ | ❌ |

---

## 8. 補充：Composable 概念說明

### 什麼是 Composable？

Composable（組合函式）是 Vue 3 Composition API 的核心概念，可以把「可重用的邏輯」抽取成函式。

**類比：** 你可以把它想成「帶有 Vue 響應式功能的 Global Utility Function（全域工具函式）」。

### 與 Global Function 的差異

| 特性 | Global Function | Composable |
|------|----------------|-----------|
| 回傳值 | 純 JavaScript 值 | ref / reactive / computed |
| 響應式 | ❌ | ✅ |
| 生命週期 | ❌ | ✅（onMounted, onUnmounted） |
| 與 Vue 整合 | ❌ | ✅ |

### 範例比較

```typescript
// ❌ 普通函式（不是 Composable）
function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

// ✅ Composable（有響應式）
function useTimer() {
  const seconds = ref(0)

  const interval = setInterval(() => {
    seconds.value++
  }, 1000)

  onUnmounted(() => clearInterval(interval))  // 自動清理！

  return { seconds }
}

// 使用
const { seconds } = useTimer()
// template 裡 {{ seconds }} 會每秒自動更新
```

### Nuxt 的 Composable 自動導入

Nuxt 會自動掃描 `composables/` 資料夾，裡面的函式不需要 import 就能直接使用：

```typescript
// composables/useToast.ts 定義後
// 在任何 .vue 檔案直接使用，不需要 import：
const { success, error } = useToast()
```

### 與 React Hook 的對比

Composable 概念和 React Hook 非常相似：

| Vue Composable | React Hook |
|----------------|-----------|
| `ref()` | `useState()` |
| `computed()` | `useMemo()` |
| `watch()` | `useEffect()` |
| `onMounted()` | `useEffect(() => {}, [])` |
| `onUnmounted()` | `useEffect(() => () => cleanup, [])` |

---

## 9. 補充：Nuxt 全端開發

### Nuxt Server Routes

Nuxt 原生支援在同一個專案裡寫前端和後端 API：

```
project/
├── app/pages/        # 前端頁面
└── server/
    ├── api/          # API 路由
    │   └── products.get.ts    → GET /api/products
    │   └── products.post.ts   → POST /api/products
    │   └── products/
    │       └── [id].get.ts    → GET /api/products/:id
    └── middleware/   # 伺服器 middleware
```

### API 寫法

```typescript
// server/api/products.get.ts
export default defineEventHandler(async (event) => {
  // 這裡的程式碼只在伺服器上執行，不會暴露給瀏覽器
  const db = useDatabase()
  return await db.select().from('products')
})
```

```typescript
// server/api/products.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)          // 讀取 POST body
  const { name, price } = body

  // 直接操作資料庫，安全！
  return await createProduct({ name, price })
})
```

### 前端呼叫自己的後端

```typescript
// app/pages/products/index.vue
const { data } = await useFetch('/api/products')
// 請求打到同一個 Nuxt 應用的 server/api/products.get.ts
```

### 優勢

1. **部署簡單**：只需部署一個 Node.js 應用
2. **型別安全**：配合 `shared/` 資料夾，前後端共用型別
3. **無需 CORS**：前後端同域，不需處理跨域問題
4. **伺服器端可直連資料庫**：不需要中間的 REST API server

### 適合情境

- 中小型專案想快速開發全端功能
- API 邏輯簡單，不需要獨立後端服務
- 想要型別共享且部署簡單

### 不適合情境

- 需要 NestJS / Django 等完整後端框架功能（如 Smart Market 這樣的大型專案）
- 後端需要被多個客戶端（Mobile App、其他服務）共用
- 需要微服務架構

---

## 總結

Nuxt 4 的核心目標是：

1. **清晰**：`app/` 目錄讓前端程式碼更有組織
2. **效能**：shallowRef + defer dedupe 減少不必要的計算
3. **開發體驗**：scanPageMeta 提前、shared/ 資料夾讓全端開發更順暢
4. **向後相容**：大部分 Nuxt 3 程式碼不需修改即可運作

對於 Smart Market 這個專案，因為後端已有 NestJS，所以主要使用 Nuxt 的前端特性（SSR、自動導入、i18n 等），而非 Nuxt 的全端 server routes。
