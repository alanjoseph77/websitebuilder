const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('c:/Users/NITK 1/Downloads/claude/site-builder/src/utils/codeGenerator.js');
let content = fs.readFileSync(targetFile, 'utf8');

// Fix the inline style for LuNavbar mobile menu
content = content.replace('flexDirection: column', 'flex-direction: column');

// Extract the Lumora CSS block
const startMarker = '/* ── Lumora Skincare Templates ────────────────────────────────────────────── */';
const endMarker = 'const BASE_JS';
const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  let lumoraCode = content.substring(startIdx, endIdx);
  
  // Replace camelCase to kebab-case
  lumoraCode = lumoraCode.replace(/fontSize:/g, 'font-size:');
  lumoraCode = lumoraCode.replace(/fontWeight:/g, 'font-weight:');
  lumoraCode = lumoraCode.replace(/lineHeight:/g, 'line-height:');
  lumoraCode = lumoraCode.replace(/marginBottom:/g, 'margin-bottom:');
  lumoraCode = lumoraCode.replace(/borderRadius:/g, 'border-radius:');
  lumoraCode = lumoraCode.replace(/justifyContent:/g, 'justify-content:');
  lumoraCode = lumoraCode.replace(/flexWrap:/g, 'flex-wrap:');
  
  // Update footer for responsive alignment
  lumoraCode = lumoraCode.replace(
    '.lu-footer-links { display: flex; justify-content: center; gap: 40px; margin-bottom: 40px; flex-wrap: wrap; }',
    '.lu-footer-links { display: flex; justify-content: center; align-items: center; gap: 40px; margin-bottom: 40px; flex-wrap: wrap; }\\n@media (max-width: 768px) { .lu-footer-links { flex-direction: column; gap: 20px; } }'
  );

  content = content.substring(0, startIdx) + lumoraCode + content.substring(endIdx);
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully fixed Lumora CSS camelCases in codeGenerator.js');
} else {
  console.log('Error: Could not find Lumora block via markers.');
}
