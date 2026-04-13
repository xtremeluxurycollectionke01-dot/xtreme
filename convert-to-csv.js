const fs = require("fs");

// Import your JSON file
const data = require("./clean-json.js");

// If your file exports arrays inside arrays, flatten it
const flatData = data.flat();

// CLEANING FUNCTION
/*function cleanText(text = "") {
  return text
    .toString()
    .replace(/[\[\]\(\)\{\}<>]/g, "") // remove brackets and angle brackets
    .replace(/\s+/g, " ")            // normalize spaces
    .replace(/,/g, "")               // remove commas (CSV safe)
    .trim();
}*/

function cleanText(text = "") {
  if (text === null || text === undefined) return "";

  return String(text)
    .replace(/[\[\]\(\)\{\}<>]/g, "")
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .trim();
}

// CSV HEADER
let csv = "Item,Specification,Price\n";

// BUILD ROWS
flatData.forEach((row) => {
  const item = cleanText(row.item);
  const spec = cleanText(row.specification);
  const price = Number(row.price || 0).toFixed(2);

  csv += `"${item}","${spec}","${price}"\n`;
});

// WRITE FILE
fs.writeFileSync("clean-products.csv", csv, "utf8");

console.log("✅ CSV created successfully: clean-products.csv");