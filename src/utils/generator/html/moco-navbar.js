import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function mocoNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const mnLogo = props.mocoLogo || 'Moco'
        const mnAccent = props.mocoAccent || '#f97316'
        const mnBg = styles?.backgroundColor || '#0d0d1a'
        const mnColor = styles?.color || '#ffffff'
        const mnLogin = props.mocoLoginText || 'Login'
        const mnLoginHref = props.mocoLoginHref || '#'
        const mnLinks = props.links || [
          { text: 'Home', href: '#' }, { text: 'Collection', href: '#' },
          { text: 'Category', href: '#' }, { text: 'Pricing', href: '#' },
        ]
        const desktopLinks = mnLinks.map((l, i) =>
          `<a href="${escHtml(l.href)}" class="mn-link${i === 0 ? ' mn-link-active' : ''}">${escHtml(l.text)}</a>`
        ).join('\n          ')
        const hamBtn = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
        const mobileLinks = mnLinks.map(l =>
          `<a href="${escHtml(l.href)}" class="mn-mobile-link" onclick="this.closest('.mn-wrapper').querySelector('.mn-mobile-menu').classList.remove('open')">${escHtml(l.text)}</a>`
        ).join('\n    ')
        return `<div class="mn-wrapper" style="--mn-accent:${mnAccent};--mn-bg:${mnBg};--mn-color:${mnColor}">
  <nav class="mn-nav" style="background-color:${mnBg}">
    <div class="mn-logo" style="color:${mnColor}">${escHtml(mnLogo)}<span style="color:${mnAccent}">.</span></div>
    <div class="mn-links">
      ${desktopLinks}
    </div>
    <a href="${escHtml(mnLoginHref)}" class="mn-login">${escHtml(mnLogin)}</a>
    <button class="mn-ham" onclick="this.closest('.mn-wrapper').querySelector('.mn-mobile-menu').classList.toggle('open')">${hamBtn}</button>
  </nav>
  <div class="mn-mobile-menu">
    ${mobileLinks}
    <button class="mn-mobile-btn" onclick="this.closest('.mn-mobile-menu').classList.remove('open')">${escHtml(mnLogin)}</button>
  </div>
</div>`
}
