## 終端機指令
- `mkdir`：建立資料夾。
- `git init`：把這裡變成 Git 倉庫 (裝上時光機)。
- `notepad`：打開記事本。(假設沒有記事本，會詢問是否自動建立一個)

## Docker 相關
- **問題**：為什麼這個專案沒有 Dockerfile？
- **理解**：因為我們是用現成的 Image (Postgres, MinIO)，像是買現成的家具，不需要自己畫設計圖 (Dockerfile)。

- **檔案解釋**
  - docker-compose.yml：
  - Dockerfile：

- **名詞解釋**：
  - Image：像是家具設計圖。
  - Container：像是家具。

- **指令筆記**：
  - `docker-compose up -d`：在背景啟動服務 (up = 啟動, -d = 是 Detached (分離模式)，意思是「在背景執行」，不要卡住我的畫面)。
  - `docker ps`：Process Status (行程狀態)。查看現在有哪些容器活著 (像是工作管理員)。
  - `docker-compose down`：關閉所有服務。