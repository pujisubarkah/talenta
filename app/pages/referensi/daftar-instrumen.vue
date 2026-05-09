<template>
  <div class="p-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Daftar Instrumen Penilaian</h1>

    <!-- Action Bar (Filter & Button) -->
    <div class="flex justify-between items-center mb-4">
      <!-- Filter Sub Indikator -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-slate-700">Filter Sub Indikator:</label>
          <select
            v-model="filterSubIndikator"
            class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-62.5"
          >
            <option value="">Semua Sub Indikator</option>
            <option v-for="sub in subIndikatorList" :key="sub.id" :value="sub.id">
              {{ sub.nama_sub_indikator }}
            </option>
          </select>
        </div>
      </div>

      <!-- Button Tambah -->
      <UIButton color="primary" @click="openAddModal">
        <UIIcon color="white" class="mr-2">
          <IconPlus />
        </UIIcon>
        Tambah Instrumen
      </UIButton>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full min-w-275 table-fixed divide-y divide-slate-200 text-sm">
        <!-- HEADER -->
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-3 py-3 text-center font-semibold w-12">No</th>
            <th class="px-3 py-3 text-left font-semibold w-24">Kode</th>
            <th class="px-3 py-3 text-left font-semibold w-48">Sub Indikator</th>
            <th class="px-3 py-3 text-left font-semibold w-75">Pertanyaan / Pernyataan</th>
            <th class="px-3 py-3 text-center font-semibold w-32">Tipe Jawaban</th>
            <th class="px-3 py-3 text-left font-semibold w-50">Rubrik/Panduan</th>
            <th class="px-3 py-3 text-center font-semibold w-16">Bobot</th>
            <th class="px-3 py-3 text-center font-semibold w-16">Urutan</th>
            <th class="px-3 py-3 text-center font-semibold w-16">Aktif</th>
            <th class="px-3 py-3 text-center font-semibold w-36">Aksi</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-slate-100 text-slate-700">
          <tr v-for="(item, idx) in pagedInstrumen" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-3 py-3 text-center">{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="px-3 py-3 font-medium">{{ item.kode }}</td>
            <td class="px-3 py-3">{{ getNamaSubIndikator(item.sub_indikator_id) }}</td>
            <td class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed font-semibold text-slate-700">{{ item.pertanyaan }}</td>
            <td class="px-3 py-3 text-center">
              <span class="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs">{{ item.tipe_jawaban }}</span>
            </td>
            <td class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed text-slate-600 text-xs">{{ item.rubrik }}</td>
            <td class="px-3 py-3 text-center">{{ item.bobot || '-' }}</td>
            <td class="px-3 py-3 text-center">{{ item.urutan }}</td>
            <td class="px-3 py-3 text-center">
              <span :class="item.is_active ? 'text-green-600 font-semibold' : 'text-red-500'">{{ item.is_active ? "Ya" : "Tidak" }}</span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex justify-center gap-2">
                <UIButton color="secondary" size="sm" @click="startEdit(item)">
                  <UIIcon color="primary" size="sm"><IconEdit /></UIIcon>
                  Edit
                </UIButton>
                <UIButton color="danger" size="sm" @click="removeInstrumen(item.id)">
                  <UIIcon color="danger" size="sm"><IconTrash /></UIIcon>
                  Hapus
                </UIButton>
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="filteredInstrumenList.length === 0">
            <td colspan="10" class="text-center py-10 text-slate-400">Belum ada data instrumen/pertanyaan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div v-if="filteredInstrumenList.length > pageSize" class="flex justify-center mt-4">
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === 1 }" :disabled="page === 1" @click="page--">&laquo;</button>
      <button v-for="p in totalPages" :key="p" class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === p }" @click="page = p">{{ p }}</button>
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === totalPages }" :disabled="page === totalPages" @click="page++">&raquo;</button>
    </div>

    <!-- Modal Form (Tambah & Edit) -->
    <div v-if="showModal || showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-slate-100">
        <button @click="closeModal" class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">{{ showEditModal ? 'Edit Instrumen' : 'Tambah Instrumen' }}</h2>
        
        <form @submit.prevent="saveData" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Sub Indikator Penilaian</label>
              <select v-model="form.sub_indikator_id" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full bg-white" required>
                <option disabled :value="undefined">Pilih Sub Indikator</option>
                <option v-for="sub in subIndikatorList" :key="sub.id" :value="sub.id">{{ sub.nama_sub_indikator }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Kode</label>
              <input v-model="form.kode" placeholder="Kode (misal: Q-001)" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Tipe Jawaban</label>
              <select v-model="form.tipe_jawaban" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full bg-white" required>
                <option value="Skala Likert (1-5)">Skala Likert (1-5)</option>
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Esai Singkat">Esai Singkat</option>
                <option value="Ya/Tidak">Ya / Tidak</option>
              </select>
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Pertanyaan / Pernyataan</label>
              <textarea v-model="form.pertanyaan" placeholder="Tuliskan pertanyaan spesifik..." class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full font-semibold text-slate-800" rows="3" required></textarea>
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Rubrik Panduan (Opsional)</label>
              <textarea v-model="form.rubrik" placeholder="Panduan bagi assessor dalam memberikan nilai..." class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" rows="2"></textarea>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Bobot (%)</label>
              <input v-model="form.bobot" type="number" placeholder="Nilai bobot" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Urutan Tampil</label>
              <input type="number" v-model="form.urutan" placeholder="Urutan ke-" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex items-center gap-4 mt-6 pl-2">
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_active" id="modal_aktif_inst" class="accent-blue-600 w-5 h-5" />
                <label for="modal_aktif_inst" class="text-sm font-semibold text-slate-700 select-none">Instrumen Aktif</label>
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
type Instrumen = {
  id: number
  sub_indikator_id: number
  kode: string
  pertanyaan: string
  tipe_jawaban: string
  rubrik: string
  bobot?: number
  urutan: number
  is_active: boolean
}

const instrumenList = ref<Instrumen[]>([])
const subIndikatorList = ref<any[]>([])

// --- State Modal & Form ---
const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number | null>(null)

const defaultForm = {
  sub_indikator_id: undefined,
  kode: '',
  pertanyaan: '',
  tipe_jawaban: 'Skala Likert (1-5)',
  rubrik: '',
  bobot: undefined,
  urutan: 1,
  is_active: true
}
const form = ref<Partial<Instrumen>>({ ...defaultForm })

// --- Pagination & Filters ---
const pageSize = ref(10)
const page = ref(1)
const filterSubIndikator = ref<number | ''>('')

watch(filterSubIndikator, () => {
  page.value = 1
})

// Logika Data Tabel terfilter
const filteredInstrumenList = computed(() => {
  if (filterSubIndikator.value === '') return instrumenList.value
  return instrumenList.value.filter(i => i.sub_indikator_id === filterSubIndikator.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredInstrumenList.value.length / pageSize.value)))
const pagedInstrumen = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredInstrumenList.value.slice(start, start + pageSize.value)
})

// --- Helpers ---
const getNamaSubIndikator = (id: number) => {
  const sub = subIndikatorList.value.find(s => s.id === id)
  return sub ? sub.nama_sub_indikator : '-'
}

// --- Fetch Data ---
async function fetchSemuaData() {
  // Mock API fetcher. Sesuaikan URL dengan backend
  const [resInst, resSub] = await Promise.all([
    fetch('/api/master/instrumen').catch(() => ({ json: () => [] })),
    fetch('/api/master/sub-indikator').catch(() => ({ json: () => [] }))
  ])
  const [instData, subData] = await Promise.all([resInst.json(), resSub.json()])
  
  instrumenList.value = Array.isArray(instData) ? instData : (instData.data || [])
  subIndikatorList.value = Array.isArray(subData) ? subData : (subData.data || [])
}

// --- Actions ---
function openAddModal() {
  form.value = { ...defaultForm }
  showModal.value = true
}

function startEdit(item: Instrumen) {
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
  const url = isEdit ? `/api/master/instrumen/${editId.value}` : '/api/master/instrumen'
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

async function removeInstrumen(id: number) {
  await fetch(`/api/master/instrumen/${id}`, { method: 'DELETE' })
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