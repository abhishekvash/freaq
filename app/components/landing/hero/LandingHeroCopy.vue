<script setup lang="ts">
const line1Ref = ref<HTMLElement | null>(null);
const line2Ref = ref<HTMLElement | null>(null);
const line3Ref = ref<HTMLElement | null>(null);
const scanlineRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);

defineExpose({
	bodyRef,
	line1Ref,
	line2Ref,
	line3Ref,
	scanlineRef,
});
</script>

<template>
	<h1
		class="col-span-12 mt-field font-display text-headline font-bold tracking-normal text-text-dark uppercase lg:col-span-9"
	>
		<span ref="line1Ref" class="landing-hero-line block">ONE SEED.</span>
		<span ref="line2Ref" class="landing-hero-line block">ONE CLOCK.</span>
		<span
			ref="line3Ref"
			class="landing-hero-line relative block text-accent-dark"
		>
			<span class="relative z-10">ONE BOUNCE.</span>
			<span
				ref="scanlineRef"
				class="landing-hero-scanline"
				aria-hidden="true"
			/>
		</span>
	</h1>

	<div
		ref="bodyRef"
		class="landing-hero-body col-span-12 mt-section lg:col-span-7"
	>
		<p class="max-w-[58ch] text-body text-muted-dark">
			Freaq is for music producers who want a deadline that bites. Every
			Friday the brief opens: one sealed seed, sixty minutes, one bounce.
			The circle hears it as it landed.
		</p>

		<div class="mt-panel flex flex-wrap items-center gap-field">
			<FreaqButton href="#join">ENTER THE CIRCLE</FreaqButton>
			<FreaqReadout class="text-accent-dark">
				· FIRST CIRCLE FORMING
			</FreaqReadout>
		</div>
	</div>
</template>

<style scoped>
.landing-hero-line {
	will-change: opacity, transform;
}

.landing-hero-scanline {
	--landing-hero-scan-x: -10%;
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
}

.landing-hero-scanline::before {
	content: "";
	position: absolute;
	top: 4%;
	bottom: 4%;
	left: var(--landing-hero-scan-x);
	width: 4px;
	background: var(--color-text-dark);
	box-shadow:
		0 0 32px 4px var(--color-accent-dark),
		0 0 12px 2px var(--color-accent-dark),
		0 0 4px var(--color-text-dark);
	transform: translateX(-2px);
	mix-blend-mode: screen;
}

@media (prefers-reduced-motion: reduce) {
	.landing-hero-scanline {
		display: none;
	}
}
</style>
