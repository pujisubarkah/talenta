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
  { label: 'Kualifikasi', value: 85, color: '#2563eb' },
  { label: 'Pangkat/Golongan', value: 78, color: '#0f766e' },
  { label: 'Masa Kerja', value: 80, color: '#d97706' },
  { label: 'Pengalaman dalam Organisasi', value: 83, color: '#7c3aed' },
  { label: 'Diklat Kepemimpinan', value: 76, color: '#dc2626' },
  { label: 'Pengembangan Kompetensi', value: 82, color: '#0891b2' },
  { label: 'Penghargaan', value: 79, color: '#16a34a' },
  { label: 'Integritas/Moralitas', value: 90, color: '#e11d48' },
]

const chartSeries = computed(() => [
  {
    name: 'Skor',
    data: indicators.map((indicator) => indicator.value),
  },
])

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'radar',
    height: 480,
    toolbar: { show: false },
    background: 'transparent',
    dropShadow: {
      enabled: true,
      blur: 8,
      left: 1,
      top: 1,
      opacity: 0.1,
    },
  },
  xaxis: {
    categories: indicators.map((indicator) => indicator.label),
    labels: {
      style: {
        colors: indicators.map(() => '#334155'),
        fontSize: '10.5px',
        fontWeight: '700',
        fontFamily: 'Poppins, sans-serif',
      },
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: { show: false },
  },
  colors: ['#16a34a'],
  stroke: {
    width: 2.5,
    curve: 'smooth',
    colors: ['#16a34a'],
  },
  fill: {
    opacity: 0.35,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      gradientToColors: ['#65a30d'],
      opacityFrom: 0.55,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  markers: {
    size: 6,
    colors: ['#ffffff'],
    strokeColors: ['#16a34a'],
    strokeWidth: 2.5,
    shape: 'circle',
    hover: { size: 9 },
  },
  plotOptions: {
    radar: {
      size: 160,
      polygons: {
        strokeColors: '#dcfce7',
        connectorColors: '#bbf7d0',
        fill: {
          colors: ['#f0fdf4', '#f7fee7'],
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#ffffff'],
      fontSize: '9.5px',
      fontWeight: '800',
      fontFamily: 'Poppins, sans-serif',
    },
    background: {
      enabled: true,
      borderRadius: 6,
      borderWidth: 0,
      foreColor: '#ffffff',
      padding: 4,
      dropShadow: { enabled: false },
    },
    formatter: (val) => `${val}`,
  },
  tooltip: {
    theme: 'dark',
    style: { fontFamily: 'Poppins, sans-serif' },
    y: {
      formatter: (val) => `${val} poin`,
    },
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
      <h3 class="text-sm font-bold text-slate-700">Pertimbangan Lainnya - Radar Indikator</h3>
      <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Rata-rata: {{ averageScore }}
      </span>
    </div>

    <div class="rounded-xl border border-green-100 bg-linear-to-br from-green-50 via-emerald-50 to-lime-50 p-4 shadow-sm sm:p-6">
      <ClientOnly>
        <ApexChart
          type="radar"
          height="480"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </div>

    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div
        v-for="indicator in indicators"
        :key="indicator.label"
        class="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2.5 shadow-xs transition hover:border-green-200 hover:shadow-md"
      >
        <div class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: indicator.color }" />
          <span class="text-xs font-medium text-slate-600">{{ indicator.label }}</span>
        </div>
        <span class="ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-extrabold" :style="{ backgroundColor: indicator.color + '18', color: indicator.color }">{{ indicator.value }}</span>
      </div>
    </div>
  </div>
</template>
