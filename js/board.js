/* VerifLomba — papan skor: chips lomba, podium, kartu hasil, form catat */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = n => window.VL.ICONS[n] || '';

  function sorted(id) {
    const l = window.VL.byId(id);
    const arr = window.VL.store.hasil(id).slice();
    const key = r => r.nilai;
    if (l.ukur === 'tercepat') arr.sort((a, b) => key(a) - key(b));
    else arr.sort((a, b) => key(b) - key(a)); // terlama & skor: besar menang
    return arr;
  }
  function fmtNilai(l, nilai) {
    if (l.ukur === 'skor') return nilai + ' poin';
    return window.VL.sw.fmtDetik(nilai).replace('.', ',');
  }
  function top3(id) { return sorted(id).slice(0, 3); }

  function renderChips() {
    const wrap = $('lomba-chips');
    const aktif = window.VL.store.state.lombaAktif;
    wrap.innerHTML = '';
    window.VL.LOMBA.forEach(l => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (l.id === aktif ? ' aktif' : '');
      b.setAttribute('aria-pressed', l.id === aktif ? 'true' : 'false');
      b.innerHTML = '<span class="chip-ikon">' + icon(l.id) + '</span><span>' + esc(l.nama) + '</span>';
      b.addEventListener('click', () => window.VL.store.setLomba(l.id));
      wrap.appendChild(b);
    });
    const l = window.VL.byId(aktif);
    $('lomba-chip').innerHTML = '<span class="chip-ikon">' + icon(l.id) + '</span> ' + esc(l.nama);
    $('sw-lomba-label').textContent = l.nama.toLowerCase();
    $('skor-judul-lomba').textContent = l.nama;
    $('skor-desc').textContent = l.desc + ' · ' + l.kat + ' · ' + (l.ukur === 'skor' ? 'skor tertinggi menang' : l.ukur === 'terlama' ? 'waktu terlama menang' : 'waktu tercepat menang') + '.';
    $('f-satuan').textContent = l.ukur === 'skor' ? 'poin' : 'detik';
  }

  function renderPodium() {
    const id = window.VL.store.state.lombaAktif, l = window.VL.byId(id);
    const t = top3(id);
    const pod = $('podium');
    if (!t.length) {
      pod.innerHTML = '<p class="empty">Belum ada catatan untuk ' + esc(l.nama) + '. Jadilah yang pertama mencatat sejarah — atau setidaknya mencatat waktu.</p>';
      return;
    }
    pod.innerHTML = '';
    const medals = ['1', '2', '3'];
    t.forEach((r, i) => {
      const d = document.createElement('div');
      d.className = 'podium-kartu rank-' + (i + 1);
      d.innerHTML = '<div class="rank" aria-hidden="true">' + medals[i] + '</div>' +
        '<div class="podium-nama">' + esc(r.nama) + (r.contoh ? ' <span class="tag-contoh">contoh</span>' : '') + '</div>' +
        '<div class="podium-kontingen">' + esc(r.kontingen || '—') + '</div>' +
        '<div class="podium-nilai">' + esc(fmtNilai(l, r.nilai)) + '</div>';
      pod.appendChild(d);
    });
  }

  function renderHasil() {
    const id = window.VL.store.state.lombaAktif, l = window.VL.byId(id);
    const list = $('hasil-list');
    const arr = sorted(id);
    $('hasil-count').textContent = arr.length ? arr.length + ' catatan' : 'kosong';
    if (!arr.length) {
      list.innerHTML = '<p class="empty">Belum ada catatan. Lapangan masih sepi — kayak sebelum lomba dimulai.</p>';
      return;
    }
    list.innerHTML = '';
    arr.forEach(r => {
      const card = document.createElement('div');
      card.className = 'hasil-card';
      card.dataset.rid = r.id;
      card.innerHTML =
        '<button type="button" class="hasil-hapus" aria-label="Hapus catatan ' + esc(r.nama) + '">' + icon('trash') + '<span>Hapus</span></button>' +
        '<div class="hasil-isi">' +
        '<div><div class="hasil-nama">' + esc(r.nama) + (r.contoh ? ' <span class="tag-contoh">contoh</span>' : '') + '</div>' +
        '<div class="hasil-meta">' + esc(r.kontingen || '—') + ' · ' + new Date(r.ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + '</div></div>' +
        '<div class="hasil-nilai">' + esc(fmtNilai(l, r.nilai)) + '</div>' +
        '</div>';
      card.querySelector('.hasil-hapus').addEventListener('click', () => {
        window.VL.store.hapusHasil(id, r.id);
        window.VL.term.ok('catatan ' + esc(r.nama) + ' dibuang. tidak ada yang abadi kecuali kenangan.');
        renderAll();
      });
      list.appendChild(card);
    });
    window.VL.flick && window.VL.flick.bind(list);
  }

  function renderContohBar() {
    const bar = $('contoh-bar');
    if (window.VL.store.state.adaContoh) {
      bar.hidden = false;
      bar.innerHTML = '<span>Menampilkan <b>data contoh</b> (bukan hasil asli).</span><button type="button" id="btn-hapus-contoh">Buang contoh</button>';
      $('btn-hapus-contoh').addEventListener('click', () => {
        window.VL.store.hapusContoh();
        window.VL.term.ok('data contoh dibuang. papan skor kini murni catatanmu.');
        renderAll();
      });
    } else bar.hidden = true;
  }

  function renderAll() { renderChips(); renderPodium(); renderHasil(); renderContohBar(); }

  function bindForm() {
    const form = $('hasil-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const errEl = $('form-error');
      const nama = $('f-nama').value.trim();
      const kontingen = $('f-kontingen').value.trim();
      const nilaiRaw = $('f-nilai').value.trim().replace(',', '.');
      const nilai = parseFloat(nilaiRaw);
      const id = window.VL.store.state.lombaAktif, l = window.VL.byId(id);
      const fail = m => { errEl.textContent = m; errEl.hidden = false; };
      errEl.hidden = true;
      if (!nama) return fail('Namanya diisi dulu, jangan kayak peserta yang kabur pas dipanggil.');
      if (nama.length > 60) return fail('Namanya kepanjangan, singkat saja kayak nama di papan RT.');
      if (!isFinite(nilai) || nilai <= 0) return fail(l.ukur === 'skor' ? 'Skornya angka positif, bukan nilai ulangan yang dikarang.' : 'Waktunya angka detik positif, misal 12,45.');
      if (nilai > 86400) return fail('Kebangetan, lombanya belum selama itu.');
      window.VL.store.tambahHasil(id, { nama, kontingen: kontingen || '—', nilai, contoh: false });
      $('f-nama').value = ''; $('f-nilai').value = '';
      window.VL.term.ok('<b>' + esc(nama) + '</b> tercatat: ' + esc(fmtNilai(l, nilai)) + '. SAH!');
      renderAll();
      window.VL.motion && window.VL.motion.stamp();
    });
    $('btn-pakai').addEventListener('click', () => {
      const t = window.VL.sw.elapsed;
      if (t <= 0) { window.VL.term.err('stopwatch masih nol. mulai dulu, baru pakai waktunya.'); return; }
      $('f-nilai').value = (t / 1000).toFixed(2).replace('.', ',');
      $('f-nilai').focus();
      window.VL.term.ok('waktu ' + window.VL.sw.fmt(t) + ' dipindah ke formulir. tinggal isi nama.');
    });
  }

  window.VL.board = { renderAll, renderChips, renderPodium, renderHasil, sorted, top3, fmtNilai, bindForm };
})();
