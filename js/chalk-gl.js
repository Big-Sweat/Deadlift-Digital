/* chalk-gl.js — volumetric chalk burst for the plate slam.
   A raymarched fbm-noise volume on a fullscreen quad, sized to the
   .smoke-field region. Physics lives in the shader: exponential-drag
   expansion (violent start, near-dead stop), ground-hugging squash,
   brief lift, then a downward settle as it dissolves — chalk, not smoke.
   Lit from the upper-left; self-shadowing is computed from the analytic
   envelope only (no noise in the light tap) to stay fast on iGPUs.
   main.js falls back to the DOM particle system when this returns null,
   and the frame-time watchdog below demotes to it on GPUs that crawl. */

import * as THREE from 'three';

var FIELD_W = 1600, FIELD_H = 780;   // must match .smoke-field CSS
var IMPACT_X = 800, IMPACT_Y = 126;  // burst anchor, from bottom-left
var RES_SCALE = 0.5;                 // volumetrics are soft; render small, upscale
var SLOW_FRAME_MS = 80;              // watchdog: demote to DOM fallback beyond this

var FRAG = [
  'precision highp float;',
  'varying vec2 vUv;',
  'uniform vec2 uRes;',
  'uniform float uT0; uniform float uP0; uniform float uSeed0;',
  'uniform float uT1; uniform float uP1; uniform float uSeed1;',

  'float hash(vec3 p){',
  '  p = fract(p*0.3183099 + vec3(0.1,0.2,0.3));',
  '  p *= 17.0;',
  '  return fract(p.x*p.y*p.z*(p.x+p.y+p.z));',
  '}',
  'float vnoise(vec3 p){',
  '  vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);',
  '  return mix(',
  '    mix(mix(hash(i),               hash(i+vec3(1.,0.,0.)), f.x),',
  '        mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)), f.x), f.y),',
  '    mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)), f.x),',
  '        mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)), f.x), f.y), f.z);',
  '}',
  'float fbm3(vec3 p){',
  '  return 0.5*vnoise(p) + 0.25*vnoise(p*2.03 + vec3(11.5)) + 0.125*vnoise(p*4.1 + vec3(27.0));',
  '}',

  '/* time scale + fade for one burst */',
  'float lifeOf(float ts){ return smoothstep(0.0, 0.12, ts) * (1.0 - smoothstep(2.4, 5.9, ts)); }',

  '/* analytic envelope, no noise: drag expansion + lift/settle + floor surge */',
  'float envOf(vec3 q, float ts, float power){',
  '  float R = (300.0 + 200.0*power) * power;',
  '  float r = R * (1.0 - exp(-ts*2.6));',
  '  float lift = (36.0 + 86.0*power) * smoothstep(0.25, 2.6, ts)',
  '             - 30.0 * smoothstep(3.0, 5.7, ts);',
  '  vec3 d = q - vec3(0.0, lift, 0.0);',
  '  d.y /= 0.60;',
  '  float shell = 1.0 - smoothstep(r*0.30, r, length(d));',
  '  float surge = (1.0 - smoothstep(r*0.55, r*1.45, length(vec2(d.x, d.y*2.4))))',
  '              * (1.0 - smoothstep(4.0, 66.0, abs(q.y)));',
  '  float env = max(shell, surge*0.75);',
  '  return env * smoothstep(-30.0, -12.0, q.y);',
  '}',

  '/* envelope-only density of both bursts — used for the shadow tap */',
  'float envDensity(vec3 q){',
  '  float s = 0.0;',
  '  if (uP0 > 0.0){ float ts = uT0 / (0.55 + 0.45*uP0);',
  '    if (ts >= 0.0 && ts <= 6.0) s += envOf(q, ts, uP0) * lifeOf(ts); }',
  '  if (uP1 > 0.0){ float ts = uT1 / (0.55 + 0.45*uP1);',
  '    if (ts >= 0.0 && ts <= 6.0) s += envOf(q, ts, uP1) * lifeOf(ts); }',
  '  return s;',
  '}',

  '/* full density of one burst: envelope carved by advected noise */',
  'float burst(vec3 q, float t, float power, float seed){',
  '  if (power <= 0.0) return 0.0;',
  '  float ts = t / (0.55 + 0.45*power);',
  '  if (ts < 0.0 || ts > 6.0) return 0.0;',
  '  float env = envOf(q, ts, power);',
  '  if (env <= 0.005) return 0.0;',
  '  vec3 np = q * 0.011 + vec3(seed*7.31, seed*3.7, seed*5.13);',
  '  float w = vnoise(np*1.7 + vec3(ts*0.10)) - 0.5;   /* scalar wobble warp */',
  '  np += w * 0.55;',
  '  np.y -= ts * 0.05;',
  '  float n = fbm3(np);',
  '  n = smoothstep(0.30, 0.74, n);                    /* carve cauliflower */',
  '  return env * n * lifeOf(ts) * (0.55 + 0.45*power);',
  '}',

  'float density(vec3 q){',
  '  return burst(q, uT0, uP0, uSeed0) + burst(q, uT1, uP1, uSeed1);',
  '}',

  'void main(){',
  '  vec2 px = vUv * uRes;',
  '  vec2 ip = vec2(' + IMPACT_X.toFixed(1) + ',' + IMPACT_Y.toFixed(1) + ');',
  '  vec3 ro = vec3(px - ip, -95.0);',
  '  const int STEPS = 12;',
  '  float dz = 190.0 / float(STEPS);',
  '  vec3 L = normalize(vec3(-0.55, 0.62, -0.5));',
  '  vec3 litCol  = vec3(0.965, 0.955, 0.93);',
  '  vec3 shadCol = vec3(0.505, 0.495, 0.468);',
  '  vec3 acc = vec3(0.0); float alpha = 0.0;',
  '  for(int i=0;i<STEPS;i++){',
  '    vec3 q = ro + vec3(0.0, 0.0, (float(i)+0.5) * dz);',
  '    float den = density(q);',
  '    if (den > 0.004){',
  '      float dl = envDensity(q + L*44.0);            /* noise-free shadow */',
  '      float light = exp(-dl*2.4);',
  '      vec3 col = mix(shadCol, litCol, clamp(light, 0.0, 1.0));',
  '      float a = 1.0 - exp(-den * dz * 0.028);',
  '      acc += col * a * (1.0 - alpha);',
  '      alpha += a * (1.0 - alpha);',
  '      if (alpha > 0.96) break;',
  '    }',
  '  }',
  '  gl_FragColor = vec4(acc, alpha);',
  '}'
].join('\n');

var VERT = [
  'varying vec2 vUv;',
  'void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
].join('\n');

export function initChalkGL(field) {
  if (!field) return null;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: false, premultipliedAlpha: true,
      powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true
    });
  } catch (e) { return null; }
  if (!renderer || !renderer.getContext()) return null;

  var canvas = renderer.domElement;
  canvas.className = 'smoke-gl';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
  renderer.setSize(Math.round(FIELD_W * RES_SCALE), Math.round(FIELD_H * RES_SCALE), false);
  // insert below the top (specks/ring) layer so crisp grit flies in front
  var top = field.querySelector('.smoke-layer:last-child');
  if (top) field.insertBefore(canvas, top); else field.appendChild(canvas);

  var uniforms = {
    uRes:   { value: new THREE.Vector2(FIELD_W, FIELD_H) },
    uT0: { value: 999 }, uP0: { value: 0 }, uSeed0: { value: 0 },
    uT1: { value: 999 }, uP1: { value: 0 }, uSeed1: { value: 0 }
  };
  var scene = new THREE.Scene();
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: uniforms, transparent: true, depthTest: false, depthWrite: false })
  ));

  var dead = false;
  function die() {
    dead = true;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    try { renderer.dispose(); } catch (e) {}
    canvas.remove();
  }
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); die(); }, false);

  // ANGLE/D3D compiles loop-heavy shaders through FXC, which can stall the
  // main thread for seconds if it happens at first render. Compile async;
  // until ready, ok=false and main.js uses the DOM fallback for that burst.
  var ready = false;
  if (renderer.compileAsync) {
    renderer.compileAsync(scene, cam)
      .then(function () { ready = true; renderer.render(scene, cam); })
      .catch(function () { die(); });
  } else {
    ready = true;
  }

  var starts = [-1, -1];  // performance.now() per slot
  var raf = 0;
  var lastFrame = 0, slowStreak = 0;
  function lifeMs(slot) {
    var p = slot === 0 ? uniforms.uP0.value : uniforms.uP1.value;
    return 6000 * (0.55 + 0.45 * p);
  }
  function tick() {
    if (dead) return;
    var now = performance.now();
    // watchdog: a GPU that crawls gets the DOM fallback instead
    if (lastFrame && now - lastFrame > SLOW_FRAME_MS) {
      if (++slowStreak >= 3) { die(); return; }
    } else if (lastFrame) { slowStreak = 0; }
    lastFrame = now;
    var live = false;
    for (var s = 0; s < 2; s++) {
      if (starts[s] < 0) continue;
      var t = (now - starts[s]) / 1000;
      if (s === 0) uniforms.uT0.value = t; else uniforms.uT1.value = t;
      if (now - starts[s] < lifeMs(s)) live = true; else starts[s] = -1;
    }
    renderer.render(scene, cam);
    if (live) { raf = requestAnimationFrame(tick); }
    else { raf = 0; lastFrame = 0; renderer.clear(); }
  }

  var nextSlot = 0;
  return {
    get ok() { return !dead && ready; },
    impact: function (power) {
      if (dead || !ready) return;
      var s = nextSlot; nextSlot = (nextSlot + 1) % 2;
      if (s === 0) { uniforms.uP0.value = power; uniforms.uSeed0.value = Math.random() * 60; }
      else { uniforms.uP1.value = power; uniforms.uSeed1.value = Math.random() * 60; }
      starts[s] = performance.now();
      if (!raf) { lastFrame = 0; raf = requestAnimationFrame(tick); }
    },
    // dev/test: render exactly one frame at burst-time t (no loop)
    debugFrame: function (t, power) {
      if (dead) return false;
      uniforms.uT0.value = t; uniforms.uP0.value = power || 1; uniforms.uSeed0.value = 7;
      uniforms.uT1.value = 999; uniforms.uP1.value = 0;
      renderer.render(scene, cam);
      return true;
    },
    dispose: die
  };
}
