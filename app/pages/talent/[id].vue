<template>
  <div class="p-6">
    <button
      class="mb-6 inline-flex items-center gap-2 text-sm font-semibold"
      style="color:#146190"
      @click="$router.back()"
    >
      ← Kembali
    </button>

    <TalentProfile :id="id" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)
</script>
