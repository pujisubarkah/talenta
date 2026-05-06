import { db } from '../../../database'
import { jenisJabatan } from '../../../database/schema/jenis-jabatan'

export default defineEventHandler(async () => {
  const rows = await db
    .select({
      id: jenisJabatan.id,
      kode: jenisJabatan.kode,
      nama: jenisJabatan.nama,
      kategori: jenisJabatan.kategori,
      is_active: jenisJabatan.isActive,
    })
    .from(jenisJabatan)
    .orderBy(jenisJabatan.id)

  return rows
})
