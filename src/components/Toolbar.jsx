import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { downloadSite } from '../utils/downloadCode'

const S = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '0 16px',
    height: '52px',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#ffffff',
    textDecoration: 'none',
  },
  logoIcon: { fontSize: '1.4rem' },
  logoSpan: { color: '#4f6ef7' },
  pages: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
    marginLeft: '24px',
    overflowX: 'auto',
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
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  btn: (variant = 'secondary') => ({
    padding: '7px 16px',
    borderRadius: '6px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
  { key: 'mobile', icon: '📱', label: 'Mobile (375px)' },
  { key: 'tablet', icon: '📟', label: 'Tablet (768px)' },
  { key: 'desktop', icon: '🖥', label: 'Desktop (960px)' },
]

export default function Toolbar() {
  const { state, dispatch, previewMode, setPreviewMode, viewportWidth, setViewportWidth } = useBuilder()
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal] = useState('')
  const [downloading, setDownloading] = useState(false)

  const handleAddPage = () => {
    const name = `Page ${state.pages.length + 1}`
    dispatch({ type: 'ADD_PAGE', payload: name })
  }

  const handleRenameStart = (page, e) => {
    e.stopPropagation()
    setRenamingId(page.id)
    setRenameVal(page.name)
  }

  const handleRenameCommit = () => {
    if (renamingId && renameVal.trim()) {
      dispatch({ type: 'RENAME_PAGE', payload: { id: renamingId, name: renameVal.trim() } })
    }
    setRenamingId(null)
  }

  const handleDeletePage = (id, e) => {
    e.stopPropagation()
    if (state.pages.length === 1) return alert('Cannot delete the only page.')
    if (confirm('Delete this page?')) {
      dispatch({ type: 'DELETE_PAGE', payload: id })
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadSite(state.pages)
    } catch (err) {
      alert('Download failed: ' + err.message)
    }
    setDownloading(false)
  }

  return (
    <div style={S.toolbar}>
      {/* Logo */}
      <div style={S.logo}>
        <span style={S.logoIcon}>🏗️</span>
        Site<span style={S.logoSpan}>Forge</span>
      </div>

      {/* Page tabs */}
      <div style={S.pages}>
        {state.pages.map((page) => (
          <button
            key={page.id}
            style={S.pageTab(page.id === state.currentPageId)}
            onClick={() => dispatch({ type: 'SWITCH_PAGE', payload: page.id })}
            onDoubleClick={(e) => handleRenameStart(page, e)}
            title="Double-click to rename"
          >
            {renamingId === page.id ? (
              <input
                style={S.pageInput}
                value={renameVal}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setRenameVal(e.target.value)}
                onBlur={handleRenameCommit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameCommit()
                  if (e.key === 'Escape') setRenamingId(null)
                }}
              />
            ) : (
              <>
                {page.name}
                {state.pages.length > 1 && (
                  <span
                    onClick={(e) => handleDeletePage(page.id, e)}
                    style={{ marginLeft: '4px', opacity: 0.5, fontSize: '0.75rem' }}
                    title="Delete page"
                  >
                    ×
                  </span>
                )}
              </>
            )}
          </button>
        ))}
        <button style={S.addPageBtn} onClick={handleAddPage} title="Add new page">
          +
        </button>
      </div>

      {/* Actions */}
      <div style={S.actions}>
        {/* Viewport size toggle */}
        <div style={S.viewportGroup}>
          {VIEWPORTS.map((v) => (
            <button
              key={v.key}
              style={S.viewportBtn(viewportWidth === v.key)}
              onClick={() => setViewportWidth(v.key)}
              title={v.label}
            >
              {v.icon}
            </button>
          ))}
        </div>
        <button
          style={S.btn(previewMode ? 'primary' : 'secondary')}
          onClick={() => setPreviewMode(!previewMode)}
          title={previewMode ? 'Back to editor' : 'Preview your site'}
        >
          {previewMode ? '✏️ Edit' : '👁 Preview'}
        </button>
        <button
          style={S.btn('success')}
          onClick={handleDownload}
          disabled={downloading}
          title="Download source code as ZIP"
        >
          {downloading ? '⏳ Packing...' : '⬇ Download Code'}
        </button>
      </div>
    </div>
  )
}
