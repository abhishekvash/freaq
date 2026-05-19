<script setup lang="ts">
import { createHeroStaticWave } from "~/utils/waveform";

defineProps<{
	canvasReady: boolean;
}>();

const staticWave = createHeroStaticWave();
const canvasRef = ref<HTMLCanvasElement | null>(null);

defineExpose({
	canvasRef,
});
</script>

<template>
	<canvas
		ref="canvasRef"
		aria-hidden="true"
		:class="[
			'landing-hero-canvas pointer-events-none absolute inset-0',
			canvasReady && 'landing-hero-canvas--ready',
		]"
	/>
	<svg
		:viewBox="staticWave.viewBox"
		preserveAspectRatio="none"
		aria-hidden="true"
		:class="[
			'landing-hero-static-wave pointer-events-none absolute inset-0 h-full w-full',
			canvasReady && 'landing-hero-static-wave--gone',
		]"
	>
		<line
			x1="0"
			:y1="staticWave.centerY"
			:x2="staticWave.width"
			:y2="staticWave.centerY"
			stroke="rgba(48,52,52,0.5)"
			stroke-width="1"
			stroke-dasharray="2 6"
			vector-effect="non-scaling-stroke"
		/>
		<polyline
			:points="staticWave.top"
			fill="none"
			stroke="rgba(232,226,216,0.16)"
			stroke-width="1.1"
			vector-effect="non-scaling-stroke"
		/>
		<polyline
			:points="staticWave.bot"
			fill="none"
			stroke="rgba(232,226,216,0.16)"
			stroke-width="1.1"
			vector-effect="non-scaling-stroke"
		/>
	</svg>
</template>

<style scoped>
.landing-hero-canvas {
	width: 100%;
	height: 100%;
	opacity: 0;
	transition: opacity 320ms ease-out;
}

.landing-hero-canvas--ready {
	opacity: 1;
}

.landing-hero-static-wave {
	transition: opacity 320ms ease-out;
}

.landing-hero-static-wave--gone {
	opacity: 0;
}
</style>
