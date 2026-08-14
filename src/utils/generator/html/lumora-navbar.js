import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function lumoraNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const brand = props.brand || 'Lumora'
        const links = props.links || []
        const cartCount = parseInt(props.lumoraCartCount || '0')
        const bg = styles?.backgroundColor || '#FDFCF8'
        const color = styles?.color || '#1A1A1A'
        const linksHtml = links.map(l => `<a href="${normalizeHref(l.href)}" class="lu-nav-link">${escHtml(l.text)}</a>`).join('')
        const cartBadge = cartCount > 0 ? `<span class="lu-cart-badge">${cartCount}</span>` : ''
        return `<header class="lu-nav" style="background-color:${bg}; color:${color}">
  <div class="lu-nav-inner">
    <div class="lu-nav-left">
      <button class="lu-menu-btn" onclick="this.closest('.lu-nav').querySelector('.lu-mobile-menu').classList.toggle('open')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="lu-brand">${escHtml(brand)}</div>
    </div>
    <nav class="lu-links">${linksHtml}</nav>
    <div class="lu-nav-right">
      <button class="lu-icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></button>
      <button class="lu-icon-btn lu-cart-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        ${cartBadge}
      </button>
    </div>
  </div>
  <div class="lu-mobile-menu" style="background-color:${bg}">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div class="lu-brand">${escHtml(brand)}</div>
      <button class="lu-icon-btn" onclick="this.closest('.lu-mobile-menu').classList.remove('open')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <nav style="display: flex; flex-direction: column; gap: 20px;">
      ${links.map(l => `<a href="${normalizeHref(l.href)}" style="text-decoration: none; color: inherit; font-size: 18px; font-weight: 500; text-transform: uppercase; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px; display: block;">${escHtml(l.text)}</a>`).join('')}
    </nav>
  </div>
</header>`
}
