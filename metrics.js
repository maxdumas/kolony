const UNACCEPTABLE = Symbol('Unacceptable');

const aggregateDesirabilityMetric = metrics => (p, context) => {
	const scores = metrics.map(m => m(p, context));

	if (scores.find(x => x === UNACCEPTABLE) !== undefined) {
		return UNACCEPTABLE;
	} else {
		return scores.reduce((acc, x) => acc + x, 0) / scores.length;
	}
};

const sociabilityMetric = (p, context) => {
	const { buildings } = context;

	let totalScore = 0;
	for(b of buildings) {
		const dx = p[0] - b[0];
		const dy = p[1] - b[1];
		const d = Math.sqrt(dx * dx + dy * dy);
		const v = -5.789e-4 * d * d + 4.982e-2 * d - 1.978e-1;
		if (v < -0.9) {
			// If at any point the metric finds something unacceptable, we
			// can return early.
			return UNACCEPTABLE;
		} else {
			totalScore += v;
		}
	}

	return totalScore / (buildings.length || 1);
};

const accessibilityMetric = (p, context) => {
	const { world } = context;

	const height = world[p[0]][p[1]];

	if (height < 0) {
		return UNACCEPTABLE;
	} else {
		return (1 - height);
	}
};
