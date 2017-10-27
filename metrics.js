const UNACCEPTABLE = Symbol('Unacceptable');

const aggregateDesirabilityMetric = (metrics, weights) => (p, context) => {
	const scores = metrics.map(m => m(p, context));

	if (scores.find(x => x === UNACCEPTABLE) !== undefined) {
		return UNACCEPTABLE;
	} else {
		// const z = scores.map(Math.exp);
		// const sum = _.sum(z);
		// const softmax = _.max(z.map(s => s / sum));
		// return softmax;
		const avg = scores.reduce((acc, x, i) => acc + weights[i] * x, 0) / scores.length;
		return avg;
	}
};

const sociabilityMetric = (p, context) => {
	const { buildings } = context;

	if (buildings.length === 0) { return 0.5; }

	let maxScore = -1;
	for (b of buildings) {
		const dx = p[0] - b[0];
		const dy = p[1] - b[1];
		const d = Math.sqrt(dx * dx + dy * dy);

		// If buildings are too close to fit together this metric returns unacceptable
		if (d <= 2) {
			return UNACCEPTABLE;
		}


		const v = 1 / (1 + Math.exp(0.2*(d-10)));

		if (v > maxScore) {
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

	if (gradient > 0.03) {
		return UNACCEPTABLE;
	} else {
		return Math.max(0, 1 - gradient / 0.03);
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
