'use strict'
const EventEmitter = require('events')
const { inherits } = require('util')
const Test = require('./test')
const STATE = require('./state')
const progress = require('./progress')

inherits(Benchmark, EventEmitter)

function Benchmark(name, options = {}) {
	if (!(this instanceof Benchmark))
		return new Benchmark(name, options)
	EventEmitter.call(this)

	if (typeof(name) === 'object' && options === undefined) {
		options = name
		name = undefined
	}

	this.name = String(name || options.name || "Benchmark")
	this._state = STATE.NotStarted
	this.error = null
	this.tests = []
	this.options = options

	progress(this)
}

Object.defineProperty(Benchmark.prototype, 'state', {
	enumerable: true,
	get: function() { return this._state },
	set: function(state) {
		const oldState = this._state
		this._state = state
		this.emit('state change', oldState)
	},
})

Benchmark.prototype.test = function test(name, fn, noop) {
	if (this.state !== STATE.NotStarted)
		throw new Error('Cannot add tests; ' + this.state)

	if (typeof name === 'function') {
		noop = fn
		fn = name
		name = undefined
	}
	else if (typeof name !== 'string')
		throw new RangeError('Optional argument `name` must be a string')

	if (typeof fn !== 'function')
		throw new RangeError('Required argument `fn` must be a function')
	if (noop !== undefined && typeof noop !== 'function' && noop !== null)
		throw new RangeError('Optional argument `noop` must be a function or null')

	const newTest = Test.make(this, name, fn, noop)
	this.tests.push(newTest)
	this.emit('test added', newTest)
	return this
}


Benchmark.prototype.run = function run() {
	if (this.state !== STATE.NotStarted)
		throw new Error('Cannot run; ' + this.state)
	return _run.call(this)
}

function _run() {
	this.state = STATE.Running

	return _runTests(this.tests)
		.then(() => {
			this.state = STATE.Complete
			return this
		})
		.catch(err => {
			this.state = STATE.Failed
			throw this.error = err
		})
}

function _runTests(tests) {
	const runningTests = tests.map(Test.run)
	return Promise.all(runningTests)
}

let queue = Promise.resolve()

Benchmark.prototype.go = function go() {
	if (this.state !== STATE.NotStarted)
		throw new Error('Cannot go; ' + this.state)
	this.state = STATE.Queued

	const run = () => _run.call(this)
		.then(Benchmark.summarize)
		.then(console.log)
	return queue = queue.then(run).catch(console.error)
}

Benchmark.summarize = require('./summarize')
Benchmark.STATE = STATE

module.exports = Benchmark
