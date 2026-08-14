import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function testimonial(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  return `<section class="testimonial-section"${sAttr}>
  ${props.avatar ? `<img src="${props.avatar}" alt="${escHtml(props.author || '')}" class="testimonial-avatar" />` : ''}
  <blockquote class="testimonial-text">"${escHtml(props.text)}"</blockquote>
  <div class="testimonial-author">
    <strong>${escHtml(props.author || '')}</strong>
    ${props.role ? `<span class="testimonial-role">${escHtml(props.role)}</span>` : ''}
  </div>
</section>`
}
