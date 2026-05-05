<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const id = String(route.params.id || '')
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Input Syarat Jabatan</h1>
        <p class="text-sm text-slate-500">ID Jabatan: {{ id }}</p>
      </div>
      <NuxtLink
        to="/suksesi/daftar-lowongan-jabatan-target"
        class="inline-flex items-center gap-1 text-sm font-semibold text-[#146190] hover:underline"
      >
        ← Kembali
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-[#146190] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4d73]"
        @click="router.push('/suksesi-syarat/add')"
      >
        + Input Syarat
      </button>
    </div>
  </div>
</template>
