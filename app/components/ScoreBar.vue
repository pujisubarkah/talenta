<template>
  <div class="space-y-1.5">
    <div class="flex justify-between items-center text-sm">
      <span class="text-slate-600 font-medium">{{ label }}</span>
      <span class="text-slate-800 font-bold">{{ value }}</span>
    </div>
    <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <!-- Assuming max score is 100 -->
      <div 
        class="h-full bg-linear-to-r from-[#3781c7] to-blue-400 rounded-full transition-all duration-500 ease-out" 
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number
}>()
</script>
