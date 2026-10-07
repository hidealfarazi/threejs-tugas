# Tugas Three.js &mdash; Beyond Bankai Aizen (3D Interactive Showcase)

Aplikasi Web 3D interaktif berbasis **Three.js + Vite** yang memuat model 3D rigged & animated **Sosuke Aizen (Beyond Bankai / Bleach)**.

---

## 🚀 Fitur yang Diterapkan

1. **Scene, Camera, Renderer (WebGL)**
   - ACES Filmic Tone Mapping + sRGB Color Space untuk render warna realistis.
   - PCF Soft Shadow Map + Fog bertema gelap (Bleach Reiatsu vibe).
2. **Lighting & Visual Atmosphere**
   - HemisphereLight untuk ambient atas/bawah.
   - Directional Key Light dengan shadow high-res (2048x2048).
   - Directional Purple Rim Light (efek aura Bankai).
   - Point Light ungu dinamis (breathing glow intensity).
3. **Controls & Interaktivitas**
   - **OrbitControls**: Orbit (klik kiri + geser), Zoom (scroll), Pan (klik kanan + geser).
   - **Keyboard 1-9**: Shortcut ganti animasi langsung.
   - **Tombol Space**: Pause / Resume animasi.
4. **Animasi & Rigging (GLTF AnimationMixer)**
   - Mendukung 14 clip animasi bawaan model (`idle`, `CommonAttack`, `attack_1`, `skill_1_1` s/d `skill_3_3`, `die`, `run`, `back`, `stay_show`).
   - Smooth cross-fading antar perpindahan aksi.
5. **VFX & Environment**
   - Platform podium sci-fi silinder gelap dengan dual rotating rune ring.
   - Partikel Reiatsu (400+ particles) dengan efek melayang additive-blended.
6. **UI Overlay & Glassmorphism**
   - Indikator status, nama animasi aktif, jumlah polygons real-time, dan total animasi.
   - Responsive & auto-resize untuk semua ukuran layar.

---

## 💻 Cara Menjalankan Secara Lokal

```bash
# 1. Masuk ke folder
cd C:/Users/Acer/Downloads/threejstugas

# 2. Jalankan development server
npm run dev
```

Buka URL yang muncul di browser (biasanya `http://localhost:5173`).

---

## 📦 Cara Upload ke GitHub

```bash
cd C:/Users/Acer/Downloads/threejstugas
git init
git add .
git commit -m "feat: complete Three.js Aizen 3D Showcase assignment"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

---

## 🌐 Cara Deploy ke Vercel

### Opsi A (Menggunakan Vercel CLI):
```bash
npm i -g vercel
vercel
```

### Opsi B (Melalui Dashboard Vercel):
1. Buka [vercel.com](https://vercel.com) & login dengan GitHub.
2. Klik **Add New** &rarr; **Project**.
3. Import repositori yang sudah di-push tadi.
4. Framework Preset: **Vite**.
5. Klik **Deploy**.

---

## 📋 Pengumpulan Tugas (Format & Drive)

* **Format Nama:** `Kelas_absen_nama` (contoh: `11RPL1_10_Danadyaksa`)
* **Link Drive Pengumpulan:** [Google Drive Pengumpulan Tugas](https://drive.google.com/drive/folders/1px_Y116DKeBIfIRfsb0RJN5h23OvRurk)
* **File yang diunggah ke folder Drive Anda:**
  1. File model 3D asli (`beyond_bankai_aizen.glb` / `model.glb`)
  2. Teks/Dokumen berisi:
     - Link Repositori GitHub
     - Link Live Preview Vercel
