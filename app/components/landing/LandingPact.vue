<script setup lang="ts">
import { useLandingReveal } from "~/composables/landing/useLandingReveal";
import { LANDING_HERO_INTRO_COMPLETE_DELAY } from "~/composables/landing/useLandingHeroIntro";

type Channel = {
	stamp: string;
	stampState: "sealed" | "armed" | "final";
	title: string;
	body: string;
};

const channels: readonly Channel[] = [
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
] as const;

// ADR envelope geometry (viewBox 800x280). No sustain — decay falls through.
const ENVELOPE_POINTS = [
	{ x: 40, y: 232 }, // 0 — silence, pre-attack
	{ x: 220, y: 36 }, // 1 — attack peak (seed lands)
	{ x: 620, y: 196 }, // 2 — decay end (hour spent)
	{ x: 760, y: 232 }, // 3 — release silence (bounce printed)
] as const;

const ENVELOPE_PATH = ENVELOPE_POINTS.map(
	(p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`
).join(" ");

function segmentLength(
	a: { x: number; y: number },
	b: { x: number; y: number }
) {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

const SEGMENT_LENGTHS = [
	segmentLength(ENVELOPE_POINTS[0], ENVELOPE_POINTS[1]),
	segmentLength(ENVELOPE_POINTS[1], ENVELOPE_POINTS[2]),
	segmentLength(ENVELOPE_POINTS[2], ENVELOPE_POINTS[3]),
];
const TOTAL_LENGTH = SEGMENT_LENGTHS.reduce((acc, v) => acc + v, 0);

// Timing pads let the section settle before attack and hold after release.
const SCRUB_START_PAD = 0.08;
const SCRUB_END_PAD = 0.08;

// Scroll distribution inside the active animation window.
const ATTACK_SCROLL_END = 0.18;
const DECAY_SCROLL_END = 0.82;

// Path-length proportions at each phase boundary.
const ATTACK_PATH_END = SEGMENT_LENGTHS[0] / TOTAL_LENGTH;
const DECAY_PATH_END = (SEGMENT_LENGTHS[0] + SEGMENT_LENGTHS[1]) / TOTAL_LENGTH;

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
const prefersReducedMotion = ref(false);

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

const activeChannel = computed(() => channels[activeIndex.value]);

const playheadPosition = computed(() => {
	const target = remappedProgress.value * TOTAL_LENGTH;
	let acc = 0;
	for (let i = 0; i < SEGMENT_LENGTHS.length; i++) {
		const segLen = SEGMENT_LENGTHS[i];
		if (target <= acc + segLen) {
			const t = segLen === 0 ? 0 : (target - acc) / segLen;
			const a = ENVELOPE_POINTS[i];
			const b = ENVELOPE_POINTS[i + 1];
			return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
		}
		acc += segLen;
	}
	return ENVELOPE_POINTS[ENVELOPE_POINTS.length - 1];
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

	prefersReducedMotion.value = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	if (prefersReducedMotion.value) return;

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
	<section
		id="pact"
		ref="trackRef"
		class="pact-track"
		:data-mode="prefersReducedMotion ? 'static' : 'scrub'"
	>
		<!-- Scroll-scrubbed mode (default) -->
		<div v-if="!prefersReducedMotion" class="pact-stage">
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
						<Transition name="pact-fade" mode="out-in">
							<div :key="activeIndex" class="pact-stage__content">
								<span
									class="pact-stage__stamp"
									:data-state="activeChannel.stampState"
								>
									{{ activeChannel.stamp }}
								</span>
								<h3 class="pact-stage__title">
									{{ activeChannel.title }}
								</h3>
								<p class="pact-stage__body">
									{{ activeChannel.body }}
								</p>
							</div>
						</Transition>

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

		<!-- Reduced-motion fallback: static three-up -->
		<div
			v-else
			class="pact-static mx-auto max-w-7xl px-field pt-section pb-section sm:px-panel sm:pt-hero sm:pb-hero"
		>
			<h2
				ref="headerRef"
				class="max-w-[20ch] font-display text-title font-bold tracking-normal text-text-dark uppercase"
			>
				THE IDEA.
				<span class="text-accent-dark">CONSTRAINT AS INSTRUMENT.</span>
			</h2>

			<div class="pact-static__grid">
				<article
					v-for="(channel, index) in channels"
					:key="channel.stamp"
					class="pact-static__module"
				>
					<span
						class="pact-stage__stamp"
						:data-state="channel.stampState"
					>
						{{ channel.stamp }}
					</span>
					<svg
						class="pact-static__envelope"
						viewBox="0 0 200 80"
						preserveAspectRatio="xMidYMid meet"
						aria-hidden="true"
					>
						<line
							x1="0"
							y1="68"
							x2="200"
							y2="68"
							stroke="var(--freaq-line)"
							stroke-width="0.6"
							stroke-dasharray="2 4"
							opacity="0.55"
						/>
						<path
							d="M 14,64 L 56,10 L 154,54 L 184,64"
							fill="none"
							stroke="var(--freaq-line)"
							stroke-width="1.1"
							stroke-linejoin="round"
						/>
						<path
							:d="
								index === 0
									? 'M 14,64 L 56,10'
									: index === 1
										? 'M 56,10 L 154,54'
										: 'M 154,54 L 184,64'
							"
							fill="none"
							stroke="var(--freaq-accent)"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<h3 class="pact-stage__title pact-stage__title--static">
						{{ channel.title }}
					</h3>
					<p class="pact-stage__body">{{ channel.body }}</p>
				</article>
			</div>
		</div>
	</section>
</template>

<style scoped>
.pact-track {
	position: relative;
	border-bottom: 1px solid var(--freaq-line);
}

.pact-track[data-mode="scrub"] {
	min-height: 253vh;
	padding-bottom: 18vh;
}

.pact-stage {
	position: sticky;
	top: 4.5rem;
	display: flex;
	align-items: center;
	min-height: calc(82vh - 4.5rem);
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
	display: flex;
	flex-direction: column;
	min-height: 240px;
}

.pact-stage__content {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-field);
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
	letter-spacing: 0.16em;
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

.pact-stage__title--static {
	font-size: var(--text-subtitle);
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
	letter-spacing: 0.18em;
	color: var(--freaq-muted);
	font-variant-numeric: tabular-nums;
	text-transform: uppercase;
}

.pact-stage__progress-sep,
.pact-stage__progress-total {
	color: var(--freaq-dim);
}

/* Content swap transition */
.pact-fade-enter-active,
.pact-fade-leave-active {
	transition:
		opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
		transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.pact-fade-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.pact-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Static fallback */
.pact-static__grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--spacing-panel);
	margin-top: var(--spacing-panel);
}

@media (min-width: 900px) {
	.pact-static__grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		margin-top: var(--spacing-section);
	}
}

.pact-static__module {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: var(--spacing-field);
	padding: var(--spacing-panel) 0;
	border-top: 1px solid var(--freaq-line);
}

@media (min-width: 900px) {
	.pact-static__module {
		border-top: 0;
		border-left: 1px solid var(--freaq-line);
		padding: 0 var(--spacing-panel);
	}

	.pact-static__module:first-child {
		border-left: 0;
		padding-left: 0;
	}

	.pact-static__module:last-child {
		padding-right: 0;
	}
}

.pact-static__envelope {
	width: 100%;
	max-width: 220px;
	height: auto;
}
</style>
