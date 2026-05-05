<template>
  <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
    <div class="flex flex-col items-center gap-3 pb-4 border-b border-slate-200">
      <div class="w-20 h-20 rounded-full overflow-hidden shadow-inner bg-[#3781c7]/10 flex items-center justify-center">
        <img
          v-if="photoUrl && !photoError"
          :src="photoUrl"
          :alt="profile?.pegNama"
          class="w-full h-full object-cover"
          @error="photoError = true"
        />
        <span v-else class="text-2xl font-bold text-[#3781c7]">{{ profile?.pegNama?.charAt(0) || 'U' }}</span>
      </div>

      <div class="text-center">
        <div class="font-extrabold text-slate-800 text-lg leading-tight">
          {{ profile?.pegNama || 'Nama Tidak Diketahui' }}
        </div>
        <div class="text-sm mt-1 text-slate-500 font-medium">
          {{ profile?.jabatan || 'Jabatan Tidak Diketahui' }}
        </div>
      </div>
    </div>

    <div class="pt-4 space-y-2">
      <div class="grid grid-cols-[110px_1fr] gap-2 text-xs">
        <span class="text-slate-500 font-semibold">NIP</span>
        <span class="text-slate-700 font-medium">{{ profile?.pegNip || '-' }}</span>
      </div>
      <div class="grid grid-cols-[110px_1fr] gap-2 text-xs">
        <span class="text-slate-500 font-semibold">Jabatan</span>
        <span class="text-slate-700 font-medium">{{ profile?.jabatan || '-' }}</span>
      </div>
      <div class="grid grid-cols-[110px_1fr] gap-2 text-xs">
        <span class="text-slate-500 font-semibold">Satker</span>
        <span class="text-slate-700 font-medium">{{ profile?.satuanKerjaNama || '-' }}</span>
      </div>
      <div class="grid grid-cols-[110px_1fr] gap-2 text-xs">
        <span class="text-slate-500 font-semibold">Unit Kerja</span>
        <span class="text-slate-700 font-medium">{{ profile?.unitKerjaNama || '-' }}</span>
      </div>
      <div class="grid grid-cols-[110px_1fr] gap-2 text-xs">
        <span class="text-slate-500 font-semibold">Golongan</span>
        <span class="text-slate-700 font-medium">{{ profile?.golAkhirNm || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  profile: {
    pegNip?: string
    pegNama?: string
    jabatan?: string
    satuanKerjaNama?: string
    unitKerjaNama?: string
    golAkhirNm?: string
  }
  pegNip?: string
}>()

const photoUrl = computed(() =>
  props.pegNip
    ? `https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${props.pegNip}.jpg`
    : null
)

const photoError = ref(false)

watch(() => props.pegNip, () => {
  photoError.value = false
})
</script>
