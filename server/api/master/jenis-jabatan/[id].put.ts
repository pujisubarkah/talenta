import { eq } from 'drizzle-orm'
import { db } from '../../../database'
import { jenisJabatan } from '../../../database/schema/jenis-jabatan'

type PutBody = {
  kode?: unknown
  nama?: unknown
  kategori?: unknown
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' })
  }

  const body = await readBody<PutBody>(event)
  const kode = typeof body?.kode === 'string' ? body.kode.trim().toUpperCase() : ''
  const nama = typeof body?.nama === 'string' ? body.nama.trim() : ''
  const kategori = typeof body?.kategori === 'string' ? body.kategori.trim().toLowerCase() : ''

  if (!kode || !nama || !kategori) {
    throw createError({ statusCode: 400, statusMessage: 'kode, nama, dan kategori wajib diisi' })
  }

  const updated = await db
    .update(jenisJabatan)
    .set({ kode, nama, kategori })
    .where(eq(jenisJabatan.id, id))
    .returning({
      id: jenisJabatan.id,
      kode: jenisJabatan.kode,
      nama: jenisJabatan.nama,
      kategori: jenisJabatan.kategori,
      is_active: jenisJabatan.isActive,
    })

  if (!updated.length) {
    throw createError({ statusCode: 404, statusMessage: 'Data jenis jabatan tidak ditemukan' })
  }

  return updated[0]
})
