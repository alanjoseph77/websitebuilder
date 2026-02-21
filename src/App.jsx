import React from 'react'
import { BuilderProvider } from './context/BuilderContext'
import Toolbar from './components/Toolbar'
import ElementsPanel from './components/ElementsPanel'
import Canvas from './components/Canvas'
import PropertiesPanel from './components/PropertiesPanel'

const appStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: '#f0f2f5',
}

const bodyStyles = {
  display: 'flex',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
}

export default function App() {
  return (
    <BuilderProvider>
      <div style={appStyles}>
        <Toolbar />
        <div style={bodyStyles}>
          <ElementsPanel />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
    </BuilderProvider>
  )
}
