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

function noop() { return randomNumber() }

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

function doubleInverse() {
	return ~~randomNumber()
}

const b = new Benchmark("Force number to integer")
	.test('Math.round()', round, noop)
	.test('Math.floor()', floor, noop)
	.test('Math.ceil()', ceil, noop)
	.test('Math.trunc()', trunc, noop)
	.test('x | 0', orZero, noop)
	.test('x >> 0', shiftZero, noop)
	.test('x >>> 0', ushiftZero, noop)
	.test('~~x', doubleInverse, noop)
	.go()
