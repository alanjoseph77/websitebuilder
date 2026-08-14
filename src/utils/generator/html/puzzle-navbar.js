import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function puzzleNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const pAccent = props.puzzleAccent || '#f97316'
        const pBg = styles?.backgroundColor || '#fdf6f0'
        const pText = styles?.color || '#0f172a'
        const pReg = props.puzzleRegisterText || 'Register'
        const pLogin = props.puzzleLoginText || 'Log in'
        const pRegColor = props.puzzleRegBtnColor || pAccent
        const pLoginBg = props.puzzleLoginBtnBg || pAccent
        const pLoginTxt = props.puzzleLoginBtnText || '#ffffff'
        const PPATH = "M20,12V10a2,2,0,0,0-2-2,2,2,0,0,1-2-2,2,2,0,0,0-2-2H12V2a2,2,0,0,0-2-2A2,2,0,0,0,8,2V4H6A2,2,0,0,0,4,6,2,2,0,0,1,2,8,2,2,0,0,0,0,10v2a2,2,0,0,0,2,2,2,2,0,0,1,2,2,2,2,0,0,0,2,2H8v2a2,2,0,0,0,2,2,2,2,0,0,0,2-2V20h2a2,2,0,0,0,2-2,2,2,0,0,1,2-2,2,2,0,0,0,2-2Z"
        const linksHtml = (props.links || []).map((l, i) => {
          const href = normalizeHref(l.href)
          return `      <a href="${href}"${i === 0 ? ' class="pzl-active"' : ''} style="color:${i === 0 ? pAccent : '#64748b'}">${escHtml(l.text)}</a>`
        }).join('\n')
        const mobileLinkHtml = (props.links || []).map((l, i) => {
          const href = normalizeHref(l.href)
          return `    <a href="${href}" style="display:block;padding:11px 0;text-decoration:none;color:${i === 0 ? pAccent : pText};font-weight:${i === 0 ? '700' : '500'};font-size:0.95rem;border-bottom:1px solid rgba(0,0,0,0.06)">${escHtml(l.text)}</a>`
        }).join('\n')
        return `<header class="pzl-nav" style="background-color:${pBg}">
  <div class="pzl-nav-inner">
    <div class="pzl-logo" style="color:${pText}">
      <svg style="width:32px;height:32px;fill:${pAccent}" viewBox="0 0 24 24"><path d="${PPATH}"/></svg>
      <span>${escHtml(props.brand || 'puzle')}</span>
    </div>
    <nav class="pzl-nav-links">
${linksHtml}
    </nav>
    <div class="pzl-nav-auth">
      <button class="pzl-btn-reg" style="color:${pRegColor};border-color:${pRegColor}">${escHtml(pReg)}</button>
      <button class="pzl-btn-login" style="background-color:${pLoginBg};color:${pLoginTxt}">${escHtml(pLogin)}</button>
    </div>
    <button class="pzl-hamburger" id="pzlMenuBtn" onclick="pzlToggleMenu()" style="background-color:${pLoginBg};color:${pLoginTxt}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
    </button>
  </div>
  <div class="pzl-mobile-menu" id="pzlMobileMenu" style="background-color:${pBg};border-top:2px solid ${pAccent}20">
${mobileLinkHtml}
    <div class="pzl-mobile-auth">
      <button class="pzl-btn-reg" style="color:${pRegColor};border-color:${pRegColor}">${escHtml(pReg)}</button>
      <button class="pzl-btn-login" style="background-color:${pLoginBg};color:${pLoginTxt}">${escHtml(pLogin)}</button>
    </div>
  </div>
</header>`
}
