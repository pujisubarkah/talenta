<template>
  <div class="p-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Daftar Bobot SKP</h1>

    <!-- Action Bar (Filter & Button) -->
    <div class="flex justify-between items-center mb-4">
      <!-- Filter Tahun -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-slate-700">Filter Tahun:</label>
          <select
            v-model="filterTahun"
            class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-37.5"
          >
            <option value="">Semua Tahun</option>
            <option v-for="t in tahunOptions" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>
      </div>

      <!-- Button Tambah -->
      <UIButton color="primary" @click="openAddModal">
        <UIIcon color="white" class="mr-2">
          <IconPlus />
        </UIIcon>
        Tambah Bobot
      </UIButton>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full min-w-200 table-fixed divide-y divide-slate-200 text-sm">
        <!-- HEADER -->
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-3 py-3 text-center font-semibold w-12">No</th>
            <th class="px-3 py-3 text-center font-semibold w-24">Tahun</th>
            <th class="px-3 py-3 text-left font-semibold w-56">Komponen / Jenis Kinerja</th>
            <th class="px-3 py-3 text-center font-semibold w-24">Bobot (%)</th>
            <th class="px-3 py-3 text-left font-semibold">Keterangan</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Aktif</th>
            <th class="px-3 py-3 text-center font-semibold w-36">Aksi</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-slate-100 text-slate-700">
          <tr v-for="(item, idx) in pagedBobot" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-3 py-3 text-center">{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="px-3 py-3 text-center font-bold text-slate-800">{{ item.tahun }}</td>
            <td class="px-3 py-3 font-medium">{{ item.jenis_kinerja }}</td>
            <td class="px-3 py-3 text-center text-blue-700 font-bold">{{ item.bobot }}%</td>
            <td class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed text-slate-600">{{ item.keterangan || '-' }}</td>
            <td class="px-3 py-3 text-center">
              <span :class="item.is_active ? 'text-green-600 font-semibold' : 'text-red-500'">{{ item.is_active ? "Ya" : "Tidak" }}</span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex justify-center gap-2">
                <UIButton color="secondary" size="sm" @click="startEdit(item)">
                  <UIIcon color="primary" size="sm"><IconEdit /></UIIcon>
                  Edit
                </UIButton>
                <UIButton color="danger" size="sm" @click="removeBobot(item.id)">
                  <UIIcon color="danger" size="sm"><IconTrash /></UIIcon>
                  Hapus
                </UIButton>
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="filteredBobotList.length === 0">
            <td colspan="7" class="text-center py-10 text-slate-400">Belum ada data bobot SKP</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div v-if="filteredBobotList.length > pageSize" class="flex justify-center mt-4">
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === 1 }" :disabled="page === 1" @click="page--">&laquo;</button>
      <button v-for="p in totalPages" :key="p" class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === p }" @click="page = p">{{ p }}</button>
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === totalPages }" :disabled="page === totalPages" @click="page++">&raquo;</button>
    </div>

    <!-- Modal Form (Tambah & Edit) -->
    <div v-if="showModal || showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-slate-100">
        <button @click="closeModal" class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">{{ showEditModal ? 'Edit Bobot SKP' : 'Tambah Bobot SKP' }}</h2>
        
        <form @submit.prevent="saveData" class="space-y-5">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Tahun</label>
            <input type="number" v-model="form.tahun" placeholder="Contoh: 2024" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Komponen / Jenis Kinerja</label>
            <select v-model="form.jenis_kinerja" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full bg-white" required>
              <option value="" disabled>Pilih Jenis Kinerja</option>
              <option value="Hasil Kerja Utama">Hasil Kerja Utama</option>
              <option value="Hasil Kerja Tambahan">Hasil Kerja Tambahan</option>
              <option value="Perilaku Kerja">Perilaku Kerja</option>
              <option value="Lainnya">Lainnya...</option>
            </select>
          </div>

          <!-- Jika lainnya dipilih -->
          <div v-if="form.jenis_kinerja === 'Lainnya'" class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Masukkan Jenis Kinerja (Custom)</label>
            <input v-model="form.jenis_kinerja_custom" placeholder="Tulis jenis kinerja..." class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Bobot (%)</label>
            <div class="relative">
              <input type="number" v-model="form.bobot" placeholder="Contoh: 70" min="0" max="100" step="0.01" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
              <span class="absolute right-4 top-2 text-slate-400 font-semibold">%</span>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Keterangan / Dasar Hukum</label>
            <textarea v-model="form.keterangan" placeholder="Catatan tambahan terkait bobot ini..." class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" rows="3"></textarea>
          </div>

          <div class="flex items-center gap-2 mt-4 pl-1">
            <input type="checkbox" v-model="form.is_active" id="modal_aktif_bobot" class="accent-blue-600 w-5 h-5" />
            <label for="modal_aktif_bobot" class="text-sm font-semibold text-slate-700 select-none">Status Aktif</label>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
type BobotSKP = {
  id: number
  tahun: number
  jenis_kinerja: string
  bobot: number
  keterangan: string
  is_active: boolean
}

const bobotList = ref<BobotSKP[]>([])

// --- State Modal & Form ---
const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number | null>(null)

const currentYear = new Date().getFullYear()

const defaultForm = {
  tahun: currentYear,
  jenis_kinerja: '',
  jenis_kinerja_custom: '',
  bobot: 0,
  keterangan: '',
  is_active: true
}
const form = ref<any>({ ...defaultForm })

// --- Pagination & Filters ---
const pageSize = ref(10)
const page = ref(1)
const filterTahun = ref<number | ''>('')

watch(filterTahun, () => {
  page.value = 1
})

// Generate opsi tahun unik dari data untuk Dropdown Filter
const tahunOptions = computed(() => {
  const years = bobotList.value.map(b => b.tahun)
  return [...new Set(years)].sort((a, b) => b - a)
})

// Logika Data Tabel terfilter
const filteredBobotList = computed(() => {
  if (filterTahun.value === '') return bobotList.value
  return bobotList.value.filter(b => b.tahun === filterTahun.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBobotList.value.length / pageSize.value)))
const pagedBobot = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredBobotList.value.slice(start, start + pageSize.value)
})

// --- Fetch Data ---
async function fetchBobotSKP() {
  // Mock API fetcher. Sesuaikan URL dengan backend
  const res = await fetch('/api/master/bobot-skp').catch(() => ({ json: () => [] }))
  const json = await res.json()
  bobotList.value = Array.isArray(json) ? json : (json.data || [])
}

// --- Actions ---
function openAddModal() {
  form.value = { ...defaultForm }
  showModal.value = true
}

function startEdit(item: BobotSKP) {
  editId.value = item.id
  
  // Handle custom jenis kinerja display
  const standardJenis = ['Hasil Kerja Utama', 'Hasil Kerja Tambahan', 'Perilaku Kerja']
  let jKinerja = item.jenis_kinerja
  let jCustom = ''
  
  if (!standardJenis.includes(item.jenis_kinerja)) {
    jKinerja = 'Lainnya'
    jCustom = item.jenis_kinerja
  }

  form.value = { 
    ...item, 
    jenis_kinerja: jKinerja,
    jenis_kinerja_custom: jCustom
  }
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
  const url = isEdit ? `/api/master/bobot-skp/${editId.value}` : '/api/master/bobot-skp'
  const method = isEdit ? 'PATCH' : 'POST'

  // Merge jenis kinerja jika memilih "Lainnya"
  const payload = { ...form.value }
  if (payload.jenis_kinerja === 'Lainnya') {
    payload.jenis_kinerja = payload.jenis_kinerja_custom
  }
  delete payload.jenis_kinerja_custom

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (res.ok) {
    await fetchBobotSKP()
    closeModal()
  }
}

async function removeBobot(id: number) {
  await fetch(`/api/master/bobot-skp/${id}`, { method: 'DELETE' })
  await fetchBobotSKP()
}

onMounted(fetchBobotSKP)
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