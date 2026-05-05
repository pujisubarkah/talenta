<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const jenisJabatanOptions = ['Struktural', 'Fungsional', 'Pelaksana']
const jenisSuksesiOptions = ['Promosi', 'Rotasi', 'Pensiun', 'Mutasi']

const activeTab = ref<'suksesi' | 'kandidat'>('suksesi')

type KandidatRow = {
  foto: string
  nama: string
  nip: string
  jabatan: string
  pangkat: string
  nilaiKinerja: number
  nilaiKompetensi: number
  nilaiAkhir: number
  isKandidat: boolean
}

const daftarSuksesi = ref<KandidatRow[]>([
  { foto: '', nama: 'Ahmad Fauzi', nip: '198501012010011001', jabatan: 'Kepala Subbagian SDM', pangkat: 'IV/a', nilaiKinerja: 87, nilaiKompetensi: 82, nilaiAkhir: 85, isKandidat: true },
  { foto: '', nama: 'Siti Rahayu', nip: '198703152012012002', jabatan: 'Analis SDM Ahli Muda', pangkat: 'III/d', nilaiKinerja: 80, nilaiKompetensi: 78, nilaiAkhir: 79, isKandidat: false },
  { foto: '', nama: 'Budi Santoso', nip: '199001012015011003', jabatan: 'Perencana Ahli Muda', pangkat: 'III/c', nilaiKinerja: 75, nilaiKompetensi: 73, nilaiAkhir: 74, isKandidat: false },
])

const daftarKandidat = ref<KandidatRow[]>([
  { foto: '', nama: 'Dewi Lestari', nip: '198806202011012004', jabatan: 'Kepala Subbagian Keuangan', pangkat: 'IV/a', nilaiKinerja: 90, nilaiKompetensi: 88, nilaiAkhir: 89, isKandidat: true },
  { foto: '', nama: 'Hendra Wijaya', nip: '199205102014011005', jabatan: 'Analis Kebijakan Ahli Muda', pangkat: 'III/d', nilaiKinerja: 83, nilaiKompetensi: 81, nilaiAkhir: 82, isKandidat: true },
])

const activeRows = computed(() => activeTab.value === 'suksesi' ? daftarSuksesi.value : daftarKandidat.value)

const toggleKandidat = (row: KandidatRow) => {
  row.isKandidat = !row.isKandidat
}

const form = reactive({
  namaJabatan: '',
  jenisJabatan: '',
  unitKerja: '',
  jenisSuksesi: '',
  tanggalSuksesi: '',
})

// Dummy pre-fill berdasarkan id
const dummyData: Record<string, typeof form> = {
  '1': {
    namaJabatan: 'Kepala Biro SDM',
    jenisJabatan: 'Struktural',
    unitKerja: 'Biro Sumber Daya Manusia',
    jenisSuksesi: 'Promosi',
    tanggalSuksesi: '2026-07-01',
  },
  '2': {
    namaJabatan: 'Kepala Subbagian Perencanaan',
    jenisJabatan: 'Struktural',
    unitKerja: 'Biro Perencanaan',
    jenisSuksesi: 'Rotasi',
    tanggalSuksesi: '2026-08-15',
  },
  '3': {
    namaJabatan: 'Analis Kebijakan Ahli Madya',
    jenisJabatan: 'Fungsional',
    unitKerja: 'Direktorat Kebijakan',
    jenisSuksesi: 'Promosi',
    tanggalSuksesi: '2026-09-01',
  },
}

if (dummyData[id]) {
  Object.assign(form, dummyData[id])
}
</script>

<template>
  <div class="p-6 space-y-4">
    <div>
      <h1 class="text-xl font-bold text-slate-800">Edit Rencana Suksesi</h1>
      <p class="text-sm text-slate-500">Modul Suksesi</p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid grid-cols-3 gap-x-8 gap-y-5">
        <!-- Nama Jabatan -->
        <label class="flex items-center text-sm font-semibold text-slate-700">
          Nama Jabatan
        </label>
        <div class="col-span-2">
          <input
            v-model="form.namaJabatan"
            type="text"
            placeholder="Masukkan nama jabatan"
            class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
          />
        </div>

        <!-- Jenis Jabatan -->
        <label class="flex items-center text-sm font-semibold text-slate-700">
          Jenis Jabatan
        </label>
        <div class="col-span-2">
          <div class="relative">
            <select
              v-model="form.jenisJabatan"
              class="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-700 focus:border-[#3781c7] focus:outline-none"
              style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25rem;"
            >
              <option value="" disabled>Pilih jenis jabatan</option>
              <option v-for="opt in jenisJabatanOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>

        <!-- Unit Kerja -->
        <label class="flex items-center text-sm font-semibold text-slate-700">
          Unit Kerja
        </label>
        <div class="col-span-2">
          <input
            v-model="form.unitKerja"
            type="text"
            placeholder="Masukkan unit kerja"
            class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
          />
        </div>

        <!-- Jenis Suksesi -->
        <label class="flex items-center text-sm font-semibold text-slate-700">
          Jenis Suksesi
        </label>
        <div class="col-span-2">
          <div class="relative">
            <select
              v-model="form.jenisSuksesi"
              class="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-700 focus:border-[#3781c7] focus:outline-none"
              style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25rem;"
            >
              <option value="" disabled>Pilih jenis suksesi</option>
              <option v-for="opt in jenisSuksesiOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>

        <!-- Tanggal Suksesi -->
        <label class="flex items-center text-sm font-semibold text-slate-700">
          Tanggal Suksesi
        </label>
        <div class="col-span-2">
          <input
            v-model="form.tanggalSuksesi"
            type="date"
            class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-[#3781c7] focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div>
      <!-- Tab Header -->
      <div class="flex flex-wrap gap-x-1 items-end">
        <button
          type="button"
          class="relative px-5 py-2 text-sm font-semibold transition-all duration-150 rounded-t-lg border border-b-0 whitespace-nowrap"
          :class="activeTab === 'suksesi'
            ? 'bg-[#146190] text-white border-[#146190] z-10 -mb-px pb-2.25'
            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'"
          @click="activeTab = 'suksesi'"
        >
          Daftar Suksesi
        </button>
        <button
          type="button"
          class="relative px-5 py-2 text-sm font-semibold transition-all duration-150 rounded-t-lg border border-b-0 whitespace-nowrap"
          :class="activeTab === 'kandidat'
            ? 'bg-[#146190] text-white border-[#146190] z-10 -mb-px pb-2.25'
            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'"
          @click="activeTab = 'kandidat'"
        >
          Daftar Kandidat
        </button>
      </div>

      <!-- Tab Content -->
      <div class="rounded-b-xl rounded-tr-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="overflow-x-auto rounded-lg border border-slate-100">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr>
                <th class="px-4 py-3 text-center font-semibold w-12">No</th>
                <th class="px-4 py-3 text-center font-semibold w-16">Foto</th>
                <th class="px-4 py-3 text-left font-semibold">Pegawai</th>
                <th class="px-4 py-3 text-left font-semibold">Jabatan</th>
                <th class="px-4 py-3 text-center font-semibold w-28">Pangkat</th>
                <th class="px-4 py-3 text-center font-semibold">Nilai Kinerja & Potensial</th>
                <th class="px-4 py-3 text-center font-semibold">Nilai Kompetensi Teknis/Bidang Tugas</th>
                <th class="px-4 py-3 text-center font-semibold w-24">Nilai Akhir</th>
                <th class="px-4 py-3 text-center font-semibold w-28">Kandidat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
              <tr
                v-for="(row, index) in activeRows"
                :key="row.nip"
                class="hover:bg-slate-50"
              >
                <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-center">
                  <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-xs font-bold">
                    {{ row.nama.charAt(0) }}
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-slate-800">{{ row.nama }}</div>
                  <div class="text-xs text-slate-400">{{ row.nip }}</div>
                </td>
                <td class="px-4 py-3 text-slate-600">{{ row.jabatan }}</td>
                <td class="px-4 py-3 text-center">{{ row.pangkat }}</td>
                <td class="px-4 py-3 text-center font-medium">{{ row.nilaiKinerja }}</td>
                <td class="px-4 py-3 text-center font-medium">{{ row.nilaiKompetensi }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {{ row.nilaiAkhir }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition"
                    :class="row.isKandidat
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
                    @click="toggleKandidat(row)"
                  >
                    {{ row.isKandidat ? '✓ Kandidat' : 'Tandai' }}
                  </button>
                </td>
              </tr>
              <tr v-if="activeRows.length === 0">
                <td colspan="9" class="px-4 py-6 text-center text-sm text-slate-400">
                  Data tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
