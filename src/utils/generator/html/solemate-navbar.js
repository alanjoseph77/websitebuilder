import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function solemateNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const smBg = styles?.backgroundColor || '#ffffff'
        const smColor = styles?.color || '#1a1a1a'
        const smBrand = escHtml(props.smBrand || 'SoleMate')
        const smPlaceholder = escHtml(props.smSearchPlaceholder || 'Search')
        const smCartCount = escHtml(props.smCartCount || '1')
        const smLinks = props.links || [
          { text: 'Home', href: '#' },
          { text: 'Shop', href: '#shop' },
          { text: 'About Us', href: '#about' },
        ]
        const navLinksHtml = smLinks.map((l) => `<a href="${escHtml(l.href)}" class="smn-link" data-smn-href="${escHtml(l.href)}">${escHtml(l.text)}</a>`).join('')
        return `<header class="smn-header" style="background-color:${smBg};color:${smColor}">
  <div class="smn-inner">
    <div class="smn-search-wrap">
      <input type="text" placeholder="${smPlaceholder}" class="smn-search" style="color:${smColor};background:${smBg}">
      <svg class="smn-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    </div>
    <div class="smn-center">
      <div class="smn-links">
        ${navLinksHtml}
        <div class="smn-cart">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          <span class="smn-cart-count">${smCartCount}</span>
        </div>
      </div>
      <h1 class="smn-brand" style="color:${smColor}">${smBrand}</h1>
    </div>
    <div class="smn-spacer"></div>
  </div>
</header>`
}
