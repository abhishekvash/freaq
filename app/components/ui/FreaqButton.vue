<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		href?: string;
		type?: "button" | "submit" | "reset";
		variant?: "primary" | "secondary";
	}>(),
	{
		href: undefined,
		type: "button",
		variant: "primary",
	}
);

const { forwardedAttrs, forwardedClass } = useForwardedAttrs();

const variantClass = computed(() => {
	if (props.variant === "secondary") {
		return "border-line-dark bg-surface-dark text-text-dark hover:border-muted-dark hover:bg-raised-dark active:border-accent-deep-dark active:text-muted-dark";
	}

	return "border-accent-dark bg-accent-dark text-bg-dark hover:border-focus-dark hover:bg-focus-dark hover:shadow-redline active:border-accent-deep-dark active:bg-accent-deep-dark disabled:cursor-not-allowed disabled:border-line-dark disabled:bg-raised-dark disabled:text-dim-dark disabled:shadow-none";
});
</script>

<template>
	<a
		v-if="href"
		v-bind="forwardedAttrs"
		:href="href"
		:class="[
			'inline-flex min-h-11 items-center justify-center gap-inline rounded-sm border px-field py-3 font-mono text-label font-extrabold tracking-normal uppercase transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-dark active:translate-y-px',
			variantClass,
			forwardedClass,
		]"
	>
		<slot />
	</a>
	<button
		v-else
		v-bind="forwardedAttrs"
		:type="type"
		:class="[
			'inline-flex min-h-11 items-center justify-center gap-inline rounded-sm border px-field py-3 font-mono text-label font-extrabold tracking-normal uppercase transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-dark active:translate-y-px',
			variantClass,
			forwardedClass,
		]"
	>
		<slot />
	</button>
</template>
