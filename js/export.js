/* VerifLomba — ekspor: salin pengumuman WA, unduh JSON/CSV */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);

  function buildText() {
    const lines = ['PENGUMUMAN HASIL LOMBA 17-AN', 'Meja Juri VerifLomba', ''];
    window.VL.LOMBA.forEach(l => {
      const arr = window.VL.board.sorted(l.id);
      if (!arr.length) return;
      lines.push('★ ' + l.nama.toUpperCase() + ' (' + l.kat + ')');
      arr.slice(0, 3).forEach((r, i) => {
        lines.push((i + 1) + '. ' + r.nama + ' — ' + (r.kontingen || '—') + ' — ' + window.VL.board.fmtNilai(l, r.nilai).replace('.', ','));
      });
      lines.push('');
    });
    if (lines.length === 3) return null;
    lines.push('Dicatat dengan stopwatch juri. Protes? Ke panitia.');
    return lines.join('\n');
  }

  function flash(msg, okk) {
    const el = $('ekspor-status');
    el.textContent = msg;
    el.dataset.ok = okk ? '1' : '0';
    el.hidden = false;
    clearTimeout(flash.t);
    flash.t = setTimeout(() => { el.hidden = true; }, 4000);
  }

  function salinWA() {
    const txt = buildText();
    if (!txt) { window.VL.term.err('belum ada hasil yang bisa diumumkan. catat dulu, baru koar-koar.'); flash('Belum ada hasil.', false); return; }
    const done = () => { window.VL.term.ok('pengumuman disalin. tinggal tempel di grup WA RT.'); flash('Pengumuman disalin ke clipboard.', true); };
    const fail = () => {
      // fallback: tampilkan di preview agar bisa disalin manual
      $('wa-preview').textContent = txt;
      window.VL.term.err('clipboard ditolak browser. teks pengumuman ditampilkan di bawah, salin manual ya.');
      flash('Clipboard ditolak — salin manual dari pratinjau.', false);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fail);
    else fail();
  }

  function unduh(namaFile, mime, isi) {
    const blob = new Blob([isi], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = namaFile;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function asJSON() {
    const data = {};
    window.VL.LOMBA.forEach(l => {
      data[l.id] = { nama: l.nama, ukur: l.ukur, hasil: window.VL.board.sorted(l.id).map(r => ({ nama: r.nama, kontingen: r.kontingen, nilai: r.nilai, contoh: !!r.contoh })) };
    });
    return JSON.stringify({ app: 'veriflomba', v: 1, diekspor: new Date().toISOString(), data }, null, 2);
  }

  function asCSV() {
    const q = s => '"' + String(s).replace(/"/g, '""') + '"';
    const rows = [['lomba', 'nama', 'kontingen', 'nilai', 'satuan']];
    window.VL.LOMBA.forEach(l => {
      window.VL.board.sorted(l.id).forEach(r => {
        rows.push([l.nama, r.nama, r.kontingen || '', String(r.nilai).replace('.', ','), l.ukur === 'skor' ? 'poin' : 'detik']);
      });
    });
    return rows.map(r => r.map(q).join(',')).join('\n');
  }

  function bind() {
    $('btn-salin').addEventListener('click', salinWA);
    $('btn-json').addEventListener('click', () => { unduh('veriflomba-hasil.json', 'application/json', asJSON()); window.VL.term.ok('berkas JSON diunduh.'); });
    $('btn-csv').addEventListener('click', () => { unduh('veriflomba-hasil.csv', 'text/csv', asCSV()); window.VL.term.ok('berkas CSV diunduh. buka di spreadsheet, banggakan RT-mu.'); });
    const txt = buildText();
    $('wa-preview').textContent = txt || 'Belum ada hasil — pratinjau muncul setelah ada catatan.';
  }

  function refreshPreview() {
    const txt = buildText();
    $('wa-preview').textContent = txt || 'Belum ada hasil — pratinjau muncul setelah ada catatan.';
  }

  window.VL.exp = { salinWA, bind, refreshPreview, buildText };
})();
