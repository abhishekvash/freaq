<script setup lang="ts">
import { useLandingReveal } from "~/composables/landing/useLandingReveal";
import { LANDING_HERO_INTRO_COMPLETE_DELAY } from "~/composables/landing/useLandingHeroIntro";

type Channel = {
	stamp: string;
	stampState: "sealed" | "armed" | "final";
	title: string;
	body: string;
};

type EnvelopePoint = {
	x: number;
	y: number;
};

const channels = [
	{
		stamp: "SEALED",
		stampState: "sealed",
		title: "ATTACK.",
		body: "The seed arrives sealed. No pre-prep, no warm-up.",
	},
	{
		stamp: "60:00",
		stampState: "armed",
		title: "DECAY.",
		body: "Sixty minutes, counting down. Move with it. Let the pressure sharpen the work.",
	},
	{
		stamp: "FINAL",
		stampState: "final",
		title: "RELEASE.",
		body: "What you commit goes out as it landed. The circle hears it raw.",
	},
] as const satisfies readonly Channel[];

// ADR envelope geometry (viewBox 800x280). No sustain; decay falls through.
const ENVELOPE_POINTS = [
	{ x: 40, y: 232 }, // 0, silence, pre-attack
	{ x: 220, y: 36 }, // 1, attack peak (seed lands)
	{ x: 620, y: 196 }, // 2, decay end (hour spent)
	{ x: 760, y: 232 }, // 3, release silence (bounce printed)
] as const satisfies readonly [
	EnvelopePoint,
	EnvelopePoint,
	EnvelopePoint,
	EnvelopePoint,
];

const ENVELOPE_PATH = ENVELOPE_POINTS.map(
	(p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`
).join(" ");

function segmentLength(
	a: { x: number; y: number },
	b: { x: number; y: number }
) {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

const ENVELOPE_SEGMENTS = [
	{
		from: ENVELOPE_POINTS[0],
		to: ENVELOPE_POINTS[1],
		length: segmentLength(ENVELOPE_POINTS[0], ENVELOPE_POINTS[1]),
	},
	{
		from: ENVELOPE_POINTS[1],
		to: ENVELOPE_POINTS[2],
		length: segmentLength(ENVELOPE_POINTS[1], ENVELOPE_POINTS[2]),
	},
	{
		from: ENVELOPE_POINTS[2],
		to: ENVELOPE_POINTS[3],
		length: segmentLength(ENVELOPE_POINTS[2], ENVELOPE_POINTS[3]),
	},
] as const;
const TOTAL_LENGTH = ENVELOPE_SEGMENTS.reduce((acc, segment) => {
	return acc + segment.length;
}, 0);

// Timing pads let the section settle before attack and hold after release.
const SCRUB_START_PAD = 0.08;
const SCRUB_END_PAD = 0.08;

// Scroll distribution inside the active animation window.
const ATTACK_SCROLL_END = 0.18;
const DECAY_SCROLL_END = 0.82;

// Path-length proportions at each phase boundary.
const ATTACK_PATH_END = ENVELOPE_SEGMENTS[0].length / TOTAL_LENGTH;
const DECAY_PATH_END =
	(ENVELOPE_SEGMENTS[0].length + ENVELOPE_SEGMENTS[1].length) / TOTAL_LENGTH;

function remapScroll(s: number) {
	const activeSpan = 1 - SCRUB_START_PAD - SCRUB_END_PAD;
	const clamped = Math.max(
		0,
		Math.min(1, (s - SCRUB_START_PAD) / activeSpan)
	);
	if (clamped <= ATTACK_SCROLL_END) {
		const t = clamped / ATTACK_SCROLL_END;
		return t * ATTACK_PATH_END;
	}
	if (clamped <= DECAY_SCROLL_END) {
		const t =
			(clamped - ATTACK_SCROLL_END) /
			(DECAY_SCROLL_END - ATTACK_SCROLL_END);
		return ATTACK_PATH_END + t * (DECAY_PATH_END - ATTACK_PATH_END);
	}
	const t = (clamped - DECAY_SCROLL_END) / (1 - DECAY_SCROLL_END);
	return DECAY_PATH_END + t * (1 - DECAY_PATH_END);
}

const trackRef = ref<HTMLElement>();
const headerRef = ref<HTMLElement>();
const scrollProgress = ref(0);

const remappedProgress = computed(() => remapScroll(scrollProgress.value));

const activeIndex = computed(() => {
	const activeSpan = 1 - SCRUB_START_PAD - SCRUB_END_PAD;
	const s = Math.max(
		0,
		Math.min(1, (scrollProgress.value - SCRUB_START_PAD) / activeSpan)
	);
	if (s < ATTACK_SCROLL_END) return 0;
	if (s < DECAY_SCROLL_END) return 1;
	return 2;
});

const playheadPosition = computed(() => {
	const target = remappedProgress.value * TOTAL_LENGTH;
	let acc = 0;
	for (const segment of ENVELOPE_SEGMENTS) {
		if (target <= acc + segment.length) {
			const t =
				segment.length === 0 ? 0 : (target - acc) / segment.length;
			return {
				x: segment.from.x + (segment.to.x - segment.from.x) * t,
				y: segment.from.y + (segment.to.y - segment.from.y) * t,
			};
		}
		acc += segment.length;
	}
	return ENVELOPE_POINTS[3];
});

const dashOffset = computed(() => TOTAL_LENGTH * (1 - remappedProgress.value));

const { addRevealTarget } = useLandingReveal();
addRevealTarget(() => headerRef.value, {
	delay: LANDING_HERO_INTRO_COMPLETE_DELAY,
	delayFromMount: true,
	y: 18,
});

onMounted(() => {
	if (typeof window === "undefined") return;

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	let raf = 0;

	function update() {
		if (!trackRef.value) return;
		const rect = trackRef.value.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const max = rect.height - viewportHeight;
		if (max <= 0) {
			scrollProgress.value = 0;
			return;
		}
		const scrolled = -rect.top;
		scrollProgress.value = Math.max(0, Math.min(1, scrolled / max));
	}

	function handler() {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(update);
	}

	update();
	window.addEventListener("scroll", handler, { passive: true });
	window.addEventListener("resize", handler, { passive: true });

	onBeforeUnmount(() => {
		cancelAnimationFrame(raf);
		window.removeEventListener("scroll", handler);
		window.removeEventListener("resize", handler);
	});
});
</script>

<template>
	<section id="pact" ref="trackRef" class="pact-track">
		<div class="pact-stage">
			<div
				class="pact-stage__inner mx-auto max-w-7xl px-field sm:px-panel"
			>
				<h2
					ref="headerRef"
					class="landing-motion-hidden max-w-[20ch] font-display text-title font-bold tracking-normal text-text-dark uppercase motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
				>
					THE IDEA.
					<span class="text-accent-dark"
						>CONSTRAINT AS INSTRUMENT.</span
					>
				</h2>

				<div class="pact-stage__grid">
					<div class="pact-stage__envelope-wrap">
						<svg
							class="pact-stage__envelope"
							viewBox="0 0 800 280"
							preserveAspectRatio="xMidYMid meet"
							aria-hidden="true"
						>
							<!-- Silence baseline -->
							<line
								x1="0"
								y1="248"
								x2="800"
								y2="248"
								stroke="var(--freaq-line)"
								stroke-width="1"
								stroke-dasharray="3 6"
								opacity="0.55"
							/>

							<!-- Full envelope (dim) -->
							<path
								:d="ENVELOPE_PATH"
								fill="none"
								stroke="var(--freaq-line)"
								stroke-width="1.4"
								stroke-linejoin="round"
							/>

							<!-- Played portion (accent), revealed by dash offset -->
							<path
								:d="ENVELOPE_PATH"
								fill="none"
								stroke="var(--freaq-accent)"
								stroke-width="2.8"
								stroke-linecap="round"
								stroke-linejoin="round"
								:stroke-dasharray="TOTAL_LENGTH"
								:stroke-dashoffset="dashOffset"
							/>

							<!-- Playhead -->
							<circle
								:cx="playheadPosition.x"
								:cy="playheadPosition.y"
								r="14"
								fill="none"
								stroke="var(--freaq-accent)"
								stroke-width="0.8"
								opacity="0.5"
							/>
							<circle
								:cx="playheadPosition.x"
								:cy="playheadPosition.y"
								r="6.5"
								fill="var(--freaq-accent)"
							/>
						</svg>
					</div>

					<div class="pact-stage__content-wrap">
						<article
							v-for="(channel, index) in channels"
							:key="channel.stamp"
							class="pact-stage__content"
							:data-active="index === activeIndex"
						>
							<span
								class="pact-stage__stamp"
								:data-state="channel.stampState"
							>
								{{ channel.stamp }}
							</span>
							<h3 class="pact-stage__title">
								{{ channel.title }}
							</h3>
							<p class="pact-stage__body">{{ channel.body }}</p>
						</article>

						<div class="pact-stage__progress" aria-hidden="true">
							<span
								v-for="(channel, i) in channels"
								:key="channel.stamp"
								class="pact-stage__progress-mark"
								:data-on="i <= activeIndex"
							/>
							<span class="pact-stage__progress-text">
								{{ String(activeIndex + 1).padStart(2, "0") }}
								<span class="pact-stage__progress-sep">/</span>
								<span class="pact-stage__progress-total"
									>03</span
								>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.pact-track {
	position: relative;
	border-bottom: 1px solid var(--freaq-line);
	min-height: 238vh;
	padding-bottom: 14vh;
}

.pact-stage {
	position: sticky;
	top: var(--spacing-section);
	display: flex;
	align-items: center;
	min-height: calc(82vh - var(--spacing-section));
	padding-block: var(--spacing-panel);
}

@media (min-width: 900px) {
	.pact-stage {
		padding-block: var(--spacing-section);
	}
}

.pact-stage__inner {
	width: 100%;
}

.pact-stage__grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--spacing-panel);
	margin-top: var(--spacing-panel);
}

@media (min-width: 900px) {
	.pact-stage__grid {
		grid-template-columns: 7fr 5fr;
		gap: var(--spacing-section);
		align-items: center;
		margin-top: var(--spacing-section);
	}
}

.pact-stage__envelope-wrap {
	position: relative;
}

.pact-stage__envelope {
	width: 100%;
	height: auto;
}

.pact-stage__content-wrap {
	position: relative;
	display: flex;
	flex-direction: column;
	min-height: 240px;
}

.pact-stage__content {
	position: absolute;
	inset: 0 auto auto 0;
	display: flex;
	flex-direction: column;
	gap: var(--spacing-field);
	width: 100%;
	opacity: 0;
	pointer-events: none;
	transform: translateY(10px);
	transition:
		opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
		transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.pact-stage__content[data-active="true"] {
	position: relative;
	opacity: 1;
	pointer-events: auto;
	transform: translateY(0);
}

.pact-stage__stamp {
	display: inline-flex;
	align-items: center;
	width: fit-content;
	padding: 4px 10px;
	border: 1px solid var(--freaq-line);
	border-radius: var(--radius-sm);
	font-family: var(--font-mono);
	font-size: var(--text-label);
	font-weight: 700;
	letter-spacing: 0;
	text-transform: uppercase;
	color: var(--freaq-muted);
}

.pact-stage__stamp[data-state="sealed"] {
	border-color: var(--freaq-line);
	color: var(--freaq-dim);
}

.pact-stage__stamp[data-state="armed"] {
	border-color: var(--freaq-accent);
	color: var(--freaq-accent);
}

.pact-stage__stamp[data-state="final"] {
	border-color: var(--freaq-accent);
	color: var(--freaq-accent);
	background: rgb(240 68 54 / 0.06);
}

.pact-stage__title {
	font-family: var(--font-display);
	font-size: var(--text-title);
	font-weight: 700;
	line-height: 0.92;
	letter-spacing: 0;
	text-transform: uppercase;
	color: var(--freaq-text);
	margin: 0;
}

.pact-stage__body {
	font-family: var(--font-sans);
	font-size: var(--text-body);
	line-height: 1.62;
	color: var(--freaq-muted);
	max-width: 44ch;
	margin: 0;
}

.pact-stage__progress {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-top: auto;
	padding-top: var(--spacing-panel);
}

.pact-stage__progress-mark {
	display: inline-block;
	width: 28px;
	height: 2px;
	background: var(--freaq-line);
	transition: background-color 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.pact-stage__progress-mark[data-on="true"] {
	background: var(--freaq-accent);
}

.pact-stage__progress-text {
	margin-left: 10px;
	font-family: var(--font-mono);
	font-size: var(--text-label);
	font-weight: 700;
	letter-spacing: 0;
	color: var(--freaq-muted);
	font-variant-numeric: tabular-nums;
	text-transform: uppercase;
}

.pact-stage__progress-sep,
.pact-stage__progress-total {
	color: var(--freaq-dim);
}

@media (prefers-reduced-motion: reduce) {
	.pact-track {
		min-height: auto;
		padding-bottom: 0;
	}

	.pact-stage {
		position: relative;
		top: auto;
		min-height: auto;
		padding-block: var(--spacing-section);
	}

	.pact-stage__content-wrap {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-panel);
		min-height: auto;
	}

	.pact-stage__content {
		position: relative;
		inset: auto;
		padding: var(--spacing-panel) 0;
		border-top: 1px solid var(--freaq-line);
		opacity: 1;
		pointer-events: auto;
		transform: none;
		transition: none;
	}

	.pact-stage__title {
		font-size: var(--text-subtitle);
	}

	.pact-stage__progress {
		display: none;
	}

	@media (min-width: 900px) {
		.pact-stage {
			padding-block: var(--spacing-hero);
		}

		.pact-stage__content-wrap {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.pact-stage__content {
			border-top: 0;
			border-left: 1px solid var(--freaq-line);
			padding: 0 var(--spacing-panel);
		}

		.pact-stage__content:first-child {
			border-left: 0;
			padding-left: 0;
		}

		.pact-stage__content:last-child {
			padding-right: 0;
		}
	}
}
</style>
