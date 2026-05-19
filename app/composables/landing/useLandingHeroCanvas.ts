import { createWaveEnvelope } from "~/utils/waveform";

export function useLandingHeroCanvas(
	sectionRef: Readonly<Ref<HTMLElement | undefined>>,
	canvasRef: Readonly<Ref<HTMLCanvasElement | undefined>>
) {
	const canvasReady = shallowRef(false);
	let canvasRaf: number | undefined;
	let cleanupFns: Array<() => void> = [];
	let firePulse: ((originXPage?: number) => void) | undefined;

	function setupCanvas() {
		const canvas = canvasRef.value;
		const section = sectionRef.value;
		if (!canvas || !section) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const canvasEl = canvas;
		const sectionEl = section;
		const canvasCtx = ctx;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let w = 0;
		let h = 0;
		const points: number[] = [];

		function rebuildEnvelope() {
			points.splice(
				0,
				points.length,
				...createWaveEnvelope({ density: 240, seed: 0x4711 })
			);
		}

		function resize() {
			const rect = sectionEl.getBoundingClientRect();
			w = rect.width;
			h = rect.height;
			canvasEl.width = Math.floor(w * dpr);
			canvasEl.height = Math.floor(h * dpr);
			canvasEl.style.width = `${w}px`;
			canvasEl.style.height = `${h}px`;
			canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		rebuildEnvelope();
		resize();

		const ro = new ResizeObserver(resize);
		ro.observe(sectionEl);
		cleanupFns.push(() => ro.disconnect());

		let firstFrameDone = false;
		let inView = true;
		const pulseDuration = 1600;
		let lastPulseStart = performance.now() - pulseDuration + 2400;
		let nextPulseGap = 4500 + Math.random() * 2000;
		let pulseOriginNorm: number | undefined;

		firePulse = (originXPage) => {
			const rect = sectionEl.getBoundingClientRect();
			if (typeof originXPage === "number" && rect.width > 0) {
				pulseOriginNorm = Math.max(
					0,
					Math.min(1, (originXPage - rect.left) / rect.width)
				);
			} else {
				pulseOriginNorm = undefined;
			}
			lastPulseStart = performance.now();
			nextPulseGap = 4500 + Math.random() * 2000;
		};

		const io = new IntersectionObserver(
			(entries) => {
				inView = entries.some((e) => e.isIntersecting);
			},
			{ threshold: 0 }
		);
		io.observe(sectionEl);
		cleanupFns.push(() => io.disconnect());

		let scrollProgress = 0;
		function updateScrollProgress() {
			const rect = sectionEl.getBoundingClientRect();
			const range = rect.height;
			if (range <= 0) {
				scrollProgress = 0;
				return;
			}
			scrollProgress = Math.max(0, Math.min(1, -rect.top / range));
		}

		function frame() {
			canvasRaf = requestAnimationFrame(frame);
			if (!inView) return;

			updateScrollProgress();
			canvasCtx.clearRect(0, 0, w, h);
			const now = performance.now();
			if (now - lastPulseStart > pulseDuration + nextPulseGap) {
				lastPulseStart = now;
				nextPulseGap = 4500 + Math.random() * 2000;
			}

			drawFrame({
				canvasCtx,
				h,
				lastPulseStart,
				points,
				pulseDuration,
				pulseOriginNorm,
				scrollProgress,
				w,
			});

			const pulseActive =
				now - lastPulseStart >= 0 &&
				now - lastPulseStart < pulseDuration;
			if (!pulseActive) pulseOriginNorm = undefined;

			if (!firstFrameDone) {
				firstFrameDone = true;
				canvasReady.value = true;
			}
		}

		canvasRaf = requestAnimationFrame(frame);
		cleanupFns.push(() => {
			if (canvasRaf) cancelAnimationFrame(canvasRaf);
			canvasRaf = undefined;
			firePulse = undefined;
		});
	}

	function pulse(originXPage?: number) {
		firePulse?.(originXPage);
	}

	function cleanupCanvas() {
		if (canvasRaf) cancelAnimationFrame(canvasRaf);
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
	}

	onBeforeUnmount(cleanupCanvas);

	return {
		canvasReady,
		cleanupCanvas,
		pulse,
		setupCanvas,
	};
}

type DrawFrameOptions = {
	canvasCtx: CanvasRenderingContext2D;
	h: number;
	lastPulseStart: number;
	points: number[];
	pulseDuration: number;
	pulseOriginNorm: number | undefined;
	scrollProgress: number;
	w: number;
};

function drawFrame(options: DrawFrameOptions) {
	const {
		canvasCtx,
		h,
		lastPulseStart,
		points,
		pulseDuration,
		pulseOriginNorm,
		scrollProgress,
		w,
	} = options;
	const now = performance.now();
	const t = now * 0.001;
	const drift =
		0.93 + 0.008 * Math.sin(t * 1.4) + 0.006 * Math.sin(t * 2.1 + 1.7);
	const beatPhase = (t * 1.55) % 1;
	const beat = Math.pow(Math.max(0, 1 - beatPhase * 2), 2.5) * 0.028;
	const offbeatPhase = (beatPhase + 0.5) % 1;
	const offbeat = Math.pow(Math.max(0, 1 - offbeatPhase * 2.4), 2.5) * 0.013;
	const breath = drift + beat + offbeat;
	const compress = 1 - scrollProgress * 0.22;
	const midY = h * 0.52;
	const margin = (w * (1 - compress)) / 2;
	const drawW = w - margin * 2;
	const n = points.length;
	const amp = midY * 0.84;
	const pulseT = now - lastPulseStart;
	const pulseActive = pulseT >= 0 && pulseT < pulseDuration;
	const pulseProgress = pulseActive ? pulseT / pulseDuration : 0;
	const pulseStrength = pulseActive ? Math.sin(pulseProgress * Math.PI) : 0;
	const pulseX =
		pulseOriginNorm !== undefined
			? margin +
				pulseOriginNorm * drawW +
				(pulseProgress - 0.5) * drawW * 0.6
			: margin - 100 + pulseProgress * (drawW + 200);
	const sigma = pulseOriginNorm !== undefined ? 130 : 95;
	const twoSigmaSq = 2 * sigma * sigma;

	canvasCtx.strokeStyle = "rgba(48,52,52,0.5)";
	canvasCtx.setLineDash([2, 6]);
	canvasCtx.lineWidth = 1;
	canvasCtx.beginPath();
	canvasCtx.moveTo(0, midY);
	canvasCtx.lineTo(w, midY);
	canvasCtx.stroke();
	canvasCtx.setLineDash([]);

	const xs = new Float32Array(n);
	const vs = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const x = margin + (i / (n - 1)) * drawW;
		const dist = pulseStrength > 0.01 ? Math.abs(x - pulseX) : Infinity;
		const bump =
			pulseStrength > 0.01 && dist < 260
				? 1 +
					0.18 * pulseStrength * Math.exp(-(dist * dist) / twoSigmaSq)
				: 1;
		xs[i] = x;
		vs[i] = (points[i] ?? 0) * breath * bump;
	}

	drawWaveLine(canvasCtx, xs, vs, midY, amp, "top");
	drawWaveLine(canvasCtx, xs, vs, midY, amp, "bottom");
	drawPulseLine(
		canvasCtx,
		xs,
		vs,
		midY,
		amp,
		pulseStrength,
		pulseX,
		twoSigmaSq
	);
}

function drawWaveLine(
	canvasCtx: CanvasRenderingContext2D,
	xs: Float32Array,
	vs: Float32Array,
	midY: number,
	amp: number,
	side: "top" | "bottom"
) {
	canvasCtx.strokeStyle = "rgba(232,226,216,0.16)";
	canvasCtx.lineWidth = 1.1;
	canvasCtx.beginPath();

	for (let i = 0; i < xs.length; i++) {
		const x = xs[i] ?? 0;
		const value = vs[i] ?? 0;
		const direction = side === "top" ? -1 : 1;
		const y = midY + direction * amp * value * 0.5;
		if (i === 0) canvasCtx.moveTo(x, y);
		else canvasCtx.lineTo(x, y);
	}

	canvasCtx.stroke();
}

function drawPulseLine(
	canvasCtx: CanvasRenderingContext2D,
	xs: Float32Array,
	vs: Float32Array,
	midY: number,
	amp: number,
	pulseStrength: number,
	pulseX: number,
	twoSigmaSq: number
) {
	if (pulseStrength <= 0.01) return;

	canvasCtx.strokeStyle = "#F04436";
	canvasCtx.lineWidth = 1.3;

	for (let i = 0; i < xs.length - 1; i++) {
		const x1 = xs[i] ?? 0;
		const x2 = xs[i + 1] ?? 0;
		const v1 = vs[i] ?? 0;
		const v2 = vs[i + 1] ?? 0;
		const mid = (x1 + x2) * 0.5;
		const dist = Math.abs(mid - pulseX);
		if (dist > 240) continue;

		const alpha =
			pulseStrength * 0.22 * Math.exp(-(dist * dist) / twoSigmaSq);
		if (alpha < 0.012) continue;

		canvasCtx.globalAlpha = alpha;
		drawPulseSegment(
			canvasCtx,
			x1,
			x2,
			midY - amp * v1 * 0.5,
			midY - amp * v2 * 0.5
		);
		drawPulseSegment(
			canvasCtx,
			x1,
			x2,
			midY + amp * v1 * 0.5,
			midY + amp * v2 * 0.5
		);
	}

	canvasCtx.globalAlpha = 1;
}

function drawPulseSegment(
	canvasCtx: CanvasRenderingContext2D,
	x1: number,
	x2: number,
	y1: number,
	y2: number
) {
	canvasCtx.beginPath();
	canvasCtx.moveTo(x1, y1);
	canvasCtx.lineTo(x2, y2);
	canvasCtx.stroke();
}
