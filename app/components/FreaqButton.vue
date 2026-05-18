<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  href?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
}>(), {
  type: 'button',
  variant: 'primary'
})

const attrs = useAttrs()

const rootAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const variantClass = computed(() => {
  if (props.variant === 'secondary') {
    return 'border-line-dark bg-surface-dark text-text-dark'
  }

  return 'border-accent-dark bg-accent-dark text-bg-dark'
})
</script>

<template>
  <a
    v-if="href"
    v-bind="rootAttrs"
    :href="href"
    :class="[
      'inline-flex min-h-11 items-center justify-center gap-inline rounded-sm border px-field py-3 font-mono text-label font-medium tracking-normal uppercase',
      variantClass,
      attrs.class
    ]"
  >
    <slot />
  </a>
  <button
    v-else
    v-bind="rootAttrs"
    :type="type"
    :class="[
      'inline-flex min-h-11 items-center justify-center gap-inline rounded-sm border px-field py-3 font-mono text-label font-medium tracking-normal uppercase',
      variantClass,
      attrs.class
    ]"
  >
    <slot />
  </button>
</template>
