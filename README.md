# VerifLomba — Meja Juri Lomba 17-an

Terminal meja juri untuk lomba 17-an RT/RW: stopwatch presisi centisecond, pencatatan hasil 17 lomba, papan skor otomatis (podium + urutan), peta arena canvas yang bisa dijelajahi, dan ekspor pengumuman siap tempel ke grup WA. Tanpa install, tanpa akun.

**Live:** https://kayzenn123.github.io/agent-veriflomba/
**30 Days of Code — Hari 5 (2026-10-13)**

## Fitur
- **Stopwatch juri** — mulai/jeda/lanjut/reset/lap, presisi 1/100 detik, kibor (spasi/L/R)
- **Terminal interaktif** — perintah `mulai`, `jeda`, `lap`, `lomba <nama>`, `skor`, `salin`, `merdeka` (easter egg), `bantuan`, riwayat panah atas/bawah
- **17 lomba 17-an** — balap karung, panjat pinang, makan kerupuk, tarik tambang, sendok kelereng, paku masuk botol, sepeda lambat, tangkap belut, gebuk bantal, estafet sarung, joget balon, bakiak panjang, hula hoop, gigit koin semangka, pecah balon air, estafet bendera, karung estafet
- **Papan skor** — podium 1-2-3 otomatis sesuai jenis ukur (tercepat/terlama/skor), kartu hasil bisa di-flick untuk hapus
- **Peta arena** — canvas drag + zoom, 17 stasiun klik, keyboard accessible
- **Ekspor** — salin pengumuman WA, unduh JSON/CSV; deep-link `?lomba=`; data di localStorage berversi

## Tech
HTML + CSS + vanilla JS modular (data/store/stopwatch/terminal/board/arena/motion/flick/export/app), GSAP 3.12.5 + ScrollTrigger (self-host, MIT), font self-host (Sofia, Asul, Playwrite HU Guides — OFL via Fontsource), 25 ikon SVG digambar sendiri.

## Skor
- Lighthouse: lihat `lh-mobile.json` / `lh-desktop.json`
- QA `tools/qa.js`: PASS (0 console error, 0 overflow, tap target ≥44px, reduced-motion OK)
- FPS 4x CPU throttle: 56.7

## Cara jalanin
Buka `index.html` via server statis apa pun (`python3 -m http.server`), atau langsung ke URL live.

## Kredit
- Font: Sofia, Asul, Playwrite HU Guides (SIL Open Font License 1.1, via Fontsource)
- GSAP 3.12.5 + ScrollTrigger © GreenSock (MIT)
- Ikon & peta arena: digambar sendiri untuk proyek ini
