/*
	measure(count, fn)

	Time calling the function `fn` `count` times.
	If `fn` is undefined, uses a no-op function.
	if `fn` is null, then times an empty loop, with no function call.
	Return the elapsed time in nanoseconds.
*/
'use strict'

const NOOP = function() {}
const hrtime = process.hrtime
const nanoseconds = (hr) => 1e9 * hr[ 0 ] + hr[ 1 ]

function measure(count, fn) {
	return (fn === null? _emptyLoop: _measure)(count, fn || NOOP)
}

function _measure(count, fn) {
	const start = hrtime()
	while (count--)
		fn()
	const t = hrtime(start)
	return nanoseconds(t)
}

function _emptyLoop(count, fn) {
	const start = hrtime()
	while (count--)
		;
	const t = hrtime(start)
	return nanoseconds(t)
}

module.exports = measure
