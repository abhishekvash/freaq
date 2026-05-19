<script setup lang="ts">
import { createWaveEnvelope } from "~/utils/waveform";
const props = withDefaults(
	defineProps<{
		height?: number;
		density?: number;
		seed?: number;
		variant?: "accent" | "hairline";
	}>(),
	{
		height: 140,
		density: 320,
		seed: 0x47a7,
		variant: "accent",
	}
);

const points = computed(() => {
	return createWaveEnvelope({ density: props.density, seed: props.seed });
});

function createWavePoints(side: "top" | "bottom"): string {
	return points.value
		.map((value, index) => {
			const x = (index / (points.value.length - 1)) * 1000;
			const halfHeight = props.height / 2;
			const y =
				side === "top"
					? halfHeight * (1 - value) + 0.5
					: halfHeight + halfHeight * value - 0.5;

			return `${x.toFixed(2)},${y.toFixed(2)}`;
		})
		.join(" ");
}

const top = computed(() => {
	return createWavePoints("top");
});

const bottom = computed(() => {
	return createWavePoints("bottom");
});

const body = computed(() => {
	const bottomReversed = bottom.value.split(" ").reverse().join(" ");
	return `${top.value} ${bottomReversed}`;
});

const stroke = computed(() =>
	props.variant === "accent" ? "var(--freaq-accent)" : "var(--freaq-line)"
);
</script>

<template>
	<div
		class="relative w-full overflow-hidden"
		:style="{
			height: height + 'px',
			maskImage:
				'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
			WebkitMaskImage:
				'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
		}"
		aria-hidden="true"
	>
		<svg
			:viewBox="`0 0 1000 ${height}`"
			preserveAspectRatio="none"
			class="absolute inset-0 h-full w-full"
		>
			<polygon
				:points="body"
				:fill="stroke"
				fill-opacity="0.1"
				stroke="none"
			/>
			<line
				x1="0"
				:y1="height / 2"
				x2="1000"
				:y2="height / 2"
				:stroke="'var(--freaq-line)'"
				stroke-width="1"
				stroke-dasharray="2 6"
			/>
			<polyline
				:points="top"
				fill="none"
				:stroke="stroke"
				stroke-opacity="0.78"
				stroke-width="1.2"
				stroke-linejoin="round"
				stroke-linecap="round"
			/>
			<polyline
				:points="bottom"
				fill="none"
				:stroke="stroke"
				stroke-opacity="0.78"
				stroke-width="1.2"
				stroke-linejoin="round"
				stroke-linecap="round"
			/>
		</svg>
	</div>
</template>
