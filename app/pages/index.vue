<script setup lang="ts">
import { onMounted, ref } from "vue";

useHead({
	title: "FREAQ · One seed. One clock. One bounce.",
	meta: [
		{
			name: "description",
			content:
				"A sealed seed, sixty minutes, one bounce. A weekly Friday ritual for music producers who want a deadline that bites.",
		},
	],
});

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

const submitted = ref(false);
const emailInputRef = ref<HTMLInputElement | null>(null);
const stampRef = ref<HTMLElement | null>(null);

const pactHeaderRef = ref<HTMLElement | null>(null);
const pactItemRefs = ref<HTMLElement[]>([]);
const setPactItemRef =
	(index: number) => (el: Element | ComponentPublicInstance | null) => {
		if (el instanceof HTMLElement) pactItemRefs.value[index] = el;
	};
const mantraLine1Ref = ref<HTMLElement | null>(null);
const mantraLine2Ref = ref<HTMLElement | null>(null);
const mantraLine3Ref = ref<HTMLElement | null>(null);
const mantraBodyRef = ref<HTMLElement | null>(null);
const joinTitleRef = ref<HTMLElement | null>(null);
const joinFormRef = ref<HTMLElement | null>(null);
const footerRef = ref<HTMLElement | null>(null);

function handleSubmit() {
	if (submitted.value) return;
	submitted.value = true;
}

onMounted(async () => {
	if (typeof window === "undefined") return;

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;
	if (prefersReducedMotion) return;

	const { animate, inView } = await import("motion");

	const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

	function reveal(
		el: HTMLElement | null,
		opts: { delay?: number; y?: number; duration?: number } = {}
	) {
		if (!el) return;
		const y = opts.y ?? 22;
		el.style.opacity = "0";
		el.style.transform = `translate3d(0, ${y}px, 0)`;
		el.style.willChange = "opacity, transform";
		inView(
			el,
			() => {
				animate(
					el,
					{ opacity: 1, transform: "translate3d(0, 0, 0)" },
					{
						duration: opts.duration ?? 0.6,
						ease: easeOutQuart,
						delay: opts.delay ?? 0,
					}
				);
				return () => {
					el.style.willChange = "";
				};
			},
			{ amount: 0.18 }
		);
	}

	reveal(pactHeaderRef.value, { y: 18 });
	pactItemRefs.value.forEach((el, i) =>
		reveal(el, { delay: i * 0.06, y: 24 })
	);

	reveal(mantraLine1Ref.value, { y: 26 });
	reveal(mantraLine2Ref.value, { delay: 0.06, y: 26 });
	reveal(mantraLine3Ref.value, { delay: 0.12, y: 26 });
	reveal(mantraBodyRef.value, { delay: 0.22, y: 18 });

	reveal(joinTitleRef.value, { y: 22 });
	reveal(joinFormRef.value, { delay: 0.1, y: 22 });

	reveal(footerRef.value, { y: 14, duration: 0.5 });
});
</script>

<template>
	<div class="isolate min-h-screen bg-bg-dark text-text-dark antialiased">
		<header class="sticky top-0 z-10 border-b border-line-dark bg-bg-dark">
			<div
				class="mx-auto flex max-w-7xl items-center justify-between gap-panel px-panel py-field"
			>
				<FreaqBrand href="#top" />
				<FreaqButton href="#join" variant="secondary"
					>ENTER THE CIRCLE</FreaqButton
				>
			</div>
		</header>

		<HeroVault />

		<section id="pact">
			<div class="mx-auto max-w-7xl px-panel pt-hero pb-hero">
				<h2
					ref="pactHeaderRef"
					class="max-w-[20ch] font-display text-title font-bold tracking-normal text-text-dark uppercase"
				>
					THE IDEA.
					<span class="text-accent-dark"
						>CONSTRAINT AS INSTRUMENT.</span
					>
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

		<section
			class="border-t border-line-dark bg-raised-dark shadow-vessel-edge"
		>
			<div class="mx-auto max-w-7xl px-panel py-hero">
				<p class="font-display font-bold tracking-normal uppercase">
					<span
						ref="mantraLine1Ref"
						class="block text-stagger-1 text-muted-dark"
						>The hand</span
					>
					<span
						ref="mantraLine2Ref"
						class="block pl-[0.6em] text-stagger-2 text-text-dark"
						>stays in</span
					>
					<span
						ref="mantraLine3Ref"
						class="block pl-[1.4em] text-stagger-3 text-accent-dark"
						>the machine.</span
					>
				</p>
				<p
					ref="mantraBodyRef"
					class="mt-section ml-auto max-w-[44ch] text-body text-muted-dark sm:text-right"
				>
					Freaq gives producers a focused circle, a real constraint,
					and a reason to finish the idea while it still has voltage.
				</p>
			</div>
		</section>

		<section id="join" class="border-t border-line-dark">
			<div
				class="mx-auto grid max-w-7xl grid-cols-12 gap-panel px-panel py-hero"
			>
				<div ref="joinTitleRef" class="col-span-12 lg:col-span-6">
					<FreaqReadout class="text-muted-dark"
						>OPEN CALL · FIRST CIRCLE</FreaqReadout
					>
					<h2
						class="mt-field font-display text-headline font-bold tracking-normal text-text-dark uppercase"
					>
						ENTER THE<br />CIRCLE.
					</h2>
				</div>

				<div
					ref="joinFormRef"
					class="col-span-12 mt-section lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-end lg:border-l lg:border-line-dark lg:pl-panel"
				>
					<div
						v-if="!submitted"
						class="max-w-[52ch] space-y-field text-body text-muted-dark"
					>
						<p>
							I’m building Freaq solo. The platform isn’t live
							yet. The circle is the list of producers who’ll hear
							it first.
						</p>
						<p>
							Drop your email. One signal lands the day the vault
							opens.
						</p>
					</div>

					<form
						v-if="!submitted"
						class="mt-panel flex w-full flex-col gap-field sm:flex-row sm:items-stretch"
						@submit.prevent="handleSubmit"
					>
						<label class="sr-only" for="email">Email</label>
						<input
							id="email"
							ref="emailInputRef"
							type="email"
							required
							placeholder="your@email.com"
							class="min-h-11 flex-1 rounded-sm border border-line-dark bg-surface-dark px-field py-3 text-text-dark placeholder:text-dim-dark focus:border-accent-dark focus:outline-none"
						/>
						<FreaqButton type="submit" class="px-panel">
							ENTER THE CIRCLE
						</FreaqButton>
					</form>

					<div
						v-else
						ref="stampRef"
						class="signal-stamp mt-panel"
						role="status"
						aria-live="polite"
					>
						<div class="signal-stamp__sheet">
							<span
								class="signal-stamp__dot"
								aria-hidden="true"
							/>
							<p class="signal-stamp__head">
								&gt; SIGNAL LOCKED.
							</p>
							<p class="signal-stamp__line">
								WATCH
								<span class="signal-stamp__addr"
									>signal@freaq.club</span
								>
								FOR THE FIRST CALL.
							</p>
							<span
								class="signal-stamp__scan"
								aria-hidden="true"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<footer ref="footerRef" class="border-t border-line-dark">
			<div class="mx-auto max-w-7xl px-panel py-section">
				<FreaqBrand mark-class="size-2" text-class="text-lg" />
				<p class="mt-field max-w-[44ch] text-body text-muted-dark">
					A sealed-seed ritual for music producers who want
					constraint, consequence, and a circle that listens.
				</p>
			</div>
		</footer>
	</div>
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

.signal-stamp {
	--stamp-color: var(--freaq-success);
}

.signal-stamp__sheet {
	position: relative;
	overflow: hidden;
	padding: 18px 20px 20px;
	border: 1px solid var(--stamp-color);
	border-radius: 4px;
	background: color-mix(
		in oklab,
		var(--stamp-color) 8%,
		var(--freaq-surface)
	);
	box-shadow: inset 0 1px 0 rgba(232, 226, 216, 0.06);
	animation: stamp-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.signal-stamp__dot {
	display: inline-block;
	width: 7px;
	height: 7px;
	margin-right: 10px;
	margin-bottom: 2px;
	border-radius: 999px;
	background: var(--stamp-color);
	box-shadow: 0 0 12px var(--stamp-color);
	animation: stamp-dot 1.8s ease-in-out infinite;
	vertical-align: middle;
}

.signal-stamp__head {
	display: inline;
	color: var(--stamp-color);
	font-family: var(--font-mono);
	font-size: 0.82rem;
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.signal-stamp__line {
	margin-top: 10px;
	color: var(--freaq-text);
	font-family: var(--font-mono);
	font-size: 0.82rem;
	line-height: 1.55;
	letter-spacing: 0.02em;
	text-transform: uppercase;
}

.signal-stamp__addr {
	color: var(--stamp-color);
	text-transform: none;
}

.signal-stamp__scan {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background: linear-gradient(
		90deg,
		transparent 0%,
		rgba(87, 183, 122, 0.18) 48%,
		rgba(232, 226, 216, 0.32) 50%,
		rgba(87, 183, 122, 0.18) 52%,
		transparent 100%
	);
	transform: translateX(-110%);
	animation: stamp-scan 720ms cubic-bezier(0.22, 1, 0.36, 1) 140ms both;
	mix-blend-mode: screen;
}

@keyframes stamp-in {
	0% {
		opacity: 0;
		transform: translateY(8px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes stamp-scan {
	0% {
		transform: translateX(-110%);
	}
	100% {
		transform: translateX(110%);
	}
}

@keyframes stamp-dot {
	0%,
	100% {
		opacity: 0.55;
		box-shadow: 0 0 6px var(--stamp-color);
	}
	50% {
		opacity: 1;
		box-shadow: 0 0 14px var(--stamp-color);
	}
}

@media (prefers-reduced-motion: reduce) {
	.pact-numeral,
	.signal-stamp__sheet,
	.signal-stamp__scan,
	.signal-stamp__dot {
		transition: none !important;
		animation: none !important;
		transform: none !important;
	}
	.signal-stamp__scan {
		display: none;
	}
}
</style>
