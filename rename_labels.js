const fs = require('fs');

const path = 'src/data/elementTypes.js';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  "label: 'Make Hero',": "label: 'Split Hero',",
  "label: 'Lumora Hero',": "label: 'App Showcase Hero',",
  "label: 'Food Hero',": "label: 'Image Grid Hero',",
  "label: 'Moco Hero',": "label: 'Minimal Hero',",
  "label: 'HomeHero Hero',": "label: 'Gradient Hero',",
  "label: 'Creative Hero',": "label: 'Centered Hero',",
  "label: 'SoleMate Hero',": "label: 'Product Hero',",
  "label: 'Qi Hero',": "label: 'E-Commerce Hero',",
  "label: 'Agensea Hero',": "label: 'Corporate Hero',",
  "label: 'Skyline Hero',": "label: 'Video Hero',",
  "label: 'Veluno Hero',": "label: 'Bold Typography Hero',",
  "label: 'Winzy Hero',": "label: 'Waitlist Hero',",
  "label: 'Puzzle Hero',": "label: 'SaaS Hero',",
  "label: 'Trend Hero',": "label: 'Fashion Hero',",

  "label: 'Make Navbar',": "label: 'Standard Navbar',",
  "label: 'SoleMate Navbar',": "label: 'E-Commerce Navbar',",
  "label: 'Moco Navbar',": "label: 'Minimal Navbar',",
  "label: 'Creative Navbar',": "label: 'Centered Navbar',",
  "label: 'Lumora Navbar',": "label: 'App Navbar',",
  "label: 'Food Navbar',": "label: 'Restaurant Navbar',",
  "label: 'HomeHero Navbar',": "label: 'Transparent Navbar',",
  "label: 'Qi Navbar',": "label: 'Store Navbar',",
  "label: 'Agensea Navbar',": "label: 'Corporate Navbar',",
  "label: 'Veluno Navbar',": "label: 'Bold Navbar',",
  "label: 'Winzy Navbar',": "label: 'Waitlist Navbar',",
  "label: 'Puzzle Navbar',": "label: 'SaaS Navbar',",
  "label: 'Trend Navbar',": "label: 'Fashion Navbar',",

  "label: 'Make Features',": "label: 'Grid Features',",
  "label: 'Make Integrations',": "label: 'Integrations Section',",
  "label: 'Make Pricing',": "label: 'Pricing Section',",
  "label: 'Make Footer',": "label: 'Standard Footer',",
  "label: 'SoleMate Categories',": "label: 'Category Grid',",
  "label: 'SoleMate Products',": "label: 'Product Carousel',",
  "label: 'SoleMate Footer',": "label: 'Dark Footer',",
  "label: 'Creative Projects',": "label: 'Portfolio Grid',",
  "label: 'Creative Footer',": "label: 'Minimal Footer',",
  "label: 'Lumora Marquee',": "label: 'Logo Marquee',",
  "label: 'Lumora Story',": "label: 'Story Section',",
  "label: 'Lumora Products',": "label: 'App Features',",
  "label: 'Lumora Footer',": "label: 'App Footer',",
  "label: 'Food Categories',": "label: 'Menu Categories',",
  "label: 'Food Items',": "label: 'Menu Grid',",
  "label: 'Food Footer',": "label: 'Restaurant Footer',"
};

for (const [oldLabel, newLabel] of Object.entries(replacements)) {
  content = content.replace(oldLabel, newLabel);
}

fs.writeFileSync(path, content);
console.log('Successfully updated element labels in elementTypes.js');
