'use strict';

let me = {
	boolean: false,
	string: 'string',
	number: 42,
	array: [],
	object: {}
};

me = require('../index.js')(module, me, {
	whatever: () => {}
});
