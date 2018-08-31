'use strict'

const SIGNIFICANT_DIGITS = 2

const scoreLine = (score) => `${score.score} hz  ${score.nsper} ns/op  ${score.name}`
const errorLine = (failed) => `${failed.name}: ${failed.error.toString()}`

function summarize(benchmark) {
	const passed = benchmark.tests.filter(test => !test.error)
	const failed = benchmark.tests.filter(test => test.error)
	return header(benchmark)
		.concat(scores(passed))
		.concat(errors(failed))
		.join('\n')
}

function header(benchmark) {
	return [
		`Benchmark ${benchmark.state}`,
		benchmark.error? benchmark.error.toString(): ''
	]
}

function scores(tests) {
	if (tests.length === 0) return []
	const scores = tests.map(preformat)
	align(scores)
	return scores
		.sort(compare)
		.map(scoreLine)
}

function preformat(test) {
	return {
		name: test.name.slice(0, 40),
		score: friendlyNumber(test.result.hz),
		hz: test.result.hz,
		nsper: friendlyNumber(test.result.nsper),
	}
}

function friendlyNumber(number) {
	return number.toLocaleString(undefined, {
		minimumSignificantDigits: SIGNIFICANT_DIGITS,
		maximumSignificantDigits: SIGNIFICANT_DIGITS,
	})
}

function align(scores) {
	let lengths = scores.map(score => score.score.split('.')[0].length)
	let maxLength = Math.max(...lengths)
	scores.forEach((score, i) => {
		score.score = ' '.repeat(maxLength - lengths[i]) + score.score
	})

	lengths = scores.map(score => score.score.length)
	maxLength = Math.max(...lengths)
	scores.forEach(score => {
		score.score = score.score.padEnd(maxLength, ' ')
	})
}

function compare(a, b) {
	// descending
	return b.hz - a.hz
}

function errors(failed) {
	if (failed.length === 0) return []
	return [''].concat(failed.map(errorLine))
}


module.exports = summarize
