import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function creativeProjects(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const ccProjBg = styles?.backgroundColor || '#f9f9f9'
        const ccProjColor = styles?.color || '#1a1a1a'
        const ccBtnText = escHtml(props.ccBtnText || 'View Project')
        const ccProjects = props.ccProjects || []
        const cardsHtml = ccProjects.map(p => `
      <div class="ccp-card">
        <div class="ccp-img-wrap" style="background-color:${p.bgColor || '#f3f4f6'}">
          <img src="${escHtml(p.image || '')}" alt="${escHtml(p.title || '')}" class="ccp-img">
        </div>
        <div class="ccp-info">
          <div>
            <h3 class="ccp-title" style="color:${ccProjColor}">${escHtml(p.title || '')}</h3>
            <p class="ccp-cat">${escHtml(p.category || '')}</p>
          </div>
          <a href="${normalizeHref(p.href || '#')}" class="ccp-btn" style="color:${ccProjColor};text-decoration:none">${ccBtnText}</a>
        </div>
      </div>`).join('')
        return `<main class="ccp-section" style="background-color:${ccProjBg}">
  <div class="ccp-grid">${cardsHtml}
  </div>
</main>`
}
