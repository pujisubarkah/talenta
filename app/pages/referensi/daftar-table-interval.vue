<template>
  <div class="p-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Daftar Table Interval</h1>

    <!-- Action Bar (Filter & Button) -->
    <div class="flex justify-between items-center mb-4">
      <!-- Filter Jenis Interval -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-slate-700">Jenis Interval:</label>
          <select
            v-model="filterJenis"
            class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-50"
          >
            <option value="">Semua Jenis Interval</option>
            <option v-for="jenis in jenisOptions" :key="jenis" :value="jenis">
              {{ jenis }}
            </option>
          </select>
        </div>
      </div>

      <!-- Button Tambah -->
      <UIButton color="primary" @click="openAddModal">
        <UIIcon color="white" class="mr-2">
          <IconPlus />
        </UIIcon>
        Tambah Interval
      </UIButton>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full min-w-225 table-fixed divide-y divide-slate-200 text-sm">
        <!-- HEADER -->
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-3 py-3 text-center font-semibold w-12">No</th>
            <th class="px-3 py-3 text-left font-semibold w-48">Jenis Interval</th>
            <th class="px-3 py-3 text-left font-semibold w-40">Predikat / Label</th>
            <th class="px-3 py-3 text-center font-semibold w-24">Batas Bawah (Min)</th>
            <th class="px-3 py-3 text-center font-semibold w-24">Batas Atas (Max)</th>
            <th class="px-3 py-3 text-left font-semibold w-60">Keterangan</th>
            <th class="px-3 py-3 text-center font-semibold w-36">Aksi</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-slate-100 text-slate-700">
          <tr v-for="(item, idx) in pagedInterval" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-3 py-3 text-center">{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="px-3 py-3 font-semibold text-blue-800">{{ item.jenis_interval }}</td>
            <td class="px-3 py-3 font-medium">
              <span class="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs">{{ item.predikat }}</span>
            </td>
            <td class="px-3 py-3 text-center font-semibold text-slate-600">{{ item.nilai_min }}</td>
            <td class="px-3 py-3 text-center font-semibold text-slate-600">{{ item.nilai_max }}</td>
            <td class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed text-slate-600 text-xs">{{ item.keterangan || '-' }}</td>
            <td class="px-3 py-3 text-center">
              <div class="flex justify-center gap-2">
                <UIButton color="secondary" size="sm" @click="startEdit(item)">
                  <UIIcon color="primary" size="sm"><IconEdit /></UIIcon>
                  Edit
                </UIButton>
                <UIButton color="danger" size="sm" @click="removeInterval(item.id)">
                  <UIIcon color="danger" size="sm"><IconTrash /></UIIcon>
                  Hapus
                </UIButton>
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="filteredIntervalList.length === 0">
            <td colspan="7" class="text-center py-10 text-slate-400">Belum ada data table interval</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div v-if="filteredIntervalList.length > pageSize" class="flex justify-center mt-4">
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === 1 }" :disabled="page === 1" @click="page--">&laquo;</button>
      <button v-for="p in totalPages" :key="p" class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === p }" @click="page = p">{{ p }}</button>
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === totalPages }" :disabled="page === totalPages" @click="page++">&raquo;</button>
    </div>

    <!-- Modal Form (Tambah & Edit) -->
    <div v-if="showModal || showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-slate-100">
        <button @click="closeModal" class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">{{ showEditModal ? 'Edit Interval' : 'Tambah Interval' }}</h2>
        
        <form @submit.prevent="saveData" class="space-y-5">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Jenis Interval</label>
            <select v-model="form.jenis_interval" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full bg-white" required>
              <option value="" disabled>Pilih Jenis Interval</option>
              <option value="Potensi">Potensi</option>
              <option value="Kinerja">Kinerja</option>
              <option value="Kompetensi">Kompetensi</option>
              <option value="Lainnya">Lainnya...</option>
            </select>
          </div>

          <!-- Jika lainnya dipilih -->
          <div v-if="form.jenis_interval === 'Lainnya'" class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Masukkan Jenis Interval (Custom)</label>
            <input v-model="form.jenis_interval_custom" placeholder="Contoh: Kompetensi Sosial Kultural" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Predikat / Label</label>
            <input v-model="form.predikat" placeholder="Contoh: Sangat Baik, Tinggi, Memuaskan" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Batas Bawah (Min)</label>
              <input type="number" v-model="form.nilai_min" placeholder="0" step="0.01" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Batas Atas (Max)</label>
              <input type="number" v-model="form.nilai_max" placeholder="100" step="0.01" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-slate-700">Keterangan Tambahan</label>
            <textarea v-model="form.keterangan" placeholder="Penjelasan mengenai predikat ini..." class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" rows="3"></textarea>
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
type TableInterval = {
  id: number
  jenis_interval: string
  predikat: string
  nilai_min: number
  nilai_max: number
  keterangan: string
}

const intervalList = ref<TableInterval[]>([])

// --- State Modal & Form ---
const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number | null>(null)

const defaultForm = {
  jenis_interval: '',
  jenis_interval_custom: '',
  predikat: '',
  nilai_min: 0,
  nilai_max: 100,
  keterangan: ''
}
const form = ref<any>({ ...defaultForm })

// --- Pagination & Filters ---
const pageSize = ref(10)
const page = ref(1)
const filterJenis = ref<string>('')

watch(filterJenis, () => {
  page.value = 1
})

// Generate opsi jenis unik dari data untuk Dropdown Filter
const jenisOptions = computed(() => {
  const jenis = intervalList.value.map(i => i.jenis_interval)
  return [...new Set(jenis)].sort()
})

// Logika Data Tabel terfilter
const filteredIntervalList = computed(() => {
  if (filterJenis.value === '') return intervalList.value
  return intervalList.value.filter(i => i.jenis_interval === filterJenis.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredIntervalList.value.length / pageSize.value)))
const pagedInterval = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredIntervalList.value.slice(start, start + pageSize.value)
})

// --- Fetch Data ---
async function fetchInterval() {
  // Mock API fetcher. Sesuaikan URL dengan backend
  const res = await fetch('/api/master/table-interval').catch(() => ({ json: () => [] }))
  const json = await res.json()
  let data = Array.isArray(json) ? json : (json.data || [])
  if (!data || data.length === 0) {
    data = [
      {
        id: 1,
        jenis_interval: 'Potensi',
        predikat: 'Tinggi',
        nilai_min: 80,
        nilai_max: 100,
        keterangan: 'Potensi sangat tinggi'
      },
      {
        id: 2,
        jenis_interval: 'Potensi',
        predikat: 'Sedang',
        nilai_min: 60,
        nilai_max: 79.99,
        keterangan: 'Potensi sedang'
      },
      {
        id: 3,
        jenis_interval: 'Potensi',
        predikat: 'Rendah',
        nilai_min: 0,
        nilai_max: 59.99,
        keterangan: 'Potensi rendah'
      },
      {
        id: 4,
        jenis_interval: 'Kinerja',
        predikat: 'Sangat Baik',
        nilai_min: 90,
        nilai_max: 100,
        keterangan: 'Kinerja sangat baik'
      },
      {
        id: 5,
        jenis_interval: 'Kinerja',
        predikat: 'Baik',
        nilai_min: 70,
        nilai_max: 89.99,
        keterangan: 'Kinerja baik'
      },
      {
        id: 6,
        jenis_interval: 'Kinerja',
        predikat: 'Cukup',
        nilai_min: 50,
        nilai_max: 69.99,
        keterangan: 'Kinerja cukup'
      },
      {
        id: 7,
        jenis_interval: 'Kinerja',
        predikat: 'Kurang',
        nilai_min: 0,
        nilai_max: 49.99,
        keterangan: 'Kinerja kurang'
      }
    ]
  }
  intervalList.value = data
}

// --- Actions ---
function openAddModal() {
  form.value = { ...defaultForm }
  showModal.value = true
}

function startEdit(item: TableInterval) {
  editId.value = item.id
  
  // Handle custom jenis interval display
  const standardJenis = ['Potensi', 'Kinerja', 'Kompetensi']
  let jInterval = item.jenis_interval
  let jCustom = ''
  
  if (!standardJenis.includes(item.jenis_interval)) {
    jInterval = 'Lainnya'
    jCustom = item.jenis_interval
  }

  form.value = { 
    ...item, 
    jenis_interval: jInterval,
    jenis_interval_custom: jCustom
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
  const url = isEdit ? `/api/master/table-interval/${editId.value}` : '/api/master/table-interval'
  const method = isEdit ? 'PATCH' : 'POST'

  // Merge jenis interval jika memilih "Lainnya"
  const payload = { ...form.value }
  if (payload.jenis_interval === 'Lainnya') {
    payload.jenis_interval = payload.jenis_interval_custom
  }
  delete payload.jenis_interval_custom

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (res.ok) {
    await fetchInterval()
    closeModal()
  }
}

async function removeInterval(id: number) {
  await fetch(`/api/master/table-interval/${id}`, { method: 'DELETE' })
  await fetchInterval()
}

onMounted(fetchInterval)
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