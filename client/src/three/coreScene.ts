/**
 * The background scene: a polished, iridescent chrome knot lit by a soft studio
 * environment, with a quiet ring of particles orbiting it.
 *
 * - The knot uses a physically based material (metal + clearcoat + thin-film
 *   iridescence) reflecting a generated studio room, so it reads as a real object.
 * - Scroll progress (0 → 1) drifts it across the page and turns it.
 * - The pointer tilts the whole scene a little.
 *
 * Loaded with a dynamic import so three.js never blocks first paint.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type SceneOptions = { mobile: boolean; reducedMotion: boolean };

export type CoreScene = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

const pointsVertex = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  varying vec3 vColor;
  void main(){
    vec3 p=position;
    float a=uTime*(0.04+aScale*0.02);
    float c=cos(a), s=sin(a);
    p.xz=mat2(c,-s,s,c)*p.xz;
    vec4 mv=modelViewMatrix*vec4(p,1.0);
    gl_Position=projectionMatrix*mv;
    gl_PointSize=uSize*aScale*uPixelRatio/max(-mv.z,0.1);
    vColor=aColor;
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  void main(){
    float d=length(gl_PointCoord-0.5);
    float a=smoothstep(0.5,0.0,d);
    a*=a;
    gl_FragColor=vec4(vColor*a,a);
  }
`;

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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function createCoreScene(
  canvas: HTMLCanvasElement,
  opts: SceneOptions
): CoreScene {
  const { mobile, reducedMotion } = opts;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  // Soft studio reflections, generated once (no network fetch).
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envMap = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envMap;
  room.traverse(o => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    (m.material as THREE.Material | undefined)?.dispose?.();
  });
  pmrem.dispose();

  const rig = new THREE.Group();
  scene.add(rig);

  // The object: a smooth knot in dark iridescent chrome.
  const knotGeo = new THREE.TorusKnotGeometry(
    1,
    0.3,
    mobile ? 220 : 360,
    mobile ? 40 : 64,
    2,
    3
  );
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#2a2e26"),
    metalness: 1,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.7,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [300, 420],
    envMapIntensity: 1.25,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  rig.add(knot);

  // Coloured rim lights pick out the brand palette on the chrome.
  const lime = new THREE.PointLight(new THREE.Color("#d4f06a"), 46, 14);
  lime.position.set(3.2, 2.2, 2.5);
  const steel = new THREE.PointLight(new THREE.Color("#8fa6c4"), 24, 14);
  steel.position.set(-3.4, -1.8, 1.5);
  scene.add(lime, steel);

  // A quiet ring of particles + sparse dust.
  const r = rng(11);
  const count = mobile ? 900 : 1800;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const scl = new Float32Array(count);
  const cLime = new THREE.Color("#d4f06a");
  const cInk = new THREE.Color("#ecebe4");
  const cCool = new THREE.Color("#8fa6c4");
  for (let i = 0; i < count; i++) {
    const ring = i < count * 0.65;
    const a = r() * Math.PI * 2;
    let x: number, y: number, z: number;
    if (ring) {
      const rad = 2.5 + Math.pow(r(), 1.6) * 1.1;
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
      y = (r() - 0.5) * 0.06 * rad;
    } else {
      const rad = 5 + r() * 7;
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad - 3;
      y = (r() - 0.5) * 9;
    }
    pos.set([x, y, z], i * 3);
    const c = ring ? (r() > 0.75 ? cLime : r() > 0.5 ? cCool : cInk) : cInk;
    const b = ring ? 0.3 + r() * 0.4 : 0.12 + r() * 0.15;
    col.set([c.r * b, c.g * b, c.b * b], i * 3);
    scl[i] = 0.4 + r() * 0.8;
  }
  const ptsGeo = new THREE.BufferGeometry();
  ptsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  ptsGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  ptsGeo.setAttribute("aScale", new THREE.BufferAttribute(scl, 1));
  const ptsMat = new THREE.ShaderMaterial({
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
      uSize: { value: mobile ? 40 : 46 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const orbit = new THREE.Points(ptsGeo, ptsMat);
  orbit.rotation.x = 0.38;
  orbit.rotation.z = -0.16;
  orbit.frustumCulled = false;
  rig.add(orbit);

  let width = 1;
  let height = 1;
  let target = 0;
  let progress = 0;
  let pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  let raf = 0;
  let running = false;
  let last = performance.now();
  let time = 0;

  function layout() {
    const narrow = width < 900;
    const p = progress;
    // Desktop: start right of the hero copy, sweep left mid-page, settle centre at the end.
    const sweep = (Math.cos(p * Math.PI * 1.6) + 1) / 2;
    const settle = p > 0.85 ? lerp(1, 0, (p - 0.85) / 0.15) : 1;
    const x = narrow ? 0 : lerp(-1.8, 2.05, sweep) * settle;
    const y = narrow
      ? lerp(1.75, 0.3, Math.min(p * 4, 1))
      : Math.sin(p * Math.PI * 2) * 0.2;
    rig.position.set(x, y, 0);
    const s = narrow
      ? lerp(0.5, 0.58, Math.min(p * 3, 1))
      : lerp(0.84, 0.72, Math.sin(Math.min(p, 1) * Math.PI));
    rig.scale.setScalar(s);
    camera.position.z = narrow ? 9 : 8;
  }

  function render() {
    layout();
    knot.rotation.x = time * 0.12 + progress * 1.4;
    knot.rotation.y = time * 0.18 + progress * 2.4;
    rig.rotation.y = eased.x * 0.45;
    rig.rotation.x = -eased.y * 0.3;
    ptsMat.uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (reducedMotion) {
      progress = target;
    } else {
      time += dt;
      progress += (target - progress) * (1 - Math.exp(-dt * 4));
      eased.x += (pointer.x - eased.x) * (1 - Math.exp(-dt * 2.5));
      eased.y += (pointer.y - eased.y) * (1 - Math.exp(-dt * 2.5));
    }
    render();
    if (running && !reducedMotion) raf = requestAnimationFrame(frame);
  }

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (!running || reducedMotion) frame(performance.now());
  }

  resize();

  return {
    setProgress(p) {
      target = Math.min(Math.max(p, 0), 1);
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
      knotGeo.dispose();
      knotMat.dispose();
      envMap.dispose();
      ptsGeo.dispose();
      ptsMat.dispose();
      renderer.dispose();
    },
  };
}
