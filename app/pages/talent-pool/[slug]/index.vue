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

let searchTimeout: ReturnType<typeof setTimeout>
const onSearch = (e: Event) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    search.value = (e.target as HTMLInputElement).value
    page.value = 1
  }, 300)
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
</template>
