import { eq } from 'drizzle-orm'
import { db } from '../../database'
import { daftarKotak } from '../../database/schema/daftar-kotak'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const activeOnly = String(query.activeOnly ?? 'true').toLowerCase() !== 'false'

  const rows = await db
    .select({
      id:         daftarKotak.id,
      title:      daftarKotak.title,
      colorClass: daftarKotak.colorClass,
      isActive:   daftarKotak.isActive,
      updatedAt:  daftarKotak.updatedAt,
    })
    .from(daftarKotak)
    .where(activeOnly ? eq(daftarKotak.isActive, true) : undefined)
    .orderBy(daftarKotak.id)

  return { data: rows }
})
