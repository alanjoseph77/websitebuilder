import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function productCardSection(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const pcOuterBg = styles?.backgroundColor || '#ebecf0'
        const pcColor = styles?.color || '#1a1a1a'
        const pcAccent = props.pcAccent || '#4361ee'
        const pcImage = escHtml(props.pcImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000')
        const pcTitle = escHtml(props.pcTitle || 'SuperBook Pro')
        const pcDesc = escHtml(props.pcDescription || 'Lightning-fast performance, stunning Retina display, all-day battery life.')
        const pcPrice = escHtml(props.pcPrice || '$1499.00')
        const pcBtn1 = escHtml(props.pcBtnPrimary || 'Add To Cart')
        const pcBtn2 = escHtml(props.pcBtnSecondary || 'Buy Now')
        const pcRating = parseFloat(props.pcRating || 4.8)
        const pcRevText = escHtml(props.pcReviewText || 'Read all reviews')
        const pcRevHref = escHtml(props.pcReviewHref || '#')
        const filled = Math.round(pcRating)
        const starSvg = (op) => `<svg class="pc-star" viewBox="0 0 20 20" style="opacity:${op}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
        const stars = [1, 2, 3, 4, 5].map(n => starSvg(n <= filled ? 1 : 0.25)).join('')
        const FEAT_ICONS = {
          shipping: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>`,
          warranty: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
          returns: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>`,
        }
        const feats = (props.pcFeatures || [
          { icon: 'shipping', label: 'Free Shipping' },
          { icon: 'warranty', label: '2-Year Warranty' },
          { icon: 'returns', label: 'Easy Returns' },
        ]).map(f => `<div class="pc-feat">
          ${FEAT_ICONS[f.icon] || FEAT_ICONS.shipping}
          <p class="pc-feat-label">${escHtml(f.label)}</p>
        </div>`).join('')
        return `<section class="pc-outer" style="background-color:${pcOuterBg}">
  <div class="pc-card">
    <div class="pc-grid">
      <div class="pc-img-col">
        <img src="${pcImage}" alt="${pcTitle}" class="pc-img">
      </div>
      <div class="pc-details">
        <div>
          <h1 class="pc-title" style="color:${pcColor}">${pcTitle}</h1>
          <p class="pc-desc">${pcDesc}</p>
        </div>
        <div class="pc-buy">
          <p class="pc-price" style="color:${pcColor}">${pcPrice}</p>
          <div class="pc-btns">
            <button class="pc-btn-primary" style="background-color:${pcAccent}">${pcBtn1}</button>
            <button class="pc-btn-secondary" style="color:${pcAccent};border-color:${pcAccent}">${pcBtn2}</button>
          </div>
        </div>
        <div class="pc-rating">
          <div class="pc-stars">${stars}</div>
          <span class="pc-rating-num" style="color:${pcColor}">${pcRating} / 5</span>
          <a href="${pcRevHref}" class="pc-review-link">${pcRevText}</a>
        </div>
        <div class="pc-feats-wrap">
          <p class="pc-feats-label">Customer Benefits</p>
          <div class="pc-feats">${feats}</div>
        </div>
      </div>
    </div>
  </div>
</section>`
}
