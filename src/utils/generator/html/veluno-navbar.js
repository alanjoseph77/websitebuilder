import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function velunoNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#ffffff'
        const color = styles?.color || '#000000'
        const brand = escHtml(props.vlBrand || 'Veluno')
        const searchPlaceholder = escHtml(props.vlSearchPlaceholder || 'Search products...')
        const cartCount = escHtml(props.vlCartCount || '0')
        const profileImg = props.vlProfileImg || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        const navLinksHtml = (props.links || []).map((l, i) =>
          `<a href="${normalizeHref(l.href)}" class="vl-nav-item">${escHtml(l.text)}</a>`
        ).join('')

        return `<header class="vl-nav" style="background-color:${bg};color:${color}">
  <div class="vl-brand-flex">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor"/></svg>
    <span class="vl-brand-text">${brand}</span>
  </div>
  <nav class="vl-links">
    ${navLinksHtml}
  </nav>
  <div class="vl-actions">
    <div class="vl-search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="${searchPlaceholder}" class="vl-search-input" />
    </div>
    <div class="vl-icons">
      <button class="vl-cart-btn" style="color:inherit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <button class="vl-cart-btn" style="color:inherit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        ${parseInt(cartCount) > 0 ? `<span class="vl-cart-badge">${cartCount}</span>` : ''}
      </button>
      <img src="${profileImg}" alt="Profile" class="vl-profile-img" />
    </div>
  </div>
</header>`
}
