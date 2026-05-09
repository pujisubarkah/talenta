<template>
  <button
    :class="[
      'inline-flex items-center gap-2 rounded-lg font-semibold transition focus:outline-none',
      sizeClass,
      colorClass,
      $attrs.class || ''
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  color: { type: String, default: 'primary' }, // primary, danger, secondary
  size: { type: String, default: 'md' }, // sm, md, lg
})
const sizeClass = computed(() => {
  if (props.size === 'sm') return 'px-3 py-1 text-xs';
  if (props.size === 'lg') return 'px-5 py-3 text-base';
  return 'px-4 py-2 text-sm';
})
const colorClass = computed(() => {
  if (props.color === 'primary') return 'bg-blue-600 text-white hover:bg-blue-700';
  if (props.color === 'danger') return 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100';
  if (props.color === 'secondary') return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
  return '';
})
</script>
