import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import ScrollReveal from './ScrollReveal'

/* Renders an element by type with its props/styles */
export default function ElementRenderer({ element, isPreview = false, childrenSlot = null }) {
  const { type, props, styles } = element
  const { state, switchPage, viewportWidth } = useBuilder()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(() => element?.props?.links?.[0]?.href || null)
  const isMobile = viewportWidth === 'mobile'

  const handleNavLinkClick = (link, e) => {
    e.preventDefault()
    setActiveHref(link.href)
    if (!isPreview) return

    if (link.linkType === 'section') {
      // Scroll to section inside the canvas
      const targetId = (link.href || '').replace('#', '')
      const targetEl = document.getElementById(targetId)
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' })
    } else if (link.linkType === 'page') {
      // Switch to that page in the builder
      const targetHref = link.href || ''
      const targetPage = (state.pages || []).find((p) => {
        const pageHref = p.name === 'Home' ? '/' : `${p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.html`
        return pageHref === targetHref
      })
      if (targetPage) switchPage(targetPage.id)
    }
    // linkType === 'url': already prevented — no navigation in builder
  }

  switch (type) {
    case 'navbar': {
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

      // ── Mobile: hamburger dropdown (same for all layouts/styles) ──
      if (isMobile) {
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
        <section style={{ ...styles, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', lineHeight: 1.15, maxWidth: '700px' }}>
            {props.title}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '32px', maxWidth: '560px', lineHeight: 1.6 }}>
            {props.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {props.buttonText && (
              <a
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

    case 'section': {
      const sectionLayout = props.layout || 'stack'
      const sectionGap = props.gap || '24px'
      const gridCols = {
        '2-col': isMobile ? '1fr' : 'repeat(2, 1fr)',
        '3-col': isMobile ? '1fr' : 'repeat(3, 1fr)',
        '4-col': isMobile ? '1fr' : 'repeat(4, 1fr)',
      }[sectionLayout]

      const hasHeader = props.title || props.subtitle
      const gridStyle = gridCols
        ? { display: 'grid', gridTemplateColumns: gridCols, gap: sectionGap, alignItems: 'start', marginTop: hasHeader ? '24px' : '0' }
        : {}

      return (
        <section id={props.sectionId || element.id} style={styles}>
          {props.title && (
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '12px' }}>{props.title}</h2>
          )}
          {props.subtitle && (
            <p style={{ fontSize: '1.05rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
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
        <section style={styles}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(props.columns || []).map((col, i) => (
              <div key={i} style={{ flex: '1 1 200px', maxWidth: '320px', textAlign: 'center', padding: '20px' }}>
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
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
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
          <div style={{
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
      return <div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>Unknown element: {type}</div>
  }
}
