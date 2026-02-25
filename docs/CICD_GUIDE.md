# Smart Market CI/CD 部署完整指南

> 本文件說明如何將 Smart Market 專案從零開始部署到 GCP Compute Engine VM，並設定 GitHub Actions 自動部署。

---

## 目錄

1. [架構概覽](#架構概覽)
2. [前置需求](#前置需求)
3. [GCP VM 建立與初始化](#gcp-vm-建立與初始化)
4. [首次部署流程](#首次部署流程)
5. [GitHub Actions 自動部署設定](#github-actions-自動部署設定)
6. [環境變數說明](#環境變數說明)
7. [Nginx 設定說明](#nginx-設定說明)
8. [SSL 憑證](#ssl-憑證)
9. [MinIO 管理介面存取](#minio-管理介面存取)
10. [常見問題排除](#常見問題排除)
11. [日常維護指令](#日常維護指令)

---

## 架構概覽

```
Internet → Nginx (80/443) 
            ├── panda-map.com/               → sm_client  (Nuxt SSR, port 3000)
            ├── panda-map.com/api/_nuxt_icon/ → sm_client  (Nuxt icon 內部 API)
            ├── panda-map.com/api/            → sm_backend (NestJS, port 8080) 
            ├── panda-map.com/socket.io/      → sm_backend (WebSocket)
            ├── panda-map.com/admin/          → sm_admin   (Vue SPA, inner nginx port 80)
            └── panda-map.com/minio/          → sm_minio   (MinIO API, port 9000)

Docker Network (sm_network):
  sm_db       PostgreSQL 15
  sm_minio    MinIO (API: 9000, Console: 9001 綁 127.0.0.1)
  sm_backend  NestJS
  sm_client   Nuxt SSR
  sm_admin    Vue SPA + Nginx
  sm_nginx    Nginx 反向代理
```

**CI/CD 流程：**
```
git push to master
  → [CI] 只跑有改動的 package（backend / client / admin / shared）
  → [Deploy] CI 全部通過後觸發：
      1. GitHub Actions 上 build Docker image（8 核，快）
      2. Push image 到 GHCR（GitHub Container Registry）
      3. SSH 進 VM：docker pull + docker compose up -d
         （VM 不再自己 build，只負責拉 image 跑起來）
```

**為什麼這樣設計：**
- VM 資源有限（2 vCPU），在 VM 上 build 很慢（20+ 分鐘）
- GitHub Actions runner 有 8 核，build 快很多
- VM 只要 `docker pull` 拉現成 image，部署只需 1~2 分鐘

---

## 前置需求

- GCP 帳號（已建立專案）
- 網域名稱（DNS A Record 指向 VM IP）
- GitHub repository（含本專案程式碼）
- 本機已安裝 Git

---

## GCP VM 建立與初始化

### 1. 建立 VM

GCP Console → Compute Engine → VM instances → Create instance

| 欄位 | 設定值 |
|------|--------|
| Machine type | e2-small（1 vCPU, 2GB RAM）或 e2-medium（建議） |
| OS | Ubuntu 22.04 LTS |
| Boot disk | 20GB SSD |
| Firewall | ✅ Allow HTTP traffic、✅ Allow HTTPS traffic |

建立完成後記下 **External IP**。

### 2. DNS 設定

到你的網域服務商，新增 A Record：
```
panda-map.com → <GCP External IP>
```
等待 DNS 生效（5～30 分鐘）。

### 3. SSH 進入 VM

GCP Console → Compute Engine → 點 SSH 按鈕（瀏覽器 SSH）

### 4. 設定 2GB Swap（防止記憶體不足）

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 5. 安裝 Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# 確認安裝成功
docker --version
docker compose version
```

### 6. 安裝 Certbot（SSL）

```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
```

---

## 首次部署流程

### 1. Clone 專案

```bash
git clone https://github.com/ailwyn0822/smart-market.git
cd ~/smart-market
```

### 2. 設定環境變數

```bash
cp .env.prod.example .env.prod
nano .env.prod
```

**必填欄位：**

| 變數 | 說明 |
|------|------|
| `POSTGRES_PASSWORD` | PostgreSQL 密碼（自訂強密碼） |
| `DB_PASSWORD` | 同上 |
| `MINIO_ROOT_PASSWORD` | MinIO root 密碼 |
| `MINIO_SECRET_KEY` | 同上（與 MINIO_ROOT_PASSWORD 相同） |
| `JWT_SECRET` | JWT 簽名密鑰（至少 32 字元隨機字串） |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `LINE_CHANNEL_ID` | LINE Login Channel ID |
| `LINE_CHANNEL_SECRET` | LINE Login Channel Secret |
| `GEMINI_API_KEY` | Google Gemini AI API Key |
| `FRONTEND_URL` | `https://panda-map.com` |
| `ECPAY_API_BASE` | `https://panda-map.com/api` |

> ⚠️ **注意**：`.env.prod` 不會被 git commit，每次重新部署到新機器都要重新設定。

### 3. 取得 SSL 憑證

```bash
sudo systemctl stop nginx 2>/dev/null || true
sudo certbot certonly --standalone -d panda-map.com
ls /etc/letsencrypt/live/panda-map.com/
```

### 4. 設定 GitHub Actions（先完成第 5 節設定）

**初次啟動前，需先讓 GitHub Actions 跑一次把 image push 到 GHCR。**

push 任意 commit 觸發 Actions，等 CI + Deploy 跑完後，再繼續以下步驟。

### 5. 登入 GHCR 並首次啟動

```bash
# 建立 GitHub Personal Access Token（Settings → Developer settings → PAT → read:packages）
echo "your_github_pat" | docker login ghcr.io -u ailwyn0822 --password-stdin

# Pull image 並啟動（第一次需要暫時讓 TypeORM 建立資料表）
nano .env.prod
# 把 NODE_ENV=production 改成 NODE_ENV=development

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

等待 backend 完全啟動並 seed 資料：

```bash
docker compose -f docker-compose.prod.yml logs backend --tail=30
# 看到 "Nest application successfully started" 代表成功
```

**改回 production：**

```bash
nano .env.prod
# 把 NODE_ENV=development 改回 NODE_ENV=production

docker compose -f docker-compose.prod.yml restart backend
```

### 6. 確認所有容器運作

```bash
docker compose -f docker-compose.prod.yml ps
```

應看到 6 個容器都是 `Up` 狀態：sm_db、sm_minio、sm_backend、sm_client、sm_admin、sm_nginx

### 7. 驗證網站

| URL | 預期結果 |
|-----|----------|
| `https://panda-map.com` | 前台首頁 |
| `https://panda-map.com/api/products` | JSON 回應 |
| `https://panda-map.com/admin/` | Admin 登入頁 |
| `https://panda-map.com/minio/images/` | MinIO 回應 |

---

## GitHub Actions 自動部署設定

### 1. 在 VM 產生 SSH Key pair（給 Actions 用）

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys  # 權限不正確 SSH 會拒絕讀取
cat ~/.ssh/github_actions   # 複製私鑰內容，稍後貼到 GitHub Secrets
```

### 2. 設定 GitHub Secrets

GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret 名稱 | 值 |
|------------|-----|
| `GCP_HOST` | VM 的 External IP（例如 `35.189.168.63`） |
| `GCP_USER` | VM 登入帳號（例如 `asd66151200`） |
| `GCP_SSH_KEY` | 上一步私鑰完整內容（包含 `-----BEGIN...-----END-----`） |

> `GITHUB_TOKEN` 不需要另外設定，GitHub Actions 自動提供。

### 3. 設定 VM 的 git remote 使用 SSH

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy -N ""

cat >> ~/.ssh/config << 'EOF'
Host github.com
  IdentityFile ~/.ssh/github_deploy
  StrictHostKeyChecking no
EOF

cat ~/.ssh/github_deploy.pub  # 複製公鑰
```

GitHub repo → Settings → Deploy keys → Add deploy key（貼上公鑰，不需要 write access）

```bash
cd ~/smart-market
git remote set-url origin git@github.com:ailwyn0822/smart-market.git
git pull origin master  # 測試
```

### 4. Workflow 說明

**CI (`.github/workflows/ci.yml`)：**
- 每次 push 到 master 或 PR 觸發
- 用 `dorny/paths-filter` 偵測哪些路徑有改動
- 只跑有改動的 job：shared-check / backend-check / client-check / admin-check
- 改後端不需要等前端 CI 跑完

**Deploy (`.github/workflows/deploy.yml`)：**
- 等 CI **全部通過**後才觸發（`workflow_run` trigger）
- 在 GitHub Actions 上 build Docker image（只 build 有改動的 service）
- Push 到 GHCR（`ghcr.io/ailwyn0822/smart-market-{backend,client,admin}:latest`）
- SSH 進 VM：
  1. 自動執行 DB schema 遷移（`ALTER TYPE ... ADD VALUE IF NOT EXISTS`，冪等安全）
  2. `docker pull` + `docker compose up -d`（VM 不做任何 build）
- Docker layer cache 存在 GHCR，第二次以後 build 快很多

**部署時間（有 layer cache 後）：**

| 改動 | 時間 |
|------|------|
| 只改後端 | ~2 分鐘 |
| 只改前台 | ~4 分鐘 |
| 只改 nginx.conf | ~1 分鐘（不 build，只 pull + restart） |
| 初次建立（無 cache） | ~20 分鐘 |

---

## 環境變數說明

參考 [.env.prod.example](../.env.prod.example)

| 變數 | 說明 | 注意事項 |
|------|------|----------|
| `NODE_ENV` | 執行環境 | 生產環境必須設 `production` |
| `PORT` | NestJS 後端 port | 設 `8080` |
| `NITRO_PORT` | Nuxt SSR server port | 必須設 `3000` |
| `MINIO_ENDPOINT` | MinIO 服務名稱 | Docker network 內用 `minio`（**不是** `sm_minio`） |
| `MINIO_PUBLIC_URL` | MinIO 對外 URL | 設為 `https://panda-map.com/minio` |
| `FRONTEND_URL` | 前台網址 | OAuth 登入後跳轉用，設 `https://panda-map.com` |
| `ECPAY_API_BASE` | 後端對外網址 | ECPay 回呼 URL 用，設 `https://panda-map.com/api` |
| `CORS_ORIGINS` | 允許的前端網域 | 多個用逗號分隔 |

> `VITE_API_BASE`（Admin build-time 變數）已寫死在 `docker-compose.prod.yml` 的 build args，不需要在 `.env.prod` 設定。

### OAuth 設定

**Google OAuth：**
Authorized redirect URIs 加入：`https://panda-map.com/api/auth/google/callback`

**LINE Login：**
Callback URL 加入：`https://panda-map.com/api/auth/line/callback`

---

## Nginx 設定說明

檔案位置：[nginx/nginx.conf](../nginx/nginx.conf)

| 路徑 | 代理目標 | 說明 |
|------|----------|------|
| `/api/_nuxt_icon/` | `sm_client:3000` | Nuxt icon 內部 API（**必須在 `/api/` 之前**） |
| `/api/` | `sm_backend:8080/` | NestJS API（strip /api prefix） |
| `/socket.io/` | `sm_backend:8080/socket.io/` | WebSocket（設有 `proxy_read_timeout 86400s`） |
| `/admin/` | `sm_admin:80/` | Vue SPA 後台 |
| `/minio/` | `minio:9000/` | MinIO 圖片存取 |
| `/` | `sm_client:3000` | Nuxt SSR 前台 |

> ⚠️ `/api/_nuxt_icon/` 必須定義在 `/api/` 前面，否則 Nuxt 的 icon endpoint 會被錯誤導向 NestJS backend 造成 404。

---

## SSL 憑證

使用 Let's Encrypt，憑證存放於 VM 的 `/etc/letsencrypt/`，已 mount 進 nginx 容器。

**更新憑證（每 90 天需要更新一次）：**

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml stop nginx
sudo certbot renew
docker compose -f ~/smart-market/docker-compose.prod.yml start nginx
```

**設定自動更新：**

```bash
(crontab -l 2>/dev/null; echo "0 3 1 * * docker compose -f /home/asd66151200/smart-market/docker-compose.prod.yml stop nginx && sudo certbot renew && docker compose -f /home/asd66151200/smart-market/docker-compose.prod.yml start nginx") | crontab -
```

---

## MinIO 管理介面存取

MinIO console（port 9001）只綁定到 VM 的 `127.0.0.1`，需要 SSH tunnel 才能存取。

```bash
# 本機建立 SSH tunnel（使用 port 19001 避免與本地 Docker 衝突）
ssh -i ~/.ssh/gcp_key -L 19001:127.0.0.1:9001 asd66151200@35.189.168.63 -N
```

瀏覽器開 `http://localhost:19001`，輸入 `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`。

---

## 常見問題排除

### 502 Bad Gateway

nginx DNS 快取失效（容器重建後 IP 改變）：

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml restart nginx
```

### Icon 顯示 404（`/api/_nuxt_icon/` not found）

確認 `nginx/nginx.conf` 有在 `/api/` 前面加入：
```nginx
location /api/_nuxt_icon/ {
    proxy_pass http://sm_client:3000/api/_nuxt_icon/;
    ...
}
```

### Socket.io 400 "Session ID unknown"

通常是 backend 重啟後 client 用舊 session id 重連，屬正常暫時現象，client 會自動重連。

若持續發生，確認 `nginx/nginx.conf` 的 socket.io 區段有：
```nginx
proxy_read_timeout 86400s;
proxy_buffering    off;
```

### ECPay 500 Internal Server Error

確認 backend logs：
```bash
docker compose -f docker-compose.prod.yml logs backend --tail=20
```
若看到 `Cannot find module 'ecpay-aio-node'`，代表 `ecpay-aio-node` 未安裝，需確認 `backend/package.json` 的 `dependencies` 有 `"ecpay-aio-node": "^0.0.5"`。

### GHCR image 找不到（初次部署）

確認 GitHub Actions 已成功 push image：
- 到 GitHub repo → Packages，應看到 `smart-market-backend`、`smart-market-client`、`smart-market-admin`

若還沒有，等 Actions 跑完或手動觸發 deploy workflow。

### Backend 起不來

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml logs backend --tail=50
```

常見原因：
- 資料庫連線失敗 → 確認 `DB_HOST=sm_db`、密碼正確
- MinIO 連線失敗 → 確認 `MINIO_ENDPOINT=minio`（不是 `sm_minio`）
- Port 衝突 → 確認 `NITRO_PORT=3000` 有設定

### 資料表不存在（42P01 error）

```bash
nano ~/smart-market/.env.prod   # NODE_ENV=development
docker compose -f docker-compose.prod.yml restart backend
# 等 backend 完全啟動
nano ~/smart-market/.env.prod   # NODE_ENV=production
docker compose -f docker-compose.prod.yml restart backend
```

### 新增 enum 值（如 `pending_payment`）

Deploy workflow 會在每次部署時自動執行 `ALTER TYPE ... ADD VALUE IF NOT EXISTS`，正常情況不需手動操作。

若需要手動補跑：
```bash
docker exec sm_db psql -U postgres -d smart_market \
  -c "ALTER TYPE orders_status_enum ADD VALUE IF NOT EXISTS 'pending_payment' BEFORE 'processing';"
```

### OAuth 登入後跳轉到 localhost

確認 VM 的 `.env.prod` 有設定 `FRONTEND_URL=https://panda-map.com`

---

## 日常維護指令

### 查看所有容器狀態

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml ps
```

### 查看特定容器 log

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml logs <service> --tail=50
# service: backend, client, admin, nginx, minio, postgres
```

### 手動觸發重新部署

```bash
cd ~/smart-market
git fetch origin master && git reset --hard origin/master

# 登入 GHCR（若 token 過期）
echo "your_github_pat" | docker login ghcr.io -u ailwyn0822 --password-stdin

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker image prune -f
docker compose -f docker-compose.prod.yml restart nginx
```

### 查看磁碟使用量

```bash
df -h
docker system df
```

### 清理 Docker 資源

```bash
docker image prune -f          # 清理未使用的 image
docker system prune -f         # 清理全部未使用資源（謹慎使用）
```

### 備份資料庫

```bash
docker exec sm_db pg_dump -U postgres smart_market > backup_$(date +%Y%m%d).sql
```

### 還原資料庫

```bash
docker exec -i sm_db psql -U postgres smart_market < backup_20260225.sql
```

---

## 預設帳號

| 帳號類型 | Email | 密碼 |
|----------|-------|------|
| Admin 後台 | `admin@smartmarket.com` | `password123` |

> ⚠️ **上線後請立即修改預設密碼！**

---

## 重要檔案位置

| 檔案 | 說明 |
|------|------|
| `docker-compose.prod.yml` | 生產環境容器設定（使用 GHCR image） |
| `.env.prod` | 生產環境變數（**不進 git**） |
| `.env.prod.example` | 環境變數範本（進 git） |
| `nginx/nginx.conf` | Nginx 反向代理設定 |
| `Dockerfile.backend` | NestJS 建置 |
| `Dockerfile.client` | Nuxt SSR 建置 |
| `Dockerfile.admin` | Vue SPA 建置 |
| `nginx-admin.conf` | Admin SPA 的 inner nginx 設定 |
| `.github/workflows/ci.yml` | CI：路徑過濾 + 各 package 測試與 build |
| `.github/workflows/deploy.yml` | Deploy：build image → push GHCR → VM pull |

---

*最後更新：2026-02-25*
