/*
	testName(suggested, fn)

	Come up with a good test name, using `suggested` if possible,
	otherwise trying the function name or it's code.
*/
'use strict'

const PUNC = '!"$%&\'()*+,-./:;<=>?[]^`{|}~'
const isPunc = c => PUNC.indexOf(c) >= 0

const EMPTY = ''
const SPACE = ' '

function elide(ws, at, text) {
	if (at === 0 || isPunc(text[at - 1]))
		return EMPTY
	const after = at + ws.length
	if (after >= text.length || isPunc(text[after]))
		return EMPTY
	return SPACE
}

const compress = js => js.replace(/\s+/g, elide)

function testName(suggested, fn) {
	return suggested || fn.name || compress(fn.toString())
}

module.exports = testName