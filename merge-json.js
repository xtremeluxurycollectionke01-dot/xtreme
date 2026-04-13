const fs = require("fs");

// READ RAW FILE AS TEXT
const raw = fs.readFileSync("./json.js", "utf8");

// EXTRACT ALL OBJECTS INSIDE []
const matches = [...raw.matchAll(/\{[\s\S]*?\}/g)];

const cleaned = matches.map(m => {
  try {
    return eval("(" + m[0] + ")");
  } catch (e) {
    return null;
  }
}).filter(Boolean);

// EXPORT CLEAN FILE
fs.writeFileSync(
  "clean-json.js",
  "module.exports = " + JSON.stringify(cleaned, null, 2),
  "utf8"
);

console.log("✅ Clean JSON created: clean-json.js");