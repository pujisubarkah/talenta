import { db } from '../../../database/index'
import { kategoriPenilaian } from '../../../database/schema/kategori-penilaian'
import { penilaian } from '../../../database/schema/penilaian'
import { eq } from 'drizzle-orm'

// GET: List all penilaian spesifik (kategori: Penilaian Spesifik)
export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
  }

  // Cari kategori "Penilaian Generik"
  const kategori = await db.query.kategoriPenilaian.findFirst({
    where: (k) => eq(k.nama_kategori, 'Penilaian Generik')
  })
  if (!kategori) {
    return { data: [], kategori: null }
  }

  // Ambil semua penilaian dengan kategori_id tsb
  const data = await db.query.penilaian.findMany({
    where: (p) => eq(p.kategori_id, kategori.id)
  })

    return { kategori, data }
  })
