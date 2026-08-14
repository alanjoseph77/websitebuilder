import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function presentSection(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const psAccent = props.presentAccent || '#4f46e5'
        const psHeading = props.presentHeading || 'The quickest way to create modern presentation'
        const psDesc = props.presentDesc || 'Best software platform for running an internet business.'
        const psBtnText = props.presentBtnText || 'Explore All'
        const psBtnHref = props.presentBtnHref || '#'
        const psBg = styles?.backgroundColor || '#f8fafc'
        const psColor = styles?.color || '#111827'
        const psAccentBg = psAccent + '1a'

        const psCards = [1, 2, 3, 4].map((n) => ({
          title: props[`presentCard${n}Title`] || ['Management', 'Entertainment', 'Marketing', 'References'][n - 1],
          desc: props[`presentCard${n}Desc`] || 'Software platform for running your new internet business',
          iconBg: props[`presentCard${n}IconBg`] || ['#eff6ff', '#f9fafb', '#fff7ed', '#fefce8'][n - 1],
          iconColor: props[`presentCard${n}IconColor`] || ['#3b82f6', '#4b5563', '#f97316', '#eab308'][n - 1],
        }))

        const psIconPaths = [
          `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
          `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
          `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
          `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>`,
        ]

        const cardHtml = psCards.map((c, i) => `
    <div class="ps-card">
      <div class="ps-icon-wrap" style="background-color:${c.iconBg}">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${c.iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${psIconPaths[i]}</svg>
      </div>
      <h3 class="ps-card-title">${escHtml(c.title)}</h3>
      <p class="ps-card-desc">${escHtml(c.desc)}</p>
    </div>`).join('')

        return `<section class="ps-section" style="background-color:${psBg}">
  <div class="ps-container">
    <div class="ps-grid">
      <div class="ps-cards-grid">${cardHtml}
      </div>
      <div class="ps-content">
        <div>
          <h2 class="ps-heading" style="color:${psColor}">${escHtml(psHeading)}</h2>
          <p class="ps-desc">${escHtml(psDesc)}</p>
          <a href="${psBtnHref}" class="ps-btn" style="background-color:${psAccentBg};color:${psAccent}">
            ${escHtml(psBtnText)}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="ps-arrow"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </a>
        </div>
        <div class="ps-socials">
          <p class="ps-follow-label">Follow us</p>
          <div class="ps-soc-row">
            <a href="${escHtml(props.presentFb || '#')}" class="ps-soc"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="${escHtml(props.presentIg || '#')}" class="ps-soc"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="${escHtml(props.presentTw || '#')}" class="ps-soc"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
}
