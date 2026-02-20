import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const fs = require("fs-extra");
const unflatten = require("flat").unflatten;
const { extractSheets } = require("spreadsheet-to-json");

const credentials = require("./google/smart-market-485510-a9b47ada97ac.json");
extractSheets(
    {
        spreadsheetKey: "1WoTNVP1HIADTQbczdolRqgykGvHnCANOwuL2Kl637Q8",
        credentials: credentials,
        sheetsToExtract: ['index', 'login', 'upload', 'products', 'cart'],
    },
    (err, data) => {
        if (err) throw err;
        const read = [...data['index'], ...data['login'], ...data['upload'], ...data['products'], ...data['cart']];
        const result = {};
        const files = [];

        for (const key in read[0]) {
            if (key !== "key") {
                files.push(key);
                result[key] = {};
            }
        }
        read.forEach((el) => {
            for (const file of files) {
                result[file][el["key"]] = el[file] ? el[file] : "";
            }
        });
        for (const fileName of files) {
            fs.ensureDirSync(
                path.dirname(
                    path.resolve(__dirname, "./i18n/language", `${fileName}.json`)
                )
            );
            fs.writeJSONSync(
                path.resolve(__dirname, "./i18n/language", `${fileName}.json`),
                unflatten(result[fileName], { object: true }),
                { spaces: 2 }
            );
        }
    }
);
