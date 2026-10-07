import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const container = document.getElementById('app')

// --- Scene / Camera / Renderer ---
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050508)
scene.fog = new THREE.FogExp2(0x050508, 0.032)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 1.8, 4.2)

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.25
renderer.outputColorSpace = THREE.SRGBColorSpace
container.appendChild(renderer.domElement)

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.target.set(0, 1.05, 0)
controls.minDistance = 1.2
controls.maxDistance = 8
controls.maxPolarAngle = Math.PI / 2 - 0.05
controls.minPolarAngle = 0.15

// --- Lights ---
scene.add(new THREE.HemisphereLight(0xd8b4fe, 0x1a0a2e, 0.9))

const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
keyLight.position.set(3, 6, 4)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(2048, 2048)
keyLight.shadow.camera.near = 0.5
keyLight.shadow.camera.far = 20
keyLight.shadow.bias = -0.0003
scene.add(keyLight)

const rimLight = new THREE.DirectionalLight(0x9333ea, 2.8)
rimLight.position.set(-4, 4, -3)
scene.add(rimLight)

const fillLight = new THREE.PointLight(0xa855f7, 5, 7)
fillLight.position.set(0, 0.35, 0)
scene.add(fillLight)

// --- Floor ---
const floor = new THREE.Mesh(
  new THREE.CylinderGeometry(3.2, 3.6, 0.14, 64),
  new THREE.MeshStandardMaterial({ color: 0x0e0e16, roughness: 0.35, metalness: 0.75 })
)
floor.position.y = -0.07
floor.receiveShadow = true
scene.add(floor)

const ring = new THREE.Mesh(
  new THREE.RingGeometry(2.15, 2.26, 64),
  new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
)
ring.rotation.x = -Math.PI / 2
ring.position.y = 0.012
scene.add(ring)

const innerRing = new THREE.Mesh(
  new THREE.RingGeometry(1.35, 1.4, 64),
  new THREE.MeshBasicMaterial({ color: 0xc4b5fd, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
)
innerRing.rotation.x = -Math.PI / 2
innerRing.position.y = 0.013
scene.add(innerRing)

// --- Particles ---
const COUNT = 420
const pGeo = new THREE.BufferGeometry()
const pPos = new Float32Array(COUNT * 3)
const pSpeed = new Float32Array(COUNT)
for (let i = 0; i < COUNT; i++) {
  pPos[i * 3] = (Math.random() - 0.5) * 9
  pPos[i * 3 + 1] = Math.random() * 4.5
  pPos[i * 3 + 2] = (Math.random() - 0.5) * 9
  pSpeed[i] = 0.25 + Math.random() * 0.9
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
const pMat = new THREE.PointsMaterial({ color: 0xc084fc, size: 0.038, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, sizeAttenuation: true })
const particles = new THREE.Points(pGeo, pMat)
scene.add(particles)

// --- UI ---
container.insertAdjacentHTML('beforeend', `
  <div id="loading-screen">
    <div class="spinner"></div>
    <div class="loading-text">Memuat Beyond Bankai Aizen...</div>
    <div style="font-size:11px;color:#71717a;margin-top:6px" id="loading-pct">0%</div>
  </div>
  <div class="ui-overlay">
    <div class="header card-panel">
      <div class="badge">BLEACH &bull; BEYOND BANKAI</div>
      <div class="title">Sosuke Aizen</div>
      <div class="subtitle">Showcase 3D interaktif &mdash; pilih animasi, putar &amp; zoom model</div>
    </div>
    <div class="card-panel controls-bar" id="anim-buttons"></div>
    <div>
      <div class="card-panel stats-card">
        <div class="stats-item"><span class="label">Animasi aktif</span> <span class="val" id="anim-name">-</span></div>
        <div class="stats-item"><span class="label">Status</span> <span class="val" id="status-text">Loading</span></div>
        <div class="stats-item"><span class="label">Polygons</span> <span class="val" id="poly-count">-</span></div>
        <div class="stats-item"><span class="label">Animasi tersedia</span> <span class="val" id="anim-count">-</span></div>
      </div>
      <div class="hint-bar"><kbd>Drag</kbd> putar &bull; <kbd>Scroll</kbd> zoom &bull; <kbd>Klik kanan</kbd> geser &bull; <kbd>1-9</kbd> ganti animasi</div>
    </div>
  </div>
`)

// --- Load Model ---
let mixer = null
const actions = {}
let activeAction = null

const loader = new GLTFLoader()
loader.load('/model.glb', (gltf) => {
  const model = gltf.scene
  model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  // Center model: estimated height ~1.9m, base at y ~ -0.2 inside glb — lift so feet on floor
  model.position.y = 0
  scene.add(model)

  // poly count
  let tris = 0
  model.traverse(n => {
    if (n.isMesh && n.geometry) {
      const g = n.geometry
      tris += g.index ? g.index.count / 3 : g.attributes.position.count / 3
    }
  })
  document.getElementById('poly-count').textContent = Math.round(tris).toLocaleString('id-ID')
  document.getElementById('anim-count').textContent = gltf.animations.length
  document.getElementById('status-text').textContent = 'Siap'

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(model)
    const bar = document.getElementById('anim-buttons')

    // Sort: idle first, then rest alphabetically for stable 1-9 mapping
    const clips = [...gltf.animations].sort((a, b) => {
      if (a.name === 'idle') return -1
      if (b.name === 'idle') return 1
      return a.name.localeCompare(b.name)
    })

    clips.forEach(clip => {
      const action = mixer.clipAction(clip)
      // looping animations should loop, one-shots clamp
      const oneShot = ['die', 'back'].includes(clip.name)
      action.loop = oneShot ? THREE.LoopOnce : THREE.LoopRepeat
      action.clampWhenFinished = oneShot
      actions[clip.name] = action

      const btn = document.createElement('button')
      btn.className = 'btn'
      btn.textContent = clip.name.replace(/_/g, ' ')
      btn.dataset.anim = clip.name
      btn.addEventListener('click', () => playAnim(clip.name))
      bar.appendChild(btn)
    })

    const first = clips.find(c => c.name === 'idle')?.name || clips[0].name
    playAnim(first, 0)
  }

  const ls = document.getElementById('loading-screen')
  ls.style.opacity = '0'
  ls.style.pointerEvents = 'none'
  setTimeout(() => ls.remove(), 650)

}, (e) => {
  if (e.lengthComputable) {
    const pct = Math.round(e.loaded / e.total * 100)
    const el = document.getElementById('loading-pct')
    const t = document.querySelector('.loading-text')
    if (el) el.textContent = pct + '%'
    if (t) t.textContent = `Memuat Beyond Bankai Aizen... ${pct}%`
  }
}, (err) => {
  console.error(err)
  const t = document.querySelector('.loading-text')
  if (t) t.textContent = 'Gagal memuat model.glb — cek console'
})

function playAnim(name, fade = 0.45) {
  const next = actions[name]
  if (!next) return
  if (activeAction === next) { next.reset().play(); return }
  next.reset()
  next.enabled = true
  next.setEffectiveTimeScale(1)
  next.setEffectiveWeight(1)
  if (activeAction) {
    activeAction.crossFadeTo(next, fade, false)
  }
  next.play()
  activeAction = next
  document.getElementById('anim-name').textContent = name
  document.getElementById('status-text').textContent = 'Memainkan animasi'
  document.querySelectorAll('.btn').forEach(b => b.classList.toggle('active', b.dataset.anim === name))
}

// Resize
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

// Keyboard 1-9
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return
  const n = parseInt(e.key, 10)
  if (!isNaN(n) && n >= 1) {
    const btns = [...document.querySelectorAll('.btn')]
    if (btns[n - 1]) btns[n - 1].click()
  }
  if (e.code === 'Space') {
    e.preventDefault()
    // toggle pause
    if (mixer) mixer.timeScale = mixer.timeScale === 0 ? 1 : 0
    document.getElementById('status-text').textContent = mixer.timeScale === 0 ? 'Paused (Space)' : 'Memainkan animasi'
  }
})

// Loop
const clock = new THREE.Clock()
function tick() {
  requestAnimationFrame(tick)
  const dt = clock.getDelta()
  const t = clock.elapsedTime
  if (mixer) mixer.update(dt)
  ring.rotation.z = t * 0.18
  innerRing.rotation.z = -t * 0.28
  // subtle particle drift
  const arr = pGeo.attributes.position.array
  for (let i = 0; i < COUNT; i++) {
    arr[i * 3 + 1] += pSpeed[i] * dt * 0.18
    if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = 0
  }
  pGeo.attributes.position.needsUpdate = true
  // breathing glow
  fillLight.intensity = 4 + Math.sin(t * 1.2) * 1.2
  controls.update()
  renderer.render(scene, camera)
}
tick()
