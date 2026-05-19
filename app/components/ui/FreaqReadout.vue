<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
	defineProps<{
		as?: string;
		panel?: boolean;
	}>(),
	{
		as: "div",
		panel: false,
	}
);

const { forwardedAttrs, forwardedClass } = useForwardedAttrs();
</script>

<template>
	<component
		:is="as"
		v-bind="forwardedAttrs"
		:class="[
			'font-mono text-label font-medium tracking-normal uppercase',
			panel
				? 'rounded-md border border-line-dark bg-surface-dark px-field py-field shadow-vessel-edge'
				: '',
			forwardedClass,
		]"
	>
		<slot />
	</component>
</template>
