<script setup lang="ts">
import {
	useElementListRefs,
	useLandingReveal,
} from "~/composables/landing/useLandingReveal";

const pact = [
	{
		n: "01",
		title: "ONE SEALED SEED.",
		body: "Hit Start. The seed arrives sealed. Meet it cold, no pre-prep, no warm-up.",
	},
	{
		n: "02",
		title: "ONE CLOCK.",
		body: "Sixty minutes, counting down. Move with it, finish inside it, let the pressure sharpen the work.",
	},
	{
		n: "03",
		title: "ONE BOUNCE.",
		body: "Print the take you believe in. The bounce is final. The circle hears it as it landed.",
	},
] as const;

const headerRef = ref<HTMLElement | null>(null);
const { elements: pactItemRefs, setElementRef: setPactItemRef } =
	useElementListRefs();
const { addRevealTarget, revealList } = useLandingReveal();

addRevealTarget(() => headerRef.value, { y: 18 });
revealList(
	() => pactItemRefs.value,
	(index) => ({
		delay: index * 0.06,
		y: 24,
	})
);
</script>

<template>
	<section id="pact">
		<div class="mx-auto max-w-7xl px-panel pt-hero pb-hero">
			<h2
				ref="headerRef"
				class="max-w-[20ch] font-display text-title font-bold tracking-normal text-text-dark uppercase"
			>
				THE IDEA.
				<span class="text-accent-dark">CONSTRAINT AS INSTRUMENT.</span>
			</h2>

			<ol class="mt-section divide-y divide-line-dark">
				<li
					v-for="(item, i) in pact"
					:key="item.n"
					:ref="setPactItemRef(i)"
					class="pact-row group grid grid-cols-12 gap-panel py-panel first:pt-0 sm:py-section"
				>
					<span
						class="pact-numeral col-span-12 font-mono text-stagger-2 leading-[0.85] font-bold text-muted-dark tabular-nums sm:col-span-3"
					>
						{{ item.n }}
					</span>
					<div class="col-span-12 sm:col-span-9 lg:col-span-7">
						<h3
							class="font-display text-[clamp(1.7rem,3vw,2.6rem)] leading-[0.95] font-bold text-text-dark uppercase"
						>
							{{ item.title }}
						</h3>
						<p
							class="mt-field max-w-[44ch] text-body text-muted-dark"
						>
							{{ item.body }}
						</p>
					</div>
				</li>
			</ol>
		</div>
	</section>
</template>

<style scoped>
.pact-numeral {
	transition:
		color 320ms cubic-bezier(0.22, 1, 0.36, 1),
		text-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.pact-row:hover .pact-numeral,
.pact-row:focus-within .pact-numeral {
	color: var(--freaq-accent);
	text-shadow:
		0 0 18px rgba(240, 68, 54, 0.4),
		0 0 36px rgba(240, 68, 54, 0.18);
}

@media (prefers-reduced-motion: reduce) {
	.pact-numeral {
		transition: none !important;
	}
}
</style>
