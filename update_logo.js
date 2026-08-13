const fs = require('fs');

// 1. Update PropertiesPanel.jsx
let propsContent = fs.readFileSync('src/components/PropertiesPanel.jsx', 'utf8');
propsContent = propsContent.replace(
  /<Field label="Brand Name">\s*<input style=\{S\.input\} value=\{props\.foodBrand \|\| ''\} onChange=\{\(e\) => up\(\{ foodBrand: e\.target\.value \}\)\} placeholder="Ideatefood" \/>\s*<\/Field>/,
  '<Field label="Brand Name"><input style={S.input} value={props.foodBrand || \'\'} onChange={(e) => up({ foodBrand: e.target.value })} placeholder="Ideatefood" /></Field>\n            <ImageField label="Brand Logo URL" value={props.foodLogoUrl || \'\'} onChange={(url) => up({ foodLogoUrl: url })} />'
);
propsContent = propsContent.replace(
  /<Field label="Brand Name">\s*<input style=\{S\.input\} value=\{props\.foodFooterBrand \|\| ''\} onChange=\{\(e\) => up\(\{ foodFooterBrand: e\.target\.value \}\)\} \/>\s*<\/Field>/,
  '<Field label="Brand Name"><input style={S.input} value={props.foodFooterBrand || \'\'} onChange={(e) => up({ foodFooterBrand: e.target.value })} /></Field>\n            <ImageField label="Footer Logo URL" value={props.foodFooterLogoUrl || \'\'} onChange={(url) => up({ foodFooterLogoUrl: url })} />'
);

fs.writeFileSync('src/components/PropertiesPanel.jsx', propsContent);

// 2. Update ElementRenderer.jsx
let elemContent = fs.readFileSync('src/components/ElementRenderer.jsx', 'utf8');

elemContent = elemContent.replace(
  /const brand = props\.foodBrand \|\| props\.brand \|\| 'Ideatefood'/,
  'const brand = props.foodBrand || props.brand || \'Ideatefood\';\n  const logoUrl = props.foodLogoUrl;'
);
elemContent = elemContent.replace(
  /<span style=\{\{ fontSize: '1\.2rem', fontWeight: '900', letterSpacing: '-0\.04em', color: dark \}\}>\{brand\}<\/span>/,
  '{logoUrl ? <img src={logoUrl} alt={brand} style={{ height: \'32px\', objectFit: \'contain\' }} /> : <span style={{ fontSize: \'1.2rem\', fontWeight: \'900\', letterSpacing: \'-0.04em\', color: dark }}>{brand}</span>}'
);

elemContent = elemContent.replace(
  /const brand = props\.foodFooterBrand \|\| 'Ideatefood'/,
  'const brand = props.foodFooterBrand || \'Ideatefood\';\n  const logoUrl = props.foodFooterLogoUrl;'
);
elemContent = elemContent.replace(
  /<h2 style=\{\{ fontSize: '2rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0\.04em' \}\}>\{brand\}<\/h2>/,
  '{logoUrl ? <img src={logoUrl} alt={brand} style={{ height: \'48px\', objectFit: \'contain\', marginBottom: \'12px\' }} /> : <h2 style={{ fontSize: \'2rem\', fontWeight: \'900\', margin: \'0 0 8px\', letterSpacing: \'-0.04em\' }}>{brand}</h2>}'
);

fs.writeFileSync('src/components/ElementRenderer.jsx', elemContent);
console.log('Done props and elem');
