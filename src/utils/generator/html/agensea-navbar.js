import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function agenseaNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const agNBg = styles?.backgroundColor || 'rgba(255,255,255,0.85)'
        const agNColor = styles?.color || '#000000'
        const agNAccent = props.agenseaAccent || '#3b82f6'
        const agNBrand = props.agenseaBrand || 'THE AGENSEA'
        const agNCta = props.agenseaCtaText || 'Donate'
        const agNCtaH = props.agenseaCtaHref || '#'
        const agNShowCta = props.agenseaShowCta !== false
        const agNLinks = (props.links || []).map(l =>
          `<a href="${escHtml(l.href)}" class="agn-link">${escHtml(l.text)}</a>`
        ).join('')
        const agNMLinks = (props.links || []).map(l =>
          `<a href="${escHtml(l.href)}" class="agn-mob-link">${escHtml(l.text)}</a>`
        ).join('')
        const agNCtaHtml = agNShowCta ? `<a href="${escHtml(agNCtaH)}" class="agn-cta" style="background:${agNColor};color:#fff;padding:0.55rem 1.3rem;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;display:inline-block;transition:opacity 0.2s">${escHtml(agNCta)}</a>` : ''
        return `<div class="agn-wrapper" style="position:relative;font-family:Inter,system-ui,sans-serif">
  <nav class="agn-nav" style="display:flex;justify-content:space-between;align-items:center;padding:1.2rem 2rem;background:${agNBg};backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);position:relative;z-index:10">
    <div class="agn-logo-wrap" style="position:relative;display:inline-flex;align-items:center;cursor:pointer">
      <span style="font-weight:900;font-size:1.3rem;letter-spacing:-0.04em;position:relative;z-index:10;color:${agNColor}">${escHtml(agNBrand)}</span>
      <svg style="position:absolute;top:50%;left:0;width:100%;height:14px;transform:translateY(-50%);color:${agNAccent};z-index:5" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" stroke-width="2.5"/>
      </svg>
    </div>
    <div class="agn-links">${agNLinks}</div>
    <div style="display:flex;align-items:center;gap:0.8rem">
      ${agNCtaHtml}
      <button class="agn-ham" onclick="document.getElementById('agn-mob').classList.toggle('agn-open')" style="display:none;background:none;border:none;cursor:pointer;color:${agNColor}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </nav>
  <div id="agn-mob" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;z-index:200;flex-direction:column;padding:2rem;gap:1.5rem;align-items:center;border-top:1px solid #f4f4f5">
    <button onclick="document.getElementById('agn-mob').classList.remove('agn-open')" style="position:absolute;top:1rem;right:1rem;background:none;border:none;cursor:pointer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    ${agNMLinks}
  </div>
</div>`
}
