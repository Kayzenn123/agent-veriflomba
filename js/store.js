/* VerifLomba — store: state + localStorage berversi + validasi + deep-link */
(function () {
  'use strict';
  const KEY = 'veriflomba.v1';

  function defaultState() {
    const hasil = {};
    Object.entries(window.VL.CONTOH).forEach(([id, arr]) => {
      hasil[id] = arr.map((r, i) => ({
        id: 'c-' + id + '-' + i, nama: r.nama, kontingen: r.kontingen,
        nilai: r.nilai, contoh: true, ts: Date.now(),
      }));
    });
    return { v: 1, lombaAktif: 'balap-karung', hasil, adaContoh: true };
  }

  function validHasil(arr) {
    if (!Array.isArray(arr)) return false;
    return arr.every(r => r && typeof r.nama === 'string' && typeof r.nilai === 'number' && isFinite(r.nilai));
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { state: defaultState(), fresh: true };
      const s = JSON.parse(raw);
      if (!s || s.v !== 1 || typeof s.hasil !== 'object' || !window.VL.byId(s.lombaAktif)) throw new Error('skema');
      Object.keys(s.hasil).forEach(k => { if (!validHasil(s.hasil[k])) throw new Error('hasil rusak: ' + k); });
      return { state: s, fresh: false };
    } catch (e) {
      try { localStorage.removeItem(KEY); } catch (_) {}
      return { state: defaultState(), fresh: true, corrupt: true };
    }
  }

  const { state, fresh, corrupt } = load();
  window.VL.store = {
    state, fresh, corrupt,
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(state)); }
      catch (e) { window.VL.term && window.VL.term.log('penyimpanan penuh, data sesi ini tidak tersimpan.', 'err'); }
    },
    hasil(id) { return state.hasil[id] || []; },
    tambahHasil(id, rec) {
      const arr = state.hasil[id] || (state.hasil[id] = []);
      arr.push(Object.assign({ id: 'h-' + Date.now().toString(36) + Math.floor(Math.random() * 999), ts: Date.now() }, rec));
      this.save();
    },
    hapusHasil(id, rid) {
      state.hasil[id] = (state.hasil[id] || []).filter(r => r.id !== rid);
      this.save();
    },
    hapusContoh() {
      Object.keys(state.hasil).forEach(k => { state.hasil[k] = state.hasil[k].filter(r => !r.contoh); });
      state.adaContoh = false;
      this.save();
    },
    setLomba(id, silent) {
      if (!window.VL.byId(id)) return false;
      state.lombaAktif = id;
      this.save();
      try {
        const u = new URL(location.href);
        u.searchParams.set('lomba', id);
        history.replaceState(null, '', u);
      } catch (_) {}
      if (!silent) window.VL.app && window.VL.app.onLombaChange(id);
      return true;
    },
    reset() {
      const s = defaultState();
      state.lombaAktif = s.lombaAktif; state.hasil = s.hasil; state.adaContoh = s.adaContoh;
      this.save();
    },
  };

  // Deep-link ?lomba= di awal (ikut disimpan agar jadi sesi aktif)
  try {
    const q = new URLSearchParams(location.search).get('lomba');
    if (q && window.VL.byId(q) && q !== state.lombaAktif) {
      state.lombaAktif = q;
      window.VL.store.save();
    }
  } catch (_) {}
})();
