# Smart Market 🛒

> 全端電商平台 — NestJS × Nuxt 4 × Vue 3 × PostgreSQL × MinIO

[![CI](https://github.com/Ailwyn0822/smart-market/actions/workflows/ci.yml/badge.svg)](https://github.com/Ailwyn0822/smart-market/actions/workflows/ci.yml)

---

## 目錄

- [專案簡介](#專案簡介)
- [技術棧](#技術棧)
- [系統架構](#系統架構)
- [快速啟動（本機開發）](#快速啟動本機開發)
- [環境變數說明](#環境變數說明)
- [主要功能](#主要功能)
- [專案結構](#專案結構)
- [部署（Production）](#部署production)
- [CI / CD](#ci--cd)

---

## 專案簡介

Smart Market 是一個具備 AI 輔助上架、即時聊天、多語系支援的全端二手/新品電商平台。  
賣家可透過 AI（Gemini Vision）自動分析商品圖片並填入商品資訊；買家可瀏覽商品、加入購物車、以 ECPay 結帳、留下評價，並與賣家即時私訊。

**線上展示：** [https://panda-map.com](https://panda-map.com)

---

## 技術棧

| 層級            | 技術                                          |
| --------------- | --------------------------------------------- |
| **前台（SSR）** | Nuxt 4、Vue 3、Pinia、i18n（zh_TW / en / vi） |
| **後台管理**    | Vue 3 + Vite、Pinia、Axios                    |
| **後端 API**    | NestJS、TypeORM、PostgreSQL 15                |
| **即時通訊**    | WebSocket（NestJS Gateway）                   |
| **圖片儲存**    | MinIO（相容 S3）                              |
| **金流**        | ECPay 綠界                                    |
| **OAuth**       | Google、LINE                                  |
| **AI**          | Gemini Vision API（商品 AI 分析）             |
| **通知**        | Server-Sent Events（SSE）                     |
| **部署**        | Docker Compose + Nginx + Let's Encrypt        |
| **CI/CD**       | GitHub Actions                                |
| **共用型別**    | TypeScript Monorepo（`shared/` workspace）    |

---

## 系統架構

```
瀏覽器
  │
  ▼
Nginx（80 / 443）
  ├─── /         → Nuxt 4 前台（SSR，port 3000）
  ├─── /admin    → Vue 3 後台（SPA，port 5174）
  ├─── /api      → NestJS 後端（port 8080）
  └─── /minio    → MinIO 圖片（port 9000）

後端依賴：
  PostgreSQL 15（port 5432）
  MinIO（port 9000）
```

---

## 快速啟動（本機開發）

### 前置需求

- Node.js 20+
- Docker & Docker Compose
- npm 10+

### 1. 複製專案

```bash
git clone https://github.com/Ailwyn0822/smart-market.git
cd smart-market
```

### 2. 安裝所有套件（Monorepo）

```bash
npm install
```

### 3. 啟動基礎服務（PostgreSQL + MinIO）

```bash
docker compose up -d
```

| 服務          | 位址                                              |
| ------------- | ------------------------------------------------- |
| PostgreSQL    | `localhost:5432`                                  |
| pgAdmin       | `http://localhost:5050`（admin@admin.com / root） |
| MinIO Console | `http://localhost:9001`（admin / password）       |

### 4. 設定後端環境變數

```bash
cp backend/.env.example backend/.env  # 若無範本，參考下方環境變數說明
```

### 5. 一鍵啟動全部服務

```bash
npm run dev
```

此命令會同時啟動：

- **後端 API** → `http://localhost:8080`
- **前台** → `http://localhost:3000`
- **後台** → `http://localhost:5173`

---

## 環境變數說明

本機開發請在 `backend/.env` 設定；生產環境請參考 `.env.prod.example` 並建立 `.env.prod`。

### 必填項目

| 變數                                                       | 說明                         |
| ---------------------------------------------------------- | ---------------------------- |
| `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME`          | PostgreSQL 連線資訊          |
| `JWT_SECRET`                                               | JWT 簽名金鑰（至少 32 字元） |
| `MINIO_ENDPOINT` / `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | MinIO 連線資訊               |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`                | Google OAuth 憑證            |
| `LINE_CHANNEL_ID` / `LINE_CHANNEL_SECRET`                  | LINE OAuth 憑證              |
| `GEMINI_API_KEY`                                           | Google Gemini API 金鑰       |
| `ECPAY_MERCHANT_ID` / `ECPAY_HASH_KEY` / `ECPAY_HASH_IV`   | ECPay 金流憑證               |
| `NUXT_PUBLIC_API_BASE`                                     | 前台 API base URL            |

完整範本請見 [`.env.prod.example`](.env.prod.example)。

---

## 主要功能

### 買家

- 商品瀏覽、搜尋、分類篩選
- 商品詳情（JSON-LD SEO）
- 加入購物車、折扣碼、ECPay 結帳
- 訂單追蹤、訂單評價
- 商品收藏
- 與賣家即時私訊（WebSocket）
- Google / LINE OAuth 快速登入
- 多語系介面（繁中 / 英 / 越）

### 賣家

- AI 輔助商品上架（Gemini Vision 自動填入資訊）
- 商品管理（CRUD）
- 賣家訂單管理
- 賣家個人頁面

### 管理員（後台）

- 用戶管理
- 商品管理
- 分類管理
- 訂單管理
- 儀表板總覽

---

## 專案結構

```
smart-market/
├── backend/                # NestJS API（port 8080）
│   └── src/
│       ├── auth/           # JWT + Google/LINE OAuth
│       ├── users/          # 個人資料、頭像
│       ├── products/       # CRUD + AI 分析
│       ├── categories/     # 分類
│       ├── orders/         # 訂單（含 admin routes）
│       ├── ecpay/          # 綠界金流
│       ├── favorites/      # 收藏
│       ├── discount-codes/ # 折扣碼
│       ├── reviews/        # 評價
│       ├── chat/           # WebSocket 私訊
│       ├── notifications/  # SSE 通知
│       ├── ai/             # Gemini Vision
│       └── storage/        # MinIO 圖片上傳
│
├── frontend-client/        # Nuxt 4 前台（port 3000）
│   └── app/
│       ├── pages/          # 19 個頁面（含 SSR）
│       ├── components/     # 12 個共用組件
│       ├── composables/    # useToast / useDebounce / useHomeData
│       ├── stores/         # Pinia（auth / cart / chat）
│       ├── layouts/        # default / auth
│       └── i18n/           # zh_TW / en / vi
│
├── frontend-admin/         # Vue 3 + Vite 後台（port 5173）
│   └── src/
│       ├── pages/          # 6 個管理頁面
│       └── api/            # Axios（帶 JWT）
│
├── shared/                 # 共用 TypeScript 型別 / Zod Schema（Monorepo Workspace）
│
├── nginx/                  # 生產環境 Nginx 設定
├── docker-compose.yml      # 本機開發（PostgreSQL + MinIO）
├── docker-compose.prod.yml # 生產環境（全服務）
├── Dockerfile.backend
├── Dockerfile.client
├── Dockerfile.admin
└── .env.prod.example       # 環境變數範本
```

---

## 部署（Production）

### 使用 Docker Compose

```bash
# 1. 複製環境變數範本並填入真實值
cp .env.prod.example .env.prod
nano .env.prod

# 2. 啟動所有服務（從 GitHub Container Registry 拉取最新 image）
docker compose -f docker-compose.prod.yml up -d
```

生產環境的 Docker services：

| Container    | Image                                   | 說明               |
| ------------ | --------------------------------------- | ------------------ |
| `sm_db`      | postgres:15-alpine                      | 資料庫             |
| `sm_minio`   | minio/minio                             | 圖片儲存           |
| `sm_backend` | ghcr.io/ailwyn0822/smart-market-backend | NestJS API         |
| `sm_client`  | ghcr.io/ailwyn0822/smart-market-client  | Nuxt 4 SSR         |
| `sm_admin`   | ghcr.io/ailwyn0822/smart-market-admin   | Vue 3 後台         |
| `sm_nginx`   | nginx:alpine                            | 反向代理（80/443） |

---

## CI / CD

GitHub Actions（`.github/workflows/ci.yml`）在每次 push / PR 時觸發：

```
shared-build（tsc --noEmit）
    ├── backend-check（npm run build）
    ├── client-check（test:unit + build）
    └── admin-check（type-check + test:unit + build-only）
```

build 成功後自動推送 Docker image 至 GitHub Container Registry（ghcr.io）。

---

## License

MIT
