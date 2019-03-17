'use strict'
const v8 = require('v8')

v8.setFlagsFromString('--allow-natives-syntax')
const neverOptimize = new Function('fn', 'return %NeverOptimizeFunction(fn)')
v8.setFlagsFromString('--no-allow-natives-syntax')

module.exports = neverOptimize
