import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function foodNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const fnAccent = props.foodAccent || '#e67e22'
        const fnDark = props.foodDark || '#2d3436'
        const fnBg = styles?.backgroundColor || '#fff0eb'
        const fnBrand = props.foodBrand || 'Ideatefood'
        const fnLogoUrl = props.foodLogoUrl
        const fnLogin = props.foodLoginText || 'Log In'
        const fnLoginHref = props.foodLoginHref || '#'
        const fnLoginBg = props.foodLoginBg || '#ffffff'
        const fnLoginColor = props.foodLoginColor || fnDark
        const fnSignup = props.foodSignupText || 'Sign Up'
        const fnSignupHref = props.foodSignupHref || '#'
        const fnSignupBg = props.foodSignupBg || fnDark
        const fnSignupColor = props.foodSignupColor || '#ffffff'
        const fnLinks = props.links || [
          { text: 'Home', href: '#' }, { text: 'Food list', href: '#' },
          { text: 'Blog', href: '#' }, { text: 'Contact', href: '#' },
        ]
        const linksHtml = fnLinks.map((l, i) =>
          `<a href="${escHtml(l.href)}" class="fn-link${i === 0 ? ' fn-link-active' : ''}">${escHtml(l.text)}</a>`
        ).join('\n        ')

        return `<nav class="fn-nav" style="background-color:${fnBg}">
  <div class="fn-nav-inner">
    <div class="fn-logo">
      <div class="fn-logo-box" style="background-color:${fnAccent};border-color:${fnDark}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
          <line x1="6" y1="17" x2="18" y2="17"/>
        </svg>
      </div>
      <span class="fn-brand" style="color:${fnDark}">${escHtml(fnBrand)}</span>
    </div>
    <div class="fn-links">
      ${linksHtml}
    </div>
    <div class="fn-actions">
      <a href="${escHtml(fnLoginHref)}" class="fn-btn fn-btn-login" style="background-color:${fnLoginBg};border-color:${fnDark};color:${fnLoginColor};box-shadow:3px 3px 0 ${fnDark}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        ${escHtml(fnLogin)}
      </a>
      <a href="${escHtml(fnSignupHref)}" class="fn-btn fn-btn-signup" style="background-color:${fnSignupBg};color:${fnSignupColor};border-color:${fnDark};box-shadow:4px 4px 0 ${fnAccent}">${escHtml(fnSignup)}</a>
    </div>
    <button class="fn-hamburger" style="background-color:${fnDark}" onclick="this.closest('nav').querySelector('.fn-mobile-menu').classList.toggle('open')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </div>
  <div class="fn-mobile-menu" style="background-color:${fnBg}">
    ${fnLinks.map(l => `<a href="${escHtml(l.href)}" class="fn-link">${escHtml(l.text)}</a>`).join('\n    ')}
  </div>
</nav>`
}
