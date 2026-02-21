import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'

const S = {
  panel: {
    width: '260px',
    flexShrink: 0,
    minHeight: 0,
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #e5e7eb',
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

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const NAV_LAYOUTS = [
  { key: 'classic',  label: 'Classic',  icon: '▤', desc: 'Brand left, links right' },
  { key: 'centered', label: 'Centered', icon: '⊞', desc: 'Brand top, links below' },
  { key: 'split',    label: 'Split',    icon: '◈', desc: 'Links | Brand | Links' },
]
const NAV_LINK_STYLES = [
  { key: 'plain',     label: 'Plain',     icon: '—', desc: 'Simple text links' },
  { key: 'pill',      label: 'Pill',      icon: '◯', desc: 'Rounded pill buttons' },
  { key: 'ghost',     label: 'Ghost',     icon: '□', desc: 'Outlined border links' },
  { key: 'underline', label: 'Underline', icon: '⊔', desc: 'Underlined with dots' },
  { key: 'uppercase', label: 'Caps',      icon: 'AA', desc: 'ALL CAPS spaced' },
]
const NAV_EFFECTS = [
  { key: 'none',  label: 'Solid',  icon: '■', desc: 'Solid background' },
  { key: 'glass', label: 'Glass',  icon: '◫', desc: 'Frosted glass blur' },
  { key: 'bold',  label: 'Bold',   icon: '◉', desc: 'Icon logo + accent bar' },
]

function ContentTab({ element, updateElement }) {
  const { type, props } = element
  const { currentPage, state } = useBuilder()
  const up = (propUpdates) => updateElement(element.id, { props: propUpdates })

  const sections = (currentPage?.elements || []).filter((el) => el.type === 'section')
  const pages = state.pages || []

  const updateLink = (links, idx, field, val) => {
    const updated = links.map((l, i) => (i === idx ? { ...l, [field]: val } : l))
    up({ links: updated })
  }

  const changeLinkType = (links, idx, newType) => {
    let href = '#'
    if (newType === 'section' && sections.length > 0) {
      const s = sections[0]
      href = `#${s.props.sectionId || s.id}`
    } else if (newType === 'page' && pages.length > 0) {
      const p = pages[0]
      href = p.name === 'Home' ? '/' : `${slugify(p.name)}.html`
    }
    const updated = links.map((l, i) => i === idx ? { ...l, linkType: newType, href } : l)
    up({ links: updated })
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
                    <div style={{ fontSize: '1rem', marginBottom: '3px', lineHeight: 1 }}>{v.icon}</div>
                    <div style={{ fontSize: '0.67rem', fontWeight: '700', color: isActive ? '#4f6ef7' : '#374151', lineHeight: 1.2 }}>{v.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      return (
        <>
          <VariantPicker title="Layout" items={NAV_LAYOUTS} propKey="navLayout" cols={3} />
          <VariantPicker title="Link Style" items={NAV_LINK_STYLES} propKey="navLinkStyle" cols={3} />
          <VariantPicker title="Effect" items={NAV_EFFECTS} propKey="navEffect" cols={3} />
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
                            const anchorId = sec.props.sectionId || sec.id.slice(0, 8)
                            return (
                              <option key={sec.id} value={`#${anchorId}`}>
                                {sec.props.title || 'Untitled Section'} — #{anchorId}
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
                          const pageHref = p.name === 'Home' ? '/' : `${slugify(p.name)}.html`
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
          <Field label="Primary Button URL">
            <input style={S.input} value={props.buttonHref || ''} onChange={(e) => up({ buttonHref: e.target.value })} />
          </Field>
          <Field label="Secondary Button Text">
            <input style={S.input} value={props.buttonSecondaryText || ''} onChange={(e) => up({ buttonSecondaryText: e.target.value })} />
          </Field>
          <Field label="Secondary Button URL">
            <input style={S.input} value={props.buttonSecondaryHref || ''} onChange={(e) => up({ buttonSecondaryHref: e.target.value })} />
          </Field>
        </div>
      )

    case 'section': {
      const SECTION_LAYOUTS = [
        { key: 'stack',  label: 'Stack',  icon: '▤', desc: 'Vertical stack (default)' },
        { key: '2-col',  label: '2 Col',  icon: '◫', desc: 'Two columns side by side' },
        { key: '3-col',  label: '3 Col',  icon: '⊟', desc: 'Three columns' },
        { key: '4-col',  label: '4 Col',  icon: '⊞', desc: 'Four columns' },
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
                    <div style={{ fontSize: '1rem', marginBottom: '3px', lineHeight: 1 }}>{v.icon}</div>
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
          <Field label="Image URL">
            <input style={S.input} value={props.src || ''} onChange={(e) => up({ src: e.target.value })} placeholder="https://..." />
          </Field>
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
          <Field label="Link URL">
            <input style={S.input} value={props.href || ''} onChange={(e) => up({ href: e.target.value })} placeholder="#" />
          </Field>
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
          <Field label="Image URL">
            <input style={S.input} value={props.image || ''} onChange={(e) => up({ image: e.target.value })} />
          </Field>
          <Field label="Title">
            <input style={S.input} value={props.title || ''} onChange={(e) => up({ title: e.target.value })} />
          </Field>
          <Field label="Text">
            <textarea style={S.textarea} rows={3} value={props.text || ''} onChange={(e) => up({ text: e.target.value })} />
          </Field>
          <Field label="Button Text">
            <input style={S.input} value={props.buttonText || ''} onChange={(e) => up({ buttonText: e.target.value })} />
          </Field>
          <Field label="Button URL">
            <input style={S.input} value={props.buttonHref || ''} onChange={(e) => up({ buttonHref: e.target.value })} />
          </Field>
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
  const { styles } = element
  const us = (styleUpdates) => updateElement(element.id, { styles: styleUpdates })
  const up = (propUpdates) => updateElement(element.id, { props: propUpdates })

  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>Colors</div>
        <ColorField label="Background Color" value={styles.backgroundColor} onChange={(v) => us({ backgroundColor: v })} />
        <ColorField label="Text Color" value={styles.color} onChange={(v) => us({ color: v })} />
        {styles.borderLeft !== undefined && (
          <ColorField label="Accent Color" value={styles.borderLeft?.split(' ').pop()} onChange={(v) => us({ borderLeft: `4px solid ${v}` })} />
        )}
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Spacing</div>
        <Field label="Padding">
          <input style={S.input} value={styles.padding || ''} onChange={(e) => us({ padding: e.target.value })} placeholder="e.g. 40px 20px" />
        </Field>
        <Field label="Margin">
          <input style={S.input} value={styles.margin || ''} onChange={(e) => us({ margin: e.target.value })} placeholder="e.g. 0 auto" />
        </Field>
        {styles.minHeight !== undefined && (
          <Field label="Min Height">
            <input style={S.input} value={styles.minHeight || ''} onChange={(e) => us({ minHeight: e.target.value })} placeholder="e.g. 400px" />
          </Field>
        )}
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Typography</div>
        <Field label="Font Size">
          <input style={S.input} value={styles.fontSize || ''} onChange={(e) => us({ fontSize: e.target.value })} placeholder="e.g. 1rem" />
        </Field>
        <Field label="Font Weight">
          <select style={S.select} value={styles.fontWeight || ''} onChange={(e) => us({ fontWeight: e.target.value })}>
            <option value="">Default</option>
            <option value="400">Normal (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-Bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra-Bold (800)</option>
          </select>
        </Field>
        <Field label="Text Align">
          <select style={S.select} value={styles.textAlign || ''} onChange={(e) => us({ textAlign: e.target.value })}>
            <option value="">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <Field label="Line Height">
          <input style={S.input} value={styles.lineHeight || ''} onChange={(e) => us({ lineHeight: e.target.value })} placeholder="e.g. 1.6" />
        </Field>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Border</div>
        <Field label="Border Radius">
          <input style={S.input} value={styles.borderRadius || ''} onChange={(e) => us({ borderRadius: e.target.value })} placeholder="e.g. 8px" />
        </Field>
        <Field label="Border">
          <input style={S.input} value={styles.border || ''} onChange={(e) => us({ border: e.target.value })} placeholder="e.g. 1px solid #ccc" />
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

export default function PropertiesPanel() {
  const { selectedElement, updateElement, selectedChildElement, selectedChildInfo, updateChildElement, currentPage } = useBuilder()
  const [activeTab, setActiveTab] = useState('content')

  // Determine what is selected: child element takes priority
  const activeElement = selectedChildElement || selectedElement
  const isChild = !!selectedChildElement

  const activeUpdateElement = isChild
    ? (id, updates) => updateChildElement(selectedChildInfo.parentId, id, updates)
    : updateElement

  // Detect if the selected child is inside a grid-layout section
  const parentElement = isChild && selectedChildInfo
    ? (currentPage?.elements || []).find((el) => el.id === selectedChildInfo.parentId)
    : null
  const parentIsGrid = parentElement?.props?.layout && parentElement.props.layout !== 'stack'

  if (!activeElement) {
    return (
      <div style={S.panel}>
        <div style={S.header}>Properties</div>
        <div style={S.empty}>
          <div style={{ fontSize: '2rem' }}>🖱️</div>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>No element selected</div>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', maxWidth: '180px', lineHeight: 1.5 }}>
            Click on any element in the canvas to edit its properties
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={S.panel}>
      <div style={S.header}>
        <span>{isChild ? 'Child Element' : 'Properties'}</span>
        <span style={{ fontSize: '0.68rem', background: isChild ? '#f0fdf4' : '#eff6ff', color: isChild ? '#16a34a' : '#4f6ef7', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
          {activeElement.type}
        </span>
      </div>

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
        {['content', 'style'].map((tab) => (
          <button key={tab} style={S.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab === 'content' ? '📝 Content' : '🎨 Style'}
          </button>
        ))}
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {activeTab === 'content' ? (
          <ContentTab element={activeElement} updateElement={activeUpdateElement} />
        ) : (
          <StyleTab element={activeElement} updateElement={activeUpdateElement} />
        )}
      </div>
    </div>
  )
}
