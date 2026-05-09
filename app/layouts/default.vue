<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
    <AppSidebar :mini="sidebarMini" />
    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader @toggle-sidebar="sidebarMini = !sidebarMini" />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sidebarMini = ref(false)
</script>
