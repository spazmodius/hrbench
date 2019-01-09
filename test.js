'use strict'
const codeOf = require('./codeOf')
const Statistics = require('./statistics')
const defer = require('./defer')
const core = require('./core')
const STATE = require('./state')

const MIN_ROUNDS = 5
const MAX_ROUNDS = 30
const SECONDS_PER_ROUND = 0.1
const ACCEPTABLE_RELATIVE_MOE = 0.01

function make(benchmark, name, fn, noop) {
	return {
		benchmark,
		name: name || fn.name || codeOf(fn),
		fn,
		noop: noop,
		state: STATE.NotStarted,
		error: null,
		prelim: null,
		cycles: NaN,
		result: null,
		stats: new Statistics,
		runs: [],
	}
}

function run(test) {
	return defer.immediate(initialize, test)
		.then(executeRound)
		.catch(err => {
			test.state = STATE.Failed
			test.error = err
		})
}

function initialize(test) {
	test.state = STATE.Running
	test.prelim = core.estimate(test.fn, SECONDS_PER_ROUND)
	test.cycles = test.prelim.hz * SECONDS_PER_ROUND
	test.benchmark._onTestInitialized(test)
	return test
}

function executeRound(test) {
	const run = core.run(test.cycles, test.fn, test.noop)
	test.runs.push(run)
	test.result = core.accumulate(test.result, run)
	test.stats = test.stats.accumulate(run.ns)
	if (enoughRounds(test.stats))
		test.state = STATE.Complete
	test.benchmark._onTestRound(test)
	if (test.state === STATE.Running)
		return defer.immediate(executeRound, test)
}

function enoughRounds(stats) {
	if (stats.n < MIN_ROUNDS)
		return false
	if (stats.n >= MAX_ROUNDS)
		return true
	return stats.relativeMarginOfError <= ACCEPTABLE_RELATIVE_MOE
}

module.exports = {
	make,
	run,
}