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

me.echo = function (value) {
	return value;
};

me.sum = function (left, right) {
	return left + right;
};

me = require('../index.js')(module, me);
