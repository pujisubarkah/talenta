<template>
  <div class="p-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Daftar Penilaian</h1>

    <!-- Button -->
    <div class="flex justify-end mb-4">
      <button
        @click="showModal = true"
        class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
      >
        <IconPlus class="w-4 h-4" />
        Tambah Penilaian
      </button>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table
        class="w-full min-w-400 table-fixed divide-y divide-slate-200 text-sm"
      >
        <!-- HEADER -->
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-3 py-3 text-center font-semibold w-12">No</th>
            <th class="px-3 py-3 text-left font-semibold w-28">Kode</th>
            <th class="px-3 py-3 text-left font-semibold w-44">Kategori</th>
            <th class="px-3 py-3 text-left font-semibold w-52">
              Nama Penilaian
            </th>
            <th class="px-3 py-3 text-left font-semibold w-[320px]">
              Deskripsi
            </th>
            <th class="px-3 py-3 text-center font-semibold w-24">Bobot</th>
            <th class="px-3 py-3 text-center font-semibold w-28">
              Jenis Nilai
            </th>
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
          <tr
            v-for="(item, idx) in pagedPenilaian"
            :key="item.id"
            class="hover:bg-slate-50 transition"
          >
            <td class="px-3 py-3 text-center">
              {{ idx + 1 }}
            </td>

            <td class="px-3 py-3 font-medium">
              {{ item.kode }}
            </td>

            <td class="px-3 py-3">
              {{
                kategoriList.find((k) => k.id === item.kategori_id)
                  ?.nama_kategori || "-"
              }}
            </td>

            <td class="px-3 py-3">
              {{ item.nama_penilaian }}
            </td>

            <!-- DESKRIPSI -->
            <td
              class="px-3 py-3 whitespace-normal wrap-break-word leading-relaxed text-slate-600"
            >
              {{ item.deskripsi }}
            </td>

            <td class="px-3 py-3 text-center">
              {{ item.bobot }}
            </td>

            <td class="px-3 py-3 text-center">
              {{ item.jenis_nilai }}
            </td>

            <td class="px-3 py-3 text-center">
              {{ item.metode_penilaian }}
            </td>

            <td class="px-3 py-3 text-center">
              {{ item.sumber_nilai }}
            </td>

            <td class="px-3 py-3 text-center">
              {{ item.urutan }}
            </td>

            <!-- WAJIB -->
            <td class="px-3 py-3 text-center">
              <span
                :class="
                  item.is_wajib
                    ? 'text-green-600 font-semibold'
                    : 'text-red-500'
                "
              >
                {{ item.is_wajib ? "Ya" : "Tidak" }}
              </span>
            </td>

            <!-- ACTIVE -->
            <td class="px-3 py-3 text-center">
              <span
                :class="
                  item.is_active
                    ? 'text-green-600 font-semibold'
                    : 'text-red-500'
                "
              >
                {{ item.is_active ? "Ya" : "Tidak" }}
              </span>
            </td>

            <!-- AKSI -->
            <td class="px-3 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button
                  @click="startEdit(item)"
                  class="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 text-xs"
                >
                  <IconEdit class="w-4 h-4" />
                  Edit
                </button>

                <button
                  @click="removePenilaian(item.id)"
                  class="px-3 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1 text-xs"
                >
                  <IconTrash class="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="penilaianList.length === 0">
            <td
              colspan="13"
              class="text-center py-10 text-slate-400"
            >
              Belum ada data penilaian
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- PAGINATION -->
    <div v-if="penilaianList.length > pageSize" class="flex justify-center mt-4">
      <button
        class="px-3 py-1 mx-1 rounded border text-sm"
        :class="{ 'bg-blue-600 text-white border-blue-600': page === 1 }"
        :disabled="page === 1"
        @click="page--"
      >
        &laquo;
      </button>
      <button
        v-for="p in totalPages"
        :key="p"
        class="px-3 py-1 mx-1 rounded border text-sm"
        :class="{ 'bg-blue-600 text-white border-blue-600': page === p }"
        @click="page = p"
      >
        {{ p }}
      </button>
      <button
        class="px-3 py-1 mx-1 rounded border text-sm"
        :class="{ 'bg-blue-600 text-white border-blue-600': page === totalPages }"
        :disabled="page === totalPages"
        @click="page++"
      >
        &raquo;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue'
import { FormKit } from '@formkit/vue'

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
const isEdit = ref(false)
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

const kategoriOptions = computed(() =>
  kategoriList.value.map((k) => ({ label: k.nama_kategori, value: k.id }))
)

const pageSize = ref(10)
const page = ref(1)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(penilaianList.value.length / pageSize.value))
})

const pagedPenilaian = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return penilaianList.value.slice(start, start + pageSize.value)
})

function startEdit(item: Penilaian) {
  isEdit.value = true
  editId.value = item.id
  showModal.value = true

  form.value = {
    id: item.id,
    kategori_id: item.kategori_id,
    kode: item.kode,
    nama_penilaian: item.nama_penilaian,
    deskripsi: item.deskripsi,
    bobot: item.bobot,
    jenis_nilai: item.jenis_nilai,
    metode_penilaian: item.metode_penilaian,
    sumber_nilai: item.sumber_nilai,
    urutan: item.urutan,
    is_wajib: item.is_wajib,
    is_active: item.is_active
  }
}

async function removePenilaian(id: number) {
  // Minimal implementation to satisfy TS + keep UI consistent.
  // If your backend/API exists, wire it here.
  penilaianList.value = penilaianList.value.filter((p) => p.id !== id)

  // If you’re on the last page and item removal makes the page empty,
  // clamp the current page.
  const maxPage = totalPages.value
  if (page.value > maxPage) page.value = maxPage
}

onMounted(() => {
  // TODO: fetch kategoriList + penilaianList from API.
  // Keeping empty for now so the component compiles.
})

</script>
