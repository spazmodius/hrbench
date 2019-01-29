'use strict'
const { stdout } = process
const STATE = require('./state')

function progress(benchmark) {
	benchmark.on('state change', onStateChange)
	benchmark.on('test state change', onTestStateChange)
}

function onStateChange(oldState) {
	if (this.state === STATE.Running) {
		const dots = '.'.repeat(this.tests.length)
		stdout.write(`${this.name} ${dots}`)
	}
}

function onTestStateChange(test, oldState) {
	if (test.state === STATE.Complete || test.state === STATE.Failed)
		stdout.write('\x08 \x08')
}

module.exports = progress