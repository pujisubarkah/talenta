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
          <SubTabsSection :peg-nip="props.id" />
        </div>
      </div>

    </div>

    <!-- RIGHT -->
    <ProfileCard :profile="profile" :peg-nip="props.id" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  id?: string
}>()

const activeTab = ref('Utama')
const tabs = ['Utama', 'Kinerja', 'Potensial']

const profile = ref<{
  pegNip?: string
  pegNama?: string
  jabatan?: string
  satuanKerjaNama?: string
  unitKerjaNama?: string
  golAkhirNm?: string
}>({})
const scoreData = ref({ kinerja: 0, potensial: 0 })

onMounted(async () => {
  if (!props.id) return

  const { data } = await $fetch<{
    data: Array<{
      pegNip: string
      pegNama: string | null
      jabatan: string | null
      satuanKerjaNama: string | null
      unitKerjaNama: string | null
      golAkhirNm: string | null
      nilaiKinerja: string | null
      nilaiPotensi: string | null
    }>
  }>('/api/pegawai', {
    query: {
      search: props.id,
      page: 1,
      limit: 20,
    },
  })

  const pegawai = data.find((item) => item.pegNip === props.id) ?? data[0]
  if (!pegawai) return

  profile.value = {
    pegNip: pegawai.pegNip,
    pegNama: pegawai.pegNama ?? undefined,
    jabatan: pegawai.jabatan ?? undefined,
    satuanKerjaNama: pegawai.satuanKerjaNama ?? undefined,
    unitKerjaNama: pegawai.unitKerjaNama ?? undefined,
    golAkhirNm: pegawai.golAkhirNm ?? undefined,
  }

  scoreData.value = {
    kinerja: parseFloat(pegawai.nilaiKinerja ?? '0') || 0,
    potensial: parseFloat(pegawai.nilaiPotensi ?? '0') || 0,
  }
})
</script>
