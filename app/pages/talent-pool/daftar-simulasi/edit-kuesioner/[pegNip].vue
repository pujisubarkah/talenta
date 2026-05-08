<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const pegNip = String(route.params.pegNip || '')
const slug = String(route.params.slug || '')


import { onMounted } from 'vue'
const spesifikList = ref<Array<{ id: string, nama: string, bobot: string, nilai: string, penjumlahan: string }>>([])
const spesifikLoading = ref(false)
const spesifikError = ref('')

onMounted(async () => {
  spesifikLoading.value = true
  spesifikError.value = ''
  try {
    const res = await fetch('/api/master/penilaian-spesifik')
    const json = await res.json()
    spesifikList.value = (json.data || []).map((item: any) => ({
      id: item.id,
      nama: item.nama,
      bobot: item.bobot,
      nilai: '',
      penjumlahan: ''
    }))
  } catch (e) {
    spesifikError.value = 'Gagal memuat data penilaian spesifik.'
  } finally {
    spesifikLoading.value = false
  }
})

const generikList = ref<Array<{ id: string, nama: string, bobot: string, nilai: string, penjumlahan: string }>>([])
const generikLoading = ref(false)
const generikError = ref('')

onMounted(async () => {
  // ...existing spesifik fetch...
  spesifikLoading.value = true
  spesifikError.value = ''
  try {
    const res = await fetch('/api/master/penilaian-spesifik')
    const json = await res.json()
    spesifikList.value = (json.data || []).map((item: any) => ({
      id: item.id,
      nama: item.nama,
      bobot: item.bobot,
      nilai: '',
      penjumlahan: ''
    }))
  } catch (e) {
    spesifikError.value = 'Gagal memuat data penilaian spesifik.'
  } finally {
    spesifikLoading.value = false
  }

  // Penilaian Generik
  generikLoading.value = true
  generikError.value = ''
  try {
    const res = await fetch('/api/master/penilaian-generik')
    const json = await res.json()
    generikList.value = (json.data || []).map((item: any) => ({
      id: item.id,
      nama: item.nama,
      bobot: item.bobot,
      nilai: '',
      penjumlahan: ''
    }))
  } catch (e) {
    generikError.value = 'Gagal memuat data penilaian generik.'
  } finally {
    generikLoading.value = false
  }
})

const kemampuanIntelektual = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const kemampuanInterpersonal = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const kemampuanBerpikir = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const kemampuanMenyelesaikanMasalah = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const kecerdasanEmosional = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const kemampuanBelajarCepat = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const motivasiDanKomitmen = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const kemampuanMengarahkan = reactive({ nilai: '', bobot: '', penjumlahan: '' })

const potensiItems = [
  { key: 'kemampuanIntelektual', label: 'Kemampuan Intelektual', data: kemampuanIntelektual },
  { key: 'kemampuanInterpersonal', label: 'Kemampuan Interpersonal', data: kemampuanInterpersonal },
  { key: 'kemampuanBerpikir', label: 'Kemampuan Berpikir', data: kemampuanBerpikir },
  { key: 'kemampuanMenyelesaikanMasalah', label: 'Kemampuan Menyelesaikan Masalah', data: kemampuanMenyelesaikanMasalah },
  { key: 'kecerdasanEmosional', label: 'Kecerdasan Emosional', data: kecerdasanEmosional },
  { key: 'kemampuanBelajarCepat', label: 'Kemampuan Belajar Cepat', data: kemampuanBelajarCepat },
  { key: 'motivasiDanKomitmen', label: 'Motivasi dan Komitmen', data: motivasiDanKomitmen },
  { key: 'kemampuanMengarahkan', label: 'Kemampuan Mengarahkan', data: kemampuanMengarahkan },
]

type RekamOption = {
  label: string
  value: number
}

type RekamCriterion = {
  key: string
  label: string
  bobot: number
  options: RekamOption[]
}

type RekamFormItem = {
  selectedLabel: string
  nilai: number
  bobot: number
  skor: number
}

const rekamCriteria: RekamCriterion[] = [
  {
    key: 'kualifikasi',
    label: 'Kualifikasi',
    bobot: 3,
    options: [
      { label: 'S3', value: 100 },
      { label: 'S2', value: 80 },
      { label: 'S1/D4', value: 60 },
      { label: 'D3', value: 40 },
    ],
  },
  {
    key: 'pangkatGolonganRuang',
    label: 'Pangkat/Golongan Ruang',
    bobot: 3,
    options: [
      { label: 'IV/c ke atas', value: 100 },
      { label: 'IV/a - IV/b', value: 80 },
      { label: 'III/c - III/d', value: 60 },
      { label: 'III/b ke bawah', value: 40 },
    ],
  },
  {
    key: 'masaKerja',
    label: 'Masa Kerja',
    bobot: 3,
    options: [
      { label: '>10 tahun', value: 100 },
      { label: '5-10 tahun', value: 80 },
      { label: '0-5 tahun', value: 20 },
    ],
  },
  {
    key: 'pengalamanOrganisasi',
    label: 'Pengalaman dalam Organisasi',
    bobot: 3,
    options: [
      { label: 'Sangat Aktif', value: 100 },
      { label: 'Aktif', value: 80 },
      { label: 'Cukup', value: 60 },
      { label: 'Kurang', value: 20 },
    ],
  },
  {
    key: 'diklatKepemimpinan',
    label: 'Diklat Kepemimpinan',
    bobot: 3,
    options: [
      { label: 'Sudah sesuai', value: 100 },
      { label: 'Belum', value: 0 },
    ],
  },
  {
    key: 'pengembanganKompetensi',
    label: 'Pengembangan Kompetensi',
    bobot: 3,
    options: [
      { label: 'Sangat Baik', value: 100 },
      { label: 'Baik', value: 80 },
      { label: 'Cukup', value: 60 },
      { label: 'Kurang', value: 20 },
    ],
  },
  {
    key: 'penghargaan',
    label: 'Penghargaan',
    bobot: 3,
    options: [
      { label: 'Nasional/Internasional', value: 100 },
      { label: 'Instansi', value: 80 },
      { label: 'Unit Kerja', value: 60 },
      { label: 'Tidak ada', value: 0 },
    ],
  },
  {
    key: 'integritasMoralitas',
    label: 'Integritas/Moralitas',
    bobot: 3,
    options: [
      { label: 'Sangat Baik', value: 100 },
      { label: 'Baik', value: 80 },
      { label: 'Cukup', value: 60 },
      { label: 'Kurang', value: 20 },
    ],
  },
]

const buildInitialState = (): Record<string, RekamFormItem> => {
  const result: Record<string, RekamFormItem> = {}
  for (const item of rekamCriteria) {
    const first = item.options[0] ?? { label: '', value: 0 }
    const skor = (first.value / 100) * item.bobot
    result[item.key] = {
      selectedLabel: first.label,
      nilai: first.value,
      bobot: item.bobot,
      skor,
    }
  }
  return result
}

const rekamJejakForm = useState<Record<string, RekamFormItem>>(
  `rekam-jejak-jabatan-${pegNip}`,
  buildInitialState,
)

const format2 = (num: number) => num.toFixed(2)

const onSelectRekam = (criterion: RekamCriterion, selectedLabel: string) => {
  const selected = criterion.options.find((o) => o.label === selectedLabel)
  if (!selected) return

  const skor = (selected.value / 100) * criterion.bobot
  rekamJejakForm.value[criterion.key] = {
    selectedLabel: selected.label,
    nilai: selected.value,
    bobot: criterion.bobot,
    skor,
  }
}

const hitungPenjumlahanSpesifik = (item: { nilai: string; bobot: string; penjumlahan: string }) => {
  const nilai = parseFloat(item.nilai)
  const bobot = parseFloat(item.bobot)
  item.penjumlahan = !isNaN(nilai) && !isNaN(bobot) ? ((nilai / 100) * bobot).toFixed(2) : ''
}

const totalSkorRekam = computed(() => {
  return rekamCriteria.reduce((sum, criterion) => {
    return sum + (rekamJejakForm.value[criterion.key]?.skor || 0)
  }, 0)
})

const pertimbanganCriteria: RekamCriterion[] = [
  {
    key: 'kesesuaianPendidikan',
    label: 'Kesesuaian Pendidikan dengan Jabatan Target',
    bobot: 3,
    options: [
      { label: 'Sangat Sesuai', value: 100 },
      { label: 'Sesuai', value: 80 },
      { label: 'Kurang Sesuai', value: 60 },
      { label: 'Tidak Sesuai', value: 20 },
    ],
  },
  {
    key: 'pengalamanOrganisasi',
    label: 'Pengalaman Organisasi',
    bobot: 3,
    options: [
      { label: 'Sangat Aktif', value: 100 },
      { label: 'Aktif', value: 80 },
      { label: 'Cukup', value: 60 },
      { label: 'Kurang', value: 20 },
    ],
  },
  {
    key: 'pertimbanganAtasan',
    label: 'Pertimbangan Atasan',
    bobot: 3,
    options: [
      { label: 'Sangat Mendukung', value: 100 },
      { label: 'Mendukung', value: 80 },
      { label: 'Kurang Mendukung', value: 60 },
      { label: 'Tidak Mendukung', value: 20 },
    ],
  },
]

const buildPertimbanganState = (): Record<string, RekamFormItem> => {
  const result: Record<string, RekamFormItem> = {}
  for (const item of pertimbanganCriteria) {
    const first = item.options[0] ?? { label: '', value: 0 }
    const skor = (first.value / 100) * item.bobot
    result[item.key] = {
      selectedLabel: first.label,
      nilai: first.value,
      bobot: item.bobot,
      skor,
    }
  }
  return result
}

const pertimbanganForm = useState<Record<string, RekamFormItem>>(
  `pertimbangan-lainnya-${pegNip}`,
  buildPertimbanganState,
)

const onSelectPertimbangan = (criterion: RekamCriterion, selectedLabel: string) => {
  const selected = criterion.options.find((o) => o.label === selectedLabel)
  if (!selected) return

  const skor = (selected.value / 100) * criterion.bobot
  pertimbanganForm.value[criterion.key] = {
    selectedLabel: selected.label,
    nilai: selected.value,
    bobot: criterion.bobot,
    skor,
  }
}

const integritas = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const komunikasi = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const orientasiPadaHasil = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const kerjasama = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const pelayananPublik = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const pengembanganDiriDanOrangLain = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const mengelolaPerubahan = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const pengambilanKeputusan = reactive({ nilai: '', bobot: '', penjumlahan: '' })
const perekatBangsa = reactive({ nilai: '', bobot: '', penjumlahan: '' })

const kompetensiItems = [
  { key: 'integritas', label: 'Integritas', data: integritas },
  { key: 'komunikasi', label: 'Komunikasi', data: komunikasi },
  { key: 'orientasiPadaHasil', label: 'Orientasi pada Hasil', data: orientasiPadaHasil },
  { key: 'kerjasama', label: 'Kerjasama', data: kerjasama },
  { key: 'pelayananPublik', label: 'Pelayanan Publik', data: pelayananPublik },
  { key: 'pengembanganDiriDanOrangLain', label: 'Pengembangan Diri dan Orang Lain', data: pengembanganDiriDanOrangLain },
  { key: 'mengelolaPerubahan', label: 'Mengelola Perubahan', data: mengelolaPerubahan },
  { key: 'pengambilanKeputusan', label: 'Pengambilan Keputusan', data: pengambilanKeputusan },
  { key: 'perekatBangsa', label: 'Perekat Bangsa', data: perekatBangsa },
]
</script>

<template>
  <div class="p-2 space-y-2">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Edit Kuesioner Simulasi</h1>
        
      </div>
      <NuxtLink
        :to="`/talent-pool/${slug}`"
        class="inline-flex items-center gap-1 text-sm font-semibold text-[#146190] hover:underline"
      >
        ← Kembali ke Daftar Simulasi
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3">
        <h2 class="text-white font-semibold text-sm tracking-wide">Penilaian Spesifik</h2>
      </div>

      <div class="p-6 space-y-6">
        <div v-if="spesifikLoading" class="text-sm text-slate-500">Memuat data penilaian spesifik...</div>
        <div v-else-if="spesifikError" class="text-sm text-red-500">{{ spesifikError }}</div>
        <template v-else>
          <div>
            <div v-for="item in spesifikList" :key="item.id" class="grid grid-cols-4 gap-4 items-center">
              <div>
                <span class="text-sm font-semibold text-slate-700">{{ item.nama }}</span>
              </div>
              <div>
                <input
                  v-model="item.nilai"
                  type="number"
                  placeholder="Nilai"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center focus:border-[#3781c7] focus:outline-none"
                  @input="item.penjumlahan = (!isNaN(parseFloat(item.nilai)) && !isNaN(parseFloat(item.bobot))) ? ((parseFloat(item.nilai) / 100) * parseFloat(item.bobot)).toFixed(2) : ''"
                />
              </div>
              <div>
                <input
                  v-model="item.bobot"
                  type="number"
                  placeholder="Bobot"
                  class="w-full rounded-lg border border-slate-200 bg-slate-200 px-3 py-2 text-sm text-slate-700 text-center cursor-not-allowed"
                  disabled
                />
              </div>
              <div>
                <input
                  :value="item.penjumlahan"
                  type="text"
                  readonly
                  placeholder="Penjumlahan"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 text-center cursor-default"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3">
        <h2 class="text-white font-semibold text-sm tracking-wide">Penilaian Generik</h2>
      </div>
      <div class="p-6 space-y-6">
        <div v-if="generikLoading" class="text-sm text-slate-500">Memuat data penilaian generik...</div>
        <div v-else-if="generikError" class="text-sm text-red-500">{{ generikError }}</div>
        <template v-else>
          <div v-for="item in generikList" :key="item.id" class="grid grid-cols-4 gap-4 items-center">
            <div>
              <span class="text-sm font-semibold text-slate-700">{{ item.nama }}</span>
            </div>
            <div>
              <input
                v-model="item.nilai"
                type="number"
                placeholder="Nilai"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center focus:border-[#3781c7] focus:outline-none"
                @input="item.penjumlahan = (!isNaN(parseFloat(item.nilai)) && !isNaN(parseFloat(item.bobot))) ? ((parseFloat(item.nilai) / 100) * parseFloat(item.bobot)).toFixed(2) : ''"
              />
            </div>
            <div>
              <input
                v-model="item.bobot"
                type="number"
                placeholder="Bobot"
                class="w-full rounded-lg border border-slate-200 bg-slate-200 px-3 py-2 text-sm text-slate-700 text-center cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <input
                :value="item.penjumlahan"
                type="text"
                readonly
                placeholder="Penjumlahan"
                class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 text-center cursor-default"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3">
        <h2 class="text-white font-semibold text-sm tracking-wide">Potensi Talenta</h2>
      </div>

      <div class="p-6 space-y-6">
        <div v-for="item in potensiItems" :key="item.key" class="grid grid-cols-4 gap-4 items-center">
          <div>
            <span class="text-sm font-semibold text-slate-700">{{ item.label }}</span>
          </div>
          <div>
            <input
              v-model="item.data.nilai"
              type="number"
              placeholder="Nilai"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center focus:border-[#3781c7] focus:outline-none"
              @input="hitungPenjumlahanSpesifik(item.data)"
            />
          </div>
          <div>
            <input
              v-model="item.data.bobot"
              type="number"
              placeholder="Bobot"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center focus:border-[#3781c7] focus:outline-none"
              @input="hitungPenjumlahanSpesifik(item.data)"
            />
          </div>
          <div>
            <input
              :value="item.data.penjumlahan"
              type="text"
              readonly
              placeholder="Penjumlahan"
              class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 text-center cursor-default"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3">
        <h2 class="text-white font-semibold text-sm tracking-wide">Rekam Jejak Jabatan</h2>
      </div>

      <div class="p-6 space-y-4">
        <div
          v-for="criterion in rekamCriteria"
          :key="criterion.key"
          class="space-y-2"
        >
          <div class="grid grid-cols-4 gap-4 items-center">
            <span class="text-sm font-semibold text-slate-700">{{ criterion.label }}</span>
            <div class="col-span-3">
              <select
                :value="rekamJejakForm[criterion.key]?.selectedLabel"
                class="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm text-slate-700 focus:border-[#3781c7] focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat"
                @change="onSelectRekam(criterion, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="opt in criterion.options" :key="opt.label" :value="opt.label">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <div></div>
            <div>
              <input
                :value="rekamJejakForm[criterion.key]?.nilai"
                type="text"
                readonly
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center bg-slate-50 cursor-default"
              />
            </div>
            <div>
              <input
                :value="format2(rekamJejakForm[criterion.key]?.bobot || 0)"
                type="text"
                readonly
                class="w-full rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-600 text-center cursor-default"
              />
            </div>
            <div>
              <input
                :value="format2(rekamJejakForm[criterion.key]?.skor || 0)"
                type="text"
                readonly
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center bg-slate-50 cursor-default"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3">
        <h2 class="text-white font-semibold text-sm tracking-wide">Pertimbangan Lainnya</h2>
      </div>

      <div class="p-6 space-y-4">
        <div
          v-for="criterion in pertimbanganCriteria"
          :key="criterion.key"
          class="space-y-2"
        >
          <div class="grid grid-cols-4 gap-4 items-center">
            <span class="text-sm font-semibold text-slate-700">{{ criterion.label }}</span>
            <div class="col-span-3">
              <select
                :value="pertimbanganForm[criterion.key]?.selectedLabel"
                class="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm text-slate-700 focus:border-[#3781c7] focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat"
                @change="onSelectPertimbangan(criterion, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="opt in criterion.options" :key="opt.label" :value="opt.label">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <div></div>
            <div>
              <input
                :value="pertimbanganForm[criterion.key]?.nilai"
                type="text"
                readonly
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center bg-slate-50 cursor-default"
              />
            </div>
            <div>
              <input
                :value="format2(pertimbanganForm[criterion.key]?.bobot || 0)"
                type="text"
                readonly
                class="w-full rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-600 text-center cursor-default"
              />
            </div>
            <div>
              <input
                :value="format2(pertimbanganForm[criterion.key]?.skor || 0)"
                type="text"
                readonly
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center bg-slate-50 cursor-default"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3">
        <h2 class="text-white font-semibold text-sm tracking-wide">Kompetensi Talenta</h2>
      </div>

      <div class="p-6 space-y-6">
        <div v-for="item in kompetensiItems" :key="item.key" class="grid grid-cols-4 gap-4 items-center">
          <div>
            <span class="text-sm font-semibold text-slate-700">{{ item.label }}</span>
          </div>
          <div>
            <input
              v-model="item.data.nilai"
              type="number"
              placeholder="Nilai"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center focus:border-[#3781c7] focus:outline-none"
              @input="hitungPenjumlahanSpesifik(item.data)"
            />
          </div>
          <div>
            <input
              v-model="item.data.bobot"
              type="number"
              placeholder="Bobot"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 text-center focus:border-[#3781c7] focus:outline-none"
              @input="hitungPenjumlahanSpesifik(item.data)"
            />
          </div>
          <div>
            <input
              :value="item.data.penjumlahan"
              type="text"
              readonly
              placeholder="Penjumlahan"
              class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 text-center cursor-default"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 pb-4">
      <NuxtLink
        :to="`/talent-pool/${slug}`"
        class="inline-flex items-center px-5 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
      >
        Batal
      </NuxtLink>
      <button
        type="button"
        class="inline-flex items-center px-5 py-2 rounded-lg bg-[#146190] text-sm font-semibold text-white hover:bg-[#0f4e75] transition"
      >
        Simpan
      </button>
    </div>
  </div>
</template>