<script setup lang="ts">
import { useLandingReveal } from "~/composables/landing/useLandingReveal";

const submitted = shallowRef(false);
const emailInputRef = ref<HTMLInputElement | null>(null);
const stampRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const formRef = ref<HTMLElement | null>(null);
const { addRevealTarget } = useLandingReveal();

addRevealTarget(() => titleRef.value, { y: 22 });
addRevealTarget(() => formRef.value, { delay: 0.1, y: 22 });

function handleSubmit() {
	if (submitted.value) return;
	submitted.value = true;
}
</script>

<template>
	<section id="join" class="border-t border-line-dark">
		<div
			class="mx-auto grid max-w-7xl grid-cols-12 gap-panel px-panel py-hero"
		>
			<div ref="titleRef" class="col-span-12 lg:col-span-6">
				<FreaqReadout class="text-muted-dark">
					OPEN CALL · FIRST CIRCLE
				</FreaqReadout>
				<h2
					class="mt-field font-display text-headline font-bold tracking-normal text-text-dark uppercase"
				>
					ENTER THE<br />CIRCLE.
				</h2>
			</div>

			<div
				ref="formRef"
				class="col-span-12 mt-section lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-end lg:border-l lg:border-line-dark lg:pl-panel"
			>
				<div
					v-if="!submitted"
					class="max-w-[52ch] space-y-field text-body text-muted-dark"
				>
					<p>
						I’m building Freaq solo. The platform isn’t live yet.
						The circle is the list of producers who’ll hear it
						first.
					</p>
					<p>
						Drop your email. One signal lands the day the brief
						opens.
					</p>
				</div>

				<form
					v-if="!submitted"
					class="mt-panel flex w-full flex-col gap-field sm:flex-row sm:items-stretch"
					@submit.prevent="handleSubmit"
				>
					<label class="sr-only" for="email">Email</label>
					<input
						id="email"
						ref="emailInputRef"
						type="email"
						required
						placeholder="your@email.com"
						class="min-h-11 flex-1 rounded-sm border border-line-dark bg-surface-dark px-field py-3 text-text-dark placeholder:text-dim-dark focus:border-accent-dark focus:outline-none"
					/>
					<FreaqButton type="submit" class="px-panel">
						ENTER THE CIRCLE
					</FreaqButton>
				</form>

				<div
					v-else
					ref="stampRef"
					class="signal-stamp mt-panel"
					role="status"
					aria-live="polite"
				>
					<div class="signal-stamp__sheet">
						<span class="signal-stamp__dot" aria-hidden="true" />
						<p class="signal-stamp__head">&gt; SIGNAL LOCKED.</p>
						<p class="signal-stamp__line">
							WATCH
							<span class="signal-stamp__addr"
								>signal@freaq.club</span
							>
							FOR THE FIRST CALL.
						</p>
						<span class="signal-stamp__scan" aria-hidden="true" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.signal-stamp {
	--stamp-color: var(--freaq-success);
}

.signal-stamp__sheet {
	position: relative;
	overflow: hidden;
	padding: 18px 20px 20px;
	border: 1px solid var(--stamp-color);
	border-radius: 4px;
	background: color-mix(
		in oklab,
		var(--stamp-color) 8%,
		var(--freaq-surface)
	);
	box-shadow: inset 0 1px 0 rgba(232, 226, 216, 0.06);
	animation: stamp-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.signal-stamp__dot {
	display: inline-block;
	width: 7px;
	height: 7px;
	margin-right: 10px;
	margin-bottom: 2px;
	border-radius: 999px;
	background: var(--stamp-color);
	box-shadow: 0 0 12px var(--stamp-color);
	animation: stamp-dot 1.8s ease-in-out infinite;
	vertical-align: middle;
}

.signal-stamp__head {
	display: inline;
	color: var(--stamp-color);
	font-family: var(--font-mono);
	font-size: 0.82rem;
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.signal-stamp__line {
	margin-top: 10px;
	color: var(--freaq-text);
	font-family: var(--font-mono);
	font-size: 0.82rem;
	line-height: 1.55;
	letter-spacing: 0.02em;
	text-transform: uppercase;
}

.signal-stamp__addr {
	color: var(--stamp-color);
	text-transform: none;
}

.signal-stamp__scan {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background: linear-gradient(
		90deg,
		transparent 0%,
		rgba(87, 183, 122, 0.18) 48%,
		rgba(232, 226, 216, 0.32) 50%,
		rgba(87, 183, 122, 0.18) 52%,
		transparent 100%
	);
	transform: translateX(-110%);
	animation: stamp-scan 720ms cubic-bezier(0.22, 1, 0.36, 1) 140ms both;
	mix-blend-mode: screen;
}

@keyframes stamp-in {
	0% {
		opacity: 0;
		transform: translateY(8px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes stamp-scan {
	0% {
		transform: translateX(-110%);
	}
	100% {
		transform: translateX(110%);
	}
}

@keyframes stamp-dot {
	0%,
	100% {
		opacity: 0.55;
		box-shadow: 0 0 6px var(--stamp-color);
	}
	50% {
		opacity: 1;
		box-shadow: 0 0 14px var(--stamp-color);
	}
}

@media (prefers-reduced-motion: reduce) {
	.signal-stamp__sheet,
	.signal-stamp__scan,
	.signal-stamp__dot {
		transition: none !important;
		animation: none !important;
		transform: none !important;
	}

	.signal-stamp__scan {
		display: none;
	}
}
</style>
