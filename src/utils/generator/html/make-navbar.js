import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function makeNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const mnBg = styles?.backgroundColor || '#0f172a'
        const mnColor = styles?.color || '#ffffff'
        const mnAccent = props.makeAccent || '#a855f7'
        const mnBrand = props.brand || 'Make'
        const mnLinks = props.links || []
        const linksHtml = mnLinks.map(l => `<a href="${escHtml(l.href)}" class="mkn-link">${escHtml(l.text)}</a>`).join('\n        ')

        return `<nav class="mkn-nav" style="background-color:${mnBg};color:${mnColor}">
  <div class="mkn-brand">
    <div class="mkn-logo" style="background:linear-gradient(135deg, ${mnAccent}, #3b82f6)"></div>
    ${escHtml(mnBrand)}
  </div>
  <div class="mkn-links">${linksHtml}</div>
  <div class="mkn-actions">
    <a href="#" class="mkn-login">Log in</a>
    <a href="#" class="mkn-btn" style="background-color:${mnColor};color:${mnBg}">Get Started</a>
  </div>
</nav>`
}
