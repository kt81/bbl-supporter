import * as fs from "fs";
import {sheets_v4 as SheetsApi} from "googleapis";
import Pattern from "../models/pattern";
import * as reader from "../services/google-spreadsheet-reader";

// セルフ
const DOCUMENT_ID = "1bCn4FSLuJrksP6fXO91vX0YglfdUxwrswBU5dlO8seo";
const OUT_FILE = "models/pattern-master.ts";

/**
 * シートを呼んでドバーっとなんかとってきてずごーっとファイルに流すやつ
 */
async function main() {
  global.console.log("Loading SDK and authenticating to Google Drive...");
  const sheets = await reader.getSheetsObj();

  global.console.log("Reading data...");
  const res = await loadSheet(sheets);

  global.console.log("Writing data...");
  const template = `
import {GrowthTable} from "~/models/pattern";

export default ${JSON.stringify(res, null, 2)} as GrowthTable;
`;
  fs.writeFileSync(OUT_FILE, template, "utf8");
}

async function loadSheet(sheets: SheetsApi.Sheets) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: DOCUMENT_ID,
    range: "成長パターン!B3:J18",
  });
  const matrix = res.data.values;
  if (matrix == null) {
    global.console.warn("Empty sheet.");
    return;
  }
  return Pattern.createFromMatrix(matrix);
}

main()
  .then(() => {
    global.console.log("Process done.");
  })
  .catch((reason) => {
    global.console.error(reason);
  });
