import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function makePricing(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.mpAccent || '#a855f7'
        const mpHeading = props.mpHeading || ''
        const mpPlans = props.mpPlans || []
        const plansHtml = mpPlans.map(plan => {
          const bgStyle = plan.highlight ? `background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));border-color:${accent};transform:scale(1.05);box-shadow:0 20px 40px -10px ${accent}40` : `background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.1)`
          const popularTag = plan.highlight ? `<div class="mp-popular" style="background:${accent}">Most Popular</div>` : ''
          const btnStyle = plan.highlight ? `background:${accent}` : `background:rgba(255,255,255,0.1)`
          const featsHtml = plan.features.map(f => `<div class="mp-feat"><div class="mp-check" style="background:${accent}30;color:${accent}">✓</div>${escHtml(f)}</div>`).join('')
          
          return `<div class="mp-card" style="${bgStyle}">
            ${popularTag}
            <h3 class="mp-name">${escHtml(plan.name)}</h3>
            <p class="mp-desc">${escHtml(plan.desc)}</p>
            <div class="mp-price">${escHtml(plan.price)}<span>/mo</span></div>
            <button class="mp-btn" style="${btnStyle}">Get Started</button>
            <div class="mp-feats">${featsHtml}</div>
          </div>`
        }).join('')

        return `<section class="mp-sec" style="background-color:${bg};color:${color}">
  <div class="mp-inner">
    <h2 class="mp-h2">${escHtml(mpHeading)}</h2>
    <div class="mp-grid">${plansHtml}</div>
  </div>
</section>`
}
