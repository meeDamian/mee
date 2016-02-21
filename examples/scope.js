'use strict';

let me = {
	value: true,
	info: 'A description'
};

me.fn = function ({fs}, param) {
	return [
		me.value,
		me.info,
		fs.statSync('.'),
		param
	];
};

me = require('../index.js')(module, me, {
	fs: require('fs')
});
