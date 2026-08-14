import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function qiNavbar(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const qnBg = styles?.backgroundColor || '#f7f7f5'
        const qnColor = styles?.color || '#1a1a1a'
        const qnBrand = escHtml(props.qiBrand || 'The Qi')
        const qnCart = escHtml(props.qiCartText || 'Cart')
        const qnCount = escHtml(props.qiCartCount || '0')
        const qnAccount = escHtml(props.qiAccountText || 'Account')
        const qnLinks = (props.links || [
          { text: 'Shop', href: '#shop' },
          { text: 'Learn', href: '#learn' },
          { text: 'Mission', href: '#mission' },
        ]).map(l => `<a href="${escHtml(l.href)}" class="qi-nav-link">${escHtml(l.text)}</a>`).join('\n          ')
        return `<header class="qi-header" style="background-color:${qnBg}">
  <nav class="qi-nav" style="color:${qnColor}">
    <div class="qi-nav-left">
      <button class="qi-ham" id="qi-open-${idx}" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <div class="qi-nav-links">
        ${qnLinks}
      </div>
    </div>
    <div class="qi-nav-center">
      <a href="/" class="qi-brand" style="color:${qnColor}">${qnBrand}</a>
    </div>
    <div class="qi-nav-right">
      <a href="${escHtml(props.qiAccountHref || '#')}" class="qi-nav-link qi-account">${qnAccount}</a>
      <a href="${escHtml(props.qiCartHref || '#')}" class="qi-nav-link">${qnCart} <span class="qi-count">(${qnCount})</span></a>
    </div>
  </nav>
  <!-- Mobile overlay -->
  <div class="qi-overlay" id="qi-overlay-${idx}" style="background-color:${qnBg};color:${qnColor}">
    <button class="qi-close" id="qi-close-${idx}" aria-label="Close menu">&#x2715;</button>
    ${(props.links || [{ text: 'Shop', href: '#shop' }, { text: 'Learn', href: '#learn' }, { text: 'Mission', href: '#mission' }]).map(l => `<a href="${escHtml(l.href)}" class="qi-overlay-link" style="color:${qnColor}">${escHtml(l.text)}</a>`).join('\n    ')}
  </div>
</header>
<script>
(function(){
  var open = document.getElementById('qi-open-${idx}');
  var close = document.getElementById('qi-close-${idx}');
  var overlay = document.getElementById('qi-overlay-${idx}');
  if(open && close && overlay){
    open.addEventListener('click', function(){ overlay.classList.add('qi-overlay-active'); document.body.style.overflow='hidden'; });
    close.addEventListener('click', function(){ overlay.classList.remove('qi-overlay-active'); document.body.style.overflow=''; });
    overlay.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ overlay.classList.remove('qi-overlay-active'); document.body.style.overflow=''; }); });
  }
})();
</script>`
}
