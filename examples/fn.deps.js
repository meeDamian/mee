'use strict';

let me = {};

me.fn = function ({fs}, path, cb) {
	fs.stat(path, cb);
};

me = require('../index.js')(module, me, {
	fs: require('fs')
});
