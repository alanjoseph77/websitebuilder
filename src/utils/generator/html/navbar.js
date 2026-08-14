import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function navbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const tpl = props.navTemplate || 'default'
        const layout = props.navLayout || 'classic'
        const linkStyle = props.navLinkStyle || 'plain'
        const effect = props.navEffect || 'none'
        const links = props.links || []
        const half = Math.ceil(links.length / 2)

        // Sidebar templates — output placeholder comment; layout handled by generateSidebarPageHTML
        if (tpl === 'sidebar' || tpl === 'sidebar-tabs') {
          return `<!-- sidebar navigation rendered as layout element -->`
        }

        // Puzzle game navbar
        if (tpl === 'puzzle') {
          const pAccent = props.puzzleAccent || '#f97316'
          const pBg = styles.backgroundColor || '#fdf6f0'
          const pText = styles.color || '#0f172a'
          const pReg = props.puzzleRegisterText || 'Register'
          const pLogin = props.puzzleLoginText || 'Log in'
          const pRegColor = props.puzzleRegBtnColor || pAccent
          const pLoginBg = props.puzzleLoginBtnBg || pAccent
          const pLoginText = props.puzzleLoginBtnText || '#ffffff'
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
      <button class="pzl-btn-login" style="background-color:${pLoginBg};color:${pLoginText}">${escHtml(pLogin)}</button>
    </div>
    <button class="pzl-hamburger" id="pzlMenuBtn" onclick="pzlToggleMenu()" style="background-color:${pLoginBg};color:${pLoginText}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
    </button>
  </div>
  <div class="pzl-mobile-menu" id="pzlMobileMenu" style="background-color:${pBg};border-top:2px solid ${pAccent}20">
${mobileLinkHtml}
    <div class="pzl-mobile-auth">
      <button class="pzl-btn-reg" style="color:${pRegColor};border-color:${pRegColor}">${escHtml(pReg)}</button>
      <button class="pzl-btn-login" style="background-color:${pLoginBg};color:${pLoginText}">${escHtml(pLogin)}</button>
    </div>
  </div>
</header>`
        }

        // Trend skincare navbar
        if (tpl === 'trend') {
          const tAccent = props.trendAccent || '#e91e63'
          const tBg = styles.backgroundColor || '#ffffff'
          const tText = styles.color || '#1e293b'
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

        // Food neo-brutalist navbar
        if (tpl === 'food') {
          const fnAccent = props.foodAccent || '#e67e22'
          const fnDark = props.foodDark || '#2d3436'
          const fnBg = styles?.backgroundColor || '#fff0eb'
          const fnBrand = props.foodBrand || props.brand || 'Ideatefood'
          const fnLogin = props.foodLoginText || 'Log In'
          const fnLoginHref = props.foodLoginHref || '#'
          const fnLoginBg = props.foodLoginBg || '#ffffff'
          const fnLoginColor = props.foodLoginColor || fnDark
          const fnSignup = props.foodSignupText || 'Sign Up'
          const fnSignupHref = props.foodSignupHref || '#'
          const fnSignupBg = props.foodSignupBg || fnDark
          const fnSignupColor = props.foodSignupColor || '#ffffff'
          const fnLinks = links.length ? links : [
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
      </div>
      ${fnLogoUrl ? `<img src="${escHtml(fnLogoUrl)}" alt="${escHtml(fnBrand)}" style="height:32px;object-fit:contain;" />` : `<span class="fn-brand" style="color:${fnDark}">${escHtml(fnBrand)}</span>`}
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

        // Classic minimal navbar
        if (tpl === 'classic-minimal') {
          const cAccent = props.classicCtaColor || '#6366f1'
          const cCta = props.classicCtaText || 'Get Started'
          const cCtaHref = props.classicCtaHref || '#'
          const cBrand = props.brand || 'Brand'
          const cBg = styles?.backgroundColor || '#ffffff'
          const cText = styles?.color || '#111827'
          const uid = `cm${idx}`
          const linksHtml = links.map(l =>
            `<a href="${escHtml(l.href)}" style="padding:8px 16px;border-radius:8px;font-size:0.9rem;font-weight:500;text-decoration:none;color:${cText};transition:all 0.15s">${escHtml(l.text)}</a>`
          ).join('')
          const mobLinks = links.map(l =>
            `<a href="${escHtml(l.href)}" style="display:block;padding:10px 12px;border-radius:8px;text-decoration:none;color:${cText};font-weight:500;font-size:0.95rem;margin-bottom:4px">${escHtml(l.text)}</a>`
          ).join('')
          return `<nav style="background-color:${cBg};border-bottom:1px solid #e5e7eb;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:1200px;margin:0 auto;padding:14px 40px;display:flex;align-items:center;justify-content:space-between">
    <div style="font-weight:800;font-size:1.3rem;color:${cText};letter-spacing:-0.02em">${escHtml(cBrand)}</div>
    <div class="cm-links-${uid}" style="display:flex;align-items:center;gap:4px">${linksHtml}</div>
    <a href="${escHtml(cCtaHref)}" class="cm-cta-${uid}" style="padding:9px 22px;border-radius:8px;background-color:${cAccent};color:#fff;text-decoration:none;font-weight:600;font-size:0.9rem">${escHtml(cCta)}</a>
    <button class="cm-ham-${uid}" onclick="var m=document.getElementById('${uid}-mob');m.style.display=m.style.display==='block'?'none':'block'" style="display:none;background:none;border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;cursor:pointer;color:${cText};font-size:1.1rem;line-height:1">&#9776;</button>
  </div>
  <div id="${uid}-mob" style="display:none;border-top:1px solid #e5e7eb;padding:12px 20px 16px;background-color:${cBg}">
    ${mobLinks}
    <a href="${escHtml(cCtaHref)}" style="display:block;margin-top:8px;padding:11px 22px;border-radius:8px;background-color:${cAccent};color:#fff;text-decoration:none;font-weight:600;text-align:center">${escHtml(cCta)}</a>
  </div>
</nav>`
        }

        // Glass floating navbar
        if (tpl === 'glass-floating') {
          const gAccent = props.glassAccent || '#a78bfa'
          const gBg = styles?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          const gText = styles?.color || '#ffffff'
          const gBrand = props.brand || 'Brand'
          const uid = `gf${idx}`
          const linksHtml = links.map(l =>
            `<a href="${escHtml(l.href)}" style="padding:7px 18px;border-radius:10px;font-size:0.88rem;font-weight:500;text-decoration:none;color:${gText};transition:all 0.2s">${escHtml(l.text)}</a>`
          ).join('')
          const mobLinks = links.map(l =>
            `<a href="${escHtml(l.href)}" style="display:block;padding:10px 14px;border-radius:10px;text-decoration:none;color:${gText};font-weight:500;font-size:0.95rem;margin-bottom:4px">${escHtml(l.text)}</a>`
          ).join('')
          return `<div style="background:${gBg};padding:20px 24px;font-family:system-ui,-apple-system,sans-serif">
  <nav style="max-width:900px;margin:0 auto;background-color:rgba(255,255,255,0.12);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:16px;border:1px solid rgba(255,255,255,0.2);padding:16px 32px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 32px rgba(0,0,0,0.1)">
    <div style="font-weight:800;font-size:1.2rem;color:${gText}">${escHtml(gBrand)}</div>
    <div class="gf-links-${uid}" style="display:flex;gap:4px">${linksHtml}</div>
    <button class="gf-ham-${uid}" onclick="var m=document.getElementById('${uid}-mob');m.style.display=m.style.display==='block'?'none':'block'" style="display:none;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:10px;padding:8px 14px;cursor:pointer;color:${gText};font-size:1rem">&#9776;</button>
  </nav>
  <div id="${uid}-mob" style="display:none;max-width:900px;margin:8px auto 0;background-color:rgba(255,255,255,0.12);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:16px;border:1px solid rgba(255,255,255,0.2);padding:12px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.1)">
    ${mobLinks}
  </div>
</div>`
        }

        // Shop / e-commerce navbar
        if (tpl === 'shop') {
          const shAccent = props.shopAccent || '#ef4444'
          const shBrand = props.brand || 'ShopCo'
          const shSearch = props.shopSearchPlaceholder || 'Search products...'
          const shCart = props.shopCartCount !== undefined ? String(props.shopCartCount) : '3'
          const shBg = styles?.backgroundColor || '#111827'
          const shText = styles?.color || '#ffffff'
          const uid = `sh${idx}`
          const linksHtml = links.map(l =>
            `<a href="${escHtml(l.href)}" style="font-size:0.9rem;font-weight:500;text-decoration:none;color:#9ca3af;padding:6px 12px;border-radius:6px">${escHtml(l.text)}</a>`
          ).join('')
          const mobLinks = links.map(l =>
            `<a href="${escHtml(l.href)}" style="display:block;padding:10px 0;text-decoration:none;color:${shText};font-size:0.95rem;border-bottom:1px solid rgba(255,255,255,0.08)">${escHtml(l.text)}</a>`
          ).join('')
          return `<header style="background-color:${shBg};font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:1280px;margin:0 auto;padding:14px 40px;display:flex;align-items:center;gap:24px">
    <div style="font-weight:800;font-size:1.4rem;color:${shText};letter-spacing:-0.02em;flex-shrink:0">${escHtml(shBrand)}</div>
    <div class="sh-links-${uid}" style="display:flex;gap:4px">${linksHtml}</div>
    <div class="sh-search-${uid}" style="flex:1;max-width:480px;display:flex;align-items:center;gap:10px;background-color:rgba(255,255,255,0.08);border-radius:10px;padding:9px 16px;margin:0 auto">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input type="text" placeholder="${escHtml(shSearch)}" style="background:transparent;border:none;outline:none;color:${shText};font-size:0.88rem;width:100%;font-family:inherit" />
    </div>
    <div style="display:flex;align-items:center;gap:12px;flex-shrink:0">
      <a href="#cart" style="position:relative;display:inline-flex;align-items:center;color:${shText}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span style="position:absolute;top:-8px;right:-8px;background-color:${shAccent};color:#fff;border-radius:50%;width:18px;height:18px;font-size:0.65rem;font-weight:700;display:flex;align-items:center;justify-content:center">${escHtml(shCart)}</span>
      </a>
      <button class="sh-ham-${uid}" onclick="var m=document.getElementById('${uid}-mob');m.style.display=m.style.display==='block'?'none':'block'" style="display:none;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:8px 12px;cursor:pointer;color:${shText};font-size:1rem">&#9776;</button>
    </div>
  </div>
  <div id="${uid}-mob" style="display:none;padding:12px 20px 16px;border-top:1px solid rgba(255,255,255,0.08);background-color:${shBg}">
    ${mobLinks}
  </div>
</header>`
        }

        // Otaga pill-links + social navbar
        if (tpl === 'otaga') {
          const oAccent = props.otagaAccent || '#60a5fa'
          const oBorder = props.otagaPillBorder || '#f3f4f6'
          const oBg = styles?.backgroundColor || '#ffffff'
          const oText = styles?.color || '#000000'
          const oBrand = props.brand || 'OTAGA'
          const oSocials = props.otagaSocials || [
            { type: 'instagram', url: '#' }, { type: 'dribbble', url: '#' }, { type: 'linkedin', url: '#' }
          ]
          const OTG_SVG = {
            instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
            dribbble: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
            linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
            twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
            github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
            youtube: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>`,
            facebook: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
            behance: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h7.5a3.5 3.5 0 1 1 0 7H3V7z"/><path d="M3 14h8.5a3.5 3.5 0 1 1 0 7H3v-7z"/><line x1="15" y1="7" x2="21" y2="7"/><path d="M21 11H15c0-2.21 1.34-4 3-4s3 1.79 3 4z"/></svg>`,
          }
          const uid = `otg${idx}`
          const linksHtml = links.map(l =>
            `<a href="${escHtml(l.href)}" style="padding:10px 28px;border:1px solid ${oBorder};border-radius:9999px;font-size:0.6875rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;color:${oText}">${escHtml(l.text)}</a>`
          ).join('')
          const socialsHtml = oSocials.map(s =>
            `<a href="${escHtml(s.url || '#')}" style="display:block;line-height:0;color:${oText}">${OTG_SVG[s.type] || OTG_SVG.instagram}</a>`
          ).join('')
          const mobLinksHtml = links.map(l =>
            `<a href="${escHtml(l.href)}" onclick="document.getElementById('${uid}-ov').style.display='none'" style="font-size:1.875rem;font-weight:900;letter-spacing:-0.05em;text-decoration:none;color:${oText};text-transform:uppercase">${escHtml(l.text)}</a>`
          ).join('')
          return `<div style="position:relative;background-color:${oBg};font-family:system-ui,-apple-system,sans-serif">
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:24px 48px;background-color:${oBg};position:relative;z-index:50">
    <div style="font-size:1.875rem;font-weight:900;letter-spacing:-0.05em;text-transform:uppercase;line-height:1;color:${oText}">${escHtml(oBrand)}<span style="color:${oAccent}">.</span></div>
    <div class="otg-links-${uid}" style="display:flex;align-items:center;gap:12px">${linksHtml}</div>
    <div class="otg-soc-${uid}" style="display:flex;align-items:center;gap:20px;border:1px solid ${oBorder};border-radius:9999px;padding:10px 24px;background-color:${oBg}">${socialsHtml}</div>
    <button class="otg-ham-${uid}" onclick="var ov=document.getElementById('${uid}-ov');ov.style.display=ov.style.display==='flex'?'none':'flex'" style="display:none;padding:10px 14px;border:1px solid ${oBorder};border-radius:9999px;background:${oBg};color:${oText};cursor:pointer;font-size:1.1rem;line-height:1">&#9776;</button>
  </nav>
  <div id="${uid}-ov" style="display:none;position:absolute;top:0;left:0;right:0;background-color:${oBg};z-index:40;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:100px 0 60px;box-shadow:0 8px 32px rgba(0,0,0,0.1)">
    <button onclick="document.getElementById('${uid}-ov').style.display='none'" style="position:absolute;top:20px;right:24px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:${oText}">&#10005;</button>
    ${mobLinksHtml}
  </div>
</div>`
        }

        let navStyles = { ...styles }
        if (effect === 'glass') {
          navStyles.backgroundColor = 'rgba(255,255,255,0.1)'
          navStyles.backdropFilter = 'blur(16px)'
          navStyles.borderBottom = '1px solid rgba(255,255,255,0.15)'
        } else if (effect === 'bold') {
          navStyles.borderBottom = '3px solid #4f6ef7'
        }
        const navSAttr = ` style="${stylesToInline(navStyles)}"`
        const navBg = styles.backgroundColor || '#1a1a2e'

        const brandHTML = effect === 'bold'
          ? `<div class="nav-brand"><span class="nav-brand-icon">${escHtml((props.brand || 'B')[0].toUpperCase())}</span><span>${escHtml(props.brand)}</span></div>`
          : `<div class="nav-brand">${escHtml(props.brand)}</div>`

        const makeLinkItem = (link, isFirst) => {
          const href = normalizeHref(link.href)
          const activeClass = isFirst ? ' class="active"' : ''
          return `<li><a href="${href}"${activeClass}>${escHtml(link.text)}</a></li>`
        }

        const makeLinksHTML = (linkItems, offset = 0) => {
          let items
          if (linkStyle === 'underline') {
            items = linkItems.map((l, i) => {
              const sep = i > 0 ? `<li><span class="nav-sep">·</span></li>` : ''
              return `${sep}${makeLinkItem(l, offset + i === 0)}`
            }).join('\n    ')
          } else {
            items = linkItems.map((l, i) => makeLinkItem(l, offset + i === 0)).join('\n    ')
          }
          return `<ul class="nav-links nav-links-${linkStyle}">\n    ${items}\n  </ul>`
        }

        const mobileLinksHTML = links.map((l) => `    <li><a href="${normalizeHref(l.href)}">${escHtml(l.text)}</a></li>`).join('\n')
        const mobileMenu = `<div class="nav-mobile-menu" style="background-color:${navBg}">\n  <ul>\n${mobileLinksHTML}\n  </ul>\n</div>`

        let navHTML
        if (layout === 'centered') {
          navHTML = `<div class="site-nav nav-layout-centered nav-effect-${effect}"${navSAttr}>
  ${brandHTML}
  ${makeLinksHTML(links)}
  <button class="nav-hamburger" aria-label="Toggle menu">&#9776;</button>
</div>`
        } else if (layout === 'split') {
          navHTML = `<nav class="site-nav nav-layout-split nav-effect-${effect}"${navSAttr}>
  <div class="nav-split-left">${makeLinksHTML(links.slice(0, half), 0)}</div>
  ${brandHTML}
  <div class="nav-split-right">${makeLinksHTML(links.slice(half), half)}</div>
  <button class="nav-hamburger" aria-label="Toggle menu">&#9776;</button>
</nav>`
        } else {
          navHTML = `<nav class="site-nav nav-layout-classic nav-effect-${effect}"${navSAttr}>
  ${brandHTML}
  ${makeLinksHTML(links)}
  <button class="nav-hamburger" aria-label="Toggle menu">&#9776;</button>
</nav>`
        }
        return navHTML + '\n' + mobileMenu
}
