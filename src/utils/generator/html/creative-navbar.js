import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function creativeNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const ccBg = styles?.backgroundColor || '#ffffff'
        const ccColor = styles?.color || '#1a1a1a'
        const ccBrand = escHtml(props.ccBrand || 'Creative')
        const ccLinks = props.links || [
          { text: 'Home', href: '#' }, { text: 'Portfolio', href: '#portfolio' },
          { text: 'About', href: '#about' }, { text: 'Contact', href: '#contact' },
        ]
        const desktopLinks = ccLinks.map((l, i) => `<a href="${escHtml(l.href)}" class="ccn-link${i === 0 ? ' ccn-link-active' : ''}" style="color:${i === 0 ? ccColor : '#6b7280'}">${escHtml(l.text)}</a>`).join('')
        const overlayLinks = ccLinks.map(l => `<a href="${escHtml(l.href)}" class="ccn-ovl-link" style="color:${ccColor}">${escHtml(l.text)}</a>`).join('')
        return `<header class="ccn-header" style="background-color:${ccBg}" id="ccn-${idx}">
  <div class="ccn-inner">
    <span class="ccn-brand" style="color:${ccColor}">${ccBrand}</span>
    <nav class="ccn-desktop-nav">${desktopLinks}</nav>
    <button class="ccn-ham" id="ccn-open-${idx}" style="color:${ccColor}" aria-label="Open menu">
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </div>
  <div class="ccn-overlay" id="ccn-ovl-${idx}" style="background-color:${ccBg}">
    <div class="ccn-ovl-head">
      <span class="ccn-brand" style="color:${ccColor}">${ccBrand}</span>
      <button class="ccn-close" id="ccn-close-${idx}" style="color:${ccColor}">&#x2715;</button>
    </div>
    <nav class="ccn-ovl-nav">${overlayLinks}</nav>
  </div>
</header>
<script>
(function(){
  var open=document.getElementById('ccn-open-${idx}');
  var close=document.getElementById('ccn-close-${idx}');
  var ovl=document.getElementById('ccn-ovl-${idx}');
  if(open)open.addEventListener('click',function(){ovl.classList.add('ccn-ovl-show');document.body.style.overflow='hidden';});
  if(close)close.addEventListener('click',function(){ovl.classList.remove('ccn-ovl-show');document.body.style.overflow='';});
  if(ovl)ovl.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ovl.classList.remove('ccn-ovl-show');document.body.style.overflow='';});});
})();
</script>`
}
