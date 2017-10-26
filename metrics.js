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

	let maxScore = -1;
	for (b of buildings) {
		const dx = p[0] - b[0];
		const dy = p[1] - b[1];
		const d = Math.sqrt(dx * dx + dy * dy);

		let v;
		if (d < 5) {
			v = 1 - 1 / ((d - 2) * (d - 2));
		} else {
			v = 1 / (1 + Math.exp(0.125*(d-5)));
			// console.log(d, v);
		}

		// If buildings are too close to fit together this metric returns unacceptable
		if (d < 5 && v < -0.9) {
			return UNACCEPTABLE;
		} else if (v > maxScore) {
			maxScore = v;
		}
	}

	return maxScore;
};

const slopeMetric = (p, context) => {
	const { world, worldSize: [w, h] } = context;

	const baseHeight = world[p[0]][p[1]];

	const k = [-1, 0, 1];
	const kernel = (i, j) => _.zip(k, k) // Enter R2
		.filter(([di, dj]) => di !== 0 || di !== dj) // Can't both be zeros
		.map(([di, dj]) => [i + di, j + dj]) // Calculate real indices
		.filter(([x, y]) => x >= 0 && x < w && y >= 0 && y < h) // Only keep valid indices (for edge cases)
		.map(([x, y]) => world[x][y]); // Read values


	const gradient = _.max(kernel(p[0], p[1]).map(v => Math.abs(v - baseHeight)));

	if (gradient > 0.05) {
		return UNACCEPTABLE;
	} else {
		return (1 - 2 * gradient / 0.05);
	}
};

const accessibilityMetric = (p, context) => {
	const { world, waterHeight } = context;

	const height = world[p[0]][p[1]];

	if (height <= waterHeight) {
		return UNACCEPTABLE;
	} else {
		const h = 1 - height;
		return h;
	}
};
