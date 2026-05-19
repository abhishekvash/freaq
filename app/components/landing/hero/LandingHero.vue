<script setup lang="ts">
import LandingHeroCanvas from "~/components/landing/hero/LandingHeroCanvas.vue";
import LandingHeroCopy from "~/components/landing/hero/LandingHeroCopy.vue";
import LandingHeroReadout from "~/components/landing/hero/LandingHeroReadout.vue";
import { useLandingHeroCanvas } from "~/composables/landing/useLandingHeroCanvas";
import { useLandingHeroIntro } from "~/composables/landing/useLandingHeroIntro";

interface LandingHeroCanvasExpose {
	canvasRef: HTMLCanvasElement | null;
}

interface LandingHeroCopyExpose {
	bodyRef: HTMLElement | null;
	line1Ref: HTMLElement | null;
	line2Ref: HTMLElement | null;
	line3Ref: HTMLElement | null;
	scanlineRef: HTMLElement | null;
}

interface LandingHeroReadoutExpose {
	bracketRef: HTMLElement | null;
	seg1Ref: HTMLElement | null;
	seg2Ref: HTMLElement | null;
	seg3Ref: HTMLElement | null;
}

const sectionRef = ref<HTMLElement | null>(null);
const canvasComponentRef = ref<LandingHeroCanvasExpose | null>(null);
const copyRef = ref<LandingHeroCopyExpose | null>(null);
const readoutRef = ref<LandingHeroReadoutExpose | null>(null);
const canvasRef = computed(() => canvasComponentRef.value?.canvasRef ?? null);
const { canvasReady, pulse, setupCanvas } = useLandingHeroCanvas(
	sectionRef,
	canvasRef
);

useLandingHeroIntro(
	{
		bracketRef: computed(() => readoutRef.value?.bracketRef ?? null),
		seg1Ref: computed(() => readoutRef.value?.seg1Ref ?? null),
		seg2Ref: computed(() => readoutRef.value?.seg2Ref ?? null),
		seg3Ref: computed(() => readoutRef.value?.seg3Ref ?? null),
		bodyRef: computed(() => copyRef.value?.bodyRef ?? null),
		line1Ref: computed(() => copyRef.value?.line1Ref ?? null),
		line2Ref: computed(() => copyRef.value?.line2Ref ?? null),
		line3Ref: computed(() => copyRef.value?.line3Ref ?? null),
		scanlineRef: computed(() => copyRef.value?.scanlineRef ?? null),
	},
	{ setupCanvas }
);

function handleHeroPointerDown(event: PointerEvent) {
	if (event.button !== undefined && event.button !== 0) return;

	const target = event.target as HTMLElement | null;
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
			class="relative mx-auto grid max-w-7xl grid-cols-12 gap-panel px-panel pt-section pb-hero"
		>
			<LandingHeroReadout ref="readoutRef" />
			<LandingHeroCopy ref="copyRef" />
		</div>
	</section>
</template>
