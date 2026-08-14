import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function quote(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  return `<blockquote${sAttr}>
  <p>${escHtml(props.text)}</p>
  ${props.author ? `<cite>${escHtml(props.author)}</cite>` : ''}
</blockquote>`
}
