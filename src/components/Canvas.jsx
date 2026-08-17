import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useBuilder } from '../context/BuilderContext'
import { getElementDefault } from '../data/elementTypes'
import CanvasElement from './CanvasElement'
import ElementRenderer from './ElementRenderer'
import ScrollReveal from './ScrollReveal'
import { generateThemeCSS, generateCSSForElements } from '../utils/styleUtils'
import { Eye, Smartphone, Tablet, Monitor, Layers, LayoutTemplate, X, ZoomIn, ChevronDown, MousePointer2, Pencil, Grid, Columns, Crosshair, Plus, ChevronRight, Settings, LayoutPanelLeft } from 'lucide-react'

const VIEWPORT_WIDTHS = { mobile: '375px', tablet: '768px', desktop: '100%' }

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

function CanvasIframe({ children, state, zoomLevel = 100, showGrid = false }) {
  const iframeRef = useRef(null)
  const [mountNode, setMountNode] = useState(null)
  const [headNode, setHeadNode] = useState(null)

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        setMountNode(doc.body)
        setHeadNode(doc.head)
        
        doc.body.style.margin = '0'
        doc.body.style.padding = '0'
        doc.body.style.boxSizing = 'border-box'
        
        const link = doc.createElement('link')
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
        link.rel = 'stylesheet'
        doc.head.appendChild(link)
      }
    }
  }, [])

  const allElements = state?.pages?.reduce((acc, page) => [...acc, ...page.elements], []) || []
  const css = generateThemeCSS(state?.theme) + '\n' + generateCSSForElements(allElements, state?.components || [])

  const gridCss = showGrid ? `
    body {
      background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
      background-size: 20px 20px;
    }
  ` : ''

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block', backgroundColor: 'transparent', minHeight: '600px' }}
      title="Canvas Iframe"
    >
      {headNode && createPortal(<style>{css}</style>, headNode)}
      {headNode && createPortal(<style>{`
        body { font-family: 'Inter', sans-serif; overflow-x: hidden; transform: scale(${zoomLevel / 100}); transform-origin: top center; min-height: ${100 / (zoomLevel / 100)}vh; }
        * { box-sizing: border-box; }
        ${gridCss}
      `}</style>, headNode)}
      {mountNode && createPortal(
        <div style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>, 
      mountNode)}
    </iframe>
  )
}

export default function Canvas({ leftOpen, setLeftOpen, rightOpen, setRightOpen, leftTab, setLeftTab }) {
  const { currentPage, addElement, selectElement, previewMode, setPreviewMode, viewportWidth, state, moveNode } = useBuilder()
  const [canvasDragOver, setCanvasDragOver] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showGrid, setShowGrid] = useState(false)

  const elements = currentPage?.elements || []
  const maxWidth = VIEWPORT_WIDTHS[viewportWidth] || '100%'
  const isSmallView = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const getBreadcrumbs = () => {
    const targetId = state.selectedChildInfo ? state.selectedChildInfo.childId : state.selectedElementId;
    if (!targetId) return [{ id: 'body', type: 'body' }];
    
    const findPath = (els, currentPath = []) => {
      for (const el of els) {
        const path = [...currentPath, { id: el.id, type: el.type, name: el.name }];
        if (el.id === targetId) return path;
        if (el.children) {
          const found = findPath(el.children, path);
          if (found) return found;
        }
      }
      return null;
    };
    
    const path = findPath(elements) || [];
    return [{ id: 'body', type: 'body' }, ...path];
  };

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
    <div style={{
      flex: 1,
      overflow: 'auto',
      background: (previewMode && viewportWidth === 'desktop') ? '#fff' : '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: (previewMode && viewportWidth === 'desktop') ? '0' : (isSmallView ? '12px' : '32px')
    }}>
      {!previewMode && (
        <div style={{ ...S.canvasLabel, maxWidth: maxWidth, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Layers size={12} /> Canvas</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid #333', paddingLeft: '16px' }}>
              <Layers size={16} cursor="pointer" onClick={() => { setLeftOpen(!leftOpen); setLeftTab('layers'); }} style={{ margin: '0 4px', color: '#9ca3af' }}/>
              <Eye size={16} cursor="pointer" onClick={() => setPreviewMode(true)} style={{ margin: '0 4px', color: '#9ca3af' }}/>
              <Settings size={16} cursor="pointer" onClick={() => setRightOpen(!rightOpen)} style={{ margin: '0 4px', color: '#9ca3af' }}/>
              <div style={{ width: '1px', height: '16px', background: '#333', margin: '0 8px' }} />
              <LayoutPanelLeft size={16} cursor="pointer" onClick={() => setLeftOpen(!leftOpen)} style={{ color: '#9ca3af' }}/>
            </div>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {viewportWidth === 'mobile' ? <><Smartphone size={11} /> Mobile 375px</> : viewportWidth === 'tablet' ? <><Tablet size={11} /> Tablet 768px</> : <><Monitor size={11} /> Desktop</>}
          </span>
        </div>
      )}

      <div
        style={{
          maxWidth: (previewMode && viewportWidth === 'desktop') ? '100%' : (VIEWPORT_WIDTHS[viewportWidth] || '100%'),
          width: '100%',
          minHeight: (previewMode && viewportWidth === 'desktop') ? '100vh' : '600px',
          background: '#fff',
          boxShadow: (previewMode && viewportWidth === 'desktop') ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: (previewMode && viewportWidth === 'desktop') ? '0' : '8px',
          border: (previewMode && viewportWidth === 'desktop') ? 'none' : '1px solid #e5e7eb',
          position: 'relative',
          transition: 'max-width 0.3s ease, border-radius 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
          overflow: 'hidden'
        }}
        onDragOver={(e) => { e.preventDefault(); setCanvasDragOver(true) }}
        onDragLeave={() => setCanvasDragOver(false)}
        onDrop={handleCanvasDrop}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Section Label */}
        {!previewMode && (
          <div style={{ position: 'absolute', top: 0, left: 0, background: '#3b82f6', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderBottomRightRadius: '4px', zIndex: 50, fontWeight: '600' }}>
            Section
          </div>
        )}
        
        <CanvasIframe state={state} zoomLevel={zoomLevel} showGrid={showGrid}>
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
                    <div style={{
                      padding: '40px', textAlign: 'center', color: '#9ca3af',
                      border: '2px dashed #e5e7eb', margin: '20px', borderRadius: '8px',
                      background: canvasDragOver ? '#eff6ff' : 'transparent',
                      borderColor: canvasDragOver ? '#3b82f6' : '#e5e7eb',
                      minHeight: '200px', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                    }}>
                      <LayoutTemplate size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <p>Drag elements here or click the + button to start building</p>
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
        </CanvasIframe>
        
        {/* + Button at the bottom of the canvas border */}
        {!previewMode && (
          <div 
            onClick={() => addElement({ type: 'section', props: { layout: '1-col' }, styles: { padding: '60px 20px', backgroundColor: '#ffffff' } })}
            style={{ position: 'absolute', bottom: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, border: '2px solid #fff' }}
          >
            <Plus size={16} />
          </div>
        )}
      </div>

      {!previewMode && (
        <>
          {/* Breadcrumbs - Bottom Left */}
          <div style={{ position: 'absolute', bottom: '16px', left: '24px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
            {getBreadcrumbs().map((crumb, idx, arr) => (
              <React.Fragment key={crumb.id || idx}>
                <span 
                  onClick={() => crumb.id !== 'body' && selectElement(crumb.id)}
                  style={{
                    color: idx === arr.length - 1 ? '#3b82f6' : 'inherit', 
                    cursor: crumb.id !== 'body' ? 'pointer' : 'default',
                    textTransform: 'capitalize'
                  }}
                >
                  {crumb.name || crumb.type.replace('-', ' ')}
                </span>
                {idx < arr.length - 1 && <ChevronRight size={12} />}
              </React.Fragment>
            ))}
          </div>

          {/* Quick Add Elements - Bottom Center */}
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', background: '#ffffff', borderRadius: '6px', border: '1px solid #e5e7eb', padding: '4px', gap: '4px' }}>
              <button onClick={() => addElement({ type: 'section', props: { layout: '1-col' }, styles: { padding: '60px 20px', backgroundColor: '#ffffff' } })} style={{ border: 'none', background: 'transparent', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer' }}><Crosshair size={16} /></button>
              <div style={{ width: '1px', background: '#e5e7eb', margin: '4px 0' }} />
              <button onClick={() => addElement({ type: 'section', props: { layout: '2-col' }, styles: { padding: '60px 20px', backgroundColor: '#ffffff' } })} style={{ border: 'none', background: 'transparent', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer' }}><Columns size={16} /></button>
              <button onClick={() => addElement({ type: 'section', props: { layout: '3-col' }, styles: { padding: '60px 20px', backgroundColor: '#ffffff' } })} style={{ border: 'none', background: 'transparent', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer' }}><Grid size={16} /></button>
            </div>
          </div>

          {/* Canvas Tools - Bottom Right Area */}
          <div style={{ position: 'absolute', bottom: '16px', right: '120px', display: 'flex', alignItems: 'center', background: '#ffffff', borderRadius: '6px', border: '1px solid #e5e7eb', padding: '4px', gap: '6px' }}>
            <button onClick={() => setPreviewMode(!previewMode)} style={{ border: 'none', background: 'transparent', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', cursor: 'pointer' }}><Eye size={16} /></button>
            <button onClick={() => setShowGrid(!showGrid)} style={{ border: 'none', background: 'transparent', color: showGrid ? '#3b82f6' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', cursor: 'pointer' }}><Grid size={16} /></button>
            <button style={{ border: 'none', background: 'transparent', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', cursor: 'pointer' }}><Pencil size={16} /></button>
            <button style={{ border: 'none', background: 'transparent', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', cursor: 'pointer' }}><MousePointer2 size={16} /></button>
            <div style={{ width: '1px', background: '#e5e7eb', height: '20px', margin: '0 4px' }} />
            
            <div style={{ position: 'relative' }}>
              <select 
                value={zoomLevel} 
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                style={{
                  appearance: 'none', border: 'none', background: 'transparent', color: '#6b7280',
                  fontSize: '0.75rem', fontWeight: '500', padding: '4px 24px 4px 8px', cursor: 'pointer', outline: 'none'
                }}
              >
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
                <option value={125}>125%</option>
                <option value={150}>150%</option>
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }} />
            </div>
          </div>

          {/* Layers Quickly - Bottom Right */}
          <button onClick={() => { setLeftOpen(true); setLeftTab('layers'); }} style={{ position: 'absolute', bottom: '16px', right: '24px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer' }}>
            <Layers size={14} /> Layers
          </button>
        </>
      )}
    </div>
  )
}
