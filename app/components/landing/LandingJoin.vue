<script setup lang="ts">
import { useLandingReveal } from "~/composables/landing/useLandingReveal";

const submitted = shallowRef(false);
const emailInputRef = ref<HTMLInputElement>();
const stampRef = ref<HTMLElement>();
const titleRef = ref<HTMLElement>();
const formRef = ref<HTMLElement>();
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
			<div
				ref="titleRef"
				class="landing-motion-hidden col-span-12 motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 lg:col-span-6"
			>
				<UiFreaqReadout class="text-muted-dark">
					OPEN CALL · FIRST CIRCLE
				</UiFreaqReadout>
				<h2
					class="mt-field font-display text-headline font-bold tracking-normal text-text-dark uppercase"
				>
					ENTER THE<br />CIRCLE.
				</h2>
			</div>

			<div
				ref="formRef"
				class="landing-motion-hidden col-span-12 mt-section motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-end lg:border-l lg:border-line-dark lg:pl-panel"
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
					<UiFreaqButton type="submit" class="px-panel">
						ENTER THE CIRCLE
					</UiFreaqButton>
				</form>

				<div
					v-else
					ref="stampRef"
					class="mt-panel"
					role="status"
					aria-live="polite"
				>
					<div
						class="signal-stamp-sheet relative overflow-hidden rounded-sm border border-success-dark bg-surface-dark p-field shadow-vessel-edge motion-reduce:animate-none"
					>
						<span
							class="signal-stamp-dot mr-inline mb-0.5 inline-block size-2 rounded-pill bg-success-dark align-middle motion-reduce:animate-none"
							aria-hidden="true"
						/>
						<p
							class="inline font-mono text-label font-semibold tracking-normal text-success-dark uppercase"
						>
							&gt; SIGNAL LOCKED.
						</p>
						<p
							class="mt-inline font-mono text-label leading-normal tracking-normal text-text-dark uppercase"
						>
							WATCH
							<span class="text-success-dark normal-case"
								>signal@freaq.club</span
							>
							FOR THE FIRST CALL.
						</p>
						<span
							class="signal-stamp-scan pointer-events-none absolute inset-0 mix-blend-screen motion-reduce:hidden"
							aria-hidden="true"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.signal-stamp-sheet {
	animation: stamp-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.signal-stamp-dot {
	box-shadow: 0 0 12px var(--freaq-success);
	animation: stamp-dot 1.8s ease-in-out infinite;
}

.signal-stamp-scan {
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
		box-shadow: 0 0 6px var(--freaq-success);
	}
	50% {
		opacity: 1;
		box-shadow: 0 0 14px var(--freaq-success);
	}
}
</style>
