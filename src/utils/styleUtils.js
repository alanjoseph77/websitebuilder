// Utility to convert flat styles or structured styles to valid CSS format
export function normalizeStyles(styles) {
  if (!styles) return { desktop: {}, tablet: {}, mobile: {}, hover: {} }
  
  const hasResponsiveKeys = styles.desktop || styles.tablet || styles.mobile || styles.hover
  if (hasResponsiveKeys) {
    return {
      desktop: styles.desktop || {},
      tablet: styles.tablet || {},
      mobile: styles.mobile || {},
      hover: styles.hover || {}
    }
  }

  // Legacy flat styles -> convert to desktop
  return {
    desktop: { ...styles },
    tablet: {},
    mobile: {},
    hover: {}
  }
}

function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

function objectToCssString(obj) {
  if (!obj || Object.keys(obj).length === 0) return ''
  return Object.entries(obj)
    .filter(([_, val]) => val !== undefined && val !== null && val !== '')
    .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
    .join(' ')
}

export function generateCSSForElements(elements, components = []) {
  let desktopCSS = ''
  let tabletCSS = ''
  let mobileCSS = ''
  const visitedComponents = new Set()

  const traverse = (el) => {
    const { desktop, tablet, mobile, hover } = normalizeStyles(el.styles)
    const className = `.el-${el.id}`

    // Desktop base styles
    const dStyles = objectToCssString(desktop)
    if (dStyles) desktopCSS += `${className} { ${dStyles} }\n`
    
    // Hover styles
    const hStyles = objectToCssString(hover)
    if (hStyles) desktopCSS += `${className}:hover { ${hStyles} }\n`

    // Tablet styles
    const tStyles = objectToCssString(tablet)
    if (tStyles) tabletCSS += `${className} { ${tStyles} }\n`

    // Mobile styles
    const mStyles = objectToCssString(mobile)
    if (mStyles) mobileCSS += `${className} { ${mStyles} }\n`

    if (el.type === 'component-instance' && el.componentId) {
      if (!visitedComponents.has(el.componentId)) {
        visitedComponents.add(el.componentId)
        const master = components.find(c => c.id === el.componentId)
        if (master && master.elements) {
          master.elements.forEach(traverse)
        }
        visitedComponents.delete(el.componentId)
      }
    }

    if (el.children) {
      el.children.forEach(traverse)
    }
  }

  elements.forEach(traverse)

  let finalCSS = desktopCSS
  
  if (tabletCSS) {
    finalCSS += `\n@media (max-width: 960px) {\n${tabletCSS}}\n`
  }
  
  if (mobileCSS) {
    finalCSS += `\n@media (max-width: 768px) {\n${mobileCSS}}\n`
  }

  return finalCSS
}

export function generateThemeCSS(theme) {
  if (!theme) return ''
  
  let css = ':root {\n'
  
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([k, v]) => {
      css += `  --color-${camelToKebab(k)}: ${v};\n`
    })
  }
  
  if (theme.typography) {
    Object.entries(theme.typography).forEach(([k, v]) => {
      css += `  --font-${camelToKebab(k)}: ${v};\n`
    })
  }

  if (theme.radius) {
    Object.entries(theme.radius).forEach(([k, v]) => {
      css += `  --radius-${camelToKebab(k)}: ${v};\n`
    })
  }

  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([k, v]) => {
      css += `  --spacing-${camelToKebab(k)}: ${v};\n`
    })
  }

  css += '}\n'
  return css
}
