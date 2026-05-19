<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const sectionRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const staticWaveRef = ref<SVGElement | null>(null);

const bracketRef = ref<HTMLElement | null>(null);
const seg1Ref = ref<HTMLElement | null>(null);
const seg2Ref = ref<HTMLElement | null>(null);
const seg3Ref = ref<HTMLElement | null>(null);

const line1Ref = ref<HTMLElement | null>(null);
const line2Ref = ref<HTMLElement | null>(null);
const line3Ref = ref<HTMLElement | null>(null);
const scanlineRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);

const canvasReady = ref(false);

const TEXT = {
	seg1: "FREAQ.CLUB",
	seg2: " // SIGNAL CHECK",
	seg3: " // CIRCLE FORMING",
} as const;

const staticWave = (() => {
	let a = 0x4711;
	const rand = () => {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	const n = 240;
	const W = 1600;
	const H = 480;
	const midY = H * 0.52;
	const ampHalf = midY * 0.84 * 0.5;
	const breathBase = 0.94;
	const top: string[] = [];
	const bot: string[] = [];
	for (let i = 0; i < n; i++) {
		const x = i / (n - 1);
		const breath =
			0.55 +
			0.45 * Math.sin(x * Math.PI * 3.7) * Math.cos(x * Math.PI * 1.3);
		const noise = (rand() - 0.5) * 0.42;
		const tail = 1 - Math.pow(Math.abs(x - 0.5) * 2, 2.6);
		const v = Math.max(
			0.04,
			Math.min(1, Math.abs(breath + noise) * Math.max(0.2, tail))
		);
		const px = (i / (n - 1)) * W;
		const peak = v * breathBase;
		top.push(`${px.toFixed(1)},${(midY - ampHalf * peak).toFixed(1)}`);
		bot.push(`${px.toFixed(1)},${(midY + ampHalf * peak).toFixed(1)}`);
	}
	return {
		viewBox: `0 0 ${W} ${H}`,
		width: W,
		centerY: midY,
		top: top.join(" "),
		bot: bot.join(" "),
	};
})();

let canvasRaf: number | undefined;
let cleanupFns: Array<() => void> = [];
let firePulse: ((originXPage?: number) => void) | null = null;

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

	const mulberry32 = (seed: number) => {
		let a = seed;
		return () => {
			let t = (a += 0x6d2b79f5);
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	};

	function rebuildEnvelope() {
		const rand = mulberry32(0x4711);
		const n = 240;
		points.length = 0;
		for (let i = 0; i < n; i++) {
			const x = i / (n - 1);
			const breath =
				0.55 +
				0.45 *
					Math.sin(x * Math.PI * 3.7) *
					Math.cos(x * Math.PI * 1.3);
			const noise = (rand() - 0.5) * 0.42;
			const tail = 1 - Math.pow(Math.abs(x - 0.5) * 2, 2.6);
			const v = Math.max(
				0.04,
				Math.min(1, Math.abs(breath + noise) * Math.max(0.2, tail))
			);
			points.push(v);
		}
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
	let pulseOriginNorm: number | null = null;

	firePulse = (originXPage) => {
		const rect = sectionEl.getBoundingClientRect();
		if (typeof originXPage === "number" && rect.width > 0) {
			pulseOriginNorm = Math.max(
				0,
				Math.min(1, (originXPage - rect.left) / rect.width)
			);
		} else {
			pulseOriginNorm = null;
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
		const p = Math.max(0, Math.min(1, -rect.top / range));
		scrollProgress = p;
	}

	function frame() {
		canvasRaf = requestAnimationFrame(frame);
		if (!inView) return;

		updateScrollProgress();

		canvasCtx.clearRect(0, 0, w, h);

		const now = performance.now();
		const t = now * 0.001;
		const drift =
			0.93 + 0.008 * Math.sin(t * 1.4) + 0.006 * Math.sin(t * 2.1 + 1.7);
		const beatPhase = (t * 1.55) % 1;
		const beat = Math.pow(Math.max(0, 1 - beatPhase * 2), 2.5) * 0.028;
		const offbeatPhase = (beatPhase + 0.5) % 1;
		const offbeat =
			Math.pow(Math.max(0, 1 - offbeatPhase * 2.4), 2.5) * 0.013;
		const breath = drift + beat + offbeat;
		const compress = 1 - scrollProgress * 0.22;
		const midY = h * 0.52;
		const margin = (w * (1 - compress)) / 2;
		const drawW = w - margin * 2;
		const n = points.length;
		const amp = midY * 0.84;

		if (now - lastPulseStart > pulseDuration + nextPulseGap) {
			lastPulseStart = now;
			nextPulseGap = 4500 + Math.random() * 2000;
		}
		const pulseT = now - lastPulseStart;
		const pulseActive = pulseT >= 0 && pulseT < pulseDuration;
		const pulseProgress = pulseActive ? pulseT / pulseDuration : 0;
		const pulseStrength = pulseActive
			? Math.sin(pulseProgress * Math.PI)
			: 0;
		let pulseX: number;
		if (pulseOriginNorm !== null) {
			const sweep = (pulseProgress - 0.5) * drawW * 0.6;
			pulseX = margin + pulseOriginNorm * drawW + sweep;
		} else {
			pulseX = margin - 100 + pulseProgress * (drawW + 200);
		}
		if (!pulseActive) pulseOriginNorm = null;
		const sigma = pulseOriginNorm !== null ? 130 : 95;
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
						0.18 *
							pulseStrength *
							Math.exp(-(dist * dist) / twoSigmaSq)
					: 1;
			xs[i] = x;
			vs[i] = (points[i] ?? 0) * breath * bump;
		}

		canvasCtx.strokeStyle = "rgba(232,226,216,0.16)";
		canvasCtx.lineWidth = 1.1;
		canvasCtx.beginPath();
		for (let i = 0; i < n; i++) {
			const x = xs[i] ?? 0;
			const value = vs[i] ?? 0;
			const y = midY - amp * value * 0.5;
			if (i === 0) canvasCtx.moveTo(x, y);
			else canvasCtx.lineTo(x, y);
		}
		canvasCtx.stroke();
		canvasCtx.beginPath();
		for (let i = 0; i < n; i++) {
			const x = xs[i] ?? 0;
			const value = vs[i] ?? 0;
			const y = midY + amp * value * 0.5;
			if (i === 0) canvasCtx.moveTo(x, y);
			else canvasCtx.lineTo(x, y);
		}
		canvasCtx.stroke();

		if (pulseStrength > 0.01) {
			canvasCtx.strokeStyle = "#F04436";
			canvasCtx.lineWidth = 1.3;
			for (let i = 0; i < n - 1; i++) {
				const x1 = xs[i] ?? 0;
				const x2 = xs[i + 1] ?? 0;
				const v1 = vs[i] ?? 0;
				const v2 = vs[i + 1] ?? 0;
				const mid = (x1 + x2) * 0.5;
				const dist = Math.abs(mid - pulseX);
				if (dist > 240) continue;
				const alpha =
					pulseStrength *
					0.22 *
					Math.exp(-(dist * dist) / twoSigmaSq);
				if (alpha < 0.012) continue;
				canvasCtx.globalAlpha = alpha;
				canvasCtx.beginPath();
				canvasCtx.moveTo(x1, midY - amp * v1 * 0.5);
				canvasCtx.lineTo(x2, midY - amp * v2 * 0.5);
				canvasCtx.stroke();
				canvasCtx.beginPath();
				canvasCtx.moveTo(x1, midY + amp * v1 * 0.5);
				canvasCtx.lineTo(x2, midY + amp * v2 * 0.5);
				canvasCtx.stroke();
			}
			canvasCtx.globalAlpha = 1;
		}

		if (!firstFrameDone) {
			firstFrameDone = true;
			canvasReady.value = true;
		}
	}

	canvasRaf = requestAnimationFrame(frame);
	cleanupFns.push(() => {
		if (canvasRaf) cancelAnimationFrame(canvasRaf);
		canvasRaf = undefined;
		firePulse = null;
	});
}

function handleVaultPointerDown(event: PointerEvent) {
	if (event.button !== undefined && event.button !== 0) return;
	const target = event.target as HTMLElement | null;
	if (target?.closest("a, button, input, label, [data-vault-no-pulse]"))
		return;
	firePulse?.(event.clientX);
}

onMounted(async () => {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	const setStaggerFinal = () => {
		[line1Ref, line2Ref, line3Ref, bodyRef].forEach((r) => {
			if (!r.value) return;
			r.value.style.opacity = "1";
			r.value.style.transform = "none";
		});
	};

	if (prefersReducedMotion) {
		setStaggerFinal();
		return;
	}

	setupCanvas();
	[line1Ref, line2Ref, line3Ref, bodyRef].forEach((r) => {
		if (!r.value) return;
		r.value.style.opacity = "0";
		r.value.style.transform = "translateY(0.6em)";
	});
	[seg1Ref, seg2Ref, seg3Ref].forEach((r) => {
		if (r.value) r.value.textContent = "";
	});

	const [motionMod, gsapMod] = await Promise.all([
		import("motion"),
		import("gsap"),
	]);
	const animateElement = motionMod.animate as (
		element: Element,
		keyframes: Record<string, unknown>,
		options?: Record<string, unknown>
	) => unknown;
	const gsap = gsapMod.gsap;
	const { TextPlugin } = await import("gsap/TextPlugin");
	gsap.registerPlugin(TextPlugin);

	const tl = gsap.timeline();

	const segments = [
		{ ref: seg1Ref, text: TEXT.seg1 },
		{ ref: seg2Ref, text: TEXT.seg2 },
		{ ref: seg3Ref, text: TEXT.seg3 },
	] as const;

	let cursor = 0.05;
	segments.forEach((seg) => {
		if (!seg.ref.value) return;
		const dur = Math.max(0.1, seg.text.length * 0.028);
		tl.to(
			seg.ref.value,
			{
				duration: dur,
				text: { value: seg.text, delimiter: "" },
				ease: "none",
			},
			cursor
		);
		if (bracketRef.value) {
			tl.to(bracketRef.value, { duration: 0.06, opacity: 0.35 }, cursor);
			tl.to(
				bracketRef.value,
				{ duration: 0.18, opacity: 1 },
				cursor + 0.06
			);
		}
		cursor += dur + 0.05;
	});

	const spring = { type: "spring", stiffness: 320, damping: 28 };
	tl.add(() => {
		if (line1Ref.value)
			animateElement(line1Ref.value, { opacity: 1, y: 0 }, spring);
	}, 0.72);
	tl.add(() => {
		if (line2Ref.value)
			animateElement(line2Ref.value, { opacity: 1, y: 0 }, spring);
	}, 0.88);
	tl.add(() => {
		if (line3Ref.value)
			animateElement(line3Ref.value, { opacity: 1, y: 0 }, spring);
	}, 1.04);

	tl.fromTo(
		scanlineRef.value,
		{ "--vault-scan-x": "-10%" },
		{ "--vault-scan-x": "110%", duration: 0.6, ease: "expo.out" },
		1.26
	);

	tl.to(
		bodyRef.value,
		{ opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
		1.46
	);
});

onBeforeUnmount(() => {
	if (canvasRaf) cancelAnimationFrame(canvasRaf);
	cleanupFns.forEach((fn) => fn());
	cleanupFns = [];
});
</script>

<template>
	<section
		id="top"
		ref="sectionRef"
		class="vault relative isolate overflow-hidden"
		@pointerdown="handleVaultPointerDown"
	>
		<canvas
			ref="canvasRef"
			aria-hidden="true"
			:class="[
				'vault-canvas pointer-events-none absolute inset-0',
				canvasReady && 'vault-canvas--ready',
			]"
		/>
		<svg
			ref="staticWaveRef"
			:viewBox="staticWave.viewBox"
			preserveAspectRatio="none"
			aria-hidden="true"
			:class="[
				'vault-static-wave pointer-events-none absolute inset-0 h-full w-full',
				canvasReady && 'vault-static-wave--gone',
			]"
		>
			<line
				x1="0"
				:y1="staticWave.centerY"
				:x2="staticWave.width"
				:y2="staticWave.centerY"
				stroke="rgba(48,52,52,0.5)"
				stroke-width="1"
				stroke-dasharray="2 6"
				vector-effect="non-scaling-stroke"
			/>
			<polyline
				:points="staticWave.top"
				fill="none"
				stroke="rgba(232,226,216,0.16)"
				stroke-width="1.1"
				vector-effect="non-scaling-stroke"
			/>
			<polyline
				:points="staticWave.bot"
				fill="none"
				stroke="rgba(232,226,216,0.16)"
				stroke-width="1.1"
				vector-effect="non-scaling-stroke"
			/>
		</svg>

		<div
			class="relative mx-auto grid max-w-7xl grid-cols-12 gap-panel px-panel pt-section pb-hero"
		>
			<p
				class="vault-readout col-span-12 font-mono text-label font-medium tracking-normal text-muted-dark uppercase"
			>
				<span ref="bracketRef" class="vault-bracket text-accent-dark"
					>&gt;</span
				>
				<span ref="seg1Ref">{{ TEXT.seg1 }}</span
				><span ref="seg2Ref">{{ TEXT.seg2 }}</span
				><span ref="seg3Ref">{{ TEXT.seg3 }}</span>
			</p>

			<h1
				class="col-span-12 mt-field font-display text-headline font-bold tracking-normal text-text-dark uppercase lg:col-span-9"
			>
				<span ref="line1Ref" class="vault-line block">ONE SEED.</span>
				<span ref="line2Ref" class="vault-line block">ONE CLOCK.</span>
				<span
					ref="line3Ref"
					class="vault-line relative block text-accent-dark"
				>
					<span class="relative z-10">ONE BOUNCE.</span>
					<span
						ref="scanlineRef"
						class="vault-scanline"
						aria-hidden="true"
					/>
				</span>
			</h1>

			<div
				ref="bodyRef"
				class="vault-body col-span-12 mt-section lg:col-span-7"
			>
				<p class="max-w-[58ch] text-body text-muted-dark">
					Freaq is for music producers who want a deadline that bites.
					Every Friday the vault opens: one sealed seed, sixty
					minutes, one bounce. The circle hears it as it landed.
				</p>

				<div class="mt-panel flex flex-wrap items-center gap-field">
					<FreaqButton href="#join">ENTER THE CIRCLE</FreaqButton>
					<FreaqReadout class="text-accent-dark"
						>· FIRST CIRCLE FORMING</FreaqReadout
					>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.vault-canvas {
	width: 100%;
	height: 100%;
	opacity: 0;
	transition: opacity 320ms ease-out;
}

.vault-canvas--ready {
	opacity: 1;
}

.vault-static-wave {
	transition: opacity 320ms ease-out;
}

.vault-static-wave--gone {
	opacity: 0;
}

.vault-line {
	will-change: opacity, transform;
}

.vault-scanline {
	--vault-scan-x: -10%;
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
}

.vault-scanline::before {
	content: "";
	position: absolute;
	top: 4%;
	bottom: 4%;
	left: var(--vault-scan-x);
	width: 4px;
	background: var(--color-text-dark);
	box-shadow:
		0 0 32px 4px var(--color-accent-dark),
		0 0 12px 2px var(--color-accent-dark),
		0 0 4px var(--color-text-dark);
	transform: translateX(-2px);
	mix-blend-mode: screen;
}

.vault-bracket {
	display: inline-block;
	margin-right: 0.5ch;
}

@media (prefers-reduced-motion: reduce) {
	.vault-scanline {
		display: none;
	}
}
</style>
