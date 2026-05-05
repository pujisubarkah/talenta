<script setup lang="ts">
const route = useRoute()
const search = ref('')
const selectedLevel = ref('all')

type RowItem = {
  id: number
  nip: string
  nama: string
  jabatan: string
  unitKerja: string
  level: number
  status: 'Aktif' | 'Draft'
}

const rows = ref<RowItem[]>([
  {
    id: 1,
    nip: '198801012010121001',
    nama: 'Budi Santosa',
    jabatan: 'Analis SDM Aparatur Ahli Madya',
    unitKerja: 'Biro SDM',
    level: 1,
    status: 'Aktif',
  },
  {
    id: 2,
    nip: '198903142011011002',
    nama: 'Sari Wulandari',
    jabatan: 'Kepala Subbagian Perencanaan',
    unitKerja: 'Pusat Kajian Kebijakan',
    level: 2,
    status: 'Aktif',
  },
  {
    id: 3,
    nip: '199002202012031003',
    nama: 'Rizki Pratama',
    jabatan: 'Analis Kebijakan Ahli Pertama',
    unitKerja: 'Pusat Pelatihan',
    level: 3,
    status: 'Draft',
  },
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

  return rows.value.filter((row) => {
    const levelMatch = selectedLevel.value === 'all' || row.level === Number(selectedLevel.value)
    const textMatch =
      !query ||
      row.nip.toLowerCase().includes(query) ||
      row.nama.toLowerCase().includes(query) ||
      row.jabatan.toLowerCase().includes(query) ||
      row.unitKerja.toLowerCase().includes(query)

    return levelMatch && textMatch
  })
})
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">{{ title }}</h1>
        <p class="text-sm text-slate-500">Template tabel standar Talent Pool.</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-[#146190] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4d73]"
      >
        + Tambah Data
      </button>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="md:col-span-2">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cari Data</label>
          <input
            v-model="search"
            type="text"
            placeholder="Cari berdasarkan NIP, nama, jabatan, atau unit kerja"
            class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Filter Level</label>
          <select
            v-model="selectedLevel"
            class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-[#3781c7] focus:outline-none"
          >
            <option value="all">Semua Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
            <option value="6">Level 6</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">NIP</th>
              <th class="px-4 py-3 text-left font-semibold">Nama</th>
              <th class="px-4 py-3 text-left font-semibold">Jabatan</th>
              <th class="px-4 py-3 text-left font-semibold">Unit Kerja</th>
              <th class="px-4 py-3 text-center font-semibold">Level</th>
              <th class="px-4 py-3 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <tr v-for="row in filteredRows" :key="row.id" class="hover:bg-slate-50">
              <td class="px-4 py-3">{{ row.nip }}</td>
              <td class="px-4 py-3">{{ row.nama }}</td>
              <td class="px-4 py-3">{{ row.jabatan }}</td>
              <td class="px-4 py-3">{{ row.unitKerja }}</td>
              <td class="px-4 py-3 text-center">{{ row.level }}</td>
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
              <td colspan="6" class="px-4 py-6 text-center text-sm text-slate-400">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
