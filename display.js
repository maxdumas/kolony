const renderWorld = (ct, world) => {
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