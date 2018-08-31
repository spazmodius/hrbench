/*
	This example passes a custom `noop` argument,
	to cancel out the cost of choosing a random number
	on each call.
*/

'use strict'
const Benchmark = require('../hrbench')

function randomNumber() {
	return (Math.random() - 0.5) * 2e9
}

function round() {
	return Math.round(randomNumber())
}

function floor() {
	return Math.floor(randomNumber())
}

function ceil() {
	return Math.ceil(randomNumber())
}

function orZero() {
	return randomNumber() | 0
}

function shiftZero() {
	return randomNumber >> 0
}

new Benchmark()
	.test('Math.round()', round, randomNumber)
	.test('Math.floor()', floor, randomNumber)
	.test('Math.ceil()', ceil, randomNumber)
	.test('x | 0', orZero, randomNumber)
	.test('x >> 0', shiftZero, randomNumber)
	.run()
	.then(Benchmark.summarize)
	.then(console.log)
	.catch(console.error)
