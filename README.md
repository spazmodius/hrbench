# Spaz's hrBench

High-resolution micro-benchmarking in Node.js.

## Install and Usage
`npm install spazmodius/hrbench -D`

```js
const Benchmark = require('@spazmodius/hrbench')
const crypto = require('crypto')

Benchmark('Getting crypto bytes')
	.test('small', () => crypto.randomBytes(15))
	.test('medium', () => crypto.randomBytes(150))
```

## Concepts

Concept | Definition
---|---
Benchmark | A suite of **tests** whose performance will be compared to each other.
Test | A single operation in a **benchmark**, to be timed and compared to other tests in the same Benchmark.
Cycle | A single execution of a **test**. There are many cycles in a **round**.
Round | Many repeated **cycles**, allowing enough time to pass for stable timing.

A benchmark times each test by running it in a tight loop (a round).
Each round will consist of enough cycles, typically, to take about 1/10th of a second.
Rounds themselves will be repeated as necessary to reach statistical confidence.

Once all of the tests have been timed to satisfactory statistical confidence,
their timings will be summarized, ordered from fastest to slowest,
and printed to the console.

## Ansync tests

No, sorry.

# API

## [new] Benchmark( _[name], [options]_ )

Argument | Type | Optional | Description
---|---|:---:|---
`name` | string | &check; | Name of this benchmark.
`options` | object | &check; | Options

Starts a benchmark, to compare the performance of a set of tests.

### Options

#### `name`

Naming the benchmark is useful if there are multiple benchmarks in the file.

#### `maxCycles`

Set the maximum number of cycles per round.

Typically, the number of cycles is automatically estimated so as to produce rounds approximately 1/10th of a second each.
However, limiting the number of cycles per round is useful for memory-intensive tests,
since there will be no garbage-collection between cycles during a round.

## benchmark.test( _[name], op, [noop]_ )

Argument | Type | Optional | Description
---|---|:---:|---
`name` | string | &check; | Name of this test.
`op` | function | | The operation to time.
`noop` | function or null | &check; | Operation that represents doing nothing.

Adds a test to the benchmark.

If a name is not specified, then one will be generated from the name or contents of the operation.

The `noop` function will be timed just like the operation, and subtracted from the results.
This will calibrate for the overhead of looping and invoking the operation.
By default, `noop` is an empty function call.
See [Demo3](./demo/demo3.js) for an example of a non-trivial `noop`.

However, passing `null` will time an empty loop without any function call at all.
This has the effect of including the cost of invocation in the reported results.
See [Demo1](./demo/demo1.js) for an example of where this might be useful.
