import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function hero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const btn1 = props.buttonText
          ? `<a href="${normalizeHref(props.buttonHref || '#')}" class="btn btn-primary">${escHtml(props.buttonText)}</a>`
          : ''
        const btn2 = props.buttonSecondaryText
          ? `<a href="${normalizeHref(props.buttonSecondaryHref || '#')}" class="btn btn-outline">${escHtml(props.buttonSecondaryText)}</a>`
          : ''
        const btns = [btn1, btn2].filter(Boolean).join('\n    ')
        return `<section class="hero"${sAttr}>
  <h1>${escHtml(props.title)}</h1>
  <p>${escHtml(props.subtitle)}</p>
  <div class="hero-btns">
    ${btns}
  </div>
</section>`
}
