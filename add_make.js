const fs = require('fs');

// 1. ElementRenderer.jsx
let elContent = fs.readFileSync('src/components/ElementRenderer.jsx', 'utf8');

const makeComps = `
function MakeNavbar({ props, styles, activeHref, onLinkClick }) {
  const brand = props.brand || 'Make'
  const accent = props.makeAccent || '#a855f7'
  const links = props.links || []
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'

  return (
    <nav style={{ backgroundColor: bg, color, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: \`linear-gradient(135deg, \${accent}, #3b82f6)\` }} />
        {brand}
      </div>
      <div style={{ display: 'flex', gap: '32px' }}>
        {links.map((l, i) => (
          <a key={i} href={l.href} onClick={(e) => onLinkClick(e, l.href)} style={{ color, textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem', opacity: activeHref === l.href ? 1 : 0.8 }}>
            {l.text}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <a href="#" style={{ color, textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Log in</a>
        <a href="#" style={{ background: color, color: bg, padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>Get Started</a>
      </div>
    </nav>
  )
}

function MakeHero({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.makeAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '80px 48px', position: 'relative', overflow: 'hidden', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '400px', background: \`radial-gradient(circle, \${accent}40 0%, transparent 70%)\`, filter: 'blur(60px)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '900', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px' }}>
          {props.makeHeading}
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          {props.makeDesc}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}>
          <a href="#" style={{ background: \`linear-gradient(135deg, \${accent}, #3b82f6)\`, color: '#fff', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', boxShadow: \`0 10px 30px \${accent}40\` }}>
            {props.makeCtaText}
          </a>
          <a href="#" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            {props.makeSecondaryCtaText}
          </a>
        </div>
        
        <div style={{ position: 'relative', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
             <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ef4444'}}></div>
             <div style={{width: 12, height: 12, borderRadius: '50%', background: '#eab308'}}></div>
             <div style={{width: 12, height: 12, borderRadius: '50%', background: '#22c55e'}}></div>
          </div>
          <img src={props.makeImage} alt="App Interface" style={{ width: '100%', display: 'block', marginTop: '40px' }} />
        </div>
      </div>
    </section>
  )
}
`;

elContent = elContent.replace(/function SkylineHero/, makeComps + '\nfunction SkylineHero');

// Also inject into switch
const switchComps = `
    case 'make-navbar':
      return <MakeNavbar props={element.props} styles={element.styles} activeHref={activeHref} onLinkClick={onLinkClick} />
    case 'make-hero':
      return <MakeHero element={element} />
`;
elContent = elContent.replace(/case 'skyline-hero':/, switchComps + "\n    case 'skyline-hero':");

fs.writeFileSync('src/components/ElementRenderer.jsx', elContent);

// 2. PropertiesPanel.jsx
let propsContent = fs.readFileSync('src/components/PropertiesPanel.jsx', 'utf8');

const makeProps = `
    case 'make-navbar':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Brand</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.brand || ''} onChange={(e) => up({ brand: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.makeAccent || '#a855f7'} onChange={(v) => up({ makeAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-hero':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={3} value={props.makeHeading || ''} onChange={(e) => up({ makeHeading: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea style={S.textarea} rows={3} value={props.makeDesc || ''} onChange={(e) => up({ makeDesc: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Actions</div>
            <Field label="Primary Button Text">
              <input style={S.input} value={props.makeCtaText || ''} onChange={(e) => up({ makeCtaText: e.target.value })} />
            </Field>
            <Field label="Secondary Button Text">
              <input style={S.input} value={props.makeSecondaryCtaText || ''} onChange={(e) => up({ makeSecondaryCtaText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Media</div>
            <ImageField label="Interface Image" value={props.makeImage} onChange={(url) => up({ makeImage: url })} />
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.makeAccent || '#a855f7'} onChange={(v) => up({ makeAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
`;

propsContent = propsContent.replace(/case 'skyline-hero':/, makeProps + "\n    case 'skyline-hero':");
fs.writeFileSync('src/components/PropertiesPanel.jsx', propsContent);

// 3. codeGenerator.js
let cgContent = fs.readFileSync('src/utils/codeGenerator.js', 'utf8');

const cgComps = `
      case 'make-navbar': {
        const mnBg = styles?.backgroundColor || '#0f172a'
        const mnColor = styles?.color || '#ffffff'
        const mnAccent = props.makeAccent || '#a855f7'
        const mnBrand = props.brand || 'Make'
        const mnLinks = props.links || []
        const linksHtml = mnLinks.map(l => \`<a href="\${escHtml(l.href)}" class="mn-link">\${escHtml(l.text)}</a>\`).join('\\n        ')

        return \`<nav class="mn-nav" style="background-color:\${mnBg};color:\${mnColor}">
  <div class="mn-brand">
    <div class="mn-logo" style="background:linear-gradient(135deg, \${mnAccent}, #3b82f6)"></div>
    \${escHtml(mnBrand)}
  </div>
  <div class="mn-links">\${linksHtml}</div>
  <div class="mn-actions">
    <a href="#" class="mn-login">Log in</a>
    <a href="#" class="mn-btn" style="background-color:\${mnColor};color:\${mnBg}">Get Started</a>
  </div>
</nav>\`
      }

      case 'make-hero': {
        const mhBg = styles?.backgroundColor || '#0f172a'
        const mhColor = styles?.color || '#ffffff'
        const mhAccent = props.makeAccent || '#a855f7'
        const mhHeading = props.makeHeading || 'Design, build, and automate anything'
        const mhDesc = props.makeDesc || 'From tasks and workflows to apps and systems, build and automate anything in one powerful visual platform.'
        const mhCtaText = props.makeCtaText || 'Get started free'
        const mhCta2Text = props.makeSecondaryCtaText || 'Contact Sales'
        const mhImage = props.makeImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'

        return \`<section class="mh-sec" style="background-color:\${mhBg};color:\${mhColor}">
  <div class="mh-glow" style="background:radial-gradient(circle, \${mhAccent}40 0%, transparent 70%)"></div>
  <div class="mh-inner">
    <h1 class="mh-h1">\${escHtml(mhHeading)}</h1>
    <p class="mh-desc">\${escHtml(mhDesc)}</p>
    <div class="mh-btns">
      <a href="#" class="mh-btn-1" style="background:linear-gradient(135deg, \${mhAccent}, #3b82f6);box-shadow:0 10px 30px \${mhAccent}40">\${escHtml(mhCtaText)}</a>
      <a href="#" class="mh-btn-2">\${escHtml(mhCta2Text)}</a>
    </div>
    <div class="mh-img-wrap">
      <div class="mh-browser-bar">
        <div class="mh-dot" style="background:#ef4444"></div>
        <div class="mh-dot" style="background:#eab308"></div>
        <div class="mh-dot" style="background:#22c55e"></div>
      </div>
      <img src="\${escHtml(mhImage)}" alt="App Interface" class="mh-img" />
    </div>
  </div>
</section>\`
      }
`;

cgContent = cgContent.replace(/case 'skyline-hero':/, cgComps + "\n      case 'skyline-hero':");

const cgCss = `
/* Make Navbar */
.mn-nav { padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; font-family: system-ui, sans-serif; }
.mn-brand { font-size: 1.5rem; font-weight: 900; display: flex; align-items: center; gap: 8px; }
.mn-logo { width: 24px; height: 24px; border-radius: 50%; }
.mn-links { display: flex; gap: 32px; }
.mn-link { color: inherit; text-decoration: none; font-weight: 500; font-size: 0.95rem; opacity: 0.8; transition: opacity 0.2s; }
.mn-link:hover { opacity: 1; }
.mn-actions { display: flex; gap: 16px; align-items: center; }
.mn-login { color: inherit; text-decoration: none; font-weight: 600; font-size: 0.95rem; }
.mn-btn { padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.95rem; }
@media (max-width: 768px) { .mn-links { display: none; } }

/* Make Hero */
.mh-sec { padding: 80px 48px; position: relative; overflow: hidden; min-height: 600px; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; }
.mh-glow { position: absolute; top: 10%; left: 50%; transform: translateX(-50%); width: 60%; height: 400px; filter: blur(60px); pointer-events: none; }
.mh-inner { max-width: 1000px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
.mh-h1 { font-size: clamp(3rem, 6vw, 5rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 24px; margin-top: 0; }
.mh-desc { font-size: 1.25rem; color: #94a3b8; max-width: 700px; margin: 0 auto 40px; line-height: 1.6; }
.mh-btns { display: flex; gap: 16px; justify-content: center; margin-bottom: 64px; }
.mh-btn-1 { color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
.mh-btn-2 { background: rgba(255,255,255,0.1); color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.2); }
.mh-img-wrap { position: relative; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
.mh-browser-bar { position: absolute; top: 0; left: 0; right: 0; height: 40px; background: rgba(255,255,255,0.05); display: flex; align-items: center; padding: 0 16px; gap: 8px; }
.mh-dot { width: 12px; height: 12px; border-radius: 50%; }
.mh-img { width: 100%; display: block; margin-top: 40px; }
@media (max-width: 768px) { .mh-sec { padding: 40px 20px; } .mh-btns { flex-direction: column; } }
`;
cgContent = cgContent.replace(/(\/\* --- Component-specific Styles --- \*\/)/, '$1\n' + cgCss);
fs.writeFileSync('src/utils/codeGenerator.js', cgContent);
console.log('done make template');
