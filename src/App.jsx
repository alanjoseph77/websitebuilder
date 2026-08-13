import React, { useState, useEffect } from 'react'
import { BuilderProvider, useBuilder } from './context/BuilderContext'
import Toolbar from './components/Toolbar'
import ElementsPanel from './components/ElementsPanel'
import Canvas from './components/Canvas'
import PropertiesPanel from './components/PropertiesPanel'
import LandingPage from './components/LandingPage'
import { LayoutGrid, Sliders } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { ELEMENT_CATEGORIES } from './data/elementTypes'

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
          // Deep clone props/styles so editing one doesn't mutate the global definition
          return {
            id: uuidv4(),
            type,
            props: JSON.parse(JSON.stringify(def.props || {})),
            styles: JSON.parse(JSON.stringify(def.styles || {}))
          }
        }
      }
      return { id: uuidv4(), type, props: {}, styles: {} }
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
        createElement('food-hero'),
        createElement('food-categories'),
        createElement('food-items'),
        createElement('food-footer')
      ])
    }
  }, [templateId, loadTemplate])
  
  return null
}

export default function App() {
  const [showEditor, setShowEditor] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)

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

  if (!showEditor) {
    return <LandingPage onGetStarted={(template) => {
      if (template) setSelectedTemplate(template)
      setShowEditor(true)
    }} />
  }

  return (
    <BuilderProvider>
      {selectedTemplate && <TemplateLoader templateId={selectedTemplate} />}
      <div style={appStyles}>
        <Toolbar />
        <div style={bodyStyles}>
          {/* Elements Panel (Left) */}
          <div style={{
            display: leftOpen ? 'flex' : 'none',
            position: isMobile ? 'absolute' : 'relative',
            zIndex: isMobile ? 100 : 1,
            height: '100%',
            left: 0,
            top: 0,
            boxShadow: isMobile ? '4px 0 16px rgba(0,0,0,0.15)' : 'none',
            backgroundColor: '#fff',
          }}>
            <ElementsPanel />
            {isMobile && leftOpen && (
               <button onClick={() => setLeftOpen(false)} style={{
                 position: 'absolute', top: 12, right: -40, background: '#1a1a2e', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', zIndex: 101, borderRadius: '0 6px 6px 0', fontSize: '1rem'
               }} title="Close Elements">✕</button>
            )}
          </div>

          {/* Canvas Area */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Canvas />
          </div>

          {/* Mobile Backdrops */}
          {isMobile && (leftOpen || rightOpen) && (
            <div 
              onClick={() => { setLeftOpen(false); setRightOpen(false) }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 90, transition: 'opacity 0.2s' }} 
            />
          )}

          {/* Floating Mobile Buttons */}
          {isMobile && !leftOpen && (
            <button 
              onClick={() => { setLeftOpen(true); setRightOpen(false); }}
              style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000, background: '#4f6ef7', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '30px', boxShadow: '0 4px 14px rgba(79,110,247,0.3)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <LayoutGrid size={18} /> Elements
            </button>
          )}

          {isMobile && !rightOpen && (
            <button 
              onClick={() => { setRightOpen(true); setLeftOpen(false); }}
              style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, background: '#1a1a2e', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '30px', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Sliders size={18} /> Settings
            </button>
          )}

          {/* Properties Panel (Right) */}
          <div style={{
            display: rightOpen ? 'flex' : 'none',
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
    </BuilderProvider>
  )
}
