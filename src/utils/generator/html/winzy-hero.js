import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function winzyHero(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const bg = styles?.backgroundColor || '#0a0a0a'
        const color = styles?.color || '#ffffff'
        const bgImg = props.wzBgImg || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000'
        const h1 = escHtml(props.wzHeadline || 'Explore New Horizons with Every Journey')
        const desc = escHtml(props.wzDesc || 'Discover unique cultures, stunning landscapes, and unforgettable moments every step of the way.')
        const btn = escHtml(props.wzBtnText || 'Get started')
        const cImg = props.wzCardImg || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'
        const cStep = escHtml(props.wzCardStep || '01/10')
        const cTag = escHtml(props.wzCardTag || 'Tour')
        const cDesc = escHtml(props.wzCardDesc || 'Explore Brazil with local flavors and guided adventures')
        const uCount = escHtml(props.wzUsersCount || '10K+ users')
        const textRot = escHtml(props.wzRotateText || 'Explore more • Explore more • Explore more • ')

        return `<section class="wz-hero" style="background-color:${bg};color:${color}">
  <div class="wz-bg"><img src="${bgImg}" alt="" /><div class="wz-bg-grad"></div></div>
  <div class="wz-container">
    <div class="wz-grid">
      <div class="wz-left">
        <h1 class="wz-h1">${h1}</h1>
        <p class="wz-desc">${desc}</p>
        <div>
          <button class="wz-left-btn">
            ${btn}
            <div class="wz-btn-icon"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></div>
          </button>
        </div>
      </div>
      <div class="wz-right">
        <div class="wz-card">
          <div class="wz-card-img-wrap"><img src="${cImg}" alt="" class="wz-card-img" /><div class="wz-card-img-grad"></div></div>
          <div class="wz-card-progress">
            <span class="wz-card-step">${cStep}</span>
            <div class="wz-bars">
              <div class="wz-bar wz-bar-active"></div>
              <div class="wz-bar wz-bar-inactive"></div>
              <div class="wz-bar wz-bar-inactive"></div>
            </div>
          </div>
          <div class="wz-card-text">
            <h3 class="wz-card-tag">${cTag}</h3>
            <p class="wz-card-desc">${cDesc}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="wz-footer">
      <div class="wz-users">
        <div class="wz-avatars">
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" class="wz-avatar" alt=""/>
        </div>
        <p class="wz-users-text">${uCount}</p>
      </div>
      
      <div class="wz-rotator">
        <div class="wz-rotator-inner">
          <div class="wz-rotator-btn">
            <div class="wz-rotator-icon"><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg></div>
          </div>
        </div>
        <svg class="wz-rotator-svg" viewBox="0 0 100 100">
          <defs><path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" /></defs>
          <text fill="white" style="font-size:7px;font-weight:500;letter-spacing:0.2em;opacity:0.6;text-transform:uppercase;">
            <textPath href="#circlePath">${textRot}</textPath>
          </text>
        </svg>
      </div>
      
      <div class="wz-social">
        <p class="wz-social-text">Follow us</p>
        <div class="wz-icons">
          <a class="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          <a class="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
          <a class="wz-icon-link"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
        </div>
      </div>
    </div>
  </div>
</section>`
}
