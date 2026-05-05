<template>
  <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
    <!-- Optional: User Initial Avatar -->
    <div class="w-16 h-16 bg-[#3781c7]/10 text-[#3781c7] rounded-full flex items-center justify-center mb-3 shadow-inner">
      <span class="text-xl font-bold">{{ profile?.nama?.charAt(0) || 'U' }}</span>
    </div>

    <div class="font-extrabold text-slate-800 text-center text-lg leading-tight">
      {{ profile?.nama || 'Nama Tidak Diketahui' }}
    </div>

    <div class="text-sm mt-1.5 text-slate-500 text-center font-medium">
      {{ profile?.jabatan || 'Jabatan Tidak Diketahui' }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  profile: {
    nama?: string
    jabatan?: string
  }
}>()
</script>
