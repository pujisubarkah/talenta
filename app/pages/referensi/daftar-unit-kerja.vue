<script setup lang="ts">
type UnitKerja = {
  id: number
  name: string | null
  satkerId: number | null
  kode: string | null
  alias: string | null
}

const search = ref('')

let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = ref('')
watch(search, (val) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = val
  }, 400)
})

const { data, status, error, refresh } = useFetch<{ data: UnitKerja[] }>('/api/unit-kerja', {
  query: computed(() => ({ search: debouncedSearch.value })),
})

const rows = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Daftar Unit Kerja</h1>
        <p class="text-sm text-slate-500">Modul Referensi</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cari Data</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari berdasarkan nama, kode, atau alias"
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
              <th class="px-4 py-3 text-left font-semibold">ID</th>
              <th class="px-4 py-3 text-left font-semibold">Nama</th>
              <th class="px-4 py-3 text-left font-semibold">Kode</th>
              <th class="px-4 py-3 text-left font-semibold">Alias</th>
              <th class="px-4 py-3 text-left font-semibold">Satker ID</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <tr v-for="row in rows" :key="row.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 font-mono text-xs">{{ row.id }}</td>
              <td class="px-4 py-3 font-medium">{{ row.name ?? '-' }}</td>
              <td class="px-4 py-3">{{ row.kode ?? '-' }}</td>
              <td class="px-4 py-3">{{ row.alias ?? '-' }}</td>
              <td class="px-4 py-3">{{ row.satkerId ?? '-' }}</td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-sm text-slate-400">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
