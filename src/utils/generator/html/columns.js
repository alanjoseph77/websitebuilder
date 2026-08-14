import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function columns(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const cols = (props.columns || []).map((col) => `    <div class="column">
      ${col.icon ? `<div class="col-icon">${col.icon}</div>` : ''}
      <h3>${escHtml(col.title || '')}</h3>
      <p>${escHtml(col.text || '')}</p>
    </div>`).join('\n')
        return `<section class="columns-section"${sAttr}>
  <div class="columns-grid">
${cols}
  </div>
</section>`
}
