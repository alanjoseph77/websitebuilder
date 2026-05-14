const fs = require('fs');
const content = fs.readFileSync('c:/Users/NITK 1/Downloads/claude/site-builder/src/utils/codeGenerator.js', 'utf8');

const baseCssStart = content.indexOf('const BASE_CSS');
const jsStart = content.indexOf('const BASE_JS');

const css = content.slice(baseCssStart, jsStart);
const fnLines = css.split('\\n').filter(line => line.includes('.fn-mobile-menu'));
console.log('Food mobile menu CSS lines:\\n', fnLines.join('\\n'));

const wzLines = css.split('\\n').filter(line => line.includes('.wz-'));
console.log('Winzy CSS lines:\\n', wzLines.join('\\n'));
