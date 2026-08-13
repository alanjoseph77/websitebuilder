const fs = require('fs'); 
let content = fs.readFileSync('src/components/PropertiesPanel.jsx', 'utf8'); 
const compStr = `    case 'food-categories':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Categories — Title</div>
            <Field label="Title">
              <input style={S.input} value={props.foodCategoriesTitle || ''} onChange={(e) => up({ foodCategoriesTitle: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Categories</div>
            {(props.foodCategories || []).map((cat, i) => (
              <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>Category {i + 1}</span>
                  <button onClick={() => up({ foodCategories: props.foodCategories.filter((_, j) => j !== i) })} style={S.removeBtn}>×</button>
                </div>
                <Field label="Icon"><input style={S.input} value={cat.icon} onChange={(e) => { const lp = [...props.foodCategories]; lp[i].icon = e.target.value; up({ foodCategories: lp }) }} /></Field>
                <Field label="Name"><input style={S.input} value={cat.name} onChange={(e) => { const lp = [...props.foodCategories]; lp[i].name = e.target.value; up({ foodCategories: lp }) }} /></Field>
              </div>
            ))}
            <button style={S.addBtn} onClick={() => up({ foodCategories: [...(props.foodCategories || []), { icon: '🍔', name: 'New Category' }] })}>
              + Add Category
            </button>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#fff0eb'} onChange={(v) => us({ backgroundColor: v })} />
          </div>
        </>
      )

    case 'food-items':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Items — Title</div>
            <Field label="Title">
              <input style={S.input} value={props.foodItemsTitle || ''} onChange={(e) => up({ foodItemsTitle: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Items</div>
            {(props.foodItems || []).map((item, i) => (
              <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>Item {i + 1}</span>
                  <button onClick={() => up({ foodItems: props.foodItems.filter((_, j) => j !== i) })} style={S.removeBtn}>×</button>
                </div>
                <Field label="Name"><input style={S.input} value={item.name} onChange={(e) => { const lp = [...props.foodItems]; lp[i].name = e.target.value; up({ foodItems: lp }) }} /></Field>
                <Field label="Price"><input style={S.input} value={item.price} onChange={(e) => { const lp = [...props.foodItems]; lp[i].price = e.target.value; up({ foodItems: lp }) }} /></Field>
                <Field label="Description"><textarea style={S.textarea} rows={2} value={item.desc} onChange={(e) => { const lp = [...props.foodItems]; lp[i].desc = e.target.value; up({ foodItems: lp }) }} /></Field>
                <ImageField label="Image URL" value={item.image} onChange={(url) => { const lp = [...props.foodItems]; lp[i].image = url; up({ foodItems: lp }) }} />
              </div>
            ))}
            <button style={S.addBtn} onClick={() => up({ foodItems: [...(props.foodItems || []), { image: 'https://placehold.co/400', name: 'New Item', price: '$0.00', desc: 'Description' }] })}>
              + Add Item
            </button>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#fff0eb'} onChange={(v) => us({ backgroundColor: v })} />
          </div>
        </>
      )

    case 'food-footer':
      return (
        <>
          <div style={S.section}>
            <div style={S.sectionTitle}>Food Footer — Content</div>
            <Field label="Brand Name">
              <input style={S.input} value={props.foodFooterBrand || ''} onChange={(e) => up({ foodFooterBrand: e.target.value })} />
            </Field>
            <Field label="Text">
              <input style={S.input} value={props.foodFooterText || ''} onChange={(e) => up({ foodFooterText: e.target.value })} />
            </Field>
            <Field label="Copyright">
              <input style={S.input} value={props.foodFooterCopyright || ''} onChange={(e) => up({ foodFooterCopyright: e.target.value })} />
            </Field>
          </div>
          <div style={S.section}>
            <div style={S.sectionTitle}>Colors</div>
            <ColorField label="Accent Color" value={props.foodAccent || '#e67e22'} onChange={(v) => up({ foodAccent: v })} />
            <ColorField label="Dark Color" value={props.foodDark || '#2d3436'} onChange={(v) => up({ foodDark: v })} />
            <ColorField label="Background" value={styles?.backgroundColor || '#fff0eb'} onChange={(v) => us({ backgroundColor: v })} />
          </div>
        </>
      )`;
content = content.replace(/case 'present-section':/, compStr + '\n\n    case \'present-section\':');
fs.writeFileSync('src/components/PropertiesPanel.jsx', content);
