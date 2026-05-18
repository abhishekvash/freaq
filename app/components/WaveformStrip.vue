<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  height?: number
  density?: number
  seed?: number
  variant?: 'accent' | 'hairline'
}>(), {
  height: 140,
  density: 320,
  seed: 0x47A7,
  variant: 'accent'
})

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const points = computed(() => {
  const rand = mulberry32(props.seed)
  const n = props.density
  const result: number[] = []
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1)
    const breath = 0.55 + 0.45 * Math.sin(x * Math.PI * 3.7) * Math.cos(x * Math.PI * 1.3)
    const noise = (rand() - 0.5) * 0.42
    const tail = 1 - Math.pow(Math.abs(x - 0.5) * 2, 2.6)
    const v = Math.max(0.04, Math.min(1, Math.abs(breath + noise) * Math.max(0.2, tail)))
    result.push(v)
  }
  return result
})

const top = computed(() => {
  const h = props.height
  return points.value.map((v, i) => {
    const x = (i / (points.value.length - 1)) * 1000
    const y = (h / 2) * (1 - v) + 0.5
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
})

const bottom = computed(() => {
  const h = props.height
  return points.value.map((v, i) => {
    const x = (i / (points.value.length - 1)) * 1000
    const y = h / 2 + (h / 2) * v - 0.5
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
})

const stroke = computed(() =>
  props.variant === 'accent' ? 'var(--freaq-accent)' : 'var(--freaq-line)'
)
</script>

<template>
  <div
    class="relative w-full overflow-hidden border-y border-[var(--freaq-line)] bg-[var(--freaq-bg)]"
    :style="{ height: height + 'px' }"
    aria-hidden="true"
  >
    <svg
      :viewBox="`0 0 1000 ${height}`"
      preserveAspectRatio="none"
      class="absolute inset-0 h-full w-full"
    >
      <line
        x1="0" :y1="height / 2" x2="1000" :y2="height / 2"
        :stroke="'var(--freaq-line)'" stroke-width="1" stroke-dasharray="2 6"
      />
      <polyline
        :points="top"
        fill="none"
        :stroke="stroke"
        stroke-width="1.2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <polyline
        :points="bottom"
        fill="none"
        :stroke="stroke"
        stroke-width="1.2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>
