const fs = require('fs');
let content = fs.readFileSync('src/utils/codeGenerator.js', 'utf8');

// 1. Update food-navbar to support logo
content = content.replace(
  /const fnBrand = props\.foodBrand \|\| 'Ideatefood'/,
  'const fnBrand = props.foodBrand || \'Ideatefood\'\n        const fnLogoUrl = props.foodLogoUrl'
);
content = content.replace(
  /<span class="fn-brand" style="color:\$\{fnDark\}">\$\{escHtml\(fnBrand\)\}<\/span>/,
  '${fnLogoUrl ? `<img src="${escHtml(fnLogoUrl)}" alt="${escHtml(fnBrand)}" style="height:32px;object-fit:contain;" />` : `<span class="fn-brand" style="color:${fnDark}">${escHtml(fnBrand)}</span>`}'
);

// 2. Add the new food components after food-hero
const foodCompsStr = `      case 'food-categories': {
        const fcAccent = props.foodAccent || '#e67e22'
        const fcDark = props.foodDark || '#2d3436'
        const fcBg = styles?.backgroundColor || '#fff0eb'
        const fcTitle = props.foodCategoriesTitle || 'Browse Categories'
        const fcItems = props.foodCategories || [
          { icon: '🍔', name: 'Burgers' }, { icon: '🍕', name: 'Pizza' },
          { icon: '🍣', name: 'Sushi' }, { icon: '🥗', name: 'Healthy' },
          { icon: '🍩', name: 'Desserts' }, { icon: '☕', name: 'Coffee' }
        ]
        const itemsHtml = fcItems.map(c => 
          \`<div class="fc-card" style="border-color:\${fcDark};box-shadow:4px 4px 0px 0px \${fcDark}">
            <div class="fc-icon" style="background-color:\${fcAccent};border-color:\${fcDark};box-shadow:2px 2px 0px 0px \${fcDark}">\${escHtml(c.icon)}</div>
            <span class="fc-name" style="color:\${fcDark}">\${escHtml(c.name)}</span>
          </div>\`
        ).join('\\n        ')
        return \`<section class="fc-section" style="background-color:\${fcBg}">
  <div class="fc-inner">
    <h2 class="fc-heading" style="color:\${fcDark}">\${escHtml(fcTitle)}</h2>
    <div class="fc-grid">\${itemsHtml}</div>
  </div>
</section>\`
      }

      case 'food-items': {
        const fiAccent = props.foodAccent || '#e67e22'
        const fiDark = props.foodDark || '#2d3436'
        const fiBg = styles?.backgroundColor || '#fff0eb'
        const fiTitle = props.foodItemsTitle || 'Popular Dishes'
        const fiItems = props.foodItems || [
          { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600', name: 'Classic Smashburger', desc: 'Double beef patty, melted cheese, house sauce on a toasted brioche bun.', price: '$12.99' },
          { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600', name: 'Pepperoni Pizza', desc: 'Wood-fired crust, San Marzano tomato sauce, mozzarella, and crispy pepperoni.', price: '$16.50' },
          { image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=600', name: 'Spicy Tuna Roll', desc: 'Fresh tuna, spicy mayo, cucumber, topped with sesame seeds and scallions.', price: '$14.00' },
        ]
        const itemsHtml = fiItems.map(item => 
          \`<div class="fi-card" style="border-color:\${fiDark};box-shadow:6px 6px 0px 0px \${fiDark}">
            <div class="fi-img-wrap" style="border-bottom-color:\${fiDark}">
              <img src="\${escHtml(item.image)}" alt="\${escHtml(item.name)}" class="fi-img">
              <div class="fi-price" style="background-color:\${fiAccent};border-color:\${fiDark};box-shadow:2px 2px 0px 0px \${fiDark}">\${escHtml(item.price)}</div>
            </div>
            <div class="fi-content">
              <h3 class="fi-name" style="color:\${fiDark}">\${escHtml(item.name)}</h3>
              <p class="fi-desc">\${escHtml(item.desc)}</p>
              <button class="fi-btn" style="background-color:\${fiDark};border-color:\${fiDark};box-shadow:4px 4px 0px 0px \${fiAccent}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Add to Cart
              </button>
            </div>
          </div>\`
        ).join('\\n        ')
        return \`<section class="fi-section" style="background-color:\${fiBg}">
  <div class="fi-inner">
    <h2 class="fi-heading" style="color:\${fiDark}">\${escHtml(fiTitle)}</h2>
    <div class="fi-grid">\${itemsHtml}</div>
  </div>
</section>\`
      }

      case 'food-footer': {
        const ffAccent = props.foodAccent || '#e67e22'
        const ffDark = props.foodDark || '#2d3436'
        const ffBg = styles?.backgroundColor || '#fff0eb'
        const ffBrand = props.foodFooterBrand || 'Ideatefood'
        const ffLogoUrl = props.foodFooterLogoUrl
        const ffText = props.foodFooterText || 'Delivering happiness to your door.'
        const ffCopyright = props.foodFooterCopyright || '© 2026 Ideatefood. All rights reserved.'
        
        let socialHtml = ''
        if (props.foodFbUrl) {
          socialHtml += \`<a href="\${escHtml(props.foodFbUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:\${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>\`
        }
        if (props.foodIgUrl) {
          socialHtml += \`<a href="\${escHtml(props.foodIgUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:\${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>\`
        }
        if (props.foodTwUrl) {
          socialHtml += \`<a href="\${escHtml(props.foodTwUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:\${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>\`
        }
        if (!socialHtml) {
          socialHtml = [1,2,3].map(i => \`<div class="ff-soc" style="background-color:\${ffAccent}"><div style="width:20px;height:20px;background-color:#fff;border-radius:50%"></div></div>\`).join('')
        }

        return \`<footer class="ff-footer" style="background-color:\${ffBg}">
  <div class="ff-inner" style="background-color:\${ffDark}">
    <div class="ff-left">
      \${ffLogoUrl ? \`<img src="\${escHtml(ffLogoUrl)}" alt="\${escHtml(ffBrand)}" class="ff-logo-img" />\` : \`<h2 class="ff-brand">\${escHtml(ffBrand)}</h2>\`}
      <p class="ff-text">\${escHtml(ffText)}</p>
    </div>
    <div class="ff-socials">\${socialHtml}</div>
  </div>
  <div class="ff-copyright-wrap">
    <p class="ff-copyright">\${escHtml(ffCopyright)}</p>
  </div>
</footer>\`
      }\n`;

content = content.replace(/<\/section>\`\n      }\n\n      case 'present-section':/, '</section>`\n      }\n\n' + foodCompsStr + '\n      case \'present-section\':');

// 3. Add CSS for food-categories, food-items, food-footer
const foodCssStr = `
/* Food Categories */
.fc-section { padding: 80px 24px; font-family: 'Outfit', system-ui, sans-serif; }
.fc-inner { max-width: 1200px; margin: 0 auto; }
.fc-heading { font-size: 2.5rem; font-weight: 900; margin-bottom: 40px; text-align: center; letter-spacing: -0.04em; }
.fc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 24px; }
.fc-card { background: #fff; border: 3px solid; border-radius: 16px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
.fc-card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px 0px currentColor !important; }
.fc-icon { width: 64px; height: 64px; border-radius: 50%; border: 3px solid; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
.fc-name { font-size: 1.2rem; font-weight: 800; }

/* Food Items */
.fi-section { padding: 80px 24px; font-family: 'Outfit', system-ui, sans-serif; }
.fi-inner { max-width: 1200px; margin: 0 auto; }
.fi-heading { font-size: 2.5rem; font-weight: 900; margin-bottom: 40px; text-align: center; letter-spacing: -0.04em; }
.fi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
.fi-card { background: #fff; border: 3px solid; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s; }
.fi-card:hover { transform: translateY(-4px); }
.fi-img-wrap { position: relative; height: 240px; border-bottom: 3px solid; }
.fi-img { width: 100%; height: 100%; object-fit: cover; }
.fi-price { position: absolute; top: 16px; right: 16px; border: 3px solid; border-radius: 99px; padding: 8px 16px; font-weight: 900; font-size: 1.1rem; color: #fff; }
.fi-content { padding: 24px; display: flex; flex-direction: column; flex: 1; }
.fi-name { font-size: 1.5rem; font-weight: 900; margin: 0 0 12px; letter-spacing: -0.02em; }
.fi-desc { font-size: 1rem; color: #4b5563; margin: 0 0 24px; line-height: 1.5; font-weight: 500; flex: 1; }
.fi-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; border: 3px solid; border-radius: 12px; color: #fff; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: transform 0.1s; }
.fi-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px currentColor !important; }

/* Food Footer */
.ff-footer { padding: 48px 48px; font-family: 'Outfit', system-ui, sans-serif; }
.ff-inner { max-width: 1100px; margin: 0 auto; border-radius: 24px; padding: 48px 64px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; gap: 24px; color: #fff; }
.ff-logo-img { height: 48px; object-fit: contain; margin-bottom: 12px; }
.ff-brand { font-size: 2rem; font-weight: 900; margin: 0 0 8px; letter-spacing: -0.04em; }
.ff-text { margin: 0; font-size: 1.1rem; font-weight: 500; opacity: 0.9; }
.ff-socials { display: flex; gap: 16px; }
.ff-soc { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #fff; transition: transform 0.2s; text-decoration: none; }
.ff-soc:hover { transform: scale(1.1) rotate(5deg); }
.ff-copyright-wrap { text-align: center; margin-top: 24px; }
.ff-copyright { margin: 0; font-size: 0.9rem; color: #6b7280; font-weight: 600; }
@media (max-width: 768px) {
  .ff-footer { padding: 32px 20px; }
  .ff-inner { flex-direction: column; text-align: center; padding: 32px 24px; }
}
`;

content = content.replace(/(\/\* --- Component-specific Styles --- \*\/)/, '$1' + foodCssStr);

fs.writeFileSync('src/utils/codeGenerator.js', content);
console.log('updated code generator');
