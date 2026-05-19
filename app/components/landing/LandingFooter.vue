<script setup lang="ts">
import { useLandingReveal } from "~/composables/landing/useLandingReveal";

const footerRef = ref<HTMLElement>();
const { addRevealTarget } = useLandingReveal();

addRevealTarget(() => footerRef.value, { y: 14, duration: 0.5 });
</script>

<template>
	<footer
		ref="footerRef"
		class="landing-motion-hidden border-t border-line-dark motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
	>
		<div class="mx-auto max-w-7xl px-field py-section sm:px-panel">
			<UiFreaqBrand mark-class="size-2" text-class="text-lg" />
			<p class="mt-field max-w-[44ch] text-body text-muted-dark">
				A sealed-seed ritual for music producers who want constraint,
				consequence, and a circle that listens.
			</p>
		</div>
	</footer>
</template>
