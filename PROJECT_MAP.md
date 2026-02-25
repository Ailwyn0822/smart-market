# Smart Market 專案資源地圖

> 每次開工前必讀，避免重複造輪子

## 根目錄結構

```
smart-market/
├── .github/workflows/ci.yml   # CI：shared → backend/client/admin 四個 job
├── backend/                   # NestJS API (port 8080)
├── frontend-admin/            # Vue 3 + Vite 後台 (port 5173)
├── frontend-client/           # Nuxt 4 前台 (port 3000)
├── shared/                    # 共用 DTO / Types / Schemas（monorepo）
├── docs/                      # 文件筆記
├── docker-compose.yml         # PostgreSQL + MinIO
├── package.json               # 根 workspace（npm run dev 啟動全部）
└── PROJECT_MAP.md             # 本檔案
```

---

## Shared (`shared/src/`) — 共用型別

| 路徑                        | 內容                      |
| --------------------------- | ------------------------- |
| `types/auth.ts`             | 登入/Token 型別           |
| `types/user.ts`             | User DTO                  |
| `types/product.ts`          | Product DTO               |
| `types/order.ts`            | Order DTO                 |
| `types/category.ts`         | Category DTO              |
| `types/discount.ts`         | DiscountCode DTO          |
| `types/common.ts`           | 通用型別（Pagination 等） |
| `schemas/auth.schema.ts`    | Zod auth schema           |
| `schemas/order.schema.ts`   | Zod order schema          |
| `schemas/product.schema.ts` | Zod product schema        |
| `enums/index.ts`            | 共用 Enum                 |

---

## Frontend Client (`frontend-client/app/`)

### Components（`components/`）— 12 個

| 檔案                   | 用途                                                          |
| ---------------------- | ------------------------------------------------------------- |
| **`AppToast.vue`**     | ✅ Toast 通知容器（已掛 default layout，用 `useToast()`）     |
| `ChatWidget.vue`       | 聊天浮動視窗（WebSocket）                                     |
| `Footer.vue`           | 全站頁腳                                                      |
| `GoogleLoginBtn.vue`   | Google OAuth 按鈕                                             |
| `HeaderLogo.vue`       | 頂部 Logo                                                     |
| `HeaderUserMenu.vue`   | 頂部用戶選單（登入/登出/頭像）                                |
| `LanguageSwitcher.vue` | 語系切換（zh_TW / en / vi）                                   |
| `LineLoginBtn.vue`     | LINE OAuth 按鈕                                               |
| `LoginDecorations.vue` | 登入頁裝飾                                                    |
| `NotebookSidebar.vue`  | 筆記本側邊欄                                                  |
| `ProductCard.vue`      | 商品卡片（按鈕是「查看」→ `/products/:id`，**非加入購物車**） |
| `StickyNoteField.vue`  | 便利貼表單欄位（upload 頁）                                   |

### Composables（`composables/`）— 3 個

| 檔案             | 用途                                                            |
| ---------------- | --------------------------------------------------------------- |
| `useToast.ts`    | Toast（`useState('app_toasts')`）→ `success/error/info/warning` |
| `useDebounce.ts` | Debounce 工具                                                   |
| `useHomeData.ts` | 首頁資料抓取                                                    |

### Stores（`stores/`）— Pinia 3 個

| 檔案      | 用途                                     |
| --------- | ---------------------------------------- |
| `auth.ts` | 認證（token、user、isAuthenticated）     |
| `cart.ts` | 購物車（addToCart、clearCart、subtotal） |
| `chat.ts` | 聊天（openChat）                         |

### Layouts（`layouts/`）— 2 個

| 檔案          | 用途                                               |
| ------------- | -------------------------------------------------- |
| `default.vue` | Header + slot + Footer + ChatWidget + **AppToast** |
| `auth.vue`    | 登入/註冊頁 layout                                 |

### Pages（`pages/`）— 19 個

| 路徑                   | 頁面                          | 狀態 |
| ---------------------- | ----------------------------- | ---- |
| `index.vue`            | 首頁                          | ✅   |
| `login.vue`            | 登入                          | ✅   |
| `register.vue`         | 註冊                          | ✅   |
| `upload.vue`           | 上架商品（AI 填單）           | ✅   |
| `profile.vue`          | 個人資料                      | ✅   |
| `cart.vue`             | 購物車                        | ✅   |
| `checkout.vue`         | 結帳（ECPay）                 | ✅   |
| `order_completed.vue`  | 訂單完成                      | ✅   |
| `favorite.vue`         | 我的收藏                      | ✅   |
| `faq.vue`              | FAQ                           | ✅   |
| `products/index.vue`   | 商品列表                      | ✅   |
| `products/[id].vue`    | 商品詳情（加購+收藏+JSON-LD） | ✅   |
| `sell_order/index.vue` | 賣家訂單列表                  | ✅   |
| `sell_order/[id].vue`  | 賣家訂單詳情                  | ✅   |
| `buy_order/index.vue`  | 買家訂單列表                  | ✅   |
| `buy_order/[id].vue`   | 買家訂單詳情（含評價）        | ✅   |
| `commodity/index.vue`  | 我的商品管理                  | ✅   |
| `commodity/[id].vue`   | 商品編輯                      | ✅   |
| `seller/[id].vue`      | 賣家頁面                      | ✅   |

### Tests — ❌ 無任何 .spec.ts

### i18n（`i18n/language/`）— 3 檔

- `zh_TW.json`、`en.json`、`vi.json`

---

## Frontend Admin (`frontend-admin/src/`)

### Pages — 6 個

| 路徑                         | 頁面       |
| ---------------------------- | ---------- |
| `LoginPage.vue`              | Admin 登入 |
| `DashBoard.vue`              | 儀表板     |
| `admin/products/index.vue`   | 商品管理   |
| `admin/users/index.vue`      | 用戶管理   |
| `admin/categories/index.vue` | 分類管理   |
| `admin/orders/index.vue`     | 訂單管理   |

### Tests — 部分存在

| 檔案                            | 狀態 |
| ------------------------------- | ---- |
| `__tests__/App.spec.ts`         | 有   |
| `__tests__/LoginPage.spec.ts`   | 有   |
| `__tests__/stores/auth.spec.ts` | 有   |

### 其他

| 檔案                | 說明                                           |
| ------------------- | ---------------------------------------------- |
| `api/index.ts`      | Axios（base: `http://localhost:8080`，帶 JWT） |
| `auto-imports.d.ts` | unplugin-auto-import 型別聲明                  |
| `components.d.ts`   | unplugin-vue-components 型別聲明               |

---

## Backend (`backend/src/`) — NestJS (port 8080)

| Module           | 端點              | 備注                                   |
| ---------------- | ----------------- | -------------------------------------- |
| `auth`           | `/auth`           | JWT + Google/LINE OAuth                |
| `users`          | `/users`          | 個人資料、頭像、賣家商店               |
| `products`       | `/products`       | CRUD + AI 分析                         |
| `categories`     | `/categories`     | 分類 CRUD                              |
| `orders`         | `/orders`         | **admin routes 必須排在 `:id` 之前！** |
| `ecpay`          | `/ecpay`          | 綠界金流                               |
| `favorites`      | `/favorites`      | 收藏                                   |
| `discount-codes` | `/discount-codes` | 折扣碼管理與驗證                       |
| `reviews`        | `/reviews`        | 評價                                   |
| `chat`           | `/chat`           | WebSocket 私訊                         |
| `notifications`  | `/notifications`  | 通知                                   |
| `ai`             | —                 | Gemini Vision                          |
| `storage`        | —                 | MinIO 圖片上傳                         |
| `seed`           | —                 | DB Seed                                |

---

## CI / CD（`.github/workflows/ci.yml`）

4 個 job（依序：`shared-build` → `backend-check` / `client-check` / `admin-check`）：

- shared: `tsc --noEmit`
- backend: `npm run build`
- client: `npm run test:unit` + `npm run build`
- admin: `type-check` + `test:unit` + `build-only`

---

## ⚠️ 已知規則（Blood Written Rules）

1. **NestJS 路由順序**：固定路由（`admin/all`）**必須**排在動態路由（`/:id`）之前
2. **Port 衝突**：重啟前先 `Stop-Process` 殺掉舊 PID（8080）
3. **AppToast 已存在**：不要另建 Toast 組件，直接用 `useToast()`
4. **useI18n 不需手動 import**：Nuxt i18n 是 auto-import，直接 `const { t } = useI18n()`
5. **shared 套件已有完整共用型別**：新增 DTO 優先放 `shared/src/types/`

---

## ❌ 尚未完成（對照 14 天衝刺計畫）

| 項目                                                   | 優先度    |
| ------------------------------------------------------ | --------- |
| frontend-client 測試（useToast、cart store、表單驗證） | 🔴 高     |
| GTM / GA4 電商事件埋碼                                 | 🟡 中     |
| LINE Pay V3 HMAC 簽章                                  | 🟡 中     |
| Vite Manual Chunks + Bundle 分析                       | 🟡 中     |
| Lighthouse Core Web Vitals > 90                        | 🟡 中     |
| Docker Multi-stage Build                               | 🟠 待部署 |
| Nginx 反向代理                                         | 🟠 待部署 |
| README 文件完善                                        | 🔵 低     |
| Demo  影片錄製                                          | 🔵 低     |
