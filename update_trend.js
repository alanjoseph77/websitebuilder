const fs = require('fs');
let content = fs.readFileSync('src/utils/codeGenerator.js', 'utf8');

const trendHeroStr = `      case 'trend-hero': {
        const thAccent = props.trendAccent || '#e91e63'
        const thHeading = props.trendHeading || 'Bring brand in life'
        const thHighlight = props.trendHighlight || 'brand'
        const thDesc = props.trendDescription || 'Brand cream is a sunshine cream good for your skin care.'
        const thCtaText = props.trendCtaText || 'Shop Now'
        const thCtaHref = props.trendCtaHref || '#'
        const thRev = props.trendReviewCount || '10k+'
        const thRating = props.trendRating || '4.5'
        const thImg = props.trendProductImage || 'https://placehold.co/280x380/e91e63/ffffff?text=Product'
        const thF1 = props.trendFeature1 || 'Organic'
        const thF1D = props.trendFeature1Desc || 'Natural ingredients delivered fresh.'
        const thF2 = props.trendFeature2 || 'Aroma'
        const thF2D = props.trendFeature2Desc || 'Refreshing scents for all skin types.'
        const thF3 = props.trendFeature3 || 'Botanic'
        const thF3D = props.trendFeature3Desc || 'Plant-based formulas with proven results.'
        const thVideoText = props.trendVideoText || 'SEE PRODUCT VIDEO NOW'
        const thVideoLink = props.trendVideoLink || '#'
        const thBg = styles?.backgroundColor || '#ffffff'
        const thColor = styles?.color || '#1e293b'
        
        let headingHtml = escHtml(thHeading)
        if (thHighlight) {
          const idx = thHeading.indexOf(thHighlight)
          if (idx !== -1) {
            headingHtml = escHtml(thHeading.slice(0, idx)) + 
              \`<span class="th-hi" style="color:\${thAccent}"><span class="th-hi-box" style="border-color:\${thAccent}"></span>\${escHtml(thHighlight)}</span>\` + 
              escHtml(thHeading.slice(idx + thHighlight.length))
          }
        }

        return \`<section class="th-sec" style="background-color:\${thBg};color:\${thColor}">
  <div class="th-blob th-blob-1" style="background-color:\${thAccent}"></div>
  <div class="th-blob th-blob-2" style="background-color:\${thAccent}"></div>
  <div class="th-left">
    <h1 class="th-h1">\${headingHtml} <span style="color:\${thAccent}">→</span></h1>
    <p class="th-desc">\${escHtml(thDesc)}</p>
    <a href="\${escHtml(thCtaHref)}" class="th-cta" style="background-color:\${thAccent}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      \${escHtml(thCtaText)}
    </a>
    <div class="th-proof">
      <div class="th-avatars">
        <img src="https://i.pravatar.cc/100?u=a1" alt="" /><img src="https://i.pravatar.cc/100?u=a2" alt="" /><img src="https://i.pravatar.cc/100?u=a3" alt="" /><img src="https://i.pravatar.cc/100?u=a4" alt="" />
      </div>
      <div class="th-rating">
        <div class="th-stars">
          <svg width="14" height="14" fill="\${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="\${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="\${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="\${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="14" height="14" fill="\${thAccent}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <span>\${escHtml(thRev)} Customers • \${escHtml(thRating)} Rating</span>
      </div>
    </div>
  </div>
  <div class="th-center">
    <div class="th-img-bg" style="background-color:\${thAccent}"></div>
    <img src="\${escHtml(thImg)}" alt="" class="th-img" />
    <a href="\${escHtml(thVideoLink)}" class="th-vid" target="_blank">
      <svg viewBox="0 0 100 100" class="th-vid-text"><path id="th-circle-path" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none"/><text fill="\${thColor}"><textPath href="#th-circle-path">\${escHtml(thVideoText)} • \${escHtml(thVideoText)} • </textPath></text></svg>
      <div class="th-vid-play" style="background-color:\${thColor};color:\${thBg}"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
    </a>
  </div>
  <div class="th-right">
    <div class="th-feat">
      <p class="th-feat-num">01</p>
      <h3 class="th-feat-h">\${escHtml(thF1)}</h3>
      <p class="th-feat-p">\${escHtml(thF1D)}</p>
    </div>
    <div class="th-feat th-feat-hi" style="background-color:\${thAccent}">
      <p class="th-feat-num" style="color:#fff">02</p>
      <h3 class="th-feat-h" style="color:#fff">\${escHtml(thF2)}</h3>
      <p class="th-feat-p" style="color:#fff;opacity:0.9">\${escHtml(thF2D)}</p>
    </div>
    <div class="th-feat">
      <p class="th-feat-num">03</p>
      <h3 class="th-feat-h">\${escHtml(thF3)}</h3>
      <p class="th-feat-p">\${escHtml(thF3D)}</p>
    </div>
  </div>
</section>\`
      }`;

content = content.replace(/<\/header>`\s*}\s*case 'food-navbar': \{/, '</header>`\n      }\n\n' + trendHeroStr + '\n\n      case \'food-navbar\': {');

const trendCssStr = `
/* Trend Hero */
.th-sec { padding: 80px 48px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 24px; position: relative; overflow: hidden; }
.th-blob { position: absolute; border-radius: 50%; pointer-events: none; opacity: 0.04; }
.th-blob-1 { top: -60px; right: -60px; width: 300px; height: 300px; }
.th-blob-2 { bottom: -80px; left: -40px; width: 350px; height: 350px; }
.th-left { flex: 1 1 0; max-width: 320px; display: flex; flex-direction: column; gap: 20px; position: relative; z-index: 1; }
.th-h1 { font-size: 4rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin: 0; }
.th-hi { position: relative; display: inline-block; padding: 0 6px; }
.th-hi-box { position: absolute; left: 0; top: 10%; width: 100%; height: 80%; border: 2.5px solid; border-radius: 4px; pointer-events: none; }
.th-desc { color: #64748b; font-size: 1rem; max-width: 280px; line-height: 1.65; margin: 0; }
.th-cta { text-decoration: none; color: #fff; border-radius: 999px; padding: 13px 28px; font-weight: 700; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; width: fit-content; }
.th-proof { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.th-avatars { display: flex; }
.th-avatars img { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; margin-left: -8px; }
.th-avatars img:first-child { margin-left: 0; }
.th-rating { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #64748b; font-weight: 600; }
.th-stars { display: flex; gap: 2px; }
.th-center { flex: 1 1 0; display: flex; justify-content: center; position: relative; padding: 20px 0; animation: thFloat 6s ease-in-out infinite; }
@keyframes thFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
.th-img-bg { position: absolute; width: 240px; height: 340px; border-radius: 120px; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; }
.th-img { position: relative; z-index: 1; height: 420px; object-fit: contain; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); }
.th-vid { position: absolute; bottom: 10%; right: 5%; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; cursor: pointer; text-decoration: none; }
.th-vid-text { position: absolute; width: 100%; height: 100%; animation: thSpin 10s linear infinite; font-size: 13px; font-weight: 700; letter-spacing: 2px; }
@keyframes thSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.th-vid-play { position: relative; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.th-right { flex: 1 1 0; max-width: 240px; display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 1; }
.th-feat { padding: 16px; border-radius: 12px; }
.th-feat-hi { box-shadow: 0 10px 24px rgba(0,0,0,0.12); }
.th-feat-num { font-size: 0.8rem; font-weight: 800; color: #cbd5e1; margin: 0 0 4px; }
.th-feat-h { font-size: 1.1rem; font-weight: 800; margin: 0 0 6px; }
.th-feat-p { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0; }
@media (max-width: 768px) {
  .th-sec { flex-direction: column; padding: 40px 20px 50px; gap: 40px; }
  .th-left { max-width: 100%; align-items: center; text-align: center; }
  .th-h1 { font-size: 2.6rem; }
  .th-right { max-width: 100%; flex-direction: row; flex-wrap: wrap; justify-content: center; }
  .th-feat { flex: 1 1 200px; }
}
`;

content = content.replace(/(\/\* --- Component-specific Styles --- \*\/)/, '$1\n' + trendCssStr);

fs.writeFileSync('src/utils/codeGenerator.js', content);
console.log('added trend-hero');
