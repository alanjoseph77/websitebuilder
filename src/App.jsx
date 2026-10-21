import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BuilderProvider, useBuilder } from './context/BuilderContext'
import Toolbar from './components/Toolbar'
import ElementsPanel from './components/ElementsPanel'
import PagesPanel from './components/PagesPanel'
import LayersPanel from './components/LayersPanel'
import AssetsPanel from './components/AssetsPanel'
import Canvas from './components/Canvas'
import PropertiesPanel from './components/PropertiesPanel'
import LandingPage from './components/LandingPage'
import ProjectDashboard from './components/ProjectDashboard'
import { LayoutGrid, Sliders, ArrowLeft, Undo, Redo, FileText, Layers, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { ELEMENT_CATEGORIES } from './data/elementTypes'
import { generateCSSForElements, generateThemeCSS } from './utils/styleUtils'

// 3D museum: its code only downloads when someone opens it
const Museum = lazy(() => import('./museum/Museum'))

const appStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh', /* better mobile support */
  minHeight: '100vh', /* fallback */
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: '#f0f2f5',
}

const bodyStyles = {
  display: 'flex',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  position: 'relative'
}

function TemplateLoader({ templateId }) {
  const { loadTemplate } = useBuilder()
  
  useEffect(() => {
    // Helper to get an element definition with default props/styles
    const createElement = (type) => {
      for (const cat of ELEMENT_CATEGORIES) {
        const def = cat.elements.find(el => el.type === type)
        if (def) {
          const assignIds = (el) => ({
            id: uuidv4(),
            type: el.type,
            props: JSON.parse(JSON.stringify(el.props || {})),
            styles: JSON.parse(JSON.stringify(el.styles || {})),
            children: (el.children || []).map(assignIds)
          })
          return assignIds(def)
        }
      }
      return { id: uuidv4(), type, props: {}, styles: {}, children: [] }
    }

    if (templateId === 'make') {
      loadTemplate([
        createElement('make-navbar'),
        createElement('make-hero'),
        createElement('make-features'),
        createElement('make-integrations'),
        createElement('make-pricing'),
        createElement('make-footer')
      ])
    } else if (templateId === 'trend') {
      loadTemplate([
        createElement('trend-navbar'), createElement('trend-hero')
      ])
    } else if (templateId === 'ecommerce') {
      loadTemplate([
        createElement('solemate-navbar'),
        createElement('solemate-hero'),
        createElement('solemate-categories'),
        createElement('solemate-products'),
        createElement('solemate-footer')
      ])
    } else if (templateId === 'portfolio') {
      loadTemplate([
        createElement('creative-navbar'),
        createElement('creative-hero'),
        createElement('creative-projects'),
        createElement('creative-footer')
      ])
    } else if (templateId === 'app') {
      loadTemplate([
        createElement('lumora-navbar'),
        createElement('lumora-hero'),
        createElement('lumora-marquee'),
        createElement('lumora-products'),
        createElement('lumora-footer')
      ])
    } else if (templateId === 'food') {
      loadTemplate([
        createElement('food-navbar'),
        createElement('food-categories'),
        createElement('food-items'),
        createElement('food-footer')
      ])
    }
  }, [templateId, loadTemplate])
  
  return null
}



function BuilderUI({ setActiveProjectId, setShowEditor }) {
  const { previewMode, setPreviewMode } = useBuilder()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [leftOpen, setLeftOpen] = useState(!isMobile)
  const [rightOpen, setRightOpen] = useState(!isMobile)
  const [leftTab, setLeftTab] = useState('elements')

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 840
      setIsMobile(mobile)
      if (!mobile) {
        setLeftOpen(true)
        setRightOpen(true)
      } else {
        setLeftOpen(false)
        setRightOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={appStyles}>
      {!previewMode && <Toolbar onBack={() => { setShowEditor(false); setActiveProjectId(null) }} />}
      <div style={bodyStyles}>
        {/* Left Panel */}
        {/* Left Panel Drawer */}
        <div style={{
          display: (leftOpen && !previewMode) ? 'flex' : 'none',
          flexDirection: 'column',
          position: isMobile ? 'absolute' : 'relative',
          zIndex: isMobile ? 100 : 1,
          height: '100%',
          width: isMobile ? 'min(360px, 92vw)' : '280px',
          maxWidth: '92vw',
          flexShrink: 0,
          left: 0,
          top: 0,
          boxShadow: isMobile ? '4px 0 24px rgba(0,0,0,0.22)' : 'none',
          backgroundColor: '#fff',
          borderRight: '1px solid #e5e7eb',
        }}>
          {/* Header tabs + close button */}
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e5e7eb', padding: '0 8px', gap: '2px', background: '#fafafa' }}>
            <button 
              onClick={() => setLeftTab('elements')} 
              style={{ outline: 'none', flex: 1, padding: '12px 2px', background: 'none', border: 'none', borderBottom: leftTab === 'elements' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'elements' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'elements' ? '700' : '500', cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.15s' }}
            >
              Elements
            </button>
            <button 
              onClick={() => setLeftTab('pages')} 
              style={{ outline: 'none', flex: 1, padding: '12px 2px', background: 'none', border: 'none', borderBottom: leftTab === 'pages' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'pages' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'pages' ? '700' : '500', cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.15s' }}
            >
              Pages
            </button>
            <button 
              onClick={() => setLeftTab('layers')} 
              style={{ outline: 'none', flex: 1, padding: '12px 2px', background: 'none', border: 'none', borderBottom: leftTab === 'layers' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'layers' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'layers' ? '700' : '500', cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.15s' }}
            >
              Layers
            </button>
            <button 
              onClick={() => setLeftTab('assets')} 
              style={{ outline: 'none', flex: 1, padding: '12px 2px', background: 'none', border: 'none', borderBottom: leftTab === 'assets' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'assets' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'assets' ? '700' : '500', cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.15s' }}
            >
              Assets
            </button>
            {isMobile && (
              <button 
                onClick={() => setLeftOpen(false)} 
                style={{
                  background: 'transparent', border: 'none', padding: '6px 8px', cursor: 'pointer', color: '#6b7280', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} 
                title="Close Drawer"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {leftTab === 'elements' ? <ElementsPanel /> : leftTab === 'layers' ? <LayersPanel /> : leftTab === 'assets' ? <AssetsPanel /> : <PagesPanel />}
          </div>
          {/* Left Sidebar Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => window.__builderContextAPI?.undo?.()}>
              <Undo size={14} /> Undo <span style={{ opacity: 0.6 }}>⌘Z</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => window.__builderContextAPI?.redo?.()}>
              <Redo size={14} /> Redo <span style={{ opacity: 0.6 }}>⇧⌘Z</span>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Canvas 
            leftOpen={leftOpen} setLeftOpen={setLeftOpen}
            rightOpen={rightOpen} setRightOpen={setRightOpen}
            leftTab={leftTab} setLeftTab={setLeftTab}
          />
          {previewMode && (
            <button 
              onClick={() => setPreviewMode(false)}
              style={{
                position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '30px',
                border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', cursor: 'pointer',
                fontWeight: '600', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              Exit Full Screen Preview
            </button>
          )}
        </div>

        {/* Mobile Backdrops */}
        {isMobile && (leftOpen || rightOpen) && !previewMode && (
          <div 
            onClick={() => { setLeftOpen(false); setRightOpen(false) }}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', zIndex: 90, transition: 'opacity 0.2s' }} 
          />
        )}

        {/* Modern Glassmorphic Mobile Bottom Dock */}
        {isMobile && !previewMode && (
          <nav 
            aria-label="Mobile Navigation"
            style={{
              position: 'fixed',
              bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 95,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 8px',
              background: 'rgba(17, 24, 39, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '36px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              maxWidth: 'calc(100vw - 20px)',
            }}
          >
            <button
              onClick={() => {
                if (leftOpen && leftTab === 'elements') {
                  setLeftOpen(false)
                } else {
                  setLeftTab('elements')
                  setLeftOpen(true)
                  setRightOpen(false)
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 12px',
                borderRadius: '24px',
                border: 'none',
                background: (leftOpen && leftTab === 'elements') ? '#3b82f6' : 'transparent',
                color: (leftOpen && leftTab === 'elements') ? '#fff' : '#d1d5db',
                fontWeight: '600',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <LayoutGrid size={15} /> Elements
            </button>

            <button
              onClick={() => {
                if (leftOpen && leftTab === 'pages') {
                  setLeftOpen(false)
                } else {
                  setLeftTab('pages')
                  setLeftOpen(true)
                  setRightOpen(false)
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 10px',
                borderRadius: '24px',
                border: 'none',
                background: (leftOpen && leftTab === 'pages') ? '#3b82f6' : 'transparent',
                color: (leftOpen && leftTab === 'pages') ? '#fff' : '#d1d5db',
                fontWeight: '600',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <FileText size={15} /> Pages
            </button>

            <button
              onClick={() => {
                setRightOpen(!rightOpen)
                setLeftOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 10px',
                borderRadius: '24px',
                border: 'none',
                background: rightOpen ? '#3b82f6' : 'transparent',
                color: rightOpen ? '#fff' : '#d1d5db',
                fontWeight: '600',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Sliders size={15} /> Style
            </button>

            <button
              onClick={() => {
                if (leftOpen && leftTab === 'layers') {
                  setLeftOpen(false)
                } else {
                  setLeftTab('layers')
                  setLeftOpen(true)
                  setRightOpen(false)
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 10px',
                borderRadius: '24px',
                border: 'none',
                background: (leftOpen && leftTab === 'layers') ? '#3b82f6' : 'transparent',
                color: (leftOpen && leftTab === 'layers') ? '#fff' : '#d1d5db',
                fontWeight: '600',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Layers size={15} /> Layers
            </button>
          </nav>
        )}

        {/* Properties Panel (Right Drawer) */}
        <div style={{
          display: (rightOpen && !previewMode) ? 'flex' : 'none',
          flexDirection: 'column',
          position: isMobile ? 'absolute' : 'relative',
          zIndex: isMobile ? 100 : 1,
          height: '100%',
          width: isMobile ? 'min(360px, 92vw)' : '280px',
          maxWidth: '92vw',
          right: 0,
          top: 0,
          boxShadow: isMobile ? '-4px 0 24px rgba(0,0,0,0.22)' : 'none',
          backgroundColor: '#fff',
          borderLeft: '1px solid #e5e7eb',
        }}>
          <PropertiesPanel onClose={isMobile ? () => setRightOpen(false) : undefined} />
        </div>
        </div>
      </div>
  )
}

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [forceLanding, setForceLanding] = useState(true)
  const [dbProjects, setDbProjects] = useState(null)
  const [showMuseum, setShowMuseum] = useState(false)

  useEffect(() => {
    if (!showEditor) {
      import('./utils/db').then(({ getProjects }) => {
        getProjects().then(setDbProjects).catch(() => setDbProjects([]))
      })
    }
  }, [showEditor])

  if (showMuseum) {
    return (
      <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#1e1b19', color: '#f6efe3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>Opening the museum…</div>}>
        <Museum onExit={() => setShowMuseum(false)} />
      </Suspense>
    )
  }

  if (!showEditor) {
    if (dbProjects === null) return null // Wait for DB load
    const hasProjects = dbProjects.length > 0
    
    if (!forceLanding && hasProjects) {
      return <ProjectDashboard 
        onOpenProject={(id) => {
          setActiveProjectId(id)
          setShowEditor(true)
        }} 
        onGoHome={() => setForceLanding(true)}
      />
    }

    return <LandingPage 
      onGetStarted={async (template) => {
        const { saveProject } = await import('./utils/db')
        const newId = uuidv4()
        const newProject = { id: newId, name: 'My Website', updatedAt: Date.now(), createdAt: Date.now() }
        await saveProject(newProject)

        if (template) setSelectedTemplate(template)
        setActiveProjectId(newId)
        setForceLanding(false)
        setShowEditor(true)
      }} 
      onGoDashboard={() => setForceLanding(false)}
      onOpenMuseum={() => setShowMuseum(true)}
      hasProjects={hasProjects}
    />
  }

  return (
    <BuilderProvider key={activeProjectId} projectId={activeProjectId}>
      {selectedTemplate && <TemplateLoader templateId={selectedTemplate} />}
      <BuilderUI setActiveProjectId={setActiveProjectId} setShowEditor={setShowEditor} />
    </BuilderProvider>
  )
}