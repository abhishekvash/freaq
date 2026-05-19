export interface WaveEnvelopeOptions {
	density: number;
	seed: number;
}

export interface StaticWave {
	bot: string;
	centerY: number;
	top: string;
	viewBox: string;
	width: number;
}

export function createSeededRandom(seed: number) {
	let value = seed;
	return () => {
		let t = (value += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function createWaveEnvelope(options: WaveEnvelopeOptions) {
	const rand = createSeededRandom(options.seed);
	const points: number[] = [];

	for (let i = 0; i < options.density; i++) {
		const x = i / (options.density - 1);
		const breath =
			0.55 +
			0.45 * Math.sin(x * Math.PI * 3.7) * Math.cos(x * Math.PI * 1.3);
		const noise = (rand() - 0.5) * 0.42;
		const tail = 1 - Math.pow(Math.abs(x - 0.5) * 2, 2.6);
		const value = Math.max(
			0.04,
			Math.min(1, Math.abs(breath + noise) * Math.max(0.2, tail))
		);
		points.push(value);
	}

	return points;
}

export function createHeroStaticWave(): StaticWave {
	const points = createWaveEnvelope({ density: 240, seed: 0x4711 });
	const width = 1600;
	const height = 480;
	const centerY = height * 0.52;
	const ampHalf = centerY * 0.84 * 0.5;
	const breathBase = 0.94;
	const top: string[] = [];
	const bot: string[] = [];

	points.forEach((value, index) => {
		const x = (index / (points.length - 1)) * width;
		const peak = value * breathBase;
		top.push(`${x.toFixed(1)},${(centerY - ampHalf * peak).toFixed(1)}`);
		bot.push(`${x.toFixed(1)},${(centerY + ampHalf * peak).toFixed(1)}`);
	});

	return {
		viewBox: `0 0 ${width} ${height}`,
		width,
		centerY,
		top: top.join(" "),
		bot: bot.join(" "),
	};
}
