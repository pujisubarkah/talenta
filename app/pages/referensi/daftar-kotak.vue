<script setup lang="ts">
type KotakTalenta = {
  id: number
  title: string | null
  colorClass: string | null
}

const presets = [
  // Warna existing (sesuai matrix lama)
  { className: 'bg-orange-200 text-orange-900', bgColor: '#fed7aa', textColor: '#7c2d12' },
  { className: 'bg-yellow-300 text-yellow-900', bgColor: '#fde047', textColor: '#713f12' },
  { className: 'bg-green-400 text-white', bgColor: '#4ade80', textColor: '#ffffff' },
  { className: 'bg-gray-200 text-gray-700', bgColor: '#e5e7eb', textColor: '#374151' },
  { className: 'bg-blue-200 text-blue-900', bgColor: '#bfdbfe', textColor: '#1e3a8a' },
  { className: 'bg-blue-400 text-white', bgColor: '#60a5fa', textColor: '#ffffff' },
  { className: 'bg-red-500 text-white', bgColor: '#ef4444', textColor: '#ffffff' },
  { className: 'bg-pink-200 text-pink-900', bgColor: '#fbcfe8', textColor: '#831843' },
  { className: 'bg-cyan-200 text-cyan-900', bgColor: '#a5f3fc', textColor: '#164e63' },

  // Warna baru pilihan user
  { className: 'bg-rose-500 text-white', bgColor: '#f43f5e', textColor: '#ffffff' },
  { className: 'bg-amber-500 text-white', bgColor: '#f59e0b', textColor: '#ffffff' },
  { className: 'bg-lime-500 text-white', bgColor: '#84cc16', textColor: '#ffffff' },
  { className: 'bg-emerald-500 text-white', bgColor: '#10b981', textColor: '#ffffff' },
  { className: 'bg-teal-500 text-white', bgColor: '#14b8a6', textColor: '#ffffff' },
  { className: 'bg-indigo-500 text-white', bgColor: '#6366f1', textColor: '#ffffff' },
  { className: 'bg-violet-500 text-white', bgColor: '#8b5cf6', textColor: '#ffffff' },
  { className: 'bg-fuchsia-500 text-white', bgColor: '#d946ef', textColor: '#ffffff' },
  { className: 'bg-slate-600 text-white', bgColor: '#475569', textColor: '#ffffff' },
  { className: 'bg-zinc-600 text-white', bgColor: '#52525b', textColor: '#ffffff' },
]

const savingId = ref<number | null>(null)
const saveError = ref('')
const saveSuccess = ref('')
const draftColors = reactive<Record<number, string>>({})

const { data, status, error, refresh } = useFetch<{ data: KotakTalenta[] }>('/api/daftar-kotak', {
  query: { activeOnly: false },
})

const rows = computed(() => data.value?.data ?? [])

function pickColor(rowId: number, className: string) {
  draftColors[rowId] = className
}

function isColorSelected(rowId: number, className: string) {
  return (draftColors[rowId] ?? '') === className
}

function getPreviewStyle(rowId: number) {
  const preset = presets.find((item) => item.className === (draftColors[rowId] ?? ''))
  if (!preset) return undefined
  return {
    backgroundColor: preset.bgColor,
    color: preset.textColor,
  }
}

watch(rows, (items) => {
  for (const row of items) {
    draftColors[row.id] = row.colorClass ?? ''
  }
}, { immediate: true })

async function saveColor(row: KotakTalenta) {
  try {
    savingId.value = row.id
    saveError.value = ''
    saveSuccess.value = ''

    const colorClass = (draftColors[row.id] ?? '').trim()

    await $fetch(`/api/daftar-kotak/${row.id}`, {
      method: 'PATCH',
      body: { colorClass },
    })

    saveSuccess.value = `Warna untuk kotak #${row.id} berhasil diperbarui.`
    await refresh()
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Gagal menyimpan perubahan warna.'
    saveError.value = message
  } finally {
    savingId.value = null
  }
}
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Daftar Kotak</h1>
        <p class="text-sm text-slate-500">Referensi warna kotak talenta</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <p v-if="saveSuccess" class="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        {{ saveSuccess }}
      </p>
      <p v-if="saveError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ saveError }}
      </p>

      <div v-if="status === 'pending'" class="py-10 text-center text-sm text-slate-400">
        Memuat data...
      </div>

      <div v-else-if="error" class="py-10 text-center text-sm text-red-500">
        Gagal memuat data: {{ error.message }}
        <button class="ml-2 underline" @click="refresh()">Coba lagi</button>
      </div>

      <div v-else class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">ID</th>
              <th class="px-4 py-3 text-left font-semibold">Title</th>
              <th class="px-4 py-3 text-left font-semibold">Warna</th>
              <th class="px-4 py-3 text-left font-semibold">Preview</th>
              <th class="px-4 py-3 text-left font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <tr v-for="row in rows" :key="row.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 font-mono text-xs">{{ row.id }}</td>
              <td class="px-4 py-3 font-medium">{{ row.title ?? '-' }}</td>
              <td class="px-4 py-3 min-w-90">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="preset in presets"
                    :key="preset.className"
                    type="button"
                    class="h-7 w-7 rounded-full border-2 transition"
                    :style="{ backgroundColor: preset.bgColor }"
                    :class="[
                      isColorSelected(row.id, preset.className)
                        ? 'border-slate-900 ring-2 ring-slate-300'
                        : 'border-slate-200 hover:border-slate-400',
                    ]"
                    :title="preset.className"
                    @click="pickColor(row.id, preset.className)"
                  />
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  :style="getPreviewStyle(row.id)"
                  :class="!getPreviewStyle(row.id) ? 'bg-slate-100 text-slate-500' : ''"
                >
                  {{ row.title ?? 'Preview' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button
                  class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                  :disabled="savingId === row.id"
                  @click="saveColor(row)"
                >
                  {{ savingId === row.id ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-sm text-slate-400">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
