<template>
  <span :class="iconClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  color: { type: String, default: 'default' }, // default, primary, danger
  size: { type: String, default: 'md' }, // sm, md, lg
})
const iconClass = computed(() => [
  props.size === 'sm' ? 'w-4 h-4' : props.size === 'lg' ? 'w-6 h-6' : 'w-5 h-5',
  props.color === 'primary'
    ? 'text-blue-600'
    : props.color === 'danger'
    ? 'text-red-600'
    : props.color === 'white'
    ? 'text-white'
    : 'text-slate-500',
])
</script>
