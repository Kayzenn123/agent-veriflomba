/* VerifLomba — terminal interaktif meja juri: parser perintah + log */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const history = [];
  let hi = -1;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function log(html, cls) {
    const logEl = $('term-log');
    const line = document.createElement('div');
    line.className = 'tline' + (cls ? ' ' + cls : '');
    line.innerHTML = html; // html internal (bukan input user) — input user selalu lewat esc()
    logEl.appendChild(line);
    while (logEl.children.length > 120) logEl.removeChild(logEl.firstChild);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function ok(msg) { log('<span class="tok-ok">SAH</span> ' + msg, 'ok'); }
  function err(msg) { log('<span class="tok-err">!?</span> ' + msg, 'err'); }

  const CMDS = {
    bantuan() {
      log('perintah juri: <b>mulai</b> · <b>jeda</b> · <b>lanjut</b> · <b>reset</b> · <b>lap</b> · <b>lomba [nama]</b> · <b>skor</b> · <b>salin</b> · <b>merdeka</b> · <b>bersih</b>');
      log('kibor: <b>spasi</b>=mulai/jeda · <b>L</b>=lap · <b>R</b>=reset (di luar kolom ketik)');
    },
    mulai() { window.VL.sw.mulai() ? ok('stopwatch jalan. jangan kedip.') : err('stopwatch sudah jalan, sabar.'); },
    jeda() { window.VL.sw.jeda() ? ok('dijeda di <b>' + window.VL.sw.fmt(window.VL.sw.elapsed) + '</b>.') : err('belum jalan kok dijeda.'); },
    lanjut() { CMDS.mulai(); },
    reset() { window.VL.sw.reset(); ok('stopwatch nol lagi. lapangan bersih.'); },
    lap() {
      const t = window.VL.sw.lap();
      t === null ? err('stopwatch belum jalan, lap apanya?') : ok('putaran ' + window.VL.sw.laps.length + ': <b>' + window.VL.sw.fmt(t) + '</b>');
    },
    lomba(args) {
      const q = args.trim().toLowerCase();
      if (!q) {
        log(window.VL.LOMBA.map(l => '· ' + esc(l.nama)).join('<br>'));
        return;
      }
      const hit = window.VL.LOMBA.find(l => l.id === q || l.nama.toLowerCase().includes(q));
      hit ? (window.VL.store.setLomba(hit.id), ok('lomba aktif: <b>' + esc(hit.nama) + '</b>.')) : err('tidak ada lomba bernama "' + esc(args.trim()) + '". coba <b>lomba</b> saja untuk daftar.');
    },
    skor() {
      const id = window.VL.store.state.lombaAktif, l = window.VL.byId(id);
      const top = window.VL.board.top3(id);
      if (!top.length) { err('belum ada catatan untuk ' + esc(l.nama) + '.'); return; }
      log('<b>' + esc(l.nama).toUpperCase() + '</b><br>' + top.map((r, i) => (i + 1) + '. ' + esc(r.nama) + ' — ' + esc(window.VL.board.fmtNilai(l, r.nilai))).join('<br>'));
      document.getElementById('skor').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    salin() { window.VL.exp.salinWA(); },
    merdeka() {
      log('<pre class="ascii"> __  __ _____ ____  ____  _____ _  __    _    \n|  \\/  | ____|  _ \\|  _ \\| ____| |/ /   / \\   \n| |\\/| |  _| | |_) | | | |  _| | \' /   / _ \\  \n| |  | | |___|  _ <| |_| | |___| . \\  / ___ \\ \n|_|  |_|_____|_| \\_\\____/|_____|_|\\_\\/_/   \\_\\</pre>', 'merdeka');
      ok('MERDEKA! pita pengumuman ikut meriah 10 detik.');
      window.VL.motion && window.VL.motion.merdekaMode();
    },
    bersih() { $('term-log').innerHTML = ''; },
    'hapus-contoh'() {
      if (!window.VL.store.state.adaContoh) { err('data contoh sudah tidak ada.'); return; }
      window.VL.store.hapusContoh();
      window.VL.app.renderAll();
      ok('data contoh dibuang. papan skor kini murni catatanmu.');
    },
  };

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    log('<span class="prompt-echo">juri@lapangan:~$</span> ' + esc(cmd), 'echo');
    history.push(cmd); hi = history.length;
    const sp = cmd.indexOf(' ');
    const name = (sp < 0 ? cmd : cmd.slice(0, sp)).toLowerCase();
    const args = sp < 0 ? '' : cmd.slice(sp + 1);
    if (CMDS[name]) { try { CMDS[name](args); } catch (e) { err('perintah gagal: ' + esc(e.message)); } }
    else err('"' + esc(name) + '" bukan perintah juri. ketik <b>bantuan</b>. jangan ngarang.');
  }

  function boot() {
    const input = $('term-input');
    $('term-form').addEventListener('submit', e => {
      e.preventDefault();
      run(input.value);
      input.value = '';
      input.focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = history[hi] || ''; } }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < history.length - 1) { hi++; input.value = history[hi]; } else { hi = history.length; input.value = ''; } }
    });
    // sapaan pembuka Pak Juri
    const l = window.VL.byId(window.VL.store.state.lombaAktif);
    log('meja juri <b>veriflomba</b> siap. 17 lomba, 1 stopwatch, 0 alasan telat.');
    log('lomba aktif: <b>' + esc(l.nama) + '</b>. ketik <b>bantuan</b> kalau bingung.');
    if (window.VL.store.corrupt) log('data tersimpan kemarin rusak, juri buatkan buku baru. maaf ya.', 'err');
    if (window.VL.store.state.adaContoh) log('ada <b>data contoh</b> di papan skor biar tidak sepi. hapus dengan <b>hapus-contoh</b>.');
  }

  window.VL.term = { log, ok, err, run, boot };
})();
