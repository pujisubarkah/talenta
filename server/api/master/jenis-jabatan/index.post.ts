import { sql } from 'drizzle-orm'
import { db } from '../../../database'
import { jenisJabatan } from '../../../database/schema/jenis-jabatan'

type PostBody = {
  kode?: unknown
  nama?: unknown
  kategori?: unknown
  is_active?: unknown
}

const kategoriOptions = ['struktural', 'fungsional', 'lainnya'] as const

export default defineEventHandler(async (event) => {
  const body = await readBody<PostBody>(event)
  const kode = typeof body?.kode === 'string' ? body.kode.trim().toUpperCase() : ''
  const nama = typeof body?.nama === 'string' ? body.nama.trim() : ''
  const kategori = typeof body?.kategori === 'string' ? body.kategori.trim().toLowerCase() : ''
  const isActive = typeof body?.is_active === 'boolean' ? body.is_active : true

  if (!kode || !nama || !kategori) {
    throw createError({ statusCode: 400, statusMessage: 'kode, nama, dan kategori wajib diisi' })
  }

  if (!kategoriOptions.includes(kategori as (typeof kategoriOptions)[number])) {
    throw createError({ statusCode: 400, statusMessage: 'kategori tidak valid' })
  }

  const maxIdRows = await db
    .select({ maxId: sql<number>`coalesce(max(${jenisJabatan.id}), 0)` })
    .from(jenisJabatan)

  const nextId = Number(maxIdRows[0]?.maxId ?? 0) + 1

  const inserted = await db
    .insert(jenisJabatan)
    .values({
      id: nextId,
      kode,
      nama,
      kategori,
      isActive,
    })
    .returning({
      id: jenisJabatan.id,
      kode: jenisJabatan.kode,
      nama: jenisJabatan.nama,
      kategori: jenisJabatan.kategori,
      is_active: jenisJabatan.isActive,
    })

  return inserted[0]
})
