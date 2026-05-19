<script setup lang="ts">
import { LANDING_HERO_READOUT_TEXT } from "~/composables/landing/useLandingHeroIntro";

const bracketRef = ref<HTMLElement | null>(null);
const seg1Ref = ref<HTMLElement | null>(null);
const seg2Ref = ref<HTMLElement | null>(null);
const seg3Ref = ref<HTMLElement | null>(null);

defineExpose({
	bracketRef,
	seg1Ref,
	seg2Ref,
	seg3Ref,
});
</script>

<template>
	<p
		class="landing-hero-readout col-span-12 font-mono text-label font-medium tracking-normal text-muted-dark uppercase"
	>
		<span ref="bracketRef" class="landing-hero-bracket text-accent-dark"
			>&gt;</span
		>
		<span ref="seg1Ref">{{ LANDING_HERO_READOUT_TEXT.seg1 }}</span
		><span ref="seg2Ref">{{ LANDING_HERO_READOUT_TEXT.seg2 }}</span
		><span ref="seg3Ref">{{ LANDING_HERO_READOUT_TEXT.seg3 }}</span>
	</p>
</template>

<style scoped>
.landing-hero-bracket {
	display: inline-block;
	margin-right: 0.5ch;
}
</style>
