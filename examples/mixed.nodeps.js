'use strict';

let me = {
	string: 'test',
	object: {
		string: 'another'
	}
};

me.fn = function (value) {
	return value;
};

me = require('../index.js')(module, me);
