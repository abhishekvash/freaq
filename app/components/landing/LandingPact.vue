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

const headerRef = ref<HTMLElement>();
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
				class="landing-motion-hidden max-w-[20ch] font-display text-title font-bold tracking-normal text-text-dark uppercase motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
			>
				THE IDEA.
				<span class="text-accent-dark">CONSTRAINT AS INSTRUMENT.</span>
			</h2>

			<ol class="mt-section divide-y divide-line-dark">
				<li
					v-for="(item, i) in pact"
					:key="item.n"
					:ref="setPactItemRef(i)"
					class="pact-row landing-motion-hidden group grid grid-cols-12 gap-panel py-panel first:pt-0 motion-safe:translate-y-field motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:py-section"
				>
					<span
						class="col-span-12 font-mono text-stagger-2 leading-[0.85] font-bold text-muted-dark tabular-nums transition-[color,text-shadow] duration-300 ease-out group-focus-within:text-accent-dark group-hover:text-accent-dark group-hover:shadow-redline motion-reduce:transition-none sm:col-span-3"
					>
						{{ item.n }}
					</span>
					<div class="col-span-12 sm:col-span-9 lg:col-span-7">
						<h3
							class="font-display text-subtitle font-bold text-text-dark uppercase"
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
