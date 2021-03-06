'use strict'

const SIGNIFICANT_DIGITS = 2

const scoreLine = (score) => `${score['op/s']} hz  ${score['ns/op']} ns/op  ${score.name}`
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
		': ' + benchmark.state,
		benchmark.error? benchmark.error.toString(): ''
	]
}

function scores(tests) {
	if (tests.length === 0) return []
	const scores = tests.map(preformat)
	align(scores, 'op/s')
	align(scores, 'ns/op')
	return scores
		.sort(compare)
		.map(scoreLine)
}

function preformat(test) {
	const hz = test.result.ns > 0? test.result.hz: Infinity
	const nsper = Math.max(test.result.ns, 0) / test.result.cycles
	return {
		name: test.name.slice(0, 40),
		hz,
		'op/s': friendlyNumber(hz),
		'ns/op': friendlyNumber(nsper),
	}
}

function friendlyNumber(number) {
	return number.toLocaleString(undefined, {
		minimumSignificantDigits: SIGNIFICANT_DIGITS,
		maximumSignificantDigits: SIGNIFICANT_DIGITS,
	})
}

function align(scores, property) {
	let lengths = scores.map(score => score[property].split('.')[0].length)
	let maxLength = Math.max(...lengths)
	scores.forEach((score, i) => {
		score[property] = ' '.repeat(maxLength - lengths[i]) + score[property]
	})

	lengths = scores.map(score => score[property].length)
	maxLength = Math.max(...lengths)
	scores.forEach(score => {
		score[property] = score[property].padEnd(maxLength, ' ')
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
