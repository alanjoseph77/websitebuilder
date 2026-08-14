import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function puzzleHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const pAccent = props.puzzleAccent || '#f97316'
        const pWord = props.puzzleDisplayWord || 'puzzle'
        const pHead = props.puzzleHeading || 'Get an amazing new play game experience'
        const pDesc = props.puzzleDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luct'
        const pCta = props.puzzleCtaText || 'Play Now'
        const pC1 = props.puzzleColor1 || '#3b82f6'
        const pC2 = props.puzzleColor2 || '#f97316'
        const pC3 = props.puzzleColor3 || '#fbbf24'
        const pC4 = props.puzzleColor4 || '#db2777'
        const pBg = styles?.backgroundColor || '#fdf6f0'
        const pText = styles?.color || '#0f172a'
        const PPATH = "M20,12V10a2,2,0,0,0-2-2,2,2,0,0,1-2-2,2,2,0,0,0-2-2H12V2a2,2,0,0,0-2-2A2,2,0,0,0,8,2V4H6A2,2,0,0,0,4,6,2,2,0,0,1,2,8,2,2,0,0,0,0,10v2a2,2,0,0,0,2,2,2,2,0,0,1,2,2,2,2,0,0,0,2,2H8v2a2,2,0,0,0,2,2,2,2,0,0,0,2-2V20h2a2,2,0,0,0,2-2,2,2,0,0,1,2-2,2,2,0,0,0,2-2Z"

        const piece = (color, delay) =>
          `<svg class="pzl-piece${delay ? ' pzl-delayed' : ''}" style="fill:${color}" viewBox="0 0 24 24"><path d="${PPATH}"/></svg>`
        const empty = `<div class="pzl-empty"></div>`

        return `<section class="pzl-hero" style="background-color:${pBg};color:${pText}">
  <div class="pzl-cluster pzl-cluster-left">
    ${piece(pC1, false)}${empty}
    ${piece('#ffffff', true)}${piece(pC2, false)}
    ${piece(pC3, true)}${piece(pC1, false)}
  </div>
  <div class="pzl-cluster pzl-cluster-right">
    ${empty}${piece(pC2, true)}${piece(pC1, false)}
    ${piece('#ffffff', true)}${piece(pC4, false)}${piece(pC3, true)}
    ${piece(pC3, false)}${piece(pC2, true)}${piece(pC1, false)}
    ${empty}${piece('#ffffff', true)}${piece(pC4, false)}
  </div>

  <div class="pzl-hero-content">
    <div class="pzl-display-word" style="color:${pText}">${escHtml(pWord)}</div>
    <h2 class="pzl-heading" style="color:${pText}">${escHtml(pHead)}</h2>
    <p class="pzl-desc">${escHtml(pDesc)}</p>
    <div class="pzl-cta-wrap">
      <a href="${normalizeHref(props.puzzleCtaHref || '#')}" class="pzl-cta" style="background-color:${pAccent};box-shadow:0 10px 25px -5px ${pAccent}66;text-decoration:none;display:inline-block">${escHtml(pCta)}</a>
      <svg class="pzl-arrow" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20,20 Q40,10 60,30 Q80,50 40,70" stroke-linecap="round"/>
        <path d="M35,65 L40,70 L35,75" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</section>`
}
