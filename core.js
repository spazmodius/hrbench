/*
	estimate(fn, maxSeconds)
	Find an inital estimate of performance.

	run(cycles, fn, noop)
	Precisely measure the performance of the function `fn`,
	minus the runtime of function `noop`,
	called`cycles` times.

	accumulate(result1, result2)
	Add 2 results together, and return a new result.
	`result1` may be null, thus returning `result2`
*/
'use strict'

const measure = require('./measure')
const clamp = require('./clamp')

const MIN_CYCLES = 1
const MAX_CYCLES = 0x7fffffff
const HALF_SECOND = 0.5
const ZERO = { cycles: 0, ns: 0, hz: NaN }

const result = (cycles, ns) => ({
	cycles,
	ns,
	hz: cycles / (ns / 1e9),
	nsper: ns / cycles,
})

const toNanoseconds = (seconds) => Math.round(seconds * 1e9)

// Measure progressively more cycles
// until we reach the time limit `maxSeconds` (defaults to half-a-second).
// But in no case let `cycles` get larger than 32 bits, since
// that changes the overhead characteristics of `measure()`.
function estimate(fn, maxSeconds) {
	const maxNanoseconds = toNanoseconds(maxSeconds || HALF_SECOND)
	let r = ZERO
	for (let cycles = MIN_CYCLES; cycles < MAX_CYCLES && r.ns < maxNanoseconds; cycles *= 2) {
		const ns = measure(cycles, fn)
		r = result(cycles, ns)
	}
	return r
}

function run(cycles, fn, noop) {
	cycles = clamp(Math.round(cycles), MIN_CYCLES, MAX_CYCLES)
	const fn_ns = measure(cycles, fn)
	const noop_ns = measure(cycles, noop)
	const ns = fn_ns - noop_ns
	return result(cycles, ns)
}

function accumulate(r1, r2) {
	return r1? result(r1.cycles + r2.cycles, r1.ns + r2.ns): r2
}

module.exports = {
	estimate,
	run,
	accumulate
}