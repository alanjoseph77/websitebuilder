import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function makeFeatures(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.mfAccent || '#a855f7'
        const mfHeading = props.mfHeading || ''
        const mfFeatures = props.mfFeatures || []
        const featuresHtml = mfFeatures.map(f => `
          <div class="mf-card">
            <div class="mf-icon" style="background:linear-gradient(135deg, ${accent}40, transparent); border:1px solid ${accent}40">${escHtml(f.icon)}</div>
            <h3 class="mf-title">${escHtml(f.title)}</h3>
            <p class="mf-desc">${escHtml(f.desc)}</p>
          </div>
        `).join('')

        return `<section class="mf-sec" style="background-color:${bg};color:${color}">
  <div class="mf-inner">
    <h2 class="mf-h2">${escHtml(mfHeading)}</h2>
    <div class="mf-grid">${featuresHtml}</div>
  </div>
</section>`
}
