/* VerifLomba — D: drag inertia flick pada kartu hasil (geser kiri = hapus) */
(function () {
  'use strict';
  const SNAP = 96; // px untuk reveal tombol hapus

  function bind(list) {
    list.querySelectorAll('.hasil-card').forEach(card => {
      if (card.dataset.flick) return;
      card.dataset.flick = '1';
      const isi = card.querySelector('.hasil-isi');
      let sx = 0, dx = 0, dragging = false, pid = null, lastX = 0, lastT = 0, vx = 0, open = false;

      card.addEventListener('pointerdown', e => {
        if (e.target.closest('.hasil-hapus')) return;
        dragging = true; pid = e.pointerId; sx = lastX = e.clientX; lastT = performance.now(); vx = 0; dx = open ? -SNAP : 0;
        card.setPointerCapture(pid);
      });
      card.addEventListener('pointermove', e => {
        if (!dragging || e.pointerId !== pid) return;
        const now = performance.now();
        const nx = e.clientX;
        vx = (nx - lastX) / Math.max(now - lastT, 1); // px/ms
        lastX = nx; lastT = now;
        dx = Math.min(30, Math.max(-SNAP - 40, (open ? -SNAP : 0) + (nx - sx)));
        isi.style.transform = 'translateX(' + dx + 'px)';
      });
      const end = e => {
        if (!dragging || (e.pointerId !== undefined && e.pointerId !== pid)) return;
        dragging = false;
        const lite = document.body.classList.contains('lite') || document.body.classList.contains('no-gerak');
        let target = 0;
        if (!lite && vx < -0.45) target = -SNAP;          // flick kiri cepat
        else if (!lite && vx > 0.45) target = 0;           // flick kanan = tutup
        else target = dx < -SNAP / 2 ? -SNAP : 0;
        open = target !== 0;
        if (lite) { isi.style.transform = 'translateX(' + target + 'px)'; return; }
        // inertia: lanjutkan sedikit sesuai kecepatan lalu snap
        const extra = Math.max(-60, Math.min(60, vx * 90));
        const peak = Math.min(30, Math.max(-SNAP - 40, dx + extra));
        isi.style.transition = 'transform 90ms ease-out';
        isi.style.transform = 'translateX(' + peak + 'px)';
        setTimeout(() => {
          isi.style.transition = 'transform 220ms cubic-bezier(.2,.9,.25,1.2)';
          isi.style.transform = 'translateX(' + target + 'px)';
          setTimeout(() => { isi.style.transition = ''; }, 240);
        }, 95);
      };
      card.addEventListener('pointerup', end);
      card.addEventListener('pointercancel', end);
    });
  }

  window.VL.flick = { bind };
})();
