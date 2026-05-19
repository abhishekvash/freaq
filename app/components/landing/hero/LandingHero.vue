<script setup lang="ts">
import LandingHeroCanvas from "~/components/landing/hero/LandingHeroCanvas.vue";
import LandingHeroCopy from "~/components/landing/hero/LandingHeroCopy.vue";
import LandingHeroReadout from "~/components/landing/hero/LandingHeroReadout.vue";
import { useLandingHeroCanvas } from "~/composables/landing/useLandingHeroCanvas";
import { useLandingHeroIntro } from "~/composables/landing/useLandingHeroIntro";

type LandingHeroCanvasExpose = {
	canvasRef: HTMLCanvasElement | undefined;
};

type LandingHeroCopyExpose = {
	bodyRef: HTMLElement | undefined;
	line1Ref: HTMLElement | undefined;
	line2Ref: HTMLElement | undefined;
	line3Ref: HTMLElement | undefined;
	scanlineRef: HTMLElement | undefined;
};

type LandingHeroReadoutExpose = {
	readoutRef: HTMLElement | undefined;
	bracketRef: HTMLElement | undefined;
	seg1Ref: HTMLElement | undefined;
	seg2Ref: HTMLElement | undefined;
	seg3Ref: HTMLElement | undefined;
};

const sectionRef = ref<HTMLElement>();
const canvasComponentRef = ref<LandingHeroCanvasExpose>();
const copyRef = ref<LandingHeroCopyExpose>();
const readoutRef = ref<LandingHeroReadoutExpose>();
const canvasRef = computed(() => canvasComponentRef.value?.canvasRef);
const { canvasReady, pulse, setupCanvas } = useLandingHeroCanvas(
	sectionRef,
	canvasRef
);

useLandingHeroIntro(
	{
		readoutRef: computed(() => readoutRef.value?.readoutRef),
		bracketRef: computed(() => readoutRef.value?.bracketRef),
		seg1Ref: computed(() => readoutRef.value?.seg1Ref),
		seg2Ref: computed(() => readoutRef.value?.seg2Ref),
		seg3Ref: computed(() => readoutRef.value?.seg3Ref),
		bodyRef: computed(() => copyRef.value?.bodyRef),
		line1Ref: computed(() => copyRef.value?.line1Ref),
		line2Ref: computed(() => copyRef.value?.line2Ref),
		line3Ref: computed(() => copyRef.value?.line3Ref),
		scanlineRef: computed(() => copyRef.value?.scanlineRef),
	},
	{ setupCanvas }
);

function handleHeroPointerDown(event: PointerEvent) {
	if (event.button !== undefined && event.button !== 0) return;

	const target = event.target as HTMLElement | undefined;
	if (
		target?.closest("a, button, input, label, [data-landing-hero-no-pulse]")
	) {
		return;
	}

	pulse(event.clientX);
}
</script>

<template>
	<section
		id="top"
		ref="sectionRef"
		class="landing-hero relative isolate overflow-hidden"
		@pointerdown="handleHeroPointerDown"
	>
		<LandingHeroCanvas
			ref="canvasComponentRef"
			:canvas-ready="canvasReady"
		/>

		<div
			class="relative mx-auto grid max-w-7xl grid-cols-12 gap-field px-field pt-panel pb-section sm:gap-panel sm:px-panel sm:pt-section sm:pb-hero"
		>
			<LandingHeroReadout ref="readoutRef" />
			<LandingHeroCopy ref="copyRef" />
		</div>
	</section>
</template>
