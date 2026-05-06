import { z } from 'zod'
import { db } from '../../../database/index'
import { master_potensi_talenta } from '../../../database/schema/master_potensi_talenta'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const data = await db.select().from(master_potensi_talenta)
    return { data }
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    const schema = z.object({
      nama: z.string(),
      bobot: z.number(),
    })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid input' }))
    }
    const [inserted] = await db.insert(master_potensi_talenta).values({
      nama: parsed.data.nama,
      bobot: parsed.data.bobot.toString(),
    }).returning()
    return { data: inserted }
  }

  if (event.method === 'PATCH') {
    const body = await readBody(event)
    const schema = z.object({
      id: z.number(),
      nama: z.string(),
      bobot: z.number(),
    })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid input' }))
    }
    const [updated] = await db.update(master_potensi_talenta)
      .set({ nama: parsed.data.nama, bobot: parsed.data.bobot.toString() })
      .where(eq(master_potensi_talenta.id, parsed.data.id))
      .returning()
    return { data: updated }
  }

  if (event.method === 'DELETE') {
    const body = await readBody(event)
    const schema = z.object({ id: z.number() })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid input' }))
    }
    await db.delete(master_potensi_talenta).where(eq(master_potensi_talenta.id, parsed.data.id))
    return { success: true }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
