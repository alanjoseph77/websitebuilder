import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { getElementDefault } from '../data/elementTypes'
import CanvasElement from './CanvasElement'
import ElementRenderer from './ElementRenderer'
import ScrollReveal from './ScrollReveal'

const VIEWPORT_WIDTHS = { mobile: '375px', tablet: '768px', desktop: '960px' }

const S = {
  wrapper: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    backgroundColor: '#e8eaed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
  },
  page: {
    width: '100%',
    maxWidth: '960px',
    backgroundColor: '#ffffff',
    minHeight: '600px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    color: '#9ca3af',
    textAlign: 'center',
    gap: '12px',
    minHeight: '400px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    margin: '40px',
  },
  emptyIcon: {
    fontSize: '3rem',
  },
  emptyTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#6b7280',
  },
  emptyText: {
    fontSize: '0.9rem',
    maxWidth: '280px',
    lineHeight: 1.5,
  },
  dropIndicator: {
    height: '4px',
    backgroundColor: '#4f6ef7',
    borderRadius: '2px',
    margin: '0 -2px',
    boxShadow: '0 0 8px rgba(79,110,247,0.5)',
  },
  canvasLabel: {
    background: '#1a1a2e',
    color: '#9ca3af',
    borderRadius: '0 0 6px 6px',
    padding: '4px 14px',
    fontSize: '0.72rem',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '8px',
    width: '100%',
    maxWidth: '960px',
  },
  previewBanner: {
    background: '#4f6ef7',
    color: '#fff',
    padding: '6px 16px',
    fontSize: '0.82rem',
    textAlign: 'center',
    fontWeight: '600',
    width: '100%',
    maxWidth: '960px',
    borderRadius: '4px 4px 0 0',
    marginBottom: '0',
  },
}

function DropZone({ onDrop, compact = false }) {
  const [over, setOver] = useState(false)

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(e) }}
      style={{
        height: compact ? (over ? '40px' : '8px') : (over ? '60px' : '8px'),
        transition: 'height 0.15s',
        backgroundColor: over ? 'rgba(79,110,247,0.1)' : 'transparent',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        color: '#4f6ef7',
        fontWeight: '600',
      }}
    >
      {over && '+ Drop here'}
    </div>
  )
}

export default function Canvas() {
  const { currentPage, addElement, selectElement, previewMode, viewportWidth } = useBuilder()
  const [canvasDragOver, setCanvasDragOver] = useState(false)
  const elements = currentPage?.elements || []
  const maxWidth = VIEWPORT_WIDTHS[viewportWidth] || '960px'

  const handleDropAtIndex = (e, index) => {
    // New element from panel
    const elementType = e.dataTransfer.getData('application/x-element-type')
    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) {
        addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } }, index)
      }
      return
    }
    // Reorder handled in CanvasElement
  }

  const handleCanvasDrop = (e) => {
    e.preventDefault()
    setCanvasDragOver(false)
    const elementType = e.dataTransfer.getData('application/x-element-type')
    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) {
        addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } })
      }
    }
  }

  const handleCanvasClick = () => selectElement(null)

  return (
    <div style={S.wrapper} onClick={handleCanvasClick}>
      {previewMode && (
        <div style={{ ...S.previewBanner, maxWidth }}>
          👁 Preview Mode — {viewportWidth === 'mobile' ? '📱 Mobile' : viewportWidth === 'tablet' ? '📟 Tablet' : '🖥 Desktop'}
        </div>
      )}

      {!previewMode && (
        <div style={{ ...S.canvasLabel, maxWidth }}>
          <span>🖥 Canvas</span>
          <span>{elements.length} element{elements.length !== 1 ? 's' : ''}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#6b7280' }}>
            {viewportWidth === 'mobile' ? '📱 Mobile 375px' : viewportWidth === 'tablet' ? '📟 Tablet 768px' : '🖥 Desktop 960px'}
          </span>
        </div>
      )}

      <div
        style={{
          ...S.page,
          maxWidth,
          outline: !previewMode && canvasDragOver ? '2px dashed #4f6ef7' : 'none',
        }}
        onDragOver={(e) => { e.preventDefault(); setCanvasDragOver(true) }}
        onDragLeave={() => setCanvasDragOver(false)}
        onDrop={handleCanvasDrop}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview mode: render elements read-only with scroll animations */}
        {previewMode ? (
          elements.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
              No elements yet. Switch back to edit mode to add content.
            </div>
          ) : (
            elements.map((el) => (
              <ScrollReveal key={el.id} animation={el.props?.animation}>
                <ElementRenderer element={el} isPreview />
              </ScrollReveal>
            ))
          )
        ) : (
          /* Edit mode: elements with controls + drop zones */
          <>
            <DropZone onDrop={(e) => handleDropAtIndex(e, 0)} />
            {elements.length === 0 ? (
              <div
                style={S.empty}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCanvasDrop}
              >
                <span style={S.emptyIcon}>🏗️</span>
                <div style={S.emptyTitle}>Start Building</div>
                <div style={S.emptyText}>
                  Drag elements from the left panel and drop them here, or click an element to add it.
                </div>
              </div>
            ) : (
              elements.map((el, i) => (
                <React.Fragment key={el.id}>
                  <CanvasElement element={el} index={i} totalCount={elements.length} />
                  <DropZone onDrop={(e) => handleDropAtIndex(e, i + 1)} compact />
                </React.Fragment>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
