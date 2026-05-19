type RevealOptions = {
	delay?: number;
	delayFromMount?: boolean;
	duration?: number;
	y?: number;
};

type RevealTarget = {
	element: () => HTMLElement | undefined;
	options?: RevealOptions;
};

const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function useLandingReveal() {
	const targets: RevealTarget[] = [];

	function addRevealTarget(
		element: () => HTMLElement | undefined,
		options?: RevealOptions
	) {
		targets.push({ element, options });
	}

	function revealList(
		items: () => HTMLElement[],
		optionsForIndex: (index: number) => RevealOptions
	) {
		onMounted(() => {
			items().forEach((element, index) => {
				revealElement(element, optionsForIndex(index));
			});
		});
	}

	onMounted(() => {
		targets.forEach(({ element, options }) => {
			revealElement(element(), options);
		});
	});

	return {
		addRevealTarget,
		revealList,
	};
}

export function useElementListRefs() {
	const elements = ref<HTMLElement[]>([]);

	function setElementRef(index: number) {
		return (el: unknown) => {
			if (el instanceof HTMLElement) elements.value[index] = el;
		};
	}

	return {
		elements,
		setElementRef,
	};
}

async function revealElement(
	element: HTMLElement | undefined,
	options: RevealOptions = {}
) {
	if (!element || typeof window === "undefined") return;

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;
	if (prefersReducedMotion) return;

	const { animate, inView } = await import("motion");

	element.style.willChange = "opacity, transform";
	const mountTime = performance.now();

	inView(
		element,
		() => {
			const elapsedSeconds = (performance.now() - mountTime) / 1000;
			const delay = options.delayFromMount
				? Math.max(0, (options.delay ?? 0) - elapsedSeconds)
				: (options.delay ?? 0);

			animate(
				element,
				{ opacity: 1, transform: "translate3d(0, 0, 0)" },
				{
					delay,
					duration: options.duration ?? 0.6,
					ease: easeOutQuart,
				}
			);

			return () => {
				element.style.willChange = "";
				element.style.transform = "none";
			};
		},
		{ amount: 0.18 }
	);
}
