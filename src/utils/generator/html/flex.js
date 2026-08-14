import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function flex(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const children = el.children || []
        const anchorId = props.sectionId || el.id?.slice(0, 8)
        let childrenHTML = ''
        if (children.length > 0) {
          childrenHTML = children.map((child, ci) => generateElementHTML(child, `${idx}-${ci}`)).join('\n')
        }
        return `<div id="${anchorId}"${sAttr} style="display:flex;flex-direction:${props.direction || 'row'};justify-content:${props.justify || 'flex-start'};align-items:${props.align || 'stretch'};gap:${props.gap || '20px'};flex-wrap:wrap">
${childrenHTML}
</div>`
}
