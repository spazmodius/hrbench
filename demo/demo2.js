'use strict'
const crypto = require('crypto')
const Benchmark = require('../hrbench')

const bench = new Benchmark()
	.test(() => crypto.randomBytes(15))
	.test(() => crypto.randomBytes(150))
	.test(() => crypto.randomBytes(1500))
	.test(() => crypto.randomBytes(15000))
	.run()
	.then(Benchmark.summarize)
	.then(console.log)
	.catch(console.error)
