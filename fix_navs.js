const fs = require('fs');
const filePath = 'c:/Users/NITK 1/Downloads/claude/site-builder/src/utils/codeGenerator.js';
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Trend Navbar Mobile Menu
content = content.replace(
  '.trend-mobile-menu { display: none; padding: 8px 20px 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }',
  '.trend-mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; padding: 8px 20px 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }'
);

// Fix 2: Food Navbar Mobile Menu
content = content.replace(
  '.fn-mobile-menu { display: none; flex-direction: column; padding: 8px 24px 16px; }',
  '.fn-mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; flex-direction: column; padding: 8px 24px 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }'
);

// Fix 3: Winzy Navbar Mobile Menu
const wzHamStr = '@media (min-width:1024px) { .wz-ham { display:none; } }';
if (content.includes(wzHamStr)) {
  const wzMobileCSS = `
.wz-mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; border-top: 1px solid rgba(255,255,255,0.1); padding: 16px 0; z-index: 100; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.wz-mobile-menu.open { display: flex; flex-direction: column; }
.wz-mobile-link { display: block; padding: 14px 24px; font-size: 16px; font-weight: 500; color: #d1d5db; text-decoration: none; transition: all 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; }
.wz-mobile-link:hover { color: #fff; background: rgba(255,255,255,0.05); padding-left: 32px; }
.wz-mobile-btn { display: block; margin: 16px 24px 8px; background: #ef4444; color: #fff; border: none; padding: 12px 24px; border-radius: 9999px; font-weight: 600; cursor: pointer; font-size: 15px; text-align: center; }`;
  content = content.replace(wzHamStr, wzHamStr + wzMobileCSS);
}

// Ensure toggle functions exist for wzToggleMenu
if (!content.includes('function wzToggleMenu() {')) {
  const jsInsert = `
function wzToggleMenu() {
  var menu = document.getElementById('wzMobileMenu');
  if (menu) menu.classList.toggle('open');
}
`;
  content = content.replace('function trendToggleMenu() {', jsInsert + 'function trendToggleMenu() {');
}

fs.writeFileSync(filePath, content);
console.log('Successfully patched CodeGenerator.js CSS and JS!');
