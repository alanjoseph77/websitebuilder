import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function list(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const Tag = props.variant === 'ol' ? 'ol' : 'ul'
        const items = (props.items || []).map((item) => `  <li>${escHtml(item)}</li>`).join('\n')
        return `<${Tag}${sAttr}>\n${items}\n</${Tag}>`
}
