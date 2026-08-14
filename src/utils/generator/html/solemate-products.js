import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function solemateProducts(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const smProdBg = styles?.backgroundColor || '#ffffff'
        const smProdColor = styles?.color || '#1a1a1a'
        const smTitle = escHtml(props.smFeaturedTitle || 'Featured Products')
        const smBtnTxt = escHtml(props.smCartBtnText || 'Add to Cart')
        const smProds = props.smProducts || []
        const prodsHtml = smProds.map(p => `
      <div class="smp-card">
        <div class="smp-img-wrap"><img src="${escHtml(p.image || '')}" alt="${escHtml(p.name || '')}" class="smp-img"></div>
        <h3 class="smp-name" style="color:${smProdColor}">${escHtml(p.name || '')}</h3>
        <p class="smp-price">${escHtml(p.price || '')}</p>
        <button class="smp-btn">${smBtnTxt}</button>
      </div>`).join('')
        return `<section class="smp-section" style="background-color:${smProdBg}">
  <div class="smp-wrap">
    <h2 class="smp-title" style="color:${smProdColor}">${smTitle}</h2>
    <div class="smp-grid">${prodsHtml}
    </div>
  </div>
</section>`
}
