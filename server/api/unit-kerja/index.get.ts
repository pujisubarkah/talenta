import { ilike, or } from 'drizzle-orm'
import { db } from '../../database'
import { unit } from '../../database/schema/unit'

export default defineEventHandler(async (event) => {
  const query  = getQuery(event)
  const search = String(query.search || '').trim()

  const searchClause = search
    ? or(
        ilike(unit.name,  `%${search}%`),
        ilike(unit.kode,  `%${search}%`),
        ilike(unit.alias, `%${search}%`),
      )
    : undefined

  const rows = await db
    .select({
      id:       unit.id,
      name:     unit.name,
      satkerId: unit.satkerId,
      kode:     unit.kode,
      alias:    unit.alias,
    })
    .from(unit)
    .where(searchClause)
    .orderBy(unit.name)

  return { data: rows }
})
