<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  IconLayoutDashboard,
  IconBook2,
  IconUsers,
  IconTrendingUp,
} from '@tabler/icons-vue'

const route = useRoute()

const menus = [
  {
    label: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/home',
  },
  {
    label: 'Referensi',
    icon: IconBook2,
    href: '/referensi',
  },
  {
    label: 'Talent Pool',
    icon: IconUsers,
    href: '/talent-pool',
  },
  {
    label: 'Suksesi',
    icon: IconTrendingUp,
    href: '/suksesi',
  },
]

const isActive = (href: string) => {
  if (href === '/home' && route.path === '/home') return true;
  if (href !== '/home' && route.path.startsWith(href)) return true;
  return false;
}
</script>

<template>
  <aside class="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 shadow-sm z-20">
    <!-- Brand -->
    <div class="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
      <div class="w-8 h-8 rounded-lg bg-linear-to-br from-[#3781c7] to-[#1a4f8a] flex items-center justify-center shadow mr-3">
        <img src="/lanri.png" alt="STAS" class="w-5 h-5 object-contain" />
      </div>
      <span class="font-extrabold text-slate-800 tracking-tight text-lg">STAS</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
      <NuxtLink
        v-for="menu in menus"
        :key="menu.href"
        :to="menu.href"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group"
        :class="isActive(menu.href)
          ? 'bg-[#3781c7] text-white shadow-md shadow-[#3781c7]/20'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
      >
        <component 
          :is="menu.icon" 
          class="w-5 h-5 transition-colors" 
          :class="isActive(menu.href) ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'" 
        />
        {{ menu.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>
