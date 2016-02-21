'use strict';

let me = {
	boolean: true,
	number: 42,
	string: 'test',
	emptyObject: {},
	object: {
		string: 'another'
	},
	array: []
};

me.fn = function ({fs}, path, cb) {
	fs.stat(path, cb);
	return path;
};

me.echo = function (_, value) {
	return value;
};

me.sum = function (_, left, right) {
	return left + right;
};

me = require('../index.js')(module, me, {
	fs: require('fs')
});
