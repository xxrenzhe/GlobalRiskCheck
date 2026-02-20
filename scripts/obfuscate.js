const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

const sourcePath = path.join(__dirname, "..", "public", "scan-core.js");
const targetPath = path.join(__dirname, "..", "public", "scan-core.obf.js");

if (!fs.existsSync(sourcePath)) {
  console.error("scan-core.js not found");
  process.exit(1);
}

const sourceCode = fs.readFileSync(sourcePath, "utf8");
const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  disableConsoleOutput: true,
  stringArray: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.75,
  rotateStringArray: true
});

fs.writeFileSync(targetPath, obfuscated.getObfuscatedCode(), "utf8");
console.log(`Obfuscated: ${path.relative(process.cwd(), targetPath)}`);
