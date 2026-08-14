import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function makeHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const mhBg = styles?.backgroundColor || '#0f172a'
        const mhColor = styles?.color || '#ffffff'
        const mhAccent = props.makeAccent || '#a855f7'
        const mhHeading = props.makeHeading || 'Design, build, and automate anything'
        const mhDesc = props.makeDesc || 'From tasks and workflows to apps and systems, build and automate anything in one powerful visual platform.'
        const mhCtaText = props.makeCtaText || 'Get started free'
        const mhCta2Text = props.makeSecondaryCtaText || 'Contact Sales'
        const mhImage = props.makeImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'

        return `<section class="mkh-sec" style="background-color:${mhBg};color:${mhColor}">
  <div class="mkh-glow" style="background:radial-gradient(circle, ${mhAccent}40 0%, transparent 70%)"></div>
  <div class="mkh-inner">
    <h1 class="mkh-h1">${escHtml(mhHeading)}</h1>
    <p class="mkh-desc">${escHtml(mhDesc)}</p>
    <div class="mkh-btns">
      <a href="#" class="mkh-btn-1" style="background:linear-gradient(135deg, ${mhAccent}, #3b82f6);box-shadow:0 10px 30px ${mhAccent}40">${escHtml(mhCtaText)}</a>
      <a href="#" class="mkh-btn-2">${escHtml(mhCta2Text)}</a>
    </div>
    <div class="mkh-img-wrap">
      <div class="mkh-browser-bar">
        <div class="mkh-dot" style="background:#ef4444"></div>
        <div class="mkh-dot" style="background:#eab308"></div>
        <div class="mkh-dot" style="background:#22c55e"></div>
      </div>
      <img src="${escHtml(mhImage)}" alt="App Interface" class="mkh-img" />
    </div>
  </div>
</section>`
}
