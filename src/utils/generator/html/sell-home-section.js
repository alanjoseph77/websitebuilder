import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function sellHomeSection(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const shBg = styles?.backgroundColor || '#ffffff'
        const shColor = styles?.color || '#0f172a'
        const shAccent = props.shAccent || '#2563eb'
        const shBtnBg = props.shBtnBg || '#0f172a'
        const shBtnColor = props.shBtnColor || '#ffffff'
        const shHeading = props.shHeading || 'Sell your home.'
        const shHighlight = props.shHighlight || 'Skip the hard parts.'
        const shDesc = props.shDesc || "We've redesigned the home selling process to be faster, simpler, and entirely on your terms."
        const shBtnText = props.shBtnText || 'Get Started Today'
        const shBtnHref = props.shBtnHref || '#'

        const steps = [
          { label: props.shStep1Label || 'Step 1', title: props.shStep1Title || 'Get an offer in minutes', desc: props.shStep1Desc || 'Answer a few questions and receive a preliminary cash offer in minutes.', image: props.shStep1Image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800', align: 'right' },
          { label: props.shStep2Label || 'Step 2', title: props.shStep2Title || 'Do a video walkthrough', desc: props.shStep2Desc || 'Show us your home through your smartphone so we can verify details.', image: props.shStep2Image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800', align: 'left' },
          { label: props.shStep3Label || 'Step 3', title: props.shStep3Title || 'Close and move, stress-free', desc: props.shStep3Desc || "Choose your closing date. Get paid within days and move when you're ready.", image: props.shStep3Image || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800', align: 'right' },
        ]

        const stepsHtml = steps.map((s) => `
    <div class="sh-stagger">
      <div class="sh-step sh-step-${escHtml(s.align)}">
        <div class="sh-img-wrap">
          <img src="${escHtml(s.image)}" alt="${escHtml(s.title)}" class="sh-img">
        </div>
        <div class="sh-step-text">
          <span class="sh-label" style="color:${shAccent}">${escHtml(s.label)}</span>
          <h3 class="sh-step-title" style="color:${shColor}">${escHtml(s.title)}</h3>
          <p class="sh-step-desc">${escHtml(s.desc)}</p>
        </div>
      </div>
    </div>`).join('')

        return `<section class="sh-section" style="background-color:${shBg}">
  <div class="sh-inner">
    <div class="sh-left">
      <h2 class="sh-heading" style="color:${shColor}">${escHtml(shHeading)}<br><span style="color:${shAccent}">${escHtml(shHighlight)}</span></h2>
      <p class="sh-desc">${escHtml(shDesc)}</p>
      <a href="${escHtml(shBtnHref)}" class="sh-btn" style="background-color:${shBtnBg};color:${shBtnColor}">${escHtml(shBtnText)}</a>
    </div>
    <div class="sh-right">${stepsHtml}
    </div>
  </div>
</section>`
}
