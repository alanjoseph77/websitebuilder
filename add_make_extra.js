const fs = require('fs');

// 1. App.jsx
let app = fs.readFileSync('src/App.jsx', 'utf8');
app = app.replace(
  /createElement\('make-hero'\)/,
  `createElement('make-hero'),
        createElement('make-features'),
        createElement('make-integrations'),
        createElement('make-pricing'),
        createElement('make-footer')`
);
fs.writeFileSync('src/App.jsx', app);

// 2. elementTypes.js
let el = fs.readFileSync('src/data/elementTypes.js', 'utf8');
const makeExtraElements = `
      {
        type: 'make-features',
        label: 'Make Features',
        icon: '⚡',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        description: 'Automation features grid with sleek dark cards',
        props: {
          mfHeading: 'Everything you need to automate your work',
          mfAccent: '#a855f7',
          mfFeatures: [
            { icon: '🚀', title: 'Visual workflow builder', desc: 'Drag and drop apps to create powerful workflows in minutes.' },
            { icon: '🔄', title: 'Infinite loops & branching', desc: 'Build complex logic with custom paths, iterators, and filters.' },
            { icon: '🛡️', title: 'Enterprise-grade security', desc: 'SOC 2 Type II compliant with detailed execution history.' },
          ]
        },
        styles: { backgroundColor: '#0f172a', color: '#ffffff' },
      },
      {
        type: 'make-integrations',
        label: 'Make Integrations',
        icon: '🔗',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        description: 'Integrations showcase with floating app icons',
        props: {
          miHeading: 'Connect 1,000+ apps out of the box',
          miAccent: '#a855f7',
          miCtaText: 'View all apps',
          miIcons: [
            { bg: '#2563eb', text: 'Fb' },
            { bg: '#10b981', text: 'Sh' },
            { bg: '#f59e0b', text: 'Sl' },
            { bg: '#ef4444', text: 'Gm' },
            { bg: '#6366f1', text: 'St' },
            { bg: '#8b5cf6', text: 'Tw' },
          ]
        },
        styles: { backgroundColor: '#0f172a', color: '#ffffff' },
      },
      {
        type: 'make-pricing',
        label: 'Make Pricing',
        icon: '💳',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        description: 'Sleek dark mode pricing cards',
        props: {
          mpHeading: 'Simple, transparent pricing',
          mpAccent: '#a855f7',
          mpPlans: [
            { name: 'Free', price: '$0', desc: 'For individuals', features: ['1,000 ops/month', 'Basic apps', 'Community support'], highlight: false },
            { name: 'Pro', price: '$16', desc: 'For professionals', features: ['10,000 ops/month', 'Premium apps', 'Priority support'], highlight: true },
            { name: 'Teams', price: '$29', desc: 'For small teams', features: ['Custom ops', 'Team collaboration', 'Dedicated success'], highlight: false },
          ]
        },
        styles: { backgroundColor: '#0f172a', color: '#ffffff' },
      },
      {
        type: 'make-footer',
        label: 'Make Footer',
        icon: '🦶',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        description: 'Dark minimal footer',
        props: {
          mftBrand: 'Make',
          mftAccent: '#a855f7',
          mftText: 'Design, build, and automate anything.',
          mftCopy: '© 2026 Make Inc. All rights reserved.'
        },
        styles: { backgroundColor: '#0f172a', color: '#94a3b8' },
      },`;
el = el.replace(
  /type: 'make-hero',[\s\S]*?styles: { backgroundColor: '#0f172a', color: '#ffffff' },\s*},/,
  match => match + '\n' + makeExtraElements
);
fs.writeFileSync('src/data/elementTypes.js', el);

// 3. ElementRenderer.jsx
let er = fs.readFileSync('src/components/ElementRenderer.jsx', 'utf8');
const makeErComps = `
function MakeFeatures({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.mfAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '96px 48px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', textAlign: 'center', marginBottom: '64px', letterSpacing: '-0.02em' }}>{props.mfHeading}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {(props.mfFeatures || []).map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px 32px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={(e)=>e.currentTarget.style.transform='none'}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: \`linear-gradient(135deg, \${accent}40, transparent)\`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '24px', border: \`1px solid \${accent}40\` }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MakeIntegrations({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.miAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '96px 48px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', width: '500px', height: '500px', background: \`radial-gradient(circle, \${accent}30 0%, transparent 70%)\`, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: '48px', letterSpacing: '-0.02em' }}>{props.miHeading}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', maxWidth: '800px', marginBottom: '56px' }}>
          {(props.miIcons || []).map((icon, i) => (
            <div key={i} style={{ width: '80px', height: '80px', borderRadius: '20px', background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {icon.text}
            </div>
          ))}
        </div>
        <a href="#" style={{ color: accent, textDecoration: 'none', fontWeight: '700', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          {props.miCtaText} <span style={{fontSize:'1.5rem'}}>→</span>
        </a>
      </div>
    </section>
  )
}

function MakePricing({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#ffffff'
  const accent = props.mpAccent || '#a855f7'

  return (
    <section style={{ backgroundColor: bg, color, padding: '96px 48px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: '64px', letterSpacing: '-0.02em' }}>{props.mpHeading}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
          {(props.mpPlans || []).map((plan, i) => (
            <div key={i} style={{ background: plan.highlight ? \`linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))\` : 'rgba(255,255,255,0.02)', border: \`1px solid \${plan.highlight ? accent : 'rgba(255,255,255,0.1)'}\`, borderRadius: '24px', padding: '48px 32px', position: 'relative', transform: plan.highlight ? 'scale(1.05)' : 'none', boxShadow: plan.highlight ? \`0 20px 40px -10px \${accent}40\` : 'none' }}>
              {plan.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Most Popular</div>}
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 8px' }}>{plan.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 32px' }}>{plan.desc}</p>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '32px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {plan.price}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '500' }}>/mo</span>
              </div>
              <button style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: plan.highlight ? accent : 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginBottom: '32px' }}>Get Started</button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(plan.features || []).map((feat, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '0.95rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: \`\${accent}30\`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>✓</div>
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MakeFooter({ element }) {
  const { props, styles } = element
  const bg = styles?.backgroundColor || '#0f172a'
  const color = styles?.color || '#94a3b8'
  const accent = props.mftAccent || '#a855f7'

  return (
    <footer style={{ backgroundColor: bg, color, padding: '64px 48px', fontFamily: 'system-ui, sans-serif', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: \`linear-gradient(135deg, \${accent}, #3b82f6)\` }} />
          {props.mftBrand}
        </div>
        <p style={{ fontSize: '1.1rem', margin: 0, textAlign: 'center' }}>{props.mftText}</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.6, margin: '24px 0 0' }}>{props.mftCopy}</p>
      </div>
    </footer>
  )
}
`;
er = er.replace(/function MakeHero.*?\n}\n/s, match => match + '\n' + makeErComps);

const makeErSwitch = `
    case 'make-features': return <MakeFeatures element={element} />
    case 'make-integrations': return <MakeIntegrations element={element} />
    case 'make-pricing': return <MakePricing element={element} />
    case 'make-footer': return <MakeFooter element={element} />
`;
er = er.replace(/case 'make-hero':\s*return <MakeHero element=\{element\} \/>/, match => match + '\n' + makeErSwitch);
fs.writeFileSync('src/components/ElementRenderer.jsx', er);

// 4. PropertiesPanel.jsx
let pp = fs.readFileSync('src/components/PropertiesPanel.jsx', 'utf8');
const makePpSwitch = `
    case 'make-features':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.mfHeading || ''} onChange={(e) => up({ mfHeading: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.mfAccent || '#a855f7'} onChange={(v) => up({ mfAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-integrations':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.miHeading || ''} onChange={(e) => up({ miHeading: e.target.value })} />
            </Field>
            <Field label="CTA Text">
              <input style={S.input} value={props.miCtaText || ''} onChange={(e) => up({ miCtaText: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.miAccent || '#a855f7'} onChange={(v) => up({ miAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-pricing':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Heading">
              <textarea style={S.textarea} rows={2} value={props.mpHeading || ''} onChange={(e) => up({ mpHeading: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.mpAccent || '#a855f7'} onChange={(v) => up({ mpAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#ffffff'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
    case 'make-footer':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Content</div>
            <Field label="Brand">
              <input style={S.input} value={props.mftBrand || ''} onChange={(e) => up({ mftBrand: e.target.value })} />
            </Field>
            <Field label="Text">
              <textarea style={S.textarea} rows={2} value={props.mftText || ''} onChange={(e) => up({ mftText: e.target.value })} />
            </Field>
            <Field label="Copyright">
              <input style={S.input} value={props.mftCopy || ''} onChange={(e) => up({ mftCopy: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.mftAccent || '#a855f7'} onChange={(v) => up({ mftAccent: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#0f172a'} onChange={(v) => us({ backgroundColor: v })} />
            <ColorField label="Text" value={styles?.color || '#94a3b8'} onChange={(v) => us({ color: v })} />
          </div>
        </>
      )
`;
pp = pp.replace(/(case 'make-hero':\s*return \(\s*<>[\s\S]*?<\/>\s*\))/s, match => match + '\n' + makePpSwitch);
fs.writeFileSync('src/components/PropertiesPanel.jsx', pp);

// 5. codeGenerator.js
let cg = fs.readFileSync('src/utils/codeGenerator.js', 'utf8');
const makeCgSwitch = `
      case 'make-features': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.mfAccent || '#a855f7'
        const mfHeading = props.mfHeading || ''
        const mfFeatures = props.mfFeatures || []
        const featuresHtml = mfFeatures.map(f => \`
          <div class="mf-card">
            <div class="mf-icon" style="background:linear-gradient(135deg, \${accent}40, transparent); border:1px solid \${accent}40">\${escHtml(f.icon)}</div>
            <h3 class="mf-title">\${escHtml(f.title)}</h3>
            <p class="mf-desc">\${escHtml(f.desc)}</p>
          </div>
        \`).join('')

        return \`<section class="mf-sec" style="background-color:\${bg};color:\${color}">
  <div class="mf-inner">
    <h2 class="mf-h2">\${escHtml(mfHeading)}</h2>
    <div class="mf-grid">\${featuresHtml}</div>
  </div>
</section>\`
      }

      case 'make-integrations': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.miAccent || '#a855f7'
        const miHeading = props.miHeading || ''
        const miCtaText = props.miCtaText || ''
        const miIcons = props.miIcons || []
        const iconsHtml = miIcons.map(icon => \`<div class="mi-icon" style="background:\${icon.bg}">\${escHtml(icon.text)}</div>\`).join('')

        return \`<section class="mi-sec" style="background-color:\${bg};color:\${color}">
  <div class="mi-glow" style="background:radial-gradient(circle, \${accent}30 0%, transparent 70%)"></div>
  <div class="mi-inner">
    <h2 class="mi-h2">\${escHtml(miHeading)}</h2>
    <div class="mi-grid">\${iconsHtml}</div>
    <a href="#" class="mi-cta" style="color:\${accent}">\${escHtml(miCtaText)} <span>→</span></a>
  </div>
</section>\`
      }

      case 'make-pricing': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#ffffff'
        const accent = props.mpAccent || '#a855f7'
        const mpHeading = props.mpHeading || ''
        const mpPlans = props.mpPlans || []
        const plansHtml = mpPlans.map(plan => {
          const bgStyle = plan.highlight ? \`background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));border-color:\${accent};transform:scale(1.05);box-shadow:0 20px 40px -10px \${accent}40\` : \`background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.1)\`
          const popularTag = plan.highlight ? \`<div class="mp-popular" style="background:\${accent}">Most Popular</div>\` : ''
          const btnStyle = plan.highlight ? \`background:\${accent}\` : \`background:rgba(255,255,255,0.1)\`
          const featsHtml = plan.features.map(f => \`<div class="mp-feat"><div class="mp-check" style="background:\${accent}30;color:\${accent}">✓</div>\${escHtml(f)}</div>\`).join('')
          
          return \`<div class="mp-card" style="\${bgStyle}">
            \${popularTag}
            <h3 class="mp-name">\${escHtml(plan.name)}</h3>
            <p class="mp-desc">\${escHtml(plan.desc)}</p>
            <div class="mp-price">\${escHtml(plan.price)}<span>/mo</span></div>
            <button class="mp-btn" style="\${btnStyle}">Get Started</button>
            <div class="mp-feats">\${featsHtml}</div>
          </div>\`
        }).join('')

        return \`<section class="mp-sec" style="background-color:\${bg};color:\${color}">
  <div class="mp-inner">
    <h2 class="mp-h2">\${escHtml(mpHeading)}</h2>
    <div class="mp-grid">\${plansHtml}</div>
  </div>
</section>\`
      }

      case 'make-footer': {
        const bg = styles?.backgroundColor || '#0f172a'
        const color = styles?.color || '#94a3b8'
        const accent = props.mftAccent || '#a855f7'
        const mftBrand = props.mftBrand || ''
        const mftText = props.mftText || ''
        const mftCopy = props.mftCopy || ''

        return \`<footer class="mft-sec" style="background-color:\${bg};color:\${color}">
  <div class="mft-inner">
    <div class="mft-brand">
      <div class="mft-logo" style="background:linear-gradient(135deg, \${accent}, #3b82f6)"></div>
      \${escHtml(mftBrand)}
    </div>
    <p class="mft-text">\${escHtml(mftText)}</p>
    <p class="mft-copy">\${escHtml(mftCopy)}</p>
  </div>
</footer>\`
      }
`;
cg = cg.replace(/(case 'make-hero':.*?\}\n)/s, match => match + '\n' + makeCgSwitch);

const makeCgCss = `
/* Make Features */
.mf-sec { padding: 96px 48px; font-family: system-ui, sans-serif; }
.mf-inner { max-width: 1200px; margin: 0 auto; }
.mf-h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; text-align: center; margin-bottom: 64px; letter-spacing: -0.02em; }
.mf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
.mf-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 40px 32px; transition: transform 0.2s; cursor: pointer; }
.mf-card:hover { transform: translateY(-4px); }
.mf-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 24px; }
.mf-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 16px; margin-top: 0; }
.mf-desc { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin: 0; }

/* Make Integrations */
.mi-sec { padding: 96px 48px; font-family: system-ui, sans-serif; position: relative; overflow: hidden; }
.mi-glow { position: absolute; right: -10%; bottom: -10%; width: 500px; height: 500px; filter: blur(60px); pointer-events: none; }
.mi-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.mi-h2 { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 800; text-align: center; margin-bottom: 48px; letter-spacing: -0.02em; margin-top: 0; }
.mi-grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; max-width: 800px; margin-bottom: 56px; }
.mi-icon { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); }
.mi-cta { text-decoration: none; font-weight: 700; font-size: 1.2rem; display: inline-flex; align-items: center; gap: 8px; }
.mi-cta span { font-size: 1.5rem; }

/* Make Pricing */
.mp-sec { padding: 96px 48px; font-family: system-ui, sans-serif; }
.mp-inner { max-width: 1200px; margin: 0 auto; }
.mp-h2 { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 800; text-align: center; margin-bottom: 64px; letter-spacing: -0.02em; margin-top: 0; }
.mp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; align-items: center; }
.mp-card { border: 1px solid; border-radius: 24px; padding: 48px 32px; position: relative; }
.mp-popular { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); color: #fff; padding: 4px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
.mp-name { font-size: 1.5rem; font-weight: 600; margin: 0 0 8px; }
.mp-desc { color: #94a3b8; font-size: 1rem; margin: 0 0 32px; }
.mp-price { font-size: 3rem; font-weight: 900; margin-bottom: 32px; display: flex; align-items: baseline; gap: 4px; }
.mp-price span { font-size: 1rem; color: #94a3b8; font-weight: 500; }
.mp-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; margin-bottom: 32px; }
.mp-feats { display: flex; flex-direction: column; gap: 16px; }
.mp-feat { display: flex; align-items: center; gap: 12px; color: #cbd5e1; font-size: 0.95rem; }
.mp-check { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; }

/* Make Footer */
.mft-sec { padding: 64px 48px; font-family: system-ui, sans-serif; border-top: 1px solid rgba(255,255,255,0.05); }
.mft-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.mft-brand { font-size: 1.8rem; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 12px; }
.mft-logo { width: 32px; height: 32px; border-radius: 50%; }
.mft-text { font-size: 1.1rem; margin: 0; text-align: center; }
.mft-copy { font-size: 0.9rem; opacity: 0.6; margin: 24px 0 0; }

@media (max-width: 768px) {
  .mf-sec, .mi-sec, .mp-sec, .mft-sec { padding: 64px 24px; }
  .mp-card { transform: none !important; }
}
`;
cg = cg.replace(/(\.mh-btns \{ flex-direction: column; \} \})/s, match => match + '\n\n' + makeCgCss);
fs.writeFileSync('src/utils/codeGenerator.js', cg);

console.log('Extra elements added to Make template!');
