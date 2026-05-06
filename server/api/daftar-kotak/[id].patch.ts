import { eq } from 'drizzle-orm'
import { db } from '../../database'
import { daftarKotak } from '../../database/schema/daftar-kotak'

type PatchBody = {
  colorClass?: unknown
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' })
  }

  const body = await readBody<PatchBody>(event)
  const colorClass = typeof body?.colorClass === 'string' ? body.colorClass.trim() : ''

  if (!colorClass) {
    throw createError({ statusCode: 400, statusMessage: 'colorClass wajib diisi' })
  }

  const updated = await db
    .update(daftarKotak)
    .set({
      colorClass,
      updatedAt: new Date(),
    })
    .where(eq(daftarKotak.id, id))
    .returning({
      id: daftarKotak.id,
      title: daftarKotak.title,
      colorClass: daftarKotak.colorClass,
      isActive: daftarKotak.isActive,
      updatedAt: daftarKotak.updatedAt,
    })

  if (!updated.length) {
    throw createError({ statusCode: 404, statusMessage: 'Data kotak tidak ditemukan' })
  }

  return { data: updated[0] }
})
