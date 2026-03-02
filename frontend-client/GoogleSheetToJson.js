import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { unflatten } from "flat";
import credentials from "./google/smart-market-485510-49b9dbb94ff8.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── 設定區（需要改的只有這裡）────────────────────────────────
const SPREADSHEET_KEY = "1WoTNVP1HIADTQbczdolRqgykGvHnCANOwuL2Kl637Q8";
const OUTPUT_DIR = path.resolve(__dirname, "./i18n/language");
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("📡 從 Google Sheets 抓取資料...");

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_KEY, auth);
  await doc.loadInfo();

  // 合併所有工作表（新增工作表不需改程式碼）
  const allRows = await Promise.all(doc.sheetsByIndex.map((s) => s.getRows()));
  const read = allRows.flatMap((rows) => rows.map((r) => r.toObject()));

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

  // 確保輸出目錄存在
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
  const grouped = allKeys.reduce((acc, key) => {
    const missing = locales.filter((l) => !result[l][key]);
    if (missing.length) acc[key] = missing;
    return acc;
  }, {});

  const missingCount = Object.values(grouped).reduce((n, arr) => n + arr.length, 0);
  if (missingCount > 0) {
    console.warn(`\n⚠️  發現 ${missingCount} 個空值 key（請至 Google Sheets 補上翻譯）：`);
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
