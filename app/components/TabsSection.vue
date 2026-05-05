<template>
  <div class="flex flex-wrap gap-x-1 gap-y-0 items-end">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="relative px-5 py-2 text-sm font-semibold transition-all duration-150 rounded-t-lg border border-b-0 whitespace-nowrap"
      :class="modelValue === tab
        ? 'bg-[#146190] text-white border-[#146190] z-10 -mb-px pb-2.25'
        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'"
      @click="$emit('update:modelValue', tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: string[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
