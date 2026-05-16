<script setup lang="ts">
definePageMeta({ layout: false })

import { ref } from 'vue'
import { IconUser, IconLock, IconEye, IconEyeOff, IconAlertCircle } from '@tabler/icons-vue'

const pegNip = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isSubmitting = ref(false)
const authUser = useCookie<string | null>('auth_user')

const handleLogin = async () => {
  if (isSubmitting.value) return

  if (!pegNip.value || !password.value) {
    errorMessage.value = 'NIP dan password harus diisi'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await $fetch<{
      success: boolean
      message: string
      data: {
        id: string
        pegNip: string | null
        pegNama: string | null
        jabatanNama: string | null
        roleId: number | null
      }
    }>('/api/login', {
      method: 'POST',
      body: {
        pegNip: pegNip.value,
        password: password.value,
      },
    })

    authUser.value = JSON.stringify(result.data)
    await navigateTo('/home')
  } catch (err) {
    const statusMessage = (err as { statusMessage?: string })?.statusMessage
    errorMessage.value = statusMessage || 'NIP atau password salah'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex h-screen m-0 p-0 bg-slate-100">
    <!-- Left Panel -->
    <div class="w-105 shrink-0 flex flex-col justify-center items-center bg-white shadow-2xl z-10 px-10 py-12">

      <!-- Logo & Brand -->
      <div class="flex flex-col items-center mb-8">
        <div class="mb-1">
          <img src="/lanri.png" alt="Logo LANRI" class="w-32 h-32 object-contain" />
        </div>
        <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">STAS</h1>
        <p class="text-sm text-slate-500 text-center mt-1 leading-snug">
          Smart Talent Assessment System<br />
          <span class="text-[#3781c7] font-medium">Lembaga Administrasi Negara</span>
        </p>
      </div>

      <!-- Divider -->
      <div class="w-full border-t border-slate-100 mb-8" />

      <!-- Form -->
      <div class="w-full">
        <h2 class="text-lg font-bold text-slate-700 mb-1">Selamat datang 👋</h2>
        <p class="text-sm text-slate-400 mb-6">Masuk ke akun Anda untuk melanjutkan</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Error -->
          <div
            v-if="errorMessage"
            class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3"
          >
            <IconAlertCircle class="w-4 h-4 shrink-0" />
            {{ errorMessage }}
          </div>

          <!-- NIP -->
          <div>
            <label for="pegNip" class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              NIP
            </label>
            <div class="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-[#3781c7]/30 focus-within:border-[#3781c7] transition">
              <span class="flex items-center justify-center w-11 shrink-0 bg-slate-100 border-r border-slate-200">
                <IconUser class="w-4 h-4 text-[#3781c7]" />
              </span>
              <input
                id="pegNip"
                v-model="pegNip"
                type="text"
                placeholder="Masukkan NIP"
                required
                class="flex-1 px-3 py-2.5 bg-transparent text-slate-700 text-sm placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div class="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-[#3781c7]/30 focus-within:border-[#3781c7] transition">
              <span class="flex items-center justify-center w-11 shrink-0 bg-slate-100 border-r border-slate-200">
                <IconLock class="w-4 h-4 text-[#3781c7]" />
              </span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                required
                class="flex-1 px-3 py-2.5 bg-transparent text-slate-700 text-sm placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                class="flex items-center justify-center w-11 shrink-0 text-slate-400 hover:text-[#3781c7] transition"
                @click="showPassword = !showPassword"
              >
                <IconEyeOff v-if="showPassword" class="w-4 h-4" />
                <IconEye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between pt-1">
            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded accent-[#3781c7]"
              />
              <span class="text-sm text-slate-600">Ingat saya</span>
            </label>
            <a href="#" class="text-sm text-[#3781c7] hover:underline font-medium">Lupa password?</a>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3 rounded-xl bg-linear-to-r from-[#3781c7] to-[#1a4f8a] hover:from-[#2d6ca1] hover:to-[#163f6e] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all mt-2"
          >
            {{ isSubmitting ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
      </div>

      <p class="text-xs text-slate-400 mt-10 text-center">
        © {{ new Date().getFullYear() }} LAN RI · STAS v1.0
      </p>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 relative m-0 p-0">
      <img
        src="/lan-ilustrasi.jpeg"
        alt="Illustration of Lembaga Administrasi Negara"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-linear-to-r from-white/10 to-transparent pointer-events-none" />
    </div>
  </div>
</template>
