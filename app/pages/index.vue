<script setup lang="ts">
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
</script>

<template>
    <div class="isolate min-h-screen bg-bg-dark text-text-dark antialiased">
        <header
            class="sticky top-0 z-10 border-b border-line-dark bg-bg-dark"
        >
            <div
                class="mx-auto flex max-w-7xl items-center justify-between gap-panel px-panel py-field"
            >
                <FreaqBrand href="#top" />
                <FreaqButton href="#join" variant="secondary">ENTER THE CIRCLE</FreaqButton>
            </div>
        </header>

        <HeroVault />

        <section id="pact">
            <div class="mx-auto max-w-7xl px-panel pt-hero pb-hero">
                <h2
                    class="max-w-[20ch] font-display text-title font-bold tracking-normal text-text-dark uppercase"
                >
                    THE IDEA. <span class="text-accent-dark">CONSTRAINT AS INSTRUMENT.</span>
                </h2>

                <ol class="mt-section divide-y divide-line-dark">
                    <li
                        v-for="item in pact"
                        :key="item.n"
                        class="grid grid-cols-12 gap-panel py-panel first:pt-0 sm:py-section"
                    >
                        <span
                            class="col-span-12 font-mono text-stagger-2 leading-[0.85] font-bold tabular-nums text-muted-dark sm:col-span-3"
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

        <section class="border-t border-line-dark bg-raised-dark shadow-vessel-edge">
            <div class="mx-auto max-w-7xl px-panel py-hero">
                <p
                    class="font-display font-bold tracking-normal uppercase"
                >
                    <span
                        class="block text-stagger-1 text-muted-dark"
                        >The hand</span
                    >
                    <span
                        class="block pl-[0.6em] text-stagger-2 text-text-dark"
                        >stays in</span
                    >
                    <span
                        class="block pl-[1.4em] text-stagger-3 text-accent-dark"
                        >the machine.</span
                    >
                </p>
                <p
                    class="mt-section ml-auto max-w-[44ch] text-body text-muted-dark sm:text-right"
                >
                    Freaq gives producers a focused circle, a real constraint,
                    and a reason to finish the idea while it still has
                    voltage.
                </p>
            </div>
        </section>

        <section id="join" class="border-t border-line-dark">
            <div
                class="mx-auto grid max-w-7xl grid-cols-12 gap-panel px-panel py-hero"
            >
                <div class="col-span-12 lg:col-span-6">
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
                    class="col-span-12 mt-section lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-end lg:border-l lg:border-line-dark lg:pl-panel"
                >
                    <p
                        class="max-w-[44ch] text-body text-muted-dark"
                    >
                        Freaq is still being shaped. Add your email and I’ll
                        send the first signal when the vault opens.
                    </p>

                    <form
                        class="mt-panel flex w-full flex-col gap-field sm:flex-row sm:items-stretch"
                        @submit.prevent
                    >
                        <label class="sr-only" for="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            class="min-h-11 flex-1 rounded-sm border border-line-dark bg-surface-dark px-field py-3 text-text-dark placeholder:text-dim-dark focus:border-accent-dark focus:outline-none"
                        />
                        <FreaqButton type="submit" class="px-panel">
                            ENTER THE CIRCLE
                        </FreaqButton>
                    </form>
                </div>
            </div>
        </section>

        <footer class="border-t border-line-dark">
            <div
                class="mx-auto grid max-w-7xl grid-cols-12 gap-panel px-panel py-section"
            >
                <div class="col-span-12 sm:col-span-5">
                    <FreaqBrand
                        mark-class="size-2"
                        text-class="text-lg"
                    />
                    <p
                        class="mt-field max-w-[32ch] text-body text-muted-dark"
                    >
                        A sealed-seed ritual for music producers who want
                        constraint, consequence, and a circle that listens.
                    </p>
                </div>
                <nav
                    class="col-span-12 grid grid-cols-2 gap-field sm:col-span-6 sm:col-start-7 sm:grid-cols-2 sm:justify-end sm:text-right"
                    aria-label="Footer"
                >
                    <FreaqReadout
                        as="a"
                        href="#pact"
                        class="text-muted-dark transition-colors hover:text-text-dark"
                        >THE IDEA</FreaqReadout
                    >
                    <FreaqReadout
                        as="a"
                        href="#join"
                        class="text-muted-dark transition-colors hover:text-text-dark"
                        >ENTER THE CIRCLE</FreaqReadout
                    >
                    <FreaqReadout
                        as="a"
                        href="mailto:signal@freaq.fm"
                        class="text-muted-dark transition-colors hover:text-text-dark"
                        >SIGNAL@FREAQ.FM</FreaqReadout
                    >
                </nav>
            </div>
        </footer>
    </div>
</template>
