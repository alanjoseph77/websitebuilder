
export function normalizeHref(href) {
  if (!href || href === '#') return href || '#'
  if (href === '/') return 'index.html'
  if (href.startsWith('#') && href.length > 1) {
    const id = href.substring(1)
    if (!/^[a-zA-Z]/.test(id)) return '#el-' + id
  }
  return href
}

export function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
