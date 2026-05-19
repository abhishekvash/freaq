<script setup lang="ts">
import { useLandingReveal } from "~/composables/landing/useLandingReveal";
import { LANDING_HERO_INTRO_COMPLETE_DELAY } from "~/composables/landing/useLandingHeroIntro";

type Channel = {
	stamp: string;
	stampState: "sealed" | "armed" | "final";
	title: string;
	body: string;
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

const trackRef = ref<HTMLElement>();
const headerRef = ref<HTMLElement>();
const { activeIndex, dashOffset, envelopePath, playheadPosition, totalLength } =
	useLandingPactScroll(trackRef);
const formattedTotal = computed(() =>
	String(channels.length).padStart(2, "0")
);

const { addRevealTarget } = useLandingReveal();
addRevealTarget(() => headerRef.value, {
	delay: LANDING_HERO_INTRO_COMPLETE_DELAY,
	delayFromMount: true,
	y: 18,
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
								:d="envelopePath"
								fill="none"
								stroke="var(--freaq-line)"
								stroke-width="1.4"
								stroke-linejoin="round"
							/>

							<!-- Played portion (accent), revealed by dash offset -->
							<path
								:d="envelopePath"
								fill="none"
								stroke="var(--freaq-accent)"
								stroke-width="2.8"
								stroke-linecap="round"
								stroke-linejoin="round"
								:stroke-dasharray="totalLength"
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
								<span class="pact-stage__progress-total">
									{{ formattedTotal }}
								</span>
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

:global(html:not(.js)) .pact-track {
	min-height: auto;
	padding-bottom: 0;
}

:global(html:not(.js)) .pact-stage {
	position: relative;
	top: auto;
	min-height: auto;
	padding-block: var(--spacing-section);
}

:global(html:not(.js)) .pact-stage__content-wrap {
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--spacing-panel);
	min-height: auto;
}

:global(html:not(.js)) .pact-stage__content {
	position: relative;
	inset: auto;
	padding: var(--spacing-panel) 0;
	border-top: 1px solid var(--freaq-line);
	opacity: 1;
	pointer-events: auto;
	transform: none;
	transition: none;
}

:global(html:not(.js)) .pact-stage__title {
	font-size: var(--text-subtitle);
}

:global(html:not(.js)) .pact-stage__progress {
	display: none;
}

@media (min-width: 900px) {
	:global(html:not(.js)) .pact-stage {
		padding-block: var(--spacing-hero);
	}

	:global(html:not(.js)) .pact-stage__content-wrap {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	:global(html:not(.js)) .pact-stage__content {
		border-top: 0;
		border-left: 1px solid var(--freaq-line);
		padding: 0 var(--spacing-panel);
	}

	:global(html:not(.js)) .pact-stage__content:first-child {
		border-left: 0;
		padding-left: 0;
	}

	:global(html:not(.js)) .pact-stage__content:last-child {
		padding-right: 0;
	}
}
</style>
