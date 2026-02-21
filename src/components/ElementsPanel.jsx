import React, { useState } from 'react'
import { ELEMENT_CATEGORIES } from '../data/elementTypes'
import { useBuilder } from '../context/BuilderContext'

const S = {
  panel: {
    width: '230px',
    flexShrink: 0,
    minHeight: 0,
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
  },
  header: {
    padding: '14px 16px 10px',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  searchBox: {
    padding: '10px 12px',
    borderBottom: '1px solid #f0f0f0',
  },
  searchInput: {
    width: '100%',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '0.82rem',
    outline: 'none',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  categoryHeader: (open) => ({
    padding: '10px 14px',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#374151',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f0f0f0',
    userSelect: 'none',
    transition: 'background 0.1s',
  }),
  categoryIcon: {
    fontSize: '0.85rem',
    marginRight: '6px',
  },
  chevron: (open) => ({
    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
    fontSize: '0.7rem',
    color: '#9ca3af',
  }),
  elementsGrid: {
    padding: '8px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
  },
  elementCard: {
    padding: '10px 6px',
    borderRadius: '8px',
    border: '1px solid #e8e8e8',
    cursor: 'grab',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    transition: 'all 0.15s',
    userSelect: 'none',
    fontSize: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  elementIcon: {
    fontSize: '1.3rem',
    lineHeight: 1,
  },
  elementLabel: {
    fontSize: '0.72rem',
    color: '#374151',
    fontWeight: '500',
    lineHeight: 1.2,
  },
  emptySearch: {
    padding: '20px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.8rem',
  },
  tip: {
    padding: '12px 14px',
    fontSize: '0.72rem',
    color: '#9ca3af',
    borderTop: '1px solid #f0f0f0',
    lineHeight: 1.5,
    marginTop: 'auto',
  },
}

function ElementCard({ element, onAddClick }) {
  const [hovered, setHovered] = useState(false)

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('application/x-element-type', element.type)
  }

  return (
    <div
      style={{
        ...S.elementCard,
        backgroundColor: hovered ? '#eff6ff' : '#ffffff',
        borderColor: hovered ? '#93c5fd' : '#e8e8e8',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 2px 8px rgba(79,110,247,0.15)' : 'none',
      }}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onAddClick(element)}
      title={`${element.description || element.label} — drag to canvas or click to add`}
    >
      <span style={S.elementIcon}>{element.icon}</span>
      <span style={S.elementLabel}>{element.label}</span>
    </div>
  )
}

export default function ElementsPanel() {
  const { addElement } = useBuilder()
  const [search, setSearch] = useState('')
  const [openCategories, setOpenCategories] = useState(() =>
    ELEMENT_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  )

  const toggleCategory = (name) =>
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }))

  const handleAddClick = (elementDef) => {
    addElement({ type: elementDef.type, props: { ...elementDef.props }, styles: { ...elementDef.styles } })
  }

  const filteredCategories = search.trim()
    ? [
        {
          name: 'Search Results',
          icon: '🔍',
          elements: ELEMENT_CATEGORIES.flatMap((cat) => cat.elements).filter(
            (el) =>
              el.label.toLowerCase().includes(search.toLowerCase()) ||
              (el.description || '').toLowerCase().includes(search.toLowerCase())
          ),
        },
      ]
    : ELEMENT_CATEGORIES

  return (
    <div style={S.panel}>
      <div style={S.header}>Elements</div>

      <div style={S.searchBox}>
        <input
          style={S.searchInput}
          placeholder="Search elements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCategories.map((cat) => (
        <div key={cat.name}>
          <div
            style={S.categoryHeader(openCategories[cat.name])}
            onClick={() => toggleCategory(cat.name)}
          >
            <span>
              <span style={S.categoryIcon}>{cat.icon}</span>
              {cat.name}
            </span>
            <span style={S.chevron(openCategories[cat.name])}>▶</span>
          </div>

          {openCategories[cat.name] !== false && (
            <>
              {cat.elements.length === 0 ? (
                <div style={S.emptySearch}>No elements found</div>
              ) : (
                <div style={S.elementsGrid}>
                  {cat.elements.map((el) => (
                    <ElementCard key={el.type} element={el} onAddClick={handleAddClick} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <div style={S.tip}>
        💡 Drag elements to the canvas, or click to add at the end.
      </div>
    </div>
  )
}
