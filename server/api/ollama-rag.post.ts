import { db, pegawai } from '../../server/database'
import { ilike, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message, model = 'qwen2.5:0.5b' } = body || {}

  if (!message) {
    return { error: 'No message provided' }
  }

  let dbInfo = ''
  
  // Ambil kata kunci dari pesan user (hanya kata > 3 huruf agar tidak terlalu banyak false positive)
  const words = message.replace(/[^\w\s]/g, '').split(/\s+/).filter((w: string) => w.length > 3)

  if (words.length > 0) {
    const conditions = words.map((w: string) => 
      or(
        ilike(pegawai.pegNama, `%${w}%`),
        ilike(pegawai.pegNip, `%${w}%`)
      )
    )
    
    // Cari ke database
    const result = await db.select().from(pegawai).where(or(...conditions)).limit(5)
    
    if (result.length > 0) {
      dbInfo = '\nDATA DATABASE PEGAWAI:\n' + result.map((p: any) => `- Nama: ${p.pegNama}, NIP: ${p.pegNip}, Jabatan: ${p.jabatan || 'Tidak diketahui'}, Unit Kerja: ${p.unitKerjaNama || 'Tidak diketahui'}`).join('\n')
    } else {
      dbInfo = '\nDATA DATABASE PEGAWAI:\nData tidak ditemukan di database untuk kata kunci tersebut.'
    }
  }

  // Gabungkan data ke prompt dengan instruksi ketat
  const prompt = `Anda adalah asisten AI bernama Talenta AI.
Tugas Anda adalah menjawab pertanyaan pengguna HANYA berdasarkan DATA DATABASE PEGAWAI di bawah ini.
Jika informasi yang ditanyakan tidak ada dalam DATA DATABASE PEGAWAI, Anda WAJIB menjawab "Maaf, saya tidak menemukan informasi tersebut di dalam database."
JANGAN pernah mengarang, berhalusinasi, atau menambahkan informasi di luar data yang diberikan. Jawablah dengan singkat, padat, dan jelas.

${dbInfo}

Pertanyaan Pengguna: ${message}
Jawaban Anda:`

  // Kirim ke Ollama
  console.log('[Ollama RAG] Mengirim ke Ollama:', { model, prompt })
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  })
  console.log('[Ollama RAG] Status respons:', response.status)

  if (!response.ok) {
    console.error('[Ollama RAG] Gagal konek ke Ollama:', response.status, await response.text())
    return { error: 'Failed to connect to Ollama' }
  }

  let data
  try {
    data = await response.json()
  } catch (e) {
    console.error('Gagal parse JSON dari Ollama:', e)
    return { reply: 'Gagal membaca respons dari AI.', pegawai: pegawaiData }
  }

  // Log respons mentah dari Ollama untuk debug
  if (!data || !data.message || !data.message.content) {
    console.error('Respons Ollama tidak sesuai:', JSON.stringify(data))
  }

  // Fallback jika tidak ada balasan
  return {
    reply: data?.message?.content || data?.response || 'AI tidak memberikan respons.',
    pegawai: pegawaiData
  }
})
