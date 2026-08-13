const fs = require('fs');
let cg = fs.readFileSync('src/utils/codeGenerator.js', 'utf8');

let mNavHtml = cg.match(/(case 'make-navbar':[\s\S]*?)(?=case 'make-hero':)/)[1];
let newMNavHtml = mNavHtml.replace(/mn-/g, 'mkn-');
cg = cg.replace(mNavHtml, newMNavHtml);

let mHeroHtml = cg.match(/(case 'make-hero':[\s\S]*?)(?=case 'make-features':)/)[1];
let newMHeroHtml = mHeroHtml.replace(/mh-/g, 'mkh-');
cg = cg.replace(mHeroHtml, newMHeroHtml);

let cssSect = cg.match(/(\/\* Make Navbar \*\/[\s\S]*?)(?=\/\* Make Features \*\/)/)[1];
let newCssSect = cssSect.replace(/\.mn-/g, '.mkn-').replace(/\.mh-/g, '.mkh-');
cg = cg.replace(cssSect, newCssSect);

fs.writeFileSync('src/utils/codeGenerator.js', cg);
console.log('Fixed classes');
