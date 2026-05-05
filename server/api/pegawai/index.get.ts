import { count, ilike, or } from 'drizzle-orm'
import { db } from '../../database'
import { pegawai } from '../../database/schema/pegawai'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page  = Math.max(1, Number(query.page)  || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const offset = (page - 1) * limit
  const search = String(query.search || '').trim()

  const columns = {
    pegNip:          pegawai.pegNip,
    pegNama:         pegawai.pegNama,
    jabatan:         pegawai.jabatan,
    satuanKerjaNama: pegawai.satuanKerjaNama,
    unitKerjaNama:   pegawai.unitKerjaNama,
    eselonNm:        pegawai.eselonNm,
    golAkhirNm:      pegawai.golAkhirNm,
    golIdAkhir:      pegawai.golIdAkhir,
    eselonId:        pegawai.eselonId,
    jabatanId:       pegawai.jabatanId,
    satuanKerjaId:   pegawai.satuanKerjaId,
    unitKerjaId:     pegawai.unitKerjaId,
    photoUrl:        pegawai.photoUrl,
    jfuId:           pegawai.jfuId,
    jfId:            pegawai.jfId,
  }

  const whereClause = search
    ? or(
        ilike(pegawai.pegNip,          `%${search}%`),
        ilike(pegawai.pegNama,         `%${search}%`),
        ilike(pegawai.jabatan,         `%${search}%`),
        ilike(pegawai.satuanKerjaNama, `%${search}%`),
        ilike(pegawai.unitKerjaNama,   `%${search}%`),
      )
    : undefined

  const [rows, [{ total }]] = await Promise.all([
    db.select(columns).from(pegawai).where(whereClause).limit(limit).offset(offset),
    db.select({ total: count() }).from(pegawai).where(whereClause),
  ])

  return {
    data: rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
})
