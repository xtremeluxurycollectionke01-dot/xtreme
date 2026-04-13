const fs = require("fs");
const XLSX = require("xlsx");

// Read CSV file
const csv = fs.readFileSync("clean-products.csv", "utf8");

// Convert CSV to worksheet
const workbook = XLSX.read(csv, { type: "string" });

// Get first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Create new workbook (clean)
const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, sheet, "Products");

// Write Excel file
XLSX.writeFile(newWorkbook, "products.xlsx");

console.log("✅ Excel file created: products.xlsx");