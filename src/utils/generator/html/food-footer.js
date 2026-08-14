import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function foodFooter(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const ffAccent = props.foodAccent || '#e67e22'
        const ffDark = props.foodDark || '#2d3436'
        const ffBg = styles?.backgroundColor || '#fff0eb'
        const ffBrand = props.foodFooterBrand || 'Ideatefood'
        const ffLogoUrl = props.foodFooterLogoUrl
        const ffText = props.foodFooterText || 'Delivering happiness to your door.'
        const ffCopyright = props.foodFooterCopyright || '© 2026 Ideatefood. All rights reserved.'
        
        let socialHtml = ''
        if (props.foodFbUrl) {
          socialHtml += `<a href="${escHtml(props.foodFbUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>`
        }
        if (props.foodIgUrl) {
          socialHtml += `<a href="${escHtml(props.foodIgUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>`
        }
        if (props.foodTwUrl) {
          socialHtml += `<a href="${escHtml(props.foodTwUrl)}" target="_blank" rel="noreferrer" class="ff-soc" style="background-color:${ffAccent}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>`
        }
        if (!socialHtml) {
          socialHtml = [1,2,3].map(i => `<div class="ff-soc" style="background-color:${ffAccent}"><div style="width:20px;height:20px;background-color:#fff;border-radius:50%"></div></div>`).join('')
        }

        return `<footer class="ff-footer" style="background-color:${ffBg}">
  <div class="ff-inner" style="background-color:${ffDark}">
    <div class="ff-left">
      ${ffLogoUrl ? `<img src="${escHtml(ffLogoUrl)}" alt="${escHtml(ffBrand)}" class="ff-logo-img" />` : `<h2 class="ff-brand">${escHtml(ffBrand)}</h2>`}
      <p class="ff-text">${escHtml(ffText)}</p>
    </div>
    <div class="ff-socials">${socialHtml}</div>
  </div>
  <div class="ff-copyright-wrap">
    <p class="ff-copyright">${escHtml(ffCopyright)}</p>
  </div>
</footer>`
}
