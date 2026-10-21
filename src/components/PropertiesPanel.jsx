import React, { useState, useRef } from 'react'
import { useBuilder } from '../context/BuilderContext'
import {
  FileText, Palette, Box, Monitor, Zap, Settings,
  Menu, Circle, AlignLeft, Layers, ShoppingCart, PanelLeft, LayoutDashboard, TrendingUp, Puzzle, Utensils,
  AlignCenter, AlignJustify, Minus, Square, Underline, CaseSensitive, SlidersHorizontal, Bold,
  Rows3, Columns2, Columns3, LayoutGrid,
} from 'lucide-react'

const S = {
  panel: {
    width: '100%',
    height: '100%',
    flexShrink: 0,
    minHeight: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    padding: '14px 16px',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#9ca3af',
    textAlign: 'center',
    gap: '8px',
    flex: 1,
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
  },
  tab: (active) => ({
    flex: 1,
    padding: '10px 4px',
    fontSize: '0.78rem',
    fontWeight: active ? '700' : '500',
    color: active ? '#4f6ef7' : '#6b7280',
    cursor: 'pointer',
    textAlign: 'center',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid #4f6ef7' : '2px solid transparent',
    transition: 'all 0.15s',
  }),
  section: {
    padding: '12px 14px',
    borderBottom: '1px solid #f3f4f6',
  },
  sectionTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '10px',
  },
  field: { marginBottom: '10px' },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '0.82rem',
    outline: 'none',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '0.82rem',
    outline: 'none',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '0.82rem',
    outline: 'none',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  colorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  colorInput: {
    width: '36px',
    height: '32px',
    padding: '2px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  colorText: {
    flex: 1,
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '0.8rem',
    outline: 'none',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    fontFamily: 'monospace',
  },
  rowTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  listItemRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    marginBottom: '6px',
  },
  removeBtn: {
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '4px',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: '100%',
    padding: '7px',
    background: '#eff6ff',
    color: '#4f6ef7',
    border: '1px dashed #bfdbfe',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginTop: '6px',
  },
}

function Field({ label, children }) {
  return (
    <div style={S.field}>
      {label && <label style={S.label}>{label}</label>}
      {children}
    </div>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div style={S.colorRow}>
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} style={S.colorInput} />
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={S.colorText} placeholder="#000000" />
      </div>
    </Field>
  )
}

function ImageField({ label, value, onChange }) {
  const { addUploadedImage } = useBuilder()
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = addUploadedImage(file)
    onChange(url)
    e.target.value = ''
  }

  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <input
          style={{ ...S.input, flex: 1, minWidth: 0 }}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload ↑"
        />
        <button
          onClick={() => fileRef.current?.click()}
          title="Upload image from computer"
          style={{ flexShrink: 0, padding: '6px 8px', borderRadius: '6px', border: '1px solid #e0e0e0', background: '#f3f4f6', cursor: 'pointer', fontSize: '0.75rem', color: '#374151', whiteSpace: 'nowrap' }}
        >
          ↑ Upload
        </button>
        <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {value?.startsWith('blob:') && (
        <img src={value} alt="preview" style={{ width: '100%', height: '72px', objectFit: 'cover', borderRadius: '5px', marginTop: '6px', border: '1px solid #e0e0e0' }} />
      )}
    </Field>
  )
}

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ── Reusable navigation link field (URL / section / page picker) ─────────────
function NavLinkField({ label, hrefKey, linkTypeKey, element, updateElement, sections, pages, defaultHref }) {
  const up = (propUpdates) => updateElement(element.id, { props: propUpdates })
  const currentHref = element.props[hrefKey] ?? defaultHref ?? '#'
  const currentType = element.props[linkTypeKey] ?? 'url'

  // Exclude the current page so users only see genuinely OTHER pages
  const { currentPage } = useBuilder()
  const currentPageHref = currentPage
    ? (currentPage.name === 'Home' ? 'index.html' : `${slugify(currentPage.name)}.html`)
    : null
  const otherPages = (pages || []).filter((p) => {
    const ph = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`
    return ph !== currentPageHref
  })
  const pageList = otherPages.length > 0 ? otherPages : (pages || [])

  const changeType = (newType) => {
    let href = '#'
    if (newType === 'section' && sections.length > 0) {
      const s = sections[0]
      href = `#${s.props?.sectionId || s.id}`
    } else if (newType === 'page' && pageList.length > 0) {
      const p = pageList[0]
      href = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`
    }
    up({ [linkTypeKey]: newType, [hrefKey]: href })
  }

  // Make sure the value shown in the page <select> always matches one of the options
  const resolvedPageValue = (() => {
    if (!pageList.length) return ''
    const found = pageList.find((p) => {
      const ph = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`
      return ph === currentHref
    })
    if (found) return currentHref
    // Default to first available page and persist it
    const first = pageList[0]
    return first.name === 'Home' ? 'index.html' : `${slugify(first.name)}.html`
  })()

  return (
    <div style={{ marginBottom: '10px', background: '#f9fafb', borderRadius: '6px', padding: '8px' }}>
      {label && <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px' }}>{label}</div>}
      <Field label="Link To">
        <select style={S.select} value={currentType} onChange={(e) => changeType(e.target.value)}>
          <option value="url">Custom URL</option>
          <option value="section">Section on page</option>
          <option value="page">Another page</option>
        </select>
      </Field>

      {currentType === 'url' && (
        <Field label="URL">
          <input style={S.input} value={currentHref} placeholder="https://... or #anchor"
            onChange={(e) => up({ [hrefKey]: e.target.value })} />
        </Field>
      )}

      {currentType === 'section' && (
        <Field label="Target Section">
          {sections.length === 0
            ? <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0' }}>No sections on this page yet.</p>
            : (
              <select style={S.select} value={currentHref}
                onChange={(e) => up({ [hrefKey]: e.target.value })}>
                {sections.map((sec) => {
                  // Use full id as anchor — matches the withAnchor wrapper in ElementRenderer
                  const anchorId = sec.props?.sectionId || sec.id
                  const typeLabels = {
                    'section': sec.props?.title || 'Section',
                    'hero': sec.props?.title || 'Hero',
                    'solemate-hero': 'SoleMate Hero', 'solemate-categories': 'SM Categories',
                    'solemate-products': 'SM Products', 'solemate-footer': 'SM Footer',
                    'qi-hero': 'Qi Hero', 'qi-products': 'Qi Products',
                    'creative-hero': 'Creative Hero', 'creative-projects': 'Creative Projects',
                    'creative-footer': 'Creative Footer', 'agensea-hero': 'Agensea Hero',
                    'homehero-hero': 'HomeHero', 'moco-hero': 'Moco Hero',
                    'food-hero': 'Food Hero', 'puzzle-hero': 'Puzzle Hero',
                    'trend-hero': 'Trend Hero', 'trusted-brands': 'Trusted Brands', 'skyline-hero': 'Skyline Hero', 'perks-section': sec.props?.heading || 'Perks',
                    'sell-home-section': sec.props?.shHeading || 'Sell Home',
                    'present-section': 'Presentation', 'aether-products': 'Aether Products',
                    'aether-product-section': 'Aether Products', 'product-card-section': 'Product Cards',
                    'columns': sec.props?.title || 'Columns', 'footer': sec.props?.brand || 'Footer',
                  }
                  const label = typeLabels[sec.type] ||
                    sec.type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                  return (
                    <option key={sec.id} value={`#${anchorId}`}>
                      {label} — #{anchorId.slice(0, 8)}
                    </option>
                  )
                })}
              </select>
            )
          }
        </Field>
      )}

      {currentType === 'page' && (
        <Field label="Target Page">
          {pageList.length === 0
            ? <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0' }}>Add more pages to link between them.</p>
            : (
              <select
                style={S.select}
                value={resolvedPageValue}
                onChange={(e) => up({ [hrefKey]: e.target.value })}
              >
                {pageList.map((p) => {
                  const pageHref = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`
                  return <option key={p.id} value={pageHref}>{p.name}</option>
                })}
              </select>
            )
          }
        </Field>
      )}
    </div>
  )
}

const NAVBAR_TEMPLATES = [
  { id: 'default', label: 'Default', Icon: Menu, desc: 'Classic builder style' },
  { id: 'otaga', label: 'OTAGA', Icon: Circle, desc: 'Pill links + socials' },
  { id: 'classic-minimal', label: 'Classic', Icon: AlignLeft, desc: 'Clean SaaS with CTA' },
  { id: 'glass-floating', label: 'Glass', Icon: Layers, desc: 'Frosted glass floating' },
  { id: 'shop', label: 'Shop', Icon: ShoppingCart, desc: 'E-commerce + cart' },
  { id: 'sidebar', label: 'Sidebar', Icon: PanelLeft, desc: 'Full sidebar + dashboard' },
  { id: 'sidebar-tabs', label: 'Tab Rail', Icon: LayoutDashboard, desc: 'Icon-only activity bar' },
  { id: 'trend', label: 'Trend.', Icon: TrendingUp, desc: 'Skincare / e-commerce' },
  { id: 'puzzle', label: 'Puzzle', Icon: Puzzle, desc: 'Game / app landing page' },
  { id: 'food', label: 'Food', Icon: Utensils, desc: 'Food delivery neo-brutalist' },
]

const NAV_LAYOUTS = [
  { key: 'classic', label: 'Classic', Icon: AlignLeft, desc: 'Brand left, links right' },
  { key: 'centered', label: 'Centered', Icon: AlignCenter, desc: 'Brand top, links below' },
  { key: 'split', label: 'Split', Icon: AlignJustify, desc: 'Links | Brand | Links' },
]
const NAV_LINK_STYLES = [
  { key: 'plain', label: 'Plain', Icon: Minus, desc: 'Simple text links' },
  { key: 'pill', label: 'Pill', Icon: Circle, desc: 'Rounded pill buttons' },
  { key: 'ghost', label: 'Ghost', Icon: Square, desc: 'Outlined border links' },
  { key: 'underline', label: 'Underline', Icon: Underline, desc: 'Underlined with dots' },
  { key: 'uppercase', label: 'Caps', Icon: CaseSensitive, desc: 'ALL CAPS spaced' },
]
const NAV_EFFECTS = [
  { key: 'none', label: 'Solid', Icon: SlidersHorizontal, desc: 'Solid background' },
  { key: 'glass', label: 'Glass', Icon: Layers, desc: 'Frosted glass blur' },
  { key: 'bold', label: 'Bold', Icon: Bold, desc: 'Icon logo + accent bar' },
]

function ContentTab({ element, updateElement }) {
  const { type, props, styles } = element
  const { currentPage, state } = useBuilder()
  const up = (propUpdates) => updateElement(element.id, { props: propUpdates })
  const us = (styleUpdates) => updateElement(element.id, { styles: styleUpdates })

  // Navbar types to exclude from the section picker
  const NAVBAR_TYPES = new Set(['navbar', 'solemate-navbar', 'agensea-navbar', 'creative-navbar', 'qi-navbar', 'homehero-navbar', 'moco-navbar', 'food-navbar', 'puzzle-navbar', 'trend-navbar', 'lumora-navbar'])
  // Human-readable label for each element type in the section picker
  const sectionLabel = (el, idx) => {
    const TYPE_NAMES = {
      'section': 'Section',
      'hero': 'Hero',
      'solemate-hero': 'SoleMate Hero',
      'solemate-categories': 'SM Categories',
      'solemate-products': 'SM Products',
      'solemate-footer': 'SM Footer',
      'qi-hero': 'Qi Hero',
      'qi-products': 'Qi Products',
      'creative-hero': 'Creative Hero',
      'creative-projects': 'Creative Projects',
      'creative-footer': 'Creative Footer',
      'agensea-hero': 'Agensea Hero',
      'homehero-hero': 'HomeHero Hero',
      'moco-hero': 'Moco Hero',
      'food-hero': 'Food Hero',
      'food-menu': 'Food Menu',
      'puzzle-hero': 'Puzzle Hero',
      'trend-hero': 'Trend Hero',
      'perks-section': 'Perks Section',
      'sell-home-section': 'Steps Section',
      'present-section': 'Presentation',
      'aether-products': 'Aether Products',
      'aether-product-section': 'Aether Products',
      'product-card-section': 'Product Cards',
      'columns': 'Columns',
      'footer': 'Footer',
      'lumora-navbar': 'Lumora Navbar',
      'lumora-hero': 'Lumora Hero',
      'lumora-marquee': 'Lumora Marquee',
      'lumora-story': 'Lumora Story',
      'lumora-products': 'Lumora Products',
      'lumora-footer': 'Lumora Footer',
    }
    // Try to get a meaningful name from the element's own content
    const p = el.props || {}
    const contentName =
      p.sectionId ||           // custom anchor ID set by user
      p.title ||               // generic section title
      p.heading ||             // heading text
      p.foodHeroTitle ||       // food hero
      p.trendHeading ||        // trend hero
      p.mocoHeading ||         // moco hero
      p.hhHeading ||           // homehero
      p.ccHeading ||           // creative hero
      p.agenseaRow1Text ||     // agensea hero
      p.shHeading ||           // sell-home
      p.puzzleHeroHeading ||   // puzzle hero
      p.brand ||               // footer brand
      null
    const typeName = TYPE_NAMES[el.type] || el.type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const num = idx !== undefined ? `${idx + 1}. ` : ''
    return contentName ? `${num}${typeName} — "${contentName}"` : `${num}${typeName}`
  }
  // All non-navbar elements can be scrolled to — include them all in the section picker
  const sections = (currentPage?.elements || []).filter((el) => !NAVBAR_TYPES.has(el.type))
  const pages = state.pages || []

  const updateLink = (links, idx, field, val) => {
    const updated = links.map((l, i) => (i === idx ? { ...l, [field]: val } : l))
    up({ links: updated })
  }

  const changeLinkType = (links, idx, newType) => {
    let href = '#'
    if (newType === 'section' && sections.length > 0) {
      const s = sections[0]
      href = `#${s.props?.sectionId || s.id}`
    } else if (newType === 'page' && pages.length > 0) {
      const p = pages[0]
      href = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`
    }
    const updated = links.map((l, i) => i === idx ? { ...l, linkType: newType, href } : l)
    up({ links: updated })
  }

  const renderNavLinks = (linksProp = props.links) => {
    return (
      <div style={S.section}>
        <div style={S.sectionTitle}>Nav Links</div>
        {(linksProp || []).map((link, i) => {
          const linkType = link.linkType || 'url'
          return (
            <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600' }}>Link {i + 1}</span>
                <button onClick={() => { const l = [...(linksProp || [])]; l.splice(i, 1); up({ links: l }) }} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>×</button>
              </div>
              <div style={S.rowTwo}>
                <Field label="Text"><input style={S.input} value={link.text} onChange={(e) => { const l = [...(linksProp || [])]; l[i] = { ...l[i], text: e.target.value }; up({ links: l }) }} /></Field>
                <Field label="Link To">
                  <select style={S.select} value={linkType} onChange={(e) => changeLinkType(linksProp, i, e.target.value)}>
                    <option value="url">Custom URL</option>
                    <option value="section">Section on page</option>
                    <option value="page">Another page</option>
                  </select>
                </Field>
              </div>
              {linkType === 'url' && <Field label="URL"><input style={S.input} value={link.href} placeholder="https://..." onChange={(e) => { const l = [...(linksProp || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }} /></Field>}
              {linkType === 'section' && (
                <Field label="Target Section">
                  {sections.length === 0
                    ? <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0' }}>No sections on this page yet.</p>
                    : <select style={S.select} value={link.href} onChange={(e) => { const l = [...(linksProp || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }}>
                      {sections.map((sec, si) => { const anchorId = sec.props?.sectionId || sec.id; return <option key={sec.id} value={`#${anchorId}`}>{sectionLabel(sec, si)}</option> })}
                    </select>
                  }
                </Field>
              )}
              {linkType === 'page' && (
                <Field label="Target Page">
                  <select style={S.select} value={link.href} onChange={(e) => { const l = [...(linksProp || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }}>
                    {pages.map((p) => { const ph = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`; return <option key={p.id} value={ph}>{p.name}</option> })}
                  </select>
                </Field>
              )}
            </div>
          )
        })}
        <button style={S.addBtn} onClick={() => up({ links: [...(linksProp || []), { text: 'Link', href: '#', linkType: 'url' }] })}>+ Add Link</button>
      </div>
    )
  }

  switch (type) {
    case 'navbar': {
      const VariantPicker = ({ title, items, propKey, cols = 3 }) => {
        const active = props[propKey] || items[0].key
        return (
          <div style={S.section}>
            <div style={S.sectionTitle}>{title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '6px' }}>
              {items.map((v) => {
                const isActive = active === v.key
                return (
                  <div key={v.key} onClick={() => up({ [propKey]: v.key })} title={v.desc}
                    style={{ padding: '8px 4px 7px', borderRadius: '8px', border: `2px solid ${isActive ? '#4f6ef7' : '#e8e8e8'}`, backgroundColor: isActive ? '#eff6ff' : '#fafafa', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3px', color: isActive ? '#4f6ef7' : '#6b7280' }}>{v.Icon ? <v.Icon size={15} strokeWidth={1.8} /> : v.icon}</div>
                    <div style={{ fontSize: '0.67rem', fontWeight: '700', color: isActive ? '#4f6ef7' : '#374151', lineHeight: 1.2 }}>{v.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      const activeTemplate = props.navTemplate || 'default'

      return (
        <>
          {/* ── Design Templates ── */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Design Template</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {NAVBAR_TEMPLATES.map((tpl) => {
                const isActive = activeTemplate === tpl.id
                return (
                  <div
                    key={tpl.id}
                    onClick={() => up({ navTemplate: tpl.id })}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: `2px solid ${isActive ? '#4f6ef7' : '#e8e8e8'}`,
                      backgroundColor: isActive ? '#eff6ff' : '#fafafa',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3px', color: isActive ? '#4f6ef7' : '#6b7280' }}>{tpl.Icon && <tpl.Icon size={16} strokeWidth={1.8} />}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: isActive ? '#4f6ef7' : '#374151' }}>{tpl.label}</div>
                    <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.3 }}>{tpl.desc}</div>
                  </div>
                )
              })}
            </div>
            {activeTemplate !== 'default' && (
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '8px', lineHeight: 1.4 }}>
                ✨ Custom template active — brand & links apply below.
              </p>
            )}
          </div>

          {/* OTAGA-specific style controls */}
          {activeTemplate === 'otaga' && (() => {
            const DEFAULT_SOCIALS = [
              { type: 'instagram', url: '#' },
              { type: 'dribbble', url: '#' },
              { type: 'linkedin', url: '#' },
            ]
            const ICON_OPTIONS = ['instagram', 'dribbble', 'linkedin', 'twitter', 'github', 'youtube', 'facebook', 'behance']
            const socials = props.otagaSocials || DEFAULT_SOCIALS
            const upSocials = (newList) => up({ otagaSocials: newList })

            return (
              <>
                <div style={S.section}>
                  <div style={S.sectionTitle}>OTAGA Colors</div>
                  <ColorField label="Accent Color (dot)" value={props.otagaAccent || '#60a5fa'} onChange={(v) => up({ otagaAccent: v })} />
                  <ColorField label="Active Link Color" value={props.otagaActiveColor || props.otagaAccent || '#60a5fa'} onChange={(v) => up({ otagaActiveColor: v })} />
                  <ColorField label="Pill Border" value={props.otagaPillBorder || '#f3f4f6'} onChange={(v) => up({ otagaPillBorder: v })} />
                  <ColorField label="Mobile Overlay BG" value={props.otagaOverlayBg || '#ffffff'} onChange={(v) => up({ otagaOverlayBg: v })} />
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>
                    Background &amp; text color → Style tab
                  </p>
                </div>

                <div style={S.section}>
                  <div style={S.sectionTitle}>Social Icons</div>
                  {socials.map((s, i) => (
                    <div key={i} style={{ ...S.listItemRow, marginBottom: '8px' }}>
                      <select
                        style={{ ...S.select, flex: '0 0 108px', fontSize: '0.75rem' }}
                        value={s.type}
                        onChange={(e) => upSocials(socials.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}
                      >
                        {ICON_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                      </select>
                      <input
                        style={{ ...S.input, flex: 1 }}
                        value={s.url}
                        placeholder="URL"
                        onChange={(e) => upSocials(socials.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                      />
                      <button style={S.removeBtn} onClick={() => upSocials(socials.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                  <button style={S.addBtn} onClick={() => upSocials([...socials, { type: 'instagram', url: '#' }])}>
                    + Add Icon
                  </button>
                </div>
              </>
            )
          })()}

          {/* Classic Minimal specific controls */}
          {activeTemplate === 'classic-minimal' && (
            <div style={S.section}>
              <div style={S.sectionTitle}>Classic Navbar Settings</div>
              <Field label="CTA Button Text">
                <input style={S.input} value={props.classicCtaText || 'Get Started'} onChange={(e) => up({ classicCtaText: e.target.value })} />
              </Field>
              <Field label="CTA Button URL">
                <input style={S.input} value={props.classicCtaHref || '#'} onChange={(e) => up({ classicCtaHref: e.target.value })} placeholder="#" />
              </Field>
              <ColorField label="CTA Button Color" value={props.classicCtaColor || '#6366f1'} onChange={(v) => up({ classicCtaColor: v })} />
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>
                Background &amp; text color → Style tab
              </p>
            </div>
          )}

          {/* Glass Floating specific controls */}
          {activeTemplate === 'glass-floating' && (
            <div style={S.section}>
              <div style={S.sectionTitle}>Glass Navbar Settings</div>
              <ColorField label="Active Link Accent" value={props.glassAccent || '#a78bfa'} onChange={(v) => up({ glassAccent: v })} />
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>
                Wrapper background (gradient or color) → Style tab
              </p>
            </div>
          )}

          {/* Shop specific controls */}
          {activeTemplate === 'shop' && (
            <div style={S.section}>
              <div style={S.sectionTitle}>Shop Navbar Settings</div>
              <ColorField label="Accent Color" value={props.shopAccent || '#ef4444'} onChange={(v) => up({ shopAccent: v })} />
              <Field label="Cart Item Count">
                <input style={S.input} value={props.shopCartCount !== undefined ? String(props.shopCartCount) : '3'} onChange={(e) => up({ shopCartCount: e.target.value })} placeholder="0" />
              </Field>
              <Field label="Search Placeholder">
                <input style={S.input} value={props.shopSearchPlaceholder || 'Search products...'} onChange={(e) => up({ shopSearchPlaceholder: e.target.value })} />
              </Field>
              <Field label="Wishlist Icon">
                <select style={S.select} value={props.shopShowWishlist === false ? 'false' : 'true'} onChange={(e) => up({ shopShowWishlist: e.target.value === 'true' })}>
                  <option value="true">Show</option>
                  <option value="false">Hide</option>
                </select>
              </Field>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>
                Background &amp; text color → Style tab
              </p>
            </div>
          )}

          {/* Sidebar specific controls */}
          {activeTemplate === 'sidebar' && (() => {
            const DEFAULT_STATS = [
              { label: 'Users', value: '—' },
              { label: 'Revenue', value: '—' },
              { label: 'Orders', value: '—' },
              { label: 'Growth', value: '—' },
            ]
            const sidebarStats = props.sidebarStats || DEFAULT_STATS
            return (
              <>
                <div style={S.section}>
                  <div style={S.sectionTitle}>Sidebar Colors</div>
                  <ColorField label="Active Item Color" value={props.sidebarAccent || '#818cf8'} onChange={(v) => up({ sidebarAccent: v })} />
                  <ColorField label="Content Area BG" value={props.sidebarContentBg || '#0f0e24'} onChange={(v) => up({ sidebarContentBg: v })} />
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>
                    Sidebar BG &amp; text color → Style tab
                  </p>
                </div>
                <div style={S.section}>
                  <div style={S.sectionTitle}>Header Bar</div>
                  <Field label="Page Title">
                    <input style={S.input} value={props.sidebarPageTitle || 'Overview'} onChange={(e) => up({ sidebarPageTitle: e.target.value })} />
                  </Field>
                </div>
                <div style={S.section}>
                  <div style={S.sectionTitle}>User Profile</div>
                  <Field label="Name">
                    <input style={S.input} value={props.sidebarUserName || 'Admin User'} onChange={(e) => up({ sidebarUserName: e.target.value })} />
                  </Field>
                  <Field label="Role">
                    <input style={S.input} value={props.sidebarUserRole || 'Administrator'} onChange={(e) => up({ sidebarUserRole: e.target.value })} />
                  </Field>
                  <Field label="Initials (avatar)">
                    <input style={S.input} value={props.sidebarUserInitials || 'AB'} onChange={(e) => up({ sidebarUserInitials: e.target.value })} maxLength={3} />
                  </Field>
                </div>
                <div style={S.section}>
                  <div style={S.sectionTitle}>Stats Cards</div>
                  {sidebarStats.map((s, i) => (
                    <div key={i} style={{ ...S.listItemRow, marginBottom: '8px' }}>
                      <input
                        style={{ ...S.input, flex: '0 0 90px', fontSize: '0.75rem' }}
                        value={s.label}
                        placeholder="Label"
                        onChange={(e) => up({ sidebarStats: sidebarStats.map((x, j) => j === i ? { ...x, label: e.target.value } : x) })}
                      />
                      <input
                        style={{ ...S.input, flex: 1 }}
                        value={s.value}
                        placeholder="Value"
                        onChange={(e) => up({ sidebarStats: sidebarStats.map((x, j) => j === i ? { ...x, value: e.target.value } : x) })}
                      />
                      <button style={S.removeBtn} onClick={() => up({ sidebarStats: sidebarStats.filter((_, j) => j !== i) })}>×</button>
                    </div>
                  ))}
                  <button style={S.addBtn} onClick={() => up({ sidebarStats: [...sidebarStats, { label: 'Stat', value: '—' }] })}>
                    + Add Stat
                  </button>
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '6px', lineHeight: 1.4 }}>
                    Icons auto-detect from nav link names: Home, Settings, Users, Analytics, Inbox, Products
                  </p>
                </div>
              </>
            )
          })()}

          {/* Sidebar-tabs specific controls */}
          {activeTemplate === 'sidebar-tabs' && (
            <div style={S.section}>
              <div style={S.sectionTitle}>Tab Rail Colors</div>
              <ColorField label="Active Tab Accent" value={props.sidebarAccent || '#818cf8'} onChange={(v) => up({ sidebarAccent: v })} />
              <ColorField label="Content Area BG" value={props.sidebarContentBg || '#0f0e24'} onChange={(v) => up({ sidebarContentBg: v })} />
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>
                Rail BG &amp; icon color → Style tab
              </p>
              <div style={{ marginTop: '10px' }}>
                <div style={S.sectionTitle}>User Avatar</div>
                <Field label="Initials">
                  <input style={S.input} value={props.sidebarUserInitials || 'U'} onChange={(e) => up({ sidebarUserInitials: e.target.value })} maxLength={2} />
                </Field>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '6px', lineHeight: 1.4 }}>
                Icons auto-detect from link names: Home, Settings, Users, Analytics, Inbox, Products, Files, Search
              </p>
            </div>
          )}

          {/* Trend specific controls */}
          {activeTemplate === 'trend' && (
            <div style={S.section}>
              <div style={S.sectionTitle}>Trend Navbar Settings</div>
              <ColorField label="Accent Color" value={props.trendAccent || '#e91e63'} onChange={(v) => up({ trendAccent: v })} />
              <Field label="Search Placeholder">
                <input style={S.input} value={props.trendSearchPlaceholder || 'Search'} onChange={(e) => up({ trendSearchPlaceholder: e.target.value })} />
              </Field>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px', lineHeight: 1.4 }}>
                Clean skincare / e-commerce navbar with search bar and icon button.
              </p>
            </div>
          )}

          {/* Puzzle specific controls */}
          {activeTemplate === 'puzzle' && (
            <div style={S.section}>
              <div style={S.sectionTitle}>Puzzle Navbar Settings</div>
              <ColorField label="Logo Icon Color" value={props.puzzleAccent || '#f97316'} onChange={(v) => up({ puzzleAccent: v })} />
              <Field label="Register Button Text">
                <input style={S.input} value={props.puzzleRegisterText || 'Register'} onChange={(e) => up({ puzzleRegisterText: e.target.value })} />
              </Field>
              <ColorField label="Register Button Color" value={props.puzzleRegBtnColor || props.puzzleAccent || '#f97316'} onChange={(v) => up({ puzzleRegBtnColor: v })} />
              <Field label="Login Button Text">
                <input style={S.input} value={props.puzzleLoginText || 'Log in'} onChange={(e) => up({ puzzleLoginText: e.target.value })} />
              </Field>
              <ColorField label="Login Button Background" value={props.puzzleLoginBtnBg || props.puzzleAccent || '#f97316'} onChange={(v) => up({ puzzleLoginBtnBg: v })} />
              <ColorField label="Login Button Text Color" value={props.puzzleLoginBtnText || '#ffffff'} onChange={(v) => up({ puzzleLoginBtnText: v })} />
            </div>
          )}

          {/* Food specific controls */}
          {activeTemplate === 'food' && (
            <>
              <div style={S.section}>
                <div style={S.sectionTitle}>Food Navbar — Brand</div>
                <Field label="Brand Name">
                  <input style={S.input} value={props.foodBrand || props.brand || ''} onChange={(e) => up({ foodBrand: e.target.value })} placeholder="Ideatefood" />
                </Field>
                <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
                <ColorField label="Dark / Border Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
              </div>
              <div style={S.section}>
                <div style={S.sectionTitle}>Login Button</div>
                <Field label="Text">
                  <input style={S.input} value={props.foodLoginText || 'Log In'} onChange={(e) => up({ foodLoginText: e.target.value })} />
                </Field>
                <Field label="Link (href)">
                  <input style={S.input} value={props.foodLoginHref || ''} onChange={(e) => up({ foodLoginHref: e.target.value })} placeholder="#" />
                </Field>
                <ColorField label="Background" value={props.foodLoginBg || '#ffffff'} onChange={(v) => up({ foodLoginBg: v })} />
                <ColorField label="Text Color" value={props.foodLoginColor || props.foodDark || '#2d3436'} onChange={(v) => up({ foodLoginColor: v })} />
              </div>
              <div style={S.section}>
                <div style={S.sectionTitle}>Signup Button</div>
                <Field label="Text">
                  <input style={S.input} value={props.foodSignupText || 'Sign Up'} onChange={(e) => up({ foodSignupText: e.target.value })} />
                </Field>
                <Field label="Link (href)">
                  <input style={S.input} value={props.foodSignupHref || ''} onChange={(e) => up({ foodSignupHref: e.target.value })} placeholder="#" />
                </Field>
                <ColorField label="Background" value={props.foodSignupBg || props.foodDark || '#2d3436'} onChange={(v) => up({ foodSignupBg: v })} />
                <ColorField label="Text Color" value={props.foodSignupColor || '#ffffff'} onChange={(v) => up({ foodSignupColor: v })} />
              </div>
            </>
          )}

          {/* Layout / Style / Effect — only for default template */}
          {activeTemplate === 'default' && (
            <>
              <VariantPicker title="Layout" items={NAV_LAYOUTS} propKey="navLayout" cols={3} />
              <VariantPicker title="Link Style" items={NAV_LINK_STYLES} propKey="navLinkStyle" cols={3} />
              <VariantPicker title="Effect" items={NAV_EFFECTS} propKey="navEffect" cols={3} />
            </>
          )}

          <div style={S.section}>
            <div style={S.sectionTitle}>Brand</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Navigation Links</div>
            {(props.links || []).map((link, i) => {
              const linkType = link.linkType || 'url'
              return (
                <div key={i} style={{ marginBottom: '10px', background: '#f9fafb', borderRadius: '6px', padding: '8px' }}>
                  <div style={S.rowTwo}>
                    <Field label="Text">
                      <input style={S.input} value={link.text} onChange={(e) => updateLink(props.links, i, 'text', e.target.value)} />
                    </Field>
                    <Field label="Link To">
                      <select style={S.select} value={linkType} onChange={(e) => changeLinkType(props.links, i, e.target.value)}>
                        <option value="url">Custom URL</option>
                        <option value="section">Section on page</option>
                        <option value="page">Another page</option>
                      </select>
                    </Field>
                  </div>

                  {linkType === 'url' && (
                    <Field label="URL">
                      <input style={S.input} value={link.href} placeholder="https://..." onChange={(e) => updateLink(props.links, i, 'href', e.target.value)} />
                    </Field>
                  )}

                  {linkType === 'section' && (
                    <Field label="Target Section">
                      {sections.length === 0 ? (
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0' }}>No sections on this page yet.</p>
                      ) : (
                        <select
                          style={S.select}
                          value={link.href}
                          onChange={(e) => updateLink(props.links, i, 'href', e.target.value)}
                        >
                          {sections.map((sec) => {
                            // Use full id — matches withAnchor wrapper in ElementRenderer
                            const anchorId = sec.props?.sectionId || sec.id
                            return (
                              <option key={sec.id} value={`#${anchorId}`}>
                                {sectionLabel(sec)} — #{anchorId.slice(0, 8)}
                              </option>
                            )
                          })}
                        </select>
                      )}
                    </Field>
                  )}

                  {linkType === 'page' && (
                    <Field label="Target Page">
                      <select
                        style={S.select}
                        value={link.href}
                        onChange={(e) => updateLink(props.links, i, 'href', e.target.value)}
                      >
                        {pages.map((p) => {
                          const pageHref = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`
                          return (
                            <option key={p.id} value={pageHref}>
                              {p.name}
                            </option>
                          )
                        })}
                      </select>
                    </Field>
                  )}

                  <button style={S.removeBtn} onClick={() => up({ links: props.links.filter((_, j) => j !== i) })}>×</button>
                </div>
              )
            })}
            <button style={S.addBtn} onClick={() => up({ links: [...(props.links || []), { text: 'Link', href: '#', linkType: 'url' }] })}>
              + Add Link
            </button>
          </div>
        </>
      )
    }

    case 'lumora-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Navbar — Content</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} placeholder="Lumora" />
            </Field>
            <Field label="Cart Item Count">
              <input style={S.input} value={props.lumoraCartCount || '0'} onChange={(e) => up({ lumoraCartCount: e.target.value })} />
            </Field>
          </div>
          {renderNavLinks()}
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Navbar — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#FDFCF8'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1A1A1A'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'lumora-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Hero — Content</div>
            <Field label="Tagline">
              <input style={S.input} value={props.tagline || ''} onChange={(e) => up({ tagline: e.target.value })} />
            </Field>
            <Field label="Hero Title">
              <textarea style={S.textarea} rows={2} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
            </Field>
            <Field label="CTA Text">
              <input style={S.input} value={props.ctaText || ''} onChange={(e) => up({ ctaText: e.target.value })} />
            </Field>
            <ImageField label="Hero Image" value={props.heroImage || ''} onChange={(url) => up({ heroImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Hero — Floating Card</div>
            <ImageField label="Product Image" value={props.productImg || ''} onChange={(url) => up({ productImg: url })} />
            <Field label="Product Name">
              <input style={S.input} value={props.productName || ''} onChange={(e) => up({ productName: e.target.value })} />
            </Field>
            <Field label="Product Description">
              <textarea style={S.textarea} rows={2} value={props.productDesc || ''} onChange={(e) => up({ productDesc: e.target.value })} />
            </Field>
          </div>
        </>
      )

    case 'lumora-marquee':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Marquee — Content</div>
            <Field label="Review 1">
              <input style={S.input} value={props.review1 || ''} onChange={(e) => up({ review1: e.target.value })} />
            </Field>
            <Field label="Author 1">
              <input style={S.input} value={props.author1 || ''} onChange={(e) => up({ author1: e.target.value })} />
            </Field>
            <div style={{ height: '10px' }} />
            <Field label="Review 2">
              <input style={S.input} value={props.review2 || ''} onChange={(e) => up({ review2: e.target.value })} />
            </Field>
            <Field label="Author 2">
              <input style={S.input} value={props.author2 || ''} onChange={(e) => up({ author2: e.target.value })} />
            </Field>
            <div style={{ height: '10px' }} />
            <Field label="Trusted Text">
              <input style={S.input} value={props.trustedText || ''} onChange={(e) => up({ trustedText: e.target.value })} />
            </Field>
          </div>
        </>
      )

    case 'lumora-story':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Story — Content</div>
            <Field label="Tagline">
              <input style={S.input} value={props.tagline || ''} onChange={(e) => up({ tagline: e.target.value })} />
            </Field>
            <Field label="Story Title">
              <textarea style={S.textarea} rows={2} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
            </Field>
            <Field label="Paragraph 1">
              <textarea style={S.textarea} rows={3} value={props.storyP1 || ''} onChange={(e) => up({ storyP1: e.target.value })} />
            </Field>
            <Field label="Paragraph 2">
              <textarea style={S.textarea} rows={3} value={props.storyP2 || ''} onChange={(e) => up({ storyP2: e.target.value })} />
            </Field>
            <Field label="CTA Text">
              <input style={S.input} value={props.ctaText || ''} onChange={(e) => up({ ctaText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Story — Images</div>
            <ImageField label="Image 1 (Back)" value={props.image1 || ''} onChange={(url) => up({ image1: url })} />
            <ImageField label="Image 2 (Front)" value={props.image2 || ''} onChange={(url) => up({ image2: url })} />
          </div>
        </>
      )

    case 'lumora-products':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Products — Header</div>
            <Field label="Tagline">
              <input style={S.input} value={props.tagline || ''} onChange={(e) => up({ tagline: e.target.value })} />
            </Field>
            <Field label="Title">
              <input style={S.input} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Products</div>
            {(props.products || []).map((p, i) => (
              <div key={p.id || i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>Product {i + 1}</span>
                  <button onClick={() => up({ products: props.products.filter((_, j) => j !== i) })} style={S.removeBtn}>×</button>
                </div>
                <Field label="Tag"><input style={S.input} value={p.tag} onChange={(e) => { const lp = [...props.products]; lp[i].tag = e.target.value; up({ products: lp }) }} /></Field>
                <Field label="Name"><input style={S.input} value={p.name} onChange={(e) => { const lp = [...props.products]; lp[i].name = e.target.value; up({ products: lp }) }} /></Field>
                <Field label="Category"><input style={S.input} value={p.category} onChange={(e) => { const lp = [...props.products]; lp[i].category = e.target.value; up({ products: lp }) }} /></Field>
                <div style={S.rowTwo}>
                  <Field label="Price"><input style={S.input} value={p.price} onChange={(e) => { const lp = [...props.products]; lp[i].price = e.target.value; up({ products: lp }) }} /></Field>
                  <Field label="Old Price"><input style={S.input} value={p.oldPrice || ''} onChange={(e) => { const lp = [...props.products]; lp[i].oldPrice = e.target.value; up({ products: lp }) }} /></Field>
                </div>
                <ImageField label="Product Image" value={p.image} onChange={(url) => { const lp = [...props.products]; lp[i].image = url; up({ products: lp }) }} />
              </div>
            ))}
            <button style={S.addBtn} onClick={() => up({ products: [...(props.products || []), { id: Date.now(), tag: 'NEW', name: 'Product Name', category: 'Category', price: '$0', image: 'https://placehold.co/400' }] })}>
              + Add Product
            </button>
          </div>
        </>
      )

    case 'lumora-footer':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lumora Footer — Content</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} />
            </Field>
            <Field label="Copyright">
              <input style={S.input} value={props.copyright || ''} onChange={(e) => up({ copyright: e.target.value })} />
            </Field>
          </div>
          {renderNavLinks()}
        </>
      )

    case 'hero':
      return (
        <div style={S.section}>
          <div style={S.sectionTitle}>Hero Content</div>
          <Field label="Title">
            <textarea style={S.textarea} rows={2} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <textarea style={S.textarea} rows={3} value={props.subtitle || ''} onChange={(e) => up({ subtitle: e.target.value })} />
          </Field>
          <Field label="Primary Button Text">
            <input style={S.input} value={props.buttonText || ''} onChange={(e) => up({ buttonText: e.target.value })} />
          </Field>
          <NavLinkField
            label="Primary Button Navigation"
            hrefKey="buttonHref"
            linkTypeKey="buttonLinkType"
            element={element}
            updateElement={updateElement}
            sections={sections}
            pages={pages}
          />
          <Field label="Secondary Button Text">
            <input style={S.input} value={props.buttonSecondaryText || ''} onChange={(e) => up({ buttonSecondaryText: e.target.value })} />
          </Field>
          <NavLinkField
            label="Secondary Button Navigation"
            hrefKey="buttonSecondaryHref"
            linkTypeKey="buttonSecondaryLinkType"
            element={element}
            updateElement={updateElement}
            sections={sections}
            pages={pages}
          />
        </div>
      )

    case 'trend-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Hero — Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.trendHeading || ''} onChange={(e) => up({ trendHeading: e.target.value })} />
            </Field>
            <Field label="Highlight Word">
              <input style={S.input} value={props.trendHighlight || ''} onChange={(e) => up({ trendHighlight: e.target.value })} placeholder="word to box-highlight in heading" />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.trendDescription || ''} onChange={(e) => up({ trendDescription: e.target.value })} />
            </Field>
            <Field label="CTA Button Text">
              <input style={S.input} value={props.trendCtaText || ''} onChange={(e) => up({ trendCtaText: e.target.value })} />
            </Field>
            <NavLinkField
              label="CTA Button Navigation"
              hrefKey="trendCtaHref"
              linkTypeKey="trendCtaLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
              defaultHref="#"
            />
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Hero — Product</div>
            <ImageField label="Product Image URL" value={props.trendProductImage || ''} onChange={(url) => up({ trendProductImage: url })} />
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Hero — Social Proof</div>
            <Field label="Review Count Label">
              <input style={S.input} value={props.trendReviewCount || ''} onChange={(e) => up({ trendReviewCount: e.target.value })} placeholder="10k+" />
            </Field>
            <Field label="Star Rating">
              <input style={S.input} value={props.trendRating || ''} onChange={(e) => up({ trendRating: e.target.value })} placeholder="4.5" />
            </Field>
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Hero — Features</div>
            <Field label="Feature 1 Title">
              <input style={S.input} value={props.trendFeature1 || ''} onChange={(e) => up({ trendFeature1: e.target.value })} />
            </Field>
            <Field label="Feature 1 Description">
              <textarea style={S.textarea} rows={2} value={props.trendFeature1Desc || ''} onChange={(e) => up({ trendFeature1Desc: e.target.value })} />
            </Field>
            <Field label="Feature 2 Title (Highlighted)">
              <input style={S.input} value={props.trendFeature2 || ''} onChange={(e) => up({ trendFeature2: e.target.value })} />
            </Field>
            <Field label="Feature 2 Description">
              <textarea style={S.textarea} rows={2} value={props.trendFeature2Desc || ''} onChange={(e) => up({ trendFeature2Desc: e.target.value })} />
            </Field>
            <Field label="Feature 3 Title">
              <input style={S.input} value={props.trendFeature3 || ''} onChange={(e) => up({ trendFeature3: e.target.value })} />
            </Field>
            <Field label="Feature 3 Description">
              <textarea style={S.textarea} rows={2} value={props.trendFeature3Desc || ''} onChange={(e) => up({ trendFeature3Desc: e.target.value })} />
            </Field>
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Hero — Video Button</div>
            <Field label="Rotating Text">
              <input style={S.input} value={props.trendVideoText || ''} onChange={(e) => up({ trendVideoText: e.target.value })} placeholder="SEE PRODUCT VIDEO NOW" />
            </Field>
            <Field label="Video Link URL">
              <input style={S.input} value={props.trendVideoLink || ''} onChange={(e) => up({ trendVideoLink: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
            </Field>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>
              Link opens in new tab on Preview mode.
            </p>
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Hero — Colors</div>
            <ColorField label="Accent Color" value={props.trendAccent || '#e91e63'} onChange={(v) => up({ trendAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1e293b'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'puzzle-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Puzzle Navbar — Content</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} placeholder="puzle" />
            </Field>
            <Field label="Register Button Text">
              <input style={S.input} value={props.puzzleRegisterText || 'Register'} onChange={(e) => up({ puzzleRegisterText: e.target.value })} />
            </Field>
            <Field label="Login Button Text">
              <input style={S.input} value={props.puzzleLoginText || 'Log in'} onChange={(e) => up({ puzzleLoginText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Puzzle Navbar — Colors</div>
            <ColorField label="Accent / Icon Color" value={props.puzzleAccent || '#f97316'} onChange={(v) => up({ puzzleAccent: v })} />
            <ColorField label="Register Button Color" value={props.puzzleRegBtnColor || props.puzzleAccent || '#f97316'} onChange={(v) => up({ puzzleRegBtnColor: v })} />
            <ColorField label="Login Button BG" value={props.puzzleLoginBtnBg || props.puzzleAccent || '#f97316'} onChange={(v) => up({ puzzleLoginBtnBg: v })} />
            <ColorField label="Login Button Text" value={props.puzzleLoginBtnText || '#ffffff'} onChange={(v) => up({ puzzleLoginBtnText: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1e293b'} onChange={(v) => us({ color: v })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Nav Links</div>
            {(props.links || []).map((link, i) => {
              const linkType = link.linkType || 'url'
              return (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600' }}>Link {i + 1}</span>
                    <button onClick={() => { const l = [...(props.links || [])]; l.splice(i, 1); up({ links: l }) }} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>×</button>
                  </div>
                  <div style={S.rowTwo}>
                    <Field label="Text"><input style={S.input} value={link.text} onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], text: e.target.value }; up({ links: l }) }} /></Field>
                    <Field label="Link To">
                      <select style={S.select} value={linkType} onChange={(e) => changeLinkType(props.links, i, e.target.value)}>
                        <option value="url">Custom URL</option>
                        <option value="section">Section on page</option>
                        <option value="page">Another page</option>
                      </select>
                    </Field>
                  </div>
                  {linkType === 'url' && <Field label="URL"><input style={S.input} value={link.href} placeholder="https://..." onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }} /></Field>}
                  {linkType === 'section' && (
                    <Field label="Target Section">
                      {sections.length === 0
                        ? <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0' }}>No sections on this page yet.</p>
                        : <select style={S.select} value={link.href} onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }}>
                          {sections.map((sec) => { const anchorId = sec.props?.sectionId || sec.id; return <option key={sec.id} value={`#${anchorId}`}>{sectionLabel(sec)} — #{anchorId.slice(0, 8)}</option> })}
                        </select>
                      }
                    </Field>
                  )}
                  {linkType === 'page' && (
                    <Field label="Target Page">
                      <select style={S.select} value={link.href} onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }}>
                        {pages.map((p) => { const ph = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`; return <option key={p.id} value={ph}>{p.name}</option> })}
                      </select>
                    </Field>
                  )}
                </div>
              )
            })}
            <button style={S.addBtn} onClick={() => up({ links: [...(props.links || []), { text: 'Link', href: '#', linkType: 'url' }] })}>+ Add Link</button>
          </div>
        </>
      )

    case 'trend-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Navbar — Content</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} placeholder="trend." />
            </Field>
            <Field label="Search Placeholder">
              <input style={S.input} value={props.trendSearchPlaceholder || 'Search'} onChange={(e) => up({ trendSearchPlaceholder: e.target.value })} />
            </Field>
            <ColorField label="Accent Color" value={props.trendAccent || '#e91e63'} onChange={(v) => up({ trendAccent: v })} />
          </div>
          {renderNavLinks()}
          <div style={S.section}>
            <div style={S.sectionTitle}>Trend Navbar — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1e293b'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'food-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Navbar — Brand</div>
            <Field label="Brand Name"><input style={S.input} value={props.foodBrand || ''} onChange={(e) => up({ foodBrand: e.target.value })} placeholder="Ideatefood" /></Field>
            <ImageField label="Brand Logo URL" value={props.foodLogoUrl || ''} onChange={(url) => up({ foodLogoUrl: url })} />
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark / Border Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Login Button</div>
            <Field label="Text">
              <input style={S.input} value={props.foodLoginText || 'Log In'} onChange={(e) => up({ foodLoginText: e.target.value })} />
            </Field>
            <Field label="Link (href)">
              <input style={S.input} value={props.foodLoginHref || ''} onChange={(e) => up({ foodLoginHref: e.target.value })} placeholder="#" />
            </Field>
            <ColorField label="Background" value={props.foodLoginBg || '#ffffff'} onChange={(v) => up({ foodLoginBg: v })} />
            <ColorField label="Text Color" value={props.foodLoginColor || props.foodDark || '#2d3436'} onChange={(v) => up({ foodLoginColor: v })} />
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Signup Button</div>
            <Field label="Text">
              <input style={S.input} value={props.foodSignupText || 'Sign Up'} onChange={(e) => up({ foodSignupText: e.target.value })} />
            </Field>
            <Field label="Link (href)">
              <input style={S.input} value={props.foodSignupHref || ''} onChange={(e) => up({ foodSignupHref: e.target.value })} placeholder="#" />
            </Field>
            <ColorField label="Background" value={props.foodSignupBg || props.foodDark || '#2d3436'} onChange={(v) => up({ foodSignupBg: v })} />
            <ColorField label="Text Color" value={props.foodSignupColor || '#ffffff'} onChange={(v) => up({ foodSignupColor: v })} />
          </div>

          {renderNavLinks()}
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Navbar — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1e293b'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'food-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Hero — Content</div>
            <Field label="Title Line">
              <input style={S.input} value={props.foodHeroTitle || ''} onChange={(e) => up({ foodHeroTitle: e.target.value })} placeholder="Welcome to" />
            </Field>
            <Field label="Brand Word (highlighted)">
              <input style={S.input} value={props.foodHeroBrand || ''} onChange={(e) => up({ foodHeroBrand: e.target.value })} placeholder="Ideatefood" />
            </Field>
            <Field label="Subheading">
              <textarea style={S.textarea} rows={2} value={props.foodHeroSubheading || ''} onChange={(e) => up({ foodHeroSubheading: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.foodHeroDesc || ''} onChange={(e) => up({ foodHeroDesc: e.target.value })} />
            </Field>
            <Field label="CTA Button Text">
              <input style={S.input} value={props.foodHeroCtaText || ''} onChange={(e) => up({ foodHeroCtaText: e.target.value })} />
            </Field>
            <NavLinkField
              label="CTA Button Navigation"
              hrefKey="foodHeroCtaHref"
              linkTypeKey="foodHeroCtaLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
            />
            <Field label="Trust Text">
              <input style={S.input} value={props.foodHeroTrustText || ''} onChange={(e) => up({ foodHeroTrustText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Hero — Image & Badge</div>
            <ImageField label="Food Image URL" value={props.foodHeroImage || ''} onChange={(url) => up({ foodHeroImage: url })} />
            <Field label="Badge Main Text">
              <input style={S.input} value={props.foodHeroBadgeText || ''} onChange={(e) => up({ foodHeroBadgeText: e.target.value })} placeholder="50% OFF" />
            </Field>
            <Field label="Badge Sub Text">
              <input style={S.input} value={props.foodHeroBadgeSub || ''} onChange={(e) => up({ foodHeroBadgeSub: e.target.value })} placeholder="First Order" />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Hero — Colors</div>
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1e293b'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

        case 'food-categories':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Categories — Title</div>
            <Field label="Title">
              <input style={S.input} value={props.foodCategoriesTitle || ''} onChange={(e) => up({ foodCategoriesTitle: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Categories</div>
            {(props.foodCategories || []).map((cat, i) => (
              <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>Category {i + 1}</span>
                  <button onClick={() => up({ foodCategories: props.foodCategories.filter((_, j) => j !== i) })} style={S.removeBtn}>×</button>
                </div>
                <Field label="Icon"><input style={S.input} value={cat.icon} onChange={(e) => { const lp = [...props.foodCategories]; lp[i].icon = e.target.value; up({ foodCategories: lp }) }} /></Field>
                <Field label="Name"><input style={S.input} value={cat.name} onChange={(e) => { const lp = [...props.foodCategories]; lp[i].name = e.target.value; up({ foodCategories: lp }) }} /></Field>
              </div>
            ))}
            <button style={S.addBtn} onClick={() => up({ foodCategories: [...(props.foodCategories || []), { icon: '🍔', name: 'New Category' }] })}>
              + Add Category
            </button>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#fff0eb'} onChange={(v) => us({ backgroundColor: v })} />
          </div>
        </>
      )

    case 'food-items':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Items — Title</div>
            <Field label="Title">
              <input style={S.input} value={props.foodItemsTitle || ''} onChange={(e) => up({ foodItemsTitle: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Items</div>
            {(props.foodItems || []).map((item, i) => (
              <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>Item {i + 1}</span>
                  <button onClick={() => up({ foodItems: props.foodItems.filter((_, j) => j !== i) })} style={S.removeBtn}>×</button>
                </div>
                <Field label="Name"><input style={S.input} value={item.name} onChange={(e) => { const lp = [...props.foodItems]; lp[i].name = e.target.value; up({ foodItems: lp }) }} /></Field>
                <Field label="Price"><input style={S.input} value={item.price} onChange={(e) => { const lp = [...props.foodItems]; lp[i].price = e.target.value; up({ foodItems: lp }) }} /></Field>
                <Field label="Description"><textarea style={S.textarea} rows={2} value={item.desc} onChange={(e) => { const lp = [...props.foodItems]; lp[i].desc = e.target.value; up({ foodItems: lp }) }} /></Field>
                <ImageField label="Image URL" value={item.image} onChange={(url) => { const lp = [...props.foodItems]; lp[i].image = url; up({ foodItems: lp }) }} />
              </div>
            ))}
            <button style={S.addBtn} onClick={() => up({ foodItems: [...(props.foodItems || []), { image: 'https://placehold.co/400', name: 'New Item', price: '$0.00', desc: 'Description' }] })}>
              + Add Item
            </button>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#fff0eb'} onChange={(v) => us({ backgroundColor: v })} />
          </div>
        </>
      )

    case 'food-footer':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Footer — Content</div>
            <Field label="Brand Name"><input style={S.input} value={props.foodFooterBrand || ''} onChange={(e) => up({ foodFooterBrand: e.target.value })} /></Field>
            <ImageField label="Footer Logo URL" value={props.foodFooterLogoUrl || ''} onChange={(url) => up({ foodFooterLogoUrl: url })} />
            <Field label="Text">
              <input style={S.input} value={props.foodFooterText || ''} onChange={(e) => up({ foodFooterText: e.target.value })} />
            </Field>
            <Field label="Copyright">
              <input style={S.input} value={props.foodFooterCopyright || ''} onChange={(e) => up({ foodFooterCopyright: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Social Links</div>
            <Field label="Facebook URL">
              <input style={S.input} value={props.foodFbUrl || ''} onChange={(e) => up({ foodFbUrl: e.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Instagram URL">
              <input style={S.input} value={props.foodIgUrl || ''} onChange={(e) => up({ foodIgUrl: e.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Twitter URL">
              <input style={S.input} value={props.foodTwUrl || ''} onChange={(e) => up({ foodTwUrl: e.target.value })} placeholder="https://..." />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#fff0eb'} onChange={(v) => us({ backgroundColor: v })} />
          </div>
        </>
      )

    case 'present-section':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Presentation — Main</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={3} value={props.presentHeading || ''} onChange={(e) => up({ presentHeading: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.presentDesc || ''} onChange={(e) => up({ presentDesc: e.target.value })} />
            </Field>
            <Field label="Button Text">
              <input style={S.input} value={props.presentBtnText || ''} onChange={(e) => up({ presentBtnText: e.target.value })} />
            </Field>
            <NavLinkField
              label="Button Navigation"
              hrefKey="presentBtnHref"
              linkTypeKey="presentBtnLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
            />
            <ColorField label="Accent Color" value={props.presentAccent || '#4f46e5'} onChange={(v) => up({ presentAccent: v })} />
          </div>

          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={S.section}>
              <div style={S.sectionTitle}>Card {n} — {[, 'Management', 'Entertainment', 'Marketing', 'References'][n]}</div>
              <Field label="Title">
                <input style={S.input} value={props[`presentCard${n}Title`] || ''} onChange={(e) => up({ [`presentCard${n}Title`]: e.target.value })} />
              </Field>
              <Field label="Description">
                <textarea style={S.textarea} rows={2} value={props[`presentCard${n}Desc`] || ''} onChange={(e) => up({ [`presentCard${n}Desc`]: e.target.value })} />
              </Field>
              <ColorField label="Icon Background" value={props[`presentCard${n}IconBg`] || '#eff6ff'} onChange={(v) => up({ [`presentCard${n}IconBg`]: v })} />
              <ColorField label="Icon Color" value={props[`presentCard${n}IconColor`] || '#3b82f6'} onChange={(v) => up({ [`presentCard${n}IconColor`]: v })} />
            </div>
          ))}

          <div style={S.section}>
            <div style={S.sectionTitle}>Social Links</div>
            <Field label="Facebook URL">
              <input style={S.input} value={props.presentFb || ''} onChange={(e) => up({ presentFb: e.target.value })} placeholder="#" />
            </Field>
            <Field label="Instagram URL">
              <input style={S.input} value={props.presentIg || ''} onChange={(e) => up({ presentIg: e.target.value })} placeholder="#" />
            </Field>
            <Field label="Twitter URL">
              <input style={S.input} value={props.presentTw || ''} onChange={(e) => up({ presentTw: e.target.value })} placeholder="#" />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Presentation — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1e293b'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'trusted-brands':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Trusted Brands — Content</div>
            <Field label="Badge Text">
              <input style={S.input} value={props.tbBadgeText || ''} onChange={(e) => up({ tbBadgeText: e.target.value })} />
            </Field>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.tbHeading || ''} onChange={(e) => up({ tbHeading: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.tbDescription || ''} onChange={(e) => up({ tbDescription: e.target.value })} />
            </Field>
            <Field label="Button Text">
              <input style={S.input} value={props.tbButtonText || ''} onChange={(e) => up({ tbButtonText: e.target.value })} />
            </Field>
            <NavLinkField
              label="Button Navigation"
              hrefKey="tbButtonHref"
              linkTypeKey="tbButtonLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
            />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Trusted Brands — Icons</div>
            <Field label="Icon 1 (Go)">
              <input style={S.input} value={props.tbIcon1 || ''} onChange={(e) => up({ tbIcon1: e.target.value })} />
            </Field>
            <Field label="Icon 2 (Slack)">
              <input style={S.input} value={props.tbIcon2 || ''} onChange={(e) => up({ tbIcon2: e.target.value })} />
            </Field>
            <Field label="Icon 3 (Facebook)">
              <input style={S.input} value={props.tbIcon3 || ''} onChange={(e) => up({ tbIcon3: e.target.value })} />
            </Field>
            <Field label="Icon 4 (Vue)">
              <input style={S.input} value={props.tbIcon4 || ''} onChange={(e) => up({ tbIcon4: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Trusted Brands — Colors</div>
            <ColorField label="Accent Color" value={props.tbAccentColor || '#fbbf24'} onChange={(v) => up({ tbAccentColor: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0a0a0a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    
    case 'make-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Brand</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.makeAccent || '#a855f7'} onChange={(v) => up({ makeAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={3} value={props.makeHeading || ''} onChange={(e) => up({ makeHeading: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.makeDesc || ''} onChange={(e) => up({ makeDesc: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Actions</div>
            <Field label="Primary Button Text">
              <input style={S.input} value={props.makeCtaText || ''} onChange={(e) => up({ makeCtaText: e.target.value })} />
            </Field>
            <Field label="Secondary Button Text">
              <input style={S.input} value={props.makeSecondaryCtaText || ''} onChange={(e) => up({ makeSecondaryCtaText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Media</div>
            <ImageField label="Interface Image" value={props.makeImage} onChange={(url) => up({ makeImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.makeAccent || '#a855f7'} onChange={(v) => up({ makeAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'make-features':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.mfHeading || ''} onChange={(e) => up({ mfHeading: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.mfAccent || '#a855f7'} onChange={(v) => up({ mfAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-integrations':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.miHeading || ''} onChange={(e) => up({ miHeading: e.target.value })} />
            </Field>
            <Field label="CTA Text">
              <input style={S.input} value={props.miCtaText || ''} onChange={(e) => up({ miCtaText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.miAccent || '#a855f7'} onChange={(v) => up({ miAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-pricing':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.mpHeading || ''} onChange={(e) => up({ mpHeading: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.mpAccent || '#a855f7'} onChange={(v) => up({ mpAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-footer':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Brand">
              <input style={S.input} value={props.mftBrand || ''} onChange={(e) => up({ mftBrand: e.target.value })} />
            </Field>
            <Field label="Text">
              <textarea style={S.textarea} rows={2} value={props.mftText || ''} onChange={(e) => up({ mftText: e.target.value })} />
            </Field>
            <Field label="Copyright">
              <input style={S.input} value={props.mftCopy || ''} onChange={(e) => up({ mftCopy: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.mftAccent || '#a855f7'} onChange={(v) => up({ mftAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#94a3b8'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )


    case 'skyline-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Skyline Hero — Heading</div>
            <Field label="Heading Line 1">
              <input style={S.input} value={props.slHeadingLine1 || ''} onChange={(e) => up({ slHeadingLine1: e.target.value })} placeholder="Housing" />
            </Field>
            <Field label="Heading Line 2 (Italic)">
              <input style={S.input} value={props.slHeadingLine2 || ''} onChange={(e) => up({ slHeadingLine2: e.target.value })} placeholder="Experience" />
            </Field>
            <Field label="CTA Button Text">
              <input style={S.input} value={props.slCtaText || ''} onChange={(e) => up({ slCtaText: e.target.value })} />
            </Field>
            <NavLinkField
              label="CTA Button Navigation"
              hrefKey="slCtaHref"
              linkTypeKey="slCtaLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
            />
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.slDesc || ''} onChange={(e) => up({ slDesc: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Skyline Hero — Image</div>
            <ImageField label="Hero Image URL" value={props.slHeroImage || ''} onChange={(url) => up({ slHeroImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Skyline Hero — Testimonial</div>
            <Field label="Name">
              <input style={S.input} value={props.slTestimonialName || ''} onChange={(e) => up({ slTestimonialName: e.target.value })} />
            </Field>
            <Field label="Quote">
              <textarea style={S.textarea} rows={2} value={props.slTestimonialText || ''} onChange={(e) => up({ slTestimonialText: e.target.value })} />
            </Field>
            <ImageField label="Avatar URL" value={props.slTestimonialAvatar || ''} onChange={(url) => up({ slTestimonialAvatar: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Skyline Hero — Stats</div>
            <Field label="Stat 1 Value">
              <input style={S.input} value={props.slStat1Value || ''} onChange={(e) => up({ slStat1Value: e.target.value })} placeholder="200K+" />
            </Field>
            <Field label="Stat 1 Label">
              <input style={S.input} value={props.slStat1Label || ''} onChange={(e) => up({ slStat1Label: e.target.value })} placeholder="Happy users" />
            </Field>
            <Field label="Stat 2 Value">
              <input style={S.input} value={props.slStat2Value || ''} onChange={(e) => up({ slStat2Value: e.target.value })} placeholder="5K+" />
            </Field>
            <Field label="Stat 2 Label">
              <input style={S.input} value={props.slStat2Label || ''} onChange={(e) => up({ slStat2Label: e.target.value })} placeholder="Our partner" />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Skyline Hero — Colors</div>
            <ColorField label="Accent Color" value={props.slAccentColor || '#e86034'} onChange={(v) => up({ slAccentColor: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#fdf8f4'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'veluno-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Veluno Navbar</div>
            <Field label="Brand Text">
              <input style={S.input} value={props.vlBrand || ''} onChange={(e) => up({ vlBrand: e.target.value })} />
            </Field>
            <Field label="Search Placeholder">
              <input style={S.input} value={props.vlSearchPlaceholder || ''} onChange={(e) => up({ vlSearchPlaceholder: e.target.value })} />
            </Field>
            <Field label="Cart Count">
              <input style={S.input} value={props.vlCartCount || '0'} onChange={(e) => up({ vlCartCount: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Profile Image</div>
            <ImageField label="Image URL" value={props.vlProfileImg || ''} onChange={(url) => up({ vlProfileImg: url })} />
          </div>
          {renderNavLinks(props.links)}
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#000000'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'veluno-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Veluno Hero — Text</div>
            <Field label="Heading Left">
              <input style={S.input} value={props.vlHeadingLeft || ''} onChange={(e) => up({ vlHeadingLeft: e.target.value })} />
            </Field>
            <Field label="Heading Right">
              <input style={S.input} value={props.vlHeadingRight || ''} onChange={(e) => up({ vlHeadingRight: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={4} value={props.vlDesc || ''} onChange={(e) => up({ vlDesc: e.target.value })} />
            </Field>
            <Field label="Scroll Text">
              <input style={S.input} value={props.vlScrollText || ''} onChange={(e) => up({ vlScrollText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Veluno Hero — Tags</div>
            <Field label="Tag 1">
              <input style={S.input} value={props.vlTag1 || ''} onChange={(e) => up({ vlTag1: e.target.value })} />
            </Field>
            <Field label="Tag 2">
              <input style={S.input} value={props.vlTag2 || ''} onChange={(e) => up({ vlTag2: e.target.value })} />
            </Field>
            <Field label="Tag 3">
              <input style={S.input} value={props.vlTag3 || ''} onChange={(e) => up({ vlTag3: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Veluno Hero — Images</div>
            <ImageField label="Left Image URL" value={props.vlLeftImage || ''} onChange={(url) => up({ vlLeftImage: url })} />
            <ImageField label="Right Image URL" value={props.vlRightImage || ''} onChange={(url) => up({ vlRightImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#0c0c0c'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'winzy-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Winzy Navbar</div>
            <Field label="Brand Text">
              <input style={S.input} value={props.wzBrand || ''} onChange={(e) => up({ wzBrand: e.target.value })} />
            </Field>
            <Field label="Button Text">
              <input style={S.input} value={props.wzBtnText || ''} onChange={(e) => up({ wzBtnText: e.target.value })} />
            </Field>
          </div>
          {renderNavLinks(props.links)}
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || 'transparent'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'winzy-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Winzy Hero — Main</div>
            <ImageField label="Background Image" value={props.wzBgImg || ''} onChange={(url) => up({ wzBgImg: url })} />
            <Field label="Headline">
              <textarea style={S.textarea} rows={2} value={props.wzHeadline || ''} onChange={(e) => up({ wzHeadline: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.wzDesc || ''} onChange={(e) => up({ wzDesc: e.target.value })} />
            </Field>
            <Field label="Button Text">
              <input style={S.input} value={props.wzBtnText || ''} onChange={(e) => up({ wzBtnText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Winzy Hero — Floating Card</div>
            <ImageField label="Card Image" value={props.wzCardImg || ''} onChange={(url) => up({ wzCardImg: url })} />
            <Field label="Card Step">
              <input style={S.input} value={props.wzCardStep || ''} onChange={(e) => up({ wzCardStep: e.target.value })} />
            </Field>
            <Field label="Card Tag">
              <input style={S.input} value={props.wzCardTag || ''} onChange={(e) => up({ wzCardTag: e.target.value })} />
            </Field>
            <Field label="Card Desc">
              <input style={S.input} value={props.wzCardDesc || ''} onChange={(e) => up({ wzCardDesc: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Winzy Hero — Footer Info</div>
            <Field label="Users Count">
              <input style={S.input} value={props.wzUsersCount || ''} onChange={(e) => up({ wzUsersCount: e.target.value })} />
            </Field>
            <Field label="Rotating Text">
              <input style={S.input} value={props.wzRotateText || ''} onChange={(e) => up({ wzRotateText: e.target.value })} />
            </Field>
          </div>
        </>
      )

    case 'sell-home-section':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Left — Heading</div>
            <Field label="Heading (Line 1)">
              <input style={S.input} value={props.shHeading || ''} onChange={(e) => up({ shHeading: e.target.value })} placeholder="Sell your home." />
            </Field>
            <Field label="Highlight (Line 2)">
              <input style={S.input} value={props.shHighlight || ''} onChange={(e) => up({ shHighlight: e.target.value })} placeholder="Skip the hard parts." />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.shDesc || ''} onChange={(e) => up({ shDesc: e.target.value })} />
            </Field>
            <Field label="Button Text">
              <input style={S.input} value={props.shBtnText || ''} onChange={(e) => up({ shBtnText: e.target.value })} placeholder="Get Started Today" />
            </Field>
            <NavLinkField
              label="Button Navigation"
              hrefKey="shBtnHref"
              linkTypeKey="shBtnLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
            />
            <ColorField label="Accent Color" value={props.shAccent || '#2563eb'} onChange={(v) => up({ shAccent: v })} />
            <ColorField label="Button Background" value={props.shBtnBg || '#0f172a'} onChange={(v) => up({ shBtnBg: v })} />
            <ColorField label="Button Text Color" value={props.shBtnColor || '#ffffff'} onChange={(v) => up({ shBtnColor: v })} />
          </div>

          {[1, 2, 3].map((n) => (
            <div key={n} style={S.section}>
              <div style={S.sectionTitle}>Step {n}</div>
              <Field label="Label">
                <input style={S.input} value={props[`shStep${n}Label`] || ''} onChange={(e) => up({ [`shStep${n}Label`]: e.target.value })} placeholder={`Step ${n}`} />
              </Field>
              <Field label="Title">
                <input style={S.input} value={props[`shStep${n}Title`] || ''} onChange={(e) => up({ [`shStep${n}Title`]: e.target.value })} />
              </Field>
              <Field label="Description">
                <textarea style={S.textarea} rows={2} value={props[`shStep${n}Desc`] || ''} onChange={(e) => up({ [`shStep${n}Desc`]: e.target.value })} />
              </Field>
              <ImageField label="Image URL" value={props[`shStep${n}Image`] || ''} onChange={(url) => up({ [`shStep${n}Image`]: url })} />
            </div>
          ))}
          <div style={S.section}>
            <div style={S.sectionTitle}>Steps Section — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#0f172a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'moco-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Moco Navbar — Brand</div>
            <Field label="Logo Text">
              <input style={S.input} value={props.mocoLogo || 'Moco'} onChange={(e) => up({ mocoLogo: e.target.value })} placeholder="Moco" />
            </Field>
            <ColorField label="Accent Color" value={props.mocoAccent || '#f97316'} onChange={(v) => up({ mocoAccent: v })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Login Button</div>
            <Field label="Text">
              <input style={S.input} value={props.mocoLoginText || 'Login'} onChange={(e) => up({ mocoLoginText: e.target.value })} />
            </Field>
            <Field label="Link (href)">
              <input style={S.input} value={props.mocoLoginHref || ''} onChange={(e) => up({ mocoLoginHref: e.target.value })} placeholder="#" />
            </Field>
          </div>
          {renderNavLinks()}
          <div style={S.section}>
            <div style={S.sectionTitle}>Moco Navbar — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#0d0d1a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'moco-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Moco Hero — Heading</div>
            <Field label="Heading Text">
              <textarea style={S.textarea} rows={2} value={props.mocoHeading || ''} onChange={(e) => up({ mocoHeading: e.target.value })} placeholder="Collect your best articles" />
            </Field>
            <Field label="Highlighted Word">
              <input style={S.input} value={props.mocoHighlight || ''} onChange={(e) => up({ mocoHighlight: e.target.value })} placeholder="easily" />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.mocoDesc || ''} onChange={(e) => up({ mocoDesc: e.target.value })} />
            </Field>
            <Field label="Search Placeholder">
              <input style={S.input} value={props.mocoSearchPlaceholder || ''} onChange={(e) => up({ mocoSearchPlaceholder: e.target.value })} placeholder="Search" />
            </Field>
            <ColorField label="Accent Color" value={props.mocoAccent || '#f97316'} onChange={(v) => up({ mocoAccent: v })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Card 1 — Cream</div>
            <Field label="Title">
              <input style={S.input} value={props.mocoCard1Title || ''} onChange={(e) => up({ mocoCard1Title: e.target.value })} placeholder="Business Mindset Planning" />
            </Field>
            <Field label="Quote">
              <textarea style={S.textarea} rows={2} value={props.mocoCard1Quote || ''} onChange={(e) => up({ mocoCard1Quote: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Card 2 — Image + Overlay</div>
            <Field label="Title">
              <input style={S.input} value={props.mocoCard2Title || ''} onChange={(e) => up({ mocoCard2Title: e.target.value })} placeholder="Key Success Of Career" />
            </Field>
            <ImageField label="Image URL" value={props.mocoCard2Image || ''} onChange={(url) => up({ mocoCard2Image: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Card 3 — Light Blue</div>
            <Field label="Title">
              <input style={S.input} value={props.mocoCard3Title || ''} onChange={(e) => up({ mocoCard3Title: e.target.value })} placeholder="Management" />
            </Field>
            <ImageField label="Image URL" value={props.mocoCard3Image || ''} onChange={(url) => up({ mocoCard3Image: url })} />
            <Field label="Author Name">
              <input style={S.input} value={props.mocoCard3Author || ''} onChange={(e) => up({ mocoCard3Author: e.target.value })} placeholder="Courtney Henry" />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Card 4 — Orange</div>
            <Field label="Title">
              <input style={S.input} value={props.mocoCard4Title || ''} onChange={(e) => up({ mocoCard4Title: e.target.value })} placeholder="Masterplan Strategy" />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Moco Hero — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#0d0d1a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'perks-section': {
      const items = props.perksItems || []
      const updateItem = (i, field, val) => {
        const next = items.map((it, idx) => idx === i ? { ...it, [field]: val } : it)
        up({ perksItems: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Section</div>
            <Field label="Heading">
              <input style={S.input} value={props.perksHeading || ''} onChange={(e) => up({ perksHeading: e.target.value })} placeholder="The perks" />
            </Field>
            <ImageField label="Image URL" value={props.perksImage || ''} onChange={(url) => up({ perksImage: url })} />
          </div>

          {items.map((item, i) => (
            <div key={i} style={S.section}>
              <div style={S.sectionTitle}>Perk {i + 1}</div>
              <Field label="Badge Text">
                <input style={S.input} value={item.badge || ''} onChange={(e) => updateItem(i, 'badge', e.target.value)} placeholder="Premium" />
              </Field>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', flex: 1 }}>Badge style</span>
                <button
                  onClick={() => updateItem(i, 'badgeDark', !item.badgeDark)}
                  style={{ padding: '3px 10px', fontSize: '0.72rem', fontWeight: '600', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: item.badgeDark ? '#111827' : '#e5e7eb', color: item.badgeDark ? '#fff' : '#374151' }}
                >{item.badgeDark ? 'Dark' : 'Light'}</button>
              </div>
              <Field label="Title">
                <input style={S.input} value={item.title || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Feature title" />
              </Field>
              <Field label="Description">
                <textarea style={S.textarea} rows={3} value={item.desc || ''} onChange={(e) => updateItem(i, 'desc', e.target.value)} />
              </Field>
            </div>
          ))}

          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#f9fafb'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#111827'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'product-card-section': {
      const pcFeats = props.pcFeatures || []
      const updateFeat = (i, field, val) => {
        const next = pcFeats.map((f, idx) => idx === i ? { ...f, [field]: val } : f)
        up({ pcFeatures: next })
      }
      const ICON_OPTIONS = ['shipping', 'warranty', 'returns']
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Product — Details</div>
            <Field label="Product Name">
              <input style={S.input} value={props.pcTitle || ''} onChange={(e) => up({ pcTitle: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={{ ...S.input, height: '72px', resize: 'vertical' }} value={props.pcDescription || ''} onChange={(e) => up({ pcDescription: e.target.value })} />
            </Field>
            <Field label="Price">
              <input style={S.input} value={props.pcPrice || ''} onChange={(e) => up({ pcPrice: e.target.value })} placeholder="$1499.00" />
            </Field>
            <ImageField label="Product Image URL" value={props.pcImage || ''} onChange={(url) => up({ pcImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Buttons</div>
            <Field label="Primary Button">
              <input style={S.input} value={props.pcBtnPrimary || ''} onChange={(e) => up({ pcBtnPrimary: e.target.value })} />
            </Field>
            <Field label="Secondary Button">
              <input style={S.input} value={props.pcBtnSecondary || ''} onChange={(e) => up({ pcBtnSecondary: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Rating</div>
            <Field label="Rating (e.g. 4.8)">
              <input style={S.input} type="number" min="0" max="5" step="0.1" value={props.pcRating || '4.8'} onChange={(e) => up({ pcRating: e.target.value })} />
            </Field>
            <Field label="Review Link Text">
              <input style={S.input} value={props.pcReviewText || ''} onChange={(e) => up({ pcReviewText: e.target.value })} />
            </Field>
            <Field label="Review Link URL">
              <input style={S.input} value={props.pcReviewHref || ''} onChange={(e) => up({ pcReviewHref: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Feature Icons</div>
            {pcFeats.map((f, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <Field label={`Icon ${i + 1} Type`}>
                  <select style={{ ...S.input, cursor: 'pointer' }} value={f.icon || 'shipping'} onChange={(e) => updateFeat(i, 'icon', e.target.value)}>
                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </Field>
                <Field label={`Icon ${i + 1} Label`}>
                  <input style={S.input} value={f.label || ''} onChange={(e) => updateFeat(i, 'label', e.target.value)} />
                </Field>
              </div>
            ))}
          </div>
          <div style={S.section}>
            <ColorField label="Accent Color" value={props.pcAccent || '#4361ee'} onChange={(v) => up({ pcAccent: v })} />
            <ColorField label="Card Background" value={'#ffffff'} onChange={() => { }} />
            <ColorField label="Outer Background" value={styles?.backgroundColor || '#ebecf0'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'creative-navbar': {
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Creative Navbar — Brand</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.ccBrand || ''} onChange={(e) => up({ ccBrand: e.target.value })} />
            </Field>
          </div>
          {renderNavLinks()}
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'creative-hero': {
      const ccImages = props.ccHeroImages || []
      const updateCCImg = (i, val) => {
        const next = [...ccImages]; next[i] = val; up({ ccHeroImages: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Creative Hero — Text</div>
            <Field label="Heading">
              <input style={S.input} value={props.ccHeading || ''} onChange={(e) => up({ ccHeading: e.target.value })} />
            </Field>
            <Field label="Subtitle">
              <input style={S.input} value={props.ccSubtitle || ''} onChange={(e) => up({ ccSubtitle: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Slideshow Images (4)</div>
            {ccImages.map((img, i) => (
              <ImageField key={i} label={`Slide ${i + 1}`} value={img || ''} onChange={(url) => updateCCImg(i, url)} />
            ))}
          </div>
          <div style={S.section}>
            <ColorField label="Text Color" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'creative-projects': {
      const ccProjects = props.ccProjects || []
      const updateProj = (i, field, val) => {
        const next = ccProjects.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
        up({ ccProjects: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Creative Projects</div>
            <Field label="Button Text">
              <input style={S.input} value={props.ccBtnText || ''} onChange={(e) => up({ ccBtnText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Project Cards</div>
            {ccProjects.map((p, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <ImageField label={`Card ${i + 1} Image`} value={p.image || ''} onChange={(url) => updateProj(i, 'image', url)} />
                <Field label={`Card ${i + 1} Title`}>
                  <input style={S.input} value={p.title || ''} onChange={(e) => updateProj(i, 'title', e.target.value)} />
                </Field>
                <Field label={`Card ${i + 1} Category`}>
                  <input style={S.input} value={p.category || ''} onChange={(e) => updateProj(i, 'category', e.target.value)} />
                </Field>
                <ColorField label={`Card ${i + 1} BG Color`} value={p.bgColor || '#f3f4f6'} onChange={(v) => updateProj(i, 'bgColor', v)} />
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Button Navigation</div>
                  <select
                    style={S.select}
                    value={p.linkType || 'url'}
                    onChange={(e) => {
                      const newType = e.target.value
                      let href = '#'
                      if (newType === 'section' && sections.length > 0) {
                        const s = sections[0]; href = `#${s.props.sectionId || s.id}`
                      } else if (newType === 'page' && pages.length > 0) {
                        const pg = pages[0]; href = pg.name === 'Home' ? 'index.html' : `${slugify(pg.name)}.html`
                      }
                      // Single atomic update — fixes stale-closure bug where two separate
                      // updateProj calls each read the original ccProjects, so the second
                      // call (href) wiped out the first (linkType), always reverting to 'url'.
                      const next = ccProjects.map((proj, idx) =>
                        idx === i ? { ...proj, linkType: newType, href } : proj
                      )
                      up({ ccProjects: next })
                    }}
                  >
                    <option value="url">Custom URL</option>
                    <option value="section">Section on page</option>
                    <option value="page">Another page</option>
                  </select>
                </div>
                {(p.linkType || 'url') === 'url' && (
                  <Field label={`Card ${i + 1} URL`}>
                    <input style={S.input} value={p.href || '#'} placeholder="https://..." onChange={(e) => updateProj(i, 'href', e.target.value)} />
                  </Field>
                )}
                {(p.linkType || 'url') === 'section' && sections.length > 0 && (
                  <Field label="Target Section">
                    <select style={S.select} value={p.href || '#'} onChange={(e) => updateProj(i, 'href', e.target.value)}>
                      {sections.map((sec) => {
                        const anchorId = sec.props.sectionId || sec.id.slice(0, 8)
                        return <option key={sec.id} value={`#${anchorId}`}>{sec.props.title || 'Untitled'} — #{anchorId}</option>
                      })}
                    </select>
                  </Field>
                )}
                {(p.linkType || 'url') === 'page' && (
                  <Field label="Target Page">
                    <select style={S.select} value={p.href || '#'} onChange={(e) => updateProj(i, 'href', e.target.value)}>
                      {pages.map((pg) => {
                        const pageHref = pg.name === 'Home' ? 'index.html' : `${slugify(pg.name)}.html`
                        return <option key={pg.id} value={pageHref}>{pg.name}</option>
                      })}
                    </select>
                  </Field>
                )}
              </div>
            ))}
          </div>
          <div style={S.section}>
            <ColorField label="Section Background" value={styles?.backgroundColor || '#f9f9f9'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'creative-footer': {
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Creative Footer</div>
            <Field label="Copyright Text">
              <input style={S.input} value={props.ccCopyright || ''} onChange={(e) => up({ ccCopyright: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Social Links</div>
            <Field label="Facebook URL">
              <input style={S.input} value={props.ccFacebookHref || '#'} onChange={(e) => up({ ccFacebookHref: e.target.value })} />
            </Field>
            <Field label="Twitter URL">
              <input style={S.input} value={props.ccTwitterHref || '#'} onChange={(e) => up({ ccTwitterHref: e.target.value })} />
            </Field>
            <Field label="Instagram URL">
              <input style={S.input} value={props.ccInstagramHref || '#'} onChange={(e) => up({ ccInstagramHref: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'solemate-navbar': {
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>SoleMate Navbar — Brand</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.smBrand || ''} onChange={(e) => up({ smBrand: e.target.value })} />
            </Field>
            <Field label="Search Placeholder">
              <input style={S.input} value={props.smSearchPlaceholder || ''} onChange={(e) => up({ smSearchPlaceholder: e.target.value })} />
            </Field>
            <Field label="Cart Count">
              <input style={S.input} type="number" min="0" value={props.smCartCount || '1'} onChange={(e) => up({ smCartCount: e.target.value })} />
            </Field>
          </div>
          {renderNavLinks()}
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'solemate-hero': {
      const smHeroImages = props.smHeroImages || []
      const updateHeroImg = (i, val) => {
        const next = [...smHeroImages]; next[i] = val; up({ smHeroImages: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>SoleMate Hero</div>
            <Field label="CTA Button Text">
              <input style={S.input} value={props.smHeroCtaText || ''} onChange={(e) => up({ smHeroCtaText: e.target.value })} />
            </Field>
            <NavLinkField
              label="CTA Button Navigation"
              hrefKey="smHeroCtaHref"
              linkTypeKey="smHeroCtaLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
              defaultHref="#"
            />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Panel Images (5)</div>
            {smHeroImages.map((img, i) => (
              <ImageField key={i} label={`Panel ${i + 1}`} value={img || ''} onChange={(url) => updateHeroImg(i, url)} />
            ))}
          </div>
        </>
      )
    }

    case 'solemate-categories': {
      const catLabels = props.smCatLabels || ["Men's", "Women's", "New Arrivals", "Sale"]
      const imgsMens = props.smImgsMens || []
      const imgsWomens = props.smImgsWomens || []
      const imgsNew = props.smImgsNew || []
      const imgsSale = props.smImgsSale || []
      const updateCatLabel = (i, val) => {
        const next = [...catLabels]; next[i] = val; up({ smCatLabels: next })
      }
      const updateImgGroup = (key, arr, i, val) => {
        const next = [...arr]; next[i] = val; up({ [key]: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Category Tab Labels</div>
            {catLabels.map((label, i) => (
              <Field key={i} label={`Tab ${i + 1} Label`}>
                <input style={S.input} value={label} onChange={(e) => updateCatLabel(i, e.target.value)} />
              </Field>
            ))}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Tab 1 Images ({catLabels[0]})</div>
            {imgsMens.map((img, i) => (
              <ImageField key={i} label={`Image ${i + 1}`} value={img || ''} onChange={(url) => updateImgGroup('smImgsMens', imgsMens, i, url)} />
            ))}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Tab 2 Images ({catLabels[1]})</div>
            {imgsWomens.map((img, i) => (
              <ImageField key={i} label={`Image ${i + 1}`} value={img || ''} onChange={(url) => updateImgGroup('smImgsWomens', imgsWomens, i, url)} />
            ))}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Tab 3 Images ({catLabels[2]})</div>
            {imgsNew.map((img, i) => (
              <ImageField key={i} label={`Image ${i + 1}`} value={img || ''} onChange={(url) => updateImgGroup('smImgsNew', imgsNew, i, url)} />
            ))}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Tab 4 Images ({catLabels[3]})</div>
            {imgsSale.map((img, i) => (
              <ImageField key={i} label={`Image ${i + 1}`} value={img || ''} onChange={(url) => updateImgGroup('smImgsSale', imgsSale, i, url)} />
            ))}
          </div>
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'solemate-products': {
      const smProds = props.smProducts || []
      const updateProd = (i, field, val) => {
        const next = smProds.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
        up({ smProducts: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>SoleMate Products</div>
            <Field label="Section Title">
              <input style={S.input} value={props.smFeaturedTitle || ''} onChange={(e) => up({ smFeaturedTitle: e.target.value })} />
            </Field>
            <Field label="Cart Button Text">
              <input style={S.input} value={props.smCartBtnText || ''} onChange={(e) => up({ smCartBtnText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Products</div>
            {smProds.map((p, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <ImageField label={`Product ${i + 1} Image`} value={p.image || ''} onChange={(url) => updateProd(i, 'image', url)} />
                <Field label={`Product ${i + 1} Name`}>
                  <input style={S.input} value={p.name || ''} onChange={(e) => updateProd(i, 'name', e.target.value)} />
                </Field>
                <Field label={`Product ${i + 1} Price`}>
                  <input style={S.input} value={p.price || ''} onChange={(e) => updateProd(i, 'price', e.target.value)} placeholder="18.90" />
                </Field>
              </div>
            ))}
          </div>
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'solemate-footer': {
      const smFooterLinks = props.smFooterLinks || []
      const updateFLink = (i, field, val) => {
        const next = smFooterLinks.map((l, idx) => idx === i ? { ...l, [field]: val } : l)
        up({ smFooterLinks: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>SoleMate Footer — Links</div>
            {smFooterLinks.map((l, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <Field label={`Link ${i + 1} Text`}>
                  <input style={S.input} value={l.text || ''} onChange={(e) => updateFLink(i, 'text', e.target.value)} />
                </Field>
                <Field label={`Link ${i + 1} URL`}>
                  <input style={S.input} value={l.href || ''} onChange={(e) => updateFLink(i, 'href', e.target.value)} />
                </Field>
              </div>
            ))}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Social Links</div>
            <Field label="Twitter URL">
              <input style={S.input} value={props.smTwitterHref || '#'} onChange={(e) => up({ smTwitterHref: e.target.value })} />
            </Field>
            <Field label="Instagram URL">
              <input style={S.input} value={props.smInstagramHref || '#'} onChange={(e) => up({ smInstagramHref: e.target.value })} />
            </Field>
            <Field label="Facebook URL">
              <input style={S.input} value={props.smFacebookHref || '#'} onChange={(e) => up({ smFacebookHref: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#000000'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'aether-product-section': {
      const afImages = props.afImages || []
      const afSpecs = props.afSpecs || []
      const afOptions = props.afOptions || []
      const updateImage = (i, val) => {
        const next = [...afImages]; next[i] = val; up({ afImages: next })
      }
      const updateSpec = (i, field, val) => {
        const next = afSpecs.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
        up({ afSpecs: next })
      }
      const updateOption = (i, val) => {
        const next = [...afOptions]; next[i] = val; up({ afOptions: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>AetherFlow — Hero</div>
            <Field label="Product Title">
              <input style={S.input} value={props.afTitle || ''} onChange={(e) => up({ afTitle: e.target.value })} />
            </Field>
            <Field label="Subtitle">
              <input style={S.input} value={props.afSubtitle || ''} onChange={(e) => up({ afSubtitle: e.target.value })} />
            </Field>
            <Field label="CTA Button Text">
              <input style={S.input} value={props.afCtaText || ''} onChange={(e) => up({ afCtaText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Gallery Images (5)</div>
            {afImages.map((img, i) => (
              <ImageField key={i} label={`Image ${i + 1}`} value={img || ''} onChange={(url) => updateImage(i, url)} />
            ))}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Specifications</div>
            {afSpecs.map((s, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <Field label={`Spec ${i + 1} Label`}>
                  <input style={S.input} value={s.label || ''} onChange={(e) => updateSpec(i, 'label', e.target.value)} />
                </Field>
                <Field label={`Spec ${i + 1} Value`}>
                  <input style={S.input} value={s.value || ''} onChange={(e) => updateSpec(i, 'value', e.target.value)} />
                </Field>
              </div>
            ))}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Buy Now</div>
            <Field label="Price">
              <input style={S.input} value={props.afPrice || ''} onChange={(e) => up({ afPrice: e.target.value })} placeholder="$999.00" />
            </Field>
            <Field label="Stock Badge Text">
              <input style={S.input} value={props.afStockText || ''} onChange={(e) => up({ afStockText: e.target.value })} placeholder="In Stock" />
            </Field>
            <Field label="Buy Button Text">
              <input style={S.input} value={props.afBtnText || ''} onChange={(e) => up({ afBtnText: e.target.value })} />
            </Field>
            <Field label="Select Label">
              <input style={S.input} value={props.afSelectLabel || ''} onChange={(e) => up({ afSelectLabel: e.target.value })} />
            </Field>
            {afOptions.map((opt, i) => (
              <Field key={i} label={`Option ${i + 1}`}>
                <input style={S.input} value={opt} onChange={(e) => updateOption(i, e.target.value)} />
              </Field>
            ))}
          </div>
          <div style={S.section}>
            <ColorField label="Outer Background" value={styles?.backgroundColor || '#f3f4f6'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'homehero-navbar': {
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>HomeHero Navbar — Brand</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.hhBrand || 'HomeHero'} onChange={(e) => up({ hhBrand: e.target.value })} />
            </Field>
            <Field label="Badge Text">
              <input style={S.input} value={props.hhBadge || 'HH'} onChange={(e) => up({ hhBadge: e.target.value })} maxLength={4} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>CTA Button</div>
            <Field label="Button Text">
              <input style={S.input} value={props.hhCtaText || 'Join the Beta'} onChange={(e) => up({ hhCtaText: e.target.value })} />
            </Field>
          </div>
          {renderNavLinks()}
          <div style={S.section}>
            <ColorField label="Accent (Badge)" value={props.hhAccent || '#4F46E5'} onChange={(v) => up({ hhAccent: v })} />
            <ColorField label="CTA Button" value={props.hhCoral || '#FF5A5F'} onChange={(v) => up({ hhCoral: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'homehero-hero': {
      const hhPhItems = props.hhPhoneItems || []
      const updatePhItem = (i, field, val) => {
        const next = hhPhItems.map((it, idx) => idx === i ? { ...it, [field]: val } : it)
        up({ hhPhoneItems: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>HomeHero Hero — Text</div>
            <Field label="Heading">
              <textarea style={{ ...S.input, height: '64px', resize: 'vertical' }} value={props.hhHeading || ''} onChange={(e) => up({ hhHeading: e.target.value })} />
            </Field>
            <Field label="Subtitle">
              <textarea style={{ ...S.input, height: '80px', resize: 'vertical' }} value={props.hhSubtitle || ''} onChange={(e) => up({ hhSubtitle: e.target.value })} />
            </Field>
            <Field label="Email Placeholder">
              <input style={S.input} value={props.hhEmailPlaceholder || ''} onChange={(e) => up({ hhEmailPlaceholder: e.target.value })} />
            </Field>
            <Field label="CTA Button Text">
              <input style={S.input} value={props.hhCtaText || ''} onChange={(e) => up({ hhCtaText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Portrait Images</div>
            <ImageField label="Portrait 1 (Top Left)" value={props.hhPortrait1 || ''} onChange={(url) => up({ hhPortrait1: url })} />
            <ImageField label="Portrait 2 (Bottom Left)" value={props.hhPortrait2 || ''} onChange={(url) => up({ hhPortrait2: url })} />
            <ImageField label="Portrait 3 (Mid Right)" value={props.hhPortrait3 || ''} onChange={(url) => up({ hhPortrait3: url })} />
            <ImageField label="Portrait 4 (Bottom Right)" value={props.hhPortrait4 || ''} onChange={(url) => up({ hhPortrait4: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Phone Mockup</div>
            <Field label="User Name">
              <input style={S.input} value={props.hhPhoneUser || ''} onChange={(e) => up({ hhPhoneUser: e.target.value })} />
            </Field>
            <Field label="Message">
              <textarea style={{ ...S.input, height: '64px', resize: 'vertical' }} value={props.hhPhoneMessage || ''} onChange={(e) => up({ hhPhoneMessage: e.target.value })} />
            </Field>
            {hhPhItems.map((item, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <Field label={`Item ${i + 1} Label`}>
                  <input style={S.input} value={item.label || ''} onChange={(e) => updatePhItem(i, 'label', e.target.value)} />
                </Field>
                <Field label={`Item ${i + 1} Count`}>
                  <input style={S.input} value={item.count || ''} onChange={(e) => updatePhItem(i, 'count', e.target.value)} />
                </Field>
              </div>
            ))}
          </div>
          <div style={S.section}>
            <ColorField label="Accent Color" value={props.hhAccent || '#4F46E5'} onChange={(v) => up({ hhAccent: v })} />
            <ColorField label="CTA Button" value={props.hhCoral || '#FF5A5F'} onChange={(v) => up({ hhCoral: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'qi-navbar': {
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>The Qi Navbar — Brand</div>
            <Field label="Logo Text">
              <input style={S.input} value={props.qiBrand || 'The Qi'} onChange={(e) => up({ qiBrand: e.target.value })} />
            </Field>
          </div>
          {renderNavLinks()}
          <div style={S.section}>
            <div style={S.sectionTitle}>Cart & Account</div>
            <Field label="Cart Text">
              <input style={S.input} value={props.qiCartText || 'Cart'} onChange={(e) => up({ qiCartText: e.target.value })} />
            </Field>
            <Field label="Cart Count">
              <input style={S.input} value={props.qiCartCount || '0'} onChange={(e) => up({ qiCartCount: e.target.value })} />
            </Field>
            <Field label="Account Text">
              <input style={S.input} value={props.qiAccountText || 'Account'} onChange={(e) => up({ qiAccountText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#f7f7f5'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'qi-hero': {
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>The Qi Hero — Text</div>
            <Field label="Top Heading">
              <input style={S.input} value={props.qiTopText || 'In Flowers'} onChange={(e) => up({ qiTopText: e.target.value })} />
            </Field>
            <Field label="Bottom Heading">
              <input style={S.input} value={props.qiBottomText || 'We Trust'} onChange={(e) => up({ qiBottomText: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={{ ...S.input, height: '72px', resize: 'vertical' }} value={props.qiDesc || ''} onChange={(e) => up({ qiDesc: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Image</div>
            <ImageField label="Image URL" value={props.qiImage || ''} onChange={(url) => up({ qiImage: url })} />
          </div>
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#f7f7f5'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'qi-products': {
      const qiProds = props.qiProducts || []
      const updateProd = (i, field, val) => {
        const next = qiProds.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
        up({ qiProducts: next })
      }
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>The Qi Products — Header</div>
            <Field label="Section Heading">
              <input style={S.input} value={props.qiProdHeading || 'Selected Blossoms'} onChange={(e) => up({ qiProdHeading: e.target.value })} />
            </Field>
            <Field label="View All Text">
              <input style={S.input} value={props.qiProdViewAll || 'View All Shop'} onChange={(e) => up({ qiProdViewAll: e.target.value })} />
            </Field>
            <NavLinkField
              label="View All Navigation"
              hrefKey="qiProdViewAllHref"
              linkTypeKey="qiProdViewAllLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
              defaultHref="#"
            />
          </div>
          {qiProds.map((p, i) => (
            <div key={i} style={S.section}>
              <div style={S.sectionTitle}>Product {i + 1}</div>
              <Field label="Name">
                <input style={S.input} value={p.name || ''} onChange={(e) => updateProd(i, 'name', e.target.value)} />
              </Field>
              <Field label="Subtitle">
                <input style={S.input} value={p.subtitle || ''} onChange={(e) => updateProd(i, 'subtitle', e.target.value)} />
              </Field>
              <Field label="Price">
                <input style={S.input} value={p.price || ''} onChange={(e) => updateProd(i, 'price', e.target.value)} />
              </Field>
              <ImageField label="Image URL" value={p.image || ''} onChange={(url) => updateProd(i, 'image', url)} />
            </div>
          ))}
          <div style={S.section}>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1a1a1a'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    }

    case 'agensea-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Agensea Navbar — Brand</div>
            <Field label="Logo Text">
              <input style={S.input} value={props.agenseaBrand || 'THE AGENSEA'} onChange={(e) => up({ agenseaBrand: e.target.value })} />
            </Field>
            <ColorField label="Accent (Wave Color)" value={props.agenseaAccent || '#3b82f6'} onChange={(v) => up({ agenseaAccent: v })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>CTA Button</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Show button</span>
              <button
                onClick={() => up({ agenseaShowCta: props.agenseaShowCta === false ? true : false })}
                style={{ padding: '3px 10px', fontSize: '0.72rem', fontWeight: '600', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: props.agenseaShowCta === false ? '#e5e7eb' : '#4f6ef7', color: props.agenseaShowCta === false ? '#374151' : '#fff' }}
              >{props.agenseaShowCta === false ? 'Hidden' : 'Visible'}</button>
            </div>
            <Field label="Text">
              <input style={S.input} value={props.agenseaCtaText || 'Donate'} onChange={(e) => up({ agenseaCtaText: e.target.value })} />
            </Field>
            <NavLinkField
              label="CTA Button Navigation"
              hrefKey="agenseaCtaHref"
              linkTypeKey="agenseaCtaLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
              defaultHref="#"
            />
          </div>
          <div style={S.section}>
            <div style={{ ...S.sectionTitle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Nav Links
              <button onClick={() => up({ links: [...(props.links || []), { text: 'New Link', href: '#', linkType: 'url' }] })} style={{ fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px', background: '#4f6ef7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add</button>
            </div>
            {(props.links || []).map((link, i) => {
              const linkType = link.linkType || 'url'
              return (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600' }}>Link {i + 1}</span>
                    <button onClick={() => { const l = [...(props.links || [])]; l.splice(i, 1); up({ links: l }) }} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>×</button>
                  </div>
                  <div style={S.rowTwo}>
                    <Field label="Text"><input style={S.input} value={link.text} onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], text: e.target.value }; up({ links: l }) }} /></Field>
                    <Field label="Link To">
                      <select style={S.select} value={linkType} onChange={(e) => changeLinkType(props.links, i, e.target.value)}>
                        <option value="url">Custom URL</option>
                        <option value="section">Section on page</option>
                        <option value="page">Another page</option>
                      </select>
                    </Field>
                  </div>
                  {linkType === 'url' && <Field label="URL"><input style={S.input} value={link.href} placeholder="https://..." onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }} /></Field>}
                  {linkType === 'section' && (
                    <Field label="Target Section">
                      {sections.length === 0
                        ? <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0' }}>No sections on this page yet.</p>
                        : <select style={S.select} value={link.href} onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }}>
                          {sections.map((sec, si) => {
                            const anchorId = sec.props?.sectionId || sec.id
                            return <option key={sec.id} value={`#${anchorId}`}>{sectionLabel(sec, si)}</option>
                          })}
                        </select>
                      }
                    </Field>
                  )}
                  {linkType === 'page' && (
                    <Field label="Target Page">
                      <select style={S.select} value={link.href} onChange={(e) => { const l = [...(props.links || [])]; l[i] = { ...l[i], href: e.target.value }; up({ links: l }) }}>
                        {pages.map((p) => { const ph = p.name === 'Home' ? 'index.html' : `${slugify(p.name)}.html`; return <option key={p.id} value={ph}>{p.name}</option> })}
                      </select>
                    </Field>
                  )}
                </div>
              )
            })}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Agensea Navbar — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || 'rgba(255,255,255,0.85)'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#000000'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'smart-home-dashboard':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Smart Home — General</div>
            <Field label="Room Name">
              <input style={S.input} value={props.shdRoomName || 'Living room'} onChange={(e) => up({ shdRoomName: e.target.value })} />
            </Field>
            <ColorField label="Accent Color" value={props.shdAccent || '#b4c7bc'} onChange={(v) => up({ shdAccent: v })} />
            <ColorField label="Background Color" value={props.shdDarkBg || '#2a2624'} onChange={(v) => up({ shdDarkBg: v })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Smart Plug</div>
            <Field label="Wattage">
              <input style={S.input} value={props.shdPowerWatts || '65W'} onChange={(e) => up({ shdPowerWatts: e.target.value })} placeholder="65W" />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Live Camera</div>
            <ImageField label="Camera Image" value={props.shdCameraImage || ''} onChange={(url) => up({ shdCameraImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Music Player</div>
            <Field label="Playlist Name">
              <input style={S.input} value={props.shdPlaylistName || 'Everyday Playlist'} onChange={(e) => up({ shdPlaylistName: e.target.value })} />
            </Field>
            <ImageField label="Album Art" value={props.shdAlbumImage || ''} onChange={(url) => up({ shdAlbumImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Lighting</div>
            <Field label="Default Brightness (0–100)">
              <input style={S.input} type="number" min="0" max="100" value={props.shdLightPercent ?? 70} onChange={(e) => up({ shdLightPercent: Number(e.target.value) })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Sidebar Profile</div>
            <ImageField label="Profile Image" value={props.shdProfileImage || ''} onChange={(url) => up({ shdProfileImage: url })} />
          </div>
        </>
      )

    case 'agensea-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Agensea Hero — Row 1</div>
            <Field label="Heading Text">
              <input style={S.input} value={props.agenseaRow1Text || ''} onChange={(e) => up({ agenseaRow1Text: e.target.value })} placeholder="Creative Agency" />
            </Field>
            <ImageField label="Image URL" value={props.agenseaRow1Image || ''} onChange={(url) => up({ agenseaRow1Image: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Agensea Hero — Row 2</div>
            <Field label="Heading Text">
              <input style={S.input} value={props.agenseaRow2Text || ''} onChange={(e) => up({ agenseaRow2Text: e.target.value })} placeholder="for the" />
            </Field>
            <ImageField label="Image URL" value={props.agenseaRow2Image || ''} onChange={(url) => up({ agenseaRow2Image: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Agensea Hero — Row 3</div>
            <Field label="Heading Text">
              <input style={S.input} value={props.agenseaRow3Text || ''} onChange={(e) => up({ agenseaRow3Text: e.target.value })} placeholder="Ocean" />
            </Field>
            <ImageField label="Image URL" value={props.agenseaRow3Image || ''} onChange={(url) => up({ agenseaRow3Image: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Rotating Badge</div>
            <Field label="Badge Text">
              <input style={S.input} value={props.agenseaBadgeText || ''} onChange={(e) => up({ agenseaBadgeText: e.target.value })} placeholder="WATCH OUR STORY • " />
            </Field>
            <Field label="Video URL (click to open)">
              <input style={S.input} value={props.agenseaBadgeVideoUrl || ''} onChange={(e) => up({ agenseaBadgeVideoUrl: e.target.value })} placeholder="https://youtube.com/embed/..." />
            </Field>
            <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '2px', lineHeight: 1.4 }}>Use an embed URL (e.g. youtube.com/embed/VIDEO_ID). Clicking the badge play button opens a fullscreen video modal.</p>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Style</div>
            <ColorField label="Accent Color" value={props.agenseaAccent || '#3b82f6'} onChange={(v) => up({ agenseaAccent: v })} />
            <Field label="Wave Opacity (0–1)">
              <input style={S.input} type="number" min="0" max="1" step="0.05" value={props.agenseaWaveOpacity || '0.12'} onChange={(e) => up({ agenseaWaveOpacity: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Agensea Hero — Colors</div>
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#000000'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'puzzle-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Puzzle Hero — Content</div>
            <Field label="Display Word">
              <input style={S.input} value={props.puzzleDisplayWord || ''} onChange={(e) => up({ puzzleDisplayWord: e.target.value })} placeholder="puzzle" />
            </Field>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.puzzleHeading || ''} onChange={(e) => up({ puzzleHeading: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.puzzleDescription || ''} onChange={(e) => up({ puzzleDescription: e.target.value })} />
            </Field>
            <Field label="CTA Button Text">
              <input style={S.input} value={props.puzzleCtaText || ''} onChange={(e) => up({ puzzleCtaText: e.target.value })} />
            </Field>
            <NavLinkField
              label="CTA Button Navigation"
              hrefKey="puzzleCtaHref"
              linkTypeKey="puzzleCtaLinkType"
              element={element}
              updateElement={updateElement}
              sections={sections}
              pages={pages}
              defaultHref="#"
            />
          </div>

          <div style={S.section}>
            <div style={S.sectionTitle}>Puzzle Hero — Colors</div>
            <ColorField label="Accent / Button Color" value={props.puzzleAccent || '#f97316'} onChange={(v) => up({ puzzleAccent: v })} />
            <ColorField label="Piece Color 1 (Blue)" value={props.puzzleColor1 || '#3b82f6'} onChange={(v) => up({ puzzleColor1: v })} />
            <ColorField label="Piece Color 2 (Orange)" value={props.puzzleColor2 || '#f97316'} onChange={(v) => up({ puzzleColor2: v })} />
            <ColorField label="Piece Color 3 (Yellow)" value={props.puzzleColor3 || '#fbbf24'} onChange={(v) => up({ puzzleColor3: v })} />
            <ColorField label="Piece Color 4 (Pink)" value={props.puzzleColor4 || '#db2777'} onChange={(v) => up({ puzzleColor4: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#ffffff'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text Color" value={styles?.color || '#1e293b'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )

    case 'section': {
      const SECTION_LAYOUTS = [
        { key: 'stack', label: 'Stack', Icon: Rows3, desc: 'Vertical stack (default)' },
        { key: '2-col', label: '2 Col', Icon: Columns2, desc: 'Two columns side by side' },
        { key: '3-col', label: '3 Col', Icon: Columns3, desc: 'Three columns' },
        { key: '4-col', label: '4 Col', Icon: LayoutGrid, desc: 'Four columns' },
      ]
      const activeLayout = props.layout || 'stack'
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Children Layout</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '10px' }}>
              {SECTION_LAYOUTS.map((v) => {
                const isActive = activeLayout === v.key
                return (
                  <div key={v.key} onClick={() => up({ layout: v.key })} title={v.desc}
                    style={{ padding: '8px 4px 7px', borderRadius: '8px', border: `2px solid ${isActive ? '#4f6ef7' : '#e8e8e8'}`, backgroundColor: isActive ? '#eff6ff' : '#fafafa', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3px', color: isActive ? '#4f6ef7' : '#6b7280' }}>{v.Icon ? <v.Icon size={15} strokeWidth={1.8} /> : v.icon}</div>
                    <div style={{ fontSize: '0.62rem', fontWeight: '700', color: isActive ? '#4f6ef7' : '#374151', lineHeight: 1.2 }}>{v.label}</div>
                  </div>
                )
              })}
            </div>
            {activeLayout !== 'stack' && (
              <>
                <Field label="Column Gap">
                  <input style={S.input} value={props.gap || '24px'} onChange={(e) => up({ gap: e.target.value })} placeholder="24px" />
                </Field>
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '-4px 0 4px', lineHeight: 1.4 }}>
                  Drag elements into the section — they auto-fill columns. Stacks on mobile.
                </p>
              </>
            )}
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Section Content</div>
            <Field label="Title">
              <input style={S.input} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
            </Field>
            <Field label="Subtitle">
              <textarea style={S.textarea} rows={3} value={props.subtitle || ''} onChange={(e) => up({ subtitle: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Anchor Link</div>
            <Field label="Section ID">
              <input
                style={S.input}
                value={props.sectionId || ''}
                placeholder={`Auto: ${element.id.slice(0, 8)}`}
                onChange={(e) => up({ sectionId: e.target.value.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '') })}
              />
            </Field>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '-4px 0 4px', lineHeight: 1.4 }}>
              Navbar links can target this section using #{props.sectionId || element.id.slice(0, 8)}
            </p>
          </div>
        </>
      )
    }

    case 'columns':
      return (
        <div style={S.section}>
          <div style={S.sectionTitle}>Columns</div>
          {(props.columns || []).map((col, i) => (
            <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '8px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '6px', fontWeight: '600' }}>Column {i + 1}</div>
              <Field label="Icon (emoji)">
                <input style={S.input} value={col.icon || ''} onChange={(e) => up({ columns: props.columns.map((c, j) => j === i ? { ...c, icon: e.target.value } : c) })} />
              </Field>
              <Field label="Title">
                <input style={S.input} value={col.title || ''} onChange={(e) => up({ columns: props.columns.map((c, j) => j === i ? { ...c, title: e.target.value } : c) })} />
              </Field>
              <Field label="Text">
                <textarea style={S.textarea} rows={2} value={col.text || ''} onChange={(e) => up({ columns: props.columns.map((c, j) => j === i ? { ...c, text: e.target.value } : c) })} />
              </Field>
            </div>
          ))}
          <button style={S.addBtn} onClick={() => up({ columns: [...(props.columns || []), { icon: '✨', title: 'New Column', text: 'Description here.' }] })}>
            + Add Column
          </button>
        </div>
      )

    case 'footer':
      return (
        <div style={S.section}>
          <div style={S.sectionTitle}>Footer Content</div>
          <Field label="Brand Name">
            <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <input style={S.input} value={props.tagline || ''} onChange={(e) => up({ tagline: e.target.value })} />
          </Field>
          <Field label="Copyright Text">
            <input style={S.input} value={props.copyright || ''} onChange={(e) => up({ copyright: e.target.value })} />
          </Field>
          <div style={S.sectionTitle}>Links</div>
          {(props.links || []).map((link, i) => (
            <div key={i} style={S.listItemRow}>
              <input style={{ ...S.input, flex: 1 }} value={link.text} placeholder="Text" onChange={(e) => up({ links: props.links.map((l, j) => j === i ? { ...l, text: e.target.value } : l) })} />
              <input style={{ ...S.input, flex: 1 }} value={link.href} placeholder="URL" onChange={(e) => up({ links: props.links.map((l, j) => j === i ? { ...l, href: e.target.value } : l) })} />
              <button style={S.removeBtn} onClick={() => up({ links: props.links.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button style={S.addBtn} onClick={() => up({ links: [...(props.links || []), { text: 'Link', href: '#' }] })}>+ Add Link</button>
        </div>
      )

    case 'heading':
      return (
        <div style={S.section}>
          <Field label="Text">
            <textarea style={S.textarea} rows={3} value={props.text || ''} onChange={(e) => up({ text: e.target.value })} />
          </Field>
          <Field label="Level">
            <select style={S.select} value={props.level || 'h2'} onChange={(e) => up({ level: e.target.value })}>
              {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((h) => <option key={h} value={h}>{h.toUpperCase()}</option>)}
            </select>
          </Field>
        </div>
      )

    case 'paragraph':
    case 'quote':
      return (
        <div style={S.section}>
          <Field label="Text">
            <textarea style={S.textarea} rows={5} value={props.text || ''} onChange={(e) => up({ text: e.target.value })} />
          </Field>
          {type === 'quote' && (
            <Field label="Author">
              <input style={S.input} value={props.author || ''} onChange={(e) => up({ author: e.target.value })} />
            </Field>
          )}
        </div>
      )

    case 'image':
      return (
        <div style={S.section}>
          <ImageField label="Image URL" value={props.src || ''} onChange={(url) => up({ src: url })} />
          <Field label="Alt Text">
            <input style={S.input} value={props.alt || ''} onChange={(e) => up({ alt: e.target.value })} />
          </Field>
          <Field label="Caption">
            <input style={S.input} value={props.caption || ''} onChange={(e) => up({ caption: e.target.value })} />
          </Field>
        </div>
      )

    case 'video':
      return (
        <div style={S.section}>
          <Field label="Embed URL">
            <input style={S.input} value={props.src || ''} onChange={(e) => up({ src: e.target.value })} placeholder="YouTube embed URL..." />
          </Field>
          <Field label="Title">
            <input style={S.input} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
          </Field>
          <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '6px' }}>
            Use YouTube embed URL format: https://www.youtube.com/embed/VIDEO_ID
          </p>
        </div>
      )

    case 'button':
      return (
        <div style={S.section}>
          <Field label="Button Text">
            <input style={S.input} value={props.text || ''} onChange={(e) => up({ text: e.target.value })} />
          </Field>
          <NavLinkField
            label="Navigation"
            hrefKey="href"
            linkTypeKey="linkType"
            element={element}
            updateElement={updateElement}
            sections={sections}
            pages={pages}
          />
          <Field label="Style">
            <select style={S.select} value={props.variant || 'primary'} onChange={(e) => up({ variant: e.target.value })}>
              <option value="primary">Primary (filled)</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </Field>
        </div>
      )

    case 'card':
      return (
        <div style={S.section}>
          <ImageField label="Image URL" value={props.image || ''} onChange={(url) => up({ image: url })} />
          <Field label="Title">
            <input style={S.input} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
          </Field>
          <Field label="Text">
            <textarea style={S.textarea} rows={3} value={props.text || ''} onChange={(e) => up({ text: e.target.value })} />
          </Field>
          <Field label="Button Text">
            <input style={S.input} value={props.buttonText || ''} onChange={(e) => up({ buttonText: e.target.value })} />
          </Field>
          <NavLinkField
            label="Button Navigation"
            hrefKey="buttonHref"
            linkTypeKey="buttonLinkType"
            element={element}
            updateElement={updateElement}
            sections={sections}
            pages={pages}
          />
        </div>
      )

    case 'list':
      return (
        <div style={S.section}>
          <Field label="List Type">
            <select style={S.select} value={props.variant || 'ul'} onChange={(e) => up({ variant: e.target.value })}>
              <option value="ul">Bulleted (ul)</option>
              <option value="ol">Numbered (ol)</option>
            </select>
          </Field>
          <div style={S.sectionTitle}>Items</div>
          {(props.items || []).map((item, i) => (
            <div key={i} style={S.listItemRow}>
              <input style={{ ...S.input, flex: 1 }} value={item} onChange={(e) => up({ items: props.items.map((it, j) => j === i ? e.target.value : it) })} />
              <button style={S.removeBtn} onClick={() => up({ items: props.items.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button style={S.addBtn} onClick={() => up({ items: [...(props.items || []), 'New item'] })}>+ Add Item</button>
        </div>
      )

    case 'form':
      return (
        <div style={S.section}>
          <Field label="Form Title">
            <input style={S.input} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <textarea style={S.textarea} rows={2} value={props.subtitle || ''} onChange={(e) => up({ subtitle: e.target.value })} />
          </Field>
          <Field label="Submit Button Text">
            <input style={S.input} value={props.submitText || ''} onChange={(e) => up({ submitText: e.target.value })} />
          </Field>
        </div>
      )

    case 'counter':
      return (
        <div style={S.section}>
          <div style={S.sectionTitle}>Stats</div>
          {(props.stats || []).map((stat, i) => (
            <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
              <div style={S.rowTwo}>
                <Field label="Number">
                  <input style={S.input} value={stat.number} onChange={(e) => up({ stats: props.stats.map((s, j) => j === i ? { ...s, number: e.target.value } : s) })} />
                </Field>
                <Field label="Label">
                  <input style={S.input} value={stat.label} onChange={(e) => up({ stats: props.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s) })} />
                </Field>
              </div>
              <button style={S.removeBtn} onClick={() => up({ stats: props.stats.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button style={S.addBtn} onClick={() => up({ stats: [...(props.stats || []), { number: '0', label: 'Stat' }] })}>+ Add Stat</button>
        </div>
      )

    case 'testimonial':
      return (
        <div style={S.section}>
          <Field label="Quote Text">
            <textarea style={S.textarea} rows={4} value={props.text || ''} onChange={(e) => up({ text: e.target.value })} />
          </Field>
          <Field label="Author Name">
            <input style={S.input} value={props.author || ''} onChange={(e) => up({ author: e.target.value })} />
          </Field>
          <Field label="Role / Company">
            <input style={S.input} value={props.role || ''} onChange={(e) => up({ role: e.target.value })} />
          </Field>
          <Field label="Avatar URL">
            <input style={S.input} value={props.avatar || ''} onChange={(e) => up({ avatar: e.target.value })} />
          </Field>
        </div>
      )

    case 'spacer':
      return (
        <div style={S.section}>
          <Field label="Height">
            <input style={S.input} value={props.height || '60px'} onChange={(e) => up({ height: e.target.value })} placeholder="e.g. 60px" />
          </Field>
        </div>
      )

    case 'divider':
      return (
        <div style={S.section}>
          <Field label="Line Style">
            <select style={S.select} value={props.style || 'solid'} onChange={(e) => up({ style: e.target.value })}>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </Field>
        </div>
      )

    default:
      return <div style={{ padding: '20px', color: '#9ca3af', fontSize: '0.82rem' }}>No content options for this element.</div>
  }
}

function StyleTab({ element, updateElement }) {
  const { viewportWidth } = useBuilder()
  const isNewStyleFormat = element.styles && (element.styles.desktop || element.styles.mobile || element.styles.tablet || element.styles.hover)
  
  // Read from the active viewport if responsive styles are enabled
  const currentStyles = isNewStyleFormat ? (element.styles[viewportWidth] || {}) : (element.styles || {})

  const us = (styleUpdates) => {
    if (isNewStyleFormat) {
      updateElement(element.id, {
        styles: {
          ...element.styles,
          [viewportWidth]: { ...(element.styles[viewportWidth] || {}), ...styleUpdates }
        }
      })
    } else {
      updateElement(element.id, { styles: styleUpdates })
    }
  }

  const up = (propUpdates) => updateElement(element.id, { props: propUpdates })

  const enableResponsive = () => {
    updateElement(element.id, {
      styles: {
        desktop: { ...element.styles },
        tablet: {},
        mobile: {},
        hover: {}
      }
    })
  }

  return (
    <>
      {!isNewStyleFormat && (
        <div style={{ padding: '12px 14px', backgroundColor: '#f0fdf4', borderBottom: '1px solid #dcfce3' }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#166534', lineHeight: 1.4 }}>
            Enable responsive styles to set different properties for Desktop, Tablet, and Mobile.
          </p>
          <button 
            onClick={enableResponsive}
            style={{ width: '100%', padding: '6px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Enable Responsive Styles
          </button>
        </div>
      )}
      
      {isNewStyleFormat && (
        <div style={{ padding: '12px 14px', backgroundColor: '#eff6ff', borderBottom: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={14} color="#2563eb" />
          <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '600' }}>
            Editing {viewportWidth.charAt(0).toUpperCase() + viewportWidth.slice(1)} Styles
          </span>
        </div>
      )}

      <div style={S.section}>
        <div style={S.sectionTitle}>Colors</div>
        <ColorField label="Background Color" value={currentStyles.backgroundColor || ''} onChange={(v) => us({ backgroundColor: v })} />
        <ColorField label="Text Color" value={currentStyles.color || ''} onChange={(v) => us({ color: v })} />
        {currentStyles.borderLeft !== undefined && (
          <ColorField label="Accent Color" value={currentStyles.borderLeft?.split(' ').pop() || ''} onChange={(v) => us({ borderLeft: `4px solid ${v}` })} />
        )}
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Background Image</div>
        <ImageField label="Image URL" value={currentStyles.backgroundImage?.replace(/url\(|\)|'|"/g, '') || ''} onChange={(v) => us({ backgroundImage: v ? `url(${v})` : '' })} />
        {currentStyles.backgroundImage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <Field label="Size">
              <select style={S.input} value={currentStyles.backgroundSize || 'cover'} onChange={(e) => us({ backgroundSize: e.target.value })}>
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
                <option value="100% 100%">Stretch</option>
              </select>
            </Field>
            <Field label="Position">
              <select style={S.input} value={currentStyles.backgroundPosition || 'center'} onChange={(e) => us({ backgroundPosition: e.target.value })}>
                <option value="center">Center</option>
                <option value="top left">Top Left</option>
                <option value="top center">Top Center</option>
                <option value="top right">Top Right</option>
                <option value="bottom center">Bottom Center</option>
              </select>
            </Field>
            <Field label="Repeat">
              <select style={S.input} value={currentStyles.backgroundRepeat || 'no-repeat'} onChange={(e) => us({ backgroundRepeat: e.target.value })}>
                <option value="no-repeat">No Repeat</option>
                <option value="repeat">Repeat</option>
                <option value="repeat-x">Repeat X</option>
                <option value="repeat-y">Repeat Y</option>
              </select>
            </Field>
          </div>
        )}
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Spacing</div>
        <Field label="Padding">
          <input style={S.input} value={currentStyles.padding || ''} onChange={(e) => us({ padding: e.target.value })} placeholder="e.g. 40px 20px" />
        </Field>
        <Field label="Margin">
          <input style={S.input} value={currentStyles.margin || ''} onChange={(e) => us({ margin: e.target.value })} placeholder="e.g. 0 auto" />
        </Field>
        <Field label="Min Height">
          <input style={S.input} value={currentStyles.minHeight || ''} onChange={(e) => us({ minHeight: e.target.value })} placeholder="e.g. 400px" />
        </Field>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Typography</div>
        <Field label="Font Size">
          <input style={S.input} value={currentStyles.fontSize || ''} onChange={(e) => us({ fontSize: e.target.value })} placeholder="e.g. 1rem" />
        </Field>
        <Field label="Font Weight">
          <select style={S.select} value={currentStyles.fontWeight || ''} onChange={(e) => us({ fontWeight: e.target.value })}>
            <option value="">Default</option>
            <option value="400">Normal (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-Bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra-Bold (800)</option>
          </select>
        </Field>
        <Field label="Text Align">
          <select style={S.select} value={currentStyles.textAlign || ''} onChange={(e) => us({ textAlign: e.target.value })}>
            <option value="">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <Field label="Line Height">
          <input style={S.input} value={currentStyles.lineHeight || ''} onChange={(e) => us({ lineHeight: e.target.value })} placeholder="e.g. 1.6" />
        </Field>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Border</div>
        <Field label="Border Radius">
          <input style={S.input} value={currentStyles.borderRadius || ''} onChange={(e) => us({ borderRadius: e.target.value })} placeholder="e.g. 8px" />
        </Field>
        <Field label="Border">
          <input style={S.input} value={currentStyles.border || ''} onChange={(e) => us({ border: e.target.value })} placeholder="e.g. 1px solid #ccc" />
        </Field>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Layout Options</div>
        <Field label="Display">
          <input style={S.input} value={currentStyles.display || ''} onChange={(e) => us({ display: e.target.value })} placeholder="e.g. flex, grid, block" />
        </Field>
        <Field label="Flex Direction">
          <input style={S.input} value={currentStyles.flexDirection || ''} onChange={(e) => us({ flexDirection: e.target.value })} placeholder="e.g. column" />
        </Field>
        <Field label="Gap">
          <input style={S.input} value={currentStyles.gap || ''} onChange={(e) => us({ gap: e.target.value })} placeholder="e.g. 16px" />
        </Field>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Scroll Animation</div>
        <Field label="Entrance Effect">
          <select
            style={S.select}
            value={element.props?.animation || 'none'}
            onChange={(e) => up({ animation: e.target.value })}
          >
            <option value="none">None</option>
            <option value="fade">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="slide-down">Slide Down</option>
            <option value="slide-left">Slide Left</option>
            <option value="slide-right">Slide Right</option>
            <option value="zoom">Zoom In</option>
            <option value="zoom-out">Zoom Out</option>
            <option value="flip">Flip In</option>
          </select>
        </Field>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '-4px 0 4px', lineHeight: 1.4 }}>
          Plays once when element scrolls into view (Preview mode only)
        </p>
      </div>
    </>
  )
}

export default function PropertiesPanel({ onClose }) {
  const { state, selectedElement, updateElement, selectedChildElement, selectedChildInfo, updateChildElement, currentPage, updatePageSettings, updateTheme, deleteElement, deleteChildElement, createComponent, deleteComponent, switchPage } = useBuilder()
  const [activeTab, setActiveTab] = useState('content')
  const [globalTab, setGlobalTab] = useState('page')

  // Determine what is selected: child element takes priority
  const activeElement = selectedChildElement || selectedElement
  const isChild = !!selectedChildElement

  const activeUpdateElement = updateElement

  // Detect if the selected child is inside a grid-layout section
  const parentElement = isChild && selectedChildInfo
    ? (currentPage?.elements || []).find((el) => el.id === selectedChildInfo.parentId)
    : null
  const parentIsGrid = parentElement?.props?.layout && parentElement.props.layout !== 'stack'

  if (!activeElement) {
    const isEditingComponent = (state.components || []).some(c => c.id === state.currentPageId);
    return (
      <div style={S.panel}>
        <div style={S.header}>
          <span>Global Settings</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.68rem', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
              {currentPage?.name || 'Page'}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', lineHeight: 1 }}
                title="Close"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div style={S.tabs}>
          <button style={S.tab(globalTab === 'page')} onClick={() => setGlobalTab('page')}>Page</button>
          <button style={S.tab(globalTab === 'theme')} onClick={() => setGlobalTab('theme')}>Theme</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {globalTab === 'page' ? (
            <>
              <div style={S.section}>
                <div style={S.sectionTitle}>Canvas Background</div>
                <ColorField
                  label="Background Color"
                  value={currentPage?.canvasBg || '#ffffff'}
                  onChange={(v) => updatePageSettings(currentPage.id, { canvasBg: v })}
                />
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px', lineHeight: 1.4 }}>
                  Sets the page background color behind all elements.
                </p>
              </div>
              
              {isEditingComponent && (
                <div style={{ ...S.section, marginTop: 'auto', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this Master Component? Instances on other pages will become empty.')) {
                        deleteComponent(currentPage.id)
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#fee2e2',
                      color: '#ef4444',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    🗑 Delete Master Component
                  </button>
                </div>
              )}
              <div style={{ ...S.empty, flex: 'none', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #f3f4f6', minHeight: 'unset' }}>
                <div style={{ fontSize: '1.6rem' }}>🖱️</div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', maxWidth: '180px', lineHeight: 1.5 }}>
                  Click any element to edit its properties
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={S.section}>
                <div style={S.sectionTitle}>Colors</div>
                {Object.entries(state.theme?.colors || {}).map(([key, value]) => (
                  <ColorField
                    key={`color-${key}`}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChange={(v) => updateTheme('colors', key, v)}
                  />
                ))}
              </div>
              <div style={S.section}>
                <div style={S.sectionTitle}>Typography</div>
                {Object.entries(state.theme?.typography || {}).map(([key, value]) => (
                  <Field key={`typo-${key}`} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                    <input
                      style={S.input}
                      value={value}
                      onChange={(e) => updateTheme('typography', key, e.target.value)}
                    />
                  </Field>
                ))}
              </div>
              <div style={S.section}>
                <div style={S.sectionTitle}>Border Radius</div>
                {Object.entries(state.theme?.radius || {}).map(([key, value]) => (
                  <Field key={`radius-${key}`} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                    <input
                      style={S.input}
                      value={value}
                      onChange={(e) => updateTheme('radius', key, e.target.value)}
                    />
                  </Field>
                ))}
              </div>
              <div style={S.section}>
                <div style={S.sectionTitle}>Spacing</div>
                {Object.entries(state.theme?.spacing || {}).map(([key, value]) => (
                  <Field key={`spacing-${key}`} label={key.toUpperCase()}>
                    <input
                      style={S.input}
                      value={value}
                      onChange={(e) => updateTheme('spacing', key, e.target.value)}
                    />
                  </Field>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (activeElement) {
      deleteElement(activeElement.id)
    }
  }

  return (
    <div style={S.panel}>
      <div style={S.header}>
        <span>{isChild ? 'Child Element' : 'Properties'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.68rem', background: isChild ? '#f0fdf4' : '#eff6ff', color: isChild ? '#16a34a' : '#4f6ef7', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
            {activeElement.type}
          </span>
          <button
            onClick={handleDelete}
            title="Delete element"
            style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            🗑 Delete
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', lineHeight: 1 }}
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {!isChild && activeElement.type !== 'component-instance' && (
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Component</span>
          <button
            onClick={() => {
              const name = prompt('Component Name:', activeElement.type.charAt(0).toUpperCase() + activeElement.type.slice(1) + ' Component');
              if (name) createComponent(activeElement.id, name);
            }}
            style={{ padding: '4px 10px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', border: '1px solid #4f6ef7', backgroundColor: '#eff6ff', color: '#4f6ef7', transition: 'all 0.15s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#4f6ef7'; e.currentTarget.style.color = '#fff' }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#4f6ef7' }}
          >
            Create Master
          </button>
        </div>
      )}

      {!isChild && activeElement.type === 'component-instance' && (
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Component Instance</span>
          <button
            onClick={() => {
              switchPage(activeElement.componentId);
            }}
            style={{ padding: '4px 10px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', border: '1px solid #10b981', backgroundColor: '#ecfdf5', color: '#10b981', transition: 'all 0.15s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.color = '#fff' }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ecfdf5'; e.currentTarget.style.color = '#10b981' }}
          >
            Edit Master
          </button>
        </div>
      )}

      {/* Full-width span toggle — only shown for children inside a grid section */}
      {isChild && parentIsGrid && (
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Column Span</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'auto', label: 'Auto' },
              { key: 'full', label: '↔ Full Row' },
            ].map(({ key, label }) => {
              const isActive = (activeElement.props?.gridSpan || 'auto') === key
              return (
                <button
                  key={key}
                  onClick={() => activeUpdateElement(activeElement.id, { props: { gridSpan: key } })}
                  style={{
                    padding: '4px 10px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', border: 'none',
                    backgroundColor: isActive ? '#4f6ef7' : '#e5e7eb',
                    color: isActive ? '#fff' : '#374151',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div style={S.tabs}>
        {[
          { id: 'content', icon: <FileText size={16} />, label: 'Content' },
          { id: 'style', icon: <Palette size={16} />, label: 'Style' },
          { id: 'layout', icon: <Box size={16} />, label: 'Layout' },
          { id: 'responsive', icon: <Monitor size={16} />, label: 'Responsive' },
          { id: 'animation', icon: <Zap size={16} />, label: 'Animation' },
          { id: 'advanced', icon: <Settings size={16} />, label: 'Advanced' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            style={{...S.tab(activeTab === tab.id), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 4px', fontSize: '0.65rem' }} 
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {activeTab === 'content' && <ContentTab element={activeElement} updateElement={activeUpdateElement} />}
        {activeTab === 'style' && <StyleTab element={activeElement} updateElement={activeUpdateElement} />}
        {activeTab === 'layout' && (
          <div style={{ padding: '16px', color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>
            <Box size={24} style={{ margin: '0 auto 8px', color: '#9ca3af' }} />
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Layout Properties</p>
            <p>Width, Height, Padding, Margin, Display settings will go here.</p>
          </div>
        )}
        {activeTab === 'responsive' && (
          <div style={{ padding: '16px', color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>
            <Monitor size={24} style={{ margin: '0 auto 8px', color: '#4f6ef7' }} />
            <p style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Responsive Design</p>
            <p style={{ marginBottom: '12px' }}>You can now edit styles for Desktop, Tablet, and Mobile directly from the <strong>Style</strong> tab.</p>
            <p style={{ fontSize: '0.75rem' }}>1. Go to the Style tab<br/>2. Click "Enable Responsive Styles"<br/>3. Switch viewports in the top toolbar to set overrides</p>
            <button
              onClick={() => setActiveTab('style')}
              style={{ marginTop: '16px', padding: '6px 16px', backgroundColor: '#4f6ef7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              Go to Style Tab
            </button>
          </div>
        )}
        {activeTab === 'animation' && (
          <div style={{ padding: '16px', color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>
            <Zap size={24} style={{ margin: '0 auto 8px', color: '#9ca3af' }} />
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Animation & States</p>
            <p>Hover, Entrance, Scroll effects.</p>
          </div>
        )}
        {activeTab === 'advanced' && (
          <div style={{ padding: '16px', color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>
            <Settings size={24} style={{ margin: '0 auto 8px', color: '#9ca3af' }} />
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Advanced Settings</p>
            <p>Custom Classes, IDs, and Visibility rules.</p>
          </div>
        )}
      </div>
    </div>
  )
}
