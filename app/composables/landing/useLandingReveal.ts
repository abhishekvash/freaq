interface RevealOptions {
	delay?: number;
	duration?: number;
	y?: number;
}

interface RevealTarget {
	element: () => HTMLElement | null;
	options?: RevealOptions;
}

const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function useLandingReveal() {
	const targets: RevealTarget[] = [];

	function addRevealTarget(
		element: () => HTMLElement | null,
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
		return (el: Element | ComponentPublicInstance | null) => {
			if (el instanceof HTMLElement) elements.value[index] = el;
		};
	}

	return {
		elements,
		setElementRef,
	};
}

async function revealElement(
	element: HTMLElement | null,
	options: RevealOptions = {}
) {
	if (!element || typeof window === "undefined") return;

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;
	if (prefersReducedMotion) return;

	const { animate, inView } = await import("motion");
	const y = options.y ?? 22;

	element.style.opacity = "0";
	element.style.transform = `translate3d(0, ${y}px, 0)`;
	element.style.willChange = "opacity, transform";

	inView(
		element,
		() => {
			animate(
				element,
				{ opacity: 1, transform: "translate3d(0, 0, 0)" },
				{
					delay: options.delay ?? 0,
					duration: options.duration ?? 0.6,
					ease: easeOutQuart,
				}
			);

			return () => {
				element.style.willChange = "";
			};
		},
		{ amount: 0.18 }
	);
}
