const renderWorld = (ctx, world, worldSize, waterHeight) => {
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	world.forEach((r, i) => r.forEach((v, j) => {
		// v is value
		// i, j is index
		const index = worldSize[0] * 4 * j + i * 4;
		const z = (v + 1) / 2 * 255;
		data[index] = 50;
		if (v > waterHeight) {
			data[index + 1] = z;
			data[index + 2] = 50;
		} else {
			data[index + 1] = 50;
			data[index + 2] = z;
		}
		data[index + 3] = 255;
	}));
	ctx.putImageData(imageData, 0, 0);
}

const renderMetric = (canvasId, metric, context) => {
	const canvas = document.getElementById(canvasId);
	const ctx = canvas.getContext('2d');

	const { world, worldSize } = context;

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	world.forEach((r, i) => r.forEach((_, j) => {
		const index = worldSize[0] * 4 * j + i * 4;
		const v = metric([i, j], context);
		if (v === UNACCEPTABLE) {
			data[index] = 255;
			data[index + 1] = data[index + 2] = 0; // Red = unacceptable
		} else {
			data[index + 1] = 255 - (v + 1) / 2 * 255; // More negative = more green
			data[index + 2] = (v + 1) / 2 * 255; // More positive = more blue
		}
		data[index + 3] = 255;
	}));
	ctx.putImageData(imageData, 0, 0);
};
