/*
	codeOf(fn)

	Return the javascript body of the function `fn`.
*/
'use strict'

const PUNC = new Set('!"$%&\'()*+,-./:;<=>?[]^`{|}~')
const isPunc = c => PUNC.has(c)

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

function trimLeading(prefix) {
	return js => {
		if (js.slice(0, prefix.length) === prefix)
			return js.slice(prefix.length)
		return js
	}
}

const stripFunctionDecl = trimLeading('function()')
const stripArrowDecl = trimLeading('()=>')

function stripSurroundingBraces(js, original) {
	if (js === '{}') return original
	if (js[0] === '{' && js[js.length - 1] === '}')
		return js.slice(1, -1)
	return js
}

function pipe(value, ...fns) {
	const originalValue = value
	return fns.reduce((value, fn) => fn(value, originalValue), value)
}

function codeOf(fn) {
	return pipe(compress(fn.toString()),
		stripFunctionDecl,
		stripArrowDecl,
		stripSurroundingBraces
	)
}

module.exports = codeOf