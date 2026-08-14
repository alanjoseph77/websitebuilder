import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function velunoHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#0c0c0c'
        const color = styles?.color || '#ffffff'
        const hl = escHtml(props.vlHeadingLeft || 'Glow')
        const hr = escHtml(props.vlHeadingRight || '& Care')
        const text = escHtml(props.vlDesc || 'Veluno is your go-to destination for modern and versatile beauty.\nWe bring together timeless care and premium quality to your routine.').replace(/\n/g, '<br/>')
        const scrollText = escHtml(props.vlScrollText || 'Scroll Down')
        const img1 = props.vlLeftImage || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=90&w=1200'
        const img2 = props.vlRightImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=90&w=1200'

        let tagsHtml = ''
        const t1 = props.vlTag1, t2 = props.vlTag2, t3 = props.vlTag3
        if (t1 || t2 || t3) {
          tagsHtml = '<div class="vl-tags">'
          if (t1) tagsHtml += `<span>${escHtml(t1)}</span>`
          if (t1 && t2) tagsHtml += `<div class="vl-dot"></div>`
          if (t2) tagsHtml += `<span>${escHtml(t2)}</span>`
          if (t2 && t3) tagsHtml += `<div class="vl-dot"></div>`
          if (t3) tagsHtml += `<span>${escHtml(t3)}</span>`
          tagsHtml += '</div>'
        }

        return `<main class="vl-hero" style="background-color:${bg};color:${color}">
  <div class="vl-divider"></div>
  <div class="vl-img-box"><img src="${img1}" alt="" class="vl-img" /><div class="vl-overlay-l"></div></div>
  <div class="vl-img-box"><img src="${img2}" alt="" class="vl-img" /><div class="vl-overlay-r"></div></div>
  <div class="vl-content">
    <h1 class="vl-h1">${hl} <span>${hr}</span></h1>
    <p class="vl-desc">${text}</p>
    <div class="vl-scroll">
      <div class="vl-scroll-ind">
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="width:1px;height:32px;background:linear-gradient(to bottom,currentColor,transparent);margin-bottom:-2px;"></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      <span class="vl-scroll-text">${scrollText}</span>
    </div>
  </div>
  ${tagsHtml}
</main>`
}
