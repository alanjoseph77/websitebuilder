import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function winzyNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#0a0a0a'
        const color = styles?.color || '#ffffff'
        const brand = escHtml(props.wzBrand || 'Winzy')
        const btnText = escHtml(props.wzBtnText || 'Get Started')
        const navLinksHtml = (props.links || []).map((l, i) =>
          `<a href="${normalizeHref(l.href)}" class="wz-nav-item">${escHtml(l.text)}</a>`
        ).join('')

        return `<header class="wz-nav" style="background-color:${bg};color:${color}">
  <div class="wz-brand">
    <div class="wz-brand-icon">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
    </div>
    <span class="wz-brand-text">${brand}</span>
  </div>
  <nav class="wz-links">
    ${navLinksHtml}
  </nav>
  <button class="wz-btn">${btnText}</button>
  <button class="wz-ham">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  </button>
</header>`
}
