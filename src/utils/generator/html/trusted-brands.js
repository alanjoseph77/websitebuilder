import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function trustedBrands(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const tbBg = styles?.backgroundColor || '#0a0a0a'
        const tbColor = styles?.color || '#ffffff'
        const tbAccent = props.tbAccentColor || '#fbbf24'
        const tbBadge = escHtml(props.tbBadgeText || 'Our Clients')
        const tbHeading = escHtml(props.tbHeading || 'Trusted By Global Brands')
        const tbDesc = escHtml(props.tbDescription || 'We deliver tailored marketing solutions designed to scale your brand and drive measurable results.')
        const tbBtnText = escHtml(props.tbButtonText || 'View all')
        const tbBtnHref = normalizeHref(props.tbButtonHref || '#')
        const tbI1 = props.tbIcon1 || 'fa-brands fa-golang'
        const tbI2 = props.tbIcon2 || 'fa-brands fa-slack'
        const tbI3 = props.tbIcon3 || 'fa-brands fa-facebook-f'
        const tbI4 = props.tbIcon4 || 'fa-brands fa-vuejs'
        return `<section class="tb-section" style="background-color:${tbBg};color:${tbColor}">
  <div class="tb-glow"></div>
  <div class="tb-badge"><span>${tbBadge}</span></div>
  <h1 class="tb-heading">${tbHeading}</h1>
  <p class="tb-desc">${tbDesc}</p>
  <div class="tb-map">
    <svg class="tb-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
      <path d="M 200 225 L 600 225" stroke="gray" stroke-width="1" fill="none"/>
      <path d="M 400 100 L 400 350" stroke="gray" stroke-width="1" fill="none"/>
      <path d="M 150 150 L 250 150 M 150 150 L 150 300" stroke="gray" stroke-width="1" fill="none"/>
      <path d="M 650 150 L 550 150 M 650 150 L 650 300" stroke="gray" stroke-width="1" fill="none"/>
      <circle r="2" fill="${tbAccent}"><animateMotion dur="4s" repeatCount="indefinite" path="M 200 225 L 400 225"/></circle>
      <circle r="2" fill="${tbAccent}"><animateMotion dur="5s" repeatCount="indefinite" path="M 600 225 L 400 225"/></circle>
    </svg>
    <div class="tb-center">
      <div class="tb-center-ring"></div>
      <div class="tb-center-core" style="background-color:${tbAccent}"><i class="fa-solid fa-cube"></i></div>
    </div>
    <div class="tb-node tb-n1 tb-float" style="animation-delay:0s"><div class="tb-node-inner"><i class="${tbI1}" style="color:#60a5fa"></i></div></div>
    <div class="tb-node tb-n2 tb-float" style="animation-delay:1s"><div class="tb-node-inner"><i class="${tbI2}" style="color:#c084fc"></i></div></div>
    <div class="tb-node tb-n3 tb-float" style="animation-delay:2s"><div class="tb-node-inner"><i class="${tbI3}" style="color:#2563eb"></i></div></div>
    <div class="tb-node tb-n4 tb-float" style="animation-delay:3s"><div class="tb-node-inner"><i class="${tbI4}" style="color:#34d399"></i></div></div>
    <div class="tb-node tb-n5 tb-float" style="animation-delay:0.5s"><div class="tb-node-inner tb-node-lg"><i class="fa-solid fa-earth-americas" style="color:#ef4444"></i></div></div>
    <div class="tb-node tb-n6 tb-float" style="animation-delay:1.5s"><div class="tb-node-inner tb-node-lg"><i class="fa-solid fa-microchip" style="color:#22c55e"></i></div></div>
  </div>
  <div class="tb-cta">
    <a href="${tbBtnHref}" class="tb-btn">${tbBtnText} <i class="fa-solid fa-arrow-right-long"></i></a>
  </div>
</section>`
}
