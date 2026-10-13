/* VerifLomba — data 17 lomba 17-an + ikon solid blocky custom (hand-built SVG) */
(function () {
  'use strict';
  const P = (d, extra) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"${extra || ''}><path fill="currentColor" d="${d}"/></svg>`;
  // Semua ikon digambar sendiri: solid blocky, satu warna (currentColor).
  const ICONS = {
    'balap-karung': P('M9 1h6v4H9zM12 6c-3.8 0-6.8 3.9-6.8 8.4 0 4 3 6.6 6.8 6.6s6.8-2.6 6.8-6.6C18.8 9.9 15.8 6 12 6z'),
    'panjat-pinang': P('M11 11h2v12h-2zM12 11C8 11 4 9 2 5c4.5 0 8.5 1.2 10 4 1.5-2.8 5.5-4 10-4-2 4-6 6-10 6z'),
    'makan-kerupuk': P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.5 8h2v2h-2zM13.5 9h2v2h-2zM9 13.5h2v2H9zM14 13.5h2v2h-2z'),
    'tarik-tambang': P('M1 10h10V8h2v2h10v4H13v2h-2v-2H1zM11 6h2v3h-2zM11 15h2v3h-2z'),
    'sendok-kelereng': P('M16.5 3a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM13.6 12.4 3.5 22.5l2.1 2.1 10.1-10.1z'),
    'paku-botol': P('M10 1h4v5l3 5v12H7V11l3-5zM11 13h2v6h-2z'),
    'sepeda-lambat': '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="6" cy="17" r="4"/><circle cx="18" cy="17" r="4"/><path d="M6 17 10 8h5l3 9M10 8 8.5 5H11"/></g></svg>',
    'tangkap-belut': '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 15c2.5-5 5 5 7.5 0s5 5 7.5 0 3.5 3 5 1" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>',
    'gebuk-bantal': P('M6 3h12l2.5 2.5v13L18 21H6l-2.5-2.5v-13zM11 10.5h2v3h-2z'),
    'estafet-sarung': P('M7 2h10v5H7zM7 9h10v13H7z'),
    'joget-balon': P('M12 1a6 6 0 0 1 6 6c0 4.2-4 7.2-6 9.2C10 14.2 6 11.2 6 7a6 6 0 0 1 6-6zM11 17.5h2V20h-2zM12 20c0 1.6-1.8 1.8-1.8 3.5'),
    'bakiak-panjang': P('M2 15h20v4H2zM4 15V8h9v7zM15 12h5v3h-5z'),
    'hula-hoop': P('M12 2c6.3 0 11 4.2 11 9.5S18.3 21 12 21 1 16.8 1 11.5 5.7 2 12 2zm0 4.5c-4.2 0-7.2 2.3-7.2 5s3 5 7.2 5 7.2-2.3 7.2-5-3-5-7.2-5z', ' fill-rule="evenodd"'),
    'koin-semangka': P('M2 4h20L12 22zM9.5 9h2v2h-2zM13.5 12h2v2h-2zM10.5 15h2v2h-2z'),
    'balon-air': P('M12 1.5c4.2 6.2 7.5 10.8 7.5 14.7a7.5 7.5 0 0 1-15 0C4.5 12.3 7.8 7.7 12 1.5zM9 16.5h6v2H9z'),
    'estafet-bendera': P('M5 1h2.5v22H5zM10 2h11l-3.2 4.2L21 10.5H10z'),
    'karung-estafet': P('M4.2 19.4 16.6 7l2.4 2.4L6.6 21.8zM2 8h5v2.5H2zM3 12.5h5V15H3z'),
    // ikon UI
    'play': P('M7 3.5 20 12 7 20.5z'),
    'pause': P('M5.5 3.5h4.5v17H5.5zM14 3.5h4.5v17H14z'),
    'lap': P('M5 2h2.5v20H5zM10 3h11v4.5H10zM10 9.5h11V14H10z'),
    'reset': '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5a7 7 0 1 1-6.3 4" fill="none" stroke="currentColor" stroke-width="3"/><path fill="currentColor" d="M2 3h7v7H7V6.8A9 9 0 1 0 21 12h-2.6A6.4 6.4 0 1 1 12 5.6V3z"/></svg>',
    'copy': P('M9 9h12v12H9zM3 3h12v3H6v9H3z'),
    'download': P('M11 2h2v10h3.5L12 17.5 7.5 12H11zM3 19h18v3H3z'),
    'trash': P('M6 7h12l-1.2 14H7.2zM3.5 3.5h17V7h-17zM9 3.5V1.5h6v2z'),
    'check': P('M10 15.2 4.8 10l2.1-2.1 3.1 3.1 8.1-8.1 2.1 2.1z'),
    'star': P('M12 1.5 14.7 8l7.3.6-5.5 4.8 1.7 7.1-6.2-3.7-6.2 3.7 1.7-7.1L2 8.6 9.3 8z'),
    'plus': P('M10.5 3.5h3V10.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z'),
    'minus': P('M3 10.5h18v3H3z'),
    'x': P('M5.3 4.7 12 11.4l6.7-6.7 1.4 1.4-6.7 6.7 6.7 6.7-1.4 1.4-6.7-6.7-6.7 6.7-1.4-1.4 6.7-6.7-6.7-6.7z'),
  };

  const LOMBA = [
    { id: 'balap-karung', nama: 'Balap Karung', kat: 'Individu', ukur: 'tercepat', desc: 'Lompat secepatnya. Karung melorot di tengah jalan? Tanggung sendiri.' },
    { id: 'panjat-pinang', nama: 'Panjat Pinang', kat: 'Tim', ukur: 'tercepat', desc: 'Satu tim, satu pinang licin, hadiah menanti di pucuk.' },
    { id: 'makan-kerupuk', nama: 'Makan Kerupuk', kat: 'Individu', ukur: 'tercepat', desc: 'Kerupuk digantung, tangan di belakang. Habiskan sampai remah terakhir.' },
    { id: 'tarik-tambang', nama: 'Tarik Tambang', kat: 'Tim', ukur: 'skor', desc: 'Tiga ronde. Tarik sampai garis lawan lewat batas.' },
    { id: 'sendok-kelereng', nama: 'Sendok Kelereng', kat: 'Individu', ukur: 'tercepat', desc: 'Kelereng di sendok, sendok digigit. Jatuh? Balik ke garis.' },
    { id: 'paku-botol', nama: 'Paku Masuk Botol', kat: 'Individu', ukur: 'tercepat', desc: 'Paku diikat di pinggang. Masukkan ke botol tanpa bantuan tangan.' },
    { id: 'sepeda-lambat', nama: 'Sepeda Lambat', kat: 'Individu', ukur: 'terlama', desc: 'Lomba paling sabar: paling lambat sampai garis tanpa turun, menang.' },
    { id: 'tangkap-belut', nama: 'Tangkap Belut', kat: 'Individu', ukur: 'tercepat', desc: 'Belut licin di ember. Tangkap, masukkan ke botol. Jangan sampai lepas.' },
    { id: 'gebuk-bantal', nama: 'Gebuk Bantal', kat: 'Individu', ukur: 'skor', desc: 'Duduk di bambu atas kolam. Gebuk sampai lawan nyemplung.' },
    { id: 'estafet-sarung', nama: 'Estafet Sarung', kat: 'Tim', ukur: 'tercepat', desc: 'Lari pakai sarung, oper ke teman. Sarung melorot = diskualifikasi.' },
    { id: 'joget-balon', nama: 'Joget Balon', kat: 'Berpasangan', ukur: 'terlama', desc: 'Balon dijepit berdua, joget sampai lagu berhenti. Pecah = gugur.' },
    { id: 'bakiak-panjang', nama: 'Bakiak Panjang', kat: 'Tim', ukur: 'tercepat', desc: 'Satu bakiak panjang, empat kaki. Kompak, atau jatuh bareng-bareng.' },
    { id: 'hula-hoop', nama: 'Hula Hoop', kat: 'Individu', ukur: 'terlama', desc: 'Putar terus. Berhenti berputar = waktu berhenti dicatat.' },
    { id: 'koin-semangka', nama: 'Gigit Koin Semangka', kat: 'Individu', ukur: 'tercepat', desc: 'Koin ditanam di semangka berminyak. Gigit sampai dapat, tangan dilarang.' },
    { id: 'balon-air', nama: 'Pecah Balon Air', kat: 'Individu', ukur: 'skor', desc: 'Lempar balon air ke ember pasangan. Pecah di jalan = nol.' },
    { id: 'estafet-bendera', nama: 'Estafet Bendera', kat: 'Tim', ukur: 'tercepat', desc: 'Lari bawa bendera merah putih, kibarkan di tiap pos.' },
    { id: 'karung-estafet', nama: 'Karung Estafet', kat: 'Tim', ukur: 'tercepat', desc: 'Balap karung versi tim: empat orang, empat karung, satu garis finish.' },
  ];

  // Data contoh (jelas berlabel CONTOH, bisa dihapus sekali klik). Bukan data nyata.
  const CONTOH = {
    'balap-karung': [
      { nama: 'Dedi Kurniawan', kontingen: 'RT 01', nilai: 12.45 },
      { nama: 'Sari Puspita', kontingen: 'RT 03', nilai: 13.02 },
      { nama: 'Budi Santoso', kontingen: 'RT 02', nilai: 14.88 },
    ],
    'makan-kerupuk': [
      { nama: 'Agus Wijaya', kontingen: 'RT 04', nilai: 21.30 },
      { nama: 'Rina Marlina', kontingen: 'RT 01', nilai: 24.15 },
    ],
    'sepeda-lambat': [
      { nama: 'Hendra Gunawan', kontingen: 'RT 05', nilai: 95.30 },
      { nama: 'Yuni Astuti', kontingen: 'RT 02', nilai: 88.12 },
    ],
    'tarik-tambang': [
      { nama: 'Tim RT 02', kontingen: 'RT 02', nilai: 2 },
      { nama: 'Tim RT 05', kontingen: 'RT 05', nilai: 1 },
    ],
  };

  // Posisi stasiun di peta arena (world 1400x800), disebar manual biar tidak bertumpuk.
  const STASIUN = [
    [120, 140], [330, 90], [560, 130], [790, 90], [1020, 140], [1230, 110],
    [200, 330], [450, 300], [700, 340], [950, 300], [1180, 340],
    [150, 560], [400, 620], [650, 560], [900, 620], [1130, 560], [1300, 660],
  ];

  window.VL = window.VL || {};
  window.VL.ICONS = ICONS;
  window.VL.LOMBA = LOMBA;
  window.VL.CONTOH = CONTOH;
  window.VL.STASIUN = STASIUN;
  window.VL.byId = id => LOMBA.find(l => l.id === id);
})();
