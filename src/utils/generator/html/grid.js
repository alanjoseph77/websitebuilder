import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function grid(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const children = el.children || []
        const anchorId = props.sectionId || el.id?.slice(0, 8)
        let childrenHTML = ''
        if (children.length > 0) {
          childrenHTML = children.map((child, ci) => generateElementHTML(child, `${idx}-${ci}`)).join('\n')
        }
        // Simplified inline style for export grid
        return `<div id="${anchorId}"${sAttr} style="display:grid;grid-template-columns:${props.columns || 'repeat(3, 1fr)'};gap:${props.gap || '24px'}">
${childrenHTML}
</div>`
}
