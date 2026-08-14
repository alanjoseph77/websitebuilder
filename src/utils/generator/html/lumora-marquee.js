import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function lumoraMarquee(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const r1 = props.review1 || 'BEST SERUM I EVER USED'
        const a1 = props.author1 || 'SARAH J.'
        const r2 = props.review2 || 'GLOWING SKIN IN DAYS'
        const a2 = props.author2 || 'EMMA W.'
        const trusted = props.trustedText || 'TRUSTED BY 50K+ CUSTOMERS'
        const itm = `
          <div class="lu-marquee-item">
            <div class="lu-stars">★★★★★</div>
            <div>
              <div class="lu-r-text">${escHtml(r1)}</div>
              <div class="lu-r-author">${escHtml(a1)}</div>
            </div>
          </div>
          <div class="lu-sep"></div>
          <div class="lu-marquee-item">
            <div class="lu-stars">★★★★★</div>
            <div>
              <div class="lu-r-text">${escHtml(r2)}</div>
              <div class="lu-r-author">${escHtml(a2)}</div>
            </div>
          </div>
          <div class="lu-sep"></div>
          <div class="lu-trusted">${escHtml(trusted)}</div>
          <div class="lu-sep"></div>`
        return `<div class="lu-marquee"><div class="lu-marquee-inner">${itm}${itm}${itm}${itm}</div></div>`
}
