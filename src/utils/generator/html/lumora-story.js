import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function lumoraStory(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const tag = props.tagline || 'OUR PHILOSOPHY'
        const title = props.title || 'Clean beauty, rooted in science'
        const p1 = props.storyP1 || 'We believe that skincare should be an act of self-love.'
        const p2 = props.storyP2 || 'Our formulas are crafted with the highest quality ingredients.'
        const cta = props.ctaText || 'Learn More'
        const img1 = props.image1 || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800'
        const img2 = props.image2 || 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800'
        return `<section class="lu-story">
  <div class="lu-story-grid">
    <div class="lu-story-text">
      <div class="lu-story-tag">${escHtml(tag)}</div>
      <h2 class="lu-story-title">${escHtml(title)}</h2>
      <p>${escHtml(p1)}</p>
      <p>${escHtml(p2)}</p>
      <button class="lu-story-btn">${escHtml(cta)}</button>
    </div>
    <div class="lu-story-images">
      <img src="${escHtml(img1)}" class="lu-img-1" alt="Story 1" />
      <img src="${escHtml(img2)}" class="lu-img-2" alt="Story 2" />
    </div>
  </div>
</section>`
}
