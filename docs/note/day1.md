# 🛠️ 開發環境與第三方登入設置筆記

## 1. 終端機與 Git 指令
這些是基礎的版控與檔案操作指令。

- `mkdir [資料夾名稱]`：建立新的資料夾。
- `git init`：初始化 Git 倉庫 (把這裡變成 Git 倉庫，裝上時光機)。
- `notepad [檔名]`：打開記事本。(若檔案不存在，系統通常會詢問是否自動建立一個)。
- `git add .`：把目前目錄下 **所有** 變更的檔案加入暫存區 (Staging Area)。
- `git commit -m "你的備註"`：提交變更。把暫存區的檔案正式存入版本控制 (在此刻拍一張快照)。
- `git remote add origin [GitHub網址]`：將本地的 Git 倉庫與遠端 GitHub 倉庫連結。
- `git push -u origin master`：將本地的 commit 推送到 GitHub (第一次推送時加上 `-u` 以後可以直接打 `git push`)。

---

## 2. Docker 相關
容器化技術，讓開發環境統一，不會發生「在我電腦可以，在你電腦不行」的慘劇。

### 📄 檔案解釋
- **`docker-compose.yml`**：
  - **角色**：「劇本」或「指揮樂譜」。
  - **用途**：定義**多個**容器 (Container) 如何協同運作。例如：同時啟動「網站伺服器」和「資料庫」，並設定它們之間的網路連線與環境變數。
- **`Dockerfile`**：
  - **角色**：「料理食譜」或「說明書」。
  - **用途**：定義**單一個**映像檔 (Image) 該如何被建立。裡面寫著要用什麼作業系統 (OS)、安裝什麼軟體、複製什麼程式碼進去。

### 🧩 名詞解釋
- **Image (映像檔)**：
  - **概念**：「遊戲卡帶」或「系統光碟」。
  - **特質**：唯讀的、靜態的。它是打包好的應用程式環境，本身不會動。
- **Container (容器)**：
  - **概念**：「正在執行的遊戲」或「活著的系統」。
  - **特質**：是 Image 跑起來後的實體。你可以啟動、停止、刪除它，它是暫時性的。
- **Volume (掛載卷)**：
  - **概念**：「外接硬碟」或「遊戲存檔卡」。
  - **特質**：用來保存數據。因為 Container 刪除後裡面的資料會消失，所以要透過 Volume 把資料（如資料庫數據、程式碼）存放在 Container 外面（宿主機上），確保資料持久化。

### ⚡ 指令筆記
- `docker-compose up -d`：
  - **解釋**：依照 `docker-compose.yml` 的劇本啟動所有服務。
  - **參數**：`-d` (Detached) 代表「分離模式」，意思是**在背景執行**，不要卡住我的畫面。
- `docker ps`：
  - **解釋**：Process Status (行程狀態)。查看現在有哪些容器活著 (像是工作管理員)。
- `docker-compose down`：
  - **解釋**：關閉並移除所有由 Compose 啟動的服務。

---

## 3. Google OAuth 2.0 設置
這是為了讓使用者能用「Google 登入」。

### 步驟 1：前往 Google Cloud Console
- **網址**：[https://console.cloud.google.com/](https://console.cloud.google.com/)

### 步驟 2：建立新專案 (Project)
1. 左上角點選專案選單 -> **New Project** (建立專案)。
2. **Project Name**: `Smart Market`。
3. 點擊 **Create**。

### 步驟 3：設定 OAuth Consent Screen (同意畫面)
1. 左側選單找 **APIs & Services** (API 和服務) -> **OAuth consent screen** (OAuth 同意畫面)。
2. **User Type** 選 `External` (外部) -> **Create**。
3. **App name**: `Smart Market`。
4. **User support email**: 選你的信箱。
5. **Developer contact information**: 填你的信箱。
6. 按 **Save and Continue** (後面 Scope 和 Test Users 可以先一路按 Next 跳過，最後 Back to Dashboard)。

### 步驟 4：建立憑證 (Credentials)
1. 左側選單點 **Credentials** (憑證)。
2. 上方點 **+ CREATE CREDENTIALS** -> **OAuth client ID**。
3. **Application type**: 選 `Web application`。
4. **Name**: `Smart Market Web`。
5. **Authorized JavaScript origins** (已授權的 JavaScript 來源)：(這是前端網址)
   - 加入：`http://localhost:3000` (Nuxt 前端)。
   - 加入：`http://localhost:8080` (NestJS 後端，以防萬一先加)。
6. **Authorized redirect URIs** (已授權的重新導向 URI)：(這是 Google 登入後要跳轉回來的後端 API 網址)
   - 加入：`http://localhost:8080/auth/google/callback`
   - *(註：這是 Passport.js 的標準寫法)*。
7. 點擊 **CREATE**。

### 步驟 5：取得鑰匙 🔑
- 畫面會跳出 **Your Client ID** 和 **Your Client Secret**。
- **請立刻複製下來，存到記事本裡！** (Client Secret 只會顯示這一次，弄丟要重置)。

---

## 4. 建立 LINE Login
這是為了讓使用者能用「LINE 登入」。

### 步驟 1：前往 LINE Developers Console
- **網址**：[https://developers.line.biz/console/](https://developers.line.biz/console/)
- 用你的 LINE 帳號登入。

### 步驟 2：建立 Provider
- 如果是第一次用，點 **Create a new provider**。
- **Provider name**: `Smart Market Dev`。

### 步驟 3：建立 Channel
1. 點選剛剛建的 Provider，然後點 **Create a new channel**。
2. 選擇 **LINE Login** (⚠️ 不要選錯選成 Messaging API 喔)。
3. **Region**: `Taiwan`。
4. **Channel name**: `Smart Market`。
5. **Channel description**: `C2C E-commerce Platform`。
6. **App types**: 勾選 `Web app`。
7. **Email**: 填你的信箱。
8. 勾選同意條款 -> **Create**。

### 步驟 4：取得鑰匙 🔑
- 在 **Basic settings** 分頁，你會看到 **Channel ID** 和 **Channel Secret**。
- 複製下來！

### 步驟 5：設定 Callback URL (關鍵！)
1. 切換到 **LINE Login** 分頁。
2. 找到 **Callback URL**，點 **Edit**。
3. 輸入：`http://localhost:8080/auth/line/callback`
   - *(註：跟 Google 一樣，這是後端 API 要接球的網址)*。

### 步驟 6：公開狀態 (Optional)
- 目前上方的狀態是 **Developing** (未公開)。這代表只有你這個開發者帳號能登入。
- 開發階段這樣就夠了，如果要讓朋友測試，再去「Roles」把朋友加進來，或是之後改成 **Published**。