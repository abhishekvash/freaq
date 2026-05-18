<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  as?: string
  panel?: boolean
}>(), {
  as: 'div',
  panel: false
})

const attrs = useAttrs()

const rootAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<template>
  <component
    :is="as"
    v-bind="rootAttrs"
    :class="[
      'font-mono text-label font-medium tracking-normal uppercase',
      panel ? 'rounded-md border border-line-dark bg-surface-dark px-field py-field shadow-vessel-edge' : '',
      attrs.class
    ]"
  >
    <slot />
  </component>
</template>
