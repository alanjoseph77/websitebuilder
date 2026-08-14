import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function mocoHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const mhAccent = props.mocoAccent || '#f97316'
        const mhBg = styles?.backgroundColor || '#0d0d1a'
        const mhColor = styles?.color || '#ffffff'
        const mhHeading = props.mocoHeading || 'Collect your best articles'
        const mhHLight = props.mocoHighlight || 'easily'
        const mhDesc = props.mocoDesc || 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.'
        const mhSearch = props.mocoSearchPlaceholder || 'Search'
        const mhC1T = props.mocoCard1Title || 'Business Mindset Planning'
        const mhC1Q = props.mocoCard1Quote || '"Your vision sets the tone for your future success..."'
        const mhC2T = props.mocoCard2Title || 'Key Success Of Career'
        const mhC2I = props.mocoCard2Image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
        const mhC3T = props.mocoCard3Title || 'Management'
        const mhC3I = props.mocoCard3Image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
        const mhC3A = props.mocoCard3Author || 'Courtney Henry'
        const mhC4T = props.mocoCard4Title || 'Masterplan Strategy'

        // Split heading: everything before the highlight word, and after
        const hlIdx = mhHeading.toLowerCase().indexOf(mhHLight.toLowerCase())
        const before = hlIdx >= 0 ? escHtml(mhHeading.slice(0, hlIdx)) : escHtml(mhHeading)
        const after = hlIdx >= 0 ? escHtml(mhHeading.slice(hlIdx + mhHLight.length)) : ''
        const hlSpan = hlIdx >= 0 ? `<span class="mh-highlight" style="color:${mhAccent}">${escHtml(mhHLight)}<svg class="mh-wave" viewBox="0 0 200 40" preserveAspectRatio="none"><path d="M0,20 Q50,0 100,20 T200,20" fill="none" stroke="${mhAccent}" stroke-width="4" stroke-opacity="0.6"/></svg></span>` : ''

        return `<section class="mh-section" style="background-color:${mhBg};color:${mhColor}">
  <div class="mh-blob-1" style="background:${mhAccent}30"></div>
  <div class="mh-blob-2"></div>
  <div class="mh-dots">${[...Array(16)].map(() => '<div class="mh-dot"></div>').join('')}</div>

  <div class="mh-inner">
    <!-- Left: 2x2 card grid -->
    <div class="mh-cards">
      <!-- Card 1: Cream -->
      <div class="mh-card mh-card-cream">
        <div class="mh-card-icons">
          <div class="mh-icon-circle mh-icon-orange">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div class="mh-icon-circle mh-icon-orange-faint"></div>
        </div>
        <div>
          <h3 class="mh-card-title mh-title-dark">${escHtml(mhC1T)}</h3>
          <p class="mh-card-quote">${escHtml(mhC1Q)}</p>
        </div>
      </div>
      <!-- Card 2: Image + overlay -->
      <div class="mh-card mh-card-img">
        <img src="${escHtml(mhC2I)}" alt="" class="mh-card-bg-img">
        <div class="mh-card-overlay"></div>
        <h3 class="mh-card-title mh-card-img-title">${escHtml(mhC2T)}</h3>
      </div>
      <!-- Card 3: Light blue -->
      <div class="mh-card mh-card-blue">
        <div class="mh-card-img-thumb">
          <img src="${escHtml(mhC3I)}" alt="" style="width:100%;height:100%;object-fit:cover;opacity:0.85">
        </div>
        <div>
          <h3 class="mh-card-title mh-title-navy">${escHtml(mhC3T)}</h3>
          <div class="mh-author-row">
            <div class="mh-author-dot"></div>
            <span class="mh-author-name">${escHtml(mhC3A)}</span>
          </div>
        </div>
      </div>
      <!-- Card 4: Orange accent -->
      <div class="mh-card mh-card-accent" style="background-color:${mhAccent};box-shadow:0 20px 40px ${mhAccent}33">
        <div class="mh-progress-bg"><div class="mh-progress-fill"></div></div>
        <h3 class="mh-card-title" style="color:#fff">${escHtml(mhC4T)}</h3>
      </div>
    </div>

    <!-- Right: hero text -->
    <div class="mh-hero-text">
      <div>
        <h1 class="mh-heading">${before}${hlSpan}${after}</h1>
        <p class="mh-desc">${escHtml(mhDesc)}</p>
      </div>
      <div class="mh-search-wrap">
        <svg class="mh-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" class="mh-search" placeholder="${escHtml(mhSearch)}">
      </div>
    </div>
  </div>
</section>`
}
