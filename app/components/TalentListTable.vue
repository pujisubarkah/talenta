<script setup lang="ts">
import { Table } from '@idds/vue'
import { h } from 'vue'

const router = useRouter()

const props = defineProps<{
  tabId: number
  tabLabel: string
}>()

// Mapping for 9-Box Grid Titles
const boxMapping: Record<number, { judul: string; kategori: string; rekomendasi: string }> = {
  1: { judul: 'Membutuhkan Perhatian Khusus', kategori: 'Kinerja Kurang, Potensial Kurang', rekomendasi: 'Pembinaan intensif atau penyesuaian penempatan kerja.' },
  2: { judul: 'Perlu Pembinaan', kategori: 'Kinerja Cukup, Potensial Kurang', rekomendasi: 'Pelatihan teknis untuk meningkatkan konsistensi kinerja.' },
  3: { judul: 'Kinerja Solid', kategori: 'Kinerja Baik, Potensial Kurang', rekomendasi: 'Berikan penghargaan atas kinerja dan pertahankan kontribusi.' },
  4: { judul: 'Kurang Sesuai', kategori: 'Kinerja Kurang, Potensial Sedang', rekomendasi: 'Mentoring dan penugasan khusus untuk mengasah kemampuan.' },
  5: { judul: 'Memenuhi Harapan', kategori: 'Kinerja Cukup, Potensial Sedang', rekomendasi: 'Pengembangan kompetensi berkala ke level selanjutnya.' },
  6: { judul: 'Profesional Berpengalaman', kategori: 'Kinerja Baik, Potensial Sedang', rekomendasi: 'Pengayaan pekerjaan (job enrichment) dan delegasi peran.' },
  7: { judul: 'Potensial Berkembang', kategori: 'Kinerja Kurang, Potensial Tinggi', rekomendasi: 'Coaching intensif untuk mengatasi hambatan kinerja.' },
  8: { judul: 'Kader Penerus', kategori: 'Kinerja Cukup, Potensial Tinggi', rekomendasi: 'Persiapkan untuk peran kepemimpinan melalui program suksesi.' },
  9: { judul: 'Bintang (Top Talent)', kategori: 'Kinerja Baik, Potensial Tinggi', rekomendasi: 'Promosi (Fast track), penugasan strategis, dan talent retention.' },
}

const getInfo = () => {
  const boxData = boxMapping[props.tabId]
  if (boxData) return boxData
  return {
    judul: props.tabLabel,
    kategori: 'Tidak Diketahui',
    rekomendasi: 'Tidak ada rekomendasi khusus.'
  }
}

const info = getInfo()
const total = ref(0)

const handleView = (row: any) => {
  router.push(`/talent/${row.pegNip}`)
}

const columns = [
  { header: 'Nama', accessor: 'pegNama' },
  { header: 'Jabatan', accessor: 'jabatan' },
  {
    header: 'Potensial',
    accessor: 'nilaiPotensi',
    render: (row: any) => row.nilaiPotensi
      ? h('span', { style: 'background:#f3e8ff;color:#6b21a8;border:1px solid #d8b4fe;padding:3px 10px;border-radius:999px;font-weight:700;font-size:11px;display:inline-flex;letter-spacing:0.03em' }, '⬡ ' + String(row.nilaiPotensi))
      : h('span', '-')
  },
  {
    header: 'Kinerja',
    accessor: 'nilaiKinerja',
    render: (row: any) => row.nilaiKinerja
      ? h('span', { style: 'background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;padding:3px 10px;border-radius:999px;font-weight:700;font-size:11px;display:inline-flex;letter-spacing:0.03em' }, '★ ' + String(row.nilaiKinerja))
      : h('span', '-')
  },
  {
    header: 'Aksi',
    accessor: 'aksi',
    render: (row: any) => {
      if (!row.pegNip) return h('span', '-')
      return h(
        'button',
        {
          style: 'color:#146190;background:#e3f0fb;border:1px solid #8accef;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;',
          onClick: (e: MouseEvent) => { e.stopPropagation(); handleView(row) }
        },
        'View'
      )
    }
  },
]

const fetchData = async (params: any) => {
  const page  = params.page  || 1
  const limit = params.pageSize || 10
  const search = params.searchTerm || ''

  const res = await $fetch<{ data: any[]; meta: { total: number } }>('/api/pegawai/nilai', {
    query: {
      page,
      limit,
      search,
      nineBox: props.tabId,
    },
  })

  total.value = res.meta.total

  return {
    data: res.data,
    total: res.meta.total,
  }
}

</script>

<template>
  <div class="p-6">
    <!-- Table Header Info -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50/50 border border-blue-100 p-4 rounded-xl shadow-sm">
        <p class="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Judul</p>
        <p class="text-slate-800 font-bold text-lg">{{ info.judul }}</p>
      </div>
      <div class="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl shadow-sm">
        <p class="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Kategori</p>
        <p class="text-slate-800 font-bold text-lg">{{ info.kategori }}</p>
      </div>
      <div class="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl shadow-sm">
        <p class="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Rekomendasi</p>
        <p class="text-slate-800 font-bold text-sm">{{ info.rekomendasi }}</p>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden" style="border: 1px solid var(--ina-secondary-200)">
      <!-- Table Header Bar -->
      <div class="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3 flex items-center gap-2">
        <span class="text-white font-semibold text-sm tracking-wide">Daftar Talent</span>
        <span class="ml-auto text-blue-100 text-xs">{{ total }} pegawai</span>
      </div>

      <div class="p-6 flex flex-col gap-4">
        <Table
          :rowClickable="true"
          :columns="columns"
          :fetchData="fetchData"
          :initialPageSize="10"
          :initialSortField="null"
          :initialSortOrder="null"
          :showSearch="true"
          rowKey="pegNip"
          class="
            w-full
            [&_.ina-table__search-controls]:flex-row [&_.ina-table__search-controls]:flex [&_.ina-table__search-controls]:gap-2
            [&_thead_tr]:bg-(--ina-secondary-600)!
            [&_thead_th]:bg-(--ina-secondary-600)! [&_thead_th]:border-(--ina-secondary-700)!
            [&_thead_th]:text-white! [&_thead_th]:font-semibold! [&_thead_th]:text-xs! [&_thead_th]:uppercase! [&_thead_th]:tracking-wider!
            [&_tbody_tr:nth-child(odd)]:bg-white
            [&_tbody_tr:nth-child(even)]:bg-(--ina-secondary-50)
            [&_tbody_tr:hover]:bg-(--ina-secondary-100)!
            [&_tbody_td]:border-(--ina-secondary-100)!
            [&_.ina-table__cell]:text-slate-800!
            [&_.ina-table__cell_span]:text-slate-800!
            [&_tbody_td]:text-slate-800!
          "
        />
      </div>
    </div>
  </div>
</template>
