import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function skylineHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const slBg = styles?.backgroundColor || '#fdf8f4'
        const slColor = styles?.color || '#1a1a1a'
        const slAccent = props.slAccentColor || '#e86034'
        const slH1 = escHtml(props.slHeadingLine1 || 'Housing')
        const slH2 = escHtml(props.slHeadingLine2 || 'Experience')
        const slCta = escHtml(props.slCtaText || 'Find a house')
        const slCtaHref = normalizeHref(props.slCtaHref || '#')
        const slDesc = escHtml(props.slDesc || 'Discover luxurious international properties with Skyline, connecting you to top global locations effortlessly.')
        const slImg = props.slHeroImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop'
        const slTName = escHtml(props.slTestimonialName || 'Roberto Carlos')
        const slTText = escHtml(props.slTestimonialText || '"Skyline made finding my perfect home effortless with detailed listings and personalized recommendations!"')
        const slTAvatar = props.slTestimonialAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
        const slS1V = escHtml(props.slStat1Value || '200K+')
        const slS1L = escHtml(props.slStat1Label || 'Happy users')
        const slS2V = escHtml(props.slStat2Value || '5K+')
        const slS2L = escHtml(props.slStat2Label || 'Our partner')
        return `<section class="sl-hero" style="background-color:${slBg};color:${slColor}">
  <div class="sl-grid-lines"><div class="sl-grid-v"></div><div class="sl-grid-h"></div></div>
  <div class="sl-inner">
    <div class="sl-left">
      <div>
        <h1 class="sl-h1">${slH1}<br><span class="sl-h1-italic">${slH2}</span></h1>
        <a href="${slCtaHref}" class="sl-cta" style="background-color:${slAccent};box-shadow:0 15px 30px ${slAccent}66">${slCta} <i class="fa-solid fa-arrow-up" style="transform:rotate(45deg);font-size:0.85rem"></i></a>
      </div>
      <div class="sl-desc">
        <p class="sl-desc-text">${slDesc}</p>
        <div class="sl-avatars">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="">
        </div>
      </div>
    </div>
    <div class="sl-center">
      <div class="sl-oval-wrap">
        <div class="sl-oval" style="background-color:#ede4dc"><img src="${escHtml(slImg)}" alt="Hero"></div>
        <div class="sl-oval-btn" style="background-color:${slAccent};border-color:${slBg};box-shadow:0 15px 30px ${slAccent}66"><i class="fa-solid fa-arrow-up" style="transform:rotate(45deg)"></i></div>
      </div>
    </div>
    <div class="sl-right">
      <div class="sl-testimonial">
        <div class="sl-stars" style="color:${slAccent}"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <div class="sl-t-header"><span class="sl-t-name">${slTName}</span><img class="sl-t-avatar" src="${escHtml(slTAvatar)}" alt="${slTName}"></div>
        <p class="sl-t-text">${slTText}</p>
      </div>
      <div class="sl-stats-wrap">
        <div class="sl-stats">
          <div><p class="sl-stat-val">${slS1V}</p><p class="sl-stat-lab">${slS1L}</p></div>
          <div><p class="sl-stat-val">${slS2V}</p><p class="sl-stat-lab">${slS2L}</p></div>
        </div>
        <div class="sl-actions">
          <i class="fa-solid fa-arrow-down" style="font-size:1.5rem;opacity:0.7"></i>
          <div class="sl-qr-btn"><i class="fa-solid fa-qrcode"></i></div>
        </div>
      </div>
    </div>
  </div>
</section>`
}
