# Smart Market CI/CD 從零學習指南

> 這份文件用「你的專案」作為範例，從概念到實作帶你看懂整個自動部署流程。
> 建議讀完這份後，再回去看 `CICD_GUIDE.md`，你會突然全部看懂。

---

## 目錄

1. [第一關：為什麼需要 CI/CD？](#第一關為什麼需要-cicd)
2. [第二關：Docker 是什麼？](#第二關docker-是什麼)
3. [第三關：看懂你專案的 Dockerfile](#第三關看懂你專案的-dockerfile)
4. [第四關：docker-compose 是什麼？](#第四關docker-compose-是什麼)
5. [第五關：GitHub Actions 是什麼？](#第五關github-actions-是什麼)
6. [第六關：看懂你的 ci.yml](#第六關看懂你的-ciyml)
7. [第七關：看懂你的 deploy.yml](#第七關看懂你的-deployyml)
8. [完整流程複習](#完整流程複習)

---

## 第一關：為什麼需要 CI/CD？

### 沒有 CI/CD 的痛苦世界

你改了一行 code，然後：

1. 在本機確認 OK
2. SSH 進去 GCP VM
3. `git pull origin master`
4. `npm run build`（在 VM 上跑，可能要 20 分鐘）
5. 重啟服務
6. 結果發現有個 bug，重來一次

每改一次就要重複一次。一天改 10 次？你會瘋掉。

### CI/CD 解決了什麼？

```
你的本機 → git push → GitHub
                         ↓
               GitHub Actions 自動：
               1. 跑測試（CI）
               2. 打包成 Docker image
               3. 推送到 GHCR 倉庫
               4. SSH 進 VM 拉下來跑（Deploy）
                         ↓
               你喝咖啡等 3 分鐘，網站就更新好了
```

- **CI（Continuous Integration）**：每次 push 自動跑測試，確保程式碼品質
- **CD（Continuous Deployment）**：測試通過後自動部署到伺服器

---

## 第二關：Docker 是什麼？

### 核心比喻：貨運貨櫃 🚢

傳統部署問題：你本機是 macOS、VM 是 Ubuntu、同事是 Windows，三個環境不一樣，容易出現「我這裡能跑，你那裡不行」的鬼故事。

Docker 就是個「貨櫃」，把你的程式 + 它需要的所有環境（Node.js 版本、套件、設定）都封裝進去。

貨櫃扔到哪裡都能跑，不管底層環境是什麼。

### 關鍵名詞

| 名詞                  | 比喻             | 說明                                                                      |
| --------------------- | ---------------- | ------------------------------------------------------------------------- |
| **Image（鏡像）**     | 貨櫃的模具       | 一份靜態的「快照」，包含應用程式和所有依賴。唯讀的。                      |
| **Container（容器）** | 跑起來的貨櫃     | Image 跑起來之後就是 Container。可以有很多個 Container 都用同一個 Image。 |
| **Dockerfile**        | 製作模具的說明書 | 告訴 Docker「怎麼建造這個 Image」的指令清單                               |
| **Registry（倉庫）**  | 貨櫃港口         | 存放 Image 的地方。`GHCR`（GitHub Container Registry）就是你的港口。      |
| **Volume（掛載卷）**  | 外接硬碟         | Container 本身是無狀態的，要持久化資料（如資料庫）就需要 Volume           |
| **Network（網路）**   | 內部區域網路     | 讓多個 Container 之間能互相溝通的虛擬網路                                 |

### 最基本的 Docker 操作

```bash
# 從 Dockerfile 建立 Image（在你的專案根目錄下）
docker build -f Dockerfile.backend -t my-backend .

# 跑起來一個 Container
docker run -p 8080:8080 my-backend

# 看現在跑著哪些 Container
docker ps

# 停止並刪除
docker stop <container-id>
docker rm <container-id>

# 看 Image 列表
docker images
```

---

## 第三關：看懂你專案的 Dockerfile

你的專案有三個 Dockerfile（`Dockerfile.backend`、`Dockerfile.client`、`Dockerfile.admin`）。
以 `Dockerfile.backend` 為例：

```dockerfile
# ============================
# Stage 1: Build（建置階段）
# ============================
FROM node:20-alpine AS builder     # 使用 Node.js 20 的精簡版 Alpine Linux 作為基底
WORKDIR /app                        # 設定工作目錄

# 只複製 package.json，不複製原始碼（Cache 技巧！）
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# 安裝依賴（如果 package.json 沒變，這層 cache 可以直接複用，超快）
RUN npm ci

# 複製並編譯 shared
COPY shared/ ./shared/
RUN npm run build --workspace=shared

# 複製並編譯 backend
COPY backend/ ./backend/
RUN npm run build --workspace=backend

# ============================
# Stage 2: Runner（執行階段）
# ============================
FROM node:20-alpine AS runner       # 重新用一個乾淨的 Alpine 開始
WORKDIR /app
ENV NODE_ENV=production

# 只安裝 production 依賴（去掉 devDependencies，大幅縮小體積）
COPY package*.json ./
RUN npm ci --omit=dev

# 從 Stage 1 的 builder 把編譯好的成品複製過來
# 注意：原始碼、devDependencies 都不會帶過來！
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/backend/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main"]          # 啟動 NestJS
```

### 為什麼要分兩個 Stage？

**只用一個 Stage 的問題：**

- `node_modules` 裡面的 `devDependencies`（TypeScript、ts-node 等）都會打包進去
- Image 會變得非常肥大（可能 1GB+）
- 部署慢、佔空間

**Multi-stage build 的好處：**

- Stage 1（builder）負責編譯，有完整工具
- Stage 2（runner）只有執行時需要的東西
- 最終 Image 可以縮到 200MB 以下

### 為什麼先 COPY package.json 再 COPY 原始碼？

這是 Docker 的 **Layer Cache** 機制：

```
每一行 RUN / COPY 都是一個 layer（層）
如果這一層的輸入沒有改變，Docker 直接用快取，不重新執行
```

如果你先 COPY 整個原始碼再 npm install：

- 你改了 `src/app.ts` 一行 → Docker 認為原始碼變了 → 重新 `npm install`（幾分鐘！）

如果你先 COPY package.json 再 COPY 原始碼：

- 你改了 `src/app.ts` 一行 → `package.json` 沒變 → `npm install` 那層用快取（秒過）→ 只重新 build

---

## 第四關：docker-compose 是什麼？

你的專案需要同時跑 6 個程式（NestJS、Nuxt、Vue Admin、PostgreSQL、MinIO、Nginx），手動一個一個 `docker run` 非常麻煩。

`docker compose` 讓你用一個 YAML 檔管理多個 Container。

### 看你的 `docker-compose.prod.yml` 重點

```yaml
services:
  postgres:
    image: postgres:15-alpine # 直接用 Docker Hub 的官方 PostgreSQL image
    container_name: sm_db # Container 的名字（其他 Container 用這個名字連線它）
    restart: always # 掛了自動重啟
    env_file: .env.prod # 從 .env.prod 讀入環境變數（密碼等）
    volumes:
      - postgres_data:/var/lib/postgresql/data # 資料庫資料持久化到 Volume
    networks:
      - sm_network # 加入這個虛擬網路

  backend:
    image: ghcr.io/ailwyn0822/smart-market-backend:latest # 從 GHCR 拉 image
    pull_policy: always # 每次 up 都重新 pull 最新版
    container_name: sm_backend
    restart: always
    depends_on:
      - postgres # 確保 postgres 先啟動
    networks:
      - sm_network
    # 注意：backend 沒有 ports 設定！它是內部服務，只有 nginx 能連到它

  nginx:
    image: nginx:alpine
    container_name: sm_nginx
    ports:
      - "80:80" # 把 VM 的 80 port 對應到 nginx container 的 80
      - "443:443" # HTTPS
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro # 掛入你的 nginx 設定檔
    networks:
      - sm_network

networks:
  sm_network:
    driver: bridge # 所有 Container 在同一個虛擬網路裡互相看得到
```

### Network 的關鍵概念

- 同一個 `sm_network` 裡的 Container 可以用 **服務名稱** 直接互連
- 例如：`backend` Container 連資料庫不用 IP，直接用 `sm_db`（container_name）
- 例如：Nginx 轉發到後端用 `sm_backend:8080`

這就是為什麼你的 `nginx.conf` 裡面寫：

```nginx
proxy_pass http://sm_backend:8080/;
```

而不是 IP 地址。

---

## 第五關：GitHub Actions 是什麼？

GitHub Actions 是 GitHub 內建的自動化工具。

**核心概念：當某件事發生時，自動執行一段程式。**

### 基本結構

```yaml
# .github/workflows/某個workflow.yml

name: 這個 Workflow 的名字

on: # 觸發條件
  push:
    branches: [master] # 當有人 push 到 master

jobs: # 要執行的工作
  my-job: # 工作名稱（自訂）
    runs-on: ubuntu-latest # 在什麼環境跑

    steps: # 這個工作裡的步驟，從上到下依序執行
      - name: 第一步
        run: echo "Hello World"

      - name: 第二步
        run: npm install

      - name: 第三步
        uses: actions/checkout@v4 # 使用別人寫好的 Action
```

### 關鍵名詞

| 名詞                    | 說明                                                           |
| ----------------------- | -------------------------------------------------------------- |
| **Workflow**            | 一個 `.yml` 檔案 = 一個 Workflow                               |
| **Trigger（觸發條件）** | `on:` 底下定義的，什麼時候要跑                                 |
| **Job**                 | Workflow 裡面可以有多個平行或依賴的工作                        |
| **Step**                | 一個 Job 裡面的每個步驟（順序執行）                            |
| **Runner**              | 跑 Job 的機器（`ubuntu-latest` = GitHub 給你免費的 Ubuntu VM） |
| **Secrets**             | 加密的敏感資訊（SSH 私鑰、密碼等），在 Settings > Secrets 設定 |
| **`uses`**              | 使用別人發佈的 Action（相當於呼叫 function library）           |
| **`run`**               | 直接執行 shell 指令                                            |

---

## 第六關：看懂你的 ci.yml

你的 `ci.yml` 做了一件聰明的事：**只跑有改動的部分**。

### Step 1：偵測哪些路徑有改動

```yaml
changes: # 這是一個 Job 的名稱
  runs-on: ubuntu-latest
  outputs: # 這個 Job 的輸出（可以傳給後面的 Job）
    backend: ${{ steps.filter.outputs.backend }}
    admin: ${{ steps.filter.outputs.admin }}
  steps:
    - uses: actions/checkout@v4
    - uses: dorny/paths-filter@v3 # 這是一個第三方 Action（路徑過濾工具）
      id: filter
      with:
        filters: |
          backend:
            - 'backend/**'    # 如果 backend/ 資料夾有任何改動
            - 'shared/**'     # 或 shared/ 有改動（因為 backend 依賴 shared）
```

### Step 2：根據偵測結果決定要不要跑

```yaml
backend-check:
  needs: changes # 等 changes 這個 Job 先跑完
  if: ${{ needs.changes.outputs.backend == 'true' }} # 條件：backend 有改動才跑
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm ci
    - run: npm run build -w shared # 先 build shared（backend 依賴它）
    - run: npm run build -w backend # 再 build backend（TypeScript compile）
```

### 為什麼這樣設計？

如果你只改了 `frontend-admin` 的一個按鈕顏色，完全不需要跑後端的測試和 build。
這樣 CI 只要約 2 分鐘，而不是跑整個 5-10 分鐘的全套流程。

### 圖解

```
git push（只改了 frontend-admin）
          ↓
      changes job
          ↓
  backend: false  →  backend-check：跳過
  client:  false  →  client-check：跳過
  admin:   true   →  admin-check：執行！
                       ├── npm ci
                       ├── build shared
                       ├── type check
                       ├── unit tests
                       └── build-only
```

---

## 第七關：看懂你的 deploy.yml

### 觸發條件：等 CI 全部通過

```yaml
on:
  workflow_run:
    workflows: ["CI"] # 等 ci.yml（名稱叫 "CI"）跑完
    branches: [master]
    types: [completed]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    # 只有 CI 結論是 success 才繼續，失敗就不部署
```

### 登入 GHCR 推送 Image

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }} # 你的 GitHub 帳號
    password: ${{ secrets.GITHUB_TOKEN }} # GitHub 自動產生，不用額外設定
```

### 智能判斷哪些 Image 要 build

```yaml
- name: Build & Push backend
  if: |
    steps.filter.outputs.backend == 'true'   # backend 有改動
    || steps.image_check.outputs.backend == 'false'  # 或者 GHCR 上根本還沒有這個 image（初次部署）
  uses: docker/build-push-action@v6
  with:
    file: Dockerfile.backend
    push: true
    tags: ghcr.io/ailwyn0822/smart-market-backend:latest
    cache-from: type=registry,ref=ghcr.io/ailwyn0822/smart-market-backend:cache
    cache-to: type=registry,ref=ghcr.io/ailwyn0822/smart-market-backend:cache,mode=max
```

`cache-from / cache-to`：把 Docker layer cache 存到 GHCR，下次 build 可以重用，速度大幅提升。

### SSH 進 VM 執行部署

```yaml
- name: 部署到 GCP VM
  uses: appleboy/ssh-action@v1.0.3 # 第三方 Action，幫你 SSH 進去並跑指令
  with:
    host: ${{ secrets.GCP_HOST }} # VM IP（存在 Secrets）
    username: ${{ secrets.GCP_USER }} # 登入帳號（存在 Secrets）
    key: ${{ secrets.GCP_SSH_KEY }} # SSH 私鑰（存在 Secrets）
    script: |
      cd ~/smart-market
      git fetch origin master
      git reset --hard origin/master   # 拉最新的 nginx.conf、docker-compose 等設定

      echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin

      # DB 遷移：新增 enum 值（冪等，重複執行不會爆）
      docker compose -f docker-compose.prod.yml up -d postgres
      docker exec sm_db psql -U postgres -d smart_market \
        -c "ALTER TYPE orders_status_enum ADD VALUE IF NOT EXISTS 'pending_payment';"

      docker compose -f docker-compose.prod.yml pull   # 拉最新 image
      docker compose -f docker-compose.prod.yml up -d  # 啟動所有容器
      docker image prune -f                            # 清理舊 image
      docker compose -f docker-compose.prod.yml restart nginx  # 重啟 nginx 避免 DNS 快取
```

---

## 完整流程複習

```
你在本機：
git push origin master
         │
         ▼
GitHub 接到 push，觸發 ci.yml：
  ┌─────────────────────────────────────┐
  │ 1. changes job：偵測哪些路徑有改動    │
  │ 2. 只跑有改動的 check job：          │
  │    - npm ci                         │
  │    - build shared                   │
  │    - type check / unit test / build │
  └─────────────────────────────────────┘
         │ CI 全部通過
         ▼
GitHub 觸發 deploy.yml：
  ┌─────────────────────────────────────┐
  │ 1. 偵測哪些服務有改動                 │
  │ 2. 只 build 有改動的 Docker image    │
  │    - 使用 GHCR layer cache（超快）   │
  │ 3. Push image 到 GHCR               │
  │ 4. SSH 進 GCP VM：                  │
  │    - git pull 設定檔                 │
  │    - docker compose pull            │
  │    - docker compose up -d           │
  │    - 清理舊 image                   │
  └─────────────────────────────────────┘
         │ 約 2~5 分鐘後
         ▼
你的網站更新完畢！🎉
```

### Secrets 是什麼、為什麼重要？

你的 `deploy.yml` 裡面用到：

- `secrets.GCP_HOST` → VM 的 IP
- `secrets.GCP_USER` → SSH 帳號
- `secrets.GCP_SSH_KEY` → SSH 私鑰

這些如果直接寫在 YAML 裡，git push 之後全世界都看得到。
放進 **GitHub Secrets**（Settings → Secrets and variables → Actions），Actions 跑起來時才注入，不會暴露在程式碼裡。

---

## 學完這份，你已經能看懂的東西

| 概念                      | 你現在懂的程度                           |
| ------------------------- | ---------------------------------------- |
| 為什麼用 Docker           | ✅ 環境一致性、貨櫃比喻                  |
| Multi-stage Dockerfile    | ✅ Builder / Runner、縮小 Image          |
| Docker Layer Cache        | ✅ 為什麼 COPY package.json 要在原始碼前 |
| docker-compose 多服務管理 | ✅ Network、Volume、depends_on           |
| GitHub Actions 結構       | ✅ Workflow / Job / Step / Secrets       |
| paths-filter 路徑過濾     | ✅ 只跑有改動的部分                      |
| GHCR image 推送           | ✅ Build → Push → Pull                   |
| SSH 自動部署              | ✅ appleboy/ssh-action                   |

接下來可以回去看 `CICD_GUIDE.md`，你應該每個步驟都看得懂了。

---

_最後更新：2026-03-03_
