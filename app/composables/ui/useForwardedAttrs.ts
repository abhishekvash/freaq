type ForwardedAttrs = ReturnType<typeof useAttrs>;

export function useForwardedAttrs(): {
	forwardedAttrs: ComputedRef<Omit<ForwardedAttrs, "class">>;
	forwardedClass: ComputedRef<ForwardedAttrs["class"]>;
} {
	const attrs = useAttrs();

	const forwardedAttrs = computed(() => {
		const { class: _class, ...rest } = attrs;
		return rest;
	});
	const forwardedClass = computed(() => attrs.class);

	return {
		forwardedAttrs,
		forwardedClass,
	};
}
