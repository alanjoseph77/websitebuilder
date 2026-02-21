import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { generatePageHTML, getPageFilename, BASE_CSS, BASE_JS } from './codeGenerator'

export async function downloadSite(pages) {
  const zip = new JSZip()

  // Generate HTML for each page
  pages.forEach((page) => {
    const html = generatePageHTML(page, pages)
    const filename = getPageFilename(page)
    zip.file(filename, html)
  })

  // Add shared CSS
  zip.file('styles.css', BASE_CSS)

  // Add shared JS
  zip.file('script.js', BASE_JS)

  // Add a README
  zip.file('README.md', generateReadme(pages))

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  saveAs(blob, 'my-website.zip')
}

function generateReadme(pages) {
  const pageList = pages.map((p) => `- ${getPageFilename(p)} (${p.name})`).join('\n')
  return `# My Website
Generated with SiteForge - Free Website Builder

## Files
${pageList}
- styles.css — All styles
- script.js — JavaScript functionality

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
