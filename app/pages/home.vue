<script setup lang="ts">
import { ref } from 'vue'

const tabs = [
  { id: 0, label: 'Kotak Talenta' },
  { id: 1, label: 'Kotak 1' },
  { id: 2, label: 'Kotak 2' },
  { id: 3, label: 'Kotak 3' },
  { id: 4, label: 'Kotak 4' },
  { id: 5, label: 'Kotak 5' },
  { id: 6, label: 'Kotak 6' },
  { id: 7, label: 'Kotak 7' },
  { id: 8, label: 'Kotak 8' },
  { id: 9, label: 'Kotak 9' },
]

const activeTab = ref(0)

const getTabLabel = (id: number) => {
  const tab = tabs.find((t) => t.id === id)
  return tab?.label ?? 'tidak dikenal'
}
</script>

<template>
  <div class="p-6 space-y-6">

    <!-- Page Header -->
    <div>
      <h1 class="text-xl font-bold text-slate-800">Dashboard</h1>
      <p class="text-sm text-slate-500 mt-0.5">Ringkasan data talent assessment LAN RI</p>
    </div>

    <div class="mt-4">
      <!-- Folder Tabs -->
      <div class="flex items-end gap-1 px-2 sm:px-4 relative z-10 overflow-x-auto" style="scrollbar-width: none; -ms-overflow-style: none;">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="relative px-5 py-2.5 text-sm font-bold transition-all rounded-t-xl border border-b-0 whitespace-nowrap"
          :class="activeTab === tab.id
            ? 'bg-white border-slate-200 text-[#3781c7] pt-3.5 pb-3 -mb-px shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.05)] z-20' 
            : 'bg-slate-100 border-slate-200/80 text-slate-500 hover:bg-slate-200 hover:text-slate-700 mb-0 z-0'"
          @click="activeTab = tab.id"
        >
          <!-- Aksen warna biru di atas tab yang aktif -->
          <div v-if="activeTab === tab.id" class="absolute top-0 left-0 right-0 h-1.5 bg-[#3781c7] rounded-t-xl"></div>
          
          <span class="relative z-10">{{ tab.label }}</span>
          
          <!-- Penutup border bawah agar menyatu dengan body folder -->
          <div v-if="activeTab === tab.id" class="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-white"></div>
        </button>
      </div>

      <!-- Folder Body / Tab Content -->
      <div class="bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-md relative z-10 min-h-[400px]">
        <div v-if="activeTab === 0" class="p-6">
          <TalentMatrix />
        </div>
        <div v-else class="min-h-[400px]">
          <TalentListTable :tab-id="activeTab" :tab-label="getTabLabel(activeTab)" />
        </div>
      </div>
    </div>

  </div>
</template>
