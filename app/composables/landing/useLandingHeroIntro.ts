export const LANDING_HERO_READOUT_TEXT = {
	seg1: "FREAQ.CLUB",
	seg2: " // SIGNAL CHECK",
	seg3: " // CIRCLE FORMING",
} as const;

type LandingHeroIntroRefs = {
	bodyRef: Readonly<Ref<HTMLElement | undefined>>;
	readoutRef: Readonly<Ref<HTMLElement | undefined>>;
	bracketRef: Readonly<Ref<HTMLElement | undefined>>;
	line1Ref: Readonly<Ref<HTMLElement | undefined>>;
	line2Ref: Readonly<Ref<HTMLElement | undefined>>;
	line3Ref: Readonly<Ref<HTMLElement | undefined>>;
	scanlineRef: Readonly<Ref<HTMLElement | undefined>>;
	seg1Ref: Readonly<Ref<HTMLElement | undefined>>;
	seg2Ref: Readonly<Ref<HTMLElement | undefined>>;
	seg3Ref: Readonly<Ref<HTMLElement | undefined>>;
};

export function useLandingHeroIntro(
	refs: LandingHeroIntroRefs,
	options: { setupCanvas: () => void }
) {
	onMounted(async () => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;

		if (prefersReducedMotion) {
			setStaggerFinal(refs);
			return;
		}

		options.setupCanvas();
		[refs.seg1Ref, refs.seg2Ref, refs.seg3Ref].forEach((r) => {
			if (r.value) r.value.textContent = "";
		});
		showElement(refs.readoutRef.value);

		const [motionMod, gsapMod] = await Promise.all([
			import("motion"),
			import("gsap"),
		]);
		const animateElement = motionMod.animate as (
			element: Element,
			keyframes: Record<string, unknown>,
			options?: Record<string, unknown>
		) => unknown;
		const gsap = gsapMod.gsap;
		const { TextPlugin } = await import("gsap/TextPlugin");
		gsap.registerPlugin(TextPlugin);

		const tl = gsap.timeline();
		const segments = [
			{ ref: refs.seg1Ref, text: LANDING_HERO_READOUT_TEXT.seg1 },
			{ ref: refs.seg2Ref, text: LANDING_HERO_READOUT_TEXT.seg2 },
			{ ref: refs.seg3Ref, text: LANDING_HERO_READOUT_TEXT.seg3 },
		] as const;

		let cursor = 0.05;
		segments.forEach((seg) => {
			if (!seg.ref.value) return;

			const dur = Math.max(0.1, seg.text.length * 0.028);
			tl.to(
				seg.ref.value,
				{
					duration: dur,
					text: { value: seg.text, delimiter: "" },
					ease: "none",
				},
				cursor
			);
			if (refs.bracketRef.value) {
				tl.to(
					refs.bracketRef.value,
					{ duration: 0.06, opacity: 0.35 },
					cursor
				);
				tl.to(
					refs.bracketRef.value,
					{ duration: 0.18, opacity: 1 },
					cursor + 0.06
				);
			}
			cursor += dur + 0.05;
		});

		const spring = { type: "spring", stiffness: 320, damping: 28 };
		tl.add(() => {
			if (refs.line1Ref.value) {
				animateElement(
					refs.line1Ref.value,
					{ opacity: 1, y: 0 },
					spring
				);
			}
		}, 0.72);
		tl.add(() => {
			if (refs.line2Ref.value) {
				animateElement(
					refs.line2Ref.value,
					{ opacity: 1, y: 0 },
					spring
				);
			}
		}, 0.88);
		tl.add(() => {
			if (refs.line3Ref.value) {
				animateElement(
					refs.line3Ref.value,
					{ opacity: 1, y: 0 },
					spring
				);
			}
		}, 1.04);

		if (refs.scanlineRef.value) {
			tl.fromTo(
				refs.scanlineRef.value,
				{ "--landing-hero-scan-x": "-10%" },
				{
					"--landing-hero-scan-x": "110%",
					duration: 0.6,
					ease: "expo.out",
				},
				1.26
			);
		}

		if (refs.bodyRef.value) {
			tl.to(
				refs.bodyRef.value,
				{ opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
				1.46
			);
		}
	});
}

function setStaggerFinal(refs: LandingHeroIntroRefs) {
	[
		refs.readoutRef,
		refs.line1Ref,
		refs.line2Ref,
		refs.line3Ref,
		refs.bodyRef,
	].forEach((r) => {
		showElement(r.value);
	});
}

function showElement(element: HTMLElement | undefined) {
	if (!element) return;
	element.style.opacity = "1";
	element.style.transform = "none";
}
