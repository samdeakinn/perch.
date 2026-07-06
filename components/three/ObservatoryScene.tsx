'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

const COLOR_AMBER = new THREE.Color('#c98a3a');
const COLOR_GOLD = new THREE.Color('#f0b840');
const COLOR_DEEP = new THREE.Color('#b86848');
const COLOR_SAGE = new THREE.Color('#5c8f72');
const COLOR_VERMILION = new THREE.Color('#d46a5a');

function glowTexture(inner: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.25, outer);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

// station camera positions keyed by scroll fraction (0..1)
// 0.00 hero — full astrolabe
// 0.15 cost — push toward counter
// 0.30 calculator — orrery reconfigures
// 0.45 how — document streams in
// 0.60 tracks — orbiting docs
// 0.72 community — core glows
// 0.85 map — pulled wider
// 1.00 final cta — pulled back
const STATIONS: { at: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { at: 0.0, pos: [0, 0.2, 6.5], look: [0, 0, 0] },
  { at: 0.15, pos: [0.8, 0.5, 4.5], look: [0, 0.3, 0] },
  { at: 0.3, pos: [-0.8, 0.6, 4.0], look: [0, 0.5, 0] },
  { at: 0.45, pos: [0.4, -0.3, 4.5], look: [0, 0, 0] },
  { at: 0.6, pos: [0, 0.9, 5.0], look: [0, 0, 0] },
  { at: 0.72, pos: [0, 0, 3.2], look: [0, 0, 0] },
  { at: 0.85, pos: [0, 1.4, 6.5], look: [0, 0, 0] },
  { at: 1.0, pos: [0, 0.2, 7.5], look: [0, 0, 0] },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smoothstep(t: number) { return t * t * (3 - 2 * t); }

function stationCamera(scrollPct: number, target: THREE.PerspectiveCamera) {
  // find segment
  let i = 0;
  for (; i < STATIONS.length - 1; i++) {
    if (scrollPct < STATIONS[i + 1].at) break;
  }
  i = Math.min(i, STATIONS.length - 2);
  const a = STATIONS[i];
  const b = STATIONS[i + 1];
  const span = b.at - a.at || 1;
  const t = smoothstep(Math.max(0, Math.min(1, (scrollPct - a.at) / span)));
  target.position.set(lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t));
  const lx = lerp(a.look[0], b.look[0], t);
  const ly = lerp(a.look[1], b.look[1], t);
  const lz = lerp(a.look[2], b.look[2], t);
  target.lookAt(lx, ly, lz);
}

function Astrolabe() {
  const ringGroup = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const coreGlow = useRef<THREE.Sprite>(null);
  const wireSphere = useRef<THREE.Mesh>(null);
  const particles = useRef<THREE.Points>(null);
  const docsRef = useRef<THREE.Group>(null);
  const verdictsRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const emberGlow = useMemo(() => glowTexture('rgba(255,210,140,0.9)', 'rgba(201,138,58,0.3)'), []);

  const ringConfigs = useMemo(() => ([
    { radius: 2.4, tube: 0.025, tiltX: Math.PI * 0.45, tiltZ: 0, speed: 0.12, emissive: 0.8 },
    { radius: 1.85, tube: 0.018, tiltX: Math.PI * 0.3, tiltZ: Math.PI * 0.25, speed: 0.2, emissive: 1.0 },
    { radius: 1.35, tube: 0.014, tiltX: Math.PI * 0.6, tiltZ: Math.PI * 0.5, speed: 0.28, emissive: 1.2 },
  ]), []);

  const ringMeshes = useMemo(() => ringConfigs.map((cfg) => {
    const mat = new THREE.MeshStandardMaterial({
      color: COLOR_AMBER.clone(),
      emissive: COLOR_AMBER.clone(),
      emissiveIntensity: cfg.emissive,
      roughness: 0.15,
      metalness: 0.9,
    });
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(cfg.radius, cfg.tube, 24, 120), mat);
    mesh.rotation.x = cfg.tiltX;
    mesh.rotation.z = cfg.tiltZ;
    return { mesh, mat, cfg };
  }), [ringConfigs]);

  const tickMeshes = useMemo(() => {
    const out: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial }[] = [];
    const cfgs = [{ ring: 0, count: 12, size: 0.04 }, { ring: 1, count: 8, size: 0.035 }, { ring: 2, count: 6, size: 0.03 }];
    cfgs.forEach((tc) => {
      const r = ringConfigs[tc.ring].radius;
      const ring = ringMeshes[tc.ring].mesh;
      for (let i = 0; i < tc.count; i++) {
        const angle = (i / tc.count) * Math.PI * 2;
        const mat = new THREE.MeshStandardMaterial({ color: COLOR_AMBER.clone(), emissive: COLOR_AMBER.clone(), emissiveIntensity: 0.3, roughness: 0.2, metalness: 0.8 });
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.015, tc.size, 0.015), mat);
        tick.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        tick.rotation.x = ring.rotation.x;
        tick.rotation.z = ring.rotation.z;
        ring.add(tick);
        out.push({ mesh: tick, mat });
      }
    });
    return out;
  }, [ringMeshes, ringConfigs]);

  const docData = useMemo(() => {
    const arr: { angle: number; radius: number; speed: number; yBase: number; yFreq: number; yAmp: number }[] = [];
    for (let i = 0; i < 6; i++) {
      arr.push({
        angle: (i / 6) * Math.PI * 2,
        radius: 1.8 + (i % 2) * 0.5,
        speed: 0.15 + (i % 3) * 0.06,
        yBase: (i - 2.5) * 0.22,
        yFreq: 0.3 + (i % 2) * 0.2,
        yAmp: 0.15 + (i % 3) * 0.05,
      });
    }
    return arr;
  }, []);

  const docMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe8e4dd, emissive: 0x4a3a20, emissiveIntensity: 0.15, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide }), []);
  const docMeshes = useMemo(() => docData.map(() => new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.48), docMat)), [docData, docMat]);

  const verdictData = useMemo(() => ([
    { color: COLOR_SAGE, angle: 0 },
    { color: COLOR_AMBER.clone(), angle: Math.PI * 0.67 },
    { color: COLOR_VERMILION, angle: Math.PI * 1.33 },
  ]), []);
  const verdictMeshes = useMemo(() => verdictData.map((vd) => {
    const mat = new THREE.MeshStandardMaterial({ color: vd.color.clone(), emissive: vd.color.clone(), emissiveIntensity: 1.5, roughness: 0.2 });
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), mat);
    const glowMat = new THREE.SpriteMaterial({ map: emberGlow, color: vd.color.clone(), transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
    const g = new THREE.Sprite(glowMat);
    g.scale.set(0.4, 0.4, 1);
    m.add(g);
    return { mesh: m, mat, glowMat, angle: vd.angle, radius: 2.0 };
  }), [verdictData, emberGlow]);

  const particleData = useMemo(() => {
    const arr: { speed: number; r: number; theta: number; phi: number; phiDrift: number }[] = [];
    for (let k = 0; k < 120; k++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.5;
      arr.push({ speed: 0.02 + Math.random() * 0.05, r: 2.5 + Math.random() * 3.5, theta, phi, phiDrift: (Math.random() - 0.5) * 0.002 });
    }
    return arr;
  }, []);
  const particleGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(120 * 3);
    particleData.forEach((p, k) => {
      pos[k * 3] = Math.cos(p.theta) * Math.cos(p.phi) * p.r;
      pos[k * 3 + 1] = Math.sin(p.phi) * p.r;
      pos[k * 3 + 2] = Math.sin(p.theta) * Math.cos(p.phi) * p.r;
    });
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [particleData]);
  const particleMat = useMemo(() => new THREE.PointsMaterial({ map: emberGlow, color: COLOR_AMBER.clone(), size: 0.06, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), [emberGlow]);

  const coreMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffb050, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.2 }), []);
  const coreGlowMat = useMemo(() => new THREE.SpriteMaterial({ map: emberGlow, color: 0xffd0a0, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }), [emberGlow]);
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({ color: COLOR_AMBER.clone(), wireframe: true, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const ambientMat = useMemo(() => new THREE.SpriteMaterial({ map: emberGlow, color: 0xc98a3a, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }), [emberGlow]);

  // mouse parallax
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  // entrance
  const entrance = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    entrance.current = Math.min(entrance.current + 0.012, 1);
    const ep = entrance.current;
    const epEased = 1 - Math.pow(1 - ep, 3);

    // scroll pct
    const h = document.documentElement;
    const st = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const scrollPct = max > 0 ? Math.min(st / max, 1) : 0;

    mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.04;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.04;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // station camera + parallax
    stationCamera(scrollPct, camera as THREE.PerspectiveCamera);
    camera.position.x += (mx * 0.6 - (camera.position.x - lerp(0, 0, 0))) * 0.0 + mx * 0.6 * 0.0;
    // light parallax on top of station pos
    const baseX = camera.position.x;
    camera.position.x += mx * 0.4;
    camera.position.y += my * 0.2;
    void baseX;

    const accent = COLOR_AMBER.clone().lerp(COLOR_DEEP, scrollPct);
    const glow = new THREE.Color('#ffd0a0').lerp(new THREE.Color('#d49060'), scrollPct);

    if (ringGroup.current) {
      ringGroup.current.scale.setScalar(epEased);
      ringGroup.current.rotation.y = t * 0.05 + mx * 0.3;
      ringGroup.current.rotation.x = my * 0.15;
    }
    const scrollBoost = 1 + scrollPct * 1.5;
    ringMeshes.forEach((r, i) => {
      r.mesh.rotation.z = r.cfg.tiltZ + t * r.cfg.speed * scrollBoost;
      r.mesh.rotation.x = r.cfg.tiltX + my * 0.05 * (i + 1);
      r.mat.color.copy(accent);
      r.mat.emissive.copy(accent);
      r.mat.emissiveIntensity = r.cfg.emissive * (0.5 + scrollPct * 0.5) * epEased;
    });
    tickMeshes.forEach((tk) => { tk.mat.color.copy(accent); tk.mat.emissive.copy(accent); });

    if (core.current) {
      const cs = epEased * (0.9 + Math.sin(t * 1.5) * 0.08);
      core.current.scale.setScalar(cs);
      core.current.rotation.x = t * 0.3;
      core.current.rotation.y = t * 0.4;
      coreMat.emissiveIntensity = 2.5 * epEased + scrollPct * 1.5 + (scrollPct > 0.6 && scrollPct < 0.8 ? 2 : 0);
    }
    if (coreGlow.current) {
      coreGlow.current.scale.setScalar(1.2 * epEased * (1 + Math.sin(t * 2) * 0.05));
      coreGlowMat.opacity = 0.6 * epEased;
      coreGlowMat.color.copy(glow);
    }

    if (docsRef.current) {
      docData.forEach((d, i) => {
        const doc = docMeshes[i];
        d.angle += d.speed * 0.008 * (1 + scrollPct * 1.2);
        const r = d.radius * (1 + scrollPct * 0.15);
        doc.position.x = Math.cos(d.angle) * r;
        doc.position.z = Math.sin(d.angle) * r;
        doc.position.y = d.yBase + Math.sin(t * d.yFreq + d.angle) * d.yAmp;
        doc.rotation.y = -d.angle + Math.PI * 0.5;
        doc.rotation.x = Math.sin(t * 0.3 + d.angle) * 0.15;
        doc.scale.setScalar(epEased * (0.8 + scrollPct * 0.3));
        doc.visible = ep > 0.3;
      });
    }

    if (verdictsRef.current) {
      verdictMeshes.forEach((v, i) => {
        v.angle += 0.003 * (1 + scrollPct * 0.5);
        v.mesh.position.x = Math.cos(v.angle) * v.radius;
        v.mesh.position.z = Math.sin(v.angle) * v.radius;
        v.mesh.position.y = Math.sin(v.angle * 2 + i) * 0.3;
        v.mesh.scale.setScalar(epEased * (0.8 + Math.sin(t * 2 + i * 2) * 0.15));
        v.mesh.visible = ep > 0.5 && scrollPct > 0.02;
        v.mat.emissiveIntensity = 1.5 + Math.sin(t * 3 + i * 2) * 0.5;
      });
    }

    if (particles.current) {
      const pos = particleGeo.attributes.position.array as Float32Array;
      particleData.forEach((p, k) => {
        p.theta += p.speed * 0.003;
        p.phi += p.phiDrift;
        const pr = p.r * (1 + scrollPct * 0.2);
        pos[k * 3] = Math.cos(p.theta) * Math.cos(p.phi) * pr;
        pos[k * 3 + 1] = Math.sin(p.phi) * pr;
        pos[k * 3 + 2] = Math.sin(p.theta) * Math.cos(p.phi) * pr;
      });
      particleGeo.attributes.position.needsUpdate = true;
      particleMat.color.copy(accent);
      particleMat.opacity = 0.5 * epEased;
      particles.current.rotation.y = t * 0.02;
    }

    if (wireSphere.current) {
      wireSphere.current.rotation.y = t * 0.03;
      wireSphere.current.rotation.x = t * 0.02;
      wireMat.color.copy(accent);
    }
    ambientMat.opacity = 0.12 * epEased;
    ambientMat.color.copy(accent);
    void delta;
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#2a1f10" />
      <directionalLight position={[3, 3, 5]} intensity={1.4} color="#ffd8a0" />
      <directionalLight position={[-4, -1, -2]} intensity={0.25} color="#4a7a6a" />
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={5} decay={1.5} color="#ffb060" />

      <group ref={ringGroup}>
        {ringMeshes.map((r, i) => (
          <primitive key={i} object={r.mesh} />
        ))}
      </group>

      <mesh ref={core} geometry={new THREE.IcosahedronGeometry(0.18, 1)} material={coreMat} />
      <sprite ref={coreGlow} material={coreGlowMat} scale={[2, 2, 1]} />

      <group ref={docsRef}>
        {docMeshes.map((d, i) => (
          <primitive key={i} object={d} />
        ))}
      </group>

      <group ref={verdictsRef}>
        {verdictMeshes.map((v, i) => (
          <primitive key={i} object={v.mesh} />
        ))}
      </group>

      <points ref={particles} geometry={particleGeo} material={particleMat} />

      <mesh ref={wireSphere} geometry={new THREE.IcosahedronGeometry(3.0, 1)} material={wireMat} />
      <sprite material={ambientMat} scale={[6, 6, 1]} position={[0, 0, -0.5]} />
    </>
  );
}

export default function ObservatoryScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 6.5], fov: 50 }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <Astrolabe />
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
