import { db, pegawai } from '../../server/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message, model = 'qwen2.5:0.5b' } = body || {}

  if (!message) {
    return { error: 'No message provided' }
  }

  // Contoh: Query data pegawai (bisa disesuaikan dengan kebutuhan)
  // Misal: jika pertanyaan mengandung kata 'pegawai', ambil 3 data pegawai
  let dbInfo = ''
  let pegawaiData: any[] = []
  if (/pegawai/i.test(message)) {
    const result = await db.select().from(pegawai).limit(3)
    pegawaiData = result.map(p => ({
      pegNip: p.pegNip,
      pegNama: p.pegNama,
      photoUrl: p.photoUrl
    }))
    dbInfo = '\nData pegawai contoh:\n' + result.map(p => `- ${p.pegNama} (${p.pegNip})`).join('\n')
  }

  // Gabungkan data ke prompt
  const prompt = `${message}\n${dbInfo}\nJawablah pertanyaan user berdasarkan data di atas jika relevan.`

  // Kirim ke Ollama
  console.log('[Ollama RAG] Mengirim ke Ollama:', { model, prompt })
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
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


  // Ollama streaming: respons bisa multiline JSON, gabungkan dulu
  let data
  try {
    const text = await response.text()
    // Ambil baris terakhir yang valid JSON
    const lines = text.trim().split(/\r?\n/)
    const lastLine = lines.reverse().find(line => line.trim().startsWith('{'))
    data = lastLine ? JSON.parse(lastLine) : {}
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
