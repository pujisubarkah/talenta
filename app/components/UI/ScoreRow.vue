<script setup lang="ts">
interface Props {
  criterion: {
    label: string
    nilai: string
    bobot: string
    penjumlahan: string
    options?: { label: string; value: string }[]
    type: 'number' | 'select'
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:nilai', value: string): void
  (e: 'update:bobot', value: string): void
}>()

const pilihanJawaban = [
  { label: 'Sangat Kurang', value: '20' },
  { label: 'Kurang', value: '40' },
  { label: 'Cukup', value: '60' },
  { label: 'Baik', value: '80' },
  { label: 'Sangat Baik', value: '100' },
]

const updateNilai = (val: string) => emit('update:nilai', val)

const hitungPenjumlahan = () => {
  const n = parseFloat(props.criterion.nilai) || 0
  const b = parseFloat(props.criterion.bobot) || 0
  props.criterion.penjumlahan = (n * b / 100).toFixed(2)
}
</script>

<template>
  <div class="grid grid-cols-4 gap-4 items-center">
    <span class="text-sm font-semibold text-slate-700">{{ props.criterion.label }}</span>
    <div>
      <input
        v-if="props.criterion.type === 'number'"
        v-model="props.criterion.nilai"
        type="number"
        placeholder="0"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        @input="hitungPenjumlahan"
      />
      <select
        v-else
        v-model="props.criterion.nilai"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none bg-white"
        @change="hitungPenjumlahan"
      >
        <option value="">Pilih</option>
        <option v-for="opt in (props.criterion.options || pilihanJawaban)" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>
    <input
      v-model="props.criterion.bobot"
      type="number"
      placeholder="0"
      class="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-600 text-center cursor-default"
      readonly
    />
    <input
      :value="props.criterion.penjumlahan"
      type="text"
      readonly
      placeholder="—"
      class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 text-center font-medium"
    />
  </div>
</template>

