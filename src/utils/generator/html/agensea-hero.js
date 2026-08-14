import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function agenseaHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const agHBg = styles?.backgroundColor || '#ffffff'
        const agHColor = styles?.color || '#000000'
        const agHAccent = props.agenseaAccent || '#3b82f6'
        const agHWaveOp = props.agenseaWaveOpacity || '0.12'
        const agHR1Text = props.agenseaRow1Text || 'Creative Agency'
        const agHR1Img = props.agenseaRow1Image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'
        const agHR2Text = props.agenseaRow2Text || 'for the'
        const agHR2Img = props.agenseaRow2Image || 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&q=80&w=1200'
        const agHR3Text = props.agenseaRow3Text || 'Ocean'
        const agHR3Img = props.agenseaRow3Image || 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=1200'
        const agHBadge = props.agenseaBadgeText || 'WATCH OUR STORY • WATCH OUR STORY •'
        const agHVideo = props.agenseaBadgeVideoUrl || ''
        const badgeClick = agHVideo ? `onclick="document.getElementById('agh-modal').style.display='flex'"` : ''
        const badgeCursor = agHVideo ? 'cursor:pointer' : 'cursor:default'
        const badgeMarkup = `<div class="agh-badge-wrap">
          <svg class="agh-badge-ring" viewBox="0 0 100 100">
            <path id="agh-curve" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>
            <text font-size="8.5" font-weight="700" letter-spacing="2" fill="${agHColor}" opacity="0.7">
              <textPath xlink:href="#agh-curve">${escHtml(agHBadge)}</textPath>
            </text>
          </svg>
          <div class="agh-badge-btn" style="background:${agHAccent};box-shadow:0 8px 20px ${agHAccent}55;${badgeCursor}" ${badgeClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>`
        const videoModal = agHVideo ? `
<div id="agh-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);align-items:center;justify-content:center" onclick="this.style.display='none'">
  <div style="position:relative;width:min(90vw,900px);aspect-ratio:16/9" onclick="event.stopPropagation()">
    <button onclick="document.getElementById('agh-modal').style.display='none'" style="position:absolute;top:-40px;right:0;background:none;border:none;color:#fff;cursor:pointer;font-size:1.5rem;padding:4px 8px">✕</button>
    <iframe src="${escHtml(agHVideo)}" style="width:100%;height:100%;border:none;border-radius:8px" allow="autoplay;encrypted-media" allowfullscreen></iframe>
  </div>
</div>` : ''
        return `<section class="agh-section" style="position:relative;background:${agHBg};padding:7rem 3rem 5rem;font-family:Inter,system-ui,sans-serif;overflow:hidden">
  ${videoModal}
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:${agHWaveOp};pointer-events:none;color:${agHAccent}" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
    <path d="M-100,200 Q200,150 400,250 T900,200 T1500,300" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M-100,400 Q300,350 500,450 T1000,400 T1600,500" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M-100,600 Q400,550 600,650 T1100,600 T1700,700" fill="none" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <div style="position:relative;max-width:1280px;margin:0 auto">
    <div class="agh-row">
      <div class="agh-cap agh-cap-sm"><img src="${escHtml(agHR1Img)}" alt="" class="agh-img"/></div>
      <h1 class="agh-h1" style="color:${agHColor}">${escHtml(agHR1Text)}</h1>
    </div>
    <div class="agh-row">
      <h1 class="agh-h1" style="color:${agHColor}">${escHtml(agHR2Text)}</h1>
      <div class="agh-cap agh-cap-flex"><img src="${escHtml(agHR2Img)}" alt="" class="agh-img"/></div>
    </div>
    <div class="agh-row" style="position:relative;margin-bottom:4rem">
      <div class="agh-cap agh-cap-lg"><img src="${escHtml(agHR3Img)}" alt="" class="agh-img"/></div>
      <h1 class="agh-h1" style="color:${agHColor}">${escHtml(agHR3Text)}</h1>
      <div class="agh-badge">${badgeMarkup}</div>
    </div>
    <div class="agh-badge-mobile">${badgeMarkup}</div>
  </div>
</section>`
}
