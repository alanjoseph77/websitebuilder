const fs = require('fs');

// 1. Update PropertiesPanel.jsx
let propsContent = fs.readFileSync('src/components/PropertiesPanel.jsx', 'utf8');

const socialProps = `
          <div style={S.section}>
            <div style={S.sectionTitle}>Social Links</div>
            <Field label="Facebook URL">
              <input style={S.input} value={props.foodFbUrl || ''} onChange={(e) => up({ foodFbUrl: e.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Instagram URL">
              <input style={S.input} value={props.foodIgUrl || ''} onChange={(e) => up({ foodIgUrl: e.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Twitter URL">
              <input style={S.input} value={props.foodTwUrl || ''} onChange={(e) => up({ foodTwUrl: e.target.value })} placeholder="https://..." />
            </Field>
          </div>
`;

propsContent = propsContent.replace(
  /<div style=\{S\.section\}>\s*<div style=\{S\.sectionTitle\}>Colors<\/div>\s*<ColorField label="Accent Color" value=\{props\.foodAccent \|\| '#e67e22'\} onChange=\{\(v\) => up\(\{ foodAccent: v \}\)\} \/>\s*<ColorField label="Dark Color" value=\{props\.foodDark \|\| '#2d3436'\} onChange=\{\(v\) => up\(\{ foodDark: v \}\)\} \/>\s*<ColorField label="Background" value=\{styles\?\.backgroundColor \|\| '#fff0eb'\} onChange=\{\(v\) => us\(\{ backgroundColor: v \}\)\} \/>\s*<\/div>\s*<\/>\s*\)/g,
  function(match) {
    if (this.isFooter) {
       return socialProps + match;
    }
    this.isFooter = !this.isFooter;
    return match;
  }
);
// Above regex hack: wait, I have multiple "Colors" sections. I should specifically target food-footer's return block.
