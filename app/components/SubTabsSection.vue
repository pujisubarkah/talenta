<template>
  <div>
    <!-- Folder Tabs -->
    <div class="flex flex-wrap gap-x-1 gap-y-0 items-end">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="relative px-4 py-2 text-xs font-semibold transition-all duration-150 rounded-t-lg border border-b-0 whitespace-nowrap"
        :class="activeTab === tab
          ? 'bg-[#146190] text-white border-[#146190] z-10 -mb-px pb-2.25'
          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Content Panel -->
    <div class="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl p-4">
      <SubTabSpesifik v-if="activeTab === 'Spesifik'" />
      <SubTabGenerik v-else-if="activeTab === 'Generik (Partisipasi dalam organisasi)'" />
      <SubTabPotensiTalenta v-else-if="activeTab === 'Potensi Talenta'" />
      <SubTabRekamJejak v-else-if="activeTab === 'Rekam Jejak Jabatan'" />
      <SubTabPertimbangan v-else-if="activeTab === 'Pertimbangan Lainnya'" />
      <SubTabKompetensi v-else-if="activeTab === 'Kompetensi Talenta'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = ['Spesifik', 'Generik (Partisipasi dalam organisasi)', 'Potensi Talenta', 'Rekam Jejak Jabatan', 'Pertimbangan Lainnya', 'Kompetensi Talenta']
const activeTab = ref(tabs[0])
</script>
