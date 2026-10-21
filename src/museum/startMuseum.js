/*
 * Celebration Museum for websitebuilder — startMuseum(root, { onExit }) builds the 3D museum inside `root` and returns a dispose function.
 * Generated from the museum page; edit freely.
 */
import * as THREE from 'three';
import Paint from './paint.js';
import * as Characters from './characters.js';

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Marcellus&family=Pinyon+Script&display=swap';

const MARKUP = `<canvas id="c" tabindex="0" aria-label="Walkable 3D celebration museum"></canvas>

<div class="hud-top">
  <div class="chip" id="chip"><div class="n"></div><div class="d"></div></div>
  <button class="gbtn" id="b-menu" type="button" aria-expanded="false" aria-controls="hud-btns">Menu</button>
  <div class="hud-btns" id="hud-btns">
    <button class="gbtn" id="b-back" type="button">← Back to site</button>
    <button class="gbtn" id="b-look" type="button">Painted <kbd>P</kbd></button>
    <button class="gbtn" id="b-time" type="button">Afternoon <kbd>T</kbd></button>
    <button class="gbtn" id="b-invite" type="button">Invitation</button>
    <button class="gbtn" id="b-edit" type="button">Personalize</button>
  </div>
</div>

<div id="bubble" hidden><p></p><span></span></div>

<div class="hud-bottom">
  <div>
    <div id="joy" aria-label="Move"><div id="knob"></div></div>
    <div id="hint">WASD to walk · drag to look · M music · P painted look · T time of day</div>
  </div>
  <div class="right-actions">
    <button class="gbtn" id="action" type="button" hidden><span></span><kbd>F</kbd></button>
    <button class="gbtn" id="b-music" type="button" aria-pressed="false">Music off <kbd>M</kbd></button>
    <button class="gbtn" id="b-dance" type="button">Dance <kbd>G</kbd></button>
  </div>
</div>

<div class="overlay" id="intro"></div>
<div class="overlay" id="invite" hidden></div>
<div class="overlay" id="lightbox" hidden>
  <div class="lb">
    <img id="lb-img" alt="">
    <div class="num" id="lb-num"></div>
    <div class="cap" id="lb-cap"></div>
    <div class="row">
      <button class="gbtn" id="lb-prev" type="button">Previous</button>
      <button class="gbtn" id="lb-close" type="button">Back to museum</button>
      <button class="gbtn" id="lb-next" type="button">Next</button>
    </div>
  </div>
</div>
<div class="overlay" id="wishbox" hidden></div>
<div class="overlay" id="photo" hidden></div>
<div id="flash" hidden></div>
<aside id="sheet" hidden aria-label="Personalize the museum"></aside>`;

export function startMuseum(root, { onExit } = {}) {
/* fonts used by the museum (loaded once) */
if (!document.querySelector('link[data-museum-fonts]')) {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS_HREF; l.setAttribute('data-museum-fonts', ''); document.head.appendChild(l);
}
root.classList.add('museum-root');
root.innerHTML = MARKUP;
const $ = id => root.querySelector('#' + id);
/* listeners on window/document are tracked so closing the museum removes them */
const offs = [];
function on(target, type, fn, opts){ target.addEventListener(type, fn, opts); offs.push(() => target.removeEventListener(type, fn, opts)); }
function offAll(){ while (offs.length) offs.pop()(); }
let disposed = false, rafId = 0;

const PHOTO_COUNT = 9;
const STORE = 'wedding-museum-v1';
const WISH_STORE = 'wedding-museum-wishes-v1';
let painted = false;

/* ---------- celebrations ---------- */
const THEMES = {
  wedding: {
    label:'Wedding', accent:'#a8843f', ink:'#9a7a3e',
    host:'Together with their families', line:'invite you to celebrate their wedding',
    message:'this is all for you, ily ♥', rsvp:'Kindly reply by 20 November', done:'Happily married',
    captions:['The first hello','Our first trip','Monsoon evenings','The proposal','Two families, one table','Engagement day','Laughing at nothing','Our song','Forever starts here'],
    names:['You (you walk as this avatar)','Your partner'], board:'Wishes for the couple',
    centreAct:'Admire the rings', edit:'Personalize for your wedding', aria:'Wedding invitation',
    petals:['#fdfaf4','#f6dfe0','#f1c9cf','#ead7ad'], shape:0, rug:['#7d2f33','#c9a45c'],
    deco:['#fdfaf4','#f6dfe0','#f1c9cf','#fff6ea'], tempo:0.42
  },
  birthday: {
    label:'Birthday', accent:'#b9566c', ink:'#b04a62',
    host:'You are invited to celebrate', line:'Cake, music and a room full of memories',
    message:'happy birthday, my favourite person ♥', rsvp:'Let us know you can make it by 20 November', done:'What a celebration',
    captions:['Day one','First birthday','School days','Best friends forever','That road trip','Graduation day','Adventures together','Silly faces','Here’s to many more'],
    names:['Birthday star (you walk as them)','Their favourite person'], board:'Birthday wishes',
    centreAct:'Blow out the candles', edit:'Personalize the birthday', aria:'Birthday invitation',
    petals:['#f3a8b8','#f6d47a','#94cbe6','#b4dba0'], shape:1, rug:['#c9637a','#f6d47a'],
    deco:['#f3a8b8','#f6d47a','#94cbe6','#b4dba0'], tempo:0.34
  },
  baby: {
    label:'Mother-to-be', accent:'#5f8fb5', ink:'#5a86ab',
    host:'Please join us for a baby shower honouring', line:'A little one is on the way',
    message:'can’t wait to meet you, little one ♥', rsvp:'Kindly reply by 20 November', done:'Welcome, little one',
    captions:['How we met','Our wedding day','Our first home','The big news','First scan','Bump diaries','Choosing names','Nursery ready','Hello, little one'],
    names:['Parent-to-be (you walk as them)','Partner'], board:'Wishes for the little one',
    centreAct:'Wind the mobile', edit:'Personalize the baby shower', aria:'Baby shower invitation',
    petals:['#bcd7ea','#f2c9d4','#f6e3b0','#cfe6cf'], shape:2, rug:['#9cbfd8','#f6e3b0'],
    deco:['#bcd7ea','#f2c9d4','#f6e3b0','#cfe6cf'], tempo:0.5
  }
};
const DEFAULT = {
  theme:'wedding', age:'25',
  name1:'Arjun', name2:'Meera', style1:'suit', style2:'long', color1:'#23272b', color2:'#9e2430',
  host:THEMES.wedding.host, line:THEMES.wedding.line,
  date:'2026-12-12', time:'10:30',
  venue:'Sea Breeze Gardens', city:'Fort Kochi, Kerala',
  rsvp:THEMES.wedding.rsvp, message:THEMES.wedding.message,
  photos:THEMES.wedding.captions.map(c=>({caption:c,src:null}))
};
const clone = o => JSON.parse(JSON.stringify(o));
function load(){
  try{
    const s = localStorage.getItem(STORE);
    if(s){
      const o = JSON.parse(s); const c = Object.assign(clone(DEFAULT), o);
      if(!THEMES[c.theme]) c.theme='wedding';
      c.photos = DEFAULT.photos.map((p,i)=>Object.assign({}, { caption:THEMES[c.theme].captions[i], src:null }, (o.photos||[])[i]||{}));
      return c;
    }
  }catch(e){}
  return clone(DEFAULT);
}
let cfg = load();
let storeWarn = '';
function save(){
  try{ localStorage.setItem(STORE, JSON.stringify(cfg)); storeWarn=''; }
  catch(e){
    storeWarn = 'These photos are too large to remember on this device. They stay until you close this page.';
    try{ const lite = clone(cfg); lite.photos.forEach(p=>p.src=null); localStorage.setItem(STORE, JSON.stringify(lite)); }catch(_){}
  }
}
const T = () => THEMES[cfg.theme] || THEMES.wedding;
const isLong = k => cfg['style'+k]==='long';
function momName(){ return isLong(1) || !isLong(2) ? cfg.name1 : cfg.name2; }
function otherOf(n){ return n===cfg.name1 ? cfg.name2 : cfg.name1; }
function titleOf(){ return cfg.theme==='wedding' ? `${cfg.name1} & ${cfg.name2}` : cfg.theme==='birthday' ? cfg.name1 : momName(); }
function subOf(){
  if(cfg.theme==='birthday') return cfg.age ? `turns ${cfg.age}` : '';
  if(cfg.theme==='baby') return `& ${otherOf(momName())} · baby on the way`;
  return '';
}
function applyAccent(){
  root.style.setProperty('--gold', T().accent);
}

/* ---------- formatting ---------- */
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function parseDate(s){ const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||''); return m? new Date(+m[1],+m[2]-1,+m[3]) : null; }
function fmtDate(s){ const d=parseDate(s); return d? `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : ''; }
function fmtTime(s){ const m=/^(\d{1,2}):(\d{2})/.exec(s||''); if(!m) return ''; let h=+m[1]; const ap=h>=12?'PM':'AM'; h=h%12||12; return `${h}:${m[2]} ${ap}`; }
function countdown(s){
  const d=parseDate(s); if(!d) return '';
  const t=new Date(); t.setHours(0,0,0,0);
  const n=Math.round((d-t)/86400000);
  if(n>1) return `${n} days to go`; if(n===1) return 'Tomorrow'; if(n===0) return 'Today is the day'; return T().done;
}
const esc = s => String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- photos ---------- */
const imgs = new Array(PHOTO_COUNT).fill(null);
function loadImg(i){
  const src = cfg.photos[i].src;
  if(!src){ imgs[i]=null; return; }
  const im = new Image();
  im.onload = ()=>{ imgs[i]=im; if(frames[i]) drawFrame(i); };
  im.src = src;
}
const ready = i => imgs[i] && imgs[i].complete && imgs[i].naturalWidth>0;

/* ---------- three setup ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1b19);
const camera = new THREE.PerspectiveCamera(58, 1, 0.05, 90);
const V3 = THREE.Vector3;
const ANISO = Math.min(8, renderer.capabilities.getMaxAnisotropy());
function makeTex(c){ const t=new THREE.CanvasTexture(c); t.anisotropy=ANISO; return t; }
function cv(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
const std = (color, o={}) => new THREE.MeshStandardMaterial(Object.assign({color, roughness:.8, metalness:0}, o));
function mesh(geo, mat, parent, surf, extra){ const m=new THREE.Mesh(geo, mat); if(parent) parent.add(m); m.userData.surf=surf||"plaster"; if(extra) Object.assign(m.userData, extra); return m; }
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
/* many small spheres in one draw call: [{p:Vector3, r:number, sy?:number}] */
function mergeSpheres(items, seg=8){
  const base=new THREE.SphereGeometry(1,seg,Math.max(4,seg*0.6|0)).toNonIndexed();
  const bp=base.attributes.position.array, bn=base.attributes.normal.array, bu=base.attributes.uv.array, n=bp.length, nu=bu.length;
  const pos=new Float32Array(n*items.length), nor=new Float32Array(n*items.length), uv=new Float32Array(nu*items.length);
  items.forEach((it,i)=>{
    const sy=it.sy||1;
    for(let j=0;j<n;j+=3){ pos[i*n+j]=bp[j]*it.r+it.p.x; pos[i*n+j+1]=bp[j+1]*it.r*sy+it.p.y; pos[i*n+j+2]=bp[j+2]*it.r+it.p.z; nor[i*n+j]=bn[j]; nor[i*n+j+1]=bn[j+1]; nor[i*n+j+2]=bn[j+2]; }
    uv.set(bu, i*nu);
  });
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3)); g.setAttribute('normal', new THREE.BufferAttribute(nor,3)); g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  base.dispose(); return g;
}

scene.add(new THREE.HemisphereLight(0xfffaf2, 0x8a8178, 0.95));
scene.add(new THREE.AmbientLight(0xffffff, 0.22));
const sun = new THREE.DirectionalLight(0xfff4e6, 0.5); sun.position.set(3,8,5); scene.add(sun);

const W=30, D=22, H=5, hx=W/2, hz=D/2;

/* floor */
(function(){
  const c=cv(1024,1024), x=c.getContext('2d');
  x.fillStyle='#e6e0d6'; x.fillRect(0,0,1024,1024);
  for(let i=0;i<9000;i++){ x.fillStyle=`rgba(${Math.random()<.5?'90,80,70':'255,255,255'},${Math.random()*.05})`; x.fillRect(Math.random()*1024,Math.random()*1024,2+Math.random()*3,2+Math.random()*3); }
  x.strokeStyle='rgba(80,70,60,.12)'; x.lineWidth=3;
  for(let k=0;k<=2;k++){ x.beginPath(); x.moveTo(k*512,0); x.lineTo(k*512,1024); x.stroke(); x.beginPath(); x.moveTo(0,k*512); x.lineTo(1024,k*512); x.stroke(); }
  const t=makeTex(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(W/4, D/4);
  const f=mesh(new THREE.PlaneGeometry(W,D), std(0xffffff,{map:t, roughness:.75}), scene, 'floor'); f.rotation.x=-Math.PI/2;
})();

/* walls, ceiling */
const wallMat = std(0xe2ddd5, {roughness:.95});
const baseMat = std(0xcfc8bd);
function wallXform(wall,u,y,off){
  switch(wall){
    case 'back': return {p:new V3(u,y,-hz+off), r:0, n:new V3(0,0,1)};
    case 'front': return {p:new V3(u,y,hz-off), r:Math.PI, n:new V3(0,0,-1)};
    case 'left': return {p:new V3(-hx+off,y,u), r:Math.PI/2, n:new V3(1,0,0)};
    default: return {p:new V3(hx-off,y,u), r:-Math.PI/2, n:new V3(-1,0,0)};
  }
}
[['back',W],['front',W],['left',D],['right',D]].forEach(([w,len])=>{
  const t=wallXform(w,0,H/2,0);
  const m=mesh(new THREE.PlaneGeometry(len,H), wallMat, scene, 'plaster'); m.position.copy(t.p); m.rotation.y=t.r;
  const b=wallXform(w,0,.06,.015);
  const bb=mesh(new THREE.BoxGeometry(len,.12,.03), baseMat, scene, 'stone'); bb.position.copy(b.p); bb.rotation.y=b.r;
});
/* ceiling with three skylight wells (the painted look's sun comes through these) */
const SKY = [{x:-9,z:0,w:3.4,d:2.6},{x:0,z:0,w:3.4,d:2.6},{x:9,z:0,w:3.4,d:2.6}];
const ceilMat = std(0x24201d,{roughness:1});
function ceilPiece(x0,x1,z0,z1){ if(x1-x0<.01||z1-z0<.01) return; const m=mesh(new THREE.BoxGeometry(x1-x0,.14,z1-z0), ceilMat, scene, 'plaster'); m.position.set((x0+x1)/2,H+.07,(z0+z1)/2); }
(function(){
  /* pieces overhang the walls so the only sunlight entering the room comes through the skylights */
  const E=3, z0=-SKY[0].d/2, z1=SKY[0].d/2;
  ceilPiece(-hx-E,hx+E,-hz-E,z0); ceilPiece(-hx-E,hx+E,z1,hz+E);
  let xp=-hx-E;
  for(const s of SKY){ ceilPiece(xp, s.x-s.w/2, z0, z1); xp=s.x+s.w/2; }
  ceilPiece(xp, hx+E, z0, z1);
})();
const wellMat = std(0xe8e2d8,{roughness:.95});
const skyPanelMat = new THREE.MeshBasicMaterial({color:0xfff3dc});
SKY.forEach(s=>{
  const dep=.7;
  [[s.w,.06,0,-s.d/2],[s.w,.06,0,s.d/2]].forEach(([w,t,dx,dz])=>{ const m=mesh(new THREE.BoxGeometry(w,dep,t), wellMat, scene, 'plaster'); m.position.set(s.x+dx,H+dep/2,s.z+dz); });
  [[-s.w/2],[s.w/2]].forEach(([dx])=>{ const m=mesh(new THREE.BoxGeometry(.06,dep,s.d), wellMat, scene, 'plaster'); m.position.set(s.x+dx,H+dep/2,s.z); });
  const p=mesh(new THREE.PlaneGeometry(s.w,s.d), skyPanelMat, scene, 'emissive', {skyPanel:true}); p.rotation.x=Math.PI/2; p.position.set(s.x,H+dep,s.z);
  for(let k=-1;k<=1;k+=2){ const mu=mesh(new THREE.BoxGeometry(.05,.05,s.d), std(0x2a2522), scene, 'wood'); mu.position.set(s.x+k*s.w/6,H+dep-.03,s.z); }
});
const trackMat = std(0x111111,{roughness:.5});
[-6.5,6.5].forEach(z=>{ const t=mesh(new THREE.BoxGeometry(W-2,.04,.06), trackMat, scene, 'metal'); t.position.set(0,H-.03,z); });
[-11.5,11.5].forEach(x=>{ const t=mesh(new THREE.BoxGeometry(.06,.04,D-2), trackMat, scene, 'metal'); t.position.set(x,H-.03,0); });

/* fairy lights: little bulbs strung in shallow loops along every wall, near the ceiling */
(function(){
  const items=[];
  const run=(wall,len)=>{
    const spans=Math.round(len/3), step=len/spans;
    for(let s=0;s<spans;s++) for(let k=0;k<14;k++){
      const t=k/14, u=-len/2+step*(s+t);
      const y=H-.45-Math.sin(Math.PI*t)*.32;
      items.push({p:wallXform(wall,u,y,.12).p, r:.032});
    }
  };
  run('back',W); run('front',W); run('left',D); run('right',D);
  mesh(mergeSpheres(items,6), new THREE.MeshBasicMaterial({color:0xffe2a8}), scene, 'emissive', {fairy:true, noOutline:true});
})();

/* light pools */
const poolTex = (function(){
  const c=cv(256,512), x=c.getContext('2d');
  x.save(); x.translate(128,40); x.scale(1,2.1);
  const g=x.createRadialGradient(0,0,0,0,0,128); g.addColorStop(0,'rgba(255,248,232,.95)'); g.addColorStop(.45,'rgba(255,245,226,.45)'); g.addColorStop(1,'rgba(255,245,226,0)');
  x.fillStyle=g; x.fillRect(-128,-40,256,512); x.restore();
  return makeTex(c);
})();
const poolMat = new THREE.MeshBasicMaterial({map:poolTex, transparent:true, depthWrite:false, opacity:.55});
const poolMeshes=[], lampDefs=[];
const bulbMat = new THREE.MeshBasicMaterial({color:0xffd9a0});
function addPool(wall,u,w,h,yTop,aimY){
  const t=wallXform(wall,u,yTop-h/2,.012);
  const p=mesh(new THREE.PlaneGeometry(w,h), poolMat, scene, 'unlit'); p.position.copy(t.p); p.rotation.y=t.r; p.renderOrder=1; poolMeshes.push(p);
  const f=wallXform(wall,u,H-.2,1.0);
  const lamp=mesh(new THREE.CylinderGeometry(.05,.07,.22,10), trackMat, scene, 'metal'); lamp.position.copy(f.p); lamp.rotation.y=f.r; lamp.rotation.x=.6;
  const aim=wallXform(wall,u,aimY===undefined?1.15:aimY,0).p;
  const bulb=mesh(new THREE.SphereGeometry(.045,10,8), bulbMat, scene, 'emissive', {bulb:true, noOutline:true});
  bulb.position.copy(f.p).addScaledVector(aim.clone().sub(f.p).normalize(), .12);
  lampDefs.push({pos:f.p.clone(), target:aim});
}

let outlineCounter=0;
function nextOutlineId(){ outlineCounter++; return ((outlineCounter*53)%240+8)/255; }

/* collisions */
const boxes=[], circles=[];
function collide(x,z,r,self){
  if(x<-hx+r||x>hx-r||z<-hz+r||z>hz-r) return true;
  const C=Characters;
  if(C) for(const c of C.characters){
    if(c===self || (self && c===self.partner) || c.state==='sit' || !c.root.visible) continue;
    const dn=Math.hypot(x-c.x,z-c.z);
    if(dn<r+.26 && (!self || dn<Math.hypot(self.x-c.x,self.z-c.z))) return true;
  }
  for(const b of boxes) if(x>b[0]-r&&x<b[1]+r&&z>b[2]-r&&z<b[3]+r) return true;
  for(const c of circles) if(Math.hypot(x-c[0],z-c[1])<r+c[2]) return true;
  return false;
}

/* ---------- placeholder art ---------- */
const PAL=[['#f6c99a','#e98b6d','#fff1d6'],['#a9c7e6','#f2c4b5','#fff6e8'],['#c7b6e0','#f0a9a0','#fff0e0'],['#f3d9a4','#d97f5f','#fff3d0'],['#bfd8c8','#e7c9a0','#fffae8'],['#f2b8b8','#c98fa8','#fff0f0'],['#9fc3d6','#e5b98f','#fff4dc'],['#f0c4a8','#b5677a','#ffe9d6'],['#d8c4e8','#e8a98f','#fff2e2']];
function figure(x,cx,base,s,long){
  x.fillStyle='rgba(32,20,17,.9)';
  x.fillRect(cx-14*s,base-112*s,11*s,112*s); x.fillRect(cx+3*s,base-112*s,11*s,112*s);
  rr(x,cx-22*s,base-202*s,44*s,98*s,16*s); x.fill();
  if(long){ rr(x,cx-21*s,base-246*s,42*s,78*s,20*s); x.fill(); }
  x.beginPath(); x.arc(cx,base-226*s,20*s,0,Math.PI*2); x.fill();
}
function drawPlaceholder(x,w,h,i){
  const p=PAL[i%PAL.length];
  const g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,p[0]); g.addColorStop(1,p[1]); x.fillStyle=g; x.fillRect(0,0,w,h);
  x.fillStyle=p[2]; x.globalAlpha=.85; x.beginPath(); x.arc(w*.5,h*.52,Math.min(w,h)*.22,0,Math.PI*2); x.fill(); x.globalAlpha=1;
  [[.66,'rgba(70,40,34,.32)',.025],[.75,'rgba(50,28,24,.5)',.018]].forEach(([y,col,a],k)=>{
    x.fillStyle=col; x.beginPath(); x.moveTo(0,h*y);
    for(let px=0;px<=w;px+=8) x.lineTo(px,h*y+Math.sin(px/w*Math.PI*2*(1+k)+i)*h*a);
    x.lineTo(w,h); x.lineTo(0,h); x.closePath(); x.fill();
  });
  const s=Math.min(w/600,h/720), base=h*.82;
  if(cfg.theme==='birthday') figure(x,w/2,base,s,cfg.style1==='long');
  else {
    figure(x,w/2-36*s,base,s,cfg.style1==='long'); figure(x,w/2+36*s,base,s,cfg.style2==='long');
    x.strokeStyle='rgba(32,20,17,.9)'; x.lineWidth=8*s; x.lineCap='round';
    x.beginPath(); x.moveTo(w/2-16*s,base-150*s); x.lineTo(w/2+16*s,base-150*s); x.stroke();
  }
  x.fillStyle='rgba(255,255,255,.8)'; x.font=`500 ${Math.round(22*s)}px Jost, sans-serif`; x.textAlign='center';
  x.fillText('Your photo here', w/2, h-28*s);
}
function drawCover(x,im,dx,dy,w,h,zoom){
  const s=Math.max(w/im.naturalWidth,h/im.naturalHeight)*(zoom||1);
  const dw=im.naturalWidth*s, dh=im.naturalHeight*s;
  x.drawImage(im, dx+(w-dw)/2, dy+(h-dh)*.35, dw, dh);
}
function fitFont(x,text,weight,family,size,maxW){
  let s=size; x.font=`${weight} ${s}px ${family}`;
  while(x.measureText(text).width>maxW && s>10){ s-=4; x.font=`${weight} ${s}px ${family}`; }
  return s;
}
function wrapText(x,text,maxW){
  const words=String(text).split(/\s+/), lines=[]; let line='';
  for(const w of words){ const t=line?line+' '+w:w; if(x.measureText(t).width>maxW && line){ lines.push(line); line=w; } else line=t; }
  if(line) lines.push(line); return lines;
}

/* ---------- frames ---------- */
const frameDefs=[
  {wall:'left',u:6},{wall:'left',u:0},{wall:'left',u:-6},
  {wall:'back',u:-9.5},{wall:'back',u:9.5},
  {wall:'right',u:-7},{wall:'right',u:7},
  {wall:'front',u:-4.5},{wall:'front',u:4.5}
];
const frames=[];
const interactables=[];
const frameMat=std(0x1b1815,{roughness:.5}), mattMat=new THREE.MeshBasicMaterial({color:0xf3efe8});
frameDefs.forEach((d,i)=>{
  const FW=1.3, FH=1.62;
  const t=wallXform(d.wall,d.u,1.8,.03);
  const g=new THREE.Group(); g.position.copy(t.p); g.rotation.y=t.r; scene.add(g);
  mesh(new THREE.BoxGeometry(FW,FH,.05), frameMat, g, 'wood');
  mesh(new THREE.PlaneGeometry(FW-.12,FH-.12), mattMat, g, 'canvas').position.z=.026;
  const pc=cv(600,800), ptex=makeTex(pc);
  const ph=mesh(new THREE.PlaneGeometry(FW-.36,FH-.36), new THREE.MeshBasicMaterial({map:ptex, color:0xf4f0ea}), g, 'canvas'); ph.position.z=.028;
  const lc=cv(512,170), ltex=makeTex(lc);
  const lab=mesh(new THREE.PlaneGeometry(.5,.166), new THREE.MeshBasicMaterial({map:ltex, color:0xe9e4dc}), g, 'canvas'); lab.position.set(FW/2+.4,-FH/2+.25,-.012);
  addPool(d.wall,d.u,2.7,3.6,H-.1);
  const point=t.p.clone().addScaledVector(t.n,1.5); point.y=0;
  frames.push({pc,ptex,lc,ltex});
  interactables.push({x:point.x,z:point.z,r:1.45,label:'View photo',act:()=>openLightbox(i)});
});
function drawFrame(i){
  const f=frames[i], x=f.pc.getContext('2d');
  if(ready(i)){ x.fillStyle='#ddd'; x.fillRect(0,0,600,800); drawCover(x,imgs[i],0,0,600,800); }
  else drawPlaceholder(x,600,800,i);
  f.ptex.needsUpdate=true;
}
function drawLabel(i){
  const f=frames[i], x=f.lc.getContext('2d');
  x.fillStyle='#f6f2ea'; x.fillRect(0,0,512,170);
  x.fillStyle='#8a7f72'; x.font='500 22px Jost, sans-serif'; x.textAlign='left';
  x.fillText(`Nº ${String(i+1).padStart(2,'0')}`, 28, 50);
  x.fillStyle='#2b2420'; fitFont(x, cfg.photos[i].caption||'Untitled', '400', 'Marcellus, Georgia, serif', 40, 456);
  x.fillText(cfg.photos[i].caption||'Untitled', 28, 102);
  x.fillStyle='#8a7f72'; x.font='400 20px Jost, sans-serif';
  x.fillText(titleOf(), 28, 142);
  f.ltex.needsUpdate=true;
}

/* ---------- invitation wall ---------- */
const invC=cv(2048,1152), invTex=makeTex(invC);
(function(){
  const t=wallXform('back',0,2.4,.04);
  const g=new THREE.Group(); g.position.copy(t.p); scene.add(g);
  mesh(new THREE.BoxGeometry(6.25,3.62,.05), std(0xb08d4a,{metalness:.5,roughness:.35,emissive:0x2a1d06}), g, 'metal');
  mesh(new THREE.PlaneGeometry(6.0,3.375), new THREE.MeshBasicMaterial({map:invTex, color:0xf6f2ea}), g, 'canvas').position.z=.027;
  addPool('back',0,8.5,4.2,H-.05,1.6);
  interactables.push({x:0,z:-hz+2.3,r:2.3,label:'Read invitation',act:()=>openInvite()});
})();
function drawInvitation(){
  const x=invC.getContext('2d'), w=2048, h=1152, th=T();
  const g=x.createRadialGradient(w/2,h/2,100,w/2,h/2,1200); g.addColorStop(0,'#fbf8f1'); g.addColorStop(1,'#efe7d8');
  x.fillStyle=g; x.fillRect(0,0,w,h);
  x.strokeStyle=th.accent; x.lineWidth=4; x.strokeRect(48,48,w-96,h-96); x.lineWidth=2; x.strokeRect(68,68,w-136,h-136);
  [[68,68,1,1],[w-68,68,-1,1],[68,h-68,1,-1],[w-68,h-68,-1,-1]].forEach(([cx,cy,sx,sy])=>{
    x.beginPath(); x.arc(cx+sx*40,cy+sy*40,40,0,Math.PI*2); x.stroke();
    x.beginPath(); x.moveTo(cx+sx*90,cy+sy*14); x.lineTo(cx+sx*200,cy+sy*14); x.moveTo(cx+sx*14,cy+sy*90); x.lineTo(cx+sx*14,cy+sy*200); x.stroke();
  });
  x.textAlign='center'; x.textBaseline='alphabetic';
  const sub=subOf(); const lift = sub ? 40 : 0;
  x.fillStyle='#7a6a55'; fitFont(x,(cfg.host||'').toUpperCase(),'400','Marcellus, Georgia, serif',46,1600);
  x.fillText((cfg.host||'').toUpperCase(), w/2, 220-lift/2);
  x.fillStyle=th.ink;
  const title=titleOf();
  fitFont(x,title,'400','"Pinyon Script", cursive',230,1700); x.fillText(title,w/2,460-lift);
  if(sub){ x.fillStyle=th.ink; fitFont(x,sub.toUpperCase(),'400','Marcellus, Georgia, serif',58,1600); x.fillText(sub.toUpperCase(),w/2,540); }
  x.fillStyle='#3a302a'; fitFont(x,cfg.line||'','400','Marcellus, Georgia, serif',54,1600); x.fillText(cfg.line||'',w/2,610+lift/2);
  x.strokeStyle=th.accent; x.lineWidth=2; x.beginPath(); x.moveTo(w/2-300,680); x.lineTo(w/2-24,680); x.moveTo(w/2+24,680); x.lineTo(w/2+300,680); x.stroke();
  x.save(); x.translate(w/2,680); x.rotate(Math.PI/4); x.fillStyle=th.accent; x.fillRect(-9,-9,18,18); x.restore();
  x.fillStyle='#2b2420'; const dt=fmtDate(cfg.date).toUpperCase().replace(/, /,'  ·  ');
  fitFont(x,dt,'400','Marcellus, Georgia, serif',66,1700); x.fillText(dt,w/2,795);
  x.fillStyle='#7a6a55'; x.font='400 48px Jost, sans-serif'; x.fillText(fmtTime(cfg.time),w/2,865);
  x.fillStyle='#2b2420'; fitFont(x,cfg.venue||'','400','Marcellus, Georgia, serif',64,1600); x.fillText(cfg.venue||'',w/2,965);
  x.fillStyle='#7a6a55'; x.font='400 44px Jost, sans-serif'; x.fillText(cfg.city||'',w/2,1030);
  x.fillStyle=th.ink; x.font='italic 400 34px Jost, sans-serif'; x.fillText(cfg.rsvp||'',w/2,1088);
  invTex.needsUpdate=true;
}

/* ---------- screen + bench ---------- */
const scrC=cv(1280,720), scrTex=makeTex(scrC);
const BENCH_X=hx-3.2;
(function(){
  const t=wallXform('right',0,2.2,.04);
  const g=new THREE.Group(); g.position.copy(t.p); g.rotation.y=t.r; scene.add(g);
  mesh(new THREE.BoxGeometry(4.72,2.72,.08), std(0x141210,{roughness:.4}), g, 'metal');
  mesh(new THREE.PlaneGeometry(4.56,2.565), new THREE.MeshBasicMaterial({map:scrTex}), g, 'emissive').position.z=.041;
  const wood=std(0xd8c6a6,{roughness:.7}), dark=std(0x1c1a18,{roughness:.5});
  const bx=BENCH_X;
  mesh(new THREE.BoxGeometry(.55,.07,2.3), wood, scene, 'wood').position.set(bx,.45,0);
  [-.95,.95].forEach(z=>{ mesh(new THREE.BoxGeometry(.46,.42,.05), dark, scene, 'metal').position.set(bx,.21,z); });
  boxes.push([bx-.28,bx+.28,-1.15,1.15]);
  interactables.push({x:bx-1,z:0,r:1.7,label:'Sit together',act:()=>sit()});
})();
function drawScreen(t){
  const x=scrC.getContext('2d'), w=1280, h=720, per=6;
  const k=Math.floor(t/per)%PHOTO_COUNT, f=(t%per)/per;
  if(ready(k)){ x.fillStyle='#000'; x.fillRect(0,0,w,h); drawCover(x,imgs[k],0,0,w,h,1+f*.06); }
  else drawPlaceholder(x,w,h,k);
  const gr=x.createLinearGradient(0,h*.6,0,h); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.55)');
  x.fillStyle=gr; x.fillRect(0,h*.6,w,h*.4);
  x.fillStyle='#fff'; x.textAlign='left'; x.font='400 40px Marcellus, Georgia, serif';
  x.fillText(cfg.photos[k].caption||'',48,h-48);
  const fade = f>.92 ? (f-.92)/.08 : f<.06 ? 1-f/.06 : 0;
  if(fade>0){ x.fillStyle=`rgba(0,0,0,${fade})`; x.fillRect(0,0,w,h); }
  scrTex.needsUpdate=true;
}

/* ---------- fixed fixtures: aisle rug, flower stands, plinth lamp, photo arch, wishes board ---------- */
const CENTRE=new V3(0,0,-3), ARCH=new V3(8.5,0,7.5), BOARD=new V3(-8.5,0,7.5);
const CORNERS=[new V3(-12.6,0,-8.8), new V3(12.6,0,-8.8)];
const plinthMat=std(0xf2efe9,{roughness:.9});
const rugC=cv(256,1024), rugTex=makeTex(rugC);
const rug=mesh(new THREE.PlaneGeometry(2.2,11), new THREE.MeshStandardMaterial({map:rugTex, roughness:1}), scene, 'fabric', {noOutline:true});
rug.rotation.x=-Math.PI/2; rug.position.set(0,.006,4.6);
function drawRug(){
  const x=rugC.getContext('2d'), [a,b]=T().rug;
  x.fillStyle=a; x.fillRect(0,0,256,1024);
  x.strokeStyle=b; x.lineWidth=10; x.strokeRect(14,14,228,996); x.lineWidth=3; x.strokeRect(30,30,196,964);
  x.globalAlpha=.18; x.fillStyle='#000'; for(let i=0;i<2600;i++) x.fillRect(Math.random()*256,Math.random()*1024,1,2); x.globalAlpha=1;
  rugTex.needsUpdate=true;
}
/* flower stands beside the invitation */
(function(){
  const petals=[0xfdfaf4,0xf6dfe0,0xf1c9cf,0xfff6ea], leaf=std(0x6f8a5e);
  [-4.6,4.6].forEach(xp=>{
    const z=-hz+.8;
    mesh(new THREE.CylinderGeometry(.2,.26,1.05,20), plinthMat, scene, 'stone').position.set(xp,.525,z);
    mesh(new THREE.CylinderGeometry(.14,.1,.32,16), std(0xb08d4a,{metalness:.4,roughness:.4}), scene, 'metal').position.set(xp,1.21,z);
    for(let i=0;i<22;i++){
      const a=Math.random()*Math.PI*2, rad=Math.random()*.3;
      const m=mesh(new THREE.SphereGeometry(i%5===0?.07:.095,10,8), i%5===0?leaf:std(petals[i%4],{roughness:.9}), scene, 'fabric', {noOutline:true});
      m.position.set(xp+Math.cos(a)*rad, 1.42+Math.random()*.32-rad*.4, z+Math.sin(a)*rad);
    }
    circles.push([xp,z,.32]);
  });
})();
/* lamp over the centrepiece */
(function(){
  const rl=mesh(new THREE.CylinderGeometry(.06,.08,.22,10), trackMat, scene, 'metal'); rl.position.set(CENTRE.x,H-.12,CENTRE.z);
  const rb=mesh(new THREE.SphereGeometry(.05,10,8), bulbMat, scene, 'emissive', {bulb:true,noOutline:true}); rb.position.set(CENTRE.x,H-.25,CENTRE.z);
  lampDefs.push({pos:new V3(CENTRE.x,H-.25,CENTRE.z), target:new V3(CENTRE.x,1.1,CENTRE.z)});
  boxes.push([CENTRE.x-.7,CENTRE.x+.7,CENTRE.z-.7,CENTRE.z+.7]);
  interactables.push({x:CENTRE.x+1.6,z:CENTRE.z-1.4,r:1.9,label:()=>T().centreAct,act:()=>centreAction()});
})();
/* photo arch: two posts and a half ring; its decoration changes with the celebration */
const ARCH_R=1.25, ARCH_H=1.45;
(function(){
  const g=new THREE.Group(); g.position.copy(ARCH); scene.add(g);
  const m=std(0xe9e3d6,{roughness:.6});
  [-ARCH_R,ARCH_R].forEach(x=>{ mesh(new THREE.CylinderGeometry(.05,.06,ARCH_H,12), m, g, 'wood').position.set(x,ARCH_H/2,0); circles.push([ARCH.x+x,ARCH.z,.22]); });
  const ring=mesh(new THREE.TorusGeometry(ARCH_R,.05,10,48,Math.PI), m, g, 'wood'); ring.position.y=ARCH_H;
  [-ARCH_R,ARCH_R].forEach(x=>{ mesh(new THREE.CylinderGeometry(.16,.2,.08,16), m, g, 'stone').position.set(x,.04,0); });
  interactables.push({x:ARCH.x,z:ARCH.z-1.4,r:1.6,label:'Pose for a photo',act:()=>posePhoto()});
})();
function archPath(t){ /* 0..1 along left post, over the top, down the right post */
  const post=ARCH_H, arc=Math.PI*ARCH_R, L=post*2+arc, d=t*L;
  if(d<post) return new V3(-ARCH_R, d, 0);
  if(d<post+arc){ const a=Math.PI-(d-post)/ARCH_R; return new V3(Math.cos(a)*ARCH_R, ARCH_H+Math.sin(a)*ARCH_R, 0); }
  return new V3(ARCH_R, post-(d-post-arc), 0);
}
/* wishes board on an easel */
const wishC=cv(768,972), wishTex=makeTex(wishC);
(function(){
  const g=new THREE.Group(); g.position.copy(BOARD); g.rotation.y=Math.PI; scene.add(g);
  const wood=std(0x8a6a4a,{roughness:.7});
  mesh(new THREE.BoxGeometry(1.62,2.02,.05), wood, g, 'wood').position.set(0,1.55,0);
  mesh(new THREE.PlaneGeometry(1.5,1.9), new THREE.MeshBasicMaterial({map:wishTex, color:0xf6f2ea}), g, 'canvas').position.set(0,1.55,.027);
  [-.6,.6].forEach(x=>{ const l=mesh(new THREE.CylinderGeometry(.03,.035,1.2,8), wood, g, 'wood'); l.position.set(x,.55,.12); l.rotation.x=-.12; });
  const back=mesh(new THREE.CylinderGeometry(.03,.035,2.2,8), wood, g, 'wood'); back.position.set(0,1.05,-.32); back.rotation.x=.3;
  boxes.push([BOARD.x-.85,BOARD.x+.85,BOARD.z-.25,BOARD.z+.45]);
  interactables.push({x:BOARD.x,z:BOARD.z-1.4,r:1.6,label:'Write a wish',act:()=>openWish()});
})();
const EXAMPLE_WISHES=[
  {name:'Ammu', text:'Sending you so much love. Can’t wait to celebrate with you!', example:true},
  {name:'Rahul', text:'Save me a seat near the dessert table.', example:true},
  {name:'Grandma', text:'Bless you, always.', example:true}
];
let wishes=(function(){ try{ const s=JSON.parse(localStorage.getItem(WISH_STORE)||'null'); if(Array.isArray(s)&&s.length) return s; }catch(e){} return EXAMPLE_WISHES.slice(); })();
function drawWishes(){
  const x=wishC.getContext('2d'), w=768, h=972, th=T();
  x.fillStyle='#f8f3ea'; x.fillRect(0,0,w,h);
  x.strokeStyle=th.accent; x.lineWidth=3; x.strokeRect(22,22,w-44,h-44);
  x.textAlign='center'; x.fillStyle=th.ink; fitFont(x,th.board,'400','"Pinyon Script", cursive',84,680); x.fillText(th.board,w/2,128);
  x.fillStyle='#7a6a55'; x.font='500 20px Jost, sans-serif'; x.fillText(titleOf().toUpperCase(),w/2,168);
  let y=228; x.textAlign='left';
  for(const wsh of wishes.slice(0,6)){
    x.fillStyle='#2b2420'; x.font='italic 400 28px Georgia, serif';
    const lines=wrapText(x,'“'+wsh.text+'”',640).slice(0,3);
    for(const l of lines){ if(y>h-110) break; x.fillText(l,64,y); y+=36; }
    x.fillStyle=th.ink; x.font='600 22px Jost, sans-serif'; x.fillText('— '+wsh.name+(wsh.example?' (example)':''),64,y+2); y+=58;
    if(y>h-110) break;
  }
  x.textAlign='center'; x.fillStyle='#8a7f72'; x.font='400 22px Jost, sans-serif';
  x.fillText('Walk up and tap “Write a wish”',w/2,h-54);
  wishTex.needsUpdate=true;
}

/* ---------- celebration set: centrepiece, arch decoration, corner decorations ---------- */
let themeGroup=null;
const anim={ rings:null, flames:[], candlesOut:0, mobile:null, mobileSpin:0, balloons:[], sparkle:0 };
function balloon(g, p, color, r){
  const b=mesh(new THREE.SphereGeometry(r,16,12), std(color,{roughness:.35}), g, 'fabric');
  b.scale.set(1,1.18,1); b.position.copy(p); return b;
}
function stringTo(g, top, color){
  const len=top.y-.02, s=mesh(new THREE.CylinderGeometry(.004,.004,len,4), std(color), g, 'fabric', {noOutline:true});
  s.position.set(top.x, len/2, top.z); return s;
}
function buildTheme(){
  if(themeGroup){ scene.remove(themeGroup); themeGroup.traverse(o=>{ if(o.isMesh){ o.geometry.dispose(); } }); }
  anim.rings=null; anim.flames=[]; anim.mobile=null; anim.balloons=[];
  const th=T(), g=new THREE.Group(); themeGroup=g; scene.add(g);
  const c=CENTRE;
  if(cfg.theme==='wedding'){
    /* rings on a velvet cushion inside a proper glass case */
    mesh(new THREE.BoxGeometry(1.3,1.05,1.3), plinthMat, g, 'stone').position.set(c.x,.525,c.z);
    mesh(new THREE.BoxGeometry(.56,.13,.42), std(0x6d1f2a,{roughness:1}), g, 'fabric').position.set(c.x,1.115,c.z);
    const gold=std(0xd9b45a,{metalness:.55,roughness:.3,emissive:0x3a2808});
    const rg=new THREE.Group(); rg.position.set(c.x,1.18+.2,c.z); g.add(rg);
    const r1=mesh(new THREE.TorusGeometry(.2,.032,16,48), gold, rg, 'metal'); r1.position.x=-.09; r1.rotation.y=.35;
    const r2=mesh(new THREE.TorusGeometry(.17,.028,16,48), gold, rg, 'metal'); r2.position.x=.11; r2.rotation.y=-.45;
    const gem=mesh(new THREE.OctahedronGeometry(.045,0), std(0xf4f8ff,{roughness:.1}), rg, 'glass'); gem.position.set(-.09,.235,0);
    anim.rings=rg;
    const brass=std(0xb08d4a,{metalness:.5,roughness:.35});
    for(const sx of [-1,1]) for(const sz of [-1,1]) mesh(new THREE.BoxGeometry(.03,.9,.03), brass, g, 'metal').position.set(c.x+sx*.58,1.5,c.z+sz*.58);
    for(const s of [-1,1]){
      mesh(new THREE.BoxGeometry(1.19,.03,.03), brass, g, 'metal').position.set(c.x,1.95,c.z+s*.58);
      mesh(new THREE.BoxGeometry(.03,.03,1.19), brass, g, 'metal').position.set(c.x+s*.58,1.95,c.z);
      mesh(new THREE.BoxGeometry(1.19,.03,.03), brass, g, 'metal').position.set(c.x,1.065,c.z+s*.58);
      mesh(new THREE.BoxGeometry(.03,.03,1.19), brass, g, 'metal').position.set(c.x+s*.58,1.065,c.z);
    }
    const glass=mesh(new THREE.BoxGeometry(1.15,.88,1.15), std(0xdfeeee,{transparent:true,opacity:.14,depthWrite:false,roughness:.1}), g, 'glass'); glass.position.set(c.x,1.5,c.z); glass.renderOrder=4;
    mesh(new THREE.BoxGeometry(1.19,.02,1.19), std(0xdfeeee,{transparent:true,opacity:.12,depthWrite:false}), g, 'glass').position.set(c.x,1.95,c.z);
  } else if(cfg.theme==='birthday'){
    /* a round table with a three-tier cake and candles you can blow out */
    const cloth=std(0xf8f1ea,{roughness:.95});
    mesh(new THREE.CylinderGeometry(.62,.66,.82,32), cloth, g, 'fabric').position.set(c.x,.41,c.z);
    const tiers=[[.34,.22,0xf6d7dc],[.26,.2,0xfdf3e8],[.18,.18,0xf3b9c4]];
    let y=.82;
    tiers.forEach(([r,h,col])=>{
      mesh(new THREE.CylinderGeometry(r,r,h,28), std(col,{roughness:.8}), g, 'fabric').position.set(c.x,y+h/2,c.z);
      const drip=mesh(new THREE.TorusGeometry(r,.025,8,32), std(0xfffaf4), g, 'fabric', {noOutline:true}); drip.rotation.x=Math.PI/2; drip.position.set(c.x,y+h,c.z);
      y+=h;
    });
    const top=y;
    const n=5;
    for(let i=0;i<n;i++){
      const a=i/n*Math.PI*2, cx=c.x+Math.cos(a)*.1, cz=c.z+Math.sin(a)*.1;
      mesh(new THREE.CylinderGeometry(.012,.012,.12,8), std(th.deco[i%4]), g, 'fabric', {noOutline:true}).position.set(cx,top+.06,cz);
      const fl=mesh(new THREE.SphereGeometry(.022,8,6), new THREE.MeshBasicMaterial({color:0xffc66a}), g, 'emissive', {noOutline:true, flame:true});
      fl.scale.set(1,1.7,1); fl.position.set(cx,top+.15,cz); anim.flames.push(fl);
    }
    /* age topper */
    const tc=cv(256,128), tx=tc.getContext('2d'); tx.fillStyle='#fffaf2'; rr(tx,8,8,240,112,20); tx.fill(); tx.fillStyle=th.ink; tx.font='600 76px Jost, sans-serif'; tx.textAlign='center'; tx.textBaseline='middle'; tx.fillText(String(cfg.age||''),128,68);
    const tp=mesh(new THREE.PlaneGeometry(.22,.11), new THREE.MeshBasicMaterial({map:makeTex(tc), side:THREE.DoubleSide}), g, 'canvas', {noOutline:true}); tp.position.set(c.x,top+.3,c.z);
    mesh(new THREE.CylinderGeometry(.004,.004,.2,4), std(0xd9b45a), g, 'metal', {noOutline:true}).position.set(c.x,top+.15,c.z);
    anim.topper=tp;
  } else {
    /* a wooden crib with a teddy and a mobile that turns */
    const wood=std(0xe8d6b8,{roughness:.7});
    const cw=1.25, cd=.72, ch=.95;
    mesh(new THREE.BoxGeometry(cw,.06,cd), wood, g, 'wood').position.set(c.x,.38,c.z);
    mesh(new THREE.BoxGeometry(cw-.06,.12,cd-.06), std(0xf6f3ee,{roughness:1}), g, 'fabric').position.set(c.x,.47,c.z);
    for(const sx of [-1,1]) for(const sz of [-1,1]) mesh(new THREE.BoxGeometry(.06,ch,.06), wood, g, 'wood').position.set(c.x+sx*cw/2,ch/2,c.z+sz*cd/2);
    for(const sz of [-1,1]) mesh(new THREE.BoxGeometry(cw,.05,.05), wood, g, 'wood').position.set(c.x,ch-.03,c.z+sz*cd/2);
    for(const sx of [-1,1]) mesh(new THREE.BoxGeometry(.05,.05,cd), wood, g, 'wood').position.set(c.x+sx*cw/2,ch-.03,c.z);
    for(const sz of [-1,1]) for(let i=1;i<9;i++) mesh(new THREE.CylinderGeometry(.012,.012,ch-.45,6), wood, g, 'wood', {noOutline:true}).position.set(c.x-cw/2+i*cw/9,.42+(ch-.45)/2,c.z+sz*cd/2);
    mesh(new THREE.BoxGeometry(.5,.05,.5), std(th.deco[0],{roughness:1}), g, 'fabric').position.set(c.x+.25,.55,c.z);
    /* teddy */
    const fur=std(0xc9a37a,{roughness:1});
    const tg=new THREE.Group(); tg.position.set(c.x-.3,.53,c.z); g.add(tg);
    mesh(new THREE.SphereGeometry(.1,14,10), fur, tg, 'fabric').position.y=.1;
    mesh(new THREE.SphereGeometry(.075,14,10), fur, tg, 'fabric').position.y=.24;
    for(const s of [-1,1]){ mesh(new THREE.SphereGeometry(.028,8,6), fur, tg, 'fabric').position.set(s*.055,.3,0); mesh(new THREE.SphereGeometry(.035,8,6), fur, tg, 'fabric').position.set(s*.08,.05,.06); }
    mesh(new THREE.SphereGeometry(.03,8,6), std(0xe8d0b0), tg, 'fabric').position.set(0,.225,.065);
    tg.rotation.y=.4;
    /* mobile */
    const pole=mesh(new THREE.CylinderGeometry(.015,.015,1.1,8), wood, g, 'wood'); pole.position.set(c.x+cw/2-.04,ch+.5,c.z);
    const arm=mesh(new THREE.CylinderGeometry(.012,.012,.6,8), wood, g, 'wood'); arm.rotation.z=Math.PI/2; arm.position.set(c.x+cw/2-.34,ch+1.04,c.z);
    const mob=new THREE.Group(); mob.position.set(c.x+cw/2-.64,ch+1.02,c.z); g.add(mob);
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2, px=Math.cos(a)*.18, pz=Math.sin(a)*.18, drop=.18+.06*(i%2);
      mesh(new THREE.CylinderGeometry(.002,.002,drop,3), std(0xbbbbbb), mob, 'fabric', {noOutline:true}).position.set(px,-drop/2,pz);
      const shape=i%2 ? mesh(new THREE.OctahedronGeometry(.045,0), std(th.deco[i%4]), mob, 'fabric') : mesh(new THREE.SphereGeometry(.04,10,8), std(th.deco[i%4]), mob, 'fabric');
      shape.position.set(px,-drop-.04,pz);
    }
    anim.mobile=mob;
  }
  /* arch decoration */
  const items={};
  if(cfg.theme==='wedding'){
    const cols=[0xfdfaf4,0xf6dfe0,0xf1c9cf,0x6f8a5e];
    for(let i=0;i<220;i++){
      const p=archPath(Math.random()); const k=i%7===0?3:i%3;
      p.x+=(Math.random()-.5)*.14; p.y+=(Math.random()-.5)*.12; p.z+=(Math.random()-.5)*.16;
      (items[cols[k]] ||= []).push({p, r:k===3?.05:.06+Math.random()*.035});
    }
  } else {
    th.deco.forEach(col=>{ items[col]=[]; });
    for(let i=0;i<70;i++){
      const p=archPath(i/69); const col=th.deco[i%4];
      p.z+=(Math.random()-.5)*.1;
      items[col].push({p, r:.12+Math.random()*.035, sy:1.15});
    }
  }
  const ag=new THREE.Group(); ag.position.copy(ARCH); g.add(ag);
  for(const col in items) mesh(mergeSpheres(items[col], 10), std(isNaN(col)?col:+col,{roughness:.5}), ag, 'fabric', {noOutline:true});
  /* corner decorations: flower urns for a wedding, balloon bunches otherwise */
  CORNERS.forEach((p,ci)=>{
    if(cfg.theme==='wedding'){
      const urn=mesh(new THREE.LatheGeometry([[0,0],[.22,0],[.16,.1],[.18,.55],[.3,.95],[.28,1.0]].map(([x,y])=>new THREE.Vector2(x,y)),24), plinthMat, g, 'stone'); urn.position.copy(p);
      const fl=[];
      for(let i=0;i<40;i++){ const a=Math.random()*Math.PI*2, r=Math.random()*.35; fl.push({p:new V3(p.x+Math.cos(a)*r, 1.05+Math.random()*.45-r*.5, p.z+Math.sin(a)*r), r:.07+Math.random()*.04}); }
      mesh(mergeSpheres(fl,8), std(ci?0xf6dfe0:0xfdfaf4,{roughness:.9}), g, 'fabric', {noOutline:true});
    } else {
      const bg=new THREE.Group(); bg.position.copy(p); g.add(bg);
      for(let i=0;i<7;i++){
        const a=i/7*Math.PI*2, r=i?.28:0, top=new V3(Math.cos(a)*r, 2.2+((i*37)%5)*.15, Math.sin(a)*r);
        balloon(bg, top, th.deco[i%4], .19); stringTo(bg, new V3(top.x*.3, top.y-.22, top.z*.3), 0xdddddd);
      }
      mesh(new THREE.CylinderGeometry(.06,.07,.08,10), std(0xd9b45a,{metalness:.4}), bg, 'metal').position.y=.04;
      anim.balloons.push(bg);
    }
  });
  /* balloons tied to the arch posts for birthdays and baby showers */
  if(cfg.theme!=='wedding'){
    [-1,1].forEach(s=>{
      const bg=new THREE.Group(); bg.position.set(ARCH.x+s*(ARCH_R+.35),0,ARCH.z); g.add(bg);
      for(let i=0;i<3;i++){ const top=new V3((i-1)*.2, 1.9+i*.18, 0); balloon(bg, top, th.deco[(i+(s>0?2:0))%4], .17); stringTo(bg, new V3(top.x*.3, top.y-.2, 0), 0xdddddd); }
      anim.balloons.push(bg);
    });
  }
  if(painted) toonify(g);
  drawRug();
  if(petals) { petals.material.uniforms.uPal.value.forEach((v,i)=>v.set(th.petals[i])); petals.material.uniforms.uShape.value=th.shape; }
}
/* corner + arch-side collisions are fixed regardless of celebration */
CORNERS.forEach(p=>circles.push([p.x,p.z,.45]));

/* ---------- drifting petals / confetti / bubbles around the centrepiece ---------- */
let petals=null;
(function(){
  const N = matchMedia('(pointer: coarse)').matches ? 220 : 420;
  const plane=new THREE.PlaneGeometry(1,1), g=new THREE.InstancedBufferGeometry();
  g.index=plane.index; g.setAttribute('position',plane.attributes.position); g.setAttribute('uv',plane.attributes.uv);
  const seeds=new Float32Array(N*4); for(let i=0;i<N*4;i++) seeds[i]=Math.random();
  g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds,4)); g.instanceCount=N;
  const mat=new THREE.ShaderMaterial({
    glslVersion:THREE.GLSL3, transparent:true, depthWrite:false,
    uniforms:{ uTime:{value:0}, uCenter:{value:CENTRE.clone()}, uPal:{value:[0,1,2,3].map(()=>new THREE.Color())}, uBurst:{value:0}, uShape:{value:0} },
    vertexShader:`attribute vec4 aSeed; uniform float uTime; uniform vec3 uCenter; uniform vec3 uPal[4]; uniform float uBurst;
      varying vec2 vUv; varying vec3 vCol; varying float vFade;
      void main(){
        float top = 3.4;
        float speed = 0.16 + aSeed.y * 0.14 + uBurst * 0.5;
        float y = top - fract(aSeed.w + uTime * speed / top) * top;
        float ang = aSeed.x * 6.2832 + uTime * 0.15 * (aSeed.z - 0.5);
        float rad = 0.4 + aSeed.y * (3.0 + uBurst * 1.5);
        vec3 p = uCenter + vec3(cos(ang) * rad + sin(uTime * 0.7 + aSeed.z * 20.0) * 0.25, y, sin(ang) * rad + cos(uTime * 0.6 + aSeed.x * 17.0) * 0.25);
        vec4 mv = viewMatrix * vec4(p, 1.0);
        float rot = uTime * (0.8 + aSeed.z * 2.0) + aSeed.x * 10.0;
        float s = 0.05 + aSeed.z * 0.04;
        vec2 q = position.xy * vec2(s, s * (0.55 + 0.45 * abs(cos(rot * 0.7))));
        mv.xy += vec2(q.x * cos(rot) - q.y * sin(rot), q.x * sin(rot) + q.y * cos(rot));
        float keep = step(aSeed.w, 0.55 + uBurst * 0.45);
        vFade = keep * smoothstep(0.0, 0.4, y) * smoothstep(top, top - 0.6, y);
        vCol = uPal[int(aSeed.z * 3.99)];
        vUv = uv;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader:`layout(location = 0) out highp vec4 outColor; layout(location = 1) out highp vec4 outData;
      uniform float uShape; varying vec2 vUv; varying vec3 vCol; varying float vFade;
      void main(){
        vec2 c = vUv - 0.5; float a;
        if (uShape < 0.5) { float d = length(vec2(c.x, c.y * 1.5)) * 2.0; a = smoothstep(1.0, 0.8, d); }
        else if (uShape < 1.5) { a = step(abs(c.x), 0.45) * step(abs(c.y), 0.28); }
        else { float d = length(c) * 2.0; a = smoothstep(1.0, 0.9, d) * (0.2 + 0.7 * smoothstep(0.7, 0.95, d)); }
        a *= vFade;
        if (a < 0.02) discard;
        outColor = vec4(vCol * 0.95, a);
        outData = vec4(0.0);
      }`
  });
  petals=new THREE.Mesh(g, mat); petals.frustumCulled=false; petals.renderOrder=7; petals.userData.noOutline=true; scene.add(petals);
})();

/* ---------- music box (synthesised, original tune) ---------- */
const music={ctx:null, on:false, next:0, step:0, timer:null, master:null};
const NOTE = n => 440*Math.pow(2,(n-69)/12);
const TUNE = [76,79,84,79, 86,84,81,79, 76,79,81,84, 86,88,86,84, 81,84,88,84, 86,84,79,76, 77,81,84,81, 79,76,74,72];
const BASS = [48,45,41,43, 48,45,43,43];
function ensureAudio(){
  if(music.ctx) return music.ctx;
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
  const ctx=new AC(); music.ctx=ctx;
  const master=ctx.createGain(); master.gain.value=.16;
  const delay=ctx.createDelay(); delay.delayTime.value=.31;
  const fb=ctx.createGain(); fb.gain.value=.32;
  const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2600;
  master.connect(ctx.destination); master.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(ctx.destination);
  music.master=master; return ctx;
}
function pluck(freq, t, vel=.5, dur=1.8){
  const ctx=music.ctx; if(!ctx) return;
  const g=ctx.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vel,t+.006); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  const o1=ctx.createOscillator(); o1.type='sine'; o1.frequency.value=freq;
  const o2=ctx.createOscillator(); o2.type='sine'; o2.frequency.value=freq*3.01;
  const g2=ctx.createGain(); g2.gain.value=.12;
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(music.master);
  o1.start(t); o2.start(t); o1.stop(t+dur+.05); o2.stop(t+dur+.05);
}
function scheduleMusic(){
  const ctx=music.ctx, beat=T().tempo;
  while(music.next < ctx.currentTime + .5){
    const n=TUNE[music.step % TUNE.length];
    pluck(NOTE(n), music.next, .42);
    if(music.step % 4 === 0) pluck(NOTE(BASS[(music.step/4|0) % BASS.length]), music.next, .3, 2.6);
    music.next += beat; music.step++;
  }
}
function setMusic(on){
  if(on){
    const ctx=ensureAudio(); if(!ctx) return;
    ctx.resume(); music.on=true; music.next=ctx.currentTime+.08;
    clearInterval(music.timer); music.timer=setInterval(scheduleMusic,100); scheduleMusic();
  } else { music.on=false; clearInterval(music.timer); }
  const b=$('b-music'); b.firstChild.textContent = music.on ? 'Music on ' : 'Music off '; b.setAttribute('aria-pressed', String(music.on));
}
function chime(){
  const ctx=ensureAudio(); if(!ctx) return; ctx.resume();
  const t=ctx.currentTime+.02; [84,88,91,96].forEach((n,i)=>pluck(NOTE(n), t+i*.09, .35, 1.4));
}

/* ---------- centrepiece actions ---------- */
function centreAction(){
  chime();
  anim.sparkle=1;
  if(cfg.theme==='birthday'){ anim.candlesOut=4.5; }
  if(cfg.theme==='baby'){ anim.mobileSpin=6; }
}

/* ---------- people (character system: src/characters) ---------- */
const lerp=(a,b,k)=>a+(b-a)*k;
function lerpAngle(a,b,k){ let d=((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI; return a+d*k; }
function stepMove(a,dx,dz){
  const r=.3;
  if(!collide(a.x+dx,a.z,r,a)) a.x+=dx;
  if(!collide(a.x,a.z+dz,r,a)) a.z+=dz;
}
const exhibits=frameDefs.map(d=>wallXform(d.wall,d.u,1.8,0).p).concat([new V3(0,2.4,-hz), new V3(CENTRE.x,1.3,CENTRE.z), new V3(hx,2.2,0), new V3(ARCH.x,1.6,ARCH.z), new V3(BOARD.x,1.5,BOARD.z)]);
Characters.setWorld({ scene, collide, exhibits, onBodyChanged:root=>{ if(painted) toonify(root); } });
const kindOf = style => style==='long' ? 'girl' : 'boy';
const tintOf = hex => new THREE.Color(hex).lerp(new THREE.Color(0xffffff), .3);
/* the demo characters keep their own outfits unless you pick a different colour in Personalize */
const outfitOf = (hex, def) => hex && hex.toLowerCase() !== def ? hex : null;
/* who is in the museum: a birthday has one person; a baby shower has a mother- and father-to-be */
const solo = () => cfg.theme==='birthday';
const opp = st => st==='long' ? 'suit' : 'long';
const isMum = i => cfg.theme==='baby' && cfg['style'+i]==='long';
function personOpts(i){ const c=cfg['color'+i]; return {kind:kindOf(cfg['style'+i]), topColor:c, clothTint:tintOf(c), outfitTop:outfitOf(c, DEFAULT['color'+i]), bump:isMum(i)}; }
const personKey = i => cfg['style'+i]+cfg['color'+i]+(isMum(i)?'b':'');
const player=new Characters.Character(Object.assign(personOpts(1), {name:cfg.name1, showTag:false, controlled:true, x:0, z:8.8, heading:Math.PI}));
const partner=new Characters.Character(Object.assign(personOpts(2), {name:cfg.name2, showTag:false, x:-.8, z:9.3, heading:Math.PI}));
player.cfgKey=personKey(1); partner.cfgKey=personKey(2);
player.partner=partner; partner.partner=player;
function applySolo(){
  const s=solo(), was=!partner.root.visible;
  partner.root.visible=!s; partner.shadow.visible=!s;
  player.partner = s ? null : partner; partner.partner = s ? null : player;
  if(s){ partner.mode='walk'; partner.hold=null; player.hold=null; }
  else if(was){ partner.x=partner.tx=player.x-.7; partner.z=partner.tz=player.z; partner.heading=player.heading; }
}
partner.maxSpeed=2.2;
/* name tags as HTML so the text stays sharp under the painted filter */
const tagEls=[player,partner].map(()=>{ const d=document.createElement('div'); d.className='ntag'; root.appendChild(d); return d; });
/* visitor couples walking the gallery route (fewer on phones) */
const visitorCount = matchMedia('(pointer: coarse)').matches ? 1 : 2;
const visitors=[];
for(let i=0;i<visitorCount;i++) visitors.push(Characters.addCouple(Characters.GALLERY_ROUTE, 6 + i*44, {variant:i+1, holdHands:i===1, label:'Couple '+(i+1)}));

/* ---------- input ---------- */
const isCoarse = matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 840;
if(isCoarse) root.classList.add('coarse');
const keys={};
const joy={x:0,y:0};
const cam={yaw:0,pitch:.3,dist:4.4,tx:0,ty:1.3,tz:8.8,yawGoal:null};
const OVERLAYS=['intro','invite','lightbox','sheet','wishbox','photo'];
function anyOverlay(){ return OVERLAYS.some(id=>!$(id).hidden); }
on(window,'keydown',e=>{
  const tg=e.target.tagName;
  if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA') return;
  if(e.key==='Escape'){ closeAll(); return; }
  if(anyOverlay()) return;
  keys[e.key.toLowerCase()]=true;
  if(e.key==='f'||e.key==='F'){ doAction(); }
  if(e.key==='g'||e.key==='G'){ toggleDance(); }
  if(e.key==='p'||e.key==='P'){ setLook(!painted); }
  if(e.key==='t'||e.key==='T'){ nextTime(); }
  if(e.key==='m'||e.key==='M'){ setMusic(!music.on); }
  if(e.key==='k'||e.key==='K'){ setDebug(Characters.toggleDebug()); }
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault();
});
on(window,'keyup',e=>{ keys[e.key.toLowerCase()]=false; });
on(window,'blur',()=>{ for(const k in keys) keys[k]=false; });

let drag=null;
const pointers = new Map();
let prevPinchDist = null;
canvas.addEventListener('pointerdown',e=>{
  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
  canvas.setPointerCapture(e.pointerId);
  if(pointers.size === 1) {
    drag = {id:e.pointerId, x:e.clientX, y:e.clientY};
  } else if(pointers.size === 2) {
    drag = null;
    const pts = Array.from(pointers.values());
    prevPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }
});
canvas.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
  if(pointers.size === 2 && prevPinchDist) {
    const pts = Array.from(pointers.values());
    const curDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    const delta = prevPinchDist - curDist;
    cam.dist = Math.max(2.2, Math.min(7, cam.dist + delta * 0.012));
    prevPinchDist = curDist;
    return;
  }
  if(drag && drag.id === e.pointerId) {
    const dx=e.clientX-drag.x, dy=e.clientY-drag.y; drag.x=e.clientX; drag.y=e.clientY;
    cam.yaw-=dx*.006; cam.pitch=Math.max(.04,Math.min(1.1,cam.pitch+dy*.004)); cam.yawGoal=null;
  }
});
const endDrag=e=>{
  pointers.delete(e.pointerId);
  if(pointers.size < 2) prevPinchDist = null;
  if(drag && drag.id === e.pointerId) {
    drag = null;
    if(pointers.size === 1) {
      const [remId, pt] = pointers.entries().next().value;
      drag = { id: remId, x: pt.x, y: pt.y };
    }
  }
};
canvas.addEventListener('pointerup',endDrag); canvas.addEventListener('pointercancel',endDrag);
canvas.addEventListener('wheel',e=>{ cam.dist=Math.max(2.2,Math.min(7,cam.dist+e.deltaY*.004)); e.preventDefault(); },{passive:false});

const joyEl=$('joy'), knob=$('knob');
let joyId=null;
function joyMove(e){
  const r=joyEl.getBoundingClientRect(); let dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
  const R=46, l=Math.hypot(dx,dy); if(l>R){ dx*=R/l; dy*=R/l; }
  knob.style.transform=`translate(${dx}px,${dy}px)`; joy.x=dx/R; joy.y=-dy/R;
}
joyEl.addEventListener('pointerdown',e=>{ joyId=e.pointerId; joyEl.setPointerCapture(e.pointerId); joyMove(e); e.preventDefault(); });
joyEl.addEventListener('pointermove',e=>{ if(e.pointerId===joyId) joyMove(e); });
const joyEnd=e=>{ if(e.pointerId!==joyId) return; joyId=null; joy.x=joy.y=0; knob.style.transform=''; };
joyEl.addEventListener('pointerup',joyEnd); joyEl.addEventListener('pointercancel',joyEnd);

/* ---------- actions ---------- */
const actionBtn=$('action');
let current=null;
let posing=null, captureNext=false;
function doAction(){ if(player.mode==='sit') stand(); else if(posing) endPose(); else if(current) current.act(); }
actionBtn.addEventListener('click',doAction);
$('b-dance').addEventListener('click',toggleDance);
$('b-music').addEventListener('click',()=>setMusic(!music.on));
function toggleDance(){
  if(player.mode==='sit') stand();
  if(posing) endPose();
  const on=player.mode!=='dance';
  player.mode=on?'dance':'walk';
  const near=!solo() && Math.hypot(partner.x-player.x,partner.z-player.z)<3.5;
  partner.mode=(on&&near)?'dance':'walk'; partner.tx=partner.x; partner.tz=partner.z;
}
function sit(){
  if(solo()){ player.mode='sit'; player.x=BENCH_X; player.z=0; player.heading=Math.PI/2; cam.yawGoal=-Math.PI/2; cam.pitch=.22; return; }
  player.mode='sit'; partner.mode='sit';
  /* facing the screen (+x) your left is -z, so the partner sits there */
  player.x=partner.tx=BENCH_X; player.z=.27; partner.x=BENCH_X; partner.z=partner.tz=-.27;
  /* sitting close and holding hands: your left hand, their right */
  player.hold={with:partner, side:'left'}; partner.hold={with:player, side:'right'};
  player.heading=partner.heading=Math.PI/2;
  cam.yawGoal=-Math.PI/2; cam.pitch=.22;
}
function stand(){
  player.mode='walk'; partner.mode='walk';
  player.hold=null; partner.hold=null;
  player.x=BENCH_X-.75; partner.x=partner.tx=BENCH_X-.75; partner.tz=partner.z;
}
/* photo spot: stand under the arch, face the camera, snap */
function posePhoto(){
  if(player.mode==='dance'){ player.mode='walk'; partner.mode='walk'; }
  const h=Math.PI; /* facing -z, towards the room */
  /* facing -z your left is -x */
  if(solo()){ player.x=ARCH.x; player.z=ARCH.z-.15; player.heading=h; posing={t:0, shot:false}; cam.yawGoal=Math.PI; cam.pitch=.1; return; }
  player.x=ARCH.x+.3; player.z=ARCH.z-.15; player.heading=h;
  partner.x=partner.tx=ARCH.x-.3; partner.z=partner.tz=ARCH.z-.15; partner.heading=h; partner.faceHeading=h;
  player.hold={with:partner, side:'left'}; partner.hold={with:player, side:'right'};
  posing={t:0, shot:false};
  cam.yawGoal=Math.PI; cam.pitch=.1;
}
function endPose(){ posing=null; player.hold=null; partner.hold=null; }

/* ---------- overlays ---------- */
const introEl=$('intro'), inviteEl=$('invite'), lbEl=$('lightbox'), sheetEl=$('sheet');
const wishEl=$('wishbox'), photoEl=$('photo');
function titleHTML(){
  if(cfg.theme==='wedding') return `${esc(cfg.name1)}<em>&amp;</em>${esc(cfg.name2)}`;
  return esc(titleOf());
}
function cardHTML(mode){
  const c=countdown(cfg.date), th=T(), sub=subOf();
  const actions = mode==='intro'
    ? `<button class="pbtn" id="enter" type="button">Enter the museum</button><button class="tbtn" data-edit type="button">${esc(th.edit)}</button>`
    : `<button class="pbtn" id="copy" type="button">Copy details</button><button class="tbtn" data-close type="button">Back to the museum</button>`;
  return `<div class="card" role="dialog" aria-label="${esc(th.aria)}">
    <p class="host">${esc(cfg.host)}</p>
    <h1>${titleHTML()}</h1>
    ${sub?`<p class="sub">${esc(sub)}</p>`:''}
    <p class="line">${esc(cfg.line)}</p>
    <div class="rule"><i></i></div>
    <p class="date">${esc(fmtDate(cfg.date))}</p>
    <p class="time">${esc(fmtTime(cfg.time))}</p>
    <p class="venue">${esc(cfg.venue)}</p>
    <p class="city">${esc(cfg.city)}</p>
    ${c?`<span class="count">${esc(c)}</span>`:''}
    ${cfg.rsvp?`<p class="rsvp">${esc(cfg.rsvp)}</p>`:''}
    <div class="actions">${actions}</div>
    ${mode==='intro'?`<p class="note">${isCoarse?'Use the joystick to walk and drag to look around.':'Walk with WASD, drag to look around.'}</p>`:''}
  </div>`;
}
function renderIntro(){ introEl.innerHTML=cardHTML('intro'); }
function openInvite(){ inviteEl.innerHTML=cardHTML('invite'); inviteEl.hidden=false; }
function inviteText(){ return [cfg.host, titleOf(), subOf(), cfg.line, `${fmtDate(cfg.date)} at ${fmtTime(cfg.time)}`, `${cfg.venue}, ${cfg.city}`, cfg.rsvp].filter(Boolean).join('\n'); }
on(document,'click',e=>{
  const t=e.target.closest('button'); if(!t) return;
  if(t.id==='enter'){ introEl.hidden=true; canvas.focus(); }
  else if(t.hasAttribute('data-edit')){ introEl.hidden=true; openSheet(); }
  else if(t.hasAttribute('data-close')){ closeAll(); }
  else if(t.id==='copy'){
    const done=()=>{ t.textContent='Copied'; setTimeout(()=>{ t.textContent='Copy details'; },1600); };
    try{ navigator.clipboard.writeText(inviteText()).then(done,()=>{ t.textContent='Copy not allowed here'; }); }catch(_){ t.textContent='Copy not allowed here'; }
  }
});
introEl.addEventListener('click',e=>{ if(e.target===introEl){ introEl.hidden=true; } });
inviteEl.addEventListener('click',e=>{ if(e.target===inviteEl) closeAll(); });
lbEl.addEventListener('click',e=>{ if(e.target===lbEl) closeAll(); });
wishEl.addEventListener('click',e=>{ if(e.target===wishEl) closeAll(); });
photoEl.addEventListener('click',e=>{ if(e.target===photoEl) closeAll(); });
function closeAll(){ OVERLAYS.forEach(id=>{ $(id).hidden=true; }); canvas.focus(); }
$('b-invite').addEventListener('click',openInvite);
$('b-back').addEventListener('click',()=>{ if(onExit) onExit(); });
/* phone menu: the top buttons fold into one Menu button on narrow screens */
const menuBtn=$('b-menu'), menuEl=$('hud-btns');
function setMenu(open){ menuEl.classList.toggle('open',open); menuBtn.setAttribute('aria-expanded',String(open)); menuBtn.textContent=open?'Close':'Menu'; }
menuBtn.addEventListener('click',()=>setMenu(!menuEl.classList.contains('open')));
menuEl.addEventListener('click',e=>{ if(e.target.closest('#b-invite,#b-edit,#b-back')) setMenu(false); });
canvas.addEventListener('pointerdown',()=>setMenu(false));
$('b-edit').addEventListener('click',openSheet);

let lbIndex=0;
function openLightbox(i){
  lbIndex=(i+PHOTO_COUNT)%PHOTO_COUNT;
  const img=$('lb-img');
  if(ready(lbIndex)) img.src=imgs[lbIndex].src; else img.src=frames[lbIndex].pc.toDataURL('image/jpeg',.9);
  img.alt=cfg.photos[lbIndex].caption||'';
  $('lb-cap').textContent=cfg.photos[lbIndex].caption||'';
  $('lb-num').textContent=`Nº ${String(lbIndex+1).padStart(2,'0')} of ${String(PHOTO_COUNT).padStart(2,'0')}`;
  lbEl.hidden=false;
}
$('lb-prev').addEventListener('click',()=>openLightbox(lbIndex-1));
$('lb-next').addEventListener('click',()=>openLightbox(lbIndex+1));
$('lb-close').addEventListener('click',closeAll);

/* wishes */
function openWish(){
  wishEl.innerHTML=`<form class="card wish" id="wish-form" aria-label="Write a wish">
    <p class="host">${esc(T().board)}</p>
    <h2 class="wtitle">Write a wish</h2>
    <div class="f"><label for="w-name">Your name</label><input id="w-name" maxlength="30" required autocomplete="name"></div>
    <div class="f"><label for="w-text">Your wish</label><textarea id="w-text" maxlength="160" rows="4" required></textarea></div>
    <p class="note">Wishes are saved in this browser and appear on the board.</p>
    <div class="actions"><button class="pbtn" type="submit">Add to the board</button><button class="tbtn" type="button" data-close>Back to the museum</button></div>
  </form>`;
  wishEl.hidden=false;
  setTimeout(()=>{ const n=$('w-name'); if(n && !isCoarse) n.focus(); },50);
}
wishEl.addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('w-name').value.trim(), text=$('w-text').value.trim();
  if(!name||!text) return;
  wishes=wishes.filter(w=>!w.example); wishes.unshift({name,text});
  try{ localStorage.setItem(WISH_STORE, JSON.stringify(wishes.slice(0,30))); }catch(_){}
  drawWishes(); closeAll(); chime();
});

/* photo booth result */
function showPhoto(url){
  photoEl.innerHTML=`<div class="polaroid">
    <img src="${url}" alt="Photo of ${esc(titleOf())} at the arch">
    <p class="pcap">${esc(titleOf())}</p>
    <p class="pdate">${esc(fmtDate(cfg.date))}</p>
  </div>
  <p class="phint">${isCoarse?'Press and hold the photo to save it.':'Right-click the photo to save it.'}</p>
  <div class="row"><button class="gbtn" type="button" id="p-again">Take another</button><button class="gbtn" type="button" data-close>Back to the museum</button></div>`;
  photoEl.hidden=false;
  $('p-again').addEventListener('click',()=>{ closeAll(); posePhoto(); });
}

/* ---------- personalize sheet ---------- */
function field(id,label,val,type='text'){ return `<div class="f"><label for="f-${id}">${label}</label><input id="f-${id}" data-k="${id}" type="${type}" value="${esc(val)}"></div>`; }
function styleSel(id,label,val){ return `<div class="f"><label for="f-${id}">${label}</label><select id="f-${id}" data-k="${id}"><option value="suit"${val==='suit'?' selected':''}>Young man</option><option value="long"${val==='long'?' selected':''}>Young woman</option></select></div>`; }
function selectField(id,label,val,opts){ return `<div class="f"><label for="f-${id}">${label}</label><select id="f-${id}" data-k="${id}">${opts.map(([v,t])=>`<option value="${v}"${val===v?' selected':''}>${t}</option>`).join('')}</select></div>`; }
function peopleFields(){
  if(cfg.theme==='birthday') return `
    <div class="two">${field('name1','Birthday star (you walk as them)',cfg.name1)}${selectField('style1','Birthday person',cfg.style1,[['suit','Boy'],['long','Girl']])}</div>
    ${field('color1','Outfit colour',cfg.color1,'color')}`;
  if(cfg.theme==='baby'){
    const me=cfg.style1==='long'?'Mother-to-be':'Father-to-be', them=cfg.style1==='long'?'Father-to-be':'Mother-to-be';
    return `
    ${selectField('style1','You walk as',cfg.style1,[['long','Mother-to-be'],['suit','Father-to-be']])}
    <div class="two">${field('name1',me+' (you)',cfg.name1)}${field('name2',them,cfg.name2)}</div>
    <div class="two">${field('color1','Your outfit',cfg.color1,'color')}${field('color2',them+' outfit',cfg.color2,'color')}</div>`;
  }
  return `
    <div class="two">${field('name1','You (you walk as this avatar)',cfg.name1)}${field('name2','Your partner',cfg.name2)}</div>
    <div class="two">${styleSel('style1','Your avatar',cfg.style1)}${styleSel('style2','Partner avatar',cfg.style2)}</div>
    <div class="two">${field('color1','Your outfit',cfg.color1,'color')}${field('color2','Partner outfit',cfg.color2,'color')}</div>`;
}
function renderSheet(){
  const th=T();
  sheetEl.innerHTML=`
  <div class="sh-head"><h2>Personalize</h2><button class="gbtn" id="sh-done" type="button">Done</button></div>
  <p class="sh-sub">The museum opens with an example. Change anything below and it updates as you type. Changes are saved in this browser.</p>
  <fieldset><legend>Celebration</legend>
    <div class="f"><label for="f-theme">What are you celebrating?</label><select id="f-theme">
      ${Object.entries(THEMES).map(([k,v])=>`<option value="${k}"${cfg.theme===k?' selected':''}>${esc(v.label)}</option>`).join('')}
    </select></div>
    ${cfg.theme==='birthday'?field('age','Turning (age)',cfg.age,'number'):''}
    <p class="sh-sub" style="margin:0">Switching resets the invitation wording, the bench message and the photo captions to that celebration's examples. Your names, date, venue and photos stay.</p>
  </fieldset>
  <fieldset><legend>People</legend>
    ${peopleFields()}
    ${field('message','Message on the bench',cfg.message)}
  </fieldset>
  <fieldset><legend>${esc(th.aria)}</legend>
    ${field('host','Opening line',cfg.host)}
    ${field('line','Invitation line',cfg.line)}
    <div class="two">${field('date','Date',cfg.date,'date')}${field('time','Time',cfg.time,'time')}</div>
    ${field('venue','Venue',cfg.venue)}
    ${field('city','City',cfg.city)}
    ${field('rsvp','RSVP note',cfg.rsvp)}
  </fieldset>
  <fieldset><legend>Photos on the walls</legend>
    ${storeWarn?`<p class="warn">${esc(storeWarn)}</p>`:''}
    ${cfg.photos.map((p,i)=>`<div class="photo-row">
      <div class="thumb" id="th-${i}"></div>
      <div class="pr-ctrl">
        <div class="f"><label for="cap-${i}">Photo ${i+1} caption</label><input id="cap-${i}" data-cap="${i}" value="${esc(p.caption)}"></div>
        <div class="pr-btns"><label class="upl">${p.src?'Replace photo':'Choose photo'}<input type="file" accept="image/*" data-file="${i}" id="file-${i}"></label>${p.src?`<button class="mini" type="button" data-rm="${i}">Remove</button>`:''}</div>
      </div></div>`).join('')}
  </fieldset>
  <fieldset><legend>Visitors</legend>
    <label class="chk"><input type="checkbox" id="f-hold" ${visitors.some(v=>v.holdHands)?'checked':''}> Visitor couples hold hands</label>
    <label class="chk"><input type="checkbox" id="f-debug" ${debugShown?'checked':''}> Show route and character states (K)</label>
    <button class="mini" type="button" id="f-clearwish" style="justify-self:start">Clear the wishes board</button>
  </fieldset>
  <div class="sh-foot"><button class="mini" id="sh-reset" type="button">Reset to the example</button><button class="pbtn" id="sh-done2" type="button">Back to the museum</button></div>`;
  cfg.photos.forEach((p,i)=>{
    const th=$('th-'+i);
    th.style.backgroundImage=`url("${ready(i)?imgs[i].src:frames[i].pc.toDataURL('image/jpeg',.7)}")`;
  });
}
function openSheet(){ renderSheet(); sheetEl.hidden=false; sheetEl.scrollTop=0; }
function switchTheme(k){
  if(!THEMES[k] || k===cfg.theme) return;
  const th=THEMES[k];
  cfg.theme=k; cfg.host=th.host;
  if(k==='baby' && cfg.style1===cfg.style2) cfg.style2=opp(cfg.style1); cfg.line=th.line; cfg.message=th.message; cfg.rsvp=th.rsvp;
  cfg.photos.forEach((p,i)=>{ p.caption=th.captions[i]; });
  applyAccent(); buildTheme(); applyCfg(); save(); renderSheet();
}
let applyTimer=null;
let debugShown=false;
function setDebug(on){ debugShown=on; const el=$('f-debug'); if(el) el.checked=on; }
sheetEl.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='f-theme'){ switchTheme(t.value); return; }
  if(t.id==='f-hold'){ visitors.forEach(v=>{ v.holdHands=t.checked; }); return; }
  if(t.id==='f-debug'){ setDebug(Characters.toggleDebug(t.checked)); return; }
  if(t.dataset.k){
    cfg[t.dataset.k]=t.value;
    if(t.dataset.k==='style1' && cfg.theme==='baby'){ cfg.style2=opp(cfg.style1); applyCfg(); save(); renderSheet(); return; }
    if(t.tagName==='SELECT'){ applyCfg(); save(); return; }
  }
  else if(t.dataset.cap!==undefined){ cfg.photos[+t.dataset.cap].caption=t.value; }
  else return;
  clearTimeout(applyTimer); applyTimer=setTimeout(()=>{ if(t.dataset.k==='age') buildTheme(); applyCfg(); save(); },220);
});
sheetEl.addEventListener('change',e=>{
  const t=e.target; if(t.dataset.file===undefined||!t.files||!t.files[0]) return;
  const i=+t.dataset.file, fr=new FileReader();
  fr.onload=()=>{
    const im=new Image();
    im.onload=()=>{
      const M=1100, s=Math.min(1,M/Math.max(im.naturalWidth,im.naturalHeight));
      const c=cv(Math.round(im.naturalWidth*s),Math.round(im.naturalHeight*s)); c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      cfg.photos[i].src=c.toDataURL('image/jpeg',.82);
      const ni=new Image(); ni.onload=()=>{ imgs[i]=ni; drawFrame(i); save(); renderSheet(); }; ni.src=cfg.photos[i].src;
    };
    im.src=fr.result;
  };
  fr.readAsDataURL(t.files[0]);
});
sheetEl.addEventListener('click',e=>{
  const t=e.target.closest('button'); if(!t) return;
  if(t.id==='sh-done'||t.id==='sh-done2'){ closeAll(); }
  else if(t.id==='sh-reset'){ cfg=clone(DEFAULT); imgs.fill(null); save(); applyAccent(); buildTheme(); applyCfg(); renderSheet(); }
  else if(t.id==='f-clearwish'){ wishes=EXAMPLE_WISHES.slice(); try{ localStorage.removeItem(WISH_STORE); }catch(_){} drawWishes(); t.textContent='Wishes cleared'; }
  else if(t.dataset.rm!==undefined){ const i=+t.dataset.rm; cfg.photos[i].src=null; imgs[i]=null; drawFrame(i); save(); renderSheet(); }
});

/* ---------- apply config ---------- */
function applyCfg(){
  drawInvitation();
  drawWishes();
  for(let i=0;i<PHOTO_COUNT;i++){ drawFrame(i); drawLabel(i); }
  if(player.cfgKey!==personKey(1)){ player.cfgKey=personKey(1); player.configure(personOpts(1)); }
  if(partner.cfgKey!==personKey(2)){ partner.cfgKey=personKey(2); partner.configure(personOpts(2)); }
  applySolo();
  player.name=cfg.name1; partner.name=cfg.name2;
  tagEls[0].textContent=cfg.name1; tagEls[1].textContent=cfg.name2;
  const chip=$('chip');
  chip.querySelector('.n').textContent=titleOf();
  chip.querySelector('.d').textContent=[T().label, fmtDate(cfg.date).replace(/^\w+, /,''), cfg.city.split(',')[0]].filter(Boolean).join(' · ');
  root.querySelector('#bubble p').textContent=cfg.message;
  root.querySelector('#bubble span').textContent=cfg.name1;
  canvas.setAttribute('aria-label', `Walkable 3D museum: ${T().label.toLowerCase()} of ${titleOf()}`);
  if(introEl.hidden===false) renderIntro();
  if(!inviteEl.hidden) inviteEl.innerHTML=cardHTML('invite');
}
for(let i=0;i<PHOTO_COUNT;i++) loadImg(i);

/* ---------- painted look ---------- */
function resize(){
  const w=innerWidth, h=innerHeight;
  const dpr=Math.min(window.devicePixelRatio||1, painted?1.5:1.75);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w,h,false); camera.aspect=w/h;
  if(post) post.setSize(w*dpr,h*dpr);
  camera.fov = w<h ? 68 : 58; camera.updateProjectionMatrix();
}
const STAGE = 4;
const canPaint = Paint.supportsPaint(renderer);
const post = canPaint ? Paint.createPost(renderer) : null;
const rig = Paint.createLighting({scene, sun, skylights:SKY, ceilingY:H, lamps:lampDefs});
rig.setFull(STAGE>=4);
const lookBtn=$('b-look'), timeBtn=$('b-time');
function toonify(root){
  root.traverse(o=>{
    if(!(o.isMesh||o.isSprite) || !o.userData.surf) return;
    if(!o.userData.toon){
      const old=o.material, u=Paint.toonUniforms;
      o.userData.old=old;
      let gid=0;
      if(!o.userData.noOutline){ let p=o; while(p && p.userData.outlineGroup===undefined) p=p.parent; gid = p ? p.userData.outlineGroup : nextOutlineId(); }
      const opt={surface:o.userData.surf, color:old.color?old.color.getHex():0xffffff, map:old.map||null, transparent:old.transparent,
        opacity:old.opacity, outlineId:gid, sprite:!!o.isSprite, side:old.side, vertexColors:!!old.vertexColors, alphaMap:old.alphaMap||null};
      if(o.userData.skyPanel){ opt.colorUniform=u.uSkyColor; opt.emissive=u.uSkyGlow; }
      if(o.userData.bulb){ opt.emissive=u.uBulb; }
      if(o.userData.fairy){ opt.emissive=u.uFairy; }
      if(o.userData.flame){ opt.emissive=2.2; }
      o.userData.toon=Paint.toonMaterial(opt);
    }
    o.material=o.userData.toon;
    const s=o.userData.surf;
    o.castShadow = !(o.isSprite || s==='emissive' || s==='unlit' || s==='glass' || s==='floor' || o.userData.bulb || o.userData.noShadow);
    o.receiveShadow = true;
  });
}
function untoon(root){
  root.traverse(o=>{ if(o.userData.old){ o.material=o.userData.old; } o.castShadow=false; });
}
function setLook(on){
  if(on && !canPaint) on=false;
  painted=on;
  if(on){ toonify(scene); scene.background=null; } else { untoon(scene); scene.background=new THREE.Color(0x1e1b19); }
  poolMeshes.forEach(p=>{ p.visible=!on; });
  rig.setEnabled(on);
  lookBtn.firstChild.textContent = on ? 'Painted ' : 'Original ';
  timeBtn.hidden = !on || STAGE<4;
  timeBtn.firstChild.textContent = rig.name+' ';
  resize();
}
function nextTime(){ if(!painted||STAGE<4) return; rig.next(); timeBtn.firstChild.textContent=rig.name+' '; }
lookBtn.addEventListener('click',()=>setLook(!painted));
timeBtn.addEventListener('click',nextTime);
if(!canPaint){ lookBtn.disabled=true; lookBtn.title='The painted look needs WebGL 2 on this device'; }
on(window,'resize',resize);

applyAccent();
buildTheme();
renderIntro();
applyCfg();
if(document.fonts&&document.fonts.load){
  Promise.all(['400 40px "Pinyon Script"','400 40px Marcellus','500 20px Jost','600 20px Jost'].map(f=>document.fonts.load(f).catch(()=>{}))).then(()=>{ if(!disposed) applyCfg(); });
}
setLook(canPaint);

/* ---------- loop ---------- */
const bubble=$('bubble');
const tmp=new V3();
let last=performance.now(), scrAcc=0, clock=0;
function frame(now){
  if(disposed) return;
  const dt=Math.max(0,Math.min(.05,(now-last)/1000)); last=now; clock+=dt;
  // input
  let ix=0, iy=0;
  if(!anyOverlay()){
    if(keys['w']||keys['arrowup']) iy+=1; if(keys['s']||keys['arrowdown']) iy-=1;
    if(keys['a']||keys['arrowleft']) ix-=1; if(keys['d']||keys['arrowright']) ix+=1;
    ix+=joy.x; iy+=joy.y;
  }
  let mag=Math.hypot(ix,iy); if(mag>1){ ix/=mag; iy/=mag; mag=1; }
  if(mag>.08 && player.mode==='sit') stand();
  if(mag>.08 && posing) endPose();
  if(mag>.08 && player.mode==='dance'){ player.mode='walk'; if(partner.mode==='dance') partner.mode='walk'; }
  // player
  if(player.mode==='walk' && !posing){
    const sy=Math.sin(cam.yaw), cy=Math.cos(cam.yaw);
    const mx=(-sy*iy+cy*ix), mz=(-cy*iy-sy*ix);
    const sp=1.5*mag;
    const ox=player.x, oz=player.z;
    if(mag>.08){ stepMove(player,mx*sp*dt,mz*sp*dt); player.heading=lerpAngle(player.heading,Math.atan2(mx,mz),1-Math.exp(-dt*12)); }
    player.inputSpeed=lerp(player.inputSpeed, Math.hypot(player.x-ox,player.z-oz)/Math.max(dt,1e-4), 1-Math.exp(-dt*12));
  } else player.inputSpeed=0;
  // partner: keeps to your left and a little behind, faces where you face when you stop
  if(!solo() && partner.mode==='walk' && player.mode!=='sit' && !posing){
    const f=[Math.sin(player.heading),Math.cos(player.heading)], l=[Math.cos(player.heading),-Math.sin(player.heading)];
    partner.tx=player.x+l[0]*.7-f[0]*.25; partner.tz=player.z+l[1]*.7-f[1]*.25;
    partner.faceHeading=player.heading;
  }
  if(partner.mode==='dance'){ partner.faceHeading=Math.atan2(player.x-partner.x,player.z-partner.z); partner.heading=lerpAngle(partner.heading,partner.faceHeading,1-Math.exp(-dt*6)); }
  if(player.mode==='dance' && partner.mode==='dance'){ player.heading=lerpAngle(player.heading,Math.atan2(partner.x-player.x,partner.z-player.z),1-Math.exp(-dt*3)); }
  if(posing){
    posing.t+=dt;
    player.lookAtPoint=camera.position; partner.lookAtPoint=camera.position;
    if(!posing.shot && posing.t>1.8){ posing.shot=true; captureNext=true; }
  } else if(player.lookAtPoint===camera.position){ player.lookAtPoint=null; partner.lookAtPoint=null; }
  Characters.update(dt, camera);

  // interactions
  current=null;
  if(player.mode!=='sit' && !posing){
    let best=1e9;
    for(const it of interactables){ const d=Math.hypot(it.x-player.x,it.z-player.z); if(d<it.r&&d<best){ best=d; current=it; } }
  }
  const label = player.mode==='sit' ? 'Stand up' : posing ? 'Done' : current ? (typeof current.label==='function'?current.label():current.label) : null;
  if(label){ actionBtn.hidden=false; if(actionBtn.querySelector("span").textContent!==label) actionBtn.querySelector("span").textContent=label; }
  else actionBtn.hidden=true;

  // camera
  if(cam.yawGoal!==null){ cam.yaw=lerpAngle(cam.yaw,cam.yawGoal,1-Math.exp(-dt*4)); if(Math.abs(cam.yaw-cam.yawGoal)<.01) cam.yawGoal=null; }
  const seated=player.mode==='sit';
  const pair=(seated||posing) && !solo();
  const gx=pair?(player.x+partner.x)/2:player.x, gz=pair?(player.z+partner.z)/2:player.z, gy=seated?1.15:posing?1.25:1.35;
  const kc=1-Math.exp(-dt*8);
  cam.tx=lerp(cam.tx,gx,kc); cam.ty=lerp(cam.ty,gy,kc); cam.tz=lerp(cam.tz,gz,kc);
  const d=seated?3.4:posing?3.8:cam.dist;
  let px=cam.tx+Math.sin(cam.yaw)*Math.cos(cam.pitch)*d, py=cam.ty+Math.sin(cam.pitch)*d, pz=cam.tz+Math.cos(cam.yaw)*Math.cos(cam.pitch)*d;
  px=Math.max(-hx+.25,Math.min(hx-.25,px)); pz=Math.max(-hz+.25,Math.min(hz-.25,pz)); py=Math.min(H-.25,Math.max(.3,py));
  camera.position.set(px,py,pz); camera.lookAt(cam.tx,cam.ty,cam.tz);

  /* celebration animation */
  if(anim.rings){ anim.rings.rotation.y=Math.sin(clock*.5)*.25 + anim.sparkle*clock*2; }
  anim.sparkle=Math.max(0,anim.sparkle-dt*.5);
  if(anim.flames.length){
    anim.candlesOut=Math.max(0,anim.candlesOut-dt);
    anim.flames.forEach((f,i)=>{ f.visible=anim.candlesOut<=0; const k=1+.18*Math.sin(clock*13+i*2.1)+.1*Math.sin(clock*7.3+i); f.scale.set(1,1.7*k,1); });
  }
  if(anim.mobile){ anim.mobileSpin=Math.max(0,anim.mobileSpin-dt); anim.mobile.rotation.y+=dt*(.35+anim.mobileSpin*.6); }
  anim.balloons.forEach((b,i)=>{ b.rotation.z=Math.sin(clock*.8+i)*.04; b.rotation.x=Math.cos(clock*.6+i*1.7)*.035; });
  if(petals){ petals.material.uniforms.uTime.value=clock; petals.material.uniforms.uBurst.value=anim.sparkle; }
  scrAcc+=dt; if(scrAcc>.05){ scrAcc=0; drawScreen(clock); }

  // bubble
  if(seated && !anyOverlay()){
    tmp.set(player.x, player.height*.72+.5, player.z).project(camera);
    const hudBottom=root.querySelector('.hud-top').getBoundingClientRect().bottom+bubble.offsetHeight+8;
    if(tmp.z<1){ bubble.hidden=false; bubble.style.left=((tmp.x+1)/2*innerWidth)+'px'; bubble.style.top=Math.max(hudBottom,(1-tmp.y)/2*innerHeight)+'px'; }
    else bubble.hidden=true;
  } else bubble.hidden=true;
  [player,partner].forEach((c,i)=>{
    const el=tagEls[i];
    if(anyOverlay() || posing || (i===0 && !bubble.hidden) || (i===1 && solo())){ el.hidden=true; return; }
    tmp.set(c.x, (c.state==='sit'?c.height*.72:c.height)+.25, c.z).project(camera);
    if(tmp.z>=1 || Math.abs(tmp.x)>1.1 || Math.abs(tmp.y)>1.1){ el.hidden=true; return; }
    el.hidden=false; el.style.left=((tmp.x+1)/2*innerWidth)+'px'; el.style.top=((1-tmp.y)/2*innerHeight)+'px';
  });

  rig.update(dt, clock);
  if(painted) post.render(scene,camera,{ink:STAGE>=2, paint:STAGE>=3});
  else renderer.render(scene,camera);
  if(captureNext){
    captureNext=false;
    let url=''; try{ url=renderer.domElement.toDataURL('image/jpeg',.9); }catch(_){}
    const fl=$('flash'); fl.hidden=false; fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
    setTimeout(()=>{ fl.hidden=true; },700);
    chime();
    if(url) setTimeout(()=>showPhoto(url),450);
  }
  if(!disposed) rafId=requestAnimationFrame(frame);
}
rafId=requestAnimationFrame(frame);

return function dispose(){
  disposed=true;
  cancelAnimationFrame(rafId);
  offAll();
  try{ setMusic(false); }catch(_){}
  try{ if(music.ctx) music.ctx.close(); }catch(_){}
  try{ Characters.reset(); }catch(_){}
  scene.traverse(o=>{
    if(o.geometry) o.geometry.dispose();
    const mats = o.material ? (Array.isArray(o.material)?o.material:[o.material]) : [];
    for(const m of mats.concat(o.userData && o.userData.toon ? [o.userData.toon] : [], o.userData && o.userData.old ? [o.userData.old] : [])){
      if(!m || !m.dispose) continue;
      for(const k in m){ const v=m[k]; if(v && v.isTexture) v.dispose(); }
      if(m.uniforms) for(const k in m.uniforms){ const v=m.uniforms[k] && m.uniforms[k].value; if(v && v.isTexture) v.dispose(); }
      m.dispose();
    }
  });
  renderer.dispose();
  try{ renderer.forceContextLoss(); }catch(_){}
};

}