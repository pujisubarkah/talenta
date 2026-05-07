
import { db } from '../../../database';
import { master_rekam_criteria } from '../../../database/schema/master_rekam_jabatan';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    const data = await db.select().from(master_rekam_criteria);
    return data;
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(master_rekam_criteria).values({
      id: body.id,
      key: body.key,
      label: body.label,
      bobot: body.bobot,
      options: body.options,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return inserted[0];
  }

  if (method === 'PATCH') {
    const body = await readBody(event);
    const { id, ...updateData } = body;
    updateData.updated_at = new Date();
    const updated = await db.update(master_rekam_criteria)
      .set(updateData)
      .where(eq(master_rekam_criteria.id, id))
      .returning();
    return updated[0];
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    const { id } = body;
    await db.delete(master_rekam_criteria).where(eq(master_rekam_criteria.id, id));
    return { success: true };
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }));
});
