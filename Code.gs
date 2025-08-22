// Google Apps Script to translate content in specific ranges and update target sheets

function translateAndFillSheets() {
  // Define source and target ranges
  const sourceSheetName = "한국어";
  const targetSheets = [
    { name: "영어", language: "en" },
    { name: "중국어", language: "zh-CN" },
    { name: "베트남", language: "vi" },
    { name: "러시아", language: "ru" }
  ];

  const b1f2Range = "B1:F2";
  const a4g24Range = "A4:G24";

  // Get the active spreadsheet and source sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(sourceSheetName);

  if (!sourceSheet) {
    throw new Error(`Source sheet '${sourceSheetName}' not found.`);
  }

  // Get the content and formatting to translate
  const b1f2Values = sourceSheet.getRange(b1f2Range).getValues();
  const b1f2Formats = sourceSheet.getRange(b1f2Range).getFontStyles();
  const b1f2Sizes = sourceSheet.getRange(b1f2Range).getFontSizes();

  const a4g24Values = sourceSheet.getRange(a4g24Range).getValues();
  const a4g24Formats = sourceSheet.getRange(a4g24Range).getFontStyles();
  const a4g24Sizes = sourceSheet.getRange(a4g24Range).getFontSizes();

  // Translate and fill for each target sheet
  targetSheets.forEach(({ name, language }) => {
    const targetSheet = ss.getSheetByName(name);

    if (!targetSheet) {
      throw new Error(`Target sheet '${name}' not found.`);
    }

    // Translate the content
    const translatedB1F2 = b1f2Values.map(row => row.map(cell => translateText(cell, language)));
    const translatedA4G24 = a4g24Values.map(row => row.map(cell => translateText(cell, language)));

    // Write the translated content to the target sheet
    const b1f2RangeTarget = targetSheet.getRange(b1f2Range);
    b1f2RangeTarget.setValues(translatedB1F2);
    b1f2RangeTarget.setFontStyles(b1f2Formats);
    b1f2RangeTarget.setFontSizes(b1f2Sizes);

    const a4g24RangeTarget = targetSheet.getRange(a4g24Range);
    a4g24RangeTarget.setValues(translatedA4G24);
    a4g24RangeTarget.setFontStyles(a4g24Formats);
    a4g24RangeTarget.setFontSizes(a4g24Sizes);

    // Adjust text wrapping and row height for A4:G24
    a4g24RangeTarget.setWrap(true);
    adjustRowHeightsManually(targetSheet, a4g24Range);
  });
}

/**
 * Adjusts row heights manually to fit content for a specified range.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet containing the range.
 * @param {string} range - The range to adjust.
 */
function adjustRowHeightsManually(sheet, range) {
  const rangeObj = sheet.getRange(range);
  const values = rangeObj.getValues();
  const numRows = rangeObj.getNumRows();
  const numCols = rangeObj.getNumColumns();
  const defaultHeight = 21; // Default row height

  for (let row = 0; row < numRows; row++) {
    let maxLength = 0;

    for (let col = 0; col < numCols; col++) {
      const cellValue = values[row][col];
      if (cellValue) {
        maxLength = Math.max(maxLength, cellValue.length);
      }
    }

    // Estimate the row height based on the length of the longest cell content
    const estimatedHeight = Math.ceil(maxLength / 10) * defaultHeight;
    sheet.setRowHeight(rangeObj.getRow() + row, Math.max(estimatedHeight, defaultHeight));
  }
}

/**
 * Translates text using Google Translate.
 * @param {string} text - The text to translate.
 * @param {string} targetLanguage - The target language code.
 * @returns {string} - The translated text.
 */
function translateText(text, targetLanguage) {
  if (!text) return ""; // Return empty for empty cells
  return LanguageApp.translate(text, "ko", targetLanguage);
}
