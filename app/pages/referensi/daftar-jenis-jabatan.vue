<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface JenisJabatan {
  id: number
  kode: string
  nama: string
  kategori: string
  is_active: boolean
}

const items = ref<JenisJabatan[]>([])
const loading = ref(true)
const creating = ref(false)
const showCreateModal = ref(false)
const editingId = ref<number | null>(null)
const draftKode = ref('')
const draftNama = ref('')
const draftKategori = ref('')
const newKode = ref('')
const newNama = ref('')
const newKategori = ref('struktural')

const kategoriOptions = ['struktural', 'fungsional', 'lainnya']

async function loadItems() {
  loading.value = true
  try {
    items.value = await $fetch<JenisJabatan[]>('/api/master/jenis-jabatan')
  } finally {
    loading.value = false
  }
}

onMounted(loadItems)

const openCreateModal = () => {
  newKode.value = ''
  newNama.value = ''
  newKategori.value = 'struktural'
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const addItem = async () => {
  const payload = {
    kode: newKode.value.trim().toUpperCase(),
    nama: newNama.value.trim(),
    kategori: newKategori.value,
    is_active: true,
  }

  if (!payload.kode || !payload.nama || !payload.kategori) return

  creating.value = true
  try {
    const created = await $fetch<JenisJabatan>('/api/master/jenis-jabatan', {
      method: 'POST',
      body: payload,
    })
    items.value.push(created)
    closeCreateModal()
  } finally {
    creating.value = false
  }
}

const startEdit = (item: JenisJabatan) => {
  editingId.value = item.id
  draftKode.value = item.kode
  draftNama.value = item.nama
  draftKategori.value = item.kategori
}

const cancelEdit = () => { editingId.value = null }

const saveEdit = async () => {
  const item = items.value.find(i => i.id === editingId.value)
  if (!item) return
  const payload = {
    kode: draftKode.value.trim().toUpperCase(),
    nama: draftNama.value.trim(),
    kategori: draftKategori.value,
  }
  try {
    await $fetch(`/api/master/jenis-jabatan/${item.id}`, { method: 'PUT', body: payload })
    Object.assign(item, payload)
    editingId.value = null
  } catch (e) {
    console.error('Gagal menyimpan:', e)
  }
}

const toggleActive = async (id: number) => {
  const item = items.value.find(i => i.id === id)
  if (!item) return
  const prev = item.is_active
  item.is_active = !prev
  try {
    await $fetch(`/api/master/jenis-jabatan/${id}`, {
      method: 'PATCH',
      body: { is_active: item.is_active },
    })
  } catch {
    item.is_active = prev
  }
}
</script>

<template>
  <div class="p-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <h3 class="text-sm font-semibold text-slate-800">Master Jenis Jabatan</h3>
          <p class="text-xs text-slate-500 mt-0.5">Kategori jabatan ASN. Digunakan untuk penentuan bobot SKP, cascading, & suksesi.</p>
        </div>
        <button
          class="px-3 py-2 text-xs font-semibold bg-[#146190] text-white rounded-lg hover:bg-[#0f4d73]"
          @click="openCreateModal"
        >
          + Tambah
        </button>
      </div>

      <div class="relative overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-2 text-left font-medium">ID</th>
              <th class="px-4 py-2 text-left font-medium">Kode</th>
              <th class="px-4 py-2 text-left font-medium">Nama</th>
              <th class="px-4 py-2 text-left font-medium">Kategori</th>
              <th class="px-4 py-2 text-center font-medium">Status</th>
              <th class="px-4 py-2 text-center font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="text-center text-slate-400">
              <td colspan="6" class="py-6">Memuat data...</td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="border-t border-slate-100 hover:bg-slate-50/50">
              <td class="px-4 py-3 font-mono text-slate-500">{{ item.id }}</td>

              <td class="px-4 py-3">
                <input v-if="editingId === item.id" v-model="draftKode" class="w-24 px-2 py-1 text-sm border rounded font-mono" />
                <span v-else class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{{ item.kode }}</span>
              </td>

              <td class="px-4 py-3">
                <input v-if="editingId === item.id" v-model="draftNama" class="w-full px-2 py-1 text-sm border rounded" />
                <span v-else>{{ item.nama }}</span>
              </td>

              <td class="px-4 py-3">
                <select v-if="editingId === item.id" v-model="draftKategori" class="px-2 py-1 text-sm border rounded">
                  <option v-for="k in kategoriOptions" :key="k" :value="k">{{ k }}</option>
                </select>
                <span v-else class="capitalize">{{ item.kategori }}</span>
              </td>

              <td class="px-4 py-3 text-center">
                <span class="text-xs" :class="item.is_active ? 'text-emerald-600' : 'text-slate-400'">
                  {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>

              <td class="px-4 py-3 text-center space-x-2">
                <template v-if="editingId === item.id">
                  <button @click="saveEdit" class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
                  <button @click="cancelEdit" class="px-2 py-1 text-xs bg-slate-200 rounded hover:bg-slate-300">Batal</button>
                </template>
                <template v-else>
                  <button @click="startEdit(item)" class="px-2 py-1 text-xs text-blue-600 hover:underline">Edit</button>
                  <button @click="toggleActive(item.id)" class="px-2 py-1 text-xs text-rose-600 hover:underline">
                    {{ item.is_active ? 'Nonaktif' : 'Aktif' }}
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="showCreateModal"
          class="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/20 p-4"
          @click.self="closeCreateModal"
        >
          <div class="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 class="text-sm font-semibold text-slate-800">Tambah Jenis Jabatan</h4>
              <button class="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition" @click="closeCreateModal">✕</button>
            </div>

            <div class="p-5 space-y-3">
              <div>
                <label class="block text-xs font-semibold tracking-wide text-slate-600 mb-1">Kode</label>
                <input
                  v-model="newKode"
                  type="text"
                  placeholder="Kode"
                  class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#3781c7]/40 focus:border-[#3781c7]"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold tracking-wide text-slate-600 mb-1">Nama</label>
                <input
                  v-model="newNama"
                  type="text"
                  placeholder="Nama jenis jabatan"
                  class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3781c7]/40 focus:border-[#3781c7]"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold tracking-wide text-slate-600 mb-1">Kategori</label>
                <select v-model="newKategori" class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3781c7]/40 focus:border-[#3781c7]">
                  <option v-for="k in kategoriOptions" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
            </div>

            <div class="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button
                class="px-3 py-2 text-xs font-semibold bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                @click="closeCreateModal"
              >
                Batal
              </button>
              <button
                class="px-3 py-2 text-xs font-semibold bg-[#146190] text-white rounded-lg hover:bg-[#0f4d73] transition disabled:opacity-50"
                :disabled="creating"
                @click="addItem"
              >
                {{ creating ? 'Menambah...' : 'Tambah' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
