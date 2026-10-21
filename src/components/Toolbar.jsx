import React, { useState, useEffect } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { downloadSite } from '../utils/downloadCode'
import { Flame, Smartphone, Tablet, Monitor, Eye, Pencil, Download, Loader2, Undo2, Redo2, ArrowLeft, ChevronDown } from 'lucide-react'

const S = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    color: '#ffffff',
    padding: '0 16px',
    height: '52px',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    zIndex: 100,
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#ffffff',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: { fontSize: '1.4rem' },
  logoSpan: { color: '#4f6ef7' },
  pages: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: '8px',
    marginRight: 'auto',
    overflowX: 'auto',
    flexShrink: 0,
  },
  pageTab: (active) => ({
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    backgroundColor: active ? '#4f6ef7' : 'rgba(255,255,255,0.08)',
    color: active ? '#fff' : '#aaaaaa',
    border: 'none',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
  }),
  addPageBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#aaaaaa',
    border: '1px dashed rgba(255,255,255,0.2)',
    transition: 'all 0.15s',
    flexShrink: 0,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  viewportGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '6px',
    padding: '3px',
  },
  viewportBtn: (active) => ({
    width: '30px',
    height: '26px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: active ? '#4f6ef7' : 'transparent',
    color: active ? '#fff' : '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  }),
  btn: (variant = 'secondary', isMobile = false) => ({
    padding: isMobile ? '7px 10px' : '7px 16px',
    borderRadius: '6px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '0' : '6px',
    ...(variant === 'primary'
      ? { backgroundColor: '#4f6ef7', color: '#fff' }
      : variant === 'success'
      ? { backgroundColor: '#22c55e', color: '#fff' }
      : { backgroundColor: 'rgba(255,255,255,0.12)', color: '#ddd' }),
  }),
  pageInput: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '0.8rem',
    outline: 'none',
    width: '90px',
  },
}

const VIEWPORTS = [
  { key: 'mobile', Icon: Smartphone, label: 'Mobile (375px)' },
  { key: 'tablet', Icon: Tablet, label: 'Tablet (768px)' },
  { key: 'desktop', Icon: Monitor, label: 'Desktop (960px)' },
]

export default function Toolbar({ onBack }) {
  const { state, dispatch, previewMode, setPreviewMode, viewportWidth, setViewportWidth, undo, redo, canUndo, canRedo } = useBuilder()
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 840)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 840)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { uploadedImages } = useBuilder()

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadSite(state, uploadedImages)
    } catch (err) {
      alert('Download failed: ' + err.message)
    }
    setDownloading(false)
  }

  const viewportWidthPx = viewportWidth === 'mobile' ? '375px' : viewportWidth === 'tablet' ? '768px' : '1280px';

  return (
    <div style={{ ...S.toolbar, padding: isMobile ? '0 10px' : '0 16px', gap: isMobile ? '8px' : '16px' }}>
      {/* Group Logo and Back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', flex: isMobile ? 'none' : 1 }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{ 
              background: 'transparent', border: 'none',
              padding: isMobile ? '6px 2px' : '6px 0', fontSize: '0.8rem', fontWeight: '500', color: '#9ca3af',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
            title="Back to Projects"
          >
            <ArrowLeft size={16} /> {!isMobile && 'Projects'}
          </button>
        )}
        
        {/* Logo */}
        <div style={{ ...S.logo, fontSize: isMobile ? '0.95rem' : '1.1rem' }}>
          <Flame size={isMobile ? 16 : 18} style={{ color: '#ef4444' }} />
          Site<span style={S.logoSpan}>Forge</span>
        </div>
      </div>

      {/* Center: Viewport Controls */}
      {isMobile ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={() => setViewportWidth(viewportWidth === 'mobile' ? 'desktop' : 'mobile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            title={`Current: ${viewportWidth}. Tap to toggle view`}
          >
            {viewportWidth === 'mobile' ? <Smartphone size={13} style={{ color: '#60a5fa' }} /> : <Monitor size={13} style={{ color: '#60a5fa' }} />}
            <span style={{ textTransform: 'capitalize' }}>{viewportWidth}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'center' }}>
          <div style={{...S.viewportGroup, background: 'transparent'}}>
            <button 
              style={{...S.viewportBtn(viewportWidth === 'desktop'), background: viewportWidth === 'desktop' ? 'rgba(255,255,255,0.1)' : 'transparent', border: viewportWidth === 'desktop' ? '1px solid rgba(255,255,255,0.2)' : 'none', padding: '4px 12px', width: 'auto'}} 
              onClick={() => setViewportWidth('desktop')} 
              title="Desktop"
            >
              <Monitor size={15} style={{marginRight: '6px'}} /> {viewportWidth === 'desktop' ? 'Desktop' : ''}
            </button>
            <button style={S.viewportBtn(viewportWidth === 'mobile')} onClick={() => setViewportWidth('mobile')} title="Mobile"><Smartphone size={15} /></button>
            <button style={S.viewportBtn(viewportWidth === 'tablet')} onClick={() => setViewportWidth('tablet')} title="Tablet"><Tablet size={15} /></button>
          </div>
          
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>{viewportWidthPx}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>100% <ChevronDown size={12} /></span>
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div style={{ ...S.actions, flex: isMobile ? 'none' : 1, justifyContent: 'flex-end', gap: isMobile ? '6px' : '16px', marginLeft: isMobile ? 'auto' : 0 }}>
        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: isMobile ? '2px' : '8px' }}>
          <button
            style={{ ...S.viewportBtn(false), opacity: canUndo ? 1 : 0.4, cursor: canUndo ? 'pointer' : 'default', color: '#fff', width: isMobile ? '28px' : '30px' }}
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={isMobile ? 15 : 16} />
          </button>
          <button
            style={{ ...S.viewportBtn(false), opacity: canRedo ? 1 : 0.4, cursor: canRedo ? 'pointer' : 'default', color: '#fff', width: isMobile ? '28px' : '30px' }}
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={isMobile ? 15 : 16} />
          </button>
        </div>
        
        {!isMobile && <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }} />}
        
        <button 
          style={{...S.btn('secondary', isMobile), background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: isMobile ? '6px 8px' : '7px 16px'}} 
          onClick={() => setPreviewMode(!previewMode)} 
          title="Preview Mode"
        >
          {previewMode ? <Pencil size={15} /> : <Eye size={15} />}
          {!isMobile && (previewMode ? ' Edit' : ' Preview')}
        </button>
        
        <button 
          style={{...S.btn('primary', isMobile), background: '#3b82f6', padding: isMobile ? '6px 10px' : '7px 16px'}} 
          onClick={handleDownload}
          disabled={downloading}
          title="Download Code"
        >
          {downloading ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
          <span>{downloading ? (isMobile ? '...' : ' Exporting...') : ' Export'}</span>
        </button>
      </div>
    </div>
  )
}
