'use strict'
const Benchmark = require('../hrbench')

const bench = new Benchmark()
	.test(() => {}, null)
	.test(function() {}, null)
	.test(_ => _, null)
	.test(function(_) { return _ }, null)
	.run()
	.then(Benchmark.summarize)
	.then(console.log)
	.catch(console.error)
