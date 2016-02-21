/* eslint no-unused-expressions: 0 */
'use strict';

const chai = require('chai');
chai.use(require('chai-spies'));
const should = chai.should();

describe('variable/function scoping', () => {
	describe('normal', () => {
		let scope;

		beforeEach(() => {
			scope = require('../examples/scope.js');
		});

		it('should export right', () => {
			should.exist(scope);
			scope.should.have.property('fn');
			scope.fn.should.be.a('function');
		});

		it('should return init state', () => {
			const out = scope.fn();
			should.exist(out);
			out.should.be.an('array');
			out.length.should.equal(4);
			out[0].should.be.a('boolean').and.equal(true);
			out[1].should.be.a('string').and.equal('A description');
			out[2].should.be.an('object').and.contain.keys('mode', 'size');
			should.not.exist(out[4]);
		});

		it('should recognize state changes', () => {
			scope.value = false;
			scope.info = 'baNANa';

			const out = scope.fn(42);
			should.exist(out);
			out.should.be.an('array');
			out.length.should.equal(4);
			out[0].should.be.a('boolean').and.equal(false);
			out[1].should.be.a('string').and.equal('baNANa');
			out[2].should.be.an('object').and.contain.keys('mode', 'size');
			out[3].should.be.a('number').and.equal(42);
		});
	});

	describe('mocked', () => {
		let scope;
		const DEPS = {
			fs: {
				statSync: chai.spy()
			}
		};

		beforeEach(() => {
			DEPS.fs.statSync = chai.spy(() => ({many: 'fake', vals: true}));
			scope = require('../examples/scope.js')(DEPS);
		});

		it('should export correctly', () => {
			should.exist(scope);
			scope.should.have.property('fn');
			scope.fn.should.be.a('function');
		});

		it('should return init state', () => {
			const out = scope.fn();
			should.exist(out);
			out.should.be.an('array');
			out.length.should.equal(4);
			out[0].should.be.a('boolean').and.equal(true);
			out[1].should.be.a('string').and.equal('A description');
			out[2].should.be.an('object').and.contain.keys('many', 'vals');
			DEPS.fs.statSync.should.have.been.called.once;
			should.not.exist(out[4]);
		});

		it('should recognize state changes', () => {
			scope.value = false;
			scope.info = 'baNANa';

			const out = scope.fn(42);
			should.exist(out);
			out.should.be.an('array');
			out.length.should.equal(4);
			out[0].should.be.a('boolean').and.equal(false);
			out[1].should.be.a('string').and.equal('baNANa');
			out[2].should.be.an('object').and.contain.keys('many', 'vals');
			DEPS.fs.statSync.should.have.been.called.once;
			out[3].should.be.a('number').and.equal(42);
		});
	});
});

describe('file with no dependencies', () => {
	let nodeps;

	beforeEach(() => {
		nodeps = require('../examples/nodeps.js');
	});

	it('should export correctly', () => {
		should.exist(nodeps);
		nodeps.should.contain.keys('boolean', 'number', 'string', 'emptyObject', 'object', 'array', 'echo', 'sum');
		nodeps.boolean.should.be.a('boolean').and.equal(true);
		nodeps.number.should.be.a('number').and.equal(42);
		nodeps.string.should.be.a('string').and.equal('test');
		nodeps.emptyObject.should.be.an('object').and.be.empty;
		nodeps.object.should.be.an('object').and.have.key('string');
		nodeps.object.string.should.be.a('string').and.equal('another');
		nodeps.array.should.be.an('array').and.be.empty;
		nodeps.echo.should.be.a('function');
		nodeps.sum.should.be.a('function');
	});

	it('should have uninjected funtions', () => {
		const STR = 'a random string';

		const echo = nodeps.echo(STR);
		should.exist(echo);
		echo.should.be.a('string').and.equal(STR);

		const sum = nodeps.sum(-8, 50);
		should.exist(sum);
		sum.should.be.a('number').and.equal(42);
	});
});

describe('file with dependencies', () => {
	describe('without injecting', () => {
		let deps;

		beforeEach(() => {
			deps = require('../examples/deps.js');
		});

		it('should export correctly', () => {
			should.exist(deps);
			deps.should.contain.keys('boolean', 'number', 'string', 'emptyObject', 'object', 'array', 'fn', 'echo', 'sum');
			deps.boolean.should.be.a('boolean').and.equal(true);
			deps.number.should.be.a('number').and.equal(42);
			deps.string.should.be.a('string').and.equal('test');
			deps.emptyObject.should.be.an('object').and.be.empty;
			deps.object.should.be.an('object').and.have.key('string');
			deps.object.string.should.be.a('string').and.equal('another');
			deps.array.should.be.an('array').and.be.empty;
			deps.fn.should.be.a('function');
			deps.echo.should.be.a('function');
			deps.sum.should.be.a('function');
		});

		it('should use right dependencies', done => {
			const PATH = __filename;
			deps.fn(PATH, (err, out) => {
				should.not.exist(err);
				should.exist(out);
				out.should.be.an('object').and.contain.keys('mode', 'size');
				done();
			});
		});

		it('should keep "independent" functions working', () => {
			const STR = 'a random string';

			const echo = deps.echo(STR);
			should.exist(echo);
			echo.should.be.a('string').and.equal(STR);

			const sum = deps.sum(-8, 50);
			should.exist(sum);
			sum.should.be.a('number').and.equal(42);
		});
	});

	describe('with injecting', () => {
		let deps;
		const DEPS = {
			fs: {
				stat: chai.spy()
			}
		};

		beforeEach(() => {
			DEPS.fs.stat = chai.spy((path, cb) => cb(null, path));
			deps = require('../examples/deps.js')(DEPS);
		});

		it('should export correctly', () => {
			should.exist(deps);
			deps.should.contain.keys('boolean', 'number', 'string', 'emptyObject', 'object', 'array', 'fn', 'echo', 'sum');
			deps.boolean.should.be.a('boolean').and.equal(true);
			deps.number.should.be.a('number').and.equal(42);
			deps.string.should.be.a('string').and.equal('test');
			deps.emptyObject.should.be.an('object').and.be.empty;
			deps.object.should.be.an('object').and.have.key('string');
			deps.object.string.should.be.a('string').and.equal('another');
			deps.array.should.be.an('array').and.be.empty;
			deps.fn.should.be.a('function');
			deps.echo.should.be.a('function');
			deps.sum.should.be.a('function');
		});

		it('should use right dependencies', done => {
			const PATH = __filename;
			deps.fn(PATH, (err, out) => {
				should.not.exist(err);
				should.exist(out);
				out.should.be.a('string').and.equal(PATH);
				DEPS.fs.stat.should.have.been.called.once;
				done();
			});
		});

		it('should keep "independent" functions working', () => {
			const STR = 'a random string';

			const echo = deps.echo(STR);
			should.exist(echo);
			echo.should.be.a('string').and.equal(STR);

			const sum = deps.sum(-8, 50);
			should.exist(sum);
			sum.should.be.a('number').and.equal(42);
		});
	});
});
