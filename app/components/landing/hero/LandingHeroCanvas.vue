<script setup lang="ts">
import { createHeroStaticWave } from "~/utils/waveform";

defineProps<{
	canvasReady: boolean;
}>();

const staticWave = createHeroStaticWave();
const canvasRef = ref<HTMLCanvasElement>();

defineExpose({
	canvasRef,
});
</script>

<template>
	<canvas
		ref="canvasRef"
		aria-hidden="true"
		:class="[
			'pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 ease-out',
			canvasReady && 'opacity-100',
		]"
	/>
	<svg
		:viewBox="staticWave.viewBox"
		preserveAspectRatio="none"
		aria-hidden="true"
		:class="[
			'pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ease-out',
			canvasReady && 'opacity-0',
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
