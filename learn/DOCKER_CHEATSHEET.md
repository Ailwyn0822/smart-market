# Docker 常用指令速查表 (給前端看的白話版)

如果你連這幾個字都記不住，拜託把這張表印出來貼在螢幕旁邊，不要再問一些會被面試官趕出去的蠢問題。

## 📦 1. 映像檔 (Image) 相關：控制「冷凍蛋糕（類別）」

- `docker images`
  - **白話文：** 查看我電腦裡面目前下載/編譯了哪些 Image。
  - **使用時機：** 檢查你剛剛 `build` 好的前端包到底存不存在。
- `docker build -t <你的名字:版本標籤> .`
  - **白話文：** 照著當前目錄 (`.`) 下的 `Dockerfile` 食譜，煮出一個名為 `<你的名字>` 的 Image。
  - **範例：** `docker build -t my-vue-app:v1.0 .`
- `docker rmi <Image_ID 或 名字>`
  - **白話文：** 刪除 (Remove Image) 這個沒用的食譜/蛋糕盤。
  - **使用時機：** 你的硬碟快爆炸的時候，用來清垃圾。
- `docker pull <Image_名字>` / `docker push <Image_名字>`
  - **白話文：** 從雲端倉庫（例如 Docker Hub 或 GHCR）把 Image **拉下來** / **推上去**。
  - **使用時機：** 部署時最常用的指令。

---

## 🏃 2. 容器 (Container) 相關：控制「微波好的熱蛋糕（實體）」

- `docker ps`
  - **白話文：** 查看**正在運行中 (活著的)** 的 Container。就像打開工作管理員。
  - _進階：`docker ps -a` (All) 會連那些死掉的、停下來的 Container 一起秀給你聽。_
- `docker run -d -p <本機Port>:<容器Port> <Image_名字>`
  - **白話文：** 拿一個 Image，把它啟動變成 Container（跑起來）。
  - **參數解讀：**
    - `-d` (Detach)：在背景跑，不要卡住我的終端機。
    - `-p 8080:80` (Port)：把「你電腦的 8080 port」接到「容器裡面 Nginx 的 80 port」。這樣你打開瀏覽器輸入 `localhost:8080` 才看得到畫面。
  - **範例：** `docker run -d -p 8080:80 my-vue-app:v1.0`
- `docker stop <Container_ID 或 名字>`
  - **白話文：** 把正在跑的 Container 溫柔地停下來。
- `docker rm -f <Container_ID 或 名字>`
  - **白話文：** （Remove）強制刪除這個 Container 屍體。`-f` (Force) 代表就算它還活著也直接宰掉。
  - **注意：** Container 被刪除後，裡面所有**沒有另外備份的檔案跟資料都會灰飛煙滅**（對前端靜態檔來說沒差，但資料庫就慘了）。
- `docker logs -f <Container_ID 或 名字>`
  - **白話文：** 倒出這個 Container 裡面的 Log（錯誤訊息、連線紀錄）。
  - **參數解讀：** `-f` (Follow) 代表持續監看，Log 吐一行你就看一行，不出包絕對不用。
- `docker exec -it <Container_ID 或 名字> sh` (或是 `bash`)
  - **白話文：** 破門而入！直接 SSH 進入這個正在跑的 Container 裡面，打開它的終端機 (`sh` 或 `bash`)。
  - **使用時機：** 你的前端破圖了，你想進去看你的 Nginx 設定檔到底有沒有寫錯，或是編譯出來的 `dist` 有沒有少東西。

---

## 🐙 3. Docker Compose 相關：一鍵大絕包

現實世界中，一個專案不會只有一個前端 Container，通常還會配一個後端 (Node/Python) 跟一個資料庫 (MySQL/Redis)。手動一個一個下 `docker run` 會按到手抽筋，所以需要 `docker-compose.yml` 來當總指揮。

- `docker compose up -d`
  - **白話文：** 照著當前目錄下的 `docker-compose.yml`，把所有設定好的後端、前端、資料庫通通一口氣啟動，放在背景跑 (`-d`)。這也是你筆記裡面那句「SSH 進 VM 之後做的事」。
- `docker compose down`
  - **白話文：** 把 `docker compose up` 叫出來的所有 Container 通通關掉並刪除屍體。打完收工。
- `docker compose -f <檔案名稱> up -d`
  - **白話文：** 指定一個特定的設定檔來啟動服務。
  - **使用時機：** 當你有測試機 (`docker-compose.yml`) 跟正式機 (`docker-compose.prod.yml`) 不同設定檔的時候。
  - **範例：** `docker compose -f docker-compose.prod.yml up -d`
- `docker compose logs -f <服務名稱>`
  - **白話文：** 專門看其中一個服務（例如 `frontend` 或 `backend`）的連續 Log。
