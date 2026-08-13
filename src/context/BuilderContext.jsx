import React, { createContext, useContext, useReducer, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const BuilderContext = createContext()

const initialState = {
  pages: [
    {
      id: 'page-home',
      name: 'Home',
      elements: [
        {
          id: 'init-navbar',
          type: 'navbar',
          props: {
            brand: 'MyBrand',
            navLayout: 'classic',
            navLinkStyle: 'plain',
            navEffect: 'none',
            links: [
              { text: 'Home', href: '#' },
              { text: 'About', href: '#about' },
              { text: 'Services', href: '#services' },
              { text: 'Contact', href: '#contact' },
            ],
          },
          styles: {
            backgroundColor: '#1a1a2e',
            color: '#ffffff',
            padding: '16px 40px',
            fontSize: '1rem',
          },
        },
        {
          id: 'init-section',
          type: 'section',
          props: {
            title: 'Section Title',
            subtitle: 'Add your content here.',
            layout: '2-col',
            gap: '24px',
          },
          styles: {
            backgroundColor: '#ffffff',
            color: '#333333',
            padding: '60px 40px',
            textAlign: 'center',
          },
          children: [
            {
              id: 'init-image',
              type: 'image',
              props: {
                src: 'https://placehold.co/800x400/4f6ef7/ffffff?text=Your+Image',
                alt: 'Image description',
                caption: '',
              },
              styles: {
                width: '100%',
                textAlign: 'center',
                padding: '20px 40px',
              },
            },
            {
              id: 'init-para1',
              type: 'paragraph',
              props: {
                text: 'Add your paragraph text here. Click to select and edit in the properties panel.',
              },
              styles: {
                color: '#555555',
                fontSize: '1rem',
                textAlign: 'left',
                padding: '10px 40px',
                lineHeight: '1.7',
                fontFamily: 'inherit',
              },
            },
            {
              id: 'init-para2',
              type: 'paragraph',
              props: {
                text: 'Add your second paragraph text here. Click to select and edit in the properties panel.',
                gridSpan: 'full',
              },
              styles: {
                color: '#555555',
                fontSize: '1rem',
                textAlign: 'left',
                padding: '10px 40px',
                lineHeight: '1.7',
                fontFamily: 'inherit',
              },
            },
          ],
        },
      ],
    },
  ],
  currentPageId: 'page-home',
  selectedElementId: null,
  selectedChildInfo: null, // { parentId, childId }
}

function builderReducer(state, action) {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const { element, insertIndex } = action.payload
      const newElement = {
        ...element,
        id: uuidv4(),
        props: { ...(element.props || {}) },
        styles: { ...(element.styles || {}) },
      }
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const elements = [...page.elements]
        let addedToChild = false

        // Feature for Mobile: If a section is selected, auto-add to its children
        if (state.selectedElementId) {
          const targetIndex = elements.findIndex(el => el.id === state.selectedElementId)
          if (targetIndex !== -1) {
            const targetEl = elements[targetIndex]
            if (targetEl.type === 'section' || targetEl.type === 'columns') {
              elements[targetIndex] = {
                ...targetEl,
                children: [...(targetEl.children || []), newElement]
              }
              addedToChild = true
            }
          }
        }

        if (!addedToChild) {
          if (insertIndex !== undefined && insertIndex >= 0) {
            elements.splice(insertIndex, 0, newElement)
          } else {
            elements.push(newElement)
          }
        }
        return { ...page, elements }
      })
      return { ...state, pages, selectedElementId: newElement.id }
    }

    case 'UPDATE_ELEMENT': {
      const { id, updates } = action.payload
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const elements = page.elements.map((el) => {
          if (el.id !== id) return el
          return {
            ...el,
            props: updates.props ? { ...el.props, ...updates.props } : el.props,
            styles: updates.styles ? { ...el.styles, ...updates.styles } : el.styles,
          }
        })
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'DELETE_ELEMENT': {
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        return { ...page, elements: page.elements.filter((el) => el.id !== action.payload) }
      })
      return { ...state, pages, selectedElementId: null }
    }

    case 'DUPLICATE_ELEMENT': {
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const idx = page.elements.findIndex((el) => el.id === action.payload)
        if (idx === -1) return page
        const original = page.elements[idx]
        const copy = { ...original, id: uuidv4(), props: { ...original.props }, styles: { ...original.styles } }
        const elements = [...page.elements]
        elements.splice(idx + 1, 0, copy)
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'REORDER_ELEMENTS': {
      const { fromIndex, toIndex } = action.payload
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const elements = [...page.elements]
        const [moved] = elements.splice(fromIndex, 1)
        elements.splice(toIndex, 0, moved)
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.payload, selectedChildInfo: null }

    case 'SELECT_CHILD':
      return { ...state, selectedChildInfo: action.payload, selectedElementId: null }

    case 'ADD_PAGE': {
      const newPage = {
        id: `page-${uuidv4()}`,
        name: action.payload || 'New Page',
        elements: [],
      }
      return { ...state, pages: [...state.pages, newPage], currentPageId: newPage.id, selectedElementId: null }
    }

    case 'SWITCH_PAGE':
      return { ...state, currentPageId: action.payload, selectedElementId: null }

    case 'RENAME_PAGE': {
      const { id, name } = action.payload
      const pages = state.pages.map((p) => (p.id === id ? { ...p, name } : p))
      return { ...state, pages }
    }

    case 'LOAD_TEMPLATE': {
      return {
        ...state,
        pages: [
          {
            id: 'page-home',
            name: 'Home',
            elements: action.payload
          }
        ],
        currentPageId: 'page-home',
        selectedElementId: null,
        selectedChildInfo: null
      }
    }

    case 'DELETE_PAGE': {
      if (state.pages.length === 1) return state
      const pages = state.pages.filter((p) => p.id !== action.payload)
      const currentPageId =
        action.payload === state.currentPageId ? pages[0].id : state.currentPageId
      return { ...state, pages, currentPageId, selectedElementId: null }
    }

    case 'MOVE_ELEMENT_UP': {
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const idx = page.elements.findIndex((el) => el.id === action.payload)
        if (idx <= 0) return page
        const elements = [...page.elements]
        ;[elements[idx - 1], elements[idx]] = [elements[idx], elements[idx - 1]]
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'MOVE_ELEMENT_DOWN': {
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const idx = page.elements.findIndex((el) => el.id === action.payload)
        if (idx === -1 || idx >= page.elements.length - 1) return page
        const elements = [...page.elements]
        ;[elements[idx], elements[idx + 1]] = [elements[idx + 1], elements[idx]]
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'ADD_CHILD_ELEMENT': {
      const { parentId, childElement } = action.payload
      const newChild = {
        ...childElement,
        id: uuidv4(),
        props: { ...(childElement.props || {}) },
        styles: { ...(childElement.styles || {}) },
      }
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const elements = page.elements.map((el) => {
          if (el.id !== parentId) return el
          return { ...el, children: [...(el.children || []), newChild] }
        })
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'UPDATE_PAGE_SETTINGS': {
      const { id, settings } = action.payload
      const pages = state.pages.map((p) => p.id === id ? { ...p, ...settings } : p)
      return { ...state, pages }
    }

    case 'DELETE_CHILD_ELEMENT': {
      const { parentId, childId } = action.payload
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const elements = page.elements.map((el) => {
          if (el.id !== parentId) return el
          return { ...el, children: (el.children || []).filter((c) => c.id !== childId) }
        })
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'UPDATE_CHILD_ELEMENT': {
      const { parentId, childId, updates } = action.payload
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const elements = page.elements.map((el) => {
          if (el.id !== parentId) return el
          const children = (el.children || []).map((child) => {
            if (child.id !== childId) return child
            return {
              ...child,
              props: updates.props ? { ...child.props, ...updates.props } : child.props,
              styles: updates.styles ? { ...child.styles, ...updates.styles } : child.styles,
            }
          })
          return { ...el, children }
        })
        return { ...page, elements }
      })
      return { ...state, pages }
    }

    default:
      return state
  }
}

// ── Actions that should NOT be recorded in undo history ──
const NON_HISTORY_ACTIONS = new Set(['SELECT_ELEMENT', 'SELECT_CHILD', 'SWITCH_PAGE'])
const MAX_HISTORY = 50

function useUndoReducer(reducer, initialSt) {
  const [history, setHistory] = React.useState(() => {
    try {
      const saved = localStorage.getItem('siteforge_state')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.pages && parsed.currentPageId) {
          return { past: [], present: { ...initialSt, ...parsed, selectedElementId: null, selectedChildInfo: null }, future: [] }
        }
      }
    } catch (e) {
      console.warn("Failed to parse local storage siteforge_state", e)
    }
    return { past: [], present: initialSt, future: [] }
  })

  const dispatch = useCallback((action) => {
    if (action.type === 'UNDO') {
      setHistory(h => {
        if (h.past.length === 0) return h
        const prev = h.past[h.past.length - 1]
        return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future].slice(0, MAX_HISTORY) }
      })
      return
    }
    if (action.type === 'REDO') {
      setHistory(h => {
        if (h.future.length === 0) return h
        const next = h.future[0]
        return { past: [...h.past, h.present].slice(-MAX_HISTORY), present: next, future: h.future.slice(1) }
      })
      return
    }
    setHistory(h => {
      const newPresent = reducer(h.present, action)
      if (newPresent === h.present) return h
      if (NON_HISTORY_ACTIONS.has(action.type)) {
        return { ...h, present: newPresent }
      }
      return { past: [...h.past, h.present].slice(-MAX_HISTORY), present: newPresent, future: [] }
    })
  }, [reducer])

  return [history.present, dispatch, history.past.length > 0, history.future.length > 0]
}

export function BuilderProvider({ children }) {
  const [state, dispatch, canUndo, canRedo] = useUndoReducer(builderReducer, initialState)
  const [previewMode, setPreviewMode] = useState(false)
  const [viewportWidth, setViewportWidth] = useState('desktop')

  // Save state to local storage whenever it changes
  React.useEffect(() => {
    try {
      const toSave = { pages: state.pages, currentPageId: state.currentPageId }
      localStorage.setItem('siteforge_state', JSON.stringify(toSave))
    } catch (e) {
      console.warn("Failed to save siteforge_state to local storage", e)
    }
  }, [state.pages, state.currentPageId])

  // ── Keyboard shortcuts: Ctrl+Z / Ctrl+Y ──
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const isMeta = e.ctrlKey || e.metaKey
      if (!isMeta) return
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault()
        dispatch({ type: 'UNDO' })
      }
      if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault()
        dispatch({ type: 'REDO' })
      }
      // Delete selected element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if not typing in an input
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return
        if (state.selectedChildInfo) {
          e.preventDefault()
          dispatch({ type: 'DELETE_CHILD_ELEMENT', payload: { parentId: state.selectedChildInfo.parentId, childId: state.selectedChildInfo.childId } })
        } else if (state.selectedElementId) {
          e.preventDefault()
          dispatch({ type: 'DELETE_ELEMENT', payload: state.selectedElementId })
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, state.selectedElementId])

  const currentPage = state.pages.find((p) => p.id === state.currentPageId)
  const selectedElement = currentPage?.elements.find((el) => el.id === state.selectedElementId)
  const selectedChildElement = state.selectedChildInfo
    ? currentPage?.elements
        .find((el) => el.id === state.selectedChildInfo.parentId)
        ?.children?.find((c) => c.id === state.selectedChildInfo.childId) || null
    : null

  const addElement = useCallback((element, insertIndex) => {
    dispatch({ type: 'ADD_ELEMENT', payload: { element, insertIndex } })
  }, [dispatch])

  const updateElement = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } })
  }, [dispatch])

  const deleteElement = useCallback((id) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: id })
  }, [dispatch])

  const duplicateElement = useCallback((id) => {
    dispatch({ type: 'DUPLICATE_ELEMENT', payload: id })
  }, [dispatch])

  const selectElement = useCallback((id) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id })
  }, [dispatch])

  const reorderElements = useCallback((fromIndex, toIndex) => {
    dispatch({ type: 'REORDER_ELEMENTS', payload: { fromIndex, toIndex } })
  }, [dispatch])

  const moveElementUp = useCallback((id) => {
    dispatch({ type: 'MOVE_ELEMENT_UP', payload: id })
  }, [dispatch])

  const moveElementDown = useCallback((id) => {
    dispatch({ type: 'MOVE_ELEMENT_DOWN', payload: id })
  }, [dispatch])

  const addChildElement = useCallback((parentId, childElement) => {
    dispatch({ type: 'ADD_CHILD_ELEMENT', payload: { parentId, childElement } })
  }, [dispatch])

  const deleteChildElement = useCallback((parentId, childId) => {
    dispatch({ type: 'DELETE_CHILD_ELEMENT', payload: { parentId, childId } })
  }, [dispatch])

  const switchPage = useCallback((pageId) => {
    dispatch({ type: 'SWITCH_PAGE', payload: pageId })
  }, [dispatch])

  const selectChild = useCallback((parentId, childId) => {
    dispatch({ type: 'SELECT_CHILD', payload: { parentId, childId } })
  }, [dispatch])

  const updateChildElement = useCallback((parentId, childId, updates) => {
    dispatch({ type: 'UPDATE_CHILD_ELEMENT', payload: { parentId, childId, updates } })
  }, [dispatch])

  const updatePageSettings = useCallback((id, settings) => {
    dispatch({ type: 'UPDATE_PAGE_SETTINGS', payload: { id, settings } })
  }, [dispatch])

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [dispatch])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [dispatch])

  // ── Uploaded images (kept outside reducer — File objects aren't serialisable) ──
  const [uploadedImages, setUploadedImages] = useState([])

  const addUploadedImage = useCallback((file) => {
    const objectUrl = URL.createObjectURL(file)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    // Deduplicate by objectUrl
    setUploadedImages(prev => [...prev, { objectUrl, name: safeName, file }])
    return objectUrl
  }, [])

  return (
    <BuilderContext.Provider
      value={{
        state,
        dispatch,
        currentPage,
        selectedElement,
        previewMode,
        setPreviewMode,
        addElement,
        updateElement,
        deleteElement,
        duplicateElement,
        selectElement,
        reorderElements,
        moveElementUp,
        moveElementDown,
        switchPage,
        loadTemplate: useCallback((elements) => dispatch({ type: 'LOAD_TEMPLATE', payload: elements }), [dispatch]),
        addChildElement,
        deleteChildElement,
        selectChild,
        updateChildElement,
        selectedChildElement,
        selectedChildInfo: state.selectedChildInfo,
        viewportWidth,
        setViewportWidth,
        updatePageSettings,
        uploadedImages,
        addUploadedImage,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  return useContext(BuilderContext)
}
