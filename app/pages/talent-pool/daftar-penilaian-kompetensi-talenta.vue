<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue'

type KompetensiItem = { id: number, nama: string, bobot: number }
const kompetensiList = ref<KompetensiItem[]>([
  { id: 1, nama: 'Kompetensi Teknis', bobot: 50 },
  { id: 2, nama: 'Kompetensi Manajerial', bobot: 50 },
])

const newNama = ref('')
const newBobot = ref(0)
const showModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number|null>(null)
const editNama = ref('')
const editBobot = ref(0)

function addKompetensi() {
  if (!newNama.value || newBobot.value < 0 || newBobot.value > 100) return
  kompetensiList.value.push({
    id: Date.now(),
    nama: newNama.value,
    bobot: newBobot.value,
  })
  newNama.value = ''
  newBobot.value = 0
  showModal.value = false
}

function startEdit(item: KompetensiItem) {
  editId.value = item.id
  editNama.value = item.nama
  editBobot.value = item.bobot
  showEditModal.value = true
}

function saveEdit() {
  if (editId.value === null) return
  const idx = kompetensiList.value.findIndex(i => i.id === editId.value)
  if (idx === -1) return
  const item = kompetensiList.value[idx]
  if (!item) return
  item.nama = editNama.value.trim()
  item.bobot = editBobot.value
  showEditModal.value = false
  editId.value = null
}

function cancelEdit() {
  showEditModal.value = false
  editId.value = null
}

function removeKompetensi(id:number) {
  kompetensiList.value = kompetensiList.value.filter(i => i.id !== id)
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-xl font-bold mb-4">Daftar Penilaian Kompetensi & Bobot</h1>
    <div class="flex justify-end mb-2">
      <button @click="showModal = true" class="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
        <IconPlus class="w-4 h-4" />
        Tambah Kompetensi
      </button>
    </div>
    <table class="min-w-full divide-y divide-slate-200 text-sm mb-4">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th class="px-4 py-3 text-center font-semibold w-12">No</th>
          <th class="px-4 py-3 text-left font-semibold">Kompetensi</th>
          <th class="px-4 py-3 text-center font-semibold">Bobot (%)</th>
          <th class="px-4 py-3 text-center font-semibold">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
        <tr v-for="(item, idx) in kompetensiList" :key="item.id">
          <td class="px-4 py-3 text-center">{{ idx + 1 }}</td>
          <td class="px-4 py-3">{{ item.nama }}</td>
          <td class="px-4 py-3 text-center">{{ item.bobot }}</td>
          <td class="px-4 py-3 text-center">
            <div class="inline-flex gap-2">
              <button @click="startEdit(item)" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1">
                <IconEdit class="w-4 h-4" />
                Edit
              </button>
              <button @click="removeKompetensi(item.id)" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1">
                <IconTrash class="w-4 h-4" />
                Hapus
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Edit Kompetensi -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button @click="cancelEdit" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600">&times;</button>
        <h2 class="text-lg font-bold mb-4">Edit Kompetensi</h2>
        <form @submit.prevent="saveEdit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nama Kompetensi</label>
            <input v-model="editNama" placeholder="Nama kompetensi" class="border rounded px-2 py-1 text-sm w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Bobot (%)</label>
            <input v-model.number="editBobot" type="number" min="0" max="100" placeholder="Bobot (%)" class="border rounded px-2 py-1 text-sm w-full text-center" required />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="cancelEdit" class="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">Batal</button>
            <button type="submit" class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Tambah Kompetensi -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button @click="showModal = false" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600">&times;</button>
        <h2 class="text-lg font-bold mb-4">Tambah Kompetensi</h2>
        <form @submit.prevent="addKompetensi" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nama Kompetensi</label>
            <input v-model="newNama" placeholder="Nama kompetensi" class="border rounded px-2 py-1 text-sm w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Bobot (%)</label>
            <input v-model.number="newBobot" type="number" min="0" max="100" placeholder="Bobot (%)" class="border rounded px-2 py-1 text-sm w-full text-center" required />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showModal = false" class="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">Batal</button>
            <button type="submit" class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
