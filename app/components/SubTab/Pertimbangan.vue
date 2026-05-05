<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { computed, defineAsyncComponent } from 'vue'

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

type Indicator = {
  label: string
  value: number
  color: string
}

const indicators: Indicator[] = [
  { label: 'Kesesuaian Pendidikan dengan Jabatan Target', value: 85, color: '#2563eb' },
  { label: 'Pengalaman Organisasi', value: 80, color: '#16a34a' },
  { label: 'Pertimbangan Atasan', value: 88, color: '#d97706' },
]

const chartSeries = computed(() => [
  {
    name: 'Skor',
    data: indicators.map((indicator) => ({
      x: indicator.label,
      y: indicator.value,
      fillColor: indicator.color,
    })),
  },
])

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    height: 280,
    toolbar: { show: false },
    background: 'transparent',
    dropShadow: {
      enabled: true,
      blur: 6,
      left: 2,
      top: 2,
      opacity: 0.08,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 8,
      borderRadiusApplication: 'end',
      barHeight: '56%',
      distributed: false,
      dataLabels: { position: 'center' },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#ffffff'],
      fontSize: '12px',
      fontWeight: '800',
      fontFamily: 'Poppins, sans-serif',
    },
    formatter: (val) => `${val}`,
  },
  xaxis: {
    min: 0,
    max: 100,
    labels: {
      style: {
        colors: ['#64748b'],
        fontSize: '11px',
        fontFamily: 'Poppins, sans-serif',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: {
        colors: ['#334155'],
        fontSize: '11px',
        fontWeight: '600',
        fontFamily: 'Poppins, sans-serif',
      },
      maxWidth: 200,
    },
  },
  grid: {
    borderColor: '#f1f5f9',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  tooltip: {
    theme: 'dark',
    style: { fontFamily: 'Poppins, sans-serif' },
    y: { formatter: (val) => `${val} poin` },
  },
  legend: { show: false },
}))

const averageScore = computed(() => {
  const total = indicators.reduce((sum, indicator) => sum + indicator.value, 0)
  return (total / indicators.length).toFixed(1)
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-bold text-slate-700">Pertimbangan Lainnya</h3>
      <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Rata-rata: {{ averageScore }}
      </span>
    </div>

    <div class="rounded-xl border border-green-100 bg-linear-to-br from-green-50 via-emerald-50 to-lime-50 p-4 shadow-sm sm:p-6">
      <ClientOnly>
        <ApexChart
          type="bar"
          height="280"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="indicator in indicators"
        :key="indicator.label"
        class="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2.5 shadow-xs transition hover:border-green-200 hover:shadow-md"
      >
        <div class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: indicator.color }" />
          <span class="text-xs font-medium text-slate-600">{{ indicator.label }}</span>
        </div>
        <span
          class="ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-extrabold"
          :style="{ backgroundColor: indicator.color + '18', color: indicator.color }"
        >
          {{ indicator.value }}
        </span>
      </div>
    </div>
  </div>
</template>
