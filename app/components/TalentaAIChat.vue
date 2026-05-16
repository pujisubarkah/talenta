<template>
  <div class="w-full max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-xl shadow p-4 flex flex-col min-h-[400px]">
    <div class="flex-1 overflow-y-auto mb-4" ref="chatContainer">
      <div v-for="(msg, idx) in messages" :key="idx" class="mb-2">
        <template v-if="msg.role === 'pegawai-photo'">
          <div class="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2 max-w-xs">
            <img :src="msg.photoUrl" :alt="msg.text" class="w-12 h-12 rounded-lg object-cover border" />
            <span class="font-semibold text-slate-700">{{ msg.text }}</span>
          </div>
        </template>
        <template v-else>
          <div :class="msg.role === 'user' ? 'text-right' : 'text-left'">
            <span :class="msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'" class="inline-block px-3 py-2 rounded-lg max-w-[80%]">
              {{ msg.text }}
            </span>
          </div>
        </template>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input v-model="input" type="text" placeholder="Tulis pesan..." class="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
      <button type="submit" class="px-4 py-2 bg-[#3781c7] text-white rounded-lg font-semibold hover:bg-[#24609a] transition">Kirim</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface ChatMessage {
  role: string
  text: string
  photoUrl?: string
}

const input = ref('')
const messages = ref<ChatMessage[]>([
  { role: 'assistant', text: 'Halo! Ada yang bisa Talenta AI bantu?' }
])
const chatContainer = ref<HTMLElement | null>(null)


async function sendMessage() {
  if (!input.value.trim()) return
  const userMsg = input.value
  messages.value.push({ role: 'user', text: userMsg })
  input.value = ''
  scrollToBottom()

  // Tampilkan loading sementara
  messages.value.push({ role: 'assistant', text: '...' })
  scrollToBottom()

  try {
    const res = await fetch('/api/ollama-rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    })
    const data = await res.json()
    // Hapus pesan loading
    messages.value.pop()
    if (data.reply) {
      messages.value.push({ role: 'assistant', text: data.reply })
      // Jika ada data pegawai, tampilkan foto-fotonya di bawah balasan AI
      if (Array.isArray(data.pegawai) && data.pegawai.length > 0) {
        data.pegawai.forEach((p: any) => {
          if (p.photoUrl) {
            messages.value.push({ role: 'pegawai-photo', text: p.pegNama, photoUrl: p.photoUrl })
          }
        })
      }
    } else {
      messages.value.push({ role: 'assistant', text: 'Maaf, tidak ada respons dari AI.' })
    }
  } catch (e) {
    messages.value.pop()
    messages.value.push({ role: 'assistant', text: 'Gagal terhubung ke AI.' })
  }
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}
</script>
