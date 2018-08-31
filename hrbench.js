'use strict'
const Test = require('./test')
const STATE = require('./state')

function Benchmark() {
	if (!(this instanceof Benchmark))
		return new Benchmark()

	this.state = STATE.NotStarted
	this.error = null
	this.tests = []
	this._onTestInitialized = function() {}
	this._onTestRound = function() {}
}

Benchmark.prototype.onTestRound = function onTestRound(handler) {
	this._onTestRound = handler
	return this
}

Benchmark.prototype.onTestInitialized = function onTestInitialized(handler) {
	this._onTestInitialized = handler
	return this
}

Benchmark.prototype.test = function test(name, fn, noop) {
	if (this.state !== STATE.NotStarted)
		throw new Error('Cannot add tests; ' + this.state)
	this.tests.push(Test.make(this, name, fn, noop))
	return this
}


Benchmark.prototype.run = function run() {
	if (this.state !== STATE.NotStarted)
		throw new Error('Cannot run; ' + this.state)
	this.state = STATE.Running

	return _run(this.tests)
		.then(() => {
			this.state = STATE.Complete
			return this
		})
		.catch(err => {
			this.state = STATE.Failed
			throw this.error = err
		})
}

function _run(tests) {
	const runningTests = tests.map(Test.run)
	return Promise.all(runningTests)
}

Benchmark.summarize = require('./summarize')
Benchmark.STATE = STATE

module.exports = Benchmark
