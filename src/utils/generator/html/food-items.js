import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function foodItems(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

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
          `<div class="fi-card" style="border-color:${fiDark};box-shadow:6px 6px 0px 0px ${fiDark}">
            <div class="fi-img-wrap" style="border-bottom-color:${fiDark}">
              <img src="${escHtml(item.image)}" alt="${escHtml(item.name)}" class="fi-img">
              <div class="fi-price" style="background-color:${fiAccent};border-color:${fiDark};box-shadow:2px 2px 0px 0px ${fiDark}">${escHtml(item.price)}</div>
            </div>
            <div class="fi-content">
              <h3 class="fi-name" style="color:${fiDark}">${escHtml(item.name)}</h3>
              <p class="fi-desc">${escHtml(item.desc)}</p>
              <button class="fi-btn" style="background-color:${fiDark};border-color:${fiDark};box-shadow:4px 4px 0px 0px ${fiAccent}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Add to Cart
              </button>
            </div>
          </div>`
        ).join('\n        ')
        return `<section class="fi-section" style="background-color:${fiBg}">
  <div class="fi-inner">
    <h2 class="fi-heading" style="color:${fiDark}">${escHtml(fiTitle)}</h2>
    <div class="fi-grid">${itemsHtml}</div>
  </div>
</section>`
}
