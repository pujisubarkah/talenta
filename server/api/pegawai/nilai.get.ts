import { and, count, eq, ilike, or } from 'drizzle-orm'
import { db } from '../../database'
import { pegawai } from '../../database/schema/pegawai'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page    = Math.max(1, Number(query.page)  || 1)
  const limit   = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const offset  = (page - 1) * limit
  const search  = String(query.search || '').trim()
  const nineBox = query.nineBox ? Number(query.nineBox) : undefined

  const columns = {
    pegNip:       pegawai.pegNip,
    pegNama:      pegawai.pegNama,
    jabatan:      pegawai.jabatan,
    nilaiKinerja: pegawai.nilaiKinerja,
    nilaiPotensi: pegawai.nilaiPotensi,
    nineBox:      pegawai.nineBox,
  }

  const searchClause = search
    ? or(
        ilike(pegawai.pegNip,   `%${search}%`),
        ilike(pegawai.pegNama,  `%${search}%`),
        ilike(pegawai.jabatan,  `%${search}%`),
      )
    : undefined

  const nineBoxClause = nineBox ? eq(pegawai.nineBox, String(nineBox)) : undefined

  const whereClause = searchClause && nineBoxClause
    ? and(searchClause, nineBoxClause)
    : searchClause ?? nineBoxClause

  const [rows, totalRows, groupedRows] = await Promise.all([
    db.select(columns).from(pegawai).where(whereClause).limit(limit).offset(offset),
    db.select({ total: count() }).from(pegawai).where(whereClause),
    db
      .select({ nineBox: pegawai.nineBox, total: count() })
      .from(pegawai)
      .where(whereClause)
      .groupBy(pegawai.nineBox),
  ])

  const total = Number(totalRows[0]?.total ?? 0)
  const nineBoxTotals: Record<string, number> = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
  }

  for (const row of groupedRows) {
    const key = String(row.nineBox ?? '')
    if (key in nineBoxTotals) {
      nineBoxTotals[key] = Number(row.total ?? 0)
    }
  }

  return {
    data: rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      nineBoxTotals,
    },
  }
})
