<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import {
  IconLogout,
  IconChevronDown,
  IconBell,
  IconSearch,
} from '@tabler/icons-vue'

const router = useRouter()
const user = ref<{ name?: string, role_id?: number } | null>(null)

const handleLogout = () => {
  console.log('Logout diklik')
  localStorage.removeItem('user')
  localStorage.removeItem('session_id')
  const authUser = useCookie('auth_user')
  authUser.value = null
  router.push('/')
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse user from localStorage', e)
      }
    }
  }
})
</script>

<template>
  <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
    <!-- Left side: Search or Breadcrumbs -->
    <div class="flex items-center gap-4 flex-1">
       <!-- Search Box -->
       <div class="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-slate-400 focus-within:border-[#3781c7] focus-within:ring-1 focus-within:ring-[#3781c7] transition-all">
          <IconSearch class="w-4 h-4" />
          <input type="text" placeholder="Cari data..." class="bg-transparent border-none outline-none text-sm w-48 text-slate-700 placeholder:text-slate-400" />
       </div>
    </div>

    <!-- Right side: Notifications, User Profile, Logout -->
    <div class="flex items-center gap-4 shrink-0">
      <button class="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
        <IconBell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      <div class="h-6 w-px bg-slate-200"></div>

      <div v-if="user" class="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors">
        <div class="w-8 h-8 rounded-full bg-linear-to-br from-[#3781c7] to-[#1a4f8a] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {{ (user.name ?? 'U').charAt(0).toUpperCase() }}
        </div>
        <div class="hidden md:flex flex-col">
          <span class="text-sm text-slate-800 font-bold leading-tight">{{ user.name ?? 'User' }}</span>
          <span class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            {{ user.role_id === 1 ? 'Administrator' : 'User' }}
          </span>
        </div>
        <IconChevronDown class="w-4 h-4 text-slate-400" />
      </div>

      <button
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-all ml-2"
        @click="handleLogout"
      >
        <IconLogout class="w-4 h-4" />
        <span class="hidden sm:inline">Logout</span>
      </button>
    </div>
  </header>
</template>
