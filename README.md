# IT23413474 Playwright Test Automation Project

#### Sometimes the system (https://www.swifttranslator.com/) does not function properly, which results in inconsistent actual outputs during test execution.

## 1. Introduction
This project is an automated test suite for the Swift Translator web application. 
It uses Playwright to open the website in a browser and reads test cases from an Excel file.

Each row in the Excel file represents one test case. The Playwright test file 
(`tests/excelDataDriven.spec.js`) reads the data and runs the tests automatically.

## 2. Prerequisites
- Node.js installed (version 14 or higher)
- Internet connection (to access the Swift Translator website)

## 3. How to Set Up the Project
1. Open a terminal and go to the project folder:
   ```bash
   cd IT23413474
   ```

2. Install the required Node.js packages:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## 4. Excel Test Data
1. Aulreay creaded an Excel file named `testCases.xlsx`.
2. Check it in the folder:
   ```
   testData/testCases.xlsx
   ```
3. Useing the following column names in the first row:
   - `TC ID`
   - `Test case name`
   - `URL`
   - `Input`
   - `Expected output`

Example row:
```text
TC ID: POS_FUN_001
Test case name: Valid Singlish Input
URL: https://www.swifttranslator.com/
Input: kohomada
Expected output: කොහොමද
```

The test script will read these values and use them to run the tests.

## 5. How to Run the Tests

Run all tests (default headless mode):
```bash
npm test
```

Run tests with the browser visible (headed mode):
```bash
npm run head
```

Open the Playwright UI test runner:
```bash
npm run ui
```

Run tests in debug mode:
```bash
npm run test:debug
```

After a test run, open the HTML report:
```bash
npm run report
```

## 6. Project Structure (Summary)
```text
IT23413474/
├── tests/
│   └── excelDataDriven.spec.js   (main automated test file)
├── testData/
│   └── testCases.xlsx            (Excel test data file)
├── playwright.config.ts
├── package.json
└── README.md
```

## 7. Student Information
- Student ID: IT23413474
- Student Name: RATHNAYAKE W P D D W

