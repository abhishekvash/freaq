<script setup lang="ts">
const line1Ref = ref<HTMLElement>();
const line2Ref = ref<HTMLElement>();
const line3Ref = ref<HTMLElement>();
const scanlineRef = ref<HTMLElement>();
const bodyRef = ref<HTMLElement>();

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
		<span
			ref="line1Ref"
			class="landing-motion-hidden block will-change-[opacity,transform] motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
		>
			ONE SEED.
		</span>
		<span
			ref="line2Ref"
			class="landing-motion-hidden block will-change-[opacity,transform] motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
		>
			ONE CLOCK.
		</span>
		<span
			ref="line3Ref"
			class="landing-motion-hidden relative block text-accent-dark will-change-[opacity,transform] motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
		>
			<span class="relative z-10">ONE BOUNCE.</span>
			<span
				ref="scanlineRef"
				class="landing-hero-scanline pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
				aria-hidden="true"
			/>
		</span>
	</h1>

	<div
		ref="bodyRef"
		class="landing-hero-body landing-motion-hidden col-span-12 mt-section motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 lg:col-span-7"
	>
		<p class="max-w-[58ch] text-body text-muted-dark">
			Freaq is for music producers who want a deadline that bites. Every
			Friday the brief opens: one sealed seed, sixty minutes, one bounce.
			The circle hears it as it landed.
		</p>

		<div class="mt-panel flex flex-wrap items-center gap-field">
			<UiFreaqButton href="#join">ENTER THE CIRCLE</UiFreaqButton>
			<UiFreaqReadout class="text-accent-dark">
				· FIRST CIRCLE FORMING
			</UiFreaqReadout>
		</div>
	</div>
</template>

<style scoped>
.landing-hero-scanline {
	--landing-hero-scan-x: -10%;
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
</style>
