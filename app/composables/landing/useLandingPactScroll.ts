type EnvelopePoint = {
	x: number;
	y: number;
};

type EnvelopeSegment = {
	from: EnvelopePoint;
	length: number;
	to: EnvelopePoint;
};

const ENVELOPE_POINTS = [
	{ x: 40, y: 232 },
	{ x: 220, y: 36 },
	{ x: 620, y: 196 },
	{ x: 760, y: 232 },
] as const satisfies readonly [
	EnvelopePoint,
	EnvelopePoint,
	EnvelopePoint,
	EnvelopePoint,
];

const ENVELOPE_SEGMENTS = [
	createEnvelopeSegment(ENVELOPE_POINTS[0], ENVELOPE_POINTS[1]),
	createEnvelopeSegment(ENVELOPE_POINTS[1], ENVELOPE_POINTS[2]),
	createEnvelopeSegment(ENVELOPE_POINTS[2], ENVELOPE_POINTS[3]),
] as const satisfies readonly [
	EnvelopeSegment,
	EnvelopeSegment,
	EnvelopeSegment,
];

const TOTAL_LENGTH = ENVELOPE_SEGMENTS.reduce((acc, segment) => {
	return acc + segment.length;
}, 0);

const SCRUB_START_PAD = 0.08;
const SCRUB_END_PAD = 0.08;
const ATTACK_SCROLL_END = 0.18;
const DECAY_SCROLL_END = 0.82;
const ATTACK_PATH_END = ENVELOPE_SEGMENTS[0].length / TOTAL_LENGTH;
const DECAY_PATH_END =
	(ENVELOPE_SEGMENTS[0].length + ENVELOPE_SEGMENTS[1].length) / TOTAL_LENGTH;

function createEnvelopeSegment(
	from: EnvelopePoint,
	to: EnvelopePoint
): EnvelopeSegment {
	return {
		from,
		to,
		length: Math.hypot(to.x - from.x, to.y - from.y),
	};
}

function clampProgress(value: number): number {
	return Math.max(0, Math.min(1, value));
}

function getActiveScrollProgress(scrollProgress: number): number {
	const activeSpan = 1 - SCRUB_START_PAD - SCRUB_END_PAD;
	return clampProgress((scrollProgress - SCRUB_START_PAD) / activeSpan);
}

function remapScroll(scrollProgress: number): number {
	const activeProgress = getActiveScrollProgress(scrollProgress);

	if (activeProgress <= ATTACK_SCROLL_END) {
		const attackProgress = activeProgress / ATTACK_SCROLL_END;
		return attackProgress * ATTACK_PATH_END;
	}

	if (activeProgress <= DECAY_SCROLL_END) {
		const decayProgress =
			(activeProgress - ATTACK_SCROLL_END) /
			(DECAY_SCROLL_END - ATTACK_SCROLL_END);
		return (
			ATTACK_PATH_END + decayProgress * (DECAY_PATH_END - ATTACK_PATH_END)
		);
	}

	const releaseProgress =
		(activeProgress - DECAY_SCROLL_END) / (1 - DECAY_SCROLL_END);
	return DECAY_PATH_END + releaseProgress * (1 - DECAY_PATH_END);
}

function getActiveIndex(scrollProgress: number): number {
	const activeProgress = getActiveScrollProgress(scrollProgress);

	if (activeProgress < ATTACK_SCROLL_END) return 0;
	if (activeProgress < DECAY_SCROLL_END) return 1;
	return 2;
}

function getPlayheadPosition(pathProgress: number): EnvelopePoint {
	const target = pathProgress * TOTAL_LENGTH;
	let accumulatedLength = 0;

	for (const segment of ENVELOPE_SEGMENTS) {
		if (target <= accumulatedLength + segment.length) {
			const segmentProgress =
				segment.length === 0
					? 0
					: (target - accumulatedLength) / segment.length;

			return {
				x:
					segment.from.x +
					(segment.to.x - segment.from.x) * segmentProgress,
				y:
					segment.from.y +
					(segment.to.y - segment.from.y) * segmentProgress,
			};
		}

		accumulatedLength += segment.length;
	}

	return ENVELOPE_POINTS[3];
}

function getEnvelopePath(): string {
	return ENVELOPE_POINTS.map((point, index) => {
		const command = index === 0 ? "M" : "L";
		return `${command} ${point.x},${point.y}`;
	}).join(" ");
}

export function useLandingPactScroll(trackRef: Ref<HTMLElement | undefined>): {
	activeIndex: ComputedRef<number>;
	dashOffset: ComputedRef<number>;
	envelopePath: string;
	playheadPosition: ComputedRef<EnvelopePoint>;
	totalLength: number;
} {
	const scrollProgress = shallowRef(0);
	const remappedProgress = computed(() => remapScroll(scrollProgress.value));
	const activeIndex = computed(() => getActiveIndex(scrollProgress.value));
	const playheadPosition = computed(() =>
		getPlayheadPosition(remappedProgress.value)
	);
	const dashOffset = computed(
		() => TOTAL_LENGTH * (1 - remappedProgress.value)
	);

	onMounted(() => {
		if (typeof window === "undefined") return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		let raf = 0;

		function updateScrollProgress() {
			if (!trackRef.value) return;

			const rect = trackRef.value.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const maxScroll = rect.height - viewportHeight;

			if (maxScroll <= 0) {
				scrollProgress.value = 0;
				return;
			}

			scrollProgress.value = clampProgress(-rect.top / maxScroll);
		}

		function requestScrollProgressUpdate() {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(updateScrollProgress);
		}

		updateScrollProgress();
		window.addEventListener("scroll", requestScrollProgressUpdate, {
			passive: true,
		});
		window.addEventListener("resize", requestScrollProgressUpdate, {
			passive: true,
		});

		onBeforeUnmount(() => {
			cancelAnimationFrame(raf);
			window.removeEventListener("scroll", requestScrollProgressUpdate);
			window.removeEventListener("resize", requestScrollProgressUpdate);
		});
	});

	return {
		activeIndex,
		dashOffset,
		envelopePath: getEnvelopePath(),
		playheadPosition,
		totalLength: TOTAL_LENGTH,
	};
}
