/*
	This example passes a custom `noop` argument,
	to cancel out the cost of choosing a random number
	on each call.
*/

'use strict'
const Benchmark = require('../hrbench')

function randomNumber() {
	// random real number between
	// negative one-billion and positive one-billion
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

function trunc() {
	return Math.trunc(randomNumber())
}

function orZero() {
	return randomNumber() | 0
}

function shiftZero() {
	return randomNumber() >> 0
}

function ushiftZero() {
	return randomNumber() >>> 0
}

new Benchmark()
	.test('Math.round()', round, randomNumber)
	.test('Math.floor()', floor, randomNumber)
	.test('Math.ceil()', ceil, randomNumber)
	.test('Math.trunc()', trunc, randomNumber)
	.test('x | 0', orZero, randomNumber)
	.test('x >> 0', shiftZero, randomNumber)
	.test('x >>> 0', ushiftZero, randomNumber)
	.run()
	.then(Benchmark.summarize)
	.then(console.log)
	.catch(console.error)
