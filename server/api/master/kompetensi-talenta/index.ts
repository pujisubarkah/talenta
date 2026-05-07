import { eq } from 'drizzle-orm'
import { db } from '../../../database'
import { masterKompetensiItems } from '../../database/schema/master_kompetensi_items'

type KompetensiBody = {
  key?: string
  label?: string
  bobot?: string | number
  id?: number
}

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const data = await db.select().from(masterKompetensiItems)
    return { data }
  }

  if (method === 'POST') {
    const body = (await readBody<KompetensiBody>(event)) ?? {}

    const key = typeof body.key === 'string' ? body.key : ''
    const label = typeof body.label === 'string' ? body.label : ''
    const bobot =
      typeof body.bobot === 'number' ? body.bobot.toString() : typeof body.bobot === 'string' ? body.bobot : ''

    if (!key || !label || !bobot) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'key, label, bobot wajib diisi' }))
    }

    const [inserted] = await db
      .insert(masterKompetensiItems)
      .values({
        key,
        label,
        bobot,
      })
      .returning()

    return { data: inserted }
  }

  if (method === 'PUT' || method === 'PATCH') {
    const body = (await readBody<KompetensiBody>(event)) ?? {}
    const id = typeof body.id === 'number' ? body.id : NaN

    if (!Number.isFinite(id)) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'id wajib diisi' }))
    }

    const key = typeof body.key === 'string' ? body.key : ''
    const label = typeof body.label === 'string' ? body.label : ''
    const bobot =
      typeof body.bobot === 'number' ? body.bobot.toString() : typeof body.bobot === 'string' ? body.bobot : ''

    if (!key || !label || !bobot) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'key, label, bobot wajib diisi' }))
    }

    const [updated] = await db
      .update(masterKompetensiItems)
      .set({
        key,
        label,
        bobot,
        updated_at: new Date(),
      })
      .where(eq(masterKompetensiItems.id, id))
      .returning()

    return { data: updated }
  }

  if (method === 'DELETE') {
    const body = (await readBody<KompetensiBody>(event)) ?? {}
    const id = typeof body.id === 'number' ? body.id : NaN

    if (!Number.isFinite(id)) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'id wajib diisi' }))
    }

    await db.delete(masterKompetensiItems).where(eq(masterKompetensiItems.id, id))
    return { success: true }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
