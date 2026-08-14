import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function lumoraHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const tagline = props.tagline || 'PREMIUM CARE'
        const title = props.title || 'Reveal Your Natural Radiance'
        const ctaText = props.ctaText || 'Shop Collection'
        const heroImg = props.heroImage || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200'
        const pImg = props.productImg || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'
        const pName = props.productName || 'Renewal Serum'
        const pDesc = props.productDesc || 'Advanced hydration'
        return `<section class="lu-hero">
  <div class="lu-hero-content">
    <div class="lu-tag">${escHtml(tagline)}</div>
    <h1 class="lu-hero-title">${escHtml(title)}</h1>
    <button class="lu-cta">${escHtml(ctaText)}</button>
    <div class="lu-floating-card">
      <img src="${escHtml(pImg)}" alt="Product" />
      <div>
        <div class="lu-f-name">${escHtml(pName)}</div>
        <div class="lu-f-desc">${escHtml(pDesc)}</div>
      </div>
    </div>
  </div>
  <div class="lu-hero-media">
    <img src="${escHtml(heroImg)}" alt="Skincare" />
  </div>
</section>`
}
