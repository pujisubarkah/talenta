<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const search = ref('')
const page = ref(1)
const limit = 10

type RowItem = {
  pegNip: string
  pegNama: string
}

type SpesifikItem = {
  id: number
  nama: string
  bobot: number
}

const { data, pending, refresh } = await useAsyncData(
  () => `pegawai-${page.value}-${search.value}`,
  () => $fetch<{ data: RowItem[]; meta: { total: number } }>('/api/pegawai', {
    query: { page: page.value, limit, search: search.value },
  }),
  { watch: [page, search] }
)

const rows = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.meta?.total ?? 0)
const totalPages = computed(() => Math.ceil(total.value / limit))

const title = computed(() => {
  const slug = String(route.params.slug || '')
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

/**
 * Tabel Penilaian Spesifik & Bobot
 * (state & handler dibutuhkan oleh template di bawahnya)
 */
const spesifikList = ref<SpesifikItem[]>([
  { id: 1, nama: 'Capaian Kinerja', bobot: 60 },
])


const newNama = ref('')
const newBobot = ref(0)

const showEditModal = ref(false)
const editId = ref<number | null>(null)
const editNama = ref('')
const editBobot = ref(0)

let searchTimeout: ReturnType<typeof setTimeout>
const onSearch = (e: Event) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    search.value = (e.target as HTMLInputElement).value
    page.value = 1
  }, 300)
}

function addSpesifik() {
  const nama = newNama.value.trim()
  const bobot = newBobot.value

  if (!nama) return
  if (bobot < 0 || bobot > 100) return

  spesifikList.value.push({
    id: Date.now(),
    nama,
    bobot,
  })

  newNama.value = ''
  newBobot.value = 0
}

function startEdit(item: SpesifikItem) {
  editId.value = item.id
  editNama.value = item.nama
  editBobot.value = item.bobot
  showEditModal.value = true
}

function saveEdit() {
  if (editId.value === null) return
  const idx = spesifikList.value.findIndex((i) => i.id === editId.value)
  if (idx === -1) return

  const item = spesifikList.value[idx]
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

function removeSpesifik(id: number) {
  spesifikList.value = spesifikList.value.filter((i) => i.id !== id)
}
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">{{ title }}</h1>
        <p class="text-sm text-slate-500">Template tabel standar Talent Pool.</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cari Data</label>
        <input
          type="text"
          placeholder="Cari berdasarkan NIP atau nama"
          class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
          @input="onSearch"
        />
      </div>

      <div class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-center font-semibold w-12">No</th>
              <th class="px-4 py-3 text-left font-semibold">NIP</th>
              <th class="px-4 py-3 text-left font-semibold">Nama</th>
              <th class="px-4 py-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <template v-if="pending">
              <tr>
                <td colspan="4" class="px-4 py-6 text-center text-sm text-slate-400">Memuat data...</td>
              </tr>
            </template>
            <template v-else-if="rows.length === 0">
              <tr>
                <td colspan="4" class="px-4 py-6 text-center text-sm text-slate-400">Data tidak ditemukan.</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(row, index) in rows" :key="row.pegNip" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-center">{{ (page - 1) * 10 + index + 1 }}</td>
                <td class="px-4 py-3">{{ row.pegNip }}</td>
                <td class="px-4 py-3">{{ row.pegNama }}</td>
                <td class="px-4 py-3 text-center">
                  <div class="inline-flex gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md bg-[#e3f0fb] border border-[#8accef] px-3 py-1.5 text-xs font-semibold text-[#146190] hover:bg-[#cde4f5] transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md bg-amber-50 border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                      @click="router.push(`/talent-pool/${route.params.slug}/edit-kuesioner/${row.pegNip}`)"
                    >
                      Edit Kuesioner
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between pt-2">
        <p class="text-xs text-slate-500">Total: {{ total }} pegawai</p>
        <div class="inline-flex gap-1">
          <button
            :disabled="page <= 1"
            class="px-3 py-1.5 rounded-md border text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 transition"
            @click="page--"
          >← Prev</button>
          <span class="px-3 py-1.5 text-xs text-slate-600">{{ page }} / {{ totalPages }}</span>
          <button
            :disabled="page >= totalPages"
            class="px-3 py-1.5 rounded-md border text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 transition"
            @click="page++"
          >Next →</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Tabel Penilaian Spesifik & Bobot -->
  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 mt-8">
      <h2 class="text-base font-bold text-slate-800 mb-2">Penilaian Spesifik & Bobot</h2>
      <table class="min-w-full divide-y divide-slate-200 text-sm mb-4">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-center font-semibold w-12">No</th>
            <th class="px-4 py-3 text-left font-semibold">Penilaian</th>
            <th class="px-4 py-3 text-center font-semibold">Bobot (%)</th>
            <th class="px-4 py-3 text-center font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
          <tr v-for="(item, idx) in spesifikList" :key="item.id">
            <td class="px-4 py-3 text-center">{{ idx + 1 }}</td>
            <td class="px-4 py-3">{{ item.nama }}</td>
            <td class="px-4 py-3 text-center">{{ item.bobot }}</td>
            <td class="px-4 py-3 text-center">
              <div class="inline-flex gap-2">
                <button @click="startEdit(item)" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">Edit</button>
                <button @click="removeSpesifik(item.id)" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Edit Penilaian -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
          <button @click="cancelEdit" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600">&times;</button>
          <h2 class="text-lg font-bold mb-4">Edit Penilaian Spesifik</h2>
          <form @submit.prevent="saveEdit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nama Penilaian</label>
              <input v-model="editNama" placeholder="Nama penilaian" class="border rounded px-2 py-1 text-sm w-full" required />
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
      <form @submit.prevent="addSpesifik" class="flex gap-2 items-center">
        <input v-model="newNama" placeholder="Nama penilaian" class="border rounded px-2 py-1 text-sm w-40" required />
        <input v-model.number="newBobot" type="number" min="0" max="100" placeholder="Bobot (%)" class="border rounded px-2 py-1 text-sm w-20 text-center" required />
        <button type="submit" class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Tambah</button>
      </form>
    </div>
</template>
