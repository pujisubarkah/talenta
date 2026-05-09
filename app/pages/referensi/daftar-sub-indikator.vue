<template>
  <div class="p-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Daftar Sub Indikator</h1>

    <!-- Action Bar (Filter & Button) -->
    <div class="flex justify-between items-center mb-4">
      <!-- Filter Kategori & Indikator -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-slate-700">Kategori:</label>
          <select
            v-model="filterKategori"
            class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-37.5"
          >
            <option value="">Semua Kategori</option>
            <option v-for="k in kategoriList" :key="k.id" :value="k.id">
              {{ k.nama_kategori }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-slate-700">Indikator:</label>
          <select
            v-model="filterIndikator"
            class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-50"
            :disabled="!filterKategori && filterKategori !== ''"
          >
            <option value="">Semua Indikator</option>
            <option v-for="ind in filteredIndikatorOptions" :key="ind.id" :value="ind.id">
              {{ ind.nama_penilaian }}
            </option>
          </select>
        </div>
      </div>

      <!-- Button Tambah -->
      <UIButton color="primary" @click="openAddModal">
        <UIIcon color="white" class="mr-2">
          <IconPlus />
        </UIIcon>
        Tambah Sub Indikator
      </UIButton>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full min-w-250 table-fixed divide-y divide-slate-200 text-sm">
        <!-- HEADER -->
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-3 py-3 text-center font-semibold w-12">No</th>
            <th class="px-3 py-3 text-left font-semibold w-24">Kode</th>
            <th class="px-3 py-3 text-left font-semibold w-40">Indikator</th>
            <th class="px-3 py-3 text-left font-semibold w-48">Nama Sub Indikator</th>
            <th class="px-3 py-3 text-left font-semibold w-70">Deskripsi</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Bobot</th>
            <th class="px-3 py-3 text-center font-semibold w-24">Standar Nilai</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Urutan</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Wajib</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Aktif</th>
            <th class="px-3 py-3 text-center font-semibold w-36">Aksi</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-slate-100 text-slate-700">
          <tr v-for="(item, idx) in pagedSubIndikator" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-3 py-3 text-center">{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="px-3 py-3 font-medium">{{ item.kode }}</td>
            <td class="px-3 py-3">{{ getNamaIndikator(item.indikator_id) }}</td>
            <td class="px-3 py-3">{{ item.nama_sub_indikator }}</td>
            <td class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed text-slate-600">{{ item.deskripsi }}</td>
            <td class="px-3 py-3 text-center">{{ item.bobot || '-' }}</td>
            <td class="px-3 py-3 text-center">{{ item.standar_nilai || '-' }}</td>
            <td class="px-3 py-3 text-center">{{ item.urutan }}</td>
            <td class="px-3 py-3 text-center">
              <span :class="item.is_wajib ? 'text-green-600 font-semibold' : 'text-red-500'">{{ item.is_wajib ? "Ya" : "Tidak" }}</span>
            </td>
            <td class="px-3 py-3 text-center">
              <span :class="item.is_active ? 'text-green-600 font-semibold' : 'text-red-500'">{{ item.is_active ? "Ya" : "Tidak" }}</span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex justify-center gap-2">
                <UIButton color="secondary" size="sm" @click="startEdit(item)">
                  <UIIcon color="primary" size="sm"><IconEdit /></UIIcon>
                  Edit
                </UIButton>
                <UIButton color="danger" size="sm" @click="removeSubIndikator(item.id)">
                  <UIIcon color="danger" size="sm"><IconTrash /></UIIcon>
                  Hapus
                </UIButton>
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="filteredSubIndikatorList.length === 0">
            <td colspan="11" class="text-center py-10 text-slate-400">Belum ada data sub indikator</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div v-if="filteredSubIndikatorList.length > pageSize" class="flex justify-center mt-4">
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === 1 }" :disabled="page === 1" @click="page--">&laquo;</button>
      <button v-for="p in totalPages" :key="p" class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === p }" @click="page = p">{{ p }}</button>
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === totalPages }" :disabled="page === totalPages" @click="page++">&raquo;</button>
    </div>

    <!-- Modal Form (Tambah & Edit) -->
    <div v-if="showModal || showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-slate-100">
        <button @click="closeModal" class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">{{ showEditModal ? 'Edit Sub Indikator' : 'Tambah Sub Indikator' }}</h2>
        
        <form @submit.prevent="saveData" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Indikator Penilaian</label>
              <select v-model="form.indikator_id" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full bg-white" required>
                <option disabled :value="undefined">Pilih Indikator</option>
                <option v-for="ind in indikatorList" :key="ind.id" :value="ind.id">{{ ind.nama_penilaian }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Kode</label>
              <input v-model="form.kode" placeholder="Kode (misal: SUB-01)" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Nama Sub Indikator</label>
              <input v-model="form.nama_sub_indikator" placeholder="Nama Sub Indikator" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Deskripsi / Rubrik</label>
              <textarea v-model="form.deskripsi" placeholder="Deskripsi/Penjelasan pengukuran" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" rows="3"></textarea>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Bobot (%)</label>
              <input v-model="form.bobot" placeholder="Bobot (opsional)" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Standar Nilai</label>
              <input v-model="form.standar_nilai" placeholder="Target nilai" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Urutan</label>
              <input type="number" v-model="form.urutan" placeholder="Urutan" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex items-center gap-4 mt-6 pl-2">
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_wajib" id="modal_wajib" class="accent-blue-600 w-5 h-5" />
                <label for="modal_wajib" class="text-sm font-semibold text-slate-700 select-none">Wajib diisi</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_active" id="modal_aktif" class="accent-blue-600 w-5 h-5" />
                <label for="modal_aktif" class="text-sm font-semibold text-slate-700 select-none">Aktif</label>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button" @click="closeModal" class="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">Batal</button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue'
import UIButton from '~/components/UI/UIButton.vue'
import UIIcon from '~/components/UI/UIIcon.vue'

// --- Tipes ---
type SubIndikator = {
  id: number
  indikator_id: number
  kode: string
  nama_sub_indikator: string
  deskripsi: string
  bobot?: string
  standar_nilai?: string
  urutan: number
  is_wajib: boolean
  is_active: boolean
}

const subIndikatorList = ref<SubIndikator[]>([])
const indikatorList = ref<any[]>([])
const kategoriList = ref<any[]>([])

// --- State Modal & Form ---
const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number | null>(null)

const defaultForm = {
  kode: '',
  indikator_id: undefined,
  nama_sub_indikator: '',
  deskripsi: '',
  bobot: '',
  standar_nilai: '',
  urutan: 1,
  is_wajib: false,
  is_active: true
}
const form = ref<Partial<SubIndikator>>({ ...defaultForm })

// --- Pagination & Filters ---
const pageSize = ref(10)
const page = ref(1)
const filterKategori = ref<number | ''>('')
const filterIndikator = ref<number | ''>('')

// Cascading filter: Kalau kategori berubah, reset filter indikator & page
watch(filterKategori, () => {
  filterIndikator.value = ''
  page.value = 1
})
watch(filterIndikator, () => {
  page.value = 1
})

// Data Indikator yang muncul di dropdown filter bergantung pada Kategori terpilih
const filteredIndikatorOptions = computed(() => {
  if (filterKategori.value === '') return indikatorList.value
  return indikatorList.value.filter(ind => ind.kategori_id === filterKategori.value)
})

// Logika Data Tabel terfilter
const filteredSubIndikatorList = computed(() => {
  let result = subIndikatorList.value
  if (filterIndikator.value !== '') {
    result = result.filter((p) => p.indikator_id === filterIndikator.value)
  } else if (filterKategori.value !== '') {
    // Jika hanya kategori yang dipilih, cari sub-indikator yang indikator_id-nya masuk kategori tsb
    const validIndikatorIds = filteredIndikatorOptions.value.map(i => i.id)
    result = result.filter(p => validIndikatorIds.includes(p.indikator_id))
  }
  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSubIndikatorList.value.length / pageSize.value)))
const pagedSubIndikator = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredSubIndikatorList.value.slice(start, start + pageSize.value)
})

// --- Helpers ---
const getNamaIndikator = (id: number) => {
  const ind = indikatorList.value.find(i => i.id === id)
  return ind ? ind.nama_penilaian : '-'
}

// --- Fetch Data ---
async function fetchSemuaData() {
  // Mock/Contoh fetch api. Sesuaikan URL dengan backend
  const [resSub, resInd, resKat] = await Promise.all([
    fetch('/api/master/sub-indikator').catch(() => ({ json: () => [] })),
    fetch('/api/master/penilaian').catch(() => ({ json: () => [] })),
    fetch('/api/master/kategori-penilaian').catch(() => ({ json: () => [] }))
  ])
  const [subData, indData, katData] = await Promise.all([resSub.json(), resInd.json(), resKat.json()])
  
  subIndikatorList.value = Array.isArray(subData) ? subData : (subData.data || [])
  indikatorList.value = Array.isArray(indData) ? indData : (indData.data || [])
  kategoriList.value = Array.isArray(katData) ? katData : (katData.data || [])
}

// --- Actions ---
function openAddModal() {
  form.value = { ...defaultForm }
  showModal.value = true
}

function startEdit(item: SubIndikator) {
  editId.value = item.id
  form.value = { ...item }
  showEditModal.value = true
}

function closeModal() {
  showModal.value = false
  showEditModal.value = false
  editId.value = null
  form.value = { ...defaultForm }
}

async function saveData() {
  const isEdit = !!editId.value
  const url = isEdit ? `/api/master/sub-indikator/${editId.value}` : '/api/master/sub-indikator'
  const method = isEdit ? 'PATCH' : 'POST'

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })

  if (res.ok) {
    await fetchSemuaData()
    closeModal()
  }
}

async function removeSubIndikator(id: number) {
  await fetch(`/api/master/sub-indikator/${id}`, { method: 'DELETE' })
  await fetchSemuaData()
}

onMounted(fetchSemuaData)
</script>

<style scoped>
table thead tr th {
  background-color: #1e3a8a; /* Tailwind bg-blue-900 */
  color: #fff;
}
table tbody tr:nth-child(odd) {
  background-color: #fff;
}
table tbody tr:nth-child(even) {
  background-color: #e0e7ff; /* Tailwind bg-blue-100 */
}
</style>