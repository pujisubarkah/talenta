<script setup lang="ts">
const router = useRouter()
const search = ref('')

type RencanaSuksesi = {
  id: number
  jabatan: string
  unitKerja: string
  jenisSuksesi: string
  tanggalSuksesi: string
}

const rows = ref<RencanaSuksesi[]>([
  {
    id: 1,
    jabatan: 'Kepala Biro SDM',
    unitKerja: 'Biro Sumber Daya Manusia',
    jenisSuksesi: 'Promosi',
    tanggalSuksesi: '2026-07-01',
  },
  {
    id: 2,
    jabatan: 'Kepala Subbagian Perencanaan',
    unitKerja: 'Biro Perencanaan',
    jenisSuksesi: 'Rotasi',
    tanggalSuksesi: '2026-08-15',
  },
  {
    id: 3,
    jabatan: 'Analis Kebijakan Ahli Madya',
    unitKerja: 'Direktorat Kebijakan',
    jenisSuksesi: 'Promosi',
    tanggalSuksesi: '2026-09-01',
  },
])

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return rows.value
  return rows.value.filter(
    (row) =>
      row.jabatan.toLowerCase().includes(query) ||
      row.unitKerja.toLowerCase().includes(query) ||
      row.jenisSuksesi.toLowerCase().includes(query) ||
      row.tanggalSuksesi.includes(query),
  )
})

const formatTanggal = (iso: string) => {
  const [y, m, d] = iso.split('-')
  const bulan = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']

  if (!y || !m || !d) return iso

  const monthIndex = Number.parseInt(m, 10)
  const namaBulan = bulan[monthIndex] ?? ''

  return `${d} ${namaBulan} ${y}`
}

const jenisBadgeClass = (jenis: string) => {
  if (jenis === 'Promosi') return 'bg-green-100 text-green-700'
  if (jenis === 'Rotasi') return 'bg-blue-100 text-blue-700'
  return 'bg-slate-100 text-slate-600'
}

const deleteRow = (id: number) => {
  const idx = rows.value.findIndex((r) => r.id === id)
  if (idx !== -1) rows.value.splice(idx, 1)
}
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Daftar Rencana Suksesi</h1>
        <p class="text-sm text-slate-500">Modul Suksesi</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-[#146190] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4d73]"
      >
        + Tambah Rencana
      </button>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cari Data</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari berdasarkan jabatan, unit kerja, atau jenis suksesi"
          class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
        />
      </div>

      <div class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-center font-semibold w-12">No</th>
              <th class="px-4 py-3 text-left font-semibold">Jabatan</th>
              <th class="px-4 py-3 text-left font-semibold">Unit Kerja</th>
              <th class="px-4 py-3 text-center font-semibold w-32">Jenis Suksesi</th>
              <th class="px-4 py-3 text-center font-semibold w-36">Tanggal Suksesi</th>
              <th class="px-4 py-3 text-center font-semibold w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <tr
              v-for="(row, index) in filteredRows"
              :key="row.id"
              class="hover:bg-slate-50"
            >
              <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ row.jabatan }}</td>
              <td class="px-4 py-3 text-slate-600">{{ row.unitKerja }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="jenisBadgeClass(row.jenisSuksesi)"
                >
                  {{ row.jenisSuksesi }}
                </span>
              </td>
              <td class="px-4 py-3 text-center text-slate-600">{{ formatTanggal(row.tanggalSuksesi) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-lg border border-[#146190] px-3 py-1.5 text-xs font-semibold text-[#146190] transition hover:bg-[#146190] hover:text-white"
                    @click="router.push(`/suksesi/daftar-rencana-suksesi/${row.id}`)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-lg border border-red-400 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                    @click="deleteRow(row.id)"
                  >
                    Hapus
                  </button>
                </div>
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
