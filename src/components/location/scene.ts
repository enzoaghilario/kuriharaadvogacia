/* eslint-disable @typescript-eslint/no-explicit-any */
// Cena 3D "Seu negócio no mapa": cidade procedural no estilo de app de mapas,
// câmera em órbita contínua (sem cortes), rota que se desenha até o escritório,
// placas de rua, fachada com "Você chegou!" e cartão final. Ciclo de 20 s.
//
// Three.js é carregado sob demanda do jsDelivr (só quando a seção aparece),
// então não pesa no bundle nem no SSR. Os textos sobrepostos são DOM real
// (nítidos, acessíveis e com links clicáveis).

const THREE_URL: string = "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js";

export type LocationSceneInfo = {
  kind: string;
  name: string;
  nameLine2: string;
  street: string;
  cityLine: string;
  hours: string;
  signs: [{ title: string; sub: string }, { title: string; sub: string }];
  arrivedSub: string;
  directionsUrl: string;
  whatsappUrl: string;
  monogram: string;
  facade: [string, string];
};

export type LocationScene = {
  setActive(active: boolean): void;
  setTheme(light: boolean): void;
  setSound(on: boolean): void;
  restart(): void;
  /** Vai para o instante t (s) do ciclo; útil para depuração e capturas. */
  seek(t: number): void;
  destroy(): void;
};

export type LocationSceneOptions = {
  info: LocationSceneInfo;
  light: boolean;
  reducedMotion: boolean;
};

// ---------------------------------------------------------------- utilidades
const LOOP = 20;
const TAU = Math.PI * 2;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => {
  const t = clamp01(x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const lerp = (a: number, b: number, s: number) => a + (b - a) * s;
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const fade = (t: number, a: number, b: number, c: number, d: number) =>
  ease(span(t, a, b)) * (1 - ease(span(t, c, d)));
const lerpAngle = (a: number, b: number, s: number) => {
  const d = ((((b - a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
  return a + d * s;
};
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Palette = {
  bg: number;
  road: number;
  walk: number;
  park: number;
  building: number;
  tree: number;
  route: number;
  halo: number;
  haloOpacity: number;
  dest: number;
  accent: number;
  pin: number;
  hemiSky: number;
  hemiGround: number;
  hemi: number;
  sun: number;
  sunI: number;
  fogNear: number;
  fogFar: number;
};

const LIGHT: Palette = {
  bg: 0xedf0f4,
  road: 0xf9fafc,
  walk: 0xe3e7ed,
  park: 0xcfe5c3,
  building: 0xffffff,
  tree: 0x8cc57f,
  route: 0x2459d6,
  halo: 0x7da2ff,
  haloOpacity: 0.28,
  dest: 0xfffaf0,
  accent: 0xb48f4c,
  pin: 0xc79a4b,
  hemiSky: 0xffffff,
  hemiGround: 0xb9c2cf,
  hemi: 2.1,
  sun: 0xffffff,
  sunI: 1.9,
  fogNear: 260,
  fogFar: 980,
};

const DARK: Palette = {
  bg: 0x111829,
  road: 0x262f49,
  walk: 0x182037,
  park: 0x1b3531,
  building: 0x3a4766,
  tree: 0x2e5f50,
  route: 0xe6c27a,
  halo: 0xe6c27a,
  haloOpacity: 0.22,
  dest: 0xf3ead6,
  accent: 0xd2b379,
  pin: 0xe0b866,
  hemiSky: 0xaec0ff,
  hemiGround: 0x0b1020,
  hemi: 1.5,
  sun: 0xdfe6ff,
  sunI: 1.5,
  fogNear: 220,
  fogFar: 900,
};

// ---------------------------------------------------------------- cidade
const N = 15; // quadras por lado
const BLOCK = 40;
const ROAD = 12;
const P = BLOCK + ROAD;
const HALF = (N * P) / 2;
const line = (i: number) => -HALF + i * P; // eixo da rua i (0..N)
const blockCenter = (i: number) => line(i) + P / 2;

// Quadra do escritório e rota (A → B → C), sobre os eixos das ruas.
const DEST_BX = 8;
const DEST_BZ = 6;
const DEST_X = blockCenter(DEST_BX);
const DEST_W = 24;
const DEST_D = 16;
const DEST_H = 17;
const FRONT_Z = line(DEST_BZ + 1) - ROAD / 2 - 1.2; // fachada voltada para +z
const DEST_Z = FRONT_Z - DEST_D / 2;
const ROUTE: Array<[number, number]> = [
  [line(4), line(12)],
  [line(4), line(DEST_BZ + 1)],
  [DEST_X, line(DEST_BZ + 1)],
];

/** Distância de um ponto ao trajeto (para baixar os prédios que tapariam a rota). */
function distToRoute(x: number, z: number) {
  let best = Infinity;
  for (let s = 0; s < ROUTE.length - 1; s++) {
    const [ax, az] = ROUTE[s]!;
    const [bx, bz] = ROUTE[s + 1]!;
    const dx = bx - ax;
    const dz = bz - az;
    const f = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    best = Math.min(best, Math.hypot(x - (ax + dx * f), z - (az + dz * f)));
  }
  return best;
}

type Sample = { x: number; z: number; tx: number; tz: number; d: number; miter: number };

function sampleRoute(pts: Array<[number, number]>, step: number) {
  const out: Sample[] = [];
  let acc = 0;
  for (let s = 0; s < pts.length - 1; s++) {
    const [ax, az] = pts[s]!;
    const [bx, bz] = pts[s + 1]!;
    const len = Math.hypot(bx - ax, bz - az);
    const tx = (bx - ax) / len;
    const tz = (bz - az) / len;
    const n = Math.max(1, Math.round(len / step));
    for (let k = s === 0 ? 0 : 1; k <= n; k++) {
      const f = k / n;
      out.push({ x: ax + (bx - ax) * f, z: az + (bz - az) * f, tx, tz, d: acc + len * f, miter: 1 });
    }
    acc += len;
  }
  // Junta em esquadria nas curvas (tangente média e largura compensada).
  for (let i = 1; i < out.length - 1; i++) {
    const a = out[i - 1]!;
    const b = out[i]!;
    const c = out[i + 1]!;
    const ux = (c.x - a.x) / (Math.hypot(c.x - a.x, c.z - a.z) || 1);
    const uz = (c.z - a.z) / (Math.hypot(c.x - a.x, c.z - a.z) || 1);
    const dot = ux * b.tx + uz * b.tz;
    if (Math.abs(1 - dot) > 1e-3) {
      b.tx = ux;
      b.tz = uz;
      b.miter = 1 / Math.max(0.5, dot);
    }
  }
  return { samples: out, length: acc };
}

// ---------------------------------------------------------------- som
class Sound {
  ctx: AudioContext;
  master: GainNode;
  noise: AudioBuffer;
  constructor() {
    const Ctor: typeof AudioContext =
      (window as any).AudioContext ?? (window as any).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  }
  kick() {
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
    g.gain.setValueAtTime(0.32, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.26);
  }
  hat() {
    const t = this.ctx.currentTime;
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 7000;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s.connect(f).connect(g).connect(this.master);
    s.start(t, Math.random() * 0.5, 0.06);
  }
  whoosh(dur = 0.7) {
    const t = this.ctx.currentTime;
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.4;
    f.frequency.setValueAtTime(260, t);
    f.frequency.exponentialRampToValueAtTime(2600, t + dur * 0.6);
    f.frequency.exponentialRampToValueAtTime(700, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + dur * 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(this.master);
    s.start(t);
    s.stop(t + dur + 0.05);
  }
}
const WHOOSHES = [0.85, 2.9, 5.4, 6.3, 12.7, 15.0, 17.6];

// ---------------------------------------------------------------- DOM
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls: string,
  parent?: HTMLElement,
  text?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = cls;
  if (text !== undefined) e.textContent = text;
  parent?.appendChild(e);
  return e;
}

const ARROW_UP =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
const ARROW_RIGHT =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const NAV_ICON =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M3 11 22 2l-9 19-2-8-8-2z"/></svg>';

function buildOverlay(root: HTMLElement, info: LocationSceneInfo) {
  const ui = el("div", "locmap-ui", root);
  const scrim = el("div", "locmap-scrim", ui);

  const intro = el("div", "locmap-intro", ui);
  const mark = el("div", "locmap-mark", intro);
  const markText = el("span", "locmap-mark-text", mark, info.monogram);

  const card = el("div", "locmap-card", ui);
  card.setAttribute("aria-hidden", "true");
  el("span", "locmap-eyebrow", card, info.kind);
  const h = el("p", "locmap-title", card, info.name);
  el("span", "locmap-title-sub", h, info.nameLine2);
  el("p", "locmap-line", card, info.street);
  el("p", "locmap-line locmap-muted", card, info.cityLine);
  el("p", "locmap-line locmap-muted", card, info.hours);
  const cardBtn = el("a", "locmap-btn", card);
  cardBtn.href = info.directionsUrl;
  cardBtn.target = "_blank";
  cardBtn.rel = "noopener noreferrer";
  cardBtn.tabIndex = -1;
  cardBtn.innerHTML = NAV_ICON;
  cardBtn.append(" Como chegar");

  const signs = info.signs.map((s, i) => {
    const sign = el("div", "locmap-sign", ui);
    sign.setAttribute("aria-hidden", "true");
    const arrow = el("span", "locmap-sign-arrow", sign);
    arrow.innerHTML = i === 0 ? ARROW_UP : ARROW_RIGHT;
    const txt = el("span", "locmap-sign-text", sign);
    el("small", "", txt, s.sub);
    el("strong", "", txt, s.title);
    return sign;
  });

  const arrived = el("div", "locmap-arrived", ui);
  arrived.setAttribute("aria-hidden", "true");
  el("strong", "", arrived, "Você chegou!");
  el("span", "", arrived, info.arrivedSub);

  const final = el("div", "locmap-final", ui);
  final.setAttribute("aria-hidden", "true");
  const fc = el("div", "locmap-final-card", final);
  el("span", "locmap-eyebrow", fc, "Visite o escritório");
  const ft = el("p", "locmap-title", fc, info.name);
  el("span", "locmap-title-sub", ft, info.nameLine2);
  el("p", "locmap-line", fc, `${info.street} · ${info.cityLine}`);
  el("p", "locmap-line locmap-muted", fc, info.hours);
  const row = el("div", "locmap-final-actions", fc);
  const b1 = el("a", "locmap-btn", row);
  b1.href = info.directionsUrl;
  b1.target = "_blank";
  b1.rel = "noopener noreferrer";
  b1.tabIndex = -1;
  b1.innerHTML = NAV_ICON;
  b1.append(" Como chegar");
  const b2 = el("a", "locmap-btn locmap-btn--ghost", row, "WhatsApp");
  b2.href = info.whatsappUrl;
  b2.target = "_blank";
  b2.rel = "noopener noreferrer";
  b2.tabIndex = -1;

  return { ui, scrim, intro, mark, markText, card, signs, arrived, final };
}

function setFade(e: HTMLElement, o: number, transform: string) {
  e.style.opacity = o.toFixed(3);
  e.style.visibility = o < 0.01 ? "hidden" : "visible";
  e.style.transform = transform;
  e.style.pointerEvents = o > 0.6 ? "auto" : "none";
}

// ---------------------------------------------------------------- cena
export async function createLocationScene(
  container: HTMLElement,
  opts: LocationSceneOptions,
): Promise<LocationScene> {
  const THREE: any = await import(/* @vite-ignore */ THREE_URL);
  const { info } = opts;

  let palette = opts.light ? LIGHT : DARK;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas: HTMLCanvasElement = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(palette.bg);
  scene.fog = new THREE.Fog(palette.bg, palette.fogNear, palette.fogFar);
  const camera = new THREE.PerspectiveCamera(36, 16 / 10, 1, 3000);

  const hemi = new THREE.HemisphereLight(palette.hemiSky, palette.hemiGround, palette.hemi);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(palette.sun, palette.sunI);
  sun.position.set(-220, 380, 160);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -460;
  sc.right = 460;
  sc.top = 460;
  sc.bottom = -460;
  sc.near = 10;
  sc.far = 1200;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.6;
  scene.add(sun);
  scene.add(sun.target);

  const disposables: any[] = [];
  const track = <T>(x: T): T => {
    disposables.push(x);
    return x;
  };

  // Chão = asfalto; as quadras são lajes elevadas por cima.
  const groundMat = track(new THREE.MeshLambertMaterial({ color: palette.road }));
  const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(4000, 4000)), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const rand = mulberry32(731);
  const unitBox = track(new THREE.BoxGeometry(1, 1, 1));
  unitBox.translate(0, 0.5, 0);

  type Lot = { x: number; z: number; w: number; d: number; h: number; shade: number };
  const lots: Lot[] = [];
  const slabs: Array<{ x: number; z: number; park: boolean }> = [];
  const trees: Array<{ x: number; z: number; s: number }> = [];

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const cx = blockCenter(i);
      const cz = blockCenter(j);
      const isDest = i === DEST_BX && j === DEST_BZ;
      const far = Math.hypot(cx - DEST_X, cz - DEST_Z) / HALF; // 0 no centro
      // A quadra em frente ao escritório é uma praça: abre a vista da fachada.
      const plaza = i === DEST_BX && j === DEST_BZ + 1;
      const park = plaza || (!isDest && ((i === 6 && j === 9) || (i === 10 && j === 4) || (i === 3 && j === 4) || rand() < 0.06));
      slabs.push({ x: cx, z: cz, park });
      if (park) {
        const count = plaza ? 14 : 26 + Math.floor(rand() * 10);
        for (let k = 0; k < count; k++) {
          if (plaza) {
            // Árvores só nas bordas laterais e no fundo, deixando o eixo livre.
            const side = k % 2 === 0 ? -1 : 1;
            trees.push({
              x: cx + side * (BLOCK / 2 - 4 - rand() * 5),
              z: cz + (rand() - 0.5) * (BLOCK - 8),
              s: 2.2 + rand() * 1.2,
            });
            continue;
          }
          trees.push({
            x: cx + (rand() - 0.5) * (BLOCK - 8),
            z: cz + (rand() - 0.5) * (BLOCK - 8),
            s: 2.4 + rand() * 1.8,
          });
        }
        continue;
      }
      const cols = rand() < 0.5 ? 2 : 3;
      const rows = 2;
      const inner = BLOCK - 4;
      const cw = inner / cols;
      const cd = inner / rows;
      for (let a = 0; a < cols; a++) {
        for (let b = 0; b < rows; b++) {
          const x = cx - inner / 2 + cw * (a + 0.5);
          const z = cz - inner / 2 + cd * (b + 0.5);
          // Fileira da frente da quadra do escritório fica livre para a fachada.
          if (isDest && b === rows - 1) continue;
          const base = 5 + rand() * rand() * 30;
          let h = Math.max(4, base * (1.15 - Math.min(1, far) * 0.75) + (rand() < 0.04 ? 28 : 0));
          // Perto da rota e do escritório os prédios ficam baixos, para não tapar a câmera.
          const nearRoute = distToRoute(x, z);
          const nearDest = Math.hypot(x - DEST_X, z - DEST_Z);
          if (nearRoute < 40) h = Math.min(h, 7 + nearRoute * 0.3);
          if (nearDest < 70) h = Math.min(h, 9 + nearDest * 0.12);
          lots.push({
            x: x + (rand() - 0.5) * 1.5,
            z: z + (rand() - 0.5) * 1.5,
            w: cw - 3 - rand() * 3,
            d: cd - 3 - rand() * 3,
            h,
            shade: 0.9 + rand() * 0.1,
          });
        }
      }
    }
  }
  // Árvores na calçada da rota (avenida de chegada).
  for (let z = line(DEST_BZ + 1) + 10; z < line(12) - 6; z += 11) {
    if (Math.abs(((z - line(0)) % P) - 0) < 8 || Math.abs(((z - line(0)) % P) - P) < 8) continue;
    trees.push({ x: line(4) - ROAD / 2 - 2.2, z, s: 2.2 });
    trees.push({ x: line(4) + ROAD / 2 + 2.2, z: z + 5, s: 2.2 });
  }

  const walkMat = track(new THREE.MeshLambertMaterial({ color: 0xffffff }));
  const slabMesh = new THREE.InstancedMesh(unitBox, walkMat, slabs.length);
  slabMesh.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v = new THREE.Vector3();
  const sv = new THREE.Vector3();
  slabs.forEach((s, idx) => {
    m4.compose(v.set(s.x, 0, s.z), q, sv.set(BLOCK, 0.6, BLOCK));
    slabMesh.setMatrixAt(idx, m4);
  });
  scene.add(slabMesh);

  const bMat = track(new THREE.MeshLambertMaterial({ color: 0xffffff }));
  const bMesh = new THREE.InstancedMesh(unitBox, bMat, lots.length);
  bMesh.castShadow = true;
  bMesh.receiveShadow = true;
  lots.forEach((l, idx) => {
    m4.compose(v.set(l.x, 0.6, l.z), q, sv.set(l.w, l.h, l.d));
    bMesh.setMatrixAt(idx, m4);
  });
  scene.add(bMesh);

  const treeGeo = track(new THREE.IcosahedronGeometry(1, 1));
  const treeMat = track(new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true }));
  const tMesh = new THREE.InstancedMesh(treeGeo, treeMat, trees.length);
  tMesh.castShadow = true;
  trees.forEach((t, idx) => {
    m4.compose(v.set(t.x, 0.6 + t.s, t.z), q, sv.set(t.s, t.s * 1.15, t.s));
    tMesh.setMatrixAt(idx, m4);
  });
  scene.add(tMesh);

  // Escritório: volume claro, faixa dourada, letreiro, porta e marquise.
  const destGroup = new THREE.Group();
  const destMat = track(new THREE.MeshLambertMaterial({ color: palette.dest }));
  const destBody = new THREE.Mesh(unitBox, destMat);
  destBody.scale.set(DEST_W, DEST_H, DEST_D);
  destBody.position.set(DEST_X, 0.6, DEST_Z);
  destBody.castShadow = true;
  destBody.receiveShadow = true;
  destGroup.add(destBody);
  const accentMat = track(new THREE.MeshLambertMaterial({ color: palette.accent }));
  const band = new THREE.Mesh(unitBox, accentMat);
  band.scale.set(DEST_W + 0.6, 0.8, DEST_D + 0.6);
  band.position.set(DEST_X, 0.6 + DEST_H - 0.8, DEST_Z);
  destGroup.add(band);
  const canopy = new THREE.Mesh(unitBox, accentMat);
  canopy.scale.set(10, 0.5, 3);
  canopy.position.set(DEST_X, 7.6, FRONT_Z + 1.4);
  canopy.castShadow = true;
  destGroup.add(canopy);
  const darkMat = track(new THREE.MeshLambertMaterial({ color: 0x0f1a33 }));
  const door = new THREE.Mesh(unitBox, darkMat);
  door.scale.set(5, 6.6, 0.4);
  door.position.set(DEST_X, 0.6, FRONT_Z + 0.1);
  destGroup.add(door);
  const glassMat = track(new THREE.MeshLambertMaterial({ color: 0x2a3d63 }));
  for (const dx of [-7.6, 7.6]) {
    const w = new THREE.Mesh(unitBox, glassMat);
    w.scale.set(6, 4.2, 0.3);
    w.position.set(DEST_X + dx, 2.2, FRONT_Z + 0.1);
    destGroup.add(w);
  }
  // Letreiro com textura de canvas.
  const signCanvas = document.createElement("canvas");
  signCanvas.width = 1024;
  signCanvas.height = 256;
  const signTex = track(new THREE.CanvasTexture(signCanvas));
  signTex.colorSpace = THREE.SRGBColorSpace;
  signTex.anisotropy = 4;
  const drawSign = () => {
    const g = signCanvas.getContext("2d");
    if (!g) return;
    g.fillStyle = "#0f1a33";
    g.fillRect(0, 0, 1024, 256);
    g.strokeStyle = "#d2b379";
    g.lineWidth = 6;
    g.strokeRect(14, 14, 996, 228);
    g.fillStyle = "#e3c788";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = '600 84px "Playfair Display", Georgia, serif';
    g.fillText(info.facade[0], 512, 112);
    g.font = '600 34px Manrope, system-ui, sans-serif';
    g.fillStyle = "#f1e9d8";
    g.fillText(info.facade[1].split("").join(String.fromCharCode(8202)), 512, 190);
    signTex.needsUpdate = true;
  };
  drawSign();
  document.fonts?.ready.then(() => drawSign()).catch(() => undefined);
  const signMat = track(new THREE.MeshBasicMaterial({ map: signTex, toneMapped: false }));
  const signMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(20, 5)), signMat);
  signMesh.position.set(DEST_X, 12, FRONT_Z + 0.06);
  destGroup.add(signMesh);
  scene.add(destGroup);

  // Pino 3D flutuando sobre o escritório.
  const pinMat = track(new THREE.MeshLambertMaterial({ color: palette.pin, emissive: palette.pin, emissiveIntensity: 0.18 }));
  const whiteMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const pin = new THREE.Group();
  const head = new THREE.Mesh(track(new THREE.SphereGeometry(4.6, 32, 24)), pinMat);
  head.position.y = 9.4;
  const cone = new THREE.Mesh(track(new THREE.ConeGeometry(4.25, 9.2, 32, 1, true)), pinMat);
  cone.rotation.x = Math.PI;
  cone.position.y = 9.4 - 4.6 - 0.15;
  const dot = new THREE.Mesh(track(new THREE.SphereGeometry(1.9, 24, 16)), whiteMat);
  dot.position.y = 9.4;
  dot.scale.set(1, 1, 2.55);
  pin.add(head, cone, dot);
  pin.traverse((o: any) => {
    if (o.isMesh) o.castShadow = true;
  });
  pin.position.set(DEST_X, 0.6 + DEST_H + 2, DEST_Z);
  scene.add(pin);
  const pinShadow = new THREE.Mesh(
    track(new THREE.CircleGeometry(4.5, 32)),
    track(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false })),
  );
  pinShadow.rotation.x = -Math.PI / 2;
  pinShadow.position.set(DEST_X, 0.6 + DEST_H + 0.05, DEST_Z);
  scene.add(pinShadow);

  // Rota: fita com auréola, revelada por drawRange.
  const { samples, length: routeLen } = sampleRoute(ROUTE, 1);
  const ribbon = (width: number, y: number) => {
    const pos = new Float32Array(samples.length * 6);
    samples.forEach((s, i) => {
      const nx = -s.tz * (width / 2) * s.miter;
      const nz = s.tx * (width / 2) * s.miter;
      pos.set([s.x + nx, y, s.z + nz, s.x - nx, y, s.z - nz], i * 6);
    });
    const idx: number[] = [];
    for (let i = 0; i < samples.length - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };
  const routeMat = track(new THREE.MeshBasicMaterial({ color: palette.route, toneMapped: false, side: THREE.DoubleSide }));
  const haloMat = track(
    new THREE.MeshBasicMaterial({ color: palette.halo, transparent: true, opacity: palette.haloOpacity, depthWrite: false, side: THREE.DoubleSide }),
  );
  const routeGeo = ribbon(4.4, 0.75);
  const haloGeo = ribbon(10, 0.7);
  const routeMesh = new THREE.Mesh(routeGeo, routeMat);
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  routeMesh.renderOrder = 2;
  haloMesh.renderOrder = 1;
  scene.add(haloMesh, routeMesh);

  const headGroup = new THREE.Group();
  const headOuter = new THREE.Mesh(track(new THREE.CircleGeometry(3.6, 32)), whiteMat);
  const headInner = new THREE.Mesh(track(new THREE.CircleGeometry(2.5, 32)), routeMat);
  headInner.position.y = 0.05;
  const pulseMat = track(new THREE.MeshBasicMaterial({ color: palette.route, transparent: true, opacity: 0.4, depthWrite: false }));
  const pulse = new THREE.Mesh(track(new THREE.RingGeometry(3.8, 4.6, 40)), pulseMat);
  for (const m of [headOuter, headInner, pulse]) m.rotation.x = -Math.PI / 2;
  headGroup.add(headOuter, headInner, pulse);
  headGroup.position.y = 0.9;
  scene.add(headGroup);

  const routeAt = (d: number) => {
    const dd = Math.min(Math.max(d, 0), routeLen);
    let lo = 0;
    let hi = samples.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid]!.d <= dd) lo = mid;
      else hi = mid;
    }
    const a = samples[lo]!;
    const b = samples[hi]!;
    const f = b.d === a.d ? 0 : (dd - a.d) / (b.d - a.d);
    return { x: lerp(a.x, b.x, f), z: lerp(a.z, b.z, f), i: lo };
  };
  const routeHeading = (d: number) => {
    const a = routeAt(d - 30);
    const b = routeAt(d + 30);
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    return Math.atan2(-dx, -dz); // câmera atrás do movimento
  };

  // Cores dependentes do tema.
  const shadeColor = new THREE.Color();
  const applyPalette = () => {
    scene.background.setHex(palette.bg);
    scene.fog.color.setHex(palette.bg);
    scene.fog.near = palette.fogNear;
    scene.fog.far = palette.fogFar;
    hemi.color.setHex(palette.hemiSky);
    hemi.groundColor.setHex(palette.hemiGround);
    hemi.intensity = palette.hemi;
    sun.color.setHex(palette.sun);
    sun.intensity = palette.sunI;
    groundMat.color.setHex(palette.road);
    destMat.color.setHex(palette.dest);
    accentMat.color.setHex(palette.accent);
    pinMat.color.setHex(palette.pin);
    pinMat.emissive.setHex(palette.pin);
    routeMat.color.setHex(palette.route);
    pulseMat.color.setHex(palette.route);
    haloMat.color.setHex(palette.halo);
    haloMat.opacity = palette.haloOpacity;
    slabs.forEach((s, i) => slabMesh.setColorAt(i, shadeColor.setHex(s.park ? palette.park : palette.walk)));
    lots.forEach((l, i) => bMesh.setColorAt(i, shadeColor.setHex(palette.building).multiplyScalar(l.shade)));
    trees.forEach((t, i) => tMesh.setColorAt(i, shadeColor.setHex(palette.tree).multiplyScalar(0.85 + (i % 7) * 0.035)));
    for (const m of [slabMesh, bMesh, tMesh]) if (m.instanceColor) m.instanceColor.needsUpdate = true;
  };
  applyPalette();

  // ------------------------------------------------------------ câmera
  type V3 = { x: number; y: number; z: number };
  type Key = { t: number; target: (t: number) => V3; dist: number; pitch: number; az: (t: number) => number };
  const DEG = Math.PI / 180;
  const fixed = (p: V3) => () => p;
  const constAz = (a: number) => () => a;
  const destCenter: V3 = { x: DEST_X, y: 8, z: DEST_Z };
  const facade: V3 = { x: DEST_X, y: 7.5, z: FRONT_Z };
  const routeMid: V3 = { x: (line(4) + DEST_X) / 2, y: 0, z: (line(12) + line(DEST_BZ + 1)) / 2 };
  const ROUTE_T0 = 6.1;
  const ROUTE_T1 = 12.5;
  const headDist = (t: number) => ease(span(t, ROUTE_T0, ROUTE_T1)) * routeLen;
  const headTarget = (t: number): V3 => {
    const p = routeAt(headDist(t));
    return { x: p.x, y: 0, z: p.z };
  };
  const headAz = (t: number) => routeHeading(headDist(t)) + 0.8;
  const KEYS: Key[] = [
    { t: 0, target: fixed(destCenter), dist: 640, pitch: 84, az: constAz(0.2) },
    { t: 1.0, target: fixed(destCenter), dist: 600, pitch: 82, az: constAz(0.3) },
    { t: 3.0, target: fixed(destCenter), dist: 150, pitch: 44, az: constAz(0.95) },
    { t: 4.3, target: fixed(destCenter), dist: 170, pitch: 40, az: constAz(1.25) },
    { t: 5.6, target: fixed(routeMid), dist: 430, pitch: 56, az: constAz(1.0) },
    { t: 6.6, target: headTarget, dist: 140, pitch: 50, az: headAz },
    { t: 12.2, target: headTarget, dist: 125, pitch: 45, az: headAz },
    { t: 13.4, target: fixed(facade), dist: 54, pitch: 9, az: constAz(-0.28) },
    { t: 15.1, target: fixed(facade), dist: 64, pitch: 13, az: constAz(0.3) },
    { t: 17.7, target: fixed(destCenter), dist: 380, pitch: 66, az: constAz(1.1) },
    { t: LOOP, target: fixed(destCenter), dist: 560, pitch: 80, az: constAz(1.5) },
  ];
  const DRIFT = 0.035;
  let aspect = 16 / 10;
  const camAt = (t: number) => {
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1]!.t <= t) i++;
    const a = KEYS[i]!;
    const b = KEYS[i + 1]!;
    const s = ease((t - a.t) / (b.t - a.t));
    const ta = a.target(t);
    const tb = b.target(t);
    const target = { x: lerp(ta.x, tb.x, s), y: lerp(ta.y, tb.y, s), z: lerp(ta.z, tb.z, s) };
    const portrait = aspect < 1.25 ? Math.pow(1.25 / aspect, 0.8) : 1;
    const dist = lerp(a.dist, b.dist, s) * portrait;
    const pitch = lerp(a.pitch, b.pitch, s) * DEG;
    const az = lerpAngle(a.az(t), b.az(t), s) + DRIFT * t;
    return { target, dist, pitch, az };
  };
  const placeCamera = (target: V3, dist: number, pitch: number, az: number) => {
    const c = Math.cos(pitch);
    camera.position.set(
      target.x + Math.sin(az) * c * dist,
      target.y + Math.sin(pitch) * dist,
      target.z + Math.cos(az) * c * dist,
    );
    camera.lookAt(target.x, target.y, target.z);
  };

  // ------------------------------------------------------------ sobreposições
  const ov = buildOverlay(container, info);
  const signAnchors: V3[] = [
    { x: line(4), y: 10, z: (line(12) + line(DEST_BZ + 1)) / 2 + 30 },
    { x: line(4) + 34, y: 10, z: line(DEST_BZ + 1) },
  ];
  const arrivedAnchor: V3 = { x: DEST_X, y: 16.5, z: FRONT_Z + 1 };
  const proj = new THREE.Vector3();
  let width = 1;
  let height = 1;
  const project = (p: V3) => {
    proj.set(p.x, p.y, p.z).project(camera);
    return { x: (proj.x + 1) * 0.5 * width, y: (1 - proj.y) * 0.5 * height, behind: proj.z > 1 };
  };
  const labelSize = new WeakMap<HTMLElement, { w: number; h: number; at: number }>();
  const placeLabel = (e: HTMLElement, p: V3, o: number, lift = 0) => {
    const s = project(p);
    const op = s.behind ? 0 : o;
    // Mantém a placa inteira dentro do quadro (mede só quando o layout muda).
    let size = labelSize.get(e);
    if (op > 0 && (!size || size.at !== width)) {
      size = { w: e.offsetWidth, h: e.offsetHeight, at: width };
      labelSize.set(e, size);
    }
    const m = 10;
    const hw = size ? size.w / 2 : 0;
    const x = Math.min(Math.max(s.x, hw + m), Math.max(hw + m, width - hw - m));
    const y = Math.min(Math.max(s.y - lift, (size ? size.h : 0) + m), height - m);
    setFade(e, op, `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`);
  };

  const updateOverlay = (t: number, staticMode: boolean) => {
    if (staticMode) {
      setFade(ov.scrim, 0, "none");
      setFade(ov.intro, 0, "none");
      setFade(ov.card, 1, "none");
      placeLabel(ov.signs[0]!, signAnchors[0]!, 1);
      placeLabel(ov.signs[1]!, signAnchors[1]!, 1);
      setFade(ov.arrived, 0, "none");
      setFade(ov.final, 0, "none");
      return;
    }
    // Véu: cobre a virada do ciclo e escurece o fundo do cartão final.
    const introVeil = 1 - ease(span(t, 0.7, 1.5));
    const finalVeil = 0.55 * fade(t, 17.7, 18.4, 30, 31);
    const seam = ease(span(t, 19.45, 19.95));
    setFade(ov.scrim, Math.max(introVeil, finalVeil, seam), "none");
    ov.scrim.style.pointerEvents = "none";

    // Abertura: monograma → pino → mergulho.
    const morph = ease(span(t, 0.25, 0.75));
    const appear = ease(span(t, 0, 0.3));
    const dive = ease(span(t, 0.95, 1.55));
    const markScale = (0.6 + 0.4 * appear) * (1 - dive * 0.75);
    ov.mark.style.borderRadius = `50% 50% 50% ${(50 * (1 - morph)).toFixed(1)}%`;
    ov.mark.style.transform = `translateY(${(dive * 70).toFixed(1)}px) scale(${markScale.toFixed(3)}) rotate(${(-45 * morph).toFixed(1)}deg)`;
    ov.markText.style.transform = `rotate(${(45 * morph).toFixed(1)}deg)`;
    setFade(ov.intro, appear * (1 - dive), "none");

    const cardO = fade(t, 3.0, 3.6, 5.25, 5.75);
    setFade(ov.card, cardO, `translateY(${((1 - cardO) * 14).toFixed(1)}px)`);
    placeLabel(ov.signs[0]!, signAnchors[0]!, fade(t, 6.5, 6.9, 9.0, 9.4), (1 - fade(t, 6.5, 6.9, 99, 100)) * -10);
    placeLabel(ov.signs[1]!, signAnchors[1]!, fade(t, 8.9, 9.3, 12.0, 12.4), (1 - fade(t, 8.9, 9.3, 99, 100)) * -10);
    placeLabel(ov.arrived, arrivedAnchor, fade(t, 13.1, 13.6, 15.5, 16.0), 6);
    const finalO = fade(t, 17.9, 18.5, 19.4, 19.85);
    setFade(ov.final, finalO, `scale(${(0.96 + 0.04 * finalO).toFixed(3)})`);
  };

  // ------------------------------------------------------------ quadro
  const renderAt = (t: number, staticMode = false) => {
    let target: V3;
    let dist: number;
    let pitch: number;
    let az: number;
    let reveal: number;
    if (staticMode) {
      const portrait = aspect < 1.25 ? Math.pow(1.25 / aspect, 0.8) : 1;
      target = { x: routeMid.x + 20, y: 0, z: routeMid.z - 10 };
      dist = 340 * portrait;
      pitch = 52 * DEG;
      az = 0.55;
      reveal = routeLen;
    } else {
      const c = camAt(t);
      target = c.target;
      dist = c.dist;
      pitch = c.pitch;
      az = c.az;
      reveal = t < ROUTE_T0 ? 0 : headDist(t);
    }
    placeCamera(target, dist, pitch, az);

    const hp = routeAt(reveal);
    const drawn = reveal <= 0 ? 0 : Math.min(samples.length - 1, hp.i + 1);
    routeGeo.setDrawRange(0, drawn * 6);
    haloGeo.setDrawRange(0, drawn * 6);
    headGroup.visible = reveal > 0;
    headGroup.position.x = hp.x;
    headGroup.position.z = hp.z;
    const pulseS = 1 + ((t * 1.6) % 1) * 1.4;
    pulse.scale.set(pulseS, pulseS, pulseS);
    pulseMat.opacity = 0.45 * (1 - ((t * 1.6) % 1));

    const bob = Math.sin(t * 2.4) * 1.1;
    pin.position.y = 0.6 + DEST_H + 3 + (staticMode ? 0 : bob);
    pin.rotation.y = t * 0.9;
    const ps = 1 + 0.45 * (1 - ease(span(t, 1.0, 3.0))) * (staticMode ? 0 : 1);
    pin.scale.set(ps, ps, ps);

    camera.updateMatrixWorld(); // projeção das placas usa a câmera deste quadro
    updateOverlay(t, staticMode);
    renderer.render(scene, camera);
  };

  // ------------------------------------------------------------ ciclo
  let raf = 0;
  let active = false;
  let clock = 0;
  let last = 0;
  let prevT = 0;
  let sound: Sound | null = null;
  let soundOn = false;
  const staticMode = opts.reducedMotion;

  const audioTick = (t: number) => {
    if (!sound || !soundOn) return;
    if (t < prevT) {
      prevT = 0;
      return;
    }
    if (Math.floor(t * 2) !== Math.floor(prevT * 2)) sound.kick();
    const q4 = Math.floor(t * 4);
    if (q4 !== Math.floor(prevT * 4) && q4 % 2 === 1) sound.hat();
    for (const w of WHOOSHES) if (prevT < w && t >= w) sound.whoosh();
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    clock += dt;
    const t = clock % LOOP;
    audioTick(t);
    prevT = t;
    renderAt(t);
  };

  const start = () => {
    if (raf || staticMode || !active || document.hidden) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const resize = () => {
    const r = container.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    aspect = width / height;
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    camera.fov = aspect < 1 ? 46 : 36;
    camera.updateProjectionMatrix();
    if (!raf) renderAt(staticMode ? 0 : clock % LOOP, staticMode);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  return {
    setActive(a) {
      active = a;
      if (a) start();
      else stop();
    },
    setTheme(light) {
      palette = light ? LIGHT : DARK;
      applyPalette();
      if (!raf) renderAt(staticMode ? 0 : clock % LOOP, staticMode);
    },
    setSound(on) {
      soundOn = on;
      if (on) {
        try {
          sound ??= new Sound();
          void sound.ctx.resume();
        } catch {
          soundOn = false;
        }
      } else if (sound) {
        void sound.ctx.suspend();
      }
    },
    seek(t) {
      clock = ((t % LOOP) + LOOP) % LOOP;
      prevT = clock;
      if (!raf) renderAt(clock, staticMode);
    },
    restart() {
      clock = 0;
      prevT = 0;
      if (!raf) renderAt(0, staticMode);
    },
    destroy() {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (sound) void sound.ctx.close();
      for (const d of disposables) d?.dispose?.();
      slabMesh.dispose();
      bMesh.dispose();
      tMesh.dispose();
      renderer.dispose();
      canvas.remove();
      ov.ui.remove();
    },
  };
}
