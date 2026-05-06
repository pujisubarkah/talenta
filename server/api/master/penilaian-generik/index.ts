import { z } from 'zod'
import { db } from '../../../database/index'
import { master_penilaian_generik } from '../../../database/schema/master_penilaian_generik'
import { eq } from 'drizzle-orm'

// GET: List all penilaian generik
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const data = await db.select().from(master_penilaian_generik)
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
    const [inserted] = await db.insert(master_penilaian_generik).values({
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
    const [updated] = await db.update(master_penilaian_generik)
      .set({ nama: parsed.data.nama, bobot: parsed.data.bobot.toString() })
      .where(eq(master_penilaian_generik.id, parsed.data.id))
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
    await db.delete(master_penilaian_generik).where(eq(master_penilaian_generik.id, parsed.data.id))
    return { success: true }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
