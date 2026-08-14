import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function lumoraProducts(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const tag = props.tagline || 'SHOP BESTSELLERS'
        const title = props.title || 'Elevate your routine'
        const products = props.products || []
        const prodsHtml = products.map(p => `
    <div class="lu-prod-card">
      <div class="lu-prod-img-wrap">
        <img src="${escHtml(p.image)}" alt="${escHtml(p.name)}" />
        <span class="lu-prod-tag">${escHtml(p.tag)}</span>
        <button class="lu-wish-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>
      </div>
      <div class="lu-prod-info">
        <div class="lu-prod-cat">${escHtml(p.category)}</div>
        <h3 class="lu-prod-name">${escHtml(p.name)}</h3>
        <div class="lu-prod-price-row">
          <span class="lu-price">${escHtml(p.price)}</span>
          ${p.oldPrice ? `<span class="lu-old-price">${escHtml(p.oldPrice)}</span>` : ''}
        </div>
        <button class="lu-add-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          ADD TO BAG
        </button>
      </div>
    </div>`).join('')
        return `<section class="lu-products">
  <div class="lu-prod-header">
    <div class="lu-prod-tagline">${escHtml(tag)}</div>
    <h2 class="lu-prod-title">${escHtml(title)}</h2>
  </div>
  <div class="lu-prod-grid">${prodsHtml}</div>
</section>`
}
