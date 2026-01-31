// tests/excelDataDriven.spec.js
const { test, expect } = require('@playwright/test');
const XLSX = require('xlsx');
const path = require('path');

// === 1. Load Excel file ===
const excelPath = path.join(__dirname, '../testData/testCases.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// === 2. Convert Excel to JSON ===
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// Auto-detect header row
const headerRowIndex = rows.findIndex(r =>
  Array.isArray(r) && r.some(c => typeof c === 'string' && c.toString().toLowerCase().includes('tc'))
);
if (headerRowIndex === -1) {
  throw new Error('❌ Header row with "TC ID" not found in Excel sheet.');
}

// Parse test cases
const testCases = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex, defval: '' });
const filteredTestCases = testCases.filter(tc => tc['TC ID'] || tc['Test Case ID']);

// === 3. Define Playwright tests ===
test.describe('Data-Driven Test Suite from Excel', () => {
  for (const tc of filteredTestCases) {
    const id = tc['TC ID'] || tc['Test Case ID'] || 'Unknown ID';
    const name = tc['Test case name'] || tc['Test Name'] || 'Unnamed Test';
    const url = tc['URL'] || tc['Url'] || tc['Website'] || 'https://www.swifttranslator.com/';
    const inputValue = tc['Input'] ? String(tc['Input']) : '';
    const expectedOutput = tc['Expected output'] ? String(tc['Expected output']).trim() : '';

    const isPositive = id.toLowerCase().startsWith('pos_fun');
    const isNegative = id.toLowerCase().startsWith('neg_fun');
    const isUI = id.toLowerCase().includes('ui') || name.toLowerCase().includes('ui');

    test(`${id} - ${name}`, async ({ page }) => {
      // 1 Open website
      await page.goto(url);

      // 2 Locate input and output
      const singlishInput = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
      const sinhalaOutput = page.locator('text=Sinhala').locator('xpath=following-sibling::*').first();

      // 3 Fill input
      await singlishInput.fill(inputValue);
      await singlishInput.press('Tab').catch(() => {});
      await singlishInput.evaluate(el => el.dispatchEvent(new Event('input'))).catch(() => {});

      // 4 Wait for output area to update
      await page.waitForTimeout(2000); // Wait for translation to process
      const actualOutput = (await sinhalaOutput.textContent() || '').trim();

      // 5 UI checks
      if (isUI) {
        await expect(singlishInput).toBeVisible();
        const btnCount = await page.locator('button').count();
        expect(btnCount).toBeGreaterThan(0);
        await expect(sinhalaOutput).toBeVisible();
      }

      // 6 Validate output based on test type
      console.log(`📝 Test: ${id}`);
      console.log(`   Input: "${inputValue}"`);
      console.log(`   Expected: "${expectedOutput}"`);
      console.log(`   Actual: "${actualOutput}"`);

      if (isPositive) {
        // Positive tests: output should match expected
        if (expectedOutput) {
          expect(actualOutput).toBe(expectedOutput);
          console.log(`✅ PASS: Output matches expected`);
        } else {
          expect(actualOutput).not.toBe('');
          console.log(`✅ PASS: Output generated successfully`);
        }
      } else if (isNegative) {
        // Negative tests: output should be empty, error, or not match expected
        if (expectedOutput) {
          expect(actualOutput).not.toBe(expectedOutput);
          console.log(`✅ PASS: Correctly failed - output doesn't match expected`);
        } else {
          expect(actualOutput).toBe('');
          console.log(`✅ PASS: Correctly returns empty output`);
        }
      } else {
        // Default validation
        if (expectedOutput) {
          expect(actualOutput).toBe(expectedOutput);
        } else {
          expect(actualOutput).not.toBe('');
        }
        console.log(`✅ PASS: Test completed`);
      }
    });
  }
});
