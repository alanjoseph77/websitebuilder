import React, { useState, useRef } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { getElementDefault } from '../data/elementTypes'
import ElementRenderer from './ElementRenderer'

function SectionInnerDropZone({ parentId }) {
  const { addElement, moveNode } = useBuilder()
  const [over, setOver] = useState(false)

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setOver(true) }
  const handleDragLeave = (e) => { e.stopPropagation(); setOver(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOver(false)
    const elementType = e.dataTransfer.getData('application/x-element-type')
    const elementId = e.dataTransfer.getData('application/x-element-id')
    
    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } }, -1, parentId)
    } else if (elementId) {
      moveNode(elementId, parentId, -1)
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
      {over ? '+ Drop here' : '+ Drag elements here to add inside'}
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

export default function CanvasElement({ element, index, parentId = null, totalCount, sidebarOnly = false }) {
  const { state, selectElement, deleteElement, duplicateElement, moveElementUp, moveElementDown, moveNode, addElement } = useBuilder()
  const isSelected = state.selectedElementId === element.id
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragOverPos, setDragOverPos] = useState(null) // 'top' or 'bottom'

  const handleClick = (e) => {
    e.stopPropagation()
    selectElement(element.id)
  }

  // Drag to reorder
  const handleDragStart = (e) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/x-element-id', element.id)
    setDragging(true)
  }

  const handleDragEnd = () => {
    setDragging(false)
    setDragOverPos(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    
    // Determine drop position (top or bottom half)
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    if (y < rect.height / 2) {
      setDragOverPos('top')
    } else {
      setDragOverPos('bottom')
    }
  }

  const handleDragLeave = (e) => {
    e.stopPropagation()
    setDragOverPos(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const pos = dragOverPos
    setDragOverPos(null)
    
    const insertIdx = pos === 'top' ? index : index + 1
    const elementType = e.dataTransfer.getData('application/x-element-type')
    const elementId = e.dataTransfer.getData('application/x-element-id')

    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) {
        addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } }, insertIdx, parentId)
      }
    } else if (elementId && elementId !== element.id) {
      moveNode(elementId, parentId, insertIdx)
    }
  }

  const visible = isSelected || hovered
  const canHaveChildren = ['section', 'container', 'flex', 'grid', 'columns'].includes(element.type)

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
        borderTop: dragOverPos === 'top' ? '4px solid #4f6ef7' : '4px solid transparent',
        borderBottom: dragOverPos === 'bottom' ? '4px solid #4f6ef7' : '4px solid transparent',
        marginTop: dragOverPos === 'top' ? '-4px' : '0',
        marginBottom: dragOverPos === 'bottom' ? '-4px' : '0',
        cursor: 'pointer',
      }}
    >
      {/* Top action bar */}
      {visible && (
        <div
          style={{
            position: 'absolute',
            top: parentId ? '0px' : (index === 0 ? '6px' : (isSelected ? '-32px' : '-26px')),
            left: (!parentId && index === 0) ? 'auto' : 0,
            right: (!parentId && index === 0) ? '6px' : 'auto',
            zIndex: 30,
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            background: parentId ? 'rgba(255,255,255,0.9)' : 'transparent',
            padding: parentId ? '2px' : '0',
            borderRadius: parentId ? '4px' : '0',
            boxShadow: parentId ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ ...OVERLAY_BTN('#6b7280'), cursor: 'grab' }}
            title="Drag to reorder"
          >
            ⠿
          </div>
          <div
            style={{
              background: '#1a1a2e', color: '#9ca3af', borderRadius: '4px',
              padding: '4px 8px', fontSize: '0.68rem', fontWeight: '600', letterSpacing: '0.05em',
            }}
          >
            {element.type.toUpperCase()}
          </div>
          {!parentId && (
            <>
              <button style={OVERLAY_BTN('#6b7280')} onClick={() => moveElementUp(element.id)} disabled={index === 0} title="Move up">↑</button>
              <button style={OVERLAY_BTN('#6b7280')} onClick={() => moveElementDown(element.id)} disabled={index === totalCount - 1} title="Move down">↓</button>
            </>
          )}
          <button style={OVERLAY_BTN('#10b981')} onClick={() => duplicateElement(element.id)} title="Duplicate">⧉ Copy</button>
          <button style={OVERLAY_BTN('#ef4444')} onClick={() => deleteElement(element.id)} title="Delete">🗑 Delete</button>
        </div>
      )}

      {/* Element content */}
      {(() => {
        let childrenSlot = null;
        if (canHaveChildren) {
          childrenSlot = (
            <React.Fragment>
              {(element.children || []).map((child, i) => (
                <CanvasElement 
                  key={child.id} 
                  element={child} 
                  index={i} 
                  parentId={element.id} 
                  totalCount={(element.children || []).length} 
                  sidebarOnly={sidebarOnly} 
                />
              ))}
              <SectionInnerDropZone parentId={element.id} />
            </React.Fragment>
          );
        }

        return <ElementRenderer element={element} isPreview={false} childrenSlot={childrenSlot} sidebarOnly={sidebarOnly} />
      })()}
    </div>
  )
}
