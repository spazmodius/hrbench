'use strict'

const nt = process.nextTick
const si = setImmediate
const sto = setTimeout

function defer(Promise) {

	function promise(fn, arg) {
		return Promise.resolve(arg).then(fn)
	}

	function nextTick(fn, ...args) {
		return new Promise((resolve, reject) => {
			nt(() => {
				try { resolve(fn(...args)) }
				catch(err) { reject(err) }
			})
		})
	}

	function immediate(fn, ...args) {
		return new Promise((resolve, reject) => {
			si(() => {
				try { resolve(fn(...args)) }
				catch(err) { reject(err) }
			})
		})
	}

	function timeout(fn, delay, ...args) {
		return new Promise((resolve, reject) => {
			sto(() => {
				try { resolve(fn(...args)) }
				catch(err) { reject(err) }
			}, delay)
		})
	}

	function timeout0(fn, ...args) {
		return timeout(fn, 0, ...args)
	}

	return {
		promise,
		nextTick,
		immediate,
		timeout,
		timeout0,
	}
}

module.exports = Object.assign(defer, defer(Promise))