'use strict';

function wrap(fn, deps) {
	fn = fn.__orig || fn;

	const out = (...args) => fn(deps, ...args);
	out.__orig = fn;

	return out;
}

function dependify(m, o, d) {
	if (d) {
		for (const f in o) {
			if ({}.hasOwnProperty.call(o, f) && typeof o[f] === 'function') {
				o[f] = wrap(o[f], d);
			}
		}
	}

	return Object.assign(m.exports, o);
}

module.exports = function (m, o, d) {
	m.exports = d => dependify(m, o, d);
	return dependify(m, o, d);
};
