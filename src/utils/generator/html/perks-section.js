import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function perksSection(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const pHeading = props.perksHeading || 'The perks'
        const pImage = props.perksImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070'
        const pBg = styles?.backgroundColor || '#f9fafb'
        const pText = styles?.color || '#111827'
        const pItems = props.perksItems || [
          { badge: 'Premium', badgeDark: true, title: 'Plan your trip, all in one place', desc: 'Browse our map for unique stays. Effortlessly find attractions, things to do and places to eat or drink nearby.' },
          { badge: 'Free', badgeDark: false, title: 'Be part of a community', desc: 'Get peace of mind and discuss retreat options with a like-minded audience. Real people, real recommendations.' },
          { badge: 'Premium', badgeDark: true, title: 'Exclusive club deals', desc: "Club deals can't be found anywhere else. Our exclusive deals save members up to 25% on booking costs." },
          { badge: 'Free', badgeDark: false, title: 'View last minute offers', desc: 'Hear about late availability and cancellations so you can snap up dates before others.' },
        ]
        const itemsHtml = pItems.map(item => {
          const badgeBg = item.badgeDark ? pText : '#e5e7eb'
          const badgeColor = item.badgeDark ? '#ffffff' : '#374151'
          return `<div class="pk-item">
        <span class="pk-badge" style="background-color:${badgeBg};color:${badgeColor}">${escHtml(item.badge || '')}</span>
        <h3 class="pk-title" style="color:${pText}">${escHtml(item.title || '')}</h3>
        <p class="pk-desc">${escHtml(item.desc || '')}</p>
      </div>`
        }).join('\n      ')
        return `<section class="pk-section" style="background-color:${pBg}">
  <div class="pk-card">
    <div class="pk-leaf"><svg viewBox="0 0 100 100" fill="none"><path d="M10 90C10 90 20 40 90 10M90 10C90 10 40 20 10 90ZM90 10C70 30 60 60 60 60M10 90C30 70 60 60 60 60" stroke="${pText}" stroke-width="2" stroke-linecap="round"/></svg></div>
    <div class="pk-inner">
      <div class="pk-left">
        <div class="pk-img-wrap">
          <img src="${escHtml(pImage)}" alt="" class="pk-img" />
        </div>
      </div>
      <div class="pk-right">
        <h2 class="pk-heading" style="color:${pText}">${escHtml(pHeading)}</h2>
        <div class="pk-grid">
          ${itemsHtml}
        </div>
      </div>
    </div>
  </div>
</section>`
}
