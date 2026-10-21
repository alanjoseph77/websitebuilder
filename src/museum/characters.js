/*
 * Celebration Museum for websitebuilder — characters (boy/girl walkers, couples, visitor route).
 * Generated from the museum page; edit freely.
 */
/* Includes characters from Summer Cycle by Prasenjit — MIT License, Copyright (c) 2026 Prasenjit
   https://github.com/StarKnightt/summer-cycle */
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// ../react/stub/empty.js
var empty_exports = {};
var init_empty = __esm({
  "../react/stub/empty.js"() {
  }
});

// src/characters/index.ts
import * as THREE9 from "three";

// src/characters/character.ts
import * as THREE7 from "three";

// src/characters/loader.ts
import * as THREE from "three";
var ASSETS = {
  boy: "assets/characters/boy.vrm",
  girl: "assets/characters/girl.vrm",
  clips: {
    idle: "assets/animations/idle.fbx",
    walk: "assets/animations/walk.fbx",
    look: "assets/animations/look_at_painting.fbx",
    point: "assets/animations/point.fbx",
    talk: "assets/animations/talk.fbx",
    sit: "assets/animations/sit.fbx",
    dance: "assets/animations/dance.fbx"
  }
};
var HEIGHTS = { boy: 1.75, girl: 1.62 };
var libsPromise = null;
function loadLibs() {
  if (!libsPromise) {
    libsPromise = Promise.all([
      import("three/examples/jsm/loaders/GLTFLoader.js"),
      import("three/examples/jsm/loaders/FBXLoader.js"),
      import("@pixiv/three-vrm")
    ]).then(([g, f, v]) => ({ GLTFLoader: g.GLTFLoader, FBXLoader: f.FBXLoader, VRM: v }));
  }
  return libsPromise;
}
var bufferCache = /* @__PURE__ */ new Map();
function fetchAsset(url) {
  let p = bufferCache.get(url);
  if (!p) {
    p = fetch(url).then(async (r) => {
      if (!r.ok)
        return null;
      const ct = r.headers.get("content-type") || "";
      if (ct.includes("text/html"))
        return null;
      return r.arrayBuffer();
    }).catch(() => null);
    bufferCache.set(url, p);
  }
  return p;
}
async function loadVRM(url, height) {
  const buf = await fetchAsset(url);
  if (!buf || buf.byteLength < 20)
    return null;
  if (new TextDecoder().decode(new Uint8Array(buf, 0, 4)) !== "glTF")
    return null;
  const L = await loadLibs();
  const loader = new L.GLTFLoader();
  loader.register((parser) => new L.VRM.VRMLoaderPlugin(parser));
  const gltf = await loader.parseAsync(buf, url.replace(/[^/]*$/, ""));
  const vrm = gltf.userData.vrm;
  if (!vrm)
    return null;
  L.VRM.VRMUtils.removeUnnecessaryVertices(gltf.scene);
  if (L.VRM.VRMUtils.combineSkeletons)
    L.VRM.VRMUtils.combineSkeletons(gltf.scene);
  else if (L.VRM.VRMUtils.removeUnnecessaryJoints)
    L.VRM.VRMUtils.removeUnnecessaryJoints(gltf.scene);
  L.VRM.VRMUtils.rotateVRM0(vrm);
  vrm.scene.traverse((o) => {
    o.frustumCulled = false;
  });
  vrm.update(0);
  vrm.scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(vrm.scene);
  const h = Math.max(0.1, box.max.y - box.min.y);
  const scale = height / h;
  vrm.scene.scale.setScalar(scale);
  vrm.scene.position.y = -box.min.y * scale;
  const holder = new THREE.Group();
  holder.name = "vrm-holder";
  holder.add(vrm.scene);
  return { vrm, holder, height, scale };
}
var SKIN = /(_skin|body|face_0|facemouth)/i;
var FLAT = /(eye|brow|lash|teeth|tongue|highlight)/i;
var CLOTH = /(cloth|tops|bottoms|shoes|onepiece|accessory|outer|socks|dress|skirt)/i;
var HAIR = /hair/i;
function stylizeVRM(vrm, opts) {
  const Paint = window.Paint;
  vrm.scene.traverse((o) => {
    if (!o.isMesh)
      return;
    const src = Array.isArray(o.material) ? o.material : [o.material];
    const toon = src.map((m) => {
      const name = String(m.name || "");
      const color = m.color ? m.color.clone() : new THREE.Color(1, 1, 1);
      if (opts.clothTint && CLOTH.test(name))
        color.multiply(opts.clothTint);
      if (opts.hairTint && HAIR.test(name))
        color.multiply(opts.hairTint);
      const surface = FLAT.test(name) ? "unlit" : SKIN.test(name) && !CLOTH.test(name) ? "skin" : "fabric";
      return Paint.toonMaterial({
        surface,
        color,
        map: m.map || null,
        transparent: !!m.transparent,
        alphaTest: m.alphaTest || (m.transparent ? 0 : 0),
        opacity: 1,
        outlineId: opts.outlineId,
        side: m.side
      });
    });
    o.userData.surf = "fabric";
    o.userData.old = o.material;
    o.userData.toon = Array.isArray(o.material) ? toon : toon[0];
    o.castShadow = true;
    o.receiveShadow = true;
  });
}

// src/characters/proceduralBody.ts
import * as THREE2 from "three";
var std = (color, o = {}) => new THREE2.MeshStandardMaterial(Object.assign({ color, roughness: 0.8, metalness: 0 }, o));
function part(geo, mat, parent, surf) {
  const m = new THREE2.Mesh(geo, mat);
  m.userData.surf = surf;
  parent.add(m);
  return m;
}
var BASE_HEIGHT = 1.93;
var lerp = (a2, b, k2) => a2 + (b - a2) * k2;
var ProceduralBody = class {
  constructor(kind, topColor, height, pantsColor) {
    this.object = new THREE2.Group();
    this.root = new THREE2.Group();
    this.legs = [];
    this.upper = new THREE2.Group();
    this.head = new THREE2.Group();
    this.arms = [];
    this.eyes = [];
    this.phase = 0;
    this.amt = 0;
    this.t = 0;
    this.height = height;
    this.s = height / BASE_HEIGHT;
    this.object.scale.setScalar(this.s);
    this.object.add(this.root);
    const isBoy = kind === "boy";
    const skin = std(13012586, { roughness: 0.6 });
    const pants = std(pantsColor ?? (isBoy ? 1908771 : 2830914));
    const shirt = std(new THREE2.Color(topColor));
    const hairM = std(1511437, { roughness: 0.6 });
    const shoeM = std(isBoy ? 986895 : 3811874, { roughness: 0.5 });
    for (const side of [1, -1]) {
      const hip = new THREE2.Group();
      hip.position.set(0.1 * side, 0.92, 0);
      this.root.add(hip);
      part(new THREE2.CylinderGeometry(0.078, 0.066, 0.46, 10), pants, hip, "fabric").position.y = -0.23;
      const knee = new THREE2.Group();
      knee.position.y = -0.45;
      hip.add(knee);
      part(new THREE2.CylinderGeometry(0.064, 0.054, 0.42, 10), pants, knee, "fabric").position.y = -0.21;
      part(new THREE2.BoxGeometry(0.11, 0.08, 0.24), shoeM, knee, "wood").position.set(0, -0.43, 0.05);
      this.legs.push({ hip, knee });
    }
    this.upper.position.y = 0.92;
    this.root.add(this.upper);
    part(new THREE2.BoxGeometry(0.32, 0.16, 0.2), pants, this.upper, "fabric").position.y = 0.02;
    const torso = part(new THREE2.CylinderGeometry(0.19, 0.155, 0.6, 14), shirt, this.upper, "fabric");
    torso.position.y = 0.36;
    torso.scale.z = 0.72;
    if (isBoy) {
      part(new THREE2.BoxGeometry(0.08, 0.17, 0.02), std(16052714), this.upper, "fabric").position.set(0, 0.55, 0.125);
      part(new THREE2.BoxGeometry(0.03, 0.15, 0.02), std(5905442), this.upper, "fabric").position.set(0, 0.53, 0.135);
    }
    part(new THREE2.CylinderGeometry(0.05, 0.055, 0.12, 10), skin, this.upper, "skin").position.y = 0.7;
    this.head.position.y = 0.85;
    this.upper.add(this.head);
    part(new THREE2.SphereGeometry(0.14, 20, 16), skin, this.head, "skin");
    const eye = std(1708560);
    for (const ex of [-0.048, 0.048]) {
      const e = part(new THREE2.SphereGeometry(0.016, 8, 6), eye, this.head, "fabric");
      e.position.set(ex, 0.01, 0.128);
      this.eyes.push(e);
    }
    const cap = part(new THREE2.SphereGeometry(0.152, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM, this.head, "fabric");
    cap.rotation.x = -0.35;
    cap.position.y = 0.015;
    if (!isBoy) {
      part(new THREE2.BoxGeometry(0.28, 0.5, 0.08), hairM, this.head, "fabric").position.set(0, -0.2, -0.1);
      for (const sx of [-0.13, 0.13])
        part(new THREE2.BoxGeometry(0.05, 0.34, 0.12), hairM, this.head, "fabric").position.set(sx, -0.1, -0.02);
    }
    for (const side of [1, -1]) {
      const sh = new THREE2.Group();
      sh.position.set(0.235 * side, 0.6, 0);
      this.upper.add(sh);
      part(new THREE2.CylinderGeometry(0.055, 0.048, 0.58, 10), shirt, sh, "fabric").position.y = -0.29;
      part(new THREE2.SphereGeometry(0.05, 10, 8), skin, sh, "skin").position.y = -0.61;
      this.arms.push(sh);
    }
  }
  update(dt, c2) {
    const k2 = 1 - Math.exp(-dt * 12);
    this.t += dt;
    const t = this.t;
    let hip = [0, 0], knee = [0, 0], armX = [0.04, 0.04], armZ = [0.06, -0.06], y = 0, uz = 0, uy = 0, ux = Math.sin(t * 1.6) * 0.012;
    let headPitchExtra = 0;
    const moving = c2.state === "walk";
    this.amt = lerp(this.amt, moving ? Math.min(1, c2.speed / 1.1) : 0, 1 - Math.exp(-dt * 10));
    if (moving && c2.speed > 0.05)
      this.phase += dt * (3 + 4.2 * c2.speed);
    switch (c2.state) {
      case "sit":
        hip = [-1.45, -1.45];
        knee = [1.45, 1.45];
        armX = [-0.75, -0.75];
        armZ = [0.12, -0.12];
        y = 0.47 / this.s - 0.92;
        break;
      case "dance": {
        const s = Math.sin(t * 7);
        hip = [s * 0.35, -s * 0.35];
        knee = [0.3 + 0.2 * s, 0.3 - 0.2 * s];
        y = Math.abs(s) * 0.06;
        armZ = [2.45 + 0.35 * Math.sin(t * 7), -(2.45 + 0.35 * Math.sin(t * 7 + Math.PI))];
        armX = [-0.2, -0.2];
        uz = Math.sin(t * 3.5) * 0.15;
        uy = Math.sin(t * 1.75) * 0.3;
        break;
      }
      case "look":
        armX = [0.42, 0.42];
        armZ = [0.14, -0.14];
        ux = -0.03;
        break;
      case "point":
        armX = [0.04, -1.5];
        armZ = [0.06, 0.12];
        break;
      case "talk":
        armX = [-0.38 + 0.14 * Math.sin(t * 4.2), -0.32 + 0.14 * Math.sin(t * 3.7 + 1)];
        armZ = [0.16, -0.16];
        headPitchExtra = Math.sin(t * 3.1) * 0.05;
        break;
      default: {
        const s = Math.sin(this.phase), m = this.amt;
        hip = [s * 0.55 * m, -s * 0.55 * m];
        knee = [(0.1 + 0.6 * Math.max(0, Math.sin(this.phase - 1.3))) * m, (0.1 + 0.6 * Math.max(0, Math.sin(this.phase + Math.PI - 1.3))) * m];
        armX = [-s * 0.45 * m + 0.04, s * 0.45 * m + 0.04];
        y = Math.abs(Math.cos(this.phase)) * 0.035 * m;
      }
    }
    if (c2.hold && c2.hold.amount > 1e-3) {
      const i = c2.hold.side === "left" ? 0 : 1;
      const arm = this.arms[i];
      this.object.updateMatrixWorld(true);
      const local = this.upper.worldToLocal(c2.hold.target.clone()).sub(arm.position);
      const zA = Math.atan2(local.x, -local.y);
      const xA = -Math.atan2(local.z, Math.hypot(local.x, local.y));
      armZ[i] = lerp(armZ[i], zA, c2.hold.amount);
      armX[i] = lerp(armX[i], xA, c2.hold.amount);
    }
    for (let i = 0; i < 2; i++) {
      this.legs[i].hip.rotation.x = lerp(this.legs[i].hip.rotation.x, hip[i], k2);
      this.legs[i].knee.rotation.x = lerp(this.legs[i].knee.rotation.x, knee[i], k2);
      this.arms[i].rotation.x = lerp(this.arms[i].rotation.x, armX[i], k2);
      this.arms[i].rotation.z = lerp(this.arms[i].rotation.z, armZ[i], k2);
    }
    this.upper.rotation.set(lerp(this.upper.rotation.x, ux, k2), lerp(this.upper.rotation.y, uy, k2), lerp(this.upper.rotation.z, uz, k2));
    this.root.position.y = lerp(this.root.position.y, y, k2);
    this.head.rotation.y = c2.lookYaw;
    this.head.rotation.x = -c2.lookPitch + headPitchExtra;
    for (const e of this.eyes)
      e.scale.y = 1 - c2.blink * 0.9;
  }
  dispose() {
    this.object.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
      }
    });
  }
};

// src/characters/summerBody.ts
import * as THREE4 from "three";

// src/characters/summerCharacter.js
import * as THREE3 from "three";
var G = THREE3.Mesh;
var Ja = THREE3.MeshStandardMaterial;
var $t = THREE3.Matrix4;
var H = THREE3.Vector3;
var un = THREE3.Euler;
var gr = THREE3.BufferAttribute;
var Ar = THREE3.BufferGeometry;
var di = THREE3.BoxGeometry;
var Fn = THREE3.Color;
var Ia = THREE3.SphereGeometry;
var W = THREE3.Float32BufferAttribute;
var Hr = THREE3.MeshBasicMaterial;
var Pa = THREE3.ShapeGeometry;
var Ui = THREE3.Path;
var Ma = THREE3.PlaneGeometry;
var ni = THREE3.DataTexture;
var At = THREE3.Quaternion;
var V = THREE3.Vector2;
var ja = THREE3.LatheGeometry;
var Ya = THREE3.MeshToonMaterial;
var pi = THREE3.CylinderGeometry;
var fi = THREE3.CircleGeometry;
var La = THREE3.TorusGeometry;
var Oa = THREE3.ExtrudeGeometry;
var Wi = THREE3.Shape;
var Na = THREE3.RingGeometry;
var Li = THREE3.LineCurve3;
var Ci = THREE3.CatmullRomCurve3;
var Dn = THREE3.Object3D;
var On = THREE3.Group;
var c = 1006;
var E = 1023;
var a = 1003;
var k = 1028;
function Wu(e25, t2 = false) {
  let n2 = e25[0].index !== null, r2 = new Set(Object.keys(e25[0].attributes)), i2 = new Set(Object.keys(e25[0].morphAttributes)), a2 = {}, o2 = {}, s2 = e25[0].morphTargetsRelative, c2 = new Ar(), l2 = 0;
  for (let u2 = 0; u2 < e25.length; ++u2) {
    let d2 = e25[u2], f2 = 0;
    if (n2 !== (d2.index !== null))
      return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` + u2 + `. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`), null;
    for (let e26 in d2.attributes) {
      if (!r2.has(e26))
        return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` + u2 + `. All geometries must have compatible attributes; make sure "` + e26 + `" attribute exists among all geometries, or in none of them.`), null;
      a2[e26] === void 0 && (a2[e26] = []), a2[e26].push(d2.attributes[e26]), f2++;
    }
    if (f2 !== r2.size)
      return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` + u2 + `. Make sure all geometries have the same number of attributes.`), null;
    if (s2 !== d2.morphTargetsRelative)
      return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` + u2 + `. .morphTargetsRelative must be consistent throughout all geometries.`), null;
    for (let e26 in d2.morphAttributes) {
      if (!i2.has(e26))
        return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` + u2 + `.  .morphAttributes must be consistent throughout all geometries.`), null;
      o2[e26] === void 0 && (o2[e26] = []), o2[e26].push(d2.morphAttributes[e26]);
    }
    if (t2) {
      let e26;
      if (n2)
        e26 = d2.index.count;
      else if (d2.attributes.position !== void 0)
        e26 = d2.attributes.position.count;
      else
        return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` + u2 + `. The geometry must have either an index or a position attribute`), null;
      c2.addGroup(l2, e26, u2), l2 += e26;
    }
  }
  if (n2) {
    let t3 = 0, n3 = [];
    for (let r3 = 0; r3 < e25.length; ++r3) {
      let i3 = e25[r3].index;
      for (let e26 = 0; e26 < i3.count; ++e26)
        n3.push(i3.getX(e26) + t3);
      t3 += e25[r3].attributes.position.count;
    }
    c2.setIndex(n3);
  }
  for (let e26 in a2) {
    let t3 = Gu(a2[e26]);
    if (!t3)
      return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ` + e26 + ` attribute.`), null;
    c2.setAttribute(e26, t3);
  }
  for (let e26 in o2) {
    let t3 = o2[e26][0].length;
    if (t3 !== 0) {
      c2.morphAttributes = c2.morphAttributes || {}, c2.morphAttributes[e26] = [];
      for (let n3 = 0; n3 < t3; ++n3) {
        let t4 = [];
        for (let r4 = 0; r4 < o2[e26].length; ++r4)
          t4.push(o2[e26][r4][n3]);
        let r3 = Gu(t4);
        if (!r3)
          return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ` + e26 + ` morphAttribute.`), null;
        c2.morphAttributes[e26].push(r3);
      }
    }
  }
  return c2;
}
function Gu(e25) {
  let t2, n2, r2, i2 = -1, a2 = 0;
  for (let o3 = 0; o3 < e25.length; ++o3) {
    let s3 = e25[o3];
    if (t2 === void 0 && (t2 = s3.array.constructor), t2 !== s3.array.constructor)
      return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`), null;
    if (n2 === void 0 && (n2 = s3.itemSize), n2 !== s3.itemSize)
      return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`), null;
    if (r2 === void 0 && (r2 = s3.normalized), r2 !== s3.normalized)
      return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`), null;
    if (i2 === -1 && (i2 = s3.gpuType), i2 !== s3.gpuType)
      return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`), null;
    a2 += s3.count * n2;
  }
  let o2 = new t2(a2), s2 = new gr(o2, n2, r2), c2 = 0;
  for (let t3 = 0; t3 < e25.length; ++t3) {
    let r3 = e25[t3];
    if (r3.isInterleavedBufferAttribute) {
      let e26 = c2 / n2;
      for (let t4 = 0, i3 = r3.count; t4 < i3; t4++)
        for (let i4 = 0; i4 < n2; i4++) {
          let n3 = r3.getComponent(t4, i4);
          s2.setComponent(t4 + e26, i4, n3);
        }
    } else
      o2.set(r3.array, c2);
    c2 += r3.count * n2;
  }
  return i2 !== void 0 && (s2.gpuType = i2), s2;
}
function Ku(e25, t2 = 1e-4) {
  t2 = Math.max(t2, 2 ** -52);
  let n2 = {}, r2 = e25.getIndex(), i2 = e25.getAttribute(`position`), a2 = r2 ? r2.count : i2.count, o2 = 0, s2 = Object.keys(e25.attributes), c2 = {}, l2 = {}, u2 = [], d2 = [`getX`, `getY`, `getZ`, `getW`], f2 = [`setX`, `setY`, `setZ`, `setW`];
  for (let t3 = 0, n3 = s2.length; t3 < n3; t3++) {
    let n4 = s2[t3], r3 = e25.attributes[n4];
    c2[n4] = new r3.constructor(new r3.array.constructor(r3.count * r3.itemSize), r3.itemSize, r3.normalized);
    let i3 = e25.morphAttributes[n4];
    i3 && (l2[n4] || (l2[n4] = []), i3.forEach((e26, t4) => {
      let r4 = new e26.array.constructor(e26.count * e26.itemSize);
      l2[n4][t4] = new e26.constructor(r4, e26.itemSize, e26.normalized);
    }));
  }
  let p2 = t2 * 0.5, m2 = 10 ** Math.log10(1 / t2), h2 = p2 * m2;
  for (let t3 = 0; t3 < a2; t3++) {
    let i3 = r2 ? r2.getX(t3) : t3, a3 = ``;
    for (let t4 = 0, n3 = s2.length; t4 < n3; t4++) {
      let n4 = s2[t4], r3 = e25.getAttribute(n4), o3 = r3.itemSize;
      for (let e26 = 0; e26 < o3; e26++)
        a3 += `${Math.trunc(r3[d2[e26]](i3) * m2 + h2)},`;
    }
    if (a3 in n2)
      u2.push(n2[a3]);
    else {
      for (let t4 = 0, n3 = s2.length; t4 < n3; t4++) {
        let n4 = s2[t4], r3 = e25.getAttribute(n4), a4 = e25.morphAttributes[n4], u3 = r3.itemSize, p3 = c2[n4], m3 = l2[n4];
        for (let e26 = 0; e26 < u3; e26++) {
          let t5 = d2[e26], n5 = f2[e26];
          if (p3[n5](o2, r3[t5](i3)), a4)
            for (let e27 = 0, r4 = a4.length; e27 < r4; e27++)
              m3[e27][n5](o2, a4[e27][t5](i3));
        }
      }
      n2[a3] = o2, u2.push(o2), o2++;
    }
  }
  let g2 = e25.clone();
  for (let t3 in e25.attributes) {
    let e26 = c2[t3];
    if (g2.setAttribute(t3, new e26.constructor(e26.array.slice(0, o2 * e26.itemSize), e26.itemSize, e26.normalized)), t3 in l2)
      for (let e27 = 0; e27 < l2[t3].length; e27++) {
        let n3 = l2[t3][e27];
        g2.morphAttributes[t3][e27] = new n3.constructor(n3.array.slice(0, o2 * n3.itemSize), n3.itemSize, n3.normalized);
      }
  }
  return g2.setIndex(u2), g2;
}
var q = { plain: 0, foliage: 1, planks: 2, roof: 3, shoji: 4, glass: 5, grass: 6, skin: 7, cloth: 8, bark: 9, metal: 10, ground: 11, butterfly: 12, stone: 13, lantern: 14, hair: 15, guard: 16, leafCard: 17, mote: 18, distant: 19, flower: 20, fringeCard: 21, lacquer: 22, sign: 23, signGlow: 24, plaster: 25, glow: 30, fire: 31 };
var J = { sky: 0, ground: 1, water: 2, berm: 3, grass: 4, rice: 5, tree: 6, house: 7, pole: 8, wire: 9, fence: 10, sign: 11, bike: 12, rider: 13, hair: 14, hills: 15, flower: 16, butterfly: 17, skin: 18, eye: 19 };
var qu = new Fn();
function Ju(e25, t2, n2 = 0, r2 = 0) {
  let i2 = e25.attributes.position.count;
  if (!e25.index) {
    let t3 = new Uint32Array(i2);
    for (let e26 = 0; e26 < i2; e26++)
      t3[e26] = e26;
    e25.setIndex(new gr(t3, 1));
  }
  for (let n3 of Object.keys(e25.attributes))
    n3 !== `position` && n3 !== `normal` && n3 !== `uv` && (n3 !== `color` || t2 !== null) && e25.deleteAttribute(n3);
  if (e25.attributes.normal || e25.computeVertexNormals(), e25.attributes.uv || e25.setAttribute(`uv`, new gr(new Float32Array(i2 * 2), 2)), t2 !== null) {
    qu.set(t2);
    let n3 = new Float32Array(i2 * 3);
    for (let e26 = 0; e26 < i2; e26++)
      n3[e26 * 3] = qu.r, n3[e26 * 3 + 1] = qu.g, n3[e26 * 3 + 2] = qu.b;
    e25.setAttribute(`color`, new gr(n3, 3));
  }
  return e25.setAttribute(`aMat`, new gr(new Float32Array(i2).fill(n2), 1)), e25.setAttribute(`aWind`, new gr(new Float32Array(i2).fill(r2), 1)), e25.clearGroups(), e25.morphAttributes = {}, e25;
}
var Yu = new $t();
var Xu = new At();
var Zu = new un();
var Qu = new H();
var $u = new H();
function ed(e25, t2, n2, r2, i2 = 0, a2 = 0, o2 = 0, s2 = 1, c2 = s2, l2 = s2) {
  return Zu.set(i2, a2, o2, `YXZ`), Xu.setFromEuler(Zu), Yu.compose(Qu.set(t2, n2, r2), Xu, $u.set(s2, c2, l2)), e25.applyMatrix4(Yu), e25;
}
function td(e25, t2, n2, r2, i2 = 0) {
  return Ju(new di(e25, t2, n2), r2, i2);
}
function nd(e25, t2, n2, r2, i2 = 0, a2 = 8) {
  return Ju(new pi(e25, t2, n2, a2, 1), r2, i2);
}
function rd(e25, t2, n2 = 0, r2 = 12, i2 = 8) {
  return Ju(new Ia(e25, r2, i2), t2, n2);
}
var id = new H(0, 1, 0);
var ad = new H();
function od(e25, t2, n2, r2, i2 = 0, a2 = 6, o2 = n2) {
  ad.subVectors(t2, e25);
  let s2 = ad.length(), c2 = new pi(o2, n2, s2, a2, 1);
  return c2.translate(0, s2 / 2, 0), Xu.setFromUnitVectors(id, ad.normalize()), Yu.compose(e25, Xu, $u.set(1, 1, 1)), c2.applyMatrix4(Yu), Ju(c2, r2, i2);
}
function sd(e25) {
  let t2 = Wu(e25, false);
  if (!t2)
    throw Error(`mergeGeometries failed (attribute mismatch)`);
  for (let t3 of e25)
    t3.dispose();
  return t2;
}
var cd = `toon`;
var ld = /* @__PURE__ */ new Map();
var ud = null;
function dd(e25) {
  cd = e25;
}
function fd() {
  return ud || (ud = new ni(new Uint8Array([105, 175, 255]), 3, 1, k), ud.minFilter = ud.magFilter = a, ud.generateMipmaps = false, ud.needsUpdate = true), ud;
}
function pd(e25) {
  let t2 = `${cd}|${e25}`, n2 = ld.get(t2);
  return n2 || (n2 = cd === `toon` ? new Ya({ vertexColors: true, side: e25, gradientMap: fd() }) : new Ja({ vertexColors: true, side: e25, roughness: 0.85, metalness: 0 }), n2.name = `character-${t2}`, ld.set(t2, n2)), n2;
}
function md(e25, t2 = 1, n2 = 0) {
  return pd(n2);
}
function hd(e25, t2, n2) {
  let r2 = pd(0).clone();
  return r2.uniforms = n2, r2;
}
var gd = /* @__PURE__ */ new Map();
function _d(e25) {
  let t2 = gd.get(e25);
  if (!t2) {
    let n2 = new Uint8Array(16384), r2 = (e26, t3, n3) => {
      let r3 = Math.min(1, Math.max(0, (n3 - e26) / (t3 - e26)));
      return r3 * r3 * (3 - 2 * r3);
    };
    for (let t3 = 0; t3 < 64; t3++)
      for (let i2 = 0; i2 < 64; i2++) {
        let a2 = (i2 + 0.5) / 64, o2 = (t3 + 0.5) / 64, s2 = 1 - r2(0.6, 1, Math.abs(a2 - 0.5) * 2), c2;
        c2 = e25 === 0 ? 1 - r2(0.15, 1, Math.hypot((a2 - 0.5) * 2, (o2 - 0.5) * 2)) : e25 === 1 ? o2 ** 1.6 * s2 : e25 === 2 ? r2(0.35, 0.62, o2) * s2 : o2 ** 1.6;
        let l2 = (t3 * 64 + i2) * 4;
        n2[l2] = n2[l2 + 1] = n2[l2 + 2] = Math.round(c2 * 255), n2[l2 + 3] = 255;
      }
    t2 = new ni(n2, 64, 64, E), t2.magFilter = t2.minFilter = c, t2.needsUpdate = true, gd.set(e25, t2);
  }
  return t2;
}
var vd = 0.34;
var yd = new H(0, vd, 0.52);
var bd = new H(0, vd, -0.53);
var xd = new H(0, 0.3, 0.06);
var Sd = 0.165;
var Cd = new H(0, 0.98, -0.4);
var wd = new H(0, 0.74, -0.46);
var Td = new H(0, 0.9, 0.27);
var Ed = new H(-0.05, 0.31, 0.32);
var Dd = new H(-0.06, -0.06, 1).normalize();
var Od = new H(-0.4, -0.9, 0.15).normalize();
var kd = { WHEEL_R: vd, WHEELBASE: bd.distanceTo(yd) };
var Ad = { chrome: 26, lens: 27, spoke: 28, gloss: 29 };
var jd = `#c42f36`;
var Y = `#e3e6ea`;
var Md = `#8e949b`;
var Nd = `#222326`;
var Pd = `#2a2522`;
var Fd = `#121010`;
var Id = `#4a423b`;
var Ld = `#4d3327`;
var Rd = `#40271f`;
var zd = jd;
var Bd = `#efe8d8`;
var Vd = `#34373d`;
var Hd = `#1c1c1f`;
var Ud = `#d9232b`;
var Wd = `#f39a1c`;
var Gd = `#fff3d2`;
var Kd = `#d9b057`;
var qd = new H(0, 0.84, 0.25);
var Jd = { hx: 0.182, z0: -0.835, z1: -0.525, y: 1.01, r: 0.035 };
var Yd = { hx: 0.16, z0: -0.815, z1: -0.548, y: 0.768, r: 0.03 };
var Xd = new H(0, 0.77, -0.55);
var X = (e25, t2, n2) => new H(e25, t2, n2);
var Zd = Math.PI * 2;
var Qd = (e25, t2, n2) => {
  let r2 = Math.min(1, Math.max(0, (n2 - e25) / (t2 - e25)));
  return r2 * r2 * (3 - 2 * r2);
};
function $d(e25, t2, n2, r2, i2) {
  let a2 = new Ar();
  return a2.setAttribute(`position`, new W(e25, 3)), a2.setAttribute(`normal`, new W(t2, 3)), a2.setIndex(n2), Array.isArray(r2) ? (a2.setAttribute(`color`, new W(r2, 3)), Ju(a2, null, i2)) : Ju(a2, r2, i2);
}
function Z(e25, t2, n2, r2, i2 = 8, a2 = 0, o2 = 1, s2 = true) {
  let c2 = e25.length > 2 ? new Ci(e25, false, `centripetal`) : new Li(e25[0], e25[1]);
  a2 || (a2 = e25.length > 2 ? Math.max(6, Math.round(c2.getLength() / 0.02)) : 1);
  let l2 = c2.computeFrenetFrames(a2, false), u2 = typeof t2 == `number` ? () => t2 : t2, d2 = [], f2 = [], p2 = [], m2 = new H(), h2 = new H();
  for (let e26 = 0; e26 <= a2; e26++) {
    let t3 = e26 / a2;
    c2.getPointAt(t3, m2);
    let n3 = u2(t3);
    for (let t4 = 0; t4 <= i2; t4++) {
      let r3 = t4 / i2 * Zd;
      h2.copy(l2.normals[e26]).multiplyScalar(Math.cos(r3) * o2).addScaledVector(l2.binormals[e26], Math.sin(r3)), d2.push(m2.x + h2.x * n3, m2.y + h2.y * n3, m2.z + h2.z * n3), h2.normalize(), f2.push(h2.x, h2.y, h2.z);
    }
  }
  let g2 = i2 + 1;
  for (let e26 = 0; e26 < a2; e26++)
    for (let t3 = 0; t3 < i2; t3++) {
      let n3 = e26 * g2 + t3, r3 = n3 + 1, i3 = n3 + g2, a3 = i3 + 1;
      p2.push(n3, r3, i3, r3, a3, i3);
    }
  if (s2)
    for (let e26 of [0, 1]) {
      let t3 = e26 * a2, n3 = l2.tangents[t3].clone().multiplyScalar(e26 ? 1 : -1);
      c2.getPointAt(e26, m2);
      let r3 = d2.length / 3;
      d2.push(m2.x, m2.y, m2.z), f2.push(n3.x, n3.y, n3.z);
      for (let e27 = 0; e27 <= i2; e27++) {
        let r4 = (t3 * g2 + e27) * 3;
        d2.push(d2[r4], d2[r4 + 1], d2[r4 + 2]), f2.push(n3.x, n3.y, n3.z);
      }
      for (let t4 = 0; t4 < i2; t4++)
        e26 ? p2.push(r3, r3 + 1 + t4, r3 + 2 + t4) : p2.push(r3, r3 + 2 + t4, r3 + 1 + t4);
    }
  return $d(d2, f2, p2, n2, r2);
}
function ef(e25, t2, n2, r2, i2 = 48, a2 = 0, o2 = Zd, s2 = false) {
  let c2 = e25.length, l2 = t2 ? c2 : c2 - 1, u2 = 0;
  for (let t3 = 0; t3 < c2; t3++) {
    let [n3, r3] = e25[t3], [i3, a3] = e25[(t3 + 1) % c2];
    u2 += n3 * a3 - i3 * r3;
  }
  let d2 = t2 && u2 > 0 ? 1 : -1, f2 = [];
  for (let t3 = 0; t3 < l2; t3++) {
    let [n3, r3] = e25[t3], [i3, a3] = e25[(t3 + 1) % c2], o3 = i3 - n3, s3 = a3 - r3, l3 = Math.hypot(o3, s3) || 1;
    f2.push([s3 / l3 * d2, -o3 / l3 * d2]);
  }
  let p2 = (e26) => {
    let n3 = (e26 % c2 + c2) % c2, r3 = f2[(n3 - 1 + l2) % l2], i3 = f2[Math.min(n3, l2 - 1)];
    if (!t2 && n3 === 0)
      return f2[0];
    if (!t2 && n3 === c2 - 1)
      return f2[l2 - 1];
    let a3 = r3[0] + i3[0], o3 = r3[1] + i3[1], s3 = Math.hypot(a3, o3) || 1;
    return [a3 / s3, o3 / s3];
  }, m2 = [], h2 = [], g2 = [], _2 = [], v2 = new Fn(), y2 = typeof n2 == `function` ? n2 : () => n2, b2 = i2 + 1, x2 = (e26, t3, n3, r3, s3) => {
    v2.set(y2(s3));
    for (let s4 = 0; s4 <= i2; s4++) {
      let c3 = a2 + (o2 - a2) * s4 / i2, l3 = Math.sin(c3), u3 = Math.cos(c3);
      m2.push(e26, t3 * l3, -t3 * u3), h2.push(n3, r3 * l3, -r3 * u3), g2.push(v2.r, v2.g, v2.b);
    }
  };
  for (let t3 = 0; t3 < l2; t3++) {
    let n3 = (t3 + 1) % c2, r3 = s2 ? p2(t3) : f2[t3], a3 = s2 ? p2(n3) : f2[t3], o3 = m2.length / 3;
    x2(e25[t3][0], e25[t3][1], r3[0], r3[1], t3), x2(e25[n3][0], e25[n3][1], a3[0], a3[1], n3);
    for (let e26 = 0; e26 < i2; e26++) {
      let t4 = o3 + e26, n4 = t4 + 1, r4 = t4 + b2, i3 = r4 + 1;
      _2.push(t4, r4, n4, n4, r4, i3);
    }
  }
  let S2 = X(m2[_2[0] * 3], m2[_2[0] * 3 + 1], m2[_2[0] * 3 + 2]), C2 = X(m2[_2[1] * 3], m2[_2[1] * 3 + 1], m2[_2[1] * 3 + 2]), w2 = X(m2[_2[2] * 3], m2[_2[2] * 3 + 1], m2[_2[2] * 3 + 2]), T2 = C2.sub(S2).cross(w2.sub(S2)), E2 = X(h2[_2[0] * 3], h2[_2[0] * 3 + 1], h2[_2[0] * 3 + 2]);
  if (T2.dot(E2) < 0)
    for (let e26 = 0; e26 < _2.length; e26 += 3)
      [_2[e26 + 1], _2[e26 + 2]] = [_2[e26 + 2], _2[e26 + 1]];
  return $d(m2, h2, _2, g2, r2);
}
function tf(e25, t2, n2) {
  return e25.applyQuaternion(new At().setFromUnitVectors(X(1, 0, 0), t2.clone().normalize())), e25.translate(n2.x, n2.y, n2.z);
}
function nf(e25, t2, n2, r2, i2, a2, o2) {
  let s2 = t2.clone().sub(e25), c2 = s2.length();
  s2.normalize();
  let l2 = Math.abs(s2.y) < 0.9 ? X(0, 1, 0).cross(s2).normalize() : X(1, 0, 0).cross(s2).normalize(), u2 = s2.clone().cross(l2), d2 = [], f2 = Math.round(r2 * 12);
  for (let t3 = 0; t3 <= f2; t3++) {
    let i3 = t3 / f2, a3 = i3 * r2 * Zd;
    d2.push(e25.clone().addScaledVector(s2, i3 * c2).addScaledVector(l2, Math.cos(a3) * n2).addScaledVector(u2, Math.sin(a3) * n2));
  }
  return Z(d2, i2, a2, o2, 5, f2 * 2);
}
function rf(e25, t2) {
  let n2 = e25.hx * 2 - 2 * e25.r, r2 = e25.z1 - e25.z0 - 2 * e25.r, i2 = Math.PI / 2 * e25.r, a2 = 2 * n2 + 2 * r2 + 4 * i2, o2 = (t2 % 1 + 1) % 1 * a2, s2 = [[n2 / 2, (t3) => [t3, e25.z0, 0, -1]], [i2, (t3) => {
    let r3 = -Math.PI / 2 + t3 / i2 * (Math.PI / 2);
    return [n2 / 2 + Math.cos(r3) * e25.r, e25.z0 + e25.r + Math.sin(r3) * e25.r, Math.cos(r3), Math.sin(r3)];
  }], [r2, (t3) => [e25.hx, e25.z0 + e25.r + t3, 1, 0]], [i2, (t3) => {
    let r3 = t3 / i2 * (Math.PI / 2);
    return [n2 / 2 + Math.cos(r3) * e25.r, e25.z1 - e25.r + Math.sin(r3) * e25.r, Math.cos(r3), Math.sin(r3)];
  }], [n2, (t3) => [n2 / 2 - t3, e25.z1, 0, 1]], [i2, (t3) => {
    let r3 = Math.PI / 2 + t3 / i2 * (Math.PI / 2);
    return [-n2 / 2 + Math.cos(r3) * e25.r, e25.z1 - e25.r + Math.sin(r3) * e25.r, Math.cos(r3), Math.sin(r3)];
  }], [r2, (t3) => [-e25.hx, e25.z1 - e25.r - t3, -1, 0]], [i2, (t3) => {
    let r3 = Math.PI + t3 / i2 * (Math.PI / 2);
    return [-n2 / 2 + Math.cos(r3) * e25.r, e25.z0 + e25.r + Math.sin(r3) * e25.r, Math.cos(r3), Math.sin(r3)];
  }], [n2 / 2, (t3) => [-n2 / 2 + t3, e25.z0, 0, -1]]];
  for (let [e26, t3] of s2) {
    if (o2 <= e26)
      return t3(o2);
    o2 -= e26;
  }
  return s2[s2.length - 1][1](s2[s2.length - 1][0]);
}
function af(e25, t2, n2 = 0) {
  let [r2, i2, a2, o2] = rf(Yd, e25), [s2, c2] = rf(Jd, e25);
  return X(r2 + (s2 - r2) * t2 + a2 * n2, Yd.y + (Jd.y - Yd.y) * t2, i2 + (c2 - i2) * t2 + o2 * n2);
}
var of = class {
  constructor() {
    __publicField(this, "list", []);
  }
  push(...e25) {
    return this.list.push(...e25), this;
  }
};
var sf = class {
  constructor() {
    __publicField(this, "group", new On());
    __publicField(this, "steer", new On());
    __publicField(this, "basket", new On());
    __publicField(this, "basketContents", new On());
    __publicField(this, "basketFloor", new Dn());
    __publicField(this, "kick", new On());
    __publicField(this, "frontWheel", new On());
    __publicField(this, "rearWheel", new On());
    __publicField(this, "crankHold", null);
    __publicField(this, "crank", new On());
    __publicField(this, "pedals", []);
    __publicField(this, "bell", new On());
    __publicField(this, "bellLever", new On());
    __publicField(this, "cables", new On());
    __publicField(this, "frontFender", new On());
    __publicField(this, "rearFender", new On());
    __publicField(this, "steerAxis", new H().subVectors(Cd, wd).normalize());
    __publicField(this, "lampMat", hd(J.bike, 0.5, { uLamp: { value: 0 } }));
    __publicField(this, "spokeMats", []);
    __publicField(this, "lastWheel", NaN);
    __publicField(this, "blur", 0);
    __publicField(this, "bellT", -1);
    __publicField(this, "bumpIn", 0);
    __publicField(this, "rat", { b: 0, vb: 0, bz: 0, vbz: 0, f: 0, vf: 0, r: 0, vr: 0, c: 0, vc: 0, cz: 0, vcz: 0 });
    __publicField(this, "lastSteer", 0);
    __publicField(this, "lastSpeed", 0);
    __publicField(this, "frameF", new of());
    __publicField(this, "frameT", new of());
    this.buildFrame(), this.buildRear(), this.buildSteer(), this.buildBasket(), this.buildCrank(), this.group.add(this.rearWheel, this.crank, this.kick), this.rearWheel.position.copy(yd), this.buildWheel(this.rearWheel, true), this.buildWheel(this.frontWheel, false), this.setKick(0);
  }
  setLamp(e25) {
    this.lampMat.uniforms.uLamp.value = Math.min(1, Math.max(0, e25));
  }
  ringBell() {
    this.bellT = 0;
  }
  bump(e25) {
    this.bumpIn = Math.max(this.bumpIn, e25);
  }
  mesh(e25, t2, n2 = 1, r2) {
    let i2 = new G(sd(e25 instanceof of ? e25.list : e25), r2 ?? md(J.bike, n2));
    return i2.userData.bike = true, t2.add(i2), i2;
  }
  setKick(e25) {
    let t2 = Dd.clone().lerp(Od, e25 * e25 * (3 - 2 * e25)).normalize();
    this.kick.quaternion.setFromUnitVectors(X(0, -1, 0), t2);
  }
  update(e25, t2) {
    this.steer.setRotationFromAxisAngle(this.steerAxis, t2.steer), this.frontWheel.rotation.x = -t2.wheel, this.rearWheel.rotation.x = -t2.wheel, this.crank.rotation.x = -t2.crank;
    for (let e26 of this.pedals)
      e26.rotation.x = t2.crank;
    this.setKick(t2.kick ?? 0);
    let n2 = Math.min(Math.max(e25, 0), 1 / 30), r2 = Number.isNaN(this.lastWheel) || n2 <= 0 ? 0 : Math.abs(t2.wheel - this.lastWheel) / n2;
    this.lastWheel = t2.wheel, n2 > 0 && (this.blur += (Qd(2.5, 7, r2) - this.blur) * Math.min(1, n2 * 12));
    for (let e26 of this.spokeMats)
      e26.uniforms.uBlur.value = this.blur;
    if (n2 > 0) {
      let e26 = Math.abs(t2.speed ?? 0), r3 = t2.time ?? 0, i2 = Math.min(1, e26 / 6), a2 = this.rat, o2 = this.bumpIn * 9;
      Math.random() < e26 * n2 * 0.35 && (o2 += (0.6 + Math.random()) * i2 * 2.2), this.bumpIn = 0;
      let s2 = (Math.sin(r3 * 31.7) * Math.sin(r3 * 12.3 + 1.3) + 0.5 * Math.sin(r3 * 47.1 + 0.4)) * i2, c2 = (e26 - this.lastSpeed) / n2, l2 = (t2.steer - this.lastSteer) / n2;
      this.lastSpeed = e26, this.lastSteer = t2.steer;
      let u2 = (e27, t3, r4, i3, a3) => (t3 += (-r4 * e27 - i3 * t3 + a3) * n2, [e27 + t3 * n2, t3]);
      [a2.b, a2.vb] = u2(a2.b, a2.vb, 900, 16, s2 * 40 + o2 * 60 * (Math.random() - 0.3)), [a2.bz, a2.vbz] = u2(a2.bz, a2.vbz, 700, 14, o2 * 30 * (Math.random() - 0.5) - l2 * 3), [a2.f, a2.vf] = u2(a2.f, a2.vf, 1600, 20, s2 * 60 + o2 * 90 * (Math.random() - 0.5)), [a2.r, a2.vr] = u2(a2.r, a2.vr, 1400, 20, s2 * 50 + o2 * 90 * (Math.random() - 0.5)), [a2.c, a2.vc] = u2(a2.c, a2.vc, 60, 5, -c2 * 2.5 + s2 * 6 + o2 * 25 * (Math.random() - 0.5)), [a2.cz, a2.vcz] = u2(a2.cz, a2.vcz, 50, 4, -l2 * 4);
      let d2 = (e27, t3) => Math.max(-t3, Math.min(t3, e27));
      this.basket.rotation.set(d2(a2.b * 6e-3, 0.03), 0, d2(a2.bz * 6e-3, 0.03)), this.frontFender.rotation.x = d2(a2.f * 4e-3, 0.02), this.rearFender.rotation.x = d2(a2.r * 4e-3, 0.02), this.cables.rotation.set(d2(a2.c * 0.01, 0.07), 0, d2(a2.cz * 0.01, 0.05));
    }
    if (this.bellT >= 0) {
      this.bellT += n2;
      let e26 = this.bellT, t3 = e26 < 0.28 ? Math.sin(e26 / 0.28 * Math.PI) : 0;
      this.bellLever.rotation.y = -t3 * 0.7;
      let r3 = Math.exp(-e26 * 7) * Math.sin(e26 * 95);
      this.bell.rotation.set(r3 * 0.06, 0, r3 * 0.05), e26 > 0.9 && (this.bellT = -1, this.bell.rotation.set(0, 0, 0), this.bellLever.rotation.y = 0);
    }
  }
  buildFrame() {
    let e25 = new of(), t2 = new of(), n2 = Ad.gloss, r2 = Ad.chrome, i2 = (t3, r3, i3, a3, o3 = jd, s3 = n2) => e25.push(tf(ef([[-a3 / 2, i3 * 0.9], [-a3 / 2 + 4e-3, i3], [a3 / 2 - 4e-3, i3], [a3 / 2, i3 * 0.9]], false, o3, s3, 20, 0, Zd, true), r3, t3)), a2 = Cd.clone().sub(wd).normalize();
    e25.push(Z([wd, Cd], 0.025, jd, n2, 16)), i2(wd.clone().addScaledVector(a2, 0.02), a2, 0.029, 0.04), i2(Cd.clone().addScaledVector(a2, -0.018), a2, 0.029, 0.036);
    let o2 = X(0, -a2.z, a2.y).multiplyScalar(-1);
    o2.z > 0 && o2.negate();
    let s2 = wd.clone().lerp(Cd, 0.52), c2 = Ju(new pi(0.014, 0.014, 4e-3, 16), Kd, r2);
    c2.scale(1, 1, 1.35), c2.applyQuaternion(new At().setFromUnitVectors(X(0, 1, 0), o2)), c2.translate(s2.x + o2.x * 0.025, s2.y + o2.y * 0.025, s2.z + o2.z * 0.025), e25.push(c2);
    let l2 = Ju(new pi(8e-3, 8e-3, 4e-3, 12), jd, n2);
    l2.scale(1, 1, 1.35), l2.applyQuaternion(new At().setFromUnitVectors(X(0, 1, 0), o2)), l2.translate(s2.x + o2.x * 0.0268, s2.y + o2.y * 0.0268, s2.z + o2.z * 0.0268), e25.push(l2);
    let u2 = [X(0, 0.8, -0.442), X(0, 0.7, -0.365), X(0, 0.57, -0.235), X(0, 0.43, -0.115), X(0, 0.335, -0.01), X(0, xd.y, xd.z)];
    e25.push(Z(u2, (e26) => 0.027 - 3e-3 * e26, jd, n2, 14));
    let d2 = [X(0, 0.885, -0.418), X(0, 0.8, -0.3), X(0, 0.7, -0.1), X(0, 0.635, 0.07), X(0, 0.605, 0.162)];
    e25.push(Z(d2, (e26) => 0.019 - 2e-3 * e26, jd, n2, 12));
    let f2 = qd.clone().sub(xd).normalize();
    e25.push(Z([xd, qd], (e26) => 0.021 - 2e-3 * e26, jd, n2, 14)), i2(qd.clone().addScaledVector(f2, -0.022), f2, 0.024, 0.045), e25.push(tf(ef([[-0.024, 0.029], [-0.04, 0.026], [0.04, 0.026], [0.024, 0.029]], false, Y, r2, 18, 0, Zd, true), f2, qd.clone().addScaledVector(f2, -4e-3))), e25.push(tf(ef([[0, 0], [0, 6e-3], [0.018, 6e-3], [0.018, 0]], false, Y, r2, 8), X(1, 0, 0), qd.clone().add(X(0.02, -6e-3, 0.012)))), e25.push(tf(ef([[-0.042, 0.022], [-0.04, 0.026], [0.04, 0.026], [0.042, 0.022]], false, jd, n2, 18, 0, Zd, true), X(1, 0, 0), xd));
    for (let t3 of [-1, 1])
      e25.push(Z([X(t3 * 0.052, 0.342, 0.515), X(t3 * 0.04, 0.33, 0.3), X(t3 * 0.03, 0.308, 0.09)], (e26) => 0.0105 + 3e-3 * e26, jd, n2, 10)), e25.push(Z([X(t3 * 0.05, 0.352, 0.505), X(t3 * 0.038, 0.58, 0.37), X(t3 * 0.022, 0.8, 0.238)], (e26) => 92e-4 + 2e-3 * e26, jd, n2, 10)), e25.push(ed(td(6e-3, 0.04, 0.05, jd, n2), t3 * 0.054, 0.345, 0.515, -0.3)), e25.push(tf(ef([[0, 0], [0, 9e-3], [7e-3, 9e-3], [7e-3, 0]], false, Y, r2, 6), X(t3, 0, 0), X(t3 * 0.06, yd.y, yd.z)));
    e25.push(Z([X(-0.036, 0.66, 0.325), X(0.036, 0.66, 0.325)], 6e-3, jd, n2, 8));
    let p2 = (t3, n3, r3, i3, a3, o3) => {
      let s3 = Ju(new pi(t3, t3, n3, 12, 1, true, a3, o3), i3, q.plain);
      s3.translate(0, r3, 0), s3.applyQuaternion(new At().setFromUnitVectors(X(0, 1, 0), f2));
      let c3 = xd.clone().addScaledVector(f2, 0.34);
      e25.push(s3.translate(c3.x, c3.y, c3.z));
    };
    p2(0.0212, 0.052, 0, `#f4f3ee`, Math.PI / 2 - 0.75, 1.5), p2(0.0215, 0.012, 0.019, `#2f5da6`, Math.PI / 2 - 0.75, 1.5), p2(0.0215, 9e-3, -4e-3, `#262a33`, Math.PI / 2 - 0.45, 0.9), p2(0.0215, 4e-3, -0.017, `#c23a3a`, Math.PI / 2 - 0.45, 0.35);
    let m2 = (e26) => {
      let t3 = [];
      for (let n4 = 0; n4 < 40; n4++) {
        let r4 = n4 / 40 * Zd;
        t3.push([-xd.z + Math.cos(r4) * (0.108 + e26), xd.y + Math.sin(r4) * (0.108 + e26)]), t3.push([-yd.z + Math.cos(r4) * (0.062 + e26), yd.y + Math.sin(r4) * (0.062 + e26)]);
      }
      t3.sort((e27, t4) => e27[0] - t4[0] || e27[1] - t4[1]);
      let n3 = (e27, t4, n4) => (t4[0] - e27[0]) * (n4[1] - e27[1]) - (t4[1] - e27[1]) * (n4[0] - e27[0]), r3 = [], i3 = [];
      for (let e27 of t3) {
        for (; r3.length >= 2 && n3(r3[r3.length - 2], r3[r3.length - 1], e27) <= 0; )
          r3.pop();
        r3.push(e27);
      }
      for (let e27 = t3.length - 1; e27 >= 0; e27--) {
        let r4 = t3[e27];
        for (; i3.length >= 2 && n3(i3[i3.length - 2], i3[i3.length - 1], r4) <= 0; )
          i3.pop();
        i3.push(r4);
      }
      return new Wi(r3.slice(0, -1).concat(i3.slice(0, -1)).map(([e27, t4]) => new V(e27, t4)));
    }, h2 = Ju(new Oa(m2(0), { depth: 0.012, bevelEnabled: true, bevelThickness: 4e-3, bevelSize: 5e-3, bevelSegments: 2, curveSegments: 4 }), zd, n2);
    h2.rotateY(Math.PI / 2), e25.push(h2.translate(0.074, 0, 0));
    let g2 = Ju(new Oa(m2(-0.012), { depth: 5e-4, bevelEnabled: false, curveSegments: 4 }), Bd, n2), _2 = Ju(new Oa(m2(-0.016), { depth: 8e-4, bevelEnabled: false, curveSegments: 4 }), zd, n2);
    g2.rotateY(Math.PI / 2), _2.rotateY(Math.PI / 2), e25.push(g2.translate(0.0905, 0, 0), _2.translate(0.0908, 0, 0)), e25.push(ed(td(2e-3, 0.022, 0.1, Y, r2), 0.0918, 0.322, 0.27));
    for (let t3 = 0; t3 < 4; t3++)
      e25.push(ed(td(2e-3, 8e-3, 0.012, `#1f3f7a`, q.plain), 0.0925, 0.322, 0.235 + t3 * 0.022));
    e25.push(tf(ef([[-6e-3, 0.02], [-6e-3, 0.048], [6e-3, 0.052], [8e-3, 0.02]], false, Md, q.metal, 28, 0, Zd, false), X(-1, 0, 0), X(-0.06, yd.y, yd.z))), e25.push(ed(td(6e-3, 0.012, 0.09, Md, q.metal), -0.066, yd.y - 0.01, yd.z - 0.05, 0.25));
    let v2 = ef([[-0.04, 0.352], [-0.04, 0.384], [-0.034, 0.39], [0.034, 0.39], [0.04, 0.384], [0.04, 0.352], [0.032, 0.352], [0.032, 0.38], [-0.032, 0.38], [-0.032, 0.352]], true, Y, r2, 14, 0.24 * Math.PI, 0.41 * Math.PI);
    e25.push(v2.translate(0, yd.y, yd.z));
    let y2 = (e26, t3) => {
      let n3 = ef([[0, 0.382], [0, 0.356]], false, t3, q.metal, 10, 0.255 * Math.PI, 0.395 * Math.PI);
      return e26 < 0 && cf(n3), n3.translate(e26 * 0.0412, yd.y, yd.z);
    };
    e25.push(y2(1, Md)), e25.push(y2(-1, Md));
    let b2 = 0.33 * Math.PI, x2 = 0.369, S2 = X(0.042, yd.y + x2 * Math.sin(b2), yd.z - x2 * Math.cos(b2));
    e25.push(tf(ef([[0, 85e-4], [3e-3, 85e-4], [3e-3, 4e-3], [35e-4, 0]], false, Y, r2, 14), X(1, 0, 0), S2)), e25.push(ed(td(4e-3, 0.016, 0.012, Kd, r2), S2.x + 8e-3, S2.y - 4e-3, S2.z, 0, 0, 0.2)), t2.push(ed(td(2e-3, 0.03, 0.016, `#e04848`, q.plain), S2.x + 0.011, S2.y - 0.03, S2.z + 4e-3, 0, 0, 0.12)), this.frameF = e25, this.frameT = t2, this.kick.position.copy(Ed);
    let C2 = new of();
    C2.push(Z([X(0, 0.01, 0), X(0, -0.16, 4e-3), X(0, -0.312, 0)], (e26) => 0.012 - 4e-3 * e26, Y, r2, 8)), C2.push(tf(ef([[-0.014, 0.013], [0.014, 0.013]], false, Md, q.metal, 10), X(1, 0, 0), X(0, 0, 0))), C2.push(ed(td(0.03, 0.01, 0.05, Nd, q.metal), 0, -0.32, 4e-3)), this.mesh(C2, this.kick, 1);
  }
  buildRear() {
    let e25 = this.frameF, t2 = this.frameT, n2 = Ad.chrome, r2 = 0.785, i2 = 0.37, a2 = 0.075, o2 = [X(-0.075, r2, i2), X(-0.075, r2, 0.69), X(-0.0525, r2, 0.716), X(0, r2, 0.724), X(a2 * 0.7, r2, 0.716), X(a2, r2, 0.69), X(a2, r2, i2)];
    e25.push(Z(o2, 58e-4, Y, n2, 8));
    for (let t3 of [0.39, 0.48, 0.57, 0.66])
      e25.push(Z([X(-0.075, r2, t3), X(a2, r2, t3)], 42e-4, Y, n2, 6));
    for (let t3 of [-0.026, 0.026])
      e25.push(Z([X(t3, 0.786, i2), X(t3, 0.786, 0.716)], 42e-4, Y, n2, 6));
    for (let t3 of [-1, 1])
      e25.push(Z([X(t3 * a2, r2, 0.66), X(t3 * 0.072, 0.56, 0.6), X(t3 * 0.06, 0.352, 0.522)], 55e-4, Y, n2, 6)), e25.push(Z([X(t3 * a2, r2, 0.5), X(t3 * 0.06, 0.352, 0.518)], 5e-3, Y, n2, 6)), e25.push(Z([X(t3 * a2, r2, i2), X(t3 * 0.035, 0.755, 0.285)], 45e-4, Y, n2, 6));
    let s2 = 0.798;
    e25.push(Z([X(-0.05, s2, 0.41), X(-0.05, s2, 0.68), X(-0.035, s2, 0.7), X(0.035, s2, 0.7), X(0.05, s2, 0.68), X(0.05, s2, 0.41)], 4e-3, Y, n2, 6));
    for (let e26 of [-1, 1])
      t2.push(nf(X(e26 * 0.03, 0.794, 0.405), X(e26 * 0.062, 0.794, 0.405), 75e-4, 4.5, 17e-4, Y, n2));
    t2.push(Z([X(-0.07, 0.794, 0.405), X(0.07, 0.794, 0.405)], 22e-4, Y, n2, 6)), e25.push(ed(td(0.075, 0.034, 0.012, Ud, q.lantern), 0, 0.755, 0.724)), e25.push(ed(td(0.08, 0.04, 8e-3, Nd, q.metal), 0, 0.755, 0.716)), e25.push(Z([X(0, r2, 0.716), X(0, 0.773, 0.716)], 4e-3, Y, n2, 6));
    let c2 = new Ia(1, 28, 14), l2 = c2.attributes.position;
    for (let e26 = 0; e26 < l2.count; e26++) {
      let t3 = l2.getX(e26), n3 = l2.getY(e26), r3 = l2.getZ(e26), i3 = 0.045 + 0.063 * Qd(-0.75, 0.55, r3), a3 = n3 > 0 ? 0.04 * (1 - 0.3 * Qd(0.45, 1, Math.abs(t3))) + 8e-3 * Qd(0.5, 1, r3) : 0.034 - 0.012 * Qd(-0.2, -1, r3), o3 = 1 + 0.06 * Math.max(0, 1 - Math.abs(n3) * 2);
      l2.setXYZ(e26, t3 * i3 * o3, n3 * a3 + 0.012 * r3 * r3, r3 * 0.135);
    }
    c2.deleteAttribute(`normal`), c2.computeVertexNormals(), e25.push(Ju(c2, Rd, Ad.gloss).translate(Td.x, Td.y - 4e-3, Td.z - 0.03));
    let u2 = [];
    for (let e26 = 0; e26 <= 40; e26++) {
      let t3 = e26 / 40 * Zd, n3 = Math.cos(t3), r3 = Math.sin(t3), i3 = 0.045 + 0.063 * Qd(-0.75, 0.55, n3);
      u2.push(X(r3 * i3 * 1.06, Td.y - 4e-3 + 0.012 * n3 * n3, Td.z - 0.03 + n3 * 0.135));
    }
    t2.push(Z(u2, 35e-4, `#2a1914`, q.plain, 5, 80, 1, false));
    let d2 = qd.clone().sub(xd).normalize(), f2 = qd.clone().addScaledVector(d2, 0.03);
    e25.push(Z([qd.clone().addScaledVector(d2, -0.02), f2], 0.0135, Y, n2, 12)), e25.push(ed(td(0.03, 0.018, 0.03, Y, n2), f2.x, f2.y + 4e-3, f2.z));
    for (let r3 of [-1, 1])
      e25.push(Z([X(0, Td.y - 0.012, Td.z - 0.14), X(r3 * 0.026, Td.y - 0.02, Td.z - 0.06), X(r3 * 0.055, Td.y - 0.018, Td.z + 0.045)], 35e-4, Y, n2, 6)), e25.push(Z([X(r3 * 0.058, f2.y + 2e-3, Td.z + 0.05), X(r3 * 0.02, f2.y + 4e-3, f2.z - 5e-3), X(0, f2.y + 6e-3, f2.z - 0.03)], 38e-4, Y, n2, 6)), t2.push(nf(X(r3 * 0.058, f2.y + 2e-3, Td.z + 0.05), X(r3 * 0.056, Td.y - 0.018, Td.z + 0.048), 0.0105, 4.5, 24e-4, Y, n2));
    this.mesh(e25, this.group, 1), this.mesh(t2, this.group, 0.4);
    let p2 = X(0, 0.66, 0.325);
    this.rearFender.position.copy(p2), this.group.add(this.rearFender);
    let m2 = new of();
    m2.push(ef([[-0.041, 0.355], [-0.034, 0.37], [-0.018, 0.3765], [0, 0.378], [0.018, 0.3765], [0.034, 0.37], [0.041, 0.355], [0.037, 0.3545], [0.031, 0.367], [0.016, 0.3725], [0, 0.374], [-0.016, 0.3725], [-0.031, 0.367], [-0.037, 0.3545]], true, Y, n2, 40, 0.445 * Math.PI, 1.12 * Math.PI, true).translate(0, yd.y, yd.z));
    let h2 = 1.08 * Math.PI, g2 = X(0, yd.y + 0.382 * Math.sin(h2), yd.z - 0.382 * Math.cos(h2));
    m2.push(ed(rd(1, Ud, q.lantern, 14, 8), g2.x, g2.y, g2.z, 0, 0, 0, 0.022, 0.022, 9e-3));
    for (let e26 of [-1, 1]) {
      let t3 = 1.02 * Math.PI;
      m2.push(Z([X(e26 * 0.04, yd.y + 0.36 * Math.sin(t3), yd.z - 0.36 * Math.cos(t3)), X(e26 * 0.06, yd.y + 8e-3, yd.z + 0.012)], 32e-4, Y, n2, 5));
    }
    for (let e26 of m2.list)
      e26.translate(-p2.x, -p2.y, -p2.z);
    this.mesh(m2, this.rearFender, 1);
  }
  buildSteer() {
    this.steer.position.copy(wd), this.group.add(this.steer);
    let e25 = new of(), t2 = new of(), n2 = Ad.gloss, r2 = Ad.chrome, i2 = Cd.clone().sub(wd).normalize();
    e25.push(tf(ef([[0, 0.027], [0.012, 0.029], [0.016, 0.022]], false, Y, r2, 20, 0, Zd, true), i2.clone().negate(), wd)), e25.push(tf(ef([[0, 0.027], [0.01, 0.029], [0.02, 0.03], [0.026, 0.024], [0.03, 0.016]], false, Y, r2, 20, 0, Zd, true), i2, Cd));
    let a2 = X(0, 1.066, -0.382);
    e25.push(Z([Cd, X(0, 1.03, -0.39), a2], 0.0142, Y, r2, 12)), e25.push(tf(ef([[-0.022, 0.012], [-0.02, 0.018], [0.02, 0.018], [0.022, 0.012]], false, Y, r2, 16, 0, Zd, true), X(1, 0, 0), a2));
    let o2 = X(0, 0.722, -0.466);
    e25.push(ed(td(0.118, 0.026, 0.042, Y, r2), o2.x, o2.y, o2.z, Math.atan2(i2.z, i2.y)));
    for (let t3 of [-1, 1])
      e25.push(Z([X(t3 * 0.047, 0.72, -0.466), X(t3 * 0.047, 0.6, -0.49), X(t3 * 0.046, 0.46, -0.522), X(t3 * 0.045, 0.345, -0.532)], (e26) => 0.0135 - 5e-3 * e26, jd, n2, 10)), e25.push(ed(td(6e-3, 0.035, 0.03, jd, n2), t3 * 0.046, bd.y, bd.z)), e25.push(tf(ef([[0, 0], [0, 9e-3], [7e-3, 9e-3], [7e-3, 0]], false, Y, r2, 6), X(t3, 0, 0), X(t3 * 0.052, bd.y, bd.z)));
    e25.push(Z([X(-0.03, 0.735, -0.49), X(-0.035, 0.705, -0.5), X(-0.024, 0.66, -0.497)], 4e-3, Y, r2, 6)), e25.push(Z([X(0.03, 0.735, -0.49), X(0.035, 0.705, -0.5), X(0.024, 0.66, -0.497)], 4e-3, Y, r2, 6)), e25.push(ed(td(0.03, 0.012, 0.014, Y, r2), 0, 0.738, -0.492));
    let s2 = [], c2 = [X(0.345, 1.05, -0.17), X(0.24, 1.05, -0.17), X(0.2, 1.055, -0.215), X(0.15, 1.064, -0.305), X(0.075, 1.067, -0.372), X(0, 1.067, -0.384)];
    for (let e26 of c2)
      s2.push(e26.clone().setX(-e26.x));
    for (let e26 = c2.length - 2; e26 >= 0; e26--)
      s2.push(c2[e26].clone());
    e25.push(Z(s2, 0.011, Y, r2, 10));
    let l2 = [[-0.056, 0], [-0.056, 0.019], [-0.052, 0.021]];
    for (let e26 = 0; e26 <= 8; e26++)
      l2.push([-0.048 + e26 * 0.011, e26 % 2 ? 0.0195 : 0.0182]);
    l2.push([0.051, 0.022], [0.056, 0.024], [0.059, 0.02], [0.059, 0]);
    for (let t3 of [-1, 1]) {
      let n3 = ef(l2, false, Ld, q.plain, 16, 0, Zd, true);
      t3 < 0 && cf(n3), e25.push(n3.translate(t3 * 0.29, 1.05, -0.17)), e25.push(tf(ef([[-9e-3, 0.013], [-7e-3, 0.016], [7e-3, 0.016], [9e-3, 0.013]], false, Y, r2, 12, 0, Zd, true), X(1, 0, 0), X(t3 * 0.226, 1.051, -0.186))), e25.push(Z([X(t3 * 0.228, 1.046, -0.2), X(t3 * 0.245, 1.04, -0.222), X(t3 * 0.3, 1.036, -0.228), X(t3 * 0.335, 1.037, -0.222)], (e26) => 55e-4 - 15e-4 * e26, Y, r2, 6, 0, 0.55)), e25.push(ed(rd(6e-3, Y, r2, 8, 6), t3 * 0.337, 1.037, -0.221));
    }
    let u2 = X(-0.082, 0.63, -0.505);
    e25.push(tf(ef([[-0.035, 0], [-0.035, 0.012], [-0.03, 0.022], [-0.012, 0.028], [0.018, 0.03], [0.024, 0.033], [0.028, 0.032], [0.028, 0.026]], false, Y, r2, 22, 0, Zd, true), X(0, 0, -1), u2)), e25.push(ed(td(0.034, 0.012, 0.018, Y, r2), -0.064, 0.63, -0.5)), e25.push(Z([X(-0.064, 0.618, -0.488), X(-0.036, 0.63, -0.47), X(-0.024, 0.636, -0.44)], 4e-3, Md, q.metal, 6)), e25.push(tf(ef([[-6e-3, 0], [-6e-3, 8e-3], [6e-3, 8e-3], [6e-3, 0]], false, Nd, q.plain, 12), X(0, 0, 1), X(-0.022, 0.638, -0.435)));
    let d2 = tf(ef([[0, 0], [0, 0.027], [4e-3, 0.02], [6e-3, 0]], false, Gd, Ad.lens, 22, 0, Zd, true), X(0, 0, -1), u2.clone().add(X(0, 0, -0.028)));
    this.mesh([lf(d2)], this.steer, 1, this.lampMat);
    for (let t3 of [-1, 1])
      e25.push(Z([X(t3 * 0.13, 0.768, -0.8), X(t3 * 0.09, 0.56, -0.66), X(t3 * 0.056, bd.y + 0.01, bd.z)], 48e-4, Y, r2, 6));
    e25.push(Z([X(0, 0.77, -0.56), X(0, 0.742, -0.5)], 6e-3, Y, r2, 6, 0, 0.4)), this.mesh(e25.list.map(lf), this.steer, 1);
    let f2 = X(0, 1.045, -0.2);
    this.cables.position.copy(f2.clone().sub(wd)), this.steer.add(this.cables);
    let p2 = [Z([X(0.226, 1.043, -0.2), X(0.222, 1.03, -0.26), X(0.16, 0.99, -0.42), X(0.07, 0.905, -0.505), X(0.02, 0.8, -0.505), X(4e-3, 0.745, -0.494)], 33e-4, Hd, q.plain, 5), Z([X(-0.226, 1.043, -0.2), X(-0.222, 1.03, -0.26), X(-0.15, 0.985, -0.41), X(-0.06, 0.89, -0.48), X(-0.034, 0.8, -0.462), X(-0.03, 0.782, -0.452)], 33e-4, Hd, q.plain, 5)];
    t2.push(...p2), this.mesh(t2.list.map((e26) => e26.translate(-f2.x, -f2.y, -f2.z)), this.cables, 0.45);
    let m2 = X(-0.19, 1.078, -0.228);
    this.bell.position.copy(m2.clone().sub(wd)), this.steer.add(this.bell);
    let h2 = new of(), g2 = ef([[0, 0], [2e-3, 0.031], [9e-3, 0.03], [0.017, 0.025], [0.023, 0.015], [0.026, 5e-3], [0.0265, 0]], false, Y, r2, 28, 0, Zd, true);
    g2.rotateZ(Math.PI / 2), h2.push(g2.translate(0, -0.012, 0)), h2.push(ed(rd(55e-4, Y, r2, 8, 6), 0, 0.0155, 0)), h2.push(tf(ef([[-8e-3, 0.0125], [8e-3, 0.0125]], false, Nd, q.metal, 12), X(0.05, 9e-3, -0.09), X(0, -0.024, 0))), this.mesh(h2, this.bell, 1), this.bellLever.position.set(0.012, -8e-3, 0.012), this.bell.add(this.bellLever);
    let _2 = [Z([X(0, 0, 0), X(-0.018, 0, 0.018), X(-0.034, 2e-3, 0.028)], 28e-4, Y, r2, 6, 0, 0.5), ed(rd(6e-3, Y, r2, 10, 6), -0.035, 2e-3, 0.029)];
    this.mesh(_2, this.bellLever, 1);
    let v2 = X(0, 0.71, -0.47);
    this.frontFender.position.copy(v2.clone().sub(wd)), this.steer.add(this.frontFender);
    let y2 = new of();
    y2.push(ef([[-0.039, 0.352], [-0.032, 0.365], [-0.017, 0.3715], [0, 0.373], [0.017, 0.3715], [0.032, 0.365], [0.039, 0.352], [0.035, 0.3515], [0.029, 0.362], [0.015, 0.3675], [0, 0.369], [-0.015, 0.3675], [-0.029, 0.362], [-0.035, 0.3515]], true, Y, r2, 34, 0.08 * Math.PI, 0.64 * Math.PI, true).translate(0, bd.y, bd.z));
    let b2 = 0.08 * Math.PI, x2 = X(0, bd.y + 0.36 * Math.sin(b2), bd.z - 0.36 * Math.cos(b2));
    y2.push(ed(td(0.06, 0.07, 3e-3, `#f1efe8`, q.plain), x2.x, x2.y - 0.03, x2.z - 4e-3, 0.2));
    for (let e26 of [-1, 1]) {
      let t3 = 0.2 * Math.PI;
      y2.push(Z([X(e26 * 0.038, bd.y + 0.355 * Math.sin(t3), bd.z - 0.355 * Math.cos(t3)), X(e26 * 0.052, bd.y + 6e-3, bd.z - 0.01)], 3e-3, Y, r2, 5));
    }
    for (let e26 of y2.list)
      e26.translate(-v2.x, -v2.y, -v2.z);
    this.mesh(y2, this.frontFender, 1), this.frontWheel.position.copy(bd.clone().sub(wd)), this.steer.add(this.frontWheel);
  }
  buildBasket() {
    let e25 = Xd.clone().sub(wd);
    this.basket.position.copy(e25), this.steer.add(this.basket), this.basketContents.position.copy(e25).negate(), this.basket.add(this.basketContents), this.basketFloor.position.set(0, Yd.y + 6e-3, (Yd.z0 + Yd.z1) / 2).sub(wd), this.basketContents.add(this.basketFloor);
    let t2 = Ad.chrome, n2 = [], r2 = [], i2 = [];
    for (let e26 = 0; e26 <= 96; e26++)
      n2.push(af(e26 / 96, 1, 2e-3)), r2.push(af(e26 / 96, 0.52, 2e-3)), i2.push(af(e26 / 96, 0, 1e-3));
    let a2 = [Z(n2, 68e-4, Vd, t2, 8, 192, 1, false), Z(i2, 48e-4, Vd, t2, 6, 192, 1, false)], o2 = [Z(r2, 32e-4, Vd, t2, 5, 192, 1, false)];
    for (let e26 of [-1, 1])
      for (let n3 = 0; n3 < 34; n3++) {
        let r3 = [];
        for (let t3 = 0; t3 <= 10; t3++) {
          let i3 = t3 / 10;
          r3.push(af(n3 / 34 + e26 * 0.12 * i3, 0.02 + i3 * 0.96, e26 * 12e-4));
        }
        o2.push(Z(r3, 21e-4, Vd, t2, 4, 10, 1, false));
      }
    let s2 = Yd.y - 2e-3;
    for (let e26 = -0.12; e26 <= 0.121; e26 += 0.04)
      o2.push(Z([X(e26, s2, Yd.z0 + 0.012), X(e26, s2, Yd.z1 - 0.012)], 26e-4, Vd, t2, 4));
    for (let e26 = Yd.z0 + 0.045; e26 < Yd.z1 - 0.02; e26 += 0.045)
      o2.push(Z([X(-Yd.hx + 0.01, s2, e26), X(Yd.hx - 0.01, s2, e26)], 26e-4, Vd, t2, 4));
    this.mesh(a2.map(lf), this.basketContents, 1), this.mesh(o2.map(lf), this.basketContents, 0.3);
  }
  buildCrank() {
    this.crank.position.copy(xd);
    let e25 = Ad.chrome, t2 = new of(), n2 = new Wi();
    for (let e26 = 0; e26 < 152; e26++) {
      let t3 = e26 / 152 * Zd, r3 = [0.1, 0.1, 0.094, 0.094][e26 % 4], i2 = Math.cos(t3) * r3, a2 = Math.sin(t3) * r3;
      e26 === 0 ? n2.moveTo(i2, a2) : n2.lineTo(i2, a2);
    }
    n2.closePath();
    for (let e26 = 0; e26 < 5; e26++) {
      let t3 = new Ui(), r3 = e26 / 5 * Zd + 0.18, i2 = r3 + Zd / 5 - 0.36;
      t3.absarc(0, 0, 0.078, r3, i2, false), t3.absarc(0, 0, 0.04, i2, r3, true), t3.closePath(), n2.holes.push(t3);
    }
    let r2 = Ju(new Oa(n2, { depth: 4e-3, bevelEnabled: false, curveSegments: 6 }), Y, e25);
    r2.rotateY(Math.PI / 2), t2.push(r2.translate(0.094, 0, 0)), t2.push(tf(ef([[-0.1, 0.012], [0.1, 0.012]], false, Md, q.metal, 12), X(1, 0, 0), X(0, 0, 0)));
    for (let n3 of [1, -1]) {
      let r3 = new Wi();
      r3.moveTo(-0.017, 0), r3.lineTo(-0.011, -0.165), r3.absarc(0, -0.165, 0.011, Math.PI, 0, false), r3.lineTo(0.017, 0), r3.absarc(0, 0, 0.017, 0, Math.PI, false);
      let i2 = Ju(new Oa(r3, { depth: 0.01, bevelEnabled: true, bevelThickness: 2e-3, bevelSize: 2e-3, bevelSegments: 1, curveSegments: 8 }), `#d5d9de`, q.metal);
      i2.rotateY(Math.PI / 2), n3 < 0 && i2.rotateX(Math.PI), t2.push(i2.translate(n3 * 0.104 - 5e-3, 0, 0)), t2.push(tf(ef([[0, 9e-3], [4e-3, 7e-3]], false, Y, e25, 10), X(n3, 0, 0), X(n3 * 0.112, 0, 0)));
      let a2 = new On();
      a2.position.set(n3 * 0.14, -n3 * Sd, 0), this.crank.add(a2);
      let o2 = new of();
      o2.push(tf(ef([[-0.032, 6e-3], [0.05, 6e-3]], false, Y, e25, 8), X(n3, 0, 0), X(0, 0, 0))), o2.push(ed(td(0.09, 0.02, 0.012, Nd, q.metal), n3 * 8e-3, 0, -0.03)), o2.push(ed(td(0.09, 0.02, 0.012, Nd, q.metal), n3 * 8e-3, 0, 0.03));
      for (let e26 of [-1, 1])
        o2.push(ed(td(6e-3, 0.022, 0.07, Md, q.metal), n3 * 8e-3 + e26 * 0.045, 0, 0));
      o2.push(ed(td(0.08, 0.012, 0.05, `#141414`, q.plain), n3 * 8e-3, 4e-3, 0));
      for (let e26 of [-0.037, 0.037])
        o2.push(ed(td(0.05, 0.012, 4e-3, Wd, q.lantern), n3 * 8e-3, 0, e26));
      this.mesh(o2, a2, 1), this.pedals.push(a2);
    }
    this.mesh(t2, this.crank, 1);
  }
  buildWheel(e25, t2) {
    let n2 = Ad.chrome, r2 = new of(), i2 = [];
    for (let e26 = 0; e26 < 20; e26++) {
      let t3 = e26 / 20 * Zd;
      i2.push([Math.cos(t3) * 0.0195, 0.318 + Math.sin(t3) * 0.022]);
    }
    r2.push(ef(i2, true, (e26) => e26 === 5 ? Fd : e26 === 0 || e26 === 10 ? Id : Pd, q.plain, 72, 0, Zd, true)), r2.push(ef([[-0.0115, 0.28200000000000003], [0.0115, 0.28200000000000003], [0.0125, 0.29000000000000004], [0.0122, 0.30400000000000005], [95e-4, 0.30900000000000005], [-95e-4, 0.30900000000000005], [-0.0122, 0.30400000000000005], [-0.0125, 0.29000000000000004]], true, Y, n2, 72)), r2.push(ef([[-0.075, 5e-3], [-0.075, 9e-3], [-0.042, 9e-3], [-0.04, 0.014], [-0.037, 0.031], [-0.032, 0.031], [-0.029, 0.017], [0.029, 0.017], [0.032, 0.031], [0.037, 0.031], [0.04, 0.014], [0.042, 9e-3], [0.075, 9e-3], [0.075, 5e-3]], true, Y, n2, 20)), t2 && r2.push(ef([[0.04, 0.01], [0.04, 0.034], [0.05, 0.03], [0.05, 0.01]], true, Md, q.metal, 16));
    let a2 = Zd / 36 * 0.5, o2 = X(0, Math.sin(a2), -Math.cos(a2));
    r2.push(tf(ef([[0, 32e-4], [0.022, 32e-4]], false, Y, n2, 6), o2.clone().negate(), o2.clone().multiplyScalar(0.28400000000000003))), r2.push(tf(ef([[0, 48e-4], [0.012, 48e-4], [0.014, 3e-3]], false, Nd, q.plain, 8), o2.clone().negate(), o2.clone().multiplyScalar(0.262))), this.mesh(r2, e25, 1);
    let s2 = [], c2 = 0.28200000000000003;
    for (let e26 = 0; e26 < 36; e26++) {
      let t3 = e26 % 2 ? 1 : -1, n3 = Math.floor(e26 / 2), r3 = e26 / 36 * Zd, i3 = r3 + (n3 % 2 ? 1 : -1) * 0.95, a3 = X(t3 * 0.034, Math.sin(i3) * 0.026, -Math.cos(i3) * 0.026), o3 = X(t3 * 4e-3, Math.sin(r3) * c2, -Math.cos(r3) * c2);
      s2.push(Z([a3, o3], 16e-4, `#d9dce0`, Ad.spoke, 4, 1, 1, false));
      let l3 = o3.clone().lerp(a3, 0.035);
      s2.push(Z([o3, l3], 28e-4, `#e8eaed`, Ad.spoke, 5, 1, 1, false));
    }
    for (let e26 of [-1, 1]) {
      let t3 = Ju(new Na(0.032, 0.278, 48, 2), `#c7ccd2`, Ad.spoke);
      t3.rotateY(e26 * Math.PI / 2), t3.translate(e26 * 0.02, 0, 0);
      let n3 = t3.attributes.uv;
      for (let e27 = 0; e27 < n3.count; e27++)
        n3.setXY(e27, 0, 1);
      s2.push(t3);
    }
    let l2 = hd(J.bike, 0, { uBlur: { value: 0 } });
    this.spokeMats.push(l2), this.mesh(s2, e25, 0, l2);
  }
};
function cf(e25) {
  e25.scale(-1, 1, 1);
  let t2 = e25.index;
  for (let e26 = 0; e26 < t2.count; e26 += 3) {
    let n2 = t2.getX(e26 + 1);
    t2.setX(e26 + 1, t2.getX(e26 + 2)), t2.setX(e26 + 2, n2);
  }
  return e25;
}
function lf(e25) {
  return e25.translate(-wd.x, -wd.y, -wd.z);
}
var uf = 1;
var Q = false;
var df = `#f6d9c5`;
var ff = `#3b2c26`;
var pf = `#1d2233`;
var mf = `#f6f4ef`;
var hf = `#3a2a20`;
var gf = `#39486e`;
var _f = `#f3f1ea`;
var vf = `#6b4028`;
var $ = (e25, t2, n2) => new H(e25, t2, n2);
function yf(e25, t2) {
  return new G(e25, md(t2, 1));
}
function bf(e25, t2, n2, r2, i2, a2) {
  let o2 = new H().subVectors(t2, e25), s2 = o2.length();
  s2 = Math.min(Math.max(s2, Math.abs(n2 - r2) + 1e-3), n2 + r2 - 1e-3), o2.normalize();
  let c2 = (n2 * n2 + s2 * s2 - r2 * r2) / (2 * n2 * s2), l2 = Math.sqrt(Math.max(0, 1 - c2 * c2)), u2 = i2.clone().sub(o2.clone().multiplyScalar(i2.dot(o2))).normalize();
  a2.copy(e25).addScaledVector(o2, n2 * c2).addScaledVector(u2, n2 * l2);
}
var xf = class {
  constructor(e25, t2, n2, r2, i2) {
    __publicField(this, "mesh");
    let a2 = t2.length, o2 = new pi(1, 1, 1, 12, (a2 - 1) * 2, true);
    o2.translate(0, 0.5, 0);
    let s2 = o2.attributes.position;
    for (let e26 = 0; e26 < s2.count; e26++) {
      let n3 = s2.getY(e26) * (a2 - 1), r3 = Math.min(a2 - 2, Math.floor(n3)), i3 = n3 - r3, o3 = t2[r3] + (t2[r3 + 1] - t2[r3]) * (i3 * i3 * (3 - 2 * i3));
      s2.setXYZ(e26, s2.getX(e26) * o3, s2.getY(e26), s2.getZ(e26) * o3);
    }
    this.mesh = yf(Ju(Sf(o2), n2, r2), i2), e25.add(this.mesh);
  }
  set(e25, t2) {
    let n2 = new H().subVectors(t2, e25), r2 = n2.length();
    this.mesh.position.copy(e25), this.mesh.quaternion.setFromUnitVectors($(0, 1, 0), n2.normalize()), this.mesh.scale.set(1, r2, 1);
  }
};
function Sf(e25) {
  e25.deleteAttribute(`uv`), e25.deleteAttribute(`normal`);
  let t2 = Ku(e25, 1e-5);
  return t2.computeVertexNormals(), t2;
}
var Cf = (e25, t2, n2) => {
  let r2 = Math.min(1, Math.max(0, (n2 - e25) / (t2 - e25)));
  return r2 * r2 * (3 - 2 * r2);
};
var wf = 1;
var Tf = (e25, t2) => $(Math.sin(e25) * Math.cos(t2), Math.sin(t2), -Math.cos(e25) * Math.cos(t2));
var Ef = 0.03;
var Df = 0.132;
var Of = -0.106;
var kf = [[0.03, 0.088, 0.099, 0.112], [0.01, 0.087, 0.1, 0.11], [-0.012, 0.085, 0.099, 0.103], [-0.028, 0.0825, 0.099, 0.093], [-0.042, 0.0795, 0.098, 0.079], [-0.053, 0.075, 0.096, 0.061], [-0.062, 0.0695, 0.0945, 0.036], [-0.071, 0.0625, 0.0935, 0.013], [-0.08, 0.054, 0.093, -0.01], [-0.088, 0.045, 0.092, -0.031], [-0.095, 0.0355, 0.0905, -0.049], [-0.1, 0.026, 0.0875, -0.061], [-0.1035, 0.016, 0.084, -0.068], [Of, 0, 0.079, -0.072]];
var Af = 1024;
var jf = (() => {
  let e25 = new Float32Array(3075), t2 = kf.length;
  for (let n2 = 0; n2 <= Af; n2++) {
    let r2 = Ef + -0.136 * n2 / Af, i2 = 0;
    for (; i2 < t2 - 2 && r2 < kf[i2 + 1][0]; )
      i2++;
    let a2 = kf[i2][0], o2 = kf[i2 + 1][0], s2 = (r2 - a2) / (o2 - a2);
    for (let r3 = 1; r3 <= 3; r3++) {
      let c2 = kf[i2][r3], l2 = kf[i2 + 1][r3], u2 = i2 > 0 ? (l2 - kf[i2 - 1][r3]) / (o2 - kf[i2 - 1][0]) * (o2 - a2) : r3 === 3 ? 0 : (l2 - c2) * 0.3, d2 = i2 < t2 - 2 ? (kf[i2 + 2][r3] - c2) / (kf[i2 + 2][0] - a2) * (o2 - a2) : l2 - c2, f2 = s2 * s2, p2 = f2 * s2;
      e25[n2 * 3 + r3 - 1] = (2 * p2 - 3 * f2 + 1) * c2 + (p2 - 2 * f2 + s2) * u2 + (-2 * p2 + 3 * f2) * l2 + (p2 - f2) * d2;
    }
  }
  return e25;
})();
var Mf = [0, 0, 0];
function Nf(e25) {
  if (e25 >= Ef) {
    let t3 = Math.min(1, (e25 - Ef) / 0.10200000000000001), n3 = Math.sqrt(Math.max(0, 1 - t3 * t3));
    return Mf[0] = jf[0] * n3, Mf[1] = jf[1] * Math.sqrt(Math.max(0, 1 - t3 ** 1.7)), Mf[2] = jf[2] * n3, Mf;
  }
  let t2 = (e25 - Ef) / -0.136 * Af, n2 = Math.min(1023, Math.max(0, Math.floor(t2))), r2 = Math.min(1, Math.max(0, t2 - n2));
  for (let e26 = 0; e26 < 3; e26++)
    Mf[e26] = jf[n2 * 3 + e26] * (1 - r2) + jf[n2 * 3 + 3 + e26] * r2;
  return Mf;
}
function Pf(e25, t2, n2) {
  if (t2 > Df || t2 < Of)
    return false;
  let [r2, i2, a2] = Nf(t2), o2 = (i2 + a2) / 2;
  if (r2 <= 1e-5 || o2 <= 1e-5)
    return false;
  let s2 = (n2 - (a2 - i2) / 2) / o2;
  return (Math.abs(e25) / r2) ** +(s2 < 0 ? 2 + 0.55 * Cf(0.06, 0, t2) * Cf(-0.098, -0.066, t2) : 2) + s2 * s2 < 1;
}
var Ff = Math.atan2(-0.0435, 0.1);
var If = Math.atan2(-0.061, 0.096);
function Lf(e25) {
  let t2 = Math.atan2(e25.x, -e25.z), n2 = Math.asin(Math.max(-1, Math.min(1, e25.y)));
  if (Math.abs(t2) > 1.2)
    return 0;
  let r2 = n2 - Ff, i2 = 72e-4 * Math.exp(-((t2 / (0.062 + 0.05 * Math.max(0, -r2))) ** 2) - (r2 / (r2 > 0 ? 0.13 : 0.04)) ** 2);
  i2 += 26e-4 * Math.exp(-((t2 / 0.055) ** 2)) * Cf(-0.02, 0.08, r2) * Cf(0.4, 0.22, r2), i2 -= 22e-4 * Math.exp(-((t2 / 0.25) ** 2) - ((n2 - If - 0.075) / 0.05) ** 2), i2 += 14e-4 * Math.exp(-((t2 / 0.16) ** 2) - ((n2 - If - 0.028) / 0.026) ** 2), i2 += 1e-3 * Math.exp(-((t2 / 0.14) ** 2) - ((n2 - If + 0.035) / 0.03) ** 2), i2 -= 12e-4 * Math.exp(-((t2 / 0.3) ** 2) - ((n2 - If + 0.085) / 0.035) ** 2), i2 += 16e-4 * Math.exp(-((t2 / 0.28) ** 2) - ((n2 - If + 0.17) / 0.07) ** 2);
  for (let e26 of [-1, 1])
    i2 += 26e-4 * Math.exp(-(((t2 - e26 * 0.72) / 0.22) ** 2) - ((n2 + 0.2) / 0.16) ** 2);
  return i2;
}
function Rf(e25) {
  let t2 = 0, n2 = 0.2;
  for (let r2 = 0; r2 < 19; r2++) {
    let r3 = (t2 + n2) / 2;
    Pf(e25.x * r3, e25.y * r3, e25.z * r3) ? t2 = r3 : n2 = r3;
  }
  return (t2 + n2) / 2 + Lf(e25);
}
function zf(e25, t2) {
  t2 < -0.012 && (t2 = -0.012 + (t2 + 0.012) * 0.9);
  let n2 = Math.asin(Math.max(-0.99, Math.min(0.99, e25 / 0.1))), r2 = Math.atan2(t2, 0.1);
  for (let i2 = 0; i2 < 8; i2++) {
    let i3 = Tf(n2, r2), a2 = Rf(i3);
    n2 += (e25 - i3.x * a2) / (a2 * Math.cos(r2) * Math.cos(n2) + 1e-4), r2 += (t2 - i3.y * a2) / a2;
  }
  return [n2, r2];
}
var Bf = new H();
var Vf = new H();
var Hf = new H();
var Uf = new H();
function Wf(e25, t2) {
  Bf.set(0, 1, 0).cross(e25), Bf.lengthSq() < 1e-6 && Bf.set(1, 0, 0), Bf.normalize(), Vf.crossVectors(e25, Bf).normalize();
  let n2 = 0.01, r2 = (n3, r3, i3) => {
    let a3 = e25.clone().addScaledVector(Bf, n3).addScaledVector(Vf, r3).normalize();
    return i3.copy(a3).multiplyScalar(t2(a3));
  }, i2 = r2(n2, 0, Hf).sub(r2(-0.01, 0, new H())), a2 = r2(0, n2, Uf).sub(r2(0, -0.01, new H())), o2 = new H().crossVectors(i2, a2).normalize();
  return o2.dot(e25) < 0 ? o2.negate() : o2;
}
var Gf = [[0, 0.72], [0.7, 0.64], [1.05, 0.3], [1.3, 0.14], [1.55, 0.08], [1.8, 0.06], [2.05, -0.2], [2.4, -0.5], [Math.PI, -0.6]];
function Kf(e25) {
  let t2 = Math.abs(e25);
  for (let e26 = 1; e26 < Gf.length; e26++) {
    let [n2, r2] = Gf[e26 - 1], [i2, a2] = Gf[e26];
    if (t2 <= i2) {
      let e27 = (t2 - n2) / (i2 - n2);
      return r2 + (a2 - r2) * (0.5 - 0.5 * Math.cos(e27 * Math.PI));
    }
  }
  return Gf[Gf.length - 1][1];
}
function qf(e25, t2, n2, r2) {
  let i2 = Tf(t2, n2), a2 = Wf(i2, Rf), o2 = i2.clone().multiplyScalar(Rf(i2)), s2 = new $t().lookAt(o2.clone().add(a2), o2, $(0, 1, 0));
  s2.setPosition(o2), e25.applyMatrix4(s2);
  let c2 = e25.attributes.position, l2 = new H(), u2 = new H();
  for (let e26 = 0; e26 < c2.count; e26++) {
    l2.fromBufferAttribute(c2, e26);
    let t3 = l2.clone().sub(o2).dot(a2);
    u2.copy(l2).addScaledVector(a2, -t3).normalize();
    let n3 = Wf(u2, Rf);
    l2.copy(u2).multiplyScalar(Rf(u2)).addScaledVector(n3, r2 + t3), c2.setXYZ(e26, l2.x, l2.y, l2.z);
  }
  return e25.computeVertexNormals(), e25;
}
var Jf = (e25) => 0.014 + 0.042 * Math.max(0, e25.y) ** 1.1 + 0.022 * Math.max(0, e25.z) * (0.6 + 0.4 * Math.max(0, e25.y + 0.3)) + 8e-3 * Math.abs(e25.x) * Cf(-0.1, 0.5, e25.y);
function Yf(e25) {
  let t2 = Math.atan2(e25.x, -e25.z), n2 = Math.asin(Math.max(-1, Math.min(1, e25.y)));
  return -5e-3 + (Jf(e25) + 5e-3) * Cf(0, 0.32, n2 - Kf(t2));
}
function Xf(e25, t2, n2, r2, i2, a2, o2 = 0.35, s2 = 0) {
  let c2 = e25.length, l2 = [], u2 = [], d2 = [];
  for (let i3 = 0; i3 < c2; i3++) {
    let a3 = new H().subVectors(e25[Math.min(i3 + 1, c2 - 1)], e25[Math.max(i3 - 1, 0)]).normalize(), s3 = new H().crossVectors(a3, t2[i3]).normalize(), u3 = new H().crossVectors(s3, a3).normalize(), f3 = e25[i3];
    for (let e26 of [f3.clone().addScaledVector(s3, n2[i3]), f3.clone().addScaledVector(u3, r2[i3]), f3.clone().addScaledVector(s3, -n2[i3]), f3.clone().addScaledVector(u3, -r2[i3] * o2)])
      l2.push(e26.x, e26.y, e26.z);
    d2.push(a3);
  }
  let f2 = (e26) => new H(l2[e26 * 3], l2[e26 * 3 + 1], l2[e26 * 3 + 2]), p2 = (e26, t3, n3, r3) => {
    let i3 = f2(e26), a3 = f2(t3), o3 = f2(n3);
    new H().crossVectors(a3.clone().sub(i3), o3.clone().sub(i3)).dot(r3) < 0 ? u2.push(e26, n3, t3) : u2.push(e26, t3, n3);
  };
  for (let t3 = 0; t3 < c2 - 1; t3++) {
    let n3 = e25[t3].clone().add(e25[t3 + 1]).multiplyScalar(0.5);
    for (let e26 = 0; e26 < 4; e26++) {
      let r3 = t3 * 4 + e26, i3 = t3 * 4 + (e26 + 1) % 4, a3 = r3 + 4, o3 = i3 + 4, s3 = f2(r3).add(f2(i3)).add(f2(a3)).add(f2(o3)).multiplyScalar(0.25).sub(n3);
      p2(r3, i3, a3, s3), p2(i3, o3, a3, s3);
    }
  }
  let m2 = d2[0].clone().negate(), h2 = d2[c2 - 1];
  p2(0, 1, 2, m2), p2(0, 2, 3, m2);
  let g2 = (c2 - 1) * 4;
  p2(g2, g2 + 1, g2 + 2, h2), p2(g2, g2 + 2, g2 + 3, h2);
  let _2 = new Ar();
  if (_2.setAttribute(`position`, new W(l2, 3)), _2.setIndex(u2), _2.computeVertexNormals(), s2 > 0) {
    let e26 = _2.attributes.normal, t3 = _2.attributes.position, n3 = new H(), r3 = new H();
    for (let i3 = 0; i3 < e26.count; i3++)
      n3.fromBufferAttribute(e26, i3), r3.fromBufferAttribute(t3, i3).normalize(), n3.lerp(r3, s2).normalize(), e26.setXYZ(i3, n3.x, n3.y, n3.z);
  }
  return Ju(_2, i2, a2);
}
function Zf(e25, t2, n2, r2, i2, a2, o2, s2 = 0, c2 = false, l2 = 11) {
  let u2 = [], d2 = [], f2 = [], p2 = [];
  for (let m2 = 0; m2 < l2; m2++) {
    let h2 = m2 / (l2 - 1), g2 = e25 + (n2 - e25) * h2 ** 1.25 + o2 * Math.sin(Math.PI * h2), _2 = t2 + (r2 - t2) * h2, v2 = Tf(g2, _2), y2 = c2 ? 1 : Cf(Kf(g2) - 0.3, Kf(g2) + 0.02, _2), b2 = (c2 ? 22e-4 + Math.max(4e-3, Yf(v2)) : 6e-3 + (Jf(v2) - 0.01) * y2) + s2 * h2 * h2;
    u2.push(v2.clone().multiplyScalar(Rf(v2) + b2)), d2.push(Wf(v2, Rf));
    let x2 = i2 * (0.12 + 0.88 * (1 - h2 ** 1.6)) * (1 - 0.6 * h2 ** 8);
    f2.push(x2), p2.push(a2 * (0.4 + 0.6 * x2 / i2));
  }
  return Xf(u2, d2, f2, p2, ff, q.hair, 0.5, 0.8);
}
function Qf(e25, t2) {
  let n2 = e25.clone().normalize(), r2 = Rf(n2) + t2;
  return e25.length() < r2 ? n2.multiplyScalar(r2) : e25;
}
function $f(e25, t2, n2, r2, i2, a2, o2, s2 = 0) {
  let c2 = [], l2 = [], u2 = [], d2 = [];
  for (let i3 = 0; i3 < 8; i3++) {
    let a3 = i3 / 7, o3 = e25 + (n2 - e25) * a3 ** 1.2, s3 = t2 + (r2 - t2) * a3, u3 = Tf(o3, s3), d3 = Cf(Kf(o3) - 0.3, Kf(o3) + 0.02, s3);
    c2.push(u3.clone().multiplyScalar(Rf(u3) + 6e-3 + (Jf(u3) - 9e-3) * d3)), l2.push(Wf(u3, Rf));
  }
  let f2 = c2[7].clone(), p2 = Math.sign(f2.x);
  for (let e26 = 1; e26 <= 7; e26++) {
    let t3 = e26 / 7, n3 = $(f2.x - p2 * (5e-3 + s2) * t3 * t3, f2.y + (i2 - f2.y) * t3, f2.z + o2 * t3);
    c2.push(Qf(n3, 45e-4)), l2.push($(n3.x, 0, n3.z * 0.5).normalize());
  }
  for (let e26 = 0; e26 < 15; e26++) {
    let t3 = e26 / 14, n3 = a2 * (0.1 + 0.9 * (1 - t3 ** 1.5)) * (0.8 + 0.2 * Cf(0, 0.15, t3));
    u2.push(n3), d2.push(4e-3 * (0.4 + 0.6 * n3 / a2));
  }
  return Xf(c2, l2, u2, d2, ff, q.hair, 0.5, 0.8);
}
function ep() {
  let e25 = [], t2 = rd(1, vf, q.plain, 18, 12), n2 = t2.attributes.position;
  for (let e26 = 0; e26 < n2.count; e26++) {
    let t3 = n2.getX(e26), r3 = n2.getY(e26), i3 = n2.getZ(e26) * 0.118 - 0.07, a3 = 0.041 * (1 + 0.1 * Cf(0.02, -0.12, i3) - 0.12 * Cf(-0.14, -0.19, i3)), o2 = 0.03 - 0.018 * Cf(-0.06, -0.18, i3);
    n2.setXYZ(e26, t3 * a3, r3 > 0 ? r3 * o2 : Math.max(r3 * 0.05, -0.03), i3);
  }
  t2.computeVertexNormals(), e25.push(t2);
  let r2 = rd(1, `#2c1b13`, q.plain, 18, 6), i2 = r2.attributes.position;
  for (let e26 = 0; e26 < i2.count; e26++)
    i2.setXYZ(e26, i2.getX(e26) * 0.044, -0.034 + i2.getY(e26) * 55e-4, i2.getZ(e26) * 0.121 - 0.07);
  r2.computeVertexNormals(), e25.push(r2);
  let a2 = td(0.07, 6e-3, 0.014, `#4a2a1a`, q.plain);
  return a2.rotateX(-0.28), e25.push(a2.translate(0, 0.024, -0.075)), sd(e25);
}
var tp = [[-0.03, 0.15, 0.1, 0.104], [0.04, 0.14, 0.09, 0.096], [0.125, 0.114, 0.08, 0.078], [0.2, 0.124, 0.086, 0.082], [0.26, 0.137, 0.093, 0.086], [0.32, 0.143, 0.095, 0.089], [0.37, 0.149, 0.092, 0.089], [0.415, 0.157, 0.085, 0.084], [0.448, 0.157, 0.075, 0.076], [0.472, 0.13, 0.062, 0.065], [0.481, 0.086, 0.05, 0.055], [0.488, 0.056, 0.042, 0.047], [0.492, 0.032, 0.036, 0.04]];
var np = tp;
var rp = 0.492;
var ip = -0.03;
var ap = [0, 0, 0];
function op(e25) {
  let t2 = tp, n2 = t2.length;
  e25 = Math.min(rp, Math.max(ip, e25));
  let r2 = 0;
  for (; r2 < n2 - 2 && e25 > t2[r2 + 1][0]; )
    r2++;
  let i2 = t2[r2][0], a2 = t2[r2 + 1][0], o2 = (e25 - i2) / (a2 - i2), s2 = o2 * o2, c2 = s2 * o2;
  for (let e26 = 1; e26 <= 3; e26++) {
    let l2 = t2[r2][e26], u2 = t2[r2 + 1][e26], d2 = r2 > 0 ? (u2 - t2[r2 - 1][e26]) / (a2 - t2[r2 - 1][0]) * (a2 - i2) : u2 - l2, f2 = r2 < n2 - 2 ? (t2[r2 + 2][e26] - l2) / (t2[r2 + 2][0] - i2) * (a2 - i2) : u2 - l2;
    ap[e26 - 1] = (2 * c2 - 3 * s2 + 1) * l2 + (c2 - 2 * s2 + o2) * d2 + (-2 * c2 + 3 * s2) * u2 + (c2 - s2) * f2;
  }
  return ap;
}
function sp(e25, t2) {
  if (Q)
    return 0;
  let n2 = t2 - 0.315;
  return 0.014 * Math.exp(-(((Math.abs(e25) - 0.054) / 0.05) ** 2)) * Math.exp(-((n2 / (n2 > 0 ? 0.055 : 0.1)) ** 2)) * Cf(0.13, 0.2, t2);
}
var cp = 2.4;
var lp = (e25) => 2e-3 + 0.036 * Math.min(1, Math.max(0, (e25 - 0.402) / 0.086));
function up(e25, t2, n2 = 1) {
  let [r2, i2, a2] = op(t2), o2 = 1 - Math.min(1, Math.abs(e25) / r2) ** +cp;
  return o2 <= 0 ? 0 : n2 > 0 ? a2 * Math.sqrt(o2) : i2 * Math.sqrt(o2) + sp(e25, t2) * o2;
}
function dp(e25, t2, n2) {
  let [r2] = op(e25), i2 = Math.sin(t2), a2 = Math.cos(t2), o2 = r2 * Math.sign(i2) * Math.abs(i2) ** (2 / cp), s2 = a2 >= 0 ? 1 : -1;
  return $(o2 * n2, e25, s2 * up(o2, e25, s2) * n2);
}
function fp(e25, t2, n2, r2) {
  let i2 = 4e-3, a2 = n2 * up(e25, t2, n2), o2 = (n2 * up(e25 + i2, t2, n2) - n2 * up(e25 - i2, t2, n2)) / (2 * i2), s2 = (n2 * up(e25, t2 + i2, n2) - n2 * up(e25, t2 - i2, n2)) / (2 * i2), c2 = $(-o2, -s2, 1).multiplyScalar(n2).normalize();
  return $(e25, t2, a2).addScaledVector(c2, r2);
}
function pp(e25, t2, n2, r2, i2, a2, o2, s2 = 8, c2 = 5) {
  let l2 = [];
  for (let o3 = 0; o3 <= c2; o3++)
    for (let u3 = 0; u3 <= s2; u3++) {
      let d3 = fp(e25 + (t2 - e25) * u3 / s2, n2 + (r2 - n2) * o3 / c2, i2, a2);
      l2.push(d3.x, d3.y, d3.z);
    }
  let u2 = [];
  for (let e26 = 0; e26 < c2; e26++)
    for (let t3 = 0; t3 < s2; t3++) {
      let n3 = e26 * (s2 + 1) + t3, r3 = n3 + 1, a3 = n3 + s2 + 1, o3 = a3 + 1;
      i2 > 0 ? u2.push(n3, r3, a3, r3, o3, a3) : u2.push(n3, a3, r3, r3, a3, o3);
    }
  let d2 = new Ar();
  return d2.setAttribute(`position`, new W(l2, 3)), d2.setIndex(u2), d2.computeVertexNormals(), Ju(d2, o2, q.cloth);
}
function mp(e25, t2, n2, r2, i2, a2, o2 = 3e-3) {
  let s2 = [], c2 = [], l2 = [], u2 = [];
  return e25.forEach(([a3, d2], f2) => {
    let p2 = f2 / (e25.length - 1), m2 = fp(a3, d2, t2, n2), h2 = fp(a3, d2, t2, n2 + 0.01);
    s2.push(m2), c2.push(h2.sub(m2).normalize()), l2.push(r2 + (i2 - r2) * p2), u2.push(o2);
  }), Xf(s2, c2, l2, u2, a2, q.cloth, 1);
}
function hp(e25) {
  Q = e25, ff = e25 ? `#2a201c` : `#3b2c26`, pf = e25 ? `#2f3a4c` : `#1d2233`, mf = e25 ? `#dfe8f1` : `#f6f4ef`, _f = e25 ? `#2a2a30` : `#f3f1ea`, vf = e25 ? `#4a3022` : `#6b4028`, bp = e25 ? 0.18 : 0.158, Sp[0] = e25 ? 0.47 : 0.43, Sp[1] = e25 ? 0.46 : 0.42, Cp = e25 ? [0.3, 0.28] : [0.27, 0.255], tp = e25 ? [[-0.03, 0.172, 0.1, 0.108], [0.04, 0.158, 0.092, 0.098], [0.125, 0.138, 0.086, 0.086], [0.2, 0.142, 0.092, 0.086], [0.26, 0.152, 0.1, 0.09], [0.32, 0.16, 0.104, 0.094], [0.37, 0.168, 0.1, 0.094], [0.415, 0.178, 0.09, 0.088], [0.448, 0.178, 0.078, 0.078], [0.472, 0.148, 0.064, 0.066], [0.481, 0.098, 0.052, 0.056], [0.488, 0.064, 0.044, 0.048], [0.492, 0.038, 0.038, 0.042]] : np;
}
var gp = 11;
var _p = [0, 0, 0, 0, 0.04, 0.08, 0.1, -0.12, 0.05, 0.08, 0.1];
var vp = [0, 0, 0, 0, 0.08, -0.1, 0.12, 0.32, -0.12, 0.1, -0.12];
var yp = () => ({ torsoP: new H(), torsoQ: new At(), head: new H(), ponyX: Array(gp).fill(0), ponyZ: Array(gp).fill(0), hip: [new H(), new H()], ankle: [new H(), new H()], kneePole: [new H(), new H()], legL: [0.43, 0.42], footQ: [new At(), new At()], wrist: [new H(), new H()], elbowPole: [new H(), new H()], armL: [[0.27, 0.26], [0.27, 0.26]] });
var bp = 0.158;
var xp = (e25) => $(e25 * bp, 0.425, -6e-3);
var Sp = [0.43, 0.42];
var Cp = [0.27, 0.255];
var wp = (e25) => 0.55 - 0.17 * e25;
var Tp = (e25) => 0.3 + 0.08 * e25;
var Ep = (e25) => 2 * Tp(e25) / wp(e25);
var Dp = new un();
var Op = (e25) => e25 - Math.floor(e25);
function kp(e25, t2) {
  let n2 = new G(new Ma(e25, t2).rotateX(-Math.PI / 2), new Hr({ color: 657938, transparent: true, opacity: 0.38, alphaMap: _d(0), depthWrite: false }));
  return n2.name = `blobShadow`, n2.position.y = 6e-3, n2.renderOrder = 1, n2;
}
var Ap = /* @__PURE__ */ new Map();
function jp(e25, t2, n2) {
  let r2 = e25.join() + `|` + t2 + `|` + n2, i2 = Ap.get(r2);
  return i2 || (i2 = new Hr({ color: new Fn().setRGB(e25[0], e25[1], e25[2]), transparent: true, opacity: t2, alphaMap: n2 === 5 ? null : _d(n2), depthWrite: false }), Ap.set(r2, i2)), i2;
}
var Mp = null;
function Np() {
  return Mp ?? (Mp = new Hr({ color: 14478591, transparent: true, opacity: 0.08, depthWrite: false, side: 2 })), Mp;
}
var Pp = class {
  constructor() {
    __publicField(this, "root", new On());
    __publicField(this, "lean", new On());
    __publicField(this, "walker", new On());
    __publicField(this, "gripHands", []);
    __publicField(this, "walkHands", []);
    __publicField(this, "lenses", []);
    __publicField(this, "eyes", []);
    __publicField(this, "blinkT", 2.5);
    __publicField(this, "blinkK", -1);
    __publicField(this, "skirtCap");
    __publicField(this, "pelvis");
    __publicField(this, "shortLegs", []);
    __publicField(this, "fringe", []);
    __publicField(this, "sway", { a: 0, va: 0, l: 0, vl: 0, yaw: 0, pitch: 0 });
    __publicField(this, "bouquet", new On());
    __publicField(this, "bq", { x: 0, vx: 0, z: 0, vz: 0 });
    __publicField(this, "walkShadow");
    __publicField(this, "onFoot", false);
    __publicField(this, "poseA", yp());
    __publicField(this, "poseB", yp());
    __publicField(this, "standK", 0);
    __publicField(this, "bike", new sf());
    __publicField(this, "steer", this.bike.steer);
    __publicField(this, "body", new On());
    __publicField(this, "torso", new On());
    __publicField(this, "head", new On());
    __publicField(this, "pony", []);
    __publicField(this, "ponyLen", []);
    __publicField(this, "ponyS", null);
    __publicField(this, "skirt");
    __publicField(this, "skirtGeo");
    __publicField(this, "thighA", []);
    __publicField(this, "thighB", []);
    __publicField(this, "thigh", []);
    __publicField(this, "shin", []);
    __publicField(this, "socks", []);
    __publicField(this, "shinA", []);
    __publicField(this, "shinB", []);
    __publicField(this, "upperArm", []);
    __publicField(this, "foreArm", []);
    __publicField(this, "knees", []);
    __publicField(this, "elbows", []);
    __publicField(this, "feet", []);
    __publicField(this, "wrists", []);
    __publicField(this, "fppOn", false);
    __publicField(this, "fppArms", false);
    __publicField(this, "fppKeep", []);
    __publicField(this, "sleeves", []);
    __publicField(this, "seatCover");
    this.root.add(this.lean), this.lean.add(this.bike.group), this.buildBasketLoad(0.77, -0.68), this.buildHands(), this.buildBody(), this.root.add(kp(0.9, 1.9)), this.walkShadow = kp(0.75, 0.75), this.walkShadow.visible = false, this.walker.add(this.walkShadow);
  }
  add(e25, t2 = this.lean, n2 = J.bike) {
    let r2 = yf(e25, n2);
    return t2.add(r2), r2;
  }
  buildBasketLoad(e25, t2) {
    let n2 = [], r2 = `#553622`, i2 = `#2e1f16`, a2 = t2 + 0.05, o2 = 0.235, s2 = e25 + o2, c2 = new On();
    c2.position.set(0.01, e25, a2), c2.rotation.set(-0.06, 0.1, 0);
    let l2 = [];
    l2.push([ed(td(0.28, o2, 0.1, `#6a4630`, q.cloth), 0, o2 / 2, 0), J.bike]), l2.push([ed(td(0.286, 0.014, 0.108, r2, q.cloth), 0, 0.239, 0), J.rider]);
    let u2 = new Wi(), d2 = 0.143;
    u2.moveTo(-0.143, 0), u2.lineTo(d2, 0), u2.lineTo(d2, -0.095), u2.quadraticCurveTo(d2, -0.13, 0.10799999999999998, -0.13), u2.lineTo(-0.10799999999999998, -0.13), u2.quadraticCurveTo(-0.143, -0.13, -0.143, -0.095), u2.closePath();
    let f2 = Ju(new Oa(u2, { depth: 0.01, bevelEnabled: false, curveSegments: 3 }), r2, q.cloth);
    l2.push([ed(f2, 0, 0.245, 0.05), J.rider]), l2.push([ed(td(0.036, 0.03, 0.01, `#c9a45a`, q.metal), 0, 0.145, 0.063), J.bike]), l2.push([ed(td(0.012, 0.05, 6e-3, i2, q.cloth), 0, 0.175, 0.063), J.bike]);
    let p2 = Ju(new La(0.045, 8e-3, 5, 10, Math.PI), i2, q.cloth);
    l2.push([ed(p2, 0, 0.245, 0), J.bike]);
    for (let [e26, t3] of l2)
      this.add(e26, c2, t3);
    c2.position.sub(wd), this.bike.basketContents.add(c2);
    for (let e26 of [-1, 1]) {
      let t3 = $(e26 * 0.135, s2 - 0.03, a2), r3 = $(e26 * 0.172, s2 + 0.075, a2 + 0.01), o3 = $(e26 * 0.2, s2 - 0.02, a2 + 0.03);
      n2.push([od(t3, r3, 7e-3, i2, q.cloth, 5), J.rider], [od(r3, o3, 7e-3, i2, q.cloth, 5), J.rider]);
    }
    [[0.125, -0.085, 0.36, -0.7]].forEach(([r3, i3, a3, o3], s3) => {
      let c3 = $(r3, e25 + 0.02, t2 + i3), l3 = $(a3, 1, o3).normalize(), u3 = c3.clone().addScaledVector(l3, 0.3 - s3 * 0.015), d3 = u3.clone().addScaledVector(l3, 0.035);
      n2.push([ed(rd(0.014, `#d9ceb0`, q.plain, 6, 4), c3.x, c3.y, c3.z), J.rider]), n2.push([od(c3, u3, 0.013, `#f3f1e6`, q.plain, 7, 0.012), J.rider]), n2.push([od(u3, d3, 0.012, `#cfe08f`, q.plain, 7, 0.011), J.flower]);
      for (let e26 = 0; e26 < 3; e26++) {
        let t3 = (e26 - 1) * 0.3 + s3 * 0.1, r4 = l3.clone().applyAxisAngle($(0, 0, 1), t3).applyAxisAngle($(1, 0, 0), -0.2 - 0.12 * e26).normalize(), i4 = d3.clone().addScaledVector(r4, 0.13 + 0.03 * ((e26 + s3) % 2));
        n2.push([od(d3, i4, 9e-3, e26 === 1 ? `#4f8a34` : `#3f7a2c`, q.plain, 5, 15e-4), J.flower]);
      }
    });
    for (let [e26, t3] of n2)
      this.add(e26.translate(-wd.x, -wd.y, -wd.z), this.bike.basketContents, t3);
    this.buildBouquet($(-0.075, e25 + 0.01, t2 - 0.075));
  }
  buildBouquet(e25) {
    let t2 = this.bouquet;
    t2.position.copy(e25).sub(wd), this.bike.basketContents.add(t2);
    let n2 = [], r2 = Ju(new pi(0.058, 0.022, 0.2, 12, 1, true), `#d6c49a`, q.cloth);
    r2.translate(0, 0.12, 0), r2.rotateX(-0.12), n2.push([r2, J.bike]), n2.push([ed(nd(0.033, 0.033, 0.018, `#c8342c`, q.cloth, 12), 0, 0.075, -4e-3), J.rider]);
    let i2 = (e26, t3, r3) => {
      n2.push([od($(0, 0.02, 0), e26, 35e-4, `#4a7a30`, q.plain, 4), J.flower]);
      let i3 = e26.clone().normalize(), a2 = new At().setFromUnitVectors($(0, 1, 0), i3.clone().lerp($(0, 0, 1), 0.35).normalize()), o2 = [];
      if (t3 === 0) {
        o2.push(ed(nd(0.022, 0.022, 0.012, `#5a3a1a`, q.plain, 12), 0, 4e-3, 0));
        for (let e27 = 0; e27 < 12; e27++) {
          let t4 = e27 / 12 * Math.PI * 2, n3 = td(0.024, 4e-3, 0.011, `#f2c230`, q.plain);
          n3.translate(0.031, 0, 0), n3.rotateY(t4), o2.push(n3);
        }
      } else if (t3 === 1) {
        o2.push(ed(rd(7e-3, `#f2c230`, q.plain, 6, 4), 0, 4e-3, 0));
        for (let e27 = 0; e27 < 8; e27++) {
          let t4 = td(0.02, 3e-3, 0.011, r3, q.plain);
          t4.translate(0.014, 0, 0), t4.rotateY(e27 / 8 * Math.PI * 2), o2.push(t4);
        }
      } else
        for (let e27 = 0; e27 < 7; e27++)
          o2.push(ed(rd(55e-4, `#fbfaf4`, q.plain, 5, 3), Math.cos(e27 * 2.4) * 0.016 * Math.sqrt(e27 / 7), e27 % 3 * 4e-3, Math.sin(e27 * 2.4) * 0.016 * Math.sqrt(e27 / 7)));
      for (let r4 of o2)
        r4.applyQuaternion(a2), r4.translate(e26.x, e26.y, e26.z), n2.push([r4, t3 === 2 ? J.flower : J.rider]);
    };
    i2($(4e-3, 0.3, 0.02), 0, ``), i2($(-0.04, 0.25, 0.035), 0, ``), i2($(0.045, 0.27, 0.01), 1, `#f2a0c0`), i2($(-0.022, 0.285, -0.03), 1, `#fbf6f0`), i2($(0.03, 0.23, 0.05), 1, `#e070a0`);
    for (let [e26, t3, n3] of [[-0.06, 0.24, 0], [0.06, 0.24, 0.035], [0.015, 0.27, -0.045], [-0.03, 0.22, 0.06], [0.055, 0.21, -0.02]])
      i2($(e26, t3, n3), 2, ``);
    for (let [e26, r3] of n2)
      this.add(e26.scale(1.35, 1.35, 1.35), t2, r3);
  }
  buildHands() {
    for (let e25 of [1, -1]) {
      let t2 = $(e25 * 0.29, 1.05, -0.17), n2 = [], r2 = rd(1, df, q.skin, 14, 10);
      r2.scale(0.05, 0.035, 0.037), n2.push(r2.translate(t2.x, t2.y + 0.01, t2.z + 3e-3));
      let i2 = rd(1, df, q.skin, 12, 8);
      i2.scale(0.047, 0.025, 0.023), n2.push(i2.translate(t2.x + e25 * 2e-3, t2.y - 4e-3, t2.z - 0.024));
      let a2 = rd(1, df, q.skin, 10, 6);
      a2.scale(0.014, 0.013, 0.027), a2.rotateY(e25 * 0.45), a2.rotateX(0.35), n2.push(a2.translate(t2.x - e25 * 0.04, t2.y + 0.016, t2.z - 0.015));
      let o2 = $(e25 * 0.012, 0.026, 0.034).add(t2);
      n2.push(ed(rd(0.025, df, q.skin, 10, 6), o2.x, o2.y, o2.z));
      for (let e26 of n2)
        this.gripHands.push(this.add(e26.translate(-wd.x, -wd.y, -wd.z), this.steer, J.skin));
      this.wrists.push(o2.sub(wd));
    }
  }
  onHead(e25, t2, n2, r2, i2, a2 = this.head, o2 = 1) {
    let s2 = new G(qf(e25, t2, n2, r2), md(i2, o2));
    return a2.add(s2), s2;
  }
  disc(e25, t2, n2, r2 = q.plain) {
    let i2 = Ju(new pi(1, 1, 3e-3, 20, 1), n2, r2);
    return i2.rotateX(Math.PI / 2), i2.scale(e25, t2, 1), i2;
  }
  buildBody() {
    let e25 = this.body;
    this.lean.add(e25);
    let t2 = J.rider, n2 = $(0, Td.y + 0.1, Td.z - 0.02);
    this.torso.position.copy(n2), this.torso.rotation.x = -0.28, e25.add(this.torso);
    let r2 = this.torso, i2 = Fp * 2, a2 = new Ar(), o2 = new Float32Array((i2 + 1) * Ip * 3), s2 = new Float32Array((i2 + 1) * Ip * 3), c2 = new Float32Array((i2 + 1) * Ip * 2), l2 = new Fn(gf);
    for (let e26 = 0; e26 < Ip; e26++)
      for (let t3 = 0; t3 <= i2; t3++) {
        let n3 = e26 * (i2 + 1) + t3, r3 = (t3 % 2 ? 0.8 : 1) * (e26 < 2 ? 1 : 1 - e26 / Ip * 0.04);
        s2[n3 * 3] = l2.r * r3, s2[n3 * 3 + 1] = l2.g * r3, s2[n3 * 3 + 2] = l2.b * r3, c2[n3 * 2] = t3 / i2, c2[n3 * 2 + 1] = e26 / (Ip - 1);
      }
    let u2 = [];
    for (let e26 = 0; e26 < Ip - 1; e26++)
      for (let t3 = 0; t3 < i2; t3++) {
        let n3 = e26 * (i2 + 1) + t3, r3 = n3 + 1, a3 = n3 + i2 + 1, o3 = a3 + 1;
        u2.push(n3, a3, r3, r3, a3, o3);
      }
    a2.setAttribute(`position`, new gr(o2, 3)), a2.setAttribute(`color`, new gr(s2, 3)), a2.setAttribute(`uv`, new gr(c2, 2)), a2.setIndex(u2), Ju(a2, null, q.cloth), this.skirtGeo = a2, this.skirt = new G(a2, md(t2, 1, 2)), this.skirt.frustumCulled = false, e25.add(this.skirt), Q && (this.skirt.visible = false);
    {
      let e26 = new fi(1, 32).rotateX(Math.PI / 2), n3 = e26.attributes.position;
      for (let e27 = 0; e27 < n3.count; e27++) {
        let t3 = n3.getX(e27), r3 = n3.getZ(e27), i3 = Math.hypot(t3, r3);
        if (i3 < 1e-4)
          continue;
        let a3 = dp(Rp, Math.atan2(t3, r3), 1.08);
        n3.setXYZ(e27, a3.x * i3, Rp, a3.z * i3);
      }
      this.skirtCap = new G(Ju(e26, gf, q.cloth), md(t2, 1, 2)), r2.add(this.skirtCap), Q && (this.skirtCap.visible = false);
    }
    let d2 = rd(1, pf, q.cloth, 16, 10);
    d2.scale(Q ? 0.15 : 0.145, Q ? 0.085 : 0.09, Q ? 0.085 : 0.115), this.pelvis = this.add(d2, e25, t2), Q && (this.pelvis.visible = false);
    for (let n3 = 0; n3 < 2; n3++)
      this.shortLegs.push(new xf(e25, Q ? [0.097, 0.0965, 0.096] : [0.093, 0.092, 0.091], pf, q.cloth, t2));
    if (Q)
      for (let e26 of this.shortLegs)
        e26.mesh.visible = false;
    let f2 = rd(0.15, gf, q.cloth, 16, 10);
    f2.scale(1.05, 0.55, 1), f2.translate(n2.x, n2.y - 0.06, n2.z + 0.03), this.seatCover = this.add(f2, e25, t2);
    {
      let e26 = [];
      for (let t3 = 0; t3 <= 40; t3++) {
        let n4 = ip + 0.522 * t3 / 40;
        for (let t4 = 0; t4 < 48; t4++) {
          let r3 = dp(n4, t4 / 48 * Math.PI * 2, 1);
          e26.push(r3.x, n4, r3.z);
        }
      }
      e26.push(0, -0.04, 0, 0, 0.498, 0);
      let n3 = [];
      for (let e27 = 0; e27 < 40; e27++)
        for (let t3 = 0; t3 < 48; t3++) {
          let r3 = (t3 + 1) % 48, i4 = e27 * 48 + t3, a3 = e27 * 48 + r3, o3 = i4 + 48, s3 = a3 + 48;
          n3.push(i4, a3, o3, a3, s3, o3);
        }
      for (let e27 = 0; e27 < 48; e27++) {
        let t3 = (e27 + 1) % 48;
        n3.push(1968, t3, e27, 1969, 1920 + e27, 1920 + t3);
      }
      let i3 = new Ar();
      if (i3.setAttribute(`position`, new W(e26, 3)), i3.setIndex(n3), i3.computeVertexNormals(), i3.attributes.normal.getZ(960) < 0) {
        for (let e27 = 0; e27 < n3.length; e27 += 3)
          [n3[e27 + 1], n3[e27 + 2]] = [n3[e27 + 2], n3[e27 + 1]];
        i3.setIndex(n3), i3.computeVertexNormals();
      }
      this.add(Ju(i3, mf, q.cloth), r2, t2);
    }
    if (Q) {
      let e26 = [], n3 = [];
      for (let t3 = 0; t3 <= 10; t3++)
        for (let n4 = 0; n4 < 48; n4++) {
          let r3 = -0.112 + 0.162 * t3 / 10, i4 = dp(r3, n4 / 48 * Math.PI * 2, 1.035 + 0.03 * Cf(-0.015, -0.1, r3));
          e26.push(i4.x, i4.y, i4.z);
        }
      for (let e27 = 0; e27 < 10; e27++)
        for (let t3 = 0; t3 < 48; t3++) {
          let r3 = (t3 + 1) % 48, i4 = e27 * 48 + t3, a4 = e27 * 48 + r3, o4 = i4 + 48, s4 = a4 + 48;
          n3.push(i4, a4, o4, a4, s4, o4);
        }
      let i3 = new Ar();
      i3.setAttribute(`position`, new W(e26, 3)), i3.setIndex(n3), i3.computeVertexNormals(), r2.add(new G(Ju(i3, pf, q.cloth), md(t2, 1, 2)));
      let a3 = [], o3 = [], s3 = [], c3 = [];
      for (let e27 = 0; e27 <= 48; e27++) {
        let t3 = dp(0.038000000000000006, e27 / 48 * Math.PI * 2 + 1e-3, 1.045);
        a3.push(t3), o3.push($(t3.x, 0, t3.z).normalize()), s3.push(0.017), c3.push(4e-3);
      }
      this.add(Xf(a3, o3, s3, c3, hf, q.cloth, 1), r2, t2);
      let l3 = td(0.034, 0.024, 6e-3, `#b9a26a`, q.metal), u3 = dp(0.038000000000000006, Math.PI, 1.06);
      this.add(l3.translate(u3.x, u3.y, u3.z - 2e-3), r2, t2);
    }
    if (!Q) {
      let e26 = [], n3 = [], i3 = [], a3 = [];
      for (let t3 = 0; t3 <= 48; t3++) {
        let r3 = t3 / 48 * Math.PI * 2 + 1e-3, o3 = dp(Lp + 0.012, r3, 1.035);
        e26.push(o3), n3.push($(o3.x, 0, o3.z).normalize()), i3.push(0.013), a3.push(3e-3);
      }
      this.add(Xf(e26, n3, i3, a3, gf, q.cloth, 1), r2, t2);
    }
    {
      let e26 = [], t3 = [];
      for (let t4 = 0; t4 <= 6; t4++) {
        let n4 = 0.405 + 0.095 * t4 / 6, r3 = lp(n4);
        for (let t5 = 0; t5 <= 6; t5++) {
          let i3 = fp((2 * t5 / 6 - 1) * r3, n4, -1, 12e-4);
          e26.push(i3.x, i3.y, i3.z);
        }
      }
      for (let e27 = 0; e27 < 6; e27++)
        for (let n4 = 0; n4 < 6; n4++) {
          let r3 = e27 * 7 + n4, i3 = r3 + 1, a3 = r3 + 6 + 1, o3 = a3 + 1;
          t3.push(r3, a3, i3, i3, a3, o3);
        }
      let n3 = new Ar();
      n3.setAttribute(`position`, new W(e26, 3)), n3.setIndex(t3), n3.computeVertexNormals(), r2.add(new G(Ju(n3, df, q.skin), md(J.skin, 0)));
    }
    for (let e26 of [-1, 1])
      ;
    this.add(pp(-0.085, 0.085, 0.44, 0.502, 1, 3e-3, mf, 10, 4), r2, t2), this.add(mp([[0, 0.402], [0, 0.33], [0, 0.25], [0, 0.18], [0, Q ? 0.06 : Lp + 0.02]], -1, 12e-4, Q ? 0.012 : 55e-4, Q ? 0.012 : 55e-4, Q ? `#d2dde8` : `#e9e6de`, 8e-4), r2, t2);
    {
      let e26 = [];
      for (let t3 of Q ? [0.372, 0.305, 0.238, 0.172, 0.105] : [0.372, 0.305, 0.238, 0.172]) {
        let n3 = fp(0, t3, -1, 22e-4), r3 = fp(0, t3, -1, 0.01), i3 = new pi(48e-4, 48e-4, 18e-4, 10);
        i3.applyQuaternion(new At().setFromUnitVectors($(0, 1, 0), r3.sub(n3).normalize())), e26.push(Ju(i3.translate(n3.x, n3.y, n3.z), `#e4ddcc`, q.plain));
      }
      r2.add(new G(sd(e26), md(t2, 0.5)));
    }
    {
      let e26 = [], n3 = (t3, n4, r3, i3, a3, o3 = 26e-4) => {
        let s3 = [], c3 = [], l3 = [], u3 = [];
        for (let e27 = 0; e27 <= 8; e27++) {
          let d3 = e27 / 8, f3 = t3 + (r3 - t3) * d3, p3 = n4 + (i3 - n4) * d3, m3 = fp(f3, p3, a3, 12e-4);
          s3.push(m3), c3.push(fp(f3, p3, a3, 0.01).sub(m3).normalize()), l3.push(o3 * Math.sin(Math.PI * (0.08 + 0.84 * d3))), u3.push(5e-4);
        }
        e26.push(Xf(s3, c3, l3, u3, `#d5d8e2`, q.cloth, 1));
      };
      for (let e27 of [-1, 1])
        n3(e27 * 0.05, 0.145, e27 * 0.06, 0.27, -1), n3(e27 * 0.1, 0.14, e27 * 0.11, 0.24, -1), n3(e27 * 0.02, 0.145, e27 * 0.03, 0.2, -1, 2e-3), n3(e27 * 0.04, 0.14, e27 * 0.05, 0.3, 1), n3(e27 * 0.095, 0.14, e27 * 0.1, 0.26, 1);
      r2.add(new G(sd(e26), md(t2, 0)));
    }
    for (let n3 of [-1, 1]) {
      let i3 = xp(n3), a3 = rd(Q ? 0.06 : 0.058, mf, q.cloth, 14, 10);
      Q ? a3.scale(0.92, 0.78, 0.9) : a3.scale(1, 0.92, 0.95), this.fppKeep.push(this.add(a3.translate(i3.x - n3 * 6e-3, i3.y + 4e-3, i3.z), r2, t2));
      let o3 = new On();
      e25.add(o3), this.sleeves.push(o3);
      let s3 = new ja((Q ? [$(0.054, -0.015, 0), $(0.06, 0, 0), $(0.062, 0.05, 0), $(0.061, 0.1, 0), $(0.06, 0.15, 0), $(0.059, 0.17, 0)] : [$(0.05, -0.015, 0), $(0.061, 0, 0), $(0.069, 0.04, 0), $(0.068, 0.08, 0), $(0.062, 0.11, 0), $(0.058, 0.125, 0)]).map((e26) => new V(e26.x, e26.y)), 20), c3 = s3.attributes.position;
      for (let e26 = 0; e26 < c3.count; e26++) {
        let t3 = c3.getX(e26), n4 = c3.getY(e26), r3 = c3.getZ(e26), i4 = Q ? 1 : 1 + 0.035 * Math.cos(Math.atan2(t3, r3) * 7) * Cf(0, 0.05, n4) * Cf(0.125, 0.07, n4);
        c3.setXYZ(e26, t3 * i4, n4, r3 * i4);
      }
      s3.computeVertexNormals();
      let l3 = new G(Ju(s3, mf, q.cloth), md(t2, 1, 2));
      o3.add(l3);
      let u3 = Ju(new La(Q ? 0.059 : 0.058, Q ? 6e-3 : 75e-4, 6, 20), Q ? `#cfdbe7` : `#ebe9e3`, q.cloth);
      u3.rotateX(Math.PI / 2), u3.translate(0, Q ? 0.168 : 0.122, 0);
      let d3 = new G(u3, md(t2, 1));
      o3.add(d3), this.fppKeep.push(l3, d3);
    }
    {
      let e26 = new xf(r2, Q ? [0.044, 0.04, 0.037, 0.035] : [0.036, 0.031, 0.028, 0.027], df, q.skin, J.skin);
      e26.mesh.geometry.scale(1, 1, Q ? 0.96 : 0.92), e26.set($(0, 0.44, 0.012), $(0, 0.62, 6e-3));
    }
    this.head.position.set(0, 0.646, -0.01), this.head.scale.setScalar(wf), this.head.name = `riderHead`, r2.add(this.head);
    let p2 = new Ia(1, 72, 54), m2 = p2.attributes.position, h2 = new H();
    for (let e26 = 0; e26 < m2.count; e26++)
      h2.fromBufferAttribute(m2, e26).normalize(), h2.multiplyScalar(Rf(h2)), m2.setXYZ(e26, h2.x, h2.y, h2.z);
    this.add(Ju(Sf(p2), df, q.skin), this.head, J.skin), this.buildFace(), this.buildHair(), this.buildLimbs(), this.drapeSkirt(0, 0);
  }
  swayFringe(e25, t2, n2) {
    let r2 = this.sway, i2 = e25 > 0 ? Math.min(e25, 0.05) : 0;
    if (i2 === 0)
      return;
    let a2 = this.head.rotation.y, o2 = this.head.rotation.x, s2 = (a2 - r2.yaw) / i2, c2 = (o2 - r2.pitch) / i2;
    r2.yaw = a2, r2.pitch = o2;
    let l2 = Math.sin(t2 * 1.7) * 0.6 + Math.sin(t2 * 3.1 + 1.3) * 0.4, u2 = em(-s2 * 0.05, -0.12, 0.12) + l2 * (0.02 + 4e-3 * n2), d2 = em(6e-3 * n2 + c2 * 0.03, 0, 0.1) + (0.5 + 0.5 * l2) * 0.01;
    r2.va += (60 * (u2 - r2.a) - 7 * r2.va) * i2, r2.a += r2.va * i2, r2.vl += (60 * (d2 - r2.l) - 7 * r2.vl) * i2, r2.l = Math.max(0, r2.l + r2.vl * i2);
    for (let e26 of this.fringe) {
      let i3 = Math.sin(t2 * 4.3 + e26.ph) * 0.012 * (0.3 + 0.1 * n2);
      tm.setFromAxisAngle(e26.radial, (r2.a + i3) * e26.gain * (e26.long ? 1.4 : 1)), nm.setFromAxisAngle(e26.side, -r2.l * e26.gain), e26.g.quaternion.copy(tm).multiply(nm);
    }
  }
  buildFace() {
    let e25 = 0.043, t2 = -0.012, [n2, r2] = zf(e25, t2), i2 = (e26, t3, n3, r3, i3) => {
      let a3 = [], o3 = [], s3 = [];
      for (let n4 = 0; n4 < e26.length; n4++) {
        let i4 = Tf(e26[n4], t3[n4]), c3 = Wf(i4, Rf);
        a3.push(i4.clone().multiplyScalar(Rf(i4)).addScaledVector(c3, r3)), o3.push(c3), s3.push(5e-4);
      }
      return Xf(a3, o3, n3, s3, i3, q.plain, 1);
    }, a2 = (e26, t3, n3, r3) => {
      let a3 = [], o3 = [];
      for (let [t4, n4] of e26) {
        let [e27, r4] = zf(t4, n4);
        a3.push(e27), o3.push(r4);
      }
      return i2(a3, o3, t3, n3, r3);
    }, o2 = (e26, t3, n3, r3, i3 = this.head) => {
      let a3 = new G(e26, jp(t3, n3, r3));
      return a3.renderOrder = 2, i3.add(a3), this.lenses.push(a3), a3;
    }, s2 = (e26, t3, n3, r3, i3, a3, s3 = 0) => {
      let [c3, l3] = zf(t3, n3);
      return o2(qf(e26, c3, l3, r3), i3, a3, s3);
    }, c2 = [0.84, 0.58, 0.55];
    for (let e26 of [-1, 1]) {
      let t3 = e26 * n2, l3 = new On(), u2 = Tf(t3, r2), d2 = Rf(u2), f2 = u2.clone().multiplyScalar(d2);
      l3.position.copy(f2), this.head.add(l3), this.eyes.push(l3);
      let p2 = (e27) => e27.translate(-f2.x, -f2.y, -f2.z), m2 = 0.0185 / d2, h2 = (Q ? 0.0122 : 0.0138) / d2, g2 = (Q ? 0 : 0.02) * h2, _2 = (e27) => h2 * Math.max(0, 1 - (e27 / m2) ** 2) ** 0.52 + e27 / m2 * g2 - 0.04 * h2 * (e27 / m2) ** 3, v2 = (e27) => -0.86 * h2 * Math.max(0, 1 - (e27 / m2) ** 2) ** 0.62 + e27 / m2 * g2, y2 = (n3, i3, a3) => {
        let o3 = Tf(t3 + e26 * n3, r2 + i3);
        return o3.clone().multiplyScalar(Rf(o3)).addScaledVector(Wf(o3, Rf), a3).sub(f2);
      }, b2 = (e27, t4, n3, r3, i3, a3, o3) => {
        let s3 = [y2(e27, t4, i3)];
        for (let a4 = 0; a4 <= 28; a4++) {
          let c4 = a4 / 28 * Math.PI * 2, l5 = e27 + Math.cos(c4) * n3, u3 = t4 + Math.sin(c4) * r3;
          o3 && (l5 = Math.max(-m2 * 0.985, Math.min(m2 * 0.985, l5)), u3 = Math.min(_2(l5), Math.max(v2(l5), u3))), s3.push(y2(l5, u3, i3));
        }
        let c3 = new Ar().setFromPoints(s3), l4 = [];
        for (let e28 = 1; e28 <= 28; e28++)
          l4.push(0, e28, e28 + 1);
        c3.setIndex(l4), c3.computeVertexNormals();
        let d3 = c3.attributes.normal;
        if ($(d3.getX(0), d3.getY(0), d3.getZ(0)).dot(u2) < 0) {
          for (let e28 = 0; e28 < l4.length; e28 += 3)
            [l4[e28 + 1], l4[e28 + 2]] = [l4[e28 + 2], l4[e28 + 1]];
          c3.setIndex(l4), c3.computeVertexNormals();
        }
        return Ju(c3, a3, q.plain);
      }, x2 = 3, S2 = (e27) => {
        let t4 = e27.attributes.color, n3 = new G(e27, jp([t4.getX(0), t4.getY(0), t4.getZ(0)], 1, 5));
        return n3.renderOrder = x2++, l3.add(n3), this.lenses.push(n3), n3;
      };
      S2(b2(0, 0, m2, h2 * 1.6, 8e-4, `#fbf7f2`, true));
      let C2 = -0.04 * m2, w2 = 0.02 * h2, T2 = 0.55 * m2, E2 = 1.06 * h2;
      S2(b2(C2, w2, T2, E2, 18e-4, `#6a391d`, true)), S2(b2(C2, w2 - 0.3 * h2, T2 * 0.8, E2 * 0.55, 22e-4, `#a8683a`, true)), S2(b2(C2, w2 - 0.42 * h2, T2 * 0.5, E2 * 0.3, 25e-4, `#cf9255`, true)), S2(b2(C2, w2 + 0.02 * h2, T2 * 0.46, E2 * 0.52, 28e-4, `#23120c`, true)), S2(b2(C2, w2 + 0.62 * h2, T2 * 1.05, E2 * 0.5, 3e-3, `#3a1f15`, true));
      {
        let e27 = [], t4 = [], n3 = [];
        for (let r4 = 0; r4 <= 16; r4++) {
          let i4 = -m2 + 2 * m2 * r4 / 16, a3 = _2(i4), o3 = v2(i4), s3 = y2(i4, a3, 34e-4), c3 = y2(i4, a3 - 0.5 * (a3 - o3), 34e-4);
          e27.push(s3.x, s3.y, s3.z, c3.x, c3.y, c3.z), t4.push(r4 / 16, 1, r4 / 16, 0), r4 < 16 && n3.push(r4 * 2, r4 * 2 + 1, r4 * 2 + 2, r4 * 2 + 1, r4 * 2 + 3, r4 * 2 + 2);
        }
        let r3 = new Ar();
        r3.setAttribute(`position`, new W(e27, 3)), r3.setAttribute(`uv`, new W(t4, 2)), r3.setIndex(n3);
        let i3 = new G(r3, jp([0.25, 0.12, 0.1], 0.45, 4));
        i3.material.side = 2, i3.renderOrder = 2, l3.add(i3), this.lenses.push(i3);
      }
      S2(b2(C2 - 0.22 * m2, w2 + 0.34 * h2, 0.15 * m2, 0.24 * h2, 42e-4, `#ffffff`, false)), S2(b2(C2 + 0.2 * m2, w2 - 0.4 * h2, 0.065 * m2, 0.065 * m2, 42e-4, `#fff6ee`, false));
      let D2 = [], O2 = [], k2 = [];
      for (let n3 = 0; n3 <= 14; n3++) {
        let i3 = m2 * (-0.98 + n3 / 14 * 1.98);
        D2.push(t3 + e26 * i3), O2.push(r2 + _2(i3) + 0.06 * h2);
        let a3 = n3 / 14;
        k2.push(Q ? 9e-4 + 12e-4 * a3 ** 1.2 : 8e-4 + 26e-4 * a3 ** 1.5);
      }
      Q || (D2.push(t3 + e26 * m2 * 1.08), O2.push(r2 + g2 + 0.22 * h2), k2.push(7e-4)), l3.add(new G(p2(i2(D2, O2, k2, 36e-4, `#1e120e`)), md(J.eye, -1)));
      let A2 = [], j2 = [], ee2 = [];
      for (let n3 = 0; n3 <= 6; n3++) {
        let i3 = m2 * (0.95 - n3 / 6 * 0.95);
        A2.push(t3 + e26 * i3), j2.push(r2 + v2(i3) - 0.07 * h2), ee2.push(5e-4 * (1 - n3 / 7) + 15e-5);
      }
      Q || l3.add(new G(p2(i2(A2, j2, ee2, 2e-3, `#8a5a48`)), md(J.eye, -1))), o2(p2(qf(new fi(1, 20).scale(0.017, 55e-4, 1), t3 + e26 * 0.1 * m2, r2 + g2 * 0.5 + 1.5 * h2, 12e-4)), [0.88, 0.56, 0.48], 0.3, 0, l3);
      let te2 = [], M2 = [], ne2 = [];
      for (let n3 = 0; n3 <= 8; n3++) {
        let i3 = m2 * (-0.55 + n3 / 8 * 1.4);
        te2.push(t3 + e26 * i3), M2.push(r2 + _2(i3) + 0.42 * h2), ne2.push(6e-4 * Math.sin(n3 / 8 * Math.PI) + 12e-5);
      }
      l3.add(new G(p2(i2(te2, M2, ne2, 18e-4, `#8e5e50`)), md(J.eye, -1)));
      let N2 = [], re2 = [];
      for (let t4 = 0; t4 <= 10; t4++) {
        let n3 = t4 / 10;
        Q ? (N2.push([e26 * (0.017 + 0.05 * n3), 0.013000000000000001 + 22e-4 * Math.sin(Math.PI * (0.15 + 0.7 * n3)) - 35e-4 * n3 * n3]), re2.push(26e-4 * (1 - 0.55 * n3 ** 1.6) * (0.75 + 0.25 * Cf(0, 0.2, n3)))) : (N2.push([e26 * (0.02 + 0.047 * n3), 0.014499999999999999 + 45e-4 * Math.sin(Math.PI * (0.2 + 0.75 * n3)) - 4e-3 * n3 * n3]), re2.push(11e-4 * (1 - 0.7 * n3 ** 1.4) * (0.6 + 0.4 * Cf(0, 0.25, n3))));
      }
      this.head.add(new G(a2(N2, re2, 28e-4, Q ? `#2e1e18` : `#4b3128`), md(J.eye, -1))), Q || s2(new fi(1, 24).scale(0.015, 68e-4, 1), e26 * 0.05, -0.039, 12e-4, [0.96, 0.54, 0.52], 0.38);
      for (let t4 = 0; t4 < (Q ? 0 : 3); t4++) {
        let n3 = e26 * (0.044 + 55e-4 * t4);
        this.head.add(new G(a2([[n3 - e26 * 16e-4, -0.0418], [n3 + e26 * 16e-4, -0.0362]], [3e-4, 3e-4], 16e-4, `#eea39a`), md(J.eye, -1)));
      }
      s2(new Ma(0.03, 0.06, 4, 6), e26 * 0.074, -0.05, 1e-3, c2, 0.28);
    }
    o2(qf(new fi(1, 24).scale(0.035, 0.03, 1), 0, -1.2, 12e-4), c2, 0.5, 0), s2(new fi(1, 28).scale(0.06, 0.04, 1), 0, -0.058, 9e-4, [0.97, 0.7, 0.62], 0.16), o2(qf(new Ma(0.17, 0.05, 16, 6), 0, 0.4, 11e-4), c2, 0.62, 2);
    let l2 = a2([[-45e-4, -0.036], [-55e-4, -0.043], [-35e-4, -0.048]], [35e-5, 6e-4, 3e-4], 1e-3, `#d59a88`);
    this.head.add(new G(l2, md(J.eye, -1))), s2(new fi(1, 16).scale(45e-4, 17e-4, 1), 5e-4, -0.0505, 9e-4, [0.82, 0.5, 0.46], 0.35), s2(new fi(1, 16).scale(22e-4, 8e-3, 1), 4e-3, -0.03, 12e-4, [1, 0.97, 0.94], 0.35);
    {
      let e26 = [], t3 = [];
      for (let n3 = 0; n3 <= 12; n3++) {
        let r3 = -1 + n3 / 12 * 2;
        Q ? (e26.push([r3 * 0.014, -0.0685 - 8e-4 * (1 - r3 * r3) + 1e-3 * r3 ** 4]), t3.push(5e-4 * (1 - 0.6 * r3 * r3) + 15e-5)) : (e26.push([r3 * 0.0125, -0.0685 - 16e-4 * (1 - r3 * r3) + 24e-4 * r3 ** 4]), t3.push(6e-4 * (1 - 0.55 * r3 * r3) + 18e-5));
      }
      this.head.add(new G(a2(e26, t3, 12e-4, Q ? `#8a4a40` : `#8a4038`), md(J.eye, -1))), Q || s2(new fi(1, 16).scale(65e-4, 22e-4, 1), 0, -0.0725, 9e-4, [0.92, 0.5, 0.48], 0.32);
    }
    this.buildEars(), Q || this.buildGlasses(e25, t2);
  }
  buildEars() {
    for (let e25 of [-1, 1]) {
      let t2 = -0.021, n2 = 0.012, [r2, i2, a2] = Nf(t2), o2 = (i2 + a2) / 2, s2 = (n2 - (a2 - i2) / 2) / o2, c2 = e25 * r2 * Math.sqrt(Math.max(0, 1 - s2 * s2)) * 0.965, l2 = rd(1, df, q.skin, 14, 10), u2 = l2.attributes.position;
      for (let t3 = 0; t3 < u2.count; t3++) {
        let n3 = u2.getX(t3), r3 = u2.getY(t3), i3 = u2.getZ(t3), a3 = 0.75 + 0.25 * Cf(-1, 0.4, r3);
        n3 * e25 > 0 && (n3 *= 0.35 + 0.65 * n3 * n3), u2.setXYZ(t3, n3 * 75e-4, r3 * 0.025, i3 * 0.0155 * a3);
      }
      l2.computeVertexNormals(), l2.rotateX(0.2), l2.rotateY(e25 * -0.35), l2.translate(c2 + e25 * 35e-4, t2, n2), this.add(l2, this.head, J.skin);
      let d2 = rd(1, `#ebbba6`, q.skin, 10, 8);
      d2.scale(22e-4, 0.014, 8e-3), d2.rotateX(0.2), d2.rotateY(e25 * -0.35), d2.translate(c2 + e25 * 85e-4, -0.022000000000000002, 0.011), this.head.add(new G(d2, md(J.skin, 0)));
    }
  }
  buildGlasses(e25, t2) {
    let n2 = `#111111`, r2 = 0.048, i2 = 0.031, a2 = 76e-4, o2 = 16e-4, s2 = 21e-4, c2 = 56e-4, l2 = (e26, t3, n3, r3, i3, a3) => (e26.moveTo(t3 + a3, n3), e26.lineTo(r3 - a3, n3), e26.quadraticCurveTo(r3, n3, r3, n3 + a3), e26.lineTo(r3, i3 - a3), e26.quadraticCurveTo(r3, i3, r3 - a3, i3), e26.lineTo(t3 + a3, i3), e26.quadraticCurveTo(t3, i3, t3, i3 - a3), e26.lineTo(t3, n3 + a3), e26.quadraticCurveTo(t3, n3, t3 + a3, n3), e26), u2 = [], d2 = (e26) => e26.length() - Rf(e26.clone().normalize()), f2 = (e26, t3) => {
      let n3 = e26.clone().normalize(), r3 = Rf(n3) + t3;
      return e26.length() < r3 ? n3.multiplyScalar(r3) : e26;
    }, p2 = [];
    for (let m3 of [-1, 1]) {
      let [h3, g3] = zf(m3 * (e25 + 1e-3), t2 + 1e-3), _3 = Tf(h3, g3), v3 = Tf(m3 * 0.44, -0.04), y3 = $(0, 1, 0).cross(v3).normalize(), b3 = v3.clone().cross(y3).normalize(), x3 = _3.clone().multiplyScalar(Rf(_3)), S3 = [];
      for (let e26 = 0; e26 <= 8; e26++)
        for (let t3 = 0; t3 <= 4; t3++)
          S3.push([(-0.5 + e26 / 8) * 0.0512, -0.031 / 2 - o2 + t3 / 4 * 0.034699999999999995]);
      for (let e26 = 0; e26 < 12; e26++) {
        let e27 = 1 / 0;
        for (let [t3, n3] of S3)
          e27 = Math.min(e27, d2(x3.clone().addScaledVector(y3, t3).addScaledVector(b3, n3).addScaledVector(v3, -21e-4 / 2)));
        if (Math.abs(e27 - c2) < 2e-4)
          break;
        x3.addScaledVector(v3, c2 - e27);
      }
      let C2 = new $t().makeBasis(y3, b3, v3).setPosition(x3), w2 = l2(new Wi(), -0.048 / 2 - 16e-4, -0.031 / 2 - o2, 0.0256, 0.0176, 92e-4);
      w2.holes.push(l2(new Ui(), -0.048 / 2, -0.031 / 2, r2 / 2, i2 / 2, a2));
      let T2 = new Oa(w2, { depth: s2, bevelEnabled: false, curveSegments: 6 });
      T2.translate(0, 0, -21e-4 / 2), u2.push(Ju(T2, n2, q.lacquer).applyMatrix4(C2));
      let E2 = -m3 * r2 * 0.18, D2 = new Oa(l2(new Wi(), E2 - r2 * 0.14, 0.016235, E2 + r2 * 0.14, 0.01697, 5e-4), { depth: 4e-4, bevelEnabled: false, curveSegments: 2 });
      D2.translate(0, 0, s2 / 2), u2.push(Ju(D2, `#56606c`, q.lacquer).applyMatrix4(C2));
      let O2 = new Pa(l2(new Wi(), -0.048 / 2, -0.031 / 2, r2 / 2, i2 / 2, a2), 6), k2 = O2.attributes.position, A2 = O2.attributes.uv;
      for (let e26 = 0; e26 < k2.count; e26++)
        A2.setXY(e26, k2.getX(e26) / r2 + 0.5, k2.getY(e26) / i2 + 0.5);
      let j2 = new G(O2.applyMatrix4(C2), Np());
      j2.renderOrder = 12, this.head.add(j2), this.lenses.push(j2), p2.push($(m3 * 0.024640000000000002, i2 / 2 - 4e-3, 0).applyMatrix4(C2));
      let ee2 = $(-m3 * 0.0248, i2 / 2 - 2e-3, -21e-4 / 2).applyMatrix4(C2), [te2, M2, ne2] = Nf(t2 + 6e-3), N2 = f2($(m3 * (te2 + 2e-3), t2 + 4e-3, 6e-3), 22e-4), re2 = f2($(m3 * (te2 - 8e-3), t2 - 0.016, 0.022), 5e-4), ie2 = ee2, ae2 = [];
      for (let e26 = 1; e26 <= 8; e26++)
        ae2.push(f2(ee2.clone().lerp(N2, e26 / 8), 22e-4));
      ae2.push(N2.clone().lerp(re2, 0.5).add($(m3 * 1e-3, 1e-3, 0)), re2);
      for (let e26 of ae2)
        u2.push(od(ie2, e26, 11e-4, n2, q.lacquer, 6)), ie2 = e26;
    }
    let [m2, h2] = p2, [g2, _2] = zf(0, t2 + 1e-3), v2 = Tf(g2, _2), y2 = v2.clone().multiplyScalar(Rf(v2) + 16e-4), b2 = m2.clone().lerp(y2, 0.5).add($(0, 12e-4, 0)), x2 = h2.clone().lerp(y2, 0.5).add($(0, 12e-4, 0));
    u2.push(od(m2, b2, 9e-4, n2, q.lacquer, 6), od(b2, y2, 9e-4, n2, q.lacquer, 6), od(y2, x2, 9e-4, n2, q.lacquer, 6), od(x2, h2, 9e-4, n2, q.lacquer, 6));
    let S2 = new G(sd(u2), md(J.eye, -1));
    this.head.add(S2), this.lenses.push(S2);
  }
  buildHair() {
    let e25 = [];
    for (let t3 = 0; t3 < 44; t3++) {
      let n3 = -Math.PI + t3 / 44 * Math.PI * 2, r3 = Kf(n3);
      for (let t4 = 0; t4 < 14; t4++) {
        let i3 = Tf(n3, t4 === 0 ? r3 : r3 + 0.05 + (Math.PI / 2 - 0.03 - r3 - 0.05) * ((t4 - 1) / 13)), a3 = i3.clone().multiplyScalar(Rf(i3) + (t4 === 0 ? -5e-3 : Yf(i3)));
        e25.push(a3.x, a3.y, a3.z);
      }
    }
    let t2 = $(0, 1, 0), n2 = t2.clone().multiplyScalar(Rf(t2) + Jf(t2));
    e25.push(n2.x, n2.y, n2.z);
    let r2 = [];
    for (let e26 = 0; e26 < 44; e26++) {
      let t3 = (e26 + 1) % 44;
      for (let n3 = 0; n3 < 13; n3++) {
        let i3 = e26 * 14 + n3, a3 = t3 * 14 + n3, o3 = i3 + 1, s3 = a3 + 1;
        r2.push(i3, o3, a3, a3, o3, s3);
      }
      r2.push(e26 * 14 + 14 - 1, 616, t3 * 14 + 14 - 1);
    }
    let i2 = new Ar();
    if (i2.setAttribute(`position`, new W(e25, 3)), i2.setIndex(r2), i2.computeVertexNormals(), this.add(Ju(i2, ff, q.hair), this.head, J.hair), Q) {
      this.buildShortHair();
      return;
    }
    let a2 = 0.1, o2 = (e26) => {
      let t3 = Math.sin(e26 * 127.1 + 311.7) * 43758.5453;
      return t3 - Math.floor(t3);
    }, s2 = [];
    for (let e26 = 0; e26 < 27; e26++) {
      let t3 = -1 + 2 * e26 / 26, n3 = t3 * 0.084 + (o2(e26) - 0.5) * 4e-3, r3 = Cf(0.55, 1, Math.abs(t3)), i3 = 0.025 - 0.02 * o2(e26 + 7) - (e26 % 4 == 1 ? 0.013 : 0) - 0.03 * r3, a3 = 45e-4 + 35e-4 * o2(e26 + 3) + 2e-3 * (1 - r3);
      s2.push([n3, i3, a3, 0.05 * t3 * (0.5 + 0.5 * Math.abs(t3)) + (o2(e26 + 11) - 0.5) * 0.02, 12e-4 + 3e-3 * r3]);
    }
    for (let [e26, t3] of [[a2 * 0.4, 0.05], [-0.07, 0.045], [0.07, 0.045], [-0.035, 0.052], [0.035, 0.052], [0, 0.056]])
      s2.push([e26, t3, 0.018, 0.02 * Math.sign(e26), 0]);
    s2.forEach(([e26, t3, n3, r3, i3], o3) => {
      let [s3, c3] = zf(e26, t3), l3 = a2 + (s3 - a2) * 0.55, u3 = 1.2 - 0.12 * Math.abs(s3 - a2), d3 = Zf(l3, u3, s3, c3, n3, 42e-4, r3, i3, false, 14), f3 = Tf(l3, u3), p3 = f3.clone().multiplyScalar(Rf(f3) + Jf(f3)), m3 = new On();
      m3.position.copy(p3), this.head.add(m3), m3.add(new G(d3.translate(-p3.x, -p3.y, -p3.z), md(J.hair, 0.3))), this.fringe.push({ g: m3, radial: f3, side: $(0, 1, 0).cross(f3).normalize(), gain: 0.75 + 0.5 * Math.abs(Math.sin(o3 * 2.7)), ph: o3 * 1.37, long: +(i3 > 3e-3) });
    });
    let c2 = -0.44;
    {
      let e26 = [];
      for (let t3 = 0; t3 < 13; t3++) {
        let n3 = Math.PI + (t3 - 6) * 0.26;
        e26.push(Zf(n3, 1.3 - 0.03 * Math.abs(t3 - 6), Math.PI + (t3 - 6) * 0.03, -0.38, 0.032, 6e-3, 0.03 * Math.sin(t3 * 2.1), 0, true, 12));
      }
      for (let t3 = 0; t3 < 9; t3++) {
        let n3 = (t3 - 4) * 0.2;
        e26.push(Zf(Math.PI + n3 * 2.6, Kf(Math.PI + n3 * 2.6) + 0.1, Math.PI + n3 * 0.15, -0.47, 0.026, 7e-3, 0, 0, true, 9));
      }
      for (let t3 of [-1, 1])
        for (let n3 = 0; n3 < 4; n3++) {
          let r3 = t3 * (1.15 + n3 * 0.22);
          e26.push(Zf(r3, 0.72 - n3 * 0.1, t3 * (Math.PI - 0.1 - 0.03 * n3), c2 + 0.02 * n3, 0.024, 8e-3, t3 * 0.05, 0, true, 12));
        }
      for (let t3 of [-1, 1])
        for (let n3 = 0; n3 < 6; n3++) {
          let r3 = 0.14 + n3 * 0.07;
          e26.push(Zf(t3 * (1.2 + 0.03 * n3), r3, t3 * (Math.PI - 0.12 - 0.02 * n3), c2 + 0.01 * n3, 0.014 + n3 % 2 * 4e-3, 45e-4, t3 * (0.02 - 0.12 * (1 - n3 / 5)), 0, true, 14));
        }
      for (let t3 of [-1, 1])
        for (let n3 = 0; n3 < 6; n3++) {
          let r3 = t3 * (1.95 + n3 * 0.2);
          e26.push(Zf(r3, Kf(r3) + 0.26, r3 + t3 * 0.04, Kf(r3) - 0.07 - n3 % 2 * 0.03, 0.011, 4e-3, t3 * 0.03, 0, true, 8));
        }
      this.head.add(new G(sd(e26), md(J.hair, 0.3)));
    }
    for (let e26 of [-1, 1])
      [[1.02, 0.95, 1.2, 0.14, -0.11, 0.0105, -4e-3, 0], [1.12, 0.92, 1.3, 0.1, -0.096, 95e-4, 0, 2e-3], [1.22, 0.9, 1.4, 0.08, -0.11599999999999999, 8e-3, 4e-3, -2e-3], [0.98, 0.95, 1.14, 0.18, -0.08, 55e-4, -6e-3, 3e-3], [1.3, 0.86, 1.46, 0.06, -0.088, 7e-3, 7e-3, 1e-3], [1.16, 0.9, 1.34, 0.05, -0.126, 5e-3, 2e-3, 3e-3], [1.34, 0.8, 1.46, 0.04, -0.094, 0.012, 4e-3, -3e-3], [1.42, 0.74, 1.52, 0.02, -0.078, 0.011, 6e-3, -4e-3]].forEach(([t3, n3, r3, i3, a3, o3, s3, c3], l3) => {
        let u3 = Tf(e26 * t3, n3), d3 = u3.clone().multiplyScalar(Rf(u3) + Jf(u3)), f3 = new On();
        f3.position.copy(d3), this.head.add(f3), f3.add(new G($f(e26 * t3, n3, e26 * r3, i3, a3, o3 * 1.6, s3 * 0.5, c3).translate(-d3.x, -d3.y, -d3.z), md(J.hair, 0.3))), this.fringe.push({ g: f3, radial: u3, side: $(0, 1, 0).cross(u3).normalize(), gain: 0.5 + 0.2 * l3, ph: 2.1 + l3 * 1.9 + e26, long: 1 });
      });
    let l2 = Tf(Math.PI, c2), u2 = l2.clone().multiplyScalar(Rf(l2) + Yf(l2) + 6e-3), d2 = (e26, t3, n3, r3, i3) => {
      let a3 = new ja([new V(5e-4, -n3 - t3 * 0.8), new V(t3 * 0.75, -n3 - t3 * 0.55), new V(t3, -n3), new V((e26 + t3) * 0.54, -n3 * 0.5), new V(e26, 0), new V(e26 * 0.7, e26 * 0.55), new V(5e-4, e26 * 0.75)], 20), o3 = a3.attributes.position;
      for (let e27 = 0; e27 < o3.count; e27++) {
        let t4 = o3.getX(e27), a4 = o3.getY(e27), s3 = o3.getZ(e27), c3 = 1 + 0.16 * Math.cos(r3 * Math.atan2(t4, s3) + a4 / Math.max(n3, 1e-3) * i3);
        o3.setXYZ(e27, t4 * c3, a4, s3 * c3 * 0.85);
      }
      return Ju(Sf(a3), ff, q.hair);
    }, f2 = (e26, t3, n3, r3, i3, a3) => {
      for (let o3 = 0; o3 < n3.length; o3++) {
        let s3 = new On();
        o3 === 0 ? s3.position.copy(t3) : s3.position.set(0, -n3[o3 - 1], 0), e26.add(s3), s3.add(new G(d2(r3[o3], i3[o3], n3[o3], a3, 0.9), md(J.hair, 0.4))), this.pony.push(s3), this.ponyLen.push(n3[o3]), e26 = s3;
      }
    };
    f2(this.head, u2, [0.05, 0.062, 0.064, 0.062, 0.058, 0.052, 0.048], [0.019, 0.029, 0.03, 0.028, 0.024, 0.018, 0.011], [0.029, 0.03, 0.028, 0.024, 0.018, 0.011, 2e-3], 5), f2(this.pony[3], $(0.012, -0.012, 0.011), [0.05, 0.05, 0.046, 0.042], [0.011, 0.011, 9e-3, 6e-3], [0.011, 9e-3, 6e-3, 1e-3], 3);
    let p2 = this.pony[0], m2 = Ju(new La(0.023, 0.0115, 8, 22), `#c23a3c`, q.cloth), h2 = m2.attributes.position;
    for (let e26 = 0; e26 < h2.count; e26++) {
      let t3 = h2.getX(e26), n3 = h2.getY(e26), r3 = h2.getZ(e26), i3 = Math.atan2(n3, t3), a3 = 1 + 0.18 * Math.sin(i3 * 9);
      h2.setXYZ(e26, t3 * (1 + 0.06 * Math.sin(i3 * 9)), n3 * (1 + 0.06 * Math.sin(i3 * 9)), r3 * a3);
    }
    m2.computeVertexNormals(), m2.rotateX(Math.PI / 2), this.add(m2.translate(0, -6e-3, 0), p2, J.flower);
  }
  buildShortHair() {
    let e25 = (e26) => {
      let t3 = Math.sin(e26 * 127.1 + 311.7) * 43758.5453;
      return t3 - Math.floor(t3);
    }, t2 = -0.25;
    for (let n3 = 0; n3 < 20; n3++) {
      let r2 = -1 + 2 * n3 / 19, i2 = Cf(0.6, 1, Math.abs(r2)), a2 = r2 * 0.08 + (e25(n3) - 0.5) * 6e-3, o2 = 0.05 - 0.012 * e25(n3 + 7) - (n3 % 3 == 1 ? 8e-3 : 0) - 0.02 * i2, s2 = 8e-3 + 6e-3 * e25(n3 + 3), [c2, l2] = zf(a2, o2), u2 = t2 + (c2 - t2) * 0.4, d2 = 1.25 - 0.1 * Math.abs(c2 - t2), f2 = Zf(u2, d2, c2, l2, s2, 6e-3, 0.07 + 0.03 * (e25(n3 + 11) - 0.5), 4e-3 + 3e-3 * i2, false, 12), p2 = Tf(u2, d2), m2 = p2.clone().multiplyScalar(Rf(p2) + Jf(p2)), h2 = new On();
      h2.position.copy(m2), this.head.add(h2), h2.add(new G(f2.translate(-m2.x, -m2.y, -m2.z), md(J.hair, 0.3))), this.fringe.push({ g: h2, radial: p2, side: $(0, 1, 0).cross(p2).normalize(), gain: 0.4 + 0.3 * Math.abs(Math.sin(n3 * 2.7)), ph: n3 * 1.37, long: 0 });
    }
    for (let [e26, n3] of [[-0.06, 0.06], [0.06, 0.06], [0, 0.064], [-0.03, 0.062], [0.03, 0.062]]) {
      let [r2, i2] = zf(e26, n3);
      this.head.add(new G(Zf(t2 + (r2 - t2) * 0.4, 1.2, r2, i2, 0.02, 6e-3, 0.03, 3e-3, false, 9), md(J.hair, 0.3)));
    }
    let n2 = [];
    for (let e26 = 0; e26 < 14; e26++) {
      let r2 = t2 + e26 / 14 * Math.PI * 2;
      n2.push(Zf(r2, 1.48, r2 + 0.25, 1.05, 0.03, 8e-3, 0.06, 6e-3, true, 9));
    }
    for (let t3 = 0; t3 < 16; t3++) {
      let r2 = (t3 - 7.5) * 0.2, i2 = Math.PI + r2 * 0.85;
      n2.push(Zf(Math.PI + r2, 1.25 - 0.02 * Math.abs(r2), i2, Kf(i2) - 0.03 - 0.02 * e25(t3), 0.032, 7e-3, 0.04 * Math.sin(t3 * 1.9), 0, true, 11));
    }
    for (let e26 of [-1, 1])
      for (let t3 = 0; t3 < 7; t3++) {
        let r2 = e26 * (1 + t3 * 0.2), i2 = e26 * (1.18 + t3 * 0.22);
        n2.push(Zf(r2, 0.95 - 0.03 * t3, i2, Kf(i2) - 0.02, 0.026, 65e-4, e26 * 0.05, 0, true, 10));
      }
    for (let e26 of [-1, 1])
      n2.push(Zf(e26 * 1.36, 0.3, e26 * 1.4, -0.08, 0.012, 4e-3, 0, 0, true, 6));
    this.head.add(new G(sd(n2), md(J.hair, 0.3)));
  }
  buildLimbs() {
    let e25 = this.body, t2 = J.rider;
    for (let n2 = 0; n2 < 2; n2++) {
      Q ? (this.thigh.push(new xf(e25, [0.089, 0.089, 0.085, 0.078, 0.07], pf, q.cloth, t2)), this.shin.push(new xf(e25, [0.068, 0.066, 0.064, 0.062, 0.06, 0.058, 0.057], pf, q.cloth, t2))) : (this.thigh.push(new xf(e25, [0.088, 0.084, 0.076, 0.066, 0.058], df, q.skin, J.skin)), this.shin.push(new xf(e25, [0.055, 0.06, 0.061, 0.055, 0.045, 0.037, 0.032], df, q.skin, J.skin))), this.socks.push(new xf(e25, [0.036, 0.0375, 0.039, 0.0395], _f, q.cloth, t2));
      let n3 = Q ? 1.14 : 1;
      this.upperArm.push(new xf(e25, [0.05, 0.048, 0.044, 0.039, 0.036].map((e26) => e26 * n3), df, q.skin, J.skin)), this.foreArm.push(new xf(e25, [0.035, 0.038, 0.036, 0.031, 0.026, 0.024].map((e26) => e26 * n3), df, q.skin, J.skin));
      let r2 = Q ? yf(rd(0.07, pf, q.cloth, 14, 10), t2) : yf(rd(0.058, df, q.skin, 14, 10), J.skin), i2 = yf(rd(0.036 * n3, df, q.skin, 12, 8), J.skin), a2 = ep();
      Q && a2.scale(1.12, 1.05, 1.1);
      let o2 = yf(a2, t2);
      e25.add(r2, i2, o2), this.knees.push(r2), this.elbows.push(i2), this.feet.push(o2);
    }
    for (let t3 = 0; t3 < 2; t3++) {
      let n2 = t3 === 0 ? 1 : -1, r2 = new On(), i2 = [];
      i2.push(ed(rd(0.025, df, q.skin, 10, 6), 0, 0, 0));
      let a2 = rd(1, df, q.skin, 14, 10);
      a2.scale(0.02, 0.044, 0.036), i2.push(a2.translate(0, -0.042, 0));
      let o2 = rd(1, df, q.skin, 12, 8);
      o2.scale(0.017, 0.036, 0.032), o2.rotateX(-0.3), i2.push(o2.translate(-n2 * 6e-3, -0.088, -6e-3));
      let s2 = rd(1, df, q.skin, 10, 6);
      s2.scale(0.015, 0.018, 0.028), i2.push(s2.translate(-n2 * 0.011, -0.116, -0.012));
      let c2 = rd(1, df, q.skin, 10, 6);
      c2.scale(0.012, 0.028, 0.013), c2.rotateX(0.35), c2.rotateZ(n2 * 0.25), i2.push(c2.translate(-n2 * 0.01, -0.05, -0.034));
      for (let e26 of i2)
        this.add(Q ? e26.scale(1.12, 1.1, 1.12) : e26, r2, J.skin);
      r2.visible = false, e25.add(r2), this.walkHands.push(r2);
    }
  }
  drapeSkirt(e25, t2, n2 = 0, r2 = [0, 0, 0]) {
    let i2 = this.skirtGeo, a2 = i2.attributes.position, o2 = Fp * 2, [s2, c2, l2] = r2, u2 = n2 > 0 ? Math.min(1.3, (0.25 * s2 + 0.55 * l2) * n2 + Math.min(e25 / 8, 1.3) * (1 - n2)) : Math.min(e25 / 8, 1.3), d2 = this.torso.quaternion, f2 = this.torso.position, p2 = Hp.set(0, -0.3, -1).normalize(), m2 = Up.set(0, -1, 0.32).normalize(), h2 = new H(), g2 = new H(), _2 = new H(), v2 = Ip - 2;
    for (let e26 = 0; e26 <= o2; e26++) {
      let r3 = e26 / o2 * Math.PI * 2, i3 = Math.cos(r3), y2 = (1 - i3) / 2, b2 = e26 % 2 ? 0.94 : 1;
      for (let t3 = 0; t3 < 2; t3++) {
        let n3 = dp(t3 === 0 ? Lp : Rp, r3, t3 === 0 ? 1.035 : 1.1 * (0.97 + 0.03 * b2));
        n3.applyQuaternion(d2).add(f2), a2.setXYZ(t3 * (o2 + 1) + e26, n3.x, n3.y, n3.z), t3 === 1 && _2.copy(n3);
      }
      g2.set(Math.sin(r3), 0, i3).applyQuaternion(d2), g2.y = 0, g2.normalize(), h2.copy(m2).lerp(p2, Cf(0.25, 0.85, y2)).normalize().lerp(Wp.set(0, -1, 0), n2).normalize();
      let x2 = Math.abs(Math.sin(r3)), S2 = (0.34 + 0.12 * y2 + 0.06 * x2) * (1 - n2) + 0.5 * n2, C2 = (0.35 + 0.35 * y2) * (1 - n2), w2 = (0.1 + 0.02 * (1 - y2)) * b2 * (1 - 0.1 * n2) + 0.015 * u2;
      for (let p3 = 2; p3 < Ip; p3++) {
        let m3 = (p3 - 1) / v2, x3 = Math.sin(t2 * 8 + r3 * 3 + p3 * 0.7) * 0.01 * u2 * m3 * m3, T2 = 0.05 * u2 * m3 * m3 * (1 - y2) * (1 - n2) + (0.04 * s2 + 0.06 * l2) * m3 * m3 * n2, E2 = (Math.sin(c2 - m3 * 0.8) * 0.02 * s2 + Math.sin(t2 * 2.1 + r3) * 4e-3) * m3 * m3 * n2, D2 = S2 * (m3 - C2 * m3 * m3 / 2), O2 = S2 * C2 * m3 * m3 / 2;
        if (zp.copy(_2).addScaledVector(g2, w2 * m3 ** 0.8).addScaledVector(h2, D2), zp.y -= O2, zp.x += Math.sin(r3) * x3 + E2, zp.y += x3 * 0.6, zp.z += i3 * x3 + T2, n2 > 0.5)
          for (let e27 = 0; e27 < this.thighA.length * 2; e27++) {
            let t3 = e27 < 2 ? this.thighA[e27] : this.shinA[e27 - 2], n3 = e27 < 2 ? this.thighB[e27] : this.shinB[e27 - 2];
            if (!t3 || !n3)
              continue;
            Bp.subVectors(n3, t3);
            let r4 = Math.min(1, Math.max(0, Vp.subVectors(zp, t3).dot(Bp) / (Bp.lengthSq() + 1e-6)));
            Bp.multiplyScalar(r4).add(t3), Vp.subVectors(zp, Bp), Vp.y = 0;
            let i4 = Vp.length(), a3 = e27 < 2 ? 0.112 : 0.075;
            i4 < a3 && i4 > 1e-5 && zp.addScaledVector(Vp, (a3 - i4) / i4);
          }
        if (n2 < 1 && this.thighA.length === 2) {
          let e27 = Cf(0.28, 0.7, y2) * (1 - n2);
          if (e27 > 0) {
            let t3 = Math.sin(r3);
            Gp.set(1, 0, 0).applyQuaternion(d2);
            let n3 = (this.thighA[0].x - f2.x) * Gp.x + (this.thighA[0].z - f2.z) * Gp.z > 0 == t3 > 0 ? 0 : 1, a3 = this.thighA[n3], o3 = this.thighB[n3];
            Kp.subVectors(o3, a3);
            let s3 = Kp.length();
            Kp.divideScalar(s3), qp.set(0, 1, 0).addScaledVector(Kp, -Kp.y).normalize(), Jp.crossVectors(Kp, qp).normalize(), Jp.dot(Gp) * t3 < 0 && Jp.negate();
            let c3 = -1.15 + 2.55 * Math.min(1, Math.abs(t3) / 0.92), l3 = 0.56, u3 = Math.min(m3 / l3, 1), p4 = 0.088 - 0.03 * u3 + 0.017 + 5e-3 * b2;
            if (Yp.copy(a3).addScaledVector(Kp, u3 * 1.03 * s3).addScaledVector(qp, Math.cos(c3) * p4).addScaledVector(Jp, Math.sin(c3) * p4), m3 > l3) {
              let e28 = (m3 - l3) / 0.43999999999999995;
              Yp.y -= 0.27 * e28, Yp.addScaledVector(Kp, 0.035 * e28 * (1 - e28 * 0.5)), Yp.addScaledVector(Jp, Math.max(0, Math.sin(c3)) * 0.03 * e28);
            }
            Yp.lerp(_2, 1 - Cf(0, 0.3, m3)), Yp.x += Math.sin(r3) * x3, Yp.y += x3 * 0.5, Yp.z += i3 * x3, zp.lerp(Yp, e27);
          }
          for (let e28 = 0; e28 < 2; e28++)
            for (let e29 = 0; e29 < 4; e29++) {
              let t3 = e29 < 2 ? this.thighA[e29] : this.shinA[e29 - 2], r4 = e29 < 2 ? this.thighB[e29] : this.shinB[e29 - 2];
              if (!t3 || !r4)
                continue;
              Bp.subVectors(r4, t3);
              let i4 = Math.min(1, Math.max(0, Vp.subVectors(zp, t3).dot(Bp) / (Bp.lengthSq() + 1e-6))), a3 = (e29 < 2 ? 0.088 - 0.03 * i4 + 0.016 : 0.062 - 0.02 * i4 + 0.012) * (1 - n2);
              Bp.multiplyScalar(i4).add(t3), Vp.subVectors(zp, Bp);
              let o3 = Vp.length();
              o3 < a3 && o3 > 1e-5 && zp.addScaledVector(Vp, (a3 - o3) / o3);
            }
        }
        a2.setXYZ(p3 * (o2 + 1) + e26, zp.x, zp.y, zp.z);
      }
    }
    a2.needsUpdate = true, i2.computeVertexNormals();
  }
  setFirstPerson(e25, t2 = e25) {
    if (t2 && (t2 = e25), e25 === this.fppOn && t2 === this.fppArms)
      return;
    this.fppOn = e25, this.fppArms = t2;
    let n2 = (t3) => t3.traverse((t4) => {
      t4.layers.enable(uf), e25 ? t4.layers.disable(0) : t4.layers.enable(0);
    });
    n2(this.torso);
    for (let e26 of [...this.thigh, ...this.shin, ...this.socks, ...this.shortLegs])
      n2(e26.mesh);
    for (let e26 of [...this.knees, ...this.feet])
      n2(e26);
    for (let e26 of this.upperArm)
      n2(e26.mesh);
    for (let e26 of this.elbows)
      n2(e26);
    if (t2)
      for (let e26 of [...this.fppKeep, ...this.elbows, ...this.upperArm.map((e27) => e27.mesh)])
        e26.traverse((e27) => e27.layers.enable(0));
  }
  setSkirtHidden(e25) {
    for (let t2 of [this.skirt, this.seatCover, this.skirtCap, this.pelvis])
      e25 ? t2.layers.disable(0) : t2.layers.enable(0);
  }
  eyeWorld(e25) {
    return this.head.updateWorldMatrix(true, false), e25.set(0, -3e-3, -0.061).applyMatrix4(this.head.matrixWorld);
  }
  headWorld(e25) {
    return this.head.updateWorldMatrix(true, false), e25.set(0, 0, 0).applyMatrix4(this.head.matrixWorld);
  }
  update(e25, t2, n2) {
    this.bike.crankHold !== null && (t2 = { ...t2, crank: this.bike.crankHold }), this.lean.rotation.z = t2.lean, this.bike.update(e25, t2);
    let r2 = n2 ? Math.min(1, Math.max(0, n2.blend)) : 0;
    this.setOnFoot(r2 > 0), this.root.updateMatrixWorld(true);
    let i2 = this.poseA;
    this.ridePose(t2, i2);
    let a2 = 0, o2 = [0, 0, 0];
    if (n2 && r2 > 0) {
      this.walker.updateMatrixWorld(true);
      let e26 = $p.copy(this.walker.matrixWorld).invert().multiply(this.lean.matrixWorld);
      tm.setFromRotationMatrix(e26), i2.torsoP.applyMatrix4(e26), i2.torsoQ.premultiply(tm);
      for (let t4 = 0; t4 < 2; t4++)
        i2.hip[t4].applyMatrix4(e26), i2.ankle[t4].applyMatrix4(e26), i2.wrist[t4].applyMatrix4(e26), i2.kneePole[t4].transformDirection(e26), i2.elbowPole[t4].transformDirection(e26), i2.footQ[t4].premultiply(tm);
      let t3 = this.poseB;
      this.walkPose(n2, t3);
      let s3 = +(n2.side > 0), c2 = Cf(0, 0.45, r2), l2 = Cf(0.35, 1, r2), u2 = Cf(0.12, 0.82, r2), d2 = Cf(0.05, 0.62, r2);
      i2.torsoP.lerp(t3.torsoP, u2), i2.torsoQ.slerp(t3.torsoQ, u2), i2.head.lerp(t3.head, u2);
      for (let e27 = 0; e27 < i2.ponyX.length; e27++)
        i2.ponyX[e27] += (t3.ponyX[e27] - i2.ponyX[e27]) * u2, i2.ponyZ[e27] += (t3.ponyZ[e27] - i2.ponyZ[e27]) * u2;
      for (let e27 = 0; e27 < 2; e27++)
        i2.legL[e27] += (t3.legL[e27] - i2.legL[e27]) * u2;
      for (let e27 = 0; e27 < 2; e27++) {
        let n3 = e27 === s3 ? c2 : l2;
        i2.hip[e27].lerp(t3.hip[e27], u2), e27 === s3 || n3 <= 0 || n3 >= 1 ? (i2.ankle[e27].lerp(t3.ankle[e27], n3), e27 === s3 && (i2.ankle[e27].y += Math.sin(Math.PI * n3) * 0.05)) : (Xp.copy(i2.ankle[e27]).add(t3.ankle[e27]).multiplyScalar(0.5), Xp.y += 0.62, Xp.z -= 0.12, Zp.copy(i2.ankle[e27]), i2.ankle[e27].copy(Zp.multiplyScalar((1 - n3) * (1 - n3))).addScaledVector(Xp, 2 * n3 * (1 - n3)).addScaledVector(t3.ankle[e27], n3 * n3)), i2.kneePole[e27].lerp(t3.kneePole[e27], n3).normalize(), i2.footQ[e27].slerp(t3.footQ[e27], n3), i2.wrist[e27].lerp(t3.wrist[e27], d2), i2.elbowPole[e27].lerp(t3.elbowPole[e27], d2).normalize();
        for (let n4 = 0; n4 < 2; n4++)
          i2.armL[e27][n4] += (t3.armL[e27][n4] - i2.armL[e27][n4]) * d2;
      }
      a2 = u2, o2 = [Math.min(1, n2.speed / 1.1), n2.phase, n2.run];
    }
    this.standK = a2, this.springPony(i2, e25), this.applyPose(i2), this.ponyOffBack(), this.seatCover.visible = r2 === 0 && !this.fppArms;
    for (let e26 of this.lenses)
      e26.layers.mask = +!this.fppOn;
    this.drapeSkirt(n2 && r2 > 0 ? n2.speed : t2.speed, t2.time, a2, o2), this.pelvis.position.copy(i2.torsoP).add(Xp.set(0, -0.07, 5e-3));
    for (let e26 = 0; e26 < 2; e26++)
      this.shortLegs[e26].set(this.thighA[e26].clone().add(Xp.set(0, 0.02, 0)), Zp.copy(this.thighA[e26]).lerp(this.thighB[e26], 0.16));
    this.blinkT -= e25, this.blinkT <= 0 && this.blinkK < 0 && (this.blinkK = 0, this.blinkT = 2.4 + Math.random() * 3.2);
    let s2 = 0;
    this.blinkK >= 0 && (this.blinkK += e25 / 0.15, s2 = Math.sin(Math.PI * Math.min(1, this.blinkK)), this.blinkK >= 1 && (this.blinkK = -1));
    for (let e26 of this.eyes)
      e26.scale.y = 1 - 0.9 * s2;
    this.swayFringe(e25, t2.time, n2 && r2 > 0 ? n2.speed : t2.speed);
    {
      let n3 = this.bq, r3 = Math.abs(t2.speed), i3 = -0.05 - Math.min(r3, 8) * 0.018 + Math.sin(t2.time * 2.1) * 0.03 * Math.min(1, r3 / 3), a3 = -t2.steer * 0.25 + Math.sin(t2.time * 3.3 + 1) * 0.025 * Math.min(1, r3 / 3), o3 = Math.min(e25, 1 / 30);
      n3.vx += ((i3 - n3.x) * 90 - n3.vx * 7) * o3, n3.vz += ((a3 - n3.z) * 90 - n3.vz * 7) * o3, n3.x += n3.vx * o3, n3.z += n3.vz * o3, this.bouquet.rotation.set(n3.x, 0, n3.z);
    }
  }
  get standing() {
    return this.standK;
  }
  setOnFoot(e25) {
    if (e25 !== this.onFoot) {
      this.onFoot = e25, (e25 ? this.walker : this.lean).add(this.body);
      for (let t2 of this.gripHands)
        t2.visible = !e25;
      for (let t2 of this.walkHands)
        t2.visible = e25;
      this.walkShadow.visible = e25;
    }
  }
  ridePose(e25, t2) {
    let n2 = Math.sin(e25.crank * 2) * 8e-3 * e25.pedaling;
    t2.torsoP.set(0, Td.y + 0.1 + n2, Td.z - 0.02), t2.torsoQ.setFromEuler(Dp.set(-0.28 - Math.min(e25.speed / 12, 1) * 0.08, 0, Math.sin(e25.crank) * 0.025 * e25.pedaling, `XYZ`)), t2.head.set(0.14 + Math.sin(e25.time * 0.21) * 0.04, Math.sin(e25.time * 0.37) * 0.12 + Math.sin(e25.time * 0.13) * 0.1, -e25.lean * 0.5);
    let r2 = Math.min(e25.speed / 8, 1.2);
    for (let n3 = 0; n3 < t2.ponyX.length; n3++) {
      let i3 = Math.sin(e25.time * 3.6 - n3 * 0.9) * 0.07 * (0.4 + r2);
      t2.ponyX[n3] = (n3 === 0 ? -t2.head.x - 0.22 - r2 * 0.22 : -0.05 - r2 * 0.08) + i3, t2.ponyZ[n3] = Math.sin(e25.time * 2.4 - n3 * 1.1) * 0.09 * (0.4 + r2) + (n3 === 0 ? e25.steer * 0.3 + e25.lean * 0.35 : 0);
    }
    let i2 = Zp.set(0, Td.y + 0.035, Td.z - 0.03);
    t2.legL[0] = 0.43, t2.legL[1] = 0.42;
    for (let n3 = 0; n3 < 2; n3++) {
      let r3 = n3 === 0 ? 1 : -1, a2 = e25.crank + (n3 === 0 ? 0 : Math.PI);
      t2.ankle[n3].set(r3 * 0.14, xd.y - Math.cos(a2) * Sd + 0.06, xd.z + Math.sin(a2) * Sd + 0.03), t2.hip[n3].copy(i2).add(Xp.set(r3 * 0.085, 0, 0)), t2.kneePole[n3].set(r3 * 0.12, 0.4, -1).normalize(), t2.footQ[n3].setFromEuler(Dp.set(-0.15 + Math.sin(a2) * 0.25, 0, 0, `XYZ`));
      let o2 = xp(r3).applyQuaternion(t2.torsoQ).add(t2.torsoP);
      t2.wrist[n3].copy(this.wrists[n3]).applyMatrix4(this.steer.matrix);
      let s2 = o2.distanceTo(t2.wrist[n3]) / (2 * Math.cos(9 * Math.PI / 180));
      t2.armL[n3][0] = s2 * 1.04, t2.armL[n3][1] = s2 * 0.96, t2.elbowPole[n3].set(r3 * 0.45, -0.8, 0.45).normalize();
    }
  }
  walkPose(e25, t2) {
    let n2 = Math.min(1, e25.speed / 1.1), r2 = e25.run, i2 = e25.phase, a2 = e25.time, o2 = wp(r2), s2 = Tp(r2) * n2, c2 = (0.07 + 0.1 * r2) * n2, l2 = Sp[0] + Sp[1], u2 = l2 * (0.99 - 0.05 * r2), d2 = 0.07 + l2 * 0.99, f2 = [0, 0];
    for (let e26 = 0; e26 < 2; e26++) {
      let a3 = e26 === 0 ? 1 : -1, l3 = Op(i2 / (Math.PI * 2) + (e26 === 0 ? 0 : 0.5));
      f2[e26] = l3;
      let p3, m3, h3;
      if (l3 < o2) {
        let e27 = l3 / o2;
        p3 = -s2 + 2 * s2 * e27, m3 = 0.035 * Cf(0.72, 1, e27) * n2, h3 = (0.22 * (1 - Cf(0, 0.18, e27)) - 0.5 * Cf(0.7, 1, e27)) * n2;
      } else {
        let e27 = (l3 - o2) / (1 - o2), t3 = e27 * e27 * (3 - 2 * e27);
        p3 = s2 - 2 * s2 * t3 + 0.13 * r2 * n2 * Math.sin(Math.PI * e27), m3 = c2 * Math.sin(Math.PI * e27) + 0.035 * (1 - Cf(0, 0.3, e27)) * n2, h3 = (-0.5 + 0.72 * t3) * n2;
      }
      p3 += (e26 === 0 ? -0.05 : 0.02) * (1 - n2), t2.ankle[e26].set(a3 * (0.1 - 0.015 * r2), 0.07 + m3, p3), t2.footQ[e26].setFromEuler(Dp.set(h3, a3 * 0.14 * (1 - n2), 0, `YXZ`));
      let g3 = t2.ankle[e26].x - a3 * 0.085;
      d2 = Math.min(d2, t2.ankle[e26].y + Math.sqrt(Math.max(0, u2 * u2 - p3 * p3 - g3 * g3)));
    }
    let p2 = Math.sin(a2 * 1.8) * 35e-4 * (1 - n2), m2 = -(0.02 + 0.035 * n2 + 0.13 * r2), h2 = -0.07 * n2 * Math.cos(i2) * (1 - 0.3 * r2), g2 = -0.015 * n2 * Math.cos(i2 - 1.9) - Math.max(-0.1, Math.min(0.1, e25.turn * e25.speed * 0.03));
    t2.torsoP.set(0.012 * n2 * Math.cos(i2 - 1.9), d2 + 0.065 + p2 + 0.015 * r2 * n2, 0), t2.torsoQ.setFromEuler(Dp.set(m2, h2, g2, `YXZ`)), t2.head.set(-m2 * 0.8 - 0.03 + e25.lookUp, e25.look - h2 * 0.8, -g2 * 0.6 + 0.035 * Math.sin(a2 * 0.31) * (1 - n2));
    for (let e26 = 0; e26 < t2.ponyX.length; e26++) {
      let o3 = Math.sin(2 * i2 - e26 * 0.9) * 0.05 * n2 + Math.sin(a2 * 1.4 - e26 * 0.8) * 0.025;
      t2.ponyX[e26] = (e26 === 0 ? -(m2 + t2.head.x) - 0.14 - 0.08 * n2 - 0.12 * r2 : -0.03 - 0.05 * r2) + o3, t2.ponyZ[e26] = Math.sin(i2 - e26 * 0.8) * 0.06 * n2 + Math.sin(a2 * 1.9 - e26 * 1.1) * 0.03;
    }
    t2.legL[0] = Sp[0], t2.legL[1] = Sp[1];
    for (let e26 = 0; e26 < 2; e26++) {
      let i3 = e26 === 0 ? 1 : -1;
      t2.hip[e26].copy(t2.torsoP).add(Xp.set(i3 * 0.085, -0.065, 0)), t2.kneePole[e26].set(i3 * 0.08, 0.05, -1).normalize();
      let o3 = xp(i3).applyQuaternion(t2.torsoQ).add(t2.torsoP), s3 = n2 * (0.15 + 0.05 * r2) * Math.cos(2 * Math.PI * f2[e26]), c3 = (1 - n2) * (1 - r2), l3 = Xp.set(i3 * (0.105 + 0.01 * Math.sin(a2 * 0.9 + e26 * 1.7) * c3), -0.47 + Math.max(0, -s3) * 0.25 + 6e-3 * Math.sin(a2 * 1.3 + e26) * c3, 0.025 + s3 + 8e-3 * Math.sin(a2 * 0.7 + e26 * 2.3) * c3), u3 = Zp.set(i3 * 0.01, -0.3, -0.08 + s3 * 1.3);
      t2.wrist[e26].copy(l3).lerp(u3, r2).add(o3), t2.elbowPole[e26].set(i3 * (0.3 + 0.2 * r2), -0.2 * r2, 1).normalize(), t2.armL[e26][0] = Cp[0], t2.armL[e26][1] = Cp[1];
    }
  }
  springPony(e25, t2) {
    let n2 = Math.min(Math.max(t2, 0), 0.05);
    if (this.ponyS || (this.ponyS = e25.ponyX.map((t3, n3) => ({ x: t3, vx: 0, z: e25.ponyZ[n3], vz: 0 }))), n2 !== 0)
      for (let t3 = 0; t3 < e25.ponyX.length; t3++) {
        let r2 = this.ponyS[t3], i2 = 140 / (1 + 0.45 * (t3 < 7 ? t3 : t3 - 4)), a2 = 2 * Math.sqrt(i2) * 0.42;
        for (let o2 = 0; o2 < 2; o2++) {
          let o3 = n2 / 2;
          r2.vx += (i2 * (e25.ponyX[t3] - r2.x) - a2 * r2.vx) * o3, r2.x += r2.vx * o3, r2.vz += (i2 * (e25.ponyZ[t3] - r2.z) - a2 * r2.vz) * o3, r2.z += r2.vz * o3;
        }
        e25.ponyX[t3] = r2.x, e25.ponyZ[t3] = r2.z;
      }
  }
  ponyOffBack() {
    if (!this.pony.length)
      return;
    this.torso.updateWorldMatrix(true, true);
    let e25 = Xp, t2 = Zp, n2 = (n3) => (e25.set(0, -this.ponyLen[n3], 0).applyMatrix4(this.pony[n3].matrixWorld), t2.copy(e25), this.torso.worldToLocal(t2), t2.y < -0.05 || t2.y > 0.56 || Math.abs(t2.x) > 0.16 ? 1 : t2.z - (up(t2.x, Math.min(Math.max(t2.y, 0.04), 0.5)) + 0.04));
    for (let e26 = 1; e26 < this.pony.length; e26++) {
      let t3 = this.pony[e26], r2 = n2(e26);
      if (r2 >= 0)
        continue;
      t3.rotation.x += 0.07, t3.updateMatrixWorld(true);
      let i2 = 1;
      n2(e26) < r2 && (i2 = -1, t3.rotation.x -= 0.14, t3.updateMatrixWorld(true)), r2 = n2(e26);
      for (let a2 = 0; a2 < 10 && r2 < 0; a2++)
        t3.rotation.x += i2 * 0.07, t3.updateMatrixWorld(true), r2 = n2(e26);
    }
  }
  applyPose(e25) {
    var _a, _b, _c, _d2;
    this.torso.position.copy(e25.torsoP), this.torso.quaternion.copy(e25.torsoQ), this.head.rotation.set(e25.head.x, e25.head.y, e25.head.z);
    for (let t3 = 0; t3 < this.pony.length; t3++)
      this.pony[t3].rotation.x = e25.ponyX[t3] + _p[t3], this.pony[t3].rotation.z = e25.ponyZ[t3] + vp[t3];
    let t2 = Qp;
    for (let n2 = 0; n2 < 2; n2++) {
      let r2 = n2 === 0 ? 1 : -1, i2 = e25.hip[n2], a2 = e25.ankle[n2];
      bf(i2, a2, e25.legL[0], e25.legL[1], e25.kneePole[n2], t2), this.thigh[n2].set(i2, t2), ((_a = this.thighA)[n2] ?? (_a[n2] = new H())).copy(i2), ((_b = this.thighB)[n2] ?? (_b[n2] = new H())).copy(t2), this.shin[n2].set(t2, a2), ((_c = this.shinA)[n2] ?? (_c[n2] = new H())).copy(t2), ((_d2 = this.shinB)[n2] ?? (_d2[n2] = new H())).copy(a2), this.socks[n2].set(a2, Zp.copy(a2).lerp(t2, 0.17)), this.knees[n2].position.copy(t2), this.feet[n2].position.copy(a2).add(Xp.set(0, -0.03, 0)), this.feet[n2].quaternion.copy(e25.footQ[n2]);
      let o2 = xp(r2).applyQuaternion(e25.torsoQ).add(e25.torsoP), s2 = e25.wrist[n2];
      bf(o2, s2, e25.armL[n2][0], e25.armL[n2][1], e25.elbowPole[n2], t2), this.upperArm[n2].set(o2, t2), this.sleeves[n2].position.copy(o2), this.sleeves[n2].quaternion.copy(this.upperArm[n2].mesh.quaternion), this.foreArm[n2].set(t2, s2), this.elbows[n2].position.copy(t2);
      let c2 = this.walkHands[n2];
      c2.visible && (c2.position.copy(s2), c2.quaternion.setFromUnitVectors(Xp.set(0, -1, 0), Zp.subVectors(s2, t2).normalize()));
    }
  }
};
var Fp = 20;
var Ip = 15;
var Lp = 0.118;
var Rp = -5e-3;
var zp = new H();
var Bp = new H();
var Vp = new H();
var Hp = new H();
var Up = new H();
var Wp = new H();
var Gp = new H();
var Kp = new H();
var qp = new H();
var Jp = new H();
var Yp = new H();
var Xp = new H();
var Zp = new H();
var Qp = new H();
var $p = new $t();
var em = (e25, t2, n2) => Math.min(n2, Math.max(t2, e25));
var tm = new At();
var nm = new At();
var rm = class {
  constructor(e25 = {}) {
    __publicField(this, "object", new On());
    __publicField(this, "gender");
    __publicField(this, "mode");
    __publicField(this, "speed", 0);
    __publicField(this, "look", 0);
    __publicField(this, "lookUp", 0);
    __publicField(this, "turnRate", 0);
    __publicField(this, "rider");
    __publicField(this, "male");
    __publicField(this, "time", 0);
    __publicField(this, "phase", 0);
    __publicField(this, "run", 0);
    __publicField(this, "crank", 0.9);
    __publicField(this, "wheel", 0);
    this.gender = e25.gender ?? `female`, this.mode = e25.mode ?? `walk`, this.male = this.gender === `male`, dd(e25.style ?? `toon`), hp(this.male), this.rider = new Pp();
    let t2 = this.mode === `ride` ? this.rider.root : this.rider.walker;
    t2.rotation.y = Math.PI, this.object.add(t2);
    let n2 = 0.89 * (this.male ? 1.035 : 1);
    t2.scale.setScalar(n2), this.object.name = `${this.gender}-character`, e25.groundShadow === false && t2.traverse((e26) => {
      e26.name === `blobShadow` && (e26.visible = false);
    }), this.update(0);
    for (let e26 = 0; e26 < 40; e26++)
      this.update(1 / 60);
  }
  update(e25) {
    hp(this.male), this.time += e25;
    let t2 = this.time;
    if (this.mode === `walk`) {
      let n2 = Math.max(0, this.speed), r2 = Math.min(1, Math.max(0, (n2 - 2.2) / 1.4));
      this.run += (r2 - this.run) * Math.min(1, e25 * 4), this.phase += n2 * e25 / Ep(this.run) * Math.PI * 2;
      let i2 = { blend: 1, side: 1, speed: n2, phase: this.phase, run: this.run, turn: this.turnRate, look: this.look, lookUp: this.lookUp, time: t2 }, a2 = { speed: 0, steer: 0, lean: 0, crank: this.crank, wheel: this.wheel, pedaling: 0, time: t2, kick: 1, sprint: 0 };
      this.rider.update(e25, a2, i2);
    } else {
      let n2 = this.speed, r2 = n2 * e25;
      this.wheel += r2 / kd.WHEEL_R, this.crank += r2 / kd.WHEEL_R / 2.3;
      let i2 = Math.max(-0.4, Math.min(0.4, this.turnRate * 0.35)), a2 = Math.max(-0.35, Math.min(0.35, -this.turnRate * n2 * 0.06));
      this.rider.update(e25, { speed: n2, steer: i2, lean: a2, crank: this.crank, wheel: this.wheel, pedaling: +(n2 > 0.2), time: t2, kick: n2 > 0.05 ? 0 : 1, sprint: 0 });
    }
  }
  headPosition(e25 = new H()) {
    return this.rider.headWorld(e25);
  }
  bakeStatic() {
    let e25 = this.object;
    e25.updateMatrixWorld(true);
    let t2 = new $t().copy(e25.matrixWorld).invert(), n2 = new On();
    n2.name = `${this.gender}-static`;
    let r2 = new Ja({ vertexColors: true, roughness: 0.85, side: 2 }), i2 = (t3) => {
      for (let n3 = t3; n3 && n3 !== e25.parent; n3 = n3.parent)
        if (!n3.visible)
          return false;
      return true;
    };
    return e25.traverse((e26) => {
      let a2 = e26;
      if (!a2.isMesh || !i2(a2) || !a2.geometry.attributes.color)
        return;
      let o2 = a2.geometry.clone();
      for (let e27 of Object.keys(o2.attributes))
        [`position`, `normal`, `color`].includes(e27) || o2.deleteAttribute(e27);
      o2.applyMatrix4(new $t().multiplyMatrices(t2, a2.matrixWorld)), n2.add(new G(o2, r2));
    }), n2;
  }
};

// src/characters/summerBody.ts
var FADE = 0.3;
var SEAT_HEIGHT = 0.47;
var OUTFIT = {
  girl: { top: "#f6f4ef", bottom: "#39486e" },
  boy: { top: "#dfe8f1", bottom: "#2f3a4c" }
};
var wrap = (a2) => Math.atan2(Math.sin(a2), Math.cos(a2));
var _v = new THREE4.Vector3();
var _v2 = new THREE4.Vector3();
var _q = new THREE4.Quaternion();
var _e = new THREE4.Euler();
function recolor(root, from, to) {
  root.traverse((o) => {
    const col = o.isMesh && o.geometry?.attributes?.color;
    if (!col)
      return;
    let changed = false;
    for (let i = 0; i < col.count; i++) {
      const r = col.getX(i) / Math.max(from.r, 1e-3), g = col.getY(i) / Math.max(from.g, 1e-3), b = col.getZ(i) / Math.max(from.b, 1e-3);
      const lo = Math.min(r, g, b), hi = Math.max(r, g, b);
      if (lo > 0.55 && hi < 1.3 && hi - lo < 0.06) {
        const k2 = (r + g + b) / 3;
        col.setXYZ(i, Math.min(1, to.r * k2), Math.min(1, to.g * k2), Math.min(1, to.b * k2));
        changed = true;
      }
    }
    if (changed)
      col.needsUpdate = true;
  });
}
var SummerBody = class {
  constructor(kind, outfit = {}, opts = {}) {
    this.object = new THREE4.Group();
    this.ctx = { state: "walk", speed: 0, lookYaw: 0, lookPitch: 0, blink: 0, hold: null };
    this.w = { point: 0, talk: 0, look: 0, sit: 0, dance: 0 };
    this.t = 0;
    this.lastHeading = null;
    this.turn = 0;
    this.kind = kind;
    this.ch = new rm({ gender: kind === "boy" ? "male" : "female", mode: "walk", style: "toon", groundShadow: false });
    this.walker = this.ch.rider.walker;
    this.object.add(this.ch.object);
    const box = new THREE4.Box3().setFromObject(this.ch.object);
    const h = Math.max(0.5, box.max.y - box.min.y);
    this.object.scale.setScalar(HEIGHTS[kind] / h);
    this.height = HEIGHTS[kind];
    const src = OUTFIT[kind];
    if (outfit.top)
      recolor(this.ch.object, new THREE4.Color(src.top), new THREE4.Color(outfit.top));
    if (outfit.bottom)
      recolor(this.ch.object, new THREE4.Color(src.bottom), new THREE4.Color(outfit.bottom));
    const torso = this.ch.rider.torso;
    if (opts.bump && torso) {
      const col = new THREE4.Color(outfit.top || OUTFIT[kind].top);
      const bump = new THREE4.Mesh(new THREE4.SphereGeometry(0.115, 20, 14), new THREE4.MeshToonMaterial({ color: col }));
      bump.scale.set(1.05, 1, 0.95);
      bump.position.set(0, 0.16, -0.06);
      torso.add(bump);
    }
    this.ch.object.traverse((o) => {
      if (!o.isMesh)
        return;
      const m = o.material;
      if (m && m.transparent) {
        o.userData.surf = "unlit";
        o.userData.noOutline = true;
      } else
        o.userData.surf = "fabric";
      o.frustumCulled = false;
    });
    const rider = this.ch.rider;
    const walkPose = rider.walkPose.bind(rider);
    rider.walkPose = (state, pose) => {
      walkPose(state, pose);
      this.adjustPose(pose);
    };
    if (typeof rider.drapeSkirt === "function") {
      const drape = rider.drapeSkirt.bind(rider);
      rider.drapeSkirt = (speed, time, stand = 0, gait) => drape(speed, time, stand * (1 - this.w.sit), gait);
    }
  }
  update(dt, c2) {
    this.ctx = c2;
    this.t += dt;
    for (const k2 of Object.keys(this.w)) {
      const target = c2.state === k2 ? 1 : 0;
      this.w[k2] += (target - this.w[k2]) * Math.min(1, dt / FADE);
    }
    const heading = this.object.parent ? this.object.parent.rotation.y : 0;
    if (this.lastHeading !== null && dt > 0)
      this.turn += (wrap(heading - this.lastHeading) / dt - this.turn) * Math.min(1, dt * 6);
    this.lastHeading = heading;
    const ch = this.ch;
    const ws = this.walker.getWorldScale(_v2).y || 1;
    ch.speed = c2.state === "walk" ? c2.speed / ws : 0;
    ch.turnRate = THREE4.MathUtils.clamp(this.turn, -1.2, 1.2);
    ch.look = c2.lookYaw;
    ch.lookUp = c2.lookPitch;
    this.object.updateMatrixWorld(true);
    ch.update(dt);
  }
  /** Runs inside the demo's update, in the walker's local frame (forward -Z, index 0 = right side). */
  adjustPose(p) {
    const t = this.t, w = this.w;
    const shoulder = (i, out) => {
      const r = i === 0 ? 1 : -1;
      return out.set(r * (this.kind === "boy" ? 0.18 : 0.158), 0.425, -6e-3).applyQuaternion(p.torsoQ).add(p.torsoP);
    };
    const reach = (i, off, pole, k2) => {
      if (k2 <= 1e-3)
        return;
      shoulder(i, _v).add(off);
      p.wrist[i].lerp(_v, k2);
      p.elbowPole[i].lerp(pole.normalize(), k2).normalize();
    };
    if (w.sit > 1e-3) {
      const s = this.walker.getWorldScale(_v2).y || 1;
      const k2 = w.sit;
      p.torsoP.y += (SEAT_HEIGHT / s + 0.095 - p.torsoP.y) * k2;
      p.torsoP.z += (0.03 - p.torsoP.z) * k2;
      for (let i = 0; i < 2; i++) {
        const r = i === 0 ? 1 : -1;
        p.hip[i].copy(p.torsoP).add(_v.set(r * 0.085, -0.065, 0));
        p.ankle[i].lerp(_v.set(r * 0.11, 0.07, -0.4), k2);
        p.kneePole[i].lerp(_v.set(r * 0.05, 0.7, -1).normalize(), k2).normalize();
        p.footQ[i].slerp(_q.identity(), k2);
      }
    }
    const hold0 = this.ctx.hold;
    if (w.sit > 1e-3 && hold0 && hold0.amount > 1e-3) {
      const k2 = w.sit * hold0.amount, dir = hold0.side === "left" ? 1 : -1;
      p.torsoQ.multiply(_q.setFromEuler(_e.set(0, 0, dir * 0.07 * k2)));
      p.head.z += dir * (this.kind === "girl" ? 0.2 : 0.08) * k2;
      p.head.y += dir * 0.15 * k2;
    }
    if (w.dance > 1e-3) {
      const k2 = w.dance, s = Math.sin(t * 7);
      p.torsoP.y += Math.abs(s) * 0.04 * k2;
      p.torsoQ.multiply(_q.setFromEuler(_e.set(0, Math.sin(t * 1.75) * 0.25 * k2, Math.sin(t * 3.5) * 0.1 * k2)));
      for (let i = 0; i < 2; i++)
        p.ankle[i].y += Math.max(0, Math.sin(t * 7 + i * Math.PI)) * 0.06 * k2;
    }
    for (let i = 0; i < 2; i++) {
      const r = i === 0 ? 1 : -1;
      reach(i, _v2.set(-r * 0.04, -0.4, 0.13), new THREE4.Vector3(r * 0.5, 0, 0.6), w.look);
      reach(i, _v2.set(-r * 0.07, -0.3 + 0.035 * Math.sin(t * 4.2 + i * 1.3), -0.24 + 0.02 * Math.sin(t * 3.1 + i)), new THREE4.Vector3(r * 0.6, -0.4, 0.4), w.talk);
      reach(i, _v2.set(-r * 0.02, -0.33, -0.22), new THREE4.Vector3(r * 0.4, -0.3, 0.6), w.sit);
      reach(i, _v2.set(r * 0.2, 0.38 + 0.06 * Math.sin(t * 7 + i * Math.PI), -0.05), new THREE4.Vector3(r, 0.2, 0.2), w.dance);
    }
    reach(0, _v2.set(0.06, 0.12, -0.5), new THREE4.Vector3(0.3, -0.5, 0.2), w.point);
    const hold = this.ctx.hold;
    if (hold && hold.amount > 1e-3) {
      const i = hold.side === "left" ? 1 : 0, r = i === 0 ? 1 : -1;
      this.walker.updateMatrixWorld(true);
      const target = this.walker.worldToLocal(_v2.copy(hold.target));
      const sh = shoulder(i, _v);
      const d = target.sub(sh);
      const len = Math.min(d.length(), 0.5);
      d.setLength(len).add(sh);
      p.wrist[i].lerp(d, hold.amount);
      p.elbowPole[i].lerp(new THREE4.Vector3(r * 0.3, -0.3, 0.5).normalize(), hold.amount).normalize();
    }
  }
  dispose() {
    this.object.traverse((o) => {
      if (o.isMesh)
        o.geometry.dispose();
    });
  }
};

// src/characters/vrmBody.ts
import * as THREE6 from "three";

// src/characters/retarget.ts
import * as THREE5 from "three";
var mixamoVRMRigMap = {
  mixamorigHips: "hips",
  mixamorigSpine: "spine",
  mixamorigSpine1: "chest",
  mixamorigSpine2: "upperChest",
  mixamorigNeck: "neck",
  mixamorigHead: "head",
  mixamorigLeftShoulder: "leftShoulder",
  mixamorigLeftArm: "leftUpperArm",
  mixamorigLeftForeArm: "leftLowerArm",
  mixamorigLeftHand: "leftHand",
  mixamorigLeftHandThumb1: "leftThumbMetacarpal",
  mixamorigLeftHandThumb2: "leftThumbProximal",
  mixamorigLeftHandThumb3: "leftThumbDistal",
  mixamorigLeftHandIndex1: "leftIndexProximal",
  mixamorigLeftHandIndex2: "leftIndexIntermediate",
  mixamorigLeftHandIndex3: "leftIndexDistal",
  mixamorigLeftHandMiddle1: "leftMiddleProximal",
  mixamorigLeftHandMiddle2: "leftMiddleIntermediate",
  mixamorigLeftHandMiddle3: "leftMiddleDistal",
  mixamorigLeftHandRing1: "leftRingProximal",
  mixamorigLeftHandRing2: "leftRingIntermediate",
  mixamorigLeftHandRing3: "leftRingDistal",
  mixamorigLeftHandPinky1: "leftLittleProximal",
  mixamorigLeftHandPinky2: "leftLittleIntermediate",
  mixamorigLeftHandPinky3: "leftLittleDistal",
  mixamorigRightShoulder: "rightShoulder",
  mixamorigRightArm: "rightUpperArm",
  mixamorigRightForeArm: "rightLowerArm",
  mixamorigRightHand: "rightHand",
  mixamorigRightHandPinky1: "rightLittleProximal",
  mixamorigRightHandPinky2: "rightLittleIntermediate",
  mixamorigRightHandPinky3: "rightLittleDistal",
  mixamorigRightHandRing1: "rightRingProximal",
  mixamorigRightHandRing2: "rightRingIntermediate",
  mixamorigRightHandRing3: "rightRingDistal",
  mixamorigRightHandMiddle1: "rightMiddleProximal",
  mixamorigRightHandMiddle2: "rightMiddleIntermediate",
  mixamorigRightHandMiddle3: "rightMiddleDistal",
  mixamorigRightHandIndex1: "rightIndexProximal",
  mixamorigRightHandIndex2: "rightIndexIntermediate",
  mixamorigRightHandIndex3: "rightIndexDistal",
  mixamorigRightHandThumb1: "rightThumbMetacarpal",
  mixamorigRightHandThumb2: "rightThumbProximal",
  mixamorigRightHandThumb3: "rightThumbDistal",
  mixamorigLeftUpLeg: "leftUpperLeg",
  mixamorigLeftLeg: "leftLowerLeg",
  mixamorigLeftFoot: "leftFoot",
  mixamorigLeftToeBase: "leftToes",
  mixamorigRightUpLeg: "rightUpperLeg",
  mixamorigRightLeg: "rightLowerLeg",
  mixamorigRightFoot: "rightFoot",
  mixamorigRightToeBase: "rightToes"
};
var fbxCache = /* @__PURE__ */ new Map();
function loadFBX(url) {
  let p = fbxCache.get(url);
  if (!p) {
    p = (async () => {
      const buf = await fetchAsset(url);
      if (!buf)
        return null;
      const L = await loadLibs();
      try {
        return new L.FBXLoader().parse(buf, url.replace(/[^/]*$/, ""));
      } catch (e) {
        console.warn("Could not read", url, e);
        return null;
      }
    })();
    fbxCache.set(url, p);
  }
  return p;
}
async function loadMixamoClip(url, vrm, opts = {}) {
  const asset = await loadFBX(url);
  if (!asset)
    return null;
  const clip = THREE5.AnimationClip.findByName(asset.animations, "mixamo.com") || asset.animations[0];
  if (!clip)
    return null;
  const tracks = [];
  const restRotationInverse = new THREE5.Quaternion();
  const parentRestWorldRotation = new THREE5.Quaternion();
  const q2 = new THREE5.Quaternion();
  const hipsNode = asset.getObjectByName("mixamorigHips");
  const motionHipsHeight = hipsNode ? hipsNode.position.y : 1;
  const rest = vrm.humanoid.normalizedRestPose.hips.position;
  const hipsPositionScale = rest[1] / motionHipsHeight;
  const isVRM0 = vrm.meta?.metaVersion === "0";
  for (const track of clip.tracks) {
    const [rigName, property] = track.name.split(".");
    const vrmBoneName = mixamoVRMRigMap[rigName];
    const vrmNodeName = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName)?.name;
    const rigNode = asset.getObjectByName(rigName);
    if (vrmNodeName == null || !rigNode)
      continue;
    rigNode.getWorldQuaternion(restRotationInverse).invert();
    rigNode.parent.getWorldQuaternion(parentRestWorldRotation);
    if (track instanceof THREE5.QuaternionKeyframeTrack) {
      const values = new Float32Array(track.values.length);
      for (let i = 0; i < track.values.length; i += 4) {
        q2.fromArray(track.values, i).premultiply(parentRestWorldRotation).multiply(restRotationInverse);
        q2.toArray(values, i);
      }
      if (isVRM0)
        for (let i = 0; i < values.length; i += 2)
          values[i] = -values[i];
      tracks.push(new THREE5.QuaternionKeyframeTrack(`${vrmNodeName}.${property}`, track.times, values));
    } else if (track instanceof THREE5.VectorKeyframeTrack) {
      const values = new Float32Array(track.values.length);
      for (let i = 0; i < track.values.length; i++) {
        const axis = i % 3;
        let v = track.values[i] * (isVRM0 && axis !== 1 ? -1 : 1) * hipsPositionScale;
        if (opts.inPlace && vrmBoneName === "hips" && axis !== 1)
          v = rest[axis];
        values[i] = v;
      }
      tracks.push(new THREE5.VectorKeyframeTrack(`${vrmNodeName}.${property}`, track.times, values));
    }
  }
  return new THREE5.AnimationClip(opts.name || "vrmAnimation", clip.duration, tracks);
}

// src/characters/vrmBody.ts
var FADE2 = 0.3;
var WALK_CLIP_SPEED = 1.25;
var BONES = [
  "hips",
  "spine",
  "chest",
  "neck",
  "head",
  "leftUpperArm",
  "leftLowerArm",
  "leftHand",
  "rightUpperArm",
  "rightLowerArm",
  "rightHand",
  "leftUpperLeg",
  "leftLowerLeg",
  "rightUpperLeg",
  "rightLowerLeg"
];
var _e2 = new THREE6.Euler();
var _q2 = new THREE6.Quaternion();
var _qa = new THREE6.Quaternion();
var _v1 = new THREE6.Vector3();
var _v22 = new THREE6.Vector3();
var _v3 = new THREE6.Vector3();
var _v4 = new THREE6.Vector3();
function applyWorldRotation(bone, qWorld) {
  const parentQ = bone.parent.getWorldQuaternion(new THREE6.Quaternion());
  const local = parentQ.clone().invert().multiply(qWorld).multiply(parentQ);
  bone.quaternion.premultiply(local);
  bone.updateMatrixWorld(true);
}
function twoBoneIK(upper, lower, end, target, pole, weight) {
  if (weight <= 1e-3)
    return;
  const q0u = upper.quaternion.clone(), q0l = lower.quaternion.clone();
  const a2 = upper.getWorldPosition(_v1), b = lower.getWorldPosition(_v22), c2 = end.getWorldPosition(_v3);
  const lab = a2.distanceTo(b), lbc = b.distanceTo(c2);
  const lat = THREE6.MathUtils.clamp(a2.distanceTo(target), 0.02, lab + lbc - 2e-3);
  const ba = a2.clone().sub(b), bc = c2.clone().sub(b);
  const current = ba.angleTo(bc);
  const desired = Math.acos(THREE6.MathUtils.clamp((lab * lab + lbc * lbc - lat * lat) / (2 * lab * lbc), -1, 1));
  const axis = new THREE6.Vector3().crossVectors(ba, bc);
  if (axis.lengthSq() < 1e-8)
    axis.crossVectors(ba, pole);
  axis.normalize();
  applyWorldRotation(lower, _q2.setFromAxisAngle(axis, desired - current));
  const c22 = end.getWorldPosition(_v4);
  const from = c22.sub(upper.getWorldPosition(_v1)).normalize();
  const to = target.clone().sub(_v1).normalize();
  applyWorldRotation(upper, _q2.setFromUnitVectors(from, to));
  if (weight < 1) {
    upper.quaternion.copy(q0u.slerp(upper.quaternion.clone(), weight));
    lower.quaternion.copy(q0l.slerp(lower.quaternion.clone(), weight));
    upper.updateMatrixWorld(true);
  }
}
var VRMBody = class {
  constructor(loaded) {
    this.actions = {};
    this.current = null;
    this.procW = 1;
    this.t = 0;
    this.phase = 0;
    this.amt = 0;
    this.bones = {};
    this.restHips = new THREE6.Vector3();
    this.vrm = loaded.vrm;
    this.object = loaded.holder;
    this.height = loaded.height;
    this.scale = loaded.scale;
    this.feet = loaded.vrm.scene.position.y;
    this.mixer = new THREE6.AnimationMixer(this.vrm.scene);
    for (const b of BONES) {
      const node = this.vrm.humanoid?.getNormalizedBoneNode(b);
      if (node)
        this.bones[b] = node;
    }
    const hp2 = this.vrm.humanoid?.normalizedRestPose?.hips?.position;
    if (hp2)
      this.restHips.fromArray(hp2);
  }
  /** Retarget and attach whichever clips exist. Missing ones keep the procedural fallback. */
  async loadClips(urls) {
    const loaded = [];
    await Promise.all(Object.entries(urls).map(async ([name, url]) => {
      const clip = await loadMixamoClip(url, this.vrm, { inPlace: name !== "sit", name });
      if (!clip)
        return;
      const action = this.mixer.clipAction(clip);
      action.setLoop(THREE6.LoopRepeat, Infinity);
      if (name === "sit") {
        action.setLoop(THREE6.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
      this.actions[name] = action;
      loaded.push(name);
    }));
    this.current = null;
    return loaded;
  }
  get clipNames() {
    return Object.keys(this.actions);
  }
  update(dt, c2) {
    this.t += dt;
    const want = c2.state === "walk" ? c2.speed > 0.12 ? "walk" : "idle" : c2.state;
    const action = this.actions[want];
    if (action) {
      if (this.current !== want) {
        action.reset().setEffectiveWeight(1).fadeIn(FADE2).play();
        if (this.current && this.actions[this.current])
          this.actions[this.current].fadeOut(FADE2);
        this.current = want;
      }
    } else if (this.current) {
      this.actions[this.current].fadeOut(FADE2);
      this.current = null;
    }
    if (this.actions.walk)
      this.actions.walk.timeScale = THREE6.MathUtils.clamp(c2.speed / WALK_CLIP_SPEED, 0.55, 1.6);
    const mixerActive = this.mixer.stats.actions.inUse > 0;
    if (!mixerActive)
      this.resetPose();
    this.mixer.update(dt);
    const procTarget = action ? 0 : 1;
    this.procW += (procTarget - this.procW) * Math.min(1, dt / FADE2);
    if (this.procW > 1e-3)
      this.proceduralPose(want, c2, dt, mixerActive ? this.procW : 1);
    this.applyLook(c2);
    this.object.updateMatrixWorld(true);
    this.applyHold(c2);
    const em2 = this.vrm.expressionManager;
    if (em2)
      em2.setValue("blink", c2.blink);
    this.vrm.update(dt);
  }
  resetPose() {
    for (const b of BONES)
      this.bones[b]?.quaternion.identity();
    this.bones.hips?.position.copy(this.restHips);
  }
  setBone(name, x, y, z, w, order = "XYZ") {
    const bone = this.bones[name];
    if (!bone)
      return;
    _qa.setFromEuler(_e2.set(x, y, z, order));
    if (w >= 0.999)
      bone.quaternion.copy(_qa);
    else
      bone.quaternion.slerp(_qa, w);
  }
  /** Fallback poses on the normalized rig (rest = T-pose, facing +z, left hand at +x). */
  proceduralPose(state, c2, dt, w) {
    const t = this.t;
    this.amt += ((state === "walk" ? Math.min(1, c2.speed / 1.1) : 0) - this.amt) * (1 - Math.exp(-dt * 10));
    if (state === "walk")
      this.phase += dt * (3 + 4.2 * c2.speed);
    const s = Math.sin(this.phase), m = this.amt;
    const breath = Math.sin(t * 1.6) * 0.015;
    let hipsY = 0, hipsZ = 0;
    let L = { ux: 0.05, uz: -1.22, uy: 0, ly: -0.18 }, R = { ux: 0.05, uz: 1.22, uy: 0, ly: 0.18 };
    let legL = { u: 0, l: 0 }, legR = { u: 0, l: 0 };
    let spine = { x: breath, y: 0, z: 0 };
    switch (state) {
      case "walk":
        legL = { u: -s * 0.5 * m, l: (0.1 + 0.55 * Math.max(0, Math.sin(this.phase - 1.3))) * m };
        legR = { u: s * 0.5 * m, l: (0.1 + 0.55 * Math.max(0, Math.sin(this.phase + Math.PI - 1.3))) * m };
        L.ux = 0.05 + s * 0.4 * m;
        R.ux = 0.05 - s * 0.4 * m;
        hipsY = Math.abs(Math.cos(this.phase)) * 0.02 * m;
        break;
      case "sit":
        legL = { u: -1.5, l: 1.5 };
        legR = { u: -1.5, l: 1.5 };
        L = { ux: -0.5, uz: -1.1, uy: 0, ly: -0.7 };
        R = { ux: -0.5, uz: 1.1, uy: 0, ly: 0.7 };
        hipsY = (0.5 - this.feet) / this.scale - this.restHips.y;
        hipsZ = -0.08 / this.scale;
        break;
      case "dance": {
        const d = Math.sin(t * 7);
        legL = { u: d * 0.3, l: 0.3 + 0.2 * d };
        legR = { u: -d * 0.3, l: 0.3 - 0.2 * d };
        L = { ux: 0, uz: 1 + 0.3 * Math.sin(t * 7), uy: 0, ly: -0.3 };
        R = { ux: 0, uz: -(1 + 0.3 * Math.sin(t * 7 + Math.PI)), uy: 0, ly: 0.3 };
        spine = { x: 0, y: Math.sin(t * 1.75) * 0.25, z: Math.sin(t * 3.5) * 0.12 };
        hipsY = Math.abs(d) * 0.05;
        break;
      }
      case "point":
        R = { ux: 0, uz: -0.15, uy: 1.45, ly: 0 };
        break;
      case "talk":
        L = { ux: -0.35, uz: -1.1, uy: 0, ly: -1.15 + 0.25 * Math.sin(t * 4.2) };
        R = { ux: -0.35, uz: 1.1, uy: 0, ly: 1.05 + 0.25 * Math.sin(t * 3.7 + 1) };
        break;
      case "look":
        L = { ux: 0.45, uz: -1.15, uy: 0, ly: 0.6 };
        R = { ux: 0.45, uz: 1.15, uy: 0, ly: -0.6 };
        spine.x = -0.04;
        break;
    }
    this.setBone("leftUpperArm", L.ux, L.uy, L.uz, w);
    this.setBone("leftLowerArm", 0, L.ly, 0, w);
    this.setBone("rightUpperArm", R.ux, R.uy, R.uz, w);
    this.setBone("rightLowerArm", 0, R.ly, 0, w);
    this.setBone("leftUpperLeg", legL.u, 0, 0, w);
    this.setBone("leftLowerLeg", legL.l, 0, 0, w);
    this.setBone("rightUpperLeg", legR.u, 0, 0, w);
    this.setBone("rightLowerLeg", legR.l, 0, 0, w);
    this.setBone("spine", spine.x, spine.y, spine.z, w);
    const hips = this.bones.hips;
    if (hips) {
      _v1.set(this.restHips.x, this.restHips.y + hipsY, this.restHips.z + hipsZ);
      hips.position.lerp(_v1, w);
    }
  }
  applyLook(c2) {
    const neck = this.bones.neck, head = this.bones.head;
    if (neck)
      neck.quaternion.multiply(_qa.setFromEuler(_e2.set(-c2.lookPitch * 0.4, c2.lookYaw * 0.4, 0, "YXZ")));
    if (head)
      head.quaternion.multiply(_qa.setFromEuler(_e2.set(-c2.lookPitch * 0.6, c2.lookYaw * 0.6, 0, "YXZ")));
  }
  applyHold(c2) {
    if (!c2.hold || c2.hold.amount <= 1e-3)
      return;
    const p = c2.hold.side === "left" ? "left" : "right";
    const up2 = this.bones[`${p}UpperArm`], lo = this.bones[`${p}LowerArm`], hand = this.bones[`${p}Hand`];
    if (!up2 || !lo || !hand)
      return;
    const pole = new THREE6.Vector3(0, 0, -1).applyQuaternion(this.object.getWorldQuaternion(new THREE6.Quaternion()));
    twoBoneIK(up2, lo, hand, c2.hold.target, pole, c2.hold.amount);
  }
  dispose() {
    this.mixer.stopAllAction();
    this.vrm.scene.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose());
      }
    });
  }
};

// src/characters/character.ts
var world = null;
function setWorld(w) {
  world = w;
}
function getWorld() {
  if (!world)
    throw new Error("Characters.setWorld() must be called first");
  return world;
}
var characters = [];
var charIds = 0;
function nextCharOutlineId() {
  return (250 + charIds++ % 5) / 255;
}
var wrap2 = (a2) => Math.atan2(Math.sin(a2), Math.cos(a2));
var lerpAngle = (a2, b, k2) => a2 + wrap2(b - a2) * k2;
var shadowTex = (() => {
  const c2 = document.createElement("canvas");
  c2.width = c2.height = 128;
  const x = c2.getContext("2d");
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(40,30,20,.38)");
  g.addColorStop(1, "rgba(40,30,20,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE7.CanvasTexture(c2);
})();
var Character = class {
  constructor(opts) {
    this.root = new THREE7.Group();
    /** Heading to settle on when standing still. */
    this.faceHeading = null;
    /** For controlled characters: speed the host is moving them at. */
    this.inputSpeed = 0;
    this.maxSpeed = 1.5;
    this.state = "walk";
    this.speed = 0;
    /** Something specific to look at (exhibit, partner's head). */
    this.lookAtPoint = null;
    this.partner = null;
    this.hold = null;
    /** Free text shown in the debug overlay. */
    this.debug = "";
    this.bodyKind = "demo";
    this.tagC = document.createElement("canvas");
    this.yaw = 0;
    this.pitch = 0;
    this.blinkTimer = 1 + Math.random() * 3;
    this.blinkT = -1;
    this.glanceTimer = 5 + Math.random() * 6;
    this.glanceLeft = 0;
    this.holdAmt = 0;
    this.loadToken = 0;
    this.opts = { ...opts };
    this.kind = opts.kind;
    this.name = opts.name || (opts.kind === "boy" ? "Boy" : "Girl");
    this.height = HEIGHTS[opts.kind];
    this.controlled = !!opts.controlled;
    this.x = this.tx = opts.x ?? 0;
    this.z = this.tz = opts.z ?? 0;
    this.heading = opts.heading ?? 0;
    this.outlineId = nextCharOutlineId();
    this.root.userData.outlineGroup = this.outlineId;
    this.root.name = "character:" + this.name;
    this.tagC.width = 512;
    this.tagC.height = 128;
    this.tagTex = new THREE7.CanvasTexture(this.tagC);
    this.tag = new THREE7.Sprite(new THREE7.SpriteMaterial({ map: this.tagTex, transparent: true, depthWrite: false }));
    this.tag.scale.set(0.62, 0.155, 1);
    this.tag.userData.surf = "unlit";
    this.tag.userData.noOutline = true;
    this.tag.visible = !!opts.showTag;
    this.root.add(this.tag);
    const w = getWorld();
    this.shadow = new THREE7.Mesh(new THREE7.PlaneGeometry(0.9, 0.9), new THREE7.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.012;
    this.shadow.userData.surf = "unlit";
    this.shadow.userData.noOutline = true;
    w.scene.add(this.shadow);
    w.scene.add(this.root);
    characters.push(this);
    this.configure({});
  }
  /** Legacy alias used by the museum's controls. */
  get mode() {
    return this.state;
  }
  set mode(v) {
    this.state = v;
  }
  /** Change kind/colours and rebuild. Uses the demo character, then upgrades to VRM if the file exists. */
  configure(patch) {
    Object.assign(this.opts, patch);
    if (patch.kind) {
      this.kind = patch.kind;
      this.height = HEIGHTS[patch.kind];
    }
    try {
      this.setBody(new SummerBody(this.kind, { top: this.opts.outfitTop, bottom: this.opts.outfitBottom }, { bump: !!this.opts.bump }), "demo");
    } catch (e) {
      console.warn("Demo character failed, using the simple figure instead", e);
      this.setBody(new ProceduralBody(this.kind, this.opts.topColor ?? (this.kind === "boy" ? "#23272b" : "#9e2430"), this.height, this.opts.pantsColor), "placeholder");
    }
    const url = this.opts.vrmUrl === void 0 ? ASSETS[this.kind] : this.opts.vrmUrl;
    if (url)
      this.tryVRM(url);
  }
  setBody(body, kind) {
    if (this.body) {
      this.root.remove(this.body.object);
      this.body.dispose();
    }
    this.body = body;
    this.bodyKind = kind;
    this.height = body.height;
    this.root.add(body.object);
    this.tag.position.y = this.height + 0.28;
    getWorld().onBodyChanged(this.root);
  }
  async tryVRM(url) {
    const token = ++this.loadToken;
    const loaded = await loadVRM(url, HEIGHTS[this.kind]);
    if (!loaded || token !== this.loadToken)
      return;
    stylizeVRM(loaded.vrm, {
      outlineId: this.outlineId,
      clothTint: this.opts.clothTint ? new THREE7.Color(this.opts.clothTint) : null,
      hairTint: this.opts.hairTint ? new THREE7.Color(this.opts.hairTint) : null
    });
    const body = new VRMBody(loaded);
    this.setBody(body, "vrm");
    await body.loadClips(ASSETS.clips);
  }
  /** World-space point roughly between the eyes. */
  headPosition(out = new THREE7.Vector3()) {
    return out.set(this.x, this.height * 0.93, this.z);
  }
  update(dt) {
    const w = getWorld();
    const k2 = 1 - Math.exp(-dt * 10);
    if (this.controlled) {
      this.speed = this.inputSpeed;
    } else if (this.state === "sit") {
      this.speed = 0;
    } else {
      const dx = this.tx - this.x, dz = this.tz - this.z, dist = Math.hypot(dx, dz);
      let moved = 0;
      if (dist > 0.03) {
        const want = Math.min(this.maxSpeed, dist * 2.2 + 0.15);
        const step = Math.min(dist, Math.min(want, this.speed + 2.5 * dt + 0.05) * dt);
        const sx = dx / dist * step, sz = dz / dist * step;
        const ox = this.x, oz = this.z;
        if (!w.collide(this.x + sx, this.z, 0.28, this))
          this.x += sx;
        if (!w.collide(this.x, this.z + sz, 0.28, this))
          this.z += sz;
        moved = Math.hypot(this.x - ox, this.z - oz);
        if (dist > 0.12 && moved > 5e-4)
          this.heading = lerpAngle(this.heading, Math.atan2(dx, dz), 1 - Math.exp(-dt * 7));
      }
      this.speed += (moved / Math.max(dt, 1e-4) - this.speed) * k2;
      if (dist <= 0.12 && this.faceHeading !== null)
        this.heading = lerpAngle(this.heading, this.faceHeading, 1 - Math.exp(-dt * 4));
    }
    const head = this.headPosition();
    let target = null;
    this.glanceTimer -= dt;
    if (this.glanceTimer <= 0 && this.partner && this.state !== "point") {
      this.glanceLeft = 1.3;
      this.glanceTimer = 6 + Math.random() * 7;
    }
    if (this.glanceLeft > 0 && this.partner) {
      this.glanceLeft -= dt;
      target = this.partner.headPosition(new THREE7.Vector3());
    } else if (this.lookAtPoint)
      target = this.lookAtPoint;
    else {
      let best = 5.5;
      for (const e of w.exhibits) {
        const d = Math.hypot(e.x - this.x, e.z - this.z);
        const rel = wrap2(Math.atan2(e.x - this.x, e.z - this.z) - this.heading);
        if (d < best && Math.abs(rel) < 1.6) {
          best = d;
          target = e;
        }
      }
    }
    let wantYaw = 0, wantPitch = 0;
    if (target && this.state !== "dance") {
      wantYaw = THREE7.MathUtils.clamp(wrap2(Math.atan2(target.x - head.x, target.z - head.z) - this.heading), -1.05, 1.05);
      wantPitch = THREE7.MathUtils.clamp(Math.atan2(target.y - head.y, Math.hypot(target.x - head.x, target.z - head.z)), -0.4, 0.35);
      if (this.state === "walk" && this.speed > 0.2) {
        wantYaw *= 0.5;
        wantPitch *= 0.5;
      }
    }
    this.yaw += (wantYaw - this.yaw) * (1 - Math.exp(-dt * 3));
    this.pitch += (wantPitch - this.pitch) * (1 - Math.exp(-dt * 3));
    let blink = 0;
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0 && this.blinkT < 0) {
      this.blinkT = 0;
      this.blinkTimer = 2 + Math.random() * 3.5;
    }
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      blink = Math.max(0, 1 - Math.abs(this.blinkT - 0.075) / 0.075);
      if (this.blinkT > 0.15)
        this.blinkT = -1;
    }
    let hold = null;
    const holding = this.hold && (this.state === "walk" || this.state === "sit") ? this.hold : null;
    this.holdAmt += ((holding ? 1 : 0) - this.holdAmt) * (1 - Math.exp(-dt * 5));
    const hw = holding || this.hold;
    if (hw && this.holdAmt > 1e-3) {
      const o = hw.with;
      const seated = this.state === "sit";
      const tgt = new THREE7.Vector3((this.x + o.x) / 2, seated ? 0.52 : Math.min(this.height, o.height) * 0.47, (this.z + o.z) / 2);
      const fwd = Math.atan2(Math.sin(this.heading) + Math.sin(o.heading), Math.cos(this.heading) + Math.cos(o.heading));
      const ahead = seated ? 0.2 : 0.12;
      tgt.x += Math.sin(fwd) * ahead;
      tgt.z += Math.cos(fwd) * ahead;
      hold = { side: hw.side, amount: this.holdAmt, target: tgt };
    }
    this.tag.position.y = (this.state === "sit" ? this.height * 0.72 : this.height) + 0.28;
    this.root.position.set(this.x, 0, this.z);
    this.root.rotation.y = this.heading;
    this.root.updateMatrixWorld(true);
    this.body.update(dt, { state: this.state, speed: this.speed, lookYaw: this.yaw, lookPitch: this.pitch, blink, hold });
    this.shadow.position.set(this.x, 0.012, this.z);
  }
  dispose() {
    const w = getWorld();
    w.scene.remove(this.root);
    w.scene.remove(this.shadow);
    this.body.dispose();
    const i = characters.indexOf(this);
    if (i >= 0)
      characters.splice(i, 1);
  }
};

// src/characters/couple.ts
import * as THREE8 from "three";
var VARIANTS = [
  { boyTop: "#23272b", girlTop: "#9e2430", pants: null, cloth: null, hair: null, bt: null, bb: null, gt: null, gb: null },
  { boyTop: "#2f4a68", girlTop: "#d9b44a", pants: "#3a3226", cloth: "#9fb6d6", hair: "#8a6a55", bt: "#e8d9b8", bb: "#3a3226", gt: "#f2d1d6", gb: "#5a3a2a" },
  { boyTop: "#4e6b4a", girlTop: "#e3d7c4", pants: "#2b2f38", cloth: "#b9d1a6", hair: null, bt: "#b9cfa6", bb: "#2b2f38", gt: "#f4e8c8", gb: "#3e5a4a" },
  { boyTop: "#7a3b3b", girlTop: "#5a6f96", pants: "#24262c", cloth: "#e0a8a0", hair: "#5a3a2a", bt: "#f0f0f0", bb: "#24262c", gt: "#cfe0ef", gb: "#7a3b3b" },
  { boyTop: "#c8b89a", girlTop: "#6b4e7a", pants: "#3b3f4a", cloth: "#c7b3d8", hair: null, bt: "#d8c7e6", bb: "#3b3f4a", gt: "#fbe7b0", gb: "#2f4a68" }
];
var RoutePath = class {
  constructor(route) {
    this.route = route;
    this.pts = [];
    this.length = 0;
    const w = route.waypoints;
    let s = 0;
    for (let i = 0; i < w.length; i++) {
      if (i > 0)
        s += Math.hypot(w[i].x - w[i - 1].x, w[i].z - w[i - 1].z);
      this.pts.push({ x: w[i].x, z: w[i].z, s, wp: w[i] });
    }
    if (route.loop && w.length > 1)
      s += Math.hypot(w[0].x - w[w.length - 1].x, w[0].z - w[w.length - 1].z);
    this.length = Math.max(s, 1e-3);
  }
  wrapS(s) {
    return this.route.loop ? (s % this.length + this.length) % this.length : THREE8.MathUtils.clamp(s, 0, this.length);
  }
  at(sIn) {
    const s = this.wrapS(sIn), p = this.pts;
    for (let i = 0; i < p.length; i++) {
      const a2 = p[i], b = i + 1 < p.length ? p[i + 1] : this.route.loop ? p[0] : p[i];
      const end = i + 1 < p.length ? b.s : this.length;
      if (s <= end || i === p.length - 1) {
        const seg = Math.max(end - a2.s, 1e-6), t = THREE8.MathUtils.clamp((s - a2.s) / seg, 0, 1);
        return { x: a2.x + (b.x - a2.x) * t, z: a2.z + (b.z - a2.z) * t };
      }
    }
    return { x: p[0].x, z: p[0].z };
  }
  /** Distance travelled from `from` to `to` going forward around the loop. */
  ahead(from, to) {
    return this.route.loop ? ((to - from) % this.length + this.length) % this.length : to - from;
  }
};
var groupCount = 0;
var groups = [];
var Couple = class {
  constructor(route, startOffset, members, opts = {}) {
    this.phase = "WALK";
    this.timer = 0;
    this.stop = null;
    this.stopCount = 0;
    this.path = new RoutePath(route);
    this.s = this.lastS = this.path.wrapS(startOffset);
    this.members = members;
    this.boy = members.find((m) => m.kind === "boy") || members[0];
    this.girl = members.length > 1 ? members.find((m) => m !== this.boy) || null : null;
    this.holdHands = !!opts.holdHands;
    this.label = opts.label || `Visitors ${++groupCount}`;
    if (this.boy && this.girl) {
      this.boy.partner = this.girl;
      this.girl.partner = this.boy;
    }
    this.walkTargets(true);
    groups.push(this);
  }
  get route() {
    return this.path.route;
  }
  timing(key) {
    const st = this.stop?.wp.stop;
    return st && st[key + "_s"] || this.route.timing[key];
  }
  /** Place the members either side of the route centre at the current distance. */
  walkTargets(snap = false) {
    const c2 = this.path.at(this.s), ahead = this.path.at(this.s + 0.9);
    let dx = ahead.x - c2.x, dz = ahead.z - c2.z;
    const l = Math.hypot(dx, dz) || 1;
    dx /= l;
    dz /= l;
    const h = Math.atan2(dx, dz);
    const half = this.route.spacing / 2;
    const leftX = Math.cos(h), leftZ = -Math.sin(h);
    const place = (m, side) => {
      m.tx = c2.x + leftX * half * side;
      m.tz = c2.z + leftZ * half * side;
      m.faceHeading = h;
      if (snap) {
        m.x = m.tx;
        m.z = m.tz;
        m.heading = h;
      }
    };
    if (this.girl && this.boy) {
      place(this.girl, 1);
      place(this.boy, -1);
    } else if (this.boy)
      place(this.boy, 0);
  }
  /** Formation at a stop: side by side facing the exhibit, girl still on the boy's left. */
  stopTargets() {
    const st = this.stop;
    const look = st.wp.stop.look;
    let fx = look[0] - st.x, fz = look[2] - st.z;
    const l = Math.hypot(fx, fz) || 1;
    fx /= l;
    fz /= l;
    const h = Math.atan2(fx, fz), half = this.route.spacing / 2 + 0.03;
    const lx = Math.cos(h), lz = -Math.sin(h);
    if (this.girl && this.boy) {
      this.girl.tx = st.x + lx * half;
      this.girl.tz = st.z + lz * half;
      this.boy.tx = st.x - lx * half;
      this.boy.tz = st.z - lz * half;
    } else if (this.boy) {
      this.boy.tx = st.x;
      this.boy.tz = st.z;
    }
    for (const m of this.members)
      m.faceHeading = h;
    return h;
  }
  setAll(state, look) {
    for (const m of this.members) {
      m.state = state;
      m.lookAtPoint = look;
    }
  }
  update(dt) {
    this.timer -= dt;
    const pair = !!(this.girl && this.boy);
    switch (this.phase) {
      case "WALK": {
        const lag = Math.max(...this.members.map((m) => Math.hypot(m.tx - m.x, m.tz - m.z)));
        const pace = lag > 0.7 ? 0.15 : lag > 0.4 ? 0.6 : 1;
        this.lastS = this.s;
        this.s = this.path.wrapS(this.s + this.route.speed * pace * dt);
        const travelled = this.path.ahead(this.lastS, this.s);
        for (const p of this.path.pts) {
          if (!p.wp.stop)
            continue;
          const d = this.path.ahead(this.lastS, p.s);
          if (d > 0 && d <= travelled + 1e-6) {
            this.stop = p;
            this.phase = "TURN";
            this.timer = 4;
            break;
          }
        }
        this.setAll("walk", null);
        if (this.phase === "WALK")
          this.walkTargets();
        for (const m of this.members)
          m.maxSpeed = this.route.speed * 1.6 + 0.2;
        if (this.boy && this.girl) {
          this.boy.hold = this.holdHands ? { with: this.girl, side: "left" } : null;
          this.girl.hold = this.holdHands ? { with: this.boy, side: "right" } : null;
        }
        break;
      }
      case "TURN": {
        const h = this.stopTargets();
        const settled = this.members.every((m) => Math.hypot(m.tx - m.x, m.tz - m.z) < 0.15 && Math.abs(Math.atan2(Math.sin(m.heading - h), Math.cos(m.heading - h))) < 0.25);
        if (settled || this.timer <= 0) {
          const st = this.stop.wp.stop;
          this.phase = "LOOK";
          this.timer = this.timing("look");
          this.setAll("look", new THREE8.Vector3(st.look[0], st.look[1], st.look[2]));
        }
        break;
      }
      case "LOOK":
        if (this.timer <= 0) {
          this.phase = "POINT";
          this.timer = this.timing("point");
          const pointer = pair ? this.stopCount % 2 === 0 ? this.girl : this.boy : this.boy;
          const other = pair ? pointer === this.girl ? this.boy : this.girl : null;
          pointer.state = "point";
          if (other) {
            other.state = "walk";
            other.lookAtPoint = pointer.headPosition(new THREE8.Vector3());
            other.faceHeading = Math.atan2(pointer.x - other.x, pointer.z - other.z) * 0.55 + (other.faceHeading ?? 0) * 0.45;
          }
        }
        break;
      case "POINT":
        if (this.timer <= 0) {
          if (pair) {
            this.phase = "TALK";
            this.timer = this.timing("talk");
            const g = this.girl, b = this.boy;
            const ex = this.stopTargets();
            const toB = Math.atan2(b.x - g.x, b.z - g.z), toG = Math.atan2(g.x - b.x, g.z - b.z);
            const mix = (a2, c2) => Math.atan2(Math.sin(a2) * 0.6 + Math.sin(c2) * 0.4, Math.cos(a2) * 0.6 + Math.cos(c2) * 0.4);
            g.faceHeading = mix(toB, ex);
            b.faceHeading = mix(toG, ex);
            g.state = "talk";
            b.state = "talk";
            g.lookAtPoint = b.headPosition(new THREE8.Vector3());
            b.lookAtPoint = g.headPosition(new THREE8.Vector3());
          } else
            this.leaveStop();
        }
        break;
      case "TALK":
        if (this.timer <= 0)
          this.leaveStop();
        break;
    }
    for (const m of this.members) {
      m.debug = `${this.label} \xB7 ${this.phase}${this.phase !== "WALK" ? " " + Math.max(0, this.timer).toFixed(1) + "s" : ""}${this.stop && this.phase !== "WALK" ? " \xB7 " + this.stop.wp.stop.label : ""}`;
    }
  }
  leaveStop() {
    this.phase = "WALK";
    this.stopCount++;
    if (this.stop)
      this.s = this.path.wrapS(this.stop.s + 0.01);
    this.stop = null;
    this.setAll("walk", null);
  }
  dispose() {
    this.members.forEach((m) => m.dispose());
    const i = groups.indexOf(this);
    if (i >= 0)
      groups.splice(i, 1);
  }
};
function addCouple(route, startOffset = 0, opts = {}) {
  const v = VARIANTS[(opts.variant ?? groups.length) % VARIANTS.length];
  const boy = new Character({ kind: "boy", name: "Visitor", topColor: v.boyTop, pantsColor: v.pants ?? void 0, clothTint: v.cloth, hairTint: v.hair, outfitTop: v.bt, outfitBottom: v.bb, vrmUrl: opts.boyVrm });
  const girl = new Character({ kind: "girl", name: "Visitor", topColor: v.girlTop, pantsColor: v.pants ?? void 0, clothTint: v.cloth, hairTint: v.hair, outfitTop: v.gt, outfitBottom: v.gb, vrmUrl: opts.girlVrm });
  return new Couple(route, startOffset, [boy, girl], opts);
}
function addVisitor(vrmPath, route, startOffset = 0, opts = {}) {
  const kind = vrmPath && /girl/i.test(vrmPath) ? "girl" : "boy";
  const v = VARIANTS[(opts.variant ?? groups.length + 2) % VARIANTS.length];
  const c2 = new Character({ kind, name: "Visitor", topColor: kind === "boy" ? v.boyTop : v.girlTop, pantsColor: v.pants ?? void 0, clothTint: v.cloth, hairTint: v.hair, outfitTop: kind === "boy" ? v.bt : v.gt, outfitBottom: kind === "boy" ? v.bb : v.gb, vrmUrl: vrmPath });
  return new Couple(route, startOffset, [c2], { ...opts, label: opts.label || "Visitor" });
}

// src/characters/route.ts
var GALLERY_ROUTE = {
  name: "Gallery loop",
  loop: true,
  speed: 0.95,
  spacing: 0.6,
  timing: { look: 2.6, point: 2, talk: 3.6 },
  /* Room: x -15..15, z -11..11 (entrance side is +z). */
  waypoints: [
    { x: 0, z: 5.5 },
    { x: -4.5, z: 9.2, stop: { look: [-4.5, 1.8, 11], label: "Front wall, left" } },
    { x: -8.5, z: 5.6, stop: { look: [-8.5, 1.5, 7.5], label: "Wishes board", talk_s: 4.5 } },
    { x: -13.2, z: 6, stop: { look: [-15, 1.8, 6], label: "Left wall 1" } },
    { x: -13.2, z: 0, stop: { look: [-15, 1.8, 0], label: "Left wall 2" } },
    { x: -13.2, z: -6, stop: { look: [-15, 1.8, -6], label: "Left wall 3" } },
    { x: -9.5, z: -9.2, stop: { look: [-9.5, 1.8, -11], label: "Back wall, left" } },
    { x: -2.5, z: -7.8, stop: { look: [0, 2.4, -11], label: "Invitation wall", talk_s: 4.5 } },
    { x: 2.4, z: -4.8, stop: { look: [0, 1.3, -3], label: "Centrepiece" } },
    { x: 9.5, z: -9.2, stop: { look: [9.5, 1.8, -11], label: "Back wall, right" } },
    { x: 13.2, z: -7, stop: { look: [15, 1.8, -7], label: "Right wall 1" } },
    { x: 9.4, z: -2.6 },
    { x: 9.4, z: 2.6 },
    { x: 13.2, z: 7, stop: { look: [15, 1.8, 7], label: "Right wall 2" } },
    { x: 8.5, z: 5.4, stop: { look: [8.5, 1.6, 7.5], label: "Photo arch" } },
    { x: 4.5, z: 9.2, stop: { look: [4.5, 1.8, 11], label: "Front wall, right" } }
  ]
};

// src/characters/index.ts
function update(dt, camera) {
  for (const g of groups)
    g.update(dt);
  for (const c2 of characters)
    c2.update(dt);
  if (debugOn && camera)
    updateLabels(camera);
}
function setHoldHands(on) {
  for (const g of groups)
    g.holdHands = on;
}
var debugOn = false;
var debugGroup = null;
var labelBox = null;
var labels = /* @__PURE__ */ new Map();
function buildDebug(route) {
  const g = new THREE9.Group();
  g.name = "route-debug";
  const mk = (color) => new THREE9.ShaderMaterial({
    glslVersion: THREE9.GLSL3,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    uniforms: { uColor: { value: new THREE9.Color(color) } },
    vertexShader: "void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform vec3 uColor; layout(location = 0) out highp vec4 o0; layout(location = 1) out highp vec4 o1; void main(){ o0 = vec4(uColor, 1.0); o1 = vec4(0.0); }"
  });
  const walkM = mk(5939416), stopM = mk(14725184), lineM = mk(5939416), lookM = mk(14725184);
  const ribbon = (p, q2, m, wdt) => {
    const len = p.distanceTo(q2);
    if (len < 1e-3)
      return;
    const r = new THREE9.Mesh(new THREE9.BoxGeometry(wdt, wdt, len), m);
    r.position.copy(p).add(q2).multiplyScalar(0.5);
    r.lookAt(q2);
    r.renderOrder = 20;
    g.add(r);
  };
  const pts = [];
  route.waypoints.forEach((w) => {
    const s = new THREE9.Mesh(new THREE9.SphereGeometry(w.stop ? 0.16 : 0.1, 12, 8), w.stop ? stopM : walkM);
    s.position.set(w.x, 0.08, w.z);
    s.renderOrder = 20;
    g.add(s);
    pts.push(new THREE9.Vector3(w.x, 0.05, w.z));
    if (w.stop) {
      ribbon(new THREE9.Vector3(w.x, 0.1, w.z), new THREE9.Vector3(...w.stop.look), lookM, 0.025);
    }
  });
  if (route.loop)
    pts.push(pts[0].clone());
  for (let i = 1; i < pts.length; i++)
    ribbon(pts[i - 1], pts[i], lineM, 0.05);
  g.traverse((o) => {
    o.userData.noOutline = true;
  });
  return g;
}
function updateLabels(camera) {
  const v = new THREE9.Vector3();
  for (const c2 of characters) {
    let el = labels.get(c2);
    if (!el) {
      el = document.createElement("div");
      el.style.cssText = "position:absolute;transform:translate(-50%,-100%);white-space:nowrap;font:500 11px/1.35 Jost,system-ui,sans-serif;color:#f6efe3;background:rgba(26,21,18,.72);padding:3px 7px;border-radius:6px;";
      labelBox.appendChild(el);
      labels.set(c2, el);
    }
    v.set(c2.x, c2.height + 0.45, c2.z).project(camera);
    if (v.z > 1) {
      el.hidden = true;
      continue;
    }
    el.hidden = false;
    el.style.left = (v.x + 1) / 2 * innerWidth + "px";
    el.style.top = (1 - v.y) / 2 * innerHeight + "px";
    el.textContent = `${c2.name} (${c2.bodyKind}) \xB7 ${c2.state}${c2.state === "walk" ? " " + c2.speed.toFixed(2) + " m/s" : ""}${c2.debug ? " \xB7 " + c2.debug : ""}`;
  }
  for (const [c2, el] of labels)
    if (!characters.includes(c2)) {
      el.remove();
      labels.delete(c2);
    }
}
function toggleDebug(on) {
  debugOn = on ?? !debugOn;
  const w = getWorld();
  if (!debugGroup) {
    debugGroup = buildDebug(groups[0]?.path.route ?? GALLERY_ROUTE);
    w.scene.add(debugGroup);
    w.onBodyChanged(debugGroup);
  }
  debugGroup.visible = debugOn;
  if (!labelBox) {
    labelBox = document.createElement("div");
    labelBox.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:6;overflow:hidden";
    document.body.appendChild(labelBox);
  }
  labelBox.hidden = !debugOn;
  return debugOn;
}
function reset() {
  characters.length = 0;
  groups.length = 0;
  debugOn = false;
  debugGroup = null;
  if (labelBox) {
    labelBox.remove();
    labelBox = null;
  }
  labels.clear();
}
export {
  ASSETS,
  Character,
  Couple,
  GALLERY_ROUTE,
  HEIGHTS,
  VARIANTS,
  addCouple,
  addVisitor,
  characters,
  groups,
  reset,
  setHoldHands,
  setWorld,
  toggleDebug,
  update
};