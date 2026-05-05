<script setup lang="ts">
const router = useRouter()

const form = reactive({
  jabatan: '',
  umurOperator: '<',
  umur: '',
  masaKerjaOperator: '<',
  masaKerja: '',
  pangkatGolonganOperator: '<',
  pangkatGolongan: '',
})
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Tambah Syarat Jabatan</h1>
        <p class="text-sm text-slate-500">Modul Suksesi</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1 text-sm font-semibold text-[#146190] hover:underline"
        @click="router.back()"
      >
        ← Kembali
      </button>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="space-y-5 max-w-lg">
        <div class="grid grid-cols-3 gap-4 items-center">
          <label class="text-sm font-semibold text-slate-700">Jabatan</label>
          <div class="col-span-2">
            <input
              v-model="form.jabatan"
              type="text"
              placeholder="Masukkan nama jabatan"
              class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 items-center">
          <label class="text-sm font-semibold text-slate-700">Umur</label>
          <div class="col-span-2 space-y-2">
            <div class="inline-flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                class="px-4 py-2 text-xs font-semibold transition"
                :class="form.umurOperator === '<' ? 'bg-[#146190] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                @click="form.umurOperator = '<'"
              >
                &lt; Kurang dari
              </button>
              <button
                type="button"
                class="px-4 py-2 text-xs font-semibold transition border-l border-slate-200"
                :class="form.umurOperator === '>' ? 'bg-[#146190] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                @click="form.umurOperator = '>'"
              >
                &gt; Lebih dari
              </button>
            </div>
            <input
              v-model="form.umur"
              type="number"
              placeholder="Contoh: 45"
              class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 items-start">
          <label class="text-sm font-semibold text-slate-700 pt-2">Masa Kerja</label>
          <div class="col-span-2 space-y-2">
            <div class="inline-flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                class="px-4 py-2 text-xs font-semibold transition"
                :class="form.masaKerjaOperator === '<' ? 'bg-[#146190] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                @click="form.masaKerjaOperator = '<'"
              >
                &lt; Kurang dari
              </button>
              <button
                type="button"
                class="px-4 py-2 text-xs font-semibold transition border-l border-slate-200"
                :class="form.masaKerjaOperator === '>' ? 'bg-[#146190] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                @click="form.masaKerjaOperator = '>'"
              >
                &gt; Lebih dari
              </button>
            </div>
            <input
              v-model="form.masaKerja"
              type="text"
              placeholder="Contoh: 10 tahun"
              class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 items-start">
          <label class="text-sm font-semibold text-slate-700 pt-2">Pangkat/Golongan</label>
          <div class="col-span-2 space-y-2">
            <div class="inline-flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                class="px-4 py-2 text-xs font-semibold transition"
                :class="form.pangkatGolonganOperator === '<' ? 'bg-[#146190] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                @click="form.pangkatGolonganOperator = '<'"
              >
                &lt; Kurang dari
              </button>
              <button
                type="button"
                class="px-4 py-2 text-xs font-semibold transition border-l border-slate-200"
                :class="form.pangkatGolonganOperator === '>' ? 'bg-[#146190] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                @click="form.pangkatGolonganOperator = '>'"
              >
                &gt; Lebih dari
              </button>
            </div>
            <input
              v-model="form.pangkatGolongan"
              type="text"
              placeholder="Contoh: IV/a"
              class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-[#3781c7] focus:outline-none"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="inline-flex items-center px-5 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            @click="router.back()"
          >
            Batal
          </button>
          <button
            type="button"
            class="inline-flex items-center px-5 py-2 rounded-lg bg-[#146190] text-sm font-semibold text-white hover:bg-[#0f4e75] transition"
            @click="router.push('/suksesi-syarat')"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
