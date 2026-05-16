<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IconBook2,
  IconUsers,
  IconTrendingUp,
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()

const menus = [
  {
    label: 'REFERENSI',
    icon: IconBook2,
    href: '/referensi',
  },
  {
    label: 'TALENT POOL',
    icon: IconUsers,
    href: '/talent-pool',
  },
  {
    label: 'SUKSESI',
    icon: IconTrendingUp,
    href: '/suksesi',
  },
]

const isActive = (href: string) => route.path.startsWith(href)

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('session_id')
  router.push('/')
}

const user = ref<{ name?: string } | null>(null)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('user')
  if (stored) user.value = JSON.parse(stored)
}
</script>

<template>
  <nav class="w-full h-14 bg-white border-b border-slate-200 shadow-sm flex items-center px-6 gap-6 z-50">
    <!-- Brand -->
    <div class="flex items-center gap-2 shrink-0 mr-4">
      <div class="w-7 h-7 flex items-center justify-center">
        <img src="/lanri.png" alt="STAS" class="w-7 h-7 object-contain" />
      </div>
      <span class="font-extrabold text-slate-800 tracking-tight text-base">STAS</span>
    </div>

    <!-- Divider -->
    <div class="h-6 w-px bg-slate-200 shrink-0" />

    <!-- Menu Items -->
    <div class="flex items-center gap-1 flex-1">
      <RouterLink
        v-for="menu in menus"
        :key="menu.href"
        :to="menu.href"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
        :class="isActive(menu.href)
          ? 'bg-[#3781c7]/10 text-[#3781c7]'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'"
      >
        <component :is="menu.icon" class="w-4 h-4" />
        {{ menu.label }}
      </RouterLink>
    </div>

    <!-- Right: User + Logout -->
    <div class="flex items-center gap-3 shrink-0">
      <div v-if="user" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
        <div class="w-6 h-6 rounded-full bg-linear-to-br from-[#3781c7] to-[#1a4f8a] flex items-center justify-center text-white text-xs font-bold">
          {{ (user.name ?? 'U').charAt(0).toUpperCase() }}
        </div>
        <span class="text-sm text-slate-700 font-medium">{{ user.name ?? 'User' }}</span>
        <IconChevronDown class="w-3.5 h-3.5 text-slate-400" />
      </div>

      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
        @click="handleLogout"
      >
        <IconLogout class="w-4 h-4" />
        Logout
      </button>
    </div>
  </nav>
</template>
