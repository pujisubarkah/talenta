<template>
  <div class="p-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Daftar Indikator Penilaian</h1>

    <!-- Action Bar (Filter & Button) -->
    <div class="flex justify-between items-center mb-4">
      <!-- Filter Kategori -->
      <div class="flex items-center gap-3">
        <label class="text-sm font-semibold text-slate-700">Filter Kategori:</label>
        <select
          v-model="filterKategori"
          class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition bg-white min-w-50"
        >
          <option value="">Semua Kategori</option>
          <option v-for="k in kategoriList" :key="k.id" :value="k.id">
            {{ k.nama_kategori }}
          </option>
        </select>
      </div>

      <!-- Button Tambah -->
      <UIButton color="primary" @click="openAddModal">
        <UIIcon color="white" class="mr-2">
          <IconPlus />
        </UIIcon>
        Tambah Indikator
      </UIButton>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full min-w-400 table-fixed divide-y divide-slate-200 text-sm">
        <!-- HEADER -->
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-3 py-3 text-center font-semibold w-12">No</th>
            <th class="px-3 py-3 text-left font-semibold w-28">Kode</th>
            <th class="px-3 py-3 text-left font-semibold w-44">Kategori</th>
            <th class="px-3 py-3 text-left font-semibold w-52">Nama Penilaian</th>
            <th class="px-3 py-3 text-left font-semibold w-[320px]">Deskripsi</th>
            <th class="px-3 py-3 text-center font-semibold w-24">Bobot</th>
            <th class="px-3 py-3 text-center font-semibold w-28">Jenis Nilai</th>
            <th class="px-3 py-3 text-center font-semibold w-32">Metode</th>
            <th class="px-3 py-3 text-center font-semibold w-32">Sumber</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Urutan</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Wajib</th>
            <th class="px-3 py-3 text-center font-semibold w-20">Aktif</th>
            <th class="px-3 py-3 text-center font-semibold w-40">Aksi</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-slate-100 text-slate-700">
          <tr v-for="(item, idx) in pagedPenilaian" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-3 py-3 text-center">{{ idx + 1 }}</td>
            <td class="px-3 py-3 font-medium">{{ item.kode }}</td>
            <td class="px-3 py-3">{{ kategoriList.find((k) => k.id === item.kategori_id)?.nama_kategori || "-" }}</td>
            <td class="px-3 py-3">{{ item.nama_penilaian }}</td>
            <td class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed text-slate-600">{{ item.deskripsi }}</td>
            <td class="px-3 py-3 text-center">{{ item.bobot }}</td>
            <td class="px-3 py-3 text-center">{{ item.jenis_nilai }}</td>
            <td class="px-3 py-3 text-center">{{ item.metode_penilaian }}</td>
            <td class="px-3 py-3 text-center">{{ item.sumber_nilai }}</td>
            <td class="px-3 py-3 text-center">{{ item.urutan }}</td>
            <!-- WAJIB -->
            <td class="px-3 py-3 text-center">
              <span :class="item.is_wajib ? 'text-green-600 font-semibold' : 'text-red-500'">{{ item.is_wajib ? "Ya" : "Tidak" }}</span>
            </td>
            <!-- ACTIVE -->
            <td class="px-3 py-3 text-center">
              <span :class="item.is_active ? 'text-green-600 font-semibold' : 'text-red-500'">{{ item.is_active ? "Ya" : "Tidak" }}</span>
            </td>
            <!-- AKSI -->
            <td class="px-3 py-3 text-center">
              <div class="flex justify-center gap-2">
                <UIButton color="secondary" size="sm" @click="startEdit(item)">
                  <UIIcon color="primary" size="sm"><IconEdit /></UIIcon>
                  Edit
                </UIButton>
                <UIButton color="danger" size="sm" @click="removePenilaian(item.id)">
                  <UIIcon color="danger" size="sm"><IconTrash /></UIIcon>
                  Hapus
                </UIButton>
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="filteredPenilaianList.length === 0">
            <td colspan="13" class="text-center py-10 text-slate-400">Belum ada data indikator penilaian</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div v-if="filteredPenilaianList.length > pageSize" class="flex justify-center mt-4">
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === 1 }" :disabled="page === 1" @click="page--">&laquo;</button>
      <button v-for="p in totalPages" :key="p" class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === p }" @click="page = p">{{ p }}</button>
      <button class="px-3 py-1 mx-1 rounded border text-sm" :class="{ 'bg-blue-600 text-white border-blue-600': page === totalPages }" :disabled="page === totalPages" @click="page++">&raquo;</button>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-slate-100">
        <button @click="closeAddModal" class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600">
          &times;
        </button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">Tambah Indikator Penilaian</h2>
        <form @submit.prevent="addPenilaian" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Kategori</label>
              <select v-model="form.kategori_id" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full bg-white" required>
                <option disabled :value="undefined">Pilih Kategori</option>
                <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Kode</label>
              <input v-model="form.kode" placeholder="Kode" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Nama Penilaian</label>
              <input v-model="form.nama_penilaian" placeholder="Nama Penilaian" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Deskripsi</label>
              <textarea v-model="form.deskripsi" placeholder="Deskripsi" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" rows="3"></textarea>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Bobot</label>
              <input v-model="form.bobot" placeholder="Bobot" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Jenis Nilai</label>
              <input v-model="form.jenis_nilai" placeholder="Jenis Nilai" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Metode Penilaian</label>
              <input v-model="form.metode_penilaian" placeholder="Metode" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Sumber Nilai</label>
              <input v-model="form.sumber_nilai" placeholder="Sumber Nilai" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Urutan</label>
              <input type="number" v-model="form.urutan" placeholder="Urutan" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex items-center gap-4 mt-6 pl-2">
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_wajib" id="add_wajib" class="accent-blue-600 w-5 h-5" />
                <label for="add_wajib" class="text-sm font-semibold text-slate-700 select-none">Wajib</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_active" id="add_aktif" class="accent-blue-600 w-5 h-5" />
                <label for="add_aktif" class="text-sm font-semibold text-slate-700 select-none">Aktif</label>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button" @click="closeAddModal" class="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">Batal</button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">Tambah</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Edit -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-slate-100">
        <button @click="cancelEdit" class="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-600">
          &times;
        </button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">Edit Indikator Penilaian</h2>
        <form @submit.prevent="saveEdit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Kategori</label>
              <select v-model="form.kategori_id" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full bg-white" required>
                <option disabled :value="undefined">Pilih Kategori</option>
                <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Kode</label>
              <input v-model="form.kode" placeholder="Kode" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Nama Penilaian</label>
              <input v-model="form.nama_penilaian" placeholder="Nama Penilaian" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" required />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Deskripsi</label>
              <textarea v-model="form.deskripsi" placeholder="Deskripsi" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" rows="3"></textarea>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Bobot</label>
              <input v-model="form.bobot" placeholder="Bobot" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Jenis Nilai</label>
              <input v-model="form.jenis_nilai" placeholder="Jenis Nilai" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Metode Penilaian</label>
              <input v-model="form.metode_penilaian" placeholder="Metode" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Sumber Nilai</label>
              <input v-model="form.sumber_nilai" placeholder="Sumber Nilai" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-slate-700">Urutan</label>
              <input type="number" v-model="form.urutan" placeholder="Urutan" class="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full" />
            </div>
            <div class="flex items-center gap-4 mt-6 pl-2">
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_wajib" id="edit_wajib" class="accent-blue-600 w-5 h-5" />
                <label for="edit_wajib" class="text-sm font-semibold text-slate-700 select-none">Wajib</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_active" id="edit_aktif" class="accent-blue-600 w-5 h-5" />
                <label for="edit_aktif" class="text-sm font-semibold text-slate-700 select-none">Aktif</label>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button" @click="cancelEdit" class="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">Batal</button>
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

type Kategori = {
  id: number
  kode: string
  nama_kategori: string
}

type Penilaian = {
  id: number
  kategori_id: number
  kode: string
  nama_penilaian: string
  deskripsi: string
  bobot: string
  jenis_nilai: string
  metode_penilaian: string
  sumber_nilai: string
  urutan: number
  is_wajib: boolean
  is_active: boolean
}

const penilaianList = ref<Penilaian[]>([])
const kategoriList = ref<Kategori[]>([])

const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number|null>(null)
const form = ref<Partial<Penilaian>>({
  kode: '',
  kategori_id: undefined,
  nama_penilaian: '',
  deskripsi: '',
  bobot: '',
  jenis_nilai: '',
  metode_penilaian: '',
  sumber_nilai: '',
  urutan: 1,
  is_wajib: false,
  is_active: true
})

const defaultForm = {
  kode: '',
  kategori_id: undefined,
  nama_penilaian: '',
  deskripsi: '',
  bobot: '',
  jenis_nilai: '',
  metode_penilaian: '',
  sumber_nilai: '',
  urutan: 1,
  is_wajib: false,
  is_active: true
}

const kategoriOptions = computed(() =>
  kategoriList.value.map((k) => ({ label: k.nama_kategori, value: k.id }))
)

const filterKategori = ref<number | ''>('')

const pageSize = ref(10)
const page = ref(1)

watch(filterKategori, () => {
  page.value = 1
})

const filteredPenilaianList = computed(() => {
  if (filterKategori.value === '') return penilaianList.value
  return penilaianList.value.filter((p) => p.kategori_id === filterKategori.value)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredPenilaianList.value.length / pageSize.value))
})

const pagedPenilaian = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredPenilaianList.value.slice(start, start + pageSize.value)
})

async function fetchPenilaian() {
  const res = await fetch('/api/master/penilaian')
  const json = await res.json()
  penilaianList.value = Array.isArray(json) ? json : (json.data || [])
}

async function fetchKategori() {
  const res = await fetch('/api/master/kategori-penilaian')
  const json = await res.json()
  kategoriList.value = Array.isArray(json) ? json : (json.data || [])
}

function openAddModal() {
  form.value = { ...defaultForm }
  showModal.value = true
}

function closeAddModal() {
  showModal.value = false
  form.value = { ...defaultForm }
}

async function addPenilaian() {
  if (!form.value.kode || !form.value.nama_penilaian) return

  const res = await fetch('/api/master/penilaian', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })

  if (res.ok) {
    await fetchPenilaian()
    closeAddModal()
  }
}

function startEdit(item: Penilaian) {
  editId.value = item.id
  form.value = { ...item }
  showEditModal.value = true
}

function cancelEdit() {
  showEditModal.value = false
  editId.value = null
  form.value = { ...defaultForm }
}

async function saveEdit() {
  if (!editId.value) return

  const res = await fetch(`/api/master/penilaian/${editId.value}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })

  if (res.ok) {
    await fetchPenilaian()
    cancelEdit()
  }
}

async function removePenilaian(id: number) {
  await fetch(`/api/master/penilaian/${id}`, {
    method: 'DELETE'
  })
  await fetchPenilaian()
}

onMounted(() => {
  Promise.all([
    fetchPenilaian(),
    fetchKategori()
  ])
})

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
