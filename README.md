# Spaz's hrBench

High-resolution micro-benchmarking in Node.js.

## Install
`npm install spazmodius/hrbench -D`

## Usage

```js
const crypto = require('crypto')
const Benchmark = require('@spazmodius/hrbench')

// create a benchmark
const bench = new Benchmark

// add tests to the benchmark
bench.test('small', () => crypto.randomBytes(15))

// naming the test is optional
bench.test(function medium() { crypto.randomBytes(150) })

// chaining
bench
	.test(() => crypto.randomBytes(1500))
	.test(() => crypto.randomBytes(15000))

// finally, run them and get back a Promise
bench.go()
```

## Ansync tests

No, sorry.