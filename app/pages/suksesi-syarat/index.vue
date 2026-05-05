<script setup lang="ts">
const router = useRouter()
const search = ref('')

type SyaratRow = {
  syarat: 'Umur' | 'Masa Kerja' | 'Pangkat/Golongan'
  operator: '<' | '>=' | '<='
  nilai: string
}

type JabatanGroup = {
  jabatan: string
  eselon: string
  syaratList: SyaratRow[]
}

const groups = ref<JabatanGroup[]>([
  {
    jabatan: 'Kepala Biro SDM',
    eselon: 'II',
    syaratList: [
      { syarat: 'Umur', operator: '<=', nilai: '55 tahun' },
      { syarat: 'Masa Kerja', operator: '>=', nilai: '10 tahun' },
      { syarat: 'Pangkat/Golongan', operator: '>=', nilai: 'IV/a' },
    ],
  },
  {
    jabatan: 'Kepala Subbagian Perencanaan',
    eselon: 'IV',
    syaratList: [
      { syarat: 'Umur', operator: '<=', nilai: '50 tahun' },
      { syarat: 'Masa Kerja', operator: '>=', nilai: '5 tahun' },
      { syarat: 'Pangkat/Golongan', operator: '>=', nilai: 'III/c' },
    ],
  },
])

const filteredGroups = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return groups.value
  return groups.value.filter(
    (g) =>
      g.jabatan.toLowerCase().includes(query) ||
      g.eselon.toLowerCase().includes(query) ||
      g.syaratList.some(
        (s) => s.syarat.toLowerCase().includes(query) || s.nilai.toLowerCase().includes(query),
      ),
  )
})

const operatorClass = (op: string) => {
  if (op === '<') return 'bg-amber-100 text-amber-700'
  if (op === '>=') return 'bg-green-100 text-green-700'
  return 'bg-blue-100 text-blue-700'
}
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Syarat Jabatan</h1>
        <p class="text-sm text-slate-500">Modul Suksesi</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-[#146190] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4d73]"
        @click="router.push('/suksesi-syarat/add')"
      >
        + Tambah Syarat
      </button>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cari Data</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari berdasarkan jabatan, syarat, atau nilai"
          class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
        />
      </div>

      <div class="overflow-x-auto rounded-lg border border-slate-100">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-center font-semibold w-12">No</th>
              <th class="px-4 py-3 text-left font-semibold">Jabatan</th>
              <th class="px-4 py-3 text-center font-semibold w-24">Eselon</th>
              <th class="px-4 py-3 text-left font-semibold">Syarat</th>
              <th class="px-4 py-3 text-center font-semibold w-28">Operator</th>
              <th class="px-4 py-3 text-left font-semibold">Nilai</th>
              <th class="px-4 py-3 text-center font-semibold w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white text-slate-700">
            <template v-if="filteredGroups.length > 0">
              <template v-for="(group, gIndex) in filteredGroups" :key="gIndex">
                <tr
                  v-for="(syarat, sIndex) in group.syaratList"
                  :key="sIndex"
                  class="hover:bg-slate-50 border-t border-slate-100"
                >
                  <td
                    v-if="sIndex === 0"
                    :rowspan="group.syaratList.length"
                    class="px-4 py-3 text-center align-middle border-r border-slate-100"
                  >
                    {{ gIndex + 1 }}
                  </td>
                  <td
                    v-if="sIndex === 0"
                    :rowspan="group.syaratList.length"
                    class="px-4 py-3 align-middle font-medium border-r border-slate-100"
                  >
                    {{ group.jabatan }}
                  </td>
                  <td
                    v-if="sIndex === 0"
                    :rowspan="group.syaratList.length"
                    class="px-4 py-3 text-center align-middle border-r border-slate-100"
                  >
                    {{ group.eselon }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {{ syarat.syarat }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
                      :class="operatorClass(syarat.operator)"
                    >
                      {{ syarat.operator }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-medium">{{ syarat.nilai }}</td>
                  <td
                    v-if="sIndex === 0"
                    :rowspan="group.syaratList.length"
                    class="px-4 py-3 text-center align-middle border-l border-slate-100"
                  >
                    <button
                      type="button"
                      class="inline-flex items-center rounded-lg border border-[#146190] px-3 py-1.5 text-xs font-semibold text-[#146190] transition hover:bg-[#146190] hover:text-white"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </template>
            </template>
            <tr v-else>
              <td colspan="7" class="px-4 py-6 text-center text-sm text-slate-400">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
