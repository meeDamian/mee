/* eslint no-unused-expressions: 0 */
'use strict';

const should = require('chai').should();

describe('No dependencies', () => {
	describe('Only function', () => {
		it('should not inject normal deps', () => {
			const p = require('../examples/fn.nodeps.js');

			should.exist(p);
			p.should.contain.keys('fn');
			p.fn.should.be.a('function');

			const VAL = 666;
			const val = p.fn(VAL);
			should.exist(val);
			val.should.equal(VAL);
		});

		it('should not inject mocked deps', () => {
			const p = require('../examples/fn.nodeps.js')();

			should.exist(p);
			p.should.contain.keys('fn');
			p.fn.should.be.a('function');

			const VAL = 334;
			const val = p.fn(VAL);
			should.exist(val);
			val.should.equal(VAL);
		});
	});

	describe('Only properties', () => {
		let p;

		before(() => {
			p = require('../examples/var.nodeps.js');
		});

		it('should contain boolean', () => {
			should.exist(p.boolean);
			p.boolean.should.be.a('boolean');
			p.boolean.should.be.false;
		});

		it('should contain string', () => {
			should.exist(p.string);
			p.string.should.be.a('string');
			p.string.should.equal('string');
		});

		it('should contain number', () => {
			should.exist(p.number);
			p.number.should.be.a('number');
			p.number.should.equal(42);
		});

		it('should contain array', () => {
			should.exist(p.array);
			p.array.should.be.an('array');
			p.array.should.be.empty;
		});

		it('should contain object', () => {
			should.exist(p.object);
			p.object.should.be.an('object');
			p.object.should.be.empty;
		});
	});

	describe('Mixed', () => {
		let p;

		before(() => {
			p = require('../examples/mixed.nodeps.js');
		});

		it('should contain string', () => {
			should.exist(p.string);
			p.string.should.be.a('string');
			p.string.should.equal('test');
		});

		it('should contain object', () => {
			should.exist(p.object);
			p.object.should.be.an('object');
			p.object.should.not.be.empty;
			p.object.should.contain.key('string');
			p.object.string.should.be.a('string');
			p.object.string.should.equal('another');
		});

		it('should have uninjected function', () => {
			should.exist(p);
			p.should.contain.keys('fn');
			p.fn.should.be.a('function');

			const VAL = Math.random();
			const val = p.fn(VAL);
			should.exist(val);
			val.should.equal(VAL);
		});
	});
});

describe('With dependencies', () => {
	describe('Only function', () => {
		it('should inject normal deps', done => {
			const p = require('../examples/fn.deps.js');

			should.exist(p);
			p.should.contain.keys('fn');
			p.fn.should.be.a('function');

			p.fn(__filename, (err, stat) => {
				should.not.exist(err);
				should.exist(stat);
				stat.should.be.an('object');
				done();
			});
		});

		it('should inject mocked deps', done => {
			const p = require('../examples/fn.deps.js')({
				fs: {
					stat: (path, cb) => cb(null, path)
				}
			});

			should.exist(p);
			p.should.contain.keys('fn');
			p.fn.should.be.a('function');

			const PATH = __filename;
			p.fn(PATH, (err, path) => {
				should.not.exist(err);
				should.exist(path);
				path.should.be.a('string');
				path.should.equal(PATH);
				done();
			});
		});
	});

	describe('Only properties', () => {
		let p;

		before(() => {
			p = require('../examples/var.deps.js')({
				whatever: () => {}
			});
		});

		it('should contain boolean', () => {
			should.exist(p.boolean);
			p.boolean.should.be.a('boolean');
			p.boolean.should.be.false;
		});

		it('should contain string', () => {
			should.exist(p.string);
			p.string.should.be.a('string');
			p.string.should.equal('string');
		});

		it('should contain number', () => {
			should.exist(p.number);
			p.number.should.be.a('number');
			p.number.should.equal(42);
		});

		it('should contain array', () => {
			should.exist(p.array);
			p.array.should.be.an('array');
			p.array.should.be.empty;
		});

		it('should contain object', () => {
			should.exist(p.object);
			p.object.should.be.an('object');
			p.object.should.be.empty;
		});
	});

	describe('Mixed', () => {
		let p;

		before(() => {
			p = require('../examples/mixed.deps.js')({
				fs: {
					stat: (path, cb) => cb(null, path)
				}
			});
		});

		it('should contain string', () => {
			should.exist(p.string);
			p.string.should.be.a('string');
			p.string.should.equal('test');
		});

		it('should contain object', () => {
			should.exist(p.object);
			p.object.should.be.an('object');
			p.object.should.not.be.empty;
			p.object.should.contain.key('string');
			p.object.string.should.be.a('string');
			p.object.string.should.equal('another');
		});

		it('should inject mocked deps', done => {
			should.exist(p);
			p.should.contain.keys('fn');
			p.fn.should.be.a('function');

			const PATH = __filename;
			p.fn(PATH, (err, path) => {
				should.not.exist(err);
				should.exist(path);
				path.should.be.a('string');
				path.should.equal(PATH);
				done();
			});
		});
	});
});
