/*
	This example does not pass a `noop` argument,
	so it by default cancels out the cost of looping and
	function-call overhead.
*/

'use strict'
const crypto = require('crypto')
const Benchmark = require('../hrbench')

new Benchmark()
	.test(() => crypto.randomBytes(15))
	.test(() => crypto.randomBytes(150))
	.test(() => crypto.randomBytes(1500))
	.test(() => crypto.randomBytes(15000))
	.go()
