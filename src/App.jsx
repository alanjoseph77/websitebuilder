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
import { LayoutGrid, Sliders, ArrowLeft, Undo, Redo } from 'lucide-react'
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
        <div style={{
          display: (leftOpen && !previewMode) ? 'flex' : 'none',
          flexDirection: 'column',
          position: isMobile ? 'absolute' : 'relative',
          zIndex: isMobile ? 100 : 1,
          height: '100%',
          width: isMobile ? '300px' : '280px',
            maxWidth: '85vw',
            flexShrink: 0,
            left: 0,
            top: 0,
            boxShadow: isMobile ? '4px 0 16px rgba(0,0,0,0.15)' : 'none',
            backgroundColor: '#fff',
            borderRight: '1px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0 8px', gap: '4px' }}>
              <button 
                onClick={() => setLeftTab('elements')} 
                style={{ outline: 'none', flex: 1, padding: '14px 4px', background: 'none', border: 'none', borderBottom: leftTab === 'elements' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'elements' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'elements' ? '600' : '500', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}
              >
                Elements
              </button>
              <button 
                onClick={() => setLeftTab('pages')} 
                style={{ outline: 'none', flex: 1, padding: '14px 4px', background: 'none', border: 'none', borderBottom: leftTab === 'pages' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'pages' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'pages' ? '600' : '500', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}
              >
                Pages
              </button>
              <button 
                onClick={() => setLeftTab('layers')} 
                style={{ outline: 'none', flex: 1, padding: '14px 4px', background: 'none', border: 'none', borderBottom: leftTab === 'layers' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'layers' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'layers' ? '600' : '500', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}
              >
                Layers
              </button>
              <button 
                onClick={() => setLeftTab('assets')} 
                style={{ outline: 'none', flex: 1, padding: '14px 4px', background: 'none', border: 'none', borderBottom: leftTab === 'assets' ? '2px solid #3b82f6' : '2px solid transparent', color: leftTab === 'assets' ? '#3b82f6' : '#6b7280', fontWeight: leftTab === 'assets' ? '600' : '500', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}
              >
                Assets
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {leftTab === 'elements' ? <ElementsPanel /> : leftTab === 'layers' ? <LayersPanel /> : leftTab === 'assets' ? <AssetsPanel /> : <PagesPanel />}
            </div>
            {/* Left Sidebar Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Undo size={14} style={{ cursor: 'pointer' }} onClick={() => window.__builderContextAPI?.undo?.()} /> Undo <span style={{ opacity: 0.6 }}>⌘Z</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Redo size={14} style={{ cursor: 'pointer' }} onClick={() => window.__builderContextAPI?.redo?.()} /> Redo <span style={{ opacity: 0.6 }}>⇧⌘Z</span>
               </div>
            </div>
            {isMobile && leftOpen && (
               <button onClick={() => setLeftOpen(false)} style={{
                 position: 'absolute', top: 12, right: -40, background: '#1a1a2e', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', zIndex: 101, borderRadius: '0 6px 6px 0', fontSize: '1rem'
               }} title="Close Sidebar">✕</button>
            )}
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
                  position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                  background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '30px',
                  border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', cursor: 'pointer',
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
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 90, transition: 'opacity 0.2s' }} 
            />
          )}

          {/* Floating Mobile Buttons */}
          {isMobile && !leftOpen && !previewMode && (
            <button 
              onClick={() => { setLeftOpen(true); setRightOpen(false); }}
              style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000, background: '#4f6ef7', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '30px', boxShadow: '0 4px 14px rgba(79,110,247,0.3)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <LayoutGrid size={18} /> Elements
            </button>
          )}

          {isMobile && !rightOpen && !previewMode && (
            <button 
              onClick={() => { setRightOpen(true); setLeftOpen(false); }}
              style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, background: '#1a1a2e', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '30px', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Sliders size={18} /> Settings
            </button>
          )}

          {/* Properties Panel (Right) */}
          <div style={{
            display: (rightOpen && !previewMode) ? 'flex' : 'none',
            position: isMobile ? 'absolute' : 'relative',
            zIndex: isMobile ? 100 : 1,
            height: '100%',
            right: 0,
            top: 0,
            boxShadow: isMobile ? '-4px 0 16px rgba(0,0,0,0.15)' : 'none',
            backgroundColor: '#fff',
          }}>
            {isMobile && rightOpen && (
               <button onClick={() => setRightOpen(false)} style={{
                 position: 'absolute', top: 12, left: -40, background: '#1a1a2e', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', zIndex: 101, borderRadius: '6px 0 0 6px', fontSize: '1rem'
               }} title="Close Settings">✕</button>
            )}
            <PropertiesPanel />
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