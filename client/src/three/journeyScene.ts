/**
 * The product-journey scene.
 *
 * One particle system (the "product") morphs through nine formations — one per
 * stage of the journey — driven by a single continuous value: `stage` ∈ [0, 8].
 * Scroll = time. Every formation is a metaphor for that stage:
 *
 *   0 seed      a tiny glowing point in empty space          (the problem)
 *   1 idea      the point takes a shape                      (a framed idea)
 *   2 discover  six signal clusters stream toward the core   (users, data, market…)
 *   3 define    the signals lock into a structured ring      (problem, user, goal…)
 *   4 build     modules assemble around the core             (the system gets built)
 *   5 launch    a coherent sphere with orbits                (the product ships)
 *   6 measure   a rising field of columns                    (data comes back)
 *   7 iterate   a loop                                       (feedback → v2)
 *   8 next      the product becomes one point in a larger field
 *
 * Loaded with a dynamic import so three.js never blocks first paint.
 */
import * as THREE from "three";

export type SceneOptions = { mobile: boolean; reducedMotion: boolean };

export type JourneyScene = {
  setStage: (stage: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

const STAGES = 9;

const INK = new THREE.Color("#ecebe4");
const SIGNAL = new THREE.Color("#d4f06a");
const HEAT = new THREE.Color("#ff8a72");
const COOL = new THREE.Color("#8fa6c4");

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Formation = { pos: Float32Array; col: Float32Array };

function buildFormations(n: number): Formation[] {
  const r = rng(7);
  const gauss = () => {
    const u = Math.max(r(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
  };
  const onSphere = (i: number, total: number, radius: number): [number, number, number] => {
    const y = 1 - (2 * (i + 0.5)) / total;
    const rad = Math.sqrt(1 - y * y);
    const phi = i * Math.PI * (3 - Math.sqrt(5));
    return [Math.cos(phi) * rad * radius, y * radius, Math.sin(phi) * rad * radius];
  };

  const dustCount = Math.floor(n * 0.14);
  const dust: [number, number, number][] = [];
  for (let i = 0; i < dustCount; i++) {
    const rad = 5 + r() * 9;
    const th = r() * Math.PI * 2;
    dust.push([Math.cos(th) * rad, (r() - 0.5) * 7, Math.sin(th) * rad - 3]);
  }

  const make = (fn: (i: number, set: (x: number, y: number, z: number, c: THREE.Color, b: number) => void) => void): Formation => {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const set = (x: number, y: number, z: number, c: THREE.Color, b: number) => {
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        col[i * 3] = c.r * b;
        col[i * 3 + 1] = c.g * b;
        col[i * 3 + 2] = c.b * b;
      };
      if (i >= n - dustCount) {
        const d = dust[i - (n - dustCount)];
        set(d[0], d[1], d[2], INK, 0.16);
      } else fn(i, set);
    }
    return { pos, col };
  };
  const core = n - dustCount;

  // 0 — seed
  const seed = make((_, set) => {
    const s = 0.1;
    set(gauss() * s, gauss() * s, gauss() * s, SIGNAL, 0.55);
  });

  // 1 — idea: a precise shell with a bright nucleus
  const idea = make((i, set) => {
    if (i % 6 === 0) {
      set(gauss() * 0.14, gauss() * 0.14, gauss() * 0.14, SIGNAL, 0.7);
      return;
    }
    const [x, y, z] = onSphere(i, core, 1.05);
    set(x, y, z, INK, 0.55);
  });

  // 2 — discover: six signal clusters with streams converging on the core
  const clusters: [number, number, number][] = [];
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
    clusters.push([Math.cos(a) * 2.7, Math.sin(a) * 1.9, Math.sin(a * 2) * 0.8]);
  }
  const discover = make((i, set) => {
    const k = i % 6;
    const c = clusters[k];
    if (i % 4 === 0) {
      const sc = clusters[Math.floor(i / 4) % 6];
      const t = r();
      const e = t * t;
      set(sc[0] * e + gauss() * 0.03, sc[1] * e + gauss() * 0.03, sc[2] * e, SIGNAL, 0.25 + (1 - t) * 0.5);
      return;
    }
    if (i % 11 === 0) {
      set(gauss() * 0.16, gauss() * 0.16, gauss() * 0.16, SIGNAL, 0.8);
      return;
    }
    const s = 0.32;
    set(c[0] + gauss() * s, c[1] + gauss() * s, c[2] + gauss() * s, k % 2 ? COOL : INK, 0.6);
  });

  // 3 — define: five precise rings in a pentagon, joined by dotted edges
  const nodes: [number, number, number][] = [];
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + Math.PI / 2;
    nodes.push([Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0]);
  }
  const define = make((i, set) => {
    const k = i % 5;
    const c = nodes[k];
    const bucket = i % 3;
    if (bucket === 0) {
      const next = nodes[(k + 1) % 5];
      const t = r();
      set(c[0] + (next[0] - c[0]) * t, c[1] + (next[1] - c[1]) * t, 0, INK, 0.28);
      return;
    }
    if (bucket === 1 && i % 2 === 0) {
      const t = r();
      set(c[0] * t * 0.9, c[1] * t * 0.9, 0, COOL, 0.22);
      return;
    }
    const a = r() * Math.PI * 2;
    const rad = 0.34;
    set(c[0] + Math.cos(a) * rad, c[1] + Math.sin(a) * rad, (r() - 0.5) * 0.04, k === 4 ? SIGNAL : INK, 0.75);
  });

  // 4 — build: modules (boxes) assembling around the core
  const boxes: { c: [number, number, number]; s: [number, number, number] }[] = [
    { c: [0, 0, 0], s: [1.1, 1.1, 1.1] },
    { c: [-1.6, 0.6, 0.2], s: [0.9, 0.5, 0.9] },
    { c: [1.6, 0.6, -0.2], s: [0.9, 0.5, 0.9] },
    { c: [-1.4, -0.9, 0.3], s: [0.7, 0.7, 0.7] },
    { c: [1.4, -0.9, 0.1], s: [0.7, 0.7, 0.7] },
    { c: [0, 1.5, 0], s: [1.6, 0.25, 0.9] },
    { c: [0, -1.5, 0], s: [1.6, 0.25, 0.9] },
  ];
  const build = make((i, set) => {
    const b = boxes[i % boxes.length];
    const face = Math.floor(r() * 6);
    const u = r() - 0.5;
    const v = r() - 0.5;
    const snap = (x: number) => Math.round(x * 8) / 8;
    let x = snap(u) * b.s[0];
    let y = snap(v) * b.s[1];
    let z = snap(u * v * 2) * b.s[2];
    if (face < 2) x = (face ? 0.5 : -0.5) * b.s[0];
    else if (face < 4) y = (face === 3 ? 0.5 : -0.5) * b.s[1];
    else z = (face === 5 ? 0.5 : -0.5) * b.s[2];
    const isCore = i % boxes.length === 0;
    set(b.c[0] + x, b.c[1] + y, b.c[2] + z, isCore ? SIGNAL : INK, isCore ? 0.7 : 0.5);
  });

  // 5 — launch: a coherent sphere with two orbits
  const launch = make((i, set) => {
    const bucket = i % 5;
    if (bucket < 3) {
      const [x, y, z] = onSphere(i, core, 1.25);
      set(x, y, z, INK, 0.55);
      return;
    }
    const a = r() * Math.PI * 2;
    const rad = bucket === 3 ? 2.1 : 2.8;
    const tilt = bucket === 3 ? 0.45 : -0.3;
    const x = Math.cos(a) * rad;
    const z = Math.sin(a) * rad;
    set(x, z * Math.sin(tilt), z * Math.cos(tilt), bucket === 3 ? SIGNAL : COOL, 0.55);
  });

  // 6 — measure: a rising field of columns
  const cols = 12;
  const rows = 6;
  const measure = make((i, set) => {
    const cx = i % cols;
    const cz = Math.floor(i / cols) % rows;
    const h = 0.35 + (cx / (cols - 1)) * 2.4 + Math.sin(cx * 1.7 + cz) * 0.18 + (rows - cz) * 0.05;
    const t = r();
    const x = (cx - (cols - 1) / 2) * 0.42;
    const z = (cz - (rows - 1) / 2) * 0.42;
    const top = t > 0.93;
    set(x, -1.3 + (top ? h : t * h), z, top ? SIGNAL : INK, top ? 0.9 : 0.32 + t * 0.3);
  });

  // 7 — iterate: a loop, v1 (warm) flowing into v2 (signal)
  const iterate = make((i, set) => {
    const u = (i / core) * Math.PI * 2;
    const v = r() * Math.PI * 2;
    const R = 1.8;
    const tube = 0.3 + 0.08 * Math.sin(u * 3);
    const x = (R + tube * Math.cos(v)) * Math.cos(u);
    const y = (R + tube * Math.cos(v)) * Math.sin(u);
    const z = tube * Math.sin(v);
    const mix = (Math.sin(u) + 1) / 2;
    const c = HEAT.clone().lerp(SIGNAL, mix);
    set(x, y * 0.92, z, c, 0.55);
  });

  // 8 — next: the product becomes one bright point in a much larger field
  const next = make((i, set) => {
    if (i % 9 === 0) {
      set(gauss() * 0.12, gauss() * 0.12, gauss() * 0.12, SIGNAL, 0.85);
      return;
    }
    const a = r() * Math.PI * 2;
    const rad = 2 + Math.pow(r(), 0.7) * 11;
    set(Math.cos(a) * rad, (r() - 0.5) * 0.6 - 0.8, Math.sin(a) * rad - 4, r() > 0.96 ? SIGNAL : INK, 0.28 + r() * 0.3);
  });

  return [seed, idea, discover, define, build, launch, measure, iterate, next];
}

type Keyframe = { pos: [number, number, number]; look: [number, number, number]; core: number; offset: number };

// Camera choreography. `offset` shifts the subject right (desktop) so HTML copy owns the left column.
const KEYS: Keyframe[] = [
  { pos: [0, 0, 7], look: [0, 0, 0], core: 0.06, offset: 0.2 },
  { pos: [0.8, 0.4, 5.6], look: [0, 0, 0], core: 0.3, offset: 0.22 },
  { pos: [0, 0.8, 8.4], look: [0, 0, 0], core: 0.2, offset: 0.2 },
  { pos: [0, 0, 7.4], look: [0, 0, 0], core: 0.16, offset: 0.2 },
  { pos: [-2.6, 2.0, 6.6], look: [0, 0, 0], core: 0.34, offset: 0.2 },
  { pos: [1.8, 0.6, 7.6], look: [0, 0, 0], core: 0.42, offset: 0.2 },
  { pos: [0, 3.3, 8.2], look: [0, 0.4, 0], core: 0.0, offset: 0.2 },
  { pos: [0, -1.4, 6.6], look: [0, 0, 0], core: 0.0, offset: 0.2 },
  { pos: [0, 2.6, 13.5], look: [0, 0, -2], core: 0.0, offset: 0.2 },
];

const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aScale;
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio / max(-mv.z, 0.1);
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export function createJourneyScene(canvas: HTMLCanvasElement, opts: SceneOptions): JourneyScene {
  const { mobile, reducedMotion } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  const count = mobile ? 1400 : 3200;
  const formations = buildFormations(count);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(formations[0].pos);
  const colors = new Float32Array(formations[0].col);
  const scales = new Float32Array(count);
  const delays = new Float32Array(count);
  const r = rng(21);
  for (let i = 0; i < count; i++) {
    scales[i] = 0.55 + r() * 0.9;
    delays[i] = r();
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uSize: { value: mobile ? 62 : 70 }, uPixelRatio: { value: dpr } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  const group = new THREE.Group();
  group.add(points);

  // The core: the product itself. Its size and glow track how "real" the product is at each stage.
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x1b1f14,
    emissive: new THREE.Color("#7f9530"),
    emissiveIntensity: 0.2,
    roughness: 0.28,
    metalness: 0.65,
    flatShading: true,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, mobile ? 1 : 2), coreMat);
  // A faint structural shell: the product has a shape before it has a surface.
  const shellMat = new THREE.MeshBasicMaterial({ color: SIGNAL, wireframe: true, transparent: true, opacity: 0.22 });
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 1), shellMat);
  core.add(shell);
  group.add(core);

  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  const key = new THREE.PointLight(0xffffff, 26, 20);
  key.position.set(3, 3, 4);
  const rim = new THREE.PointLight(new THREE.Color("#8fa6c4"), 14, 20);
  rim.position.set(-4, -2, -3);
  scene.add(ambient, key, rim, group);

  let width = 1;
  let height = 1;
  let target = 0;
  let current = 0;
  let rendered = -1;
  let pointer = { x: 0, y: 0 };
  let eased = { x: 0, y: 0 };
  let raf = 0;
  let running = false;
  let last = performance.now();
  let spin = 0;

  const tmpPos = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();

  function applyStage(s: number) {
    const i = Math.min(Math.floor(s), STAGES - 2);
    const t = Math.min(Math.max(s - i, 0), 1);
    const a = formations[i];
    const b = formations[i + 1];
    for (let p = 0; p < count; p++) {
      // Stagger each point slightly so formations recompose rather than cross-fade.
      const lt = smooth(Math.min(Math.max(t * 1.35 - delays[p] * 0.35, 0), 1));
      const o = p * 3;
      positions[o] = a.pos[o] + (b.pos[o] - a.pos[o]) * lt;
      positions[o + 1] = a.pos[o + 1] + (b.pos[o + 1] - a.pos[o + 1]) * lt;
      positions[o + 2] = a.pos[o + 2] + (b.pos[o + 2] - a.pos[o + 2]) * lt;
      colors[o] = a.col[o] + (b.col[o] - a.col[o]) * lt;
      colors[o + 1] = a.col[o + 1] + (b.col[o + 1] - a.col[o + 1]) * lt;
      colors[o + 2] = a.col[o + 2] + (b.col[o + 2] - a.col[o + 2]) * lt;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aColor.needsUpdate = true;

    const ka = KEYS[i];
    const kb = KEYS[i + 1];
    const ct = smooth(t);
    tmpPos.set(...ka.pos).lerp(new THREE.Vector3(...kb.pos), ct);
    tmpLook.set(...ka.look).lerp(new THREE.Vector3(...kb.look), ct);
    const coreScale = ka.core + (kb.core - ka.core) * ct;
    core.scale.setScalar(Math.max(coreScale, 0.0001));
    core.visible = coreScale > 0.01;
    coreMat.emissiveIntensity = 0.12 + coreScale * 0.3;
    shell.rotation.y = s * 0.6;

    // Lighting warms during "iterate" (feedback) and cools during "discover" (signals).
    const warm = Math.max(0, 1 - Math.abs(s - 7));
    const cool = Math.max(0, 1 - Math.abs(s - 2));
    key.color.setRGB(1, 1 - warm * 0.25, 1 - warm * 0.35 + cool * 0.1);

    const offset = ka.offset + (kb.offset - ka.offset) * ct;
    setOffset(offset);
  }

  function setOffset(offset: number) {
    if (mobile || width < 900) {
      // Narrow screens: the subject owns the top quarter of the screen; copy sits below it.
      camera.setViewOffset(width, height, 0, height * 0.27, width, height);
    } else {
      camera.setViewOffset(width, height, -width * offset, 0, width, height);
    }
  }

  function render() {
    const mobileScale = width < 900 ? 1.75 : 1;
    camera.position.copy(tmpPos).multiplyScalar(mobileScale);
    camera.position.x += eased.x * 0.35;
    camera.position.y += eased.y * 0.25;
    camera.lookAt(tmpLook);
    // Gentle sway rather than a full spin, so flat formations never turn edge-on.
    group.rotation.y = Math.sin(spin * 0.18) * 0.28;
    group.rotation.x = Math.sin(spin * 0.11) * 0.05;
    renderer.render(scene, camera);
  }

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (reducedMotion) {
      current = target;
    } else {
      current += (target - current) * (1 - Math.exp(-dt * 5));
      if (Math.abs(target - current) < 0.0005) current = target;
      spin += dt;
      eased.x += (pointer.x - eased.x) * (1 - Math.exp(-dt * 3));
      eased.y += (pointer.y - eased.y) * (1 - Math.exp(-dt * 3));
    }
    if (current !== rendered) {
      applyStage(current);
      rendered = current;
    }
    render();
    if (running && !reducedMotion) raf = requestAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    rendered = -1;
    if (!running || reducedMotion) frame(performance.now());
  }

  applyStage(0);
  resize();

  return {
    setStage(s) {
      target = Math.min(Math.max(s, 0), STAGES - 1);
      // Reduced motion renders on demand only: no idle animation, no easing.
      if (reducedMotion) frame(performance.now());
    },
    setPointer(x, y) {
      if (!mobile && !reducedMotion) pointer = { x, y };
    },
    resize,
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      if (reducedMotion) frame(last);
      else raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      core.geometry.dispose();
      coreMat.dispose();
      shell.geometry.dispose();
      shellMat.dispose();
      renderer.dispose();
    },
  };
}
