<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import { IconLogout, IconChevronDown, IconBell, IconMenu2 } from '@tabler/icons-vue'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const handleBurger = () => {
  emit('toggle-sidebar')
}

const router = useRouter()
const user = ref<{ name?: string; role_id?: number } | null>(null)

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('session_id')

  const authUser = useCookie('auth_user')
  authUser.value = null

  router.push('/')
}

onMounted(() => {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem('user')
  if (!stored) return

  try {
    user.value = JSON.parse(stored) as { name?: string; role_id?: number }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e)
  }
})
</script>

<template>
  <header
    class="h-16 bg-blue-900 border-b border-blue-700 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0"
  >
    <!-- Left side: Burger Button -->
    <div class="flex items-center gap-4 flex-1">
      <button
        @click="handleBurger"
        class="p-2 rounded-lg hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label="Toggle sidebar"
      >
        <IconMenu2 class="w-6 h-6 text-white" />
      </button>
    </div>

    <!-- Right side: Notifications, User Profile, Logout -->
    <div class="flex items-center gap-4 shrink-0 text-white">
      <button
        class="relative p-2 text-white hover:bg-blue-700 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <IconBell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      <div class="h-6 w-px bg-blue-400"></div>

      <div
        v-if="user"
        class="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-blue-700 rounded-lg transition-colors"
      >
        <div
          class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shadow-sm"
        >
          {{ (user.name ?? 'U').charAt(0).toUpperCase() }}
        </div>

        <div class="hidden md:flex flex-col">
          <span class="text-sm text-white font-bold leading-tight">{{ user.name ?? 'User' }}</span>
          <span class="text-[10px] text-blue-200 font-medium uppercase tracking-wider">
            {{ user.role_id === 1 ? 'Administrator' : 'User' }}
          </span>
        </div>

        <IconChevronDown class="w-4 h-4 text-white/70" />
      </div>

      <button
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-200 hover:bg-red-500/30 transition-all ml-2"
        @click="handleLogout"
      >
        <IconLogout class="w-4 h-4" />
        <span class="hidden sm:inline">Logout</span>
      </button>
    </div>
  </header>
</template>
