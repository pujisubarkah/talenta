import { eq } from 'drizzle-orm'
import { db } from '../../../database'
import { jenisJabatan } from '../../../database/schema/jenis-jabatan'

type PatchBody = {
  is_active?: unknown
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' })
  }

  const body = await readBody<PatchBody>(event)
  if (typeof body?.is_active !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'is_active wajib boolean' })
  }

  const updated = await db
    .update(jenisJabatan)
    .set({ isActive: body.is_active })
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
