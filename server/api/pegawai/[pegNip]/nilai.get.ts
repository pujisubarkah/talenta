import { eq } from 'drizzle-orm'
import { db } from '../../../database'
import { pegawai } from '../../../database/schema/pegawai'

export default defineEventHandler(async (event) => {
  const pegNip = getRouterParam(event, 'pegNip')

  if (!pegNip) {
    throw createError({ statusCode: 400, statusMessage: 'pegNip wajib diisi' })
  }

  const columns = {
    pegNip:       pegawai.pegNip,
    pegNama:      pegawai.pegNama,
    jabatan:      pegawai.jabatan,
    nilaiKinerja: pegawai.nilaiKinerja,
    nilaiPotensi: pegawai.nilaiPotensi,
    nineBox:      pegawai.nineBox,
  }

  const [row] = await db
    .select(columns)
    .from(pegawai)
    .where(eq(pegawai.pegNip, pegNip))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Pegawai tidak ditemukan' })
  }

  return { data: row }
})
