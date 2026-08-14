import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function homeheroNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const hnBg = styles?.backgroundColor || '#ffffff'
        const hnColor = styles?.color || '#1a1a1a'
        const hnBrand = escHtml(props.hhBrand || 'HomeHero')
        const hnBadge = escHtml(props.hhBadge || 'HH')
        const hnAccent = props.hhAccent || '#4F46E5'
        const hnCoral = props.hhCoral || '#FF5A5F'
        const hnCta = escHtml(props.hhCtaText || 'Join the Beta')
        const hnLinks = (props.links || [
          { text: 'Bills', href: '#bills' }, { text: 'Repairs', href: '#repairs' }, { text: 'Chores', href: '#chores' },
        ])
        const desktopLinks = hnLinks.map(l => `<a href="${escHtml(l.href)}" class="hhn-link">${escHtml(l.text)}</a>`).join('')
        const overlayLinks = hnLinks.map(l => `<a href="${escHtml(l.href)}" class="hhn-ovl-link" style="color:${hnColor}">${escHtml(l.text)}</a>`).join('')
        return `<header class="hhn-header" style="background-color:${hnBg}" id="hhn-${idx}">
  <nav class="hhn-nav" style="color:${hnColor}">
    <div class="hhn-left">
      <div class="hhn-logo">
        <div class="hhn-badge" style="background-color:${hnAccent}">${hnBadge}</div>
        <span class="hhn-brand" style="color:${hnColor}">${hnBrand}</span>
      </div>
      <div class="hhn-links">${desktopLinks}</div>
    </div>
    <button class="hhn-ham" id="hhn-open-${idx}" aria-label="Open menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16m-7 6h7"/></svg>
    </button>
  </nav>
  <!-- Mobile overlay -->
  <div class="hhn-overlay" id="hhn-ovl-${idx}" style="background-color:${hnBg}">
    <div class="hhn-ovl-head">
      <div class="hhn-logo">
        <div class="hhn-badge" style="background-color:${hnAccent}">${hnBadge}</div>
        <span class="hhn-brand" style="color:${hnColor}">${hnBrand}</span>
      </div>
      <button class="hhn-close" id="hhn-close-${idx}" style="color:${hnColor}">&#x2715;</button>
    </div>
    <div class="hhn-ovl-links">${overlayLinks}</div>
    <div class="hhn-ovl-foot">
      <button class="hhn-cta-btn" style="background-color:${hnCoral}">${hnCta}</button>
    </div>
  </div>
</header>
<script>(function(){
  var o=document.getElementById('hhn-open-${idx}'),c=document.getElementById('hhn-close-${idx}'),v=document.getElementById('hhn-ovl-${idx}');
  if(o&&c&&v){o.addEventListener('click',function(){v.classList.add('hhn-ovl-active');document.body.style.overflow='hidden'});c.addEventListener('click',function(){v.classList.remove('hhn-ovl-active');document.body.style.overflow=''});v.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){v.classList.remove('hhn-ovl-active');document.body.style.overflow=''})});}
})();</script>`
}
