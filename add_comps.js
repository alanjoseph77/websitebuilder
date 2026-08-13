const fs = require('fs'); 
let content = fs.readFileSync('src/components/ElementRenderer.jsx', 'utf8'); 
const compStr = `function FoodCategories({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const title = props.foodCategoriesTitle || 'What are you craving?'
  const categories = props.foodCategories || []

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '32px 20px' : '48px 48px', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <style>{\`
        .fc-card { transition: all 0.2s ease; cursor: pointer; }
        .fc-card:hover { transform: translate(-4px,-4px); box-shadow: 8px 8px 0px 0px \${dark} !important; }
      \`}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: isSmall ? '2rem' : '2.5rem', fontWeight: '900', color: dark, margin: '0 0 32px' }}>{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
          {categories.map((cat, i) => (
            <div key={i} className="fc-card" style={{ backgroundColor: '#fff', border: \`3px solid \${dark}\`, borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: \`4px 4px 0px 0px \${dark}\` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: dark, margin: 0 }}>{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FoodItems({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const title = props.foodItemsTitle || 'Popular Dishes'
  const items = props.foodItems || []

  return (
    <section style={{ backgroundColor: bg, padding: isSmall ? '32px 20px' : '48px 48px', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <style>{\`
        .fi-card { transition: all 0.3s ease; }
        .fi-card:hover { transform: translate(-4px,-4px); box-shadow: 12px 12px 0px 0px \${dark} !important; }
        .fi-btn { transition: all 0.15s ease; cursor: pointer; }
        .fi-btn:hover { background-color: \${dark} !important; color: #fff !important; }
        .fi-btn:active { transform: translate(2px,2px); box-shadow: none !important; }
      \`}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: isSmall ? '2rem' : '2.5rem', fontWeight: '900', color: dark, margin: '0 0 32px' }}>{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : 'repeat(2, 1fr)', gap: '32px' }}>
          {items.map((item, i) => (
            <div key={i} className="fi-card" style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', backgroundColor: '#fff', border: \`4px solid \${dark}\`, borderRadius: '24px', overflow: 'hidden', boxShadow: \`6px 6px 0px 0px \${dark}\` }}>
              <img src={item.image} alt={item.name} style={{ width: isSmall ? '100%' : '180px', height: '180px', objectFit: 'cover', borderRight: isSmall ? 'none' : \`4px solid \${dark}\`, borderBottom: isSmall ? \`4px solid \${dark}\` : 'none' }} />
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: dark, margin: 0 }}>{item.name}</h3>
                  <span style={{ fontSize: '1.2rem', fontWeight: '900', color: accent }}>{item.price}</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', margin: '0 0 20px', flex: 1 }}>{item.desc}</p>
                <button className="fi-btn" style={{ alignSelf: 'flex-start', backgroundColor: accent, color: '#fff', border: \`3px solid \${dark}\`, borderRadius: '12px', padding: '10px 20px', fontSize: '1rem', fontWeight: '800', boxShadow: \`4px 4px 0px 0px \${dark}\` }}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FoodFooter({ element }) {
  const { props, styles } = element
  const { viewportWidth } = useBuilder()
  const isSmall = viewportWidth === 'mobile' || viewportWidth === 'tablet'

  const accent = props.foodAccent || '#e67e22'
  const dark = props.foodDark || '#2d3436'
  const bg = styles?.backgroundColor || '#fff0eb'
  const brand = props.foodFooterBrand || 'Ideatefood'
  const text = props.foodFooterText || 'Delivering happiness to your door.'
  const copyright = props.foodFooterCopyright || '© 2026 Ideatefood. All rights reserved.'

  return (
    <footer style={{ backgroundColor: bg, padding: isSmall ? '32px 20px' : '48px 48px', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: dark, borderRadius: '24px', padding: isSmall ? '32px 24px' : '48px 64px', display: 'flex', flexDirection: isSmall ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '24px', color: '#fff' }}>
        <div style={{ textAlign: isSmall ? 'center' : 'left' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.04em' }}>{brand}</h2>
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500', opacity: 0.9 }}>{text}</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ width: '48px', height: '48px', backgroundColor: accent, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1) rotate(5deg)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280', fontWeight: '600' }}>{copyright}</p>
      </div>
    </footer>
  )
}
`;
content = content.replace('export default function ElementRenderer', compStr + '\nexport default function ElementRenderer');

content = content.replace("if (type === 'food-hero') return withAnchor(<FoodHero element={element} />)", "if (type === 'food-hero') return withAnchor(<FoodHero element={element} />)\n  if (type === 'food-categories') return withAnchor(<FoodCategories element={element} />)\n  if (type === 'food-items') return withAnchor(<FoodItems element={element} />)\n  if (type === 'food-footer') return withAnchor(<FoodFooter element={element} />)");

content = content.replace(/case 'food-hero': \{\r?\n\s*return <FoodHero element=\{element\} \/>\r?\n\s*\}/, "case 'food-hero': {\n      return <FoodHero element={element} />\n    }\n    case 'food-categories': {\n      return <FoodCategories element={element} />\n    }\n    case 'food-items': {\n      return <FoodItems element={element} />\n    }\n    case 'food-footer': {\n      return <FoodFooter element={element} />\n    }");

fs.writeFileSync('src/components/ElementRenderer.jsx', content);
