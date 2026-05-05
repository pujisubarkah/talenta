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
  { label: 'Inovasi', value: 82, color: '#2563eb' },
  { label: 'Disiplin', value: 90, color: '#0f766e' },
  { label: 'Partisipasi dalam Organisasi', value: 78, color: '#7c3aed' },
  { label: 'Tugas Tambahan', value: 85, color: '#d97706' },
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
    height: 440,
    toolbar: { show: false },
    sparkline: { enabled: false },
  },
  xaxis: {
    categories: indicators.map((indicator) => indicator.label),
    labels: {
      style: {
        colors: indicators.map(() => '#475569'),
        fontSize: '11px',
        fontWeight: 600,
      },
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      style: {
        colors: ['#94a3b8'],
        fontSize: '10px',
      },
    },
  },
  colors: ['#1d4ed8'],
  stroke: {
    width: 3,
    curve: 'smooth',
  },
  fill: {
    opacity: 0.28,
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      gradientToColors: ['#60a5fa'],
      opacityFrom: 0.45,
      opacityTo: 0.15,
      stops: [0, 100],
    },
  },
  markers: {
    size: 5,
    colors: ['#ffffff'],
    strokeColors: '#1d4ed8',
    strokeWidth: 2,
    hover: { size: 7 },
  },
  plotOptions: {
    radar: {
      polygons: {
        strokeColors: '#dbeafe',
        connectorColors: '#cbd5e1',
        fill: {
          colors: ['#f8fbff', '#f1f6ff'],
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#0f172a'],
      fontSize: '10px',
      fontWeight: '700',
    },
    background: {
      enabled: true,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#bfdbfe',
      foreColor: '#1e3a8a',
      opacity: 0.9,
      padding: 3,
    },
  },
  tooltip: {
    theme: 'light',
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
      <h3 class="text-sm font-bold text-slate-700">Generik - Radar Indikator</h3>
      <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        Rata-rata: {{ averageScore }}
      </span>
    </div>

    <div class="rounded-xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-4 sm:p-6">
      <ClientOnly>
        <ApexChart
          type="radar"
          height="440"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div
        v-for="indicator in indicators"
        :key="indicator.label"
        class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        <div class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: indicator.color }" />
          <span class="text-xs font-medium text-slate-600">{{ indicator.label }}</span>
        </div>
        <span class="text-sm font-extrabold text-slate-800">{{ indicator.value }}</span>
      </div>
    </div>
  </div>
</template>
