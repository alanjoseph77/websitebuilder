import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function section(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const sLayout = props.layout || 'stack'
        const sGap = props.gap || '24px'
        const colCount = { '2-col': 2, '3-col': 3, '4-col': 4 }[sLayout]
        const children = el.children || []
        const anchorId = props.sectionId || el.id?.slice(0, 8)
        let childrenHTML = ''
        if (children.length > 0) {
          const childContent = children.map((child, ci) => {
            const html = generateElementHTML(child, `${idx}-${ci}`)
            if (colCount && child.props?.gridSpan === 'full') return `<div style="grid-column: 1 / -1">\n${html}\n</div>`
            return html
          }).join('\n')
          childrenHTML = colCount
            ? `\n<div class="section-grid section-grid-${colCount}" style="--col-gap:${sGap}">\n${childContent}\n</div>`
            : '\n' + childContent
        }
        return `<section${sAttr}${anchorId ? ` id="${anchorId}"` : ''}>
  ${props.title ? `<h2>${escHtml(props.title)}</h2>` : ''}
  ${props.subtitle ? `<p class="subtitle">${escHtml(props.subtitle)}</p>` : ''}${childrenHTML}
</section>`
}
