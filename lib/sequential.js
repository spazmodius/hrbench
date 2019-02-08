'use strict'

function noop() {}

function sequential(fn) {
	var tail = Promise.resolve()

	return function() {
		const result = tail.then(() => fn.apply(this, arguments))
		tail = result.then(noop, noop)
		return result.then(null, null)
	}
}

module.exports = sequential
