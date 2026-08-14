import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { getElementDefault } from '../data/elementTypes'
import CanvasElement from './CanvasElement'
import ElementRenderer from './ElementRenderer'
import ScrollReveal from './ScrollReveal'
import { Eye, Smartphone, Tablet, Monitor, Layers, LayoutTemplate, X } from 'lucide-react'

const VIEWPORT_WIDTHS = { mobile: '375px', tablet: '768px', desktop: '960px' }

const S = {
  wrapper: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    backgroundColor: '#e8eaed',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
  },
  page: {
    margin: '0 auto',
    width: '100%',
    maxWidth: '960px',
    backgroundColor: '#ffffff',
    minHeight: '600px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    overflow: 'clip',
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
  emptyIcon: { color: '#9ca3af', display: 'flex', justifyContent: 'center' },
  emptyTitle: { fontSize: '1.2rem', fontWeight: '600', color: '#6b7280' },
  emptyText: { fontSize: '0.9rem', maxWidth: '280px', lineHeight: 1.5 },
  canvasLabel: {
    background: '#1a1a2e',
    color: '#9ca3af',
    borderRadius: '0 0 6px 6px',
    padding: '4px 14px',
    fontSize: '0.72rem',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    margin: '0 auto 8px auto',
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
    margin: '0 auto 0 auto',
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
  const { currentPage, addElement, selectElement, previewMode, viewportWidth, state, moveNode } = useBuilder()
  const [canvasDragOver, setCanvasDragOver] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const elements = currentPage?.elements || []
  const maxWidth = VIEWPORT_WIDTHS[viewportWidth] || '960px'
  const isSmallView = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  // ── Persistent sidebar: find any page that owns a sidebar navbar ──────────
  // The sidebar stays visible even when switching between pages.
  const allPages = state?.pages || []
  const sidebarSourcePage = allPages.find((p) =>
    p.elements?.[0]?.type === 'navbar' &&
    ['sidebar', 'sidebar-tabs'].includes(p.elements[0]?.props?.navTemplate)
  )
  const sidebarEl = sidebarSourcePage?.elements[0] || null
  const isSidebarLayout = !!sidebarEl

  // On the sidebar's own page → skip index 0 (the sidebar) for main content
  const onSidebarPage = isSidebarLayout && sidebarSourcePage?.id === currentPage?.id
  const mainEls = onSidebarPage ? elements.slice(1) : elements
  // Drop index offset accounts for the sidebar element occupying index 0
  const sidebarOffset = onSidebarPage ? 1 : 0

  const handleDropAtIndex = (e, index) => {
    const elementType = e.dataTransfer.getData('application/x-element-type')
    const elementId = e.dataTransfer.getData('application/x-element-id')
    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } }, index)
    } else if (elementId) {
      moveNode(elementId, null, index)
    }
  }

  const handleCanvasDrop = (e) => {
    e.preventDefault()
    setCanvasDragOver(false)
    const elementType = e.dataTransfer.getData('application/x-element-type')
    const elementId = e.dataTransfer.getData('application/x-element-id')
    if (elementType) {
      const def = getElementDefault(elementType)
      if (def) addElement({ type: def.type, props: { ...def.props }, styles: { ...def.styles } })
    } else if (elementId) {
      moveNode(elementId, null, -1)
    }
  }

  const handleCanvasClick = () => selectElement(null)

  // ── Sidebar layout renderer ───────────────────────────────────────────────
  const renderSidebarLayout = () => {
    if (!sidebarEl) return null
    const sidebarNavBg = sidebarEl.styles?.backgroundColor || '#1e1b4b'
    const sidebarBrand = sidebarEl.props?.brand || 'Menu'

    // The sidebar is editable only when the user is on the sidebar's source page.
    // On other pages it renders as read-only so drag/delete operations target the right page.
    const sidebarEditable = !previewMode && onSidebarPage
    const SidebarNode = sidebarEditable
      ? <CanvasElement element={sidebarEl} index={0} totalCount={elements.length} sidebarOnly />
      : <ElementRenderer element={sidebarEl} isPreview={previewMode} sidebarOnly />

    return (
      <div style={{ display: 'flex', minHeight: '600px', alignItems: 'stretch', position: 'relative' }}>

        {/* ── Mobile: top bar with hamburger ── */}
        {isSmallView && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '52px',
            display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px',
            backgroundColor: sidebarNavBg, zIndex: 20, flexShrink: 0,
          }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '7px 9px', display: 'flex', alignItems: 'center', lineHeight: 0, flexShrink: 0 }}
              title="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap' }}>{sidebarBrand}</span>
          </div>
        )}

        {/* ── Mobile: backdrop overlay ── */}
        {isSmallView && mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 25 }}
          />
        )}

        {/* ── Sidebar panel ── */}
        <div style={{
          flexShrink: 0,
          display: isSmallView ? (mobileSidebarOpen ? 'flex' : 'none') : 'flex',
          alignSelf: 'stretch',
          position: isSmallView ? 'absolute' : 'sticky',
          top: 0,
          bottom: isSmallView ? 0 : undefined,
          left: 0,
          maxHeight: isSmallView ? undefined : '100vh',
          zIndex: 30,
          transition: 'opacity 0.2s',
        }}>
          {/* Mobile close button */}
          {isSmallView && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                position: 'absolute', top: '12px', right: '10px',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: '6px', cursor: 'pointer', color: '#fff',
                padding: '4px 9px', fontSize: '1rem', zIndex: 40,
                lineHeight: 1,
              }}
              title="Close menu"
            >
              <X size={14} />
            </button>
          )}
          {SidebarNode}
        </div>

        {/* ── Main content area ── */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: isSmallView ? '52px' : 0 }}>
          {previewMode ? (
            mainEls.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
                No page content yet. Switch to edit mode and drag elements here.
              </div>
            ) : (
              mainEls.map((el) => (
                <ScrollReveal key={el.id} animation={el.props?.animation}>
                  <ElementRenderer element={el} isPreview />
                </ScrollReveal>
              ))
            )
          ) : (
            <>
              <DropZone onDrop={(e) => handleDropAtIndex(e, sidebarOffset)} />
              {mainEls.length === 0 ? (
                <div
                  style={{ ...S.empty, margin: '24px' }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleDropAtIndex(e, sidebarOffset) }}
                >
                  <span style={S.emptyIcon}><LayoutTemplate size={36} strokeWidth={1.2} /></span>
                  <div style={S.emptyTitle}>Add Page Content</div>
                  <div style={S.emptyText}>Drag elements from the left panel into this area.</div>
                </div>
              ) : (
                mainEls.map((el, i) => (
                  <React.Fragment key={el.id}>
                    <CanvasElement element={el} index={i + sidebarOffset} totalCount={elements.length} />
                    <DropZone onDrop={(e) => handleDropAtIndex(e, i + sidebarOffset + 1)} compact />
                  </React.Fragment>
                ))
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={S.wrapper} onClick={handleCanvasClick}>
      {previewMode && (
        <div style={{ ...S.previewBanner, maxWidth, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Eye size={13} /> Preview Mode —{' '}
          {viewportWidth === 'mobile' ? <><Smartphone size={13} /> Mobile</> : viewportWidth === 'tablet' ? <><Tablet size={13} /> Tablet</> : <><Monitor size={13} /> Desktop</>}
        </div>
      )}

      {!previewMode && (
        <div style={{ ...S.canvasLabel, maxWidth }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Layers size={12} /> Canvas</span>
          <span>{elements.length} element{elements.length !== 1 ? 's' : ''}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {viewportWidth === 'mobile' ? <><Smartphone size={11} /> Mobile 375px</> : viewportWidth === 'tablet' ? <><Tablet size={11} /> Tablet 768px</> : <><Monitor size={11} /> Desktop 960px</>}
          </span>
        </div>
      )}

      <div
        style={{
          ...S.page,
          width: VIEWPORT_WIDTHS[viewportWidth] || '960px',
          maxWidth: 'none',
          backgroundColor: currentPage?.canvasBg || '#ffffff',
          overflow: isSidebarLayout ? 'visible' : 'clip',
          outline: !previewMode && canvasDragOver ? '2px dashed #4f6ef7' : 'none',
        }}
        onDragOver={(e) => { e.preventDefault(); setCanvasDragOver(true) }}
        onDragLeave={() => setCanvasDragOver(false)}
        onDrop={handleCanvasDrop}
        onClick={(e) => e.stopPropagation()}
      >
        {isSidebarLayout ? renderSidebarLayout() : (
          <>
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
              <>
                <DropZone onDrop={(e) => handleDropAtIndex(e, 0)} />
                {elements.length === 0 ? (
                  <div style={S.empty} onDragOver={(e) => e.preventDefault()} onDrop={handleCanvasDrop}>
                    <span style={S.emptyIcon}><LayoutTemplate size={36} strokeWidth={1.2} /></span>
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
          </>
        )}
      </div>
    </div>
  )
}
