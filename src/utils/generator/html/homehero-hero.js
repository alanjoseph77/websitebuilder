import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function homeheroHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const hhBg = styles?.backgroundColor || '#ffffff'
        const hhColor = styles?.color || '#1a1a1a'
        const hhAccent = props.hhAccent || '#4F46E5'
        const hhCoral = props.hhCoral || '#FF5A5F'
        const hhHead = escHtml(props.hhHeading || 'MEET YOUR\nHOME MANAGER.').replace(/\n/g, '<br>')
        const hhSub = escHtml(props.hhSubtitle || 'HomeHero is your home manager who takes care of all the household tasks.')
        const hhEmail = escHtml(props.hhEmailPlaceholder || 'Enter your email')
        const hhCta = escHtml(props.hhCtaText || 'Join the Beta')
        const portraits = [
          props.hhPortrait1 || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
          props.hhPortrait2 || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
          props.hhPortrait3 || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300',
          props.hhPortrait4 || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        ]
        const shapeColors = ['#ede9fe', '#ffedd5', '#dcfce7', '#dbeafe']
        const posStyles = [
          'top:32px;left:8%;width:120px',
          'top:40%;left:3%;width:148px',
          'top:28%;right:8%;width:132px',
          'bottom:32px;right:3%;width:160px',
        ]
        const portraitsHtml = portraits.map((img, i) => {
          const shapePos = i % 2 === 0 ? 'top:-10px;' : 'bottom:-10px;'
          const shapeSide = i < 2 ? 'left:-10px;' : 'right:-10px;'
          return `<div class="hh-portrait" style="${posStyles[i]};animation-delay:${i * 0.4}s">
          <div class="hh-shape" style="background-color:${shapeColors[i]};${shapePos}${shapeSide}"></div>
          <img src="${escHtml(img)}" alt="" class="hh-portrait-img${i === 0 ? ' hh-gs' : ''}">
        </div>`
        }).join('\n      ')
        const phoneUser = escHtml(props.hhPhoneUser || 'Belinda')
        const phoneMsg = escHtml(props.hhPhoneMessage || 'I am here to help you today. Let me know if you need a hand with anything.')
        const phoneItems = (props.hhPhoneItems || [
          { label: 'Bills due this week', count: '2', color: 'indigo' },
          { label: 'Repairs scheduled', count: '1', color: 'green' },
        ]).map(item => {
          const iBg = item.color === 'green' ? '#dcfce7' : '#e0e7ff'
          const iClr = item.color === 'green' ? '#166534' : hhAccent
          return `<div class="hh-phone-item"><span class="hh-phone-label">${escHtml(item.label)}</span><span class="hh-phone-badge" style="background-color:${iBg};color:${iClr}">${escHtml(item.count)}</span></div>`
        }).join('\n              ')
        const mobilePortraits = portraits.map((img, i) => `<div class="hh-mob-portrait">
          <div class="hh-mob-shape" style="background-color:${shapeColors[i]}"></div>
          <img src="${escHtml(img)}" alt="" class="hh-mob-img${i === 0 ? ' hh-gs' : ''}">
        </div>`).join('\n        ')
        return `<section class="hh-hero" style="background-color:${hhBg}">
  <div class="hh-hero-inner">
    ${portraitsHtml}
    <div class="hh-center">
      <h1 class="hh-heading" style="color:${hhColor}">${hhHead}</h1>
      <p class="hh-subtitle">${hhSub}</p>
      <div class="hh-form">
        <input type="email" class="hh-email" placeholder="${hhEmail}">
        <button class="hh-cta-btn" style="background-color:${hhCoral}">${hhCta}</button>
      </div>
    </div>
    <div class="hh-phone-wrap">
      <div class="hh-phone">
        <div class="hh-phone-bar"><div class="hh-phone-pill"></div></div>
        <div class="hh-phone-content">
          <div class="hh-phone-user">
            <div class="hh-phone-avatar" style="background-color:#e0e7ff;color:${hhAccent}">${phoneUser.charAt(0)}</div>
            <span class="hh-phone-name">Hi, ${phoneUser}</span>
          </div>
          <div class="hh-phone-msg" style="background-color:#eef2ff">${phoneMsg}</div>
          ${phoneItems}
        </div>
      </div>
    </div>
  </div>
  <div class="hh-mob-strip">
    ${mobilePortraits}
  </div>
</section>`
}
