import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function trendNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const tAccent = props.trendAccent || '#e91e63'
        const tBg = styles?.backgroundColor || '#ffffff'
        const tText = styles?.color || '#1e293b'
        const tSearch = props.trendSearchPlaceholder || 'Search'
        const linksHtml = (props.links || []).map((l, i) => {
          const href = normalizeHref(l.href)
          return `      <a href="${href}"${i === 0 ? ' class="active"' : ''} style="color:${i === 0 ? tAccent : '#64748b'}">${escHtml(l.text)}</a>`
        }).join('\n')
        const mobileLinkHtml = (props.links || []).map((l, i) => {
          const href = normalizeHref(l.href)
          return `    <a href="${href}" style="display:block;padding:11px 0;text-decoration:none;color:${i === 0 ? tAccent : tText};font-weight:${i === 0 ? '700' : '500'};font-size:0.95rem;border-bottom:1px solid #f1f5f9;opacity:${i === 0 ? '1' : '0.75'}">${escHtml(l.text)}</a>`
        }).join('\n')
        return `<header class="trend-nav" style="background-color:${tBg};border-bottom:1px solid rgba(0,0,0,0.06)">
  <div class="trend-nav-inner">
    <div class="trend-logo" style="color:${tAccent}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${tAccent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> ${escHtml(props.brand || 'trend.')}</div>
    <nav class="trend-nav-links">
${linksHtml}
    </nav>
    <div class="trend-nav-right">
      <div class="trend-search-pill"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><input type="text" placeholder="${escHtml(tSearch)}" class="trend-search-input" /></div>
      <button class="trend-menu-btn" id="trendMenuBtn" onclick="trendToggleMenu()" style="background-color:${tAccent}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></button>
    </div>
  </div>
  <div class="trend-mobile-menu" id="trendMobileMenu" style="background-color:${tBg};border-top:2px solid ${tAccent}20">
${mobileLinkHtml}
  </div>
</header>`
}
