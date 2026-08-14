import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function smartHomeDashboard(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  const shdAccent = props.shdAccent || '#b4c7bc'
        const shdDarkBg = props.shdDarkBg || '#2a2624'
        const shdRoom = escHtml(props.shdRoomName || 'Living room')
        const shdCamImg = escHtml(props.shdCameraImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200')
        const shdWatts = escHtml(props.shdPowerWatts || '65W')
        const shdPlaylist = escHtml(props.shdPlaylistName || 'Everyday Playlist')
        const shdAlbum = escHtml(props.shdAlbumImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400')
        const shdProfile = escHtml(props.shdProfileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop')
        const shdLight = Number(props.shdLightPercent ?? 70)
        const circ = 2 * Math.PI * 44
        const offset = circ - 0.65 * circ

        return `<section class="shd-wrap" style="background:radial-gradient(circle at center,#4a4440 0%,${shdDarkBg} 100%);color:#fff;font-family:'Inter',system-ui,sans-serif;padding:2rem;min-height:600px">
<div class="shd-inner">
  <nav class="shd-glass shd-sidebar">
    <div style="display:flex;flex-direction:column;gap:1.5rem;align-items:center">
      <button class="shd-nav-btn active">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
      </button>
      <button class="shd-nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
      </button>
      <button class="shd-nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      </button>
    </div>
    <div class="shd-avatar"><img src="${shdProfile}" alt="Profile"/></div>
  </nav>
  <div class="shd-grid">
    <div class="shd-cam shd-s6">
      <img src="${shdCamImg}" alt="${shdRoom}"/>
      <div class="shd-cam-overlay"></div>
      <div class="shd-pill" style="left:1.25rem">${shdRoom}</div>
      <div class="shd-pill shd-live" style="right:1.25rem;left:auto"><span class="shd-live-dot"></span>LIVE</div>
      <div class="shd-cam-info"><div style="font-size:1.1rem;font-weight:500">Live Camera</div><div style="font-size:.8rem;color:rgba(255,255,255,.6)">${shdRoom}</div></div>
    </div>
    <div class="shd-glass shd-plug shd-s6">
      <div style="text-align:center"><h3>Smart Plug</h3><p>${shdRoom}</p></div>
      <div class="shd-ring-wrap">
        <svg width="180" height="180" viewBox="0 0 100 100">
          <circle stroke="rgba(255,255,255,0.1)" stroke-width="6" fill="transparent" r="44" cx="50" cy="50"/>
          <circle class="shd-progress-circle" stroke="${shdAccent}" stroke-width="6" stroke-linecap="round" fill="transparent" r="44" cx="50" cy="50" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"/>
        </svg>
        <div class="shd-ring-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:6px"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          <span style="font-size:1.8rem;font-weight:300">${shdWatts}</span>
          <span style="font-size:.65rem;color:rgba(255,255,255,.4);letter-spacing:.1em;text-transform:uppercase">Power</span>
        </div>
      </div>
    </div>
    <div class="shd-glass shd-scene shd-s3">
      <div style="display:flex;align-items:center;gap:1rem">
        <div class="shd-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg></div>
        <div><div style="font-weight:500">Movie time</div><div style="font-size:.8rem;color:rgba(255,255,255,.4)">Scene</div></div>
      </div>
      <button class="shd-play-btn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
    </div>
    <div id="shd-tv" class="shd-tv-card shd-s3" style="background:${shdAccent};color:${shdDarkBg}" data-accent="${shdAccent}" data-dark="${shdDarkBg}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.8"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
        <span id="shd-tv-status" style="font-size:.85rem;font-weight:500;opacity:.6">On</span>
      </div>
      <div>
        <div style="font-size:1.2rem;font-weight:500;margin-bottom:4px">Smart TV</div>
        <div style="font-size:.85rem;opacity:.6;margin-bottom:1.25rem">${shdRoom}</div>
        <button id="shd-tv-toggle" class="shd-toggle on" onclick="shdTvToggle()" aria-label="Toggle TV">
          <span class="shd-toggle-dot" style="background:${shdDarkBg}"></span>
        </button>
      </div>
    </div>
    <div class="shd-glass shd-music shd-s6r2">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="shd-spotify-pill">
          <div class="shd-spotify-dot"><svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="black"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
          ${shdPlaylist}
        </div>
      </div>
      <div class="shd-music-body">
        <div class="shd-album"><img src="${shdAlbum}" alt="Album"/></div>
        <div>
          <div style="font-size:.7rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">Smart TV</div>
          <div style="font-size:1.5rem;font-weight:300">${shdRoom}</div>
          <div class="shd-music-ctrl">
            <button class="shd-ctrl-btn"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg></button>
            <button id="shd-play-btn" class="shd-play-main" onclick="shdPlayToggle()" aria-label="Play/Pause">
              <svg id="shd-play-icon" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="black"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            <button class="shd-ctrl-btn"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></button>
          </div>
        </div>
      </div>
    </div>
    <div class="shd-glass shd-gamepad shd-s3">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="shd-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg></div>
        <div class="shd-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <span id="shd-gp-status" style="margin-left:auto;font-size:.85rem;color:rgba(255,255,255,.4)">Off</span>
      </div>
      <div>
        <div style="font-size:1.2rem;font-weight:500;margin-bottom:4px">Gamepad</div>
        <div style="font-size:.85rem;color:rgba(255,255,255,.4);margin-bottom:1.25rem">${shdRoom}</div>
        <button id="shd-gp-toggle" class="shd-toggle off" onclick="shdGpToggle()" aria-label="Toggle Gamepad">
          <span class="shd-toggle-dot"></span>
        </button>
      </div>
    </div>
    <div id="shd-light-card" class="shd-glass shd-light shd-s3">
      <div id="shd-light-fill" class="shd-light-fill" style="height:${shdLight}%"></div>
      <div class="shd-light-info">
        <div class="shd-bulb-ring"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${shdAccent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></div>
        <span id="shd-light-val" style="font-size:1.5rem;font-weight:300">${shdLight}%</span>
      </div>
    </div>
  </div>
</div>
</section>`
}
