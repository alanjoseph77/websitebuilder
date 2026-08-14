import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function qiProducts(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const qpBg = styles?.backgroundColor || '#ffffff'
        const qpColor = styles?.color || '#1a1a1a'
        const qpHead = escHtml(props.qiProdHeading || 'Selected Blossoms')
        const qpViewAll = escHtml(props.qiProdViewAll || 'View All Shop')
        const qpViewHref = escHtml(props.qiProdViewAllHref || '#')
        const qpProds = props.qiProducts || [
          { image: 'https://images.unsplash.com/photo-1563201444-2495a32761ac?q=80&w=800&auto=format&fit=crop', name: 'Shangri-La Rose', subtitle: 'Grown in High Altitudes', price: '$28' },
          { image: 'https://images.unsplash.com/photo-1597485334015-81423873919e?q=80&w=800&auto=format&fit=crop', name: 'Royal Chrysanthemum', subtitle: 'Immunity & Clarity', price: '$32' },
          { image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop', name: 'Blue Lotus', subtitle: 'Lucid Dreaming', price: '$36' },
        ]
        const prodsHtml = qpProds.map((p, i) => `<div class="qi-prod-card${i === 1 ? ' qi-prod-offset' : ''}">
      <div class="qi-prod-img-wrap">
        <img src="${escHtml(p.image)}" alt="${escHtml(p.name)}" class="qi-prod-img">
      </div>
      <div class="qi-prod-info">
        <div>
          <h4 class="qi-prod-name" style="color:${qpColor}">${escHtml(p.name)}</h4>
          <p class="qi-prod-sub">${escHtml(p.subtitle)}</p>
        </div>
        <p class="qi-prod-price" style="color:${qpColor}">${escHtml(p.price)}</p>
      </div>
    </div>`).join('\n    ')
        return `<section class="qi-prods-section" style="background-color:${qpBg}">
  <div class="qi-prods-inner">
    <div class="qi-prods-header">
      <h3 class="qi-prods-heading" style="color:${qpColor}">${qpHead}</h3>
      <a href="${qpViewHref}" class="qi-prods-viewall" style="color:${qpColor};border-bottom-color:${qpColor}">${qpViewAll}</a>
    </div>
    <div class="qi-prods-grid">
      ${prodsHtml}
    </div>
  </div>
</section>`
}
