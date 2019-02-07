/*
	clamp(value, min, max)

	Return `value`, but no less than `min`, and no greater than `max`
*/

'use strict'

module.exports = function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}
