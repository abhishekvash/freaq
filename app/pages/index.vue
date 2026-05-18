<script setup lang="ts">
import WaveformStrip from "~/components/WaveformStrip.vue";

useHead({
    title: "FREAQ · One seed. One clock. One bounce.",
    meta: [
        {
            name: "description",
            content:
                "A sealed-seed music challenge for producers. One seed, one clock, one bounce.",
        },
    ],
});

const pact = [
    {
        n: "01",
        title: "ONE SEALED SEED.",
        body: "Hit Start, get a sealed seed, meet it cold, and choose a direction fast.",
    },
    {
        n: "02",
        title: "ONE CLOCK.",
        body: "The clock gives the session its edge. Move with it, finish inside it, let it sharpen the work.",
    },
    {
        n: "03",
        title: "ONE BOUNCE.",
        body: "Print the take you believe in. Stand behind the bounce and let the circle hear it as it landed.",
    },
];

const week = [
    "FRIDAY: THE VAULT OPENS.",
    "START: ONE OF FIVE SEEDS REVEALS.",
    "CLOCK: 30 MINUTES TO PRINT ONE BOUNCE.",
    "SUNDAY: BOUNCES HIT THE CIRCLE.",
] as const;
</script>

<template>
    <div class="min-h-screen bg-bg-dark text-text-dark antialiased">
        <header
            class="sticky top-0 z-40 border-b border-line-dark bg-bg-dark/92 backdrop-blur-[2px]"
        >
            <div
                class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-panel px-panel"
            >
                <FreaqBrand href="#top" />
                <FreaqButton href="#join">ENTER THE CIRCLE</FreaqButton>
            </div>
        </header>

        <section id="top">
            <div class="mx-auto max-w-7xl px-panel py-section">
                <FreaqReadout class="text-muted-dark">
                    SEED VAULT ARMED · SEALED SEED · ONE BOUNCE
                </FreaqReadout>

                <p
                    class="mt-section font-display text-[clamp(2.4rem,6.2vw,6.4rem)] leading-[0.92] font-bold tracking-normal text-text-dark uppercase"
                >
                    ONE SEED.<br />
                    ONE CLOCK.<br />
                    <span class="text-accent-dark">ONE BOUNCE.</span>
                </p>

                <p
                    class="mt-panel max-w-[58ch] text-lg leading-[1.62] text-muted-dark"
                >
                    Freaq is for music producers who want a deadline that bites.
                    Hit Start, get a sealed seed, build inside the clock, print
                    one bounce, and live with what the circle hears.
                </p>

                <div class="mt-panel flex flex-wrap items-center gap-field">
                    <FreaqButton href="#join">ENTER THE CIRCLE</FreaqButton>
                </div>
            </div>
        </section>

        <WaveformStrip :height="120" :seed="0x4711" variant="accent" />

        <section id="week" class="border-t border-line-dark">
            <div
                class="mx-auto grid max-w-7xl grid-cols-1 gap-panel px-panel py-section md:grid-cols-[0.45fr_1fr] md:items-start"
            >
                <h2
                    class="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-bold tracking-normal text-text-dark uppercase"
                >
                    THE WEEK.
                </h2>

                <ol class="grid grid-cols-1 gap-field">
                    <FreaqReadout
                        as="li"
                        v-for="line in week"
                        :key="line"
                        panel
                        class="text-muted-dark"
                    >
                        {{ line }}
                    </FreaqReadout>
                </ol>
            </div>
        </section>

        <section id="pact">
            <div class="mx-auto max-w-7xl px-panel py-hero">
                <h2
                    class="font-display text-title leading-[0.95] font-bold tracking-normal text-text-dark uppercase"
                >
                    THE IDEA. <span class="text-accent-dark"
                        >CONSTRAINT AS INSTRUMENT.</span
                    >
                </h2>

                <ol
                    class="mt-section grid grid-cols-1 gap-section md:grid-cols-3 md:gap-panel"
                >
                    <li v-for="item in pact" :key="item.n">
                        <div
                            class="font-mono text-2xl font-bold leading-none tabular-nums text-accent-dark"
                        >
                            {{ item.n }}
                        </div>
                        <h3
                            class="mt-field font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none font-bold text-text-dark uppercase"
                        >
                            {{ item.title }}
                        </h3>
                        <p
                            class="mt-field max-w-[38ch] leading-[1.62] text-muted-dark"
                        >
                            {{ item.body }}
                        </p>
                    </li>
                </ol>
            </div>
        </section>

        <section class="border-t border-line-dark">
            <div class="mx-auto max-w-205 px-panel py-hero">
                <p
                    class="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.3] font-medium tracking-normal text-text-dark"
                >
                    The hand stays in the machine. Freaq gives producers a
                    focused circle, a real constraint, and a reason to finish
                    the idea while it still has voltage.
                </p>
            </div>
        </section>

        <section
            id="join"
            class="relative border-t border-line-dark bg-bg-dark"
        >
            <div
                class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_70%_at_50%_0%,color-mix(in_oklch,var(--freaq-accent)_14%,transparent),transparent_70%)]"
                aria-hidden="true"
            />
            <div class="relative mx-auto max-w-7xl px-panel py-hero">
                <h2
                    class="font-display text-[clamp(3rem,8.5vw,8rem)] leading-[0.88] font-bold tracking-normal text-text-dark uppercase"
                >
                    ENTER THE CIRCLE.<br /><span class="text-accent-dark"
                        >OPEN CALL.</span
                    >
                </h2>

                <p
                    class="mt-panel max-w-[56ch] text-lg leading-[1.62] text-muted-dark"
                >
                    Freaq is still being shaped. Add your email and I’ll send
                    the first seed when the circle opens.
                </p>

                <form
                    class="mt-panel flex w-full max-w-140 flex-col gap-field sm:flex-row sm:items-stretch"
                    @submit.prevent
                >
                    <label class="sr-only" for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        class="flex-1 rounded-sm border border-line-dark bg-surface-dark px-field py-3.5 text-text-dark placeholder:text-dim-dark focus:border-accent-dark focus:outline-none"
                    />
                    <FreaqButton
                        type="submit"
                        class="px-panel py-3.5"
                    >
                        ENTER THE CIRCLE
                    </FreaqButton>
                </form>
            </div>
        </section>

        <footer class="border-t border-line-dark bg-bg-dark">
            <div
                class="mx-auto flex max-w-7xl flex-col gap-panel px-panel py-panel md:flex-row md:items-end md:justify-between"
            >
                <div class="max-w-[32ch]">
                    <FreaqBrand
                        mark-class="size-2"
                        text-class="text-[1.1rem]"
                    />
                    <p
                        class="mt-field text-[0.95rem] leading-normal text-muted-dark"
                    >
                        A sealed-seed ritual for music producers who want
                        constraint, consequence, and a circle that listens.
                    </p>
                </div>
                <nav class="flex flex-wrap gap-panel">
                    <FreaqReadout
                        as="a"
                        href="#week"
                        class="text-muted-dark transition-colors hover:text-text-dark"
                        >THE WEEK</FreaqReadout
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
