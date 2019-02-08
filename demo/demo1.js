/*
	This example passes null for the `noop` argument,
	which only compensates for the looping, not
	function-call overhead.

	(In this set of tests, we actually want to measure
	the function-call overhead itself.)
*/

'use strict'
const Benchmark = require('../hrbench')

function function_noop() {}
const lambda_noop = () => {}

new Benchmark('Function call overhead')
	.test(_ => _, null)
	.test(function(_) { return _ }, null)
	.test(lambda_noop, null)
	.test(function_noop, null)
	.test(function_noop.bind(), null)
	.test(() => {}, null)
	.test(function() {}, null)
