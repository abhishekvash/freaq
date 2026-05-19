<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
	defineProps<{
		href?: string;
		markClass?: string;
		textClass?: string;
	}>(),
	{
		href: undefined,
		markClass: "size-2.5 shadow-[0_0_8px_var(--freaq-accent)]",
		textClass: "text-xl",
	}
);

const attrs = useAttrs();

const rootAttrs = computed(() => {
	const { class: _class, ...rest } = attrs;
	return rest;
});
</script>

<template>
	<a
		v-if="href"
		v-bind="rootAttrs"
		:href="href"
		:class="['flex items-center gap-inline', attrs.class]"
	>
		<span
			aria-hidden="true"
			:class="['inline-block bg-accent-dark', markClass]"
		/>
		<span
			:class="[
				'font-display font-bold tracking-normal text-text-dark',
				textClass,
			]"
		>
			FREAQ
		</span>
	</a>
	<div
		v-else
		v-bind="rootAttrs"
		:class="['flex items-center gap-inline', attrs.class]"
	>
		<span
			aria-hidden="true"
			:class="['inline-block bg-accent-dark', markClass]"
		/>
		<span
			:class="[
				'font-display font-bold tracking-normal text-text-dark',
				textClass,
			]"
		>
			FREAQ
		</span>
	</div>
</template>
