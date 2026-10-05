/**
 * The background scene: a liquid, iridescent "core" wrapped in an orbit of particles.
 *
 * - The core is a high-detail sphere displaced by 3D simplex noise in the vertex shader,
 *   with normals recomputed from the displaced surface and a fresnel/iridescent rim.
 * - Scroll progress (0 → 1) drifts the core across the page, deepens the morph and shifts its hue.
 * - The pointer tilts the whole scene a little.
 *
 * Loaded with a dynamic import so three.js never blocks first paint.
 */
import * as THREE from "three";

export type SceneOptions = { mobile: boolean; reducedMotion: boolean };

export type CoreScene = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

const NOISE = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

const coreVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  ${NOISE}
  float field(vec3 p){
    return snoise(p*uFreq+vec3(0.0,0.0,uTime*0.22))*uAmp
         + snoise(p*uFreq*2.3-vec3(uTime*0.15))*uAmp*0.28;
  }
  vec3 displace(vec3 p){
    return p+normalize(p)*field(p);
  }
  void main(){
    vec3 n=normalize(position);
    vec3 t=normalize(cross(n,abs(n.y)<0.99?vec3(0.0,1.0,0.0):vec3(1.0,0.0,0.0)));
    vec3 b=normalize(cross(n,t));
    float e=0.01;
    vec3 p0=displace(position);
    vec3 p1=displace(position+t*e);
    vec3 p2=displace(position+b*e);
    vec3 dn=normalize(cross(p1-p0,p2-p0));
    if(dot(dn,n)<0.0) dn=-dn;
    vNoise=field(position)/max(uAmp,0.0001);
    vec4 mv=modelViewMatrix*vec4(p0,1.0);
    vNormal=normalize(normalMatrix*dn);
    vView=normalize(-mv.xyz);
    gl_Position=projectionMatrix*mv;
  }
`;

const coreFragment = /* glsl */ `
  uniform float uHue;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  vec3 palette(float t){
    // lime → mint → steel blue → coral: a cool, premium iridescence
    vec3 a=vec3(0.55,0.6,0.55);
    vec3 b=vec3(0.45,0.4,0.4);
    vec3 c=vec3(1.0,1.0,1.0);
    vec3 d=vec3(0.18,0.33,0.55);
    return a+b*cos(6.28318*(c*t+d));
  }
  void main(){
    vec3 n=normalize(vNormal);
    vec3 v=normalize(vView);
    float ndv=clamp(dot(n,v),0.0,1.0);
    float fres=pow(1.0-ndv,2.6);
    vec3 irid=palette(fres*0.9+vNoise*0.25+uHue);
    vec3 base=vec3(0.035,0.04,0.035);
    vec3 L=normalize(vec3(0.6,0.8,0.7));
    vec3 H=normalize(L+v);
    float spec=pow(max(dot(n,H),0.0),70.0);
    float diff=max(dot(n,L),0.0);
    vec3 col=base+base*diff*2.0+irid*fres*1.15+vec3(spec)*0.55;
    // a faint inner glow along the noise valleys
    col+=vec3(0.83,0.94,0.42)*smoothstep(0.35,0.9,vNoise)*0.08;
    gl_FragColor=vec4(col,1.0);
  }
`;

const pointsVertex = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  varying vec3 vColor;
  varying float vFade;
  void main(){
    vec3 p=position;
    float a=uTime*(0.05+aScale*0.04);
    float c=cos(a), s=sin(a);
    p.xz=mat2(c,-s,s,c)*p.xz;
    p.y+=sin(uTime*0.6+aScale*12.0)*0.04;
    vec4 mv=modelViewMatrix*vec4(p,1.0);
    gl_Position=projectionMatrix*mv;
    gl_PointSize=uSize*aScale*uPixelRatio/max(-mv.z,0.1);
    vColor=aColor;
    vFade=smoothstep(14.0,4.0,-mv.z);
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vFade;
  void main(){
    float d=length(gl_PointCoord-0.5);
    float a=smoothstep(0.5,0.0,d);
    a*=a*vFade;
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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const rig = new THREE.Group();
  scene.add(rig);

  // Core
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: coreVertex,
    fragmentShader: coreFragment,
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 0.22 },
      uFreq: { value: 0.9 },
      uHue: { value: 0 },
    },
  });
  const coreGeo = new THREE.IcosahedronGeometry(1.25, mobile ? 40 : 72);
  const core = new THREE.Mesh(coreGeo, coreMat);
  rig.add(core);

  // Fine wireframe shell
  const shellGeo = new THREE.IcosahedronGeometry(1.95, 1);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0xd4f06a,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  rig.add(shell);

  // Orbit of particles + distant dust
  const r = rng(11);
  const count = mobile ? 1400 : 3000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const scl = new Float32Array(count);
  const lime = new THREE.Color("#d4f06a");
  const ink = new THREE.Color("#ecebe4");
  const cool = new THREE.Color("#8fa6c4");
  for (let i = 0; i < count; i++) {
    const ring = i < count * 0.7;
    let x: number, y: number, z: number;
    if (ring) {
      const a = r() * Math.PI * 2;
      const rad =
        2.3 + Math.pow(r(), 2) * 1.6 + (i % 3 === 0 ? 0.0 : r() * 0.25);
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
      y = (r() - 0.5) * 0.08 * rad;
    } else {
      const a = r() * Math.PI * 2;
      const rad = 4.5 + r() * 7;
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad - 2;
      y = (r() - 0.5) * 8;
    }
    pos.set([x, y, z], i * 3);
    const c = ring ? (r() > 0.82 ? lime : r() > 0.5 ? cool : ink) : ink;
    const b = ring ? 0.35 + r() * 0.5 : 0.15 + r() * 0.2;
    col.set([c.r * b, c.g * b, c.b * b], i * 3);
    scl[i] = 0.5 + r() * 1.0;
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
      uSize: { value: mobile ? 48 : 56 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const orbit = new THREE.Points(ptsGeo, ptsMat);
  orbit.rotation.x = 0.42;
  orbit.rotation.z = -0.18;
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
    // Desktop: start right of the hero copy, sweep left through the middle of the page, settle centre.
    const sweep = Math.cos(p * Math.PI * 1.6);
    const x = narrow
      ? 0
      : lerp(-1.5, 1.75, (sweep + 1) / 2) *
        (p > 0.85 ? lerp(1, 0, (p - 0.85) / 0.15) : 1);
    const y = narrow
      ? lerp(1.45, 0.2, Math.min(p * 4, 1))
      : Math.sin(p * Math.PI * 2) * 0.25;
    rig.position.set(x, y, 0);
    const s = narrow
      ? lerp(0.62, 0.7, Math.min(p * 3, 1))
      : lerp(1, 0.82, Math.sin(Math.min(p, 1) * Math.PI));
    rig.scale.setScalar(s);
    coreMat.uniforms.uAmp.value = 0.18 + Math.sin(p * Math.PI) * 0.09;
    coreMat.uniforms.uFreq.value = 0.85 + p * 0.5;
    coreMat.uniforms.uHue.value = p * 0.6;
    camera.position.z = narrow ? 8.2 : 7;
  }

  function render() {
    layout();
    rig.rotation.y = time * 0.08 + eased.x * 0.5 + progress * 2.2;
    rig.rotation.x = -eased.y * 0.3 + progress * 0.4;
    shell.rotation.y = -time * 0.05;
    shell.rotation.z = time * 0.03;
    coreMat.uniforms.uTime.value = time;
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
      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      ptsGeo.dispose();
      ptsMat.dispose();
      renderer.dispose();
    },
  };
}
