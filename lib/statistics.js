'use strict'

const tCritical975 = [,	// undefined for 0
	12.706,	4.303,	3.182,	2.776,	2.571,
	2.447,	2.365,	2.306,	2.262,	2.228,
	2.201,	2.179,	2.160,	2.145,	2.131,
	2.120,	2.110,	2.101,	2.093,	2.086,
	2.080,	2.074,	2.069,	2.064,	2.060,
	2.056,	2.052,	2.048,	2.045,	2.042,
	2.040,	2.037,	2.035,	2.032,	2.030,
	2.028,	2.026,	2.024,	2.023,	2.021,
	2.020,	2.018,	2.017,	2.015,	2.014,
	2.013,	2.012,	2.011,	2.010,	2.009,
	2.008,	2.007,	2.006,	2.005,	2.004,
	2.003,	2.002,	2.002,	2.001,	2.000,
	2.000,	1.999,	1.998,	1.998,	1.997,
	1.997,	1.996,	1.995,	1.995,	1.994,
	1.994,	1.993,	1.993,	1.993,	1.992,
	1.992,	1.991,	1.991,	1.990,	1.990,
	1.990,	1.989,	1.989,	1.989,	1.988,
	1.988,	1.988,	1.987,	1.987,	1.987,
	1.986,	1.986,	1.986,	1.986,	1.985,
	1.985,	1.985,	1.984,	1.984,	1.984
]

function tValue(degreesOfFreedom) {
	if (degreesOfFreedom < 1)
		return NaN
	if (degreesOfFreedom < tCritical975.length)
		return tCritical975[degreesOfFreedom]
	return 1.960
}

const sampleVariance = (n, M2) => M2 / (n - 1)
const sampleStandardDeviation = (n, M2) => Math.sqrt(sampleVariance(n, M2))
const standardError = (n, M2) => sampleStandardDeviation(n, M2) / Math.sqrt(n)
const marginOfError = (n, M2) => tValue(n - 1) * standardError(n, M2)

class Statistics {
	constructor(n, mean, M2) {
		this.n = n || 0
		this.mean = mean || 0.0
		this.M2 = M2 || 0.0
	}

	// get variance() {
	// 	return this.M2 / this.n
	// }

	// get standardDeviation() {
	// 	return Math.sqrt(this.variance)
	// }

	get sampleVariance() {
		return sampleVariance(this.n, this.M2)
	}

	get sampleStandardDeviation() {
		return sampleStandardDeviation(this.n, this.M2)
	}

	get marginOfError() {
		return marginOfError(this.n, this.M2)
	}

	get relativeMarginOfError() {
		return this.marginOfError / this.mean
	}

	accumulate(x) {
		const n = this.n + 1
		const mean = this.mean + (x - this.mean) / n
		const M2 = this.M2 + (x - this.mean) * (x - mean)
		return new Statistics(n, mean, M2)
	}
}

module.exports = Statistics
