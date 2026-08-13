/**
 * Generates clean HTML/CSS code from builder state.
 */

function stylesToInline(styles) {
  return Object.entries(styles || {})
    .map(([k, v]) => {
      const kebab = k.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
      return `${kebab}: ${v}`
    })
    .join('; ')
}

/** Normalize "/" to "index.html" so links work when opened as local files */
function normalizeHref(href) {
  if (!href || href === '#') return href || '#'
  if (href === '/') return 'index.html'
  if (href.startsWith('#') && href.length > 1) {
    const id = href.substring(1)
    if (!/^[a-zA-Z]/.test(id)) return `#el-${id}`
  }
  return href
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function getPageFilename(page) {
  return page.name.toLowerCase() === 'home' ? 'index.html' : slugify(page.name) + '.html'
}

// ── Sidebar icon SVGs (same logic as React component) ────────────────────────
function getSidebarIconSVG(text, size = 18) {
  const t = (text || '').toLowerCase()
  const attrs = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${size}" height="${size}"`
  if (t.includes('home') || t.includes('dashboard') || t.includes('overview'))
    return `<svg ${attrs}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`
  if (t.includes('setting'))
    return `<svg ${attrs}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  if (t.includes('user') || t.includes('team') || t.includes('people'))
    return `<svg ${attrs}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  if (t.includes('analytic') || t.includes('report') || t.includes('stat') || t.includes('chart'))
    return `<svg ${attrs}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  if (t.includes('inbox') || t.includes('message') || t.includes('mail'))
    return `<svg ${attrs}><polyline points="22,12 16,12 14,15 10,15 8,12 2,12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`
  if (t.includes('product') || t.includes('store') || t.includes('shop'))
    return `<svg ${attrs}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
  if (t.includes('file') || t.includes('doc') || t.includes('page'))
    return `<svg ${attrs}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`
  if (t.includes('search') || t.includes('explore'))
    return `<svg ${attrs}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
  return `<svg ${attrs}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
}

// ── Sidebar HTML builder ──────────────────────────────────────────────────────
function generateSidebarNavHTML(sidebarEl, currentFile, isTabs) {
  const props = sidebarEl.props || {}
  const styles = sidebarEl.styles || {}
  const links = props.links || []
  const brand = props.brand || 'Dashboard'
  const accentColor = props.sidebarAccent || '#818cf8'
  const navBg = styles.backgroundColor || '#1e1b4b'
  const textColor = styles.color || '#c7d2fe'
  const userInitials = props.sidebarUserInitials || 'AB'
  const userName = props.sidebarUserName || 'Admin User'
  const userRole = props.sidebarUserRole || 'Administrator'
  const brandInitial = brand.charAt(0).toUpperCase()

  if (isTabs) {
    const linksHTML = links.map((link) => {
      const href = normalizeHref(link.href)
      const isActive = href === currentFile
      return `    <a href="${href}" class="sbt-link${isActive ? ' active' : ''}" title="${escHtml(link.text)}" style="color:${isActive ? accentColor : textColor};border-left:3px solid ${isActive ? accentColor : 'transparent'};background:${isActive ? accentColor + '18' : 'transparent'}">${getSidebarIconSVG(link.text)}</a>`
    }).join('\n')

    return `<aside class="sbt-nav" id="sbtNav" style="background-color:${navBg}">
  <div class="sbt-brand" style="background-color:${accentColor}">${brandInitial}</div>
  <div class="sbt-sep" style="background-color:rgba(255,255,255,0.1)"></div>
  <nav class="sbt-links">
${linksHTML}
  </nav>
  <div class="sbt-user" style="background-color:${accentColor}40;color:${accentColor};border:2px solid ${accentColor}50">${userInitials}</div>
</aside>`
  }

  // Full sidebar
  const linksHTML = links.map((link) => {
    const href = normalizeHref(link.href)
    const isActive = href === currentFile
    return `    <a href="${href}" class="sb-link${isActive ? ' active' : ''}" style="color:${isActive ? '#fff' : textColor};background:${isActive ? accentColor : 'transparent'}">
      <span class="sb-icon">${getSidebarIconSVG(link.text)}</span>
      <span class="sb-label">${escHtml(link.text)}</span>
    </a>`
  }).join('\n')

  return `<aside class="sb-nav" id="sbNav" style="background-color:${navBg}">
  <div class="sb-header" style="border-bottom:1px solid rgba(255,255,255,0.07)">
    <div class="sb-brand" style="color:#fff">${escHtml(brand)}</div>
    <button class="sb-collapse-btn" id="sbCollapseBtn" onclick="sbToggleCollapse()" title="Collapse sidebar" style="color:${textColor}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
    </button>
  </div>
  <nav class="sb-links">
${linksHTML}
  </nav>
  <div class="sb-user" style="border-top:1px solid rgba(255,255,255,0.07)">
    <div class="sb-avatar" style="background-color:${accentColor}55;color:${accentColor}">${userInitials}</div>
    <div class="sb-user-info">
      <strong style="color:#fff">${escHtml(userName)}</strong>
      <small style="color:${textColor};opacity:0.6">${escHtml(userRole)}</small>
    </div>
  </div>
</aside>`
}

function generateElementHTML(el, idx) {
  const { type, props, styles } = el
  const inlineStyle = stylesToInline(styles)
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : ''

  // Navbar types that should NOT get a section id wrapper
  const NAVBAR_TYPES = new Set([
    'navbar', 'puzzle-navbar', 'trend-navbar', 'food-navbar',
    'agensea-navbar', 'creative-navbar', 'qi-navbar', 'solemate-navbar',
    'homehero-navbar', 'moco-navbar', 'lumora-navbar',
  ])

  // Compute the inner HTML, then wrap with id so anchor links (#element-id) work in downloads
  const innerHtml = (() => {

    switch (type) {
      case 'navbar': {
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

      case 'hero': {
        const btn1 = props.buttonText
          ? `<a href="${normalizeHref(props.buttonHref || '#')}" class="btn btn-primary">${escHtml(props.buttonText)}</a>`
          : ''
        const btn2 = props.buttonSecondaryText
          ? `<a href="${normalizeHref(props.buttonSecondaryHref || '#')}" class="btn btn-outline">${escHtml(props.buttonSecondaryText)}</a>`
          : ''
        const btns = [btn1, btn2].filter(Boolean).join('\n    ')
        return `<section class="hero"${sAttr}>
  <h1>${escHtml(props.title)}</h1>
  <p>${escHtml(props.subtitle)}</p>
  <div class="hero-btns">
    ${btns}
  </div>
</section>`
      }

      case 'section': {
        const sLayout = props.layout || 'stack'
        const sGap = props.gap || '24px'
        const colCount = { '2-col': 2, '3-col': 3, '4-col': 4 }[sLayout]
        const children = el.children || []
        const anchorId = props.sectionId || el.id?.slice(0, 8)
        let childrenHTML = ''
        if (children.length > 0) {
          const childContent = children.map((child, ci) => {
            const html = generateElementHTML(child, `${idx}-${ci}`)
            if (colCount && child.props?.gridSpan === 'full') return `<div style="grid-column: 1 / -1">\n${html}\n</div>`
            return html
          }).join('\n')
          childrenHTML = colCount
            ? `\n<div class="section-grid section-grid-${colCount}" style="--col-gap:${sGap}">\n${childContent}\n</div>`
            : '\n' + childContent
        }
        return `<section${sAttr}${anchorId ? ` id="${anchorId}"` : ''}>
  ${props.title ? `<h2>${escHtml(props.title)}</h2>` : ''}
  ${props.subtitle ? `<p class="subtitle">${escHtml(props.subtitle)}</p>` : ''}${childrenHTML}
</section>`
      }

      case 'columns': {
        const cols = (props.columns || []).map((col) => `    <div class="column">
      ${col.icon ? `<div class="col-icon">${col.icon}</div>` : ''}
      <h3>${escHtml(col.title || '')}</h3>
      <p>${escHtml(col.text || '')}</p>
    </div>`).join('\n')
        return `<section class="columns-section"${sAttr}>
  <div class="columns-grid">
${cols}
  </div>
</section>`
      }

      case 'footer': {
        const links = (props.links || []).map((l) => `    <a href="${normalizeHref(l.href)}">${escHtml(l.text)}</a>`).join('\n')
        return `<footer${sAttr}>
  <div class="footer-brand">${escHtml(props.brand)}</div>
  ${props.tagline ? `<p class="footer-tagline">${escHtml(props.tagline)}</p>` : ''}
  <nav class="footer-links">
${links}
  </nav>
  <p class="copyright">${escHtml(props.copyright || '')}</p>
</footer>`
      }

      case 'heading': {
        const Tag = props.level || 'h2'
        return `<${Tag}${sAttr}>${escHtml(props.text)}</${Tag}>`
      }

      case 'paragraph':
        return `<p${sAttr}>${escHtml(props.text)}</p>`

      case 'quote':
        return `<blockquote${sAttr}>
  <p>${escHtml(props.text)}</p>
  ${props.author ? `<cite>${escHtml(props.author)}</cite>` : ''}
</blockquote>`

      case 'image':
        return `<figure${sAttr}>
  <img src="${props.src}" alt="${escHtml(props.alt || '')}" style="max-width:100%; border-radius:8px; display:block; margin:0 auto;" />
  ${props.caption ? `<figcaption style="text-align:center; margin-top:8px; color:#666; font-size:0.85rem;">${escHtml(props.caption)}</figcaption>` : ''}
</figure>`

      case 'video':
        return `<div class="video-wrapper"${sAttr}>
  <div class="video-responsive">
    <iframe src="${props.src}" title="${escHtml(props.title || 'Video')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</div>`

      case 'button': {
        const variant = props.variant || 'primary'
        return `<div${sAttr}>
  <a href="${normalizeHref(props.href || '#')}" class="btn btn-${variant}">${escHtml(props.text)}</a>
</div>`
      }

      case 'card':
        return `<div class="card-wrapper"${sAttr}>
  <div class="card">
    ${props.image ? `<img src="${props.image}" alt="${escHtml(props.title || '')}" class="card-img" />` : ''}
    <div class="card-body">
      <h3 class="card-title">${escHtml(props.title || '')}</h3>
      <p class="card-text">${escHtml(props.text || '')}</p>
      ${props.buttonText ? `<a href="${normalizeHref(props.buttonHref || '#')}" class="card-link">${escHtml(props.buttonText)} &rarr;</a>` : ''}
    </div>
  </div>
</div>`

      case 'list': {
        const Tag = props.variant === 'ol' ? 'ol' : 'ul'
        const items = (props.items || []).map((item) => `  <li>${escHtml(item)}</li>`).join('\n')
        return `<${Tag}${sAttr}>\n${items}\n</${Tag}>`
      }

      case 'form':
        return `<section class="form-section"${sAttr}>
  ${props.title ? `<h2>${escHtml(props.title)}</h2>` : ''}
  ${props.subtitle ? `<p class="form-subtitle">${escHtml(props.subtitle)}</p>` : ''}
  <form class="contact-form" method="post">
    <div class="form-group">
      <label for="name">Full Name</label>
      <input type="text" id="name" name="name" placeholder="John Doe" required />
    </div>
    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" placeholder="john@example.com" required />
    </div>
    <div class="form-group">
      <label for="subject">Subject</label>
      <input type="text" id="subject" name="subject" placeholder="How can we help?" />
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>
    </div>
    <button type="submit" class="btn btn-primary">${escHtml(props.submitText || 'Send Message')}</button>
  </form>
</section>`

      case 'divider':
        return `<div${sAttr}><hr style="border:none; border-top:1px ${props.style || 'solid'} currentColor; opacity:0.3;" /></div>`

      case 'spacer':
        return `<div style="height:${props.height || '60px'}"></div>`

      case 'counter': {
        const stats = (props.stats || []).map((s) => `    <div class="stat">
      <div class="stat-number">${escHtml(s.number)}</div>
      <div class="stat-label">${escHtml(s.label)}</div>
    </div>`).join('\n')
        return `<section class="stats-section"${sAttr}>
  <div class="stats-grid">
${stats}
  </div>
</section>`
      }

      case 'testimonial':
        return `<section class="testimonial-section"${sAttr}>
  ${props.avatar ? `<img src="${props.avatar}" alt="${escHtml(props.author || '')}" class="testimonial-avatar" />` : ''}
  <blockquote class="testimonial-text">"${escHtml(props.text)}"</blockquote>
  <div class="testimonial-author">
    <strong>${escHtml(props.author || '')}</strong>
    ${props.role ? `<span class="testimonial-role">${escHtml(props.role)}</span>` : ''}
  </div>
</section>`

      case 'puzzle-navbar': {
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

      case 'trend-navbar': {
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

      case 'trend-hero': {
        const thAccent = props.trendAccent || '#e91e63'
        const thHeading = props.trendHeading || 'Bring brand in life'
        const thHighlight = props.trendHighlight || 'brand'
        const thDesc = props.trendDescription || 'Brand cream is a sunshine cream good for your skin care.'
        const thCtaText = props.trendCtaText || 'Shop Now'
        const thCtaHref = props.trendCtaHref || '#'
        const thRev = props.trendReviewCount || '10k+'
        const thRating = props.trendRating || '4.5'
        const thImg = props.trendProductImage || 'https://placehold.co/280x380/e91e63/ffffff?text=Product'
        const thF1 = props.trendFeature1 || 'Organic'
        const thF1D = props.trendFeature1Desc || 'Natural ingredients delivered fresh.'
        const thF2 = props.trendFeature2 || 'Aroma'
        const thF2D = props.trendFeature2Desc || 'Refreshing scents for all skin types.'
        const thF3 = props.trendFeature3 || 'Botanic'
        const thF3D = props.trendFeature3Desc || 'Plant-based formulas with proven results.'
        const thVideoText = props.trendVideoText || 'SEE PRODUCT VIDEO NOW'
        const thVideoLink = props.trendVideoLink || '#'
        const thBg = styles?.backgroundColor || '#ffffff'
        const thColor = styles?.color || '#1e293b'
        
        let headingHtml = escHtml(thHeading)
        if (thHighlight) {
          const idx = thHeading.indexOf(thHighlight)
          if (idx !== -1) {
            headingHtml = escHtml(thHeading.slice(0, idx)) + 
              `<span class="th-hi" style="color:${thAccent}"><span class="th-hi-box" style="border-color:${thAccent}"></span>${escHtml(thHighlight)}</span>` + 
              escHtml(thHeading.slice(idx + thHighlight.length))
          }
        }

        return `<section class="th-sec" style="background-color:${thBg};color:${thColor}">
  <div class="th-blob th-blob-1" style="background-color:${thAccent}"></div>
  <div class="th-blob th-blob-2" style="background-color:${thAccent}"></div>
  <div class="th-left">
    <h1 class="th-h1">${headingHtml} <span style="color:${thAccent}">→</span></h1>
    <p class="th-desc">${escHtml(thDesc)}</p>
    <a href="${escHtml(thCtaHref)}" class="th-cta" style="background-color:${thAccent}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      ${escHtml(thCtaText)}
    </a>
    <div class="th-proof">
      <div class="th-avatars">
        <img src="https://i.pravatar.cc/100?u=a1" alt="" /><img src="https://i.pravatar.cc/100?u=a2" alt="" /><img src="https://i.pravatar.cc/100?u=a3" alt="" /><img src="https://i.pravatar.cc/100?u=a4" alt="" />
      </div>
      <div class="th-rating">
        <div class="th-stars">
          <svg width="14" height="14" fill="${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <span>${escHtml(thRev)} Customers • ${escHtml(thRating)} Rating</span>
      </div>
    </div>
  </div>
  <div class="th-center">
    <div class="th-img-bg" style="background-color:${thAccent}"></div>
    <img src="${escHtml(thImg)}" alt="" class="th-img" />
    <a href="${escHtml(thVideoLink)}" class="th-vid" target="_blank">
      <svg viewBox="0 0 100 100" class="th-vid-text"><path id="th-circle-path" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none"/><text fill="${thColor}"><textPath href="#th-circle-path">${escHtml(thVideoText)} • ${escHtml(thVideoText)} • </textPath></text></svg>
      <div class="th-vid-play" style="background-color:${thColor};color:${thBg}"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
    </a>
  </div>
  <div class="th-right">
    <div class="th-feat">
      <p class="th-feat-num">01</p>
      <h3 class="th-feat-h">${escHtml(thF1)}</h3>
      <p class="th-feat-p">${escHtml(thF1D)}</p>
    </div>
    <div class="th-feat th-feat-hi" style="background-color:${thAccent}">
      <p class="th-feat-num" style="color:#fff">02</p>
      <h3 class="th-feat-h" style="color:#fff">${escHtml(thF2)}</h3>
      <p class="th-feat-p" style="color:#fff;opacity:0.9">${escHtml(thF2D)}</p>
    </div>
    <div class="th-feat">
      <p class="th-feat-num">03</p>
      <h3 class="th-feat-h">${escHtml(thF3)}</h3>
      <p class="th-feat-p">${escHtml(thF3D)}</p>
    </div>
  </div>
</section>`
      }

      case 'food-navbar': {
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

      case 'food-hero': {
        const fhAccent = props.foodAccent || '#e67e22'
        const fhDark = props.foodDark || '#2d3436'
        const fhBg = styles?.backgroundColor || '#fff0eb'
        const fhTitle = props.foodHeroTitle || 'Welcome to'
        const fhBrand = props.foodHeroBrand || 'Ideatefood'
        const fhSubheading = props.foodHeroSubheading || "Hungry? We've got you covered."
        const fhDesc = props.foodHeroDesc || 'Fresh, chef-quality meals delivered straight to your door from the best local kitchens.'
        const fhCtaText = props.foodHeroCtaText || 'Start Ordering'
        const fhCtaHref = props.foodHeroCtaHref || '#'
        const fhTrustText = props.foodHeroTrustText || 'Trusted by 10,000+ foodies'
        const fhImage = props.foodHeroImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
        const fhBadgeText = props.foodHeroBadgeText || '50% OFF'
        const fhBadgeSub = props.foodHeroBadgeSub || 'First Order'

        return `<section class="fh-section" style="background-color:${fhBg}">
  <div class="fh-title-wrap">
    <h1 class="fh-title" style="color:${fhDark}">
      ${escHtml(fhTitle)}<br>
      <span class="fh-brand" style="--fh-accent:${fhAccent}">${escHtml(fhBrand)}</span>
    </h1>
  </div>
  <div class="fh-grid">
    <div class="fh-left">
      <h2 class="fh-subheading" style="color:${fhAccent}">${escHtml(fhSubheading)}</h2>
      <p class="fh-desc">${escHtml(fhDesc)}</p>
      <div class="fh-cta-wrap">
        <a href="${escHtml(fhCtaHref)}" class="fh-cta" style="border-color:${fhDark};box-shadow:8px 8px 0px 0px ${fhDark}">
          <span class="fh-cta-text" style="color:${fhDark}">${escHtml(fhCtaText)}</span>
          <span class="fh-cta-circle" style="background-color:${fhAccent};border-color:${fhDark}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </span>
        </a>
      </div>
      <div class="fh-trust">
        <div class="fh-avatars">
          <img src="https://i.pravatar.cc/100?u=4" class="fh-avatar" style="border-color:${fhDark}" alt="">
          <img src="https://i.pravatar.cc/100?u=5" class="fh-avatar" style="border-color:${fhDark}" alt="">
          <img src="https://i.pravatar.cc/100?u=6" class="fh-avatar" style="border-color:${fhDark}" alt="">
        </div>
        <p class="fh-trust-text">${escHtml(fhTrustText)}</p>
      </div>
    </div>
    <div class="fh-right">
      <div class="fh-blob"></div>
      <div class="fh-img-wrap">
        <div class="fh-img-card" style="border-color:${fhDark};box-shadow:12px 12px 0px 0px ${fhDark}">
          <img src="${escHtml(fhImage)}" alt="Food" class="fh-img">
        </div>
        <div class="fh-badge" style="background-color:${fhAccent};border-color:${fhDark};box-shadow:6px 6px 0px 0px ${fhDark}">
          <p class="fh-badge-main">${escHtml(fhBadgeText)}</p>
          <p class="fh-badge-sub">${escHtml(fhBadgeSub)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`
      }

      case 'food-categories': {
        const fcAccent = props.foodAccent || '#e67e22'
        const fcDark = props.foodDark || '#2d3436'
        const fcBg = styles?.backgroundColor || '#fff0eb'
        const fcTitle = props.foodCategoriesTitle || 'Browse Categories'
        const fcItems = props.foodCategories || [
          { icon: '🍔', name: 'Burgers' }, { icon: '🍕', name: 'Pizza' },
          { icon: '🍣', name: 'Sushi' }, { icon: '🥗', name: 'Healthy' },
          { icon: '🍩', name: 'Desserts' }, { icon: '☕', name: 'Coffee' }
        ]
        const itemsHtml = fcItems.map(c => 
          `<div class="fc-card" style="border-color:${fcDark};box-shadow:4px 4px 0px 0px ${fcDark}">
            <div class="fc-icon" style="background-color:${fcAccent};border-color:${fcDark};box-shadow:2px 2px 0px 0px ${fcDark}">${escHtml(c.icon)}</div>
            <span class="fc-name" style="color:${fcDark}">${escHtml(c.name)}</span>
          </div>`
        ).join('\n        ')
        return `<section class="fc-section" style="background-color:${fcBg}">
  <div class="fc-inner">
    <h2 class="fc-heading" style="color:${fcDark}">${escHtml(fcTitle)}</h2>
    <div class="fc-grid">${itemsHtml}</div>
  </div>
</section>`
      }

      case 'food-items': {
        const fiAccent = props.foodAccent || '#e67e22'
        const fiDark = props.foodDark || '#2d3436'
        const fiBg = styles?.backgroundColor || '#fff0eb'
        const fiTitle = props.foodItemsTitle || 'Popular Dishes'
        const fiItems = props.foodItems || [
          { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600', name: 'Classic Smashburger', desc: 'Double beef patty, melted cheese, house sauce on a toasted brioche bun.', price: '$12.99' },
          { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600', name: 'Pepperoni Pizza', desc: 'Wood-fired crust, San Marzano tomato sauce, mozzarella, and crispy pepperoni.', price: '$16.50' },
          { image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=600', name: 'Spicy Tuna Roll', desc: 'Fresh tuna, spicy mayo, cucumber, topped with sesame seeds and scallions.', price: '$14.00' },
        ]
        const itemsHtml = fiItems.map(item => 
          `<div class="fi-card" style="border-color:${fiDark};box-shadow:6px 6px 0px 0px ${fiDark}">
            <div class="fi-img-wrap" style="border-bottom-color:${fiDark}">
              <img src="${escHtml(item.image)}" alt="${escHtml(item.name)}" class="fi-img">
              <div class="fi-price" style="background-color:${fiAccent};border-color:${fiDark};box-shadow:2px 2px 0px 0px ${fiDark}">${escHtml(item.price)}</div>
            </div>
            <div class="fi-content">
              <h3 class="fi-name" style="color:${fiDark}">${escHtml(item.name)}</h3>
              <p class="fi-desc">${escHtml(item.desc)}</p>
              <button class="fi-btn" style="background-color:${fiDark};border-color:${fiDark};box-shadow:4px 4px 0px 0px ${fiAccent}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Add to Cart
              </button>
            </div>
          </div>`
        ).join('\n        ')
        return `<section class="fi-section" style="background-color:${fiBg}">
  <div class="fi-inner">
    <h2 class="fi-heading" style="color:${fiDark}">${escHtml(fiTitle)}</h2>
    <div class="fi-grid">${itemsHtml}</div>
  </div>
</section>`
      }

      case 'food-footer': {
        const ffAccent = props.foodAccent || '#e67e22'
        const ffDark = props.foodDark || '#2d3436'
        const ffBg = styles?.backgroundColor || '#fff0eb'
        const ffBrand = props.foodFooterBrand || 'Ideatefood'
        const ffLogoUrl = props.foodFooterLogoUrl
        const ffText = props.foodFooterText || 'Delivering happiness to your door.'
        const ffCopyright = props.foodFooterCopyright || '© 2026 Ideatefood. All rights reserved.'
        
        let socialHtml = ''
        if (props.foodFbUrl) {
          socialHtml += `<a href="${escHtml(props.foodFbUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>`
        }
        if (props.foodIgUrl) {
          socialHtml += `<a href="${escHtml(props.foodIgUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>`
        }
        if (props.foodTwUrl) {
          socialHtml += `<a href="${escHtml(props.foodTwUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>`
        }
        if (!socialHtml) {
          socialHtml = [1,2,3].map(i => `<div class="ff-soc" style="background-color:${ffAccent}"><div style="width:20px;height:20px;background-color:#fff;border-radius:50%"></div></div>`).join('')
        }

        return `<footer class="ff-footer" style="background-color:${ffBg}">
  <div class="ff-inner" style="background-color:${ffDark}">
    <div class="ff-left">
      ${ffLogoUrl ? `<img src="${escHtml(ffLogoUrl)}" alt="${escHtml(ffBrand)}" class="ff-logo-img" />` : `<h2 class="ff-brand">${escHtml(ffBrand)}</h2>`}
      <p class="ff-text">${escHtml(ffText)}</p>
    </div>
    <div class="ff-socials">${socialHtml}</div>
  </div>
  <div class="ff-copyright-wrap">
    <p class="ff-copyright">${escHtml(ffCopyright)}</p>
  </div>
</footer>`
      }

      case 'present-section': {
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

      case 'sell-home-section': {
        const shBg = styles?.backgroundColor || '#ffffff'
        const shColor = styles?.color || '#0f172a'
        const shAccent = props.shAccent || '#2563eb'
        const shBtnBg = props.shBtnBg || '#0f172a'
        const shBtnColor = props.shBtnColor || '#ffffff'
        const shHeading = props.shHeading || 'Sell your home.'
        const shHighlight = props.shHighlight || 'Skip the hard parts.'
        const shDesc = props.shDesc || "We've redesigned the home selling process to be faster, simpler, and entirely on your terms."
        const shBtnText = props.shBtnText || 'Get Started Today'
        const shBtnHref = props.shBtnHref || '#'

        const steps = [
          { label: props.shStep1Label || 'Step 1', title: props.shStep1Title || 'Get an offer in minutes', desc: props.shStep1Desc || 'Answer a few questions and receive a preliminary cash offer in minutes.', image: props.shStep1Image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800', align: 'right' },
          { label: props.shStep2Label || 'Step 2', title: props.shStep2Title || 'Do a video walkthrough', desc: props.shStep2Desc || 'Show us your home through your smartphone so we can verify details.', image: props.shStep2Image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800', align: 'left' },
          { label: props.shStep3Label || 'Step 3', title: props.shStep3Title || 'Close and move, stress-free', desc: props.shStep3Desc || "Choose your closing date. Get paid within days and move when you're ready.", image: props.shStep3Image || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800', align: 'right' },
        ]

        const stepsHtml = steps.map((s) => `
    <div class="sh-stagger">
      <div class="sh-step sh-step-${escHtml(s.align)}">
        <div class="sh-img-wrap">
          <img src="${escHtml(s.image)}" alt="${escHtml(s.title)}" class="sh-img">
        </div>
        <div class="sh-step-text">
          <span class="sh-label" style="color:${shAccent}">${escHtml(s.label)}</span>
          <h3 class="sh-step-title" style="color:${shColor}">${escHtml(s.title)}</h3>
          <p class="sh-step-desc">${escHtml(s.desc)}</p>
        </div>
      </div>
    </div>`).join('')

        return `<section class="sh-section" style="background-color:${shBg}">
  <div class="sh-inner">
    <div class="sh-left">
      <h2 class="sh-heading" style="color:${shColor}">${escHtml(shHeading)}<br><span style="color:${shAccent}">${escHtml(shHighlight)}</span></h2>
      <p class="sh-desc">${escHtml(shDesc)}</p>
      <a href="${escHtml(shBtnHref)}" class="sh-btn" style="background-color:${shBtnBg};color:${shBtnColor}">${escHtml(shBtnText)}</a>
    </div>
    <div class="sh-right">${stepsHtml}
    </div>
  </div>
</section>`
      }

      case 'perks-section': {
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

      case 'trusted-brands': {
        const tbBg = styles?.backgroundColor || '#0a0a0a'
        const tbColor = styles?.color || '#ffffff'
        const tbAccent = props.tbAccentColor || '#fbbf24'
        const tbBadge = escHtml(props.tbBadgeText || 'Our Clients')
        const tbHeading = escHtml(props.tbHeading || 'Trusted By Global Brands')
        const tbDesc = escHtml(props.tbDescription || 'We deliver tailored marketing solutions designed to scale your brand and drive measurable results.')
        const tbBtnText = escHtml(props.tbButtonText || 'View all')
        const tbBtnHref = normalizeHref(props.tbButtonHref || '#')
        const tbI1 = props.tbIcon1 || 'fa-brands fa-golang'
        const tbI2 = props.tbIcon2 || 'fa-brands fa-slack'
        const tbI3 = props.tbIcon3 || 'fa-brands fa-facebook-f'
        const tbI4 = props.tbIcon4 || 'fa-brands fa-vuejs'
        return `<section class="tb-section" style="background-color:${tbBg};color:${tbColor}">
  <div class="tb-glow"></div>
  <div class="tb-badge"><span>${tbBadge}</span></div>
  <h1 class="tb-heading">${tbHeading}</h1>
  <p class="tb-desc">${tbDesc}</p>
  <div class="tb-map">
    <svg class="tb-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
      <path d="M 200 225 L 600 225" stroke="gray" stroke-width="1" fill="none"/>
      <path d="M 400 100 L 400 350" stroke="gray" stroke-width="1" fill="none"/>
      <path d="M 150 150 L 250 150 M 150 150 L 150 300" stroke="gray" stroke-width="1" fill="none"/>
      <path d="M 650 150 L 550 150 M 650 150 L 650 300" stroke="gray" stroke-width="1" fill="none"/>
      <circle r="2" fill="${tbAccent}"><animateMotion dur="4s" repeatCount="indefinite" path="M 200 225 L 400 225"/></circle>
      <circle r="2" fill="${tbAccent}"><animateMotion dur="5s" repeatCount="indefinite" path="M 600 225 L 400 225"/></circle>
    </svg>
    <div class="tb-center">
      <div class="tb-center-ring"></div>
      <div class="tb-center-core" style="background-color:${tbAccent}"><i class="fa-solid fa-cube"></i></div>
    </div>
    <div class="tb-node tb-n1 tb-float" style="animation-delay:0s"><div class="tb-node-inner"><i class="${tbI1}" style="color:#60a5fa"></i></div></div>
    <div class="tb-node tb-n2 tb-float" style="animation-delay:1s"><div class="tb-node-inner"><i class="${tbI2}" style="color:#c084fc"></i></div></div>
    <div class="tb-node tb-n3 tb-float" style="animation-delay:2s"><div class="tb-node-inner"><i class="${tbI3}" style="color:#2563eb"></i></div></div>
    <div class="tb-node tb-n4 tb-float" style="animation-delay:3s"><div class="tb-node-inner"><i class="${tbI4}" style="color:#34d399"></i></div></div>
    <div class="tb-node tb-n5 tb-float" style="animation-delay:0.5s"><div class="tb-node-inner tb-node-lg"><i class="fa-solid fa-earth-americas" style="color:#ef4444"></i></div></div>
    <div class="tb-node tb-n6 tb-float" style="animation-delay:1.5s"><div class="tb-node-inner tb-node-lg"><i class="fa-solid fa-microchip" style="color:#22c55e"></i></div></div>
  </div>
  <div class="tb-cta">
    <a href="${tbBtnHref}" class="tb-btn">${tbBtnText} <i class="fa-solid fa-arrow-right-long"></i></a>
  </div>
</section>`
      }

      case 'veluno-navbar': {
        const bg = styles?.backgroundColor || '#ffffff'
        const color = styles?.color || '#000000'
        const brand = escHtml(props.vlBrand || 'Veluno')
        const searchPlaceholder = escHtml(props.vlSearchPlaceholder || 'Search products...')
        const cartCount = escHtml(props.vlCartCount || '0')
        const profileImg = props.vlProfileImg || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        const navLinksHtml = (props.links || []).map((l, i) =>
          `<a href="${normalizeHref(l.href)}" class="vl-nav-item">${escHtml(l.text)}</a>`
        ).join('')

        return `<header class="vl-nav" style="background-color:${bg};color:${color}">
  <div class="vl-brand-flex">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor"/></svg>
    <span class="vl-brand-text">${brand}</span>
  </div>
  <nav class="vl-links">
    ${navLinksHtml}
  </nav>
  <div class="vl-actions">
    <div class="vl-search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="${searchPlaceholder}" class="vl-search-input" />
    </div>
    <div class="vl-icons">
      <button class="vl-cart-btn" style="color:inherit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <button class="vl-cart-btn" style="color:inherit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        ${parseInt(cartCount) > 0 ? `<span class="vl-cart-badge">${cartCount}</span>` : ''}
      </button>
      <img src="${profileImg}" alt="Profile" class="vl-profile-img" />
    </div>
  </div>
</header>`
      }

      case 'veluno-hero': {
        const bg = styles?.backgroundColor || '#0c0c0c'
        const color = styles?.color || '#ffffff'
        const hl = escHtml(props.vlHeadingLeft || 'Glow')
        const hr = escHtml(props.vlHeadingRight || '& Care')
        const text = escHtml(props.vlDesc || 'Veluno is your go-to destination for modern and versatile beauty.\nWe bring together timeless care and premium quality to your routine.').replace(/\n/g, '<br/>')
        const scrollText = escHtml(props.vlScrollText || 'Scroll Down')
        const img1 = props.vlLeftImage || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=90&w=1200'
        const img2 = props.vlRightImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=90&w=1200'

        let tagsHtml = ''
        const t1 = props.vlTag1, t2 = props.vlTag2, t3 = props.vlTag3
        if (t1 || t2 || t3) {
          tagsHtml = '<div class="vl-tags">'
          if (t1) tagsHtml += `<span>${escHtml(t1)}</span>`
          if (t1 && t2) tagsHtml += `<div class="vl-dot"></div>`
          if (t2) tagsHtml += `<span>${escHtml(t2)}</span>`
          if (t2 && t3) tagsHtml += `<div class="vl-dot"></div>`
          if (t3) tagsHtml += `<span>${escHtml(t3)}</span>`
          tagsHtml += '</div>'
        }

        return `<main class="vl-hero" style="background-color:${bg};color:${color}">
  <div class="vl-divider"></div>
  <div class="vl-img-box"><img src="${img1}" alt="" class="vl-img" /><div class="vl-overlay-l"></div></div>
  <div class="vl-img-box"><img src="${img2}" alt="" class="vl-img" /><div class="vl-overlay-r"></div></div>
  <div class="vl-content">
    <h1 class="vl-h1">${hl} <span>${hr}</span></h1>
    <p class="vl-desc">${text}</p>
    <div class="vl-scroll">
      <div class="vl-scroll-ind">
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="width:1px;height:32px;background:linear-gradient(to bottom,currentColor,transparent);margin-bottom:-2px;"></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      <span class="vl-scroll-text">${scrollText}</span>
    </div>
  </div>
  ${tagsHtml}
</main>`
      }

      case 'winzy-navbar': {
        const bg = styles?.backgroundColor || '#0a0a0a'
        const color = styles?.color || '#ffffff'
        const brand = escHtml(props.wzBrand || 'Winzy')
        const btnText = escHtml(props.wzBtnText || 'Get Started')
        const navLinksHtml = (props.links || []).map((l, i) =>
          `<a href="${normalizeHref(l.href)}" class="wz-nav-item">${escHtml(l.text)}</a>`
        ).join('')

        return `<header class="wz-nav" style="background-color:${bg};color:${color}">
  <div class="wz-brand">
    <div class="wz-brand-icon">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
    </div>
    <span class="wz-brand-text">${brand}</span>
  </div>
  <nav class="wz-links">
    ${navLinksHtml}
  </nav>
  <button class="wz-btn">${btnText}</button>
  <button class="wz-ham">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  </button>
</header>`
      }

      case 'winzy-hero': {
        const bg = styles?.backgroundColor || '#0a0a0a'
        const color = styles?.color || '#ffffff'
        const bgImg = props.wzBgImg || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000'
        const h1 = escHtml(props.wzHeadline || 'Explore New Horizons with Every Journey')
        const desc = escHtml(props.wzDesc || 'Discover unique cultures, stunning landscapes, and unforgettable moments every step of the way.')
        const btn = escHtml(props.wzBtnText || 'Get started')
        const cImg = props.wzCardImg || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'
        const cStep = escHtml(props.wzCardStep || '01/10')
        const cTag = escHtml(props.wzCardTag || 'Tour')
        const cDesc = escHtml(props.wzCardDesc || 'Explore Brazil with local flavors and guided adventures')
        const uCount = escHtml(props.wzUsersCount || '10K+ users')
        const textRot = escHtml(props.wzRotateText || 'Explore more • Explore more • Explore more • ')

        return `<section class="wz-hero" style="background-color:${bg};color:${color}">
  <div class="wz-bg"><img src="${bgImg}" alt="" /><div class="wz-bg-grad"></div></div>
  <div class="wz-container">
    <div class="wz-grid">
      <div class="wz-left">
        <h1 class="wz-h1">${h1}</h1>
        <p class="wz-desc">${desc}</p>
        <div>
          <button class="wz-left-btn">
            ${btn}
            <div class="wz-btn-icon"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></div>
          </button>
        </div>
      </div>
      <div class="wz-right">
        <div class="wz-card">
          <div class="wz-card-img-wrap"><img src="${cImg}" alt="" class="wz-card-img" /><div class="wz-card-img-grad"></div></div>
          <div class="wz-card-progress">
            <span class="wz-card-step">${cStep}</span>
            <div class="wz-bars">
              <div class="wz-bar wz-bar-active"></div>
              <div class="wz-bar wz-bar-inactive"></div>
              <div class="wz-bar wz-bar-inactive"></div>
            </div>
          </div>
          <div class="wz-card-text">
            <h3 class="wz-card-tag">${cTag}</h3>
            <p class="wz-card-desc">${cDesc}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="wz-footer">
      <div class="wz-users">
        <div class="wz-avatars">
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
        </div>
        <p class="wz-users-text">${uCount}</p>
      </div>
      
      <div class="wz-rotator">
        <div class="wz-rotator-inner">
          <div class="wz-rotator-btn">
            <div class="wz-rotator-icon"><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg></div>
          </div>
        </div>
        <svg class="wz-rotator-svg" viewBox="0 0 100 100">
          <defs><path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" /></defs>
          <text fill="white" style="font-size:7px;font-weight:500;letter-spacing:0.2em;opacity:0.6;text-transform:uppercase;">
            <textPath href="#circlePath">${textRot}</textPath>
          </text>
        </svg>
      </div>
      
      <div class="wz-social">
        <p class="wz-social-text">Follow us</p>
        <div class="wz-icons">
          <a class="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          <a class="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
          <a class="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
        </div>
      </div>
    </div>
  </div>
</section>`
      }

      
      case 'make-navbar': {
        const mnBg = styles?.backgroundColor || '#0f172a'
        const mnColor = styles?.color || '#ffffff'
        const mnAccent = props.makeAccent || '#a855f7'
        const mnBrand = props.brand || 'Make'
        const mnLinks = props.links || []
        const linksHtml = mnLinks.map(l => `<a href="${escHtml(l.href)}" class="mkn-link">${escHtml(l.text)}</a>`).join('\n        ')

        return `<nav class="mkn-nav" style="background-color:${mnBg};color:${mnColor}">
  <div class="mkn-brand">
    <div class="mkn-logo" style="background:linear-gradient(135deg, ${mnAccent}, #3b82f6)"></div>
    ${escHtml(mnBrand)}
  </div>
  <div class="mkn-links">${linksHtml}</div>
  <div class="mkn-actions">
    <a href="#" class="mkn-login">Log in</a>
    <a href="#" class="mkn-btn" style="background-color:${mnColor};color:${mnBg}">Get Started</a>
  </div>
</nav>`
      }

      case 'make-hero': {
        const mhBg = styles?.backgroundColor || '#0f172a'
        const mhColor = styles?.color || '#ffffff'
        const mhAccent = props.makeAccent || '#a855f7'
        const mhHeading = props.makeHeading || 'Design, build, and automate anything'
        const mhDesc = props.makeDesc || 'From tasks and workflows to apps and systems, build and automate anything in one powerful visual platform.'
        const mhCtaText = props.makeCtaText || 'Get started free'
        const mhCta2Text = props.makeSecondaryCtaText || 'Contact Sales'
        const mhImage = props.makeImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'

        return `<section class="mkh-sec" style="background-color:${mhBg};color:${mhColor}">
  <div class="mkh-glow" style="background:radial-gradient(circle, ${mhAccent}40 0%, transparent 70%)"></div>
  <div class="mkh-inner">
    <h1 class="mkh-h1">${escHtml(mhHeading)}</h1>
    <p class="mkh-desc">${escHtml(mhDesc)}</p>
    <div class="mkh-btns">
      <a href="#" class="mkh-btn-1" style="background:linear-gradient(135deg, ${mhAccent}, #3b82f6);box-shadow:0 10px 30px ${mhAccent}40">${escHtml(mhCtaText)}</a>
      <a href="#" class="mkh-btn-2">${escHtml(mhCta2Text)}</a>
    </div>
    <div class="mkh-img-wrap">
      <div class="mkh-browser-bar">
        <div class="mkh-dot" style="background:#ef4444"></div>
        <div class="mkh-dot" style="background:#eab308"></div>
        <div class="mkh-dot" style="background:#22c55e"></div>
      </div>
      <img src="${escHtml(mhImage)}" alt="App Interface" class="mkh-img" />
    </div>
  </div>
</section>`
      }


      case 'make-features': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.mfAccent || '#a855f7'
        const mfHeading = props.mfHeading || ''
        const mfFeatures = props.mfFeatures || []
        const featuresHtml = mfFeatures.map(f => `
          <div class="mf-card">
            <div class="mf-icon" style="background:linear-gradient(135deg, ${accent}40, transparent); border:1px solid ${accent}40">${escHtml(f.icon)}</div>
            <h3 class="mf-title">${escHtml(f.title)}</h3>
            <p class="mf-desc">${escHtml(f.desc)}</p>
          </div>
        `).join('')

        return `<section class="mf-sec" style="background-color:${bg};color:${color}">
  <div class="mf-inner">
    <h2 class="mf-h2">${escHtml(mfHeading)}</h2>
    <div class="mf-grid">${featuresHtml}</div>
  </div>
</section>`
      }

      case 'make-integrations': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.miAccent || '#a855f7'
        const miHeading = props.miHeading || ''
        const miCtaText = props.miCtaText || ''
        const miIcons = props.miIcons || []
        const iconsHtml = miIcons.map(icon => `<div class="mi-icon" style="background:${icon.bg}">${escHtml(icon.text)}</div>`).join('')

        return `<section class="mi-sec" style="background-color:${bg};color:${color}">
  <div class="mi-glow" style="background:radial-gradient(circle, ${accent}30 0%, transparent 70%)"></div>
  <div class="mi-inner">
    <h2 class="mi-h2">${escHtml(miHeading)}</h2>
    <div class="mi-grid">${iconsHtml}</div>
    <a href="#" class="mi-cta" style="color:${accent}">${escHtml(miCtaText)} <span>→</span></a>
  </div>
</section>`
      }

      case 'make-pricing': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.mpAccent || '#a855f7'
        const mpHeading = props.mpHeading || ''
        const mpPlans = props.mpPlans || []
        const plansHtml = mpPlans.map(plan => {
          const bgStyle = plan.highlight ? `background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));border-color:${accent};transform:scale(1.05);box-shadow:0 20px 40px -10px ${accent}40` : `background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.1)`
          const popularTag = plan.highlight ? `<div class="mp-popular" style="background:${accent}">Most Popular</div>` : ''
          const btnStyle = plan.highlight ? `background:${accent}` : `background:rgba(255,255,255,0.1)`
          const featsHtml = plan.features.map(f => `<div class="mp-feat"><div class="mp-check" style="background:${accent}30;color:${accent}">✓</div>${escHtml(f)}</div>`).join('')
          
          return `<div class="mp-card" style="${bgStyle}">
            ${popularTag}
            <h3 class="mp-name">${escHtml(plan.name)}</h3>
            <p class="mp-desc">${escHtml(plan.desc)}</p>
            <div class="mp-price">${escHtml(plan.price)}<span>/mo</span></div>
            <button class="mp-btn" style="${btnStyle}">Get Started</button>
            <div class="mp-feats">${featsHtml}</div>
          </div>`
        }).join('')

        return `<section class="mp-sec" style="background-color:${bg};color:${color}">
  <div class="mp-inner">
    <h2 class="mp-h2">${escHtml(mpHeading)}</h2>
    <div class="mp-grid">${plansHtml}</div>
  </div>
</section>`
      }

      case 'make-footer': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#94a3b8'
        const accent = props.mftAccent || '#a855f7'
        const mftBrand = props.mftBrand || ''
        const mftText = props.mftText || ''
        const mftCopy = props.mftCopy || ''

        return `<footer class="mft-sec" style="background-color:${bg};color:${color}">
  <div class="mft-inner">
    <div class="mft-brand">
      <div class="mft-logo" style="background:linear-gradient(135deg, ${accent}, #3b82f6)"></div>
      ${escHtml(mftBrand)}
    </div>
    <p class="mft-text">${escHtml(mftText)}</p>
    <p class="mft-copy">${escHtml(mftCopy)}</p>
  </div>
</footer>`
      }

      case 'skyline-hero': {
        const slBg = styles?.backgroundColor || '#fdf8f4'
        const slColor = styles?.color || '#1a1a1a'
        const slAccent = props.slAccentColor || '#e86034'
        const slH1 = escHtml(props.slHeadingLine1 || 'Housing')
        const slH2 = escHtml(props.slHeadingLine2 || 'Experience')
        const slCta = escHtml(props.slCtaText || 'Find a house')
        const slCtaHref = normalizeHref(props.slCtaHref || '#')
        const slDesc = escHtml(props.slDesc || 'Discover luxurious international properties with Skyline, connecting you to top global locations effortlessly.')
        const slImg = props.slHeroImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop'
        const slTName = escHtml(props.slTestimonialName || 'Roberto Carlos')
        const slTText = escHtml(props.slTestimonialText || '"Skyline made finding my perfect home effortless with detailed listings and personalized recommendations!"')
        const slTAvatar = props.slTestimonialAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
        const slS1V = escHtml(props.slStat1Value || '200K+')
        const slS1L = escHtml(props.slStat1Label || 'Happy users')
        const slS2V = escHtml(props.slStat2Value || '5K+')
        const slS2L = escHtml(props.slStat2Label || 'Our partner')
        return `<section class="sl-hero" style="background-color:${slBg};color:${slColor}">
  <div class="sl-grid-lines"><div class="sl-grid-v"></div><div class="sl-grid-h"></div></div>
  <div class="sl-inner">
    <div class="sl-left">
      <div>
        <h1 class="sl-h1">${slH1}<br><span class="sl-h1-italic">${slH2}</span></h1>
        <a href="${slCtaHref}" class="sl-cta" style="background-color:${slAccent};box-shadow:0 15px 30px ${slAccent}66">${slCta} <i class="fa-solid fa-arrow-up" style="transform:rotate(45deg);font-size:0.85rem"></i></a>
      </div>
      <div class="sl-desc">
        <p class="sl-desc-text">${slDesc}</p>
        <div class="sl-avatars">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="">
          <img class="sl-avatar" style="border-color:${slBg}" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="">
        </div>
      </div>
    </div>
    <div class="sl-center">
      <div class="sl-oval-wrap">
        <div class="sl-oval" style="background-color:#ede4dc"><img src="${escHtml(slImg)}" alt="Hero"></div>
        <div class="sl-oval-btn" style="background-color:${slAccent};border-color:${slBg};box-shadow:0 15px 30px ${slAccent}66"><i class="fa-solid fa-arrow-up" style="transform:rotate(45deg)"></i></div>
      </div>
    </div>
    <div class="sl-right">
      <div class="sl-testimonial">
        <div class="sl-stars" style="color:${slAccent}"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <div class="sl-t-header"><span class="sl-t-name">${slTName}</span><img class="sl-t-avatar" src="${escHtml(slTAvatar)}" alt="${slTName}"></div>
        <p class="sl-t-text">${slTText}</p>
      </div>
      <div class="sl-stats-wrap">
        <div class="sl-stats">
          <div><p class="sl-stat-val">${slS1V}</p><p class="sl-stat-lab">${slS1L}</p></div>
          <div><p class="sl-stat-val">${slS2V}</p><p class="sl-stat-lab">${slS2L}</p></div>
        </div>
        <div class="sl-actions">
          <i class="fa-solid fa-arrow-down" style="font-size:1.5rem;opacity:0.7"></i>
          <div class="sl-qr-btn"><i class="fa-solid fa-qrcode"></i></div>
        </div>
      </div>
    </div>
  </div>
</section>`
      }

      case 'moco-navbar': {
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

      case 'moco-hero': {
        const mhAccent = props.mocoAccent || '#f97316'
        const mhBg = styles?.backgroundColor || '#0d0d1a'
        const mhColor = styles?.color || '#ffffff'
        const mhHeading = props.mocoHeading || 'Collect your best articles'
        const mhHLight = props.mocoHighlight || 'easily'
        const mhDesc = props.mocoDesc || 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.'
        const mhSearch = props.mocoSearchPlaceholder || 'Search'
        const mhC1T = props.mocoCard1Title || 'Business Mindset Planning'
        const mhC1Q = props.mocoCard1Quote || '"Your vision sets the tone for your future success..."'
        const mhC2T = props.mocoCard2Title || 'Key Success Of Career'
        const mhC2I = props.mocoCard2Image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
        const mhC3T = props.mocoCard3Title || 'Management'
        const mhC3I = props.mocoCard3Image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
        const mhC3A = props.mocoCard3Author || 'Courtney Henry'
        const mhC4T = props.mocoCard4Title || 'Masterplan Strategy'

        // Split heading: everything before the highlight word, and after
        const hlIdx = mhHeading.toLowerCase().indexOf(mhHLight.toLowerCase())
        const before = hlIdx >= 0 ? escHtml(mhHeading.slice(0, hlIdx)) : escHtml(mhHeading)
        const after = hlIdx >= 0 ? escHtml(mhHeading.slice(hlIdx + mhHLight.length)) : ''
        const hlSpan = hlIdx >= 0 ? `<span class="mh-highlight" style="color:${mhAccent}">${escHtml(mhHLight)}<svg class="mh-wave" viewBox="0 0 200 40" preserveAspectRatio="none"><path d="M0,20 Q50,0 100,20 T200,20" fill="none" stroke="${mhAccent}" stroke-width="4" stroke-opacity="0.6"/></svg></span>` : ''

        return `<section class="mh-section" style="background-color:${mhBg};color:${mhColor}">
  <div class="mh-blob-1" style="background:${mhAccent}30"></div>
  <div class="mh-blob-2"></div>
  <div class="mh-dots">${[...Array(16)].map(() => '<div class="mh-dot"></div>').join('')}</div>

  <div class="mh-inner">
    <!-- Left: 2x2 card grid -->
    <div class="mh-cards">
      <!-- Card 1: Cream -->
      <div class="mh-card mh-card-cream">
        <div class="mh-card-icons">
          <div class="mh-icon-circle mh-icon-orange">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div class="mh-icon-circle mh-icon-orange-faint"></div>
        </div>
        <div>
          <h3 class="mh-card-title mh-title-dark">${escHtml(mhC1T)}</h3>
          <p class="mh-card-quote">${escHtml(mhC1Q)}</p>
        </div>
      </div>
      <!-- Card 2: Image + overlay -->
      <div class="mh-card mh-card-img">
        <img src="${escHtml(mhC2I)}" alt="" class="mh-card-bg-img">
        <div class="mh-card-overlay"></div>
        <h3 class="mh-card-title mh-card-img-title">${escHtml(mhC2T)}</h3>
      </div>
      <!-- Card 3: Light blue -->
      <div class="mh-card mh-card-blue">
        <div class="mh-card-img-thumb">
          <img src="${escHtml(mhC3I)}" alt="" style="width:100%;height:100%;object-fit:cover;opacity:0.85">
        </div>
        <div>
          <h3 class="mh-card-title mh-title-navy">${escHtml(mhC3T)}</h3>
          <div class="mh-author-row">
            <div class="mh-author-dot"></div>
            <span class="mh-author-name">${escHtml(mhC3A)}</span>
          </div>
        </div>
      </div>
      <!-- Card 4: Orange accent -->
      <div class="mh-card mh-card-accent" style="background-color:${mhAccent};box-shadow:0 20px 40px ${mhAccent}33">
        <div class="mh-progress-bg"><div class="mh-progress-fill"></div></div>
        <h3 class="mh-card-title" style="color:#fff">${escHtml(mhC4T)}</h3>
      </div>
    </div>

    <!-- Right: hero text -->
    <div class="mh-hero-text">
      <div>
        <h1 class="mh-heading">${before}${hlSpan}${after}</h1>
        <p class="mh-desc">${escHtml(mhDesc)}</p>
      </div>
      <div class="mh-search-wrap">
        <svg class="mh-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" class="mh-search" placeholder="${escHtml(mhSearch)}">
      </div>
    </div>
  </div>
</section>`
      }

      case 'product-card-section': {
        const pcOuterBg = styles?.backgroundColor || '#ebecf0'
        const pcColor = styles?.color || '#1a1a1a'
        const pcAccent = props.pcAccent || '#4361ee'
        const pcImage = escHtml(props.pcImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000')
        const pcTitle = escHtml(props.pcTitle || 'SuperBook Pro')
        const pcDesc = escHtml(props.pcDescription || 'Lightning-fast performance, stunning Retina display, all-day battery life.')
        const pcPrice = escHtml(props.pcPrice || '$1499.00')
        const pcBtn1 = escHtml(props.pcBtnPrimary || 'Add To Cart')
        const pcBtn2 = escHtml(props.pcBtnSecondary || 'Buy Now')
        const pcRating = parseFloat(props.pcRating || 4.8)
        const pcRevText = escHtml(props.pcReviewText || 'Read all reviews')
        const pcRevHref = escHtml(props.pcReviewHref || '#')
        const filled = Math.round(pcRating)
        const starSvg = (op) => `<svg class="pc-star" viewBox="0 0 20 20" style="opacity:${op}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
        const stars = [1, 2, 3, 4, 5].map(n => starSvg(n <= filled ? 1 : 0.25)).join('')
        const FEAT_ICONS = {
          shipping: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>`,
          warranty: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
          returns: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>`,
        }
        const feats = (props.pcFeatures || [
          { icon: 'shipping', label: 'Free Shipping' },
          { icon: 'warranty', label: '2-Year Warranty' },
          { icon: 'returns', label: 'Easy Returns' },
        ]).map(f => `<div class="pc-feat">
          ${FEAT_ICONS[f.icon] || FEAT_ICONS.shipping}
          <p class="pc-feat-label">${escHtml(f.label)}</p>
        </div>`).join('')
        return `<section class="pc-outer" style="background-color:${pcOuterBg}">
  <div class="pc-card">
    <div class="pc-grid">
      <div class="pc-img-col">
        <img src="${pcImage}" alt="${pcTitle}" class="pc-img">
      </div>
      <div class="pc-details">
        <div>
          <h1 class="pc-title" style="color:${pcColor}">${pcTitle}</h1>
          <p class="pc-desc">${pcDesc}</p>
        </div>
        <div class="pc-buy">
          <p class="pc-price" style="color:${pcColor}">${pcPrice}</p>
          <div class="pc-btns">
            <button class="pc-btn-primary" style="background-color:${pcAccent}">${pcBtn1}</button>
            <button class="pc-btn-secondary" style="color:${pcAccent};border-color:${pcAccent}">${pcBtn2}</button>
          </div>
        </div>
        <div class="pc-rating">
          <div class="pc-stars">${stars}</div>
          <span class="pc-rating-num" style="color:${pcColor}">${pcRating} / 5</span>
          <a href="${pcRevHref}" class="pc-review-link">${pcRevText}</a>
        </div>
        <div class="pc-feats-wrap">
          <p class="pc-feats-label">Customer Benefits</p>
          <div class="pc-feats">${feats}</div>
        </div>
      </div>
    </div>
  </div>
</section>`
      }

      case 'creative-navbar': {
        const ccBg = styles?.backgroundColor || '#ffffff'
        const ccColor = styles?.color || '#1a1a1a'
        const ccBrand = escHtml(props.ccBrand || 'Creative')
        const ccLinks = props.links || [
          { text: 'Home', href: '#' }, { text: 'Portfolio', href: '#portfolio' },
          { text: 'About', href: '#about' }, { text: 'Contact', href: '#contact' },
        ]
        const desktopLinks = ccLinks.map((l, i) => `<a href="${escHtml(l.href)}" class="ccn-link${i === 0 ? ' ccn-link-active' : ''}" style="color:${i === 0 ? ccColor : '#6b7280'}">${escHtml(l.text)}</a>`).join('')
        const overlayLinks = ccLinks.map(l => `<a href="${escHtml(l.href)}" class="ccn-ovl-link" style="color:${ccColor}">${escHtml(l.text)}</a>`).join('')
        return `<header class="ccn-header" style="background-color:${ccBg}" id="ccn-${idx}">
  <div class="ccn-inner">
    <span class="ccn-brand" style="color:${ccColor}">${ccBrand}</span>
    <nav class="ccn-desktop-nav">${desktopLinks}</nav>
    <button class="ccn-ham" id="ccn-open-${idx}" style="color:${ccColor}" aria-label="Open menu">
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </div>
  <div class="ccn-overlay" id="ccn-ovl-${idx}" style="background-color:${ccBg}">
    <div class="ccn-ovl-head">
      <span class="ccn-brand" style="color:${ccColor}">${ccBrand}</span>
      <button class="ccn-close" id="ccn-close-${idx}" style="color:${ccColor}">&#x2715;</button>
    </div>
    <nav class="ccn-ovl-nav">${overlayLinks}</nav>
  </div>
</header>
<script>
(function(){
  var open=document.getElementById('ccn-open-${idx}');
  var close=document.getElementById('ccn-close-${idx}');
  var ovl=document.getElementById('ccn-ovl-${idx}');
  if(open)open.addEventListener('click',function(){ovl.classList.add('ccn-ovl-show');document.body.style.overflow='hidden';});
  if(close)close.addEventListener('click',function(){ovl.classList.remove('ccn-ovl-show');document.body.style.overflow='';});
  if(ovl)ovl.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ovl.classList.remove('ccn-ovl-show');document.body.style.overflow='';});});
})();
</script>`
      }

      case 'creative-hero': {
        const ccHeading = escHtml(props.ccHeading || 'Creative Collective')
        const ccSubtitle = escHtml(props.ccSubtitle || 'A Showcase of Innovation')
        const ccImages = props.ccHeroImages || [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000',
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000',
        ]
        const ccTextColor = styles?.color || '#ffffff'
        const dotsHtml = ccImages.map((_, i) => `<button class="cch-dot${i === 0 ? ' cch-dot-active' : ''}" onclick="cchGoTo_${idx}(${i})" aria-label="Slide ${i + 1}"></button>`).join('')
        return `<section class="cch-section" id="cch-${idx}" style="background-image:url('${escHtml(ccImages[0])}')">
  <div class="cch-overlay"></div>
  <div class="cch-content">
    <h2 class="cch-heading" style="color:${ccTextColor}">${ccHeading}</h2>
    <p class="cch-subtitle" style="color:${ccTextColor}">${ccSubtitle}</p>
  </div>
  <div class="cch-dots" id="cch-dots-${idx}">${dotsHtml}</div>
</section>
<script>
(function(){
  var imgs=${JSON.stringify(ccImages)};
  var el=document.getElementById('cch-${idx}');
  var cur=0;
  function cchSet(i){
    cur=i;
    el.style.backgroundImage="url('"+imgs[i]+"')";
    document.querySelectorAll('#cch-dots-${idx} .cch-dot').forEach(function(d,idx2){
      d.classList.toggle('cch-dot-active',idx2===i);
    });
  }
  window.cchGoTo_${idx}=function(i){cchSet(i);};
  setInterval(function(){cchSet((cur+1)%imgs.length);},5000);
})();
</script>`
      }

      case 'creative-projects': {
        const ccProjBg = styles?.backgroundColor || '#f9f9f9'
        const ccProjColor = styles?.color || '#1a1a1a'
        const ccBtnText = escHtml(props.ccBtnText || 'View Project')
        const ccProjects = props.ccProjects || []
        const cardsHtml = ccProjects.map(p => `
      <div class="ccp-card">
        <div class="ccp-img-wrap" style="background-color:${p.bgColor || '#f3f4f6'}">
          <img src="${escHtml(p.image || '')}" alt="${escHtml(p.title || '')}" class="ccp-img">
        </div>
        <div class="ccp-info">
          <div>
            <h3 class="ccp-title" style="color:${ccProjColor}">${escHtml(p.title || '')}</h3>
            <p class="ccp-cat">${escHtml(p.category || '')}</p>
          </div>
          <a href="${normalizeHref(p.href || '#')}" class="ccp-btn" style="color:${ccProjColor};text-decoration:none">${ccBtnText}</a>
        </div>
      </div>`).join('')
        return `<main class="ccp-section" style="background-color:${ccProjBg}">
  <div class="ccp-grid">${cardsHtml}
  </div>
</main>`
      }

      case 'creative-footer': {
        const ccFootBg = styles?.backgroundColor || '#ffffff'
        const ccFootColor = styles?.color || '#1a1a1a'
        const ccCopyright = escHtml(props.ccCopyright || '© Copyright CreativeCollective.com')
        return `<footer class="ccf-footer" style="background-color:${ccFootBg};color:${ccFootColor}">
  <div class="ccf-inner">
    <p class="ccf-copy">${ccCopyright}</p>
    <div class="ccf-socials">
      <a href="${escHtml(props.ccFacebookHref || '#')}" class="ccf-social" style="color:${ccFootColor}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>
      <a href="${escHtml(props.ccTwitterHref || '#')}" class="ccf-social" style="color:${ccFootColor}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
      <a href="${escHtml(props.ccInstagramHref || '#')}" class="ccf-social" style="color:${ccFootColor}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
    </div>
  </div>
</footer>`
      }

      case 'solemate-navbar': {
        const smBg = styles?.backgroundColor || '#ffffff'
        const smColor = styles?.color || '#1a1a1a'
        const smBrand = escHtml(props.smBrand || 'SoleMate')
        const smPlaceholder = escHtml(props.smSearchPlaceholder || 'Search')
        const smCartCount = escHtml(props.smCartCount || '1')
        const smLinks = props.links || [
          { text: 'Home', href: '#' },
          { text: 'Shop', href: '#shop' },
          { text: 'About Us', href: '#about' },
        ]
        const navLinksHtml = smLinks.map((l) => `<a href="${escHtml(l.href)}" class="smn-link" data-smn-href="${escHtml(l.href)}">${escHtml(l.text)}</a>`).join('')
        return `<header class="smn-header" style="background-color:${smBg};color:${smColor}">
  <div class="smn-inner">
    <div class="smn-search-wrap">
      <input type="text" placeholder="${smPlaceholder}" class="smn-search" style="color:${smColor};background:${smBg}">
      <svg class="smn-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    </div>
    <div class="smn-center">
      <div class="smn-links">
        ${navLinksHtml}
        <div class="smn-cart">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          <span class="smn-cart-count">${smCartCount}</span>
        </div>
      </div>
      <h1 class="smn-brand" style="color:${smColor}">${smBrand}</h1>
    </div>
    <div class="smn-spacer"></div>
  </div>
</header>`
      }

      case 'solemate-hero': {
        const smHeroImages = props.smHeroImages || [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1605733513597-a8f8d410fe3c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
        ]
        const smCtaText = escHtml(props.smHeroCtaText || 'Shop Now')
        const smCtaHref = normalizeHref(props.smHeroCtaHref || '#')
        const panelsHtml = smHeroImages.map(img => `
    <div class="smh-panel">
      <img src="${escHtml(img)}" alt="Panel" class="smh-panel-img">
      <div class="smh-overlay"><a href="${smCtaHref}" class="smh-btn" style="text-decoration:none;display:inline-block">${smCtaText}</a></div>
    </div>`).join('')
        return `<section class="smh-grid">${panelsHtml}
</section>`
      }

      case 'solemate-categories': {
        const smCatBg = styles?.backgroundColor || '#ffffff'
        const smCatColor = styles?.color || '#1a1a1a'
        const catLabels = props.smCatLabels || ["Men's", "Women's", "New Arrivals", "Sale"]
        const allImages = [
          props.smImgsMens || [],
          props.smImgsWomens || [],
          props.smImgsNew || [],
          props.smImgsSale || [],
        ]
        const jsCatData = JSON.stringify(allImages)
        const tabsHtml = catLabels.map((label, i) =>
          `<button class="smc-tab${i === 2 ? ' smc-tab-active' : ''}" onclick="smSwitchCat_${idx}(this,${i})" style="color:${smCatColor}">${escHtml(label)}</button>`
        ).join('')
        const defaultImgs = (allImages[2] || []).map(img => `<img src="${escHtml(img)}" class="smc-img" style="transition:opacity 0.3s">`).join('')
        return `<section class="smc-section" style="background-color:${smCatBg};color:${smCatColor}">
  <div class="smc-wrap">
    <div class="smc-tabs" id="smc-tabs-${idx}">${tabsHtml}</div>
    <div class="smc-grid" id="smc-grid-${idx}">${defaultImgs}</div>
  </div>
</section>
<script>
var smCatData_${idx} = ${jsCatData};
function smSwitchCat_${idx}(btn, tabIdx) {
  document.querySelectorAll('#smc-tabs-${idx} .smc-tab').forEach(function(t){t.classList.remove('smc-tab-active');});
  btn.classList.add('smc-tab-active');
  var imgs = document.querySelectorAll('#smc-grid-${idx} img');
  var newSrcs = smCatData_${idx}[tabIdx] || [];
  imgs.forEach(function(img,i){ img.style.opacity='0'; setTimeout(function(){ img.src=newSrcs[i]||''; img.style.opacity='1'; },280); });
}
</script>`
      }

      case 'solemate-products': {
        const smProdBg = styles?.backgroundColor || '#ffffff'
        const smProdColor = styles?.color || '#1a1a1a'
        const smTitle = escHtml(props.smFeaturedTitle || 'Featured Products')
        const smBtnTxt = escHtml(props.smCartBtnText || 'Add to Cart')
        const smProds = props.smProducts || []
        const prodsHtml = smProds.map(p => `
      <div class="smp-card">
        <div class="smp-img-wrap"><img src="${escHtml(p.image || '')}" alt="${escHtml(p.name || '')}" class="smp-img"></div>
        <h3 class="smp-name" style="color:${smProdColor}">${escHtml(p.name || '')}</h3>
        <p class="smp-price">${escHtml(p.price || '')}</p>
        <button class="smp-btn">${smBtnTxt}</button>
      </div>`).join('')
        return `<section class="smp-section" style="background-color:${smProdBg}">
  <div class="smp-wrap">
    <h2 class="smp-title" style="color:${smProdColor}">${smTitle}</h2>
    <div class="smp-grid">${prodsHtml}
    </div>
  </div>
</section>`
      }

      case 'solemate-footer': {
        const smFootBg = styles?.backgroundColor || '#000000'
        const smFootColor = styles?.color || '#ffffff'
        const smFooterLinks = props.smFooterLinks || [
          { text: 'Contact Us', href: '#' },
          { text: 'Privacy Policy', href: '#' },
        ]
        const footLinksHtml = smFooterLinks.map(l => `<a href="${escHtml(l.href)}" class="smf-link" style="color:${smFootColor}">${escHtml(l.text)}</a>`).join('')
        return `<footer class="smf-footer" style="background-color:${smFootBg};color:${smFootColor}">
  <div class="smf-inner">
    <div class="smf-links">${footLinksHtml}</div>
    <div class="smf-socials">
      <a href="${escHtml(props.smTwitterHref || '#')}" class="smf-social" style="color:${smFootColor}"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
      <a href="${escHtml(props.smInstagramHref || '#')}" class="smf-social" style="color:${smFootColor}"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
      <a href="${escHtml(props.smFacebookHref || '#')}" class="smf-social" style="color:${smFootColor}"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg></a>
    </div>
  </div>
</footer>`
      }

      case 'aether-product-section': {
        const afOuterBg = styles?.backgroundColor || '#f3f4f6'
        const afColor = styles?.color || '#1a1a1a'
        const afTitle = escHtml(props.afTitle || 'AetherFlow X')
        const afSubtitle = escHtml(props.afSubtitle || 'Unleash Your Potential')
        const afCtaText = escHtml(props.afCtaText || 'Learn More')
        const afPrice = escHtml(props.afPrice || '$999.00')
        const afStockText = escHtml(props.afStockText || 'In Stock')
        const afBtnText = escHtml(props.afBtnText || 'Add to Cart')
        const afSelectLabel = escHtml(props.afSelectLabel || 'Configure Storage')
        const afImages = props.afImages || [
          'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1556656793-062ff98782ee?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1510557883980-505137219187?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1573148195900-7845fcc30127?auto=format&fit=crop&q=80&w=800',
        ]
        const afSpecs = props.afSpecs || [
          { label: 'Display', value: '6.7" Super AMOLED' },
          { label: 'Processor', value: 'Octa-core AetherChip v2' },
          { label: 'Storage', value: '256GB / 512GB NVMe' },
        ]
        const afOptions = props.afOptions || ['256GB — Standard', '512GB — Professional']

        const thumbsHtml = afImages.map((img, i) => `
        <button class="af-thumb${i === 0 ? ' af-thumb-active' : ''}" onclick="afUpdateImage(this,'af-main-${idx}','af-thumbs-${idx}',${i})" data-af-src="${escHtml(img)}">
          <img src="${escHtml(img)}" alt="View ${i + 1}" class="af-thumb-img">
        </button>`).join('')

        const specsHtml = afSpecs.map(s => `
        <div class="af-spec-item">
          <p class="af-spec-label">${escHtml(s.label)}</p>
          <p class="af-spec-value" style="color:${afColor}">${escHtml(s.value)}</p>
        </div>`).join('')

        const optionsHtml = afOptions.map(o => `<option>${escHtml(o)}</option>`).join('')

        return `<section class="af-outer" style="background-color:${afOuterBg};color:${afColor}" id="af-${idx}">
  <div class="af-grid">
    <!-- Left card -->
    <div class="af-left-card">
      <div class="af-hero-area">
        <div class="af-hero-text">
          <h1 class="af-title" style="color:${afColor}">${afTitle}</h1>
          <p class="af-subtitle">${afSubtitle}</p>
          <button class="af-cta-btn">${afCtaText}</button>
        </div>
        <div class="af-main-img-wrap">
          <img id="af-main-${idx}" src="${escHtml(afImages[0])}" alt="${afTitle}" class="af-main-img">
        </div>
      </div>
      <div class="af-gallery" id="af-thumbs-${idx}">
        ${thumbsHtml}
      </div>
    </div>
    <!-- Right card -->
    <div class="af-right-card">
      <div class="af-specs-section">
        <h2 class="af-section-title" style="color:${afColor}">Specifications</h2>
        <div class="af-specs">${specsHtml}</div>
      </div>
      <div class="af-buy-section">
        <h2 class="af-section-title" style="color:${afColor}">Buy Now</h2>
        <div class="af-select-wrap">
          <label class="af-select-label">${afSelectLabel}</label>
          <div class="af-select-box">
            <select class="af-select" style="color:${afColor}">${optionsHtml}</select>
            <span class="af-arrow">&#9660;</span>
          </div>
        </div>
        <div class="af-price-row">
          <p class="af-price" style="color:${afColor}">${afPrice}</p>
          <p class="af-stock">${afStockText}</p>
        </div>
        <button class="af-buy-btn">${afBtnText}</button>
      </div>
    </div>
  </div>
</section>
<script>
function afUpdateImage(btn, mainId, thumbsId, idx) {
  var mainImg = document.getElementById(mainId);
  var thumbsCont = document.getElementById(thumbsId);
  if (!mainImg || !thumbsCont) return;
  mainImg.classList.add('af-changing');
  setTimeout(function() {
    mainImg.src = btn.dataset.afSrc;
    mainImg.onload = function() { mainImg.classList.remove('af-changing'); };
    setTimeout(function() { mainImg.classList.remove('af-changing'); }, 400);
    thumbsCont.querySelectorAll('.af-thumb').forEach(function(t) { t.classList.remove('af-thumb-active'); });
    btn.classList.add('af-thumb-active');
  }, 180);
}
</script>`
      }

      case 'homehero-navbar': {
        const hnBg = styles?.backgroundColor || '#ffffff'
        const hnColor = styles?.color || '#1a1a1a'
        const hnBrand = escHtml(props.hhBrand || 'HomeHero')
        const hnBadge = escHtml(props.hhBadge || 'HH')
        const hnAccent = props.hhAccent || '#4F46E5'
        const hnCoral = props.hhCoral || '#FF5A5F'
        const hnCta = escHtml(props.hhCtaText || 'Join the Beta')
        const hnLinks = (props.links || [
          { text: 'Bills', href: '#bills' }, { text: 'Repairs', href: '#repairs' }, { text: 'Chores', href: '#chores' },
        ])
        const desktopLinks = hnLinks.map(l => `<a href="${escHtml(l.href)}" class="hhn-link">${escHtml(l.text)}</a>`).join('')
        const overlayLinks = hnLinks.map(l => `<a href="${escHtml(l.href)}" class="hhn-ovl-link" style="color:${hnColor}">${escHtml(l.text)}</a>`).join('')
        return `<header class="hhn-header" style="background-color:${hnBg}" id="hhn-${idx}">
  <nav class="hhn-nav" style="color:${hnColor}">
    <div class="hhn-left">
      <div class="hhn-logo">
        <div class="hhn-badge" style="background-color:${hnAccent}">${hnBadge}</div>
        <span class="hhn-brand" style="color:${hnColor}">${hnBrand}</span>
      </div>
      <div class="hhn-links">${desktopLinks}</div>
    </div>
    <button class="hhn-ham" id="hhn-open-${idx}" aria-label="Open menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16m-7 6h7"/></svg>
    </button>
  </nav>
  <!-- Mobile overlay -->
  <div class="hhn-overlay" id="hhn-ovl-${idx}" style="background-color:${hnBg}">
    <div class="hhn-ovl-head">
      <div class="hhn-logo">
        <div class="hhn-badge" style="background-color:${hnAccent}">${hnBadge}</div>
        <span class="hhn-brand" style="color:${hnColor}">${hnBrand}</span>
      </div>
      <button class="hhn-close" id="hhn-close-${idx}" style="color:${hnColor}">&#x2715;</button>
    </div>
    <div class="hhn-ovl-links">${overlayLinks}</div>
    <div class="hhn-ovl-foot">
      <button class="hhn-cta-btn" style="background-color:${hnCoral}">${hnCta}</button>
    </div>
  </div>
</header>
<script>(function(){
  var o=document.getElementById('hhn-open-${idx}'),c=document.getElementById('hhn-close-${idx}'),v=document.getElementById('hhn-ovl-${idx}');
  if(o&&c&&v){o.addEventListener('click',function(){v.classList.add('hhn-ovl-active');document.body.style.overflow='hidden'});c.addEventListener('click',function(){v.classList.remove('hhn-ovl-active');document.body.style.overflow=''});v.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){v.classList.remove('hhn-ovl-active');document.body.style.overflow=''})});}
})();</script>`
      }

      case 'homehero-hero': {
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

      case 'qi-navbar': {
        const qnBg = styles?.backgroundColor || '#f7f7f5'
        const qnColor = styles?.color || '#1a1a1a'
        const qnBrand = escHtml(props.qiBrand || 'The Qi')
        const qnCart = escHtml(props.qiCartText || 'Cart')
        const qnCount = escHtml(props.qiCartCount || '0')
        const qnAccount = escHtml(props.qiAccountText || 'Account')
        const qnLinks = (props.links || [
          { text: 'Shop', href: '#shop' },
          { text: 'Learn', href: '#learn' },
          { text: 'Mission', href: '#mission' },
        ]).map(l => `<a href="${escHtml(l.href)}" class="qi-nav-link">${escHtml(l.text)}</a>`).join('\n          ')
        return `<header class="qi-header" style="background-color:${qnBg}">
  <nav class="qi-nav" style="color:${qnColor}">
    <div class="qi-nav-left">
      <button class="qi-ham" id="qi-open-${idx}" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <div class="qi-nav-links">
        ${qnLinks}
      </div>
    </div>
    <div class="qi-nav-center">
      <a href="/" class="qi-brand" style="color:${qnColor}">${qnBrand}</a>
    </div>
    <div class="qi-nav-right">
      <a href="${escHtml(props.qiAccountHref || '#')}" class="qi-nav-link qi-account">${qnAccount}</a>
      <a href="${escHtml(props.qiCartHref || '#')}" class="qi-nav-link">${qnCart} <span class="qi-count">(${qnCount})</span></a>
    </div>
  </nav>
  <!-- Mobile overlay -->
  <div class="qi-overlay" id="qi-overlay-${idx}" style="background-color:${qnBg};color:${qnColor}">
    <button class="qi-close" id="qi-close-${idx}" aria-label="Close menu">&#x2715;</button>
    ${(props.links || [{ text: 'Shop', href: '#shop' }, { text: 'Learn', href: '#learn' }, { text: 'Mission', href: '#mission' }]).map(l => `<a href="${escHtml(l.href)}" class="qi-overlay-link" style="color:${qnColor}">${escHtml(l.text)}</a>`).join('\n    ')}
  </div>
</header>
<script>
(function(){
  var open = document.getElementById('qi-open-${idx}');
  var close = document.getElementById('qi-close-${idx}');
  var overlay = document.getElementById('qi-overlay-${idx}');
  if(open && close && overlay){
    open.addEventListener('click', function(){ overlay.classList.add('qi-overlay-active'); document.body.style.overflow='hidden'; });
    close.addEventListener('click', function(){ overlay.classList.remove('qi-overlay-active'); document.body.style.overflow=''; });
    overlay.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ overlay.classList.remove('qi-overlay-active'); document.body.style.overflow=''; }); });
  }
})();
</script>`
      }

      case 'qi-hero': {
        const qhBg = styles?.backgroundColor || '#f7f7f5'
        const qhColor = styles?.color || '#1a1a1a'
        const qhTop = escHtml(props.qiTopText || 'In Flowers')
        const qhBottom = escHtml(props.qiBottomText || 'We Trust')
        const qhImage = escHtml(props.qiImage || 'https://images.unsplash.com/photo-1591871937573-748af0941cf2?q=80&w=800&auto=format&fit=crop')
        const qhDesc = escHtml(props.qiDesc || 'A ritual of sensory healing.\nWhole flower teas for deep connection and modern rituals.').replace(/\n/g, '<br>')
        return `<section class="qi-hero-section" style="background-color:${qhBg}">
  <div class="qi-hero-inner">
    <h2 class="qi-hero-heading" style="color:${qhColor}">${qhTop}</h2>
    <div class="qi-hero-img-wrap">
      <img src="${qhImage}" alt="" class="qi-hero-img">
    </div>
    <h2 class="qi-hero-heading qi-hero-heading-bottom" style="color:${qhColor}">${qhBottom}</h2>
  </div>
  <div class="qi-hero-desc">
    <p class="qi-hero-desc-text" style="color:${qhColor}">${qhDesc}</p>
  </div>
</section>`
      }

      case 'qi-products': {
        const qpBg = styles?.backgroundColor || '#ffffff'
        const qpColor = styles?.color || '#1a1a1a'
        const qpHead = escHtml(props.qiProdHeading || 'Selected Blossoms')
        const qpViewAll = escHtml(props.qiProdViewAll || 'View All Shop')
        const qpViewHref = escHtml(props.qiProdViewAllHref || '#')
        const qpProds = props.qiProducts || [
          { image: 'https://images.unsplash.com/photo-1563201444-2495a32761ac?q=80&w=800&auto=format&fit=crop', name: 'Shangri-La Rose', subtitle: 'Grown in High Altitudes', price: '$28' },
          { image: 'https://images.unsplash.com/photo-1597485334015-81423873919e?q=80&w=800&auto=format&fit=crop', name: 'Royal Chrysanthemum', subtitle: 'Immunity & Clarity', price: '$32' },
          { image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop', name: 'Blue Lotus', subtitle: 'Lucid Dreaming', price: '$36' },
        ]
        const prodsHtml = qpProds.map((p, i) => `<div class="qi-prod-card${i === 1 ? ' qi-prod-offset' : ''}">
      <div class="qi-prod-img-wrap">
        <img src="${escHtml(p.image)}" alt="${escHtml(p.name)}" class="qi-prod-img">
      </div>
      <div class="qi-prod-info">
        <div>
          <h4 class="qi-prod-name" style="color:${qpColor}">${escHtml(p.name)}</h4>
          <p class="qi-prod-sub">${escHtml(p.subtitle)}</p>
        </div>
        <p class="qi-prod-price" style="color:${qpColor}">${escHtml(p.price)}</p>
      </div>
    </div>`).join('\n    ')
        return `<section class="qi-prods-section" style="background-color:${qpBg}">
  <div class="qi-prods-inner">
    <div class="qi-prods-header">
      <h3 class="qi-prods-heading" style="color:${qpColor}">${qpHead}</h3>
      <a href="${qpViewHref}" class="qi-prods-viewall" style="color:${qpColor};border-bottom-color:${qpColor}">${qpViewAll}</a>
    </div>
    <div class="qi-prods-grid">
      ${prodsHtml}
    </div>
  </div>
</section>`
      }

      case 'agensea-navbar': {
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

      case 'agensea-hero': {
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

      case 'puzzle-hero': {
        const pAccent = props.puzzleAccent || '#f97316'
        const pWord = props.puzzleDisplayWord || 'puzzle'
        const pHead = props.puzzleHeading || 'Get an amazing new play game experience'
        const pDesc = props.puzzleDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luct'
        const pCta = props.puzzleCtaText || 'Play Now'
        const pC1 = props.puzzleColor1 || '#3b82f6'
        const pC2 = props.puzzleColor2 || '#f97316'
        const pC3 = props.puzzleColor3 || '#fbbf24'
        const pC4 = props.puzzleColor4 || '#db2777'
        const pBg = styles?.backgroundColor || '#fdf6f0'
        const pText = styles?.color || '#0f172a'
        const PPATH = "M20,12V10a2,2,0,0,0-2-2,2,2,0,0,1-2-2,2,2,0,0,0-2-2H12V2a2,2,0,0,0-2-2A2,2,0,0,0,8,2V4H6A2,2,0,0,0,4,6,2,2,0,0,1,2,8,2,2,0,0,0,0,10v2a2,2,0,0,0,2,2,2,2,0,0,1,2,2,2,2,0,0,0,2,2H8v2a2,2,0,0,0,2,2,2,2,0,0,0,2-2V20h2a2,2,0,0,0,2-2,2,2,0,0,1,2-2,2,2,0,0,0,2-2Z"

        const piece = (color, delay) =>
          `<svg class="pzl-piece${delay ? ' pzl-delayed' : ''}" style="fill:${color}" viewBox="0 0 24 24"><path d="${PPATH}"/></svg>`
        const empty = `<div class="pzl-empty"></div>`

        return `<section class="pzl-hero" style="background-color:${pBg};color:${pText}">
  <div class="pzl-cluster pzl-cluster-left">
    ${piece(pC1, false)}${empty}
    ${piece('#ffffff', true)}${piece(pC2, false)}
    ${piece(pC3, true)}${piece(pC1, false)}
  </div>
  <div class="pzl-cluster pzl-cluster-right">
    ${empty}${piece(pC2, true)}${piece(pC1, false)}
    ${piece('#ffffff', true)}${piece(pC4, false)}${piece(pC3, true)}
    ${piece(pC3, false)}${piece(pC2, true)}${piece(pC1, false)}
    ${empty}${piece('#ffffff', true)}${piece(pC4, false)}
  </div>

  <div class="pzl-hero-content">
    <div class="pzl-display-word" style="color:${pText}">${escHtml(pWord)}</div>
    <h2 class="pzl-heading" style="color:${pText}">${escHtml(pHead)}</h2>
    <p class="pzl-desc">${escHtml(pDesc)}</p>
    <div class="pzl-cta-wrap">
      <a href="${normalizeHref(props.puzzleCtaHref || '#')}" class="pzl-cta" style="background-color:${pAccent};box-shadow:0 10px 25px -5px ${pAccent}66;text-decoration:none;display:inline-block">${escHtml(pCta)}</a>
      <svg class="pzl-arrow" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20,20 Q40,10 60,30 Q80,50 40,70" stroke-linecap="round"/>
        <path d="M35,65 L40,70 L35,75" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</section>`
      }

      case 'trend-hero': {
        const tAccent = props.trendAccent || '#e91e63'
        const tHeading = props.trendHeading || 'Bring brand in life'
        const tHLight = props.trendHighlight || 'brand'
        const tDesc = props.trendDescription || 'Brand cream is a sunshine cream good for your skin care.'
        const tCta = props.trendCtaText || 'Shop Now'
        const tReviews = props.trendReviewCount || '10k+'
        const tRating = props.trendRating || '4.5'
        const tImg = props.trendProductImage || 'https://placehold.co/280x380/e91e63/ffffff?text=Product'
        const tF1 = props.trendFeature1 || 'Organic'
        const tF1D = props.trendFeature1Desc || 'Natural ingredients delivered fresh.'
        const tF2 = props.trendFeature2 || 'Aroma'
        const tF2D = props.trendFeature2Desc || 'Refreshing scents for all skin types.'
        const tF3 = props.trendFeature3 || 'Botanic'
        const tF3D = props.trendFeature3Desc || 'Plant-based formulas with proven results.'
        const tVidText = props.trendVideoText || 'SEE PRODUCT VIDEO NOW'
        const tVidLink = props.trendVideoLink || ''
        const tBg = styles?.backgroundColor || '#ffffff'
        const tText = styles?.color || '#1e293b'

        let headingHTML
        if (tHLight && tHeading.includes(tHLight)) {
          const idx = tHeading.indexOf(tHLight)
          headingHTML = `${escHtml(tHeading.slice(0, idx))}<span class="trend-hero-highlight" style="color:${tAccent};border-color:${tAccent}">${escHtml(tHLight)}</span>${escHtml(tHeading.slice(idx + tHLight.length))} <span style="color:${tAccent}">&rarr;</span>`
        } else {
          headingHTML = `${escHtml(tHeading)} <span style="color:${tAccent}">&rarr;</span>`
        }

        const circleText = `${escHtml(tVidText)} &bull; ${escHtml(tVidText)} &bull; `
        const playBtnHTML = tVidLink
          ? `<a href="${normalizeHref(tVidLink)}" class="trend-play-btn" style="background-color:${tAccent}" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></a>`
          : `<button class="trend-play-btn" style="background-color:${tAccent}"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>`

        return `<section class="trend-hero" style="background-color:${tBg};color:${tText}">
  <div class="trend-blob trend-blob-tr" style="background-color:${tAccent}"></div>
  <div class="trend-blob trend-blob-bl" style="background-color:${tAccent}"></div>

  <div class="trend-hero-left">
    <h1 class="trend-hero-heading" style="color:${tText}">${headingHTML}</h1>
    <p class="trend-hero-desc">${escHtml(tDesc)}</p>
    <a href="${normalizeHref(props.trendCtaHref || '#')}" class="trend-hero-cta" style="background-color:${tAccent}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> ${escHtml(tCta)}</a>
    <div class="trend-hero-social">
      <div class="trend-hero-avatars">
        <img src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80" alt="" class="trend-avatar" />
        <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80" alt="" class="trend-avatar" />
        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80" alt="" class="trend-avatar" />
        <div class="trend-avatar-count">${escHtml(tReviews)}</div>
      </div>
      <div class="trend-hero-rating">
        <span class="trend-star">&#9733;</span>
        <strong class="trend-rating-num" style="color:${tText}">${escHtml(tRating)}</strong>
        <span class="trend-rating-sub">(review rating)</span>
      </div>
    </div>
  </div>

  <div class="trend-hero-center">
    <svg class="trend-splash" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path fill="${tAccent}" opacity="0.1" d="M435.5,296.5C418.1,353.9,352.5,391.1,288.7,419.5C224.9,447.9,162.8,467.5,108.8,443.3C54.8,419.1,8.9,351,1.5,283.5C-5.9,216,25.2,149.1,75.3,101.4C125.4,53.7,194.5,25.3,261.2,21.9C327.9,18.5,392.2,40.1,432.2,88.7C472.2,137.3,487.9,212.9,435.5,296.5Z"/>
      <path fill="${tAccent}" opacity="0.18" d="M410.5,320.5C384.8,375.4,310.8,401.4,244.5,410.5C178.2,419.6,119.6,411.8,78.5,372.5C37.4,333.2,13.8,262.4,26.5,198.5C39.2,134.6,88.2,77.6,150.5,50.5C212.8,23.4,288.4,26.2,345.5,61.5C402.6,96.8,441.2,164.6,436.2,230.5C431.2,296.4,382.8,360.3,410.5,320.5Z"/>
    </svg>
    <img src="${tImg}" alt="Product" class="trend-product-img trend-float" />
  </div>

  <div class="trend-hero-right">
    <div class="trend-feature">
      <h4 style="color:${tText}">${escHtml(tF1)}</h4>
      <p>${escHtml(tF1D)}</p>
    </div>
    <div class="trend-feature trend-feature-accent" style="background-color:${tAccent}">
      <h4>${escHtml(tF2)}</h4>
      <p>${escHtml(tF2D)}</p>
    </div>
    <div class="trend-feature">
      <h4 style="color:${tText}">${escHtml(tF3)}</h4>
      <p>${escHtml(tF3D)}</p>
    </div>
    <div class="trend-video-circle">
      <svg class="trend-spin-text" viewBox="0 0 100 100">
        <defs><path id="trendCirclePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/></defs>
        <text style="font-size:8px;font-weight:700;fill:${tText};text-transform:uppercase;letter-spacing:1.5px"><textPath href="#trendCirclePath">${circleText}</textPath></text>
      </svg>
      ${playBtnHTML}
    </div>
  </div>
</section>`
      }

      case 'smart-home-dashboard': {
        const shdAccent = props.shdAccent || '#b4c7bc'
        const shdDarkBg = props.shdDarkBg || '#2a2624'
        const shdRoom = escHtml(props.shdRoomName || 'Living room')
        const shdCamImg = escHtml(props.shdCameraImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200')
        const shdWatts = escHtml(props.shdPowerWatts || '65W')
        const shdPlaylist = escHtml(props.shdPlaylistName || 'Everyday Playlist')
        const shdAlbum = escHtml(props.shdAlbumImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400')
        const shdProfile = escHtml(props.shdProfileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop')
        const shdLight = Number(props.shdLightPercent ?? 70)
        const circ = 2 * Math.PI * 44
        const offset = circ - 0.65 * circ

        return `<section class="shd-wrap" style="background:radial-gradient(circle at center,#4a4440 0%,${shdDarkBg} 100%);color:#fff;font-family:'Inter',system-ui,sans-serif;padding:2rem;min-height:600px">
<div class="shd-inner">
  <nav class="shd-glass shd-sidebar">
    <div style="display:flex;flex-direction:column;gap:1.5rem;align-items:center">
      <button class="shd-nav-btn active">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
      </button>
      <button class="shd-nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
      </button>
      <button class="shd-nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      </button>
    </div>
    <div class="shd-avatar"><img src="${shdProfile}" alt="Profile"/></div>
  </nav>
  <div class="shd-grid">
    <div class="shd-cam shd-s6">
      <img src="${shdCamImg}" alt="${shdRoom}"/>
      <div class="shd-cam-overlay"></div>
      <div class="shd-pill" style="left:1.25rem">${shdRoom}</div>
      <div class="shd-pill shd-live" style="right:1.25rem;left:auto"><span class="shd-live-dot"></span>LIVE</div>
      <div class="shd-cam-info"><div style="font-size:1.1rem;font-weight:500">Live Camera</div><div style="font-size:.8rem;color:rgba(255,255,255,.6)">${shdRoom}</div></div>
    </div>
    <div class="shd-glass shd-plug shd-s6">
      <div style="text-align:center"><h3>Smart Plug</h3><p>${shdRoom}</p></div>
      <div class="shd-ring-wrap">
        <svg width="180" height="180" viewBox="0 0 100 100">
          <circle stroke="rgba(255,255,255,0.1)" stroke-width="6" fill="transparent" r="44" cx="50" cy="50"/>
          <circle class="shd-progress-circle" stroke="${shdAccent}" stroke-width="6" stroke-linecap="round" fill="transparent" r="44" cx="50" cy="50" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"/>
        </svg>
        <div class="shd-ring-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:6px"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          <span style="font-size:1.8rem;font-weight:300">${shdWatts}</span>
          <span style="font-size:.65rem;color:rgba(255,255,255,.4);letter-spacing:.1em;text-transform:uppercase">Power</span>
        </div>
      </div>
    </div>
    <div class="shd-glass shd-scene shd-s3">
      <div style="display:flex;align-items:center;gap:1rem">
        <div class="shd-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg></div>
        <div><div style="font-weight:500">Movie time</div><div style="font-size:.8rem;color:rgba(255,255,255,.4)">Scene</div></div>
      </div>
      <button class="shd-play-btn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
    </div>
    <div id="shd-tv" class="shd-tv-card shd-s3" style="background:${shdAccent};color:${shdDarkBg}" data-accent="${shdAccent}" data-dark="${shdDarkBg}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.8"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
        <span id="shd-tv-status" style="font-size:.85rem;font-weight:500;opacity:.6">On</span>
      </div>
      <div>
        <div style="font-size:1.2rem;font-weight:500;margin-bottom:4px">Smart TV</div>
        <div style="font-size:.85rem;opacity:.6;margin-bottom:1.25rem">${shdRoom}</div>
        <button id="shd-tv-toggle" class="shd-toggle on" onclick="shdTvToggle()" aria-label="Toggle TV">
          <span class="shd-toggle-dot" style="background:${shdDarkBg}"></span>
        </button>
      </div>
    </div>
    <div class="shd-glass shd-music shd-s6r2">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="shd-spotify-pill">
          <div class="shd-spotify-dot"><svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="black"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
          ${shdPlaylist}
        </div>
      </div>
      <div class="shd-music-body">
        <div class="shd-album"><img src="${shdAlbum}" alt="Album"/></div>
        <div>
          <div style="font-size:.7rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">Smart TV</div>
          <div style="font-size:1.5rem;font-weight:300">${shdRoom}</div>
          <div class="shd-music-ctrl">
            <button class="shd-ctrl-btn"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg></button>
            <button id="shd-play-btn" class="shd-play-main" onclick="shdPlayToggle()" aria-label="Play/Pause">
              <svg id="shd-play-icon" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="black"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            <button class="shd-ctrl-btn"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></button>
          </div>
        </div>
      </div>
    </div>
    <div class="shd-glass shd-gamepad shd-s3">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="shd-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg></div>
        <div class="shd-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <span id="shd-gp-status" style="margin-left:auto;font-size:.85rem;color:rgba(255,255,255,.4)">Off</span>
      </div>
      <div>
        <div style="font-size:1.2rem;font-weight:500;margin-bottom:4px">Gamepad</div>
        <div style="font-size:.85rem;color:rgba(255,255,255,.4);margin-bottom:1.25rem">${shdRoom}</div>
        <button id="shd-gp-toggle" class="shd-toggle off" onclick="shdGpToggle()" aria-label="Toggle Gamepad">
          <span class="shd-toggle-dot"></span>
        </button>
      </div>
    </div>
    <div id="shd-light-card" class="shd-glass shd-light shd-s3">
      <div id="shd-light-fill" class="shd-light-fill" style="height:${shdLight}%"></div>
      <div class="shd-light-info">
        <div class="shd-bulb-ring"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${shdAccent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></div>
        <span id="shd-light-val" style="font-size:1.5rem;font-weight:300">${shdLight}%</span>
      </div>
    </div>
  </div>
</div>
</section>`
      }

      case 'lumora-navbar': {
        const brand = props.brand || 'Lumora'
        const links = props.links || []
        const cartCount = parseInt(props.lumoraCartCount || '0')
        const bg = styles?.backgroundColor || '#FDFCF8'
        const color = styles?.color || '#1A1A1A'
        const linksHtml = links.map(l => `<a href="${normalizeHref(l.href)}" class="lu-nav-link">${escHtml(l.text)}</a>`).join('')
        const cartBadge = cartCount > 0 ? `<span class="lu-cart-badge">${cartCount}</span>` : ''
        return `<header class="lu-nav" style="background-color:${bg}; color:${color}">
  <div class="lu-nav-inner">
    <div class="lu-nav-left">
      <button class="lu-menu-btn" onclick="this.closest('.lu-nav').querySelector('.lu-mobile-menu').classList.toggle('open')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="lu-brand">${escHtml(brand)}</div>
    </div>
    <nav class="lu-links">${linksHtml}</nav>
    <div class="lu-nav-right">
      <button class="lu-icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></button>
      <button class="lu-icon-btn lu-cart-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        ${cartBadge}
      </button>
    </div>
  </div>
  <div class="lu-mobile-menu" style="background-color:${bg}">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div class="lu-brand">${escHtml(brand)}</div>
      <button class="lu-icon-btn" onclick="this.closest('.lu-mobile-menu').classList.remove('open')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <nav style="display: flex; flex-direction: column; gap: 20px;">
      ${links.map(l => `<a href="${normalizeHref(l.href)}" style="text-decoration: none; color: inherit; font-size: 18px; font-weight: 500; text-transform: uppercase; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px; display: block;">${escHtml(l.text)}</a>`).join('')}
    </nav>
  </div>
</header>`
      }

      case 'lumora-hero': {
        const tagline = props.tagline || 'PREMIUM CARE'
        const title = props.title || 'Reveal Your Natural Radiance'
        const ctaText = props.ctaText || 'Shop Collection'
        const heroImg = props.heroImage || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200'
        const pImg = props.productImg || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'
        const pName = props.productName || 'Renewal Serum'
        const pDesc = props.productDesc || 'Advanced hydration'
        return `<section class="lu-hero">
  <div class="lu-hero-content">
    <div class="lu-tag">${escHtml(tagline)}</div>
    <h1 class="lu-hero-title">${escHtml(title)}</h1>
    <button class="lu-cta">${escHtml(ctaText)}</button>
    <div class="lu-floating-card">
      <img src="${escHtml(pImg)}" alt="Product" />
      <div>
        <div class="lu-f-name">${escHtml(pName)}</div>
        <div class="lu-f-desc">${escHtml(pDesc)}</div>
      </div>
    </div>
  </div>
  <div class="lu-hero-media">
    <img src="${escHtml(heroImg)}" alt="Skincare" />
  </div>
</section>`
      }

      case 'lumora-marquee': {
        const r1 = props.review1 || 'BEST SERUM I EVER USED'
        const a1 = props.author1 || 'SARAH J.'
        const r2 = props.review2 || 'GLOWING SKIN IN DAYS'
        const a2 = props.author2 || 'EMMA W.'
        const trusted = props.trustedText || 'TRUSTED BY 50K+ CUSTOMERS'
        const itm = `
          <div class="lu-marquee-item">
            <div class="lu-stars">★★★★★</div>
            <div>
              <div class="lu-r-text">${escHtml(r1)}</div>
              <div class="lu-r-author">${escHtml(a1)}</div>
            </div>
          </div>
          <div class="lu-sep"></div>
          <div class="lu-marquee-item">
            <div class="lu-stars">★★★★★</div>
            <div>
              <div class="lu-r-text">${escHtml(r2)}</div>
              <div class="lu-r-author">${escHtml(a2)}</div>
            </div>
          </div>
          <div class="lu-sep"></div>
          <div class="lu-trusted">${escHtml(trusted)}</div>
          <div class="lu-sep"></div>`
        return `<div class="lu-marquee"><div class="lu-marquee-inner">${itm}${itm}${itm}${itm}</div></div>`
      }

      case 'lumora-story': {
        const tag = props.tagline || 'OUR PHILOSOPHY'
        const title = props.title || 'Clean beauty, rooted in science'
        const p1 = props.storyP1 || 'We believe that skincare should be an act of self-love.'
        const p2 = props.storyP2 || 'Our formulas are crafted with the highest quality ingredients.'
        const cta = props.ctaText || 'Learn More'
        const img1 = props.image1 || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800'
        const img2 = props.image2 || 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800'
        return `<section class="lu-story">
  <div class="lu-story-grid">
    <div class="lu-story-text">
      <div class="lu-story-tag">${escHtml(tag)}</div>
      <h2 class="lu-story-title">${escHtml(title)}</h2>
      <p>${escHtml(p1)}</p>
      <p>${escHtml(p2)}</p>
      <button class="lu-story-btn">${escHtml(cta)}</button>
    </div>
    <div class="lu-story-images">
      <img src="${escHtml(img1)}" class="lu-img-1" alt="Story 1" />
      <img src="${escHtml(img2)}" class="lu-img-2" alt="Story 2" />
    </div>
  </div>
</section>`
      }

      case 'lumora-products': {
        const tag = props.tagline || 'SHOP BESTSELLERS'
        const title = props.title || 'Elevate your routine'
        const products = props.products || []
        const prodsHtml = products.map(p => `
    <div class="lu-prod-card">
      <div class="lu-prod-img-wrap">
        <img src="${escHtml(p.image)}" alt="${escHtml(p.name)}" />
        <span class="lu-prod-tag">${escHtml(p.tag)}</span>
        <button class="lu-wish-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>
      </div>
      <div class="lu-prod-info">
        <div class="lu-prod-cat">${escHtml(p.category)}</div>
        <h3 class="lu-prod-name">${escHtml(p.name)}</h3>
        <div class="lu-prod-price-row">
          <span class="lu-price">${escHtml(p.price)}</span>
          ${p.oldPrice ? `<span class="lu-old-price">${escHtml(p.oldPrice)}</span>` : ''}
        </div>
        <button class="lu-add-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          ADD TO BAG
        </button>
      </div>
    </div>`).join('')
        return `<section class="lu-products">
  <div class="lu-prod-header">
    <div class="lu-prod-tagline">${escHtml(tag)}</div>
    <h2 class="lu-prod-title">${escHtml(title)}</h2>
  </div>
  <div class="lu-prod-grid">${prodsHtml}</div>
</section>`
      }

      case 'lumora-footer': {
        const brand = props.brand || 'Lumora'
        const links = props.links || []
        const copyright = props.copyright || '© 2024 LUMORA BEAUTY. ALL RIGHTS RESERVED.'
        const linksHtml = links.map(l => `<a href="${normalizeHref(l.href)}">${escHtml(l.text)}</a>`).join('')
        return `<footer class="lu-footer">
  <div class="lu-footer-brand">${escHtml(brand)}</div>
  <nav class="lu-footer-links">${linksHtml}</nav>
  <div class="lu-copyright">${escHtml(copyright)}</div>
</footer>`
      }

      default:
        return `<!-- Unknown element: ${type} -->`
    }
  })() // end IIFE

  // Wrap non-navbar elements with a div id so section anchor links work in downloads
  // Prefix UUID ids with 'el-' so they are valid CSS selectors (UUIDs can start with digits)
  if (!NAVBAR_TYPES.has(type) && innerHtml) {
    const safeId = /^[a-zA-Z]/.test(el.id) ? el.id : `el-${el.id}`
    return `<div id="${safeId}">${innerHtml}</div>`
  }
  return innerHtml || ''
}

// ── Full sidebar-layout page HTML ─────────────────────────────────────────────
function generateSidebarPageHTML(page, allPages, sidebarEl, mainEls) {
  const props = sidebarEl.props || {}
  const styles = sidebarEl.styles || {}
  const isTabs = props.navTemplate === 'sidebar-tabs'
  const brand = props.brand || 'Dashboard'
  const navBg = styles.backgroundColor || '#1e1b4b'
  const accentColor = props.sidebarAccent || '#818cf8'
  const contentBg = props.sidebarContentBg || (page.canvasBg || '#ffffff')

  const currentFile = getPageFilename(page)
  const sidebarHTML = generateSidebarNavHTML(sidebarEl, currentFile, isTabs)
  const mainHTML = mainEls.map((el, i) => generateElementHTML(el, i)).join('\n\n')

  const mobileBrandInitial = brand.charAt(0).toUpperCase()

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(page.name)} — ${escHtml(brand)}</title>
  <link rel="stylesheet" href="styles.css" />
  ${page.elements.some(e => ['trusted-brands', 'skyline-hero'].includes(e.type)) ? '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />' : ''}
  ${page.elements.some(e => e.type === 'skyline-hero') ? '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">' : ''}
  ${page.elements.some(e => ['veluno-navbar', 'veluno-hero', 'winzy-navbar', 'winzy-hero'].includes(e.type)) ? '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">' : ''}
  <style>${BASE_CSS}</style>
</head>
<body class="sb-page" style="background-color:${contentBg}">

<!-- ── Mobile top bar ─────────────────────────── -->
<div class="sb-mobile-bar" id="sbMobileBar" style="background-color:${navBg}">
  <button class="sb-menu-btn" id="sbMenuBtn" onclick="sbOpenMobile()" aria-label="Open menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>
  <span class="sb-mobile-brand" style="color:#fff">${escHtml(brand)}</span>
</div>

<!-- ── Page layout ────────────────────────────── -->
<div class="sb-layout">

  <!-- Sidebar -->
  ${sidebarHTML}

  <!-- Mobile backdrop -->
  <div class="sb-backdrop" id="sbBackdrop" onclick="sbCloseMobile()"></div>

  <!-- Main content -->
  <main class="sb-main" style="background-color:${contentBg}">
${mainHTML || `    <div style="padding:60px 40px; text-align:center; color:#9ca3af;">No content on this page yet.</div>`}
  </main>

</div>

<script src="script.js"></script>
<script>${BASE_JS}</script>
</body>
</html>`
}

const BASE_CSS = `/* Generated by SiteForge */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* ── Sidebar layout ─────────────────────────────────────────────────────── */
.sb-page { overflow-x: hidden; }
.sb-layout { display: flex; min-height: 100vh; }
.sb-main { flex: 1; min-width: 0; overflow: hidden; }

/* Mobile top bar (hidden on desktop) */
.sb-mobile-bar {
  display: none;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 52px;
  position: sticky;
  top: 0;
  z-index: 20;
}
.sb-menu-btn {
  background: rgba(255,255,255,0.12);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  padding: 7px 9px;
  display: flex;
  align-items: center;
  line-height: 0;
  flex-shrink: 0;
}
.sb-mobile-brand { font-weight: 700; font-size: 0.92rem; }
.sb-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 25;
}
.sb-backdrop.active { display: block; }

/* ── Full sidebar nav ───────────────────────────────────────────────────── */
.sb-nav {
  width: 220px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
  z-index: 10;
  font-family: system-ui, -apple-system, sans-serif;
}
.sb-nav.collapsed { width: 60px; min-width: 60px; }
.sb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px;
  min-height: 60px;
  flex-shrink: 0;
}
.sb-brand { font-weight: 800; font-size: 1.05rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-nav.collapsed .sb-brand { display: none; }
.sb-collapse-btn {
  background: rgba(255,255,255,0.08);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.sb-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 8px;
  flex: 1;
  overflow-y: auto;
}
.sb-link {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  border-radius: 9px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.15s;
  white-space: nowrap;
  overflow: hidden;
}
.sb-link:hover { opacity: 0.85; }
.sb-icon { flex-shrink: 0; display: flex; opacity: 0.65; }
.sb-link.active .sb-icon { opacity: 1; }
.sb-label { overflow: hidden; text-overflow: ellipsis; }
.sb-nav.collapsed .sb-label { display: none; }
.sb-nav.collapsed .sb-link { justify-content: center; padding: 10px 0; gap: 0; }
.sb-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  flex-shrink: 0;
}
.sb-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.7rem; flex-shrink: 0;
}
.sb-user-info { overflow: hidden; }
.sb-user-info strong { display: block; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-user-info small { font-size: 0.7rem; opacity: 0.6; }
.sb-nav.collapsed .sb-user-info { display: none; }
.sb-nav.collapsed .sb-user { justify-content: center; gap: 0; }

/* ── Tab-rail sidebar nav ───────────────────────────────────────────────── */
.sbt-nav {
  width: 52px;
  min-width: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 10;
  font-family: system-ui, -apple-system, sans-serif;
}
.sbt-brand {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.85rem; color: #fff;
  margin: 14px 0 8px; flex-shrink: 0;
}
.sbt-sep { width: 28px; height: 1px; margin-bottom: 8px; flex-shrink: 0; }
.sbt-links {
  display: flex; flex-direction: column; gap: 2px;
  width: 100%; flex: 1; overflow-y: auto;
}
.sbt-link {
  width: 100%; height: 40px;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none;
  transition: all 0.15s; flex-shrink: 0;
  opacity: 0.6;
}
.sbt-link.active { opacity: 1; }
.sbt-link:hover { opacity: 0.85; background: rgba(255,255,255,0.07); }
.sbt-user {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.68rem;
  margin: 8px 0 14px; flex-shrink: 0;
}

/* Responsive — sidebar */
@media (max-width: 768px) {
  .sb-mobile-bar { display: flex; }
  .sb-layout { display: block; }
  .sb-main { padding-top: 0; }
  .sb-nav, .sbt-nav {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    z-index: 30;
  }
  .sb-nav.mobile-open, .sbt-nav.mobile-open { transform: translateX(0); }
}

/* ── Navbar ─────────────────────────────────────────────────────────────── */
.site-nav { position: relative; }
.nav-layout-classic { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.nav-layout-centered { display: flex; flex-direction: column; align-items: center; }
.nav-layout-centered .nav-brand { margin-bottom: 14px; }
.nav-layout-split { display: flex; align-items: center; }
.nav-split-left { flex: 1; display: flex; justify-content: flex-end; padding-right: 24px; }
.nav-split-right { flex: 1; display: flex; justify-content: flex-start; padding-left: 24px; }
.nav-brand { font-weight: 700; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }
.nav-brand-icon { width: 34px; height: 34px; border-radius: 9px; background: #4f6ef7; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; color: #fff; flex-shrink: 0; }
.nav-effect-glass { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.15); }
.nav-effect-bold { border-bottom: 3px solid #4f6ef7; }
.nav-links { display: flex; gap: 24px; list-style: none; padding: 0; margin: 0; flex-wrap: wrap; align-items: center; }
.nav-links a { text-decoration: none; color: inherit; opacity: 0.85; transition: all 0.2s; }
.nav-links a:hover, .nav-links a.active { opacity: 1; }
.nav-links-pill { gap: 6px; }
.nav-links-pill a { font-size: 0.85rem; font-weight: 600; padding: 7px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.2); opacity: 1; background: rgba(255,255,255,0.12); }
.nav-links-pill a.active { background: #4f6ef7; color: #fff !important; border-color: transparent; }
.nav-links-ghost { gap: 6px; }
.nav-links-ghost a { font-size: 0.87rem; font-weight: 500; padding: 6px 14px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.25); }
.nav-links-ghost a.active, .nav-links-ghost a:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.4); opacity: 1; }
.nav-links-underline { gap: 0; }
.nav-links-underline a { font-size: 0.88rem; font-weight: 400; opacity: 0.75; padding-bottom: 2px; border-bottom: 1px solid rgba(255,255,255,0.4); }
.nav-links-underline a.active { opacity: 1; font-weight: 600; border-bottom-width: 2px; }
.nav-sep { opacity: 0.25; padding: 0 8px; font-size: 0.65rem; }
.nav-links-uppercase a { font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; }
.nav-links-uppercase a.active { opacity: 1; }
.nav-hamburger { display: none; background: none; border: none; cursor: pointer; font-size: 1.4rem; color: inherit; padding: 4px 8px; }
.nav-mobile-menu { overflow: hidden; max-height: 0; transition: max-height 0.32s cubic-bezier(0.4,0,0.2,1); }
.nav-mobile-menu.open { max-height: 480px; }
.nav-mobile-menu ul { list-style: none; padding: 8px 20px 16px; margin: 0; }
.nav-mobile-menu li { border-bottom: 1px solid rgba(255,255,255,0.08); }
.nav-mobile-menu a { display: block; padding: 13px 4px; text-decoration: none; font-size: 0.95rem; font-weight: 500; opacity: 0.9; color: inherit; }

/* ── Global animations ───────────────────────────────────────────────────── */
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

/* ── Other elements ─────────────────────────────────────────────────────── */
.hero { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; animation: fadeUp 0.7s ease both; }
.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 16px; line-height: 1.15; }
.hero p { font-size: 1.15rem; opacity: 0.8; margin-bottom: 32px; max-width: 560px; }
.hero-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
.btn { display: inline-block; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 1rem; text-decoration: none; cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease; border: 2px solid transparent; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
.btn-primary { background: #4f6ef7; color: #fff; }
.btn-primary:hover { background: #3a5ae8; }
.btn-outline { background: transparent; border-color: rgba(255,255,255,0.5); color: #fff; }
.btn-outline:hover { background: rgba(255,255,255,0.1); }
.btn-ghost { background: transparent; color: #4f6ef7; border-color: transparent; }
.btn-ghost:hover { background: #eff6ff; }
section h2 { font-size: 2rem; font-weight: 700; margin-bottom: 12px; }
.subtitle { opacity: 0.7; max-width: 600px; margin: 0 auto; }
.section-grid { display: grid; gap: var(--col-gap, 24px); align-items: start; margin-top: 24px; }
.section-grid-2 { grid-template-columns: repeat(2, 1fr); }
.section-grid-3 { grid-template-columns: repeat(3, 1fr); }
.section-grid-4 { grid-template-columns: repeat(4, 1fr); }
.columns-grid { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; }
.column { flex: 1 1 200px; max-width: 320px; text-align: center; padding: 20px; border-radius: 16px; transition: transform 0.25s ease, box-shadow 0.25s ease; animation: fadeUp 0.6s ease both; }
.column:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
.col-icon { font-size: 2.5rem; margin-bottom: 16px; }
.column h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; }
.column p { opacity: 0.7; font-size: 0.95rem; }
.card-wrapper { padding: 20px 40px; }
.card { max-width: 360px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); transition: transform 0.25s ease, box-shadow 0.25s ease; animation: scaleIn 0.5s ease both; }
.card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.14); }
.card-img { width: 100%; display: block; height: 200px; object-fit: cover; }
.card-body { padding: 20px; }
.card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: #1a1a2e; }
.card-text { font-size: 0.9rem; color: #666; line-height: 1.6; margin-bottom: 16px; }
.card-link { color: #4f6ef7; font-weight: 600; text-decoration: none; transition: color 0.15s; }
.card-link:hover { color: #3a5ae8; }
.form-section h2 { font-size: 2rem; font-weight: 700; margin-bottom: 12px; }
.form-subtitle { opacity: 0.6; margin-bottom: 32px; }
.contact-form { max-width: 520px; margin: 0 auto; text-align: left; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-size: 0.85rem; font-weight: 600; color: #374151; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #d1d5db; font-size: 0.95rem; font-family: inherit; outline: none; }
.form-group input:focus, .form-group textarea:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
.contact-form .btn { width: 100%; text-align: center; margin-top: 8px; }
footer .footer-brand { font-weight: 700; font-size: 1.2rem; margin-bottom: 8px; }
.footer-tagline { opacity: 0.6; font-size: 0.9rem; margin-bottom: 16px; }
.footer-links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
.footer-links a { text-decoration: none; opacity: 0.7; font-size: 0.85rem; transition: opacity 0.2s; }
.footer-links a:hover { opacity: 1; }
.copyright { opacity: 0.5; font-size: 0.8rem; }
.video-responsive { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 800px; margin: 0 auto; border-radius: 8px; }
.video-responsive iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.stats-grid { display: flex; gap: 40px; flex-wrap: wrap; justify-content: center; }
.stat { text-align: center; min-width: 120px; }
.stat-number { font-size: 2.8rem; font-weight: 800; line-height: 1; }
.stat-label { font-size: 0.9rem; opacity: 0.75; margin-top: 8px; }
.testimonial-avatar { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px; display: block; object-fit: cover; }
.testimonial-text { font-size: 1.15rem; font-style: italic; max-width: 560px; margin: 0 auto 20px; line-height: 1.7; }
.testimonial-author strong { display: block; font-weight: 700; }
.testimonial-role { color: #6b7280; font-size: 0.85rem; }
blockquote cite { font-size: 0.9rem; font-style: normal; opacity: 0.6; }

@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .columns-grid { flex-direction: column; align-items: center; }
  .column { max-width: 100%; }
  .stats-grid { gap: 24px; }
  .nav-hamburger { display: block; }
  .nav-links { display: none !important; }
  .nav-split-left, .nav-split-right { display: none !important; }
  .nav-layout-centered { flex-direction: row; justify-content: space-between; }
  .nav-layout-centered .nav-brand { margin-bottom: 0; }
  .nav-mobile-menu.open { display: block; }
  .section-grid-2, .section-grid-3, .section-grid-4 { grid-template-columns: 1fr; }

  /* Exported navbars block overrides */
  [class*="cm-ham-"], [class*="gf-ham-"], [class*="sh-ham-"], [class*="otg-ham-"] { display: block !important; }
  [class*="cm-links-"], [class*="gf-links-"], [class*="sh-links-"], [class*="otg-links-"], [class*="sh-search-"], [class*="otg-soc-"] { display: none !important; }
  .footer-links { flex-direction: column; align-items: center; gap: 12px; }
  .vl-nav { padding: 16px 20px; }
  .vl-search, .vl-links { display: none !important; }
}

/* ── Presentation Section ─────────────────────────────────────────────────── */
.ps-section { padding: 40px 20px; font-family: Inter, system-ui, -apple-system, sans-serif; }
.ps-container { background: #fff; border-radius: 40px; padding: 60px; max-width: 1200px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
.ps-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 80px; align-items: center; }
.ps-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@keyframes psFadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
.ps-card { background: #fff; border: 1px solid #f3f4f6; border-radius: 24px; padding: 32px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.04); animation: psFadeUp 0.5s ease both; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.ps-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
.ps-card:nth-child(1) { animation-delay:0.05s; } .ps-card:nth-child(2) { animation-delay:0.15s; }
.ps-card:nth-child(3) { animation-delay:0.25s; } .ps-card:nth-child(4) { animation-delay:0.35s; }
.ps-icon-wrap { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; flex-shrink: 0; }
.ps-card-title { font-size: 1.05rem; font-weight: 700; color: #111827; margin: 0 0 8px; }
.ps-card-desc { font-size: 0.85rem; color: #6b7280; line-height: 1.6; margin: 0; }
.ps-content { display: flex; flex-direction: column; justify-content: space-between; min-height: 400px; }
.ps-heading { font-size: clamp(1.8rem,2.8vw,2.8rem); font-weight: 700; line-height: 1.15; margin: 0 0 20px; }
.ps-desc { color: #6b7280; font-size: 1rem; line-height: 1.7; margin: 0 0 28px; }
.ps-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; font-weight: 600; border-radius: 12px; text-decoration: none; font-size: 0.95rem; transition: transform 0.18s ease, box-shadow 0.18s ease; }
.ps-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
.ps-arrow { transition: transform 0.2s ease; }
.ps-btn:hover .ps-arrow { transform: translateX(4px); }
.ps-socials { margin-top: 48px; }
.ps-follow-label { font-size: 0.7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 14px; }
.ps-soc-row { display: flex; gap: 12px; }
.ps-soc { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; text-decoration: none; transition: color 0.2s, border-color 0.2s; }
.ps-soc:hover { color: #4f46e5; border-color: #4f46e5; }
@media (max-width: 900px) {
  .ps-grid { grid-template-columns: 1fr; gap: 40px; }
  .ps-content { min-height: auto; }
}
@media (max-width: 600px) {
  .ps-container { padding: 32px 20px; border-radius: 24px; }
  .ps-cards-grid { gap: 12px; }
  .ps-card { padding: 20px 16px; }
  .ps-heading { font-size: 1.6rem; }
}

/* ── Food Navbar ──────────────────────────────────────────────────────────── */
.fn-nav { font-family: Outfit, system-ui, -apple-system, sans-serif; }
.fn-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 24px 48px; }
.fn-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.fn-logo-box { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border-width: 2px; border-style: solid; flex-shrink: 0; transition: transform 0.2s ease; }
.fn-logo-box:hover { transform: rotate(12deg); }
.fn-brand { font-size: 1.2rem; font-weight: 900; letter-spacing: -0.04em; }
.fn-links { display: flex; gap: 32px; }
.fn-link { text-decoration: none; font-weight: 700; font-size: 0.9rem; color: #6b7280; transition: color 0.2s; }
.fn-link:hover { color: inherit; opacity: 0.75; }
.fn-link-active { color: #e67e22; border-bottom: 2px solid #e67e22; }
.fn-actions { display: flex; gap: 10px; align-items: center; }
.fn-btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease; text-decoration: none; white-space: nowrap; }
.fn-btn:hover { transform: translate(-3px,-3px); }
.fn-btn:active { transform: translate(2px,2px); box-shadow: 0 0 0 0 transparent !important; }
.fn-btn-login { padding: 9px 20px; border-width: 2px; border-style: solid; }
.fn-btn-login:hover { opacity: 0.9; }
.fn-btn-signup { padding: 10px 22px; border-width: 2px; border-style: solid; font-weight: 900; }
.fn-hamburger { display: none; padding: 8px 10px; border: none; border-radius: 8px; cursor: pointer; line-height: 0; }
.fn-mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; flex-direction: column; padding: 8px 24px 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.fn-mobile-menu.open { display: flex; }
.fn-mobile-menu .fn-link { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
@media (max-width: 768px) {
  .fn-nav-inner { padding: 16px 20px; }
  .fn-links { display: none; }
  .fn-btn-login { padding: 8px 14px; font-size: 0.78rem; }
  .fn-btn-signup { padding: 8px 14px; font-size: 0.78rem; }
  .fn-hamburger { display: flex; }
}

/* ── Food Hero ────────────────────────────────────────────────────────────── */
.fh-section { padding: 24px 48px 64px; font-family: Outfit, system-ui, -apple-system, sans-serif; }
.fh-title-wrap { text-align: center; margin-bottom: 56px; }
.fh-title { font-size: clamp(3rem,10vw,7.5rem); font-weight: 900; letter-spacing: -0.05em; line-height: 0.88; margin: 0; }
.fh-brand { position: relative; display: inline-block; font-style: italic; padding: 0 0.25em; color: #fff; z-index: 1; font-family: Georgia, "Times New Roman", serif; }
.fh-brand::after { content: ''; position: absolute; left: 0; bottom: 10%; width: 100%; height: 58%; background: var(--fh-accent, #e67e22); z-index: -1; transform: rotate(-1.5deg) skewX(-5deg); border-radius: 4px; }
.fh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1100px; margin: 0 auto; }
.fh-left { text-align: left; }
.fh-subheading { font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.6rem,3vw,2.6rem); line-height: 1.25; margin: 0 0 16px; font-weight: 700; }
.fh-desc { color: #6b7280; font-size: 1rem; font-weight: 500; line-height: 1.65; margin: 0 0 28px; max-width: 420px; }
.fh-cta-wrap { margin-bottom: 24px; }
.fh-cta { display: inline-flex; align-items: center; gap: 14px; padding: 14px 26px; background-color: #ffffff; border-width: 4px; border-style: solid; border-radius: 16px; text-decoration: none; transition: all 0.15s ease; }
.fh-cta:hover { transform: translate(-4px,-4px); box-shadow: 12px 12px 0px 0px #2d3436 !important; }
.fh-cta:active { transform: translate(2px,2px); }
.fh-cta-text { font-weight: 900; font-size: 1.05rem; }
.fh-cta-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border-width: 2px; border-style: solid; flex-shrink: 0; line-height: 0; }
.fh-trust { display: flex; align-items: center; gap: 12px; }
.fh-avatars { display: flex; }
.fh-avatar { width: 34px; height: 34px; border-radius: 50%; border-width: 2px; border-style: solid; margin-left: -10px; object-fit: cover; }
.fh-avatars .fh-avatar:first-child { margin-left: 0; }
.fh-trust-text { font-size: 0.82rem; font-weight: 700; color: #9ca3af; margin: 0; }
.fh-right { position: relative; display: flex; justify-content: center; align-items: center; padding: 20px 0 12px; }
.fh-blob { position: absolute; width: 85%; height: 85%; background: #f3d0bb; filter: blur(50px); border-radius: 50%; z-index: 0; }
.fh-img-wrap { position: relative; z-index: 1; }
.fh-img-card { background-color: #ffffff; padding: 12px; border-radius: 32px; border-width: 4px; border-style: solid; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
.fh-img-card:hover { transform: translate(-4px,-4px) rotate(1deg); }
.fh-img { width: 100%; max-width: 340px; height: auto; border-radius: 24px; display: block; }
.fh-badge { position: absolute; top: -16px; right: -20px; color: #ffffff; padding: 14px 18px; border-radius: 14px; transform: rotate(12deg); border-width: 4px; border-style: solid; z-index: 20; transition: transform 0.2s ease; }
.fh-badge:hover { transform: rotate(12deg) scale(1.1); }
.fh-badge-main { font-weight: 900; font-size: 1.5rem; line-height: 1; margin: 0; }
.fh-badge-sub { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; margin: 3px 0 0; }
@media (max-width: 768px) {
  .fh-section { padding: 24px 20px 48px; }
  .fh-title-wrap { margin-bottom: 36px; }
  .fh-grid { grid-template-columns: 1fr; gap: 40px; }
  .fh-left { text-align: center; order: 2; }
  .fh-right { order: 1; }
  .fh-desc { margin-left: auto; margin-right: auto; }
  .fh-cta-wrap { display: flex; justify-content: center; }
  .fh-trust { justify-content: center; }
  .fh-img { max-width: 260px; }
  .fh-badge { right: -8px; padding: 10px 12px; }
  .fh-badge-main { font-size: 1.1rem; }
}

/* ── Sell Home Steps Section ──────────────────────────────────────────────── */
.sh-section { padding: 96px 48px 80px; font-family: Inter, system-ui, -apple-system, sans-serif; }
.sh-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 5fr 7fr; gap: 80px; align-items: center; }
.sh-left {}
.sh-heading { font-size: clamp(2.5rem,5vw,3.75rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; margin: 0 0 24px; }
.sh-desc { font-size: 1.1rem; color: #64748b; max-width: 380px; line-height: 1.75; margin: 0 0 32px; }
.sh-btn { display: inline-block; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; text-decoration: none; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: opacity 0.2s; }
.sh-btn:hover { opacity: 0.85; }
.sh-right { display: flex; flex-direction: column; gap: 20px; }
.sh-stagger { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; }
.sh-step { display: flex; flex-direction: row; align-items: center; gap: 24px; }
.sh-step-right { grid-column: 4 / 13; }
.sh-step-left  { grid-column: 1 / 10; }
.sh-img-wrap { width: 60%; aspect-ratio: 4/3; overflow: hidden; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.09); border: 1px solid #f1f5f9; flex-shrink: 0; }
.sh-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s ease; }
.sh-img-wrap:hover .sh-img { transform: scale(1.05); }
.sh-step-text { width: 40%; }
.sh-label { font-size: 0.625rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 8px; display: block; }
.sh-step-title { font-size: 1.2rem; font-weight: 700; margin: 0 0 8px; line-height: 1.3; }
.sh-step-desc { color: #64748b; font-size: 0.875rem; line-height: 1.7; margin: 0; }
@media (max-width: 1024px) {
  .sh-inner { grid-template-columns: 1fr; gap: 48px; }
  .sh-section { padding: 64px 24px; }
  .sh-stagger { display: block; }
  .sh-step { flex-direction: column; }
  .sh-step-right, .sh-step-left { grid-column: unset; }
  .sh-img-wrap { width: 100%; }
  .sh-step-text { width: 100%; }
  .sh-right { gap: 40px; }
}

/* ── Moco Navbar ──────────────────────────────────────────────────────────── */
.mn-wrapper { position: relative; font-family: system-ui, -apple-system, sans-serif; }
.mn-nav { display: flex; align-items: center; justify-content: space-between; padding: 24px 48px; position: relative; z-index: 10; }
.mn-logo { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.04em; user-select: none; }
.mn-links { display: flex; align-items: center; gap: 40px; }
.mn-link { font-size: 0.875rem; font-weight: 500; text-decoration: none; color: rgba(255,255,255,0.5); transition: color 0.2s; }
.mn-link:hover { color: #fff; }
.mn-link-active { color: #fff !important; border-bottom: 2px solid #fff; padding-bottom: 4px; }
.mn-login { font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; background: none; border: none; cursor: pointer; padding: 0; }
.mn-login:hover { color: var(--mn-accent, #f97316); }
.mn-ham { display: none; background: none; border: none; cursor: pointer; line-height: 0; color: var(--mn-color, #fff); }
.mn-mobile-menu { position: absolute; top: 100%; left: 0; right: 0; z-index: 100; background-color: var(--mn-bg, #0d0d1a); display: none; flex-direction: column; align-items: center; padding: 40px 24px 48px; gap: 28px; border-top: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
.mn-mobile-menu.open { display: flex; }
.mn-mobile-link { font-size: 1.25rem; font-weight: 500; color: var(--mn-color, #fff); text-decoration: none; transition: color 0.2s; }
.mn-mobile-link:hover { color: var(--mn-accent, #f97316); }
.mn-mobile-btn { background-color: var(--mn-accent, #f97316); color: #fff; border: none; border-radius: 999px; padding: 12px 32px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 8px; }
@media (max-width: 768px) {
  .mn-nav { padding: 20px 24px; }
  .mn-links, .mn-login { display: none !important; }
  .mn-ham { display: flex; align-items: center; }
}

/* ── Moco Hero ────────────────────────────────────────────────────────────── */
.mh-section { padding: 20px 48px 80px; position: relative; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; }
.mh-blob-1 { position: absolute; top: -10%; left: -10%; width: 50%; height: 50%; filter: blur(120px); border-radius: 50%; pointer-events: none; z-index: 0; }
.mh-blob-2 { position: absolute; bottom: -10%; right: -10%; width: 50%; height: 50%; background: rgba(30,64,175,0.18); filter: blur(120px); border-radius: 50%; pointer-events: none; z-index: 0; }
.mh-dots { position: absolute; top: 70px; left: 14px; display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; opacity: 0.2; pointer-events: none; z-index: 0; }
.mh-dot { width: 4px; height: 4px; background: #fff; border-radius: 50%; }
.mh-inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; max-width: 1200px; margin: 0 auto; }
.mh-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.mh-card { border-radius: 16px; overflow: hidden; transition: transform 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; height: 245px; }
.mh-card:hover { transform: translateY(-8px); }
.mh-card-cream { background: #fdf6e9; padding: 22px 18px; }
.mh-card-img { position: relative; }
.mh-card-img .mh-card-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.mh-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(76,29,149,0.9) 0%, rgba(59,130,246,0.35) 100%); }
.mh-card-img-title { position: absolute; bottom: 0; left: 0; right: 0; padding: 18px; color: #fff; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin: 0; }
.mh-card-blue { background: #e0f2fe; padding: 18px; }
.mh-card-img-thumb { border-radius: 8px; overflow: hidden; flex: 1; margin-bottom: 10px; min-height: 0; }
.mh-card-accent { padding: 22px 18px; }
.mh-card-icons { display: flex; gap: 8px; }
.mh-icon-circle { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mh-icon-orange { background: #fed7aa; }
.mh-icon-orange-faint { background: rgba(254,215,170,0.4); }
.mh-card-title { font-size: 0.92rem; font-weight: 700; line-height: 1.3; margin: 0; }
.mh-title-dark { color: #2d2d2d; margin-bottom: 4px; }
.mh-title-navy { color: #0c4a6e; margin-bottom: 5px; }
.mh-card-quote { color: #9ca3af; font-size: 0.65rem; font-style: italic; line-height: 1.5; margin: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.mh-author-row { display: flex; align-items: center; gap: 5px; }
.mh-author-dot { width: 18px; height: 18px; border-radius: 50%; background: #cbd5e1; flex-shrink: 0; }
.mh-author-name { font-size: 0.62rem; color: #164e63; }
.mh-progress-bg { width: 100%; height: 5px; background: rgba(255,255,255,0.25); border-radius: 3px; overflow: hidden; }
.mh-progress-fill { width: 67%; height: 100%; background: #fff; }
.mh-hero-text { display: flex; flex-direction: column; gap: 24px; }
.mh-heading { font-size: clamp(2.8rem,4.2vw,4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.03em; margin: 0 0 20px; }
.mh-highlight { position: relative; display: inline-block; }
.mh-wave { position: absolute; bottom: -14px; left: 0; width: 100%; height: 18px; }
.mh-desc { color: #9ca3af; font-size: 1.05rem; line-height: 1.75; margin: 0; max-width: 480px; }
.mh-search-wrap { position: relative; max-width: 420px; }
.mh-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #6b7280; pointer-events: none; }
.mh-search { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 14px 20px 14px 48px; color: #fff; font-size: 0.95rem; outline: none; transition: all 0.2s; box-sizing: border-box; }
.mh-search:focus { background: rgba(255,255,255,0.1); border-color: rgba(249,115,22,0.5); box-shadow: 0 0 0 3px rgba(249,115,22,0.18); }
.mh-search::placeholder { color: #6b7280; }
@media (max-width: 900px) {
  .mh-inner { grid-template-columns: 1fr; gap: 48px; }
  .mh-cards { order: 2; }
  .mh-hero-text { order: 1; }
  .mh-section { padding: 20px 24px 60px; }
  .mh-card { height: 180px; }
  .mh-heading { font-size: 2.4rem; }
}
@media (max-width: 480px) {
  .mh-card { height: 150px; }
  .mh-card-title { font-size: 0.78rem; }
  .mh-heading { font-size: 2rem; }
}

/* ── Puzzle Navbar ────────────────────────────────────────────────────────── */
.pzl-nav { position: relative; font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; }
.pzl-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; }
.pzl-logo { display: flex; align-items: center; gap: 8px; }
.pzl-logo span { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; }
.pzl-nav-links { display: flex; align-items: center; gap: 32px; }
.pzl-nav-links a { text-decoration: none; font-size: 0.875rem; font-weight: 600; color: #64748b; transition: color 0.2s; }
.pzl-nav-links a:hover, .pzl-nav-links a.pzl-active { color: inherit; }
.pzl-nav-auth { display: flex; align-items: center; gap: 12px; }
.pzl-btn-reg { padding: 8px 20px; font-size: 0.875rem; font-weight: 700; border: 1.5px solid; border-radius: 8px; background: transparent; cursor: pointer; }
.pzl-btn-login { padding: 8px 20px; font-size: 0.875rem; font-weight: 700; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.pzl-hamburger { display: none; padding: 8px 10px; border: none; border-radius: 8px; cursor: pointer; color: #fff; line-height: 0; }
.pzl-mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; padding: 8px 20px 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.pzl-mobile-menu.open { display: block; }
.pzl-mobile-auth { display: flex; gap: 8px; margin-top: 12px; }
.pzl-mobile-auth .pzl-btn-reg, .pzl-mobile-auth .pzl-btn-login { flex: 1; text-align: center; }
@media (max-width: 768px) {
  .pzl-nav-inner { padding: 16px 20px; }
  .pzl-nav-links, .pzl-nav-auth { display: none !important; }
  .pzl-hamburger { display: flex; }
}

/* ── Puzzle Hero ──────────────────────────────────────────────────────────── */
.pzl-hero { position: relative; min-height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 60px 40px; overflow: hidden; font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; }
.pzl-cluster { position: absolute; display: grid; pointer-events: none; }
.pzl-cluster-left { left: -20px; top: 50%; transform: translateY(-50%); grid-template-columns: repeat(2, 120px); }
.pzl-cluster-right { right: -20px; bottom: -20px; grid-template-columns: repeat(3, 120px); }
.pzl-piece { width: 120px; height: 120px; }
.pzl-empty { width: 120px; height: 120px; }
@keyframes pzlFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
.pzl-piece { animation: pzlFloat 4s ease-in-out infinite; }
.pzl-delayed { animation-duration: 5s; animation-delay: 1s; }
.pzl-hero-content { position: relative; z-index: 2; max-width: 600px; }
.pzl-display-word { font-size: clamp(5rem,15vw,12rem); font-weight: 900; line-height: 1; letter-spacing: -0.05em; margin-bottom: 16px; user-select: none; }
.pzl-heading { font-size: 1.8rem; font-weight: 700; line-height: 1.3; max-width: 400px; margin: 0 auto 16px; }
.pzl-desc { color: #94a3b8; font-size: 0.95rem; line-height: 1.7; max-width: 380px; margin: 0 auto 32px; }
.pzl-cta-wrap { position: relative; display: inline-block; }
.pzl-cta { display: inline-block; padding: 14px 40px; color: #fff; font-weight: 700; font-size: 1rem; border-radius: 12px; text-decoration: none; transition: transform 0.15s; }
.pzl-cta:hover { transform: scale(1.05); }
.pzl-arrow { position: absolute; left: -48px; top: 40px; width: 64px; height: 64px; color: #94a3b8; opacity: 0.6; }
@media (max-width: 768px) {
  .pzl-hero { min-height: auto; padding: 60px 24px 80px; }
  .pzl-cluster { display: none; }
  .pzl-display-word { font-size: 5rem; }
  .pzl-heading { font-size: 1.4rem; }
  .pzl-arrow { display: none; }
}

/* ── Trend Navbar ─────────────────────────────────────────────────────────── */
.trend-nav { position: relative; font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; }
.trend-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 16px 48px; }
.trend-logo { display: flex; align-items: center; gap: 8px; font-weight: 900; font-size: 1.4rem; letter-spacing: -0.04em; text-decoration: none; }
.trend-nav-links { display: flex; align-items: center; gap: 28px; }
.trend-nav-links a { text-decoration: none; font-size: 0.875rem; font-weight: 600; transition: color 0.2s; }
.trend-nav-links a:hover { opacity: 0.75; }
.trend-nav-right { display: flex; align-items: center; gap: 10px; }
.trend-search-pill { display: flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 6px 16px; }
.trend-search-input { border: none; outline: none; background: transparent; font-size: 0.83rem; color: #334155; font-weight: 500; width: 110px; }
.trend-menu-btn { padding: 8px 10px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; line-height: 0; }
.trend-mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; padding: 8px 20px 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.trend-mobile-menu.open { display: block; }
.trend-mobile-menu a:last-child { border-bottom: none; }
@media (max-width: 768px) {
  .trend-nav-inner { padding: 14px 20px; }
  .trend-nav-links { display: none !important; }
  .trend-search-pill { display: none !important; }
}

/* ── Trend Hero ───────────────────────────────────────────────────────────── */
.trend-hero { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 80px 48px; font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; }
.trend-blob { position: absolute; border-radius: 50%; pointer-events: none; }
.trend-blob-tr { top: -60px; right: -60px; width: 300px; height: 300px; opacity: 0.04; }
.trend-blob-bl { bottom: -80px; left: -40px; width: 350px; height: 350px; opacity: 0.03; }
.trend-hero-left { flex: 1 1 0; max-width: 320px; display: flex; flex-direction: column; gap: 20px; position: relative; z-index: 1; }
.trend-hero-heading { font-size: 4rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin: 0; }
.trend-hero-highlight { position: relative; display: inline-block; padding: 0 6px; border: 2.5px solid currentColor; border-radius: 4px; }
.trend-hero-desc { color: #64748b; font-size: 1rem; max-width: 280px; line-height: 1.65; margin: 0; }
.trend-hero-cta { display: inline-flex; align-items: center; gap: 8px; color: #fff; border: none; border-radius: 999px; padding: 13px 28px; font-weight: 700; font-size: 0.95rem; cursor: pointer; text-decoration: none; width: fit-content; }
.trend-hero-social { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.trend-hero-avatars { display: flex; }
.trend-avatar { width: 34px; height: 34px; border-radius: 50%; border: 2px solid #fff; object-fit: cover; flex-shrink: 0; }
.trend-avatar + .trend-avatar, .trend-avatar-count { margin-left: -9px; }
.trend-avatar-count { width: 34px; height: 34px; border-radius: 50%; border: 2px solid #fff; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 0.58rem; font-weight: 800; color: #94a3b8; flex-shrink: 0; }
.trend-hero-rating { display: flex; align-items: center; gap: 5px; }
.trend-star { color: #f59e0b; font-size: 1.1rem; line-height: 1; }
.trend-rating-num { font-weight: 800; font-size: 0.88rem; }
.trend-rating-sub { font-size: 0.82rem; color: #94a3b8; }
.trend-hero-center { flex: 1 1 0; display: flex; align-items: center; justify-content: center; position: relative; min-height: 360px; }
.trend-splash { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 130%; height: 130%; pointer-events: none; }
.trend-product-img { position: relative; z-index: 1; width: 210px; height: auto; object-fit: contain; border-radius: 20px; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.14)); }
@keyframes trendFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes trendSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.trend-float { animation: trendFloat 6s ease-in-out infinite; }
.trend-hero-right { flex: 0 0 200px; display: flex; flex-direction: column; gap: 20px; position: relative; z-index: 1; }
.trend-feature { display: flex; flex-direction: column; }
.trend-feature h4 { font-weight: 800; font-size: 0.95rem; margin: 0 0 3px; }
.trend-feature p { font-size: 0.8rem; color: #94a3b8; margin: 0; line-height: 1.5; }
.trend-feature-accent { border-radius: 14px; padding: 14px 16px; color: #fff; }
.trend-feature-accent h4 { color: #fff; }
.trend-feature-accent p { color: rgba(255,255,255,0.82); }
.trend-video-circle { position: relative; width: 96px; height: 96px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 8px; }
.trend-spin-text { position: absolute; width: 100%; height: 100%; animation: trendSpin 16s linear infinite; }
.trend-play-btn { width: 34px; height: 34px; border-radius: 50%; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; text-decoration: none; line-height: 0; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.trend-play-btn:hover { transform: scale(1.12); box-shadow: 0 6px 18px rgba(0,0,0,0.25); }
.trend-cta { transition: transform 0.18s ease, box-shadow 0.18s ease; }
.trend-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.18); }
.trend-feature { transition: transform 0.2s ease; }
.trend-feature:hover { transform: translateY(-3px); }
@media (max-width: 768px) {
  .trend-hero { flex-direction: column; padding: 40px 20px 50px; gap: 40px; }
  .trend-hero-left { max-width: 100%; }
  .trend-hero-heading { font-size: 2.6rem; }
  .trend-hero-center { min-height: 220px; }
  .trend-product-img { width: 150px; }
  .trend-hero-right { flex: none; width: 100%; flex-direction: row; flex-wrap: wrap; gap: 12px; }
  .trend-feature { flex: 1 1 140px; }
  .trend-video-circle { margin-top: 0; }
}

/* ── Agensea Navbar ───────────────────────────────────────────────────────── */
.agn-links { display: flex; gap: 2.5rem; }
.agn-link { text-decoration: none; color: #52525b; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; transition: color 0.2s; }
.agn-link:hover { color: #000; }
.agn-cta:hover { opacity: 0.8 !important; }
#agn-mob.agn-open { display: flex !important; }
@media (max-width: 768px) {
  .agn-links { display: none; }
  .agn-ham { display: block !important; }
}

/* ── Agensea Hero ─────────────────────────────────────────────────────────── */
@keyframes agh-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.agh-section { box-sizing: border-box; }
.agh-row { display: flex; flex-direction: row; align-items: center; gap: 2rem; margin-bottom: 3rem; }
.agh-h1 { font-size: clamp(3.5rem, 7vw, 8rem); font-weight: 900; letter-spacing: -0.04em; line-height: 0.92; margin: 0; }
.agh-cap { border-radius: 9999px; overflow: hidden; background: #f4f4f5; flex-shrink: 0; }
.agh-cap-sm  { width: 220px; height: 110px; }
.agh-cap-flex { flex: 1; height: 110px; }
.agh-cap-lg  { width: 52%; height: 110px; }
.agh-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; display: block; }
.agh-cap:hover .agh-img { transform: scale(1.1); }
.agh-badge { position: absolute; left: 34%; bottom: -58px; z-index: 20; }
.agh-badge-mobile { display: none; justify-content: center; margin-top: 1rem; }
.agh-badge-wrap { position: relative; width: 120px; height: 120px; display: flex; justify-content: center; align-items: center; }
.agh-badge-ring { width: 100%; height: 100%; position: absolute; animation: agh-rotate 12s linear infinite; }
.agh-badge-btn { position: absolute; width: 44px; height: 44px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #fff; transition: opacity 0.2s; }
.agh-badge-btn:hover { opacity: 0.85; }
@media (max-width: 768px) {
  .agh-section { padding: 4rem 1.5rem 3rem !important; }
  .agh-row { flex-direction: column; align-items: flex-start; gap: 0.8rem; margin-bottom: 1.5rem; }
  .agh-h1 { font-size: clamp(2.2rem, 9vw, 4rem); }
  .agh-cap-sm  { width: 140px; height: 70px; }
  .agh-cap-flex { width: 100%; height: 80px; flex: none; }
  .agh-cap-lg  { width: 100%; height: 80px; }
  .agh-badge { display: none; }
  .agh-badge-mobile { display: flex; }
}

/* ── Perks Section ────────────────────────────────────────────────────────── */
.pk-section { padding: 32px; font-family: Inter, system-ui, -apple-system, sans-serif; box-sizing: border-box; }
.pk-card { max-width: 1280px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; position: relative; }
.pk-leaf { position: absolute; top: 16px; right: 16px; width: 80px; height: 80px; opacity: 0.08; transform: rotate(15deg); pointer-events: none; }
.pk-leaf svg { width: 100%; height: 100%; }
.pk-inner { display: flex; flex-direction: row; }
.pk-left { flex: 1; padding: 28px; }
.pk-img-wrap { position: relative; border-radius: 16px; overflow: hidden; height: 100%; min-height: 440px; }
.pk-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; }
.pk-img-wrap:hover .pk-img { transform: scale(1.04); }
.pk-right { flex: 1; padding: 56px; display: flex; flex-direction: column; justify-content: center; }
.pk-heading { font-size: 2.8rem; font-weight: 700; margin: 0 0 2.5rem; line-height: 1.15; }
.pk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.pk-item { display: flex; flex-direction: column; gap: 10px; }
.pk-badge { display: inline-block; align-self: flex-start; padding: 3px 12px; border-radius: 9999px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.pk-title { font-size: 1rem; font-weight: 700; margin: 0; line-height: 1.4; }
.pk-desc { font-size: 0.875rem; color: #6b7280; line-height: 1.65; margin: 0; }
@media (max-width: 768px) {
  .pk-section { padding: 16px; }
  .pk-inner { flex-direction: column; }
  .pk-left { padding: 16px; }
  .pk-img-wrap { min-height: 220px; height: 220px; }
  .pk-right { padding: 20px 20px 28px; }
  .pk-heading { font-size: 2rem; margin-bottom: 1.75rem; }
  .pk-grid { grid-template-columns: 1fr; gap: 28px; }
}

/* ── Trusted Brands Section ──────────────────────────────────────────────── */
@keyframes tbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
@keyframes tbPulse { 0%,100%{box-shadow:0 0 30px rgba(251,191,36,0.2)} 50%{box-shadow:0 0 60px rgba(251,191,36,0.4)} }
.tb-section { position:relative; min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 16px 128px; max-width:1280px; margin:0 auto; text-align:center; font-family:Inter,system-ui,sans-serif; overflow:hidden; }
.tb-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:100%; max-width:900px; aspect-ratio:1; background:rgba(37,99,235,0.05); filter:blur(120px); border-radius:50%; pointer-events:none; }
.tb-badge { display:inline-flex; align-items:center; padding:6px 16px; margin-bottom:32px; border-radius:9999px; border:1px solid #222; background:rgba(17,17,17,0.5); backdrop-filter:blur(8px); z-index:10; }
.tb-badge span { font-size:10px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#9ca3af; }
.tb-heading { font-size:clamp(2.5rem,5vw,4.5rem); font-weight:700; letter-spacing:-0.02em; margin:0 0 24px; background:linear-gradient(to bottom,#ffffff,#6b7280); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; z-index:10; line-height:1.1; }
.tb-desc { max-width:640px; color:#9ca3af; font-size:1.125rem; line-height:1.6; margin:0 0 64px; z-index:10; }
.tb-map { position:relative; width:100%; max-width:900px; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; }
.tb-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; opacity:0.2; }
.tb-center { position:relative; z-index:30; width:120px; height:120px; border-radius:50%; background:linear-gradient(135deg,#1f1f1f,#000); border:1px solid #333; display:flex; align-items:center; justify-content:center; box-shadow:0 25px 50px rgba(0,0,0,0.5); }
.tb-center-ring { position:absolute; inset:0; border-radius:50%; border:1px solid rgba(251,191,36,0.2); animation:tbPulse 3s ease-in-out infinite; }
.tb-center-core { width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; animation:tbPulse 3s ease-in-out infinite; }
.tb-center-core i { color:#000; font-size:1.8rem; }
.tb-float { animation:tbFloat 5s ease-in-out infinite; }
.tb-node { position:absolute; }
.tb-node-inner { width:60px; height:60px; border-radius:50%; background:rgba(17,17,17,0.8); border:1px solid #222; backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 32px rgba(0,0,0,0.3); transition:border-color 0.3s; }
.tb-node-inner:hover { border-color:#555; }
.tb-node-inner i { font-size:1.5rem; }
.tb-node-lg { width:72px; height:72px; }
.tb-n1 { top:15%; left:25%; }
.tb-n2 { top:15%; right:25%; }
.tb-n3 { bottom:15%; left:25%; }
.tb-n4 { bottom:15%; right:25%; }
.tb-n5 { top:50%; left:5%; transform:translateY(-50%); }
.tb-n6 { top:50%; right:5%; transform:translateY(-50%); }
.tb-cta { margin-top:48px; z-index:10; }
.tb-btn { display:inline-flex; align-items:center; gap:12px; padding:16px 40px; background:#2563eb; color:#fff; border-radius:9999px; font-weight:700; font-size:1.1rem; text-decoration:none; box-shadow:0 10px 40px rgba(37,99,235,0.3); transition:all 0.3s; }
.tb-btn:hover { background:#3b82f6; box-shadow:0 15px 50px rgba(37,99,235,0.5); transform:scale(1.02); }
@media (max-width:640px) {
  .tb-section { min-height:auto; padding:48px 16px 64px; }
  .tb-heading { font-size:clamp(1.8rem,8vw,2.5rem); margin:0 0 16px; }
  .tb-desc { font-size:0.95rem; margin:0 0 32px; padding:0 8px; }
  .tb-map { aspect-ratio:1/1; max-width:320px; }
  .tb-center { width:80px; height:80px; }
  .tb-center-core { width:56px; height:56px; }
  .tb-center-core i { font-size:1.3rem; }
  .tb-node-inner { width:44px; height:44px; }
  .tb-node-inner i { font-size:1rem; }
  .tb-node-lg { width:48px; height:48px; }
  .tb-n1 { top:8%; left:15%; }
  .tb-n2 { top:8%; right:15%; }
  .tb-n3 { bottom:8%; left:15%; }
  .tb-n4 { bottom:8%; right:15%; }
  .tb-n5 { left:2%; }
  .tb-n6 { right:2%; }
  .tb-cta { margin-top:32px; }
  .tb-btn { padding:12px 28px; font-size:0.95rem; gap:8px; }
  .tb-badge { margin-bottom:20px; padding:5px 12px; }
}

/* ── Skyline Hero Section ────────────────────────────────────────────────── */
.sl-hero { position:relative; font-family:'Plus Jakarta Sans',system-ui,sans-serif; overflow:hidden; padding:0; }
.sl-grid-lines { position:absolute; inset:0; pointer-events:none; z-index:1; }
.sl-grid-v { position:absolute; left:50%; top:0; bottom:0; width:1px; background:rgba(0,0,0,0.07); }
.sl-grid-h { position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(0,0,0,0.07); }
.sl-inner { max-width:1440px; margin:0 auto; padding:48px 48px 64px; display:grid; grid-template-columns:1.2fr 0.8fr 1fr; gap:32px; position:relative; z-index:10; min-height:85vh; align-items:stretch; }
.sl-left { display:flex; flex-direction:column; justify-content:space-between; min-width:0; }
.sl-h1 { font-size:clamp(3.5rem,8vw,7.5rem); font-weight:600; line-height:0.88; margin:0 0 48px; }
.sl-h1-italic { font-family:'Playfair Display',Georgia,serif; font-style:italic; font-weight:500; display:block; }
.sl-cta { display:inline-flex; align-items:center; gap:12px; padding:14px 32px; border-radius:9999px; font-weight:700; font-size:0.95rem; text-decoration:none; cursor:pointer; border:none; transition:all 0.2s; color:#fff; }
.sl-cta:hover { filter:brightness(0.9); box-shadow:0 12px 32px rgba(0,0,0,0.15); }
.sl-desc { max-width:360px; line-height:1.7; font-size:1.05rem; font-weight:500; margin-top:48px; }
.sl-desc-text { color:#6b7280; margin:0 0 32px; }
.sl-avatars { display:flex; }
.sl-avatar { width:52px; height:52px; border-radius:50%; object-fit:cover; margin-left:-12px; border:4px solid; }
.sl-avatar:first-child { margin-left:0; }
.sl-center { display:flex; align-items:center; justify-content:center; position:relative; min-width:0; }
.sl-oval-wrap { position:relative; width:100%; max-width:400px; margin:0 auto; }
.sl-oval { width:100%; aspect-ratio:10/14; border-radius:999px; overflow:hidden; border:4px solid #fff; box-shadow:0 40px 80px -20px rgba(0,0,0,0.15); position:relative; background-color:#ede4dc; min-height:300px; }
.sl-oval img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; transition:transform 1.2s cubic-bezier(0.2,1,0.3,1); }
.sl-oval:hover img { transform:scale(1.05); }
.sl-oval-btn { position:absolute; bottom:14%; right:-10%; width:72px; height:72px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:28px; cursor:pointer; transition:all 0.3s; z-index:30; border:6px solid; }
.sl-oval-btn:hover { transform:scale(1.1) rotate(15deg); }
.sl-right { display:flex; flex-direction:column; justify-content:space-between; align-items:flex-end; text-align:right; min-width:0; }
.sl-testimonial { max-width:280px; }
.sl-stars { display:flex; justify-content:flex-end; gap:3px; margin-bottom:16px; font-size:0.9rem; }
.sl-t-header { display:flex; align-items:center; justify-content:flex-end; gap:12px; margin-bottom:16px; }
.sl-t-name { font-weight:700; font-size:1rem; white-space:nowrap; }
.sl-t-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex-shrink:0; }
.sl-t-text { color:#6b7280; font-weight:500; line-height:1.6; font-size:0.875rem; word-wrap:break-word; overflow-wrap:break-word; }
.sl-stats-wrap { width:100%; }
.sl-stats { display:flex; justify-content:flex-end; gap:48px; margin-bottom:48px; }
.sl-stat-val { font-size:clamp(2rem,4vw,3rem); font-weight:700; margin:0 0 4px; line-height:1; }
.sl-stat-lab { font-size:10px; text-transform:uppercase; letter-spacing:0.3em; color:#9ca3af; font-weight:700; margin:0; }
.sl-actions { display:flex; align-items:center; justify-content:flex-end; gap:40px; }
.sl-qr-btn { width:72px; height:72px; background:#000; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.6rem; box-shadow:0 20px 40px rgba(0,0,0,0.2); cursor:pointer; transition:transform 0.2s; outline:12px solid #fff; flex-shrink:0; }
.sl-qr-btn:hover { transform:scale(1.05); }
@media (max-width:768px) {
  .sl-inner { grid-template-columns:1fr; gap:40px; min-height:auto; padding:28px 20px 40px; }
  .sl-grid-lines { display:none; }
  .sl-right { align-items:flex-start; text-align:left; }
  .sl-testimonial { max-width:100%; }
  .sl-stars { justify-content:flex-start; }
  .sl-t-header { justify-content:flex-start; }
  .sl-stats { justify-content:flex-start; }
  .sl-actions { justify-content:flex-start; }
  .sl-oval-wrap { max-width:240px; margin:0 auto; }
  .sl-oval { min-height:260px; }
  .sl-oval-btn { width:48px; height:48px; font-size:18px; right:-5%; }
  .sl-h1 { font-size:clamp(2.5rem,10vw,3.5rem); margin-bottom:20px; white-space:normal; }
  .sl-desc { margin-top:24px; }
}

/* ── Classic-Minimal / Glass-Floating / Shop / Otaga navbar responsive ────── */
@media (max-width: 768px) {
  [class*="cm-links-"]  { display: none !important; }
  [class*="cm-cta-"]    { display: none !important; }
  [class*="cm-ham-"]    { display: block !important; }
  [class*="gf-links-"]  { display: none !important; }
  [class*="gf-ham-"]    { display: block !important; }
  [class*="sh-links-"]  { display: none !important; }
  [class*="sh-search-"] { display: none !important; }
  [class*="sh-ham-"]    { display: block !important; }
  [class*="otg-links-"] { display: none !important; }
  [class*="otg-soc-"]   { display: none !important; }
  [class*="otg-ham-"]   { display: block !important; }
}

/* ── Winzy Navbar ────────────────────────────────────────────────────── */
.wz-nav { position:relative; z-index:50; padding:24px; display:flex; align-items:center; justify-content:space-between; font-family:'Inter',sans-serif; transition:all 0.3s; }
@media (min-width:768px) { .wz-nav { padding:24px 48px; } }
.wz-brand { display:flex; align-items:center; gap:8px; cursor:pointer; }
.wz-brand-icon { width:32px; height:32px; background:#ef4444; border-radius:8px; display:flex; align-items:center; justify-content:center; transform:rotate(12deg); }
.wz-brand-text { font-size:24px; font-weight:700; letter-spacing:-0.05em; margin:0; line-height:1; }
.wz-links { display:none; }
@media (min-width:1024px) { .wz-links { display:flex; align-items:center; gap:32px; font-size:14px; font-weight:500; color:#d1d5db; } }
.wz-nav-item { cursor:pointer; text-decoration:none; color:inherit; transition:color 0.2s; }
.wz-nav-item:hover { color:#ffffff; }
.wz-btn { display:none; background:#ef4444; color:#fff; border:none; padding:10px 24px; border-radius:9999px; font-weight:600; cursor:pointer; transition:transform 0.2s,background 0.2s; box-shadow:0 10px 15px -3px rgba(239,68,68,0.2); }
@media (min-width:1024px) { .wz-btn { display:block; } }
.wz-btn:hover { background:#dc2626; transform:scale(0.95); }
.wz-ham { display:flex; background:none; border:none; cursor:pointer; color:inherit; padding:0; align-items:center; justify-content:center; }
@media (min-width:1024px) { .wz-ham { display:none; } }
.wz-mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; border-top: 1px solid rgba(255,255,255,0.1); padding: 16px 0; z-index: 100; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.wz-mobile-menu.open { display: flex; flex-direction: column; }
.wz-mobile-link { display: block; padding: 14px 24px; font-size: 16px; font-weight: 500; color: #d1d5db; text-decoration: none; transition: all 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; }
.wz-mobile-link:hover { color: #fff; background: rgba(255,255,255,0.05); padding-left: 32px; }
.wz-mobile-btn { display: block; margin: 16px 24px 8px; background: #ef4444; color: #fff; border: none; padding: 12px 24px; border-radius: 9999px; font-weight: 600; cursor: pointer; font-size: 15px; text-align: center; }

/* ── Winzy Hero ──────────────────────────────────────────────────────── */
.wz-hero { position:relative; min-height:100vh; overflow:hidden; font-family:'Inter',sans-serif; display:flex; flex-direction:column; justify-content:space-between; padding-top:120px; padding-bottom:80px; }
.wz-bg { position:absolute; inset:0; z-index:0; }
.wz-bg img { width:100%; height:100%; object-fit:cover; opacity:0.6; filter:brightness(0.75); transform:scale(1.05); }
.wz-bg-grad { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(0,0,0,0.6),transparent,rgba(0,0,0,0.8)); }
.wz-container { position:relative; z-index:10; padding:0 24px; max-width:1400px; margin:0 auto; width:100%; display:flex; flex-direction:column; flex:1; justify-content:center; }
@media (min-width:768px) { .wz-container { padding:0 48px; } }
.wz-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; margin-bottom:48px; }
@media (min-width:1024px) { .wz-grid { grid-template-columns:7fr 5fr; } }
.wz-left { display:flex; flex-direction:column; gap:32px; }
.wz-h1 { font-size:clamp(3rem,5vw,4.5rem); font-weight:700; line-height:1.1; max-width:600px; margin:0; }
.wz-desc { font-size:1.125rem; color:#d1d5db; max-width:450px; line-height:1.6; margin:0; }
.wz-left-btn { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:16px 32px; border-radius:9999px; display:inline-flex; align-items:center; gap:12px; font-weight:600; color:#fff; cursor:pointer; transition:all 0.3s; backdrop-filter:blur(8px); width:max-content; }
.wz-left-btn:hover { background:rgba(255,255,255,0.2); }
.wz-btn-icon { background:rgba(255,255,255,0.1); padding:6px; border-radius:50%; display:flex; transition:all 0.3s; }
.wz-left-btn:hover .wz-btn-icon { background:#fff; color:#000; }
.wz-right { display:flex; justify-content:center; }
@media (min-width:1024px) { .wz-right { justify-content:flex-end; } }
.wz-card { width:100%; max-width:380px; background:rgba(0,0,0,0.4); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1); padding:16px; border-radius:32px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); }
.wz-card-img-wrap { position:relative; aspect-ratio:4/3; border-radius:16px; overflow:hidden; margin-bottom:24px; }
.wz-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s; }
.wz-card:hover .wz-card-img { transform:scale(1.1); }
.wz-card-img-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.4),transparent); }
.wz-card-progress { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; padding:0 8px; }
.wz-card-step { font-size:0.875rem; font-weight:500; color:#9ca3af; }
.wz-bars { display:flex; gap:6px; height:4px; flex:1; margin:0 16px; }
.wz-bar { height:100%; width:33.33%; border-radius:99px; }
.wz-bar-active { background:#fff; }
.wz-bar-inactive { background:rgba(255,255,255,0.2); }
.wz-card-text { display:flex; align-items:flex-start; gap:16px; padding:0 8px 8px; }
.wz-card-tag { font-size:1.5rem; font-weight:700; line-height:1; margin:0; }
.wz-card-desc { font-size:0.875rem; color:#d1d5db; line-height:1.6; margin:0; }
.wz-footer { display:flex; flex-direction:column; align-items:center; justify-content:space-between; gap:32px; width:100%; margin-top:auto; }
@media (min-width:768px) { .wz-footer { flex-direction:row; margin-top:48px; } }
.wz-users { display:flex; align-items:center; gap:16px; background:rgba(0,0,0,0.2); backdrop-filter:blur(8px); padding:8px 24px 8px 8px; border-radius:9999px; border:1px solid rgba(255,255,255,0.05); }
.wz-avatars { display:flex; }
.wz-avatar { width:40px; height:40px; border-radius:50%; border:2px solid #1a1a1a; object-fit:cover; margin-left:-12px; }
.wz-avatar:first-child { margin-left:0; }
.wz-users-text { font-size:0.875rem; font-weight:700; margin:0; }
.wz-rotator { position:relative; width:128px; height:128px; display:flex; align-items:center; justify-content:center; }
.wz-rotator-inner { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:10; }
.wz-rotator-btn { width:40px; height:40px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.2); }
.wz-rotator-icon { width:20px; height:20px; background:#ef4444; border-radius:4px; display:flex; align-items:center; justify-content:center; transform:rotate(12deg); color:#fff; }
@keyframes wz-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
.wz-rotator-svg { width:100%; height:100%; animation:wz-spin 10s linear infinite; }
.wz-social { display:flex; align-items:center; gap:32px; }
.wz-social-text { font-size:0.875rem; font-weight:500; color:#9ca3af; margin:0; }
.wz-icons { display:flex; gap:16px; }
.wz-icon-link { width:40px; height:40px; border-radius:50%; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; color:#9ca3af; transition:all 0.3s; cursor:pointer; text-decoration:none; }
.wz-icon-link:hover { background:rgba(255,255,255,0.1); color:#fff; }

/* ── Product Card Section ─────────────────────────────────────────────────── */
.pc-outer { display: flex; align-items: center; justify-content: center; padding: 40px 24px; font-family: Inter, system-ui, sans-serif; }
.pc-card { background: #ffffff; border-radius: 2rem; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.1); width: 100%; max-width: 1000px; padding: 56px 64px; }
.pc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.pc-img-col { display: flex; justify-content: center; align-items: center; }
.pc-img { width: 100%; height: auto; transform: scale(1.08); filter: drop-shadow(0 20px 40px rgba(0,0,0,0.18)); display: block; }
.pc-details { display: flex; flex-direction: column; gap: 28px; }
.pc-title { font-size: 2.8rem; font-weight: 700; letter-spacing: -0.03em; margin: 0 0 16px; line-height: 1.1; }
.pc-desc { color: #6b7280; font-size: 1.05rem; line-height: 1.7; margin: 0; }
.pc-buy { display: flex; flex-direction: column; gap: 20px; }
.pc-price { font-size: 2.2rem; font-weight: 700; letter-spacing: -0.03em; margin: 0; }
.pc-btns { display: flex; flex-wrap: wrap; gap: 12px; }
.pc-btn-primary { color: #fff; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: filter 0.2s; }
.pc-btn-primary:hover { filter: brightness(0.9); }
.pc-btn-secondary { background: transparent; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid; cursor: pointer; transition: background 0.2s; }
.pc-btn-secondary:hover { background: #f0f4ff; }
.pc-rating { display: flex; align-items: center; gap: 10px; }
.pc-stars { display: flex; gap: 2px; }
.pc-star { width: 18px; height: 18px; fill: #fb923c; }
.pc-rating-num { font-size: 14px; font-weight: 600; }
.pc-review-link { font-size: 14px; color: #3b82f6; text-decoration: underline; text-underline-offset: 3px; }
.pc-feats-wrap { padding-top: 24px; border-top: 1px solid #f3f4f6; }
.pc-feats-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin: 0 0 20px; }
.pc-feats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.pc-feat { display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.7; text-align: center; transition: opacity 0.3s; }
.pc-feat:hover { opacity: 1; }
.pc-feat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin: 0; }
@media (max-width: 768px) {
  .pc-card { padding: 28px 20px; }
  .pc-grid { grid-template-columns: 1fr; gap: 32px; }
  .pc-title { font-size: 2rem; }
}

/* ── Creative Collective Templates ────────────────────────────────────────── */
/* Navbar */
.ccn-header { border-bottom:1px solid #f3f4f6; position:sticky; top:0; z-index:50; font-family:Inter,system-ui,sans-serif; }
.ccn-inner { max-width:1200px; margin:0 auto; padding:0 24px; height:72px; display:flex; align-items:center; justify-content:space-between; }
.ccn-brand { font-size:1.1rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; }
.ccn-desktop-nav { display:flex; gap:36px; }
.ccn-link { font-size:14px; font-weight:500; text-decoration:none; }
.ccn-link:hover { color:#1a1a1a !important; }
.ccn-link-active { border-bottom:2px solid currentColor; padding-bottom:2px; }
.ccn-ham { background:none; border:none; cursor:pointer; padding:8px; display:none; }
.ccn-overlay { position:fixed; inset:0; z-index:100; display:none; flex-direction:column; font-family:Inter,system-ui,sans-serif; transform:translateX(100%); transition:transform 0.3s ease-in-out; }
.ccn-overlay.ccn-ovl-show { display:flex; transform:translateX(0); }
.ccn-ovl-head { display:flex; justify-content:space-between; align-items:center; padding:0 24px; height:72px; border-bottom:1px solid #f3f4f6; }
.ccn-close { background:none; border:none; cursor:pointer; font-size:1.4rem; padding:8px; }
.ccn-ovl-nav { display:flex; flex-direction:column; padding:40px 24px; gap:32px; }
.ccn-ovl-link { font-size:1.6rem; font-weight:300; text-transform:uppercase; letter-spacing:0.12em; text-decoration:none; transition:padding-left 0.3s; }
.ccn-ovl-link:hover { padding-left:16px; }
/* Hero */
.cch-section { height:65vh; background-size:cover; background-position:center; transition:background-image 1.5s ease-in-out; position:relative; display:flex; align-items:center; padding:0 24px; font-family:Inter,system-ui,sans-serif; }
.cch-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.45); z-index:1; }
.cch-content { max-width:1200px; margin:0 auto; width:100%; position:relative; z-index:2; }
.cch-heading { font-size:3rem; font-weight:700; letter-spacing:-0.02em; text-transform:uppercase; line-height:1.15; margin:0 0 8px; max-width:560px; }
.cch-subtitle { font-size:1.15rem; opacity:0.9; font-weight:300; margin:0; }
.cch-dots { position:absolute; bottom:28px; left:50%; transform:translateX(-50%); display:flex; gap:10px; z-index:2; }
.cch-dot { width:8px; height:8px; border-radius:50%; border:none; cursor:pointer; padding:0; background:rgba(255,255,255,0.4); transition:all 0.3s ease; }
.cch-dot.cch-dot-active { background:#fff; transform:scale(1.2); }
/* Projects */
.ccp-section { padding:56px 24px; font-family:Inter,system-ui,sans-serif; }
.ccp-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:28px; }
.ccp-card { background:#fff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); transition:all 0.3s ease; overflow:hidden; }
.ccp-card:hover { transform:translateY(-5px); box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); }
.ccp-img-wrap { aspect-ratio:4/5; overflow:hidden; }
.ccp-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s ease; }
.ccp-card:hover .ccp-img { transform:scale(1.05); }
.ccp-info { padding:18px 20px; display:flex; justify-content:space-between; align-items:center; }
.ccp-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 4px; }
.ccp-cat { font-size:10px; color:#9ca3af; font-style:italic; margin:0; }
.ccp-btn { border:1px solid #e5e7eb; font-size:10px; text-transform:uppercase; letter-spacing:0.05em; padding:6px 12px; font-weight:700; background:transparent; cursor:pointer; white-space:nowrap; transition:all 0.2s; }
.ccp-btn:hover { background:#1a1a1a; color:#fff; border-color:#1a1a1a; }
/* Footer */
.ccf-footer { border-top:1px solid #f3f4f6; padding:40px 24px; font-family:Inter,system-ui,sans-serif; }
.ccf-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:20px; }
.ccf-copy { font-size:11px; color:#9ca3af; letter-spacing:0.05em; text-transform:uppercase; margin:0; }
.ccf-socials { display:flex; gap:20px; }
.ccf-social { display:flex; transition:opacity 0.2s; }
.ccf-social:hover { opacity:0.5; }
@media (max-width:768px) {
  .ccn-desktop-nav { display:none; }
  .ccn-ham { display:block; }
  .cch-section { height:50vh; }
  .cch-heading { font-size:2rem; }
  .ccp-grid { grid-template-columns:1fr 1fr; gap:16px; }
  .ccp-section { padding:40px 16px; }
  .ccf-inner { flex-direction:column; text-align:center; }
}

/* ── SoleMate Templates ───────────────────────────────────────────────────── */
/* Navbar */
.smn-header { border-bottom: 1px solid #f3f4f6; position: sticky; top: 0; z-index: 50; font-family: Inter, system-ui, sans-serif; }
.smn-inner { max-width: 1200px; margin: 0 auto; padding: 0 16px; height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.smn-search-wrap { width: 220px; position: relative; flex-shrink: 0; }
.smn-search { width: 100%; border: 1px solid #d1d5db; border-radius: 2px; padding: 6px 36px 6px 10px; font-size: 13px; outline: none; box-sizing: border-box; }
.smn-search-icon { width: 14px; height: 14px; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
.smn-center { display: flex; flex-direction: column; align-items: center; flex: 1; }
.smn-links { display: flex; align-items: center; gap: 24px; margin-bottom: 2px; }
.smn-link { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; text-decoration: none; padding-bottom: 2px; border-bottom: 2px solid transparent; }
.smn-link:hover { opacity: 0.5; }
.smn-cart { position: relative; cursor: pointer; }
.smn-cart-count { position: absolute; top: -7px; right: -8px; background: #ef4444; color: #fff; font-size: 9px; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.smn-link.smn-link-active { border-bottom: 2px solid currentColor !important; }
.smn-brand { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; font-style: italic; margin: 0; line-height: 1.1; }
.smn-spacer { width: 220px; flex-shrink: 0; }
/* Hero */
.smh-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; padding: 4px; background: #fff; font-family: Inter, system-ui, sans-serif; }
.smh-panel { position: relative; aspect-ratio: 4/5; overflow: hidden; cursor: pointer; }
.smh-panel-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.smh-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; transition: background 0.3s ease; }
.smh-panel:hover .smh-overlay { background: rgba(0,0,0,0.3); }
.smh-btn { border: 2px solid #fff; color: #fff; background: transparent; padding: 6px 20px; text-transform: uppercase; font-weight: 600; font-size: 13px; letter-spacing: 0.05em; cursor: pointer; transition: all 0.3s ease; }
.smh-btn:hover { background: #fff; color: #000; }
/* Categories */
.smc-section { padding: 48px 24px; font-family: Inter, system-ui, sans-serif; }
.smc-wrap { max-width: 1200px; margin: 0 auto; }
.smc-tabs { display: flex; justify-content: center; gap: 40px; margin-bottom: 32px; }
.smc-tab { background: none; border: none; font-size: 14px; font-weight: 600; cursor: pointer; padding-bottom: 4px; border-bottom: 2px solid transparent; transition: border-color 0.2s; }
.smc-tab-active { border-bottom-color: currentColor !important; }
.smc-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.smc-img { aspect-ratio: 1/1; object-fit: cover; border-radius: 2px; width: 100%; display: block; }
/* Products */
.smp-section { padding: 48px 24px; font-family: Inter, system-ui, sans-serif; }
.smp-wrap { max-width: 1200px; margin: 0 auto; }
.smp-title { text-align: center; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 40px; }
.smp-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
.smp-card { text-align: center; }
.smp-img-wrap { background: #f9fafb; padding: 16px; border-radius: 2px; margin-bottom: 12px; overflow: hidden; }
.smp-img { width: 100%; height: 112px; object-fit: contain; display: block; transition: transform 0.3s; }
.smp-card:hover .smp-img { transform: scale(1.08); }
.smp-name { font-size: 11px; font-weight: 700; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.smp-price { font-size: 10px; color: #6b7280; margin: 0 0 10px; }
.smp-btn { background: #1a1a1a; color: #fff; font-size: 9px; padding: 6px 14px; text-transform: uppercase; font-weight: 700; border: none; cursor: pointer; letter-spacing: 0.05em; transition: background 0.2s; }
.smp-btn:hover { background: #333; }
/* Footer */
.smf-footer { padding: 40px 24px; font-family: Inter, system-ui, sans-serif; }
.smf-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.smf-links { display: flex; gap: 32px; }
.smf-link { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; text-decoration: none; opacity: 0.8; }
.smf-link:hover { opacity: 1; }
.smf-socials { display: flex; gap: 20px; }
.smf-social { display: flex; transition: opacity 0.2s; }
.smf-social:hover { opacity: 0.6; }
@media (max-width: 768px) {
  .smn-search-wrap, .smn-spacer { display: none; }
  .smh-grid { grid-template-columns: repeat(2, 1fr); }
  .smc-tabs { gap: 16px; }
  .smc-grid { grid-template-columns: repeat(3, 1fr); }
  .smp-grid { grid-template-columns: repeat(2, 1fr); }
  .smf-inner { flex-direction: column; }
}

/* ── AetherFlow Product Section ───────────────────────────────────────────── */
.af-outer { padding: 32px; font-family: Inter, system-ui, sans-serif; }
.af-grid { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: stretch; }
.af-left-card { background: #fff; border-radius: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; }
.af-right-card { background: #fff; border-radius: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08); padding: 40px; display: flex; flex-direction: column; }
.af-hero-area { background: linear-gradient(135deg,#f9fafb 0%,#f3f4f6 100%); border-bottom: 1px solid rgba(0,0,0,0.03); padding: 56px 48px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 24px; min-height: 340px; }
.af-hero-text { max-width: 240px; }
.af-title { font-size: 2.8rem; font-weight: 700; letter-spacing: -0.04em; line-height: 1.1; margin: 0 0 8px; }
.af-subtitle { color: #6b7280; font-size: 1rem; margin: 0 0 32px; font-weight: 300; }
.af-cta-btn { background: #1a1a1a; color: #fff; padding: 14px 36px; border-radius: 9999px; font-weight: 600; font-size: 13px; letter-spacing: 0.04em; border: none; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
.af-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.af-main-img-wrap { flex: 1; display: flex; justify-content: center; max-width: 280px; }
.af-main-img { width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 24px 32px rgba(0,0,0,0.15)); transition: opacity 0.3s ease, transform 0.3s ease; }
.af-main-img.af-changing { opacity: 0; transform: translateY(12px) scale(0.96); }
.af-gallery { padding: 28px 32px; background: #fff; display: flex; flex-wrap: wrap; gap: 12px; }
.af-thumb { width: 88px; height: 88px; border-radius: 1.2rem; overflow: hidden; padding: 8px; display: flex; align-items: center; justify-content: center; background: #f9fafb; border: 2px solid transparent; cursor: pointer; transition: all 0.25s ease; }
.af-thumb:hover { background: #fff; box-shadow: 0 8px 16px rgba(0,0,0,0.06); transform: translateY(-3px); }
.af-thumb.af-thumb-active { border-color: #1a1a1a; background: #fff; box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
.af-thumb-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.af-specs-section { flex-grow: 1; }
.af-section-title { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 28px; }
.af-specs { display: flex; flex-direction: column; gap: 24px; }
.af-spec-item {}
.af-spec-label { color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 6px; }
.af-spec-value { font-weight: 600; font-size: 1.05rem; margin: 0; }
.af-buy-section { margin-top: 36px; padding-top: 28px; border-top: 1px solid #f3f4f6; }
.af-select-wrap { margin-bottom: 20px; }
.af-select-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.15em; display: block; margin-bottom: 10px; }
.af-select-box { position: relative; }
.af-select { width: 100%; background: #f9fafb; border: 2px solid transparent; border-radius: 1rem; padding: 14px 18px; font-size: 14px; font-weight: 600; outline: none; cursor: pointer; appearance: none; transition: border-color 0.2s; }
.af-select:hover { border-color: #e5e7eb; }
.af-arrow { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0.4; font-size: 10px; }
.af-price-row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
.af-price { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.04em; margin: 0; }
.af-stock { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #16a34a; margin: 0; }
.af-buy-btn { background: #1a1a1a; color: #fff; width: 100%; padding: 16px; border-radius: 1rem; font-weight: 700; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; border: none; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
.af-buy-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
@media (max-width: 768px) {
  .af-outer { padding: 16px; }
  .af-grid { grid-template-columns: 1fr; }
  .af-hero-area { flex-direction: column; padding: 32px 24px; min-height: auto; }
  .af-hero-text { max-width: 100%; text-align: center; }
  .af-main-img-wrap { max-width: 200px; margin: 0 auto; }
  .af-title { font-size: 2rem; }
  .af-gallery { justify-content: center; }
  .af-thumb { width: 64px; height: 64px; }
  .af-right-card { padding: 28px 24px; }
}

/* ── HomeHero Templates ───────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Inter:wght@400;500;700;800&display=swap');
@keyframes hh-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes hh-gs-lift { to { filter: grayscale(0); } }

/* Navbar */
.hhn-header { border-bottom: 1px solid #f9fafb; padding: 20px 24px; position: sticky; top: 0; z-index: 40; }
.hhn-nav { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; font-family: Inter, system-ui, sans-serif; }
.hhn-left { display: flex; align-items: center; gap: 48px; }
.hhn-logo { display: flex; align-items: center; gap: 8px; }
.hhn-badge { color: #fff; padding: 5px 7px; border-radius: 4px; font-weight: 700; font-size: 13px; letter-spacing: -0.05em; }
.hhn-brand { font-weight: 700; font-size: 1.15rem; letter-spacing: -0.02em; }
.hhn-links { display: flex; gap: 32px; }
.hhn-link { font-size: 14px; font-weight: 500; color: #6b7280; text-decoration: none; transition: color 0.2s; }
.hhn-link:hover { color: #1a1a1a; }
.hhn-ham { display: none; background: none; border: none; cursor: pointer; padding: 8px; color: inherit; }
.hhn-overlay { position: fixed; inset: 0; z-index: 50; display: none; flex-direction: column; }
.hhn-overlay.hhn-ovl-active { display: flex; }
.hhn-ovl-head { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #f3f4f6; }
.hhn-close { background: none; border: none; font-size: 22px; cursor: pointer; padding: 8px; }
.hhn-ovl-links { padding: 32px; display: flex; flex-direction: column; gap: 28px; }
.hhn-ovl-link { font-family: 'Oswald', Impact, sans-serif; font-size: 2.2rem; text-transform: uppercase; letter-spacing: -0.02em; text-decoration: none; transition: color 0.2s; }
.hhn-ovl-foot { margin-top: auto; padding: 28px; border-top: 1px solid #f3f4f6; }
.hhn-cta-btn { width: 100%; color: #fff; padding: 18px; border-radius: 12px; font-weight: 700; font-size: 1rem; border: none; cursor: pointer; }
@media (max-width: 768px) {
  .hhn-ham { display: block; }
  .hhn-links { display: none; }
}

/* Hero */
.hh-hero { position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif; }
.hh-hero-inner { position: relative; max-width: 1280px; margin: 0 auto; padding: 72px 24px 140px; }
.hh-portrait { position: absolute; z-index: 1; animation: hh-float 3s ease-in-out infinite; }
.hh-shape { position: absolute; width: 80%; height: 85%; border-radius: 4px; transform: rotate(-5deg); z-index: 0; }
.hh-portrait-img { width: 100%; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.12); display: block; position: relative; z-index: 1; transition: filter 0.5s; }
.hh-gs { filter: grayscale(1); }
.hh-portrait-img:hover { filter: none !important; }
.hh-center { position: relative; z-index: 10; text-align: center; max-width: 560px; margin: 0 auto; }
.hh-heading { font-family: 'Oswald', Impact, sans-serif; font-size: 4rem; font-weight: 700; letter-spacing: -0.02em; line-height: 0.92; margin: 0 0 20px; text-transform: uppercase; }
.hh-subtitle { color: #6b7280; font-size: 1rem; line-height: 1.7; margin-bottom: 36px; }
.hh-form { display: flex; max-width: 420px; margin: 0 auto; }
.hh-email { flex: 1; padding: 16px 20px; background: #f3f4f6; border: 1px solid transparent; border-radius: 12px 0 0 12px; outline: none; font-size: 14px; }
.hh-cta-btn { padding: 16px 20px; color: #fff; border: none; border-radius: 0 12px 12px 0; font-weight: 700; font-size: 14px; cursor: pointer; white-space: nowrap; }
.hh-phone-wrap { margin-top: 80px; display: flex; justify-content: center; position: relative; z-index: 20; }
.hh-phone { width: 240px; border: 8px solid #111827; border-radius: 2.5rem; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.22); background: #fff; aspect-ratio: 9/19; }
.hh-phone-bar { height: 28px; background: #f9fafb; display: flex; align-items: center; justify-content: center; }
.hh-phone-pill { width: 56px; height: 3px; background: #d1d5db; border-radius: 9999px; }
.hh-phone-content { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.hh-phone-user { display: flex; align-items: center; gap: 7px; }
.hh-phone-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; }
.hh-phone-name { font-size: 11px; font-weight: 700; }
.hh-phone-msg { padding: 10px; border-radius: 14px; font-size: 9px; line-height: 1.6; color: #312e81; }
.hh-phone-item { height: 36px; background: #f9fafb; border-radius: 10px; display: flex; align-items: center; padding: 0 10px; justify-content: space-between; }
.hh-phone-label { font-size: 8px; color: #9ca3af; }
.hh-phone-badge { font-size: 8px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; }
.hh-mob-strip { display: none; overflow-x: auto; gap: 20px; padding: 8px 24px 56px; scrollbar-width: none; }
.hh-mob-strip::-webkit-scrollbar { display: none; }
.hh-mob-portrait { flex-shrink: 0; width: 110px; position: relative; }
.hh-mob-shape { position: absolute; width: 36px; height: 36px; border-radius: 4px; transform: rotate(-5deg); top: -7px; left: -7px; z-index: 0; }
.hh-mob-img { width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: block; position: relative; z-index: 1; }
@media (max-width: 768px) {
  .hh-portrait { display: none; }
  .hh-hero-inner { padding: 48px 24px 32px; }
  .hh-heading { font-size: 2.8rem; }
  .hh-form { flex-direction: column; gap: 8px; }
  .hh-email { border-radius: 12px; }
  .hh-cta-btn { border-radius: 12px; }
  .hh-phone-wrap { margin-top: 48px; }
  .hh-mob-strip { display: flex; }
}

/* ── The Qi Templates ────────────────────────────────────────────────────── */
/* Qi Navbar */
.qi-header { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid #e5e7eb; }
.qi-nav { max-width: 1440px; margin: 0 auto; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; font-family: Inter, system-ui, sans-serif; }
.qi-nav-left { display: flex; align-items: center; width: 33%; }
.qi-nav-center { width: 33%; text-align: center; }
.qi-nav-right { display: flex; justify-content: flex-end; align-items: center; gap: 32px; width: 33%; }
.qi-brand { font-family: 'Cormorant Garamond', 'Palatino Linotype', Georgia, serif; font-size: 1.5rem; font-weight: 600; font-style: italic; text-decoration: none; }
.qi-nav-link { font-size: 11px; letter-spacing: 0.15em; font-weight: 400; text-transform: uppercase; text-decoration: none; color: inherit; }
.qi-count { opacity: 0.5; }
.qi-nav-links { display: flex; gap: 32px; }
.qi-ham { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.qi-ham span { display: block; height: 1.5px; width: 22px; background: currentColor; }
.qi-overlay { position: fixed; inset: 0; z-index: 100; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
.qi-overlay.qi-overlay-active { display: flex; }
.qi-close { position: absolute; top: 24px; right: 24px; background: none; border: none; font-size: 24px; cursor: pointer; color: inherit; }
.qi-overlay-link { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 3rem; font-style: italic; text-decoration: none; color: inherit; }
.qi-account { display: block; }
@media (max-width: 768px) {
  .qi-ham { display: flex; }
  .qi-nav-links { display: none; }
  .qi-account { display: none; }
  .qi-nav-right { gap: 16px; }
}

/* Qi Hero */
@keyframes qi-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.qi-hero-section { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 96px 16px; overflow: hidden; font-family: Inter, system-ui, sans-serif; }
.qi-hero-inner { width: 100%; display: flex; flex-direction: column; align-items: center; }
.qi-hero-heading { font-family: 'Cormorant Garamond', 'Palatino Linotype', Georgia, serif; font-size: 12rem; font-weight: 400; letter-spacing: -0.02em; line-height: 0.85; text-transform: uppercase; text-align: center; margin: 0; position: relative; z-index: 2; pointer-events: none; }
.qi-hero-img-wrap { position: relative; z-index: 1; width: 380px; aspect-ratio: 3/4; margin-top: -5vw; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.25); animation: qi-fade 1.2s ease-out forwards; }
.qi-hero-img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.1); transition: transform 2s ease; }
.qi-hero-img-wrap:hover .qi-hero-img { transform: scale(1); }
.qi-hero-heading-bottom { margin-top: -7vw; }
.qi-hero-desc { margin-top: 48px; text-align: center; }
.qi-hero-desc-text { font-size: 10px; letter-spacing: 0.25em; line-height: 1.8; max-width: 280px; text-transform: uppercase; opacity: 0.6; }
@media (max-width: 768px) {
  .qi-hero-section { padding: 48px 16px; }
  .qi-hero-heading { font-size: 18vw; }
  .qi-hero-img-wrap { width: 200px; margin-top: -2.5rem; }
  .qi-hero-heading-bottom { margin-top: -3rem; }
}

/* Qi Products */
.qi-prods-section { padding: 96px 24px; border-top: 1px solid #f3f4f6; font-family: Inter, system-ui, sans-serif; }
.qi-prods-inner { max-width: 1440px; margin: 0 auto; }
.qi-prods-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 64px; }
.qi-prods-heading { font-family: 'Cormorant Garamond', 'Palatino Linotype', Georgia, serif; font-size: 4.5rem; font-style: italic; font-weight: 400; margin: 0; }
.qi-prods-viewall { font-size: 11px; letter-spacing: 0.15em; font-weight: 400; text-transform: uppercase; text-decoration: none; padding-bottom: 4px; border-bottom: 1px solid; }
.qi-prods-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 32px; }
.qi-prod-card { cursor: pointer; }
.qi-prod-offset { transform: translateY(60px); }
.qi-prod-img-wrap { aspect-ratio: 4/5; overflow: hidden; background: #f0f0ed; margin-bottom: 24px; }
.qi-prod-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
.qi-prod-img-wrap:hover .qi-prod-img { transform: scale(1.05); }
.qi-prod-info { display: flex; justify-content: space-between; align-items: flex-end; }
.qi-prod-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.5rem; font-weight: 400; margin: 0 0 4px; }
.qi-prod-sub { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.5; margin: 0; }
.qi-prod-price { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
@media (max-width: 768px) {
  .qi-prods-section { padding: 48px 16px; }
  .qi-prods-header { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 40px; }
  .qi-prods-heading { font-size: 2.5rem; }
  .qi-prods-grid { grid-template-columns: 1fr; gap: 40px; }
  .qi-prod-offset { transform: none; }
}

/* ── Smart Home Dashboard ─────────────────────────────────────────────────── */
.shd-glass{background:rgba(255,255,255,0.05);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.1)}
.shd-inner{display:flex;gap:1.25rem}
.shd-sidebar{border-radius:2.5rem;width:72px;display:flex;flex-direction:column;align-items:center;padding:2rem 0;justify-content:space-between;flex-shrink:0}
.shd-nav-btn{padding:10px;background:none;border-radius:14px;border:none;color:rgba(255,255,255,0.4);cursor:pointer}
.shd-nav-btn.active{background:rgba(255,255,255,0.12);color:#fff}
.shd-avatar{width:38px;height:38px;border-radius:50%;overflow:hidden;border:1px solid rgba(255,255,255,0.2)}
.shd-avatar img{width:100%;height:100%;object-fit:cover}
.shd-grid{flex:1;display:grid;grid-template-columns:repeat(12,1fr);gap:1.25rem}
.shd-s6{grid-column:span 6/span 6}
.shd-s3{grid-column:span 3/span 3}
.shd-s6r2{grid-column:span 6/span 6;grid-row:span 2/span 2}
.shd-cam{height:320px;position:relative;border-radius:2.5rem;overflow:hidden}
.shd-cam img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.shd-cam-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)}
.shd-pill{position:absolute;top:1.25rem;padding:5px 14px;background:rgba(255,255,255,0.12);backdrop-filter:blur(12px);border-radius:999px;border:1px solid rgba(255,255,255,0.2);font-size:.85rem;font-weight:500}
.shd-live{display:flex;align-items:center;gap:6px;font-size:.7rem;font-weight:700;letter-spacing:.1em}
.shd-live-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;animation:shd-pulse 1.5s infinite}
@keyframes shd-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.shd-cam-info{position:absolute;bottom:1.5rem;left:1.5rem}
.shd-plug{border-radius:2.5rem;padding:2rem;display:flex;flex-direction:column;align-items:center;justify-content:space-between}
.shd-plug h3{font-size:1.8rem;font-weight:300;margin:0}
.shd-plug p{color:rgba(255,255,255,0.4);margin:4px 0 0;font-size:.9rem}
.shd-ring-wrap{position:relative;display:flex;align-items:center;justify-content:center;padding:1rem 0}
.shd-ring-inner{position:absolute;display:flex;flex-direction:column;align-items:center}
.shd-progress-circle{transition:stroke-dashoffset .8s ease-out;transform:rotate(-90deg);transform-origin:50% 50%}
.shd-scene{border-radius:2.5rem;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between}
.shd-icon-box{width:52px;height:52px;background:rgba(255,255,255,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center}
.shd-play-btn{width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff}
.shd-tv-card{border-radius:2.5rem;padding:1.75rem 2rem;display:flex;flex-direction:column;justify-content:space-between;transition:background .5s,color .5s}
.shd-toggle{width:48px;height:26px;border-radius:999px;cursor:pointer;position:relative;transition:background .3s;border:none;padding:0;display:inline-block}
.shd-toggle.on{background:#fff}.shd-toggle.off{background:rgba(255,255,255,0.2)}
.shd-toggle-dot{width:18px;height:18px;border-radius:50%;position:absolute;top:4px;transition:left .3s;pointer-events:none;background:#fff}
.shd-toggle.on .shd-toggle-dot{left:26px}
.shd-toggle.off .shd-toggle-dot{left:4px}
.shd-music{border-radius:3rem;padding:2rem;display:flex;flex-direction:column}
.shd-spotify-pill{display:flex;align-items:center;gap:8px;background:rgba(29,185,84,0.15);padding:4px 12px;border-radius:999px;border:1px solid rgba(29,185,84,0.2);font-size:.75rem;color:#1db954;font-weight:500}
.shd-spotify-dot{width:16px;height:16px;border-radius:50%;background:#1db954;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.shd-music-body{flex:1;display:flex;gap:2rem;align-items:center;justify-content:center;margin-top:1.5rem}
.shd-album{width:160px;height:160px;border-radius:1.5rem;overflow:hidden;transform:rotate(3deg);box-shadow:0 20px 60px rgba(0,0,0,.4);flex-shrink:0}
.shd-album img{width:100%;height:100%;object-fit:cover}
.shd-music-ctrl{display:flex;gap:2rem;align-items:center;margin-top:1.25rem}
.shd-ctrl-btn{background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;padding:0}
.shd-play-main{width:60px;height:60px;border-radius:50%;background:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
.shd-gamepad{border-radius:2.5rem;padding:1.75rem 2rem;display:flex;flex-direction:column;justify-content:space-between}
.shd-light{border-radius:2.5rem;padding:1.75rem 2rem;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden;cursor:ns-resize;user-select:none;min-height:180px}
.shd-light-fill{position:absolute;bottom:0;left:0;right:0;width:100%;background:rgba(180,199,188,0.2);transition:height .1s}
.shd-light-info{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;pointer-events:none}
.shd-bulb-ring{width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center}
@media(max-width:900px){
  .shd-sidebar{display:none}
  .shd-grid{grid-template-columns:1fr}
  .shd-s6,.shd-s3,.shd-s6r2{grid-column:auto;grid-row:auto}
}

/* ── Lumora Skincare Templates ────────────────────────────────────────────── */
.lu-nav { position: sticky; top: 0; z-index: 100; border-bottom: 1px solid #EBE9E1; font-family: 'Plus Jakarta Sans', sans-serif; }
.lu-nav-inner { max-width: 1440px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 24px 60px; }
.lu-nav-left { display: flex; align-items: center; gap: 24px; }
.lu-brand { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; letter-spacing: 0.02em; }
.lu-links { display: flex; gap: 40px; }
.lu-nav-link { text-decoration: none; color: inherit; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; transition: opacity 0.2s; }
.lu-nav-link:hover { opacity: 0.6; }
.lu-nav-right { display: flex; align-items: center; gap: 20px; }
.lu-icon-btn { background: none; border: none; cursor: pointer; padding: 0; color: inherit; position: relative; }
.lu-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 0; color: inherit; }
.lu-cart-badge { position: absolute; top: -8px; right: -8px; background: #1A1A1A; color: #FDFCF8; font-size: 10px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.lu-mobile-menu { 
  display: none; 
  position: absolute; 
  top: 0; 
  left: 0; 
  right: 0; 
  min-height: 100vh; 
  z-index: 200; 
  flex-direction: column; 
  padding: 24px 20px; 
  transition: all 0.3s ease;
}
.lu-mobile-menu.open { display: flex; animation: luFadeIn 0.3s ease; }
@keyframes luFadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .lu-nav-inner { padding: 16px 20px; }
  .lu-links { display: none; }
  .lu-menu-btn { display: block; }
}

.lu-hero { display: flex; background: #FDFCF8; min-height: 85vh; font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; }
.lu-hero-content { flex: 1; padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 2; }
.lu-tag { display: inline-block; background: #EBE9E1; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; margin-bottom: 24px; width: fit-content; text-transform: uppercase; }
.lu-hero-title { font-family: 'Playfair Display', serif; font-size: 72px; line-height: 1.1; margin-bottom: 32px; color: #1A1A1A; }
.lu-cta { background: #1A1A1A; color: #FDFCF8; border: none; padding: 16px 40px; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; width: fit-content; transition: transform 0.2s; }
.lu-cta:hover { transform: translateY(-2px); }
.lu-floating-card { margin-top: 60px; padding: 24px; background: #FFFFFF; border-radius: 12px; display: flex; gap: 20px; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 430px; }
.lu-floating-card img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
.lu-f-name { font-weight: 700; margin-bottom: 4px; color: #1A1A1A; }
.lu-f-desc { font-size: 14px; color: #666; line-height: 1.4; }
.lu-hero-media { flex: 1.2; position: relative; }
.lu-hero-media img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 768px) {
  .lu-hero { flex-direction: column-reverse; min-height: auto; }
  .lu-hero-content { padding: 40px 20px; }
  .lu-hero-title { font-size: 48px; }
  .lu-floating-card { margin-top: 40px; }
}

@keyframes luMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.lu-marquee { background: #FFFFFF; border-top: 1px solid #EBE9E1; border-bottom: 1px solid #EBE9E1; padding: 24px 0; overflow: hidden; font-family: 'Plus Jakarta Sans', sans-serif; }
.lu-marquee-inner { display: flex; animation: luMarquee 30s linear infinite; width: max-content; }
.lu-marquee-item { display: flex; align-items: center; gap: 12px; padding: 0 30px; }
.lu-stars { color: #E2E8D5; font-size: 24px; letter-spacing: 2px; }
.lu-r-text { font-weight: 700; font-size: 14px; color: #1A1A1A; text-transform: uppercase; }
.lu-r-author { font-size: 12px; color: #666; }
.lu-sep { height: 40px; width: 1px; background: #EFEEE8; margin: 0 30px; }
.lu-trusted { font-weight: 800; font-size: 14px; color: #1A1A1A; align-self: center; white-space: nowrap; }

.lu-story { background: #FDFCF8; padding: 100px 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
.lu-story-grid { max-width: 1200px; margin: 0 auto; display: flex; gap: 60px; align-items: center; }
.lu-story-text { flex: 1; }
.lu-story-tag { color: #666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
.lu-story-title { font-family: 'Playfair Display', serif; font-size: 48px; line-height: 1.2; margin-bottom: 32px; color: #1A1A1A; }
.lu-story-text p { font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 24px; }
.lu-story-btn { background: transparent; color: #1A1A1A; border: 1px solid #1A1A1A; padding: 12px 32px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.lu-story-btn:hover { background: #1A1A1A; color: #FDFCF8; }
.lu-story-images { flex: 1; position: relative; height: 500px; width: 100%; }
.lu-img-1 { position: absolute; top: 0; left: 0; width: 70%; height: 80%; object-fit: cover; border-radius: 12px; z-index: 1; }
.lu-img-2 { position: absolute; bottom: 0; right: 0; width: 60%; height: 70%; object-fit: cover; border-radius: 12px; border: 10px solid #FDFCF8; z-index: 2; }

@media (max-width: 768px) {
  .lu-story { padding: 60px 20px; }
  .lu-story-grid { flex-direction: column; }
  .lu-story-title { font-size: 36px; }
  .lu-story-images { height: 400px; }
}

.lu-products { background: #EFEEE8; padding: 100px 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
.lu-prod-header { max-width: 1200px; margin: 0 auto 60px; text-align: center; }
.lu-prod-tagline { color: #666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
.lu-prod-title { font-family: 'Playfair Display', serif; font-size: 48px; color: #1A1A1A; }
.lu-prod-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.lu-prod-card { background: #FFFFFF; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s; }
.lu-prod-card:hover { transform: translateY(-10px); }
.lu-prod-img-wrap { position: relative; height: 300px; }
.lu-prod-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.lu-prod-tag { position: absolute; top: 12px; left: 12px; background: #FFFFFF; padding: 4px 10px; border-radius: 99px; font-size: 10px; font-weight: 700; color: #1A1A1A; }
.lu-wish-btn { position: absolute; top: 12px; right: 12px; background: #FFFFFF; width: 32px; height: 32px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.lu-prod-info { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.lu-prod-cat { color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.lu-prod-name { font-size: 18px; font-weight: 700; margin-bottom: 12px; flex: 1; color: #1A1A1A; }
.lu-prod-price-row { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.lu-price { font-weight: 700; font-size: 18px; color: #1A1A1A; }
.lu-old-price { color: #999; text-decoration: line-through; font-size: 14px; }
.lu-add-btn { background: #1A1A1A; color: #FFFFFF; border: none; padding: 12px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s; }
.lu-add-btn:hover { background: #333; }

@media (max-width: 1024px) {
  .lu-prod-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .lu-prod-grid { grid-template-columns: 1fr; }
  .lu-products { padding: 60px 20px; }
}

.lu-footer { background: #FFFFFF; padding: 60px 20px; text-align: center; border-top: 1px solid #EBE9E1; font-family: 'Plus Jakarta Sans', sans-serif; }
.lu-footer-brand { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; margin-bottom: 40px; letter-spacing: 0.02em; color: #1A1A1A; }
.lu-footer-links { display: flex; justify-content: center; align-items: center; gap: 40px; margin-bottom: 40px; flex-wrap: wrap; }\n@media (max-width: 768px) { .lu-footer-links { flex-direction: column; gap: 20px; } }
.lu-footer-links a { text-decoration: none; color: #1A1A1A; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
.lu-copyright { color: #999; font-size: 12px; letter-spacing: 0.05em; }

/* ── Veluno Skincare Templates ────────────────────────────────────────────── */
.vl-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; border-bottom: 1px solid rgba(0,0,0,0.05); font-family: 'Inter', sans-serif; position: relative; z-index: 50; }
.vl-brand-flex { display: flex; align-items: center; gap: 8px; }
.vl-brand-text { font-size: 1.25rem; font-weight: 500; letter-spacing: -0.02em; }
.vl-links { display: flex; align-items: center; gap: 32px; }
.vl-nav-item { text-decoration: none; color: inherit; font-size: 0.85rem; font-weight: 400; letter-spacing: 0.02em; opacity: 0.8; transition: opacity 0.2s; }
.vl-nav-item:hover { opacity: 1; }
.vl-actions { display: flex; align-items: center; gap: 32px; }
.vl-search { display: flex; align-items: center; gap: 8px; background: #f9fafb; padding: 8px 16px; border-radius: 9999px; }
.vl-search-input { border: none; background: transparent; outline: none; font-size: 0.85rem; width: 140px; }
.vl-icons { display: flex; align-items: center; gap: 24px; }
.vl-cart-btn { background: none; border: none; cursor: pointer; position: relative; display: flex; align-items: center; justify-content: center; }
.vl-cart-badge { position: absolute; top: -6px; right: -8px; background: #000; color: #fff; font-size: 0.65rem; font-weight: 600; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.vl-profile-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }

.vl-hero { position: relative; min-height: 90vh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-family: 'Inter', sans-serif; }
.vl-divider { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.1); z-index: 1; transform: translateX(-50%); }
.vl-img-box { position: absolute; top: 0; bottom: 0; width: 50%; overflow: hidden; }
.vl-img-box:nth-child(2) { left: 0; }
.vl-img-box:nth-child(3) { right: 0; }
.vl-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: transform 0.8s ease, filter 0.8s ease; filter: grayscale(100%); }
.vl-hero:hover .vl-img { filter: grayscale(0%); transform: scale(1.05); opacity: 0.8; }
.vl-overlay-l { position: absolute; inset: 0; background: linear-gradient(to right, rgba(12,12,12,0.95) 0%, rgba(12,12,12,0.4) 100%); mix-blend-mode: multiply; }
.vl-overlay-r { position: absolute; inset: 0; background: linear-gradient(to left, rgba(12,12,12,0.95) 0%, rgba(12,12,12,0.4) 100%); mix-blend-mode: multiply; }
.vl-content { position: relative; z-index: 10; max-width: 800px; padding: 0 40px; }
.vl-h1 { font-size: clamp(4rem, 10vw, 8rem); font-weight: 300; letter-spacing: -0.04em; line-height: 1; margin: 0 0 24px; color: currentColor; }
.vl-h1 span { font-weight: 600; font-style: italic; }
.vl-desc { font-size: 1.1rem; line-height: 1.6; color: rgba(255,255,255,0.7); max-width: 480px; margin: 0 auto; }
.vl-scroll { position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 12px; z-index: 10; }
.vl-scroll-ind { height: 48px; overflow: hidden; opacity: 0.5; }
.vl-scroll-text { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.4; }
.vl-tags { position: absolute; bottom: 48px; left: 48px; display: flex; align-items: center; gap: 16px; z-index: 10; font-size: 0.8rem; font-weight: 500; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.1em; }
.vl-dot { width: 4px; height: 4px; background: currentColor; border-radius: 50%; opacity: 0.5; }

@media (max-width: 768px) {
  .vl-nav { padding: 16px 20px; }
  .vl-links, .vl-search { display: none; }
  .vl-h1 { font-size: 3.5rem; }
  .vl-tags { display: none; }
  .vl-img-box { width: 100%; opacity: 0.3; }
  .vl-img-box:nth-child(3) { display: none; }
  .vl-divider { display: none; }
}

/* ── Food Templates (Categories, Items, Footer) ───────────────────────── */
.fc-section { padding: 64px 48px; font-family: Outfit, system-ui, sans-serif; }
.fc-inner { max-width: 1100px; margin: 0 auto; }
.fc-heading { font-size: 2.5rem; font-weight: 900; margin: 0 0 32px; }
.fc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; }
.fc-card { background-color: #fff; border: 3px solid #2d3436; border-radius: 16px; padding: 24px 16px; text-align: center; transition: all 0.2s ease; cursor: pointer; }
.fc-card:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0px 0px #2d3436 !important; }
.fc-icon { font-size: 2.5rem; margin-bottom: 12px; display: inline-block; padding: 8px; border-radius: 12px; border: 2px solid #2d3436; }
.fc-name { font-size: 1.2rem; font-weight: 700; display: block; }

.fi-section { padding: 64px 48px; font-family: Outfit, system-ui, sans-serif; }
.fi-inner { max-width: 1100px; margin: 0 auto; }
.fi-heading { font-size: 2.5rem; font-weight: 900; margin: 0 0 32px; }
.fi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
.fi-card { display: flex; flex-direction: row; background-color: #fff; border: 4px solid #2d3436; border-radius: 24px; overflow: hidden; transition: all 0.3s ease; }
.fi-card:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0px 0px #2d3436 !important; }
.fi-img-wrap { width: 180px; position: relative; border-right: 4px solid #2d3436; flex-shrink: 0; }
.fi-img { width: 100%; height: 100%; object-fit: cover; }
.fi-price { position: absolute; top: 12px; right: 12px; padding: 4px 12px; border-radius: 999px; font-weight: 900; color: #fff; border: 2px solid #2d3436; font-size: 1.1rem; }
.fi-content { padding: 24px; display: flex; flex-direction: column; flex: 1; }
.fi-name { font-size: 1.4rem; font-weight: 800; margin: 0 0 8px; }
.fi-desc { color: #6b7280; font-size: 0.95rem; font-weight: 500; margin: 0 0 20px; flex: 1; }
.fi-btn { align-self: flex-start; color: #fff; border: 3px solid #2d3436; border-radius: 12px; padding: 10px 20px; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 8px; }
.fi-btn:hover { background-color: #2d3436 !important; color: #fff !important; }
.fi-btn:active { transform: translate(2px, 2px); box-shadow: none !important; }

.ff-footer { padding: 64px 48px; font-family: Outfit, system-ui, sans-serif; }
.ff-inner { max-width: 1100px; margin: 0 auto; border-radius: 24px; padding: 48px 64px; display: flex; justify-content: space-between; align-items: center; gap: 24px; color: #fff; }
.ff-left { text-align: left; }
.ff-brand-logo { height: 48px; object-fit: contain; margin-bottom: 12px; }
.ff-brand-text { font-size: 2rem; font-weight: 900; margin: 0 0 8px; letter-spacing: -0.04em; }
.ff-text { margin: 0 0 16px; font-size: 1.1rem; font-weight: 500; opacity: 0.9; }
.ff-copy { margin: 0; font-size: 0.9rem; opacity: 0.6; }
.ff-socials { display: flex; gap: 16px; }
.ff-soc { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; transition: transform 0.2s; text-decoration: none; }
.ff-soc:hover { transform: scale(1.1) rotate(5deg); }

@media (max-width: 768px) {
  .fc-section { padding: 40px 20px; }
  
  .fi-section { padding: 40px 20px; }
  .fi-grid { grid-template-columns: 1fr; }
  .fi-card { flex-direction: column; }
  .fi-img-wrap { width: 100%; height: 200px; border-right: none; border-bottom: 4px solid #2d3436; }
  
  .ff-footer { padding: 40px 20px; }
  .ff-inner { flex-direction: column; padding: 32px 24px; text-align: center; }
  .ff-left { text-align: center; }
}

/* Make Navbar */
.mkn-nav { padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; font-family: system-ui, sans-serif; }
.mkn-brand { font-size: 1.5rem; font-weight: 900; display: flex; align-items: center; gap: 8px; }
.mkn-logo { width: 24px; height: 24px; border-radius: 50%; }
.mkn-links { display: flex; gap: 32px; }
.mkn-link { color: inherit; text-decoration: none; font-weight: 500; font-size: 0.95rem; opacity: 0.8; transition: opacity 0.2s; }
.mkn-link:hover { opacity: 1; }
.mkn-actions { display: flex; gap: 16px; align-items: center; }
.mkn-login { color: inherit; text-decoration: none; font-weight: 600; font-size: 0.95rem; }
.mkn-btn { padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.95rem; }
@media (max-width: 768px) { .mkn-links { display: none; } }

/* Make Hero */
.mkh-sec { padding: 80px 48px; position: relative; overflow: hidden; min-height: 600px; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; }
.mkh-glow { position: absolute; top: 10%; left: 50%; transform: translateX(-50%); width: 60%; height: 400px; filter: blur(60px); pointer-events: none; }
.mkh-inner { max-width: 1000px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
.mkh-h1 { font-size: clamp(3rem, 6vw, 5rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 24px; margin-top: 0; }
.mkh-desc { font-size: 1.25rem; color: #94a3b8; max-width: 700px; margin: 0 auto 40px; line-height: 1.6; }
.mkh-btns { display: flex; gap: 16px; justify-content: center; margin-bottom: 64px; }
.mkh-btn-1 { color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
.mkh-btn-2 { background: rgba(255,255,255,0.1); color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.2); }
.mkh-img-wrap { position: relative; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
.mkh-browser-bar { position: absolute; top: 0; left: 0; right: 0; height: 40px; background: rgba(255,255,255,0.05); display: flex; align-items: center; padding: 0 16px; gap: 8px; }
.mkh-dot { width: 12px; height: 12px; border-radius: 50%; }
.mkh-img { width: 100%; display: block; margin-top: 40px; }
@media (max-width: 768px) { .mkh-sec { padding: 40px 20px; } .mkh-btns { flex-direction: column; } }

/* Make Features */
.mf-sec { padding: 96px 48px; font-family: system-ui, sans-serif; }
.mf-inner { max-width: 1200px; margin: 0 auto; }
.mf-h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; text-align: center; margin-bottom: 64px; letter-spacing: -0.02em; margin-top: 0; }
.mf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
.mf-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 40px 32px; transition: transform 0.2s; cursor: pointer; }
.mf-card:hover { transform: translateY(-4px); }
.mf-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 24px; }
.mf-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 16px; margin-top: 0; }
.mf-desc { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin: 0; }

/* Make Integrations */
.mi-sec { padding: 96px 48px; font-family: system-ui, sans-serif; position: relative; overflow: hidden; }
.mi-glow { position: absolute; right: -10%; bottom: -10%; width: 500px; height: 500px; filter: blur(60px); pointer-events: none; }
.mi-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.mi-h2 { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 800; text-align: center; margin-bottom: 48px; letter-spacing: -0.02em; margin-top: 0; }
.mi-grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; max-width: 800px; margin-bottom: 56px; }
.mi-icon { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); }
.mi-cta { text-decoration: none; font-weight: 700; font-size: 1.2rem; display: inline-flex; align-items: center; gap: 8px; }
.mi-cta span { font-size: 1.5rem; }

/* Make Pricing */
.mp-sec { padding: 96px 48px; font-family: system-ui, sans-serif; }
.mp-inner { max-width: 1200px; margin: 0 auto; }
.mp-h2 { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 800; text-align: center; margin-bottom: 64px; letter-spacing: -0.02em; margin-top: 0; }
.mp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; align-items: center; }
.mp-card { border: 1px solid; border-radius: 24px; padding: 48px 32px; position: relative; }
.mp-popular { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); color: #fff; padding: 4px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
.mp-name { font-size: 1.5rem; font-weight: 600; margin: 0 0 8px; }
.mp-desc { color: #94a3b8; font-size: 1rem; margin: 0 0 32px; }
.mp-price { font-size: 3rem; font-weight: 900; margin-bottom: 32px; display: flex; align-items: baseline; gap: 4px; }
.mp-price span { font-size: 1rem; color: #94a3b8; font-weight: 500; }
.mp-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; margin-bottom: 32px; }
.mp-feats { display: flex; flex-direction: column; gap: 16px; }
.mp-feat { display: flex; align-items: center; gap: 12px; color: #cbd5e1; font-size: 0.95rem; }
.mp-check { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; }

/* Make Footer */
.mft-sec { padding: 64px 48px; font-family: system-ui, sans-serif; border-top: 1px solid rgba(255,255,255,0.05); }
.mft-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.mft-brand { font-size: 1.8rem; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 12px; }
.mft-logo { width: 32px; height: 32px; border-radius: 50%; }
.mft-text { font-size: 1.1rem; margin: 0; text-align: center; }
.mft-copy { font-size: 0.9rem; opacity: 0.6; margin: 24px 0 0; }

@media (max-width: 768px) {
  .mf-sec, .mi-sec, .mp-sec, .mft-sec { padding: 64px 24px; }
  .mp-card { transform: none !important; }
}
`

const BASE_JS = `// Generated by SiteForge
document.addEventListener('DOMContentLoaded', function() {

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var id = href.substring(1);
      var target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Standard mobile hamburger menu
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.nav-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.textContent = isOpen ? '\\u2715' : '\\u2630';
    });
    mobileMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        hamburger.textContent = '\\u2630';
      });
    });
  }

  // Active nav link highlighting
  var allNavLinks = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      var href = this.getAttribute('href');
      document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(function(a) {
        a.classList.remove('active');
        if (a.getAttribute('href') === href) a.classList.add('active');
      });
    });
  });

  // Contact form
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message!');
      form.reset();
    });
  }

});

  // SoleMate navbar active link — highlight based on current page filename
  (function() {
    var currentFile = window.location.pathname.split('/').pop() || 'index.html';
    if (!currentFile || currentFile === '') currentFile = 'index.html';
    document.querySelectorAll('.smn-link[data-smn-href]').forEach(function(link) {
      var href = link.getAttribute('data-smn-href') || '';
      var isHome = currentFile === 'index.html' && (href === '#' || href === '/' || href === 'index.html');
      var isMatch = href !== '#' && href !== '' && href !== '/' && currentFile === href;
      if (isHome || isMatch) { link.style.borderBottom = '2px solid currentColor'; }
    });
  })();

// ── Sidebar nav functions ──────────────────────────────────────────────────
function sbOpenMobile() {
  var nav = document.querySelector('.sb-nav, .sbt-nav');
  var backdrop = document.getElementById('sbBackdrop');
  if (nav) nav.classList.add('mobile-open');
  if (backdrop) backdrop.classList.add('active');
}

function sbCloseMobile() {
  var nav = document.querySelector('.sb-nav, .sbt-nav');
  var backdrop = document.getElementById('sbBackdrop');
  if (nav) nav.classList.remove('mobile-open');
  if (backdrop) backdrop.classList.remove('active');
}

// ── Puzzle navbar mobile menu ──────────────────────────────────────────────
function pzlToggleMenu() {
  var menu = document.getElementById('pzlMobileMenu');
  if (menu) menu.classList.toggle('open');
}

// ── Trend navbar mobile menu ───────────────────────────────────────────────

function wzToggleMenu() {
  var menu = document.getElementById('wzMobileMenu');
  if (menu) menu.classList.toggle('open');
}
function trendToggleMenu() {
  var menu = document.getElementById('trendMobileMenu');
  if (menu) menu.classList.toggle('open');
}

function sbToggleCollapse() {
  var nav = document.getElementById('sbNav');
  if (!nav) return;
  var isCollapsed = nav.classList.toggle('collapsed');
  var btn = document.getElementById('sbCollapseBtn');
  if (btn) {
    btn.innerHTML = isCollapsed
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>';
  }
}

// ── Smart Home Dashboard ───────────────────────────────────────────────────
(function () {
  var tvOn = true, playing = true, gpOn = false, dragging = false;
  function shdTvToggle() {
    tvOn = !tvOn;
    var card = document.getElementById('shd-tv');
    var toggle = document.getElementById('shd-tv-toggle');
    var status = document.getElementById('shd-tv-status');
    if (!card) return;
    var tvDot = toggle ? toggle.querySelector('.shd-toggle-dot') : null;
    if (card.dataset.accent && card.dataset.dark) {
      card.style.background = tvOn ? card.dataset.accent : 'rgba(255,255,255,0.05)';
      card.style.color = tvOn ? card.dataset.dark : '#ffffff';
      card.style.border = tvOn ? 'none' : '1px solid rgba(255,255,255,0.1)';
    }
    if (toggle) toggle.className = 'shd-toggle ' + (tvOn ? 'on' : 'off');
    if (tvDot) tvDot.style.background = tvOn ? (card.dataset.dark || '#2a2624') : '#fff';
    if (status) status.textContent = tvOn ? 'On' : 'Off';
  }
  function shdPlayToggle() {
    playing = !playing;
    var icon = document.getElementById('shd-play-icon');
    if (icon) icon.innerHTML = playing
      ? '<polygon points="5 3 19 12 5 21 5 3"/>'
      : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  }
  function shdGpToggle() {
    gpOn = !gpOn;
    var toggle = document.getElementById('shd-gp-toggle');
    var status = document.getElementById('shd-gp-status');
    if (toggle) toggle.className = 'shd-toggle ' + (gpOn ? 'on' : 'off');
    if (status) status.textContent = gpOn ? 'On' : 'Off';
  }
  window.shdTvToggle = shdTvToggle;
  window.shdPlayToggle = shdPlayToggle;
  window.shdGpToggle = shdGpToggle;
  var lCard = document.getElementById('shd-light-card');
  if (lCard) {
    var lFill = document.getElementById('shd-light-fill');
    var lVal  = document.getElementById('shd-light-val');
    function updateLight(y) {
      var rect = lCard.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, Math.round((1 - (y - rect.top) / rect.height) * 100)));
      if (lFill) lFill.style.height = pct + '%';
      if (lVal)  lVal.textContent  = pct + '%';
    }
    lCard.addEventListener('mousedown', function(e) { dragging = true; updateLight(e.clientY); });
    lCard.addEventListener('touchstart', function(e) { dragging = true; updateLight(e.touches[0].clientY); }, { passive: true });
    window.addEventListener('mousemove', function(e) { if (dragging) updateLight(e.clientY); });
    window.addEventListener('touchmove', function(e) { if (dragging) updateLight(e.touches[0].clientY); }, { passive: true });
    window.addEventListener('mouseup',   function() { dragging = false; });
    window.addEventListener('touchend',  function() { dragging = false; });
  }
})();
`

export function generatePageHTML(page, allPages) {
  const firstEl = page.elements[0]
  const isSidebarPage = firstEl?.type === 'navbar' &&
    ['sidebar', 'sidebar-tabs'].includes(firstEl?.props?.navTemplate)

  if (isSidebarPage) {
    return generateSidebarPageHTML(page, allPages, firstEl, page.elements.slice(1))
  }

  // Standard page
  const elementsHTML = page.elements
    .map((el, i) => generateElementHTML(el, i))
    .join('\n\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(page.name)}</title>
  <link rel="stylesheet" href="styles.css" />
  ${page.elements.some(e => ['trusted-brands', 'skyline-hero'].includes(e.type)) ? '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />' : ''}
  ${page.elements.some(e => ['skyline-hero', 'lumora-navbar', 'lumora-hero', 'lumora-story', 'lumora-products'].includes(e.type)) ? '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">' : ''}
  ${page.elements.some(e => ['veluno-navbar', 'veluno-hero', 'winzy-navbar', 'winzy-hero'].includes(e.type)) ? '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">' : ''}
  <style>${BASE_CSS}</style>
</head>
<body${page.canvasBg ? ` style="background-color:${page.canvasBg}"` : ''}>

${elementsHTML}

  <script src="script.js"></script>
  <script>${BASE_JS}</script>
</body>
</html>`
}

export { BASE_CSS, BASE_JS, slugify }
