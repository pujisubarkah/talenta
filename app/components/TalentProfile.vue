<template>
  <div class="grid grid-cols-3 gap-6">

    <!-- LEFT -->
    <div class="col-span-2 space-y-4">

      <div>
        <TabsSection
          :tabs="tabs"
          v-model="activeTab"
        />
        <div class="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl p-4 space-y-4">
          <ScoreSection :data="scoreData" />
          <SubTabsSection />
        </div>
      </div>

    </div>

    <!-- RIGHT -->
    <ProfileCard :profile="profile" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  id?: string
}>()

const activeTab = ref('Utama')
const tabs = ['Utama', 'Kinerja', 'Potensial']

const profile = ref<{ nama?: string; jabatan?: string }>({})
const scoreData = ref({ kinerja: 0, potensial: 0 })

onMounted(async () => {
  // fetch dari supabase berdasarkan props.id
})
</script>
