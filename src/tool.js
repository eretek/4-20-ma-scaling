/*! Eretek Online Araçlar #89 — 4–20 mA Sinyal Ölçekleme */
ERT.def('89', {
	run: function (v, c) {
		if (!(v.hi > v.lo) && !(v.hi < v.lo)) { throw c.fe('hi', 'range'); }
		var span = v.hi - v.lo, ma, pct, eng, msgs = [], u = v.unit ? ' ' + v.unit : '';
		if (v.mode === 'ma') { ma = v.val; pct = (ma - 4) / 16; eng = v.lo + pct * span; }
		else if (v.mode === 'eng') { eng = v.val; pct = (eng - v.lo) / span; ma = 4 + 16 * pct; }
		else {
			if (!(v.rawhi > v.rawlo)) { throw c.fe('rawhi', 'range'); }
			pct = (v.val - v.rawlo) / (v.rawhi - v.rawlo); ma = 4 + 16 * pct; eng = v.lo + pct * span;
		}
		var st = ma <= 3.6 ? 'failL' : (ma < 3.8 ? 'under' : (ma >= 21 ? 'failH' : (ma > 20.5 ? 'over' : (ma < 4 || ma > 20 ? 'ext' : 'ok'))));
		msgs.push([st === 'ok' ? 'ok' : (st === 'failL' || st === 'failH' ? 'err' : 'warn'), c.t('s_' + st)]);
		msgs.push(['info', c.t('ne43')]);
		var kv = [['mA', c.n(ma, 3) + ' mA'], [c.t('pct'), c.n(pct * 100, 2) + ' %'], [c.t('eng'), c.n(eng, 4) + u]];
		if (v.rawhi > v.rawlo) { kv.push([c.t('raw'), c.n(v.rawlo + pct * (v.rawhi - v.rawlo), 0)]); }
		return { big: v.mode === 'eng' ? c.n(ma, 3) + ' mA' : c.n(eng, 4) + u, kv: kv, msgs: msgs, x: { copy: kv.map(function (k) { return k[0] + ': ' + k[1]; }).join('\n') }, v: { ma: Math.round(ma * 1e4) / 1e4, pct: Math.round(pct * 1e6) / 1e4, eng: Math.round(eng * 1e4) / 1e4, status: st } };
	}
});
