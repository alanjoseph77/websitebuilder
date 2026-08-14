import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function makeFooter(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#94a3b8'
        const accent = props.mftAccent || '#a855f7'
        const mftBrand = props.mftBrand || ''
        const mftText = props.mftText || ''
        const mftCopy = props.mftCopy || ''

        return `<footer class="mft-sec" style="background-color:${bg};color:${color}">
  <div class="mft-inner">
    <div class="mft-brand">
      <div class="mft-logo" style="background:linear-gradient(135deg, ${accent}, #3b82f6)"></div>
      ${escHtml(mftBrand)}
    </div>
    <p class="mft-text">${escHtml(mftText)}</p>
    <p class="mft-copy">${escHtml(mftCopy)}</p>
  </div>
</footer>`
}
