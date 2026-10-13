/* VerifLomba — A: kamera. Peta arena canvas: drag pan + zoom scroll, 17 stasiun klik */
(function () {
  'use strict';
  const W = 1400, H = 800;
  let cv, ctx, view = { x: 0, y: 0, k: 1 };
  let drag = null, moved = false;

  function fit() {
    const r = cv.getBoundingClientRect();
    const k = Math.min(r.width / W, r.height / H);
    view.k = k; view.x = (r.width - W * k) / 2; view.y = (r.height - H * k) / 2;
  }

  function draw() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const r = cv.getBoundingClientRect();
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = getComputedStyle(document.documentElement);
    const bg = css.getPropertyValue('--bg').trim() || '#7398dc';
    const muted = css.getPropertyValue('--muted').trim() || '#232e42';
    const text = css.getPropertyValue('--text').trim() || '#060d1a';
    const pop = css.getPropertyValue('--pop').trim() || '#afd400';
    const accent = css.getPropertyValue('--accent').trim() || '#a060ff';
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.save();
    ctx.translate(view.x, view.y); ctx.scale(view.k, view.k);
    // lapangan
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillRect(40, 40, W - 80, H - 80);
    ctx.strokeStyle = text; ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    // grid
    ctx.strokeStyle = muted; ctx.globalAlpha = 0.25; ctx.lineWidth = 1;
    for (let x = 40; x <= W - 40; x += 80) { ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, H - 40); ctx.stroke(); }
    for (let y = 40; y <= H - 40; y += 80) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 40, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
    // garis tengah lapangan
    ctx.strokeStyle = text; ctx.lineWidth = 2; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.moveTo(W / 2, 40); ctx.lineTo(W / 2, H - 40); ctx.stroke();
    ctx.setLineDash([]);
    // stasiun
    const aktif = window.VL.store.state.lombaAktif;
    window.VL.LOMBA.forEach((l, i) => {
      const [sx, sy] = window.VL.STASIUN[i];
      const isA = l.id === aktif;
      ctx.beginPath(); ctx.arc(sx, sy, isA ? 26 : 20, 0, 7);
      ctx.fillStyle = isA ? pop : accent;
      ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = text; ctx.stroke();
      if (isA) { ctx.beginPath(); ctx.arc(sx, sy, 34, 0, 7); ctx.strokeStyle = pop; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.fillStyle = text;
      ctx.font = '700 22px Asul, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(i + 1).padStart(2, '0'), sx, sy + 8);
      ctx.font = '400 17px Asul, sans-serif';
      ctx.fillText(l.nama, sx, sy + (isA ? 52 : 46));
    });
    ctx.restore();
  }

  function toWorld(px, py) {
    const r = cv.getBoundingClientRect();
    return [(px - r.left - view.x) / view.k, (py - r.top - view.y) / view.k];
  }

  function hit(wx, wy) {
    for (let i = 0; i < window.VL.LOMBA.length; i++) {
      const [sx, sy] = window.VL.STASIUN[i];
      if (Math.hypot(wx - sx, wy - sy) < 34) return window.VL.LOMBA[i];
    }
    return null;
  }

  function zoomAt(f, cx, cy) {
    const r = cv.getBoundingClientRect();
    const [wx, wy] = toWorld(cx, cy);
    const nk = Math.min(2.6, Math.max(0.45, view.k * f));
    view.x = (cx - r.left) - wx * nk;
    view.y = (cy - r.top) - wy * nk;
    view.k = nk;
    draw();
  }

  function bind() {
    cv = document.getElementById('arena-canvas');
    ctx = cv.getContext('2d');
    fit(); draw();
    addEventListener('resize', () => { fit(); draw(); });

    cv.addEventListener('pointerdown', e => {
      drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
      moved = false;
      cv.setPointerCapture(e.pointerId);
    });
    cv.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      view.x = drag.vx + dx; view.y = drag.vy + dy;
      draw();
    });
    const up = e => {
      if (drag && !moved) {
        const [wx, wy] = toWorld(e.clientX, e.clientY);
        const l = hit(wx, wy);
        if (l) { window.VL.store.setLomba(l.id); window.VL.term.ok('pindah ke stasiun <b>' + l.nama + '</b>.'); }
      }
      drag = null;
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', () => { drag = null; });

    cv.addEventListener('wheel', e => {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    }, { passive: false });

    cv.addEventListener('dblclick', e => zoomAt(1.5, e.clientX, e.clientY));

    cv.addEventListener('keydown', e => {
      const step = 60;
      if (e.key === 'ArrowLeft') { view.x += step; draw(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { view.x -= step; draw(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { view.y += step; draw(); e.preventDefault(); }
      if (e.key === 'ArrowDown') { view.y -= step; draw(); e.preventDefault(); }
      if (e.key === '+' || e.key === '=') { const r = cv.getBoundingClientRect(); zoomAt(1.2, r.left + r.width / 2, r.top + r.height / 2); e.preventDefault(); }
      if (e.key === '-') { const r = cv.getBoundingClientRect(); zoomAt(1 / 1.2, r.left + r.width / 2, r.top + r.height / 2); e.preventDefault(); }
    });

    document.getElementById('zoom-in').addEventListener('click', () => { const r = cv.getBoundingClientRect(); zoomAt(1.3, r.left + r.width / 2, r.top + r.height / 2); });
    document.getElementById('zoom-out').addEventListener('click', () => { const r = cv.getBoundingClientRect(); zoomAt(1 / 1.3, r.left + r.width / 2, r.top + r.height / 2); });
    document.getElementById('zoom-reset').addEventListener('click', () => { fit(); draw(); });
  }

  window.VL.arena = { bind, draw, refit: () => { fit(); draw(); } };
})();
