import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function solemateHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const smHeroImages = props.smHeroImages || [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1605733513597-a8f8d410fe3c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
        ]
        const smCtaText = escHtml(props.smHeroCtaText || 'Shop Now')
        const smCtaHref = normalizeHref(props.smHeroCtaHref || '#')
        const panelsHtml = smHeroImages.map(img => `
    <div class="smh-panel">
      <img src="${escHtml(img)}" alt="Panel" class="smh-panel-img">
      <div class="smh-overlay"><a href="${smCtaHref}" class="smh-btn" style="text-decoration:none;display:inline-block">${smCtaText}</a></div>
    </div>`).join('')
        return `<section class="smh-grid">${panelsHtml}
</section>`
}
