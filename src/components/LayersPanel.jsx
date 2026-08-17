import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { ELEMENT_CATEGORIES } from '../data/elementTypes'
import { ChevronRight, ChevronDown, Layers, Component, Box, ArrowUp, ArrowDown } from 'lucide-react'

// A helper to get element label from its type
function getElementLabel(type) {
  for (const cat of ELEMENT_CATEGORIES) {
    const def = cat.elements.find(e => e.type === type)
    if (def && def.label) return def.label
  }
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

import { getElementDefault } from '../data/elementTypes'
import { Eye, EyeOff, Lock, Unlock, MoreHorizontal, Copy, Trash2, Edit2, Check, X } from 'lucide-react'

function LayerItem({ element, parentId, index, depth, selectedId, selectedChildInfo, selectElement, selectChild }) {
  const { updateElement, updateChildElement, deleteElement, deleteChildElement, duplicateElement } = useBuilder()
  const [expanded, setExpanded] = useState(true)
  const [dragState, setDragState] = useState(null) // 'top', 'bottom', 'inside'
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  
  const isSelected = parentId
    ? selectedChildInfo?.childId === element.id
    : selectedId === element.id
  const hasChildren = element.children && element.children.length > 0
  const label = element.props?.layerName || getElementLabel(element.type)
  const isHidden = element.props?.hidden || false
  const isLocked = element.props?.locked || false

  const handleUpdate = (updates) => {
    if (parentId) updateChildElement(parentId, element.id, updates)
    else updateElement(element.id, updates)
  }

  const handleDelete = () => {
    if (parentId) deleteChildElement(parentId, element.id)
    else deleteElement(element.id)
  }

  const handleRenameSubmit = () => {
    if (editName.trim()) {
      handleUpdate({ props: { ...element.props, layerName: editName.trim() } })
    }
    setIsEditing(false)
  }

  return (
    <div>
      <div 
        draggable={!isLocked && !isEditing}
        onDragStart={(e) => {
          if (isLocked) { e.preventDefault(); return; }
          e.stopPropagation()
          e.dataTransfer.setData('application/x-layer-id', element.id)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const rect = e.currentTarget.getBoundingClientRect()
          const y = e.clientY - rect.top
          const h = rect.height
          if (y < h * 0.25) setDragState('top')
          else if (y > h * 0.75) setDragState('bottom')
          else setDragState('inside')
        }}
        onDragLeave={(e) => {
          e.stopPropagation()
          setDragState(null)
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const pos = dragState
          setDragState(null)

          const draggedId = e.dataTransfer.getData('application/x-layer-id')
          const elementType = e.dataTransfer.getData('application/x-element-type')
          const canvasElementId = e.dataTransfer.getData('application/x-element-id')
          const sourceId = draggedId || canvasElementId

          const { moveNode, addElement } = window.__builderContextAPI || {} 
          
          let targetParentId = parentId
          let insertIndex = index

          if (pos === 'inside') {
            targetParentId = element.id
            insertIndex = -1 // append
          } else if (pos === 'bottom') {
            insertIndex = index + 1
          }

          if (sourceId && sourceId !== element.id && moveNode) {
            moveNode(sourceId, targetParentId, insertIndex)
          } else if (elementType && addElement) {
            const def = getElementDefault(elementType)
            if (def) addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } }, insertIndex, targetParentId)
          }
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (isEditing) return
          if (parentId) selectChild(parentId, element.id)
          else selectElement(element.id)
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowMenu(!showMenu)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `6px 8px 6px ${depth * 16 + 8}px`,
          backgroundColor: isSelected ? '#eff6ff' : 'transparent',
          borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
          cursor: isEditing ? 'text' : 'pointer',
          color: isSelected ? '#1e40af' : '#374151',
          fontSize: '0.85rem',
          userSelect: 'none',
          position: 'relative',
          opacity: isHidden ? 0.5 : 1
        }}
        onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#f3f4f6' }}
        onMouseLeave={(e) => { 
          if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
          setShowMenu(false)
        }}
      >
        {dragState === 'top' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#3b82f6', zIndex: 10 }} />}
        {dragState === 'bottom' && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#3b82f6', zIndex: 10 }} />}
        {dragState === 'inside' && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, border: '2px solid #3b82f6', pointerEvents: 'none', zIndex: 10 }} />}
        
        <div 
          style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation()
              setExpanded(!expanded)
            }
          }}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={14} color="#6b7280" /> : <ChevronRight size={14} color="#6b7280" />
          ) : (
             <span style={{width: 14}} />
          )}
        </div>
        
        {hasChildren ? <Box size={14} style={{ marginRight: 6, color: isSelected ? '#3b82f6' : '#6b7280', flexShrink: 0 }} /> : <Component size={14} style={{ marginRight: 6, color: isSelected ? '#3b82f6' : '#9ca3af', flexShrink: 0 }} />}
        
        {isEditing ? (
          <input 
            autoFocus
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRenameSubmit()
              if (e.key === 'Escape') setIsEditing(false)
            }}
            onBlur={handleRenameSubmit}
            style={{ fontSize: '0.85rem', flex: 1, padding: '2px 4px', border: '1px solid #3b82f6', borderRadius: '4px', outline: 'none' }}
          />
        ) : (
          <span style={{ fontWeight: isSelected ? '600' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, textDecoration: isHidden ? 'line-through' : 'none' }}>
            {label} {isLocked && '🔒'}
          </span>
        )}

        {/* Hover / Actions */}
        {!isEditing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', opacity: isSelected || showMenu ? 1 : 0.4 }}>
            <button 
              onClick={(e) => { e.stopPropagation(); handleUpdate({ props: { ...element.props, hidden: !isHidden } }) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6b7280' }}
              title={isHidden ? "Show" : "Hide"}
            >
              {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleUpdate({ props: { ...element.props, locked: !isLocked } }) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6b7280' }}
              title={isLocked ? "Unlock" : "Lock"}
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6b7280' }}
                title="More"
              >
                <MoreHorizontal size={14} />
              </button>
              {showMenu && (
                <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '4px', zIndex: 100, minWidth: '120px' }}>
                  <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditName(label); setShowMenu(false); }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#374151', borderRadius: '4px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><Edit2 size={12} /> Rename</button>
                  <button onClick={(e) => { e.stopPropagation(); duplicateElement(element.id); setShowMenu(false); }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#374151', borderRadius: '4px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><Copy size={12} /> Duplicate</button>
                  <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }} />
                  {index > 0 && (
                    <button onClick={(e) => { e.stopPropagation(); window.__builderContextAPI?.moveNode?.(element.id, parentId, index - 1); setShowMenu(false); }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#374151', borderRadius: '4px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><ArrowUp size={12} /> Move Up</button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); window.__builderContextAPI?.moveNode?.(element.id, parentId, index + 1); setShowMenu(false); }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#374151', borderRadius: '4px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><ArrowDown size={12} /> Move Down</button>
                  <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }} />
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(); setShowMenu(false); }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#ef4444', borderRadius: '4px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><Trash2 size={12} /> Delete</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {expanded && hasChildren && (
        <div>
          {element.children.map((child, i) => (
            <LayerItem 
              key={child.id} 
              element={child}
              parentId={parentId || element.id}
              index={i}
              depth={depth + 1} 
              selectedId={selectedId} 
              selectedChildInfo={selectedChildInfo}
              selectElement={selectElement} 
              selectChild={selectChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LayersPanel() {
  const context = useBuilder()
  const { state, selectElement, selectChild } = context
  const currentPage = state.pages.find(p => p.id === state.currentPageId)
  const elements = currentPage?.elements || []

  // Global hack to pass context down without prop drilling it recursively
  window.__builderContextAPI = context

  return (
    <div style={{ padding: '0 0 12px 0' }}>
      <div style={{ 
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
        gap: '8px'
      }}>
        <Layers size={14} /> LAYERS
      </div>
      
      {elements.length === 0 ? (
        <div style={{ padding: '16px', color: '#6b7280', fontSize: '0.85rem', textAlign: 'center' }}>
          No elements on this page.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {elements.map((element, i) => (
            <LayerItem 
              key={element.id} 
              element={element}
              parentId={null}
              index={i}
              depth={0} 
              selectedId={state.selectedElementId}
              selectedChildInfo={state.selectedChildInfo}
              selectElement={selectElement}
              selectChild={selectChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}
