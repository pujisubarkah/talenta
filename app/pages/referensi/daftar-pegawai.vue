<script setup lang="ts">
type Pegawai = {
  pegNip: string
  pegNama: string
  jabatan: string | null
  satuanKerjaNama: string | null
  unitKerjaNama: string | null
  eselonNm: string | null
  golAkhirNm: string | null
  golIdAkhir: number | null
  eselonId: number | null
  jabatanId: number | null
  satuanKerjaId: number | null
  unitKerjaId: number | null
  photoUrl: string | null
  jfuId: number | null
  jfId: number | null
}

type Meta = { total: number; page: number; limit: number; totalPages: number }

const search = ref('')
const page   = ref(1)
const limit  = 20

let searchTimeout: ReturnType<typeof setTimeout>

const debouncedSearch = ref('')
watch(search, (val) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = val
    page.value = 1
  }, 400)
})

const { data, status, error, refresh } = useFetch<{ data: Pegawai[]; meta: Meta }>('/api/pegawai', {
  query: computed(() => ({ page: page.value, limit, search: debouncedSearch.value })),
})

const rows      = computed(() => data.value?.data ?? [])
const meta      = computed(() => data.value?.meta)
const totalPages = computed(() => meta.value?.totalPages ?? 1)

const pages = computed(() => {
  const total = totalPages.value
  const cur   = page.value
  const delta = 2
  const range: (number | '...')[] = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= cur - delta && i <= cur + delta)) {
      range.push(i)
    } else if (range[range.length - 1] !== '...') {
      range.push('...')
    }
  }
  return range
})
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Daftar Pegawai</h1>
        <p class="text-sm text-slate-500">Data pegawai dari sistem referensi</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-[#146190] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4d73]"
      >
        + Tambah Data
      </button>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cari Data</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari NIP, nama, jabatan, satuan/unit kerja"
          class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
        />
      </div>

      <!-- Loading -->
      <div v-if="status === 'pending'" class="py-10 text-center text-sm text-slate-400">
        Memuat data...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-10 text-center text-sm text-red-500">
        Gagal memuat data: {{ error.message }}
        <button class="ml-2 underline" @click="refresh()">Coba lagi</button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">NIP</th>
              <th class="px-4 py-3 text-left font-semibold">Nama</th>
              <th class="px-4 py-3 text-left font-semibold">Jabatan</th>
              <th class="px-4 py-3 text-left font-semibold">Satuan Kerja</th>
              <th class="px-4 py-3 text-left font-semibold">Unit Kerja</th>
              <th class="px-4 py-3 text-left font-semibold">Eselon</th>
              <th class="px-4 py-3 text-left font-semibold">Gol.</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <tr v-for="row in rows" :key="row.pegNip" class="hover:bg-slate-50">
              <td class="px-4 py-3 font-mono text-xs">{{ row.pegNip }}</td>
              <td class="px-4 py-3 font-medium">
                <div class="flex items-center gap-2">
                  <img
                    v-if="row.photoUrl"
                    :src="`/foto/${row.photoUrl}`"
                    :alt="row.pegNama ?? ''"
                    class="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                    @error="($event.target as HTMLImageElement).style.display = 'none'"
                  />
                  <div v-else class="w-7 h-7 rounded-full bg-[#3781c7]/10 text-[#3781c7] text-xs font-bold flex items-center justify-center shrink-0">
                    {{ (row.pegNama ?? '?').charAt(0) }}
                  </div>
                  {{ row.pegNama }}
                </div>
              </td>
              <td class="px-4 py-3">{{ row.jabatan ?? '-' }}</td>
              <td class="px-4 py-3">{{ row.satuanKerjaNama ?? '-' }}</td>
              <td class="px-4 py-3">{{ row.unitKerjaNama ?? '-' }}</td>
              <td class="px-4 py-3">{{ row.eselonNm ?? '-' }}</td>
              <td class="px-4 py-3">
                <span v-if="row.golAkhirNm" class="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {{ row.golAkhirNm }}
                </span>
                <span v-else class="text-slate-400">-</span>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="7" class="px-4 py-6 text-center text-sm text-slate-400">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.totalPages > 1" class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p class="text-xs text-slate-500">
          Menampilkan {{ (meta.page - 1) * meta.limit + 1 }}–{{ Math.min(meta.page * meta.limit, meta.total) }}
          dari {{ meta.total }} data
        </p>
        <div class="flex items-center gap-1">
          <button
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            :disabled="page <= 1"
            @click="page--"
          >
            ‹ Prev
          </button>
          <template v-for="p in pages" :key="p">
            <span v-if="p === '...'" class="px-2 text-slate-400">…</span>
            <button
              v-else
              class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
              :class="p === page
                ? 'border-[#3781c7] bg-[#3781c7] text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
              @click="page = p"
            >
              {{ p }}
            </button>
          </template>
          <button
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            :disabled="page >= totalPages"
            @click="page++"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
