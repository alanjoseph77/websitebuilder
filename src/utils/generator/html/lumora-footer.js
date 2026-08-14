import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function lumoraFooter(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const brand = props.brand || 'Lumora'
        const links = props.links || []
        const copyright = props.copyright || '© 2024 LUMORA BEAUTY. ALL RIGHTS RESERVED.'
        const linksHtml = links.map(l => `<a href="${normalizeHref(l.href)}">${escHtml(l.text)}</a>`).join('')
        return `<footer class="lu-footer">
  <div class="lu-footer-brand">${escHtml(brand)}</div>
  <nav class="lu-footer-links">${linksHtml}</nav>
  <div class="lu-copyright">${escHtml(copyright)}</div>
</footer>`
}
