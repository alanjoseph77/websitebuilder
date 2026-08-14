import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function makeIntegrations(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.miAccent || '#a855f7'
        const miHeading = props.miHeading || ''
        const miCtaText = props.miCtaText || ''
        const miIcons = props.miIcons || []
        const iconsHtml = miIcons.map(icon => `<div class="mi-icon" style="background:${icon.bg}">${escHtml(icon.text)}</div>`).join('')

        return `<section class="mi-sec" style="background-color:${bg};color:${color}">
  <div class="mi-glow" style="background:radial-gradient(circle, ${accent}30 0%, transparent 70%)"></div>
  <div class="mi-inner">
    <h2 class="mi-h2">${escHtml(miHeading)}</h2>
    <div class="mi-grid">${iconsHtml}</div>
    <a href="#" class="mi-cta" style="color:${accent}">${escHtml(miCtaText)} <span>→</span></a>
  </div>
</section>`
}
