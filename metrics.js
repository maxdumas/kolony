const UNACCEPTABLE = Symbol('Unacceptable');

const aggregateDesirabilityMetric = (metrics, weights) => (p, context) => {
	const scores = metrics.map(m => m(p, context));

	if (scores.find(x => x === UNACCEPTABLE) !== undefined) {
		return UNACCEPTABLE;
	} else {
		return scores.reduce((acc, x, i) => acc + weights[i] * x, 0) / scores.length;
	}
};

const sociabilityMetric = (p, context) => {
	const { buildings } = context;

	let totalScore = 0;
	for (b of buildings) {
		const dx = p[0] - b[0];
		const dy = p[1] - b[1];
		const d = Math.sqrt(dx * dx + dy * dy);

		let v;
		if (d < 5) {
			v = 1 - 1 / (d * d);
		} else {
			v = 2 / (1 + Math.exp((d-25))) - 1
		}

		if (d < 5 && v < -0.9) {
			return UNACCEPTABLE;
		} else {
			totalScore += v;
		}
	}

	return totalScore / (buildings.length || 1);
};

const accessibilityMetric = (p, context) => {
	const { world, waterHeight } = context;

	const height = world[p[0]][p[1]];

	if (height <= waterHeight) {
		return UNACCEPTABLE;
	} else {
		return (1 - height);
	}
};
