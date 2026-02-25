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
            ├── panda-map.com/          → sm_client  (Nuxt SSR, port 3000)
            ├── panda-map.com/api/      → sm_backend (NestJS, port 8080)
            ├── panda-map.com/socket.io/ → sm_backend (WebSocket)
            ├── panda-map.com/admin/    → sm_admin   (Vue SPA, inner nginx port 80)
            └── panda-map.com/minio/    → sm_minio   (MinIO API, port 9000)

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
本機 git push → GitHub → Actions 觸發 → SSH 進 VM → git pull → docker compose build & up → restart nginx
```

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

> ⚠️ **注意**：`.env.prod` 不會被 git commit，每次重新部署到新機器都要重新設定。

### 3. 取得 SSL 憑證（先暫時用 HTTP）

首次取得憑證前，需要先將 `nginx/nginx.conf` 的 HTTPS 區段暫時改為只有 HTTP，或直接用 standalone 模式：

```bash
# 先停掉佔用 80 port 的服務（如果有）
sudo systemctl stop nginx 2>/dev/null || true

# 取得憑證
sudo certbot certonly --standalone -d panda-map.com

# 確認憑證位置
ls /etc/letsencrypt/live/panda-map.com/
```

### 4. 首次啟動（需讓 TypeORM 建立資料表）

**第一次啟動時**，由於資料庫是空的，需要暫時讓 TypeORM 自動建立資料表：

```bash
# 暫時改成 development 讓 TypeORM synchronize
nano .env.prod
# 把 NODE_ENV=production 改成 NODE_ENV=development
```

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

等待所有服務啟動（約 3～5 分鐘），確認 backend 已 seed 資料：

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

### 5. 確認所有容器運作

```bash
docker compose -f docker-compose.prod.yml ps
```

應看到 6 個容器都是 `Up` 狀態：
- sm_db
- sm_minio
- sm_backend
- sm_client
- sm_admin
- sm_nginx

### 6. 驗證網站

| URL | 預期結果 |
|-----|----------|
| `https://panda-map.com` | 前台首頁 |
| `https://panda-map.com/api/products` | JSON 回應 |
| `https://panda-map.com/admin/` | Admin 登入頁 |
| `https://panda-map.com/minio/images/` | MinIO 回應 |

---

## GitHub Actions 自動部署設定

每次 push 到 `master` 分支，GitHub Actions 會自動 SSH 進 VM 執行部署。

### 1. 在 VM 產生 SSH Key pair

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""

# 將公鑰加入 authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# 查看私鑰（稍後貼到 GitHub Secrets）
cat ~/.ssh/github_actions
```

### 2. 設定 GitHub Secrets

GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret 名稱 | 值 |
|------------|-----|
| `GCP_HOST` | VM 的 External IP（例如 `35.189.168.63`） |
| `GCP_USER` | VM 登入帳號（例如 `asd66151200`） |
| `GCP_SSH_KEY` | 上一步 `cat ~/.ssh/github_actions` 的完整內容（包含 `-----BEGIN...-----END-----`） |

### 3. 設定 VM 的 git remote 使用 SSH

因為 Actions 在 VM 上會執行 `git pull`，需要用 SSH 連 GitHub（不然需要帳密）：

**在 VM 上產生 GitHub Deploy Key：**

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy -N ""

# 設定 SSH config
cat >> ~/.ssh/config << 'EOF'
Host github.com
  IdentityFile ~/.ssh/github_deploy
  StrictHostKeyChecking no
EOF

# 查看公鑰
cat ~/.ssh/github_deploy.pub
```

**到 GitHub 加入 Deploy Key：**

GitHub repo → Settings → Deploy keys → Add deploy key
- Title: `gcp-vm`
- Key: 貼上公鑰內容
- Allow write access: 不需要勾選

**更改 git remote 為 SSH：**

```bash
cd ~/smart-market
git remote set-url origin git@github.com:ailwyn0822/smart-market.git

# 測試
git pull origin master
```

### 4. Deploy Workflow 說明

檔案位置：[.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

```yaml
name: Deploy to GCP

on:
  push:
    branches: [master]    # 只有 push 到 master 才觸發

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 部署到 GCP VM
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.GCP_HOST }}
          username: ${{ secrets.GCP_USER }}
          key: ${{ secrets.GCP_SSH_KEY }}
          command_timeout: 30m       # 建置最多等 30 分鐘
          script: |
            cd ~/smart-market

            # 強制覆蓋本地修改，拉最新程式碼
            git fetch origin master
            git reset --hard origin/master

            # 重新建置並啟動容器（只重建有變更的）
            docker compose -f docker-compose.prod.yml up -d --build

            # 清理舊的 image 節省磁碟空間
            docker image prune -f

            # 重啟 nginx（讓 DNS 重新解析新容器的 IP）
            docker compose -f docker-compose.prod.yml restart nginx

            echo "✅ 部署完成！"
```

> ⚠️ **重要**：`git reset --hard` 會覆蓋 VM 上的本地修改。如果在 VM 上手動改了任何檔案（如 `docker-compose.prod.yml`），push 後會被覆蓋。務必把所有修改 commit 到 git。

---

## 環境變數說明

參考 [.env.prod.example](../.env.prod.example)

### 關鍵變數說明

| 變數 | 說明 | 注意事項 |
|------|------|----------|
| `NODE_ENV` | 執行環境 | 生產環境必須設 `production`，否則 TypeORM 會在每次啟動時同步資料表（有刪除風險） |
| `PORT` | NestJS 後端 port | 設 `8080`；**不要改**，Nuxt 也會讀這個變數，需另外設 `NITRO_PORT=3000` |
| `NITRO_PORT` | Nuxt SSR server port | 必須設 `3000`，防止與後端 `PORT=8080` 衝突 |
| `MINIO_ENDPOINT` | MinIO 服務名稱 | Docker network 內用 `minio`（容器名稱去掉 `sm_` 前綴後的別名），**不是** `sm_minio` |
| `MINIO_PUBLIC_URL` | MinIO 對外 URL | 前端顯示圖片用，設為 `https://panda-map.com/minio` |
| `FRONTEND_URL` | 前台網址 | OAuth 登入後跳轉用 |
| `ECPAY_API_BASE` | 後端對外網址 | ECPay 回呼 URL 用，設為 `https://panda-map.com/api` |
| `CORS_ORIGINS` | 允許的前端網域 | 多個用逗號分隔 |
| `VITE_API_BASE` | Admin 前台 API 網址 | **Build-time 變數**，設在 `docker-compose.prod.yml` 的 `args`，不是 `.env.prod` |

### OAuth 設定

**Google OAuth：**
1. GCP Console → APIs & Services → Credentials → OAuth 2.0 Client
2. Authorized redirect URIs 加入：`https://panda-map.com/api/auth/google/callback`

**LINE Login：**
1. LINE Developers Console → Channel → LINE Login
2. Callback URL 加入：`https://panda-map.com/api/auth/line/callback`

---

## Nginx 設定說明

檔案位置：[nginx/nginx.conf](../nginx/nginx.conf)

| 路徑 | 代理目標 | 說明 |
|------|----------|------|
| `/` | `sm_client:3000` | Nuxt SSR 前台 |
| `/api/` | `sm_backend:8080/` | NestJS API（strip /api prefix） |
| `/socket.io/` | `sm_backend:8080/socket.io/` | WebSocket |
| `/admin/` | `sm_admin:80/` | Vue SPA 後台 |
| `/minio/` | `minio:9000/` | MinIO 圖片存取 |

> ⚠️ MinIO proxy 的 Host header 必須設為 `minio:9000`（不含路徑），否則 MinIO 會回傳錯誤。

---

## SSL 憑證

使用 Let's Encrypt，憑證存放於 VM 的 `/etc/letsencrypt/`，已 mount 進 nginx 容器。

**更新憑證（每 90 天需要更新一次）：**

```bash
# 停掉 nginx 容器（釋放 443 port）
docker compose -f ~/smart-market/docker-compose.prod.yml stop nginx

# 更新憑證
sudo certbot renew

# 重啟 nginx
docker compose -f ~/smart-market/docker-compose.prod.yml start nginx
```

**設定自動更新（建議）：**

```bash
# 新增 cron job，每月 1 號凌晨 3 點自動更新
(crontab -l 2>/dev/null; echo "0 3 1 * * docker compose -f /home/asd66151200/smart-market/docker-compose.prod.yml stop nginx && sudo certbot renew && docker compose -f /home/asd66151200/smart-market/docker-compose.prod.yml start nginx") | crontab -
```

---

## MinIO 管理介面存取

MinIO console（port 9001）只綁定到 VM 的 `127.0.0.1`，需要 SSH tunnel 才能存取。

### 建立 SSH Tunnel

**方法一：先設定本機 SSH Key（一次性設定）**

```bash
# 本機產生 key
ssh-keygen -t ed25519 -f ~/.ssh/gcp_key

# 查看公鑰
cat ~/.ssh/gcp_key.pub
```

在 VM 的瀏覽器 SSH 執行：
```bash
echo "貼上公鑰內容" >> ~/.ssh/authorized_keys
```

之後本機就可以建立 tunnel：
```bash
ssh -i ~/.ssh/gcp_key -L 19001:127.0.0.1:9001 asd66151200@35.189.168.63 -N
```

**方法二：使用 gcloud（需安裝 gcloud SDK）**

```bash
gcloud compute ssh asd66151200@smart-market-vm --zone=asia-east1-b -- -L 19001:127.0.0.1:9001 -N
```

### 登入 MinIO Console

tunnel 建立後（終端機會卡住，這是正常的），瀏覽器開：

```
http://localhost:19001
```

帳號：`MINIO_ROOT_USER` 的值（預設 `admin`）
密碼：`MINIO_ROOT_PASSWORD` 的值

---

## 常見問題排除

### 502 Bad Gateway

通常是 nginx 的 DNS 快取失效（容器重建後 IP 改變）。

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml restart nginx
```

### Backend 起不來

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml logs backend --tail=50
```

常見原因：
- 資料庫連線失敗 → 確認 `DB_HOST=sm_db`、密碼正確
- MinIO 連線失敗 → 確認 `MINIO_ENDPOINT=minio`（不是 `sm_minio`）
- Port 衝突 → 確認 `NITRO_PORT=3000` 有設定

### 資料表不存在（42P01 error）

只有在**全新資料庫**初次啟動時會發生。解法：

```bash
nano ~/smart-market/.env.prod
# 改 NODE_ENV=development

docker compose -f docker-compose.prod.yml restart backend
# 等 backend 完全啟動並 seed 資料

nano ~/smart-market/.env.prod
# 改回 NODE_ENV=production

docker compose -f docker-compose.prod.yml restart backend
```

### MinIO S3Error: Invalid Request

確認 `backend/src/storage/storage.service.ts` 中有：
1. `pathStyle: true` 在 MinIO client 設定
2. `regionMap` 預先填入（繞過 SDK 的 region 探索請求）

### GitHub Actions 部署超時

預設 `command_timeout: 30m`。如果仍然超時，可能是 VM 記憶體不足。確認 swap 有設定：

```bash
free -h
# 應看到 Swap: 2.0G
```

### OAuth 登入後跳轉到 localhost

確認 VM 的 `.env.prod` 有設定：
```
FRONTEND_URL=https://panda-map.com
```

### Admin 後台打 API 到 localhost

這是 build-time 問題。確認 `docker-compose.prod.yml` 的 admin args：
```yaml
args:
  VITE_API_BASE: https://panda-map.com/api
```

---

## 日常維護指令

### 查看所有容器狀態

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml ps
```

### 查看特定容器 log

```bash
docker compose -f ~/smart-market/docker-compose.prod.yml logs <service> --tail=50

# service 可以是: backend, client, admin, nginx, minio, postgres
```

### 手動觸發重新部署

```bash
cd ~/smart-market
git pull origin master
docker compose -f docker-compose.prod.yml up -d --build
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
# 清理未使用的 image
docker image prune -f

# 清理全部未使用資源（謹慎使用）
docker system prune -f
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
| `docker-compose.prod.yml` | 生產環境容器設定 |
| `.env.prod` | 生產環境變數（**不進 git**） |
| `.env.prod.example` | 環境變數範本（進 git） |
| `nginx/nginx.conf` | Nginx 反向代理設定 |
| `Dockerfile.backend` | NestJS 建置 |
| `Dockerfile.client` | Nuxt SSR 建置 |
| `Dockerfile.admin` | Vue SPA 建置 |
| `nginx-admin.conf` | Admin SPA 的 inner nginx 設定 |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD |

---

*最後更新：2026-02-25*
