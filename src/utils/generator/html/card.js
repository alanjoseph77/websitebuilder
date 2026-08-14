import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function card(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  return `<div class="card-wrapper"${sAttr}>
  <div class="card">
    ${props.image ? `<img src="${props.image}" alt="${escHtml(props.title || '')}" class="card-img" />` : ''}
    <div class="card-body">
      <h3 class="card-title">${escHtml(props.title || '')}</h3>
      <p class="card-text">${escHtml(props.text || '')}</p>
      ${props.buttonText ? `<a href="${normalizeHref(props.buttonHref || '#')}" class="card-link">${escHtml(props.buttonText)} &rarr;</a>` : ''}
    </div>
  </div>
</div>`
}
