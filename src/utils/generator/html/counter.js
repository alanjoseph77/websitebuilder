import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function counter(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const stats = (props.stats || []).map((s) => `    <div class="stat">
      <div class="stat-number">${escHtml(s.number)}</div>
      <div class="stat-label">${escHtml(s.label)}</div>
    </div>`).join('\n')
        return `<section class="stats-section"${sAttr}>
  <div class="stats-grid">
${stats}
  </div>
</section>`
}
