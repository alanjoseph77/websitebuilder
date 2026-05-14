import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { generatePageHTML, getPageFilename, BASE_CSS, BASE_JS } from './codeGenerator'

export async function downloadSite(pages, uploadedImages = []) {
  const zip = new JSZip()

  // Build a map from blob objectUrl → { name, file } for quick lookup
  const blobMap = new Map()
  uploadedImages.forEach(({ objectUrl, name, file }) => {
    blobMap.set(objectUrl, { name, file })
  })

  // Replace blob: URLs in all pages with relative paths (images/filename)
  // and collect the unique image files that are actually used
  const usedImages = new Map() // name → File
  const resolvedPages = pages.map((page) => resolvePageBlobs(page, blobMap, usedImages))

  // Generate HTML for each page (using resolved paths)
  resolvedPages.forEach((page) => {
    const html = generatePageHTML(page, resolvedPages)
    zip.file(getPageFilename(page), html)
  })

  // Add uploaded image files into images/ folder
  const imageFolder = zip.folder('images')
  for (const [name, file] of usedImages) {
    const arrayBuffer = await file.arrayBuffer()
    imageFolder.file(name, arrayBuffer)
  }

  // Add shared CSS and JS
  zip.file('styles.css', BASE_CSS)
  zip.file('script.js', BASE_JS)

  // Add README
  zip.file('README.md', generateReadme(resolvedPages, usedImages.size))

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  saveAs(blob, 'my-website.zip')
}

// Deep-replace all blob: URL strings in an element's props (and nested arrays)
function resolvePageBlobs(page, blobMap, usedImages) {
  return {
    ...page,
    elements: page.elements.map((el) => resolveElementBlobs(el, blobMap, usedImages)),
  }
}

function resolveElementBlobs(el, blobMap, usedImages) {
  const newProps = resolveProps(el.props || {}, blobMap, usedImages)
  const newEl = { ...el, props: newProps }
  if (el.children) {
    newEl.children = el.children.map((child) => resolveElementBlobs(child, blobMap, usedImages))
  }
  return newEl
}

function resolveProps(props, blobMap, usedImages) {
  const out = {}
  for (const [key, val] of Object.entries(props)) {
    out[key] = resolveValue(val, blobMap, usedImages)
  }
  return out
}

function resolveValue(val, blobMap, usedImages) {
  if (typeof val === 'string' && val.startsWith('blob:')) {
    const info = blobMap.get(val)
    if (info) {
      usedImages.set(info.name, info.file)
      return 'images/' + info.name
    }
    return val
  }
  if (Array.isArray(val)) {
    return val.map((item) => {
      if (item && typeof item === 'object') return resolveProps(item, blobMap, usedImages)
      return resolveValue(item, blobMap, usedImages)
    })
  }
  return val
}

function generateReadme(pages, imageCount) {
  const pageList = pages.map((p) => `- ${getPageFilename(p)} (${p.name})`).join('\n')
  const imageNote = imageCount > 0 ? `- images/ — ${imageCount} uploaded image(s)\n` : ''
  return `# My Website
Generated with SiteForge - Free Website Builder

## Files
${pageList}
- styles.css — All styles
- script.js — JavaScript functionality
${imageNote}
## Getting Started
1. Extract this ZIP file
2. Open index.html in your browser to preview
3. Upload all files to your web hosting provider

## Deployment Options
- **GitHub Pages** — Upload to a GitHub repo and enable Pages
- **Netlify** — Drag and drop the folder to netlify.com/drop
- **Vercel** — Import to vercel.com
- **Traditional hosting** — Upload via FTP to your hosting provider

Happy building! 🚀
`
}
