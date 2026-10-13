/* VerifLomba — stopwatch presisi centisecond (rAF), mesin status SIAP/JALAN/JEDA */
(function () {
  'use strict';
  const S = { elapsed: 0, running: false, t0: 0, raf: 0, laps: [] };
  const $ = id => document.getElementById(id);

  function fmt(ms) {
    const cs = Math.floor(ms / 10);
    const m = Math.floor(cs / 6000), s = Math.floor((cs % 6000) / 100), c = cs % 100;
    const p2 = n => String(n).padStart(2, '0');
    return p2(m) + ':' + p2(s) + '.' + p2(c);
  }
  function fmtDetik(detik) { return fmt(detik * 1000); }

  function paint() {
    $('sw-display').textContent = fmt(S.elapsed);
  }
  function status(st, label) {
    const el = $('sw-status');
    el.textContent = label;
    el.dataset.st = st;
  }

  function tick() {
    if (!S.running) return;
    S.elapsed = performance.now() - S.t0;
    paint();
    S.raf = requestAnimationFrame(tick);
  }

  const api = {
    fmt, fmtDetik,
    get elapsed() { return S.elapsed; },
    get running() { return S.running; },
    get laps() { return S.laps.slice(); },
    mulai() {
      if (S.running) return false;
      S.t0 = performance.now() - S.elapsed;
      S.running = true;
      status('jalan', 'JALAN');
      $('btn-mulai').innerHTML = window.VL.icon('pause') + '<span>Jeda</span>';
      $('btn-mulai').dataset.aksi = 'jeda';
      tick();
      return true;
    },
    jeda() {
      if (!S.running) return false;
      S.running = false;
      cancelAnimationFrame(S.raf);
      S.elapsed = performance.now() - S.t0;
      paint();
      status('jeda', 'JEDA');
      $('btn-mulai').innerHTML = window.VL.icon('play') + '<span>Lanjut</span>';
      $('btn-mulai').dataset.aksi = 'mulai';
      return true;
    },
    toggle() { return S.running ? this.jeda() : this.mulai(); },
    reset() {
      S.running = false;
      cancelAnimationFrame(S.raf);
      S.elapsed = 0; S.laps = [];
      paint();
      status('siap', 'SIAP');
      $('btn-mulai').innerHTML = window.VL.icon('play') + '<span>Mulai</span>';
      $('btn-mulai').dataset.aksi = 'mulai';
      window.VL.app && window.VL.app.renderLaps();
    },
    lap() {
      if (!S.running && S.elapsed === 0) return null;
      const t = S.running ? performance.now() - S.t0 : S.elapsed;
      S.laps.push(t);
      window.VL.app && window.VL.app.renderLaps();
      return t;
    },
  };
  window.VL.sw = api;
})();
