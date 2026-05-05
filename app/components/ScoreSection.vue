<template>
  <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
    <ScoreBar label="Kinerja" :value="data?.kinerja || 0" />
    <ScoreBar label="Potensial" :value="data?.potensial || 0" />

    <div class="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
      <span class="text-slate-500 font-semibold text-sm">Total:</span>
      <span class="bg-[#3781c7] text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm shadow-[#3781c7]/20">
        {{ total }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ScoreBar from './ScoreBar.vue'

const props = defineProps<{
  data: {
    kinerja: number
    potensial: number
  }
}>()

const total = computed(() => {
  if (!props.data) return '0.00'
  return (
    props.data.kinerja * 0.6 +
    props.data.potensial * 0.4
  ).toFixed(2)
})
</script>
