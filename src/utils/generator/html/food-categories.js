import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function foodCategories(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const fcAccent = props.foodAccent || '#e67e22'
        const fcDark = props.foodDark || '#2d3436'
        const fcBg = styles?.backgroundColor || '#fff0eb'
        const fcTitle = props.foodCategoriesTitle || 'Browse Categories'
        const fcItems = props.foodCategories || [
          { icon: '🍔', name: 'Burgers' }, { icon: '🍕', name: 'Pizza' },
          { icon: '🍣', name: 'Sushi' }, { icon: '🥗', name: 'Healthy' },
          { icon: '🍩', name: 'Desserts' }, { icon: '☕', name: 'Coffee' }
        ]
        const itemsHtml = fcItems.map(c => 
          `<div class="fc-card" style="border-color:${fcDark};box-shadow:4px 4px 0px 0px ${fcDark}">
            <div class="fc-icon" style="background-color:${fcAccent};border-color:${fcDark};box-shadow:2px 2px 0px 0px ${fcDark}">${escHtml(c.icon)}</div>
            <span class="fc-name" style="color:${fcDark}">${escHtml(c.name)}</span>
          </div>`
        ).join('\n        ')
        return `<section class="fc-section" style="background-color:${fcBg}">
  <div class="fc-inner">
    <h2 class="fc-heading" style="color:${fcDark}">${escHtml(fcTitle)}</h2>
    <div class="fc-grid">${itemsHtml}</div>
  </div>
</section>`
}
