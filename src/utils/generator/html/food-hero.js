import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function foodHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const fhAccent = props.foodAccent || '#e67e22'
        const fhDark = props.foodDark || '#2d3436'
        const fhBg = styles?.backgroundColor || '#fff0eb'
        const fhTitle = props.foodHeroTitle || 'Welcome to'
        const fhBrand = props.foodHeroBrand || 'Ideatefood'
        const fhSubheading = props.foodHeroSubheading || "Hungry? We've got you covered."
        const fhDesc = props.foodHeroDesc || 'Fresh, chef-quality meals delivered straight to your door from the best local kitchens.'
        const fhCtaText = props.foodHeroCtaText || 'Start Ordering'
        const fhCtaHref = props.foodHeroCtaHref || '#'
        const fhTrustText = props.foodHeroTrustText || 'Trusted by 10,000+ foodies'
        const fhImage = props.foodHeroImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
        const fhBadgeText = props.foodHeroBadgeText || '50% OFF'
        const fhBadgeSub = props.foodHeroBadgeSub || 'First Order'

        return `<section class="fh-section" style="background-color:${fhBg}">
  <div class="fh-title-wrap">
    <h1 class="fh-title" style="color:${fhDark}">
      ${escHtml(fhTitle)}<br>
      <span class="fh-brand" style="--fh-accent:${fhAccent}">${escHtml(fhBrand)}</span>
    </h1>
  </div>
  <div class="fh-grid">
    <div class="fh-left">
      <h2 class="fh-subheading" style="color:${fhAccent}">${escHtml(fhSubheading)}</h2>
      <p class="fh-desc">${escHtml(fhDesc)}</p>
      <div class="fh-cta-wrap">
        <a href="${escHtml(fhCtaHref)}" class="fh-cta" style="border-color:${fhDark};box-shadow:8px 8px 0px 0px ${fhDark}">
          <span class="fh-cta-text" style="color:${fhDark}">${escHtml(fhCtaText)}</span>
          <span class="fh-cta-circle" style="background-color:${fhAccent};border-color:${fhDark}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </span>
        </a>
      </div>
      <div class="fh-trust">
        <div class="fh-avatars">
          <img src="https://i.pravatar.cc/100?u=4" class="fh-avatar" style="border-color:${fhDark}" alt="">
          <img src="https://i.pravatar.cc/100?u=5" class="fh-avatar" style="border-color:${fhDark}" alt="">
          <img src="https://i.pravatar.cc/100?u=6" class="fh-avatar" style="border-color:${fhDark}" alt="">
        </div>
        <p class="fh-trust-text">${escHtml(fhTrustText)}</p>
      </div>
    </div>
    <div class="fh-right">
      <div class="fh-blob"></div>
      <div class="fh-img-wrap">
        <div class="fh-img-card" style="border-color:${fhDark};box-shadow:12px 12px 0px 0px ${fhDark}">
          <img src="${escHtml(fhImage)}" alt="Food" class="fh-img">
        </div>
        <div class="fh-badge" style="background-color:${fhAccent};border-color:${fhDark};box-shadow:6px 6px 0px 0px ${fhDark}">
          <p class="fh-badge-main">${escHtml(fhBadgeText)}</p>
          <p class="fh-badge-sub">${escHtml(fhBadgeSub)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`
}
