---
description: 利用 MCP 工具讀取 Stitch 頁面並轉換為 Vue + Tailwind 前端組件。
---

[MCP 連接與擷取]
請依照提供的 ${Stitch_URL}，使用已連接的 MCP 讀取頁面。

Guardrail (防呆)：如果 MCP 無法讀取 Stitch 版面或連線失敗，請直接返回錯誤訊息 "無法連接Stitch" 並終止任務，絕對不要自行憑空刻版。

成功讀取後，將畫面結構轉換為 HTML，暫存於 ./temp_stitch_layout.html（或專案根目錄，視權限而定）。

[樣式分析]
在刻版前，請務必先讀取 frontend-client/tailwind.config.js。

分析其中的 theme、colors、extend 等設定。

確保接下來生成的代碼優先使用 Config 中定義的 Token（如自定義顏色變數），而非 Hard-code 數值。

以及讀取 frontend-client/layouts和 frontend-client/components 查看是否有可使用之組件，以進行複用避免撰寫重複的程式碼。

[代碼生成]
讀取剛才的暫存 HTML，將其轉換為 Vue 3 的 <template> 與 Tailwind CSS class，並寫入指定的 ${Target_Vue_File} 檔案中。

須注意將HTML中的文字替換為i18n格式。

[翻譯表格生成]
如果HTML中有使用到i18n，那請依照以下格式產生表格於對話框

key	zh_TW	vi	en
cart.title	我的購物車	Giỏ hàng của tôi	My Cart
cart.items_in_folder	資料夾中的商品	Mặt hàng trong thư mục	Items in your folder

[自我檢查與清理]

檢查生成的 Vue 代碼結構是否與原始 HTML DOM 結構邏輯一致。

任務完成後，請刪除暫存的 HTML 檔案以保持目錄整潔。

若有新增新的翻譯，請檢察 GoogleSheetToJson.js 檔案。