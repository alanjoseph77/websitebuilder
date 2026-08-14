import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { ELEMENT_CATEGORIES } from '../data/elementTypes'
import { ChevronRight, ChevronDown, Layers, Component, Box } from 'lucide-react'

// A helper to get element label from its type
function getElementLabel(type) {
  for (const cat of ELEMENT_CATEGORIES) {
    const def = cat.elements.find(e => e.type === type)
    if (def && def.label) return def.label
  }
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

import { getElementDefault } from '../data/elementTypes'

function LayerItem({ element, parentId, index, depth, selectedId, selectedChildInfo, selectElement, selectChild }) {
  const [expanded, setExpanded] = useState(true)
  const [dragState, setDragState] = useState(null) // 'top', 'bottom', 'inside'
  const isSelected = parentId
    ? selectedChildInfo?.childId === element.id
    : selectedId === element.id
  const hasChildren = element.children && element.children.length > 0
  const label = getElementLabel(element.type)

  return (
    <div>
      <div 
        draggable
        onDragStart={(e) => {
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

          const { moveNode, addElement } = window.__builderContextAPI || {} // Will hack or pass down
          
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
          if (parentId) {
            selectChild(parentId, element.id)
          } else {
            selectElement(element.id)
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `6px 8px 6px ${depth * 16 + 8}px`,
          backgroundColor: isSelected ? '#eff6ff' : 'transparent',
          borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
          cursor: 'pointer',
          color: isSelected ? '#1e40af' : '#374151',
          fontSize: '0.85rem',
          userSelect: 'none',
          position: 'relative',
        }}
        onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#f3f4f6' }}
        onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        {/* Drop Indicators */}
        {dragState === 'top' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#3b82f6' }} />}
        {dragState === 'bottom' && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#3b82f6' }} />}
        {dragState === 'inside' && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, border: '2px solid #3b82f6', pointerEvents: 'none' }} />}
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
        
        {hasChildren ? <Box size={14} style={{ marginRight: 6, color: isSelected ? '#3b82f6' : '#6b7280' }} /> : <Component size={14} style={{ marginRight: 6, color: isSelected ? '#3b82f6' : '#9ca3af' }} />}
        
        <span style={{ fontWeight: isSelected ? '600' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
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
