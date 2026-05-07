<script setup lang="ts">

import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const search = ref('')
const page = ref(1)
const limit = 10

type RowItem = {
  pegNip: string
  pegNama: string
}

type PegawaiResponse = {
  data: RowItem[]
  meta: {
    total: number
  }
}

console.log('SCRIPT SETUP JALAN')

const { data, pending, error } = await useAsyncData<PegawaiResponse>(
  () => `pegawai-${page.value}-${search.value}`,
  async () => {
    try {
      const url = `/api/pegawai?page=${page.value}&limit=${limit}&search=${search.value}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Network response was not ok')
      const result = await response.json()
      console.log('FETCH RESULT:', result)
      return result
    } catch (err) {
      console.error('FETCH ERROR:', err)
      throw err
    }
  },
  {
    watch: [page, search],
  }
)

const rows = computed(() =>
  (data.value?.data ?? []).map((item) => ({
    pegNip: item.pegNip,
    pegNama: item.pegNama,
  }))
)

onMounted(() => {
  console.log('=== ON MOUNTED ===')
  console.log('data:', data.value)
  console.log('rows:', rows.value)
})

watchEffect(() => {
  console.log('=== WATCH EFFECT ===')
  console.log('data:', data.value)
  console.log('rows:', rows.value)
  console.log('pending:', pending.value)
  console.log('error:', error.value)
})

const onSearch = (e: Event) => {
  search.value = (e.target as HTMLInputElement).value
  page.value = 1
}
</script>

<template>
  <div class="p-6 space-y-4">
    <div
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
    >
      <div>
        <label
          class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Cari Data
        </label>

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
              <th class="px-4 py-3 text-left font-semibold">
                NIP
              </th>

              <th class="px-4 py-3 text-left font-semibold">
                Nama
              </th>

              <th class="px-4 py-3 text-center font-semibold">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
            <template v-if="pending">
              <tr>
                <td
                  colspan="3"
                  class="px-4 py-6 text-center text-sm text-slate-400"
                >
                  Memuat data...
                </td>
              </tr>
            </template>

            <template v-else-if="rows.length === 0">
              <tr>
                <td
                  colspan="3"
                  class="px-4 py-6 text-center text-sm text-slate-400"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="row in rows"
                :key="row.pegNip"
                class="hover:bg-slate-50"
              >
                <td class="px-4 py-3">
                  {{ row.pegNip }}
                </td>

                <td class="px-4 py-3">
                  {{ row.pegNama }}
                </td>

                <td class="px-4 py-3 text-center">
                  <button
                    type="button"
                    @click="router.push(`/talent-pool/daftar-simulasi/edit-kuesioner/${row.pegNip}`)"
                    class="flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-700 hover:bg-amber-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Edit Kuesioner
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>