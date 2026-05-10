<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits<{
  selectBox: [id: number]
}>()

type Box = {
  id: number
  title: string
  color: string
  count: number
}

const boxes = ref<Box[]>([])

const totalCount = computed(() => boxes.value.reduce((sum, b) => sum + b.count, 0))

onMounted(async () => {
  // Urutan box sesuai sebelumnya
  const boxOrder = [4, 7, 9, 2, 5, 8, 1, 3, 6]
  // Fetch daftar kotak
  const kotakRes = await $fetch<{ data: Array<{ id: number, title: string, colorClass: string, isActive: boolean, updatedAt: string }> }>('/api/daftar-kotak')
  let kotakList = kotakRes.data.filter(k => k.isActive)
  // Urutkan sesuai boxOrder
  kotakList = boxOrder
    .map((id) => kotakList.find((k) => k.id === id))
    .filter((k): k is (typeof kotakList)[number] => k !== undefined)
  // Inisialisasi count 0
  boxes.value = kotakList.map(k => ({
    id: k.id,
    title: k.title,
    color: k.colorClass,
    count: 0
  }))

  // Fetch count per box
  const res = await $fetch<{
    meta: {
      nineBoxTotals?: Record<string, number>
    }
  }>('/api/pegawai/nilai', {
    query: {
      page: 1,
      limit: 1,
    },
  })
  const totals = res.meta?.nineBoxTotals ?? {}
  boxes.value = boxes.value.map((box) => ({
    ...box,
    count: Number(totals[String(box.id)] ?? 0),
  }))
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
    <!-- Header -->
    <div class="mb-5">
      <h2 class="text-sm font-bold text-slate-700">Manajemen Talenta</h2>
      <p class="text-xs text-slate-400 mt-0.5">Nine-Box Matrix · {{ totalCount }} pegawai</p>
    </div>

    <div class="flex gap-3">
      <!-- Y-axis label -->
      <div class="flex items-center justify-center w-4 shrink-0">
        <span class="text-xs text-slate-600 font-bold tracking-widest -rotate-90 whitespace-nowrap uppercase">Performa</span>
      </div>

      <!-- Y-axis row labels -->
      <div class="flex flex-col gap-2">
        <div
          v-for="label in ['DIATAS EKSPEKTASI', 'SESUAI EKSPEKTASI', 'DIBAWAH EKSPEKTASI']"
          :key="label"
          class="flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-lg"
          style="height: 200px; width: 36px"
        >
          <span class="text-[11px] text-slate-600 font-semibold -rotate-90 whitespace-nowrap">{{ label }}</span>
        </div>
      </div>

      <!-- Grid + X-axis -->
      <div>
        <!-- 3×200 + 2×8 gap = 616px -->
        <div class="grid grid-cols-3 gap-2" style="width: 616px">
          <TalentBox
            v-for="box in boxes"
            :key="box.id"
            :number="box.id"
            :title="box.title"
            :count="box.count"
            :color="box.color"
            @click="emit('selectBox', box.id)"
          />
        </div>

        <!-- X-axis col labels -->
        <div class="flex gap-2 mt-2">
          <div
            v-for="label in ['RENDAH', 'SEDANG', 'TINGGI']"
            :key="label"
            class="flex justify-center items-center bg-white border border-slate-200 shadow-sm rounded-lg py-1.5"
            style="width: 200px"
          >
            <span class="text-[11px] text-slate-600 font-semibold">{{ label }}</span>
          </div>
        </div>

        <p class="text-xs text-slate-600 font-bold tracking-widest uppercase text-center mt-1">Potensi</p>
      </div>
    </div>
  </div>
</template>
