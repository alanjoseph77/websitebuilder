import React, { useState, useRef } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { getElementDefault } from '../data/elementTypes'
import ElementRenderer from './ElementRenderer'

function SectionInnerDropZone({ parentId, addChildElement }) {
  const [over, setOver] = useState(false)

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setOver(true) }
  const handleDragLeave = (e) => { e.stopPropagation(); setOver(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOver(false)
    const elementType = e.dataTransfer.getData('application/x-element-type')
    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) addChildElement(parentId, { type: def.type, props: { ...def.props }, styles: { ...def.styles } })
    }
  }


  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        margin: '16px 0 0',
        padding: over ? '14px' : '8px',
        border: `2px dashed ${over ? '#4f6ef7' : '#d1d5db'}`,
        borderRadius: '6px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: over ? '#4f6ef7' : '#9ca3af',
        backgroundColor: over ? 'rgba(79,110,247,0.06)' : 'rgba(0,0,0,0.02)',
        transition: 'all 0.15s',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {over ? '+ Drop here' : '+ Drag elements here to add inside section'}
    </div>
  )
}

const OVERLAY_BTN = (color = '#4f6ef7') => ({
  background: color,
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '0.72rem',
  cursor: 'pointer',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
})

export default function CanvasElement({ element, index, totalCount, sidebarOnly = false }) {
  const { state, selectElement, deleteElement, duplicateElement, moveElementUp, moveElementDown, reorderElements, addElement, addChildElement, deleteChildElement, selectChild, selectedChildInfo, viewportWidth } = useBuilder()
  const isMobile = viewportWidth === 'mobile'
  const isTablet = viewportWidth === 'tablet'
  const isSelected = state.selectedElementId === element.id
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const dragIndexRef = useRef(null)

  const handleClick = (e) => {
    e.stopPropagation()
    selectElement(element.id)
  }

  // Drag to reorder
  const handleDragStart = (e) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/x-canvas-index', String(index))
    dragIndexRef.current = index
    setDragging(true)
  }

  const handleDragEnd = () => {
    setDragging(false)
    setDragOver(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    // Reorder existing canvas element
    const fromIndex = parseInt(e.dataTransfer.getData('application/x-canvas-index'), 10)
    if (!isNaN(fromIndex) && fromIndex !== index) {
      reorderElements(fromIndex, index)
      return
    }
    // New element dragged from panel — insert after this element
    const elementType = e.dataTransfer.getData('application/x-element-type')
    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) {
        addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } }, index + 1)
      }
    }
  }

  const visible = isSelected || hovered

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        opacity: dragging ? 0.4 : 1,
        outline: isSelected ? '2px solid #4f6ef7' : hovered ? '1px dashed #93c5fd' : 'none',
        outlineOffset: isSelected ? '2px' : '0px',
        borderRadius: '2px',
        transition: 'outline 0.1s',
        borderTop: dragOver ? '3px solid #4f6ef7' : '3px solid transparent',
        cursor: 'pointer',
      }}
    >
      {/* Top action bar */}
      {visible && (
        <div
          style={{
            position: 'absolute',
            top: index === 0 ? '6px' : (isSelected ? '-32px' : '-26px'),
            left: index === 0 ? 'auto' : 0,
            right: index === 0 ? '6px' : 'auto',
            zIndex: 30,
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              ...OVERLAY_BTN('#6b7280'),
              cursor: 'grab',
            }}
            title="Drag to reorder"
          >
            ⠿
          </div>
          <div
            style={{
              background: '#1a1a2e',
              color: '#9ca3af',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '0.68rem',
              fontWeight: '600',
              letterSpacing: '0.05em',
            }}
          >
            {element.type.toUpperCase()}
          </div>
          <button style={OVERLAY_BTN('#6b7280')} onClick={() => moveElementUp(element.id)} disabled={index === 0} title="Move up">
            ↑
          </button>
          <button style={OVERLAY_BTN('#6b7280')} onClick={() => moveElementDown(element.id)} disabled={index === totalCount - 1} title="Move down">
            ↓
          </button>
          <button style={OVERLAY_BTN('#10b981')} onClick={() => duplicateElement(element.id)} title="Duplicate">
            ⧉ Copy
          </button>
          <button style={OVERLAY_BTN('#ef4444')} onClick={() => deleteElement(element.id)} title="Delete element">
            🗑 Delete
          </button>
        </div>
      )}

      {/* Element content */}
      {(() => {
        if (element.type !== 'section') {
          return <ElementRenderer element={element} isPreview={false} childrenSlot={null} sidebarOnly={sidebarOnly} />
        }

        const sectionLayout = element.props?.layout || 'stack'
        const sectionGap = element.props?.gap || '24px'
        const gridCols = {
          '2-col': isMobile ? '1fr' : 'repeat(2, 1fr)',
          '3-col': isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          '4-col': isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        }[sectionLayout]
        const hasHeader = element.props?.title || element.props?.subtitle

        const renderChild = (child) => {
          const isChildSelected = selectedChildInfo?.parentId === element.id && selectedChildInfo?.childId === child.id
          const isFullSpan = gridCols && child.props?.gridSpan === 'full'
          return (
            <div
              key={child.id}
              onClick={(e) => { e.stopPropagation(); selectChild(element.id, child.id) }}
              style={{
                position: 'relative',
                outline: isChildSelected ? '2px solid #4f6ef7' : '1px dashed #e5e7eb',
                outlineOffset: '2px',
                borderRadius: '4px',
                cursor: 'pointer',
                minHeight: gridCols ? '60px' : undefined,
                gridColumn: isFullSpan ? '1 / -1' : undefined,
              }}
            >
              <ElementRenderer element={child} isPreview={false} />
              {isChildSelected && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChildElement(element.id, child.id) }}
                  style={{
                    position: 'absolute', top: '6px', right: '6px',
                    background: '#ef4444', color: '#fff', border: 'none',
                    borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem',
                    cursor: 'pointer', zIndex: 10,
                  }}
                >
                  × Remove
                </button>
              )}
            </div>
          )
        }

        const childrenSlot = (
          <div onClick={(e) => e.stopPropagation()}>
            {gridCols ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: gridCols,
                  gap: sectionGap,
                  alignItems: 'start',
                  marginTop: hasHeader ? '16px' : '0',
                }}>
                  {(element.children || []).map(renderChild)}
                  {(element.children || []).length === 0 && Array.from({ length: { '2-col': 2, '3-col': 3, '4-col': 4 }[sectionLayout] }).map((_, i) => (
                    <div key={i} style={{ border: '2px dashed #e5e7eb', borderRadius: '6px', padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Column {i + 1}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <SectionInnerDropZone parentId={element.id} addChildElement={addChildElement} />
                </div>
              </>
            ) : (
              <>
                {(element.children || []).map((child) => (
                  <div key={child.id} style={{ marginTop: '8px' }}>
                    {renderChild(child)}
                  </div>
                ))}
                <SectionInnerDropZone parentId={element.id} addChildElement={addChildElement} />
              </>
            )}
          </div>
        )

        return <ElementRenderer element={element} isPreview={false} childrenSlot={childrenSlot} />
      })()}
    </div>
  )
}
