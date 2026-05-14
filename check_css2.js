const fs = require('fs');
const content = fs.readFileSync('c:/Users/NITK 1/Downloads/claude/site-builder/src/utils/codeGenerator.js', 'utf8');

const baseCssStart = content.indexOf('const BASE_CSS');
const jsStart = content.indexOf('const BASE_JS');

const css = content.slice(baseCssStart, jsStart);
console.log('wz-nav count in CSS:', (css.match(/wz-nav/g) || []).length);
console.log('wz-mobile-menu count in CSS:', (css.match(/wz-mobile-menu/g) || []).length);
console.log('fn-nav count in CSS:', (css.match(/fn-nav/g) || []).length);
console.log('fn-mobile-menu count in CSS:', (css.match(/fn-mobile-menu/g) || []).length);
