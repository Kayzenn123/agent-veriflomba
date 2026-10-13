/* VerifLomba — bootstrap + render orkestrasi */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);

  window.VL.icon = n => window.VL.ICONS[n] || '';

  function renderLaps() {
    const ol = $('laps');
    const laps = window.VL.sw.laps;
    $('lap-count').textContent = laps.length ? laps.length + ' putaran' : 'belum ada putaran';
    ol.innerHTML = '';
    laps.forEach((t, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<span>Putaran ' + (i + 1) + '</span><b>' + window.VL.sw.fmt(t) + '</b>';
      ol.appendChild(li);
    });
  }

  function onLombaChange(id) {
    window.VL.motion.blobSplash(() => {
      window.VL.board.renderAll();
      window.VL.arena.draw();
      window.VL.exp.refreshPreview();
      document.getElementById('skor').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function bindControls() {
    // isi awal tombol (ikon dari JS agar konsisten)
    $('btn-mulai').innerHTML = window.VL.icon('play') + '<span>Mulai</span>';
    $('btn-lap').innerHTML = window.VL.icon('lap') + '<span>Lap</span>';
    $('btn-reset').innerHTML = window.VL.icon('reset') + '<span>Reset</span>';
    $('btn-mulai').addEventListener('click', function () {
      const aksi = this.dataset.aksi || 'mulai';
      if (aksi === 'jeda') { window.VL.sw.jeda(); window.VL.term.log('dijeda di <b>' + window.VL.sw.fmt(window.VL.sw.elapsed) + '</b>.'); }
      else { window.VL.sw.mulai() ? window.VL.term.log('stopwatch <b>jalan</b>.') : null; }
    });
    $('btn-lap').addEventListener('click', () => {
      const t = window.VL.sw.lap();
      t === null ? window.VL.term.err('stopwatch belum jalan, lap apanya?') : window.VL.term.ok('putaran ' + window.VL.sw.laps.length + ': <b>' + window.VL.sw.fmt(t) + '</b>');
    });
    $('btn-reset').addEventListener('click', () => { window.VL.sw.reset(); window.VL.term.log('stopwatch nol lagi.'); });

    // kibor global: spasi/L/R (di luar input)
    addEventListener('keydown', e => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      if (e.code === 'Space') { e.preventDefault(); $('btn-mulai').click(); }
      if (e.key === 'l' || e.key === 'L') $('btn-lap').click();
      if (e.key === 'r' || e.key === 'R') $('btn-reset').click();
    });

    // pause animasi saat tab tersembunyi
    document.addEventListener('visibilitychange', () => {
      document.body.classList.toggle('tab-hidden', document.hidden);
    });
  }

  function renderAll() {
    window.VL.board.renderAll();
    window.VL.arena.draw();
    window.VL.exp.refreshPreview();
    renderLaps();
  }

  function boot() {
    window.VL.motion.detectLite();
    window.VL.motion.bindGerakToggle();
    window.VL.term.boot();
    window.VL.board.bindForm();
    window.VL.arena.bind();
    window.VL.motion.buildMarquee();
    window.VL.motion.buildOutlineFill();
    window.VL.exp.bind();
    bindControls();
    renderAll();
    window.VL.motion.fpsWatch();
  }

  window.VL.app = { boot, renderAll, renderLaps, onLombaChange };
  document.addEventListener('DOMContentLoaded', boot);
})();
