import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const fs = require("fs-extra");
const unflatten = require("flat").unflatten;
const { extractSheets } = require("spreadsheet-to-json");

// ── 設定區（需要改的只有這裡）────────────────────────────────
const SPREADSHEET_KEY = "1WoTNVP1HIADTQbczdolRqgykGvHnCANOwuL2Kl637Q8";
const OUTPUT_DIR = path.resolve(__dirname, "./i18n/language");
const credentials = require("./google/smart-market-485510-a9b47ada97ac.json");
// ─────────────────────────────────────────────────────────────

// 將 callback 包成 Promise，方便 async/await 使用
function extractSheetsAsync(options) {
    return new Promise((resolve, reject) => {
        extractSheets(options, (err, data) => (err ? reject(err) : resolve(data)));
    });
}

async function main() {
    console.log("📡 從 Google Sheets 抓取資料...");
    const data = await extractSheetsAsync({ spreadsheetKey: SPREADSHEET_KEY, credentials });

    // 合併所有工作表（新增工作表不需改程式碼）
    const read = Object.values(data).flat();
    if (read.length === 0) {
        console.warn("⚠️  工作表為空，未產生任何檔案。");
        return;
    }

    // 從第一筆資料取得語系欄位名稱（排除 "key" 欄）
    const locales = Object.keys(read[0]).filter((k) => k !== "key");
    const result = Object.fromEntries(locales.map((l) => [l, {}]));

    // 填入每個語系的翻譯值
    for (const row of read) {
        for (const locale of locales) {
            result[locale][row["key"]] = row[locale] ?? "";
        }
    }

    // 確保輸出目錄存在（只需一次）
    fs.ensureDirSync(OUTPUT_DIR);

    // 寫出各語系 JSON
    for (const locale of locales) {
        const outputPath = path.resolve(OUTPUT_DIR, `${locale}.json`);
        fs.writeJSONSync(outputPath, unflatten(result[locale], { object: true }), { spaces: 2 });
    }

    const keyCount = Object.keys(result[locales[0]] ?? {}).length;
    console.log(`✅ 完成！產出 ${locales.length} 個語系（${locales.join(", ")}），共 ${keyCount} 個 key。`);

    // ── 缺失 key 偵測 ────────────────────────────────────────────
    const allKeys = Object.keys(result[locales[0]] ?? {});
    const missing = [];
    for (const key of allKeys) {
        for (const locale of locales) {
            if (!result[locale][key]) {
                missing.push({ key, locale });
            }
        }
    }
    if (missing.length > 0) {
        console.warn(`\n⚠️  發現 ${missing.length} 個空值 key（請至 Google Sheets 補上翻譯）：`);
        const grouped = {};
        for (const { key, locale } of missing) {
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(locale);
        }
        for (const [key, localeList] of Object.entries(grouped)) {
            console.warn(`   ${key}  →  缺：${localeList.join(", ")}`);
        }
        console.warn("");
    }
    // ─────────────────────────────────────────────────────────────
}

main().catch((err) => {
    console.error("❌ 執行失敗：", err.message);
    process.exit(1);
});
