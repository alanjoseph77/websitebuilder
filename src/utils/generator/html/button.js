import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function button(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const variant = props.variant || 'primary'
        return `<div${sAttr}>
  <a href="${normalizeHref(props.href || '#')}" class="btn btn-${variant}">${escHtml(props.text)}</a>
</div>`
}
