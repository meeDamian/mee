'use strict';

let me = {};

me.fn = function (value) {
	return value;
};

me = require('../index.js')(module, me);
