<script setup lang="ts">
const router = useRouter()
const search = ref('')

type RowItem = {
  id: number
  jabatan: string
  eselon: string
  pegawai: string
  keterangan: string
}

const rows = ref<RowItem[]>([
  {
    id: 1,
    jabatan: 'Kepala Biro SDM',
    eselon: 'II',
    pegawai: 'Budi Santosa',
    keterangan: 'Lowong per Januari 2026',
  },
  {
    id: 2,
    jabatan: 'Kepala Subbagian Perencanaan',
    eselon: 'IV',
    pegawai: 'Sari Wulandari',
    keterangan: 'Pensiun Maret 2026',
  },
  {
    id: 3,
    jabatan: 'Analis Kebijakan Ahli Madya',
    eselon: 'III',
    pegawai: 'Rizki Pratama',
    keterangan: 'Mutasi ke unit lain',
  },
])

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return rows.value
  return rows.value.filter(
    (row) =>
      row.jabatan.toLowerCase().includes(query) ||
      row.eselon.toLowerCase().includes(query) ||
      row.pegawai.toLowerCase().includes(query) ||
      row.keterangan.toLowerCase().includes(query),
  )
})
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Daftar Lowongan Jabatan Target</h1>
        <p class="text-sm text-slate-500">Modul Suksesi</p>
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
          placeholder="Cari berdasarkan jabatan, eselon, atau pegawai"
          class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
        />
      </div>

      <div class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-center font-semibold w-12">No</th>
              <th class="px-4 py-3 text-left font-semibold">Jabatan</th>
              <th class="px-4 py-3 text-center font-semibold w-24">Eselon</th>
              <th class="px-4 py-3 text-left font-semibold">Pegawai</th>
              <th class="px-4 py-3 text-left font-semibold">Keterangan</th>
              <th class="px-4 py-3 text-center font-semibold w-36">Rencana Suksesi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <tr v-for="(row, index) in filteredRows" :key="row.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
              <td class="px-4 py-3">{{ row.jabatan }}</td>
              <td class="px-4 py-3 text-center">{{ row.eselon }}</td>
              <td class="px-4 py-3">{{ row.pegawai }}</td>
              <td class="px-4 py-3">{{ row.keterangan }}</td>
              <td class="px-4 py-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg bg-[#146190] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f4d73]"
                  @click="router.push(`/suksesi/daftar-lowongan-jabatan-target/input-syarat/${row.id}`)"
                >
                  Promosi
                </button>
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
