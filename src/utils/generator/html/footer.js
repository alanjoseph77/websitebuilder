import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function footer(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const links = (props.links || []).map((l) => `    <a href="${normalizeHref(l.href)}">${escHtml(l.text)}</a>`).join('\n')
        return `<footer${sAttr}>
  <div class="footer-brand">${escHtml(props.brand)}</div>
  ${props.tagline ? `<p class="footer-tagline">${escHtml(props.tagline)}</p>` : ''}
  <nav class="footer-links">
${links}
  </nav>
  <p class="copyright">${escHtml(props.copyright || '')}</p>
</footer>`
}
