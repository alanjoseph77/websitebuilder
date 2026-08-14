import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function solemateCategories(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const smCatBg = styles?.backgroundColor || '#ffffff'
        const smCatColor = styles?.color || '#1a1a1a'
        const catLabels = props.smCatLabels || ["Men's", "Women's", "New Arrivals", "Sale"]
        const allImages = [
          props.smImgsMens || [],
          props.smImgsWomens || [],
          props.smImgsNew || [],
          props.smImgsSale || [],
        ]
        const jsCatData = JSON.stringify(allImages)
        const tabsHtml = catLabels.map((label, i) =>
          `<button class="smc-tab${i === 2 ? ' smc-tab-active' : ''}" onclick="smSwitchCat_${idx}(this,${i})" style="color:${smCatColor}">${escHtml(label)}</button>`
        ).join('')
        const defaultImgs = (allImages[2] || []).map(img => `<img src="${escHtml(img)}" class="smc-img" style="transition:opacity 0.3s">`).join('')
        return `<section class="smc-section" style="background-color:${smCatBg};color:${smCatColor}">
  <div class="smc-wrap">
    <div class="smc-tabs" id="smc-tabs-${idx}">${tabsHtml}</div>
    <div class="smc-grid" id="smc-grid-${idx}">${defaultImgs}</div>
  </div>
</section>
<script>
var smCatData_${idx} = ${jsCatData};
function smSwitchCat_${idx}(btn, tabIdx) {
  document.querySelectorAll('#smc-tabs-${idx} .smc-tab').forEach(function(t){t.classList.remove('smc-tab-active');});
  btn.classList.add('smc-tab-active');
  var imgs = document.querySelectorAll('#smc-grid-${idx} img');
  var newSrcs = smCatData_${idx}[tabIdx] || [];
  imgs.forEach(function(img,i){ img.style.opacity='0'; setTimeout(function(){ img.src=newSrcs[i]||''; img.style.opacity='1'; },280); });
}
</script>`
}
