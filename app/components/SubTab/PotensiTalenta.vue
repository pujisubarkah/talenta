<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

const props = defineProps<{
  pegNip?: string
}>()

type Indicator = {
  label: string
  value: number
  color: string
}

const indicators = ref<Indicator[]>([
  { label: 'Kemampuan Intelektual', value: 0, color: '#2563eb' },
  { label: 'Kemampuan Interpersonal', value: 0, color: '#0f766e' },
  { label: 'Kemampuan Berpikir Kritis', value: 0, color: '#7c3aed' },
  { label: 'Kemampuan Menyelesaikan Masalah', value: 0, color: '#d97706' },
  { label: 'Kecerdasan Emosional', value: 0, color: '#dc2626' },
  { label: 'Kemampuan Belajar Cepat', value: 0, color: '#0891b2' },
  { label: 'Motivasi dan Komitmen', value: 0, color: '#16a34a' },
  { label: 'Kemampuan Mengarahkan', value: 0, color: '#9333ea' },
])

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const loadPotensi = async () => {
  if (!props.pegNip) return

  const response = await $fetch<{
    data: {
      potensiKemampuanIntelektual: string | null
      potensiKemampuanInterpersonal: string | null
      potensiKemampuanBerpikirKritis: string | null
      potensiMenyelesaikanPermasalahan: string | null
      potensiKecerdasanEmosional: string | null
      potensiKemampuanBelajarCepat: string | null
      potensiMotivasiKomitmen: string | null
      potensiKemampuanMengarahkan: string | null
    }
  }>(`/api/pegawai/${props.pegNip}/potensi`)

  const data = response?.data
  if (!data) return

  indicators.value = [
    { label: 'Kemampuan Intelektual', value: toNumber(data.potensiKemampuanIntelektual), color: '#2563eb' },
    { label: 'Kemampuan Interpersonal', value: toNumber(data.potensiKemampuanInterpersonal), color: '#0f766e' },
    { label: 'Kemampuan Berpikir Kritis', value: toNumber(data.potensiKemampuanBerpikirKritis), color: '#7c3aed' },
    { label: 'Kemampuan Menyelesaikan Masalah', value: toNumber(data.potensiMenyelesaikanPermasalahan), color: '#d97706' },
    { label: 'Kecerdasan Emosional', value: toNumber(data.potensiKecerdasanEmosional), color: '#dc2626' },
    { label: 'Kemampuan Belajar Cepat', value: toNumber(data.potensiKemampuanBelajarCepat), color: '#0891b2' },
    { label: 'Motivasi dan Komitmen', value: toNumber(data.potensiMotivasiKomitmen), color: '#16a34a' },
    { label: 'Kemampuan Mengarahkan', value: toNumber(data.potensiKemampuanMengarahkan), color: '#9333ea' },
  ]
}

onMounted(loadPotensi)
watch(() => props.pegNip, loadPotensi)

const chartSeries = computed(() => [
  {
    name: 'Skor',
    data: indicators.value.map((indicator) => indicator.value),
  },
])

const chartOptions = computed((): ApexOptions => ({
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
    categories: indicators.value.map((indicator) => indicator.label),
    labels: {
      style: {
        colors: indicators.value.map(() => '#334155'),
        fontSize: '10.5px',
        fontWeight: 700,
        fontFamily: 'Poppins, sans-serif',
      },
    },
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: { show: false },
  },
  colors: ['#7c3aed'],
  stroke: {
    width: 2.5,
    curve: 'smooth',
    colors: ['#7c3aed'],
  },
  fill: {
    opacity: 0.35,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      gradientToColors: ['#c026d3'],
      opacityFrom: 0.55,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  markers: {
    size: 6,
    colors: ['#ffffff'],
    strokeColors: ['#7c3aed'],
    strokeWidth: 2.5,
    shape: 'circle',
    hover: { size: 9 },
  },
  plotOptions: {
    radar: {
      size: 160,
      polygons: {
        strokeColors: '#e2e8f0',
        connectorColors: '#cbd5e1',
        fill: {
          colors: ['#faf5ff', '#f5f3ff'],
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
  const total = indicators.value.reduce((sum, indicator) => sum + indicator.value, 0)
  return indicators.value.length ? (total / indicators.value.length).toFixed(1) : '0.0'
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-bold text-slate-700">Potensi Talenta - Radar Indikator</h3>
      <span class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
        Rata-rata: {{ averageScore }}
      </span>
    </div>

    <div class="rounded-xl border border-purple-100 bg-linear-to-br from-fuchsia-50 via-purple-50 to-indigo-50 p-4 shadow-sm sm:p-6">
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
        class="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2.5 shadow-xs transition hover:border-purple-200 hover:shadow-md"
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
