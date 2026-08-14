import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function aetherProductSection(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const afOuterBg = styles?.backgroundColor || '#f3f4f6'
        const afColor = styles?.color || '#1a1a1a'
        const afTitle = escHtml(props.afTitle || 'AetherFlow X')
        const afSubtitle = escHtml(props.afSubtitle || 'Unleash Your Potential')
        const afCtaText = escHtml(props.afCtaText || 'Learn More')
        const afPrice = escHtml(props.afPrice || '$999.00')
        const afStockText = escHtml(props.afStockText || 'In Stock')
        const afBtnText = escHtml(props.afBtnText || 'Add to Cart')
        const afSelectLabel = escHtml(props.afSelectLabel || 'Configure Storage')
        const afImages = props.afImages || [
          'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1556656793-062ff98782ee?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1510557883980-505137219187?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1573148195900-7845fcc30127?auto=format&fit=crop&q=80&w=800',
        ]
        const afSpecs = props.afSpecs || [
          { label: 'Display', value: '6.7" Super AMOLED' },
          { label: 'Processor', value: 'Octa-core AetherChip v2' },
          { label: 'Storage', value: '256GB / 512GB NVMe' },
        ]
        const afOptions = props.afOptions || ['256GB — Standard', '512GB — Professional']

        const thumbsHtml = afImages.map((img, i) => `
        <button class="af-thumb${i === 0 ? ' af-thumb-active' : ''}" onclick="afUpdateImage(this,'af-main-${idx}','af-thumbs-${idx}',${i})" data-af-src="${escHtml(img)}">
          <img src="${escHtml(img)}" alt="View ${i + 1}" class="af-thumb-img">
        </button>`).join('')

        const specsHtml = afSpecs.map(s => `
        <div class="af-spec-item">
          <p class="af-spec-label">${escHtml(s.label)}</p>
          <p class="af-spec-value" style="color:${afColor}">${escHtml(s.value)}</p>
        </div>`).join('')

        const optionsHtml = afOptions.map(o => `<option>${escHtml(o)}</option>`).join('')

        return `<section class="af-outer" style="background-color:${afOuterBg};color:${afColor}" id="af-${idx}">
  <div class="af-grid">
    <!-- Left card -->
    <div class="af-left-card">
      <div class="af-hero-area">
        <div class="af-hero-text">
          <h1 class="af-title" style="color:${afColor}">${afTitle}</h1>
          <p class="af-subtitle">${afSubtitle}</p>
          <button class="af-cta-btn">${afCtaText}</button>
        </div>
        <div class="af-main-img-wrap">
          <img id="af-main-${idx}" src="${escHtml(afImages[0])}" alt="${afTitle}" class="af-main-img">
        </div>
      </div>
      <div class="af-gallery" id="af-thumbs-${idx}">
        ${thumbsHtml}
      </div>
    </div>
    <!-- Right card -->
    <div class="af-right-card">
      <div class="af-specs-section">
        <h2 class="af-section-title" style="color:${afColor}">Specifications</h2>
        <div class="af-specs">${specsHtml}</div>
      </div>
      <div class="af-buy-section">
        <h2 class="af-section-title" style="color:${afColor}">Buy Now</h2>
        <div class="af-select-wrap">
          <label class="af-select-label">${afSelectLabel}</label>
          <div class="af-select-box">
            <select class="af-select" style="color:${afColor}">${optionsHtml}</select>
            <span class="af-arrow">&#9660;</span>
          </div>
        </div>
        <div class="af-price-row">
          <p class="af-price" style="color:${afColor}">${afPrice}</p>
          <p class="af-stock">${afStockText}</p>
        </div>
        <button class="af-buy-btn">${afBtnText}</button>
      </div>
    </div>
  </div>
</section>
<script>
function afUpdateImage(btn, mainId, thumbsId, idx) {
  var mainImg = document.getElementById(mainId);
  var thumbsCont = document.getElementById(thumbsId);
  if (!mainImg || !thumbsCont) return;
  mainImg.classList.add('af-changing');
  setTimeout(function() {
    mainImg.src = btn.dataset.afSrc;
    mainImg.onload = function() { mainImg.classList.remove('af-changing'); };
    setTimeout(function() { mainImg.classList.remove('af-changing'); }, 400);
    thumbsCont.querySelectorAll('.af-thumb').forEach(function(t) { t.classList.remove('af-thumb-active'); });
    btn.classList.add('af-thumb-active');
  }, 180);
}
</script>`
}
