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

const { forwardedAttrs, forwardedClass } = useForwardedAttrs();
</script>

<template>
	<a
		v-if="href"
		v-bind="forwardedAttrs"
		:href="href"
		:class="[
			'group flex min-h-11 items-center gap-inline rounded-sm transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-dark',
			forwardedClass,
		]"
	>
		<span
			aria-hidden="true"
			:class="[
				'inline-block bg-accent-dark transition-[box-shadow,transform] duration-200 ease-out group-hover:scale-y-150',
				markClass,
			]"
		/>
		<span
			:class="[
				'font-display font-bold tracking-normal text-text-dark transition-colors duration-200 ease-out group-hover:text-muted-dark',
				textClass,
			]"
		>
			FREAQ
		</span>
	</a>
	<div
		v-else
		v-bind="forwardedAttrs"
		:class="['flex min-h-11 items-center gap-inline', forwardedClass]"
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
