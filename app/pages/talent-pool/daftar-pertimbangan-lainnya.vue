<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-vue'

type Option = { label: string; value: number }

type PertimbanganItem = {
  id: number
  key: string
  label: string
  bobot: string
  options: Option[]
  created_at?: string
  updated_at?: string
}

const pertimbanganList = ref<PertimbanganItem[]>([])

async function fetchPertimbangan() {
  const res = await fetch('/api/master/pertimbangan-lain')
  const json = await res.json()
  pertimbanganList.value = Array.isArray(json.data) ? json.data : []
}
onMounted(fetchPertimbangan)

const showModal = ref(false)
const showEditModal = ref(false)

const newLabel = ref('')
const newBobot = ref('')
const newOptions = ref<Option[]>([])

const optionLabel = ref('')
const optionValue = ref<number | ''>('')

function addOption() {
  if (!optionLabel.value || optionValue.value === '') return
  newOptions.value.push({ label: optionLabel.value, value: Number(optionValue.value) })
  optionLabel.value = ''
  optionValue.value = ''
}

function removeOption(idx: number) {
  newOptions.value.splice(idx, 1)
}

async function addPertimbangan() {
  await fetch('/api/master/pertimbangan-lain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: newLabel.value.toLowerCase().replace(/\s+/g, '_'),
      label: newLabel.value,
      bobot: newBobot.value,
      options: newOptions.value
    })
  })
  showModal.value = false
  newLabel.value = ''
  newBobot.value = ''
  newOptions.value = []
  optionLabel.value = ''
  optionValue.value = ''
  await fetchPertimbangan()
}

function resetEditForm() {
  editLabel.value = ''
  editBobot.value = ''
  editOptions.value = []
  editOptionLabel.value = ''
  editOptionValue.value = ''
}

const editLabel = ref('')
const editBobot = ref('')
const editOptions = ref<Option[]>([])

const editOptionLabel = ref('')
const editOptionValue = ref<number | ''>('')

function addEditOption() {
  if (!editOptionLabel.value || editOptionValue.value === '') return
  editOptions.value.push({ label: editOptionLabel.value, value: Number(editOptionValue.value) })
  editOptionLabel.value = ''
  editOptionValue.value = ''
}

function removeEditOption(idx: number) {
  editOptions.value.splice(idx, 1)
}

const editingId = ref<number | null>(null)

function startEdit(item: PertimbanganItem) {
  editingId.value = item.id
  editLabel.value = item.label
  editBobot.value = item.bobot
  editOptions.value = Array.isArray(item.options) ? [...item.options] : []
  resetEditOptionDrafts()
  showEditModal.value = true
}

function resetEditOptionDrafts() {
  editOptionLabel.value = ''
  editOptionValue.value = ''
}

function cancelEdit() {
  showEditModal.value = false
  editingId.value = null
  resetEditForm()
}

async function saveEdit() {
  if (editingId.value === null) return
  await fetch('/api/master/pertimbangan-lain', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: editingId.value,
      key: editLabel.value.toLowerCase().replace(/\s+/g, '_'),
      label: editLabel.value,
      bobot: editBobot.value,
      options: editOptions.value
    })
  })
  cancelEdit()
  await fetchPertimbangan()
}

async function removePertimbangan(id: number) {
  await fetch('/api/master/pertimbangan-lain', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  await fetchPertimbangan()
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-xl font-bold mb-4">Daftar Pertimbangan Lainnya</h1>
    <div class="flex justify-end mb-2">
      <button
        @click="showModal = true"
        class="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
      >
        <IconPlus class="w-4 h-4" />
        Tambah Pertimbangan
      </button>
    </div>
    <table class="min-w-full divide-y divide-slate-200 text-sm mb-4">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th class="px-4 py-3 text-center font-semibold w-12">No</th>
          <th class="px-4 py-3 text-left font-semibold">Label</th>
          <th class="px-4 py-3 text-center font-semibold">Bobot</th>
          <th class="px-4 py-3 text-left font-semibold">Pilihan</th>
          <th class="px-4 py-3 text-center font-semibold">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
        <tr v-for="(item, idx) in pertimbanganList" :key="item.id">
          <td class="px-4 py-3 text-center">{{ idx + 1 }}</td>
          <td class="px-4 py-3">{{ item.label }}</td>
          <td class="px-4 py-3 text-center">{{ item.bobot }}</td>
          <td class="px-4 py-3">
            <ul>
              <li
                v-for="(opt, oidx) in item.options"
                :key="opt.label + opt.value"
                class="flex items-center gap-2 mb-1"
              >
                <span class="font-semibold">
                  {{ String.fromCharCode(97 + oidx) }}. {{ opt.label }}
                  <span class="text-slate-400">({{ opt.value }})</span>
                </span>
              </li>
            </ul>
          </td>
          <td class="px-4 py-3 text-center">
            <div class="inline-flex gap-2">
              <button @click="startEdit(item)" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1">
                <IconEdit class="w-4 h-4" />
                Edit
              </button>
              <button @click="removePertimbangan(item.id)" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1">
                <IconTrash class="w-4 h-4" />
                Hapus
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Edit -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fadein">
        <button
          @click="cancelEdit"
          class="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-2xl leading-none"
        >
          &times;
        </button>
        <h2 class="text-lg font-bold mb-4">Edit Pertimbangan</h2>
        <form @submit.prevent="saveEdit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Label</label>
            <input
              v-model="editLabel"
              placeholder="Label"
              class="border rounded px-2 py-1 text-sm w-full"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Bobot</label>
            <input
              v-model="editBobot"
              type="number"
              min="0"
              max="100"
              placeholder="Bobot"
              class="border rounded px-2 py-1 text-sm w-full text-center"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Pilihan</label>
            <div class="flex gap-2 mb-2">
              <input v-model="editOptionLabel" placeholder="Label" class="border rounded px-2 py-1 text-sm w-1/2" />
              <input
                v-model.number="editOptionValue"
                type="number"
                placeholder="Value"
                class="border rounded px-2 py-1 text-sm w-1/3 text-center"
              />
              <button
                type="button"
                @click="addEditOption"
                class="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Tambah
              </button>
            </div>
            <ul>
              <li
                v-for="(opt, oidx) in editOptions"
                :key="opt.label + opt.value"
                class="flex items-center gap-2 mb-1"
              >
                <span class="font-medium">
                  {{ String.fromCharCode(97 + oidx) }}. {{ opt.label }}
                  <span class="text-slate-400">({{ opt.value }})</span>
                </span>
                <button
                  type="button"
                  @click="removeEditOption(oidx)"
                  class="text-xs text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </li>
            </ul>
            <div class="flex justify-end gap-2 mt-3">
              <button
                type="button"
                @click="cancelEdit"
                class="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fadein">
        <button
          @click="showModal = false"
          class="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-2xl leading-none"
        >
          &times;
        </button>
        <h2 class="text-lg font-bold mb-4">Tambah Pertimbangan</h2>
        <form @submit.prevent="addPertimbangan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Label</label>
            <input v-model="newLabel" placeholder="Label" class="border rounded px-2 py-1 text-sm w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Bobot</label>
            <input
              v-model="newBobot"
              type="number"
              min="0"
              max="100"
              placeholder="Bobot"
              class="border rounded px-2 py-1 text-sm w-full text-center"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Pilihan</label>
            <div class="flex gap-2 mb-2">
              <input v-model="optionLabel" placeholder="Label" class="border rounded px-2 py-1 text-sm w-1/2" />
              <input
                v-model.number="optionValue"
                type="number"
                placeholder="Value"
                class="border rounded px-2 py-1 text-sm w-1/3 text-center"
              />
              <button
                type="button"
                @click="addOption"
                class="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Tambah
              </button>
            </div>
            <ul>
              <li
                v-for="(opt, oidx) in newOptions"
                :key="opt.label + opt.value"
                class="flex items-center gap-2 mb-1"
              >
                <span>{{ opt.label }} ({{ opt.value }})</span>
                <button type="button" @click="removeOption(oidx)" class="text-xs text-red-500 hover:underline">
                  Hapus
                </button>
              </li>
            </ul>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showModal = false"
              class="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
