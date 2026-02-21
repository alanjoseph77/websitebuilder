import React, { createContext, useContext, useReducer, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const BuilderContext = createContext()

const initialState = {
  pages: [
    {
      id: 'page-home',
      name: 'Home',
      elements: [],
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
        if (insertIndex !== undefined && insertIndex >= 0) {
          elements.splice(insertIndex, 0, newElement)
        } else {
          elements.push(newElement)
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

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(builderReducer, initialState)
  const [previewMode, setPreviewMode] = useState(false)
  const [viewportWidth, setViewportWidth] = useState('desktop')

  const currentPage = state.pages.find((p) => p.id === state.currentPageId)
  const selectedElement = currentPage?.elements.find((el) => el.id === state.selectedElementId)
  const selectedChildElement = state.selectedChildInfo
    ? currentPage?.elements
        .find((el) => el.id === state.selectedChildInfo.parentId)
        ?.children?.find((c) => c.id === state.selectedChildInfo.childId) || null
    : null

  const addElement = useCallback((element, insertIndex) => {
    dispatch({ type: 'ADD_ELEMENT', payload: { element, insertIndex } })
  }, [])

  const updateElement = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } })
  }, [])

  const deleteElement = useCallback((id) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: id })
  }, [])

  const duplicateElement = useCallback((id) => {
    dispatch({ type: 'DUPLICATE_ELEMENT', payload: id })
  }, [])

  const selectElement = useCallback((id) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id })
  }, [])

  const reorderElements = useCallback((fromIndex, toIndex) => {
    dispatch({ type: 'REORDER_ELEMENTS', payload: { fromIndex, toIndex } })
  }, [])

  const moveElementUp = useCallback((id) => {
    dispatch({ type: 'MOVE_ELEMENT_UP', payload: id })
  }, [])

  const moveElementDown = useCallback((id) => {
    dispatch({ type: 'MOVE_ELEMENT_DOWN', payload: id })
  }, [])

  const addChildElement = useCallback((parentId, childElement) => {
    dispatch({ type: 'ADD_CHILD_ELEMENT', payload: { parentId, childElement } })
  }, [])

  const deleteChildElement = useCallback((parentId, childId) => {
    dispatch({ type: 'DELETE_CHILD_ELEMENT', payload: { parentId, childId } })
  }, [])

  const switchPage = useCallback((pageId) => {
    dispatch({ type: 'SWITCH_PAGE', payload: pageId })
  }, [])

  const selectChild = useCallback((parentId, childId) => {
    dispatch({ type: 'SELECT_CHILD', payload: { parentId, childId } })
  }, [])

  const updateChildElement = useCallback((parentId, childId, updates) => {
    dispatch({ type: 'UPDATE_CHILD_ELEMENT', payload: { parentId, childId, updates } })
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
        addChildElement,
        deleteChildElement,
        selectChild,
        updateChildElement,
        selectedChildElement,
        selectedChildInfo: state.selectedChildInfo,
        viewportWidth,
        setViewportWidth,
      }}
    >
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  return useContext(BuilderContext)
}
