<script setup lang="ts">
const boxes = [
  { id: 4, title: 'Solid Performer',     count: 0,   color: 'bg-orange-200 text-orange-900' },
  { id: 7, title: 'High Performer',      count: 38,  color: 'bg-yellow-300 text-yellow-900' },
  { id: 9, title: 'Star',                count: 22,  color: 'bg-green-400 text-white' },
  { id: 2, title: 'Inconsistent Player', count: 87,  color: 'bg-gray-200 text-gray-700' },
  { id: 5, title: 'Core Player',         count: 124, color: 'bg-blue-200 text-blue-900' },
  { id: 8, title: 'High Potential',      count: 56,  color: 'bg-blue-400 text-white' },
  { id: 1, title: 'Risk',                count: 31,  color: 'bg-red-500 text-white' },
  { id: 3, title: 'Average Performer',   count: 43,  color: 'bg-pink-200 text-pink-900' },
  { id: 6, title: 'Potential Gem',       count: 14,  color: 'bg-cyan-200 text-cyan-900' },
]

const totalCount = boxes.reduce((sum, b) => sum + b.count, 0)
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
