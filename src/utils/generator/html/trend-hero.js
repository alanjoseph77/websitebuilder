import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function trendHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const tAccent = props.trendAccent || '#e91e63'
        const tHeading = props.trendHeading || 'Bring brand in life'
        const tHLight = props.trendHighlight || 'brand'
        const tDesc = props.trendDescription || 'Brand cream is a sunshine cream good for your skin care.'
        const tCta = props.trendCtaText || 'Shop Now'
        const tReviews = props.trendReviewCount || '10k+'
        const tRating = props.trendRating || '4.5'
        const tImg = props.trendProductImage || 'https://placehold.co/280x380/e91e63/ffffff?text=Product'
        const tF1 = props.trendFeature1 || 'Organic'
        const tF1D = props.trendFeature1Desc || 'Natural ingredients delivered fresh.'
        const tF2 = props.trendFeature2 || 'Aroma'
        const tF2D = props.trendFeature2Desc || 'Refreshing scents for all skin types.'
        const tF3 = props.trendFeature3 || 'Botanic'
        const tF3D = props.trendFeature3Desc || 'Plant-based formulas with proven results.'
        const tVidText = props.trendVideoText || 'SEE PRODUCT VIDEO NOW'
        const tVidLink = props.trendVideoLink || ''
        const tBg = styles?.backgroundColor || '#ffffff'
        const tText = styles?.color || '#1e293b'

        let headingHTML
        if (tHLight && tHeading.includes(tHLight)) {
          const idx = tHeading.indexOf(tHLight)
          headingHTML = `${escHtml(tHeading.slice(0, idx))}<span class="trend-hero-highlight" style="color:${tAccent};border-color:${tAccent}">${escHtml(tHLight)}</span>${escHtml(tHeading.slice(idx + tHLight.length))} <span style="color:${tAccent}">&rarr;</span>`
        } else {
          headingHTML = `${escHtml(tHeading)} <span style="color:${tAccent}">&rarr;</span>`
        }

        const circleText = `${escHtml(tVidText)} &bull; ${escHtml(tVidText)} &bull; `
        const playBtnHTML = tVidLink
          ? `<a href="${normalizeHref(tVidLink)}" class="trend-play-btn" style="background-color:${tAccent}" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></a>`
          : `<button class="trend-play-btn" style="background-color:${tAccent}"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>`

        return `<section class="trend-hero" style="background-color:${tBg};color:${tText}">
  <div class="trend-blob trend-blob-tr" style="background-color:${tAccent}"></div>
  <div class="trend-blob trend-blob-bl" style="background-color:${tAccent}"></div>

  <div class="trend-hero-left">
    <h1 class="trend-hero-heading" style="color:${tText}">${headingHTML}</h1>
    <p class="trend-hero-desc">${escHtml(tDesc)}</p>
    <a href="${normalizeHref(props.trendCtaHref || '#')}" class="trend-hero-cta" style="background-color:${tAccent}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> ${escHtml(tCta)}</a>
    <div class="trend-hero-social">
      <div class="trend-hero-avatars">
        <img src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80" alt="" class="trend-avatar" />
        <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80" alt="" class="trend-avatar" />
        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80" alt="" class="trend-avatar" />
        <div class="trend-avatar-count">${escHtml(tReviews)}</div>
      </div>
      <div class="trend-hero-rating">
        <span class="trend-star">&#9733;</span>
        <strong class="trend-rating-num" style="color:${tText}">${escHtml(tRating)}</strong>
        <span class="trend-rating-sub">(review rating)</span>
      </div>
    </div>
  </div>

  <div class="trend-hero-center">
    <svg class="trend-splash" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path fill="${tAccent}" opacity="0.1" d="M435.5,296.5C418.1,353.9,352.5,391.1,288.7,419.5C224.9,447.9,162.8,467.5,108.8,443.3C54.8,419.1,8.9,351,1.5,283.5C-5.9,216,25.2,149.1,75.3,101.4C125.4,53.7,194.5,25.3,261.2,21.9C327.9,18.5,392.2,40.1,432.2,88.7C472.2,137.3,487.9,212.9,435.5,296.5Z"/>
      <path fill="${tAccent}" opacity="0.18" d="M410.5,320.5C384.8,375.4,310.8,401.4,244.5,410.5C178.2,419.6,119.6,411.8,78.5,372.5C37.4,333.2,13.8,262.4,26.5,198.5C39.2,134.6,88.2,77.6,150.5,50.5C212.8,23.4,288.4,26.2,345.5,61.5C402.6,96.8,441.2,164.6,436.2,230.5C431.2,296.4,382.8,360.3,410.5,320.5Z"/>
    </svg>
    <img src="${tImg}" alt="Product" class="trend-product-img trend-float" />
  </div>

  <div class="trend-hero-right">
    <div class="trend-feature">
      <h4 style="color:${tText}">${escHtml(tF1)}</h4>
      <p>${escHtml(tF1D)}</p>
    </div>
    <div class="trend-feature trend-feature-accent" style="background-color:${tAccent}">
      <h4>${escHtml(tF2)}</h4>
      <p>${escHtml(tF2D)}</p>
    </div>
    <div class="trend-feature">
      <h4 style="color:${tText}">${escHtml(tF3)}</h4>
      <p>${escHtml(tF3D)}</p>
    </div>
    <div class="trend-video-circle">
      <svg class="trend-spin-text" viewBox="0 0 100 100">
        <defs><path id="trendCirclePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/></defs>
        <text style="font-size:8px;font-weight:700;fill:${tText};text-transform:uppercase;letter-spacing:1.5px"><textPath href="#trendCirclePath">${circleText}</textPath></text>
      </svg>
      ${playBtnHTML}
    </div>
  </div>
</section>`
}
