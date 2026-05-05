<script setup lang="ts">
const route = useRoute()
const search = ref('')

type RowItem = {
  id: number
  kode: string
  nama: string
  keterangan: string
  status: 'Aktif' | 'Draft'
}

const rows = ref<RowItem[]>([
  { id: 1, kode: 'REF-001', nama: 'Contoh Data 1', keterangan: 'Keterangan data 1', status: 'Aktif' },
  { id: 2, kode: 'REF-002', nama: 'Contoh Data 2', keterangan: 'Keterangan data 2', status: 'Aktif' },
  { id: 3, kode: 'REF-003', nama: 'Contoh Data 3', keterangan: 'Keterangan data 3', status: 'Draft' },
])

const title = computed(() => {
  const slug = String(route.params.slug || '')
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return rows.value
  return rows.value.filter(
    (row) =>
      row.kode.toLowerCase().includes(query) ||
      row.nama.toLowerCase().includes(query) ||
      row.keterangan.toLowerCase().includes(query),
  )
})
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">{{ title }}</h1>
        <p class="text-sm text-slate-500">Modul Referensi</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-[#146190] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4d73]"
      >
        + Tambah Data
      </button>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cari Data</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari berdasarkan kode, nama, atau keterangan"
          class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
        />
      </div>

      <div class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">Kode</th>
              <th class="px-4 py-3 text-left font-semibold">Nama</th>
              <th class="px-4 py-3 text-left font-semibold">Keterangan</th>
              <th class="px-4 py-3 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <tr v-for="row in filteredRows" :key="row.id" class="hover:bg-slate-50">
              <td class="px-4 py-3">{{ row.kode }}</td>
              <td class="px-4 py-3">{{ row.nama }}</td>
              <td class="px-4 py-3">{{ row.keterangan }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="row.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ row.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredRows.length === 0">
              <td colspan="4" class="px-4 py-6 text-center text-sm text-slate-400">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
