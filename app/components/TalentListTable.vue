<script setup lang="ts">
import { IconEye } from '@tabler/icons-vue'
import { Table } from '@idds/vue'
import { h } from 'vue'

const router = useRouter()

const props = defineProps<{
  tabId: number
  tabLabel: string
}>()

// Dummy data based on the box
const dummyData = [
  { id: 1, nama: 'Budi Santoso, S.IP, M.Si', jabatan: 'Kepala Biro Sumber Daya Manusia', potensial: 85, kinerja: 90, total: 175 },
  { id: 2, nama: 'Siti Aminah, SH, MH', jabatan: 'Analis Kepegawaian Ahli Madya', potensial: 82, kinerja: 88, total: 170 },
  { id: 3, nama: 'Ahmad Faisal, ST, MT', jabatan: 'Kepala Pusat Inovasi Administrasi Negara', potensial: 88, kinerja: 85, total: 173 }
]

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

const handleView = (row: any) => {
  router.push(`/talent/${row.id}`)
}

const columns = [
  { header: 'Nama', accessor: 'nama' },
  { header: 'Jabatan', accessor: 'jabatan' },
  {
    header: 'Potensial',
    accessor: 'potensial',
    render: (row: any) => row.potensial
      ? h('span', { style: 'background:#f3e8ff;color:#6b21a8;border:1px solid #d8b4fe;padding:3px 10px;border-radius:999px;font-weight:700;font-size:11px;display:inline-flex;letter-spacing:0.03em' }, '⬡ ' + String(row.potensial))
      : h('span', '-')
  },
  {
    header: 'Kinerja',
    accessor: 'kinerja',
    render: (row: any) => row.kinerja
      ? h('span', { style: 'background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;padding:3px 10px;border-radius:999px;font-weight:700;font-size:11px;display:inline-flex;letter-spacing:0.03em' }, '★ ' + String(row.kinerja))
      : h('span', '-')
  },
  {
    header: 'Total',
    accessor: 'total',
    render: (row: any) => row.total
      ? h('span', { style: 'background:#146190;color:#fff;padding:2px 10px;border-radius:999px;font-weight:800;font-size:12px;display:inline-flex' }, String(row.total))
      : h('span', '-')
  },
  {
    header: 'Aksi',
    accessor: 'aksi',
    render: (row: any) => {
      if (!row.id) return h('span', '-')
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
  const initialPageSize = 5;
  let resultData = [...dummyData];

  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    resultData = resultData.filter(
      (item) =>
        item.nama?.toLowerCase().includes(searchLower) ||
        item.jabatan?.toLowerCase().includes(searchLower) ||
        item.id.toString().includes(searchLower)
    );
  }

  const originalLength = resultData.length;

  if (resultData.length < initialPageSize) {
    const emptyRowsCount = initialPageSize - resultData.length;
    const emptyRows = Array(emptyRowsCount).fill({});
    resultData = [...resultData, ...emptyRows];
  }

  return {
    data: resultData,
    total: originalLength, // using original length for pagination total
  };
};

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
        <span class="ml-auto text-blue-100 text-xs">{{ dummyData.length }} pegawai</span>
      </div>

      <div class="p-6 flex flex-col gap-4">
        <Table
          :rowClickable="true"
          :columns="columns"
          :fetchData="fetchData"
          :initialPageSize="5"
          :initialSortField="null"
          :initialSortOrder="null"
          :showSearch="true"
          rowKey="id"
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
