/**
 * Generates clean HTML/CSS code from builder state.
 */

function stylesToCSS(styles, selector) {
  const entries = Object.entries(styles || {})
  if (!entries.length) return ''
  const props = entries
    .map(([k, v]) => {
      // Convert camelCase to kebab-case
      const kebab = k.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
      return `  ${kebab}: ${v};`
    })
    .join('\n')
  return `${selector} {\n${props}\n}\n`
}

function stylesToInline(styles) {
  return Object.entries(styles || {})
    .map(([k, v]) => {
      const kebab = k.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
      return `${kebab}: ${v}`
    })
    .join('; ')
}

function generateElementHTML(el, idx) {
  const { type, props, styles } = el
  const cls = `el-${type}-${idx}`
  const inlineStyle = stylesToInline(styles)
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : ''

  switch (type) {
    case 'navbar': {
      const links = (props.links || [])
        .map((l) => `    <li><a href="${l.href}">${escHtml(l.text)}</a></li>`)
        .join('\n')
      return `<nav${sAttr}>
  <div class="nav-brand">${escHtml(props.brand)}</div>
  <ul class="nav-links">
${links}
  </ul>
</nav>`
    }

    case 'hero': {
      const btn1 = props.buttonText
        ? `<a href="${props.buttonHref || '#'}" class="btn btn-primary">${escHtml(props.buttonText)}</a>`
        : ''
      const btn2 = props.buttonSecondaryText
        ? `<a href="${props.buttonSecondaryHref || '#'}" class="btn btn-outline">${escHtml(props.buttonSecondaryText)}</a>`
        : ''
      const btns = [btn1, btn2].filter(Boolean).join('\n    ')
      return `<section class="hero"${sAttr}>
  <h1>${escHtml(props.title)}</h1>
  <p>${escHtml(props.subtitle)}</p>
  <div class="hero-btns">
    ${btns}
  </div>
</section>`
    }

    case 'section':
      return `<section${sAttr}>
  ${props.title ? `<h2>${escHtml(props.title)}</h2>` : ''}
  ${props.subtitle ? `<p class="subtitle">${escHtml(props.subtitle)}</p>` : ''}
</section>`

    case 'columns': {
      const cols = (props.columns || [])
        .map(
          (col) => `    <div class="column">
      ${col.icon ? `<div class="col-icon">${col.icon}</div>` : ''}
      <h3>${escHtml(col.title || '')}</h3>
      <p>${escHtml(col.text || '')}</p>
    </div>`
        )
        .join('\n')
      return `<section class="columns-section"${sAttr}>
  <div class="columns-grid">
${cols}
  </div>
</section>`
    }

    case 'footer': {
      const links = (props.links || [])
        .map((l) => `    <a href="${l.href}">${escHtml(l.text)}</a>`)
        .join('\n')
      return `<footer${sAttr}>
  <div class="footer-brand">${escHtml(props.brand)}</div>
  ${props.tagline ? `<p class="footer-tagline">${escHtml(props.tagline)}</p>` : ''}
  <nav class="footer-links">
${links}
  </nav>
  <p class="copyright">${escHtml(props.copyright || '')}</p>
</footer>`
    }

    case 'heading': {
      const Tag = props.level || 'h2'
      return `<${Tag}${sAttr}>${escHtml(props.text)}</${Tag}>`
    }

    case 'paragraph':
      return `<p${sAttr}>${escHtml(props.text)}</p>`

    case 'quote':
      return `<blockquote${sAttr}>
  <p>${escHtml(props.text)}</p>
  ${props.author ? `<cite>${escHtml(props.author)}</cite>` : ''}
</blockquote>`

    case 'image':
      return `<figure${sAttr}>
  <img src="${props.src}" alt="${escHtml(props.alt || '')}" style="max-width:100%; border-radius:8px; display:block; margin:0 auto;" />
  ${props.caption ? `<figcaption style="text-align:center; margin-top:8px; color:#666; font-size:0.85rem;">${escHtml(props.caption)}</figcaption>` : ''}
</figure>`

    case 'video':
      return `<div class="video-wrapper"${sAttr}>
  <div class="video-responsive">
    <iframe src="${props.src}" title="${escHtml(props.title || 'Video')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</div>`

    case 'button': {
      const variant = props.variant || 'primary'
      return `<div${sAttr}>
  <a href="${props.href || '#'}" class="btn btn-${variant}">${escHtml(props.text)}</a>
</div>`
    }

    case 'card':
      return `<div class="card-wrapper"${sAttr}>
  <div class="card">
    ${props.image ? `<img src="${props.image}" alt="${escHtml(props.title || '')}" class="card-img" />` : ''}
    <div class="card-body">
      <h3 class="card-title">${escHtml(props.title || '')}</h3>
      <p class="card-text">${escHtml(props.text || '')}</p>
      ${props.buttonText ? `<a href="${props.buttonHref || '#'}" class="card-link">${escHtml(props.buttonText)} &rarr;</a>` : ''}
    </div>
  </div>
</div>`

    case 'list': {
      const Tag = props.variant === 'ol' ? 'ol' : 'ul'
      const items = (props.items || []).map((item) => `  <li>${escHtml(item)}</li>`).join('\n')
      return `<${Tag}${sAttr}>
${items}
</${Tag}>`
    }

    case 'form':
      return `<section class="form-section"${sAttr}>
  ${props.title ? `<h2>${escHtml(props.title)}</h2>` : ''}
  ${props.subtitle ? `<p class="form-subtitle">${escHtml(props.subtitle)}</p>` : ''}
  <form class="contact-form" method="post">
    <div class="form-group">
      <label for="name">Full Name</label>
      <input type="text" id="name" name="name" placeholder="John Doe" required />
    </div>
    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" placeholder="john@example.com" required />
    </div>
    <div class="form-group">
      <label for="subject">Subject</label>
      <input type="text" id="subject" name="subject" placeholder="How can we help?" />
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>
    </div>
    <button type="submit" class="btn btn-primary">${escHtml(props.submitText || 'Send Message')}</button>
  </form>
</section>`

    case 'divider':
      return `<div${sAttr}><hr style="border:none; border-top:1px ${props.style || 'solid'} currentColor; opacity:0.3;" /></div>`

    case 'spacer':
      return `<div style="height:${props.height || '60px'}"></div>`

    case 'counter': {
      const stats = (props.stats || [])
        .map(
          (s) => `    <div class="stat">
      <div class="stat-number">${escHtml(s.number)}</div>
      <div class="stat-label">${escHtml(s.label)}</div>
    </div>`
        )
        .join('\n')
      return `<section class="stats-section"${sAttr}>
  <div class="stats-grid">
${stats}
  </div>
</section>`
    }

    case 'testimonial':
      return `<section class="testimonial-section"${sAttr}>
  ${props.avatar ? `<img src="${props.avatar}" alt="${escHtml(props.author || '')}" class="testimonial-avatar" />` : ''}
  <blockquote class="testimonial-text">"${escHtml(props.text)}"</blockquote>
  <div class="testimonial-author">
    <strong>${escHtml(props.author || '')}</strong>
    ${props.role ? `<span class="testimonial-role">${escHtml(props.role)}</span>` : ''}
  </div>
</section>`

    default:
      return `<!-- Unknown element type: ${type} -->`
  }
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const BASE_CSS = `/* Generated by SiteForge */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Navbar */
nav { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.nav-brand { font-weight: 700; font-size: 1.2rem; }
.nav-links { display: flex; gap: 24px; list-style: none; flex-wrap: wrap; }
.nav-links a { text-decoration: none; opacity: 0.85; transition: opacity 0.2s; }
.nav-links a:hover { opacity: 1; }

/* Hero */
.hero { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 16px; line-height: 1.15; }
.hero p { font-size: 1.15rem; opacity: 0.8; margin-bottom: 32px; max-width: 560px; }
.hero-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }

/* Buttons */
.btn { display: inline-block; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 1rem; text-decoration: none; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
.btn-primary { background: #4f6ef7; color: #fff; }
.btn-primary:hover { background: #3a5ae8; }
.btn-outline { background: transparent; border-color: rgba(255,255,255,0.5); color: #fff; }
.btn-outline:hover { background: rgba(255,255,255,0.1); }
.btn-ghost { background: transparent; color: #4f6ef7; border-color: transparent; }
.btn-ghost:hover { background: #eff6ff; }

/* Section */
section h2 { font-size: 2rem; font-weight: 700; margin-bottom: 12px; }
.subtitle { opacity: 0.7; max-width: 600px; margin: 0 auto; }

/* Columns */
.columns-grid { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; }
.column { flex: 1 1 200px; max-width: 320px; text-align: center; padding: 20px; }
.col-icon { font-size: 2.5rem; margin-bottom: 16px; }
.column h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; }
.column p { opacity: 0.7; font-size: 0.95rem; }

/* Card */
.card-wrapper { padding: 20px 40px; }
.card { max-width: 360px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
.card-img { width: 100%; display: block; height: 200px; object-fit: cover; }
.card-body { padding: 20px; }
.card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: #1a1a2e; }
.card-text { font-size: 0.9rem; color: #666; line-height: 1.6; margin-bottom: 16px; }
.card-link { color: #4f6ef7; font-weight: 600; text-decoration: none; }

/* Form */
.form-section h2 { font-size: 2rem; font-weight: 700; margin-bottom: 12px; }
.form-subtitle { opacity: 0.6; margin-bottom: 32px; }
.contact-form { max-width: 520px; margin: 0 auto; text-align: left; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-size: 0.85rem; font-weight: 600; color: #374151; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #d1d5db; font-size: 0.95rem; font-family: inherit; outline: none; }
.form-group input:focus, .form-group textarea:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
.contact-form .btn { width: 100%; text-align: center; margin-top: 8px; }

/* Footer */
footer .footer-brand { font-weight: 700; font-size: 1.2rem; margin-bottom: 8px; }
.footer-tagline { opacity: 0.6; font-size: 0.9rem; margin-bottom: 16px; }
.footer-links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
.footer-links a { text-decoration: none; opacity: 0.7; font-size: 0.85rem; transition: opacity 0.2s; }
.footer-links a:hover { opacity: 1; }
.copyright { opacity: 0.5; font-size: 0.8rem; }

/* Video */
.video-responsive { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 800px; margin: 0 auto; border-radius: 8px; }
.video-responsive iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

/* Stats */
.stats-grid { display: flex; gap: 40px; flex-wrap: wrap; justify-content: center; }
.stat { text-align: center; min-width: 120px; }
.stat-number { font-size: 2.8rem; font-weight: 800; line-height: 1; }
.stat-label { font-size: 0.9rem; opacity: 0.75; margin-top: 8px; }

/* Testimonial */
.testimonial-avatar { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px; display: block; object-fit: cover; }
.testimonial-text { font-size: 1.15rem; font-style: italic; max-width: 560px; margin: 0 auto 20px; line-height: 1.7; }
.testimonial-author strong { display: block; font-weight: 700; }
.testimonial-role { color: #6b7280; font-size: 0.85rem; }

/* Blockquote */
blockquote cite { font-size: 0.9rem; font-style: normal; opacity: 0.6; }

/* Responsive */
@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .columns-grid { flex-direction: column; align-items: center; }
  .column { max-width: 100%; }
  .stats-grid { gap: 24px; }
  nav { flex-direction: column; }
  .nav-links { gap: 16px; }
}
`

const BASE_JS = `// Generated by SiteForge
// Add your custom JavaScript here

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Contact form handling
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      form.reset();
    });
  }
});
`

export function generatePageHTML(page, allPages) {
  const elementsHTML = page.elements
    .map((el, i) => generateElementHTML(el, i))
    .join('\n\n')

  const navLinks = allPages
    .map((p) => {
      const filename = p.name === 'Home' ? 'index.html' : slugify(p.name) + '.html'
      return `    <li><a href="${filename}">${p.name}</a></li>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(page.name)}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

${elementsHTML}

  <script src="script.js"></script>
</body>
</html>`
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function getPageFilename(page) {
  return page.name.toLowerCase() === 'home' ? 'index.html' : slugify(page.name) + '.html'
}

export { BASE_CSS, BASE_JS, slugify }
