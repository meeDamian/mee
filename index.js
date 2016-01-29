'use strict';

function wrap(o) {
	return d => {
		if (!d) {
			return o;
		}

		const n = {};
		for (const f in o) {
			if (o.hasOwnProperty(f)) {
				n[f] = typeof o[f] === 'function' ?
					o[f].bind(undefined, d) :
					o[f];
			}
		}

		return n;
	};
}

module.exports = function (m, o, d) {
	m.exports = wrap(o);
	return Object.assign(m.exports, wrap(o)(d));
};
