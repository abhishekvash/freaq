<script setup lang="ts">
import { LANDING_HERO_READOUT_TEXT } from "~/composables/landing/useLandingHeroIntro";

const readoutRef = ref<HTMLElement>();
const bracketRef = ref<HTMLElement>();
const seg1Ref = ref<HTMLElement>();
const seg2Ref = ref<HTMLElement>();
const seg3Ref = ref<HTMLElement>();

defineExpose({
	readoutRef,
	bracketRef,
	seg1Ref,
	seg2Ref,
	seg3Ref,
});
</script>

<template>
	<p
		ref="readoutRef"
		aria-label="FREAQ.CLUB SIGNAL CHECK CIRCLE FORMING"
		class="landing-hero-readout landing-motion-hidden col-span-12 font-mono text-label font-medium tracking-normal text-muted-dark uppercase motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
	>
		<span ref="bracketRef" class="mr-inline inline-block text-accent-dark"
			>&gt;</span
		>
		<span ref="seg1Ref">{{ LANDING_HERO_READOUT_TEXT.seg1 }}</span
		><span ref="seg2Ref">{{ LANDING_HERO_READOUT_TEXT.seg2 }}</span
		><span ref="seg3Ref">{{ LANDING_HERO_READOUT_TEXT.seg3 }}</span>
	</p>
</template>
