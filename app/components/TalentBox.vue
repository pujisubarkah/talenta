<script setup lang="ts">
defineProps<{
  number: number
  title: string
  count: number
  color: string
}>()
</script>

<template>
  <div
    :class="[color, 'relative rounded-xl p-4 flex flex-col justify-between border border-black/5 cursor-pointer hover:brightness-95 transition']" 
    style="height: 200px; width: 200px"
  >
    <!-- Box number -->
    <span class="text-xs font-semibold opacity-40">#{{ number }}</span>

    <!-- Count -->
    <span class="text-5xl font-extrabold leading-none">{{ count }}</span>

    <!-- Title -->
    <p class="text-sm font-bold leading-tight">{{ title }}</p>
  </div>
</template>
