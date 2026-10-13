/* VerifLomba — gerak B (marquee 2 band + velocity skew), C (outline-fill), E (blob morph) */
(function () {
  'use strict';
  const reducedOS = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gerakNyala = !reducedOS;
  let lite = false;

  function detectLite() {
    try {
      const hc = navigator.hardwareConcurrency || 8;
      const dm = navigator.deviceMemory || 8;
      const sd = navigator.connection && navigator.connection.saveData;
      lite = hc <= 4 || dm <= 4 || !!sd;
    } catch (_) { lite = false; }
    if (lite) document.body.classList.add('lite');
  }

  /* B — marquee: 2 band, arah berlawanan, skew mengikuti velocity scroll */
  function buildMarquee() {
    const items1 = ['PENGUMUMAN', 'LOMBA 17-AN DIMULAI', 'DAFTAR KE MEJA JURI', 'JANGAN PROTES KE JURI'];
    const items2 = ['STOPWATCH JURI', 'CATAT WAKTU', 'SAHKAN HASIL', 'MERDEKA'];
    const star = window.VL.ICONS.star;
    const band = (el, items) => {
      const half = items.map(t => '<span class="mq-item">' + star + '<span>' + t + '</span></span>').join('');
      el.innerHTML = '<div class="mq-half">' + half + '</div><div class="mq-half" aria-hidden="true">' + half + '</div>';
    };
    band(document.getElementById('mq-track-1'), items1);
    band(document.getElementById('mq-track-2'), items2);

    // lebar paruh band untuk keyframes px (lebih murah dari translateX(-50%))
    const setW = () => {
      ['mq-track-1', 'mq-track-2'].forEach(id => {
        const t = document.getElementById(id);
        t.style.setProperty('--mq-w', (t.scrollWidth / 2) + 'px');
      });
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setW); else setW();
    let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(setW, 300); });

    // velocity skew — diterapkan ke WRAPPER (track sedang dianimasikan CSS, inline style kalah)
    const wraps = [document.querySelector('#mq-track-1').closest('.marquee'), document.querySelector('#mq-track-2').closest('.marquee')];
    let skew = 0, raf = 0, py = scrollY;
    function loop() {
      raf = 0;
      const target = Math.max(-12, Math.min(12, (scrollY - py) * 0.5));
      py = scrollY;
      skew += (target - skew) * 0.12;
      wraps.forEach(w => { w.style.transform = 'skewX(' + (-skew).toFixed(2) + 'deg)'; });
      if (gerakNyala && !lite && Math.abs(skew) > 0.05) raf = requestAnimationFrame(loop);
      else wraps.forEach(w => { w.style.transform = ''; });
    }
    addEventListener('scroll', () => {
      if (gerakNyala && !lite && !raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.getElementById('mq-pause').addEventListener('click', function () {
      const paused = document.body.classList.toggle('mq-paused');
      this.setAttribute('aria-pressed', paused ? 'true' : 'false');
      this.querySelector('span').textContent = paused ? 'Jalankan pita' : 'Jedakan pita';
    });
  }

  /* C — outline terisi saat scroll (scrub vanilla, tanpa ScrollTrigger) */
  let updateOutline = null;
  function buildOutlineFill() {
    document.querySelectorAll('.of').forEach(el => {
      const txt = el.dataset.text;
      el.innerHTML = '<span class="of-outline" aria-hidden="true">' + txt + '</span>' +
        '<span class="of-fill" aria-hidden="true">' + txt + '</span>' +
        '<span class="of-sr">' + txt + '</span>';
    });
    const heads = [...document.querySelectorAll('.of')].map(el => ({ el, fill: el.querySelector('.of-fill') }));
    if (!gerakNyala) { heads.forEach(h => { h.fill.style.transform = 'none'; }); return; }
    let ticking = false;
    updateOutline = () => {
      ticking = false;
      const vh = innerHeight;
      heads.forEach(({ el, fill }) => {
        const top = el.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.5)));
        fill.style.transform = 'translateX(' + (-102 + 102 * p).toFixed(2) + '%)';
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateOutline); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    updateOutline();
  }

  /* E — blob morph vanilla: cap basah saat ganti lomba */
  const BLOBS = [
    'M50 8C72 8 92 28 92 50C92 72 72 92 50 92C28 92 8 72 8 50C8 28 28 8 50 8Z',
    'M50 12C68 4 88 24 90 48C92 72 74 90 50 88C26 86 8 70 10 48C12 26 32 20 50 12Z',
    'M50 6C74 10 94 30 88 52C82 74 66 94 46 90C26 86 6 70 10 48C14 26 26 2 50 6Z',
  ];
  const blobNums = BLOBS.map(d => d.match(/-?\d+\.?\d*/g).map(Number));
  const blobTpl = BLOBS[0];
  function lerpPath(a, b, t) {
    let i = 0;
    return blobTpl.replace(/-?\d+\.?\d*/g, () => {
      const v = a[i] + (b[i] - a[i]) * t;
      i++;
      return (+v.toFixed(1)).toString();
    });
  }
  let blobBusy = false;
  function blobSplash(done) {
    const ov = document.getElementById('blob');
    if (!gerakNyala || lite || blobBusy) { done && done(); return; }
    blobBusy = true;
    const path = ov.querySelector('path');
    ov.hidden = false;
    const t0 = performance.now(), DUR = 800;
    const easeIn = t => t * t * t;
    (function frame(now) {
      const p = Math.min((now - t0) / DUR, 1);
      if (p < 0.55) {
        const q = easeIn(p / 0.55);
        ov.style.opacity = '1';
        ov.style.transform = 'scale(' + (0.15 + 2.45 * q).toFixed(3) + ')';
        path.setAttribute('d', lerpPath(blobNums[0], blobNums[1], q));
      } else {
        const q = (p - 0.55) / 0.45;
        ov.style.opacity = (1 - q).toFixed(2);
        path.setAttribute('d', lerpPath(blobNums[1], blobNums[2], q));
      }
      if (p < 1) requestAnimationFrame(frame);
      else { ov.hidden = true; ov.style.opacity = ''; ov.style.transform = ''; blobBusy = false; done && done(); }
    })(t0);
  }

  function stamp() {
    // stempel SAH kecil di dekat form (CSS animation, bukan JS berat)
    const s = document.getElementById('stamp');
    s.hidden = false;
    s.classList.remove('go');
    void s.offsetWidth;
    s.classList.add('go');
    clearTimeout(stamp.t);
    stamp.t = setTimeout(() => { s.hidden = true; }, 1400);
  }

  function merdekaMode() {
    document.body.classList.add('merdeka');
    setTimeout(() => document.body.classList.remove('merdeka'), 10000);
  }

  function bindGerakToggle() {
    const btn = document.getElementById('gerak-toggle');
    const paint = () => {
      btn.setAttribute('aria-pressed', gerakNyala ? 'true' : 'false');
      btn.querySelector('span').textContent = gerakNyala ? 'Gerak: Nyala' : 'Gerak: Mati';
      document.body.classList.toggle('no-gerak', !gerakNyala);
    };
    btn.addEventListener('click', () => {
      gerakNyala = !gerakNyala;
      paint();
      document.querySelectorAll('.of-fill').forEach(f => { f.style.transform = gerakNyala ? '' : 'none'; });
      if (gerakNyala && updateOutline) updateOutline();
    });
    gerakNyala = !reducedOS;
    paint();
    if (reducedOS) document.body.classList.add('no-gerak');
  }

  // FPS check sekali di awal (2 detik): bila <40 → lite. Tanpa loop abadi.
  function fpsWatch() {
    let frames = 0;
    const t0 = performance.now();
    (function loop() {
      frames++;
      if (performance.now() - t0 < 2000) { requestAnimationFrame(loop); return; }
      const fps = frames / ((performance.now() - t0) / 1000);
      if (fps < 40 && !lite) {
        lite = true;
        document.body.classList.add('lite');
        window.VL.term && window.VL.term.log('mode ringan aktif (FPS ' + Math.round(fps) + '). gerak disederhanakan.');
      }
    })();
  }

  window.VL.motion = {
    buildMarquee, buildOutlineFill, blobSplash, stamp, merdekaMode, bindGerakToggle, detectLite, fpsWatch,
    get gerakNyala() { return gerakNyala; },
    get lite() { return lite; },
  };
})();
