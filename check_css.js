const fs = require('fs');
const content = fs.readFileSync('c:/Users/NITK 1/Downloads/claude/site-builder/src/utils/codeGenerator.js', 'utf8');

console.log('wz-hero CSS:', content.includes('.wz-hero'));
console.log('food-hero CSS:', content.includes('.fh-hero') || content.includes('.food-hero'));
