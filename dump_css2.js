const fs = require('fs');
const content = fs.readFileSync('c:/Users/NITK 1/Downloads/claude/site-builder/src/utils/codeGenerator.js', 'utf8');

const baseCssStart = content.indexOf('const BASE_CSS');
const jsStart = content.indexOf('const BASE_JS');

const css = content.slice(baseCssStart, jsStart);
const fnLines = css.split('\\n').filter(line => line.includes('.fn-') || line.includes('.fw-') || line.includes('.wz-'));
fs.writeFileSync('c:/Users/NITK 1/Downloads/claude/site-builder/css_dump.txt', fnLines.join('\\n'));
