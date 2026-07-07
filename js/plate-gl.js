/* plate-gl.js — realistic hero weight plate (three.js, PBR).
   Procedurally textured barbell plate: canvas-painted albedo/normal/rough/
   metal maps, extruded body with real bore + bean grip cutouts, raised rim
   rings and a steel bore sleeve, lit by a painted equirect environment.
   The plate only renders itself — the hero animation stays in main.js:
   the drop is the WAAPI transform on #plate-drop, and the idle spin +
   scroll rotation arrive through setRotation(deg). The 10deg forward tilt
   the old CSS plate got from .plate-tilt{rotateX(10deg)} is baked into the
   scene here. initPlateGL resolves to null when WebGL is unavailable. */

import * as THREE from 'three';

var BASE_TILT = -10 * Math.PI / 180; // forward tilt, matches the old CSS rotateX(10deg)

var ALB = 2048;              // albedo resolution
var AUX = 1024;              // normal / roughness / metalness resolution

/* Plate form (world units, plate radius = 1) */
var R = 1.0;
var BODY_T = 0.12;           // thickness of the recessed body/face
var BODY_BEV = 0.025;
var BORE_R = 0.13;           // center bore radius

/* Raised rim ring (this is what makes the grey face read as indented) */
var RIM_INNER = 0.80;        // where the raised rim starts
var RIM_DEPTH = 0.05;        // rim ring thickness
var RIM_Z = 0.08;            // how far the rim is pushed out from center on each side
var RIM_BEV = 0.02;

/* Ergonomic "bean" grip slots */
var SLOT_RC = 0.66;          // centerline radius
var SLOT_HW = 0.095;         // half thickness of the bean
var SLOT_BETA = 0.46;        // angular half-span (radians)

/* Branding text */
var TEXT_R = 0.73;           // text radius (fraction of plate radius)
var TEXT_FONT = 0.041;       // font size (fraction of texture size)

/* ---------------- procedural texture generation ---------------- */
function newCanvas(size) { var c = document.createElement('canvas'); c.width = c.height = size; return c; }
function g(v) { return 'rgb(' + v + ',' + v + ',' + v + ')'; }
function fontFor(px) { return px + 'px "Black Ops One", Impact, "Arial Narrow", sans-serif'; }

// Curved text. 'in' = tops toward center (reads upward), 'out' = tops toward edge (reads downward).
function drawArcText(ctx, str, cx, cy, radius, centerA, mode, fontPx, color, spacing) {
  ctx.save();
  ctx.font = fontFor(fontPx);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var chars = str.split('');
  var widths = chars.map(function (ch) { return ctx.measureText(ch).width; });
  var total = widths.reduce(function (s, w) { return s + w; }, 0) + spacing * (chars.length - 1);
  var totalA = total / radius;
  var dir = (mode === 'in') ? -1 : 1;
  var cursor = (mode === 'in') ? centerA + totalA / 2 : centerA - totalA / 2;
  for (var i = 0; i < chars.length; i++) {
    var w = widths[i];
    var a = cursor + dir * (w / 2) / radius;
    var phi = (mode === 'in') ? a - Math.PI / 2 : a + Math.PI / 2;
    ctx.save();
    ctx.translate(cx + radius * Math.cos(a), cy + radius * Math.sin(a));
    ctx.rotate(phi);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    cursor += dir * (w + spacing) / radius;
  }
  ctx.restore();
}

function palette(kind) {
  switch (kind) {
    case 'albedo': return { bg: '#141414', face: '#6a6c70', orange: '#e46020', orangeEdge: '#7a2f12',
                            white: '#eef0ee', center: '#e6e8e7', text: '#eef0ee', rings: 'rgba(255,255,255,0.03)' };
    case 'height': return { bg: g(128), face: g(120), orange: g(188), orangeEdge: g(92),
                            white: g(150), center: g(150), text: g(240), rings: 'rgba(255,255,255,0.05)' };
    case 'rough':  return { bg: g(150), face: g(150), orange: g(82), orangeEdge: g(120),
                            white: g(120), center: g(126), text: g(120), rings: 'rgba(0,0,0,0)' };
    case 'metal':  return { bg: g(180), face: g(180), orange: g(14), orangeEdge: g(40),
                            white: g(34), center: g(30), text: g(34), rings: 'rgba(0,0,0,0)' };
  }
}

function drawPlateMap(kind) {
  var S = (kind === 'albedo') ? ALB : AUX;
  var c = newCanvas(S), ctx = c.getContext('2d');
  var p = palette(kind);
  var cx = S / 2, cy = S / 2, rad = S / 2;
  function rr(t) { return t * rad; }

  ctx.fillStyle = p.bg; ctx.fillRect(0, 0, S, S);
  ctx.beginPath(); ctx.arc(cx, cy, rr(0.99), 0, Math.PI * 2); ctx.fillStyle = p.face; ctx.fill();

  // faint concentric cast texture
  if (kind === 'albedo' || kind === 'height') {
    ctx.strokeStyle = p.rings; ctx.lineWidth = Math.max(1, S / 1400);
    for (var t = 0.20; t < 0.90; t += 0.035) { ctx.beginPath(); ctx.arc(cx, cy, rr(t), 0, Math.PI * 2); ctx.stroke(); }
  }
  // soft AO ring so the recess corner reads darker (albedo only)
  if (kind === 'albedo') {
    var gr = ctx.createRadialGradient(cx, cy, rr(0.70), cx, cy, rr(0.80));
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.28)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, rr(0.80), 0, Math.PI * 2); ctx.fill();
  }

  // branding text — stencil font, aligned on the sides between the grips
  var fontPx = TEXT_FONT * S;
  var textR = rr(TEXT_R);
  var sp = 0.003 * S;
  drawArcText(ctx, 'DEADLIFT DIGITAL',          cx, cy, textR, Math.PI, 'in',  fontPx, p.text, sp);
  drawArcText(ctx, 'WEBSITES THAT PULL WEIGHT', cx, cy, textR, 0,       'out', fontPx, p.text, sp);

  // center hub: orange ring -> thin dark edge -> white -> (bore is a real hole)
  ctx.beginPath(); ctx.arc(cx, cy, rr(0.255), 0, Math.PI * 2); ctx.fillStyle = p.orange; ctx.fill();
  ctx.lineWidth = S / 300; ctx.strokeStyle = p.orangeEdge;
  ctx.beginPath(); ctx.arc(cx, cy, rr(0.255), 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, rr(0.165), 0, Math.PI * 2); ctx.fillStyle = p.white; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, rr(0.165), 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, rr(0.135), 0, Math.PI * 2); ctx.fillStyle = p.center; ctx.fill();

  // micro grain
  if (kind === 'height' || kind === 'rough') {
    var amp = (kind === 'height') ? 8 : 16;
    var img = ctx.getImageData(0, 0, S, S), d = img.data;
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
      var dx = x - cx, dy = y - cy; if (dx * dx + dy * dy > rad * rad) continue;
      var n = (Math.random() * 2 - 1) * amp, i = (y * S + x) << 2;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
  }
  return c;
}

function heightToNormal(hc, strength) {
  var S = hc.width;
  var hd = hc.getContext('2d').getImageData(0, 0, S, S).data;
  var out = newCanvas(S), octx = out.getContext('2d'), img = octx.createImageData(S, S), o = img.data;
  function H(x, y) { x = x < 0 ? 0 : (x >= S ? S - 1 : x); y = y < 0 ? 0 : (y >= S ? S - 1 : y); return hd[(y * S + x) << 2] / 255; }
  for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
    var tl = H(x - 1, y - 1), t = H(x, y - 1), tr = H(x + 1, y - 1), l = H(x - 1, y), r = H(x + 1, y), bl = H(x - 1, y + 1), b = H(x, y + 1), br = H(x + 1, y + 1);
    var gx = (tr + 2 * r + br) - (tl + 2 * l + bl), gy = (bl + 2 * b + br) - (tl + 2 * t + tr);
    var nx = -gx * strength, ny = -gy * strength, nz = 1;
    var inv = 1 / Math.hypot(nx, ny, nz); nx *= inv; ny *= inv; nz *= inv;
    var i = (y * S + x) << 2;
    o[i] = (nx * 0.5 + 0.5) * 255; o[i + 1] = (ny * 0.5 + 0.5) * 255; o[i + 2] = (nz * 0.5 + 0.5) * 255; o[i + 3] = 255;
  }
  octx.putImageData(img, 0, 0); return out;
}

/* ---------------- geometry helpers ---------------- */
function makeBeanHole(phi0) {
  var Ro = SLOT_RC + SLOT_HW, Ri = SLOT_RC - SLOT_HW, hw = SLOT_HW;
  var aS = phi0 - SLOT_BETA, aE = phi0 + SLOT_BETA, seg = 24, pts = [];
  var i, a, t;
  for (i = 0; i <= seg; i++) { a = aS + (aE - aS) * i / seg; pts.push([Ro * Math.cos(a), Ro * Math.sin(a)]); }
  var ce = [SLOT_RC * Math.cos(aE), SLOT_RC * Math.sin(aE)];
  for (i = 1; i < seg; i++) { t = aE + Math.PI * i / seg; pts.push([ce[0] + hw * Math.cos(t), ce[1] + hw * Math.sin(t)]); }
  for (i = 0; i <= seg; i++) { a = aE + (aS - aE) * i / seg; pts.push([Ri * Math.cos(a), Ri * Math.sin(a)]); }
  var cs = [SLOT_RC * Math.cos(aS), SLOT_RC * Math.sin(aS)];
  for (i = 1; i < seg; i++) { t = aS + Math.PI + Math.PI * i / seg; pts.push([cs[0] + hw * Math.cos(t), cs[1] + hw * Math.sin(t)]); }
  var area = 0;
  for (i = 0; i < pts.length; i++) { var j = (i + 1) % pts.length; area += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1]; }
  if (area > 0) pts.reverse();
  return new THREE.Path(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
}

function makeRing(outer, inner, depth, bevel) {
  var s = new THREE.Shape(); s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  var h = new THREE.Path(); h.absarc(0, 0, inner, 0, Math.PI * 2, true); s.holes.push(h);
  var geo = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 150, steps: 1 });
  geo.center(); geo.computeVertexNormals(); return geo;
}

/* ---------------- boot: wait for the stencil font, then build ---------------- */
// opts.tilt (radians) overrides the default forward tilt. Mobile passes 0:
// its plate is rotated record-style by the CSS dd-spin animation, and only
// a dead-on, untilted render keeps that rotation wobble-free.
export function initPlateGL(mount, opts) {
  var fontWait = Promise.resolve();
  if (document.fonts && document.fonts.load) {
    fontWait = Promise.race([
      document.fonts.load('400 100px "Black Ops One"').then(function () { return document.fonts.ready; }),
      new Promise(function (res) { setTimeout(res, 2500); })
    ]).catch(function () {});
  }
  return fontWait.then(function () { return build(mount, opts); });
}

function build(mount, opts) {
  var tiltAngle = (opts && typeof opts.tilt === 'number') ? opts.tilt : BASE_TILT;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return null;
  }
  var w = mount.clientWidth || 600, h = mount.clientHeight || 600;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.style.display = 'block';
  mount.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
  // untilted (mobile record-spin) renders need the camera dead on axis,
  // or the CSS rotation would swing the perspective cue around
  camera.position.set(0, tiltAngle === 0 ? 0 : 0.12, 3.65); camera.lookAt(0, 0, 0);

  /* environment map for realistic reflections */
  (function () {
    var c = newCanvas(1024); c.height = 512; var ctx = c.getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 0, 512);
    grd.addColorStop(0, '#3a3f47'); grd.addColorStop(0.45, '#20232a'); grd.addColorStop(0.55, '#191b20'); grd.addColorStop(1, '#0c0d10');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 1024, 512);
    function soft(x, y, rx, ry, col) {
      var rg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
      rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save(); ctx.translate(x, y); ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry)); ctx.translate(-x, -y);
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(x, y, Math.max(rx, ry), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    soft(300, 150, 360, 220, 'rgba(255,255,255,0.95)');
    soft(760, 180, 240, 180, 'rgba(190,210,255,0.55)');
    soft(560, 470, 320, 120, 'rgba(255,240,220,0.25)');
    var eq = new THREE.CanvasTexture(c);
    eq.mapping = THREE.EquirectangularReflectionMapping;
    eq.colorSpace = THREE.SRGBColorSpace;
    var pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromEquirectangular(eq).texture;
    eq.dispose(); pm.dispose();
  })();

  /* textures */
  var maxAniso = renderer.capabilities.getMaxAnisotropy();
  function colorTex(cv) { var t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; return t; }
  function dataTex(cv) { var t = new THREE.CanvasTexture(cv); t.anisotropy = maxAniso; return t; }

  var albedoTex = colorTex(drawPlateMap('albedo'));
  var normalTex = dataTex(heightToNormal(drawPlateMap('height'), 2.2));
  var roughTex = dataTex(drawPlateMap('rough'));
  var metalTex = dataTex(drawPlateMap('metal'));

  /* materials */
  var faceMat = new THREE.MeshPhysicalMaterial({
    map: albedoTex, normalMap: normalTex,
    normalScale: new THREE.Vector2(-1.5, -1.5),
    roughnessMap: roughTex, metalnessMap: metalTex,
    roughness: 1.0, metalness: 1.0, clearcoat: 0.18, clearcoatRoughness: 0.35, envMapIntensity: 1.15
  });
  var metalMat = new THREE.MeshStandardMaterial({ color: 0x17181c, metalness: 0.9, roughness: 0.4, envMapIntensity: 1.15 });

  /* ---- recessed body (face + text + hub, with bore & bean holes) ---- */
  var shape = new THREE.Shape();
  shape.absarc(0, 0, R, 0, Math.PI * 2, false);
  var bore = new THREE.Path(); bore.absarc(0, 0, BORE_R, 0, Math.PI * 2, true); shape.holes.push(bore);
  shape.holes.push(makeBeanHole(Math.PI / 2));    // top grip
  shape.holes.push(makeBeanHole(-Math.PI / 2));   // bottom grip

  var uvGen = {
    generateTopUV: function (geo, v, a, b, c) {
      function u(i) { return (v[i * 3] / (2 * R)) + 0.5; }
      function q(i) { return (v[i * 3 + 1] / (2 * R)) + 0.5; }
      return [new THREE.Vector2(u(a), q(a)), new THREE.Vector2(u(b), q(b)), new THREE.Vector2(u(c), q(c))];
    },
    generateSideWallUV: function () { return [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)]; }
  };

  var bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: BODY_T, bevelEnabled: true, bevelThickness: BODY_BEV, bevelSize: BODY_BEV,
    bevelSegments: 3, curveSegments: 160, steps: 1, UVGenerator: uvGen
  });
  bodyGeo.center(); bodyGeo.computeVertexNormals();

  // Both extrude caps share the same planar UV map, which leaves the text
  // mirrored on the back (-z) cap when the spin brings it around — a quirk
  // carried over from the reference plate, where the branding read
  // backwards half of every revolution. Mirror u on that cap (identified
  // by its face normal; the texture is radially symmetric apart from the
  // text, so nothing else shifts) so it reads correctly from both sides.
  (function () {
    var nor = bodyGeo.attributes.normal, uv = bodyGeo.attributes.uv;
    for (var i = 0; i < uv.count; i++) {
      if (nor.getZ(i) < -0.9) uv.setX(i, 1 - uv.getX(i));
    }
    uv.needsUpdate = true;
  })();
  var body = new THREE.Mesh(bodyGeo, [faceMat, metalMat]);

  /* ---- raised rim rings (front + back) => the grey face sits in a real recess ---- */
  var ringGeo = makeRing(R, RIM_INNER, RIM_DEPTH, RIM_BEV);
  var rimFront = new THREE.Mesh(ringGeo, metalMat); rimFront.position.z = RIM_Z;
  var rimBack = new THREE.Mesh(ringGeo, metalMat); rimBack.position.z = -RIM_Z;

  /* ---- steel bore sleeve ---- */
  var sleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(BORE_R * 1.02, BORE_R * 1.02, BODY_T * 1.06, 48, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xb8bcc2, metalness: 1.0, roughness: 0.25, envMapIntensity: 1.2 })
  );
  sleeve.rotation.x = Math.PI / 2;

  var plate = new THREE.Group();
  plate.add(body, rimFront, rimBack, sleeve);

  var spinner = new THREE.Group(); spinner.add(plate);
  var tilt = new THREE.Group(); tilt.add(spinner); tilt.rotation.x = tiltAngle;
  scene.add(tilt);

  /* lights */
  var key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2.5, 3, 3);
  var fill = new THREE.DirectionalLight(0xbfd0ff, 0.35); fill.position.set(-3, -1, 2);
  var rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(-2.5, 1.5, -3);
  var hemi = new THREE.HemisphereLight(0x9099a8, 0x1a1c20, 0.25);
  scene.add(key, fill, rim, hemi);

  renderer.render(scene, camera);

  return {
    ok: true,
    // main.js drives this from its idle-spin + scroll loop (degrees, same
    // values it used to feed the old CSS rotateY transform)
    setRotation: function (deg) {
      spinner.rotation.y = deg * Math.PI / 180;
      renderer.render(scene, camera);
    }
  };
}
