import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function creativeHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const ccHeading = escHtml(props.ccHeading || 'Creative Collective')
        const ccSubtitle = escHtml(props.ccSubtitle || 'A Showcase of Innovation')
        const ccImages = props.ccHeroImages || [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000',
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000',
        ]
        const ccTextColor = styles?.color || '#ffffff'
        const dotsHtml = ccImages.map((_, i) => `<button class="cch-dot${i === 0 ? ' cch-dot-active' : ''}" onclick="cchGoTo_${idx}(${i})" aria-label="Slide ${i + 1}"></button>`).join('')
        return `<section class="cch-section" id="cch-${idx}" style="background-image:url('${escHtml(ccImages[0])}')">
  <div class="cch-overlay"></div>
  <div class="cch-content">
    <h2 class="cch-heading" style="color:${ccTextColor}">${ccHeading}</h2>
    <p class="cch-subtitle" style="color:${ccTextColor}">${ccSubtitle}</p>
  </div>
  <div class="cch-dots" id="cch-dots-${idx}">${dotsHtml}</div>
</section>
<script>
(function(){
  var imgs=${JSON.stringify(ccImages)};
  var el=document.getElementById('cch-${idx}');
  var cur=0;
  function cchSet(i){
    cur=i;
    el.style.backgroundImage="url('"+imgs[i]+"')";
    document.querySelectorAll('#cch-dots-${idx} .cch-dot').forEach(function(d,idx2){
      d.classList.toggle('cch-dot-active',idx2===i);
    });
  }
  window.cchGoTo_${idx}=function(i){cchSet(i);};
  setInterval(function(){cchSet((cur+1)%imgs.length);},5000);
})();
</script>`
}
