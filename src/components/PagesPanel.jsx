import React, { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { File, Settings, Plus, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const S = {
  panel: {
    width: '100%',
    height: '100%',
    flexShrink: 0,
    minHeight: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    background: 'none',
    border: 'none',
    color: '#4f6ef7',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  list: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  pageItem: (isActive) => ({
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    border: `1px solid ${isActive ? '#bfdbfe' : 'transparent'}`,
    color: isActive ? '#1d4ed8' : '#4b5563',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.15s',
  }),
  iconText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  settingsPanel: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '6px 8px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '0.75rem',
    outline: 'none',
  }
}

export default function PagesPanel() {
  const { state, switchPage, addPage, updatePageSettings, deletePage } = useBuilder()
  const [editingPageId, setEditingPageId] = useState(null)

  const handleAddPage = () => {
    const newId = `page-${uuidv4()}`
    addPage({ id: newId, name: 'New Page' })
    setEditingPageId(newId)
  }

  const handleDelete = (e, id, name) => {
    e.stopPropagation()
    if (state.pages.length === 1) {
      alert('You must have at least one page.')
      return
    }
    if (confirm(`Are you sure you want to delete the page "${name}"?`)) {
      if (editingPageId === id) setEditingPageId(null)
      deletePage(id)
    }
  }

  const toggleSettings = (e, id) => {
    e.stopPropagation()
    setEditingPageId(prev => prev === id ? null : id)
  }

  const handleSettingChange = (id, field, value) => {
    updatePageSettings(id, { [field]: value })
  }

  return (
    <div style={S.panel}>
      <div style={S.header}>
        <span>Pages</span>
        <button style={S.addBtn} onClick={handleAddPage}>
          <Plus size={14} /> Add
        </button>
      </div>
      
      <div style={S.list}>
        {state.pages.map(page => {
          const isActive = state.currentPageId === page.id
          const isEditing = editingPageId === page.id

          return (
            <React.Fragment key={page.id}>
              <div 
                style={S.pageItem(isActive)} 
                onClick={() => switchPage(page.id)}
              >
                <div style={S.iconText}>
                  <File size={14} />
                  <span>{page.name}</span>
                </div>
                <div style={S.actions}>
                  <button 
                    style={{...S.iconBtn, color: isEditing ? '#4f6ef7' : '#9ca3af'}} 
                    onClick={(e) => toggleSettings(e, page.id)}
                    title="Page Settings"
                  >
                    <Settings size={14} />
                  </button>
                  <button 
                    style={S.iconBtn} 
                    onClick={(e) => handleDelete(e, page.id, page.name)}
                    title="Delete Page"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div style={S.settingsPanel}>
                  <div style={S.field}>
                    <label style={S.label}>Page Name</label>
                    <input 
                      style={S.input} 
                      value={page.name || ''} 
                      onChange={(e) => handleSettingChange(page.id, 'name', e.target.value)}
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>SEO Title</label>
                    <input 
                      style={S.input} 
                      placeholder="e.g. My Website - Home"
                      value={page.seoTitle || ''} 
                      onChange={(e) => handleSettingChange(page.id, 'seoTitle', e.target.value)}
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>SEO Description</label>
                    <textarea 
                      style={{...S.input, resize: 'vertical', minHeight: '60px'}} 
                      placeholder="Brief description for search engines..."
                      value={page.seoDescription || ''} 
                      onChange={(e) => handleSettingChange(page.id, 'seoDescription', e.target.value)}
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>URL Slug</label>
                    <input 
                      style={S.input} 
                      placeholder={page.name === 'Home' ? 'index' : page.name.toLowerCase().replace(/\s+/g, '-')}
                      value={page.slug || ''} 
                      onChange={(e) => handleSettingChange(page.id, 'slug', e.target.value)}
                      disabled={page.name === 'Home'}
                      title={page.name === 'Home' ? "Home page is always index.html" : "Custom URL slug"}
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Favicon URL</label>
                    <input 
                      style={S.input} 
                      placeholder="/favicon.ico or https://..."
                      value={page.favicon || ''} 
                      onChange={(e) => handleSettingChange(page.id, 'favicon', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {state.components && state.components.length > 0 && (
        <>
          <div style={{ ...S.header, marginTop: '10px' }}>
            <span>Components</span>
          </div>
          <div style={S.list}>
            {state.components.map(comp => {
              const isActive = state.currentPageId === comp.id
              return (
                <div 
                  key={comp.id}
                  style={S.pageItem(isActive)} 
                  onClick={() => switchPage(comp.id)}
                >
                  <div style={S.iconText}>
                    <span style={{color:'#10b981', display:'flex'}}><File size={14} /></span>
                    <span style={{color: isActive ? '#059669' : '#10b981'}}>{comp.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
