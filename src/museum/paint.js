/*
 * Celebration Museum for websitebuilder — painted renderer (toon material, ink outlines, post-processing, lighting).
 * Generated from the museum page; edit freely.
 */
import * as THREE from 'three';

const Paint = {};

/* ===== toonMaterial.js ===== */
/* toonMaterial.js — one painted toon material factory for every surface in the museum.
   Written from scratch for this project (no third-party code copied).
   Each surface preset compiles as its own shader variant via a #define, so there are
   no runtime branches between surface types. */
(function () {
  'use strict';
  
  const MAX_LAMPS = 12;

  /* Uniforms shared by reference across every toon material; the lighting rig writes them. */
  const shared = (Paint.toonUniforms = {
    uFillSky: { value: new THREE.Color(0xc8c8c8) },
    uFillGround: { value: new THREE.Color(0xa0a0a0) },
    uShadowTint: { value: new THREE.Color(0xd0d4dc) },
    uRimColor: { value: new THREE.Color(0xffd9a0) },
    uRimStrength: { value: 0.3 },
    uSunBoost: { value: 1.0 },
    uLampPos: { value: Array.from({ length: MAX_LAMPS }, () => new THREE.Vector3()) },
    uLampTarget: { value: Array.from({ length: MAX_LAMPS }, () => new THREE.Vector3()) },
    uLampCount: { value: 0 },
    uLampColor: { value: new THREE.Color(0xffd6a0) },
    uLampStrength: { value: 0.0 },
    uLampCos: { value: new THREE.Vector2(0.9, 0.95) },
    uBulb: { value: 0.0 },
    uFairy: { value: 0.9 },
    uSkyColor: { value: new THREE.Color(0xfff3dc) },
    uSkyGlow: { value: 1.4 }
  });

  const SURFACES = ['floor', 'plaster', 'wood', 'stone', 'metal', 'glass', 'fabric', 'canvas', 'skin', 'emissive', 'unlit'];

  const vertex = /* glsl */ `
#include <common>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
varying vec3 vWorldPos;
varying vec3 vWorldN;
varying vec3 vViewN;
varying vec3 vViewPos;
varying vec2 vUv;
varying float vDepth;
#ifdef USE_COLOR
varying vec3 vColor;
#endif
void main(){
  vUv = uv;
#ifdef USE_COLOR
  vColor = color.rgb;
#endif
#ifdef IS_SPRITE
  vec4 worldPosition = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 mvPosition = viewMatrix * worldPosition;
  mvPosition.xy += position.xy * vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
  vViewN = vec3(0.0, 0.0, 1.0);
  vWorldN = vec3(0.0, 1.0, 0.0);
#else
  /* skinned (VRM) and morph-target (blink) meshes go through the same three.js chunks as built-in materials */
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vec4 mvPosition = viewMatrix * worldPosition;
  vViewN = normalize(transformedNormal);
  vWorldN = normalize(mat3(modelMatrix) * objectNormal);
  #include <shadowmap_vertex>
#endif
  vWorldPos = worldPosition.xyz;
  vViewPos = mvPosition.xyz;
  vDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}`;

  const fragment = /* glsl */ `
layout(location = 0) out highp vec4 outColor;
layout(location = 1) out highp vec4 outData;
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>

uniform vec3 uColor;
uniform float uOpacity;
uniform float uOutlineId;
uniform float uEmissive;
#ifdef USE_TMAP
uniform sampler2D tMap;
#endif
#ifdef USE_AMAP
uniform sampler2D tAlpha;
#endif
#ifdef USE_COLOR
varying vec3 vColor;
#endif
uniform vec3 uFillSky;
uniform vec3 uFillGround;
uniform vec3 uShadowTint;
uniform vec3 uRimColor;
uniform float uRimStrength;
uniform float uSunBoost;
uniform vec3 uLampPos[MAX_LAMPS];
uniform vec3 uLampTarget[MAX_LAMPS];
uniform int uLampCount;
uniform vec3 uLampColor;
uniform float uLampStrength;
uniform vec2 uLampCos;

varying vec3 vWorldPos;
varying vec3 vWorldN;
varying vec3 vViewN;
varying vec3 vViewPos;
varying vec2 vUv;
varying float vDepth;

float h31(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
/* Band-limited noise: fades to its mean once a pixel covers more than ~half a noise cell, so it never shimmers. */
float bnoise(vec3 p){ float fw = length(fwidth(p)); return mix(vnoise(p), 0.5, smoothstep(0.3, 0.85, fw)); }
/* World-space brush dabs: stretched so walls read as horizontal strokes, floors as long sweeps. */
float brush(vec3 wp){
  float a = bnoise(vec3(wp.x * 2.0 + wp.y * 0.5, wp.y * 6.5, wp.z * 2.0 - wp.y * 0.4));
  float b = bnoise(wp * 6.0 + 13.1);
  return (a - 0.5) * 0.75 + (b - 0.5) * 0.25;
}
vec2 octEncode(vec3 n){
  n /= (abs(n.x) + abs(n.y) + abs(n.z));
  return n.z >= 0.0 ? n.xy : (1.0 - abs(n.yx)) * vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
}
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

void main(){
  vec4 base = vec4(uColor, uOpacity);
#ifdef USE_TMAP
  base *= texture2D(tMap, vUv);
#endif
#ifdef USE_COLOR
  base.rgb *= vColor;
#endif
#ifdef USE_AMAP
  base.a *= texture2D(tAlpha, vUv).g;
#endif
#ifdef ALPHA_CUT
  if (base.a < ALPHA_CUT) discard;
#endif
  vec3 V = normalize(-vViewPos);
  vec3 N = normalize(vViewN);
  vec3 WN = normalize(vWorldN);
#ifndef IS_SPRITE
  if (!gl_FrontFacing) { N = -N; WN = -WN; }
#endif
  vec3 col;
  float alpha = base.a;

#if defined(SURF_EMISSIVE)
  col = base.rgb * uEmissive;
#elif defined(SURF_UNLIT)
  col = base.rgb;
#else
  /* ---- main light: one directional "sun" ---- */
  vec3 L = vec3(0.0, 1.0, 0.0);
  vec3 sunCol = vec3(0.0);
  #if NUM_DIR_LIGHTS > 0
    L = directionalLights[0].direction;
    sunCol = directionalLights[0].color * uSunBoost;
  #endif
  float sh = 1.0;
  #if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
    DirectionalLightShadow ds = directionalLightShadows[0];
    sh = getShadow(directionalShadowMap[0], ds.shadowMapSize, ds.shadowBias, ds.shadowRadius, vDirectionalShadowCoord[0]);
  #endif
  float ndl = dot(N, L);
  /* three bands, each edge a narrow smoothstep so it reads as a drawn line, not a jagged step */
  float lit = smoothstep(0.0, 0.07, ndl) * smoothstep(0.18, 0.82, sh);
  float notCore = smoothstep(-0.45, -0.33, ndl);

  vec3 fill = mix(uFillGround, uFillSky, WN.y * 0.5 + 0.5);
  vec3 shadowLight = fill * uShadowTint;
  vec3 coreLight = shadowLight * 0.8;
  vec3 litLight = fill + sunCol;
  #ifdef SURF_SKIN
    shadowLight *= vec3(1.06, 0.97, 0.93);
    coreLight *= vec3(1.08, 0.95, 0.9);
  #endif
  vec3 light = mix(coreLight, shadowLight, notCore);
  light = mix(light, litLight, lit);

  /* ---- exhibit lamps: painted pools with two flat steps instead of a realistic falloff ---- */
  vec3 lampAdd = vec3(0.0);
  for (int i = 0; i < MAX_LAMPS; i++) {
    if (i >= uLampCount) break;
    vec3 d = vWorldPos - uLampPos[i];
    vec3 v = normalize(d);
    vec3 axis = normalize(uLampTarget[i] - uLampPos[i]);
    float c = dot(v, axis);
    float facing = smoothstep(0.0, 0.2, dot(WN, -v));
    float outer = smoothstep(uLampCos.x, uLampCos.x + 0.01, c);
    float inner = smoothstep(uLampCos.y, uLampCos.y + 0.008, c);
    lampAdd += (outer * 0.55 + inner * 0.45) * facing;
  }
  light += uLampColor * uLampStrength * lampAdd;

  /* ---- surface presets ---- */
  vec3 alb = base.rgb;
  float brushAmt = 0.06;
  #ifdef SURF_PLASTER
    brushAmt = 0.1;
  #endif
  #ifdef SURF_FLOOR
    brushAmt = 0.07;
  #endif
  #ifdef SURF_WOOD
    vec3 gp = abs(WN.z) > 0.5 ? vec3(vWorldPos.x * 0.8, vWorldPos.y * 14.0, 0.0) : vec3(vWorldPos.x * 14.0, vWorldPos.y * 14.0, vWorldPos.z * 0.8);
    alb *= 0.9 + 0.2 * bnoise(gp);
  #endif
  #ifdef SURF_STONE
    float vein = bnoise(vWorldPos * 1.3) * 6.0 + (vWorldPos.x + vWorldPos.z + vWorldPos.y) * 1.7;
    float vfw = fwidth(vein);
    float vl = 1.0 - smoothstep(0.0, 0.12 + vfw, abs(fract(vein) - 0.5) * 2.0 - 0.86);
    alb *= 1.0 - 0.05 * (1.0 - vl) * (1.0 - smoothstep(0.3, 1.0, vfw));
    brushAmt = 0.05;
  #endif
  #ifdef SURF_CANVAS
    alb *= 1.0 + (bnoise(vWorldPos * 140.0) - 0.5) * 0.05;
    light = mix(vec3(0.94, 0.92, 0.88), light, 0.35) + uLampColor * uLampStrength * lampAdd * 0.35;
    brushAmt = 0.02;
  #endif
  alb *= 1.0 + brush(vWorldPos) * brushAmt;

  col = alb * light;

  #ifdef SURF_METAL
    /* painted brass: a warm top-lit gradient instead of an environment reflection, plus one toon highlight band */
    vec3 env = mix(vec3(0.42, 0.36, 0.32), vec3(1.12, 1.02, 0.86), smoothstep(-0.3, 0.7, WN.y));
    col = alb * (light * 0.55 + env * 0.55);
    vec3 Hh = normalize(L + V);
    float spec = smoothstep(0.9, 0.925, dot(N, Hh)) * (0.35 + 0.65 * lit);
    col += mix(alb, vec3(1.0, 0.95, 0.85), 0.6) * spec * 0.8;
  #endif
  #ifdef SURF_FABRIC
    col += alb * fill * 0.22 * smoothstep(0.55, 1.0, 1.0 - max(dot(N, V), 0.0));
  #endif
  #ifdef SURF_FLOOR
    /* polished-floor fake: a soft painted sheen toward grazing angles and blurred reflections of the lamp pools */
    float fres = smoothstep(0.5, 0.97, 1.0 - max(dot(N, V), 0.0));
    col += uFillSky * fres * 0.09;
    vec3 Rw = reflect(normalize(vWorldPos - cameraPosition), vec3(0.0, 1.0, 0.0));
    float refl = 0.0;
    for (int i = 0; i < MAX_LAMPS; i++) {
      if (i >= uLampCount) break;
      vec3 tp = mix(uLampPos[i], uLampTarget[i], 0.75);
      refl += smoothstep(0.93, 0.995, dot(Rw, normalize(tp - vWorldPos)));
    }
    col += uLampColor * uLampStrength * refl * 0.22;
  #endif

  /* soft warm rim on the side facing the main light */
  float rim = smoothstep(0.6, 0.85, 1.0 - max(dot(N, V), 0.0)) * smoothstep(-0.25, 0.45, ndl);
  col += uRimColor * uRimStrength * rim * (0.35 + 0.65 * luma(alb));
#endif

#ifdef SURF_GLASS
  /* flat painted tint with one soft highlight streak, no real reflection */
  float s = fract((vWorldPos.x + vWorldPos.y * 0.8 + vWorldPos.z) * 0.85);
  float streak = smoothstep(0.0, 0.05, s) * smoothstep(0.17, 0.09, s);
  float edgeF = smoothstep(0.55, 0.95, 1.0 - max(dot(N, V), 0.0));
  col = mix(col, vec3(0.86, 0.92, 0.93), 0.4) + vec3(1.0, 0.97, 0.9) * streak * 0.55;
  alpha = 0.12 + streak * 0.3 + edgeF * 0.2;
#endif

  /* colour alpha doubles as the bloom mask: only emissive light sources (skylights, lit bulbs) bloom */
#if defined(SURF_EMISSIVE) && !defined(TRANSPARENT_PASS)
  alpha = uEmissive > 1.05 ? 2.0 : 1.0;
#endif
  outColor = vec4(col, alpha);
#if defined(SURF_GLASS) || defined(TRANSPARENT_PASS)
  /* alpha 0 keeps the normal/depth/id buffer untouched under blending */
  outData = vec4(0.0);
#else
  #ifdef SURF_CANVAS
  /* negative id marks pictures and text so the Kuwahara pass keeps them legible */
  outData = vec4(octEncode(N), vDepth / 50.0, -uOutlineId);
  #else
  outData = vec4(octEncode(N), vDepth / 50.0, uOutlineId);
  #endif
#endif
}`;

  /**
   * Create a toon material.
   * opts: { surface, color, map, transparent, opacity, outlineId, sprite, emissive (number or shared uniform), colorUniform }
   */
  Paint.toonMaterial = function (opts) {
    const surface = SURFACES.includes(opts.surface) ? opts.surface : 'plaster';
    const defines = { MAX_LAMPS };
    defines['SURF_' + surface.toUpperCase()] = '';
    if (opts.map) defines.USE_TMAP = '';
    if (opts.alphaMap) defines.USE_AMAP = '';
    if (opts.sprite) defines.IS_SPRITE = '';
    const transparent = !!opts.transparent || surface === 'glass';
    if (transparent && surface !== 'glass') { defines.TRANSPARENT_PASS = ''; defines.ALPHA_CUT = '0.02'; }
    if (opts.alphaTest > 0) defines.ALPHA_CUT = String(Number(opts.alphaTest).toFixed(3));

    const uniforms = Object.assign(THREE.UniformsUtils.clone(THREE.UniformsLib.lights), {
      uColor: opts.colorUniform || { value: new THREE.Color(opts.color !== undefined ? opts.color : 0xffffff) },
      uOpacity: { value: opts.opacity !== undefined ? opts.opacity : 1 },
      uOutlineId: { value: opts.outlineId || 0 },
      uEmissive: typeof opts.emissive === 'object' ? opts.emissive : { value: opts.emissive !== undefined ? opts.emissive : 1 },
      tMap: { value: opts.map || null },
      tAlpha: { value: opts.alphaMap || null }
    });
    for (const k in shared) uniforms[k] = shared[k];

    const m = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      defines,
      lights: true,
      transparent,
      depthWrite: !transparent,
      side: opts.side !== undefined ? opts.side : THREE.FrontSide,
      vertexColors: !!opts.vertexColors
    });
    m.userData.isToon = true;
    return m;
  };
  Paint.SURFACES = SURFACES;
})();

/* ===== outlinePass.js ===== */
/* outlinePass.js — screen-space ink lines from the scene's normal/depth/group-id buffer.
   Lines appear where depth jumps, normals crease, or the outline group id changes.
   Objects whose id is 0 (userData.noOutline) never produce or receive lines. */
(function () {
  'use strict';
  

  Paint.createOutlineMaterial = function () {
    return new THREE.ShaderMaterial({
      uniforms: {
        tData: { value: null },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uWidth: { value: 1.35 }
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: /* glsl */ `
uniform sampler2D tData;
uniform vec2 uTexel;
uniform float uWidth;
varying vec2 vUv;
vec3 octDecode(vec2 e){
  vec3 n = vec3(e, 1.0 - abs(e.x) - abs(e.y));
  float t = max(-n.z, 0.0);
  n.x += n.x >= 0.0 ? -t : t;
  n.y += n.y >= 0.0 ? -t : t;
  return normalize(n);
}
void main(){
  vec4 c = texture2D(tData, vUv); c.w = abs(c.w);
  float dc = c.z * 50.0;
  if (c.w < 0.002) { gl_FragColor = vec4(0.0, dc / 50.0, 0.0, 1.0); return; }
  vec3 nc = octDecode(c.xy);
  vec2 o = uTexel * uWidth;
  vec4 s0 = texture2D(tData, vUv + vec2( o.x, 0.0)); s0.w = abs(s0.w);
  vec4 s1 = texture2D(tData, vUv + vec2(-o.x, 0.0)); s1.w = abs(s1.w);
  vec4 s2 = texture2D(tData, vUv + vec2(0.0,  o.y)); s2.w = abs(s2.w);
  vec4 s3 = texture2D(tData, vUv + vec2(0.0, -o.y)); s3.w = abs(s3.w);
  float d0 = s0.w < 0.002 ? dc : s0.z * 50.0;
  float d1 = s1.w < 0.002 ? dc : s1.z * 50.0;
  float d2 = s2.w < 0.002 ? dc : s2.z * 50.0;
  float d3 = s3.w < 0.002 ? dc : s3.z * 50.0;
  float nE = 0.0, idE = 0.0;
  if (s0.w >= 0.002) { nE = max(nE, 1.0 - dot(nc, octDecode(s0.xy))); idE = max(idE, step(0.6 / 255.0, abs(s0.w - c.w))); }
  if (s1.w >= 0.002) { nE = max(nE, 1.0 - dot(nc, octDecode(s1.xy))); idE = max(idE, step(0.6 / 255.0, abs(s1.w - c.w))); }
  if (s2.w >= 0.002) { nE = max(nE, 1.0 - dot(nc, octDecode(s2.xy))); idE = max(idE, step(0.6 / 255.0, abs(s2.w - c.w))); }
  if (s3.w >= 0.002) { nE = max(nE, 1.0 - dot(nc, octDecode(s3.xy))); idE = max(idE, step(0.6 / 255.0, abs(s3.w - c.w))); }
  /* depth: second difference, relative to distance, so flat floors seen at grazing angles stay clean */
  float lap = max(abs(d0 + d1 - 2.0 * dc), abs(d2 + d3 - 2.0 * dc)) / max(dc, 0.1);
  /* characters are small on screen: only strong creases and silhouettes, so cloth folds don't speckle */
  float isChar = step(249.5 / 255.0, c.w);
  float eD = smoothstep(mix(0.035, 0.06, isChar), mix(0.09, 0.14, isChar), lap);
  float eN = smoothstep(mix(0.2, 0.55, isChar), mix(0.42, 0.8, isChar), nE);
  float edge = max(max(eD, eN), idE);
  edge *= 1.0 - 0.45 * smoothstep(18.0, 32.0, dc);
  /* characters use outline ids above 249/255: flag their lines so they get the warmer character ink */
  float ch = step(249.5 / 255.0, c.w);
  ch = max(ch, step(249.5 / 255.0, s0.w)); ch = max(ch, step(249.5 / 255.0, s1.w));
  ch = max(ch, step(249.5 / 255.0, s2.w)); ch = max(ch, step(249.5 / 255.0, s3.w));
  gl_FragColor = vec4(edge, dc / 50.0, ch, 1.0);
}`,
      depthTest: false,
      depthWrite: false
    });
  };
})();

/* ===== post.js ===== */
/* post.js — painterly post chain.
   scene (4x MSAA, MRT: HDR colour + normal/depth/id)
     -> ink edges -> edge-aware 4-sector Kuwahara -> bloom (bright areas only)
     -> tone + warm grade + ink + vignette + static paper grain -> CAS sharpen -> screen */
(function () {
  'use strict';
  
  const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const pass = (fs, uniforms) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: fs, uniforms, depthTest: false, depthWrite: false });

  Paint.supportsPaint = function (renderer) {
    if (!renderer.capabilities.isWebGL2) return false;
    const e = renderer.extensions;
    return e.has('EXT_color_buffer_float') || e.has('EXT_color_buffer_half_float');
  };

  Paint.createPost = function (renderer) {
    const HF = THREE.HalfFloatType;
    const sceneRT = new THREE.WebGLMultipleRenderTargets(1, 1, 2, { samples: 4 });
    sceneRT.texture.forEach((t, i) => {
      t.type = HF; t.format = THREE.RGBAFormat;
      t.minFilter = t.magFilter = i === 0 ? THREE.LinearFilter : THREE.NearestFilter;
      t.generateMipmaps = false;
    });
    const mk = (type) => new THREE.WebGLRenderTarget(1, 1, { type, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    const edgeRT = mk(THREE.UnsignedByteType);
    const paintRT = mk(HF);
    const bloomA = mk(HF), bloomB = mk(HF);
    const gradeRT = mk(THREE.UnsignedByteType);

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;
    const qScene = new THREE.Scene(); qScene.add(quad);
    const qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const outline = Paint.createOutlineMaterial();

    const kuwahara = pass(/* glsl */ `
uniform sampler2D tColor; uniform sampler2D tEdge; uniform sampler2D tData; uniform vec2 uTexel; uniform float uStrength;
varying vec2 vUv;
void main(){
  vec4 o4 = texture2D(tColor, vUv); vec3 orig = o4.rgb;
  vec3 m0 = vec3(0.0), m1 = vec3(0.0), m2 = vec3(0.0), m3 = vec3(0.0);
  vec3 q0 = vec3(0.0), q1 = vec3(0.0), q2 = vec3(0.0), q3 = vec3(0.0);
  for (int j = 0; j <= 2; j++) {
    for (int i = 0; i <= 2; i++) {
      vec2 o = vec2(float(i), float(j)) * uTexel;
      vec3 a = min(texture2D(tColor, vUv + vec2(-o.x, -o.y)).rgb, vec3(4.0));
      vec3 b = min(texture2D(tColor, vUv + vec2( o.x, -o.y)).rgb, vec3(4.0));
      vec3 c = min(texture2D(tColor, vUv + vec2(-o.x,  o.y)).rgb, vec3(4.0));
      vec3 d = min(texture2D(tColor, vUv + vec2( o.x,  o.y)).rgb, vec3(4.0));
      m0 += a; q0 += a * a; m1 += b; q1 += b * b; m2 += c; q2 += c * c; m3 += d; q3 += d * d;
    }
  }
  m0 /= 9.0; m1 /= 9.0; m2 /= 9.0; m3 /= 9.0;
  float v0 = dot(q0 / 9.0 - m0 * m0, vec3(1.0));
  float v1 = dot(q1 / 9.0 - m1 * m1, vec3(1.0));
  float v2 = dot(q2 / 9.0 - m2 * m2, vec3(1.0));
  float v3 = dot(q3 / 9.0 - m3 * m3, vec3(1.0));
  vec3 k = m0; float mv = v0;
  if (v1 < mv) { mv = v1; k = m1; }
  if (v2 < mv) { mv = v2; k = m2; }
  if (v3 < mv) { mv = v3; k = m3; }
  float edge = texture2D(tEdge, vUv).r;
  vec4 dat = texture2D(tData, vUv); float depth = dat.z * 50.0;
  /* weaker near the camera and on ink lines, so close-ups and outlines stay calm */
  float w = uStrength * (1.0 - edge) * smoothstep(0.8, 4.5, depth) * (dat.w < -0.002 ? 0.12 : 1.0);
  vec3 kk = o4.a > 1.5 ? orig : k;
  gl_FragColor = vec4(mix(orig, kk, w), o4.a);
}`, { tColor: { value: null }, tEdge: { value: null }, tData: { value: null }, uTexel: { value: new THREE.Vector2() }, uStrength: { value: 1 } });

    const bright = pass(/* glsl */ `
uniform sampler2D tColor; uniform vec2 uTexel; uniform float uThreshold; varying vec2 vUv;
void main(){
  /* only pixels flagged as light sources (alpha > 1) bloom: skylights, glowing bulbs */
  vec3 c = vec3(0.0);
  vec4 t;
  t = texture2D(tColor, vUv + uTexel * vec2(-1.0, -1.0)); c += t.rgb * smoothstep(1.2, 1.8, t.a);
  t = texture2D(tColor, vUv + uTexel * vec2( 1.0, -1.0)); c += t.rgb * smoothstep(1.2, 1.8, t.a);
  t = texture2D(tColor, vUv + uTexel * vec2(-1.0,  1.0)); c += t.rgb * smoothstep(1.2, 1.8, t.a);
  t = texture2D(tColor, vUv + uTexel * vec2( 1.0,  1.0)); c += t.rgb * smoothstep(1.2, 1.8, t.a);
  c *= 0.25;
  float l = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(min(c, vec3(6.0)) * smoothstep(uThreshold, uThreshold + 0.4, l), 1.0);
}`, { tColor: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 0.6 } });

    const blur = pass(/* glsl */ `
uniform sampler2D tColor; uniform vec2 uDir; varying vec2 vUv;
void main(){
  vec3 c = texture2D(tColor, vUv).rgb * 0.2270;
  c += (texture2D(tColor, vUv + uDir * 1.3846).rgb + texture2D(tColor, vUv - uDir * 1.3846).rgb) * 0.3162;
  c += (texture2D(tColor, vUv + uDir * 3.2308).rgb + texture2D(tColor, vUv - uDir * 3.2308).rgb) * 0.0703;
  gl_FragColor = vec4(c, 1.0);
}`, { tColor: { value: null }, uDir: { value: new THREE.Vector2() } });

    const grade = pass(/* glsl */ `
uniform sampler2D tColor; uniform sampler2D tBloom; uniform sampler2D tEdge;
uniform float uPaint; uniform float uInk; uniform vec3 uInkColor; uniform vec3 uInkChar;
uniform float uBloom; uniform float uExposure; uniform vec3 uLift; uniform vec3 uWarm; uniform float uDesat;
uniform float uVignette; uniform float uAspect;
varying vec2 vUv;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
void main(){
  vec3 c = texture2D(tColor, vUv).rgb;
  if (uPaint > 0.5) {
    c += texture2D(tBloom, vUv).rgb * uBloom;
    c = 1.0 - exp(-c * uExposure);
    c = mix(c, c * c * (3.0 - 2.0 * c), 0.35);
    float sl = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = max(mix(vec3(sl), c, 1.18), 0.0);
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    float mid = 1.0 - abs(l - 0.5) * 2.0;
    c = mix(c, vec3(l), uDesat * mid);
    c += uLift * pow(1.0 - l, 3.0);
    c = mix(c, c * uWarm, smoothstep(0.42, 1.0, l));
    vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0);
    c *= mix(1.0 - uVignette, 1.0, smoothstep(0.95, 0.3, length(q)));
  } else {
    c = clamp(c, 0.0, 1.0);
  }
  vec4 ed = texture2D(tEdge, vUv);
  float e = ed.r * uInk;
  c = mix(c, mix(uInkColor, uInkChar, ed.b), e * 0.9);
  if (uPaint > 0.5) {
    /* static paper grain: tied to screen pixels, never animated */
    float g = hash(gl_FragCoord.xy);
    float fibre = vn(gl_FragCoord.xy * vec2(0.09, 0.03)) * 0.6 + vn(gl_FragCoord.xy * 0.4) * 0.4;
    c *= 1.0 + (g - 0.5) * 0.04 + (fibre - 0.5) * 0.05;
  }
  c = mix(vec3(0.04, 0.038, 0.045), vec3(0.965, 0.952, 0.925), clamp(c, 0.0, 1.0));
  gl_FragColor = vec4(c, 1.0);
}`, {
      tColor: { value: null }, tBloom: { value: null }, tEdge: { value: null },
      uPaint: { value: 1 }, uInk: { value: 1 }, uInkColor: { value: new THREE.Color(0x2a2420) }, uInkChar: { value: new THREE.Color(0x4a2f22) },
      uBloom: { value: 0.55 }, uExposure: { value: 1.25 },
      uLift: { value: new THREE.Vector3(0.03, 0.05, 0.06) }, uWarm: { value: new THREE.Vector3(1.06, 1.0, 0.9) },
      uDesat: { value: 0.12 }, uVignette: { value: 0.22 }, uAspect: { value: 1 }
    });

    const cas = pass(/* glsl */ `
uniform sampler2D tColor; uniform vec2 uTexel; uniform float uSharp; varying vec2 vUv;
void main(){
  vec3 a = texture2D(tColor, vUv + vec2(0.0, -uTexel.y)).rgb;
  vec3 b = texture2D(tColor, vUv + vec2(-uTexel.x, 0.0)).rgb;
  vec3 c = texture2D(tColor, vUv).rgb;
  vec3 d = texture2D(tColor, vUv + vec2(uTexel.x, 0.0)).rgb;
  vec3 e = texture2D(tColor, vUv + vec2(0.0, uTexel.y)).rgb;
  vec3 mn = min(min(min(a, b), min(d, e)), c);
  vec3 mx = max(max(max(a, b), max(d, e)), c);
  vec3 amp = sqrt(clamp(min(mn, 1.0 - mx) / max(mx, vec3(1e-4)), 0.0, 1.0));
  vec3 w = amp * (-1.0 / mix(8.0, 5.0, uSharp)) * step(0.001, uSharp);
  vec3 r = (c + (a + b + d + e) * w) / (1.0 + 4.0 * w);
  gl_FragColor = vec4(clamp(r, vec3(0.035), vec3(0.965)), 1.0);
}`, { tColor: { value: null }, uTexel: { value: new THREE.Vector2() }, uSharp: { value: 0.35 } });

    let W = 1, H = 1;
    function run(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(qScene, qCam); }

    return {
      sceneRT,
      grade: grade.uniforms,
      setSize(w, h) {
        W = Math.max(1, Math.floor(w)); H = Math.max(1, Math.floor(h));
        sceneRT.setSize(W, H); edgeRT.setSize(W, H); paintRT.setSize(W, H); gradeRT.setSize(W, H);
        bloomA.setSize(Math.max(1, W >> 2), Math.max(1, H >> 2)); bloomB.setSize(Math.max(1, W >> 2), Math.max(1, H >> 2));
        outline.uniforms.uTexel.value.set(1 / W, 1 / H);
        outline.uniforms.uWidth.value = Math.max(1, 1.35 * H / 1080);
        kuwahara.uniforms.uTexel.value.set(1 / W, 1 / H);
        bright.uniforms.uTexel.value.set(1 / W, 1 / H);
        cas.uniforms.uTexel.value.set(1 / W, 1 / H);
        grade.uniforms.uAspect.value = W / H;
      },
      /* flags: { ink: bool, paint: bool } */
      render(scene, camera, flags) {
        const prevAuto = renderer.autoClear;
        renderer.autoClear = true;
        renderer.setRenderTarget(sceneRT);
        renderer.render(scene, camera);

        outline.uniforms.tData.value = sceneRT.texture[1];
        run(outline, edgeRT);

        let colorTex = sceneRT.texture[0];
        if (flags.paint) {
          kuwahara.uniforms.tColor.value = colorTex;
          kuwahara.uniforms.tEdge.value = edgeRT.texture;
          kuwahara.uniforms.tData.value = sceneRT.texture[1];
          run(kuwahara, paintRT);
          colorTex = paintRT.texture;

          bright.uniforms.tColor.value = colorTex; run(bright, bloomA);
          const bw = 1 / bloomA.width, bh = 1 / bloomA.height;
          for (let i = 0; i < 2; i++) {
            blur.uniforms.tColor.value = bloomA.texture; blur.uniforms.uDir.value.set(bw * (1 + i), 0); run(blur, bloomB);
            blur.uniforms.tColor.value = bloomB.texture; blur.uniforms.uDir.value.set(0, bh * (1 + i)); run(blur, bloomA);
          }
        }
        grade.uniforms.tColor.value = colorTex;
        grade.uniforms.tBloom.value = bloomA.texture;
        grade.uniforms.tEdge.value = edgeRT.texture;
        grade.uniforms.uPaint.value = flags.paint ? 1 : 0;
        grade.uniforms.uInk.value = flags.ink ? 1 : 0;
        run(grade, gradeRT);

        cas.uniforms.tColor.value = gradeRT.texture;
        cas.uniforms.uSharp.value = flags.paint ? 0.35 : 0;
        run(cas, null);
        renderer.autoClear = prevAuto;
      }
    };
  };
})();

/* ===== lighting.js ===== */
/* lighting.js — indoor painted lighting rig.
   One warm directional "sun" entering through the ceiling skylights (crisp toon shadows),
   soft additive light shafts, drifting dust motes, warm/cool interior fill,
   painted exhibit lamp pools, and afternoon / golden hour / dusk presets. */
(function () {
  'use strict';
  
  const U = () => Paint.toonUniforms;

  const PRESETS = [
    { name: 'Afternoon', dir: [0.3, -1, 0.24], sun: '#ffe0ae', sunI: 1.0, sky: '#f7e3c6', ground: '#a7aec0', tint: '#cfd3e0',
      lamp: 0.3, bulb: 0.0, skyColor: '#fff2da', skyGlow: 1.7, shaft: 0.2, dust: 0.9, rim: 0.32,
      exposure: 1.3, lift: [0.025, 0.045, 0.06], warm: [1.05, 1.0, 0.9], desat: 0.12, bloom: 0.5, vignette: 0.2 },
    { name: 'Golden hour', dir: [0.95, -0.72, 0.32], sun: '#ffac5e', sunI: 1.25, sky: '#f5d2a6', ground: '#9e99b2', tint: '#c9c2d6',
      lamp: 0.45, bulb: 0.7, skyColor: '#ffd294', skyGlow: 1.65, shaft: 0.3, dust: 1.2, rim: 0.5,
      exposure: 1.25, lift: [0.03, 0.04, 0.07], warm: [1.1, 0.99, 0.82], desat: 0.1, bloom: 0.65, vignette: 0.24 },
    { name: 'Dusk', dir: [-0.45, -0.85, 0.42], sun: '#8d84b6', sunI: 0.3, sky: '#9a94ad', ground: '#626783', tint: '#b6b9d4',
      lamp: 1.0, bulb: 2.4, skyColor: '#5b6aa6', skyGlow: 1.25, shaft: 0.06, dust: 0.4, rim: 0.22,
      exposure: 1.4, lift: [0.035, 0.05, 0.085], warm: [1.08, 0.98, 0.86], desat: 0.14, bloom: 0.75, vignette: 0.28 }
  ];
  /* Neutral rig used while showing the earlier build stages. */
  const NEUTRAL = { name: 'Neutral', dir: [0.3, -1, 0.24], sun: '#ffffff', sunI: 0.9, sky: '#d6d6d6', ground: '#a8a8a8', tint: '#d0d0d0',
    lamp: 0, bulb: 0, skyColor: '#f4f4f4', skyGlow: 1.3, shaft: 0, dust: 0, rim: 0.25,
    exposure: 1.3, lift: [0.02, 0.02, 0.02], warm: [1, 1, 1], desat: 0, bloom: 0.4, vignette: 0.15 };

  function toState(p) {
    return {
      dir: new THREE.Vector3().fromArray(p.dir).normalize(), sun: new THREE.Color(p.sun), sunI: p.sunI,
      sky: new THREE.Color(p.sky), ground: new THREE.Color(p.ground), tint: new THREE.Color(p.tint),
      lamp: p.lamp, bulb: p.bulb, skyColor: new THREE.Color(p.skyColor), skyGlow: p.skyGlow,
      shaft: p.shaft, dust: p.dust, rim: p.rim, exposure: p.exposure,
      lift: new THREE.Vector3().fromArray(p.lift), warm: new THREE.Vector3().fromArray(p.warm),
      desat: p.desat, bloom: p.bloom, vignette: p.vignette
    };
  }
  function lerpState(o, a, b, t) {
    o.dir.copy(a.dir).lerp(b.dir, t).normalize();
    ['sun', 'sky', 'ground', 'tint', 'skyColor'].forEach(k => o[k].copy(a[k]).lerp(b[k], t));
    ['lift', 'warm'].forEach(k => o[k].copy(a[k]).lerp(b[k], t));
    ['sunI', 'lamp', 'bulb', 'skyGlow', 'shaft', 'dust', 'rim', 'exposure', 'desat', 'bloom', 'vignette'].forEach(k => { o[k] = a[k] + (b[k] - a[k]) * t; });
  }

  const shaftVS = 'varying vec2 vUv; varying vec3 vWP; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vWP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }';
  const shaftFS = /* glsl */ `
layout(location = 0) out highp vec4 outColor;
layout(location = 1) out highp vec4 outData;
uniform vec3 uColor; uniform float uStrength;
varying vec2 vUv; varying vec3 vWP;
void main(){
  float side = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
  float fall = smoothstep(0.0, 0.06, vUv.y) * mix(1.0, 0.18, vUv.y);
  float streak = 0.72 + 0.28 * sin(vUv.x * 21.0 + 1.7) * sin(vUv.x * 7.0);
  outColor = vec4(uColor * uStrength * side * fall * streak, 1.0);
  outData = vec4(0.0);
}`;
  const dustVS = /* glsl */ `
attribute vec4 aSeed;
uniform vec3 uTop[3]; uniform vec2 uSize; uniform vec3 uDir; uniform float uH; uniform float uTime;
varying vec2 vUv; varying float vFade;
void main(){
  int k = int(aSeed.x + 0.5);
  vec3 top = uTop[k];
  float len = uH / max(-uDir.y, 0.25);
  float t = fract(aSeed.w + uTime * 0.006);
  vec3 p = top + vec3((aSeed.y - 0.5) * uSize.x * 0.9, -0.1, (aSeed.z - 0.5) * uSize.y * 0.9) + uDir * (t * len);
  p += vec3(sin(uTime * 0.31 + aSeed.y * 20.0), 0.6 * sin(uTime * 0.23 + aSeed.z * 17.0), cos(uTime * 0.27 + aSeed.w * 13.0)) * 0.12;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  mv.xy += position.xy * 0.032 * (0.6 + aSeed.y * 0.8);
  vFade = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.75, t) * (0.55 + 0.45 * sin(uTime * 0.7 + aSeed.z * 40.0));
  vUv = uv;
  gl_Position = projectionMatrix * mv;
}`;
  const dustFS = /* glsl */ `
layout(location = 0) out highp vec4 outColor;
layout(location = 1) out highp vec4 outData;
uniform vec3 uColor; uniform float uStrength;
varying vec2 vUv; varying float vFade;
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.1, d);
  outColor = vec4(uColor * uStrength * a * vFade, 1.0);
  outData = vec4(0.0);
}`;

  /**
   * opts: { scene, sun, skylights:[{x,z,w,d}], ceilingY, lamps:[{pos:Vector3, target:Vector3}] }
   */
  Paint.createLighting = function (opts) {
    const { scene, sun, skylights, ceilingY } = opts;
    const original = { pos: sun.position.clone(), color: sun.color.clone(), intensity: sun.intensity, target: sun.target.position.clone() };
    const target = new THREE.Object3D(); target.position.set(0, 2.5, 0); scene.add(target);

    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera; sc.left = -19; sc.right = 19; sc.top = 19; sc.bottom = -19; sc.near = 2; sc.far = 55;
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.025; sun.shadow.radius = 1;

    let idx = 0, from = toState(PRESETS[0]), to = toState(PRESETS[0]), blendT = 1;
    const cur = toState(PRESETS[0]);
    const neutral = toState(NEUTRAL);
    let full = true, enabled = false;

    /* light shafts: one soft parallelepiped per skylight, rebuilt when the sun moves */
    const shaftMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: shaftVS, fragmentShader: shaftFS,
      uniforms: { uColor: { value: new THREE.Color() }, uStrength: { value: 0 } },
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      /* add colour, leave the alpha/bloom mask and the data buffer untouched */
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor
    });
    const shafts = skylights.map(s => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(24 * 3), 3));
      const uv = new Float32Array(24 * 2);
      for (let f = 0; f < 4; f++) uv.set([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], f * 12);
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      const m = new THREE.Mesh(g, shaftMat); m.frustumCulled = false; m.renderOrder = 5; m.userData.noOutline = true;
      scene.add(m); return { s, g, m };
    });
    let lastDir = new THREE.Vector3();
    function buildShafts(dir) {
      const len = ceilingY / Math.max(0.25, -dir.y);
      const off = dir.clone().multiplyScalar(len);
      shafts.forEach(({ s, g }) => {
        const y = ceilingY - 0.02;
        const T = [[s.x - s.w / 2, y, s.z - s.d / 2], [s.x + s.w / 2, y, s.z - s.d / 2], [s.x + s.w / 2, y, s.z + s.d / 2], [s.x - s.w / 2, y, s.z + s.d / 2]];
        const B = T.map(p => [p[0] + off.x, p[1] + off.y, p[2] + off.z]);
        const pos = g.attributes.position.array; let o = 0;
        for (let f = 0; f < 4; f++) {
          const a = T[f], b = T[(f + 1) % 4], c = B[(f + 1) % 4], d = B[f];
          [a, b, c, a, c, d].forEach(p => { pos[o++] = p[0]; pos[o++] = p[1]; pos[o++] = p[2]; });
        }
        g.attributes.position.needsUpdate = true;
        g.computeBoundingSphere();
      });
    }

    /* dust motes: instanced billboards drifting down the shafts */
    const N = 320;
    const plane = new THREE.PlaneGeometry(1, 1);
    const dg = new THREE.InstancedBufferGeometry();
    dg.index = plane.index; dg.setAttribute('position', plane.attributes.position); dg.setAttribute('uv', plane.attributes.uv);
    const seeds = new Float32Array(N * 4);
    for (let i = 0; i < N; i++) seeds.set([i % skylights.length, Math.random(), Math.random(), Math.random()], i * 4);
    dg.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
    dg.instanceCount = N;
    const dustMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: dustVS, fragmentShader: dustFS,
      uniforms: {
        uTop: { value: skylights.map(s => new THREE.Vector3(s.x, ceilingY, s.z)) },
        uSize: { value: new THREE.Vector2(skylights[0].w, skylights[0].d) },
        uDir: { value: new THREE.Vector3() }, uH: { value: ceilingY }, uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffe6bf) }, uStrength: { value: 0 }
      },
      transparent: true, depthWrite: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor
    });
    const dust = new THREE.Mesh(dg, dustMat); dust.frustumCulled = false; dust.renderOrder = 6; dust.userData.noOutline = true;
    scene.add(dust);

    /* exhibit lamps */
    const u = U();
    opts.lamps.slice(0, u.uLampPos.value.length).forEach((l, i) => { u.uLampPos.value[i].copy(l.pos); u.uLampTarget.value[i].copy(l.target); });
    const lampCount = Math.min(opts.lamps.length, u.uLampPos.value.length);
    u.uLampCos.value.set(Math.cos(THREE.MathUtils.degToRad(25)), Math.cos(THREE.MathUtils.degToRad(15)));

    function apply(s) {
      const pos = target.position.clone().addScaledVector(s.dir, -30);
      sun.position.copy(pos); sun.target = target;
      sun.color.copy(s.sun); sun.intensity = s.sunI;
      u.uFillSky.value.copy(s.sky); u.uFillGround.value.copy(s.ground); u.uShadowTint.value.copy(s.tint);
      u.uRimStrength.value = s.rim; u.uRimColor.value.copy(s.sun).lerp(new THREE.Color(0xffe0b0), 0.5);
      u.uLampStrength.value = s.lamp; u.uLampCount.value = s.lamp > 0 ? lampCount : 0;
      u.uBulb.value = 0.35 + s.bulb;
      if (u.uFairy) u.uFairy.value = 0.9 + s.bulb * 0.7; u.uSkyColor.value.copy(s.skyColor); u.uSkyGlow.value = s.skyGlow;
      shaftMat.uniforms.uColor.value.copy(s.sun).lerp(new THREE.Color(0xfff1d6), 0.4); shaftMat.uniforms.uStrength.value = s.shaft;
      dustMat.uniforms.uDir.value.copy(s.dir); dustMat.uniforms.uColor.value.copy(s.sun).lerp(new THREE.Color(0xfff6e6), 0.5); dustMat.uniforms.uStrength.value = s.dust;
      shafts.forEach(x => { x.m.visible = s.shaft > 0.001; }); dust.visible = s.dust > 0.001;
      if (lastDir.distanceToSquared(s.dir) > 1e-6) { buildShafts(s.dir); lastDir.copy(s.dir); }
    }

    return {
      presets: PRESETS,
      get name() { return full ? PRESETS[idx].name : NEUTRAL.name; },
      get state() { return full ? cur : neutral; },
      /* full=false shows the neutral rig used for the earlier build stages */
      setFull(v) { full = v; },
      setEnabled(v) {
        enabled = v;
        sun.castShadow = v;
        if (!v) {
          sun.position.copy(original.pos); sun.color.copy(original.color); sun.intensity = original.intensity;
          target.position.set(0, 0, 0); sun.target = target;
          shafts.forEach(x => { x.m.visible = false; }); dust.visible = false;
        } else {
          target.position.set(0, 2.5, 0); lastDir.set(0, 0, 0);
        }
      },
      next() {
        from = toState(PRESETS[idx]); lerpState(from, from, cur, 1);
        idx = (idx + 1) % PRESETS.length; to = toState(PRESETS[idx]); blendT = 0;
        return PRESETS[idx].name;
      },
      /* finish any running time-of-day blend immediately */
      snap() { blendT = 1; lerpState(cur, from, to, 1); },
      update(dt, time) {
        dustMat.uniforms.uTime.value = time;
        if (!enabled) return;
        if (blendT < 1) { blendT = Math.min(1, blendT + dt / 1.6); const e = blendT * blendT * (3 - 2 * blendT); lerpState(cur, from, to, e); }
        apply(full ? cur : neutral);
      }
    };
  };
})();

export default Paint;