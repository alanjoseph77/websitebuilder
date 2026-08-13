import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import ScrollReveal from './ScrollReveal'

// ── Shared navigation hook used by ALL template components ────────────────────
// Returns a handleLink(e, href, linkType) function that correctly handles
// section scrolling, page switching, and external URLs.
function useNavLinkHandler() {
  const { state, switchPage, previewMode } = useBuilder()
  return (e, href, linkType) => {
    if (e) e.preventDefault()
    if (!href || href === '#') return
    // Section scroll — works in both edit and preview
    if (linkType === 'section' || href.startsWith('#')) {
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    // Page navigation — works in BOTH edit and preview (switchPage is safe in edit mode)
    if (linkType === 'page' || (href || '').endsWith('.html')) {
      const cleanHref = (href || '').replace(/^\/+/, '').replace(/^\.\/+/, '')
      const target = (state?.pages || []).find((p) => {
        const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const pSlug = p.name === 'Home' ? 'index.html' : `${slug}.html`
        return cleanHref === pSlug
      })
      if (target) switchPage(target.id)
      return
    }
    // External URL — only open in preview to avoid disrupting edit flow
    if (previewMode) window.open(href, '_blank', 'noopener')
  }
}

/* ── OTAGA icon library (module-level, no re-creation on render) ─────────── */
const OTAGA_ICONS = {
  instagram: (c, s) => <svg key="ig" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>,
  dribbble: (c, s) => <svg key="dr" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" /></svg>,
  linkedin: (c, s) => <svg key="li" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
  twitter: (c, s) => <svg key="tw" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>,
  github: (c, s) => <svg key="gh" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>,
  youtube: (c, s) => <svg key="yt" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>,
  facebook: (c, s) => <svg key="fb" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  behance: (c, s) => <svg key="be" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s} style={{ display: 'block' }}><path d="M2 7h7.5C11.4 7 13 8.1 13 10s-1.6 3-3.5 3H2V7z" /><path d="M2 13h8.5C12.7 13 15 14.3 15 16.5S12.7 20 10.5 20H2v-7z" /><line x1="16" y1="7" x2="22" y2="7" /><path d="M22 12c0-2.8-1.3-5-4-5s-4 2.2-4 5 1.3 5 4 5c2.2 0 3.4-1 3.9-2.5" /></svg>,
}
export const DEFAULT_OTAGA_SOCIALS = [
  { type: 'instagram', url: '#' },
  { type: 'dribbble', url: '#' },
  { type: 'linkedin', url: '#' },
]

/* ── OTAGA Custom Navbar Template ─────────────────────────────────────────── */
function OtagaNavbar({ props, styles, activeHref, onLinkClick, isPreview }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [hoveredMobileLink, setHoveredMobileLink] = useState(null)
  const { viewportWidth } = useBuilder()
  const links = props.links || []
  const brand = props.brand || 'OTAGA'
  const socials = props.otagaSocials || DEFAULT_OTAGA_SOCIALS
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet
  const isDesktop = !isSmall

  // ── Customizable colors ──
  const navBg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#000000'
  const accentColor = props.otagaAccent || '#60a5fa'
  const activeColor = props.otagaActiveColor || accentColor
  const pillBorder = props.otagaPillBorder || '#f3f4f6'
  const overlayBg = props.otagaOverlayBg || navBg

  const renderIcon = (s, i, size) => (
    <a
      key={i}
      href={s.url || '#'}
      target={isPreview ? '_blank' : undefined}
      rel={isPreview ? 'noopener noreferrer' : undefined}
      onClick={isPreview ? undefined : (e) => e.preventDefault()}
      style={{ display: 'block', lineHeight: 0, cursor: 'pointer' }}
    >
      {(OTAGA_ICONS[s.type] || OTAGA_ICONS.instagram)(textColor, size)}
    </a>
  )

  return (
    <div style={{ position: 'relative', backgroundColor: navBg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isSmall ? '24px 24px' : '24px 48px',
        backgroundColor: navBg,
        position: 'relative',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ fontSize: '1.875rem', fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase', userSelect: 'none', zIndex: 50, lineHeight: 1, color: textColor }}>
          {brand}<span style={{ color: accentColor }}>.</span>
        </div>

        {/* Desktop: center pill links */}
        {isDesktop && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {links.map((link, i) => {
              const isActive = link.href === activeHref
              const isHov = hoveredLink === i
              const bg = isActive ? activeColor : isHov ? textColor : 'transparent'
              const fg = (isActive || isHov) ? navBg : textColor
              const border = isActive ? activeColor : isHov ? textColor : pillBorder
              return (
                <a key={i} href={link.href || '#'}
                  onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{ padding: '10px 28px', border: `1px solid ${border}`, borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', color: fg, backgroundColor: bg, display: 'inline-block', cursor: 'pointer', transition: 'background-color 0.25s, color 0.25s, border-color 0.25s' }}
                >
                  {link.text}
                </a>
              )
            })}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 50 }}>
          {/* Desktop: social icons pill */}
          {isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${pillBorder}`, borderRadius: '9999px', padding: '10px 24px', backgroundColor: navBg }}>
              {socials.map((s, i) => renderIcon(s, i, 20))}
            </div>
          )}

          {/* Mobile/Tablet: hamburger */}
          {isSmall && (
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ padding: '10px 14px', border: `1px solid ${pillBorder}`, borderRadius: '9999px', background: navBg, color: textColor, cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile overlay */}
      {isSmall && menuOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: overlayBg, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', padding: '100px 0 60px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          {links.map((link, i) => {
            const isHov = hoveredMobileLink === i
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); if (onLinkClick) onLinkClick(link, e) }}
                onMouseEnter={() => setHoveredMobileLink(i)}
                onMouseLeave={() => setHoveredMobileLink(null)}
                style={{ fontSize: '1.875rem', fontWeight: 900, letterSpacing: '-0.05em', textDecoration: 'none', color: isHov ? accentColor : textColor, textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}
              >
                {link.text}
              </a>
            )
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '16px' }}>
            {socials.map((s, i) => renderIcon(s, i, 32))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Classic Minimal Navbar Template ──────────────────────────────────────── */
function ClassicMinimalNavbar({ props, styles, activeHref, onLinkClick, isPreview }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { viewportWidth } = useBuilder()
  const links = props.links || []
  const brand = props.brand || 'Brand'
  const ctaText = props.classicCtaText || 'Get Started'
  const ctaHref = props.classicCtaHref || '#'
  const ctaColor = props.classicCtaColor || '#6366f1'
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet
  const navBg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#111827'

  return (
    <nav style={{ backgroundColor: navBg, borderBottom: '1px solid #e5e7eb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isSmall ? '14px 20px' : '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '800', fontSize: '1.3rem', color: textColor, letterSpacing: '-0.02em' }}>{brand}</div>

        {!isSmall && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {links.map((link, i) => {
              const isActive = link.href === activeHref
              const isHov = hoveredLink === i
              return (
                <a key={i} href={link.href || '#'}
                  onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', color: isActive ? ctaColor : isHov ? '#111827' : textColor, backgroundColor: isActive ? `${ctaColor}18` : isHov ? '#f3f4f6' : 'transparent', transition: 'all 0.15s' }}
                >{link.text}</a>
              )
            })}
          </div>
        )}

        {!isSmall && (
          <a href={isPreview ? ctaHref : '#'} onClick={isPreview ? undefined : (e) => e.preventDefault()}
            style={{ padding: '9px 22px', borderRadius: '8px', backgroundColor: ctaColor, color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >{ctaText}</a>
        )}

        {isSmall && (
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', color: textColor, fontSize: '1.1rem', lineHeight: 1 }}
          >{menuOpen ? '✕' : '☰'}</button>
        )}
      </div>

      {isSmall && menuOpen && (
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px 20px 16px', backgroundColor: navBg }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); if (onLinkClick) onLinkClick(link, e) }}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: isActive ? ctaColor : textColor, fontWeight: isActive ? '600' : '500', fontSize: '0.95rem', marginBottom: '4px', backgroundColor: isActive ? `${ctaColor}10` : 'transparent' }}
              >{link.text}</a>
            )
          })}
          <a href={isPreview ? ctaHref : '#'} onClick={isPreview ? undefined : (e) => e.preventDefault()}
            style={{ display: 'block', marginTop: '8px', padding: '11px 22px', borderRadius: '8px', backgroundColor: ctaColor, color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', textAlign: 'center' }}
          >{ctaText}</a>
        </div>
      )}
    </nav>
  )
}

/* ── Glass Floating Navbar Template ───────────────────────────────────────── */
function GlassFloatingNavbar({ props, styles, activeHref, onLinkClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { viewportWidth } = useBuilder()
  const links = props.links || []
  const brand = props.brand || 'Brand'
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet
  const wrapperBg = styles?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  const textColor = styles?.color || '#ffffff'
  const accentColor = props.glassAccent || '#a78bfa'

  return (
    <div style={{ background: wrapperBg, padding: '20px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', padding: isSmall ? '14px 20px' : '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: textColor }}>{brand}</div>

        {!isSmall && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {links.map((link, i) => {
              const isActive = link.href === activeHref
              const isHov = hoveredLink === i
              return (
                <a key={i} href={link.href || '#'}
                  onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{ padding: '7px 18px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '500', textDecoration: 'none', color: isActive ? accentColor : textColor, backgroundColor: isActive || isHov ? 'rgba(255,255,255,0.15)' : 'transparent', transition: 'all 0.2s' }}
                >{link.text}</a>
              )
            })}
          </div>
        )}

        {isSmall && (
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: textColor, fontSize: '1rem' }}
          >{menuOpen ? '✕' : '☰'}</button>
        )}
      </nav>

      {isSmall && menuOpen && (
        <div style={{ maxWidth: '900px', margin: '8px auto 0', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); if (onLinkClick) onLinkClick(link, e) }}
                style={{ display: 'block', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', color: isActive ? accentColor : textColor, fontWeight: isActive ? '600' : '500', fontSize: '0.95rem', marginBottom: '4px', backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent' }}
              >{link.text}</a>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Shop / E-commerce Navbar Template ────────────────────────────────────── */
function ShopNavbar({ props, styles, activeHref, onLinkClick, isPreview }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { viewportWidth } = useBuilder()
  const links = props.links || []
  const brand = props.brand || 'ShopCo'
  const cartCount = props.shopCartCount !== undefined ? String(props.shopCartCount) : '3'
  const searchPlaceholder = props.shopSearchPlaceholder || 'Search products...'
  const accentColor = props.shopAccent || '#ef4444'
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet
  const navBg = styles?.backgroundColor || '#111827'
  const textColor = styles?.color || '#ffffff'

  return (
    <header style={{ backgroundColor: navBg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isSmall ? '14px 20px' : '14px 40px', display: 'flex', alignItems: 'center', gap: isSmall ? '12px' : '24px' }}>
        {/* Logo */}
        <div style={{ fontWeight: '800', fontSize: '1.4rem', color: textColor, letterSpacing: '-0.02em', flexShrink: 0 }}>
          {brand}<span style={{ color: accentColor }}>.</span>
        </div>

        {/* Search bar (desktop) */}
        {!isSmall && (
          <div style={{ flex: 1, position: 'relative', maxWidth: '480px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="17" height="17"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder={searchPlaceholder} readOnly={!isPreview}
              style={{ width: '100%', padding: '9px 16px 9px 40px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)', color: textColor, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* Desktop nav links */}
        {!isSmall && links.length > 0 && (
          <nav style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
            {links.map((link, i) => {
              const isActive = link.href === activeHref
              const isHov = hoveredLink === i
              return (
                <a key={i} href={link.href || '#'}
                  onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '500', textDecoration: 'none', color: isActive ? accentColor : isHov ? '#e5e7eb' : 'rgba(255,255,255,0.75)', backgroundColor: isActive || isHov ? 'rgba(255,255,255,0.08)' : 'transparent', transition: 'all 0.15s' }}
                >{link.text}</a>
              )
            })}
          </nav>
        )}

        {/* Icons row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: (!isSmall && links.length === 0) ? 'auto' : isSmall ? 'auto' : '8px', color: textColor }}>
          {props.shopShowWishlist !== false && (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', lineHeight: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', lineHeight: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            </button>
            {parseInt(cartCount) > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: accentColor, color: '#fff', fontSize: '0.6rem', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{cartCount}</span>
            )}
          </div>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: textColor, padding: '0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', lineHeight: 0, flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
          {isSmall && (
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', color: textColor, fontSize: '1rem', marginLeft: '4px', display: 'flex', alignItems: 'center' }}
            >{menuOpen ? '✕' : '☰'}</button>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {isSmall && (
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ position: 'relative' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="17" height="17"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder={searchPlaceholder} readOnly={!isPreview}
              style={{ width: '100%', padding: '9px 16px 9px 40px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)', color: textColor, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isSmall && menuOpen && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px 16px', backgroundColor: navBg }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); if (onLinkClick) onLinkClick(link, e) }}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: isActive ? accentColor : 'rgba(255,255,255,0.85)', fontWeight: isActive ? '600' : '500', fontSize: '0.95rem', marginBottom: '4px', backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              >{link.text}</a>
            )
          })}
        </div>
      )}
    </header>
  )
}

/* ── Sidebar Tabs Nav Template (icon activity bar, like VS Code) ───────────── */
function SidebarTabsNavbar({ props, styles, activeHref, onLinkClick, sidebarOnly = false }) {
  const [localActiveTab, setLocalActiveTab] = useState(0)
  const [hoveredTab, setHoveredTab] = useState(null)

  const links = props.links || []
  // Prefer activeHref from parent (tracks current page) over local click state
  const hrefTabIndex = activeHref ? links.findIndex((l) => l.href === activeHref) : -1
  const activeTab = hrefTabIndex >= 0 ? hrefTabIndex : localActiveTab
  const brand = props.brand || 'App'
  const userInitials = props.sidebarUserInitials || 'U'
  const navBg = styles?.backgroundColor || '#1e1b4b'
  const textColor = styles?.color || '#c7d2fe'
  const accentColor = props.sidebarAccent || '#818cf8'
  const contentBg = props.sidebarContentBg || '#0f0e24'
  const brandInitial = brand.charAt(0).toUpperCase()

  const getIcon = (text) => {
    const t = (text || '').toLowerCase()
    if (t.includes('home') || t.includes('dashboard') || t.includes('overview'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
    if (t.includes('setting'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    if (t.includes('user') || t.includes('team') || t.includes('people'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    if (t.includes('analytic') || t.includes('report') || t.includes('stat') || t.includes('chart'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
    if (t.includes('inbox') || t.includes('message') || t.includes('mail'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="22,12 16,12 14,15 10,15 8,12 2,12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
    if (t.includes('product') || t.includes('store') || t.includes('shop'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    if (t.includes('file') || t.includes('doc') || t.includes('page'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>
    if (t.includes('search') || t.includes('explore'))
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  }

  const IconRail = () => (
    <div style={{ width: '52px', height: '100%', minHeight: '400px', backgroundColor: navBg, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.07)', fontFamily: 'system-ui, -apple-system, sans-serif', flexShrink: 0, overflow: 'hidden' }}>
      {/* Brand circle */}
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', color: '#fff', margin: '14px 0 8px', flexShrink: 0 }}>
        {brandInitial}
      </div>
      <div style={{ width: '28px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '8px', flexShrink: 0 }} />

      {/* Tab icons */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', overflowY: 'auto', paddingTop: '4px' }}>
        {links.map((link, i) => {
          const isActive = i === activeTab
          const isHov = hoveredTab === i
          return (
            <div
              key={i}
              onClick={() => { setLocalActiveTab(i); if (onLinkClick) onLinkClick(link) }}
              onMouseEnter={() => setHoveredTab(i)}
              onMouseLeave={() => setHoveredTab(null)}
              title={link.text}
              style={{
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isActive ? accentColor : isHov ? '#e0e7ff' : textColor,
                backgroundColor: isActive ? `${accentColor}18` : isHov ? 'rgba(255,255,255,0.07)' : 'transparent',
                borderLeft: `3px solid ${isActive ? accentColor : 'transparent'}`,
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              <span style={{ display: 'flex', opacity: isActive ? 1 : 0.6 }}>{getIcon(link.text)}</span>
            </div>
          )
        })}
      </div>

      {/* User avatar */}
      <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: `${accentColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.68rem', color: accentColor, margin: '8px 0 14px', flexShrink: 0, border: `2px solid ${accentColor}50` }}>
        {userInitials}
      </div>
    </div>
  )

  if (sidebarOnly) {
    return <IconRail />
  }

  // Self-contained preview (used when placed as a standalone element)
  return (
    <div style={{ display: 'flex', backgroundColor: contentBg, minHeight: '400px', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden' }}>
      <IconRail />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar with active tab name */}
        <div style={{ height: '52px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0 }}>
          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
            {links[activeTab]?.text || 'Overview'}
          </div>
        </div>
        {/* Content placeholder */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>{links[activeTab]?.text || 'Tab'} Content Area</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '50px' }} />
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '50px' }} />
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '50px' }} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '50px' }} />
        </div>
      </div>
    </div>
  )
}

/* ── Sidebar Nav Template ──────────────────────────────────────────────────── */
function SidebarNavbar({ props, styles, activeHref, onLinkClick, sidebarOnly = false }) {
  const [hoveredLink, setHoveredLink] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { viewportWidth } = useBuilder()
  const links = props.links || []
  const brand = props.brand || 'Dashboard'
  const pageTitle = props.sidebarPageTitle || 'Overview'
  const userInitials = props.sidebarUserInitials || 'AB'
  const stats = props.sidebarStats || [
    { label: 'Users', value: '—' },
    { label: 'Revenue', value: '—' },
    { label: 'Orders', value: '—' },
    { label: 'Growth', value: '—' },
  ]
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet
  const navBg = styles?.backgroundColor || '#1e1b4b'
  const textColor = styles?.color || '#c7d2fe'
  const accentColor = props.sidebarAccent || '#818cf8'
  const contentBg = props.sidebarContentBg || '#0f0e24'

  // Sidebar width: collapsed = icon-only, expanded = full labels
  const sidebarW = collapsed ? '60px' : '220px'

  const getIcon = (text) => {
    const t = (text || '').toLowerCase()
    if (t.includes('home') || t.includes('dashboard') || t.includes('overview')) return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
    )
    if (t.includes('setting')) return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    )
    if (t.includes('user') || t.includes('team') || t.includes('people')) return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    )
    if (t.includes('analytic') || t.includes('report') || t.includes('stat') || t.includes('chart')) return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
    )
    if (t.includes('inbox') || t.includes('message') || t.includes('mail')) return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="22,12 16,12 14,15 10,15 8,12 2,12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
    )
    if (t.includes('product') || t.includes('store') || t.includes('shop')) return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    )
  }

  const CollapseBtn = ({ style = {} }) => (
    <button
      onClick={() => isSmall ? setMobileOpen(o => !o) : setCollapsed(c => !c)}
      style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: textColor, padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}
      title={isSmall ? (mobileOpen ? 'Close menu' : 'Open menu') : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
        {(collapsed || (isSmall && !mobileOpen))
          ? <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
          : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
        }
      </svg>
    </button>
  )

  // ── sidebarOnly: render JUST the sidebar panel (Canvas uses this in layout mode) ──
  if (sidebarOnly) {
    return (
      <div style={{ width: sidebarW, backgroundColor: navBg, display: 'flex', flexDirection: 'column', transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)', height: '100%', fontFamily: 'system-ui, -apple-system, sans-serif', borderRight: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', minHeight: '60px', flexShrink: 0 }}>
          {!collapsed && <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{brand}</div>}
          <CollapseBtn style={{ marginLeft: collapsed ? '0' : '8px' }} />
        </div>
        {/* Nav items */}
        <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflowY: 'auto' }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            const isHov = hoveredLink === i
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                onMouseEnter={() => setHoveredLink(i)}
                onMouseLeave={() => setHoveredLink(null)}
                title={collapsed ? link.text : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '11px', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '9px 12px', borderRadius: '9px', textDecoration: 'none', color: isActive ? '#fff' : isHov ? '#e0e7ff' : textColor, backgroundColor: isActive ? accentColor : isHov ? 'rgba(129,140,248,0.12)' : 'transparent', fontWeight: isActive ? '600' : '500', fontSize: '0.875rem', transition: 'all 0.15s', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.65, display: 'flex' }}>{getIcon(link.text)}</span>
                {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.text}</span>}
              </a>
            )
          })}
        </div>
        {/* User row */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '10px', justifyContent: collapsed ? 'center' : 'flex-start', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: accentColor + '55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.7rem', color: accentColor, flexShrink: 0 }}>{userInitials}</div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.sidebarUserName || 'Admin User'}</div>
              <div style={{ fontSize: '0.7rem', color: textColor, opacity: 0.6, whiteSpace: 'nowrap' }}>{props.sidebarUserRole || 'Administrator'}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const showSidebar = isSmall ? mobileOpen : true

  return (
    <div style={{ display: 'flex', backgroundColor: contentBg, minHeight: '400px', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden', position: 'relative' }}>

      {/* ── Sidebar panel ── */}
      <div style={{
        width: isSmall ? (mobileOpen ? '220px' : '0') : sidebarW,
        backgroundColor: navBg,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        position: isSmall ? 'absolute' : 'relative',
        top: 0, left: 0, bottom: 0,
        zIndex: isSmall ? 30 : 'auto',
        boxShadow: isSmall && mobileOpen ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
        minHeight: '400px',
      }}>
        {showSidebar && (
          <>
            {/* Sidebar header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', minHeight: '60px', flexShrink: 0 }}>
              {!collapsed && (
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {brand}
                </div>
              )}
              {!isSmall && (
                <CollapseBtn style={{ marginLeft: collapsed ? '0' : '8px' }} />
              )}
            </div>

            {/* Nav items */}
            <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflowY: 'auto' }}>
              {links.map((link, i) => {
                const isActive = link.href === activeHref
                const isHov = hoveredLink === i
                return (
                  <a key={i} href={link.href || '#'}
                    onClick={(e) => { e.preventDefault(); if (isSmall) setMobileOpen(false); if (onLinkClick) onLinkClick(link, e) }}
                    onMouseEnter={() => setHoveredLink(i)}
                    onMouseLeave={() => setHoveredLink(null)}
                    title={collapsed ? link.text : undefined}
                    style={{ display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '11px', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '9px 12px', borderRadius: '9px', textDecoration: 'none', color: isActive ? '#fff' : isHov ? '#e0e7ff' : textColor, backgroundColor: isActive ? accentColor : isHov ? 'rgba(129,140,248,0.12)' : 'transparent', fontWeight: isActive ? '600' : '500', fontSize: '0.875rem', transition: 'all 0.15s', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.65, display: 'flex' }}>{getIcon(link.text)}</span>
                    {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.text}</span>}
                  </a>
                )
              })}
            </div>

            {/* User row at bottom */}
            <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '10px', justifyContent: collapsed ? 'center' : 'flex-start', flexShrink: 0 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: accentColor + '55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.7rem', color: accentColor, flexShrink: 0 }}>
                {userInitials}
              </div>
              {!collapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.sidebarUserName || 'Admin User'}</div>
                  <div style={{ fontSize: '0.7rem', color: textColor, opacity: 0.6, whiteSpace: 'nowrap' }}>{props.sidebarUserRole || 'Administrator'}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Main content area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', backgroundColor: contentBg, borderBottom: '1px solid rgba(255,255,255,0.06)', height: '60px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CollapseBtn />
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{pageTitle}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Bell */}
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', cursor: 'pointer', color: textColor, padding: '6px 8px', display: 'flex', alignItems: 'center', lineHeight: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            </button>
            {/* Avatar */}
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: accentColor + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.7rem', color: accentColor, border: `2px solid ${accentColor}60` }}>
              {userInitials}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: '1 1 80px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'rgba(255,255,255,0.85)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Content placeholder blocks */}
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.78rem' }}>Chart / Content Area</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.14)', fontSize: '0.72rem' }}>Panel</span>
            </div>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.14)', fontSize: '0.72rem' }}>Panel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {isSmall && mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 20 }} />
      )}
    </div>
  )
}

/* ── Puzzle Game Navbar ────────────────────────────────────────────────────── */
const PUZZLE_PATH = "M20,12V10a2,2,0,0,0-2-2,2,2,0,0,1-2-2,2,2,0,0,0-2-2H12V2a2,2,0,0,0-2-2A2,2,0,0,0,8,2V4H6A2,2,0,0,0,4,6,2,2,0,0,1,2,8,2,2,0,0,0,0,10v2a2,2,0,0,0,2,2,2,2,0,0,1,2,2,2,2,0,0,0,2,2H8v2a2,2,0,0,0,2,2,2,2,0,0,0,2-2V20h2a2,2,0,0,0,2-2,2,2,0,0,1,2-2,2,2,0,0,0,2-2Z"

function PuzzleNavbar({ props, styles, activeHref, onLinkClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { viewportWidth } = useBuilder()
  const links = props.links || []
  const brand = props.brand || 'puzle'
  const accent = props.puzzleAccent || '#f97316'
  const registerText = props.puzzleRegisterText || 'Register'
  const loginText = props.puzzleLoginText || 'Log in'
  const regBtnColor = props.puzzleRegBtnColor || accent
  const loginBtnBg = props.puzzleLoginBtnBg || accent
  const loginBtnText = props.puzzleLoginBtnText || '#ffffff'
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet
  const navBg = styles?.backgroundColor || '#fdf6f0'
  const textColor = styles?.color || '#0f172a'

  return (
    <header style={{ backgroundColor: navBg, padding: isSmall ? '16px 20px' : '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg style={{ width: '32px', height: '32px', fill: accent }} viewBox="0 0 24 24">
          <path d={PUZZLE_PATH} />
        </svg>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.04em', color: textColor }}>{brand}</span>
      </div>

      {/* Desktop nav */}
      {!isSmall && (
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600', color: isActive ? accent : '#64748b', transition: 'color 0.2s' }}
              >{link.text}</a>
            )
          })}
        </nav>
      )}

      {/* Auth buttons / hamburger */}
      {!isSmall ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ padding: '8px 20px', fontSize: '0.875rem', fontWeight: '700', color: regBtnColor, border: `1.5px solid ${regBtnColor}`, borderRadius: '8px', background: 'transparent', cursor: 'pointer' }}>{registerText}</button>
          <button style={{ padding: '8px 20px', fontSize: '0.875rem', fontWeight: '700', color: loginBtnText, backgroundColor: loginBtnBg, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loginText}</button>
        </div>
      ) : (
        <button onClick={() => setMenuOpen(o => !o)} style={{ padding: '8px 10px', backgroundColor: loginBtnBg, color: loginBtnText, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', lineHeight: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      )}

      {/* Mobile dropdown */}
      {isSmall && menuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, backgroundColor: navBg, borderTop: `2px solid ${accent}20`, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', padding: '8px 20px 16px' }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); if (onLinkClick) onLinkClick(link, e) }}
                style={{ display: 'block', padding: '11px 0', textDecoration: 'none', color: isActive ? accent : textColor, fontWeight: isActive ? '700' : '500', fontSize: '0.95rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
              >{link.text}</a>
            )
          })}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button style={{ flex: 1, padding: '8px', fontSize: '0.875rem', fontWeight: '700', color: regBtnColor, border: `1.5px solid ${regBtnColor}`, borderRadius: '8px', background: 'transparent', cursor: 'pointer' }}>{registerText}</button>
            <button style={{ flex: 1, padding: '8px', fontSize: '0.875rem', fontWeight: '700', color: loginBtnText, backgroundColor: loginBtnBg, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loginText}</button>
          </div>
        </div>
      )}
    </header>
  )
}

/* ── Smart Home Dashboard ─────────────────────────────────────────────────── */
function SmartHomeDashboard({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const accent = props.shdAccent || '#b4c7bc'
  const darkBg = props.shdDarkBg || '#2a2624'
  const roomName = props.shdRoomName || 'Living room'

  const [tvOn, setTvOn] = React.useState(true)
  const [gpOn, setGpOn] = React.useState(false)
  const [playing, setPlaying] = React.useState(true)
  const [lightPct, setLightPct] = React.useState(Number(props.shdLightPercent) || 70)
  const [dragging, setDragging] = React.useState(false)
  const lightCardRef = React.useRef(null)

  const circumference = 2 * Math.PI * 44
  const powerOffset = circumference - (0.65 * circumference)

  const glassStyle = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.1)',
  }

  const updateLight = (clientY) => {
    if (!lightCardRef.current) return
    const rect = lightCardRef.current.getBoundingClientRect()
    const relY = clientY - rect.top
    const pct = Math.max(0, Math.min(100, Math.round((1 - relY / rect.height) * 100)))
    setLightPct(pct)
  }

  const onLightMouseDown = (e) => { setDragging(true); updateLight(e.clientY) }
  const onLightMouseMove = (e) => { if (dragging) updateLight(e.clientY) }
  const onLightMouseUp = () => setDragging(false)

  const gridStyle = isSmall
    ? { display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }
    : { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }

  const span6 = isSmall ? {} : { gridColumn: 'span 6 / span 6' }
  const span3 = isSmall ? {} : { gridColumn: 'span 3 / span 3' }
  const span6row2 = isSmall ? {} : { gridColumn: 'span 6 / span 6', gridRow: 'span 2 / span 2' }

  return (
    <div
      style={{
        background: `radial-gradient(circle at center, #4a4440 0%, ${darkBg} 100%)`,
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        padding: isSmall ? '1rem' : '2rem',
        minHeight: '600px',
        ...styles,
      }}
      onMouseMove={onLightMouseMove}
      onMouseUp={onLightMouseUp}
      onMouseLeave={onLightMouseUp}
    >
      <style>{`
        .shd-light-fill { transition: height 0.3s ease; background: rgba(180,199,188,0.2); }
        .shd-progress-circle { transition: stroke-dashoffset 0.8s ease-out; transform: rotate(-90deg); transform-origin: 50% 50%; }
      `}</style>

      <div style={{ display: 'flex', gap: '1.25rem', height: '100%' }}>

        {/* Sidebar */}
        {!isSmall && (
          <nav style={{ ...glassStyle, borderRadius: '2.5rem', width: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              {[
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>,
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>,
              ].map((icon, i) => (
                <button key={i} style={{ padding: '10px', background: i === 0 ? 'rgba(255,255,255,0.12)' : 'none', borderRadius: '14px', border: 'none', color: i === 0 ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{icon}</button>
              ))}
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
              <img src={props.shdProfileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </nav>
        )}

        {/* Dashboard Grid */}
        <div style={{ flex: 1 }}>
          <div style={gridStyle}>

            {/* Live Camera */}
            <div style={{ ...span6, height: '320px', position: 'relative', borderRadius: '2.5rem', overflow: 'hidden' }}>
              <img src={props.shdCameraImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200'} alt={roomName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
              <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', padding: '6px 14px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.85rem', fontWeight: '500' }}>{roomName}</div>
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '4px 12px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />LIVE
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>Live Camera</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{roomName}</div>
              </div>
            </div>

            {/* Smart Plug Gauge */}
            <div style={{ ...span6, ...glassStyle, borderRadius: '2.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '300', margin: 0 }}>Smart Plug</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', fontSize: '0.9rem' }}>{roomName}</p>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="180" height="180" viewBox="0 0 100 100">
                  <circle stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" r="44" cx="50" cy="50" />
                  <circle className="shd-progress-circle" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="transparent" r="44" cx="50" cy="50" strokeDasharray={circumference} strokeDashoffset={powerOffset} />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '6px' }}><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
                  <span style={{ fontSize: '1.8rem', fontWeight: '300' }}>{props.shdPowerWatts || '65W'}</span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Power</span>
                </div>
              </div>
            </div>

            {/* Movie Time Scene */}
            <div style={{ ...span3, ...glassStyle, borderRadius: '2.5rem', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '1rem' }}>Movie time</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Scene</div>
                </div>
              </div>
              <button style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </button>
            </div>

            {/* Smart TV */}
            <div style={{ ...span3, background: tvOn ? accent : 'rgba(255,255,255,0.05)', color: tvOn ? darkBg : 'white', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: tvOn ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '2.5rem', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.5s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}><rect width="20" height="15" x="2" y="7" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg>
                <span style={{ fontSize: '0.85rem', fontWeight: '500', opacity: 0.6 }}>{tvOn ? 'On' : 'Off'}</span>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '4px' }}>Smart TV</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1.25rem' }}>{roomName}</div>
                <div
                  onClick={() => setTvOn(v => !v)}
                  style={{ width: '48px', height: '26px', borderRadius: '999px', background: tvOn ? 'white' : 'rgba(0,0,0,0.25)', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                >
                  <span style={{ display: 'block', width: '18px', height: '18px', borderRadius: '50%', background: tvOn ? darkBg : 'white', position: 'absolute', top: '4px', left: tvOn ? '26px' : '4px', transition: 'left 0.3s' }} />
                </div>
              </div>
            </div>

            {/* Music Player */}
            <div style={{ ...span6row2, ...glassStyle, borderRadius: '3rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(29,185,84,0.15)', padding: '4px 12px', borderRadius: '999px', border: '1px solid rgba(29,185,84,0.2)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1db954', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="black"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#1db954', fontWeight: '500' }}>{props.shdPlaylistName || 'Everyday Playlist'}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: isSmall ? 'column' : 'row', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '160px', height: '160px', borderRadius: '1.5rem', overflow: 'hidden', transform: 'rotate(3deg)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', flexShrink: 0 }}>
                  <img src={props.shdAlbumImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: isSmall ? 'center' : 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Smart TV</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '300' }}>{roomName}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
                    </button>
                    <button onClick={() => setPlaying(!playing)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      {playing
                        ? <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="black"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="black"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>}
                    </button>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamepad */}
            <div style={{ ...span3, ...glassStyle, borderRadius: '2.5rem', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {[
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="15" y1="13" x2="15.01" y2="13" /><line x1="18" y1="11" x2="18.01" y2="11" /><rect width="20" height="12" x="2" y="6" rx="2" /></svg>,
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
                ].map((icon, i) => (
                  <div key={i} style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{gpOn ? 'On' : 'Off'}</span>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '4px' }}>Gamepad</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>{roomName}</div>
                <div
                  onClick={() => setGpOn(v => !v)}
                  style={{ width: '48px', height: '26px', borderRadius: '999px', background: gpOn ? 'white' : 'rgba(255,255,255,0.2)', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.3s' }}
                >
                  <span style={{ display: 'block', width: '18px', height: '18px', borderRadius: '50%', background: gpOn ? darkBg : 'white', position: 'absolute', top: '4px', left: gpOn ? '26px' : '4px', transition: 'left 0.3s' }} />
                </div>
              </div>
            </div>

            {/* Lighting Slider */}
            <div
              ref={lightCardRef}
              style={{ ...span3, ...glassStyle, borderRadius: '2.5rem', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden', cursor: 'ns-resize', userSelect: 'none', minHeight: '180px' }}
              onMouseDown={onLightMouseDown}
            >
              <div className="shd-light-fill" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: `${lightPct}%`, background: 'rgba(180,199,188,0.2)', transition: 'height 0.1s' }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '300' }}>{lightPct}%</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Agensea Navbar ───────────────────────────────────────────────────────── */
function AgenseaNavbar({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const brand = props.agenseaBrand || 'THE AGENSEA'
  const accent = props.agenseaAccent || '#3b82f6'
  const ctaText = props.agenseaCtaText || 'Donate'
  const ctaHref = props.agenseaCtaHref || '#'
  const showCta = props.agenseaShowCta !== false
  const links = props.links || [{ text: 'About', href: '#' }, { text: 'Projects', href: '#' }]
  const navBg = styles?.backgroundColor || 'rgba(255,255,255,0.85)'
  const textColor = styles?.color || '#000000'

  return (
    <div style={{ position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        .ag-link { text-decoration:none; color:#52525b; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; transition:color 0.2s; }
        .ag-link:hover { color:${textColor}; }
        .ag-cta { background:${textColor}; color:${navBg}; padding:0.55rem 1.3rem; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; border:none; text-transform:uppercase; cursor:pointer; transition:opacity 0.2s; }
        .ag-cta:hover { opacity:0.8; }
      `}</style>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 2rem', backgroundColor: navBg, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
        {/* Logo with wave underline */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
          <span style={{ fontWeight: '900', fontSize: '1.3rem', letterSpacing: '-0.04em', position: 'relative', zIndex: 10, color: textColor }}>{brand}</span>
          <svg style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '14px', transform: 'translateY(-50%)', color: accent, zIndex: 5 }} viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>
        {/* Desktop links */}
        {!isSmall && (
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {links.map((l, i) => <a key={i} href={l.href || '#'} className="ag-link" onClick={(e) => handleLink(e, l.href, l.linkType)}>{l.text}</a>)}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {showCta && <a href={ctaHref || '#'} className="ag-cta" onClick={(e) => handleLink(e, ctaHref, props.agenseaCtaLinkType)}>{ctaText}</a>}
          {isSmall && (
            <button onClick={() => setMobileOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, display: 'flex', alignItems: 'center' }}>
              {mobileOpen
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              }
            </button>
          )}
        </div>
      </nav>
      {/* Mobile dropdown */}
      {isSmall && mobileOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: navBg === 'rgba(255,255,255,0.85)' ? '#ffffff' : navBg, zIndex: 200, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1.5rem', alignItems: 'center', borderTop: '1px solid #f4f4f5', backdropFilter: 'blur(10px)' }}>
          {links.map((l, i) => <a key={i} href={l.href || '#'} onClick={(e) => { setMobileOpen(false); handleLink(e, l.href, l.linkType) }} style={{ fontSize: '1.4rem', fontWeight: '900', textDecoration: 'none', color: textColor, textTransform: 'uppercase' }}>{l.text}</a>)}
        </div>
      )}
    </div>
  )
}

/* ── Agensea Hero ─────────────────────────────────────────────────────────── */
function AgenseaHero({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const [videoOpen, setVideoOpen] = React.useState(false)
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const accent = props.agenseaAccent || '#3b82f6'
  const waveOpacity = props.agenseaWaveOpacity || '0.12'
  const row1Text = props.agenseaRow1Text || 'Creative Agency'
  const row1Image = props.agenseaRow1Image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'
  const row2Text = props.agenseaRow2Text || 'for the'
  const row2Image = props.agenseaRow2Image || 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&q=80&w=1200'
  const row3Text = props.agenseaRow3Text || 'Ocean'
  const row3Image = props.agenseaRow3Image || 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=1200'
  const badgeText = props.agenseaBadgeText || 'WATCH OUR STORY • WATCH OUR STORY •'
  const videoUrl = props.agenseaBadgeVideoUrl || ''
  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#000000'

  const headingSize = isSmall ? 'clamp(2.2rem,9vw,4rem)' : 'clamp(3.5rem,7vw,8rem)'
  const rowStyle = { display: 'flex', flexDirection: isSmall ? 'column' : 'row', alignItems: isSmall ? 'flex-start' : 'center', gap: isSmall ? '0.8rem' : '2rem', marginBottom: isSmall ? '1.5rem' : '3rem' }
  const capsule = (w, h) => ({ borderRadius: '9999px', overflow: 'hidden', backgroundColor: '#f4f4f5', flexShrink: 0, width: w, height: h })
  const imgStyle = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }

  const Badge = () => (
    <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg className="ag-badge-ring" style={{ width: '100%', height: '100%', position: 'absolute' }} viewBox="0 0 100 100">
        <path id="ag-curve" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
        <text fontSize="8.5" fontWeight="700" letterSpacing="2" fill={textColor} opacity="0.7">
          <textPath xlinkHref="#ag-curve">{badgeText}</textPath>
        </text>
      </svg>
      <div
        className="ag-badge-btn"
        onClick={() => videoUrl && setVideoOpen(true)}
        style={{ position: 'absolute', width: '44px', height: '44px', background: accent, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: videoUrl ? 'pointer' : 'default', boxShadow: `0 8px 20px ${accent}55`, transition: 'opacity 0.2s' }}
        title={videoUrl ? 'Watch video' : ''}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
        </svg>
      </div>
    </div>
  )

  return (
    <section style={{ position: 'relative', backgroundColor: bg, padding: isSmall ? '4rem 1.5rem 3rem' : '7rem 3rem 5rem', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      <style>{`
        @keyframes ag-rotate { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .ag-capsule:hover img { transform:scale(1.1) !important; }
        .ag-badge-ring { animation: ag-rotate 12s linear infinite; }
        .ag-badge-btn:hover { opacity:0.85; }
        .ag-video-overlay { position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center; }
        .ag-video-inner { position:relative;width:min(90vw,900px);aspect-ratio:16/9; }
        .ag-video-close { position:absolute;top:-40px;right:0;background:none;border:none;color:#fff;cursor:pointer;font-size:1.5rem;line-height:1;padding:4px 8px; }
      `}</style>

      {/* Video modal */}
      {videoOpen && (
        <div className="ag-video-overlay" onClick={() => setVideoOpen(false)}>
          <div className="ag-video-inner" onClick={e => e.stopPropagation()}>
            <button className="ag-video-close" onClick={() => setVideoOpen(false)}>✕</button>
            <iframe src={videoUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }} allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        </div>
      )}

      {/* Wave background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: waveOpacity, pointerEvents: 'none', color: accent }} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <path d="M-100,200 Q200,150 400,250 T900,200 T1500,300" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,400 Q300,350 500,450 T1000,400 T1600,500" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,600 Q400,550 600,650 T1100,600 T1700,700" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Row 1 */}
        <div style={rowStyle}>
          <div className="ag-capsule" style={capsule(isSmall ? '140px' : '220px', isSmall ? '70px' : '110px')}>
            <img src={row1Image} alt="" style={imgStyle} />
          </div>
          <h1 style={{ fontSize: headingSize, fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 0.92, margin: 0, color: textColor }}>{row1Text}</h1>
        </div>

        {/* Row 2 */}
        <div style={rowStyle}>
          <h1 style={{ fontSize: headingSize, fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 0.92, margin: 0, color: textColor }}>{row2Text}</h1>
          <div className="ag-capsule" style={{ ...capsule('auto', isSmall ? '80px' : '110px'), flex: isSmall ? 'none' : 1, width: isSmall ? '100%' : 'auto' }}>
            <img src={row2Image} alt="" style={imgStyle} />
          </div>
        </div>

        {/* Row 3 + badge */}
        <div style={{ position: 'relative', ...rowStyle, marginBottom: isSmall ? '1.5rem' : '4rem' }}>
          <div className="ag-capsule" style={capsule(isSmall ? '100%' : '52%', isSmall ? '80px' : '110px')}>
            <img src={row3Image} alt="" style={imgStyle} />
          </div>
          <h1 style={{ fontSize: headingSize, fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 0.92, margin: 0, color: textColor }}>{row3Text}</h1>
          {/* Badge — absolute on desktop */}
          {!isSmall && (
            <div style={{ position: 'absolute', left: '34%', bottom: '-58px', zIndex: 20 }}>
              <Badge />
            </div>
          )}
        </div>

        {/* Badge — inline centered on small screens */}
        {isSmall && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
            <Badge />
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Product Card Section ─────────────────────────────────────────────────── */
const PC_STAR = (
  <svg width="18" height="18" viewBox="0 0 20 20" style={{ fill: '#fb923c', display: 'inline-block' }}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)
const PC_ICONS = {
  shipping: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  warranty: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  returns: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>,
}

function ProductCardSection({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const outerBg = styles?.backgroundColor || '#ebecf0'
  const textColor = styles?.color || '#1a1a1a'
  const accent = props.pcAccent || '#4361ee'
  const image = props.pcImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000'
  const title = props.pcTitle || 'SuperBook Pro'
  const description = props.pcDescription || 'Lightning-fast performance, stunning Retina display, all-day battery life.'
  const price = props.pcPrice || '$1499.00'
  const btnPrimary = props.pcBtnPrimary || 'Add To Cart'
  const btnSecond = props.pcBtnSecondary || 'Buy Now'
  const rating = parseFloat(props.pcRating || '4.8')
  const reviewText = props.pcReviewText || 'Read all reviews'
  const reviewHref = props.pcReviewHref || '#'
  const features = props.pcFeatures || [
    { icon: 'shipping', label: 'Free Shipping' },
    { icon: 'warranty', label: '2-Year Warranty' },
    { icon: 'returns', label: 'Easy Returns' },
  ]

  const filledStars = Math.round(rating)

  return (
    <section style={{ backgroundColor: outerBg, padding: isSmall ? '24px 16px' : '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '2rem', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '1000px', padding: isSmall ? '28px 20px' : '56px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: isSmall ? '32px' : '48px', alignItems: 'center' }}>
          {/* Image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={image} alt={title} style={{ width: '100%', height: 'auto', transform: 'scale(1.08)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.18))', display: 'block' }} />
          </div>
          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h1 style={{ fontSize: isSmall ? '2rem' : '2.8rem', fontWeight: 700, letterSpacing: '-0.03em', color: textColor, margin: '0 0 16px' }}>{title}</h1>
              <p style={{ color: '#6b7280', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>{description}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.03em', color: textColor, margin: 0 }}>{price}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button style={{ backgroundColor: accent, color: '#fff', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}>{btnPrimary}</button>
                <button style={{ backgroundColor: 'transparent', color: accent, border: `1px solid ${accent}`, padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>{btnSecond}</button>
              </div>
            </div>
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} style={{ opacity: n <= filledStars ? 1 : 0.25 }}>{PC_STAR}</span>
                ))}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>{props.pcRating || '4.8'} / 5</span>
              <a href={reviewHref} onClick={(e) => handleLink(e, reviewHref, props.pcReviewLinkType || 'url')} style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{reviewText}</a>
            </div>
            {/* Features */}
            <div style={{ paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '20px' }}>Customer Benefits</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.7, textAlign: 'center', color: textColor }}>
                    {PC_ICONS[f.icon] || PC_ICONS.shipping}
                    <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Creative Collective Templates ────────────────────────────────────────── */
function CreativeNavbar({ element, onLinkClick }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isSmall = viewportWidth === 'mobile'
  const [menuOpen, setMenuOpen] = useState(false)

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const brand = props.ccBrand || 'Creative'
  const links = props.links || [
    { text: 'Home', href: '#' },
    { text: 'Portfolio', href: '#portfolio' },
    { text: 'About', href: '#about' },
    { text: 'Contact', href: '#contact' },
  ]

  return (
    <header style={{ backgroundColor: bg, borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 50, fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: textColor }}>{brand}</span>
        {/* Desktop nav */}
        {!isSmall && (
          <nav style={{ display: 'flex', gap: '36px' }}>
            {links.map((l, i) => (
              <a key={i} href={l.href || '#'} onClick={(e) => handleLink(e, l.href, l.linkType)} style={{ fontSize: '14px', fontWeight: 500, color: i === 0 ? textColor : '#6b7280', textDecoration: 'none', borderBottom: i === 0 ? `2px solid ${textColor}` : 'none', paddingBottom: '2px' }}>{l.text}</a>
            ))}
          </nav>
        )}
        {/* Hamburger */}
        {isSmall && (
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: textColor }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        )}
      </div>
      {/* Mobile overlay — position:absolute so it stays inside the canvas container */}
      {menuOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', backgroundColor: bg, zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '72px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: textColor }}>{brand}</span>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: textColor }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', padding: '40px 24px', gap: '32px' }}>
            {links.map((l, i) => (
              <a key={i} href={l.href || '#'} onClick={(e) => { setMenuOpen(false); handleLink(e, l.href, l.linkType) }} style={{ fontSize: '1.6rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.12em', color: textColor, textDecoration: 'none' }}>{l.text}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

function CreativeHero({ element }) {
  const { props } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile'

  const heading = props.ccHeading || 'Creative Collective'
  const subtitle = props.ccSubtitle || 'A Showcase of Innovation'
  const images = props.ccHeroImages || [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000',
  ]

  const [activeIdx, setActiveIdx] = useState(0)

  // Auto-cycle every 5s
  React.useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <section style={{ position: 'relative', height: isSmall ? '50vh' : '65vh', backgroundImage: `url('${images[activeIdx]}')`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 1.5s ease-in-out', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1 }} />
      {/* Text */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '560px', color: '#fff' }}>
          <h2 style={{ fontSize: isSmall ? '2rem' : '3rem', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1.15, margin: '0 0 8px' }}>{heading}</h2>
          <p style={{ fontSize: isSmall ? '1rem' : '1.15rem', opacity: 0.9, fontWeight: 300, margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 2 }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: activeIdx === i ? '#fff' : 'rgba(255,255,255,0.4)', transform: activeIdx === i ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.3s ease' }}
          />
        ))}
      </div>
    </section>
  )
}

function CreativeProjects({ element }) {
  const { props, styles } = element
  const { viewportWidth, state, switchPage } = useBuilder()
  const isSmall = viewportWidth === 'mobile'
  const isMedium = viewportWidth === 'tablet'
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  const handleLinkClick = (e, href, linkType) => {
    e.preventDefault()
    if (!href || href === '#') return
    if (linkType === 'section' || href.startsWith('#')) {
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (linkType === 'page' || href.endsWith('.html')) {
      const target = (state.pages || []).find((p) => {
        const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        return p.name === 'Home' ? (href === '/' || href === 'index.html') : `${slug}.html` === href
      })
      if (target) switchPage(target.id)
    } else {
      window.open(href, '_blank', 'noopener')
    }
  }

  const bg = styles?.backgroundColor || '#f9f9f9'
  const textColor = styles?.color || '#1a1a1a'
  const btnText = props.ccBtnText || 'View Project'
  const projects = props.ccProjects || []

  const cols = isSmall ? 1 : isMedium ? 2 : 4

  return (
    <main style={{ backgroundColor: bg, padding: isSmall ? '40px 16px' : '56px 24px', fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isSmall ? '20px' : '28px' }}>
        {projects.map((p, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: p.bgColor || '#fff',
              boxShadow: hoveredCard === i ? '0 20px 25px -5px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
              transform: hoveredCard === i ? 'translateY(-5px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
            }}
          >
            <div style={{ aspectRatio: '4/5', overflow: 'hidden', backgroundColor: p.bgColor || '#f3f4f6' }}>
              <img
                src={p.image}
                alt={p.title}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  transform: hoveredCard === i ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.5s ease',
                }}
              />
            </div>
            <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textColor, margin: '0 0 4px' }}>{p.title}</h3>
                <p style={{ fontSize: '10px', color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>{p.category}</p>
              </div>
              {/* Use <a> so href is stored for HTML export; preventDefault stops navigation in the builder preview */}
              <a
                href={p.href || '#'}
                onClick={(e) => handleLinkClick(e, p.href || '#', p.linkType)}
                onMouseEnter={() => setHoveredBtn(i)}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  border: '1px solid #e5e7eb', fontSize: '10px', textTransform: 'uppercase',
                  letterSpacing: '0.05em', padding: '6px 12px', fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-block',
                  background: hoveredBtn === i ? '#1a1a1a' : 'transparent',
                  color: hoveredBtn === i ? '#fff' : textColor,
                  borderColor: hoveredBtn === i ? '#1a1a1a' : '#e5e7eb',
                  transition: 'all 0.2s ease',
                }}
              >{btnText}</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

function CreativeFooter({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isSmall = viewportWidth === 'mobile'

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const copyright = props.ccCopyright || '© Copyright CreativeCollective.com'
  const fbHref = props.ccFacebookHref || '#'
  const twHref = props.ccTwitterHref || '#'
  const igHref = props.ccInstagramHref || '#'

  return (
    <footer style={{ backgroundColor: bg, borderTop: '1px solid #f3f4f6', padding: isSmall ? '32px 16px' : '40px 24px', fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isSmall ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: '20px', textAlign: isSmall ? 'center' : 'left' }}>
        <p style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>{copyright}</p>
        <div style={{ display: 'flex', gap: '20px', color: textColor }}>
          <a href={fbHref} onClick={(e) => handleLink(e, fbHref, 'url')} style={{ color: textColor }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
          </a>
          <a href={twHref} onClick={(e) => handleLink(e, twHref, 'url')} style={{ color: textColor }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
          </a>
          <a href={igHref} onClick={(e) => handleLink(e, igHref, 'url')} style={{ color: textColor }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ── SoleMate Templates ───────────────────────────────────────────────────── */
function SoleMateNavbar({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isSmall = viewportWidth === 'mobile'

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const brand = props.smBrand || 'SoleMate'
  const placeholder = props.smSearchPlaceholder || 'Search'
  const cartCount = props.smCartCount || '1'
  const links = props.links || [
    { text: 'Home', href: '#' },
    { text: 'Shop', href: '#shop' },
    { text: 'About Us', href: '#about' },
  ]

  return (
    <header style={{ backgroundColor: bg, borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 50, fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {!isSmall && (
          <div style={{ width: '220px', position: 'relative' }}>
            <input readOnly placeholder={placeholder} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '2px', padding: '6px 36px 6px 10px', fontSize: '13px', outline: 'none', color: textColor, backgroundColor: bg, boxSizing: 'border-box' }} />
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '2px' }}>
            {links.map((l, i) => (
              <a key={i} href={l.href || '#'} onClick={(e) => handleLink(e, l.href, l.linkType)} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: textColor, textDecoration: 'none', borderBottom: i === 0 ? `2px solid ${textColor}` : '2px solid transparent', paddingBottom: '2px' }}>{l.text}</a>
            ))}
            <div style={{ position: 'relative', cursor: 'pointer', color: textColor }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span style={{ position: 'absolute', top: '-7px', right: '-8px', background: '#ef4444', color: '#fff', fontSize: '9px', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>
            </div>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', fontStyle: 'italic', color: textColor, margin: 0, lineHeight: 1.1 }}>{brand}</h1>
        </div>
        {!isSmall && <div style={{ width: '220px' }} />}
      </div>
    </header>
  )
}

function SoleMateHero({ element }) {
  const { props } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile'
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const ctaText = props.smHeroCtaText || 'Shop Now'
  const images = props.smHeroImages || [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1605733513597-a8f8d410fe3c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
  ]

  return (
    <section style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: '4px', padding: '4px', backgroundColor: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {images.map((img, i) => (
        <div key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', cursor: 'pointer' }}>
          <img src={img} alt={`Panel ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: hoveredIdx === i ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s ease' }}>
            <button style={{ border: '2px solid #fff', color: hoveredIdx === i ? '#000' : '#fff', background: hoveredIdx === i ? '#fff' : 'transparent', padding: '6px 20px', textTransform: 'uppercase', fontWeight: 600, fontSize: '13px', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              {ctaText}
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

function SoleMateCategories({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile'
  const [activeTab, setActiveTab] = useState(2)

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const catLabels = props.smCatLabels || ["Men's", "Women's", "New Arrivals", "Sale"]
  const allImages = [
    props.smImgsMens || [],
    props.smImgsWomens || [],
    props.smImgsNew || [],
    props.smImgsSale || [],
  ]
  const displayImages = allImages[activeTab] || []

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '32px 16px' : '48px 24px', fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isSmall ? '16px' : '40px', marginBottom: '32px' }}>
          {catLabels.map((label, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: textColor, paddingBottom: '4px', borderBottom: activeTab === i ? `2px solid ${textColor}` : '2px solid transparent', transition: 'border-color 0.2s' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: '12px' }}>
          {displayImages.map((img, i) => (
            <img key={i} src={img} alt={catLabels[activeTab]} style={{ aspectRatio: '1/1', objectFit: 'cover', borderRadius: '2px', width: '100%', display: 'block' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SoleMateProducts({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile'

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const title = props.smFeaturedTitle || 'Featured Products'
  const btnText = props.smCartBtnText || 'Add to Cart'
  const products = props.smProducts || []

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '32px 16px' : '48px 24px', fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '40px', color: textColor }}>{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', gap: '20px' }}>
          {products.map((p, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '2px', marginBottom: '12px' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '112px', objectFit: 'contain', display: 'block' }} />
              </div>
              <h3 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h3>
              <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '10px' }}>{p.price}</p>
              <button style={{ backgroundColor: '#1a1a1a', color: '#fff', fontSize: '9px', padding: '6px 14px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>{btnText}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SoleMateFooter({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isSmall = viewportWidth === 'mobile'

  const bg = styles?.backgroundColor || '#000000'
  const textColor = styles?.color || '#ffffff'
  const footerLinks = props.smFooterLinks || [
    { text: 'Contact Us', href: '#' },
    { text: 'Privacy Policy', href: '#' },
  ]
  const twitterHref = props.smTwitterHref || '#'
  const instagramHref = props.smInstagramHref || '#'
  const facebookHref = props.smFacebookHref || '#'

  return (
    <footer style={{ backgroundColor: bg, color: textColor, padding: isSmall ? '32px 16px' : '40px 24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isSmall ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {footerLinks.map((l, i) => (
            <a key={i} href={l.href || '#'} onClick={(e) => handleLink(e, l.href, l.linkType || 'url')} style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: textColor, textDecoration: 'none', opacity: 0.8 }}>{l.text}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href={twitterHref} onClick={(e) => handleLink(e, twitterHref, 'url')} style={{ color: textColor }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
          </a>
          <a href={instagramHref} onClick={(e) => handleLink(e, instagramHref, 'url')} style={{ color: textColor }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
          </a>
          <a href={facebookHref} onClick={(e) => handleLink(e, facebookHref, 'url')} style={{ color: textColor }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ── AetherFlow Product Section ───────────────────────────────────────────── */
function AetherProductSection({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile'
  const isMedium = viewportWidth === 'tablet'

  const [activeIdx, setActiveIdx] = useState(0)

  const outerBg = styles?.backgroundColor || '#f3f4f6'
  const textColor = styles?.color || '#1a1a1a'
  const title = props.afTitle || 'AetherFlow X'
  const subtitle = props.afSubtitle || 'Unleash Your Potential'
  const ctaText = props.afCtaText || 'Learn More'
  const images = props.afImages || [
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1556656793-062ff98782ee?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1510557883980-505137219187?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1573148195900-7845fcc30127?auto=format&fit=crop&q=80&w=800',
  ]
  const specs = props.afSpecs || [
    { label: 'Display', value: '6.7" Super AMOLED' },
    { label: 'Processor', value: 'Octa-core AetherChip v2' },
    { label: 'Storage', value: '256GB / 512GB NVMe' },
  ]
  const price = props.afPrice || '$999.00'
  const stockText = props.afStockText || 'In Stock'
  const btnText = props.afBtnText || 'Add to Cart'
  const selectLabel = props.afSelectLabel || 'Configure Storage'
  const options = props.afOptions || ['256GB — Standard', '512GB — Professional']

  const isStackLayout = isSmall || isMedium

  return (
    <section style={{ backgroundColor: outerBg, padding: isSmall ? '16px' : '32px', fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: isStackLayout ? '1fr' : '2fr 1fr', gap: '24px', alignItems: 'stretch' }}>

        {/* Left card — hero + gallery */}
        <div style={{ background: '#fff', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Hero area */}
          <div style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', borderBottom: '1px solid rgba(0,0,0,0.03)', padding: isSmall ? '32px 24px' : '56px 48px', display: 'flex', flexDirection: isSmall ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: isSmall ? 'auto' : '360px', gap: '24px' }}>
            {/* Text */}
            <div style={{ textAlign: isSmall ? 'center' : 'left', maxWidth: '240px' }}>
              <h1 style={{ fontSize: isSmall ? '2rem' : '2.8rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 8px', color: textColor }}>{title}</h1>
              <p style={{ color: '#6b7280', fontSize: '1rem', margin: '0 0 32px', fontWeight: 300 }}>{subtitle}</p>
              <button style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '14px 36px', borderRadius: '9999px', fontWeight: 600, fontSize: '13px', letterSpacing: '0.04em', border: 'none', cursor: 'pointer' }}>{ctaText}</button>
            </div>
            {/* Main image */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: isSmall ? '220px' : '280px', margin: isSmall ? '0 auto' : '0' }}>
              <img
                src={images[activeIdx]}
                alt={title}
                style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 24px 32px rgba(0,0,0,0.15))' }}
              />
            </div>
          </div>

          {/* Thumbnail gallery */}
          <div style={{ padding: '28px 32px', background: '#fff' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: isSmall ? 'center' : 'flex-start' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    width: isSmall ? '64px' : '88px', height: isSmall ? '64px' : '88px',
                    borderRadius: '1.2rem', overflow: 'hidden', padding: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i === activeIdx ? '#fff' : '#f9fafb',
                    border: i === activeIdx ? '2px solid #1a1a1a' : '2px solid transparent',
                    boxShadow: i === activeIdx ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer', transition: 'all 0.25s ease'
                  }}
                >
                  <img src={img} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right card — specs + buy */}
        <div style={{ background: '#fff', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', padding: isSmall ? '28px 24px' : '40px', display: 'flex', flexDirection: 'column' }}>
          {/* Specs */}
          <div style={{ flexGrow: 1 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '32px', color: textColor }}>Specifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {specs.map((s, i) => (
                <div key={i}>
                  <p style={{ color: '#9ca3af', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '6px' }}>{s.label}</p>
                  <p style={{ fontWeight: 600, fontSize: '1.05rem', color: textColor, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buy section */}
          <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '20px', color: textColor }}>Buy Now</h2>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '10px' }}>{selectLabel}</label>
              <div style={{ position: 'relative' }}>
                <select style={{ width: '100%', background: '#f9fafb', border: '2px solid transparent', borderRadius: '1rem', padding: '14px 18px', fontSize: '14px', fontWeight: 600, outline: 'none', cursor: 'pointer', appearance: 'none', color: textColor }}>
                  {options.map((opt, i) => <option key={i}>{opt}</option>)}
                </select>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4, fontSize: '10px' }}>▼</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px' }}>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.04em', color: textColor, margin: 0 }}>{price}</p>
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', margin: 0 }}>{stockText}</p>
            </div>
            <button style={{ backgroundColor: '#1a1a1a', color: '#fff', width: '100%', padding: '16px', borderRadius: '1rem', fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>{btnText}</button>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── HomeHero Templates ───────────────────────────────────────────────────── */
const HH_FONT_URL = 'https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Inter:wght@400;500;700;800&display=swap'
const HH_OSWALD = "'Oswald', 'Impact', Arial Narrow, sans-serif"
const HH_SHAPE_COLORS = ['#ede9fe', '#ffedd5', '#dcfce7', '#dbeafe']

function HHNavbar({ element, onLinkClick }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'
  const [menuOpen, setMenuOpen] = useState(false)

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const accent = props.hhAccent || '#4F46E5'
  const coral = props.hhCoral || '#FF5A5F'
  const brand = props.hhBrand || 'HomeHero'
  const badge = props.hhBadge || 'HH'
  const ctaText = props.hhCtaText || 'Join the Beta'
  const links = props.links || [
    { text: 'Bills', href: '#bills' },
    { text: 'Repairs', href: '#repairs' },
    { text: 'Chores', href: '#chores' },
  ]

  const badgeEl = (
    <div style={{ backgroundColor: accent, color: '#fff', padding: '5px 7px', borderRadius: '4px', fontWeight: 700, fontSize: '13px', letterSpacing: '-0.05em' }}>{badge}</div>
  )

  return (
    <div style={{ position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`@import url('${HH_FONT_URL}');`}</style>
      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', minHeight: '480px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{badgeEl}<span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{brand}</span></div>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: textColor }}>✕</button>
          </div>
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {links.map((l, i) => (
              <a key={i} href={l.href || '#'} onClick={(e) => { setMenuOpen(false); handleLink(e, l.href, l.linkType) }}
                style={{ fontFamily: HH_OSWALD, fontSize: '2.2rem', textTransform: 'uppercase', letterSpacing: '-0.02em', textDecoration: 'none', color: textColor }}>
                {l.text}
              </a>
            ))}
          </div>
          <div style={{ marginTop: 'auto', padding: '28px', borderTop: '1px solid #f3f4f6' }}>
            <button style={{ width: '100%', backgroundColor: coral, color: '#fff', padding: '18px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>{ctaText}</button>
          </div>
        </div>
      )}
      <header style={{ backgroundColor: bg, borderBottom: '1px solid #f9fafb', padding: '24px' }}>
        <nav style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {badgeEl}
              <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{brand}</span>
            </div>
            {!isSmall && (
              <div style={{ display: 'flex', gap: '32px' }}>
                {links.map((l, i) => (
                  <a key={i} href={l.href || '#'} onClick={(e) => handleLink(e, l.href, l.linkType)} style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', textDecoration: 'none' }}>{l.text}</a>
                ))}
              </div>
            )}
          </div>
          {isSmall && (
            <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          )}
        </nav>
      </header>
    </div>
  )
}

function HHHero({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const accent = props.hhAccent || '#4F46E5'
  const coral = props.hhCoral || '#FF5A5F'
  const heading = props.hhHeading || 'MEET YOUR\nHOME MANAGER.'
  const subtitle = props.hhSubtitle || 'HomeHero is your home manager who takes care of all the household tasks and admin that you don\'t want to.'
  const emailPH = props.hhEmailPlaceholder || 'Enter your email'
  const ctaText = props.hhCtaText || 'Join the Beta'
  const portraits = [
    props.hhPortrait1 || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    props.hhPortrait2 || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    props.hhPortrait3 || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300',
    props.hhPortrait4 || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  ]
  const phoneUser = props.hhPhoneUser || 'Belinda'
  const phoneMsg = props.hhPhoneMessage || 'I am here to help you today. Let me know if you need a hand with anything by starting a chat below.'
  const phoneItems = props.hhPhoneItems || [
    { label: 'Bills due this week', count: '2', color: 'indigo' },
    { label: 'Repairs scheduled', count: '1', color: 'green' },
  ]

  // Absolute corner positions for desktop portraits
  const positions = [
    { top: '32px', left: '8%', width: '120px' },
    { top: '40%', left: '3%', width: '148px' },
    { top: '28%', right: '8%', width: '132px' },
    { bottom: '32px', right: '3%', width: '160px' },
  ]

  return (
    <section style={{ backgroundColor: bg, fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`@import url('${HH_FONT_URL}'); @keyframes hh-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: isSmall ? '48px 24px 32px' : '72px 24px 140px' }}>
        {/* Desktop floating portraits */}
        {!isSmall && portraits.map((img, i) => (
          <div key={i} style={{ position: 'absolute', ...positions[i], zIndex: 1, animation: `hh-float ${2.5 + i * 0.5}s ease-in-out infinite` }}>
            <div style={{
              position: 'absolute', width: '80%', height: '85%', backgroundColor: HH_SHAPE_COLORS[i], borderRadius: '4px', transform: 'rotate(-5deg)', zIndex: 0,
              top: i % 2 === 0 ? '-10px' : 'auto',
              bottom: i % 2 === 1 ? '-10px' : 'auto',
              left: i < 2 ? '-10px' : 'auto',
              right: i >= 2 ? '-10px' : 'auto',
            }} />
            <img src={img} alt="" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', display: 'block', position: 'relative', zIndex: 1, filter: i === 0 ? 'grayscale(1)' : 'none', transition: 'filter 0.5s' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'none'}
              onMouseLeave={e => { if (i === 0) e.currentTarget.style.filter = 'grayscale(1)' }}
            />
          </div>
        ))}

        {/* Central content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: HH_OSWALD, fontSize: isSmall ? '2.8rem' : '4rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 0.92, color: textColor, margin: '0 0 20px', whiteSpace: 'pre-line', textTransform: 'uppercase' }}>{heading}</h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.7, marginBottom: '36px', padding: '0 8px' }}>{subtitle}</p>
          {/* Email CTA */}
          <div style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', maxWidth: '420px', margin: '0 auto', gap: isSmall ? '8px' : 0, position: 'relative', zIndex: 30 }}>
            <input type="email" placeholder={emailPH} style={{ flex: 1, padding: '16px 20px', backgroundColor: '#f3f4f6', border: '1px solid transparent', borderRadius: isSmall ? '12px' : '12px 0 0 12px', outline: 'none', fontSize: '14px', color: '#1a1a1a' }} />
            <button style={{ padding: '16px 20px', backgroundColor: coral, color: '#fff', border: 'none', borderRadius: isSmall ? '12px' : '0 12px 12px 0', fontWeight: 700, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: `0 8px 20px ${coral}40` }}>{ctaText}</button>
          </div>
        </div>

        {/* Phone mockup */}
        <div style={{ marginTop: isSmall ? '48px' : '80px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 20 }}>
          <div style={{ width: '240px', border: '8px solid #111827', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.22)', backgroundColor: '#fff', position: 'relative', aspectRatio: '9/19' }}>
            <div style={{ height: '28px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '56px', height: '3px', backgroundColor: '#d1d5db', borderRadius: '9999px' }} />
            </div>
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: accent }}>{phoneUser[0]}</div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a' }}>Hi, {phoneUser}</span>
              </div>
              <div style={{ backgroundColor: '#eef2ff', padding: '10px', borderRadius: '14px', fontSize: '9px', lineHeight: 1.6, color: '#312e81' }}>{phoneMsg}</div>
              {phoneItems.map((item, i) => {
                const iBg = item.color === 'green' ? '#dcfce7' : '#e0e7ff'
                const iClr = item.color === 'green' ? '#166534' : accent
                return (
                  <div key={i} style={{ height: '36px', backgroundColor: '#f9fafb', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '0 10px', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '8px', color: '#9ca3af' }}>{item.label}</span>
                    <span style={{ fontSize: '8px', fontWeight: 700, backgroundColor: iBg, color: iClr, padding: '2px 7px', borderRadius: '9999px' }}>{item.count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile portrait scroll strip */}
      {isSmall && (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '8px 24px 56px', scrollbarWidth: 'none' }}>
          {portraits.map((img, i) => (
            <div key={i} style={{ flexShrink: 0, width: '110px', position: 'relative' }}>
              <div style={{ position: 'absolute', width: '36px', height: '36px', backgroundColor: HH_SHAPE_COLORS[i], borderRadius: '4px', transform: 'rotate(-5deg)', top: '-7px', left: '-7px', zIndex: 0 }} />
              <img src={img} alt="" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'block', position: 'relative', zIndex: 1, filter: i === 0 ? 'grayscale(1)' : 'none' }} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/* ── The Qi Templates ────────────────────────────────────────────────────── */
const QI_FONT_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400&display=swap'
const QI_SERIF = "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif"

function QiNavbar({ element, onLinkClick }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'
  const [menuOpen, setMenuOpen] = useState(false)

  const bg = styles?.backgroundColor || '#f7f7f5'
  const textColor = styles?.color || '#1a1a1a'
  const brand = props.qiBrand || 'The Qi'
  const links = props.links || [
    { text: 'Shop', href: '#shop' },
    { text: 'Learn', href: '#learn' },
    { text: 'Mission', href: '#mission' },
  ]
  const cartText = props.qiCartText || 'Cart'
  const cartCount = props.qiCartCount || '0'
  const accountText = props.qiAccountText || 'Account'

  const navLinkStyle = {
    fontSize: '11px', letterSpacing: '0.15em', fontWeight: 400,
    textTransform: 'uppercase', textDecoration: 'none', color: textColor,
    fontFamily: 'Inter, system-ui, sans-serif',
  }

  return (
    <div style={{ position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`@import url('${QI_FONT_URL}');`}</style>
      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          backgroundColor: bg, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '32px',
          minHeight: '420px',
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: textColor, lineHeight: 1 }}
          >✕</button>
          {links.map((l, i) => (
            <a key={i} href={l.href || '#'} onClick={(e) => { setMenuOpen(false); handleLink(e, l.href, l.linkType) }}
              style={{ fontFamily: QI_SERIF, fontSize: '3rem', fontStyle: 'italic', textDecoration: 'none', color: textColor }}>
              {l.text}
            </a>
          ))}
          <a href={props.qiAccountHref || '#'} onClick={(e) => { setMenuOpen(false); handleLink(e, props.qiAccountHref, props.qiAccountLinkType) }}
            style={{ fontFamily: QI_SERIF, fontSize: '3rem', fontStyle: 'italic', textDecoration: 'none', color: textColor }}>
            {accountText}
          </a>
        </div>
      )}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: bg, borderBottom: '1px solid #e5e7eb',
      }}>
        <nav style={{
          maxWidth: '1440px', margin: '0 auto', padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', width: '33%' }}>
            {isSmall ? (
              <button
                onClick={() => setMenuOpen(true)}
                style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <span style={{ display: 'block', height: '1.5px', width: '22px', background: textColor }} />
                <span style={{ display: 'block', height: '1.5px', width: '22px', background: textColor }} />
                <span style={{ display: 'block', height: '1.5px', width: '22px', background: textColor }} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '32px' }}>
                {links.map((l, i) => <a key={i} href={l.href || '#'} onClick={(e) => handleLink(e, l.href, l.linkType)} style={navLinkStyle}>{l.text}</a>)}
              </div>
            )}
          </div>
          {/* Center: logo */}
          <div style={{ width: '33%', textAlign: 'center' }}>
            <a href="/" style={{ fontFamily: QI_SERIF, fontSize: '1.5rem', fontWeight: 600, fontStyle: 'italic', textDecoration: 'none', color: textColor }}>{brand}</a>
          </div>
          {/* Right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: isSmall ? '16px' : '32px', width: '33%' }}>
            {!isSmall && <a href={props.qiAccountHref || '#'} onClick={(e) => handleLink(e, props.qiAccountHref, props.qiAccountLinkType)} style={navLinkStyle}>{accountText}</a>}
            <a href={props.qiCartHref || '#'} onClick={(e) => handleLink(e, props.qiCartHref, props.qiCartLinkType)} style={navLinkStyle}>
              {cartText} <span style={{ opacity: 0.5 }}>({cartCount})</span>
            </a>
          </div>
        </nav>
      </header>
    </div>
  )
}

function QiHero({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const bg = styles?.backgroundColor || '#f7f7f5'
  const textColor = styles?.color || '#1a1a1a'
  const topText = props.qiTopText || 'In Flowers'
  const bottomText = props.qiBottomText || 'We Trust'
  const heroImage = props.qiImage || 'https://images.unsplash.com/photo-1591871937573-748af0941cf2?q=80&w=800&auto=format&fit=crop'
  const desc = props.qiDesc || 'A ritual of sensory healing.\nWhole flower teas for deep connection and modern rituals.'

  // Use explicit sizes per viewport so canvas preview is accurate (vw refers to browser window, not canvas)
  const fontSize = isMobile ? '3.5rem' : isTablet ? '6.5rem' : '10rem'
  const imgWidth = isMobile ? '160px' : isTablet ? '240px' : '340px'
  const imgNegMargin = isMobile ? '-1.6rem' : isTablet ? '-3rem' : '-4.2rem'
  const bottomNegMargin = isMobile ? '-2.2rem' : isTablet ? '-4rem' : '-5.5rem'

  const headingStyle = {
    fontFamily: QI_SERIF, fontSize,
    fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.85,
    textTransform: 'uppercase', textAlign: 'center', color: textColor,
    margin: 0, pointerEvents: 'none', userSelect: 'none',
  }

  return (
    <section style={{ backgroundColor: bg, minHeight: isSmall ? 'auto' : '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isSmall ? '48px 16px' : '96px 16px', overflow: 'hidden' }}>
      <style>{`@import url('${QI_FONT_URL}'); @keyframes qi-fade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ ...headingStyle, position: 'relative', zIndex: 2 }}>{topText}</h2>
        <div style={{
          position: 'relative', zIndex: 1,
          width: imgWidth, aspectRatio: '3/4',
          marginTop: imgNegMargin,
          overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          animation: 'qi-fade 1.2s ease-out forwards',
        }}>
          <img src={heroImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.1)', transition: 'transform 2s ease' }} />
        </div>
        <h2 style={{ ...headingStyle, position: 'relative', zIndex: 2, marginTop: bottomNegMargin }}>{bottomText}</h2>
      </div>
      <div style={{ marginTop: isSmall ? '32px' : '48px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.25em', lineHeight: 1.8, maxWidth: '280px', textTransform: 'uppercase', opacity: 0.6, color: textColor, fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'pre-line' }}>{desc}</p>
      </div>
    </section>
  )
}

function QiProducts({ element }) {
  const { props, styles } = element
  const { viewportWidth, state, switchPage } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const handleLinkClick = (e, href, linkType) => {
    e.preventDefault()
    if (!href || href === '#') return
    if (linkType === 'section' || href.startsWith('#')) {
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (linkType === 'page' || href.endsWith('.html')) {
      const target = (state.pages || []).find((p) => {
        const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        return p.name === 'Home' ? (href === '/' || href === 'index.html') : `${slug}.html` === href
      })
      if (target) switchPage(target.id)
    } else {
      window.open(href, '_blank', 'noopener')
    }
  }

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1a1a1a'
  const heading = props.qiProdHeading || 'Selected Blossoms'
  const viewAll = props.qiProdViewAll || 'View All Shop'
  const viewAllHref = props.qiProdViewAllHref || '#'
  const products = props.qiProducts || [
    { image: 'https://images.unsplash.com/photo-1563201444-2495a32761ac?q=80&w=800&auto=format&fit=crop', name: 'Shangri-La Rose', subtitle: 'Grown in High Altitudes', price: '$28' },
    { image: 'https://images.unsplash.com/photo-1597485334015-81423873919e?q=80&w=800&auto=format&fit=crop', name: 'Royal Chrysanthemum', subtitle: 'Immunity & Clarity', price: '$32' },
    { image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop', name: 'Blue Lotus', subtitle: 'Lucid Dreaming', price: '$36' },
  ]

  const navLinkStyle = {
    fontSize: '11px', letterSpacing: '0.15em', fontWeight: 400,
    textTransform: 'uppercase', color: textColor,
    fontFamily: 'Inter, system-ui, sans-serif', textDecoration: 'none',
  }

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '48px 16px' : '96px 24px', borderTop: '1px solid #f3f4f6' }}>
      <style>{`@import url('${QI_FONT_URL}');`}</style>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', justifyContent: 'space-between', alignItems: isSmall ? 'flex-start' : 'flex-end', marginBottom: '64px', gap: '16px' }}>
          <h3 style={{ fontFamily: QI_SERIF, fontSize: isSmall ? '2.5rem' : '4.5rem', fontStyle: 'italic', fontWeight: 400, color: textColor, margin: 0 }}>{heading}</h3>
          <a
            href={viewAllHref}
            onClick={(e) => handleLinkClick(e, viewAllHref, props.qiProdViewAllLinkType)}
            style={{ ...navLinkStyle, borderBottom: `1px solid ${textColor}`, paddingBottom: '4px', cursor: 'pointer' }}
          >{viewAll}</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : 'repeat(3, 1fr)', gap: isSmall ? '40px' : '0 32px' }}>
          {products.map((p, i) => (
            <div key={i} style={{ cursor: 'pointer', transform: (!isSmall && i === 1) ? 'translateY(60px)' : 'none' }}>
              <div style={{ aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#f0f0ed', marginBottom: '24px' }}>
                <img
                  src={p.image} alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h4 style={{ fontFamily: QI_SERIF, fontSize: '1.5rem', fontWeight: 400, color: textColor, margin: '0 0 4px' }}>{p.name}</h4>
                  <p style={{ ...navLinkStyle, opacity: 0.5 }}>{p.subtitle}</p>
                </div>
                <p style={navLinkStyle}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Perks Section ────────────────────────────────────────────────────────── */
function PerksSection({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const heading = props.perksHeading || 'The perks'
  const image = props.perksImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070'
  const items = props.perksItems || [
    { badge: 'Premium', badgeDark: true, title: 'Plan your trip, all in one place', desc: 'Browse our map for unique stays. Effortlessly find attractions, things to do and places to eat or drink nearby.' },
    { badge: 'Free', badgeDark: false, title: 'Be part of a community', desc: 'Get peace of mind and discuss retreat options with a like-minded audience. Real people, real recommendations.' },
    { badge: 'Premium', badgeDark: true, title: 'Exclusive club deals', desc: "Club deals can't be found anywhere else. Our exclusive deals save members up to 25% on booking costs." },
    { badge: 'Free', badgeDark: false, title: 'View last minute offers', desc: 'Hear about late availability and cancellations so you can snap up dates before others.' },
  ]
  const bg = styles?.backgroundColor || '#f9fafb'
  const textColor = styles?.color || '#111827'

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '16px' : '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', position: 'relative' }}>
        {/* Decorative leaf */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', width: '80px', height: '80px', opacity: 0.08, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M10 90C10 90 20 40 90 10M90 10C90 10 40 20 10 90ZM90 10C70 30 60 60 60 60M10 90C30 70 60 60 60 60" stroke={textColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row' }}>
          {/* Left: image */}
          <div style={{ flex: 1, padding: isSmall ? '16px' : '28px' }}>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: isSmall ? '220px' : '100%', minHeight: isSmall ? '220px' : '440px' }}>
              <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>

          {/* Right: content */}
          <div style={{ flex: 1, padding: isSmall ? '20px 20px 28px' : '56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: isSmall ? '2rem' : '2.8rem', fontWeight: '700', color: textColor, margin: '0 0 2.5rem', lineHeight: 1.15 }}>{heading}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: isSmall ? '28px' : '40px 40px' }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{
                    display: 'inline-block', alignSelf: 'flex-start',
                    padding: '3px 12px', borderRadius: '9999px',
                    backgroundColor: item.badgeDark ? textColor : '#e5e7eb',
                    color: item.badgeDark ? '#ffffff' : '#374151',
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>{item.badge || 'Badge'}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: textColor, margin: 0, lineHeight: 1.4 }}>{item.title || 'Feature title'}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{item.desc || ''}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Sell Home Steps Section ──────────────────────────────────────────────── */
function SellHomeSection({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const bg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#0f172a'
  const accent = props.shAccent || '#2563eb'
  const btnBg = props.shBtnBg || '#0f172a'
  const btnColor = props.shBtnColor || '#ffffff'
  const heading = props.shHeading || 'Sell your home.'
  const highlight = props.shHighlight || 'Skip the hard parts.'
  const desc = props.shDesc || "We've redesigned the home selling process to be faster, simpler, and entirely on your terms."
  const btnText = props.shBtnText || 'Get Started Today'
  const btnHref = props.shBtnHref || '#'

  const steps = [
    { label: props.shStep1Label || 'Step 1', title: props.shStep1Title || 'Get an offer in minutes', desc: props.shStep1Desc || 'Answer a few questions and receive a preliminary cash offer in just minutes.', image: props.shStep1Image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800', align: 'right' },
    { label: props.shStep2Label || 'Step 2', title: props.shStep2Title || 'Do a video walkthrough', desc: props.shStep2Desc || 'Show us your home through your smartphone so we can verify details and finalize.', image: props.shStep2Image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800', align: 'left' },
    { label: props.shStep3Label || 'Step 3', title: props.shStep3Title || 'Close and move, stress-free', desc: props.shStep3Desc || 'Choose your closing date. Get paid within days and move when you\'re ready.', image: props.shStep3Image || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800', align: 'right' },
  ]

  return (
    <section style={{ backgroundColor: bg, fontFamily: 'Inter, system-ui, -apple-system, sans-serif', padding: isSmall ? '64px 24px' : '96px 48px 80px' }}>
      <style>{`
        .sh-img { transition: transform 0.7s ease; }
        .sh-card:hover .sh-img { transform: scale(1.05); }
        .sh-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '5fr 7fr', gap: isSmall ? '48px' : '80px', alignItems: 'center' }}>

        {/* Left: sticky heading */}
        <div>
          <h2 style={{ fontSize: isSmall ? '2.25rem' : 'clamp(2.5rem,5vw,3.75rem)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: 1.1, color: textColor, margin: '0 0 24px' }}>
            {heading}<br />
            <span style={{ color: accent }}>{highlight}</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '380px', lineHeight: '1.75', margin: '0 0 32px' }}>{desc}</p>
          <a href={btnHref} className="sh-btn" style={{ display: 'inline-block', backgroundColor: btnBg, color: btnColor, padding: '16px 40px', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', cursor: 'pointer' }}>
            {btnText}
          </a>
        </div>

        {/* Right: staggered steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isSmall ? '40px' : '20px' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : 'repeat(12, 1fr)', gap: '20px' }}>
              <div className="sh-card" style={{ gridColumn: isSmall ? '1' : step.align === 'right' ? '4 / 13' : '1 / 10', display: 'flex', flexDirection: isSmall ? 'column' : 'row', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: isSmall ? '100%' : '60%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.09)', border: '1px solid #f1f5f9', flexShrink: 0 }}>
                  <img src={step.image} alt={step.title} className="sh-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ width: isSmall ? '100%' : '40%' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, marginBottom: '8px', display: 'block' }}>{step.label}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: textColor, margin: '0 0 8px', lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.7', margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── Moco Dark Navbar ─────────────────────────────────────────────────────── */
function MocoNavbar({ props, styles, activeHref, onLinkClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const logo = props.mocoLogo || 'Moco'
  const accent = props.mocoAccent || '#f97316'
  const bg = styles?.backgroundColor || '#0d0d1a'
  const textColor = styles?.color || '#ffffff'
  const loginText = props.mocoLoginText || 'Login'
  const loginHref = props.mocoLoginHref || '#'
  const links = props.links || [
    { text: 'Home', href: '#' }, { text: 'Collection', href: '#' },
    { text: 'Category', href: '#' }, { text: 'Pricing', href: '#' },
  ]

  return (
    <div style={{ position: 'relative', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .mn-link { transition:color 0.2s; font-size:0.875rem; font-weight:500; text-decoration:none; color:rgba(255,255,255,0.5); }
        .mn-link:hover { color:#fff; }
        .mn-link-active { color:#fff !important; border-bottom:2px solid #fff; padding-bottom:4px; }
        .mn-login { transition:color 0.2s; background:none; border:none; cursor:pointer; font-size:0.875rem; font-weight:500; color:rgba(255,255,255,0.5); text-decoration:none; padding:0; }
        .mn-login:hover { color:${accent}; }
        .mn-ham { background:none; border:none; cursor:pointer; color:${textColor}; padding:4px; line-height:0; display:flex; align-items:center; }
        .mn-mobile-menu { position:absolute; top:100%; left:0; right:0; z-index:100; background-color:${bg}; display:flex; flex-direction:column; align-items:center; padding:40px 24px 48px; gap:28px; border-top:1px solid rgba(255,255,255,0.08); box-shadow:0 20px 40px rgba(0,0,0,0.5); }
        .mn-mobile-link { font-size:1.25rem; font-weight:500; color:${textColor}; text-decoration:none; transition:color 0.2s; }
        .mn-mobile-link:hover { color:${accent}; }
        .mn-mobile-btn { background-color:${accent}; color:#fff; border:none; border-radius:999px; padding:12px 32px; font-size:1rem; font-weight:600; cursor:pointer; margin-top:8px; }
      `}</style>

      {/* Nav bar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isSmall ? '20px 24px' : '24px 48px', backgroundColor: bg, position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.04em', color: textColor, userSelect: 'none' }}>
          {logo}<span style={{ color: accent }}>.</span>
        </div>

        {!isSmall && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {links.map((link, i) => {
              const isActive = link.href === activeHref || (!activeHref && i === 0)
              return (
                <a key={i} href={link.href}
                  onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                  className={`mn-link${isActive ? ' mn-link-active' : ''}`}>
                  {link.text}
                </a>
              )
            })}
          </div>
        )}

        {!isSmall
          ? <a href={loginHref} className="mn-login">{loginText}</a>
          : <button className="mn-ham" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen
              ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            }
          </button>
        }
      </nav>

      {/* Mobile dropdown — position:absolute stays inside canvas, not over builder UI */}
      {menuOpen && isSmall && (
        <div className="mn-mobile-menu">
          {links.map((link, i) => (
            <a key={i} href={link.href} className="mn-mobile-link"
              onClick={() => { setMenuOpen(false); if (onLinkClick) onLinkClick(link) }}>
              {link.text}
            </a>
          ))}
          <button className="mn-mobile-btn" onClick={() => setMenuOpen(false)}>{loginText}</button>
        </div>
      )}
    </div>
  )
}

/* ── Moco Dark Hero ───────────────────────────────────────────────────────── */
function MocoHero({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const accent = props.mocoAccent || '#f97316'
  const bg = styles?.backgroundColor || '#0d0d1a'
  const textColor = styles?.color || '#ffffff'
  const heading = props.mocoHeading || 'Collect your best articles'
  const highlight = props.mocoHighlight || 'easily'
  const desc = props.mocoDesc || 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.'
  const placeholder = props.mocoSearchPlaceholder || 'Search'
  const c1Title = props.mocoCard1Title || 'Business Mindset Planning'
  const c1Quote = props.mocoCard1Quote || '"Your vision sets the tone for your future success..."'
  const c2Title = props.mocoCard2Title || 'Key Success Of Career'
  const c2Image = props.mocoCard2Image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  const c3Title = props.mocoCard3Title || 'Management'
  const c3Image = props.mocoCard3Image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
  const c3Author = props.mocoCard3Author || 'Courtney Henry'
  const c4Title = props.mocoCard4Title || 'Masterplan Strategy'
  const cardH = isMobile ? '170px' : isTablet ? '205px' : '245px'

  return (
    <section style={{ backgroundColor: bg, color: textColor, padding: isSmall ? '20px 20px 60px' : '20px 48px 80px', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .mh-blob-1{position:absolute;top:-10%;left:-10%;width:50%;height:50%;background:${accent}30;filter:blur(120px);border-radius:50%;pointer-events:none;z-index:0;}
        .mh-blob-2{position:absolute;bottom:-10%;right:-10%;width:50%;height:50%;background:rgba(30,64,175,0.18);filter:blur(120px);border-radius:50%;pointer-events:none;z-index:0;}
        .mh-card{transition:transform 0.3s ease;border-radius:16px;overflow:hidden;}
        .mh-card:hover{transform:translateY(-8px);}
        .mh-search{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:999px;padding:14px 20px 14px 48px;color:#fff;font-size:0.95rem;outline:none;transition:all 0.2s;box-sizing:border-box;}
        .mh-search:focus{background:rgba(255,255,255,0.1);border-color:${accent}80;box-shadow:0 0 0 3px ${accent}30;}
        .mh-search::placeholder{color:#6b7280;}
        .mh-dots{position:absolute;top:70px;left:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;opacity:0.2;pointer-events:none;z-index:0;}
        .mh-dot{width:4px;height:4px;background:#fff;border-radius:50%;}
      `}</style>

      <div className="mh-blob-1" /><div className="mh-blob-2" />
      <div className="mh-dots">{[...Array(16)].map((_, i) => <div key={i} className="mh-dot" />)}</div>

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: isSmall ? '48px' : '64px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Left: 2×2 card grid */}
        <div style={{ order: isSmall ? 2 : 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '10px' : '14px' }}>

          {/* Card 1 — cream */}
          <div className="mh-card" style={{ backgroundColor: '#fdf6e9', padding: isMobile ? '16px 12px' : '22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: cardH }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M12 2v20M2 12h20" /></svg>
              </div>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(254,215,170,0.4)', flexShrink: 0 }} />
            </div>
            <div>
              <h3 style={{ color: '#2d2d2d', fontSize: isMobile ? '0.78rem' : '0.92rem', fontWeight: '700', lineHeight: '1.3', margin: '0 0 4px' }}>{c1Title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.65rem', fontStyle: 'italic', lineHeight: '1.5', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c1Quote}</p>
            </div>
          </div>

          {/* Card 2 — image + purple overlay */}
          <div className="mh-card" style={{ position: 'relative', height: cardH }}>
            <img src={c2Image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(76,29,149,0.9) 0%, rgba(59,130,246,0.35) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: isMobile ? '12px' : '18px' }}>
              <h3 style={{ color: '#fff', fontSize: isMobile ? '0.78rem' : '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{c2Title}</h3>
            </div>
          </div>

          {/* Card 3 — light blue */}
          <div className="mh-card" style={{ backgroundColor: '#e0f2fe', padding: isMobile ? '12px' : '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: cardH }}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', flex: 1, marginBottom: '10px', minHeight: 0 }}>
              <img src={c3Image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            </div>
            <div>
              <h3 style={{ color: '#0c4a6e', fontSize: isMobile ? '0.78rem' : '0.92rem', fontWeight: '700', margin: '0 0 5px' }}>{c3Title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#cbd5e1', flexShrink: 0 }} />
                <span style={{ fontSize: '0.62rem', color: '#164e63' }}>{c3Author}</span>
              </div>
            </div>
          </div>

          {/* Card 4 — orange */}
          <div className="mh-card" style={{ backgroundColor: accent, padding: isMobile ? '16px 12px' : '22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: cardH, boxShadow: `0 20px 40px ${accent}33` }}>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '67%', height: '100%', backgroundColor: '#fff' }} />
            </div>
            <h3 style={{ color: '#fff', fontSize: isMobile ? '0.78rem' : '0.92rem', fontWeight: '700', lineHeight: '1.3', margin: 0 }}>{c4Title}</h3>
          </div>

        </div>

        {/* Right: hero text */}
        <div style={{ order: isSmall ? 1 : 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '2.2rem' : isTablet ? '2.8rem' : 'clamp(2.8rem,4.2vw,4rem)', fontWeight: '700', lineHeight: '1.15', letterSpacing: '-0.03em', margin: '0 0 20px', color: textColor }}>
              {heading}{' '}
              <span style={{ color: accent, position: 'relative', display: 'inline-block' }}>
                {highlight}
                <svg style={{ position: 'absolute', bottom: '-14px', left: 0, width: '100%', height: '18px' }} viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path d="M0,20 Q50,0 100,20 T200,20" fill="none" stroke={accent} strokeWidth="4" strokeOpacity="0.6" />
                </svg>
              </span>
            </h1>
            <p style={{ color: '#9ca3af', fontSize: isMobile ? '0.92rem' : '1.05rem', lineHeight: '1.75', margin: '28px 0 0', maxWidth: '480px' }}>{desc}</p>
          </div>
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', lineHeight: 0, pointerEvents: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </span>
            <input type="text" className="mh-search" placeholder={placeholder} />
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── Food Delivery Navbar ──────────────────────────────────────────────────── */
function FoodNavbar({ props, styles, activeHref, onLinkClick }) {
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const brand = props.foodBrand || props.brand || 'Ideatefood';
  const logoUrl = props.foodLogoUrl;
  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const loginText = props.foodLoginText || 'Log In'
  const loginHref = props.foodLoginHref || '#'
  const loginBg = props.foodLoginBg || '#ffffff'
  const loginColor = props.foodLoginColor || dark
  const signupText = props.foodSignupText || 'Sign Up'
  const signupHref = props.foodSignupHref || '#'
  const signupBg = props.foodSignupBg || dark
  const signupColor = props.foodSignupColor || '#ffffff'
  const links = props.links || [
    { text: 'Home', href: '#' }, { text: 'Food list', href: '#' },
    { text: 'Blog', href: '#' }, { text: 'Contact', href: '#' },
  ]

  return (
    <nav style={{ backgroundColor: bg, padding: isSmall ? '16px 20px' : '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <style>{`
        .fn-logo-box { transition: transform 0.2s ease; }
        .fn-logo-box:hover { transform: rotate(12deg); }
        .fn-link { transition: color 0.2s; font-weight: 700; font-size: 0.9rem; text-decoration: none; color: #6b7280; }
        .fn-link:hover, .fn-link-active { color: ${accent}; }
        .fn-link-active { border-bottom: 2px solid ${accent}; padding-bottom: 2px; }
        .fn-btn { transition: all 0.15s ease; cursor: pointer; text-decoration: none; }
        .fn-btn:hover { transform: translate(-3px,-3px); }
        .fn-btn:active { transform: translate(2px,2px); box-shadow: 0 0 0 0 transparent !important; }
        .fn-btn-login:hover { background-color: ${accent}20 !important; }
      `}</style>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        {logoUrl ? (
          <img src={logoUrl} alt={brand} style={{ height: '42px', maxHeight: '42px', maxWidth: '140px', width: 'auto', objectFit: 'contain', display: 'block' }} />
        ) : (
          <>
            <div className="fn-logo-box" style={{ width: '42px', height: '42px', backgroundColor: accent, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${dark}`, flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                <line x1="6" y1="17" x2="18" y2="17" />
              </svg>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.04em', color: dark }}>{brand}</span>
          </>
        )}
      </div>

      {/* Desktop links */}
      {!isSmall && (
        <div style={{ display: 'flex', gap: '32px' }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            return (
              <a key={i} href={link.href}
                onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                className={`fn-link${isActive || i === 0 ? ' fn-link-active' : ''}`}>
                {link.text}
              </a>
            )
          })}
        </div>
      )}

      {/* Buttons — always visible, full text on all sizes */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <a href={loginHref} className="fn-btn fn-btn-login"
          onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick({ href: loginHref, linkType: props.foodLoginLinkType || 'url' }, e) }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: isMobile ? '8px 14px' : '9px 20px', backgroundColor: loginBg, border: `2px solid ${dark}`, borderRadius: '10px', fontSize: isMobile ? '0.78rem' : '0.85rem', fontWeight: '700', boxShadow: `3px 3px 0 ${dark}`, color: loginColor, whiteSpace: 'nowrap', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          {loginText}
        </a>
        <a href={signupHref} className="fn-btn fn-btn-signup"
          onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick({ href: signupHref, linkType: props.foodSignupLinkType || 'url' }, e) }}
          style={{ display: 'inline-flex', alignItems: 'center', padding: isMobile ? '8px 14px' : '10px 22px', backgroundColor: signupBg, color: signupColor, border: `2px solid ${dark}`, borderRadius: '10px', fontSize: isMobile ? '0.78rem' : '0.85rem', fontWeight: '900', boxShadow: `4px 4px 0 ${accent}`, whiteSpace: 'nowrap' }}>
          {signupText}
        </a>
      </div>
    </nav>
  )
}

/* ── Food Delivery Hero ────────────────────────────────────────────────────── */
function FoodHero({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const heroTitle = props.foodHeroTitle || 'Welcome to'
  const heroBrand = props.foodHeroBrand || 'Ideatefood'
  const subheading = props.foodHeroSubheading || "Hungry? We've got you covered."
  const desc = props.foodHeroDesc || 'Fresh, chef-quality meals delivered straight to your door from the best local kitchens.'
  const ctaText = props.foodHeroCtaText || 'Start Ordering'
  const ctaHref = props.foodHeroCtaHref || '#'
  const trustText = props.foodHeroTrustText || 'Trusted by 10,000+ foodies'
  const image = props.foodHeroImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  const badgeText = props.foodHeroBadgeText || '50% OFF'
  const badgeSub = props.foodHeroBadgeSub || 'First Order'

  const titleSize = isMobile ? '3.2rem' : isTablet ? '5rem' : '7.5rem'

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '24px 20px 48px' : '24px 48px 64px', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <style>{`
        .fh-brand { position: relative; display: inline-block; font-style: italic; padding: 0 0.25em; color: #fff; z-index: 1; }
        .fh-brand::after { content: ''; position: absolute; left: 0; bottom: 10%; width: 100%; height: 58%; background: ${accent}; z-index: -1; transform: rotate(-1.5deg) skewX(-5deg); border-radius: 4px; }
        .fh-cta { transition: all 0.15s ease; }
        .fh-cta:hover { transform: translate(-4px,-4px); box-shadow: 12px 12px 0px 0px ${dark} !important; }
        .fh-cta:active { transform: translate(2px,2px); }
        .fh-img-card { transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
        .fh-img-card:hover { transform: translate(-4px,-4px) rotate(1deg); box-shadow: 20px 20px 0px 0px ${dark} !important; }
        .fh-badge { transition: transform 0.2s ease; }
        .fh-badge:hover { transform: rotate(12deg) scale(1.1); }
      `}</style>

      {/* Big title */}
      <div style={{ textAlign: 'center', marginBottom: isSmall ? '36px' : '56px' }}>
        <h1 style={{ fontSize: titleSize, fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '0.88', margin: 0, color: dark }}>
          {heroTitle}
          <br />
          <span className="fh-brand" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{heroBrand}</span>
        </h1>
      </div>

      {/* Two-column */}
      <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: isSmall ? '40px' : '60px', alignItems: 'center', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Left: text */}
        <div style={{ order: isSmall ? 2 : 1, textAlign: isSmall ? 'center' : 'left' }}>
          <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: isMobile ? '1.75rem' : isTablet ? '2.2rem' : '2.6rem', color: accent, lineHeight: '1.25', margin: '0 0 16px', fontWeight: '700' }}>
            {subheading}
          </h2>
          <p style={{ color: '#6b7280', fontSize: isMobile ? '0.92rem' : '1rem', fontWeight: '500', lineHeight: '1.65', margin: '0 0 28px', maxWidth: '420px', marginLeft: isSmall ? 'auto' : 0, marginRight: isSmall ? 'auto' : 0 }}>
            {desc}
          </p>
          {/* CTA button */}
          <div style={{ display: 'flex', justifyContent: isSmall ? 'center' : 'flex-start', marginBottom: '24px' }}>
            <a href={ctaHref} className="fh-cta"
              onClick={(e) => handleLink(e, ctaHref, props.foodHeroCtaLinkType)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', padding: '14px 26px', backgroundColor: '#ffffff', border: `4px solid ${dark}`, borderRadius: '16px', textDecoration: 'none', boxShadow: `8px 8px 0px 0px ${dark}` }}>
              <span style={{ fontWeight: '900', fontSize: '1.05rem', color: dark }}>{ctaText}</span>
              <div style={{ width: '36px', height: '36px', backgroundColor: accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${dark}`, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
              </div>
            </a>
          </div>
          {/* Trust avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: isSmall ? 'center' : 'flex-start' }}>
            <div style={{ display: 'flex' }}>
              {[4, 5, 6].map(n => (
                <img key={n} src={`https://i.pravatar.cc/100?u=${n}`} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', border: `2px solid ${dark}`, marginLeft: n === 4 ? 0 : '-10px', objectFit: 'cover' }} />
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', fontWeight: '700', color: '#9ca3af', margin: 0 }}>{trustText}</p>
          </div>
        </div>

        {/* Right: image */}
        <div style={{ order: isSmall ? 1 : 2, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px', paddingBottom: '12px' }}>
          <div style={{ position: 'absolute', width: '85%', height: '85%', background: '#f3d0bb', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="fh-img-card" style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '32px', border: `4px solid ${dark}`, boxShadow: `12px 12px 0px 0px ${dark}` }}>
              <img src={image} alt="Food" style={{ width: '100%', maxWidth: isMobile ? '240px' : '340px', height: 'auto', borderRadius: '24px', display: 'block' }} />
            </div>
            {/* Badge */}
            <div className="fh-badge" style={{ position: 'absolute', top: '-16px', right: isMobile ? '-8px' : '-20px', backgroundColor: accent, color: '#ffffff', padding: isMobile ? '10px 12px' : '14px 18px', borderRadius: '14px', transform: 'rotate(12deg)', border: `4px solid ${dark}`, boxShadow: `6px 6px 0px 0px ${dark}`, zIndex: 20 }}>
              <p style={{ fontWeight: '900', fontSize: isMobile ? '1rem' : '1.5rem', lineHeight: '1', margin: 0 }}>{badgeText}</p>
              <p style={{ fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase', margin: '3px 0 0' }}>{badgeSub}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── Trusted Brands Section ────────────────────────────────────────────────── */
function TrustedBrands({ element }) {
  const props = element.props || {}
  const styles = element.styles || {}
  const bg = styles.backgroundColor || '#0a0a0a'
  const color = styles.color || '#ffffff'
  const accent = props.tbAccentColor || '#fbbf24'
  const badge = props.tbBadgeText || 'Our Clients'
  const heading = props.tbHeading || 'Trusted By Global Brands'
  const desc = props.tbDescription || 'We deliver tailored marketing solutions designed to scale your brand and drive measurable results.'
  const btnText = props.tbButtonText || 'View all'
  const icon1 = props.tbIcon1 || 'fa-brands fa-golang'
  const icon2 = props.tbIcon2 || 'fa-brands fa-slack'
  const icon3 = props.tbIcon3 || 'fa-brands fa-facebook-f'
  const icon4 = props.tbIcon4 || 'fa-brands fa-vuejs'

  return (
    <section className="tb-section" style={{ backgroundColor: bg, color }}>
      <style>{`
        @keyframes tbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        @keyframes tbPulse { 0%,100%{box-shadow:0 0 30px rgba(251,191,36,0.2)} 50%{box-shadow:0 0 60px rgba(251,191,36,0.4)} }
        .tb-section { position:relative; min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 16px 128px; max-width:1280px; margin:0 auto; text-align:center; font-family:'Inter',system-ui,sans-serif; overflow:hidden; }
        .tb-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:100%; max-width:900px; aspect-ratio:1; background:rgba(37,99,235,0.05); filter:blur(120px); border-radius:50%; pointer-events:none; }
        .tb-badge-wrap { display:inline-flex; align-items:center; padding:6px 16px; margin-bottom:32px; border-radius:9999px; border:1px solid #222; background:rgba(17,17,17,0.5); backdrop-filter:blur(8px); z-index:10; }
        .tb-badge-wrap span { font-size:10px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#9ca3af; }
        .tb-heading { font-size:clamp(2.5rem,5vw,4.5rem); font-weight:700; letter-spacing:-0.02em; margin:0 0 24px; background:linear-gradient(to bottom,#ffffff,#6b7280); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; z-index:10; line-height:1.1; }
        .tb-desc { max-width:640px; color:#9ca3af; font-size:1.125rem; line-height:1.6; margin:0 0 64px; z-index:10; }
        .tb-map { position:relative; width:100%; max-width:900px; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; }
        .tb-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; opacity:0.2; }
        .tb-center { position:relative; z-index:30; width:120px; height:120px; border-radius:50%; background:linear-gradient(135deg,#1f1f1f,#000); border:1px solid #333; display:flex; align-items:center; justify-content:center; box-shadow:0 25px 50px rgba(0,0,0,0.5); flex-shrink:0; }
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
        .tb-btn { display:inline-flex; align-items:center; gap:12px; padding:16px 40px; background:#2563eb; color:#fff; border-radius:9999px; font-weight:700; font-size:1.1rem; text-decoration:none; cursor:pointer; box-shadow:0 10px 40px rgba(37,99,235,0.3); transition:all 0.3s; }
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
          .tb-badge-wrap { margin-bottom:20px; padding:5px 12px; }
        }
      `}</style>

      {/* Background Glow */}
      <div className="tb-glow" />

      {/* Badge */}
      <div className="tb-badge-wrap">
        <span>{badge}</span>
      </div>

      {/* Heading */}
      <h1 className="tb-heading">{heading}</h1>

      {/* Description */}
      <p className="tb-desc">{desc}</p>

      {/* Interactive Node Map */}
      <div className="tb-map">
        {/* SVG Connection Lines */}
        <svg className="tb-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
          <path d="M 200 225 L 600 225" stroke="gray" strokeWidth="1" fill="none" />
          <path d="M 400 100 L 400 350" stroke="gray" strokeWidth="1" fill="none" />
          <path d="M 150 150 L 250 150 M 150 150 L 150 300" stroke="gray" strokeWidth="1" fill="none" />
          <path d="M 650 150 L 550 150 M 650 150 L 650 300" stroke="gray" strokeWidth="1" fill="none" />
          <circle r="2" fill={accent}>
            <animateMotion dur="4s" repeatCount="indefinite" path="M 200 225 L 400 225" />
          </circle>
          <circle r="2" fill={accent}>
            <animateMotion dur="5s" repeatCount="indefinite" path="M 600 225 L 400 225" />
          </circle>
        </svg>

        {/* Central Node */}
        <div className="tb-center">
          <div className="tb-center-ring" style={{ borderColor: `${accent}33` }} />
          <div className="tb-center-core" style={{ backgroundColor: accent }}>
            <i className="fa-solid fa-cube" />
          </div>
        </div>

        {/* Inner Brand Nodes */}
        <div className="tb-node tb-n1 tb-float" style={{ animationDelay: '0s' }}>
          <div className="tb-node-inner">
            <i className={icon1} style={{ color: '#60a5fa' }} />
          </div>
        </div>

        <div className="tb-node tb-n2 tb-float" style={{ animationDelay: '1s' }}>
          <div className="tb-node-inner">
            <i className={icon2} style={{ color: '#c084fc' }} />
          </div>
        </div>

        <div className="tb-node tb-n3 tb-float" style={{ animationDelay: '2s' }}>
          <div className="tb-node-inner">
            <i className={icon3} style={{ color: '#2563eb' }} />
          </div>
        </div>

        <div className="tb-node tb-n4 tb-float" style={{ animationDelay: '3s' }}>
          <div className="tb-node-inner">
            <i className={icon4} style={{ color: '#34d399' }} />
          </div>
        </div>

        {/* Outer Nodes */}
        <div className="tb-node tb-n5 tb-float" style={{ animationDelay: '0.5s' }}>
          <div className="tb-node-inner tb-node-lg">
            <i className="fa-solid fa-earth-americas" style={{ color: '#ef4444' }} />
          </div>
        </div>

        <div className="tb-node tb-n6 tb-float" style={{ animationDelay: '1.5s' }}>
          <div className="tb-node-inner tb-node-lg">
            <i className="fa-solid fa-microchip" style={{ color: '#22c55e' }} />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="tb-cta">
        <a href={props.tbButtonHref || '#'} onClick={(e) => e.preventDefault()} className="tb-btn">
          {btnText}
          <i className="fa-solid fa-arrow-right-long" />
        </a>
      </div>
    </section>
  )
}

function WinzyNavbar({ props, styles, activeHref, onLinkClick }) {
  const brand = props.wzBrand || 'Winzy'
  const links = props.links || []
  const btnText = props.wzBtnText || 'Get Started'
  const bg = styles?.backgroundColor || '#0a0a0a'
  const color = styles?.color || '#ffffff'
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="wz-nav-wrap" style={{ backgroundColor: bg, color }}>
      <style>{`
        .wz-nav-wrap { position: relative; z-index: 50; font-family: 'Inter', sans-serif; }
        .wz-nav-bar { padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .wz-brand { display: flex; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0; }
        .wz-brand-icon { width: 32px; height: 32px; background: #ef4444; border-radius: 8px; display: flex; align-items: center; justify-content: center; transform: rotate(12deg); flex-shrink: 0; }
        .wz-brand-text { font-size: 24px; font-weight: 700; letter-spacing: -0.05em; margin: 0; line-height: 1; white-space: nowrap; }
        .wz-links { display: flex; align-items: center; gap: 32px; font-size: 14px; font-weight: 500; color: #d1d5db; }
        .wz-nav-item { cursor: pointer; text-decoration: none; color: inherit; transition: color 0.2s; white-space: nowrap; }
        .wz-nav-item:hover { color: #ffffff; }
        .wz-btn { background: #ef4444; color: #fff; border: none; padding: 10px 24px; border-radius: 9999px; font-weight: 600; cursor: pointer; transition: transform 0.2s, background 0.2s; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2); flex-shrink: 0; white-space: nowrap; }
        .wz-btn:hover { background: #dc2626; transform: scale(0.95); }
        .wz-ham { background: none; border: none; cursor: pointer; color: inherit; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .wz-mobile-menu { position: absolute; top: 100%; left: 0; right: 0; background: ${bg}; border-top: 1px solid rgba(255,255,255,0.1); padding: 16px 0; display: flex; flex-direction: column; gap: 0; z-index: 100; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .wz-mobile-link { display: block; padding: 14px 24px; font-size: 16px; font-weight: 500; color: #d1d5db; text-decoration: none; transition: all 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; }
        .wz-mobile-link:hover { color: #fff; background: rgba(255,255,255,0.05); padding-left: 32px; }
        .wz-mobile-btn { margin: 16px 24px 8px; background: #ef4444; color: #fff; border: none; padding: 12px 24px; border-radius: 9999px; font-weight: 600; cursor: pointer; font-size: 15px; text-align: center; }
      `}</style>
      <div className="wz-nav-bar">
        <div className="wz-brand">
          <div className="wz-brand-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
          </div>
          <span className="wz-brand-text">{brand}</span>
        </div>
        {!isSmall && (
          <nav className="wz-links">
            {links.map((link, i) => (
              <a key={i} href={link.href} className="wz-nav-item" onClick={(e) => onLinkClick && onLinkClick(link, e)}>{link.text}</a>
            ))}
          </nav>
        )}
        {!isSmall ? (
          <button className="wz-btn">{btnText}</button>
        ) : (
          <button className="wz-ham" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        )}
      </div>
      {isSmall && menuOpen && (
        <div className="wz-mobile-menu">
          {links.map((link, i) => (
            <a key={i} href={link.href} className="wz-mobile-link" onClick={(e) => { setMenuOpen(false); onLinkClick && onLinkClick(link, e) }}>{link.text}</a>
          ))}
          <button className="wz-mobile-btn">{btnText}</button>
        </div>
      )}
    </header>
  )
}

function WinzyHero({ element }) {
  const props = element.props || {}
  const styles = element.styles || {}
  const bgImg = props.wzBgImg || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000'
  const h1 = props.wzHeadline || 'Explore New Horizons with Every Journey'
  const desc = props.wzDesc || 'Discover unique cultures, stunning landscapes, and unforgettable moments every step of the way.'
  const btn = props.wzBtnText || 'Get started'
  const cImg = props.wzCardImg || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'
  const cStep = props.wzCardStep || '01/10'
  const cTag = props.wzCardTag || 'Tour'
  const cDesc = props.wzCardDesc || 'Explore Brazil with local flavors and guided adventures'
  const uCount = props.wzUsersCount || '10K+ users'
  const textRot = props.wzRotateText || 'Explore more • Explore more • Explore more • '
  const bg = styles?.backgroundColor || '#0a0a0a'
  const color = styles?.color || '#ffffff'

  return (
    <section className="wz-hero" style={{ backgroundColor: bg, color }}>
      <style>{`
        .wz-hero { position: relative; min-height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; justify-content: space-between; padding-top: 120px; padding-bottom: 80px; }
        .wz-bg { position: absolute; inset: 0; z-index: 0; }
        .wz-bg img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; filter: brightness(0.75); transform: scale(1.05); }
        .wz-bg-grad { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent, rgba(0,0,0,0.8)); }
        
        .wz-container { position: relative; z-index: 10; padding: 0 24px; max-width: 1400px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; flex: 1; justify-content: center; }
        @media (min-width: 768px) { .wz-container { padding: 0 48px; } }
        
        .wz-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; margin-bottom: 48px; }
        @media (min-width: 1024px) { .wz-grid { grid-template-columns: 7fr 5fr; } }
        
        .wz-left { display: flex; flex-direction: column; gap: 32px; }
        .wz-h1 { font-size: clamp(3rem, 5vw, 4.5rem); font-weight: 700; line-height: 1.1; max-width: 600px; margin: 0; }
        .wz-desc { font-size: 1.125rem; color: #d1d5db; max-width: 450px; line-height: 1.6; margin: 0; }
        .wz-left-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 16px 32px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: all 0.3s; backdrop-filter: blur(8px); width: max-content; }
        .wz-left-btn:hover { background: rgba(255,255,255,0.2); }
        .wz-btn-icon { background: rgba(255,255,255,0.1); padding: 6px; border-radius: 50%; display: flex; transition: all 0.3s; }
        .wz-left-btn:hover .wz-btn-icon { background: #fff; color: #000; }
        
        .wz-right { display: flex; justify-content: center; }
        @media (min-width: 1024px) { .wz-right { justify-content: flex-end; } }
        
        .wz-card { width: 100%; max-width: 380px; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .wz-card-img-wrap { position: relative; aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; margin-bottom: 24px; }
        .wz-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s; }
        .wz-card:hover .wz-card-img { transform: scale(1.1); }
        .wz-card-img-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.4), transparent); }
        
        .wz-card-progress { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 0 8px; }
        .wz-card-step { font-size: 0.875rem; font-weight: 500; color: #9ca3af; }
        .wz-bars { display: flex; gap: 6px; height: 4px; flex: 1; margin: 0 16px; }
        .wz-bar { height: 100%; width: 33.33%; border-radius: 99px; }
        .wz-bar-active { background: #fff; }
        .wz-bar-inactive { background: rgba(255,255,255,0.2); }
        
        .wz-card-text { display: flex; align-items: flex-start; gap: 16px; padding: 0 8px 8px; }
        .wz-card-tag { font-size: 1.5rem; font-weight: 700; line-height: 1; margin: 0; }
        .wz-card-desc { font-size: 0.875rem; color: #d1d5db; line-height: 1.6; margin: 0; }
        
        .wz-footer { display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 32px; width: 100%; margin-top: auto; }
        @media (min-width: 768px) { .wz-footer { flex-direction: row; margin-top: 48px; } }
        
        .wz-users { display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.2); backdrop-filter: blur(8px); padding: 8px 24px 8px 8px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.05); }
        .wz-avatars { display: flex; margin-right: -12px; }
        .wz-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #1a1a1a; object-fit: cover; margin-left: -12px; }
        .wz-avatar:first-child { margin-left: 0; }
        .wz-users-text { font-size: 0.875rem; font-weight: 700; margin: 0; }
        
        .wz-rotator { position: relative; width: 128px; height: 128px; display: flex; align-items: center; justify-content: center; }
        .wz-rotator-inner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10; }
        .wz-rotator-btn { width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); }
        .wz-rotator-icon { width: 20px; height: 20px; background: #ef4444; border-radius: 4px; display: flex; align-items: center; justify-content: center; transform: rotate(12deg); color: #fff; }
        @keyframes wz-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wz-rotator-svg { width: 100%; height: 100%; animation: wz-spin 10s linear infinite; }
        
        .wz-social { display: flex; align-items: center; gap: 32px; }
        .wz-social-text { font-size: 0.875rem; font-weight: 500; color: #9ca3af; margin: 0; }
        .wz-icons { display: flex; gap: 16px; }
        .wz-icon-link { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.3s; cursor: pointer; }
        .wz-icon-link:hover { background: rgba(255,255,255,0.1); color: #fff; }
      `}</style>

      <div className="wz-bg">
        <img src={bgImg} alt="" />
        <div className="wz-bg-grad"></div>
      </div>

      <div className="wz-container">
        <div className="wz-grid">
          <div className="wz-left">
            <h1 className="wz-h1">{h1}</h1>
            <p className="wz-desc">{desc}</p>
            <div>
              <button className="wz-left-btn">
                {btn}
                <div className="wz-btn-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              </button>
            </div>
          </div>

          <div className="wz-right">
            <div className="wz-card">
              <div className="wz-card-img-wrap">
                <img src={cImg} alt="" className="wz-card-img" />
                <div className="wz-card-img-grad"></div>
              </div>
              <div className="wz-card-progress">
                <span className="wz-card-step">{cStep}</span>
                <div className="wz-bars">
                  <div className="wz-bar wz-bar-active"></div>
                  <div className="wz-bar wz-bar-inactive"></div>
                  <div className="wz-bar wz-bar-inactive"></div>
                </div>
              </div>
              <div className="wz-card-text">
                <h3 className="wz-card-tag">{cTag}</h3>
                <p className="wz-card-desc">{cDesc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="wz-footer">
          <div className="wz-users">
            <div className="wz-avatars">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" className="wz-avatar" alt="" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="wz-avatar" alt="" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="wz-avatar" alt="" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="wz-avatar" alt="" />
            </div>
            <p className="wz-users-text">{uCount}</p>
          </div>

          <div className="wz-rotator">
            <div className="wz-rotator-inner">
              <div className="wz-rotator-btn">
                <div className="wz-rotator-icon">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
                </div>
              </div>
            </div>
            <svg className="wz-rotator-svg" viewBox="0 0 100 100">
              <defs><path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" /></defs>
              <text fill="white" style={{ fontSize: '7px', fontWeight: 500, letterSpacing: '0.2em', opacity: 0.6, textTransform: 'uppercase' }}>
                <textPath href="#circlePath">{textRot}</textPath>
              </text>
            </svg>
          </div>

          <div className="wz-social">
            <p className="wz-social-text">Follow us</p>
            <div className="wz-icons">
              <a className="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a className="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
              <a className="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VelunoNavbar({ props, styles, activeHref, onLinkClick }) {
  const brand = props.vlBrand || 'Veluno'
  const links = props.links || []
  const searchPlaceholder = props.vlSearchPlaceholder || 'Search products...'
  const cartCount = props.vlCartCount || '0'
  const profileImg = props.vlProfileImg || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  const bg = styles?.backgroundColor || '#ffffff'
  const color = styles?.color || '#000000'
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isSmall = isMobile || viewportWidth === 'tablet'

  return (
    <header className="vl-nav" style={{ backgroundColor: bg, color }}>
      <style>{`
        .vl-nav { height: 80px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 5%; border-bottom: 1px solid #f3f4f6; position: sticky; top: 0; z-index: 60; font-family: 'Inter', sans-serif; overflow: hidden; gap: 16px; }
        .vl-brand-flex { display: flex; align-items: center; gap: 12px; cursor: pointer; flex-shrink: 0; }
        .vl-brand-text { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.03em; white-space: nowrap; }
        .vl-links { display: flex; align-items: center; gap: 40px; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
        .vl-nav-item { position: relative; cursor: pointer; text-decoration: none; color: inherit; white-space: nowrap; }
        .vl-actions { display: flex; align-items: center; gap: 24px; flex-shrink: 0; }
        .vl-search { display: flex; align-items: center; background: #f7f7f7; border: 1px solid #f3f4f6; border-radius: 9999px; padding: 10px 20px; width: 256px; transition: all 0.3s; }
        .vl-search-input { background: transparent; border: none; outline: none; padding-left: 12px; font-size: 14px; width: 100%; font-weight: 500; }
        .vl-icons { display: flex; align-items: center; gap: 20px; }
        .vl-cart-btn { position: relative; background: none; border: none; cursor: pointer; color: inherit; display: flex; align-items: center; }
        .vl-cart-badge { position: absolute; top: -6px; right: -6px; background: #000; color: #fff; font-size: 9px; font-weight: 700; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .vl-profile-img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #f3f4f6; cursor: pointer; }
      `}</style>

      <div className="vl-brand-flex">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor" /></svg>
        <span className="vl-brand-text">{brand}</span>
      </div>

      {!isSmall && (
        <nav className="vl-links">
          {links.map((link, i) => (
            <a key={i} href={link.href} className="vl-nav-item" onClick={(e) => onLinkClick && onLinkClick(link, e)}>{link.text}</a>
          ))}
        </nav>
      )}

      <div className="vl-actions">
        {!isSmall && (
          <div className="vl-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder={searchPlaceholder} className="vl-search-input" />
          </div>
        )}

        <div className="vl-icons">
          {!isMobile && (
            <button className="vl-cart-btn" style={{ color: 'inherit' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>
          )}
          <button className="vl-cart-btn" style={{ color: 'inherit' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            {parseInt(cartCount) > 0 && <span className="vl-cart-badge">{cartCount}</span>}
          </button>
          <img src={profileImg} alt="Profile" className="vl-profile-img" />
        </div>
      </div>
    </header>
  )
}

function VelunoHero({ element }) {
  const props = element.props || {}
  const styles = element.styles || {}
  const bg = styles.backgroundColor || '#0c0c0c'
  const color = styles.color || '#ffffff'
  const hl = props.vlHeadingLeft || 'Glow'
  const hr = props.vlHeadingRight || '& Care'
  const text = props.vlDesc || 'Veluno is your go-to destination for modern and versatile beauty.\\nWe bring together timeless care and premium quality to your routine.'
  const scrollText = props.vlScrollText || 'Scroll Down'
  const img1 = props.vlLeftImage || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=90&w=1200'
  const img2 = props.vlRightImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=90&w=1200'

  return (
    <main className="vl-hero" style={{ backgroundColor: bg, color }}>
      <style>{`
        .vl-hero { position: relative; min-height: calc(100vh - 80px); display: flex; flex-direction: column; overflow: hidden; font-family: 'Inter', sans-serif; }
        @media (min-width: 768px) { .vl-hero { flex-direction: row; } }
        .vl-hero::after { content: ""; position: absolute; top: -150%; left: -150%; width: 300%; height: 300%; background-image: url("https://grainy-gradients.vercel.app/noise.svg"); opacity: 0.04; pointer-events: none; z-index: 100; }
        .vl-divider { display: none; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.1); z-index: 5; transform: translateX(-50%); }
        @media (min-width: 768px) { .vl-divider { display: block; } }
        .vl-img-box { position: relative; flex: 1; height: 50vh; overflow: hidden; }
        @media (min-width: 768px) { .vl-img-box { height: auto; } }
        .vl-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: transform 3s; }
        .vl-img:hover { transform: scale(1.1); }
        .vl-overlay-l { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.4), transparent); }
        .vl-overlay-r { position: absolute; inset: 0; background: linear-gradient(to left, rgba(0,0,0,0.4), transparent); }
        .vl-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 24px; z-index: 20; pointer-events: none; }
        .vl-h1 { font-size: clamp(4rem, 10vw, 140px); font-weight: 700; letter-spacing: -0.02em; line-height: 0.9; margin: 0 0 24px; pointer-events: auto; animation: revealUp 1s ease forwards; opacity: 0; transform: translateY(20px); }
        .vl-h1 span { font-weight: 200; opacity: 0.8; }
        .vl-desc { font-size: clamp(15px, 2vw, 17px); font-weight: 300; line-height: 1.6; opacity: 0; max-width: 600px; margin: 0 auto 64px; pointer-events: auto; white-space: pre-line; animation: revealUp 1s ease 0.2s forwards; }
        .vl-scroll { pointer-events: auto; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 24px; animation: revealUp 1s ease 0.4s forwards; opacity: 0; }
        .vl-scroll-ind { width: 72px; height: 72px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); backdrop-filter: blur(4px); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .vl-scroll-ind:hover { transform: scale(1.05); background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }
        .vl-scroll-text { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5em; font-weight: 600; opacity: 0.6; transition: opacity 0.3s; }
        .vl-scroll:hover .vl-scroll-text { opacity: 1; }
        .vl-tags { position: absolute; bottom: 48px; left: 48px; z-index: 30; display: none; align-items: center; gap: 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; opacity: 0.5; animation: revealUp 1s ease 0.8s forwards; opacity: 0; }
        @media (min-width: 1024px) { .vl-tags { display: flex; } }
        .vl-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.3); }
        @keyframes revealUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="vl-divider"></div>

      <div className="vl-img-box">
        <img src={img1} alt="" className="vl-img" />
        <div className="vl-overlay-l"></div>
      </div>
      <div className="vl-img-box">
        <img src={img2} alt="" className="vl-img" />
        <div className="vl-overlay-r"></div>
      </div>

      <div className="vl-content">
        <h1 className="vl-h1">{hl} <span>{hr}</span></h1>
        <p className="vl-desc">{text}</p>
        <div className="vl-scroll">
          <div className="vl-scroll-ind">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, currentColor, transparent)', marginBottom: '-2px' }}></div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <span className="vl-scroll-text">{scrollText}</span>
        </div>
      </div>

      <div className="vl-tags">
        {props.vlTag1 && <span>{props.vlTag1}</span>}
        {props.vlTag1 && props.vlTag2 && <div className="vl-dot"></div>}
        {props.vlTag2 && <span>{props.vlTag2}</span>}
        {props.vlTag2 && props.vlTag3 && <div className="vl-dot"></div>}
        {props.vlTag3 && <span>{props.vlTag3}</span>}
      </div>
    </main>
  )
}


function MakeNavbar({ props, styles, activeHref, onLinkClick }) {
  const brand = props.brand || 'Make'
  const accent = props.makeAccent || '#a855f7'
  const links = props.links || []
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'

  return (
    <nav style={{ backgroundColor: bg, color, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #3b82f6)` }} />
        {brand}
      </div>
      <div style={{ display: 'flex', gap: '32px' }}>
        {links.map((l, i) => (
          <a key={i} href={l.href} onClick={(e) => onLinkClick(e, l.href)} style={{ color, textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem', opacity: activeHref === l.href ? 1 : 0.8 }}>
            {l.text}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <a href="#" style={{ color, textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Log in</a>
        <a href="#" style={{ background: color, color: bg, padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>Get Started</a>
      </div>
    </nav>
  )
}

function MakeHero({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.makeAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '80px 48px', position: 'relative', overflow: 'hidden', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '400px', background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '900', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px' }}>
          {props.makeHeading}
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          {props.makeDesc}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}>
          <a href="#" style={{ background: `linear-gradient(135deg, ${accent}, #3b82f6)`, color: '#fff', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', boxShadow: `0 10px 30px ${accent}40` }}>
            {props.makeCtaText}
          </a>
          <a href="#" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            {props.makeSecondaryCtaText}
          </a>
        </div>
        
        <div style={{ position: 'relative', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
             <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ef4444'}}></div>
             <div style={{width: 12, height: 12, borderRadius: '50%', background: '#eab308'}}></div>
             <div style={{width: 12, height: 12, borderRadius: '50%', background: '#22c55e'}}></div>
          </div>
          <img src={props.makeImage} alt="App Interface" style={{ width: '100%', display: 'block', marginTop: '40px' }} />
        </div>
      </div>
    </section>
  )
}


function MakeFeatures({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.mfAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '96px 48px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', textAlign: 'center', marginBottom: '64px', letterSpacing: '-0.02em' }}>{props.mfHeading}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {(props.mfFeatures || []).map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px 32px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={(e)=>e.currentTarget.style.transform='none'}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `linear-gradient(135deg, ${accent}40, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '24px', border: `1px solid ${accent}40` }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MakeIntegrations({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.miAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '96px 48px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', width: '500px', height: '500px', background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: '48px', letterSpacing: '-0.02em' }}>{props.miHeading}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', maxWidth: '800px', marginBottom: '56px' }}>
          {(props.miIcons || []).map((icon, i) => (
            <div key={i} style={{ width: '80px', height: '80px', borderRadius: '20px', background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {icon.text}
            </div>
          ))}
        </div>
        <a href="#" style={{ color: accent, textDecoration: 'none', fontWeight: '700', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          {props.miCtaText} <span style={{fontSize:'1.5rem'}}>→</span>
        </a>
      </div>
    </section>
  )
}

function MakePricing({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.mpAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '96px 48px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: '64px', letterSpacing: '-0.02em' }}>{props.mpHeading}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
          {(props.mpPlans || []).map((plan, i) => (
            <div key={i} style={{ background: plan.highlight ? `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))` : 'rgba(255,255,255,0.02)', border: `1px solid ${plan.highlight ? accent : 'rgba(255,255,255,0.1)'}`, borderRadius: '24px', padding: '48px 32px', position: 'relative', transform: plan.highlight ? 'scale(1.05)' : 'none', boxShadow: plan.highlight ? `0 20px 40px -10px ${accent}40` : 'none' }}>
              {plan.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Most Popular</div>}
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 8px' }}>{plan.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 32px' }}>{plan.desc}</p>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '32px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {plan.price}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '500' }}>/mo</span>
              </div>
              <button style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: plan.highlight ? accent : 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginBottom: '32px' }}>Get Started</button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(plan.features || []).map((feat, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '0.95rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `${accent}30`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>✓</div>
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MakeFooter({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#94a3b8'
  const accent = props.mftAccent || '#a855f7'

  return (
    <footer style={{ backgroundColor: bg, color, padding: '64px 48px', fontFamily: 'system-ui, sans-serif', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #3b82f6)` }} />
          {props.mftBrand}
        </div>
        <p style={{ fontSize: '1.1rem', margin: 0, textAlign: 'center' }}>{props.mftText}</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.6, margin: '24px 0 0' }}>{props.mftCopy}</p>
      </div>
    </footer>
  )
}

function SkylineHero({ element }) {
  const props = element.props || {}
  const styles = element.styles || {}
  const bg = styles.backgroundColor || '#fdf8f4'
  const color = styles.color || '#1a1a1a'
  const accent = props.slAccentColor || '#e86034'
  const h1 = props.slHeadingLine1 || 'Housing'
  const h2 = props.slHeadingLine2 || 'Experience'
  const ctaText = props.slCtaText || 'Find a house'
  const desc = props.slDesc || 'Discover luxurious international properties with Skyline, connecting you to top global locations effortlessly.'
  const heroImg = props.slHeroImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop'
  const tName = props.slTestimonialName || 'Roberto Carlos'
  const tText = props.slTestimonialText || '"Skyline made finding my perfect home effortless with detailed listings and personalized recommendations!"'
  const tAvatar = props.slTestimonialAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  const s1Val = props.slStat1Value || '200K+'
  const s1Lab = props.slStat1Label || 'Happy users'
  const s2Val = props.slStat2Value || '5K+'
  const s2Lab = props.slStat2Label || 'Our partner'

  return (
    <section className="sl-hero" style={{ backgroundColor: bg, color }}>
      <style>{`
        .sl-hero { position:relative; font-family:'Plus Jakarta Sans',system-ui,sans-serif; overflow:hidden; padding:0; }
        .sl-grid-lines { position:absolute; inset:0; pointer-events:none; z-index:1; }
        .sl-grid-v { position:absolute; left:50%; top:0; bottom:0; width:1px; background:rgba(0,0,0,0.07); }
        .sl-grid-h { position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(0,0,0,0.07); }
        .sl-inner { width:100%; margin:0 auto; padding:40px 32px 48px; display:grid; grid-template-columns:1.2fr 0.8fr 1fr; gap:24px; position:relative; z-index:10; min-height:600px; align-items:stretch; }
        .sl-left { display:flex; flex-direction:column; justify-content:space-between; min-width:0; }
        .sl-h1 { font-size:clamp(2.2rem,5vw,4rem); font-weight:600; line-height:0.9; margin:0 0 32px; white-space:nowrap; }
        .sl-h1-italic { font-family:'Playfair Display',Georgia,serif; font-style:italic; font-weight:500; display:block; font-size:0.95em; }
        .sl-cta { display:inline-flex; align-items:center; gap:10px; padding:12px 28px; border-radius:9999px; font-weight:700; font-size:0.9rem; text-decoration:none; cursor:pointer; border:none; transition:all 0.2s; color:#fff; }
        .sl-cta:hover { filter:brightness(0.9); box-shadow:0 12px 32px rgba(0,0,0,0.15); }
        .sl-desc { max-width:320px; line-height:1.65; font-size:0.95rem; font-weight:500; margin-top:32px; }
        .sl-desc-text { color:#6b7280; margin:0 0 24px; }
        .sl-avatars { display:flex; }
        .sl-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; margin-left:-10px; border:3px solid; }
        .sl-avatar:first-child { margin-left:0; }
        .sl-center { display:flex; align-items:center; justify-content:center; position:relative; min-width:0; }
        .sl-oval-wrap { position:relative; width:100%; max-width:280px; margin:0 auto; }
        .sl-oval { width:100%; aspect-ratio:10/14; border-radius:999px; overflow:hidden; border:4px solid #fff; box-shadow:0 30px 60px -15px rgba(0,0,0,0.15); position:relative; background-color:#ede4dc; min-height:300px; }
        .sl-oval img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; transition:transform 1.2s cubic-bezier(0.2,1,0.3,1); }
        .sl-oval:hover img { transform:scale(1.05); }
        .sl-oval-btn { position:absolute; bottom:14%; right:-12%; width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; cursor:pointer; transition:all 0.3s; z-index:30; border:5px solid; }
        .sl-oval-btn:hover { transform:scale(1.1) rotate(15deg); }
        .sl-right { display:flex; flex-direction:column; justify-content:space-between; align-items:flex-end; text-align:right; min-width:0; overflow:hidden; }
        .sl-testimonial { max-width:100%; }
        .sl-stars { display:flex; justify-content:flex-end; gap:2px; margin-bottom:12px; font-size:0.85rem; }
        .sl-t-header { display:flex; align-items:center; justify-content:flex-end; gap:10px; margin-bottom:12px; }
        .sl-t-name { font-weight:700; font-size:0.9rem; white-space:nowrap; }
        .sl-t-avatar { width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex-shrink:0; }
        .sl-t-text { color:#6b7280; font-weight:500; line-height:1.55; font-size:0.8rem; word-wrap:break-word; overflow-wrap:break-word; }
        .sl-stats-wrap { width:100%; }
        .sl-stats { display:flex; justify-content:flex-end; gap:28px; margin-bottom:32px; }
        .sl-stat-val { font-size:clamp(1.8rem,3vw,2.5rem); font-weight:700; margin:0 0 4px; line-height:1; }
        .sl-stat-lab { font-size:9px; text-transform:uppercase; letter-spacing:0.25em; color:#9ca3af; font-weight:700; margin:0; }
        .sl-actions { display:flex; align-items:center; justify-content:flex-end; gap:24px; }
        .sl-qr-btn { width:56px; height:56px; background:#000; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.3rem; box-shadow:0 15px 30px rgba(0,0,0,0.2); cursor:pointer; transition:transform 0.2s; outline:8px solid #fff; flex-shrink:0; }
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
      `}</style>

      {/* Background Grid */}
      <div className="sl-grid-lines">
        <div className="sl-grid-v" />
        <div className="sl-grid-h" />
      </div>

      <div className="sl-inner">
        {/* Left Side */}
        <div className="sl-left">
          <div>
            <h1 className="sl-h1">
              {h1}
              <span className="sl-h1-italic">{h2}</span>
            </h1>
            <a href={props.slCtaHref || '#'} onClick={(e) => e.preventDefault()} className="sl-cta" style={{ backgroundColor: accent, boxShadow: `0 15px 30px ${accent}66` }}>
              {ctaText}
              <i className="fa-solid fa-arrow-up" style={{ transform: 'rotate(45deg)', fontSize: '0.8rem' }} />
            </a>
          </div>
          <div className="sl-desc">
            <p className="sl-desc-text">{desc}</p>
            <div className="sl-avatars">
              <img className="sl-avatar" style={{ borderColor: bg }} src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="" />
              <img className="sl-avatar" style={{ borderColor: bg }} src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="" />
              <img className="sl-avatar" style={{ borderColor: bg }} src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="" />
              <img className="sl-avatar" style={{ borderColor: bg }} src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="" />
            </div>
          </div>
        </div>

        {/* Central Oval */}
        <div className="sl-center">
          <div className="sl-oval-wrap">
            <div className="sl-oval">
              <img src={heroImg} alt="Hero" />
            </div>
            <div className="sl-oval-btn" style={{ backgroundColor: accent, borderColor: bg, boxShadow: `0 12px 24px ${accent}66` }}>
              <i className="fa-solid fa-arrow-up" style={{ transform: 'rotate(45deg)' }} />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="sl-right">
          <div className="sl-testimonial">
            <div className="sl-stars" style={{ color: accent }}>
              {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <div className="sl-t-header">
              <span className="sl-t-name">{tName}</span>
              <img className="sl-t-avatar" src={tAvatar} alt={tName} />
            </div>
            <p className="sl-t-text">{tText}</p>
          </div>

          <div className="sl-stats-wrap">
            <div className="sl-stats">
              <div>
                <p className="sl-stat-val">{s1Val}</p>
                <p className="sl-stat-lab">{s1Lab}</p>
              </div>
              <div>
                <p className="sl-stat-val">{s2Val}</p>
                <p className="sl-stat-lab">{s2Lab}</p>
              </div>
            </div>
            <div className="sl-actions">
              <i className="fa-solid fa-arrow-down" style={{ fontSize: '1.3rem', opacity: 0.7 }} />
              <div className="sl-qr-btn">
                <i className="fa-solid fa-qrcode" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Presentation Section ──────────────────────────────────────────────────── */
function PresentSection({ element }) {
  const props = element.props || {}
  const styles = element.styles || {}
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const heading = props.presentHeading || 'The quickest way to create modern presentation'
  const desc = props.presentDesc || 'Best software platform for running an internet business.'
  const btnText = props.presentBtnText || 'Explore All'
  const btnHref = props.presentBtnHref || '#'
  const accent = props.presentAccent || '#4f46e5'
  const accentBg = accent + '1a'

  const cards = [
    { title: props.presentCard1Title || 'Management', desc: props.presentCard1Desc || 'Software platform for running your new internet business', iconBg: props.presentCard1IconBg || '#eff6ff', iconColor: props.presentCard1IconColor || '#3b82f6' },
    { title: props.presentCard2Title || 'Entertainment', desc: props.presentCard2Desc || 'Software platform for running your new internet business', iconBg: props.presentCard2IconBg || '#f9fafb', iconColor: props.presentCard2IconColor || '#4b5563' },
    { title: props.presentCard3Title || 'Marketing', desc: props.presentCard3Desc || 'Software platform for running your new internet business', iconBg: props.presentCard3IconBg || '#fff7ed', iconColor: props.presentCard3IconColor || '#f97316' },
    { title: props.presentCard4Title || 'References', desc: props.presentCard4Desc || 'Software platform for running your new internet business', iconBg: props.presentCard4IconBg || '#fefce8', iconColor: props.presentCard4IconColor || '#eab308' },
  ]

  const cardIcons = [
    (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  ]

  const socials = [
    { href: props.presentFb || '#', icon: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></> },
    { href: props.presentIg || '#', icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></> },
    { href: props.presentTw || '#', icon: <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></> },
  ]

  // ── responsive values ──────────────────────────────────────────────────────
  const sectionPad = isMobile ? '16px 10px' : isTablet ? '24px 16px' : '40px 20px'
  const containerPad = isMobile ? '24px 16px' : isTablet ? '32px 24px' : '60px'
  const containerRad = isSmall ? '24px' : '40px'
  const outerCols = isSmall ? '1fr' : '7fr 5fr'
  const outerGap = isMobile ? '28px' : isTablet ? '36px' : '80px'
  const cardsPad = isMobile ? '18px 12px' : isTablet ? '22px 16px' : '32px'
  const cardsGap = isMobile ? '10px' : '16px'
  const iconSize = isMobile ? '48px' : '60px'
  const iconRad = isMobile ? '12px' : '16px'
  const iconMb = isMobile ? '12px' : '18px'

  return (
    <section style={{ backgroundColor: styles.backgroundColor || '#f8fafc', padding: sectionPad, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes psFadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        .ps-card { transition: transform 0.3s ease, box-shadow 0.3s ease; animation: psFadeUp 0.5s ease both; }
        .ps-card:hover { transform: translateY(-5px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important; }
        .ps-card:nth-child(1) { animation-delay:0.05s; } .ps-card:nth-child(2) { animation-delay:0.15s; }
        .ps-card:nth-child(3) { animation-delay:0.25s; } .ps-card:nth-child(4) { animation-delay:0.35s; }
        .ps-explore:hover { background-color: ${accent}33 !important; }
        .ps-arrow { display:inline-flex; transition: transform 0.2s ease; }
        .ps-explore:hover .ps-arrow { transform: translateX(4px); }
        .ps-soc { transition: color 0.2s, border-color 0.2s; }
        .ps-soc:hover { color: ${accent} !important; border-color: ${accent} !important; }
      `}</style>
      <div style={{ backgroundColor: '#ffffff', borderRadius: containerRad, padding: containerPad, maxWidth: '1200px', margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: outerCols, gap: outerGap, alignItems: 'center' }}>

          {/* Left – 2×2 feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: cardsGap }}>
            {cards.map((card, i) => (
              <div key={i} className="ps-card" style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '20px', padding: cardsPad, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 6px 20px -4px rgba(0,0,0,0.05)' }}>
                <div style={{ width: iconSize, height: iconSize, backgroundColor: card.iconBg, borderRadius: iconRad, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: iconMb, flexShrink: 0 }}>
                  {cardIcons[i](card.iconColor)}
                </div>
                <h3 style={{ fontSize: isMobile ? '0.88rem' : '1rem', fontWeight: '700', color: '#111827', margin: '0 0 6px' }}>{card.title}</h3>
                <p style={{ fontSize: isMobile ? '0.75rem' : '0.82rem', color: '#6b7280', lineHeight: '1.55', margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Right – content */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: isSmall ? 'auto' : '400px' }}>
            <div>
              <h2 style={{ fontSize: isMobile ? '1.6rem' : isTablet ? '2rem' : 'clamp(1.8rem,2.8vw,2.8rem)', fontWeight: '700', color: styles.color || '#111827', lineHeight: '1.15', margin: '0 0 16px' }}>
                {heading}
              </h2>
              <p style={{ color: '#6b7280', fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: '1.7', margin: '0 0 24px' }}>{desc}</p>
              <a href={btnHref} className="ps-explore"
                onClick={(e) => handleLink(e, btnHref, props.presentBtnLinkType)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', backgroundColor: accentBg, color: accent, fontWeight: '600', borderRadius: '12px', textDecoration: 'none', fontSize: '0.92rem' }}>
                {btnText}
                <span className="ps-arrow">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                </span>
              </a>
            </div>
            <div style={{ marginTop: isSmall ? '28px' : '48px' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>Follow us</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} onClick={(e) => handleLink(e, s.href, 'url')} className="ps-soc" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textDecoration: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Puzzle Game Hero ──────────────────────────────────────────────────────── */
function PuzzleHero({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const displayWord = props.puzzleDisplayWord || 'puzzle'
  const heading = props.puzzleHeading || 'Get an amazing new play game experience'
  const description = props.puzzleDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luct'
  const ctaText = props.puzzleCtaText || 'Play Now'
  const accent = props.puzzleAccent || '#f97316'
  const color1 = props.puzzleColor1 || '#3b82f6'
  const color2 = props.puzzleColor2 || '#f97316'
  const color3 = props.puzzleColor3 || '#fbbf24'
  const color4 = props.puzzleColor4 || '#db2777'
  const bgColor = styles?.backgroundColor || '#fdf6f0'
  const textColor = styles?.color || '#0f172a'

  const PuzzlePiece = ({ color, delay = false, size = 120 }) => (
    <svg style={{ width: size, height: size, fill: color, flexShrink: 0, animation: delay ? 'pzlFloat 5s ease-in-out 1s infinite' : 'pzlFloat 4s ease-in-out infinite' }} viewBox="0 0 24 24">
      <path d={PUZZLE_PATH} />
    </svg>
  )

  return (
    <section style={{ backgroundColor: bgColor, color: textColor, fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', minHeight: isSmall ? 'auto' : '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isSmall ? '60px 24px 80px' : '60px 40px', position: 'relative', overflow: 'clip' }}>
      <style>{`@keyframes pzlFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>

      {/* Left cluster */}
      {!isSmall && (
        <div style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', zIndex: 1, pointerEvents: 'none' }}>
          <PuzzlePiece color={color1} /><div style={{ width: 120, height: 120 }} />
          <PuzzlePiece color="#ffffff" delay /><PuzzlePiece color={color2} />
          <PuzzlePiece color={color3} delay /><PuzzlePiece color={color1} />
        </div>
      )}

      {/* Right cluster */}
      {!isSmall && (
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', zIndex: 1, pointerEvents: 'none' }}>
          <div style={{ width: 120, height: 120 }} /><PuzzlePiece color={color2} delay /><PuzzlePiece color={color1} />
          <PuzzlePiece color="#ffffff" delay /><PuzzlePiece color={color4} /><PuzzlePiece color={color3} delay />
          <PuzzlePiece color={color3} /><PuzzlePiece color={color2} delay /><PuzzlePiece color={color1} />
          <div style={{ width: 120, height: 120 }} /><PuzzlePiece color="#ffffff" delay /><PuzzlePiece color={color4} />
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: isMobile ? '5rem' : isTablet ? '8rem' : 'clamp(5rem, 15vw, 12rem)', fontWeight: '900', color: textColor, lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '16px', userSelect: 'none' }}>
          {displayWord}
        </div>
        <h2 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: '700', color: textColor, lineHeight: 1.3, maxWidth: '400px', margin: '0 auto 16px' }}>
          {heading}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 32px' }}>
          {description}
        </p>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <a href={props.puzzleCtaHref || '#'} onClick={(e) => handleLink(e, props.puzzleCtaHref, props.puzzleCtaLinkType)} style={{ padding: '14px 40px', backgroundColor: accent, color: '#fff', fontWeight: '700', fontSize: '1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: `0 10px 25px -5px ${accent}66`, display: 'inline-block', textDecoration: 'none' }}>
            {ctaText}
          </a>
          <svg style={{ position: 'absolute', left: '-48px', top: '40px', width: '64px', height: '64px', color: '#94a3b8', opacity: 0.6 }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20,20 Q40,10 60,30 Q80,50 40,70" strokeLinecap="round" />
            <path d="M35,65 L40,70 L35,75" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}

/* ── Trend Skincare Navbar ─────────────────────────────────────────────────── */
function TrendNavbar({ props, styles, activeHref, onLinkClick, isPreview }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { viewportWidth } = useBuilder()
  const links = props.links || []
  const brand = props.brand || 'trend.'
  const accent = props.trendAccent || '#e91e63'
  const searchText = props.trendSearchPlaceholder || 'Search'
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet
  const navBg = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1e293b'

  return (
    <header style={{ backgroundColor: navBg, borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'relative', fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isSmall ? '14px 20px' : '16px 48px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', fontSize: '1.4rem', color: accent, letterSpacing: '-0.04em', userSelect: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          {brand}
        </div>

        {/* Desktop nav links */}
        {!isSmall && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {links.map((link, i) => {
              const isActive = link.href === activeHref
              const isHov = hoveredLink === i
              return (
                <a key={i} href={link.href || '#'}
                  onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link, e) }}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600', color: (isActive || isHov) ? accent : '#64748b', transition: 'color 0.2s', cursor: 'pointer' }}
                >{link.text}</a>
              )
            })}
          </nav>
        )}

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isSmall && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '6px 16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                type="text"
                placeholder={searchText}
                readOnly={!isPreview}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.83rem', color: '#334155', fontWeight: '500', width: '110px', cursor: isPreview ? 'text' : 'default' }}
              />
            </div>
          )}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ padding: '8px 10px', backgroundColor: accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
          >
            {isSmall
              ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile dropdown — absolutely positioned so it overlays content below */}
      {isSmall && menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          backgroundColor: navBg,
          borderTop: `2px solid ${accent}20`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          padding: '8px 20px 16px',
        }}>
          {links.map((link, i) => {
            const isActive = link.href === activeHref
            return (
              <a key={i} href={link.href || '#'}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); if (onLinkClick) onLinkClick(link, e) }}
                style={{ display: 'block', padding: '11px 0', textDecoration: 'none', color: isActive ? accent : textColor, fontWeight: isActive ? '700' : '500', fontSize: '0.95rem', borderBottom: '1px solid #f1f5f9', opacity: isActive ? 1 : 0.75 }}
              >{link.text}</a>
            )
          })}
        </div>
      )}
    </header>
  )
}

/* ── Trend Skincare Hero Section ───────────────────────────────────────────── */
function TrendHero({ element, isPreview }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const handleLink = useNavLinkHandler()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  const accent = props.trendAccent || '#e91e63'
  const heading = props.trendHeading || 'Bring brand in life'
  const highlight = props.trendHighlight || 'brand'
  const description = props.trendDescription || 'Brand cream is a sunshine cream good for your skin care.'
  const ctaText = props.trendCtaText || 'Shop Now'
  const reviewCount = props.trendReviewCount || '10k+'
  const rating = props.trendRating || '4.5'
  const imgSrc = props.trendProductImage || 'https://placehold.co/280x380/e91e63/ffffff?text=Product'
  const feature1 = props.trendFeature1 || 'Organic'
  const feature1Desc = props.trendFeature1Desc || 'Natural ingredients delivered fresh.'
  const feature2 = props.trendFeature2 || 'Aroma'
  const feature2Desc = props.trendFeature2Desc || 'Refreshing scents for all skin types.'
  const feature3 = props.trendFeature3 || 'Botanic'
  const feature3Desc = props.trendFeature3Desc || 'Plant-based formulas with proven results.'
  const videoText = props.trendVideoText || 'SEE PRODUCT VIDEO NOW'
  const videoLink = props.trendVideoLink || ''
  const bgColor = styles?.backgroundColor || '#ffffff'
  const textColor = styles?.color || '#1e293b'

  const renderHeading = () => {
    if (!highlight) return <>{heading}</>
    const idx = heading.indexOf(highlight)
    if (idx === -1) return <>{heading}</>
    return (
      <>
        {heading.slice(0, idx)}
        <span style={{ position: 'relative', display: 'inline-block', padding: '0 6px', color: accent }}>
          <span style={{ position: 'absolute', left: 0, top: '10%', width: '100%', height: '80%', border: `2.5px solid ${accent}`, borderRadius: '4px', pointerEvents: 'none' }} />
          {highlight}
        </span>
        {heading.slice(idx + highlight.length)}
      </>
    )
  }

  const circleTextRepeat = `${videoText} • ${videoText} • `

  return (
    <section style={{
      backgroundColor: bgColor, color: textColor,
      padding: isSmall ? '40px 20px 50px' : '80px 48px',
      fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: isSmall ? 'column' : 'row',
      alignItems: 'center', justifyContent: 'space-between',
      gap: isSmall ? '40px' : '24px', position: 'relative', overflow: 'clip',
    }}>
      {/* CSS for spin animation */}
      <style>{`@keyframes trendSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes trendFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: accent, opacity: 0.04, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '350px', height: '350px', borderRadius: '50%', backgroundColor: accent, opacity: 0.03, pointerEvents: 'none' }} />

      {/* Left: Heading + CTA + Social */}
      <div style={{ flex: isSmall ? 'none' : '1 1 0', maxWidth: isSmall ? '100%' : '320px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: isMobile ? '2.6rem' : isTablet ? '3.2rem' : '4rem', fontWeight: '900', lineHeight: 1.1, letterSpacing: '-0.03em', color: textColor, margin: 0 }}>
          {renderHeading()} <span style={{ color: accent }}>→</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '280px', lineHeight: 1.65, margin: 0 }}>{description}</p>
        <a href={props.trendCtaHref || '#'} onClick={(e) => handleLink(e, props.trendCtaHref, props.trendCtaLinkType)} style={{ textDecoration: 'none', backgroundColor: accent, color: '#fff', border: 'none', borderRadius: '999px', padding: '13px 28px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          {ctaText}
        </a>
        {/* Social proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <div style={{ display: 'flex' }}>
            {[
              'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80',
              'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80',
            ].map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #fff', marginLeft: i === 0 ? 0 : '-9px', objectFit: 'cover', flexShrink: 0 }} />
            ))}
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-9px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: '800', color: '#94a3b8', flexShrink: 0 }}>{reviewCount}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#f59e0b', fontSize: '1.1rem', lineHeight: 1 }}>★</span>
            <span style={{ fontWeight: '800', fontSize: '0.88rem', color: textColor }}>{rating}</span>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>(review rating)</span>
          </div>
        </div>
      </div>

      {/* Center: Product image with splash */}
      <div style={{ flex: isSmall ? 'none' : '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: isSmall ? '220px' : '360px' }}>
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '130%', height: '130%', pointerEvents: 'none' }}>
          <path fill={accent} opacity="0.1" d="M435.5,296.5C418.1,353.9,352.5,391.1,288.7,419.5C224.9,447.9,162.8,467.5,108.8,443.3C54.8,419.1,8.9,351,1.5,283.5C-5.9,216,25.2,149.1,75.3,101.4C125.4,53.7,194.5,25.3,261.2,21.9C327.9,18.5,392.2,40.1,432.2,88.7C472.2,137.3,487.9,212.9,435.5,296.5Z" />
          <path fill={accent} opacity="0.18" d="M410.5,320.5C384.8,375.4,310.8,401.4,244.5,410.5C178.2,419.6,119.6,411.8,78.5,372.5C37.4,333.2,13.8,262.4,26.5,198.5C39.2,134.6,88.2,77.6,150.5,50.5C212.8,23.4,288.4,26.2,345.5,61.5C402.6,96.8,441.2,164.6,436.2,230.5C431.2,296.4,382.8,360.3,410.5,320.5Z" />
        </svg>
        <img src={imgSrc} alt="Product"
          style={{ position: 'relative', zIndex: 1, width: isSmall ? '150px' : '210px', height: 'auto', objectFit: 'contain', borderRadius: '20px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.14))', animation: 'trendFloat 6s ease-in-out infinite' }}
        />
      </div>

      {/* Right: Features + rotating video circle — always visible, layout adapts */}
      <div style={{
        flex: isSmall ? 'none' : '0 0 200px',
        width: isSmall ? '100%' : undefined,
        display: 'flex',
        flexDirection: isSmall ? 'row' : 'column',
        flexWrap: isSmall ? 'wrap' : undefined,
        gap: isSmall ? '12px' : '20px',
        position: 'relative', zIndex: 1,
        alignItems: isSmall ? 'stretch' : undefined,
      }}>
        {/* Feature 1 */}
        <div style={{ flex: isSmall ? '1 1 140px' : undefined }}>
          <h4 style={{ fontWeight: '800', fontSize: '0.95rem', color: textColor, margin: '0 0 3px' }}>{feature1}</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{feature1Desc}</p>
        </div>
        {/* Feature 2 — highlighted card */}
        <div style={{ backgroundColor: accent, borderRadius: '14px', padding: '14px 16px', color: '#fff', flex: isSmall ? '1 1 140px' : undefined }}>
          <h4 style={{ fontWeight: '800', fontSize: '0.95rem', margin: '0 0 3px' }}>{feature2}</h4>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.5 }}>{feature2Desc}</p>
        </div>
        {/* Feature 3 */}
        <div style={{ flex: isSmall ? '1 1 140px' : undefined }}>
          <h4 style={{ fontWeight: '800', fontSize: '0.95rem', color: textColor, margin: '0 0 3px' }}>{feature3}</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{feature3Desc}</p>
        </div>
        {/* Rotating video button */}
        <div style={{ position: 'relative', width: '96px', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: isSmall ? 0 : '8px' }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', animation: 'trendSpin 16s linear infinite' }}>
            <defs><path id="trendCirclePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" /></defs>
            <text style={{ fontSize: '8px', fontWeight: '700', fill: textColor, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              <textPath href="#trendCirclePath">{circleTextRepeat}</textPath>
            </text>
          </svg>
          {videoLink ? (
            <a href={videoLink} target="_blank" rel="noopener noreferrer"
              onClick={!isPreview ? (e) => e.preventDefault() : undefined}
              style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, textDecoration: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </a>
          ) : (
            <button style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: accent, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Lumora Skincare Components ───────────────────────────────────────────── */

function LumoraNavbar({ props, styles, activeHref, onLinkClick }) {
  const brand = props.brand || 'Lumora'
  const links = props.links || []
  const cartCount = props.lumoraCartCount || '0'
  const bg = styles?.backgroundColor || '#FDFCF8'
  const color = styles?.color || '#1A1A1A'
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header style={{
      backgroundColor: bg,
      color: color,
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #EBE9E1',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
      `}</style>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isSmall ? '16px 20px' : '24px 60px',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {isSmall && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          )}
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '0.02em'
          }}>
            {brand}
          </div>
        </div>

        {!isSmall && (
          <nav style={{ display: 'flex', gap: '40px' }}>
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => onLinkClick && onLinkClick(link, e)}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {link.text}
              </a>
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative', color: 'inherit' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            {parseInt(cartCount) > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#1A1A1A',
                color: '#FDFCF8',
                fontSize: '10px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isSmall && mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          minHeight: '100vh',
          backgroundColor: bg,
          zIndex: 200,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '0.02em'
            }}>
              {brand}
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false)
                  onLinkClick && onLinkClick(link, e)
                }}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontSize: '18px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  paddingBottom: '12px'
                }}
              >
                {link.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

function LumoraHero({ element }) {
  const props = element.props || {}
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isSmall = isMobile || viewportWidth === 'tablet'

  return (
    <section style={{
      backgroundColor: '#FDFCF8',
      padding: isSmall ? '40px 20px' : '0',
      display: 'flex',
      flexDirection: isSmall ? 'column-reverse' : 'row',
      minHeight: isSmall ? 'auto' : '85vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflow: 'hidden'
    }}>
      <div style={{
        flex: 1,
        padding: isSmall ? '40px 0' : '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#EBE9E1',
          padding: '4px 12px',
          borderRadius: '99px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '24px',
          width: 'fit-content'
        }}>
          {props.tagline}
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isSmall ? '48px' : '72px',
          lineHeight: 1.1,
          marginBottom: '32px',
          color: '#1A1A1A'
        }}>
          {props.title}
        </h1>
        <button style={{
          backgroundColor: '#1A1A1A',
          color: '#FDFCF8',
          border: 'none',
          padding: '16px 40px',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '600',
          width: 'fit-content',
          cursor: 'pointer'
        }}>
          {props.ctaText}
        </button>

        <div style={{
          marginTop: '60px',
          padding: '24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          maxWidth: '430px'
        }}>
          <img src={props.productImg} alt="Product" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
          <div>
            <div style={{ fontWeight: '700', marginBottom: '4px', color: '#1A1A1A' }}>{props.productName}</div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.4 }}>{props.productDesc}</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1.2, position: 'relative' }}>
        <img src={props.heroImage} alt="Skincare" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </section>
  )
}

function LumoraMarquee({ element }) {
  const props = element.props || {}

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #EBE9E1',
      borderBottom: '1px solid #EBE9E1',
      padding: '24px 0',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <style>{`
        @keyframes lumoraMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .lumora-marquee-content { display: flex; animation: lumoraMarquee 30s linear infinite; width: max-content; }
      `}</style>
      <div className="lumora-marquee-content">
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '60px', paddingRight: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#E2E8D5', fontSize: '24px' }}>{"★★★★★"}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A1A1A' }}>{props.review1}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{props.author1}</div>
              </div>
            </div>
            <div style={{ height: '40px', width: '1px', backgroundColor: '#EFEEE8' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#E2E8D5', fontSize: '24px' }}>{"★★★★★"}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A1A1A' }}>{props.review2}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{props.author2}</div>
              </div>
            </div>
            <div style={{ height: '40px', width: '1px', backgroundColor: '#EFEEE8' }}></div>
            <div style={{ fontWeight: '800', fontSize: '14px', color: '#1A1A1A' }}>{props.trustedText}</div>
            <div style={{ height: '40px', width: '1px', backgroundColor: '#EFEEE8' }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LumoraStory({ element }) {
  const props = element.props || {}
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  return (
    <section style={{
      backgroundColor: '#FDFCF8',
      padding: isSmall ? '60px 20px' : '100px 60px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: isSmall ? 'column' : 'row',
        gap: '60px',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>{props.tagline}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isSmall ? '36px' : '48px', lineHeight: 1.2, marginBottom: '32px', color: '#1A1A1A' }}>{props.title}</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#333', marginBottom: '24px' }}>{props.storyP1}</p>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#333', marginBottom: '40px' }}>{props.storyP2}</p>
          <button style={{
            backgroundColor: 'transparent',
            color: '#1A1A1A',
            border: '1px solid #1A1A1A',
            padding: '12px 32px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            {props.ctaText}
          </button>
        </div>
        <div style={{ flex: 1, position: 'relative', height: isSmall ? '400px' : '500px', width: '100%' }}>
          <img src={props.image1} alt="Story 1" style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: '80%', objectFit: 'cover', borderRadius: '12px', zIndex: 1 }} />
          <img src={props.image2} alt="Story 2" style={{ position: 'absolute', bottom: 0, right: 0, width: '60%', height: '70%', objectFit: 'cover', borderRadius: '12px', border: '10px solid #FDFCF8', zIndex: 2 }} />
        </div>
      </div>
    </section>
  )
}

function LumoraProducts({ element }) {
  const props = element.props || {}
  const products = props.products || []
  const { viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmall = isMobile || isTablet

  return (
    <section style={{
      backgroundColor: '#EFEEE8',
      padding: isSmall ? '60px 20px' : '100px 60px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>{props.tagline}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isSmall ? '36px' : '48px', color: '#1A1A1A' }}>{props.title}</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '30px'
        }}>
          {products.map(p => (
            <div key={p.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ position: 'relative', height: '300px' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '99px',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>
                  {p.tag}
                </div>
                <button style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                </button>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>{p.category}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', flex: 1, color: '#1A1A1A' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ fontWeight: '700', fontSize: '18px', color: '#1A1A1A' }}>{p.price}</span>
                  {p.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '14px' }}>{p.oldPrice}</span>}
                </div>
                <button style={{
                  backgroundColor: '#1A1A1A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  ADD TO BAG
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LumoraFooter({ props, styles }) {
  const brand = props.brand || 'Lumora'
  const links = props.links || []
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      padding: '60px 20px',
      textAlign: 'center',
      borderTop: '1px solid #EBE9E1',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '40px',
        letterSpacing: '0.02em',
        color: '#1A1A1A'
      }}>
        {brand}
      </div>
      <nav style={{
        display: 'flex',
        flexDirection: isSmall ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: isSmall ? '20px' : '40px',
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        {links.map((l, i) => (
          <a key={i} href={l.href} style={{ textDecoration: 'none', color: '#1A1A1A', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l.text}</a>
        ))}
      </nav>
      <div style={{ color: '#999', fontSize: '12px', letterSpacing: '0.05em' }}>
        {props.copyright}
      </div>
    </footer>
  )
}

/* Renders an element by type with its props/styles */
function FoodCategories({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const title = props.foodCategoriesTitle || 'What are you craving?'
  const categories = props.foodCategories || []

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '32px 20px' : '48px 48px', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <style>{`
        .fc-card { transition: all 0.2s ease; cursor: pointer; }
        .fc-card:hover { transform: translate(-4px,-4px); box-shadow: 8px 8px 0px 0px ${dark} !important; }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: isSmall ? '2rem' : '2.5rem', fontWeight: '900', color: dark, margin: '0 0 32px' }}>{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
          {categories.map((cat, i) => (
            <div key={i} className="fc-card" style={{ backgroundColor: '#fff', border: `3px solid ${dark}`, borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: `4px 4px 0px 0px ${dark}` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: dark, margin: 0 }}>{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FoodItems({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const title = props.foodItemsTitle || 'Popular Dishes'
  const items = props.foodItems || []

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '32px 20px' : '48px 48px', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <style>{`
        .fi-card { transition: all 0.3s ease; }
        .fi-card:hover { transform: translate(-4px,-4px); box-shadow: 12px 12px 0px 0px ${dark} !important; }
        .fi-btn { transition: all 0.15s ease; cursor: pointer; }
        .fi-btn:hover { background-color: ${dark} !important; color: #fff !important; }
        .fi-btn:active { transform: translate(2px,2px); box-shadow: none !important; }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: isSmall ? '2rem' : '2.5rem', fontWeight: '900', color: dark, margin: '0 0 32px' }}>{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : 'repeat(2, 1fr)', gap: '32px' }}>
          {items.map((item, i) => (
            <div key={i} className="fi-card" style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', backgroundColor: '#fff', border: `4px solid ${dark}`, borderRadius: '24px', overflow: 'hidden', boxShadow: `6px 6px 0px 0px ${dark}` }}>
              <img src={item.image} alt={item.name} style={{ width: isSmall ? '100%' : '180px', height: '180px', objectFit: 'cover', borderRight: isSmall ? 'none' : `4px solid ${dark}`, borderBottom: isSmall ? `4px solid ${dark}` : 'none' }} />
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: dark, margin: 0 }}>{item.name}</h3>
                  <span style={{ fontSize: '1.2rem', fontWeight: '900', color: accent }}>{item.price}</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', margin: '0 0 20px', flex: 1 }}>{item.desc}</p>
                <button className="fi-btn" style={{ alignSelf: 'flex-start', backgroundColor: accent, color: '#fff', border: `3px solid ${dark}`, borderRadius: '12px', padding: '10px 20px', fontSize: '1rem', fontWeight: '800', boxShadow: `4px 4px 0px 0px ${dark}` }}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FoodFooter({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const brand = props.foodFooterBrand || 'Ideatefood';
  const logoUrl = props.foodFooterLogoUrl;
  const text = props.foodFooterText || 'Delivering happiness to your door.'
  const copyright = props.foodFooterCopyright || '© 2026 Ideatefood. All rights reserved.'

  return (
    <footer style={{ backgroundColor: bg, padding: isSmall ? '32px 20px' : '48px 48px', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: dark, borderRadius: '24px', padding: isSmall ? '32px 24px' : '48px 64px', display: 'flex', flexDirection: isSmall ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '24px', color: '#fff' }}>
        <div style={{ textAlign: isSmall ? 'center' : 'left' }}>
          {logoUrl ? <img src={logoUrl} alt={brand} style={{ height: '48px', objectFit: 'contain', marginBottom: '12px' }} /> : <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.04em' }}>{brand}</h2>}
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500', opacity: 0.9 }}>{text}</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {props.foodFbUrl && (
            <a href={props.foodFbUrl} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', backgroundColor: accent, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', transition: 'transform 0.2s', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1) rotate(5deg)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          )}
          {props.foodIgUrl && (
            <a href={props.foodIgUrl} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', backgroundColor: accent, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', transition: 'transform 0.2s', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1) rotate(5deg)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          )}
          {props.foodTwUrl && (
            <a href={props.foodTwUrl} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', backgroundColor: accent, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', transition: 'transform 0.2s', textDecoration: 'none' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1) rotate(5deg)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
          )}
          {(!props.foodFbUrl && !props.foodIgUrl && !props.foodTwUrl) && [1,2,3].map(i => (
            <div key={i} style={{ width: '48px', height: '48px', backgroundColor: accent, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1) rotate(5deg)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280', fontWeight: '600' }}>{copyright}</p>
      </div>
    </footer>
  )
}

export default function ElementRenderer({ element, isPreview = false, childrenSlot = null, sidebarOnly = false }) {
  const { type, props, styles } = element
  const { state, switchPage, viewportWidth } = useBuilder()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(() => element?.props?.links?.[0]?.href || null)
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSmallScreen = isMobile || isTablet

  // Derive which sidebar link matches the currently active page (for persistent sidebar)
  const currentPageHref = (() => {
    const cp = (state.pages || []).find((p) => p.id === state.currentPageId)
    if (!cp) return null
    return cp.name === 'Home' ? 'index.html' : `${cp.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.html`
  })()
  // When the sidebar is in sidebarOnly layout mode, the active link reflects the current page.
  // Match both 'index.html' and '/' for Home links stored either way.
  const effectiveActiveHref = sidebarOnly
    ? ((props.links || []).find((l) =>
      l.href === currentPageHref ||
      (currentPageHref === 'index.html' && l.href === '/')
    )?.href || activeHref)
    : activeHref

  const handleNavLinkClick = (link, e) => {
    e.preventDefault()
    setActiveHref(link.href)

    // Section scrolling works in both edit and preview mode
    if (link.linkType === 'section' || (link.href || '').startsWith('#')) {
      const targetId = (link.href || '').replace('#', '')
      const targetEl = document.getElementById(targetId)
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    // Page switching works in BOTH edit and preview (switchPage is safe in edit mode)
    if (link.linkType === 'page' || (link.href || '').endsWith('.html')) {
      const cleanHref = (link.href || '').replace(/^\/+/, '').replace(/^\.\/+/, '')
      const targetPage = (state.pages || []).find((p) => {
        const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const pSlug = p.name === 'Home' ? 'index.html' : `${slug}.html`
        return cleanHref === pSlug
      })
      if (targetPage) switchPage(targetPage.id)
      return
    }

    // External URL — only open in preview to avoid disrupting edit flow
    if (isPreview || sidebarOnly) window.open(link.href, '_blank', 'noopener')
  }

  // Compute a stable section ID from the element's unique id
  const sectionAnchorId = element.id

  // Helper: wrap result with a block-level anchor div so any element can be targeted
  // by "Section on page" navigation. We use a real block div (not display:contents)
  // because display:contents elements have no rendered box and scrollIntoView won't work.
  const withAnchor = (jsx) => {
    if (type === 'navbar') return jsx // navbars are not scroll targets
    return <div id={sectionAnchorId} style={{ display: 'block' }}>{jsx}</div>
  }

  // Template-specific element types — all wrapped with their anchor id
  if (type === 'agensea-navbar') return withAnchor(<AgenseaNavbar element={element} />)
  if (type === 'agensea-hero') return withAnchor(<AgenseaHero element={element} />)
  if (type === 'product-cards') return withAnchor(<ProductCardSection element={element} />)
  if (type === 'product-card-section') return withAnchor(<ProductCardSection element={element} />)
  if (type === 'creative-navbar') return withAnchor(<CreativeNavbar element={element} onLinkClick={handleNavLinkClick} />)
  if (type === 'creative-hero') return withAnchor(<CreativeHero element={element} />)
  if (type === 'creative-projects') return withAnchor(<CreativeProjects element={element} />)
  if (type === 'creative-footer') return withAnchor(<CreativeFooter element={element} />)
  if (type === 'solemate-navbar') return withAnchor(<SoleMateNavbar element={element} />)
  if (type === 'solemate-hero') return withAnchor(<SoleMateHero element={element} />)
  if (type === 'solemate-categories') return withAnchor(<SoleMateCategories element={element} />)
  if (type === 'solemate-products') return withAnchor(<SoleMateProducts element={element} />)
  if (type === 'solemate-footer') return withAnchor(<SoleMateFooter element={element} />)
  if (type === 'aether-products') return withAnchor(<AetherProductSection element={element} />)
  if (type === 'aether-product-section') return withAnchor(<AetherProductSection element={element} />)
  if (type === 'homehero-navbar') return withAnchor(<HHNavbar element={element} onLinkClick={handleNavLinkClick} />)
  if (type === 'homehero-hero') return withAnchor(<HHHero element={element} />)
  if (type === 'qi-navbar') return withAnchor(<QiNavbar element={element} onLinkClick={handleNavLinkClick} />)
  if (type === 'qi-hero') return withAnchor(<QiHero element={element} />)
  if (type === 'qi-products') return withAnchor(<QiProducts element={element} />)
  if (type === 'perks-section') return withAnchor(<PerksSection element={element} />)
  if (type === 'sell-home-section') return withAnchor(<SellHomeSection element={element} />)
  if (type === 'moco-navbar') return withAnchor(<MocoNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />)
  if (type === 'moco-hero') return withAnchor(<MocoHero element={element} />)
  if (type === 'food-navbar') return withAnchor(<FoodNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />)
  if (type === 'food-hero') return withAnchor(<FoodHero element={element} />)
  if (type === 'food-categories') return withAnchor(<FoodCategories element={element} />)
  if (type === 'food-items') return withAnchor(<FoodItems element={element} />)
  if (type === 'food-footer') return withAnchor(<FoodFooter element={element} />)
  if (type === 'present-section') return withAnchor(<PresentSection element={element} />)
  if (type === 'puzzle-hero') return withAnchor(<PuzzleHero element={element} />)
  if (type === 'puzzle-navbar') return withAnchor(<PuzzleNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />)
  if (type === 'trend-hero') return withAnchor(<TrendHero element={element} isPreview={isPreview} />)
  if (type === 'trend-navbar') return withAnchor(<TrendNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} />)
  if (type === 'skyline-hero') return withAnchor(<SkylineHero element={element} />)
  if (type === 'lumora-navbar') return withAnchor(<LumoraNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />)
  if (type === 'lumora-hero') return withAnchor(<LumoraHero element={element} />)
  if (type === 'lumora-marquee') return withAnchor(<LumoraMarquee element={element} />)
  if (type === 'lumora-story') return withAnchor(<LumoraStory element={element} />)
  if (type === 'lumora-products') return withAnchor(<LumoraProducts element={element} />)
  if (type === 'lumora-footer') return withAnchor(<LumoraFooter props={props} styles={styles} />)
  if (type === 'veluno-navbar') return withAnchor(<VelunoNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />)
  if (type === 'veluno-hero') return withAnchor(<VelunoHero element={element} />)
  if (type === 'winzy-navbar') return withAnchor(<WinzyNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />)
  if (type === 'winzy-hero') return withAnchor(<WinzyHero element={element} />)

  switch (type) {
    case 'navbar': {
      // Custom design template override
      if ((props.navTemplate || 'default') !== 'default') {
        if (props.navTemplate === 'otaga')
          return <OtagaNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} />
        if (props.navTemplate === 'classic-minimal')
          return <ClassicMinimalNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} />
        if (props.navTemplate === 'glass-floating')
          return <GlassFloatingNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} />
        if (props.navTemplate === 'shop')
          return <ShopNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} />
        if (props.navTemplate === 'sidebar')
          return <SidebarNavbar props={props} styles={styles} activeHref={effectiveActiveHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} sidebarOnly={sidebarOnly} />
        if (props.navTemplate === 'sidebar-tabs')
          return <SidebarTabsNavbar props={props} styles={styles} activeHref={effectiveActiveHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} sidebarOnly={sidebarOnly} />
        if (props.navTemplate === 'trend')
          return <TrendNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} />
        if (props.navTemplate === 'puzzle')
          return <PuzzleNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} isPreview={isPreview} />
        if (props.navTemplate === 'food')
          return <FoodNavbar props={props} styles={styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />
      }

      const linkColor = styles.color || '#ccc'
      const navBg = styles.backgroundColor || '#1a1a2e'
      const links = props.links || []
      const layout = props.navLayout || 'classic'
      const linkStyle = props.navLinkStyle || 'plain'
      const effect = props.navEffect || 'none'

      // ── Effect: compute container style overrides ──
      const effectStyles = effect === 'glass'
        ? { backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.15)' }
        : effect === 'bold'
          ? { borderBottom: '3px solid #4f6ef7' }
          : {}

      // ── Effect: brand renderer (bold adds icon) ──
      const Brand = ({ centerStyle = {} }) => (
        effect === 'bold' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...centerStyle }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: '#4f6ef7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', color: '#fff', flexShrink: 0 }}>
              {(props.brand || 'B')[0].toUpperCase()}
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: linkColor, letterSpacing: '-0.02em' }}>{props.brand}</span>
          </div>
        ) : (
          <div style={{ fontWeight: '700', fontSize: '1.2rem', color: linkColor, ...centerStyle }}>{props.brand}</div>
        )
      )

      // ── Link style renderer ──
      const renderLink = (link) => {
        const isActive = link.href === activeHref
        const base = { textDecoration: 'none', cursor: 'pointer', display: 'block', color: linkColor }
        if (linkStyle === 'pill') return (
          <a href={link.href || '#'} onClick={(e) => handleNavLinkClick(link, e)} style={{ ...base, fontSize: '0.85rem', fontWeight: '600', padding: '7px 18px', borderRadius: '999px', color: isActive ? '#fff' : linkColor, backgroundColor: isActive ? '#4f6ef7' : 'rgba(255,255,255,0.12)', border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)', opacity: 1 }}>{link.text}</a>
        )
        if (linkStyle === 'ghost') return (
          <a href={link.href || '#'} onClick={(e) => handleNavLinkClick(link, e)} style={{ ...base, fontSize: '0.87rem', fontWeight: '500', padding: '6px 14px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.25)', opacity: isActive ? 1 : 0.85, backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent' }}>{link.text}</a>
        )
        if (linkStyle === 'underline') return (
          <a href={link.href || '#'} onClick={(e) => handleNavLinkClick(link, e)} style={{ ...base, fontSize: '0.88rem', fontWeight: isActive ? '600' : '400', opacity: isActive ? 1 : 0.75, paddingBottom: '2px', borderBottom: isActive ? '2px solid currentColor' : '1px solid rgba(255,255,255,0.4)' }}>{link.text}</a>
        )
        if (linkStyle === 'uppercase') return (
          <a href={link.href || '#'} onClick={(e) => handleNavLinkClick(link, e)} style={{ ...base, fontSize: '0.76rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: isActive ? 1 : 0.8 }}>{link.text}</a>
        )
        // plain (default)
        return (
          <a href={link.href || '#'} onClick={(e) => handleNavLinkClick(link, e)} style={{ ...base, fontSize: '0.9rem', opacity: isActive ? 1 : 0.85, fontWeight: isActive ? '700' : '500', borderBottom: isActive ? '2px solid rgba(255,255,255,0.6)' : 'none', paddingBottom: isActive ? '2px' : '0' }}>{link.text}</a>
        )
      }

      const linkGap = (linkStyle === 'pill' || linkStyle === 'ghost') ? '6px' : linkStyle === 'underline' ? '0' : '24px'

      const LinkList = ({ items, extraStyle = {} }) => (
        <ul style={{ display: 'flex', gap: linkGap, listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap', alignItems: 'center', ...extraStyle }}>
          {items.map((link, i) => (
            <React.Fragment key={i}>
              {linkStyle === 'underline' && i > 0 && (
                <li style={{ color: linkColor, opacity: 0.25, padding: '0 6px', fontSize: '0.65rem' }}>·</li>
              )}
              <li>{renderLink(link)}</li>
            </React.Fragment>
          ))}
        </ul>
      )

      // ── Mobile + Tablet: hamburger dropdown (same for all layouts/styles) ──
      if (isSmallScreen) {
        return (
          <div style={{ position: 'relative' }}>
            <nav style={{ ...styles, ...effectStyles, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <Brand />
              <button onClick={(e) => { e.stopPropagation(); setSidebarOpen((o) => !o) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: linkColor, fontSize: '1.4rem', lineHeight: 1, padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title={sidebarOpen ? 'Close menu' : 'Open menu'}
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>
            </nav>
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: navBg, zIndex: 20, overflow: 'hidden', maxHeight: sidebarOpen ? '480px' : '0px', transition: 'max-height 0.32s cubic-bezier(0.4,0,0.2,1)', boxShadow: sidebarOpen ? '0 8px 24px rgba(0,0,0,0.25)' : 'none' }}>
              <ul style={{ listStyle: 'none', padding: '8px 20px 16px', margin: 0 }}>
                {links.map((link, i) => {
                  const isActive = link.href === activeHref
                  return (
                    <li key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <a href={link.href || '#'} onClick={(e) => { setSidebarOpen(false); handleNavLinkClick(link, e) }}
                        style={{ display: 'block', padding: '13px 4px', color: linkColor, textDecoration: 'none', fontSize: '0.95rem', fontWeight: isActive ? '700' : '500', opacity: isActive ? 1 : 0.9 }}>
                        {link.text}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )
      }

      // ── Desktop layouts (composed with any link style + effect) ──

      if (layout === 'centered') {
        return (
          <div style={{ ...styles, ...effectStyles, textAlign: 'center' }}>
            <Brand centerStyle={{ justifyContent: 'center', display: 'flex', marginBottom: '14px' }} />
            <LinkList items={links} extraStyle={{ justifyContent: 'center' }} />
          </div>
        )
      }

      if (layout === 'split') {
        const half = Math.ceil(links.length / 2)
        return (
          <nav style={{ ...styles, ...effectStyles, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', paddingRight: '24px' }}>
              <LinkList items={links.slice(0, half)} />
            </div>
            <Brand />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', paddingLeft: '24px' }}>
              <LinkList items={links.slice(half)} />
            </div>
          </nav>
        )
      }

      // ── Classic (default): brand left, links right ──
      return (
        <nav style={{ ...styles, ...effectStyles, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <Brand />
          <LinkList items={links} />
        </nav>
      )
    }

    case 'hero': {
      return (
        <section style={{ ...styles, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '60px 20px' : isTablet ? '80px 28px' : styles.padding }}>
          <style>{`.sf-btn { transition: transform 0.18s ease, box-shadow 0.18s ease !important; } .sf-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 20px rgba(0,0,0,0.18) !important; }`}</style>
          <h1 style={{ fontSize: isMobile ? '2rem' : isTablet ? '2.5rem' : '3rem', fontWeight: '800', marginBottom: '16px', lineHeight: 1.15, maxWidth: '700px', textAlign: 'center' }}>
            {props.title}
          </h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', opacity: 0.8, marginBottom: '32px', maxWidth: '560px', lineHeight: 1.6, textAlign: 'center' }}>
            {props.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {props.buttonText && (
              <a
                className="sf-btn"
                href={isPreview ? props.buttonHref : '#'}
                onClick={isPreview ? undefined : (e) => e.preventDefault()}
                style={{
                  padding: '14px 32px',
                  borderRadius: '8px',
                  backgroundColor: '#4f6ef7',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                }}
              >
                {props.buttonText}
              </a>
            )}
            {props.buttonSecondaryText && (
              <a
                className="sf-btn"
                href={isPreview ? props.buttonSecondaryHref : '#'}
                onClick={isPreview ? undefined : (e) => e.preventDefault()}
                style={{
                  padding: '14px 32px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255,255,255,0.5)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                }}
              >
                {props.buttonSecondaryText}
              </a>
            )}
          </div>
        </section>
      )
    }

    case 'trend-hero': {
      return <TrendHero element={element} isPreview={isPreview} />
    }

    case 'puzzle-hero': {
      return <PuzzleHero element={element} isPreview={isPreview} />
    }

    case 'food-navbar': {
      return <FoodNavbar props={element.props} styles={element.styles} />
    }

    case 'food-hero': {
      return <FoodHero element={element} />
    }
    case 'food-categories': {
      return <FoodCategories element={element} />
    }
    case 'food-items': {
      return <FoodItems element={element} />
    }
    case 'food-footer': {
      return <FoodFooter element={element} />
    }

    case 'puzzle-navbar': {
      return <PuzzleNavbar props={element.props} styles={element.styles} />
    }

    case 'trend-navbar': {
      return <TrendNavbar props={element.props} styles={element.styles} />
    }

    case 'present-section': {
      return <PresentSection element={element} />
    }

    case 'sell-home-section': {
      return <SellHomeSection element={element} />
    }

    case 'perks-section': {
      return <PerksSection element={element} />
    }

    case 'trusted-brands': {
      return <TrustedBrands element={element} />
    }

    
    case 'make-navbar':
      return <MakeNavbar props={element.props} styles={element.styles} activeHref={activeHref} onLinkClick={handleNavLinkClick} />
    case 'make-hero':
      return <MakeHero element={element} />

    case 'make-features': return <MakeFeatures element={element} />
    case 'make-integrations': return <MakeIntegrations element={element} />
    case 'make-pricing': return <MakePricing element={element} />
    case 'make-footer': return <MakeFooter element={element} />


    case 'skyline-hero': {
      return <SkylineHero element={element} />
    }

    case 'veluno-navbar': {
      return <VelunoNavbar props={element.props} styles={element.styles} />
    }

    case 'veluno-hero': {
      return <VelunoHero element={element} />
    }

    case 'winzy-navbar': {
      return <WinzyNavbar props={element.props} styles={element.styles} />
    }

    case 'winzy-hero': {
      return <WinzyHero element={element} />
    }

    case 'product-card-section':
      return <ProductCardSection element={element} />

    case 'creative-navbar':
      return <CreativeNavbar element={element} />

    case 'creative-hero':
      return <CreativeHero element={element} />

    case 'creative-projects':
      return <CreativeProjects element={element} />

    case 'creative-footer':
      return <CreativeFooter element={element} />

    case 'solemate-navbar':
      return <SoleMateNavbar element={element} />

    case 'solemate-hero':
      return <SoleMateHero element={element} />

    case 'solemate-categories':
      return <SoleMateCategories element={element} />

    case 'solemate-products':
      return <SoleMateProducts element={element} />

    case 'solemate-footer':
      return <SoleMateFooter element={element} />

    case 'aether-product-section':
      return <AetherProductSection element={element} />

    case 'homehero-navbar':
      return <HHNavbar element={element} />

    case 'homehero-hero':
      return <HHHero element={element} />

    case 'qi-navbar':
      return <QiNavbar element={element} />

    case 'qi-hero':
      return <QiHero element={element} />

    case 'qi-products':
      return <QiProducts element={element} />

    case 'smart-home-dashboard':
      return <SmartHomeDashboard element={element} />

    case 'agensea-navbar':
      return <AgenseaNavbar element={element} />

    case 'agensea-hero':
      return <AgenseaHero element={element} />

    case 'moco-navbar': {
      return <MocoNavbar props={element.props} styles={element.styles} />
    }

    case 'moco-hero': {
      return <MocoHero element={element} />
    }

    case 'lumora-navbar': {
      return <LumoraNavbar props={element.props} styles={element.styles} onLinkClick={(link, e) => {
        if (!isPreview) e.preventDefault()
      }} />
    }

    case 'lumora-hero':
      return <LumoraHero element={element} />

    case 'lumora-marquee':
      return <LumoraMarquee element={element} />

    case 'lumora-story':
      return <LumoraStory element={element} />

    case 'lumora-products':
      return <LumoraProducts element={element} />

    case 'lumora-footer':
      return <LumoraFooter props={element.props} styles={element.styles} />

    case 'section': {
      const sectionLayout = props.layout || 'stack'
      const sectionGap = props.gap || '24px'
      const gridCols = {
        '2-col': isMobile ? '1fr' : 'repeat(2, 1fr)',
        '3-col': isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        '4-col': isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      }[sectionLayout]

      const hasHeader = props.title || props.subtitle
      const gridStyle = gridCols
        ? { display: 'grid', gridTemplateColumns: gridCols, gap: sectionGap, alignItems: 'start', marginTop: hasHeader ? '24px' : '0' }
        : {}

      return (
        <section id={props.sectionId || element.id} style={{ ...styles, padding: isMobile ? '40px 16px' : isTablet ? '48px 24px' : styles.padding }}>
          {props.title && (
            <h2 style={{ fontSize: isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem', fontWeight: '700', marginBottom: '12px' }}>{props.title}</h2>
          )}
          {props.subtitle && (
            <p style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              {props.subtitle}
            </p>
          )}
          {isPreview ? (
            gridCols ? (
              <div style={gridStyle}>
                {(element.children || []).map((child) => (
                  <div key={child.id} style={{ gridColumn: child.props?.gridSpan === 'full' ? '1 / -1' : undefined }}>
                    <ScrollReveal animation={child.props?.animation}>
                      <ElementRenderer element={child} isPreview />
                    </ScrollReveal>
                  </div>
                ))}
              </div>
            ) : (
              (element.children || []).map((child) => (
                <ScrollReveal key={child.id} animation={child.props?.animation}>
                  <ElementRenderer element={child} isPreview />
                </ScrollReveal>
              ))
            )
          ) : childrenSlot}
        </section>
      )
    }

    case 'columns': {
      return (
        <section style={{ ...styles, padding: isMobile ? '40px 16px' : isTablet ? '48px 24px' : styles.padding }}>
          <style>{`.sf-col { transition: transform 0.25s ease, box-shadow 0.25s ease; border-radius: 16px; } .sf-col:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }`}</style>
          <div style={{ display: 'flex', gap: isMobile ? '20px' : '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(props.columns || []).map((col, i) => (
              <div key={i} className="sf-col" style={{ flex: isMobile ? '1 1 100%' : '1 1 200px', maxWidth: isMobile ? '100%' : '320px', textAlign: 'center', padding: '20px' }}>
                {col.icon && <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{col.icon}</div>}
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px' }}>{col.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.95rem' }}>{col.text}</p>
              </div>
            ))}
          </div>
        </section>
      )
    }

    case 'footer': {
      return (
        <footer style={styles}>
          <div style={{ marginBottom: '12px', fontWeight: '700', fontSize: '1.2rem', color: styles.color }}>
            {props.brand}
          </div>
          {props.tagline && (
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '16px' }}>{props.tagline}</p>
          )}
          {props.links && (
            <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              {props.links.map((link, i) => (
                <a
                  key={i}
                  href={isPreview ? link.href : '#'}
                  onClick={isPreview ? undefined : (e) => e.preventDefault()}
                  style={{ color: styles.color || '#ccc', textDecoration: 'none', opacity: 0.7, fontSize: '0.85rem' }}
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}
          <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>{props.copyright}</p>
        </footer>
      )
    }

    case 'heading': {
      const Tag = props.level || 'h2'
      return <Tag style={styles}>{props.text}</Tag>
    }

    case 'paragraph':
      return <p style={styles}>{props.text}</p>

    case 'quote':
      return (
        <blockquote style={styles}>
          <p style={{ marginBottom: '12px' }}>{props.text}</p>
          {props.author && (
            <cite style={{ fontSize: '0.9rem', fontStyle: 'normal', opacity: 0.6 }}>{props.author}</cite>
          )}
        </blockquote>
      )

    case 'image':
      return (
        <div style={styles}>
          <img
            src={props.src}
            alt={props.alt || ''}
            style={{ maxWidth: '100%', borderRadius: '8px', display: 'block', margin: '0 auto' }}
          />
          {props.caption && (
            <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>{props.caption}</p>
          )}
        </div>
      )

    case 'video':
      return (
        <div style={styles}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '800px', margin: '0 auto', borderRadius: '8px' }}>
            <iframe
              src={props.src}
              title={props.title || 'Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )

    case 'button': {
      const btnVariantStyle =
        props.variant === 'outline'
          ? { backgroundColor: 'transparent', border: '2px solid #4f6ef7', color: '#4f6ef7' }
          : props.variant === 'ghost'
            ? { backgroundColor: 'transparent', border: 'none', color: '#4f6ef7' }
            : { backgroundColor: '#4f6ef7', border: 'none', color: '#fff' }
      return (
        <div style={styles}>
          <a
            href={isPreview ? props.href : '#'}
            onClick={isPreview ? undefined : (e) => e.preventDefault()}
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
              cursor: 'pointer',
              ...btnVariantStyle,
            }}
          >
            {props.text}
          </a>
        </div>
      )
    }

    case 'card':
      return (
        <div style={styles}>
          <style>{`.sf-card { transition: transform 0.25s ease, box-shadow 0.25s ease; } .sf-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.14) !important; }`}</style>
          <div className="sf-card" style={{
            maxWidth: '360px',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            {props.image && (
              <img src={props.image} alt={props.title} style={{ width: '100%', display: 'block', height: '200px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#1a1a2e' }}>{props.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>{props.text}</p>
              {props.buttonText && (
                <a
                  href={isPreview ? props.buttonHref : '#'}
                  onClick={isPreview ? undefined : (e) => e.preventDefault()}
                  style={{ color: '#4f6ef7', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  {props.buttonText} →
                </a>
              )}
            </div>
          </div>
        </div>
      )

    case 'list': {
      const Tag = props.variant === 'ol' ? 'ol' : 'ul'
      return (
        <Tag style={{ ...styles, paddingLeft: '40px' }}>
          {(props.items || []).map((item, i) => (
            <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
          ))}
        </Tag>
      )
    }

    case 'form':
      return (
        <section style={styles}>
          {props.title && (
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '12px', color: '#1a1a2e' }}>{props.title}</h2>
          )}
          {props.subtitle && (
            <p style={{ opacity: 0.6, marginBottom: '32px', fontSize: '1rem' }}>{props.subtitle}</p>
          )}
          <form
            style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'left' }}
            onSubmit={(e) => e.preventDefault()}
          >
            {[
              { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
              { id: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' },
            ].map((field) => (
              <div key={field.id} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  readOnly={!isPreview}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#fff',
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Your message..."
                readOnly={!isPreview}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4f6ef7',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {props.submitText || 'Send Message'}
            </button>
          </form>
        </section>
      )

    case 'divider':
      return (
        <div style={styles}>
          <hr style={{ border: 'none', borderTop: `1px ${props.style || 'solid'} currentColor`, opacity: 0.3 }} />
        </div>
      )

    case 'spacer':
      return <div style={{ height: props.height || '60px', ...styles }} />

    case 'counter':
      return (
        <section style={styles}>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(props.stats || []).map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1 }}>{stat.number}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.75, marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )

    case 'testimonial':
      return (
        <section style={styles}>
          {props.avatar && (
            <img
              src={props.avatar}
              alt={props.author}
              style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 16px', display: 'block', objectFit: 'cover' }}
            />
          )}
          <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: '#374151', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.7 }}>
            "{props.text}"
          </p>
          <div>
            <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '0.95rem' }}>{props.author}</div>
            {props.role && <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '2px' }}>{props.role}</div>}
          </div>
        </section>
      )

    default:
      return withAnchor(<div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>Unknown element: {type}</div>)
  }
}
