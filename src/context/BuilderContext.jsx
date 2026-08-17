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
  theme: {
    colors: {
      primary: '#4f6ef7',
      secondary: '#1a1a2e',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#111827',
      muted: '#9ca3af',
      border: '#e5e7eb',
      accent: '#f59e0b',
    },
    typography: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
      caption: 'system-ui, -apple-system, sans-serif',
      button: 'system-ui, -apple-system, sans-serif',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
    radius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      full: '9999px',
    },
  },
  currentPageId: 'page-home',
  selectedElementId: null,
  selectedChildInfo: null, // { parentId, childId }
  components: [],
}

// ── Recursive Tree Helpers ──
function findNodeWithContext(elements, id, parentId = null, index = 0) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) return { node: elements[i], parentId, index: i };
    if (elements[i].children) {
      const found = findNodeWithContext(elements[i].children, id, elements[i].id, 0);
      if (found) {
        if (found.node.id === id) {
          found.index = elements[i].children.findIndex(c => c.id === id);
        }
        return found;
      }
    }
  }
  return null;
}

function removeNode(nodes, idToRemove) {
  let removedNode = null;
  const filterNodes = (list) => {
    return list.filter(node => {
      if (node.id === idToRemove) {
        removedNode = node;
        return false;
      }
      if (node.children) {
        node.children = filterNodes(node.children);
      }
      return true;
    });
  };
  const newNodes = filterNodes(JSON.parse(JSON.stringify(nodes)));
  return { newNodes, removedNode };
}

function insertNode(nodes, targetParentId, insertIndex, nodeToInsert) {
  if (!targetParentId) {
    const newNodes = [...nodes];
    if (insertIndex !== undefined && insertIndex >= 0) {
      newNodes.splice(insertIndex, 0, nodeToInsert);
    } else {
      newNodes.push(nodeToInsert);
    }
    return newNodes;
  }

  const mapNodes = (list) => {
    return list.map(node => {
      if (node.id === targetParentId) {
        const newChildren = [...(node.children || [])];
        if (insertIndex !== undefined && insertIndex >= 0) {
          newChildren.splice(insertIndex, 0, nodeToInsert);
        } else {
          newChildren.push(nodeToInsert);
        }
        return { ...node, children: newChildren };
      }
      if (node.children) {
        return { ...node, children: mapNodes(node.children) };
      }
      return node;
    });
  };
  return mapNodes(nodes);
}

function updateNodeDeep(nodes, idToUpdate, updates) {
  return nodes.map(node => {
    if (node.id === idToUpdate) {
      return {
        ...node,
        props: updates.props ? { ...node.props, ...updates.props } : node.props,
        styles: updates.styles ? { ...node.styles, ...updates.styles } : node.styles,
      };
    }
    if (node.children) {
      return { ...node, children: updateNodeDeep(node.children, idToUpdate, updates) };
    }
    return node;
  });
}

function builderReducer(state, action) {
  switch (action.type) {
    case 'CREATE_COMPONENT': {
      const { elementId, name } = action.payload;
      
      let nodeToExtract = null;
      let parentId = null;
      let indexInParent = -1;
      let sourceCanvasId = null;
      let isSourceComp = false;
      
      // Search pages
      for (const page of state.pages) {
        const found = findNodeWithContext(page.elements, elementId);
        if (found) {
          nodeToExtract = found.node;
          parentId = found.parentId;
          indexInParent = found.index;
          sourceCanvasId = page.id;
          break;
        }
      }
      
      // Search components
      if (!nodeToExtract && state.components) {
        for (const comp of state.components) {
          const found = findNodeWithContext(comp.elements, elementId);
          if (found) {
            nodeToExtract = found.node;
            parentId = found.parentId;
            indexInParent = found.index;
            sourceCanvasId = comp.id;
            isSourceComp = true;
            break;
          }
        }
      }
      
      if (!nodeToExtract) return state;
      
      const componentId = 'comp-' + uuidv4();
      const newComponent = {
        id: componentId,
        name: name,
        elements: [JSON.parse(JSON.stringify(nodeToExtract))]
      };
      
      const instanceNode = {
        id: uuidv4(),
        type: 'component-instance',
        componentId: componentId,
        props: {},
        styles: {},
        children: []
      };
      
      let newPages = state.pages;
      let newComponents = state.components || [];
      
      if (isSourceComp) {
        newComponents = newComponents.map(c => {
          if (c.id !== sourceCanvasId) return c;
          const { newNodes } = removeNode(c.elements, elementId);
          return { ...c, elements: insertNode(newNodes, parentId, indexInParent, instanceNode) };
        });
        newComponents.push(newComponent);
      } else {
        newPages = newPages.map(page => {
          if (page.id !== sourceCanvasId) return page;
          const { newNodes } = removeNode(page.elements, elementId);
          return { ...page, elements: insertNode(newNodes, parentId, indexInParent, instanceNode) };
        });
        newComponents = [...newComponents, newComponent];
      }
      
      return { 
        ...state, 
        pages: newPages, 
        components: newComponents,
        selectedElementId: instanceNode.id 
      };
    }
    case 'ADD_ELEMENT': {
      const { element, insertIndex, targetParentId } = action.payload
      const newElement = element
      const isComp = (state.components || []).some(c => c.id === state.currentPageId);
      
      const insertInCanvas = (canvas) => {
        let parentToInsert = targetParentId
        let indexToInsert = insertIndex
        if (!parentToInsert && state.selectedElementId) {
          const found = findNodeWithContext(canvas.elements, state.selectedElementId)
          if (found && found.node && ['section', 'columns', 'container', 'flex', 'grid'].includes(found.node.type)) {
            parentToInsert = found.node.id
            indexToInsert = -1
          }
        }
        return insertNode(canvas.elements, parentToInsert, indexToInsert, newElement)
      };

      if (isComp) {
        const components = state.components.map(c => c.id === state.currentPageId ? { ...c, elements: insertInCanvas(c) } : c)
        return { ...state, components, selectedElementId: newElement.id, selectedChildInfo: null }
      }
      
      const pages = state.pages.map(page => page.id === state.currentPageId ? { ...page, elements: insertInCanvas(page) } : page)
      return { ...state, pages, selectedElementId: newElement.id, selectedChildInfo: null }
    }

    case 'UPDATE_ELEMENT': {
      const { id, updates } = action.payload
      const isComp = (state.components || []).some(c => c.id === state.currentPageId);
      if (isComp) {
        return { ...state, components: state.components.map(c => c.id === state.currentPageId ? { ...c, elements: updateNodeDeep(c.elements, id, updates) } : c) }
      }
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        return { ...page, elements: updateNodeDeep(page.elements, id, updates) }
      })
      return { ...state, pages }
    }

    case 'DELETE_ELEMENT': {
      const isComp = (state.components || []).some(c => c.id === state.currentPageId);
      if (isComp) {
        return { ...state, components: state.components.map(c => c.id === state.currentPageId ? { ...c, elements: removeNode(c.elements, action.payload).newNodes } : c), selectedElementId: null, selectedChildInfo: null }
      }
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        const { newNodes } = removeNode(page.elements, action.payload)
        return { ...page, elements: newNodes }
      })
      return { ...state, pages, selectedElementId: null, selectedChildInfo: null }
    }

    case 'RESTORE_ELEMENT': {
      const { element, targetParentId, insertIndex, pageId } = action.payload
      const pages = state.pages.map(page => {
         if (page.id !== pageId) return page;
         const elements = insertNode(page.elements, targetParentId, insertIndex, element)
         return { ...page, elements }
      })
      return { ...state, pages }
    }

    case 'MOVE_NODE': {
      const { sourceId, targetParentId, insertIndex } = action.payload
      if (sourceId === targetParentId) return state
      
      const pages = state.pages.map((page) => {
        if (page.id !== state.currentPageId) return page
        // 1. Remove node from old location
        const { newNodes, removedNode } = removeNode(page.elements, sourceId)
        if (!removedNode) return page
        // 2. Insert into new location
        const elements = insertNode(newNodes, targetParentId, insertIndex, removedNode)
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
        id: action.payload.id || `page-${uuidv4()}`,
        name: action.payload.name || 'New Page',
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

    case 'UPDATE_PAGE_BG': {
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === state.currentPageId
            ? { ...page, canvasBg: action.payload.bg }
            : page
        )
      }
    }

    case 'UPDATE_THEME': {
      return {
        ...state,
        theme: {
          ...state.theme,
          [action.payload.category]: {
            ...state.theme[action.payload.category],
            [action.payload.key]: action.payload.value
          }
        }
      }
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

    case 'DELETE_COMPONENT': {
      const components = (state.components || []).filter(c => c.id !== action.payload)
      const currentPageId = action.payload === state.currentPageId ? state.pages[0].id : state.currentPageId
      return { ...state, components, currentPageId, selectedElementId: null }
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
const NON_HISTORY_ACTIONS = new Set([
  'SELECT_ELEMENT',
  'SELECT_CHILD',
  'ADD_PAGE',
  'SWITCH_PAGE',
  'RENAME_PAGE',
  'DELETE_PAGE',
  'LOAD_TEMPLATE',
  'CREATE_COMPONENT'
])
const MAX_HISTORY = 50

// ── Operation-based History System ──
function getUndoAction(state, action) {
  switch (action.type) {
    case 'UPDATE_ELEMENT': {
      const { id, updates } = action.payload;
      let el = null;
      for (const p of state.pages) {
        const found = findNodeWithContext(p.elements, id);
        if (found) { el = found.node; break; }
      }
      if (!el) return null;
      const undoUpdates = { props: {}, styles: {} };
      if (updates.props) {
        for (const k in updates.props) undoUpdates.props[k] = el.props[k] !== undefined ? el.props[k] : null;
      }
      if (updates.styles) {
        for (const k in updates.styles) undoUpdates.styles[k] = el.styles[k] !== undefined ? el.styles[k] : null;
      }
      return { type: 'UPDATE_ELEMENT', payload: { id, updates: undoUpdates } };
    }
    case 'DELETE_ELEMENT': {
      let pageId, found;
      for (const p of state.pages) {
        found = findNodeWithContext(p.elements, action.payload);
        if (found) { pageId = p.id; break; }
      }
      if (!found) return null;
      return { type: 'RESTORE_ELEMENT', payload: { element: found.node, targetParentId: found.parentId, insertIndex: found.index, pageId } };
    }
    case 'ADD_ELEMENT': {
      return { type: 'DELETE_ELEMENT', payload: action.payload.element.id };
    }
    case 'RESTORE_ELEMENT': {
      return { type: 'DELETE_ELEMENT', payload: action.payload.element.id };
    }
    case 'MOVE_NODE': {
      const { sourceId } = action.payload;
      let found;
      for (const p of state.pages) {
        found = findNodeWithContext(p.elements, sourceId);
        if (found) break;
      }
      if (!found) return null;
      return { type: 'MOVE_NODE', payload: { sourceId, targetParentId: found.parentId, insertIndex: found.index } };
    }
    case 'REORDER_ELEMENTS': {
      const { fromIndex, toIndex } = action.payload;
      return { type: 'REORDER_ELEMENTS', payload: { fromIndex: toIndex, toIndex: fromIndex } };
    }
    case 'UPDATE_THEME': {
      const { category, key } = action.payload;
      const oldVal = state.theme[category][key];
      return { type: 'UPDATE_THEME', payload: { category, key, value: oldVal } };
    }
    case 'UPDATE_PAGE_BG': {
      const currentPage = state.pages.find(p => p.id === state.currentPageId);
      return { type: 'UPDATE_PAGE_BG', payload: { bg: currentPage.canvasBg || '#ffffff' } };
    }
    default:
      return null;
  }
}

function useUndoReducer(reducer, initialSt) {
  const [history, setHistory] = React.useState({ past: [], present: initialSt, future: [] })

  const dispatch = useCallback((action) => {
    if (action.type === 'UNDO') {
      setHistory(h => {
        if (h.past.length === 0) return h
        const op = h.past[h.past.length - 1]
        const newPresent = reducer(h.present, op.undo)
        return { past: h.past.slice(0, -1), present: newPresent, future: [op, ...h.future].slice(0, MAX_HISTORY) }
      })
      return
    }
    if (action.type === 'REDO') {
      setHistory(h => {
        if (h.future.length === 0) return h
        const op = h.future[0]
        const newPresent = reducer(h.present, op.redo)
        return { past: [...h.past, op].slice(-MAX_HISTORY), present: newPresent, future: h.future.slice(1) }
      })
      return
    }

    setHistory(h => {
      const undoAction = getUndoAction(h.present, action)
      const newPresent = reducer(h.present, action)
      
      if (newPresent === h.present) return h
      
      if (NON_HISTORY_ACTIONS.has(action.type)) {
        return { ...h, present: newPresent }
      }
      
      if (undoAction) {
        const op = { undo: undoAction, redo: action }
        return { past: [...h.past, op].slice(-MAX_HISTORY), present: newPresent, future: [] }
      }
      
      return { ...h, present: newPresent }
    })
  }, [reducer])

  const resetHistory = useCallback((newState) => {
    setHistory({ past: [], present: newState, future: [] })
  }, [])

  return [history.present, dispatch, history.past.length > 0, history.future.length > 0, resetHistory]
}

export function BuilderProvider({ children, projectId }) {
  const [state, dispatch, canUndo, canRedo, resetHistory] = useUndoReducer(builderReducer, initialState)
  const [previewMode, setPreviewMode] = useState(false)
  const [viewportWidth, setViewportWidth] = useState('desktop')
  const [isLoading, setIsLoading] = useState(true)

  // Load state from DB
  React.useEffect(() => {
    if (!projectId) {
      setIsLoading(false)
      return
    }
    import('../utils/db').then(({ getProject }) => {
      getProject(projectId).then(project => {
        if (project && project.pages && project.currentPageId) {
          resetHistory({
            ...initialState,
            ...project,
            selectedElementId: null,
            selectedChildInfo: null
          })
        }
        setIsLoading(false)
      }).catch(e => {
        console.error("Failed to load project", e)
        setIsLoading(false)
      })
    })
  }, [projectId, resetHistory])

  // Save state to IndexedDB with debounce
  React.useEffect(() => {
    if (!projectId || isLoading) return
    
    const saveState = async () => {
      try {
        const { getProject, saveProject } = await import('../utils/db')
        const project = await getProject(projectId)
        if (project) {
          project.pages = state.pages
          project.components = state.components || []
          project.currentPageId = state.currentPageId
          project.theme = state.theme
          await saveProject(project)
        }
      } catch (e) {
        console.warn("Failed to save to DB", e)
      }
    }

    const timeoutId = setTimeout(saveState, 500)
    return () => clearTimeout(timeoutId)
  }, [state.pages, state.components, state.currentPageId, state.theme, projectId, isLoading])



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

  const isEditingComponent = (state.components || []).some(c => c.id === state.currentPageId)
  const currentPage = isEditingComponent 
    ? (state.components || []).find((c) => c.id === state.currentPageId)
    : state.pages.find((p) => p.id === state.currentPageId)
  const selectedElement = state.selectedElementId && currentPage 
    ? findNodeWithContext(currentPage.elements, state.selectedElementId)?.node || null
    : null
  const selectedChildElement = state.selectedChildInfo && currentPage
    ? findNodeWithContext(currentPage.elements, state.selectedChildInfo.childId)?.node || null
    : null

  const stateRef = React.useRef(state);
  React.useEffect(() => { stateRef.current = state; }, [state]);

  const addElement = useCallback((element, insertIndex, targetParentId = null) => {
    const assignIds = (el) => ({
      ...el,
      id: el.id || uuidv4(),
      props: { ...(el.props || {}) },
      styles: { ...(el.styles || {}) },
      children: (el.children || []).map(assignIds)
    })
    const newElement = assignIds(element)
    dispatch({ type: 'ADD_ELEMENT', payload: { element: newElement, insertIndex, targetParentId } })
  }, [dispatch])

  const updateElement = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } })
  }, [dispatch])

  const deleteElement = useCallback((id) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: id })
  }, [dispatch])

  const deleteComponent = useCallback((id) => {
    dispatch({ type: 'DELETE_COMPONENT', payload: id })
  }, [dispatch])

  const duplicateElement = useCallback((id) => {
    let nodeToDuplicate = null;
    let parentId = null;
    let indexInParent = -1;
    let targetPageId = null;

    for (const page of stateRef.current.pages) {
      const found = findNodeWithContext(page.elements, id);
      if (found) {
        nodeToDuplicate = found.node;
        parentId = found.parentId;
        indexInParent = found.index;
        targetPageId = page.id;
        break;
      }
    }
    if (!nodeToDuplicate) return;

    const assignIds = (el) => ({
      ...el,
      id: uuidv4(),
      props: { ...(el.props || {}) },
      styles: { ...(el.styles || {}) },
      children: (el.children || []).map(assignIds)
    });
    const copy = assignIds(nodeToDuplicate);

    dispatch({ type: 'RESTORE_ELEMENT', payload: { element: copy, targetParentId: parentId, insertIndex: indexInParent + 1, pageId: targetPageId } });
  }, [dispatch])

  const selectElement = useCallback((id) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id })
  }, [dispatch])

  const reorderElements = useCallback((fromIndex, toIndex) => {
    dispatch({ type: 'REORDER_ELEMENTS', payload: { fromIndex, toIndex } })
  }, [dispatch])

  const updateTheme = useCallback((category, key, value) => {
    dispatch({ type: 'UPDATE_THEME', payload: { category, key, value } })
  }, [])

  const moveNode = useCallback((sourceId, targetParentId, insertIndex) => {
    dispatch({ type: 'MOVE_NODE', payload: { sourceId, targetParentId, insertIndex } })
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

  const addPage = useCallback((payload) => {
    dispatch({ type: 'ADD_PAGE', payload })
  }, [dispatch])

  const deletePage = useCallback((id) => {
    dispatch({ type: 'DELETE_PAGE', payload: id })
  }, [dispatch])

  const selectChild = useCallback((parentId, childId) => {
    dispatch({ type: 'SELECT_CHILD', payload: { parentId, childId } })
  }, [dispatch])

  const createComponent = useCallback((elementId, name) => {
    dispatch({ type: 'CREATE_COMPONENT', payload: { elementId, name } })
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

  const loadTemplate = useCallback((elements) => {
    dispatch({ type: 'LOAD_TEMPLATE', payload: elements })
  }, [dispatch])

  if (isLoading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#fafafb', color: '#6b7280' }}>Loading Editor...</div>
  }

  return (
    <BuilderContext.Provider
      value={{
        state,
        projectId,
        dispatch,
        currentPage,
        selectedElement,
        previewMode,
        setPreviewMode,
        addElement,
        updateElement,
        deleteElement,
        deleteComponent,
        duplicateElement,
        selectElement,
        reorderElements,
        updateTheme,
        moveNode,
        addPage,
        deletePage,
        moveElementUp,
        moveElementDown,
        switchPage,
        loadTemplate,
        addChildElement,
        deleteChildElement,
        selectChild,
        createComponent,
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
