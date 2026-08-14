import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function image(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  return `<figure${sAttr}>
  <img src="${props.src}" alt="${escHtml(props.alt || '')}" style="max-width:100%; border-radius:8px; display:block; margin:0 auto;" />
  ${props.caption ? `<figcaption style="text-align:center; margin-top:8px; color:#666; font-size:0.85rem;">${escHtml(props.caption)}</figcaption>` : ''}
</figure>`
}
