<script setup lang="ts">
import { useLandingReveal } from "~/composables/landing/useLandingReveal";

const line1Ref = ref<HTMLElement>();
const line2Ref = ref<HTMLElement>();
const line3Ref = ref<HTMLElement>();
const bodyRef = ref<HTMLElement>();
const { addRevealTarget } = useLandingReveal();

addRevealTarget(() => line1Ref.value, { y: 26 });
addRevealTarget(() => line2Ref.value, { delay: 0.06, y: 26 });
addRevealTarget(() => line3Ref.value, { delay: 0.12, y: 26 });
addRevealTarget(() => bodyRef.value, { delay: 0.22, y: 18 });
</script>

<template>
	<section
		class="border-t border-line-dark bg-raised-dark shadow-vessel-edge"
	>
		<div class="mx-auto max-w-7xl px-panel py-hero">
			<p class="font-display font-bold tracking-normal uppercase">
				<span
					ref="line1Ref"
					class="landing-motion-hidden block text-stagger-1 text-muted-dark motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
				>
					The hand
				</span>
				<span
					ref="line2Ref"
					class="landing-motion-hidden block pl-[0.6em] text-stagger-2 text-text-dark motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
				>
					stays in
				</span>
				<span
					ref="line3Ref"
					class="landing-motion-hidden block pl-[1.4em] text-stagger-3 text-accent-dark motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
				>
					the machine.
				</span>
			</p>
			<p
				ref="bodyRef"
				class="landing-motion-hidden mt-section ml-auto max-w-[44ch] text-body text-muted-dark motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:text-right"
			>
				Freaq gives producers a focused circle, a real constraint, and a
				reason to finish the idea while it still has voltage.
			</p>
		</div>
	</section>
</template>
