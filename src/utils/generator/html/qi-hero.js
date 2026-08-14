import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function qiHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const qhBg = styles?.backgroundColor || '#f7f7f5'
        const qhColor = styles?.color || '#1a1a1a'
        const qhTop = escHtml(props.qiTopText || 'In Flowers')
        const qhBottom = escHtml(props.qiBottomText || 'We Trust')
        const qhImage = escHtml(props.qiImage || 'https://images.unsplash.com/photo-1591871937573-748af0941cf2?q=80&w=800&auto=format&fit=crop')
        const qhDesc = escHtml(props.qiDesc || 'A ritual of sensory healing.\nWhole flower teas for deep connection and modern rituals.').replace(/\n/g, '<br>')
        return `<section class="qi-hero-section" style="background-color:${qhBg}">
  <div class="qi-hero-inner">
    <h2 class="qi-hero-heading" style="color:${qhColor}">${qhTop}</h2>
    <div class="qi-hero-img-wrap">
      <img src="${qhImage}" alt="" class="qi-hero-img">
    </div>
    <h2 class="qi-hero-heading qi-hero-heading-bottom" style="color:${qhColor}">${qhBottom}</h2>
  </div>
  <div class="qi-hero-desc">
    <p class="qi-hero-desc-text" style="color:${qhColor}">${qhDesc}</p>
  </div>
</section>`
}
