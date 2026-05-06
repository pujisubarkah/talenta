import { z } from 'zod'
import { db } from '../../../database/index'
import { masterPenilaianSpesifik } from '../../../database/schema/master_penilaian_spesifik'
import { eq } from 'drizzle-orm'

// GET: List all penilaian spesifik
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const data = await db.select().from(masterPenilaianSpesifik)
    return { data }
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    const schema = z.object({
      nama: z.string(),
      // drizzle pg numeric maps to string by default
      bobot: z.number().transform((n) => n.toString()),
    })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid input' }))
    }
    const [inserted] = await db.insert(masterPenilaianSpesifik).values({
      nama: parsed.data.nama,
      bobot: parsed.data.bobot,
    }).returning()
    return { data: inserted }
  }

  if (event.method === 'PATCH') {
    const body = await readBody(event)
    const schema = z.object({
      id: z.number(),
      nama: z.string(),
      bobot: z.number().transform((n) => n.toString()),
    })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid input' }))
    }
    const [updated] = await db.update(masterPenilaianSpesifik)
      .set({ nama: parsed.data.nama, bobot: parsed.data.bobot })
      .where(eq(masterPenilaianSpesifik.id, parsed.data.id))
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
    await db.delete(masterPenilaianSpesifik).where(eq(masterPenilaianSpesifik.id, parsed.data.id))
    return { success: true }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
