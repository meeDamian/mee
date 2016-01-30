'use strict';

let me = {
	string: 'test',
	object: {
		string: 'another'
	}
};

me.fn = function ({fs}, path, cb) {
	fs.stat(path, cb);
	return path;
};

me = require('../index.js')(module, me, {
	fs: require('fs')
});
